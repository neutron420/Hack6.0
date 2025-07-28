from pydantic import BaseModel
from typing import List

class QueryRequest(BaseModel):
    documents: str  # Blob URL
    questions: List[str]

class QueryResponse(BaseModel):
    answers: List[str]

class DocumentMetadata(BaseModel):
    id: int
    blob_url: str
    content_hash: str
    processed_at: str

class ClauseMatch(BaseModel):
    content: str
    similarity_score: float
    source_section: str