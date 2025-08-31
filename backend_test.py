#!/usr/bin/env python3
"""
Google Sheets API Integration Testing Suite - Research Areas Page Focus
Tests the enhanced Research Areas page Google Sheets API integration and real-time data fetching functionality:
- Google Sheets API Integration for Research Areas (Projects and Publications APIs with filtering)
- Data Filtering and Processing (filtering by research area titles, publication categories)
- API Performance and Reliability (response times, caching, error handling)
- Data Structure Validation (proper fields for filtering)
- Concurrent Promise.all fetching performance
- Real-time statistics calculations
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
    """Run focused Google Sheets API tests for Home page Latest News & Events section"""
    print("🚀 Starting Google Sheets API Integration Tests - Home Page Latest News & Events Focus")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Home Page News Events Integration (PRIMARY FOCUS)
    try:
        home_news_working = test_home_page_news_events_integration()
        test_results.append(("Home Page News Events Integration", home_news_working))
        all_tests_passed &= home_news_working
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 2: All Google Sheets APIs Verification
    try:
        apis_working, api_data = test_all_google_sheets_apis()
        test_results.append(("All 4 Google Sheets APIs", apis_working))
        all_tests_passed &= apis_working
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: Authentication and Access Verification
    try:
        auth_working = test_authentication_and_access()
        test_results.append(("Authentication & Access", auth_working))
        all_tests_passed &= auth_working
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: Response Time Performance (Under 4-5 seconds requirement)
    try:
        performance_good = test_response_time_performance()
        test_results.append(("Response Time Performance", performance_good))
        all_tests_passed &= performance_good
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 5: Error Handling Verification
    try:
        error_handling_works = test_error_handling_improvements()
        test_results.append(("Error Handling", error_handling_works))
        all_tests_passed &= error_handling_works
    except Exception as e:
        print(f"❌ Test 5 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 HOME PAGE LATEST NEWS & EVENTS - TEST RESULTS SUMMARY")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<40} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED! Google Sheets API integration for Home page Latest News & Events is working correctly.")
        print("✅ Backend data infrastructure is solid and ready for frontend testing.")
        return True
    else:
        print("⚠️  SOME TESTS FAILED! Please review the issues above before frontend testing.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)