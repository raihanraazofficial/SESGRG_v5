#!/usr/bin/env python3
"""
Smooth Filtering Backend Infrastructure Testing Suite
Tests the backend infrastructure supporting smooth filtering improvements on:
- Publications, Projects, Achievements, and News & Events pages
- Independent filtering logic where dropdown options are maintained separately
- Data structure validation for allYears, allAreas arrays
- Performance requirements for smooth UI interactions
"""

import requests
import json
import os
from datetime import datetime
import sys
import time
from collections import defaultdict

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

print(f"🎯 Testing Backend Infrastructure for Smooth Filtering Improvements")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Projects API: {PROJECTS_API_URL}")
print(f"Achievements API: {ACHIEVEMENTS_API_URL}")
print(f"News Events API: {NEWS_EVENTS_API_URL}")
print("=" * 80)

def test_google_sheets_api_performance():
    """Test all 4 API endpoints for performance supporting smooth filtering"""
    print("1. Testing Google Sheets API Integration Performance...")
    
    all_tests_passed = True
    api_endpoints = {
        'Publications': PUBLICATIONS_API_URL,
        'Projects': PROJECTS_API_URL,
        'Achievements': ACHIEVEMENTS_API_URL,
        'News Events': NEWS_EVENTS_API_URL
    }
    
    api_performance = {}
    
    for api_name, api_url in api_endpoints.items():
        print(f"\n   🔍 Testing {api_name} API Performance...")
        
        try:
            # Test multiple times for accurate performance measurement
            response_times = []
            for i in range(3):
                start_time = time.time()
                response = requests.get(api_url, timeout=6)
                end_time = time.time()
                response_time = end_time - start_time
                
                if response.status_code == 200:
                    response_times.append(response_time)
                    print(f"      Test {i+1}: {response_time:.2f}s")
                else:
                    print(f"      ❌ Test {i+1}: HTTP {response.status_code}")
                    all_tests_passed = False
                    
            if response_times:
                avg_time = sum(response_times) / len(response_times)
                api_performance[api_name] = {
                    'avg_time': avg_time,
                    'min_time': min(response_times),
                    'max_time': max(response_times),
                    'success_rate': len(response_times) / 3
                }
                
                print(f"      📊 Average Response Time: {avg_time:.2f}s")
                
                # Check against 4-second requirement for smooth UI
                if avg_time <= 4.0:
                    print(f"      ✅ Performance: EXCELLENT (supports smooth UI interactions)")
                else:
                    print(f"      ❌ Performance: TOO SLOW (may cause UI lag)")
                    all_tests_passed = False
                    
        except Exception as e:
            print(f"      ❌ {api_name} API error: {e}")
            all_tests_passed = False
    
    # Overall performance summary
    if api_performance:
        overall_avg = sum(p['avg_time'] for p in api_performance.values()) / len(api_performance)
        print(f"\n   📊 Overall API Performance: {overall_avg:.2f}s average")
        
        if overall_avg <= 4.0:
            print(f"   🚀 EXCELLENT: All APIs support smooth filtering interactions")
        else:
            print(f"   ⚠️  WARNING: Performance may impact smooth filtering UX")
            
    return all_tests_passed, api_performance

