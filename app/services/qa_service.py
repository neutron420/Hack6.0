import google.generativeai as genai
from typing import List
import logging
from app.config import settings
from app.services.clause_matcher import ClauseMatcher
from app.models.schemas import ClauseMatch

logger = logging.getLogger(__name__)

class QAService:
    def __init__(self, clause_matcher: ClauseMatcher):
        self.clause_matcher = clause_matcher
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not found in settings.")
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def answer_questions(self, questions: List[str], document_content: str) -> List[str]:
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
        try:
            relevant_clauses = self.clause_matcher.extract_relevant_clauses(document_content, question)
            ranked_clauses = self.clause_matcher.rank_clauses_by_relevance(relevant_clauses, question)
            top_clauses = [c for c in ranked_clauses if c.similarity_score >= 0.6][:5]
            context = self._build_context(top_clauses)

            logger.info(f"Question: {question}")
            logger.info(f"Context sent to Gemini:\n{context}")

            answer = await self._generate_answer(question, context)
            return answer
        except Exception as e:
            logger.error(f"Failed to answer question: {e}")
            raise

    def _build_context(self, clauses: List[ClauseMatch]) -> str:
        if not clauses:
            return "No relevant information found."

        return "\n".join(
            [f"Clause {i}:\nSection: {clause.source_section}\nText: {clause.content}" for i, clause in enumerate(clauses, 1)]
        )

    async def _generate_answer(self, question: str, context: str) -> str:
        try:
            prompt = self._create_prompt(question, context)
            response = await self.model.generate_content_async(prompt)
            answer = response.text.strip()
            return answer
        except Exception as e:
            logger.error(f"Failed to generate answer with Gemini: {e}")
            return f"The Gemini API could not process this request. Reason: {e}"

    def _create_prompt(self, question: str, context: str) -> str:
        return f"""You are an expert document analyzer specializing in insurance, legal, and compliance documents.
Your task is to answer questions based ONLY on the provided context from the document.

Guidelines:
1. Answer only based on the provided context.
2. Be precise and specific.
3. Include relevant details like time periods, amounts, and conditions.
4. If the context doesn't contain enough information, say so clearly.
5. Do not make assumptions or add information not in the context.
6. Provide clear, direct answers without unnecessary elaboration.

---
CONTEXT FROM DOCUMENT:
{context}

---
QUESTION:
{question}

---
ANSWER:"""

    def _extract_key_information(self, question: str) -> dict:
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