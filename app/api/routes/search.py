from fastapi import APIRouter, Query
from app.services.searxng import search

router = APIRouter()

@router.get("/search")
def search_route(q: str | None = Query(None), page: int = Query(1, ge=1)):
    if not q:
        return {"message": "use ?q="}
    results = search(q, page)
    if results is None:
        return {"error": "search backend unavailable"}
    return results
