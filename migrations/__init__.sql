-- Database initialization script for HackRx Q&A System

-- Create database (run as postgres user)
-- CREATE DATABASE hackrx_db;
-- CREATE USER hackrx_user WITH PASSWORD 'hackrx_password';
-- GRANT ALL PRIVILEGES ON DATABASE hackrx_db TO hackrx_user;

-- Connect to hackrx_db and run the following:

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    blob_url TEXT NOT NULL,
    content_hash VARCHAR(64) UNIQUE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content TEXT,
    CONSTRAINT unique_content_hash UNIQUE (content_hash)
);

-- Create index on content_hash for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_hash ON documents(content_hash);
CREATE INDEX IF NOT EXISTS idx_documents_url ON documents(blob_url);

-- Q&A Sessions table
CREATE TABLE IF NOT EXISTS qa_sessions (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL,
    questions JSONB,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_qa_sessions_document ON qa_sessions(document_id);
CREATE INDEX IF NOT EXISTS idx_qa_sessions_created ON qa_sessions(created_at);

-- Optional: Create a view for easy querying
CREATE OR REPLACE VIEW qa_with_documents AS
SELECT 
    qa.id as session_id,
    qa.questions,
    qa.answers,
    qa.created_at,
    d.blob_url,
    d.content_hash,
    d.processed_at
FROM qa_sessions qa
JOIN documents d ON qa.document_id = d.id;

-- Grant permissions to hackrx_user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hackrx_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hackrx_user;