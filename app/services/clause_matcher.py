from typing import List, Tuple
import re
import logging
from app.services.embedding_service import EmbeddingService
from app.models.schemas import ClauseMatch

logger = logging.getLogger(__name__)

class ClauseMatcher:
    def __init__(self, embedding_service: EmbeddingService):
        self.embedding_service = embedding_service
        self.clause_patterns = [
            r'(?i)(coverage|covered|covers|benefit|benefits)',
            r'(?i)(waiting period|wait time|period)',
            r'(?i)(condition|conditions|terms|requirements)',
            r'(?i)(exclusion|excluded|not covered)',
            r'(?i)(limit|limits|maximum|minimum)',
            r'(?i)(premium|payment|cost)',
            r'(?i)(claim|claims|reimbursement)',
            r'(?i)(policy|policies|plan)'
        ]
    
    def extract_relevant_clauses(self, text: str, query: str) -> List[ClauseMatch]:
        """Extract clauses relevant to the query using semantic search"""
        try:
            # Split text into sentences/clauses
            sentences = self._split_into_sentences(text)
            
            # Filter sentences that might contain relevant clauses
            relevant_sentences = self._filter_by_patterns(sentences)
            
            # Use embedding search to find most relevant clauses
            search_results = self.embedding_service.search(query, k=10)
            
            # Convert to ClauseMatch objects
            clause_matches = []
            for content, score in search_results:
                if score > 0.3:  # Threshold for relevance
                    clause_match = ClauseMatch(
                        content=content,
                        similarity_score=score,
                        source_section=self._identify_section(content, text)
                    )
                    clause_matches.append(clause_match)
            
            return clause_matches
            
        except Exception as e:
            logger.error(f"Failed to extract clauses: {e}")
            return []
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting - can be improved with nltk
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        return sentences
    
    def _filter_by_patterns(self, sentences: List[str]) -> List[str]:
        """Filter sentences that match clause patterns"""
        relevant_sentences = []
        
        for sentence in sentences:
            for pattern in self.clause_patterns:
                if re.search(pattern, sentence):
                    relevant_sentences.append(sentence)
                    break
        
        return relevant_sentences
    
    def _identify_section(self, clause: str, full_text: str) -> str:
        """Identify which section of the document the clause comes from"""
        try:
            # Find the position of the clause in the full text
            position = full_text.find(clause)
            if position == -1:
                return "Unknown Section"
            
            # Look for section headers before this position
            text_before = full_text[:position]
            
            # Common section header patterns
            section_patterns = [
                r'(?i)section\s+\d+[.:]\s*([^\n]+)',
                r'(?i)article\s+\d+[.:]\s*([^\n]+)',
                r'(?i)chapter\s+\d+[.:]\s*([^\n]+)',
                r'(?i)([A-Z][A-Z\s]+):',
                r'(?i)(\d+\.\s*[A-Z][^.]+):',
            ]
            
            # Find the last section header before the clause
            last_section = "Document"
            for pattern in section_patterns:
                matches = list(re.finditer(pattern, text_before))
                if matches:
                    last_match = matches[-1]
                    last_section = last_match.group(1).strip()
            
            return last_section
            
        except Exception as e:
            logger.error(f"Failed to identify section: {e}")
            return "Unknown Section"
    
    def rank_clauses_by_relevance(self, clauses: List[ClauseMatch], query: str) -> List[ClauseMatch]:
        """Rank clauses by relevance to query"""
        try:
            # Additional ranking based on keyword matching
            query_keywords = set(query.lower().split())
            
            for clause in clauses:
                clause_keywords = set(clause.content.lower().split())
                keyword_overlap = len(query_keywords.intersection(clause_keywords))
                
                # Combine semantic similarity with keyword overlap
                clause.similarity_score = (clause.similarity_score * 0.7) + (keyword_overlap * 0.1)
            
            # Sort by score
            clauses.sort(key=lambda x: x.similarity_score, reverse=True)
            
            return clauses
            
        except Exception as e:
            logger.error(f"Failed to rank clauses: {e}")
            return clauses