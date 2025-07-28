import openai
from typing import List
import logging
from app.config import settings
from app.services.clause_matcher import ClauseMatcher
from app.models.schemas import ClauseMatch

logger = logging.getLogger(__name__)

class QAService:
    def __init__(self, clause_matcher: ClauseMatcher):
        self.clause_matcher = clause_matcher
        openai.api_key = settings.OPENAI_API_KEY
        self.client = openai.OpenAI()
    
    async def answer_questions(self, questions: List[str], document_content: str) -> List[str]:
        """Answer multiple questions based on document content"""
        answers = []
        
        for question in questions:
            try:
                answer = await self._answer_single_question(question, document_content)
                answers.append(answer)
            except Exception as e:
                logger.error(f"Failed to answer question '{question}': {e}")
                answers.append(f"Unable to answer: {str(e)}")
        
        return answers
    
    async def _answer_single_question(self, question: str, document_content: str) -> str:
        """Answer a single question using retrieved clauses and LLM"""
        try:
            # Extract relevant clauses
            relevant_clauses = self.clause_matcher.extract_relevant_clauses(document_content, question)
            
            # Rank clauses by relevance
            ranked_clauses = self.clause_matcher.rank_clauses_by_relevance(relevant_clauses, question)
            
            # Select top clauses for context
            top_clauses = ranked_clauses[:5]  # Use top 5 clauses
            
            # Construct context from clauses
            context = self._build_context(top_clauses)
            
            # Generate answer using LLM
            answer = await self._generate_answer(question, context)
            
            return answer
            
        except Exception as e:
            logger.error(f"Failed to answer question: {e}")
            raise
    
    def _build_context(self, clauses: List[ClauseMatch]) -> str:
        """Build context string from relevant clauses"""
        if not clauses:
            return "No relevant information found."
        
        context_parts = []
        for i, clause in enumerate(clauses, 1):
            context_parts.append(f"Relevant Information {i} (from {clause.source_section}):\n{clause.content}")
        
        return "\n\n".join(context_parts)
    
    async def _generate_answer(self, question: str, context: str) -> str:
        """Generate answer using OpenAI GPT-4"""
        try:
            prompt = self._create_prompt(question, context)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert document analyzer specializing in insurance, legal, and compliance documents. 
                        
                        Your task is to answer questions based ONLY on the provided context from the document. 
                        
                        Guidelines:
                        1. Answer only based on the provided context
                        2. Be precise and specific
                        3. Include relevant details like time periods, amounts, conditions
                        4. If the context doesn't contain enough information, say so
                        5. Do not make assumptions or add information not in the context
                        6. Provide clear, direct answers without unnecessary elaboration"""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=settings.MAX_TOKENS,
                temperature=settings.TEMPERATURE
            )
            
            answer = response.choices[0].message.content.strip()
            return answer
            
        except Exception as e:
            logger.error(f"Failed to generate answer with LLM: {e}")
            raise
    
    def _create_prompt(self, question: str, context: str) -> str:
        """Create prompt for LLM"""
        prompt = f"""Question: {question}

Context from document:
{context}

Please answer the question based only on the provided context. Be specific and include all relevant details such as time periods, conditions, limits, and requirements mentioned in the context.

Answer:"""
        
        return prompt
    
    def _extract_key_information(self, question: str) -> dict:
        """Extract key information from question for better retrieval"""
        # Simple keyword extraction - can be enhanced
        keywords = {
            'coverage_terms': ['cover', 'covered', 'coverage', 'benefit', 'included'],
            'time_terms': ['period', 'waiting', 'grace', 'time', 'duration'],
            'condition_terms': ['condition', 'requirement', 'eligibility', 'terms'],
            'exclusion_terms': ['exclude', 'excluded', 'not covered', 'limitation'],
            'amount_terms': ['limit', 'amount', 'maximum', 'minimum', 'cost', 'premium']
        }
        
        question_lower = question.lower()
        extracted = {}
        
        for category, terms in keywords.items():
            for term in terms:
                if term in question_lower:
                    if category not in extracted:
                        extracted[category] = []
                    extracted[category].append(term)
        
        return extracted