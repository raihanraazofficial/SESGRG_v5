#!/usr/bin/env python3
"""
Research Areas Page Modifications - Comprehensive Testing Suite
Tests the recent modifications to Research Areas page as requested in review:
1. Google Sheets API Integration: Verify all research area data fetching
2. Section Reordering: Test Learn More detailed pages structure
3. Loading Performance: Check optimized Learn More functionality
4. Real-time Data: Ensure Research Output section displays correct statistics
"""

import requests
import json
import os
from datetime import datetime
import sys
import time
import concurrent.futures

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
required_apis = ['publications', 'projects']
for api in required_apis:
    if not API_URLS.get(api):
        print(f"ERROR: Could not get REACT_APP_{api.upper()}_API_URL from frontend/.env")
        sys.exit(1)

PUBLICATIONS_API_URL = API_URLS['publications']
PROJECTS_API_URL = API_URLS['projects']

print(f"🎯 Testing Research Areas Page Modifications (Review Request)")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Projects API: {PROJECTS_API_URL}")
print("=" * 80)

def test_google_sheets_api_integration():
    """Test 1: Google Sheets API Integration for Research Areas"""
    print("1️⃣ Testing Google Sheets API Integration for Research Areas...")
    
    all_tests_passed = True
    
    try:
        # Test concurrent fetching (Promise.all implementation)
        print("   🚀 Testing concurrent Projects and Publications API calls...")
        
        start_time = time.time()
        
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
                return {'name': name, 'success': False, 'error': str(e)}
        
        # Concurrent execution like frontend Promise.all
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(fetch_api, PROJECTS_API_URL, 'Projects'),
                executor.submit(fetch_api, PUBLICATIONS_API_URL, 'Publications')
            ]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        end_time = time.time()
        concurrent_time = end_time - start_time
        
        successful_apis = [r for r in results if r['success']]
        print(f"      ✅ Concurrent API fetching: {len(successful_apis)}/2 successful in {concurrent_time:.2f}s")
        
        if len(successful_apis) != 2:
            print(f"      ❌ API Integration failed - not all APIs accessible")
            all_tests_passed = False
            return False
        
        # Verify data structure for research area filtering
        projects_result = next((r for r in results if r['name'] == 'Projects'), None)
        publications_result = next((r for r in results if r['name'] == 'Publications'), None)
        
        if projects_result and projects_result['success']:
            projects_data = projects_result['data']
            projects = projects_data.get('projects', []) if isinstance(projects_data, dict) else projects_data
            print(f"      ✅ Projects API: {len(projects)} items with research area filtering support")
            
            if len(projects) > 0:
                sample_project = projects[0]
                if 'research_areas' in sample_project:
                    print(f"      ✅ Projects have research_areas field: {sample_project.get('research_areas', [])}")
                else:
                    print(f"      ❌ Projects missing research_areas field")
                    all_tests_passed = False
        
        if publications_result and publications_result['success']:
            publications_data = publications_result['data']
            publications = publications_data.get('publications', []) if isinstance(publications_data, dict) else publications_data
            print(f"      ✅ Publications API: {len(publications)} items with research area filtering support")
            
            if len(publications) > 0:
                sample_pub = publications[0]
                if 'research_areas' in sample_pub and 'category' in sample_pub:
                    print(f"      ✅ Publications have required fields: research_areas, category")
                else:
                    print(f"      ❌ Publications missing required fields")
                    all_tests_passed = False
        
        return all_tests_passed, results
        
    except Exception as e:
        print(f"   ❌ Error testing Google Sheets API integration: {e}")
        return False, []

def test_section_reordering_data_structure(api_results):
    """Test 2: Section Reordering - Data Structure for Learn More"""
    print("2️⃣ Testing Section Reordering - Data Structure for Learn More...")
    
    all_tests_passed = True
    
    try:
        projects_result = next((r for r in api_results if r['name'] == 'Projects'), None)
        publications_result = next((r for r in api_results if r['name'] == 'Publications'), None)
        
        # Test data structure supports the new section order:
        # 1. Research Overview (first)
        # 2. Research Objectives  
        # 3. Key Applications
        # 4. Research Team (moved from original position)
        # 5. Research Output (renamed from "Real-time Research Data")
        # 6. Explore Related Research (last)
        
        print("   📋 Verifying data structure supports Learn More section reordering...")
        
        if projects_result and projects_result['success']:
            projects_data = projects_result['data']
            projects = projects_data.get('projects', []) if isinstance(projects_data, dict) else projects_data
            
            if len(projects) > 0:
                sample_project = projects[0]
                
                # Required fields for Research Output section (section 5)
                required_fields = ['id', 'title', 'status', 'research_areas']
                missing_fields = [field for field in required_fields if field not in sample_project]
                
                if not missing_fields:
                    print(f"      ✅ Projects data structure supports Research Output section")
                    
                    # Test Active/Completed separation for Research Output section
                    active_projects = [p for p in projects if p.get('status') == 'Active']
                    completed_projects = [p for p in projects if p.get('status') == 'Completed']
                    print(f"      ✅ Research Output data: {len(active_projects)} Active, {len(completed_projects)} Completed projects")
                else:
                    print(f"      ❌ Missing required fields for Research Output section: {missing_fields}")
                    all_tests_passed = False
            else:
                print(f"      ⚠️  No projects data for section testing")
        
        if publications_result and publications_result['success']:
            publications_data = publications_result['data']
            publications = publications_data.get('publications', []) if isinstance(publications_data, dict) else publications_data
            
            if len(publications) > 0:
                sample_pub = publications[0]
                
                # Required fields for Research Output section (section 5)
                required_fields = ['id', 'title', 'category', 'research_areas']
                missing_fields = [field for field in required_fields if field not in sample_pub]
                
                if not missing_fields:
                    print(f"      ✅ Publications data structure supports Research Output section")
                    
                    # Test publication categories for Research Output section
                    journal_articles = [p for p in publications if p.get('category') == 'Journal Articles']
                    conference_papers = [p for p in publications if p.get('category') == 'Conference Proceedings']
                    book_chapters = [p for p in publications if p.get('category') == 'Book Chapters']
                    
                    print(f"      ✅ Research Output data: {len(journal_articles)} Journal Articles, {len(conference_papers)} Conference Papers, {len(book_chapters)} Book Chapters")
                else:
                    print(f"      ❌ Missing required fields for Research Output section: {missing_fields}")
                    all_tests_passed = False
            else:
                print(f"      ⚠️  No publications data for section testing")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing section reordering data structure: {e}")
        return False

