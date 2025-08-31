from fastapi import FastAPI
from mangum import Mangum
import os
import json
from typing import Optional
import httpx
import asyncio

# Ultra-minimal FastAPI app for Vercel
app = FastAPI(title="SESG Research API", version="1.0.0")

# Google Sheets URLs (lightweight approach)
SHEETS_URLS = {
    "publications": os.environ.get("PUBLICATIONS_API_URL", ""),
    "projects": os.environ.get("PROJECTS_API_URL", ""),
    "achievements": os.environ.get("ACHIEVEMENTS_API_URL", ""),
    "news_events": os.environ.get("NEWS_EVENTS_API_URL", "")
}

async def fetch_sheets_data(sheet_type: str):
    """Fetch data from Google Sheets with minimal dependencies"""
    url = SHEETS_URLS.get(sheet_type, "")
    if not url:
        return get_mock_data(sheet_type)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Handle different response structures
            if isinstance(data, dict):
                if sheet_type in data:
                    return data[sheet_type]
                elif 'publications' in data:
                    return data['publications']
                elif 'projects' in data:
                    return data['projects'] 
                elif 'achievements' in data:
                    return data['achievements']
                elif 'news_events' in data:
                    return data['news_events']
                else:
                    return get_mock_data(sheet_type)
            elif isinstance(data, list):
                return data
            else:
                return get_mock_data(sheet_type)
                
    except Exception as e:
        # Fallback to mock data
        return get_mock_data(sheet_type)

def get_mock_data(sheet_type: str):
    """Fallback mock data"""
    if sheet_type == "publications":
        return [
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
    elif sheet_type == "projects":
        return [
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
    elif sheet_type == "achievements":
        return [
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
    elif sheet_type == "news_events":
        return [
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
    return []

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
        # Fetch data
        publications_data = await fetch_sheets_data("publications")
        # Filter data
        filtered_data = filter_data(publications_data, category_filter, title_filter, search_filter)
        
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
        # Fetch data
        projects_data = await fetch_sheets_data("projects")
        filtered_data = filter_data(projects_data, None, title_filter)
        
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
        # Fetch data
        achievements_data = await fetch_sheets_data("achievements")
        filtered_data = filter_data(achievements_data, category_filter, title_filter)
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
        # Fetch data
        news_events_data = await fetch_sheets_data("news_events")
        filtered_data = filter_data(news_events_data, category_filter, title_filter)
        result = paginate_data(filtered_data, page, per_page)
        result["news_events"] = result.pop("items")
        return result
        
    except Exception as e:
        return {"error": f"Failed to fetch news events: {str(e)}", "news_events": [], "pagination": {}}

@app.get("/api/achievements/{achievement_id}")
async def get_achievement_details(achievement_id: str):
    """Get detailed achievement"""
    try:
        achievements_data = await fetch_sheets_data("achievements")
        achievement = next((item for item in achievements_data if str(item.get("id")) == str(achievement_id)), None)
        return achievement if achievement else {"error": "Achievement not found"}
    except Exception as e:
        return {"error": f"Failed to fetch achievement: {str(e)}"}

@app.get("/api/news-events/{news_id}")
async def get_news_event_details(news_id: str):
    """Get detailed news/event"""
    try:
        news_events_data = await fetch_sheets_data("news_events")
        news = next((item for item in news_events_data if item["id"] == news_id), None)
        return news if news else {"error": "News/Event not found"}
    except Exception as e:
        return {"error": f"Failed to fetch news event: {str(e)}"}

@app.get("/api/research-stats")
async def get_research_statistics():
    """Get research statistics"""
    try:
        publications_data = await fetch_sheets_data("publications")
        projects_data = await fetch_sheets_data("projects")
        achievements_data = await fetch_sheets_data("achievements")
        news_events_data = await fetch_sheets_data("news_events")
        
        return {
            "total_publications": len(publications_data),
            "total_citations": sum(pub.get("citations", 0) for pub in publications_data),
            "active_projects": len([p for p in projects_data if p.get("status") == "Active"]),
            "total_achievements": len(achievements_data),
            "recent_news": len(news_events_data)
        }
    except Exception as e:
        return {"error": f"Failed to fetch research stats: {str(e)}"}

@app.get("/api/cache-status")
async def get_cache_status():
    """Cache status endpoint"""
    return {
        "cached_items": 0,
        "last_fetch_times": {},
        "cache_duration_minutes": 0,
        "message": "Using Google Sheets API - no caching implemented"
    }

@app.post("/api/clear-cache")
async def clear_cache():
    """Clear cache endpoint"""
    return {"message": "No cache to clear - using direct API calls"}

# Vercel handler
handler = Mangum(app)