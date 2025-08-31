from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from sheets_service_optimized import sheets_service

# Load environment variables
load_dotenv()

# MongoDB connection (for Vercel, use MongoDB Atlas)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sesg_research_db')]

# Create the main FastAPI app
app = FastAPI(
    title="SESG Research API",
    description="Sustainable Energy and Smart Grid Research API",
    version="1.0.0"
)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging  
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection (for Vercel, use MongoDB Atlas)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')

# Initialize MongoDB client with error handling
try:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'sesg_research_db')]
except Exception as e:
    logger.warning(f"MongoDB connection failed: {e}. API will work without database features.")
    client = None
    db = None

# Basic routes
@app.get("/")
async def root():
    return {"message": "SESG Research API", "version": "1.0.0"}

@app.get("/api")
async def api_root():
    return {"message": "SESG Research API - Backend Service", "version": "1.0.0"}

@app.post("/api/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@app.get("/api/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# SESG Research Data API Endpoints
@app.get("/api/publications")
async def get_publications(
    page: int = 1,
    per_page: int = 20,
    year_filter: Optional[str] = None,
    area_filter: Optional[str] = None,
    category_filter: Optional[str] = None,
    author_filter: Optional[str] = None,
    title_filter: Optional[str] = None,
    search_filter: Optional[str] = None,
    sort_by: str = "year",
    sort_order: str = "desc"
):
    """Get publications with filtering, pagination, and sorting"""
    try:
        result = sheets_service.get_publications(
            page=page, per_page=per_page, year_filter=year_filter,
            area_filter=area_filter, category_filter=category_filter,
            author_filter=author_filter, title_filter=title_filter,
            search_filter=search_filter, sort_by=sort_by, sort_order=sort_order
        )
        return result
    except Exception as e:
        logger.error(f"Error fetching publications: {e}")
        return {"error": "Failed to fetch publications", "publications": [], "pagination": {}}

@app.get("/api/projects")
async def get_projects(
    page: int = 1,
    per_page: int = 20,
    status_filter: Optional[str] = None,
    area_filter: Optional[str] = None,
    title_filter: Optional[str] = None,
    sort_by: str = "start_date",
    sort_order: str = "desc"
):
    """Get projects with filtering and pagination"""
    try:
        result = sheets_service.get_projects(
            page=page, per_page=per_page, status_filter=status_filter,
            area_filter=area_filter, title_filter=title_filter,
            sort_by=sort_by, sort_order=sort_order
        )
        return result
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        return {"error": "Failed to fetch projects", "projects": [], "pagination": {}}

@app.get("/api/achievements")
async def get_achievements(
    page: int = 1,
    per_page: int = 12,
    category_filter: Optional[str] = None,
    title_filter: Optional[str] = None,
    sort_by: str = "date",
    sort_order: str = "desc"
):
    """Get achievements with filtering and pagination"""
    try:
        result = sheets_service.get_achievements(
            page=page, per_page=per_page, category_filter=category_filter,
            title_filter=title_filter, sort_by=sort_by, sort_order=sort_order
        )
        return result
    except Exception as e:
        logger.error(f"Error fetching achievements: {e}")
        return {"error": "Failed to fetch achievements", "achievements": [], "pagination": {}}

@app.get("/api/news-events")
async def get_news_events(
    page: int = 1,
    per_page: int = 15,
    category_filter: Optional[str] = None,
    title_filter: Optional[str] = None,
    sort_by: str = "date",
    sort_order: str = "desc"
):
    """Get news and events with filtering and pagination"""
    try:
        result = sheets_service.get_news_events(
            page=page, per_page=per_page, category_filter=category_filter,
            title_filter=title_filter, sort_by=sort_by, sort_order=sort_order
        )
        return result
    except Exception as e:
        logger.error(f"Error fetching news and events: {e}")
        return {"error": "Failed to fetch news and events", "news_events": [], "pagination": {}}

@app.get("/api/achievements/{achievement_id}")
async def get_achievement_details(achievement_id: str):
    """Get detailed achievement for blog-style page"""
    try:
        result = sheets_service.get_achievement_details(achievement_id)
        if result:
            return result
        else:
            return {"error": "Achievement not found"}
    except Exception as e:
        logger.error(f"Error fetching achievement details: {e}")
        return {"error": "Failed to fetch achievement details"}

@app.get("/api/news-events/{news_id}")
async def get_news_event_details(news_id: str):
    """Get detailed news/event for blog-style page"""
    try:
        result = sheets_service.get_news_event_details(news_id)
        if result:
            return result
        else:
            return {"error": "News/Event not found"}
    except Exception as e:
        logger.error(f"Error fetching news/event details: {e}")
        return {"error": "Failed to fetch news/event details"}

@app.get("/api/research-stats")
async def get_research_statistics():
    """Get overall research statistics"""
    try:
        # Get total counts from each category
        publications = sheets_service.get_publications(page=1, per_page=1)
        projects = sheets_service.get_projects(page=1, per_page=1) 
        achievements = sheets_service.get_achievements(page=1, per_page=1)
        news_events = sheets_service.get_news_events(page=1, per_page=1)
        
        return {
            "total_publications": publications.get("pagination", {}).get("total_items", 0),
            "total_citations": publications.get("statistics", {}).get("total_citations", 0),
            "active_projects": len([p for p in sheets_service.get_projects(page=1, per_page=100)["projects"] if p["status"] == "Active"]),
            "total_achievements": achievements.get("pagination", {}).get("total_items", 0),
            "recent_news": news_events.get("pagination", {}).get("total_items", 0)
        }
    except Exception as e:
        logger.error(f"Error fetching research statistics: {e}")
        return {"error": "Failed to fetch research statistics"}

@app.get("/api/cache-status")
async def get_cache_status():
    """Get cache status for performance monitoring"""
    try:
        return {
            "cached_items": len(sheets_service.cache),
            "last_fetch_times": {k: v.isoformat() for k, v in sheets_service.last_fetch_time.items()},
            "cache_duration_minutes": sheets_service.cache_duration.total_seconds() / 60
        }
    except Exception as e:
        logger.error(f"Error fetching cache status: {e}")
        return {"error": "Failed to fetch cache status"}

@app.post("/api/clear-cache")
async def clear_cache():
    """Clear all cached data"""
    try:
        sheets_service.clear_cache()
        return {"message": "Cache cleared successfully"}
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        return {"error": "Failed to clear cache"}

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Vercel handler
handler = app