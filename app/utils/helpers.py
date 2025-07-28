import logging
from functools import wraps
from typing import Callable, Any
import time
import inspect
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
    """Validate if URL is a valid blob URL"""
    return url.startswith('https://') and 'blob.core.windows.net' in url

def sanitize_text(text: str) -> str:
    """Clean and sanitize text content"""
    # Remove extra whitespace and normalize
    text = ' '.join(text.split())
    # Remove null bytes and normalize line breaks
    text = text.replace('\x00', '').replace('\r', '\n')
    return text.strip()

def truncate_for_token_limit(text: str, max_chars: int = 8000) -> str:
    """Truncate text to stay within token limits"""
    if len(text) <= max_chars:
        return text

    # Try to truncate at sentence boundary
    truncated = text[:max_chars]
    last_period = truncated.rfind('.')
    if last_period > max_chars * 0.8:
        return truncated[:last_period + 1]
    
    return truncated + "..."
