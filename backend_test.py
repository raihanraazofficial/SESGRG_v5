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

def run_all_tests():
    """Run all backend tests and return summary"""
    print("Starting Backend API Tests")
    print("=" * 60)
    
    results = {}
    
    # Test 1: Server accessibility
    results['server_accessible'] = test_server_accessibility()
    
    # Test 2: Root endpoint
    results['root_endpoint'] = test_root_endpoint()
    
    # Test 3: POST status endpoint
    results['post_status'], _ = test_post_status_endpoint()
    
    # Test 4: GET status endpoint
    results['get_status'] = test_get_status_endpoint()
    
    # Test 5: MongoDB connection
    results['mongodb_connection'] = test_mongodb_connection()
    
    # Test 6: CORS configuration
    results['cors_config'] = test_cors_configuration()
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    all_passed = True
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if not passed:
            all_passed = False
    
    print("=" * 60)
    if all_passed:
        print("🎉 ALL TESTS PASSED - Backend is ready for Google Sheets integration!")
    else:
        print("⚠️  SOME TESTS FAILED - Issues need to be addressed")
    
    return results, all_passed

if __name__ == "__main__":
    results, all_passed = run_all_tests()
    sys.exit(0 if all_passed else 1)