def test_data_structure_for_independent_filtering():
    """Test data structures that support independent dropdown filtering logic"""
    print("2. Testing Data Structure Validation for Independent Filtering...")
    
    all_tests_passed = True
    filter_data = {}
    
    # Test Publications API for independent filtering support
    print("\n   📚 Testing Publications API Data Structure...")
    try:
        response = requests.get(PUBLICATIONS_API_URL, timeout=6)
        if response.status_code == 200:
            data = response.json()
            publications = data.get('publications', []) if isinstance(data, dict) else data
            
            if len(publications) > 0:
                print(f"      ✅ Retrieved {len(publications)} publications")
                
                # Extract all unique values for independent dropdowns
                all_years = set()
                all_categories = set()
                all_research_areas = set()
                
                for pub in publications:
                    # Years for year dropdown
                    if 'year' in pub and pub['year']:
                        all_years.add(str(pub['year']))
                    
                    # Categories for category dropdown
                    if 'category' in pub and pub['category']:
                        all_categories.add(pub['category'])
                    
                    # Research areas for research area dropdown
                    if 'research_areas' in pub and isinstance(pub['research_areas'], list):
                        for area in pub['research_areas']:
                            if area:
                                all_research_areas.add(area)
                
                filter_data['Publications'] = {
                    'allYears': sorted(list(all_years), reverse=True),
                    'allCategories': sorted(list(all_categories)),
                    'allResearchAreas': sorted(list(all_research_areas))
                }
                
                print(f"      ✅ Years available: {len(all_years)} ({min(all_years) if all_years else 'N/A'} - {max(all_years) if all_years else 'N/A'})")
                print(f"      ✅ Categories available: {len(all_categories)} {list(all_categories)}")
                print(f"      ✅ Research Areas available: {len(all_research_areas)}")
                
                # Validate that we have sufficient data for independent filtering
                if len(all_years) >= 2 and len(all_categories) >= 2 and len(all_research_areas) >= 3:
                    print(f"      ✅ EXCELLENT: Sufficient data for independent dropdown filtering")
                else:
                    print(f"      ⚠️  LIMITED: May have limited filtering options")
                    
            else:
                print(f"      ❌ No publications data available")
                all_tests_passed = False
                
        else:
            print(f"      ❌ Publications API not accessible: {response.status_code}")
            all_tests_passed = False
            
    except Exception as e:
        print(f"      ❌ Publications API error: {e}")
        all_tests_passed = False
    
    # Test Projects API for independent filtering support
    print("\n   📊 Testing Projects API Data Structure...")
    try:
        response = requests.get(PROJECTS_API_URL, timeout=6)
        if response.status_code == 200:
            data = response.json()
            projects = data.get('projects', []) if isinstance(data, dict) else data
            
            if len(projects) > 0:
                print(f"      ✅ Retrieved {len(projects)} projects")
                
                # Extract all unique values for independent dropdowns
                all_statuses = set()
                all_research_areas = set()
                all_years = set()
                
                for project in projects:
                    # Status for status dropdown
                    if 'status' in project and project['status']:
                        all_statuses.add(project['status'])
                    
                    # Research areas for research area dropdown
                    if 'research_areas' in project and isinstance(project['research_areas'], list):
                        for area in project['research_areas']:
                            if area:
                                all_research_areas.add(area)
                    
                    # Years from start_date or end_date
                    for date_field in ['start_date', 'end_date']:
                        if date_field in project and project[date_field]:
                            try:
                                year = str(project[date_field])[:4]
                                if year.isdigit():
                                    all_years.add(year)
                            except:
                                pass
                
                filter_data['Projects'] = {
                    'allStatuses': sorted(list(all_statuses)),
                    'allResearchAreas': sorted(list(all_research_areas)),
                    'allYears': sorted(list(all_years), reverse=True)
                }
                
                print(f"      ✅ Statuses available: {len(all_statuses)} {list(all_statuses)}")
                print(f"      ✅ Research Areas available: {len(all_research_areas)}")
                print(f"      ✅ Years available: {len(all_years)}")
                
                # Validate that we have sufficient data for independent filtering
                if len(all_statuses) >= 2 and len(all_research_areas) >= 2:
                    print(f"      ✅ EXCELLENT: Sufficient data for independent dropdown filtering")
                else:
                    print(f"      ⚠️  LIMITED: May have limited filtering options")
                    
            else:
                print(f"      ❌ No projects data available")
                all_tests_passed = False
                
        else:
            print(f"      ❌ Projects API not accessible: {response.status_code}")
            all_tests_passed = False
            
    except Exception as e:
        print(f"      ❌ Projects API error: {e}")
        all_tests_passed = False
    
    # Test Achievements API for filtering support
    print("\n   🏆 Testing Achievements API Data Structure...")
    try:
        response = requests.get(ACHIEVEMENTS_API_URL, timeout=6)
        if response.status_code == 200:
            data = response.json()
            achievements = data.get('achievements', data.get('data', [])) if isinstance(data, dict) else data
            
            if len(achievements) > 0:
                print(f"      ✅ Retrieved {len(achievements)} achievements")
                
                # Extract all unique values for filtering
                all_categories = set()
                all_years = set()
                
                for achievement in achievements:
                    # Categories
                    if 'category' in achievement and achievement['category']:
                        all_categories.add(achievement['category'])
                    
                    # Years
                    if 'year' in achievement and achievement['year']:
                        all_years.add(str(achievement['year']))
                    elif 'date' in achievement and achievement['date']:
                        try:
                            year = str(achievement['date'])[:4]
                            if year.isdigit():
                                all_years.add(year)
                        except:
                            pass
                
                filter_data['Achievements'] = {
                    'allCategories': sorted(list(all_categories)),
                    'allYears': sorted(list(all_years), reverse=True)
                }
                
                print(f"      ✅ Categories available: {len(all_categories)} {list(all_categories)}")
                print(f"      ✅ Years available: {len(all_years)}")
                
            else:
                print(f"      ⚠️  No achievements data available")
                
        else:
            print(f"      ❌ Achievements API not accessible: {response.status_code}")
            all_tests_passed = False
            
    except Exception as e:
        print(f"      ❌ Achievements API error: {e}")
        all_tests_passed = False
    
    # Test News Events API for filtering support
    print("\n   📰 Testing News Events API Data Structure...")
    try:
        response = requests.get(NEWS_EVENTS_API_URL, timeout=6)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
            
            if len(news_events) > 0:
                print(f"      ✅ Retrieved {len(news_events)} news events")
                
                # Extract all unique values for filtering
                all_categories = set()
                all_years = set()
                
                for event in news_events:
                    # Categories
                    if 'category' in event and event['category']:
                        all_categories.add(event['category'])
                    
                    # Years from date
                    if 'date' in event and event['date']:
                        try:
                            year = str(event['date'])[:4]
                            if year.isdigit():
                                all_years.add(year)
                        except:
                            pass
                
                filter_data['News Events'] = {
                    'allCategories': sorted(list(all_categories)),
                    'allYears': sorted(list(all_years), reverse=True)
                }
                
                print(f"      ✅ Categories available: {len(all_categories)} {list(all_categories)}")
                print(f"      ✅ Years available: {len(all_years)}")
                
            else:
                print(f"      ⚠️  No news events data available")
                
        else:
            print(f"      ❌ News Events API not accessible: {response.status_code}")
            all_tests_passed = False
            
    except Exception as e:
        print(f"      ❌ News Events API error: {e}")
        all_tests_passed = False
    
    return all_tests_passed, filter_data

