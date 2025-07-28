import httpx
import hashlib
from PyPDF2 import PdfReader
from docx import Document
from io import BytesIO
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def download_document(self, blob_url: str) -> bytes:
        """Download document from blob URL"""
        try:
            response = await self.client.get(blob_url)
            response.raise_for_status()
            return response.content
        except Exception as e:
            logger.error(f"Failed to download document: {e}")
            raise
    
    def extract_text_from_pdf(self, content: bytes) -> str:
        """Extract text from PDF content"""
        try:
            reader = PdfReader(BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Failed to extract PDF text: {e}")
            raise
    
    def extract_text_from_docx(self, content: bytes) -> str:
        """Extract text from DOCX content"""
        try:
            doc = Document(BytesIO(content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Failed to extract DOCX text: {e}")
            raise
    
    def get_content_hash(self, content: bytes) -> str:
        """Generate hash for content"""
        return hashlib.sha256(content).hexdigest()
    
    async def process_document(self, blob_url: str) -> tuple[str, str]:
        """Process document and return (content, hash)"""
        try:
            # Download document
            content_bytes = await self.download_document(blob_url)
            content_hash = self.get_content_hash(content_bytes)
            
            # Determine file type and extract text
            if blob_url.lower().endswith('.pdf'):
                text = self.extract_text_from_pdf(content_bytes)
            elif blob_url.lower().endswith(('.docx', '.doc')):
                text = self.extract_text_from_docx(content_bytes)
            else:
                raise ValueError(f"Unsupported file type: {blob_url}")
            
            return text, content_hash
            
        except Exception as e:
            logger.error(f"Failed to process document: {e}")
            raise
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
            
        return chunks
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()