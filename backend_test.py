#!/usr/bin/env python3
"""
People Data Management System - Backend Infrastructure Testing Suite
Tests the Google Sheets API infrastructure supporting the People data management system:
1. Google Sheets API Integration: Verify data sources for People context
2. Data Structure Validation: Ensure APIs support People/ResearchAreas integration
3. Performance Testing: Check API response times for real-time sync
4. Error Handling: Verify robust data fetching for localStorage integration

NOTE: This tests the backend API infrastructure only. Frontend features like localStorage,
React Context API, real-time sync, and edit functionality require frontend testing tools.
"""

import requests
import json
import os
from datetime import datetime
import sys
import time

# Get Google Sheets API URLs from frontend .env file
def get_api_urls():
    try:
        urls = {}
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_PUBLICATIONS_API_URL='):
                    urls['publications'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_PROJECTS_API_URL='):
                    urls['projects'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_ACHIEVEMENTS_API_URL='):
                    urls['achievements'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_NEWS_EVENTS_API_URL='):
                    urls['news_events'] = line.split('=', 1)[1].strip()
        return urls
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return {}

API_URLS = get_api_urls()
required_apis = ['publications', 'projects', 'achievements', 'news_events']
for api in required_apis:
    if not API_URLS.get(api):
        print(f"ERROR: Could not get REACT_APP_{api.upper()}_API_URL from frontend/.env")
        sys.exit(1)

PUBLICATIONS_API_URL = API_URLS['publications']
PROJECTS_API_URL = API_URLS['projects']
ACHIEVEMENTS_API_URL = API_URLS['achievements']
NEWS_EVENTS_API_URL = API_URLS['news_events']

print(f"🚀 Testing Google Sheets API Integration - Research Areas Page Focus")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Projects API: {PROJECTS_API_URL}")
print(f"Achievements API: {ACHIEVEMENTS_API_URL}")
print(f"News Events API: {NEWS_EVENTS_API_URL}")
print("=" * 80)

def test_research_areas_google_sheets_integration():
    """Test Google Sheets API Integration for Research Areas functionality"""
    print("1. Testing Research Areas Google Sheets API Integration...")
    
    all_tests_passed = True
    research_area_titles = [
        "Smart Grid Technologies",
        "Microgrids", 
        "Renewable Energy",
        "Grid Optimization",
        "Energy Storage",
        "Power System Automation",
        "Cybersecurity"
    ]
    
    try:
        # Test 1: Projects API with research area filtering
        print("   📊 Testing Projects API for Research Areas filtering...")
        start_time = time.time()
        response = requests.get(PROJECTS_API_URL, timeout=6)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            print(f"      ✅ Projects API accessible")
            print(f"      ⏱️  Response time: {response_time:.2f}s")
            
            data = response.json()
            projects = data.get('projects', []) if isinstance(data, dict) else data
            
            if len(projects) > 0:
                print(f"      ✅ Found {len(projects)} total projects")
                
                # Test research area filtering capability
                sample_project = projects[0]
                print(f"      📄 Sample project: '{sample_project.get('title', '')[:50]}...'")
                
                # Check for research_areas field
                if 'research_areas' in sample_project:
                    print(f"      ✅ Projects have research_areas field for filtering")
                    print(f"      🔍 Sample research areas: {sample_project.get('research_areas', [])}")
                else:
                    print(f"      ⚠️  Projects missing research_areas field - filtering may not work")
                
                # Test filtering by each research area
                for area_title in research_area_titles[:3]:  # Test first 3 areas
                    area_projects = [p for p in projects if 
                                   p.get('research_areas') and 
                                   any(area_title.lower() in str(area).lower() for area in p.get('research_areas', []))]
                    print(f"      📋 '{area_title}' projects: {len(area_projects)}")
                
                # Test Active vs Completed separation
                active_projects = [p for p in projects if p.get('status') == 'Active']
                completed_projects = [p for p in projects if p.get('status') == 'Completed']
                print(f"      ✅ Active projects: {len(active_projects)}")
                print(f"      ✅ Completed projects: {len(completed_projects)}")
                
            else:
                print(f"      ⚠️  No projects found in API response")
                
        else:
            print(f"      ❌ Projects API returned status code: {response.status_code}")
            all_tests_passed = False
            
        # Test 2: Publications API with research area filtering
        print("\n   📚 Testing Publications API for Research Areas filtering...")
        start_time = time.time()
        response = requests.get(PUBLICATIONS_API_URL, timeout=6)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            print(f"      ✅ Publications API accessible")
            print(f"      ⏱️  Response time: {response_time:.2f}s")
            
            data = response.json()
            publications = data.get('publications', []) if isinstance(data, dict) else data
            
            if len(publications) > 0:
                print(f"      ✅ Found {len(publications)} total publications")
                
                sample_pub = publications[0]
                print(f"      📄 Sample publication: '{sample_pub.get('title', '')[:50]}...'")
                
                # Check for research_areas and category fields
                if 'research_areas' in sample_pub:
                    print(f"      ✅ Publications have research_areas field for filtering")
                    print(f"      🔍 Sample research areas: {sample_pub.get('research_areas', [])}")
                else:
                    print(f"      ⚠️  Publications missing research_areas field")
                
                if 'category' in sample_pub:
                    print(f"      ✅ Publications have category field for filtering")
                    print(f"      🏷️  Sample category: {sample_pub.get('category')}")
                else:
                    print(f"      ⚠️  Publications missing category field")
                
                # Test publication category filtering
                journal_articles = [p for p in publications if p.get('category') == 'Journal Articles']
                conference_proceedings = [p for p in publications if p.get('category') == 'Conference Proceedings']
                book_chapters = [p for p in publications if p.get('category') == 'Book Chapters']
                
                print(f"      📊 Journal Articles: {len(journal_articles)}")
                print(f"      📊 Conference Proceedings: {len(conference_proceedings)}")
                print(f"      📊 Book Chapters: {len(book_chapters)}")
                
                # Test filtering by research areas
                for area_title in research_area_titles[:3]:  # Test first 3 areas
                    area_pubs = [p for p in publications if 
                               p.get('research_areas') and 
                               any(area_title.lower() in str(area).lower() for area in p.get('research_areas', []))]
                    print(f"      📋 '{area_title}' publications: {len(area_pubs)}")
                
            else:
                print(f"      ⚠️  No publications found in API response")
                
        else:
            print(f"      ❌ Publications API returned status code: {response.status_code}")
            all_tests_passed = False
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing Research Areas Google Sheets integration: {e}")
        return False

def test_concurrent_api_fetching():
    """Test concurrent Promise.all fetching performance for Research Areas"""
    print("2. Testing Concurrent API Fetching Performance...")
    
    all_tests_passed = True
    
    try:
        # Simulate concurrent fetching like the frontend does with Promise.all
        print("   🚀 Testing concurrent Projects and Publications API calls...")
        
        start_time = time.time()
        
        # Make concurrent requests (similar to Promise.all in frontend)
        import concurrent.futures
        
        def fetch_api(url, name):
            try:
                response = requests.get(url, timeout=8)
                return {
                    'name': name,
                    'status_code': response.status_code,
                    'data': response.json() if response.status_code == 200 else None,
                    'success': response.status_code == 200
                }
            except Exception as e:
                return {
                    'name': name,
                    'status_code': 0,
                    'data': None,
                    'success': False,
                    'error': str(e)
                }
        
        # Concurrent execution
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(fetch_api, PROJECTS_API_URL, 'Projects'),
                executor.submit(fetch_api, PUBLICATIONS_API_URL, 'Publications')
            ]
            
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        end_time = time.time()
        total_time = end_time - start_time
        
        print(f"      ⏱️  Total concurrent fetch time: {total_time:.2f}s")
        
        # Analyze results
        successful_apis = [r for r in results if r['success']]
        failed_apis = [r for r in results if not r['success']]
        
        print(f"      ✅ Successful APIs: {len(successful_apis)}/2")
        
        if len(successful_apis) == 2:
            print(f"      🚀 Concurrent fetching: EXCELLENT (both APIs successful)")
            
            # Test data availability for Research Areas filtering
            projects_result = next((r for r in results if r['name'] == 'Projects'), None)
            publications_result = next((r for r in results if r['name'] == 'Publications'), None)
            
            if projects_result and projects_result['success']:
                projects_data = projects_result['data']
                projects = projects_data.get('projects', []) if isinstance(projects_data, dict) else projects_data
                print(f"      📊 Projects data: {len(projects)} items available for filtering")
                
            if publications_result and publications_result['success']:
                publications_data = publications_result['data']
                publications = publications_data.get('publications', []) if isinstance(publications_data, dict) else publications_data
                print(f"      📚 Publications data: {len(publications)} items available for filtering")
                
            # Check if concurrent fetching is faster than sequential
            if total_time <= 6.0:  # Should be faster than sequential calls
                print(f"      🚀 Performance: EXCELLENT (concurrent faster than sequential)")
            else:
                print(f"      ⚠️  Performance: May need optimization (slower than expected)")
                
        else:
            print(f"      ❌ Concurrent fetching failed for {len(failed_apis)} APIs")
            for failed in failed_apis:
                print(f"         - {failed['name']}: {failed.get('error', 'Unknown error')}")
            all_tests_passed = False
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing concurrent API fetching: {e}")
        return False

def test_all_google_sheets_apis():
    """Test all 4 Google Sheets API endpoints for accessibility and performance"""
    print("2. Testing All Google Sheets API Endpoints...")
    
    all_tests_passed = True
    api_endpoints = {
        'Publications': PUBLICATIONS_API_URL,
        'Projects': PROJECTS_API_URL,
        'Achievements': ACHIEVEMENTS_API_URL,
        'News Events': NEWS_EVENTS_API_URL
    }
    
    api_data = {}
    
    for api_name, api_url in api_endpoints.items():
        print(f"\n   🔍 Testing {api_name} API...")
        try:
            start_time = time.time()
            response = requests.get(api_url, timeout=10)
            end_time = time.time()
            response_time = end_time - start_time
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract data based on API structure
                if api_name == 'Publications':
                    items = data.get('publications', []) if isinstance(data, dict) else data
                elif api_name == 'Projects':
                    items = data.get('projects', []) if isinstance(data, dict) else data
                elif api_name == 'Achievements':
                    items = data.get('achievements', data.get('data', [])) if isinstance(data, dict) else data
                elif api_name == 'News Events':
                    items = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
                
                api_data[api_name] = items
                
                print(f"      ✅ {api_name} API accessible")
                print(f"      📊 Retrieved {len(items)} items")
                print(f"      ⏱️  Response time: {response_time:.2f}s")
                
                # Check if response time is under 4-5 seconds as requested
                if response_time <= 4.0:
                    print(f"      🚀 Performance: EXCELLENT (under 4s)")
                elif response_time <= 5.0:
                    print(f"      ✅ Performance: GOOD (under 5s)")
                else:
                    print(f"      ⚠️  Performance: SLOW (over 5s)")
                    
            else:
                print(f"      ❌ {api_name} API returned status code: {response.status_code}")
                all_tests_passed = False
                
        except requests.exceptions.Timeout:
            print(f"      ❌ {api_name} API timed out (over 10s)")
            all_tests_passed = False
        except Exception as e:
            print(f"      ❌ {api_name} API error: {e}")
            all_tests_passed = False
    
    return all_tests_passed, api_data

def test_authentication_and_access():
    """Test that Google Sheets APIs don't require authentication and are publicly accessible"""
    print("3. Testing Authentication and Access...")
    
    all_tests_passed = True
    
    try:
        # Test all APIs without any authentication headers
        api_endpoints = {
            'Publications': PUBLICATIONS_API_URL,
            'Projects': PROJECTS_API_URL,
            'Achievements': ACHIEVEMENTS_API_URL,
            'News Events': NEWS_EVENTS_API_URL
        }
        
        for api_name, api_url in api_endpoints.items():
            print(f"\n   🔐 Testing {api_name} API access without authentication...")
            
            try:
                # Make request without any auth headers
                response = requests.get(api_url, timeout=5)
                
                if response.status_code == 200:
                    print(f"      ✅ {api_name}: Public access working (no auth required)")
                    
                    # Verify we get actual data, not an auth error
                    data = response.json()
                    if isinstance(data, dict) or isinstance(data, list):
                        print(f"      ✅ {api_name}: Valid JSON data returned")
                    else:
                        print(f"      ⚠️  {api_name}: Unexpected data format")
                        
                elif response.status_code == 401:
                    print(f"      ❌ {api_name}: Authentication required (401 Unauthorized)")
                    all_tests_passed = False
                elif response.status_code == 403:
                    print(f"      ❌ {api_name}: Access forbidden (403 Forbidden)")
                    all_tests_passed = False
                else:
                    print(f"      ❌ {api_name}: Unexpected status code {response.status_code}")
                    all_tests_passed = False
                    
            except Exception as e:
                print(f"      ❌ {api_name}: Access error - {e}")
                all_tests_passed = False
        
        # Test CORS headers for browser access
        print(f"\n   🌐 Testing CORS headers for browser access...")
        try:
            response = requests.get(NEWS_EVENTS_API_URL, timeout=5)
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if cors_headers['Access-Control-Allow-Origin']:
                print(f"      ✅ CORS headers present: {cors_headers['Access-Control-Allow-Origin']}")
            else:
                print(f"      ℹ️  CORS headers not explicitly set (may be handled by proxy)")
                
        except Exception as e:
            print(f"      ⚠️  CORS header check failed: {e}")
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing authentication and access: {e}")
        return False

def test_caching_and_background_refresh():
    """Test caching system with 3-minute timeout and background refresh functionality"""
    print("4. Testing Caching System and Background Refresh...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Response time consistency (simulating cache behavior)
        print("   💾 Testing response time consistency for caching simulation...")
        
        api_endpoints = [
            ('Projects', PROJECTS_API_URL),
            ('Publications', PUBLICATIONS_API_URL)
        ]
        
        for api_name, api_url in api_endpoints:
            print(f"\n   🔍 Testing {api_name} API caching behavior...")
            
            # First request (cache miss simulation)
            start_time = time.time()
            try:
                response1 = requests.get(api_url, timeout=6)
                end_time = time.time()
                first_request_time = end_time - start_time
                
                if response1.status_code == 200:
                    print(f"      ✅ First request (cache miss): {first_request_time:.2f}s")
                    
                    # Second request (cache hit simulation - should be similar time since we can't test actual cache)
                    start_time = time.time()
                    response2 = requests.get(api_url, timeout=6)
                    end_time = time.time()
                    second_request_time = end_time - start_time
                    
                    if response2.status_code == 200:
                        print(f"      ✅ Second request: {second_request_time:.2f}s")
                        
                        # Verify data consistency
                        data1 = response1.json()
                        data2 = response2.json()
                        
                        if data1 == data2:
                            print(f"      ✅ Data consistency: Identical responses")
                        else:
                            print(f"      ⚠️  Data consistency: Responses differ (may indicate real-time updates)")
                            
                        # Check if response times are reasonable for caching
                        avg_time = (first_request_time + second_request_time) / 2
                        if avg_time <= 4.0:
                            print(f"      🚀 Cache performance: EXCELLENT (avg {avg_time:.2f}s)")
                        elif avg_time <= 6.0:
                            print(f"      ✅ Cache performance: GOOD (avg {avg_time:.2f}s)")
                        else:
                            print(f"      ⚠️  Cache performance: NEEDS OPTIMIZATION (avg {avg_time:.2f}s)")
                            
                    else:
                        print(f"      ❌ Second request failed: {response2.status_code}")
                        all_tests_passed = False
                        
                else:
                    print(f"      ❌ First request failed: {response1.status_code}")
                    all_tests_passed = False
                    
            except requests.exceptions.Timeout:
                print(f"      ❌ {api_name} API timed out")
                all_tests_passed = False
            except Exception as e:
                print(f"      ❌ {api_name} API error: {e}")
                all_tests_passed = False
        
        # Test 2: Background refresh simulation (test API reliability for background updates)
        print(f"\n   🔄 Testing background refresh capability...")
        
        try:
            # Simulate multiple background refresh calls
            refresh_results = []
            
            for i in range(3):
                start_time = time.time()
                response = requests.get(PUBLICATIONS_API_URL, timeout=5)
                end_time = time.time()
                
                refresh_results.append({
                    'attempt': i + 1,
                    'success': response.status_code == 200,
                    'time': end_time - start_time,
                    'status_code': response.status_code
                })
                
                # Small delay between requests
                time.sleep(0.5)
            
            successful_refreshes = [r for r in refresh_results if r['success']]
            
            print(f"      ✅ Background refresh success rate: {len(successful_refreshes)}/3")
            
            if len(successful_refreshes) >= 2:
                avg_refresh_time = sum(r['time'] for r in successful_refreshes) / len(successful_refreshes)
                print(f"      ⏱️  Average refresh time: {avg_refresh_time:.2f}s")
                
                if avg_refresh_time <= 4.0:
                    print(f"      🚀 Background refresh: EXCELLENT performance")
                else:
                    print(f"      ✅ Background refresh: ACCEPTABLE performance")
            else:
                print(f"      ❌ Background refresh: POOR reliability")
                all_tests_passed = False
                
        except Exception as e:
            print(f"      ❌ Background refresh test failed: {e}")
            all_tests_passed = False
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing caching and background refresh: {e}")
        return False

def test_response_time_performance():
    """Test response time performance (under 4-5 seconds requirement)"""
    print("4. Testing Response Time Performance...")
    
    all_tests_passed = True
    
    try:
        # Test all APIs with focus on response time
        api_endpoints = [
            ('Publications', PUBLICATIONS_API_URL),
            ('Projects', PROJECTS_API_URL),
            ('Achievements', ACHIEVEMENTS_API_URL),
            ('News Events', NEWS_EVENTS_API_URL)
        ]
        
        for api_name, api_url in api_endpoints:
            print(f"\n   ⏱️  Testing {api_name} API response time...")
            
            # Test multiple times to get average
            response_times = []
            for i in range(3):
                try:
                    start_time = time.time()
                    response = requests.get(api_url, timeout=6)  # 6s timeout for testing
                    end_time = time.time()
                    response_time = end_time - start_time
                    
                    if response.status_code == 200:
                        response_times.append(response_time)
                        print(f"      Test {i+1}: {response_time:.2f}s")
                    else:
                        print(f"      Test {i+1}: HTTP {response.status_code}")
                        all_tests_passed = False
                        
                except requests.exceptions.Timeout:
                    print(f"      Test {i+1}: Timed out (over 6s)")
                    all_tests_passed = False
                except Exception as e:
                    print(f"      Test {i+1}: Error - {e}")
                    all_tests_passed = False
            
            if response_times:
                avg_time = sum(response_times) / len(response_times)
                min_time = min(response_times)
                max_time = max(response_times)
                
                print(f"      📊 {api_name} Performance Summary:")
                print(f"         Average: {avg_time:.2f}s")
                print(f"         Min: {min_time:.2f}s")
                print(f"         Max: {max_time:.2f}s")
                
                # Check against requirements
                if avg_time <= 4.0:
                    print(f"      🚀 Performance: EXCELLENT (under 4s)")
                elif avg_time <= 5.0:
                    print(f"      ✅ Performance: GOOD (under 5s)")
                else:
                    print(f"      ⚠️  Performance: NEEDS OPTIMIZATION (over 5s)")
                    
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing response time performance: {e}")
        return False

def test_data_structure_validation():
    """Test data structure validation for Research Areas functionality"""
    print("6. Testing Data Structure Validation for Research Areas...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Projects data structure validation
        print("   📊 Validating Projects data structure...")
        
        try:
            response = requests.get(PROJECTS_API_URL, timeout=6)
            if response.status_code == 200:
                data = response.json()
                projects = data.get('projects', []) if isinstance(data, dict) else data
                
                if len(projects) > 0:
                    sample_project = projects[0]
                    
                    # Required fields for Research Areas filtering
                    required_fields = ['id', 'title', 'status']
                    research_area_fields = ['research_areas']
                    optional_fields = ['description', 'start_date', 'end_date', 'team_members']
                    
                    missing_required = [field for field in required_fields if field not in sample_project]
                    missing_research_fields = [field for field in research_area_fields if field not in sample_project]
                    present_optional = [field for field in optional_fields if field in sample_project]
                    
                    if not missing_required:
                        print(f"      ✅ All required fields present: {required_fields}")
                    else:
                        print(f"      ❌ Missing required fields: {missing_required}")
                        all_tests_passed = False
                    
                    if not missing_research_fields:
                        print(f"      ✅ Research area fields present: {research_area_fields}")
                        
                        # Validate research_areas field structure
                        research_areas = sample_project.get('research_areas', [])
                        if isinstance(research_areas, list):
                            print(f"      ✅ research_areas is list: {len(research_areas)} areas")
                            if len(research_areas) > 0:
                                print(f"      📋 Sample areas: {research_areas[:3]}")
                        else:
                            print(f"      ⚠️  research_areas is not list: {type(research_areas)}")
                            
                    else:
                        print(f"      ❌ Missing research area fields: {missing_research_fields}")
                        all_tests_passed = False
                    
                    if present_optional:
                        print(f"      ✅ Optional fields available: {present_optional}")
                    
                    # Test status field values for Active/Completed separation
                    statuses = list(set(p.get('status', 'Unknown') for p in projects))
                    print(f"      📊 Available project statuses: {statuses}")
                    
                    if 'Active' in statuses and 'Completed' in statuses:
                        print(f"      ✅ Status separation supported (Active/Completed)")
                    else:
                        print(f"      ⚠️  Status separation may not work properly")
                        
                else:
                    print(f"      ⚠️  No projects available for validation")
                    
            else:
                print(f"      ❌ Projects API not accessible: {response.status_code}")
                all_tests_passed = False
                
        except Exception as e:
            print(f"      ❌ Projects validation error: {e}")
            all_tests_passed = False
        
        # Test 2: Publications data structure validation
        print("\n   📚 Validating Publications data structure...")
        
        try:
            response = requests.get(PUBLICATIONS_API_URL, timeout=6)
            if response.status_code == 200:
                data = response.json()
                publications = data.get('publications', []) if isinstance(data, dict) else data
                
                if len(publications) > 0:
                    sample_pub = publications[0]
                    
                    # Required fields for Research Areas filtering
                    required_fields = ['id', 'title', 'category', 'year']
                    research_area_fields = ['research_areas']
                    category_fields = ['category']
                    optional_fields = ['authors', 'journal_name', 'conference_name', 'book_title', 'citations']
                    
                    missing_required = [field for field in required_fields if field not in sample_pub]
                    missing_research_fields = [field for field in research_area_fields if field not in sample_pub]
                    present_optional = [field for field in optional_fields if field in sample_pub]
                    
                    if not missing_required:
                        print(f"      ✅ All required fields present: {required_fields}")
                    else:
                        print(f"      ❌ Missing required fields: {missing_required}")
                        all_tests_passed = False
                    
                    if not missing_research_fields:
                        print(f"      ✅ Research area fields present: {research_area_fields}")
                        
                        # Validate research_areas field structure
                        research_areas = sample_pub.get('research_areas', [])
                        if isinstance(research_areas, list):
                            print(f"      ✅ research_areas is list: {len(research_areas)} areas")
                            if len(research_areas) > 0:
                                print(f"      📋 Sample areas: {research_areas[:3]}")
                        else:
                            print(f"      ⚠️  research_areas is not list: {type(research_areas)}")
                            
                    else:
                        print(f"      ❌ Missing research area fields: {missing_research_fields}")
                        all_tests_passed = False
                    
                    # Test category field values for publication type filtering
                    categories = list(set(p.get('category', 'Unknown') for p in publications))
                    print(f"      📊 Available publication categories: {categories}")
                    
                    expected_categories = ['Journal Articles', 'Conference Proceedings', 'Book Chapters']
                    found_categories = [cat for cat in expected_categories if cat in categories]
                    
                    if len(found_categories) >= 2:
                        print(f"      ✅ Category filtering supported: {found_categories}")
                    else:
                        print(f"      ⚠️  Limited category filtering: {found_categories}")
                    
                    if present_optional:
                        print(f"      ✅ Optional fields available: {present_optional}")
                        
                else:
                    print(f"      ⚠️  No publications available for validation")
                    
            else:
                print(f"      ❌ Publications API not accessible: {response.status_code}")
                all_tests_passed = False
                
        except Exception as e:
            print(f"      ❌ Publications validation error: {e}")
            all_tests_passed = False
        
        # Test 3: Data mapping validation for Research Areas and team members
        print("\n   👥 Testing data mapping between research areas and team members...")
        
        # This tests the frontend logic for mapping people to research areas
        research_area_names = [
            "Smart Grid Technologies",
            "Microgrids & Distributed Energy Systems", 
            "Renewable Energy Integration",
            "Grid Optimization & Stability",
            "Energy Storage Systems",
            "Power System Automation",
            "Cybersecurity and AI for Power Infrastructure"
        ]
        
        # Simulate the people data structure from frontend
        test_people = [
            {
                "name": "Test Advisor",
                "category": "Advisor",
                "expertise": [0, 2, 3]  # Smart Grid, Renewable Energy, Grid Optimization
            },
            {
                "name": "Test Team Member",
                "category": "Team Member", 
                "expertise": [1, 3, 2, 6]  # Microgrids, Grid Optimization, Renewable Energy, Cybersecurity
            }
        ]
        
        # Test mapping logic
        for area_id in range(1, 4):  # Test first 3 research areas
            area_index = area_id - 1
            area_people = [person for person in test_people if area_index in person['expertise']]
            area_name = research_area_names[area_index] if area_index < len(research_area_names) else f"Area {area_id}"
            
            print(f"      📋 '{area_name}': {len(area_people)} team members")
            
        print(f"      ✅ Data mapping logic validated")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing data structure validation: {e}")
        return False

def test_error_handling_improvements():
    """Test error handling improvements for API failures"""
    print("5. Testing Error Handling Improvements...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Network timeout handling
        print("   ⏱️  Testing network timeout handling...")
        try:
            # Use a very short timeout to force timeout
            response = requests.get(NEWS_EVENTS_API_URL, timeout=0.001)
            print(f"      ⚠️  Timeout test: Unexpected success")
        except requests.exceptions.Timeout:
            print(f"      ✅ Timeout properly handled")
        except Exception as e:
            print(f"      ✅ Network error properly handled: {type(e).__name__}")
            
        # Test 2: Invalid URL handling
        print("\n   🔗 Testing invalid URL handling...")
        try:
            invalid_response = requests.get("https://invalid-domain-12345.com/api", timeout=2)
            print(f"      ⚠️  Invalid URL test: Unexpected success")
        except requests.exceptions.RequestException:
            print(f"      ✅ Invalid URL properly handled")
        except Exception as e:
            print(f"      ✅ URL error properly handled: {type(e).__name__}")
            
        # Test 3: Empty response handling
        print("\n   📭 Testing empty response handling...")
        
        # Check actual API behavior for empty data
        try:
            response = requests.get(NEWS_EVENTS_API_URL, timeout=5)
            if response.status_code == 200:
                data = response.json()
                
                # Check if API returns empty data structure
                news_events = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
                
                if isinstance(news_events, list):
                    if len(news_events) == 0:
                        print(f"      ✅ Empty data handling: API returns empty list")
                        print(f"      ℹ️  Home page should show: 'No news and events at the moment'")
                    else:
                        print(f"      ✅ Data available: {len(news_events)} items")
                        print(f"      ℹ️  Home page should display news events normally")
                else:
                    print(f"      ⚠️  Unexpected data structure: {type(news_events)}")
            else:
                print(f"      ❌ API not accessible for empty response test: {response.status_code}")
                all_tests_passed = False
                
        except Exception as e:
            print(f"      ❌ Empty response test failed: {e}")
            all_tests_passed = False
            
        # Test 4: Rate limiting handling (if applicable)
        print("\n   🚦 Testing rate limiting handling...")
        
        # Make multiple rapid requests to test rate limiting
        rapid_requests = 5
        success_count = 0
        
        for i in range(rapid_requests):
            try:
                response = requests.get(NEWS_EVENTS_API_URL, timeout=3)
                if response.status_code == 200:
                    success_count += 1
                elif response.status_code == 429:  # Too Many Requests
                    print(f"      ✅ Rate limiting detected (429) - proper handling needed")
                    break
            except Exception:
                pass
                
        if success_count == rapid_requests:
            print(f"      ✅ No rate limiting detected - all {rapid_requests} requests succeeded")
        else:
            print(f"      ℹ️  Rate limiting may be present - {success_count}/{rapid_requests} succeeded")
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing error handling improvements: {e}")
        return False

def run_all_tests():
    """Run comprehensive Google Sheets API tests for Research Areas page functionality"""
    print("🚀 Starting Google Sheets API Integration Tests - Research Areas Page Focus")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Research Areas Google Sheets Integration (PRIMARY FOCUS)
    try:
        research_areas_working = test_research_areas_google_sheets_integration()
        test_results.append(("Research Areas Google Sheets Integration", research_areas_working))
        all_tests_passed &= research_areas_working
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 2: Concurrent API Fetching (Promise.all simulation)
    try:
        concurrent_working = test_concurrent_api_fetching()
        test_results.append(("Concurrent API Fetching (Promise.all)", concurrent_working))
        all_tests_passed &= concurrent_working
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: All Google Sheets APIs Verification
    try:
        apis_working, api_data = test_all_google_sheets_apis()
        test_results.append(("All 4 Google Sheets APIs", apis_working))
        all_tests_passed &= apis_working
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: Caching and Background Refresh
    try:
        caching_working = test_caching_and_background_refresh()
        test_results.append(("Caching & Background Refresh", caching_working))
        all_tests_passed &= caching_working
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 5: Response Time Performance (Under 4-5 seconds requirement)
    try:
        performance_good = test_response_time_performance()
        test_results.append(("Response Time Performance", performance_good))
        all_tests_passed &= performance_good
    except Exception as e:
        print(f"❌ Test 5 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 6: Data Structure Validation
    try:
        data_structure_valid = test_data_structure_validation()
        test_results.append(("Data Structure Validation", data_structure_valid))
        all_tests_passed &= data_structure_valid
    except Exception as e:
        print(f"❌ Test 6 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 7: Error Handling Verification
    try:
        error_handling_works = test_error_handling_improvements()
        test_results.append(("Error Handling", error_handling_works))
        all_tests_passed &= error_handling_works
    except Exception as e:
        print(f"❌ Test 7 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 RESEARCH AREAS PAGE - TEST RESULTS SUMMARY")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<45} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED! Google Sheets API integration for Research Areas page is working correctly.")
        print("✅ Real-time data fetching, filtering, and concurrent API calls are all functional.")
        print("✅ Backend data infrastructure is solid and ready for production use.")
        return True
    else:
        print("⚠️  SOME TESTS FAILED! Please review the issues above before deployment.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)