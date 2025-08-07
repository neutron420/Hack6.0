# app/main.py

import os
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
import logging
from typing import List
# --- MODIFICATION START: Import necessary libraries ---
from contextlib import asynccontextmanager
from train_embeddings import chunk_text # Import chunking logic
# --- MODIFICATION END ---

from app.models.database import get_db, Document, QASession
from app.models.schemas import QueryRequest, QueryResponse
from app.services.document_service import DocumentService
from app.services.embedding_service import EmbeddingService
from app.services.clause_matcher import ClauseMatcher
from app.services.qa_service import QAService
from app.services.db_service import DatabaseService
from app.config import settings
from app.utils.helpers import setup_logging, timer, sanitize_text

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize services (These remain the same)
document_service = DocumentService()
embedding_service = EmbeddingService()
clause_matcher = ClauseMatcher(embedding_service)
qa_service = QAService(clause_matcher)


# --- MODIFICATION START: Add a lifespan manager to load data on startup ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    This function runs once when the application starts. It finds all PDF documents,
    processes them, and builds the FAISS vector index (the AI's knowledge base).
    This ensures the data is ready before any questions are received.
    """
    logger.info("Application starting up... Initializing the knowledge base.")
    
    # Define the path to your data directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    
    pdf_files = [f for f in os.listdir(data_dir) if f.endswith(".pdf")]
    
    if not pdf_files:
        logger.warning("No PDF files found in app/data/. The Q&A service will have no knowledge.")
    else:
        logger.info(f"Found {len(pdf_files)} documents to process.")
        all_chunks = []
        # Process each PDF file
        for filename in pdf_files:
            file_path = os.path.join(data_dir, filename)
            try:
                text, _ = await document_service.process_document_from_local_path(file_path)
                if text:
                    chunks = chunk_text(sanitize_text(text), chunk_size=500, overlap=50)
                    all_chunks.extend(chunks)
                    logger.info(f"Processed {filename}, created {len(chunks)} chunks.")
            except Exception as e:
                logger.error(f"Failed to process {filename}: {e}")

        # Build the index ONCE with all chunks
        if all_chunks:
            logger.info(f"Building FAISS index with {len(all_chunks)} total chunks...")
            embedding_service.build_index(all_chunks)
            logger.info("FAISS index built successfully. Application is ready to receive queries.")
        else:
            logger.warning("No text chunks were generated. The index remains empty.")
    
    yield
    # Code below this 'yield' runs on shutdown
    logger.info("Shutting down LLM-Powered Query-Retrieval System")
    await document_service.close()
# --- MODIFICATION END ---


# Initialize FastAPI app with the new lifespan manager
app = FastAPI(
    title="LLM-Powered Query-Retrieval System",
    description="Intelligent document Q&A system for insurance, legal, HR, and compliance domains",
    version="1.0.0",
    lifespan=lifespan # <-- This tells FastAPI to run the startup logic
)

# ... (Your CORS middleware and security functions remain unchanged) ...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api_key_header = APIKeyHeader(name="Authorization", auto_error=True)
def verify_token(authorization: str = Security(api_key_header)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    if token != settings.API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid API token")
    return token

@app.get("/")
async def root():
    return {"message": "LLM-Powered Query-Retrieval System is running"}


# --- MODIFICATION START: Simplify the main endpoint ---
@app.post("/hackrx/run", response_model=QueryResponse)
@timer
async def run_query_retrieval(
    request: QueryRequest,
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    """
    This endpoint now only handles answering questions. It uses the knowledge
    base that was built during startup, making it much faster.
    """
    try:
        filename = request.documents
        logger.info(f"Processing request for file: {filename} with {len(request.questions)} questions")

        if not embedding_service.index or not embedding_service.texts:
            raise HTTPException(
                status_code=503, 
                detail="Knowledge base is not initialized. Check server startup logs."
            )

        # We still need to read the specific document's content for the LLM's context
        base_dir = os.path.dirname(os.path.abspath(__file__))
        local_file_path = os.path.join(base_dir, "data", filename)
        
        document_content, content_hash = await document_service.process_document_from_local_path(local_file_path)
        
        logger.info("Step 1: Answering questions using the pre-built index...")
        answers = await qa_service.answer_questions(request.questions, document_content)

        logger.info("Step 2: Storing Q&A session")
        db_service = DatabaseService(db)
        document_record = db_service.get_or_create_document(
            blob_url=local_file_path,
            content_hash=content_hash,
            content=sanitize_text(document_content)
        )
        qa_session = db_service.create_qa_session(
            document_id=document_record.id,
            questions=request.questions,
            answers=answers
        )

        logger.info(f"Successfully processed {len(answers)} answers")
        return QueryResponse(answers=answers)

    except FileNotFoundError:
        logger.error(f"The requested document was not found: {filename}")
        raise HTTPException(status_code=404, detail=f"File not found: {filename}.")
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
# --- MODIFICATION END ---


# ... (The rest of your file: /health, /stats, and startup/shutdown events can be removed or simplified) ...
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "embedding_model": settings.EMBEDDING_MODEL,
        "database_connected": True
    }

@app.get("/stats")
async def get_stats(db: Session = Depends(get_db), token: str = Depends(verify_token)):
    try:
        document_count = db.query(Document).count()
        qa_session_count = db.query(QASession).count()
        return {
            "total_documents": document_count,
            "total_qa_sessions": qa_session_count,
            "embedding_index_size": len(embedding_service.texts) if embedding_service.texts else 0
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get system stats")

# The old @app.on_event("startup") and @app.on_event("shutdown") are now replaced by the lifespan manager

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )