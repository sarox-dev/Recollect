from fastapi import APIRouter, Query
from app.services.searxng import search

router = APIRouter()

@router.get("/search")
def search_route(q: str | None = Query(None)):
    if not q:
        return {"message": "use ?q="}
    results = search(q)
    if results is None:
        return {"error": "search backend unavailable"}
    return results
