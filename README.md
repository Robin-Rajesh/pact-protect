# 🛡️ Pact Protect: AI Contract Derisking System

A full-stack application that reads legal contracts, splits them into clauses, and uses LLMs to flag risky terms, check them against configurable policies, and suggest safer wording.

![React](https://img.shields.io/badge/React-TypeScript-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C)
![Qdrant](https://img.shields.io/badge/Qdrant-DC244C)
![Tesseract](https://img.shields.io/badge/Tesseract_OCR-5A5A5A)

## ✨ Features

- **Document upload and parsing**: PDF, TXT and image files, single or batch. Scanned PDFs and images go through Tesseract OCR automatically when little text can be extracted.
- **Clause-level risk analysis**: each clause is classified by an LLM and rated High / Medium / Low risk.
- **Policy engine**: evaluate contracts against a default policy covering Financial, Legal, Operational, Privacy, Security and IP domains, or define your own policies and risk weights.
- **RAG context**: clauses are embedded with `all-MiniLM-L6-v2` and stored in Qdrant, so similar clauses can be retrieved as context during analysis.
- **AI recommendations**: get alternative wording for high-risk clauses.
- **Executive summaries** and a **chat assistant** that answers questions about a specific contract.
- **Contract comparison**: compare two analyzed contracts side by side and see which one is safer.
- **Switchable LLM providers**: Groq or a local Ollama model, configured from the settings page.

## 🏗️ Architecture

```
React + Vite + shadcn/ui  ──HTTP──▶  FastAPI backend
                                      ├── parser.py        (pypdf, Poppler, Tesseract OCR)
                                      ├── policy.py        (policy rules and compliance)
                                      ├── rag.py           (Qdrant + sentence-transformers)
                                      ├── llm_providers.py (Groq / Ollama via LangChain)
                                      └── store.py         (local JSON store)
```

See [`architecture.md`](architecture.md) for the full process flow of each feature.

## 🔌 API Overview

| Endpoint | Purpose |
|---|---|
| `POST /upload`, `POST /upload/batch` | Upload and parse contracts |
| `POST /analyze` | Run clause risk analysis against a policy |
| `POST /recommend` | Suggest safer wording for a clause |
| `POST /summary/{analysis_id}` | Generate an executive summary |
| `POST /chat` | Ask questions about a contract |
| `POST /compare` | Compare two analyzed contracts |
| `GET/POST /policy`, `GET /policies` | Manage policies |
| `GET/POST /settings`, `GET /settings/test` | Configure and test LLM providers |
| `GET /rag/status` | Check the vector store |

## 🚀 Getting Started

**Prerequisites:** Node.js 18+, Python 3.9+, Tesseract OCR and Poppler (see [`TESSERACT_SETUP.md`](TESSERACT_SETUP.md)). Qdrant is optional and only needed for RAG.

**Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export GROQ_API_KEY=your_key     # or configure Ollama in the app settings
uvicorn app.main:app --reload --port 8000
```

Optional environment variables: `QDRANT_URL` (default `http://localhost:6333`), `QDRANT_COLLECTION`, `EMBEDDING_MODEL`.

**Frontend**

```bash
npm install
npm run dev                      # http://localhost:8080
```

On Windows, `run_project.bat` starts both servers (edit the paths inside it first).

For a step-by-step setup, see [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md). OCR details are in [`OCR_FEATURES.md`](OCR_FEATURES.md).

## 📂 Project Structure

```
backend/app/        FastAPI app, parser, policy engine, RAG and LLM providers
backend/data/       Saved analyses and policies
src/pages/          Dashboard, Upload, Analyses, AnalysisDetail, Policies
src/services/       API client
docs_int/           Sample contracts for testing
```

## 🧪 Sample Data

`docs_int/` contains sample service agreements, including deliberately flawed ones, for trying out the risk analysis.
