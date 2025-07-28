from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging
from typing import List

from app.models.database import get_db
from app.models.schemas import QueryRequest, QueryResponse
from app.services.document_service import DocumentService
from app.services.embedding_service import EmbeddingService
from app.services.clause_matcher import ClauseMatcher
from app.services.qa_service import QAService
from app.services.db_service import DatabaseService
from app.config import settings
from app.utils.helpers import setup_logging, timer, validate_blob_url, sanitize_text

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="LLM-Powered Query-Retrieval System",
    description="Intelligent document Q&A system for insurance, legal, HR, and compliance domains",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
document_service = DocumentService()
embedding_service = EmbeddingService()
clause_matcher = ClauseMatcher(embedding_service)
qa_service = QAService(clause_matcher)

def verify_token(authorization: str = Header(...)):
    """Verify API token"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split(" ")[1]
    if token != settings.API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid API token")
    
    return token

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "LLM-Powered Query-Retrieval System is running"}

@app.post("/hackrx/run", response_model=QueryResponse)
@timer
async def run_query_retrieval(
    request: QueryRequest,
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    """
    Main endpoint for document Q&A processing
    
    Process documents from blob URL and answer questions using LLM-powered retrieval
    """
    try:
        logger.info(f"Processing request with {len(request.questions)} questions")
        
        # Validate input
        if not validate_blob_url(request.documents):
            raise HTTPException(status_code=400, detail="Invalid blob URL")
        
        if not request.questions:
            raise HTTPException(status_code=400, detail="No questions provided")
        
        # Initialize database service
        db_service = DatabaseService(db)
        
        # Step 1: Process document
        logger.info("Step 1: Processing document from blob URL")
        document_content, content_hash = await document_service.process_document(request.documents)
        document_content = sanitize_text(document_content)
        
        # Step 2: Get or create document record
        logger.info("Step 2: Checking document cache")
        document_record = db_service.get_or_create_document(
            blob_url=request.documents,
            content_hash=content_hash,
            content=document_content
        )
        
        # Step 3: Build embeddings if needed
        logger.info("Step 3: Building document embeddings")
        if not embedding_service.texts or embedding_service.texts == []:
            # Chunk document for better retrieval
            chunks = document_service.chunk_text(document_content)
            embedding_service.build_index(chunks)
        
        # Step 4: Answer questions using Q&A service
        logger.info("Step 4: Processing questions with LLM")
        answers = await qa_service.answer_questions(request.questions, document_content)
        
        # Step 5: Store Q&A session
        logger.info("Step 5: Storing Q&A session")
        qa_session = db_service.create_qa_session(
            document_id=document_record.id,
            questions=request.questions,
            answers=answers
        )
        
        logger.info(f"Successfully processed {len(answers)} answers")
        
        return QueryResponse(answers=answers)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "embedding_model": settings.EMBEDDING_MODEL,
        "database_connected": True
    }

@app.get("/stats")
async def get_stats(db: Session = Depends(get_db), token: str = Depends(verify_token)):
    """Get system statistics"""
    try:
        db_service = DatabaseService(db)
        
        # Get document count
        document_count = db.query(db_service.db.query(Document).count()).scalar()
        
        # Get Q&A session count
        qa_session_count = db.query(db_service.db.query(QASession).count()).scalar()
        
        return {
            "total_documents": document_count,
            "total_qa_sessions": qa_session_count,
            "embedding_index_size": len(embedding_service.texts) if embedding_service.texts else 0
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get system stats")

@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info("Starting LLM-Powered Query-Retrieval System")
    logger.info(f"Using embedding model: {settings.EMBEDDING_MODEL}")
    logger.info(f"FAISS index path: {settings.FAISS_INDEX_PATH}")

@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info("Shutting down LLM-Powered Query-Retrieval System")
    await document_service.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )