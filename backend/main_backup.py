from fastapi import FastAPI
from mangum import Mangum
import os
import json
from typing import Optional

# Ultra-minimal FastAPI app for Vercel
app = FastAPI(title="SESG Research API", version="1.0.0")

# Mock data to avoid external dependencies
MOCK_PUBLICATIONS = [
    {
        "id": "1",
        "title": "Smart Grid Optimization using AI",
        "authors": "John Doe, Jane Smith", 
        "year": 2024,
        "category": "Journal Articles",
        "citations": 45,
        "research_areas": "Smart Grid Technologies, AI",
        "ieee_formatted": "John Doe, Jane Smith, \"Smart Grid Optimization using AI\", IEEE Transactions on Smart Grid, vol. 15, no. 3, pp. 123-135, 2024.",
        "doi_link": "https://doi.org/10.1109/example",
        "journal_book_conference_name": "IEEE Transactions on Smart Grid",
        "volume": "15",
        "issue": "3",
        "pages": "123-135"
    },
    {
        "id": "2", 
        "title": "Renewable Energy Integration Challenges",
        "authors": "Alice Johnson, Bob Wilson",
        "year": 2023,
        "category": "Conference Proceedings",
        "citations": 32,
        "research_areas": "Renewable Energy Integration",
        "ieee_formatted": "Alice Johnson, Bob Wilson, \"Renewable Energy Integration Challenges\", IEEE Power & Energy Conference, pp. 45-52, 2023.",
        "doi_link": "https://doi.org/10.1109/example2",
        "journal_book_conference_name": "IEEE Power & Energy Conference",
        "location": "New York, USA",
        "pages": "45-52"
    }
]

MOCK_PROJECTS = [
    {
        "id": "1",
        "title": "Solar Integration Project",
        "description": "Advanced solar panel integration with smart grid systems",
        "status": "Active",
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "research_areas": "Solar Energy, Smart Grid",
        "principal_investigator": "Dr. John Smith",
        "team_members": ["Alice Brown", "Bob Davis"],
        "funding_agency": "NSF",
        "budget": "$500,000",
        "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500"
    }
]

MOCK_ACHIEVEMENTS = [
    {
        "id": "1",
        "title": "Best Research Paper Award 2024",
        "short_description": "Awarded for outstanding research in smart grid optimization",
        "category": "Award",
        "date": "2024-06-15",
        "image": "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500",
        "full_content": "This prestigious award recognizes our groundbreaking research in smart grid optimization techniques using artificial intelligence and machine learning algorithms.",
        "featured": 1
    }
]

MOCK_NEWS_EVENTS = [
    {
        "id": "1",
        "title": "Smart Grid Conference 2024",
        "short_description": "Annual conference on smart grid technologies",
        "category": "Events",
        "date": "2024-09-15",
        "image": "https://images.unsplash.com/photo-1540575467563-020dc2506df4?w=500",
        "full_content": "Join us for the annual Smart Grid Conference featuring the latest developments in sustainable energy and grid optimization technologies."
    }
]

def paginate_data(data, page: int = 1, per_page: int = 20):
    """Simple pagination"""
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

def filter_data(data, category_filter=None, title_filter=None, search_filter=None):
    """Simple filtering"""
    filtered = data
    
    if category_filter:
        filtered = [item for item in filtered if item.get("category", "").lower() == category_filter.lower()]
    
    if title_filter:
        filtered = [item for item in filtered if title_filter.lower() in item.get("title", "").lower()]
        
    if search_filter:
        filtered = [item for item in filtered if (
            search_filter.lower() in item.get("title", "").lower() or
            search_filter.lower() in item.get("authors", "").lower() or
            search_filter.lower() in str(item.get("year", "")).lower()
        )]
    
    return filtered

# Routes
@app.get("/")
async def root():
    return {"message": "SESG Research API", "version": "1.0.0", "status": "running"}

@app.get("/api")
async def api_root():
    return {"message": "SESG Research API - Backend Service", "version": "1.0.0"}

@app.get("/api/publications")
async def get_publications(
    page: int = 1,
    per_page: int = 20,
    category_filter: Optional[str] = None,
    title_filter: Optional[str] = None,
    search_filter: Optional[str] = None,
    sort_by: str = "year",
    sort_order: str = "desc"
):
    """Get publications with basic filtering and pagination"""
    try:
        # Filter data
        filtered_data = filter_data(MOCK_PUBLICATIONS, category_filter, title_filter, search_filter)
        
        # Sort data
        reverse = sort_order.lower() == "desc"
        if sort_by == "year":
            filtered_data.sort(key=lambda x: x.get("year", 0), reverse=reverse)
        elif sort_by == "citations":
            filtered_data.sort(key=lambda x: x.get("citations", 0), reverse=reverse)
        elif sort_by == "title":
            filtered_data.sort(key=lambda x: x.get("title", "").lower(), reverse=reverse)
        
        # Paginate
        result = paginate_data(filtered_data, page, per_page)
        
        # Add statistics
        total_citations = sum(pub.get("citations", 0) for pub in filtered_data)
        latest_year = max((pub.get("year", 0) for pub in filtered_data), default=2024)
        
        result["statistics"] = {
            "total_publications": len(filtered_data),
            "total_citations": total_citations,
            "latest_year": latest_year,
            "total_areas": 3
        }
        
        result["publications"] = result.pop("items")
        return result
        
    except Exception as e:
        return {"error": f"Failed to fetch publications: {str(e)}", "publications": [], "pagination": {}}

@app.get("/api/projects") 
async def get_projects(
    page: int = 1,
    per_page: int = 20,
    status_filter: Optional[str] = None,
    title_filter: Optional[str] = None
):
    """Get projects with basic filtering"""
    try:
        filtered_data = filter_data(MOCK_PROJECTS, None, title_filter)
        
        if status_filter:
            filtered_data = [item for item in filtered_data if item.get("status", "").lower() == status_filter.lower()]
        
        result = paginate_data(filtered_data, page, per_page)
        result["projects"] = result.pop("items")
        return result
        
    except Exception as e:
        return {"error": f"Failed to fetch projects: {str(e)}", "projects": [], "pagination": {}}

@app.get("/api/achievements")
async def get_achievements(
    page: int = 1,
    per_page: int = 12,
    category_filter: Optional[str] = None,
    title_filter: Optional[str] = None
):
    """Get achievements with basic filtering"""
    try:
        filtered_data = filter_data(MOCK_ACHIEVEMENTS, category_filter, title_filter)
        result = paginate_data(filtered_data, page, per_page)
        result["achievements"] = result.pop("items")
        return result
        
    except Exception as e:
        return {"error": f"Failed to fetch achievements: {str(e)}", "achievements": [], "pagination": {}}

@app.get("/api/news-events")
async def get_news_events(
    page: int = 1,
    per_page: int = 15,
    category_filter: Optional[str] = None,
    title_filter: Optional[str] = None
):
    """Get news and events with basic filtering"""
    try:
        filtered_data = filter_data(MOCK_NEWS_EVENTS, category_filter, title_filter)
        result = paginate_data(filtered_data, page, per_page)
        result["news_events"] = result.pop("items")
        return result
        
    except Exception as e:
        return {"error": f"Failed to fetch news events: {str(e)}", "news_events": [], "pagination": {}}

@app.get("/api/achievements/{achievement_id}")
async def get_achievement_details(achievement_id: str):
    """Get detailed achievement"""
    try:
        achievement = next((item for item in MOCK_ACHIEVEMENTS if item["id"] == achievement_id), None)
        return achievement if achievement else {"error": "Achievement not found"}
    except Exception as e:
        return {"error": f"Failed to fetch achievement: {str(e)}"}

@app.get("/api/news-events/{news_id}")
async def get_news_event_details(news_id: str):
    """Get detailed news/event"""
    try:
        news = next((item for item in MOCK_NEWS_EVENTS if item["id"] == news_id), None)
        return news if news else {"error": "News/Event not found"}
    except Exception as e:
        return {"error": f"Failed to fetch news event: {str(e)}"}

@app.get("/api/research-stats")
async def get_research_statistics():
    """Get research statistics"""
    return {
        "total_publications": len(MOCK_PUBLICATIONS),
        "total_citations": sum(pub.get("citations", 0) for pub in MOCK_PUBLICATIONS),
        "active_projects": len([p for p in MOCK_PROJECTS if p["status"] == "Active"]),
        "total_achievements": len(MOCK_ACHIEVEMENTS),
        "recent_news": len(MOCK_NEWS_EVENTS)
    }

@app.get("/api/cache-status")
async def get_cache_status():
    """Cache status endpoint"""
    return {
        "cached_items": 0,
        "last_fetch_times": {},
        "cache_duration_minutes": 0,
        "message": "Using mock data - no caching needed"
    }

@app.post("/api/clear-cache")
async def clear_cache():
    """Clear cache endpoint"""
    return {"message": "No cache to clear - using mock data"}

# Vercel handler
handler = Mangum(app)