from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import os
import httpx
from typing import Optional

# FastAPI app
app = FastAPI(title="SESG Research API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Sheets URLs from env
SHEETS_URLS = {
    "publications": os.environ.get("PUBLICATIONS_API_URL", ""),
    "projects": os.environ.get("PROJECTS_API_URL", ""),
    "achievements": os.environ.get("ACHIEVEMENTS_API_URL", ""),
    "news_events": os.environ.get("NEWS_EVENTS_API_URL", "")
}

# --- Helper functions ---

async def fetch_sheets_data(sheet_type: str):
    url = SHEETS_URLS.get(sheet_type, "")
    if not url:
        return get_mock_data(sheet_type)
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, dict) and sheet_type in data:
                return data[sheet_type]
            elif isinstance(data, list):
                return data
            else:
                return get_mock_data(sheet_type)
    except Exception:
        return get_mock_data(sheet_type)

def get_mock_data(sheet_type: str):
    # Minimal mock data for fallback
    return [{"id": "1", "title": f"Mock {sheet_type} item"}]

def paginate_data(data, page: int = 1, per_page: int = 20):
    start = (page - 1) * per_page
    end = start + per_page
    items = data[start:end]
    return {
        "items": items,
        "pagination": {
            "current_page": page,
            "per_page": per_page,
            "total_items": len(data),
            "total_pages": (len(data) + per_page - 1) // per_page,
            "has_next": end < len(data),
            "has_prev": page > 1
        }
    }

def filter_data(data, category_filter=None, title_filter=None):
    filtered = data
    if category_filter:
        filtered = [item for item in filtered if item.get("category","").lower() == category_filter.lower()]
    if title_filter:
        filtered = [item for item in filtered if title_filter.lower() in item.get("title","").lower()]
    return filtered

# --- Routes ---

@app.get("/")
async def root():
    return {"message": "SESG Research API running"}

@app.get("/favicon.ico")
async def favicon():
    return {}  # Prevent favicon crash

@app.get("/api/publications")
async def get_publications(page: int = 1, per_page: int = 20):
    data = await fetch_sheets_data("publications")
    return paginate_data(data, page, per_page)

@app.get("/api/projects")
async def get_projects(page: int = 1, per_page: int = 20):
    data = await fetch_sheets_data("projects")
    return paginate_data(data, page, per_page)

@app.get("/api/achievements")
async def get_achievements(page: int = 1, per_page: int = 20):
    data = await fetch_sheets_data("achievements")
    return paginate_data(data, page, per_page)

@app.get("/api/news-events")
async def get_news_events(page: int = 1, per_page: int = 20):
    data = await fetch_sheets_data("news_events")
    return paginate_data(data, page, per_page)

# --- Vercel Lambda handler ---
handler = Mangum(app)
