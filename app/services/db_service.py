from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from app.models.database import Document, QASession

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_document_by_hash(self, content_hash: str) -> Optional[Document]:
        """Get document by content hash"""
        try:
            return self.db.query(Document).filter(Document.content_hash == content_hash).first()
        except Exception as e:
            logger.error(f"Failed to get document by hash: {e}")
            return None
    
    def create_document(self, blob_url: str, content_hash: str, content: str) -> Document:
        """Create new document record"""
        try:
            document = Document(
                blob_url=blob_url,
                content_hash=content_hash,
                content=content
            )
            self.db.add(document)
            self.db.commit()
            self.db.refresh(document)
            return document
        except Exception as e:
            logger.error(f"Failed to create document: {e}")
            self.db.rollback()
            raise
    
    def get_or_create_document(self, blob_url: str, content_hash: str, content: str) -> Document:
        """Get existing document or create new one"""
        try:
            # Check if document already exists
            existing_doc = self.get_document_by_hash(content_hash)
            if existing_doc:
                logger.info(f"Using cached document with hash: {content_hash}")
                return existing_doc
            
            # Create new document
            logger.info(f"Creating new document with hash: {content_hash}")
            return self.create_document(blob_url, content_hash, content)
            
        except Exception as e:
            logger.error(f"Failed to get or create document: {e}")
            raise
    
    def create_qa_session(self, document_id: int, questions: List[str], answers: List[str]) -> QASession:
        """Create new Q&A session record"""
        try:
            qa_session = QASession(
                document_id=document_id,
                questions=questions,
                answers=answers
            )
            self.db.add(qa_session)
            self.db.commit()
            self.db.refresh(qa_session)
            return qa_session
        except Exception as e:
            logger.error(f"Failed to create Q&A session: {e}")
            self.db.rollback()
            raise
    
    def get_recent_qa_sessions(self, document_id: int, limit: int = 10) -> List[QASession]:
        """Get recent Q&A sessions for a document"""
        try:
            return (self.db.query(QASession)
                   .filter(QASession.document_id == document_id)
                   .order_by(QASession.created_at.desc())
                   .limit(limit)
                   .all())
        except Exception as e:
            logger.error(f"Failed to get recent Q&A sessions: {e}")
            return []
    
    def get_document_by_id(self, document_id: int) -> Optional[Document]:
        """Get document by ID"""
        try:
            return self.db.query(Document).filter(Document.id == document_id).first()
        except Exception as e:
            logger.error(f"Failed to get document by ID: {e}")
            return None