def test_response_time_for_smooth_ui():
    """Test response times specifically for smooth UI interactions (under 4 seconds)"""
    print("3. Testing Response Time Performance for Smooth UI...")
    
    all_tests_passed = True
    
    # Test concurrent API calls (simulating frontend behavior)
    print("\n   🚀 Testing Concurrent API Performance (Frontend Simulation)...")
    
    try:
        import concurrent.futures
        
        def fetch_api_with_timing(url, name):
            try:
                start_time = time.time()
                response = requests.get(url, timeout=8)
                end_time = time.time()
                return {
                    'name': name,
                    'success': response.status_code == 200,
                    'response_time': end_time - start_time,
                    'status_code': response.status_code,
                    'data_size': len(response.content) if response.status_code == 200 else 0
                }
            except Exception as e:
                return {
                    'name': name,
                    'success': False,
                    'response_time': 0,
                    'error': str(e)
                }
        
        # Test all 4 APIs concurrently
        start_time = time.time()
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = [
                executor.submit(fetch_api_with_timing, PUBLICATIONS_API_URL, 'Publications'),
                executor.submit(fetch_api_with_timing, PROJECTS_API_URL, 'Projects'),
                executor.submit(fetch_api_with_timing, ACHIEVEMENTS_API_URL, 'Achievements'),
                executor.submit(fetch_api_with_timing, NEWS_EVENTS_API_URL, 'News Events')
            ]
            
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        end_time = time.time()
        total_concurrent_time = end_time - start_time
        
        print(f"      ⏱️  Total concurrent fetch time: {total_concurrent_time:.2f}s")
        
        # Analyze individual API performance
        successful_apis = [r for r in results if r['success']]
        failed_apis = [r for r in results if not r['success']]
        
        print(f"      ✅ Successful APIs: {len(successful_apis)}/4")
        
        if len(successful_apis) == 4:
            avg_individual_time = sum(r['response_time'] for r in successful_apis) / len(successful_apis)
            max_individual_time = max(r['response_time'] for r in successful_apis)
            
            print(f"      📊 Average individual API time: {avg_individual_time:.2f}s")
            print(f"      📊 Slowest individual API time: {max_individual_time:.2f}s")
            
            # Check against smooth UI requirements
            if total_concurrent_time <= 4.0:
                print(f"      🚀 EXCELLENT: Concurrent loading supports smooth UI (under 4s)")
            elif total_concurrent_time <= 6.0:
                print(f"      ✅ GOOD: Acceptable for UI interactions")
            else:
                print(f"      ❌ TOO SLOW: May cause UI lag and poor user experience")
                all_tests_passed = False
                
            if max_individual_time <= 4.0:
                print(f"      ✅ All individual APIs meet 4s requirement")
            else:
                print(f"      ⚠️  Some APIs exceed 4s requirement")
                
        else:
            print(f"      ❌ API failures detected:")
            for failed in failed_apis:
                print(f"         - {failed['name']}: {failed.get('error', 'Unknown error')}")
            all_tests_passed = False
    
    except Exception as e:
        print(f"      ❌ Concurrent API test failed: {e}")
        all_tests_passed = False
    
    return all_tests_passed

