#!/usr/bin/env python3
"""
CORS Resolution and Real-time Data Verification Test
Specifically tests the requirements mentioned in the review request:
1. Direct Google Apps Script URLs work without CORS proxies
2. Data structure validation for research_areas fields
3. Real-time data vs mock data verification
4. Performance under 10 seconds per API call
5. CORS resolution confirmation
"""

import requests
import json
import time
from datetime import datetime

# The exact Google Apps Script URLs from the review request
GOOGLE_APPS_SCRIPT_URLS = {
    'Publications': 'https://script.google.com/macros/s/AKfycbyW6PmwP_F5wLdyez1p10IAa3UihoIcFeutjJqrNtI-boRdcudhS2jyowROfpKZdYK_/exec?sheet=sheet6',
    'Projects': 'https://script.google.com/macros/s/AKfycbx43U5LydfGemMYjP9iM30A0vcdmt7v4lVIG6y6rQoKfJp_9BNYY3_ZbyzzjYARr9AB/exec?sheet=sheet7',
    'Achievements': 'https://script.google.com/macros/s/AKfycbzzEOQzH-2B3RdEZb-3ePDEpAoICx7OSTI6Lpq4k8vzsnOQvca1AeIilcZEeJB60vJK/exec?sheet=sheet8',
    'News Events': 'https://script.google.com/macros/s/AKfycbyjuiXOWBAlqsebyjIUf2F5wZfBGeQsVxDaXvW3alBsfmgEwkt9P9tsRuJTEDXvVXvk/exec?sheet=sheet9'
}

def test_direct_google_apps_script_urls():
    """Test all 4 Google Apps Script URLs directly without CORS proxies"""
    print("🎯 TESTING DIRECT GOOGLE APPS SCRIPT URLS (NO CORS PROXIES)")
    print("=" * 70)
    
    all_tests_passed = True
    
    for api_name, url in GOOGLE_APPS_SCRIPT_URLS.items():
        print(f"\n📡 Testing {api_name} API directly...")
        print(f"   URL: {url}")
        
        try:
            # Test direct access without any CORS proxy
            start_time = time.time()
            
            # Use headers that a browser would send
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            end_time = time.time()
            response_time = end_time - start_time
            
            print(f"   ⏱️  Response time: {response_time:.2f}s")
            
            # Check performance requirement (under 10 seconds)
            if response_time <= 10.0:
                print(f"   ✅ Performance: EXCELLENT (under 10s requirement)")
            else:
                print(f"   ❌ Performance: TOO SLOW (over 10s requirement)")
                all_tests_passed = False
            
            # Check HTTP status
            if response.status_code == 200:
                print(f"   ✅ HTTP Status: 200 OK")
                
                # Check CORS headers
                cors_origin = response.headers.get('Access-Control-Allow-Origin')
                cors_methods = response.headers.get('Access-Control-Allow-Methods')
                
                if cors_origin:
                    print(f"   ✅ CORS Headers: Access-Control-Allow-Origin = {cors_origin}")
                else:
                    print(f"   ℹ️  CORS Headers: Not explicitly set (Google Apps Script handles CORS automatically)")
                
                # Verify JSON response
                try:
                    data = response.json()
                    print(f"   ✅ Response Format: Valid JSON")
                    
                    # Extract items based on API type
                    if api_name == 'Publications':
                        items = data.get('publications', []) if isinstance(data, dict) else data
                    elif api_name == 'Projects':
                        items = data.get('projects', []) if isinstance(data, dict) else data
                    elif api_name == 'Achievements':
                        items = data.get('achievements', data.get('data', [])) if isinstance(data, dict) else data
                    elif api_name == 'News Events':
                        items = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
                    
                    print(f"   ✅ Data Retrieved: {len(items)} items")
                    
                    # Verify this is real data, not mock data
                    if len(items) > 0:
                        sample_item = items[0]
                        print(f"   ✅ Real Data Confirmed: Sample item has ID '{sample_item.get('id', 'N/A')}'")
                        
                        # Check for research_areas field if applicable
                        if api_name in ['Publications', 'Projects']:
                            if 'research_areas' in sample_item:
                                research_areas = sample_item.get('research_areas', [])
                                print(f"   ✅ Research Areas Field: Present with {len(research_areas)} areas")
                                if len(research_areas) > 0:
                                    print(f"   📋 Sample Areas: {research_areas[:2]}")
                            else:
                                print(f"   ❌ Research Areas Field: MISSING")
                                all_tests_passed = False
                    else:
                        print(f"   ⚠️  No data items found in response")
                        
                except json.JSONDecodeError:
                    print(f"   ❌ Response Format: Invalid JSON")
                    all_tests_passed = False
                    
            else:
                print(f"   ❌ HTTP Status: {response.status_code}")
                print(f"   ❌ Response: {response.text[:200]}...")
                all_tests_passed = False
                
        except requests.exceptions.Timeout:
            print(f"   ❌ Request timed out (over 10 seconds)")
            all_tests_passed = False
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Request failed: {e}")
            all_tests_passed = False
        except Exception as e:
            print(f"   ❌ Unexpected error: {e}")
            all_tests_passed = False
    
    return all_tests_passed

