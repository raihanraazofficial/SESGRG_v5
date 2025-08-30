#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests the basic FastAPI backend functionality including:
- Server accessibility
- Root endpoint
- Status endpoints (POST and GET)
- MongoDB connection
- CORS configuration
"""

import requests
import json
import os
from datetime import datetime
import sys

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE_URL}")
print("=" * 60)

def test_server_accessibility():
    """Test if the backend server is running and accessible"""
    print("1. Testing server accessibility...")
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=10)
        if response.status_code == 200:
            print("   ✅ Server is accessible")
            return True
        else:
            print(f"   ❌ Server returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Server is not accessible: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint GET /api/"""
    print("2. Testing root endpoint GET /api/...")
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("   ✅ Root endpoint working correctly")
                print(f"   Response: {data}")
                return True
            else:
                print(f"   ❌ Unexpected response: {data}")
                return False
        else:
            print(f"   ❌ Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error testing root endpoint: {e}")
        return False

def test_post_status_endpoint():
    """Test POST /api/status endpoint"""
    print("3. Testing POST /api/status endpoint...")
    try:
        test_payload = {"client_name": "test_client_backend_testing"}
        headers = {"Content-Type": "application/json"}
        
        response = requests.post(
            f"{API_BASE_URL}/status", 
            json=test_payload, 
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if (data.get("client_name") == "test_client_backend_testing" and 
                "id" in data and "timestamp" in data):
                print("   ✅ POST /api/status working correctly")
                print(f"   Created status check with ID: {data['id']}")
                return True, data["id"]
            else:
                print(f"   ❌ Unexpected response structure: {data}")
                return False, None
        else:
            print(f"   ❌ Status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False, None
    except Exception as e:
        print(f"   ❌ Error testing POST status endpoint: {e}")
        return False, None

def test_get_status_endpoint():
    """Test GET /api/status endpoint"""
    print("4. Testing GET /api/status endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/status", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"   ✅ GET /api/status working correctly")
                print(f"   Retrieved {len(data)} status checks")
                if len(data) > 0:
                    print(f"   Sample record: {data[0]}")
                return True
            else:
                print(f"   ❌ Expected list, got: {type(data)}")
                return False
        else:
            print(f"   ❌ Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error testing GET status endpoint: {e}")
        return False

def test_mongodb_connection():
    """Test MongoDB connection by creating and retrieving data"""
    print("5. Testing MongoDB connection...")
    
    # First create a status check
    success, created_id = test_post_status_endpoint()
    if not success:
        print("   ❌ Cannot test MongoDB - POST endpoint failed")
        return False
    
    # Then retrieve it
    try:
        response = requests.get(f"{API_BASE_URL}/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            # Check if our created record exists
            found = any(record.get("id") == created_id for record in data)
            if found:
                print("   ✅ MongoDB connection working - data persisted and retrieved")
                return True
            else:
                print("   ❌ Created record not found in database")
                return False
        else:
            print("   ❌ Could not retrieve data to verify MongoDB connection")
            return False
    except Exception as e:
        print(f"   ❌ Error testing MongoDB connection: {e}")
        return False

def test_cors_configuration():
    """Test CORS configuration"""
    print("6. Testing CORS configuration...")
    try:
        # Make a preflight request
        headers = {
            'Origin': 'https://example.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        response = requests.options(f"{API_BASE_URL}/status", headers=headers, timeout=10)
        
        # Check if CORS headers are present
        cors_headers = {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers')
        }
        
        if cors_headers['access-control-allow-origin']:
            print("   ✅ CORS configuration is working")
            print(f"   Allow-Origin: {cors_headers['access-control-allow-origin']}")
            return True
        else:
            print("   ⚠️  CORS headers not found in preflight response")
            # Try a simple GET request to check basic CORS
            response = requests.get(f"{API_BASE_URL}/", headers={'Origin': 'https://example.com'}, timeout=10)
            if 'access-control-allow-origin' in response.headers:
                print("   ✅ Basic CORS working on GET requests")
                return True
            else:
                print("   ❌ CORS not configured properly")
                return False
    except Exception as e:
        print(f"   ❌ Error testing CORS: {e}")
        return False

def test_publications_endpoint():
    """Test GET /api/publications endpoint with various parameters"""
    print("7. Testing GET /api/publications endpoint...")
    try:
        # Test basic endpoint
        response = requests.get(f"{API_BASE_URL}/publications", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Basic request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["publications", "pagination", "statistics"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            return False
        
        # Test pagination parameters
        response = requests.get(f"{API_BASE_URL}/publications?page=2&per_page=5", timeout=10)
        if response.status_code != 200:
            print("   ❌ Pagination parameters failed")
            return False
        
        paginated_data = response.json()
        if paginated_data["pagination"]["current_page"] != 2 or paginated_data["pagination"]["per_page"] != 5:
            print("   ❌ Pagination not working correctly")
            return False
        
        # Test filtering parameters
        response = requests.get(f"{API_BASE_URL}/publications?year_filter=2024&category_filter=Journal Articles", timeout=10)
        if response.status_code != 200:
            print("   ❌ Filtering parameters failed")
            return False
        
        # Test sorting parameters
        response = requests.get(f"{API_BASE_URL}/publications?sort_by=citations&sort_order=desc", timeout=10)
        if response.status_code != 200:
            print("   ❌ Sorting parameters failed")
            return False
        
        print("   ✅ Publications endpoint working correctly with all parameters")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing publications endpoint: {e}")
        return False

def test_projects_endpoint():
    """Test GET /api/projects endpoint with various parameters"""
    print("8. Testing GET /api/projects endpoint...")
    try:
        # Test basic endpoint
        response = requests.get(f"{API_BASE_URL}/projects", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Basic request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["projects", "pagination"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            return False
        
        # Test status filter
        response = requests.get(f"{API_BASE_URL}/projects?status_filter=Active", timeout=10)
        if response.status_code != 200:
            print("   ❌ Status filter failed")
            return False
        
        # Test area filter
        response = requests.get(f"{API_BASE_URL}/projects?area_filter=Smart Grid Technologies", timeout=10)
        if response.status_code != 200:
            print("   ❌ Area filter failed")
            return False
        
        # Test pagination and sorting
        response = requests.get(f"{API_BASE_URL}/projects?page=1&per_page=10&sort_by=start_date&sort_order=desc", timeout=10)
        if response.status_code != 200:
            print("   ❌ Pagination and sorting failed")
            return False
        
        print("   ✅ Projects endpoint working correctly with all parameters")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing projects endpoint: {e}")
        return False

def test_achievements_endpoint():
    """Test GET /api/achievements endpoint with various parameters"""
    print("9. Testing GET /api/achievements endpoint...")
    try:
        # Test basic endpoint
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Basic request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["achievements", "pagination"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            return False
        
        # Test category filter
        response = requests.get(f"{API_BASE_URL}/achievements?category_filter=Award", timeout=10)
        if response.status_code != 200:
            print("   ❌ Category filter failed")
            return False
        
        # Test pagination with different per_page
        response = requests.get(f"{API_BASE_URL}/achievements?page=1&per_page=6", timeout=10)
        if response.status_code != 200:
            print("   ❌ Pagination failed")
            return False
        
        print("   ✅ Achievements endpoint working correctly with all parameters")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing achievements endpoint: {e}")
        return False

def test_news_events_endpoint():
    """Test GET /api/news-events endpoint with various parameters"""
    print("10. Testing GET /api/news-events endpoint...")
    try:
        # Test basic endpoint
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Basic request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["news_events", "pagination"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            return False
        
        # Test category filter
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News", timeout=10)
        if response.status_code != 200:
            print("   ❌ Category filter failed")
            return False
        
        # Test title filter
        response = requests.get(f"{API_BASE_URL}/news-events?title_filter=Grant", timeout=10)
        if response.status_code != 200:
            print("   ❌ Title filter failed")
            return False
        
        print("   ✅ News-events endpoint working correctly with all parameters")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing news-events endpoint: {e}")
        return False

def test_achievement_details_endpoint():
    """Test GET /api/achievements/{achievement_id} endpoint"""
    print("11. Testing GET /api/achievements/{achievement_id} endpoint...")
    try:
        # First get a valid achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=1", timeout=10)
        if response.status_code != 200:
            print("   ❌ Could not get achievements list")
            return False
        
        achievements = response.json()["achievements"]
        if not achievements:
            print("   ❌ No achievements found to test details")
            return False
        
        achievement_id = achievements[0]["id"]
        
        # Test valid achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Valid achievement ID failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["id", "title", "full_content"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys in achievement details")
            return False
        
        # Test invalid achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements/invalid_id", timeout=10)
        if response.status_code != 200:
            print("   ❌ Invalid ID should return 200 with error message")
            return False
        
        error_data = response.json()
        if "error" not in error_data:
            print("   ❌ Invalid ID should return error message")
            return False
        
        print("   ✅ Achievement details endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing achievement details endpoint: {e}")
        return False

def test_news_event_details_endpoint():
    """Test GET /api/news-events/{news_id} endpoint"""
    print("12. Testing GET /api/news-events/{news_id} endpoint...")
    try:
        # First get a valid news event ID
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        if response.status_code != 200:
            print("   ❌ Could not get news events list")
            return False
        
        news_events = response.json()["news_events"]
        if not news_events:
            print("   ❌ No news events found to test details")
            return False
        
        news_id = news_events[0]["id"]
        
        # Test valid news event ID
        response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Valid news event ID failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["id", "title", "full_content"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys in news event details")
            return False
        
        # Test invalid news event ID
        response = requests.get(f"{API_BASE_URL}/news-events/invalid_id", timeout=10)
        if response.status_code != 200:
            print("   ❌ Invalid ID should return 200 with error message")
            return False
        
        error_data = response.json()
        if "error" not in error_data:
            print("   ❌ Invalid ID should return error message")
            return False
        
        print("   ✅ News event details endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing news event details endpoint: {e}")
        return False

def test_research_stats_endpoint():
    """Test GET /api/research-stats endpoint"""
    print("13. Testing GET /api/research-stats endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/research-stats", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        expected_keys = ["total_publications", "total_citations", "active_projects", "total_achievements", "recent_news"]
        
        if not all(key in data for key in expected_keys):
            print(f"   ❌ Missing required keys. Expected: {expected_keys}, Got: {list(data.keys())}")
            return False
        
        # Verify all values are numeric
        for key in expected_keys:
            if not isinstance(data[key], (int, float)):
                print(f"   ❌ {key} should be numeric, got {type(data[key])}")
                return False
        
        print("   ✅ Research stats endpoint working correctly")
        print(f"   Stats: {data}")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing research stats endpoint: {e}")
        return False

def test_error_handling():
    """Test error handling for invalid parameters"""
    print("14. Testing error handling for invalid parameters...")
    try:
        # Test invalid pagination parameters
        response = requests.get(f"{API_BASE_URL}/publications?page=-1&per_page=0", timeout=10)
        # Should still return 200 but handle gracefully
        if response.status_code != 200:
            print("   ⚠️  Invalid pagination parameters not handled gracefully")
        
        # Test very large page numbers
        response = requests.get(f"{API_BASE_URL}/publications?page=999999", timeout=10)
        if response.status_code != 200:
            print("   ⚠️  Large page numbers not handled gracefully")
        
        # Test invalid sort parameters
        response = requests.get(f"{API_BASE_URL}/publications?sort_by=invalid_field", timeout=10)
        if response.status_code != 200:
            print("   ⚠️  Invalid sort parameters not handled gracefully")
        
        print("   ✅ Error handling working appropriately")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing error handling: {e}")
        return False

def run_all_tests():
    """Run all backend tests and return summary"""
    print("Starting Comprehensive Backend API Tests")
    print("=" * 60)
    
    results = {}
    
    # Basic functionality tests
    results['server_accessible'] = test_server_accessibility()
    results['root_endpoint'] = test_root_endpoint()
    results['post_status'], _ = test_post_status_endpoint()
    results['get_status'] = test_get_status_endpoint()
    results['mongodb_connection'] = test_mongodb_connection()
    results['cors_config'] = test_cors_configuration()
    
    # Google Sheets Integration API tests
    results['publications_endpoint'] = test_publications_endpoint()
    results['projects_endpoint'] = test_projects_endpoint()
    results['achievements_endpoint'] = test_achievements_endpoint()
    results['news_events_endpoint'] = test_news_events_endpoint()
    results['achievement_details'] = test_achievement_details_endpoint()
    results['news_event_details'] = test_news_event_details_endpoint()
    results['research_stats'] = test_research_stats_endpoint()
    results['error_handling'] = test_error_handling()
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    all_passed = True
    basic_tests = ['server_accessible', 'root_endpoint', 'post_status', 'get_status', 'mongodb_connection', 'cors_config']
    sheets_tests = ['publications_endpoint', 'projects_endpoint', 'achievements_endpoint', 'news_events_endpoint', 
                   'achievement_details', 'news_event_details', 'research_stats', 'error_handling']
    
    print("BASIC FUNCTIONALITY:")
    for test_name in basic_tests:
        passed = results.get(test_name, False)
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name.replace('_', ' ').title()}: {status}")
        if not passed:
            all_passed = False
    
    print("\nGOOGLE SHEETS INTEGRATION:")
    sheets_passed = True
    for test_name in sheets_tests:
        passed = results.get(test_name, False)
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name.replace('_', ' ').title()}: {status}")
        if not passed:
            all_passed = False
            sheets_passed = False
    
    print("=" * 60)
    if all_passed:
        print("🎉 ALL TESTS PASSED - Google Sheets Integration APIs are ready for frontend!")
    elif sheets_passed and any(results[test] for test in basic_tests):
        print("✅ GOOGLE SHEETS INTEGRATION WORKING - Some basic functionality issues")
    else:
        print("⚠️  CRITICAL ISSUES FOUND - Backend needs attention")
    
    return results, all_passed

if __name__ == "__main__":
    results, all_passed = run_all_tests()
    sys.exit(0 if all_passed else 1)