import requests
from app.core.config import SEARXNG_URL, TIMEOUT

def search(query: str):
    try:
        response = requests.get(
            f"{SEARXNG_URL}/search",
            params={"q": query, "format": "json"},
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError):
        return None
    results = []
    for item in data.get("results", [])[:5]:
        results.append({
            "title": item.get("title", ""),
            "url": item.get("url", ""),
            "content": item.get("content", ""),
        })
    return results
