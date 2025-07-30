# train_embeddings.py

import os
from app.services.document_service import load_pdf_text
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle

DATA_DIR = "./app/data"
INDEX_SAVE_PATH = "./data/faiss_index"
CHUNK_SIZE = 500
OVERLAP = 50

# Create output folder if needed
os.makedirs(os.path.dirname(INDEX_SAVE_PATH), exist_ok=True)

# Load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Utility: chunking
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    words = text.split()
    if not words:
        return []
    return [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size - overlap)]

# Gather all PDF files
pdf_files = [f for f in os.listdir(DATA_DIR) if f.endswith(".pdf")]
if not pdf_files:
    print("❌ No PDF files found in app/data/")
    exit()

print(f"📄 Found {len(pdf_files)} documents")

all_chunks = []
meta = []

for file_name in pdf_files:
    file_path = os.path.join(DATA_DIR, file_name)
    print(f"🔍 Processing: {file_name}")
    text = load_pdf_text(file_path)
    chunks = chunk_text(text, CHUNK_SIZE, OVERLAP)

    all_chunks.extend(chunks)
    meta.extend([{"source": file_name, "chunk": i} for i in range(len(chunks))])

print(f"✂️ Created {len(all_chunks)} text chunks")

# Compute embeddings
print("🧠 Generating embeddings...")
embeddings = model.encode(all_chunks, show_progress_bar=True, convert_to_numpy=True)

# Build FAISS index
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

# Save FAISS index and metadata
faiss.write_index(index, INDEX_SAVE_PATH + ".bin")
with open(INDEX_SAVE_PATH + "_meta.pkl", "wb") as f:
    pickle.dump({"chunks": all_chunks, "meta": meta}, f)

print("✅ Training complete. Embeddings stored.")