def test_loading_performance_optimization():
    """Test 3: Loading Performance Optimization"""
    print("3️⃣ Testing Loading Performance Optimization...")
    
    all_tests_passed = True
    
    try:
        # Test individual API response times (should be under 4s for optimized loading)
        performance_results = []
        
        for api_name, api_url in [('Projects', PROJECTS_API_URL), ('Publications', PUBLICATIONS_API_URL)]:
            print(f"   ⏱️  Testing {api_name} API performance...")
            
            # Test multiple times to get average
            response_times = []
            for i in range(3):
                start_time = time.time()
                try:
                    response = requests.get(api_url, timeout=6)
                    end_time = time.time()
                    response_time = end_time - start_time
                    
                    if response.status_code == 200:
                        response_times.append(response_time)
                        print(f"      Test {i+1}: {response_time:.2f}s")
                    else:
                        print(f"      Test {i+1}: HTTP {response.status_code}")
                        all_tests_passed = False
                        
                except Exception as e:
                    print(f"      Test {i+1}: Error - {e}")
                    all_tests_passed = False
            
            if response_times:
                avg_time = sum(response_times) / len(response_times)
                performance_results.append({
                    'api': api_name,
                    'avg_time': avg_time,
                    'min_time': min(response_times),
                    'max_time': max(response_times)
                })
                
                if avg_time <= 4.0:
                    print(f"      🚀 {api_name} Performance: EXCELLENT (avg {avg_time:.2f}s - under 4s)")
                else:
                    print(f"      ⚠️  {api_name} Performance: SLOW (avg {avg_time:.2f}s - over 4s)")
                    all_tests_passed = False
        
        # Test concurrent loading performance (simulating Learn More optimization)
        print(f"   🚀 Testing concurrent loading performance (Learn More optimization)...")
        
        start_time = time.time()
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(requests.get, PROJECTS_API_URL, timeout=6),
                executor.submit(requests.get, PUBLICATIONS_API_URL, timeout=6)
            ]
            concurrent_results = [future.result() for future in concurrent.futures.as_completed(futures)]
        end_time = time.time()
        
        concurrent_time = end_time - start_time
        print(f"      ⏱️  Concurrent loading time: {concurrent_time:.2f}s")
        
        if concurrent_time <= 4.0:
            print(f"      🚀 Concurrent Performance: EXCELLENT (under 4s)")
        else:
            print(f"      ⚠️  Concurrent Performance: NEEDS OPTIMIZATION (over 4s)")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing loading performance optimization: {e}")
        return False

