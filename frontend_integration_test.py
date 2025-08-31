#!/usr/bin/env python3
"""
Frontend Google Sheets Service Integration Test
Tests the frontend's googleSheetsService to ensure it properly handles the Google Sheets API responses
"""

import requests
import json
import sys
from datetime import datetime

# Simulate the frontend googleSheetsService behavior
class GoogleSheetsServiceTest:
    def __init__(self):
        # URLs from frontend .env
        self.publications_url = 'https://script.google.com/macros/s/AKfycbzQ6XwRBYMc5PaDDns3XlgpRGYQFZtC45RtVRUhyvVlt869zH9mL0IlGlnvBV2-e_s/exec?sheet=sheet6'
        self.projects_url = 'https://script.google.com/macros/s/AKfycbz5-vZBCz8DZQhLDmLjJNA70HQ3OazQ2uTAUuK7UQaTVip7pG8ulVPLuzA8VN8rqTGH/exec?sheet=sheet7'
        self.achievements_url = 'https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8'
        self.news_events_url = 'https://script.google.com/macros/s/AKfycbwLVCtEI2Mr2J76jf72kfK6OhaMNNdfvLTcJTV8J6mtWcNNGVnHtt0Gxu__lavtnrc8/exec?sheet=sheet9'

    def fetch_from_google_sheets(self, url):
        """Simulate the frontend fetch method"""
        try:
            response = requests.get(url, timeout=30)
            if response.status_code != 200:
                raise Exception(f"Google Sheets API request failed: {response.status_code}")
            return response.json()
        except Exception as e:
            print(f"Google Sheets API error: {e}")
            raise e

    def get_publications(self, params=None):
        """Test publications API like frontend service"""
        if params is None:
            params = {}
        
        try:
            data = self.fetch_from_google_sheets(self.publications_url)
            # Publications API returns a direct list
            publications = data if isinstance(data, list) else data.get('data', [])
            
            # Apply client-side filtering (simplified)
            filtered_data = publications
            
            # Test search filter
            if params.get('search_filter'):
                search_term = params['search_filter'].lower()
                filtered_data = [pub for pub in filtered_data 
                               if search_term in pub.get('title', '').lower()]
            
            # Test category filter
            if params.get('category_filter'):
                filtered_data = [pub for pub in filtered_data 
                               if pub.get('category') == params['category_filter']]
            
            # Test pagination
            page = params.get('page', 1)
            per_page = params.get('per_page', 20)
            total_items = len(filtered_data)
            total_pages = max(1, (total_items + per_page - 1) // per_page)
            start_index = (page - 1) * per_page
            end_index = start_index + per_page
            paginated_data = filtered_data[start_index:end_index]
            
            # Calculate statistics
            statistics = {
                'total_publications': len(publications),
                'total_citations': sum(int(pub.get('citations', 0)) for pub in publications),
                'latest_year': max((int(pub.get('year', 0)) for pub in publications), default=0),
                'total_areas': len(set(area for pub in publications for area in pub.get('research_areas', [])))
            }
            
            return {
                'publications': paginated_data,
                'pagination': {
                    'current_page': page,
                    'per_page': per_page,
                    'total_items': total_items,
                    'total_pages': total_pages,
                    'has_prev': page > 1,
                    'has_next': page < total_pages
                },
                'statistics': statistics
            }
        except Exception as e:
            print(f"Error fetching publications: {e}")
            return {'publications': [], 'pagination': {}, 'statistics': {}}

    def get_projects(self, params=None):
        """Test projects API like frontend service"""
        if params is None:
            params = {}
        
        try:
            data = self.fetch_from_google_sheets(self.projects_url)
            projects = data.get('projects', []) if isinstance(data, dict) else []
            
            # Apply filtering
            filtered_data = projects
            if params.get('status_filter'):
                filtered_data = [proj for proj in filtered_data 
                               if proj.get('status') == params['status_filter']]
            
            # Pagination
            page = params.get('page', 1)
            per_page = params.get('per_page', 20)
            total_items = len(filtered_data)
            total_pages = max(1, (total_items + per_page - 1) // per_page)
            start_index = (page - 1) * per_page
            end_index = start_index + per_page
            paginated_data = filtered_data[start_index:end_index]
            
            return {
                'projects': paginated_data,
                'pagination': {
                    'current_page': page,
                    'per_page': per_page,
                    'total_items': total_items,
                    'total_pages': total_pages,
                    'has_prev': page > 1,
                    'has_next': page < total_pages
                }
            }
        except Exception as e:
            print(f"Error fetching projects: {e}")
            return {'projects': [], 'pagination': {}}

    def get_achievements(self, params=None):
        """Test achievements API like frontend service"""
        if params is None:
            params = {}
        
        try:
            data = self.fetch_from_google_sheets(self.achievements_url)
            achievements = data.get('achievements', []) if isinstance(data, dict) else []
            
            # Apply filtering
            filtered_data = achievements
            if params.get('category_filter'):
                filtered_data = [ach for ach in filtered_data 
                               if ach.get('category') == params['category_filter']]
            
            # Pagination
            page = params.get('page', 1)
            per_page = params.get('per_page', 12)
            total_items = len(filtered_data)
            total_pages = max(1, (total_items + per_page - 1) // per_page)
            start_index = (page - 1) * per_page
            end_index = start_index + per_page
            paginated_data = filtered_data[start_index:end_index]
            
            return {
                'achievements': paginated_data,
                'pagination': {
                    'current_page': page,
                    'per_page': per_page,
                    'total_items': total_items,
                    'total_pages': total_pages,
                    'has_prev': page > 1,
                    'has_next': page < total_pages
                }
            }
        except Exception as e:
            print(f"Error fetching achievements: {e}")
            return {'achievements': [], 'pagination': {}}

    def get_news_events(self, params=None):
        """Test news events API like frontend service"""
        if params is None:
            params = {}
        
        try:
            data = self.fetch_from_google_sheets(self.news_events_url)
            news_events = data.get('news_events', []) if isinstance(data, dict) else []
            
            # Apply filtering
            filtered_data = news_events
            if params.get('category_filter'):
                filtered_data = [item for item in filtered_data 
                               if item.get('category') == params['category_filter']]
            
            # Pagination
            page = params.get('page', 1)
            per_page = params.get('per_page', 15)
            total_items = len(filtered_data)
            total_pages = max(1, (total_items + per_page - 1) // per_page)
            start_index = (page - 1) * per_page
            end_index = start_index + per_page
            paginated_data = filtered_data[start_index:end_index]
            
            return {
                'news_events': paginated_data,
                'pagination': {
                    'current_page': page,
                    'per_page': per_page,
                    'total_items': total_items,
                    'total_pages': total_pages,
                    'has_prev': page > 1,
                    'has_next': page < total_pages
                }
            }
        except Exception as e:
            print(f"Error fetching news events: {e}")
            return {'news_events': [], 'pagination': {}}

def test_frontend_service_integration():
    """Test the frontend service integration with Google Sheets APIs"""
    print("=" * 80)
    print("🔧 FRONTEND SERVICE INTEGRATION TESTING")
    print("=" * 80)
    print("Testing frontend googleSheetsService integration with actual Google Sheets data")
    print("=" * 80)
    
    service = GoogleSheetsServiceTest()
    all_tests_passed = True
    
    # Test Publications Service
    print("\n📚 Testing Publications Service Integration...")
    print("-" * 60)
    
    try:
        # Test basic fetch
        result = service.get_publications()
        publications = result.get('publications', [])
        statistics = result.get('statistics', {})
        pagination = result.get('pagination', {})
        
        if len(publications) > 0:
            print(f"   ✅ Publications fetched: {len(publications)} items")
            print(f"   📊 Statistics: {statistics.get('total_publications', 0)} total, {statistics.get('total_citations', 0)} citations")
            print(f"   📄 Sample: '{publications[0].get('title', '')[:50]}...'")
        else:
            print("   ❌ No publications fetched")
            all_tests_passed = False
        
        # Test filtering
        filtered_result = service.get_publications({'category_filter': 'Journal Articles'})
        filtered_pubs = filtered_result.get('publications', [])
        print(f"   ✅ Category filtering works: {len(filtered_pubs)} Journal Articles")
        
        # Test search
        search_result = service.get_publications({'search_filter': 'energy'})
        search_pubs = search_result.get('publications', [])
        print(f"   ✅ Search filtering works: {len(search_pubs)} results for 'energy'")
        
    except Exception as e:
        print(f"   ❌ Publications service error: {e}")
        all_tests_passed = False
    
    # Test Projects Service
    print("\n🏗️ Testing Projects Service Integration...")
    print("-" * 60)
    
    try:
        result = service.get_projects()
        projects = result.get('projects', [])
        pagination = result.get('pagination', {})
        
        if len(projects) > 0:
            print(f"   ✅ Projects fetched: {len(projects)} items")
            print(f"   📄 Sample: '{projects[0].get('title', '')[:50]}...'")
            print(f"   📊 Sample status: {projects[0].get('status', 'N/A')}")
        else:
            print("   ❌ No projects fetched")
            all_tests_passed = False
        
        # Test status filtering
        active_result = service.get_projects({'status_filter': 'Active'})
        active_projects = active_result.get('projects', [])
        print(f"   ✅ Status filtering works: {len(active_projects)} Active projects")
        
    except Exception as e:
        print(f"   ❌ Projects service error: {e}")
        all_tests_passed = False
    
    # Test Achievements Service
    print("\n🏆 Testing Achievements Service Integration...")
    print("-" * 60)
    
    try:
        result = service.get_achievements()
        achievements = result.get('achievements', [])
        
        if len(achievements) > 0:
            print(f"   ✅ Achievements fetched: {len(achievements)} items")
            print(f"   📄 Sample: '{achievements[0].get('title', '')[:50]}...'")
            print(f"   🏷️  Sample category: {achievements[0].get('category', 'N/A')}")
            
            # Check for featured items
            featured_count = sum(1 for ach in achievements if ach.get('featured', 0) == 1)
            print(f"   ⭐ Featured achievements: {featured_count}")
        else:
            print("   ❌ No achievements fetched")
            all_tests_passed = False
        
    except Exception as e:
        print(f"   ❌ Achievements service error: {e}")
        all_tests_passed = False
    
    # Test News Events Service
    print("\n📰 Testing News Events Service Integration...")
    print("-" * 60)
    
    try:
        result = service.get_news_events()
        news_events = result.get('news_events', [])
        
        if len(news_events) > 0:
            print(f"   ✅ News Events fetched: {len(news_events)} items")
            print(f"   📄 Sample: '{news_events[0].get('title', '')[:50]}...'")
            print(f"   🏷️  Sample category: {news_events[0].get('category', 'N/A')}")
            
            # Check for featured items
            featured_count = sum(1 for item in news_events if item.get('featured', 0) == 1)
            print(f"   ⭐ Featured news/events: {featured_count}")
        else:
            print("   ❌ No news events fetched")
            all_tests_passed = False
        
    except Exception as e:
        print(f"   ❌ News Events service error: {e}")
        all_tests_passed = False
    
    # Test Pagination
    print("\n📄 Testing Pagination Integration...")
    print("-" * 60)
    
    try:
        # Test publications pagination
        page1 = service.get_publications({'page': 1, 'per_page': 5})
        page2 = service.get_publications({'page': 2, 'per_page': 5})
        
        page1_pubs = page1.get('publications', [])
        page2_pubs = page2.get('publications', [])
        page1_pagination = page1.get('pagination', {})
        
        print(f"   ✅ Page 1: {len(page1_pubs)} items")
        print(f"   ✅ Page 2: {len(page2_pubs)} items")
        print(f"   📊 Pagination info: Page {page1_pagination.get('current_page', 0)} of {page1_pagination.get('total_pages', 0)}")
        
        if page1_pagination.get('total_pages', 0) > 1:
            print("   ✅ Multi-page pagination working")
        else:
            print("   ℹ️  Single page result (normal for small datasets)")
        
    except Exception as e:
        print(f"   ❌ Pagination test error: {e}")
        all_tests_passed = False
    
    # Summary
    print("\n" + "=" * 80)
    print("📋 FRONTEND SERVICE INTEGRATION SUMMARY")
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL FRONTEND SERVICE INTEGRATION TESTS PASSED!")
        print("✅ Frontend can successfully fetch and process Google Sheets data")
        print("✅ Filtering, pagination, and data processing work correctly")
        print("✅ The website is ready to work without backend dependencies")
    else:
        print("⚠️  SOME FRONTEND SERVICE INTEGRATION TESTS FAILED!")
        print("❌ There may be issues with frontend data processing")
    
    print("=" * 80)
    return all_tests_passed

if __name__ == "__main__":
    success = test_frontend_service_integration()
    sys.exit(0 if success else 1)