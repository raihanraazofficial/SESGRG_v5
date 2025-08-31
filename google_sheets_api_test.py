#!/usr/bin/env python3
"""
Google Sheets API Integration Testing Suite
Tests the Google Sheets API endpoints directly as specified in the review request.
This tests the frontend's ability to fetch data from Google Sheets APIs without backend.
"""

import requests
import json
import os
from datetime import datetime
import sys

# Google Sheets API URLs from the review request
GOOGLE_SHEETS_APIS = {
    'publications': 'https://script.google.com/macros/s/AKfycbzQ6XwRBYMc5PaDDns3XlgpRGYQFZtC45RtVRUhyvVlt869zH9mL0IlGlnvBV2-e_s/exec?sheet=sheet6',
    'projects': 'https://script.google.com/macros/s/AKfycbz5-vZBCz8DZQhLDmLjJNA70HQ3OazQ2uTAUuK7UQaTVip7pG8ulVPLuzA8VN8rqTGH/exec?sheet=sheet7',
    'achievements': 'https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8',
    'news_events': 'https://script.google.com/macros/s/AKfycbwLVCtEI2Mr2J76jf72kfK6OhaMNNdfvLTcJTV8J6mtWcNNGVnHtt0Gxu__lavtnrc8/exec?sheet=sheet9'
}

print("=" * 80)
print("🔗 GOOGLE SHEETS API INTEGRATION TESTING")
print("=" * 80)
print("Testing Google Sheets API endpoints for SESG Research website")
print("This verifies the frontend can work without backend by fetching data directly from Google Sheets")
print("=" * 80)

def test_google_sheets_api_endpoint(name, url):
    """Test a single Google Sheets API endpoint"""
    print(f"\n📊 Testing {name.upper()} API: {url}")
    print("-" * 60)
    
    all_tests_passed = True
    
    try:
        # 1. Basic connectivity test
        print("1. Testing basic connectivity...")
        start_time = datetime.now()
        response = requests.get(url, timeout=30)
        response_time = (datetime.now() - start_time).total_seconds()
        
        if response.status_code == 200:
            print(f"   ✅ API is accessible (Status: {response.status_code})")
            print(f"   ⏱️  Response time: {response_time:.3f} seconds")
        else:
            print(f"   ❌ API returned status code: {response.status_code}")
            print(f"   📄 Response text: {response.text[:200]}")
            return False
        
        # 2. JSON format validation
        print("2. Testing JSON response format...")
        try:
            data = response.json()
            print("   ✅ Valid JSON response received")
        except json.JSONDecodeError as e:
            print(f"   ❌ Invalid JSON response: {e}")
            print(f"   📄 Response content: {response.text[:200]}")
            return False
        
        # 3. CORS headers check
        print("3. Testing CORS configuration...")
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        if cors_headers['Access-Control-Allow-Origin']:
            print(f"   ✅ CORS properly configured")
            print(f"   🌐 Allow-Origin: {cors_headers['Access-Control-Allow-Origin']}")
        else:
            print("   ⚠️  CORS headers not found - may cause browser issues")
            # This might still work if the Google Apps Script is configured properly
        
        # 4. Data structure validation
        print("4. Testing data structure...")
        if isinstance(data, dict):
            if 'data' in data:
                items = data['data']
                print(f"   ✅ Data structure valid - found 'data' key with {len(items)} items")
                
                # Check if we have actual data
                if len(items) > 0:
                    sample_item = items[0]
                    print(f"   📋 Sample item keys: {list(sample_item.keys())[:5]}...")
                    
                    # Validate required fields based on endpoint type
                    required_fields = get_required_fields(name)
                    missing_fields = [field for field in required_fields if field not in sample_item]
                    
                    if not missing_fields:
                        print(f"   ✅ All required fields present for {name}")
                    else:
                        print(f"   ⚠️  Missing some expected fields: {missing_fields}")
                        # Not a critical failure as Google Sheets structure might vary
                else:
                    print(f"   ⚠️  No data items found - sheet might be empty")
                    all_tests_passed = False
            else:
                print(f"   ❌ Unexpected data structure - missing 'data' key")
                print(f"   📋 Available keys: {list(data.keys())}")
                all_tests_passed = False
        else:
            print(f"   ❌ Expected object, got {type(data)}")
            all_tests_passed = False
        
        # 5. Browser compatibility test (simulate browser request)
        print("5. Testing browser compatibility...")
        browser_headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://sesgrg-v4.vercel.app',
            'Referer': 'https://sesgrg-v4.vercel.app/'
        }
        
        browser_response = requests.get(url, headers=browser_headers, timeout=30)
        if browser_response.status_code == 200:
            print("   ✅ Browser-like request successful")
        else:
            print(f"   ❌ Browser-like request failed: {browser_response.status_code}")
            all_tests_passed = False
        
        # 6. Authentication test (should work without authentication)
        print("6. Testing public access (no authentication required)...")
        if response.status_code == 200 and browser_response.status_code == 200:
            print("   ✅ Public access working - no authentication issues")
        else:
            print("   ❌ Authentication issues detected")
            all_tests_passed = False
        
        # 7. Data quality assessment
        print("7. Assessing data quality...")
        if 'data' in data and len(data['data']) > 0:
            items = data['data']
            
            # Check for empty or null values
            empty_count = 0
            for item in items[:5]:  # Check first 5 items
                for key, value in item.items():
                    if not value or value == '' or value == 'null':
                        empty_count += 1
            
            if empty_count == 0:
                print("   ✅ Data quality good - no empty values in sample")
            else:
                print(f"   ⚠️  Found {empty_count} empty values in sample data")
            
            # Check data consistency
            if len(items) > 1:
                first_keys = set(items[0].keys())
                consistent = all(set(item.keys()) == first_keys for item in items[:5])
                if consistent:
                    print("   ✅ Data structure consistent across items")
                else:
                    print("   ⚠️  Inconsistent data structure across items")
        
        return all_tests_passed
        
    except requests.exceptions.Timeout:
        print(f"   ❌ Request timeout after 30 seconds")
        return False
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection error - unable to reach Google Sheets API")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def get_required_fields(endpoint_name):
    """Get expected fields for each endpoint type"""
    field_mapping = {
        'publications': ['id', 'title', 'authors', 'year', 'category'],
        'projects': ['id', 'title', 'status', 'start_date'],
        'achievements': ['id', 'title', 'category', 'date'],
        'news_events': ['id', 'title', 'category', 'date', 'description']
    }
    return field_mapping.get(endpoint_name, ['id', 'title'])