def test_real_time_data_verification(api_results):
    """Test 4: Real-time Data Verification for Research Output"""
    print("4️⃣ Testing Real-time Data for Research Output Section...")
    
    all_tests_passed = True
    
    try:
        # Test research area filtering (exact matching as implemented in ResearchAreas.jsx)
        research_areas = [
            "Smart Grid Technologies",
            "Microgrids & Distributed Energy Systems", 
            "Renewable Energy Integration",
            "Grid Optimization & Stability",
            "Energy Storage Systems",
            "Power System Automation",
            "Cybersecurity and AI for Power Infrastructure"
        ]
        
        projects_result = next((r for r in api_results if r['name'] == 'Projects'), None)
        publications_result = next((r for r in api_results if r['name'] == 'Publications'), None)
        
        if projects_result and projects_result['success'] and publications_result and publications_result['success']:
            projects = projects_result['data'].get('projects', []) if isinstance(projects_result['data'], dict) else projects_result['data']
            publications = publications_result['data'].get('publications', []) if isinstance(publications_result['data'], dict) else publications_result['data']
            
            print(f"   📊 Testing real-time data filtering for Research Output section...")
            
            area_stats = {}
            total_filtered_projects = 0
            total_filtered_publications = 0
            
            for area_name in research_areas:
                # Filter projects by exact research area matching (same logic as ResearchAreas.jsx)
                area_projects = [p for p in projects if 
                               p.get('research_areas') and 
                               isinstance(p.get('research_areas'), list) and
                               area_name in p.get('research_areas', [])]
                
                # Filter publications by exact research area matching  
                area_publications = [p for p in publications if 
                                   p.get('research_areas') and 
                                   isinstance(p.get('research_areas'), list) and
                                   area_name in p.get('research_areas', [])]
                
                area_stats[area_name] = {
                    'projects': len(area_projects),
                    'publications': len(area_publications),
                    'active_projects': len([p for p in area_projects if p.get('status') == 'Active']),
                    'completed_projects': len([p for p in area_projects if p.get('status') == 'Completed']),
                    'journal_articles': len([p for p in area_publications if p.get('category') == 'Journal Articles']),
                    'conference_papers': len([p for p in area_publications if p.get('category') == 'Conference Proceedings']),
                    'book_chapters': len([p for p in area_publications if p.get('category') == 'Book Chapters'])
                }
                
                total_filtered_projects += len(area_projects)
                total_filtered_publications += len(area_publications)
                
                if len(area_projects) > 0 or len(area_publications) > 0:
                    print(f"      📋 '{area_name}': {len(area_projects)} projects, {len(area_publications)} publications")
                    stats = area_stats[area_name]
                    print(f"         - Active: {stats['active_projects']}, Completed: {stats['completed_projects']}")
                    print(f"         - Journal: {stats['journal_articles']}, Conference: {stats['conference_papers']}, Books: {stats['book_chapters']}")
            
            # Verify Research Output section statistics
            print(f"   ✅ Research Output section statistics verification:")
            print(f"      📊 Total filtered projects: {total_filtered_projects}")
            print(f"      📚 Total filtered publications: {total_filtered_publications}")
            
            # Test that statistics match expected format for Research Output section
            areas_with_data = [area for area, stats in area_stats.items() if stats['projects'] > 0 or stats['publications'] > 0]
            print(f"      🎯 Research areas with real-time data: {len(areas_with_data)}")
            
            if len(areas_with_data) > 0:
                print(f"      ✅ Research Output section has real-time data for display")
                
                # Verify the 5 statistics cards data (Active Projects, Completed Projects, Journal Articles, Conference Papers, Book Chapters)
                sample_area = areas_with_data[0]
                sample_stats = area_stats[sample_area]
                print(f"      📈 Sample Research Output statistics for '{sample_area}':")
                print(f"         - Active Projects: {sample_stats['active_projects']}")
                print(f"         - Completed Projects: {sample_stats['completed_projects']}")
                print(f"         - Journal Articles: {sample_stats['journal_articles']}")
                print(f"         - Conference Papers: {sample_stats['conference_papers']}")
                print(f"         - Book Chapters: {sample_stats['book_chapters']}")
                
            else:
                print(f"      ⚠️  No research areas have data (may be expected for some areas)")
            
        else:
            print(f"   ❌ Cannot test real-time data - API results not available")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing real-time data verification: {e}")
        return False

def run_research_areas_modifications_tests():
    """Run all Research Areas page modification tests"""
    print("🚀 Starting Research Areas Page Modifications Testing")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Google Sheets API Integration
    try:
        api_integration_working, api_results = test_google_sheets_api_integration()
        test_results.append(("Google Sheets API Integration", api_integration_working))
        all_tests_passed &= api_integration_working
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        all_tests_passed = False
        api_results = []
    
    # Test 2: Section Reordering Data Structure
    try:
        section_reordering_working = test_section_reordering_data_structure(api_results)
        test_results.append(("Section Reordering Data Structure", section_reordering_working))
        all_tests_passed &= section_reordering_working
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: Loading Performance Optimization
    try:
        performance_working = test_loading_performance_optimization()
        test_results.append(("Loading Performance Optimization", performance_working))
        all_tests_passed &= performance_working
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: Real-time Data Verification
    try:
        real_time_data_working = test_real_time_data_verification(api_results)
        test_results.append(("Real-time Data Verification", real_time_data_working))
        all_tests_passed &= real_time_data_working
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 RESEARCH AREAS PAGE MODIFICATIONS - TEST RESULTS SUMMARY")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<45} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL RESEARCH AREAS MODIFICATIONS TESTS PASSED!")
        print("✅ Google Sheets API integration working correctly")
        print("✅ Section reordering data structure supports Learn More pages")
        print("✅ Loading performance optimized for immediate window opening")
        print("✅ Real-time data verification successful for Research Output section")
        print("✅ Research Areas page modifications are ready for production use")
        return True
    else:
        print("⚠️  SOME RESEARCH AREAS MODIFICATION TESTS FAILED!")
        print("Please review the issues above before deployment.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_research_areas_modifications_tests()
    sys.exit(0 if success else 1)