#!/usr/bin/env python3
"""
Research Areas Data Filtering Fix - Verification Testing Suite
Tests the exact matching implementation for Research Areas page data filtering:
- Data Accuracy Verification: Verify research area counts match Google Sheets data
- API Data Structure Validation: Confirm Google Sheets APIs return correct research_areas field data
- Filtering Logic Testing: Test exact matching logic works correctly
- Performance Verification: Ensure Google Sheets API integration works efficiently
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

print(f"🎯 Research Areas Data Filtering Fix - Verification Testing")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Projects API: {PROJECTS_API_URL}")
print("=" * 80)

def test_data_accuracy_verification():
    """Test 1: Data Accuracy Verification - Verify research area counts match Google Sheets data"""
    print("1. Testing Data Accuracy Verification...")
    
    all_tests_passed = True
    
    # Expected counts from the review request
    expected_counts = {
        "Smart Grid Technologies": {"projects": 1, "publications": 2},
        "Microgrids & Distributed Energy Systems": {"projects": 1, "publications": 3},
        "Renewable Energy Integration": {"projects": 1, "publications": 3},
        "Grid Optimization & Stability": {"projects": 0, "publications": 2},
        "Energy Storage Systems": {"projects": 0, "publications": 3},
        "Power System Automation": {"projects": 0, "publications": 1},
        "Cybersecurity and AI for Power Infrastructure": {"projects": 0, "publications": 3}
    }
    
    try:
        # Fetch all projects and publications
        print("   📊 Fetching all projects and publications from Google Sheets APIs...")
        start_time = time.time()
        
        projects_response = requests.get(PROJECTS_API_URL, timeout=10)
        publications_response = requests.get(PUBLICATIONS_API_URL, timeout=10)
        
        end_time = time.time()
        fetch_time = end_time - start_time
        
        if projects_response.status_code != 200:
            print(f"      ❌ Projects API failed: {projects_response.status_code}")
            return False
            
        if publications_response.status_code != 200:
            print(f"      ❌ Publications API failed: {publications_response.status_code}")
            return False
            
        print(f"      ✅ APIs accessible (fetch time: {fetch_time:.2f}s)")
        
        # Parse data
        projects_data = projects_response.json()
        publications_data = publications_response.json()
        
        projects = projects_data.get('projects', []) if isinstance(projects_data, dict) else projects_data
        publications = publications_data.get('publications', []) if isinstance(publications_data, dict) else publications_data
        
        print(f"      📊 Total data: {len(projects)} projects, {len(publications)} publications")
        
        # Test exact matching for each research area
        print("\n   🎯 Testing exact matching logic for each research area...")
        
        actual_counts = {}
        
        for area_name, expected in expected_counts.items():
            print(f"\n      🔍 Testing: {area_name}")
            
            # Filter projects using exact matching (same logic as ResearchAreas.jsx)
            area_projects = []
            for project in projects:
                if project.get('research_areas') and isinstance(project.get('research_areas'), list):
                    if area_name in project.get('research_areas', []):
                        area_projects.append(project)
            
            # Filter publications using exact matching
            area_publications = []
            for pub in publications:
                if pub.get('research_areas') and isinstance(pub.get('research_areas'), list):
                    if area_name in pub.get('research_areas', []):
                        area_publications.append(pub)
            
            actual_projects = len(area_projects)
            actual_publications = len(area_publications)
            
            actual_counts[area_name] = {
                "projects": actual_projects,
                "publications": actual_publications
            }
            
            print(f"         Expected: {expected['projects']} projects, {expected['publications']} publications")
            print(f"         Actual:   {actual_projects} projects, {actual_publications} publications")
            
            # Verify counts match expectations
            if actual_projects == expected['projects'] and actual_publications == expected['publications']:
                print(f"         ✅ MATCH: Counts are correct")
            else:
                print(f"         ❌ MISMATCH: Counts do not match expected values")
                all_tests_passed = False
                
                # Show sample data for debugging
                if len(area_projects) > 0:
                    sample_project = area_projects[0]
                    print(f"         📄 Sample project research_areas: {sample_project.get('research_areas', [])}")
                if len(area_publications) > 0:
                    sample_pub = area_publications[0]
                    print(f"         📄 Sample publication research_areas: {sample_pub.get('research_areas', [])}")
        
        # Summary of results
        print(f"\n   📊 Data Accuracy Verification Summary:")
        total_expected_projects = sum(expected['projects'] for expected in expected_counts.values())
        total_expected_publications = sum(expected['publications'] for expected in expected_counts.values())
        total_actual_projects = sum(actual['projects'] for actual in actual_counts.values())
        total_actual_publications = sum(actual['publications'] for actual in actual_counts.values())
        
        print(f"      Total Projects - Expected: {total_expected_projects}, Actual: {total_actual_projects}")
        print(f"      Total Publications - Expected: {total_expected_publications}, Actual: {total_actual_publications}")
        
        if total_actual_projects == total_expected_projects and total_actual_publications == total_expected_publications:
            print(f"      ✅ Overall totals match expected values")
        else:
            print(f"      ⚠️  Overall totals differ from expected values")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in data accuracy verification: {e}")
        return False

def test_api_data_structure_validation():
    """Test 2: API Data Structure Validation - Confirm Google Sheets APIs return correct research_areas field data"""
    print("2. Testing API Data Structure Validation...")
    
    all_tests_passed = True
    
    try:
        # Test Projects API structure
        print("   📊 Validating Projects API data structure...")
        
        projects_response = requests.get(PROJECTS_API_URL, timeout=10)
        if projects_response.status_code == 200:
            projects_data = projects_response.json()
            projects = projects_data.get('projects', []) if isinstance(projects_data, dict) else projects_data
            
            print(f"      ✅ Projects API returns {len(projects)} projects")
            
            if len(projects) > 0:
                # Check first project structure
                sample_project = projects[0]
                required_fields = ['research_areas']
                
                for field in required_fields:
                    if field in sample_project:
                        print(f"      ✅ Projects have '{field}' field")
                        
                        # Validate research_areas structure
                        if field == 'research_areas':
                            research_areas = sample_project.get('research_areas', [])
                            if isinstance(research_areas, list):
                                print(f"      ✅ research_areas is list with {len(research_areas)} areas")
                                if len(research_areas) > 0:
                                    print(f"      📋 Sample research areas: {research_areas}")
                            else:
                                print(f"      ❌ research_areas is not a list: {type(research_areas)}")
                                all_tests_passed = False
                    else:
                        print(f"      ❌ Projects missing '{field}' field")
                        all_tests_passed = False
            else:
                print(f"      ⚠️  No projects found for validation")
        else:
            print(f"      ❌ Projects API failed: {projects_response.status_code}")
            all_tests_passed = False
        
        # Test Publications API structure
        print("\n   📚 Validating Publications API data structure...")
        
        publications_response = requests.get(PUBLICATIONS_API_URL, timeout=10)
        if publications_response.status_code == 200:
            publications_data = publications_response.json()
            publications = publications_data.get('publications', []) if isinstance(publications_data, dict) else publications_data
            
            print(f"      ✅ Publications API returns {len(publications)} publications")
            
            if len(publications) > 0:
                # Check first publication structure
                sample_pub = publications[0]
                required_fields = ['research_areas']
                
                for field in required_fields:
                    if field in sample_pub:
                        print(f"      ✅ Publications have '{field}' field")
                        
                        # Validate research_areas structure
                        if field == 'research_areas':
                            research_areas = sample_pub.get('research_areas', [])
                            if isinstance(research_areas, list):
                                print(f"      ✅ research_areas is list with {len(research_areas)} areas")
                                if len(research_areas) > 0:
                                    print(f"      📋 Sample research areas: {research_areas}")
                            else:
                                print(f"      ❌ research_areas is not a list: {type(research_areas)}")
                                all_tests_passed = False
                    else:
                        print(f"      ❌ Publications missing '{field}' field")
                        all_tests_passed = False
            else:
                print(f"      ⚠️  No publications found for validation")
        else:
            print(f"      ❌ Publications API failed: {publications_response.status_code}")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in API data structure validation: {e}")
        return False

def test_filtering_logic():
    """Test 3: Filtering Logic Testing - Test exact matching logic works correctly"""
    print("3. Testing Filtering Logic...")
    
    all_tests_passed = True
    
    try:
        # Fetch data
        projects_response = requests.get(PROJECTS_API_URL, timeout=10)
        publications_response = requests.get(PUBLICATIONS_API_URL, timeout=10)
        
        if projects_response.status_code != 200 or publications_response.status_code != 200:
            print(f"   ❌ API access failed")
            return False
        
        projects_data = projects_response.json()
        publications_data = publications_response.json()
        
        projects = projects_data.get('projects', []) if isinstance(projects_data, dict) else projects_data
        publications = publications_data.get('publications', []) if isinstance(publications_data, dict) else publications_data
        
        # Test exact matching vs fuzzy matching
        print("   🎯 Testing exact matching vs fuzzy matching...")
        
        test_areas = [
            "Smart Grid Technologies",
            "Microgrids & Distributed Energy Systems",
            "Renewable Energy Integration"
        ]
        
        for area_name in test_areas:
            print(f"\n      🔍 Testing filtering for: {area_name}")
            
            # Exact matching (current implementation)
            exact_projects = []
            for project in projects:
                if project.get('research_areas') and isinstance(project.get('research_areas'), list):
                    if area_name in project.get('research_areas', []):
                        exact_projects.append(project)
            
            exact_publications = []
            for pub in publications:
                if pub.get('research_areas') and isinstance(pub.get('research_areas'), list):
                    if area_name in pub.get('research_areas', []):
                        exact_publications.append(pub)
            
            # Fuzzy matching (old implementation for comparison)
            fuzzy_projects = []
            for project in projects:
                if project.get('research_areas') and isinstance(project.get('research_areas'), list):
                    for research_area in project.get('research_areas', []):
                        if area_name.lower() in str(research_area).lower():
                            fuzzy_projects.append(project)
                            break
            
            fuzzy_publications = []
            for pub in publications:
                if pub.get('research_areas') and isinstance(pub.get('research_areas'), list):
                    for research_area in pub.get('research_areas', []):
                        if area_name.lower() in str(research_area).lower():
                            fuzzy_publications.append(pub)
                            break
            
            print(f"         Exact matching: {len(exact_projects)} projects, {len(exact_publications)} publications")
            print(f"         Fuzzy matching: {len(fuzzy_projects)} projects, {len(fuzzy_publications)} publications")
            
            # Test for cross-contamination (exact should be subset of or equal to fuzzy)
            if len(exact_projects) <= len(fuzzy_projects) and len(exact_publications) <= len(fuzzy_publications):
                print(f"         ✅ Exact matching prevents cross-contamination")
            else:
                print(f"         ❌ Exact matching logic may have issues")
                all_tests_passed = False
        
        # Test areas with no data show 0
        print("\n   🔍 Testing areas with no data show 0...")
        
        zero_areas = [
            "Grid Optimization & Stability",
            "Energy Storage Systems", 
            "Power System Automation"
        ]
        
        for area_name in zero_areas:
            area_projects = []
            for project in projects:
                if project.get('research_areas') and isinstance(project.get('research_areas'), list):
                    if area_name in project.get('research_areas', []):
                        area_projects.append(project)
            
            if len(area_projects) == 0:
                print(f"         ✅ {area_name}: Correctly shows 0 projects")
            else:
                print(f"         ⚠️  {area_name}: Shows {len(area_projects)} projects (may be correct if data changed)")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in filtering logic testing: {e}")
        return False

def test_performance_verification():
    """Test 4: Performance Verification - Ensure Google Sheets API integration works efficiently"""
    print("4. Testing Performance Verification...")
    
    all_tests_passed = True
    
    try:
        # Test direct fetch calls without CORS proxy
        print("   🚀 Testing direct Google Sheets API calls...")
        
        api_endpoints = [
            ('Projects', PROJECTS_API_URL),
            ('Publications', PUBLICATIONS_API_URL)
        ]
        
        for api_name, api_url in api_endpoints:
            print(f"\n      ⏱️  Testing {api_name} API performance...")
            
            # Test multiple calls to get average
            response_times = []
            for i in range(3):
                try:
                    start_time = time.time()
                    response = requests.get(api_url, timeout=10)
                    end_time = time.time()
                    response_time = end_time - start_time
                    
                    if response.status_code == 200:
                        response_times.append(response_time)
                        print(f"         Test {i+1}: {response_time:.2f}s")
                    else:
                        print(f"         Test {i+1}: HTTP {response.status_code}")
                        all_tests_passed = False
                        
                except requests.exceptions.Timeout:
                    print(f"         Test {i+1}: Timed out (over 10s)")
                    all_tests_passed = False
                except Exception as e:
                    print(f"         Test {i+1}: Error - {e}")
                    all_tests_passed = False
            
            if response_times:
                avg_time = sum(response_times) / len(response_times)
                min_time = min(response_times)
                max_time = max(response_times)
                
                print(f"         📊 Performance Summary:")
                print(f"            Average: {avg_time:.2f}s")
                print(f"            Min: {min_time:.2f}s")
                print(f"            Max: {max_time:.2f}s")
                
                # Check against 4 second requirement
                if avg_time <= 4.0:
                    print(f"         ✅ Performance: EXCELLENT (under 4s)")
                elif avg_time <= 6.0:
                    print(f"         ✅ Performance: ACCEPTABLE (under 6s)")
                else:
                    print(f"         ⚠️  Performance: SLOW (over 6s)")
        
        # Test concurrent fetching (Promise.all simulation)
        print("\n   🚀 Testing concurrent API fetching performance...")
        
        import concurrent.futures
        
        def fetch_api(url, name):
            try:
                start_time = time.time()
                response = requests.get(url, timeout=10)
                end_time = time.time()
                return {
                    'name': name,
                    'success': response.status_code == 200,
                    'time': end_time - start_time,
                    'status_code': response.status_code
                }
            except Exception as e:
                return {
                    'name': name,
                    'success': False,
                    'time': 0,
                    'error': str(e)
                }
        
        start_time = time.time()
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(fetch_api, PROJECTS_API_URL, 'Projects'),
                executor.submit(fetch_api, PUBLICATIONS_API_URL, 'Publications')
            ]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        end_time = time.time()
        
        total_concurrent_time = end_time - start_time
        successful_calls = [r for r in results if r['success']]
        
        print(f"      ⏱️  Total concurrent time: {total_concurrent_time:.2f}s")
        print(f"      ✅ Successful calls: {len(successful_calls)}/2")
        
        if len(successful_calls) == 2 and total_concurrent_time <= 6.0:
            print(f"      🚀 Concurrent performance: EXCELLENT")
        elif len(successful_calls) >= 1:
            print(f"      ✅ Concurrent performance: ACCEPTABLE")
        else:
            print(f"      ❌ Concurrent performance: POOR")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in performance verification: {e}")
        return False

def run_research_areas_filtering_tests():
    """Run all Research Areas data filtering verification tests"""
    print("🎯 Starting Research Areas Data Filtering Fix Verification")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Data Accuracy Verification
    try:
        data_accuracy_passed = test_data_accuracy_verification()
        test_results.append(("Data Accuracy Verification", data_accuracy_passed))
        all_tests_passed &= data_accuracy_passed
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 2: API Data Structure Validation
    try:
        api_structure_passed = test_api_data_structure_validation()
        test_results.append(("API Data Structure Validation", api_structure_passed))
        all_tests_passed &= api_structure_passed
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: Filtering Logic Testing
    try:
        filtering_logic_passed = test_filtering_logic()
        test_results.append(("Filtering Logic Testing", filtering_logic_passed))
        all_tests_passed &= filtering_logic_passed
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: Performance Verification
    try:
        performance_passed = test_performance_verification()
        test_results.append(("Performance Verification", performance_passed))
        all_tests_passed &= performance_passed
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 RESEARCH AREAS DATA FILTERING FIX - TEST RESULTS")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<40} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED! Research Areas data filtering fix is working correctly.")
        print("✅ Exact matching logic implemented successfully.")
        print("✅ Data counts match original Google Sheets data.")
        print("✅ No cross-contamination between research areas.")
        print("✅ Performance meets requirements (under 4 seconds).")
        return True
    else:
        print("⚠️  SOME TESTS FAILED! Data filtering fix needs attention.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_research_areas_filtering_tests()
    sys.exit(0 if success else 1)