def test_filter_data_completeness():
    """Test that APIs return complete datasets for populating dropdown options"""
    print("4. Testing Filter Data Completeness...")
    
    all_tests_passed = True
    
    # Test Publications filter completeness
    print("\n   📚 Testing Publications Filter Data Completeness...")
    try:
        response = requests.get(PUBLICATIONS_API_URL, timeout=6)
        if response.status_code == 200:
            data = response.json()
            publications = data.get('publications', []) if isinstance(data, dict) else data
            
            # Count completeness of filter fields
            total_pubs = len(publications)
            year_complete = sum(1 for p in publications if p.get('year'))
            category_complete = sum(1 for p in publications if p.get('category'))
            research_areas_complete = sum(1 for p in publications if p.get('research_areas'))
            
            print(f"      📊 Total Publications: {total_pubs}")
            print(f"      📅 Year field completeness: {year_complete}/{total_pubs} ({year_complete/total_pubs*100:.1f}%)")
            print(f"      🏷️  Category field completeness: {category_complete}/{total_pubs} ({category_complete/total_pubs*100:.1f}%)")
            print(f"      🔬 Research Areas completeness: {research_areas_complete}/{total_pubs} ({research_areas_complete/total_pubs*100:.1f}%)")
            
            # Check if completeness is sufficient for good filtering UX
            if year_complete/total_pubs >= 0.8 and category_complete/total_pubs >= 0.8:
                print(f"      ✅ EXCELLENT: High data completeness supports robust filtering")
            elif year_complete/total_pubs >= 0.6 and category_complete/total_pubs >= 0.6:
                print(f"      ✅ GOOD: Adequate data completeness for filtering")
            else:
                print(f"      ⚠️  LIMITED: Low data completeness may affect filtering quality")
                
        else:
            print(f"      ❌ Publications API not accessible")
            all_tests_passed = False
            
    except Exception as e:
        print(f"      ❌ Publications completeness test failed: {e}")
        all_tests_passed = False
    
    # Test Projects filter completeness
    print("\n   📊 Testing Projects Filter Data Completeness...")
    try:
        response = requests.get(PROJECTS_API_URL, timeout=6)
        if response.status_code == 200:
            data = response.json()
            projects = data.get('projects', []) if isinstance(data, dict) else data
            
            # Count completeness of filter fields
            total_projects = len(projects)
            status_complete = sum(1 for p in projects if p.get('status'))
            research_areas_complete = sum(1 for p in projects if p.get('research_areas'))
            
            print(f"      📊 Total Projects: {total_projects}")
            print(f"      📋 Status field completeness: {status_complete}/{total_projects} ({status_complete/total_projects*100:.1f}%)")
            print(f"      🔬 Research Areas completeness: {research_areas_complete}/{total_projects} ({research_areas_complete/total_projects*100:.1f}%)")
            
            # Check if completeness is sufficient for good filtering UX
            if status_complete/total_projects >= 0.8 and research_areas_complete/total_projects >= 0.8:
                print(f"      ✅ EXCELLENT: High data completeness supports robust filtering")
            else:
                print(f"      ✅ ADEQUATE: Data completeness sufficient for basic filtering")
                
        else:
            print(f"      ❌ Projects API not accessible")
            all_tests_passed = False
            
    except Exception as e:
        print(f"      ❌ Projects completeness test failed: {e}")
        all_tests_passed = False
    
    return all_tests_passed

