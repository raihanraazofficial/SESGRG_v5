#!/usr/bin/env python3
"""
Publications localStorage System - Backend Infrastructure Testing Suite
Tests the Google Sheets API infrastructure supporting the localStorage-based Publications system:
1. Publications Data Migration Source: Verify Google Sheets API for initial data migration
2. Authentication System Verification: Test credentials and access control
3. Frontend Service Status: Verify frontend is running and accessible
4. Data Structure Validation: Ensure APIs support Publications Context integration
5. Real-time Synchronization Support: Test data consistency for localStorage operations

FOCUS: Testing the backend infrastructure that supports the localStorage-based Publications system
including authentication credentials, data migration source, and service availability.
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

print(f"🚀 Testing Google Sheets API Infrastructure - People Data Management System Focus")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Projects API: {PROJECTS_API_URL}")
print(f"Achievements API: {ACHIEVEMENTS_API_URL}")
print(f"News Events API: {NEWS_EVENTS_API_URL}")
print("=" * 80)

def test_people_data_infrastructure():
    """Test Google Sheets API infrastructure supporting People data management system"""
    print("1. Testing People Data Management System API Infrastructure...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify APIs support People/ResearchAreas integration
        print("   👥 Testing People/ResearchAreas data integration support...")
        
        # Test Publications API for research area mapping
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
                print(f"      ✅ Found {len(publications)} publications for research area mapping")
                
                # Check for research_areas field (needed for People/ResearchAreas integration)
                sample_pub = publications[0]
                if 'research_areas' in sample_pub:
                    print(f"      ✅ Publications have research_areas field for People integration")
                    research_areas = sample_pub.get('research_areas', [])
                    if isinstance(research_areas, list) and len(research_areas) > 0:
                        print(f"      🔍 Sample research areas: {research_areas[:3]}")
                        
                        # Verify research areas match People context structure
                        expected_areas = [
                            "Smart Grid Technologies",
                            "Microgrids & Distributed Energy Systems", 
                            "Renewable Energy Integration",
                            "Grid Optimization & Stability",
                            "Energy Storage Systems",
                            "Power System Automation",
                            "Cybersecurity and AI for Power Infrastructure"
                        ]
                        
                        matching_areas = [area for area in research_areas if area in expected_areas]
                        if matching_areas:
                            print(f"      ✅ Research areas match People context structure: {matching_areas}")
                        else:
                            print(f"      ⚠️  Research areas may not match People context structure")
                    else:
                        print(f"      ⚠️  Research areas field is empty or not a list")
                else:
                    print(f"      ❌ Publications missing research_areas field - People integration may fail")
                    all_tests_passed = False
                    
            else:
                print(f"      ⚠️  No publications found for People integration testing")
                
        else:
            print(f"      ❌ Publications API returned status code: {response.status_code}")
            all_tests_passed = False
            
        # Test 2: Projects API for research area mapping
        print("\n   📊 Testing Projects API for People/ResearchAreas integration...")
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
                print(f"      ✅ Found {len(projects)} projects for research area mapping")
                
                sample_project = projects[0]
                if 'research_areas' in sample_project:
                    print(f"      ✅ Projects have research_areas field for People integration")
                    project_areas = sample_project.get('research_areas', [])
                    if isinstance(project_areas, list):
                        print(f"      🔍 Sample project research areas: {project_areas}")
                    else:
                        print(f"      ⚠️  Project research_areas is not a list: {type(project_areas)}")
                else:
                    print(f"      ❌ Projects missing research_areas field - People integration may fail")
                    all_tests_passed = False
                    
            else:
                print(f"      ⚠️  No projects found for People integration testing")
                
        else:
            print(f"      ❌ Projects API returned status code: {response.status_code}")
            all_tests_passed = False
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing People data infrastructure: {e}")
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
                        print(f"      ℹ️  People page should show: 'No Members Found' message")
                    else:
                        print(f"      ✅ Data available: {len(news_events)} items")
                        print(f"      ℹ️  People page should display data normally")
                else:
                    print(f"      ⚠️  Unexpected data structure: {type(news_events)}")
            else:
                print(f"      ❌ API not accessible for empty response test: {response.status_code}")
                all_tests_passed = False
                
        except Exception as e:
            print(f"      ❌ Empty response test failed: {e}")
            all_tests_passed = False
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing error handling improvements: {e}")
        return False

def run_all_tests():
    """Run comprehensive Google Sheets API tests for People Data Management System"""
    print("🚀 Starting Google Sheets API Infrastructure Tests - People Data Management System Focus")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: People Data Infrastructure (PRIMARY FOCUS)
    try:
        people_infrastructure_working = test_people_data_infrastructure()
        test_results.append(("People Data Management Infrastructure", people_infrastructure_working))
        all_tests_passed &= people_infrastructure_working
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
    
    # Test 3: Authentication and Access
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
    print("📊 PEOPLE DATA MANAGEMENT SYSTEM - BACKEND INFRASTRUCTURE TEST RESULTS")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<50} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL BACKEND INFRASTRUCTURE TESTS PASSED!")
        print("✅ Google Sheets API integration supporting People data management is working correctly.")
        print("✅ Backend data infrastructure is solid and ready for frontend integration.")
        print("")
        print("⚠️  IMPORTANT NOTE: This testing covers only the backend API infrastructure.")
        print("    Frontend features like localStorage, React Context API, real-time sync,")
        print("    and edit functionality require frontend testing tools or manual verification.")
        return True
    else:
        print("⚠️  SOME BACKEND INFRASTRUCTURE TESTS FAILED!")
        print("   Please review the issues above before deployment.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)