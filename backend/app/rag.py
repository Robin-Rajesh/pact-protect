import os
from typing import List, Dict, Any, Optional

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels
from sentence_transformers import SentenceTransformer


DEFAULT_COLLECTION = os.getenv("QDRANT_COLLECTION", "contracts")
DEFAULT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")


class RAGStore:
    def __init__(self,
                 collection: str = DEFAULT_COLLECTION,
                 url: str = DEFAULT_URL,
                 embedding_model: str = EMBEDDING_MODEL_NAME) -> None:
        self.client = QdrantClient(url=url)
        self.collection = collection
        self.model = SentenceTransformer(embedding_model)
        self.dim = self.model.get_sentence_embedding_dimension()
        self._ensure_collection()

    def _ensure_collection(self) -> None:
        try:
            exists = self.client.get_collection(self.collection)
            return
        except Exception:
            pass
        self.client.recreate_collection(
            collection_name=self.collection,
            vectors_config=qmodels.VectorParams(size=self.dim, distance=qmodels.Distance.COSINE),
        )

    def embed(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        embs = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
        return [e.tolist() for e in embs]

    def upsert_clauses(self, analysis_id: str, clauses: List[Dict[str, Any]]) -> None:
        if not clauses:
            return
        texts = [c.get("text", "") for c in clauses]
        vectors = self.embed(texts)
        points = []
        for c, v in zip(clauses, vectors):
            pid = f"{analysis_id}:{c.get('id')}"
            payload = {
                "analysis_id": analysis_id,
                "clause_id": c.get("id"),
                "text": c.get("text"),
            }
            points.append(qmodels.PointStruct(id=pid, vector=v, payload=payload))
        self.client.upsert(collection_name=self.collection, points=points)

    def query(self, text: str, top_k: int = 5, filter_by_analysis: Optional[str] = None) -> List[Dict[str, Any]]:
        if not (text or "").strip():
            return []
        vec = self.embed([text])[0]
        flt = None
        if filter_by_analysis:
            flt = qmodels.Filter(must=[qmodels.FieldCondition(key="analysis_id", match=qmodels.MatchValue(value=filter_by_analysis))])
        res = self.client.search(collection_name=self.collection, query_vector=vec, limit=top_k, query_filter=flt)
        out: List[Dict[str, Any]] = []
        for r in res:
            payload = r.payload or {}
            out.append({
                "text": payload.get("text", ""),
                "analysis_id": payload.get("analysis_id"),
                "clause_id": payload.get("clause_id"),
                "score": r.score,
            })
        return out
