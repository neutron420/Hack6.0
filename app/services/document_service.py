import os
import hashlib
from PyPDF2 import PdfReader
from docx import Document
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self, data_directory: str = None):
        # Set data directory - flexible configuration
        if data_directory:
            self.data_dir = data_directory
        else:
            # Try paths in order of preference - updated for your specific structure
            possible_data_dirs = [
                # Option 1: data folder in app directory (where files were found)
                os.path.join(os.path.dirname(__file__), "data"),
                # Option 2: Absolute path to app/data (based on your logs)
                r"C:\Users\R.K Singh\Desktop\Hack6.0\app\data",
                # Option 3: Absolute path to your known data location
                r"C:\Users\R.K Singh\Desktop\Hack6.0\data",
                # Option 4: Go up one level from app directory to project root
                os.path.join(os.path.dirname(__file__), "..", "data"),
                # Option 5: data folder relative to current working directory
                os.path.join("data"),
                # Option 6: data folder in app directory
                os.path.join("app", "data")
            ]
            
            self.data_dir = None
            for dir_path in possible_data_dirs:
                # Convert to absolute path for checking
                abs_path = os.path.abspath(dir_path)
                logger.info(f"Checking data directory: {abs_path}")
                
                if os.path.exists(abs_path):
                    self.data_dir = abs_path
                    logger.info(f"[OK] Using data directory: {self.data_dir}")
                    
                    # List files in found directory for verification
                    try:
                        files = os.listdir(self.data_dir)
                        pdf_files = [f for f in files if f.lower().endswith('.pdf')]
                        logger.info(f"Found {len(pdf_files)} PDF files: {pdf_files}")
                    except Exception as e:
                        logger.error(f"Error listing files: {e}")
                    break
                else:
                    logger.info(f"[X] Directory not found: {abs_path}")
            
            if not self.data_dir:
                # Create data directory in app folder as fallback
                self.data_dir = os.path.join(os.path.dirname(__file__), "data")
                logger.warning(f"No data directory found, creating: {self.data_dir}")
                os.makedirs(self.data_dir, exist_ok=True)
    
    async def download_document(self, blob_url: str) -> bytes:
        """Read document from local path based on 'blob URL' (mock for demo)"""
        try:
            # Extract filename from the URL
            filename = blob_url.split("/")[-1]
            local_path = os.path.join(self.data_dir, filename)
            
            logger.info(f"Looking for file: {filename}")
            logger.info(f"Full path: {local_path}")
            logger.info(f"File exists: {os.path.exists(local_path)}")
            
            if not os.path.exists(local_path):
                # List available files for debugging
                if os.path.exists(self.data_dir):
                    available_files = os.listdir(self.data_dir)
                    logger.error(f"Available files in {self.data_dir}:")
                    for file in available_files:
                        logger.error(f"  - {file}")
                    
                    # Check for case-sensitive filename issues
                    filename_lower = filename.lower()
                    for file in available_files:
                        if file.lower() == filename_lower:
                            logger.info(f"Found case-insensitive match: {file}")
                            local_path = os.path.join(self.data_dir, file)
                            break
                else:
                    logger.error(f"Data directory does not exist: {self.data_dir}")
                
                # Final check after case-insensitive search
                if not os.path.exists(local_path):
                    raise FileNotFoundError(f"File not found: {local_path}")
            
            with open(local_path, "rb") as f:
                logger.info(f"Successfully loaded file: {local_path}")
                return f.read()
        
        except Exception as e:
            logger.error(f"Failed to read document: {e}")
            raise
    
    def extract_text_from_pdf(self, content: bytes) -> str:
        """Extract text from PDF content"""
        try:
            reader = PdfReader(BytesIO(content))
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
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
        """Process document and return (text content, content hash)"""
        try:
            content_bytes = await self.download_document(blob_url)
            content_hash = self.get_content_hash(content_bytes)
            
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
        """Mock close method (no external client used)"""
        pass