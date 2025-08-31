"""
Optimized Google Sheets Service for Vercel Deployment
Lightweight version without heavy dependencies like pandas and numpy
"""

import os
import json
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class SESGSheetsService:
    def __init__(self):
        self.use_mock_data = False
        # Google Sheets API URLs
        self.publications_api_url = os.environ.get(
            'PUBLICATIONS_API_URL',
            "https://script.google.com/macros/s/AKfycbzQ6XwRBYMc5PaDDns3XlgpRGYQFZtC45RtVRUhyvVlt869zH9mL0IlGlnvBV2-e_s/exec?sheet=sheet6"
        )
        self.projects_api_url = os.environ.get(
            'PROJECTS_API_URL',  
            "https://script.google.com/macros/s/AKfycbz5-vZBCz8DZQhLDmLjJNA70HQ3OazQ2uTAUuK7UQaTVip7pG8ulVPLuzA8VN8rqTGH/exec?sheet=sheet7"
        )
        self.achievements_api_url = os.environ.get(
            'ACHIEVEMENTS_API_URL',
            "https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8"
        )
        self.news_events_api_url = os.environ.get(
            'NEWS_EVENTS_API_URL',
            "https://script.google.com/macros/s/AKfycbwLVCtEI2Mr2J76jf72kfK6OhaMNNdfvLTcJTV8J6mtWcNNGVnHtt0Gxu__lavtnrc8/exec?sheet=sheet9"
        )
        
        # Simple cache without heavy dependencies
        self.cache = {}
        self.cache_duration = timedelta(minutes=15)
        self.last_fetch_time = {}
        
    def _fetch_from_api(self, url: str, cache_key: str) -> List[Dict]:
        """Fetch data from Google Sheets API with caching"""
        current_time = datetime.now()
        
        # Check if we have cached data that's still fresh
        if (cache_key in self.cache and 
            cache_key in self.last_fetch_time and
            current_time - self.last_fetch_time[cache_key] < self.cache_duration):
            logger.info(f"Using cached data for {cache_key}")
            return self.cache[cache_key]
        
        try:
            logger.info(f"Fetching fresh data from {url}")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Handle different response structures
            if isinstance(data, dict):
                if 'publications' in data:
                    items = data['publications']
                elif 'projects' in data:
                    items = data['projects']
                elif 'achievements' in data:
                    items = data['achievements']
                elif 'news_events' in data:
                    items = data['news_events']
                else:
                    items = []
            elif isinstance(data, list):
                items = data
            else:
                items = []
            
            # Cache the data
            self.cache[cache_key] = items
            self.last_fetch_time[cache_key] = current_time
            
            logger.info(f"Successfully fetched {len(items)} items for {cache_key}")
            return items
            
        except Exception as e:
            logger.error(f"Error fetching data from {url}: {e}")
            # Return cached data if available, otherwise empty list
            return self.cache.get(cache_key, [])
    
    def _apply_filters(self, items: List[Dict], filters: Dict) -> List[Dict]:
        """Apply filters to data without pandas"""
        filtered_items = items.copy()
        
        for filter_key, filter_value in filters.items():
            if not filter_value:
                continue
                
            if filter_key == 'year_filter':
                filtered_items = [item for item in filtered_items 
                                if str(item.get('year', '')) == str(filter_value)]
            elif filter_key == 'category_filter':
                filtered_items = [item for item in filtered_items 
                                if item.get('category', '').lower() == filter_value.lower()]
            elif filter_key == 'status_filter':
                filtered_items = [item for item in filtered_items 
                                if item.get('status', '').lower() == filter_value.lower()]
            elif filter_key == 'area_filter':
                filtered_items = [item for item in filtered_items 
                                if filter_value.lower() in item.get('research_areas', '').lower()]
            elif filter_key == 'title_filter':
                filtered_items = [item for item in filtered_items 
                                if filter_value.lower() in item.get('title', '').lower()]
            elif filter_key == 'author_filter':
                filtered_items = [item for item in filtered_items 
                                if filter_value.lower() in item.get('authors', '').lower()]
            elif filter_key == 'search_filter':
                # Search across multiple fields
                filtered_items = [item for item in filtered_items 
                                if (filter_value.lower() in item.get('title', '').lower() or
                                    filter_value.lower() in item.get('authors', '').lower() or
                                    filter_value.lower() in str(item.get('year', '')).lower() or
                                    filter_value.lower() in item.get('abstract', '').lower())]
        
        return filtered_items
    
    def _sort_data(self, items: List[Dict], sort_by: str, sort_order: str) -> List[Dict]:
        """Sort data without pandas"""
        reverse = sort_order.lower() == 'desc'
        
        def sort_key(item):
            value = item.get(sort_by, '')
            # Handle numeric fields
            if sort_by in ['year', 'citations']:
                try:
                    return int(value) if value else 0
                except:
                    return 0
            # Handle date fields
            elif sort_by == 'date':
                try:
                    if isinstance(value, str):
                        return datetime.strptime(value, '%Y-%m-%d')
                    return value if value else datetime.min
                except:
                    return datetime.min
            # Handle string fields
            else:
                return str(value).lower()
        
        return sorted(items, key=sort_key, reverse=reverse)
    
    def _paginate_data(self, items: List[Dict], page: int, per_page: int) -> Dict:
        """Paginate data without pandas"""
        total_items = len(items)
        total_pages = (total_items + per_page - 1) // per_page
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        return {
            'items': items[start_idx:end_idx],
            'pagination': {
                'current_page': page,
                'per_page': per_page,
                'total_items': total_items,
                'total_pages': total_pages,
                'has_next': page < total_pages,
                'has_prev': page > 1
            }
        }
    
    def get_publications(self, **kwargs) -> Dict:
        """Get publications with filtering, pagination, and sorting"""
        items = self._fetch_from_api(self.publications_api_url, 'publications')
        
        # Apply filters
        filters = {k: v for k, v in kwargs.items() if k.endswith('_filter') and v}
        items = self._apply_filters(items, filters)
        
        # Sort data
        sort_by = kwargs.get('sort_by', 'year')
        sort_order = kwargs.get('sort_order', 'desc')
        items = self._sort_data(items, sort_by, sort_order)
        
        # Paginate
        page = kwargs.get('page', 1)
        per_page = kwargs.get('per_page', 20)
        result = self._paginate_data(items, page, per_page)
        
        # Add statistics
        if items:
            total_citations = sum(int(item.get('citations', 0)) for item in items if item.get('citations'))
            latest_year = max(int(item.get('year', 0)) for item in items if item.get('year'))
            research_areas = set()
            for item in items:
                if item.get('research_areas'):
                    research_areas.update(area.strip() for area in item['research_areas'].split(','))
            
            result['statistics'] = {
                'total_publications': len(items),
                'total_citations': total_citations,
                'latest_year': latest_year,
                'total_areas': len(research_areas)
            }
        
        result['publications'] = result.pop('items')
        return result
    
    def get_projects(self, **kwargs) -> Dict:
        """Get projects with filtering and pagination"""
        items = self._fetch_from_api(self.projects_api_url, 'projects')
        
        # Apply filters
        filters = {k: v for k, v in kwargs.items() if k.endswith('_filter') and v}
        items = self._apply_filters(items, filters)
        
        # Sort data
        sort_by = kwargs.get('sort_by', 'start_date')
        sort_order = kwargs.get('sort_order', 'desc')
        items = self._sort_data(items, sort_by, sort_order)
        
        # Paginate
        page = kwargs.get('page', 1)
        per_page = kwargs.get('per_page', 20)
        result = self._paginate_data(items, page, per_page)
        
        result['projects'] = result.pop('items')
        return result
    
    def get_achievements(self, **kwargs) -> Dict:
        """Get achievements with filtering and pagination"""
        items = self._fetch_from_api(self.achievements_api_url, 'achievements')
        
        # Apply filters
        filters = {k: v for k, v in kwargs.items() if k.endswith('_filter') and v}
        items = self._apply_filters(items, filters)
        
        # Sort data  
        sort_by = kwargs.get('sort_by', 'date')
        sort_order = kwargs.get('sort_order', 'desc')
        items = self._sort_data(items, sort_by, sort_order)
        
        # Paginate
        page = kwargs.get('page', 1)
        per_page = kwargs.get('per_page', 12)
        result = self._paginate_data(items, page, per_page)
        
        result['achievements'] = result.pop('items')
        return result
    
    def get_news_events(self, **kwargs) -> Dict:
        """Get news and events with filtering and pagination"""
        items = self._fetch_from_api(self.news_events_api_url, 'news_events')
        
        # Apply filters
        filters = {k: v for k, v in kwargs.items() if k.endswith('_filter') and v}
        items = self._apply_filters(items, filters)
        
        # Sort data
        sort_by = kwargs.get('sort_by', 'date')
        sort_order = kwargs.get('sort_order', 'desc')
        items = self._sort_data(items, sort_by, sort_order)
        
        # Paginate
        page = kwargs.get('page', 1)
        per_page = kwargs.get('per_page', 15)
        result = self._paginate_data(items, page, per_page)
        
        result['news_events'] = result.pop('items')
        return result
    
    def get_achievement_details(self, achievement_id: str) -> Optional[Dict]:
        """Get detailed achievement by ID"""
        items = self._fetch_from_api(self.achievements_api_url, 'achievements')
        for item in items:
            if str(item.get('id')) == str(achievement_id):
                return item
        return None
    
    def get_news_event_details(self, news_id: str) -> Optional[Dict]:
        """Get detailed news/event by ID"""
        items = self._fetch_from_api(self.news_events_api_url, 'news_events')
        for item in items:
            if str(item.get('id')) == str(news_id):
                return item
        return None
    
    def clear_cache(self):
        """Clear all cached data"""
        self.cache.clear()
        self.last_fetch_time.clear()
        logger.info("Cache cleared successfully")

# Create singleton instance
sheets_service = SESGSheetsService()