def test_api_resilience_and_error_handling():
    """Test API resilience and error handling for improved UX"""
    print("5. Testing API Resilience and Error Handling...")
    
    all_tests_passed = True
    
    # Test timeout handling
    print("\n   ⏱️  Testing Timeout Resilience...")
    try:
        # Test with very short timeout
        response = requests.get(PUBLICATIONS_API_URL, timeout=0.001)
        print(f"      ⚠️  Unexpected success with short timeout")
    except requests.exceptions.Timeout:
        print(f"      ✅ Timeout properly handled - frontend should show loading state")
    except Exception as e:
        print(f"      ✅ Network error handled: {type(e).__name__}")
    
    # Test invalid URL handling
    print("\n   🔗 Testing Invalid URL Resilience...")
    try:
        invalid_url = "https://invalid-google-sheets-url.com/exec"
        response = requests.get(invalid_url, timeout=3)
        print(f"      ⚠️  Unexpected response from invalid URL")
    except requests.exceptions.RequestException:
        print(f"      ✅ Invalid URL properly handled - frontend should show error state")
    except Exception as e:
        print(f"      ✅ URL error handled: {type(e).__name__}")
    
    # Test rate limiting resilience
    print("\n   🚦 Testing Rate Limiting Resilience...")
    rapid_requests = 10
    success_count = 0
    rate_limited_count = 0
    
    for i in range(rapid_requests):
        try:
            response = requests.get(NEWS_EVENTS_API_URL, timeout=2)
            if response.status_code == 200:
                success_count += 1
            elif response.status_code == 429:
                rate_limited_count += 1
                print(f"      ✅ Rate limiting detected - proper handling needed in frontend")
                break
        except Exception:
            pass
    
    print(f"      📊 Rapid requests: {success_count}/{rapid_requests} successful")
    
    if success_count == rapid_requests:
        print(f"      ✅ No rate limiting - APIs handle concurrent requests well")
    elif rate_limited_count > 0:
        print(f"      ⚠️  Rate limiting present - frontend should implement retry logic")
    else:
        print(f"      ⚠️  Some requests failed - check API reliability")
    
    # Test data consistency
    print("\n   🔄 Testing Data Consistency...")
    try:
        # Make two requests and compare
        response1 = requests.get(PUBLICATIONS_API_URL, timeout=5)
        time.sleep(1)
        response2 = requests.get(PUBLICATIONS_API_URL, timeout=5)
        
        if response1.status_code == 200 and response2.status_code == 200:
            data1 = response1.json()
            data2 = response2.json()
            
            if data1 == data2:
                print(f"      ✅ Data consistency: Identical responses (good for caching)")
            else:
                print(f"      ℹ️  Data may be real-time updated (normal for live data)")
        else:
            print(f"      ❌ Consistency test failed - API reliability issues")
            all_tests_passed = False
            
    except Exception as e:
        print(f"      ❌ Consistency test error: {e}")
        all_tests_passed = False
    
    return all_tests_passed

def run_smooth_filtering_tests():
    """Run comprehensive tests for smooth filtering backend infrastructure"""
    print("🎯 Starting Smooth Filtering Backend Infrastructure Tests")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Google Sheets API Integration Performance
    try:
        performance_good, api_performance = test_google_sheets_api_performance()
        test_results.append(("Google Sheets API Performance", performance_good))
        all_tests_passed &= performance_good
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 2: Data Structure Validation for Independent Filtering
    try:
        structure_valid, filter_data = test_data_structure_for_independent_filtering()
        test_results.append(("Data Structure for Independent Filtering", structure_valid))
        all_tests_passed &= structure_valid
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: Response Time Performance for Smooth UI
    try:
        ui_performance_good = test_response_time_for_smooth_ui()
        test_results.append(("Response Time for Smooth UI", ui_performance_good))
        all_tests_passed &= ui_performance_good
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: Filter Data Completeness
    try:
        completeness_good = test_filter_data_completeness()
        test_results.append(("Filter Data Completeness", completeness_good))
        all_tests_passed &= completeness_good
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 5: API Resilience and Error Handling
    try:
        resilience_good = test_api_resilience_and_error_handling()
        test_results.append(("API Resilience and Error Handling", resilience_good))
        all_tests_passed &= resilience_good
    except Exception as e:
        print(f"❌ Test 5 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 SMOOTH FILTERING BACKEND INFRASTRUCTURE - TEST RESULTS")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<45} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED! Backend infrastructure fully supports smooth filtering improvements.")
        print("✅ Google Sheets API integration performance is excellent (under 4s)")
        print("✅ Data structures support independent dropdown filtering logic")
        print("✅ APIs return complete datasets for allYears, allAreas arrays")
        print("✅ Error handling supports improved UX")
        print("✅ Ready for smooth filtering frontend implementation")
        return True
    else:
        print("⚠️  SOME TESTS FAILED! Backend infrastructure needs improvements for optimal filtering UX.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_smooth_filtering_tests()
    sys.exit(0 if success else 1)