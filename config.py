import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Configuration
    API_TOKEN = os.getenv("API_TOKEN")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Database Configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost:5432/hackrx_db")
    
    # Vector Store Configuration
    FAISS_INDEX_PATH = os.getenv("FAISS_INDEX_PATH", "./data/faiss_index")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    
    # Application Settings
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # LLM Settings
    MAX_TOKENS = 1000
    TEMPERATURE = 0.1

settings = Settings()