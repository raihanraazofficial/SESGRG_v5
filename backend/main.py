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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Sheets URLs from environment
SHEETS_URLS = {
    "publications": os.environ.get("PUBLICATIONS_API_URL", ""),
    "projects": os.environ.get("PROJECTS_API_URL", ""),
    "achievements": os.environ.get("ACHIEVEMENTS_API_URL", ""),
    "news_events": os.environ.get("NEWS_EVENTS_API_URL", "")
}

# Basic root route
@app.get("/")
async def root():
    return {"message": "SESG Research API running", "version": "1.0.0"}

# favicon route to prevent 500
from fastapi.responses import FileResponse
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/favicon.ico")

# Example async fetch function
async def fetch_sheets_data(sheet_type: str):
    url = SHEETS_URLS.get(sheet_type)
    if not url:
        return []
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.json()
    except Exception as e:
        print(f"Error fetching {sheet_type}: {e}")
        return []

# Example API route
@app.get("/api/publications")
async def get_publications(page: int = 1, per_page: int = 20):
    data = await fetch_sheets_data("publications")
    start = (page-1)*per_page
    end = start+per_page
    return {"publications": data[start:end]}

# Mangum handler for Vercel
handler = Mangum(app)
