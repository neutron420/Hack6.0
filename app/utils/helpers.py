import logging
from functools import wraps
from typing import Callable, Any
import time
import asyncio

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('app.log')
        ]
    )

def timer(func: Callable) -> Callable:
    """Decorator to measure execution time for both sync and async functions"""
    if asyncio.iscoroutinefunction(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            result = await func(*args, **kwargs)
            end_time = time.time()
            logging.info(f"{func.__name__} took {end_time - start_time:.2f} seconds")
            return result
        return async_wrapper
    else:
        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            result = func(*args, **kwargs)
            end_time = time.time()
            logging.info(f"{func.__name__} took {end_time - start_time:.2f} seconds")
            return result
        return sync_wrapper

def validate_blob_url(url: str) -> bool:
    """Validate blob or test document URL"""
    return (
        url.startswith("https://") or
        url.startswith("http://") or
        url.startswith("file://") or
        "mock.blob.local" in url or
        url.endswith(".pdf") or
        url.endswith(".docx")
    )

def sanitize_text(text: str) -> str:
    """Clean and sanitize text content"""
    text = ' '.join(text.split())  # normalize whitespace
    text = text.replace('\x00', '')  # remove null bytes
    text = text.replace('\r', '\n')  # normalize line breaks
    return text.strip()

def truncate_for_token_limit(text: str, max_chars: int = 8000) -> str:
    """Truncate text to stay within token limits"""
    if len(text) <= max_chars:
        return text

    truncated = text[:max_chars]
    last_period = truncated.rfind('.')
    if last_period > max_chars * 0.8:
        return truncated[:last_period + 1]

    return truncated + "..."
