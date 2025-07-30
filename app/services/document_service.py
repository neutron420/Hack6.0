import os
import hashlib
from PyPDF2 import PdfReader
from docx import Document
from io import BytesIO
import logging
import aiohttp  # For blob URL support

logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self):
        self.session = aiohttp.ClientSession()

    async def close(self):
        if not self.session.closed:
            await self.session.close()

    def _extract_text_from_pdf(self, content: bytes) -> str:
        try:
            reader = PdfReader(BytesIO(content))
            text = "".join(page.extract_text() for page in reader.pages if page.extract_text())
            return text.strip()
        except Exception as e:
            logger.error(f"Failed to extract PDF text: {e}")
            raise

    def _extract_text_from_docx(self, content: bytes) -> str:
        try:
            doc = Document(BytesIO(content))
            text = "\n".join(para.text for para in doc.paragraphs)
            return text.strip()
        except Exception as e:
            logger.error(f"Failed to extract DOCX text: {e}")
            raise

    def get_content_hash(self, content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()

    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
        words = text.split()
        if not words:
            return []
        chunks = [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size - overlap)]
        return chunks

    async def process_document_from_local_path(self, file_path: str) -> tuple[str, str]:
        logger.info(f"Processing local file: {file_path}")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found at specified path: {file_path}")

        try:
            with open(file_path, "rb") as f:
                content_bytes = f.read()

            content_hash = self.get_content_hash(content_bytes)

            if file_path.lower().endswith('.pdf'):
                text = self._extract_text_from_pdf(content_bytes)
            elif file_path.lower().endswith(('.docx', '.doc')):
                text = self._extract_text_from_docx(content_bytes)
            else:
                raise ValueError(f"Unsupported file type: {file_path}")

            return text, content_hash
        except Exception as e:
            logger.error(f"Failed to process local document: {e}")
            raise

    async def process_document(self, blob_url: str) -> tuple[str, str]:
        logger.info(f"Processing document from URL: {blob_url}")
        try:
            async with self.session.get(blob_url) as response:
                response.raise_for_status()
                content_bytes = await response.read()

            content_hash = self.get_content_hash(content_bytes)

            if blob_url.lower().endswith('.pdf'):
                text = self._extract_text_from_pdf(content_bytes)
            elif blob_url.lower().endswith(('.docx', '.doc')):
                text = self._extract_text_from_docx(content_bytes)
            else:
                raise ValueError(f"Unsupported file type: {blob_url}")

            return text, content_hash
        except Exception as e:
            logger.error(f"Failed to process document from URL: {e}")
            raise

def load_pdf_text(file_path: str) -> str:
    """Simple sync wrapper to extract PDF text for training."""
    from PyPDF2 import PdfReader
    from io import BytesIO

    try:
        with open(file_path, "rb") as f:
            content = f.read()

        if file_path.lower().endswith(".pdf"):
            reader = PdfReader(BytesIO(content))
            text = "".join(page.extract_text() for page in reader.pages if page.extract_text())
            return text.strip()
        else:
            raise ValueError("Only PDF supported in load_pdf_text()")
    except Exception as e:
        print(f"❌ Failed to extract PDF: {e}")
        return ""
