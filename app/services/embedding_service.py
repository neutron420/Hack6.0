import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle
import os
from typing import List, Tuple
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.index = None
        self.texts = []
        self.dimension = 384  # dimension for all-MiniLM-L6-v2
        
        # Ensure data directory exists
        os.makedirs(os.path.dirname(settings.FAISS_INDEX_PATH), exist_ok=True)
        
        # Load existing index if available
        self.load_index()
    
    def create_embeddings(self, texts: List[str]) -> np.ndarray:
        """Create embeddings for a list of texts"""
        try:
            embeddings = self.model.encode(texts, convert_to_numpy=True)
            return embeddings.astype('float32')
        except Exception as e:
            logger.error(f"Failed to create embeddings: {e}")
            raise
    
    def build_index(self, texts: List[str]) -> None:
        """Build FAISS index from texts"""
        try:
            # Create embeddings
            embeddings = self.create_embeddings(texts)
            
            # Initialize FAISS index
            self.index = faiss.IndexFlatIP(self.dimension)  # Inner product for cosine similarity
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings)
            
            # Add embeddings to index
            self.index.add(embeddings)
            
            # Store texts for retrieval
            self.texts = texts
            
            # Save index
            self.save_index()
            
            logger.info(f"Built FAISS index with {len(texts)} documents")
            
        except Exception as e:
            logger.error(f"Failed to build index: {e}")
            raise
    
    def search(self, query: str, k: int = 5) -> List[Tuple[str, float]]:
        """Search for similar texts"""
        try:
            if self.index is None or len(self.texts) == 0:
                return []
            
            # Create query embedding
            query_embedding = self.create_embeddings([query])
            faiss.normalize_L2(query_embedding)
            
            # Search
            scores, indices = self.index.search(query_embedding, min(k, len(self.texts)))
            
            # Return results
            results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx >= 0:  # Valid index
                    results.append((self.texts[idx], float(score)))
            
            return results
            
        except Exception as e:
            logger.error(f"Failed to search: {e}")
            raise
    
    def save_index(self) -> None:
        """Save FAISS index and texts to disk"""
        try:
            if self.index is None:
                return
                
            # Save FAISS index
            faiss.write_index(self.index, f"{settings.FAISS_INDEX_PATH}.index")
            
            # Save texts
            with open(f"{settings.FAISS_INDEX_PATH}.texts", 'wb') as f:
                pickle.dump(self.texts, f)
                
            logger.info("Saved FAISS index to disk")
            
        except Exception as e:
            logger.error(f"Failed to save index: {e}")
    
    def load_index(self) -> None:
        """Load FAISS index and texts from disk"""
        try:
            index_path = f"{settings.FAISS_INDEX_PATH}.index"
            texts_path = f"{settings.FAISS_INDEX_PATH}.texts"
            
            if os.path.exists(index_path) and os.path.exists(texts_path):
                # Load FAISS index
                self.index = faiss.read_index(index_path)
                
                # Load texts
                with open(texts_path, 'rb') as f:
                    self.texts = pickle.load(f)
                
                logger.info(f"Loaded FAISS index with {len(self.texts)} documents")
            else:
                logger.info("No existing FAISS index found")
                
        except Exception as e:
            logger.error(f"Failed to load index: {e}")
            # Initialize empty index on failure
            self.index = None
            self.texts = []