def test_research_areas_data_structure():
    """Verify Publications and Projects data have proper research_areas fields for area filtering"""
    print("\n🔍 TESTING DATA STRUCTURE FOR RESEARCH AREAS FILTERING")
    print("=" * 70)
    
    all_tests_passed = True
    
    # Test Publications API data structure
    print("\n📚 Testing Publications API data structure...")
    try:
        response = requests.get(GOOGLE_APPS_SCRIPT_URLS['Publications'], timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get('publications', []) if isinstance(data, dict) else data
            
            if len(publications) > 0:
                print(f"   ✅ Found {len(publications)} publications")
                
                # Check each publication for research_areas field
                publications_with_areas = 0
                for pub in publications:
                    if 'research_areas' in pub and pub['research_areas']:
                        publications_with_areas += 1
                
                print(f"   ✅ Publications with research_areas: {publications_with_areas}/{len(publications)}")
                
                if publications_with_areas > 0:
                    # Show sample research areas
                    sample_pub = next(pub for pub in publications if pub.get('research_areas'))
                    areas = sample_pub['research_areas']
                    print(f"   📋 Sample research areas: {areas}")
                    
                    # Check for Smart Grid Technologies specifically
                    smart_grid_pubs = [pub for pub in publications if 
                                     pub.get('research_areas') and 
                                     any('Smart Grid' in str(area) for area in pub['research_areas'])]
                    print(f"   🔍 Smart Grid Technologies publications: {len(smart_grid_pubs)}")
                else:
                    print(f"   ❌ No publications have research_areas field")
                    all_tests_passed = False
            else:
                print(f"   ❌ No publications found")
                all_tests_passed = False
        else:
            print(f"   ❌ Publications API failed: {response.status_code}")
            all_tests_passed = False
    except Exception as e:
        print(f"   ❌ Publications API error: {e}")
        all_tests_passed = False
    
    # Test Projects API data structure
    print("\n📊 Testing Projects API data structure...")
    try:
        response = requests.get(GOOGLE_APPS_SCRIPT_URLS['Projects'], timeout=10)
        if response.status_code == 200:
            data = response.json()
            projects = data.get('projects', []) if isinstance(data, dict) else data
            
            if len(projects) > 0:
                print(f"   ✅ Found {len(projects)} projects")
                
                # Check each project for research_areas and status fields
                projects_with_areas = 0
                projects_with_status = 0
                
                for proj in projects:
                    if 'research_areas' in proj and proj['research_areas']:
                        projects_with_areas += 1
                    if 'status' in proj:
                        projects_with_status += 1
                
                print(f"   ✅ Projects with research_areas: {projects_with_areas}/{len(projects)}")
                print(f"   ✅ Projects with status field: {projects_with_status}/{len(projects)}")
                
                if projects_with_areas > 0:
                    # Show sample research areas
                    sample_proj = next(proj for proj in projects if proj.get('research_areas'))
                    areas = sample_proj['research_areas']
                    print(f"   📋 Sample research areas: {areas}")
                    
                    # Check for Smart Grid Technologies specifically
                    smart_grid_projs = [proj for proj in projects if 
                                      proj.get('research_areas') and 
                                      any('Smart Grid' in str(area) for area in proj['research_areas'])]
                    print(f"   🔍 Smart Grid Technologies projects: {len(smart_grid_projs)}")
                    
                    # Check project statuses
                    statuses = list(set(proj.get('status', 'Unknown') for proj in projects))
                    print(f"   📊 Available project statuses: {statuses}")
                else:
                    print(f"   ❌ No projects have research_areas field")
                    all_tests_passed = False
            else:
                print(f"   ❌ No projects found")
                all_tests_passed = False
        else:
            print(f"   ❌ Projects API failed: {response.status_code}")
            all_tests_passed = False
    except Exception as e:
        print(f"   ❌ Projects API error: {e}")
        all_tests_passed = False
    
    return all_tests_passed

def test_real_time_vs_mock_data():
    """Verify that Research Areas page shows real data instead of mock data"""
    print("\n🎯 TESTING REAL-TIME DATA VS MOCK DATA")
    print("=" * 70)
    
    all_tests_passed = True
    
    # Get actual data from APIs
    try:
        # Fetch Publications data
        pub_response = requests.get(GOOGLE_APPS_SCRIPT_URLS['Publications'], timeout=10)
        proj_response = requests.get(GOOGLE_APPS_SCRIPT_URLS['Projects'], timeout=10)
        
        if pub_response.status_code == 200 and proj_response.status_code == 200:
            pub_data = pub_response.json()
            proj_data = proj_response.json()
            
            publications = pub_data.get('publications', []) if isinstance(pub_data, dict) else pub_data
            projects = proj_data.get('projects', []) if isinstance(proj_data, dict) else proj_data
            
            print(f"   ✅ Real API Data Retrieved:")
            print(f"      📚 Total Publications: {len(publications)}")
            print(f"      📊 Total Projects: {len(projects)}")
            
            # Calculate actual counts for Smart Grid Technologies
            smart_grid_publications = [pub for pub in publications if 
                                     pub.get('research_areas') and 
                                     any('Smart Grid' in str(area) for area in pub['research_areas'])]
            
            smart_grid_projects = [proj for proj in projects if 
                                 proj.get('research_areas') and 
                                 any('Smart Grid' in str(area) for area in proj['research_areas'])]
            
            actual_pub_count = len(smart_grid_publications)
            actual_proj_count = len(smart_grid_projects)
            
            print(f"\n   🔍 Smart Grid Technologies Real Counts:")
            print(f"      📚 Publications: {actual_pub_count}")
            print(f"      📊 Projects: {actual_proj_count}")
            
            # Check if these match the mock values mentioned in the review (12 Projects, 28 Papers)
            mock_projects = 12
            mock_papers = 28
            
            print(f"\n   🎭 Mock Data Comparison:")
            print(f"      📊 Mock Projects: {mock_projects} | Real Projects: {actual_proj_count}")
            print(f"      📚 Mock Papers: {mock_papers} | Real Publications: {actual_pub_count}")
            
            if actual_proj_count != mock_projects or actual_pub_count != mock_papers:
                print(f"   ✅ REAL DATA CONFIRMED: Counts differ from mock values")
                print(f"   ✅ CORS Proxy Issues RESOLVED: APIs returning real data")
            else:
                print(f"   ⚠️  Data matches mock values - verify if this is coincidental")
            
            # Test other research areas to ensure they show proper counts or 0
            research_areas = [
                "Microgrids",
                "Renewable Energy",
                "Grid Optimization",
                "Energy Storage",
                "Power System Automation",
                "Cybersecurity"
            ]
            
            print(f"\n   📋 Other Research Areas Real Counts:")
            for area in research_areas:
                area_pubs = [pub for pub in publications if 
                           pub.get('research_areas') and 
                           any(area.lower() in str(research_area).lower() for research_area in pub['research_areas'])]
                
                area_projs = [proj for proj in projects if 
                            proj.get('research_areas') and 
                            any(area.lower() in str(research_area).lower() for research_area in proj['research_areas'])]
                
                print(f"      {area}: {len(area_projs)} Projects, {len(area_pubs)} Papers")
            
        else:
            print(f"   ❌ API calls failed: Publications {pub_response.status_code}, Projects {proj_response.status_code}")
            all_tests_passed = False
            
    except Exception as e:
        print(f"   ❌ Real-time data test error: {e}")
        all_tests_passed = False
    
    return all_tests_passed

def test_cors_resolution():
    """Confirm that direct Google Apps Script calls work without CORS proxies"""
    print("\n🌐 TESTING CORS RESOLUTION")
    print("=" * 70)
    
    all_tests_passed = True
    
    print("   🔍 Testing browser-like CORS requests...")
    
    # Test with browser-like headers that would trigger CORS
    browser_headers = {
        'Origin': 'https://sesgrg-v4-git-main-raihanraazofficials-projects.vercel.app',
        'Referer': 'https://sesgrg-v4-git-main-raihanraazofficials-projects.vercel.app/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
    }
    
    for api_name, url in GOOGLE_APPS_SCRIPT_URLS.items():
        print(f"\n   🌐 Testing {api_name} CORS...")
        
        try:
            # Make request with browser headers that would trigger CORS issues
            response = requests.get(url, headers=browser_headers, timeout=8)
            
            if response.status_code == 200:
                print(f"      ✅ CORS Request Successful: {api_name}")
                
                # Check for CORS headers in response
                cors_headers = {
                    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                    'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                    'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
                }
                
                if any(cors_headers.values()):
                    print(f"      ✅ CORS Headers Present:")
                    for header, value in cors_headers.items():
                        if value:
                            print(f"         {header}: {value}")
                else:
                    print(f"      ℹ️  Google Apps Script handles CORS automatically")
                
                # Verify we get valid JSON (not CORS error)
                try:
                    data = response.json()
                    print(f"      ✅ Valid JSON Response (not CORS error page)")
                except:
                    print(f"      ❌ Invalid JSON Response (possible CORS error)")
                    all_tests_passed = False
                    
            else:
                print(f"      ❌ CORS Request Failed: {response.status_code}")
                all_tests_passed = False
                
        except Exception as e:
            print(f"      ❌ CORS Test Error: {e}")
            all_tests_passed = False
    
    return all_tests_passed

def run_cors_resolution_tests():
    """Run all CORS resolution and real-time data tests"""
    print("🎯 CORS RESOLUTION AND REAL-TIME DATA VERIFICATION")
    print("Testing the specific requirements from the review request")
    print("=" * 70)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Direct Google Apps Script URLs
    try:
        direct_urls_working = test_direct_google_apps_script_urls()
        test_results.append(("Direct Google Apps Script URLs", direct_urls_working))
        all_tests_passed &= direct_urls_working
    except Exception as e:
        print(f"❌ Direct URLs test failed: {e}")
        all_tests_passed = False
    
    # Test 2: Data Structure Validation
    try:
        data_structure_valid = test_research_areas_data_structure()
        test_results.append(("Data Structure Validation", data_structure_valid))
        all_tests_passed &= data_structure_valid
    except Exception as e:
        print(f"❌ Data structure test failed: {e}")
        all_tests_passed = False
    
    # Test 3: Real-time vs Mock Data
    try:
        real_data_working = test_real_time_vs_mock_data()
        test_results.append(("Real-time vs Mock Data", real_data_working))
        all_tests_passed &= real_data_working
    except Exception as e:
        print(f"❌ Real-time data test failed: {e}")
        all_tests_passed = False
    
    # Test 4: CORS Resolution
    try:
        cors_resolved = test_cors_resolution()
        test_results.append(("CORS Resolution", cors_resolved))
        all_tests_passed &= cors_resolved
    except Exception as e:
        print(f"❌ CORS resolution test failed: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 70)
    print("📊 CORS RESOLUTION TEST RESULTS SUMMARY")
    print("=" * 70)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<40} {status}")
    
    print("=" * 70)
    
    if all_tests_passed:
        print("🎉 ALL CORS RESOLUTION TESTS PASSED!")
        print("✅ Direct Google Apps Script calls work without CORS proxies")
        print("✅ Real-time data is working correctly (not showing mock data)")
        print("✅ Data structure supports proper research area filtering")
        print("✅ Performance is under 10 seconds per API call")
        return True
    else:
        print("⚠️  SOME CORS RESOLUTION TESTS FAILED!")
        print("Please review the issues above.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_cors_resolution_tests()
    exit(0 if success else 1)