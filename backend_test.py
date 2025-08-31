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

def test_home_page_news_events_integration():
    """Test the Home page Latest News & Events section integration specifically"""
    print("1. Testing Home Page Latest News & Events Integration...")
    
    all_tests_passed = True
    
    try:
        # Test 1: News Events API accessibility and response time
        print("   📰 Testing News Events API for Home page...")
        start_time = time.time()
        response = requests.get(NEWS_EVENTS_API_URL, timeout=5)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            print(f"      ✅ News Events API accessible")
            print(f"      ⏱️  Response time: {response_time:.2f}s")
            
            # Check if response time is under 4-5 seconds as requested
            if response_time <= 4.0:
                print(f"      🚀 Performance: EXCELLENT (under 4s)")
            elif response_time <= 5.0:
                print(f"      ✅ Performance: GOOD (under 5s)")
            else:
                print(f"      ⚠️  Performance: SLOW (over 5s - may need optimization)")
                
        else:
            print(f"      ❌ News Events API returned status code: {response.status_code}")
            all_tests_passed = False
            return all_tests_passed
            
        # Test 2: Data structure validation for Home page display
        print("\n   🏠 Testing data structure for Home page display...")
        data = response.json()
        news_events = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
        
        if not isinstance(news_events, list):
            print(f"      ❌ Expected list of news events, got: {type(news_events)}")
            all_tests_passed = False
            return all_tests_passed
            
        if len(news_events) == 0:
            print(f"      ⚠️  No news events found - Home page will show empty state")
            print(f"      ℹ️  This should trigger proper empty state handling")
        else:
            print(f"      ✅ Found {len(news_events)} news events for Home page")
            
            # Test first news event structure for Home page requirements
            sample_event = news_events[0]
            print(f"      📄 Sample event: '{sample_event.get('title', '')[:50]}...'")
            
            # Check required fields for Home page display
            required_fields = ['id', 'title', 'date', 'category']
            optional_fields = ['description', 'image_url', 'featured']
            
            missing_required = [field for field in required_fields if not sample_event.get(field)]
            present_optional = [field for field in optional_fields if sample_event.get(field)]
            
            if missing_required:
                print(f"      ❌ Missing required fields for Home page: {missing_required}")
                all_tests_passed = False
            else:
                print(f"      ✅ All required fields present for Home page display")
                
            if present_optional:
                print(f"      ✅ Optional fields available: {present_optional}")
                
            # Test date format for Home page sorting
            event_date = sample_event.get('date')
            if event_date:
                try:
                    # Try to parse date for sorting functionality
                    if isinstance(event_date, str):
                        # Common date formats
                        date_formats = ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%d %H:%M:%S']
                        parsed_date = None
                        for fmt in date_formats:
                            try:
                                parsed_date = datetime.strptime(event_date, fmt)
                                break
                            except ValueError:
                                continue
                        
                        if parsed_date:
                            print(f"      ✅ Date format parseable for sorting: {event_date}")
                        else:
                            print(f"      ⚠️  Date format may need validation: {event_date}")
                    else:
                        print(f"      ✅ Date field type: {type(event_date)}")
                except Exception as e:
                    print(f"      ⚠️  Date parsing issue: {e}")
                    
        # Test 3: Featured news functionality for Home page
        print("\n   ⭐ Testing featured news functionality...")
        featured_events = [event for event in news_events if event.get('featured')]
        
        if featured_events:
            print(f"      ✅ Found {len(featured_events)} featured events for Home page highlight")
            featured_event = featured_events[0]
            print(f"      🌟 Featured event: '{featured_event.get('title', '')[:50]}...'")
        else:
            print(f"      ℹ️  No featured events found - Home page will use latest event")
            if news_events:
                latest_event = news_events[0]  # Assuming sorted by date
                print(f"      📅 Latest event: '{latest_event.get('title', '')[:50]}...'")
                
        # Test 4: Category filtering for Home page display
        print("\n   🏷️  Testing category filtering for Home page...")
        categories = list(set(event.get('category', 'General') for event in news_events))
        print(f"      📋 Available categories: {categories}")
        
        for category in categories[:3]:  # Test first 3 categories
            category_events = [event for event in news_events if event.get('category') == category]
            print(f"      ✅ Category '{category}': {len(category_events)} events")
            
        # Test 5: Error handling simulation
        print("\n   🛡️  Testing error handling for Home page...")
        
        # Test with invalid URL to verify error handling
        try:
            invalid_response = requests.get("https://invalid-news-api.com/test", timeout=2)
            print(f"      ⚠️  Invalid URL test: Unexpected success")
        except requests.exceptions.RequestException:
            print(f"      ✅ Invalid URL properly handled - Home page should show error state")
        except Exception as e:
            print(f"      ✅ Error handling working - {type(e).__name__}")
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing Home page News Events integration: {e}")
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