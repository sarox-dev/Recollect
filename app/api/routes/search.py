from fastapi import APIRouter, Query
from app.services.searxng import search

router = APIRouter()

@router.get("/search")
def search_route(
    q: str | None = Query(None),
    page: int = Query(1, ge=1),
    count: int = Query(10, ge=1, le=50),
):
    if not q:
        return {"message": "use ?q="}
    results = search(q, page, count)
    if results is None:
        return {"error": "search backend unavailable"}
    return results
