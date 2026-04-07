from fastapi import FastAPI, Query, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
import httpx
import os

SEARXNG_URL = os.getenv("SEARXNG_URL", "http://searxng_api:8080")

app = FastAPI()
templates = Jinja2Templates(directory="templates")

html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recollect - Search</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .header {
            background-color: #fff;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4285f4;
            margin-bottom: 20px;
        }
        .search-container {
            max-width: 600px;
            margin: 0 auto;
        }
        .search-bar {
            width: 100%;
            padding: 12px 20px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 24px;
            outline: none;
        }
        .search-bar:focus {
            border-color: #4285f4;
        }
        .tabs {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        .tab {
            padding: 10px 20px;
            margin: 0 5px;
            background-color: #f1f3f4;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .tab.active {
            background-color: #4285f4;
            color: white;
        }
        .results {
            max-width: 800px;
            margin: 20px auto;
            padding: 0 20px;
        }
        .result-item {
            background-color: white;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .result-title {
            font-size: 18px;
            color: #1a0dab;
            text-decoration: none;
            margin-bottom: 5px;
            display: block;
        }
        .result-url {
            color: #006621;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .result-snippet {
            color: #545454;
            font-size: 14px;
            line-height: 1.4;
        }
        .image-result {
            display: inline-block;
            margin: 5px;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .image-result img {
            width: 200px;
            height: 150px;
            object-fit: cover;
        }
        .loading {
            text-align: center;
            padding: 20px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Recollect</div>
        <div class="search-container">
            <input type="text" id="search-input" class="search-bar" placeholder="Search...">
        </div>
        <div class="tabs">
            <button class="tab active" data-category="general">All</button>
            <button class="tab" data-category="images">Images</button>
        </div>
    </div>
    <div class="results" id="results"></div>
    <div class="loading" id="loading">Loading more results...</div>

    <script>
        let currentQuery = '';
        let currentPage = 1;
        let currentCategory = 'general';
        let isLoading = false;

        const searchInput = document.getElementById('search-input');
        const resultsDiv = document.getElementById('results');
        const loadingDiv = document.getElementById('loading');
        const tabs = document.querySelectorAll('.tab');

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                if (currentQuery) {
                    performSearch();
                }
            });
        });

        function performSearch() {
            currentQuery = searchInput.value.trim();
            if (!currentQuery) return;
            currentPage = 1;
            resultsDiv.innerHTML = '';
            loadResults();
        }

        async function loadResults() {
            if (isLoading) return;
            isLoading = true;
            loadingDiv.style.display = 'block';

            try {
                const response = await fetch(`/search?q=${encodeURIComponent(currentQuery)}&pageno=${currentPage}&categories=${currentCategory}`);
                const data = await response.json();
                displayResults(data.results);
                if (data.has_more) {
                    currentPage++;
                } else {
                    loadingDiv.style.display = 'none';
                }
            } catch (error) {
                console.error('Error loading results:', error);
                loadingDiv.style.display = 'none';
            } finally {
                isLoading = false;
            }
        }

        function displayResults(results) {
            results.forEach(result => {
                const item = document.createElement('div');
                item.className = 'result-item';
                if (currentCategory === 'images') {
                    item.innerHTML = `
                        <div class="image-result">
                            <img src="${result.thumbnail || result.img_src}" alt="${result.title}" onerror="this.style.display='none'">
                        </div>
                    `;
                } else {
                    item.innerHTML = `
                        <a href="${result.url}" class="result-title" target="_blank">${result.title}</a>
                        <div class="result-url">${result.url}</div>
                        <div class="result-snippet">${result.content || result.title}</div>
                    `;
                }
                resultsDiv.appendChild(item);
            });
        }

        // Infinite scroll
        window.addEventListener('scroll', function() {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                loadResults();
            }
        });
    </script>
</body>
</html>
"""

@app.get("/", response_class=HTMLResponse)
async def index():
    return html_content

@app.get("/search")
async def search(q: str = Query(...), pageno: int = 1, categories: str = "general"):
    async with httpx.AsyncClient() as client:
        params = {"q": q, "format": "json", "pageno": pageno, "categories": categories}
        res = await client.get(f"{SEARXNG_URL}/search", params=params)
        data = res.json()
    results = data.get("results", [])
    return JSONResponse({"results": results, "has_more": len(results) == 20})