def test_frontend_integration():
    """Test that frontend environment variables are properly configured"""
    print("\n🔧 Testing Frontend Configuration...")
    print("-" * 60)
    
    try:
        # Check if frontend .env file exists and has the correct URLs
        env_file_path = '/app/frontend/.env'
        if os.path.exists(env_file_path):
            print("   ✅ Frontend .env file found")
            
            with open(env_file_path, 'r') as f:
                env_content = f.read()
            
            # Check each API URL
            expected_urls = {
                'REACT_APP_PUBLICATIONS_API_URL': GOOGLE_SHEETS_APIS['publications'],
                'REACT_APP_PROJECTS_API_URL': GOOGLE_SHEETS_APIS['projects'],
                'REACT_APP_ACHIEVEMENTS_API_URL': GOOGLE_SHEETS_APIS['achievements'],
                'REACT_APP_NEWS_EVENTS_API_URL': GOOGLE_SHEETS_APIS['news_events']
            }
            
            all_configured = True
            for env_var, expected_url in expected_urls.items():
                if expected_url in env_content:
                    print(f"   ✅ {env_var} correctly configured")
                else:
                    print(f"   ❌ {env_var} not found or incorrect")
                    all_configured = False
            
            return all_configured
        else:
            print("   ❌ Frontend .env file not found")
            return False
            
    except Exception as e:
        print(f"   ❌ Error checking frontend configuration: {e}")
        return False

def test_performance_and_reliability():
    """Test performance and reliability of Google Sheets APIs"""
    print("\n⚡ Testing Performance and Reliability...")
    print("-" * 60)
    
    all_tests_passed = True
    
    # Test multiple requests to check consistency
    print("1. Testing response consistency (3 requests)...")
    for name, url in list(GOOGLE_SHEETS_APIS.items())[:2]:  # Test first 2 APIs
        response_times = []
        status_codes = []
        
        for i in range(3):
            try:
                start_time = datetime.now()
                response = requests.get(url, timeout=30)
                response_time = (datetime.now() - start_time).total_seconds()
                
                response_times.append(response_time)
                status_codes.append(response.status_code)
            except Exception as e:
                print(f"   ❌ Request {i+1} failed for {name}: {e}")
                all_tests_passed = False
        
        if len(set(status_codes)) == 1 and status_codes[0] == 200:
            avg_time = sum(response_times) / len(response_times)
            print(f"   ✅ {name}: Consistent responses (avg: {avg_time:.3f}s)")
        else:
            print(f"   ❌ {name}: Inconsistent responses - {status_codes}")
            all_tests_passed = False
    
    return all_tests_passed

def main():
    """Main test execution"""
    overall_success = True
    test_results = {}
    
    # Test frontend configuration first
    frontend_config_ok = test_frontend_integration()
    if not frontend_config_ok:
        print("\n⚠️  Frontend configuration issues detected but continuing with API tests...")
    
    # Test each Google Sheets API endpoint
    for name, url in GOOGLE_SHEETS_APIS.items():
        success = test_google_sheets_api_endpoint(name, url)
        test_results[name] = success
        if not success:
            overall_success = False
    
    # Test performance and reliability
    performance_ok = test_performance_and_reliability()
    if not performance_ok:
        overall_success = False
    
    # Summary
    print("\n" + "=" * 80)
    print("📋 GOOGLE SHEETS API TESTING SUMMARY")
    print("=" * 80)
    
    for name, success in test_results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{name.upper():<15} {status}")
    
    print(f"\nFrontend Config: {'✅ PASS' if frontend_config_ok else '❌ FAIL'}")
    print(f"Performance:     {'✅ PASS' if performance_ok else '❌ FAIL'}")
    
    if overall_success:
        print("\n🎉 ALL GOOGLE SHEETS API TESTS PASSED!")
        print("✅ The website can successfully work without backend using Google Sheets APIs")
        print("✅ This resolves the Vercel deployment protection issue")
    else:
        print("\n⚠️  SOME GOOGLE SHEETS API TESTS FAILED!")
        print("❌ There may be issues with the Google Sheets integration")
    
    print("\n" + "=" * 80)
    
    return overall_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)