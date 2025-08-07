# Use a slim, official Python image as a base
FROM python:3.9-slim

# Set environment variables for better Python performance in Docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code into the container
COPY ./app ./app
# --- ADD THIS LINE ---
# This makes the training script available for import by main.py
COPY train_embeddings.py .

# Create data directory for documents (already correct)
RUN mkdir -p /app/data

# Expose the port (already correct)
EXPOSE 8000

# The command to run your app (already correct)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]