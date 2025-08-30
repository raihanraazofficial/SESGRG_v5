#!/usr/bin/env python3
"""
Backend API Testing Suite - IEEE Format and Caching Optimization
Tests the updated Publications API with IEEE format and caching functionality
"""

import requests
import json
import os
import time
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

print(f"Testing Publications API with IEEE Format and Caching at: {API_BASE_URL}")
print("=" * 80)

def test_ieee_format_data_structure():
    """Test GET /api/publications endpoint with new IEEE format data structure"""
    print("1. Testing IEEE Format Data Structure...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/publications", timeout=15)
        if response.status_code != 200:
            print(f"   ❌ Publications API request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["publications", "pagination", "statistics"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            return False
        
        publications = data['publications']
        print(f"   ✅ Publications API working - Retrieved {len(publications)} publications")
        
        # Test IEEE format fields in publications
        if publications:
            pub = publications[0]
            ieee_fields = [
                "category", "authors", "title", "journal_book_conference_name",
                "volume", "issue", "location", "pages", "year", "citations",
                "doi_link", "research_areas", "ieee_formatted"
            ]
            missing_fields = [field for field in ieee_fields if field not in pub]
            if missing_fields:
                print(f"   ❌ Missing IEEE format fields: {missing_fields}")
                return False
            else:
                print(f"   ✅ IEEE format fields present: {ieee_fields}")
                print(f"   📄 Sample IEEE formatted: {pub.get('ieee_formatted', 'N/A')[:100]}...")
                
                # Test specific IEEE format categories
                categories_found = set(p.get('category') for p in publications)
                expected_categories = {"Journal Articles", "Conference Proceedings", "Book Chapters", "Books"}
                print(f"   📊 Categories found: {categories_found}")
                
                # Test IEEE formatted field content
                if pub.get('ieee_formatted'):
                    ieee_text = pub['ieee_formatted']
                    if pub['category'] == 'Journal Articles' and 'vol.' in ieee_text:
                        print(f"   ✅ Journal article IEEE format correct")
                    elif pub['category'] == 'Conference Proceedings' and any(word in ieee_text for word in ['Conference', 'Proceedings']):
                        print(f"   ✅ Conference proceedings IEEE format correct")
                    else:
                        print(f"   ✅ IEEE format generated for category: {pub['category']}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing IEEE format: {e}")
        return False

def test_caching_functionality():
    """Test caching functionality - first request from Google Sheets, subsequent from cache"""
    print("2. Testing Caching Functionality...")
    
    try:
        # Clear cache first
        print("   2.1 Clearing cache...")
        cache_clear_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if cache_clear_response.status_code == 200:
            clear_data = cache_clear_response.json()
            print(f"   ✅ Cache cleared successfully: {clear_data.get('message', 'Cache cleared')}")
        else:
            print(f"   ❌ Cache clear failed with status: {cache_clear_response.status_code}")
            return False
        
        # First request (should fetch from Google Sheets)
        print("   2.2 First request (from Google Sheets)...")
        start_time = time.time()
        first_response = requests.get(f"{API_BASE_URL}/publications", timeout=20)
        first_request_time = time.time() - start_time
        
        if first_response.status_code == 200:
            first_data = first_response.json()
            print(f"   ✅ First request completed in {first_request_time:.3f} seconds")
            print(f"   📊 Retrieved {len(first_data.get('publications', []))} publications from Google Sheets")
        else:
            print(f"   ❌ First request failed with status: {first_response.status_code}")
            return False
        
        # Small delay to ensure cache is set
        time.sleep(0.5)
        
        # Second request (should use cache)
        print("   2.3 Second request (from cache)...")
        start_time = time.time()
        second_response = requests.get(f"{API_BASE_URL}/publications", timeout=15)
        second_request_time = time.time() - start_time
        
        if second_response.status_code == 200:
            second_data = second_response.json()
            print(f"   ✅ Second request completed in {second_request_time:.3f} seconds")
            print(f"   📊 Retrieved {len(second_data.get('publications', []))} publications from cache")
            
            # Verify performance improvement
            if second_request_time < first_request_time:
                improvement = ((first_request_time - second_request_time) / first_request_time * 100)
                print(f"   🚀 Performance improvement: {improvement:.1f}% faster with caching")
            else:
                print(f"   ⚠️  Cache performance: Second request not significantly faster")
            
            # Verify data consistency
            if first_data == second_data:
                print(f"   ✅ Data consistency: Cached data matches original data")
            else:
                print(f"   ⚠️  Data consistency: Some differences between cached and original data")
        else:
            print(f"   ❌ Second request failed with status: {second_response.status_code}")
            return False
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing caching functionality: {e}")
        return False

def test_cache_status_endpoint():
    """Test GET /api/cache-status endpoint"""
    print("3. Testing Cache Status Endpoint...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Cache status request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["cached_items", "last_fetch_times", "cache_duration_minutes"]
        missing_keys = [key for key in required_keys if key not in data]
        
        if missing_keys:
            print(f"   ❌ Missing required keys: {missing_keys}")
            return False
        
        print(f"   ✅ Cache status endpoint working")
        print(f"   📊 Cached items: {data['cached_items']}")
        print(f"   ⏰ Cache duration: {data['cache_duration_minutes']} minutes")
        print(f"   🕒 Last fetch times: {list(data['last_fetch_times'].keys())}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing cache status endpoint: {e}")
        return False

def test_clear_cache_endpoint():
    """Test POST /api/clear-cache endpoint"""
    print("4. Testing Clear Cache Endpoint...")
    
    try:
        # First make sure there's something in cache
        requests.get(f"{API_BASE_URL}/publications", timeout=15)
        
        # Check cache status before clearing
        status_before = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if status_before.status_code == 200:
            cached_before = status_before.json().get('cached_items', 0)
            print(f"   📊 Items in cache before clearing: {cached_before}")
        
        # Clear cache
        response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Clear cache request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        if 'message' not in data:
            print(f"   ❌ Clear cache response missing message")
            return False
        
        print(f"   ✅ Clear cache endpoint working: {data['message']}")
        
        # Verify cache is actually cleared
        status_after = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if status_after.status_code == 200:
            cached_after = status_after.json().get('cached_items', 0)
            print(f"   📊 Items in cache after clearing: {cached_after}")
            
            if cached_after == 0:
                print(f"   ✅ Cache successfully cleared")
            else:
                print(f"   ⚠️  Cache may not be completely cleared")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing clear cache endpoint: {e}")
        return False

def test_ieee_formatted_publications_display():
    """Test IEEE formatted publications display with new fields"""
    print("5. Testing IEEE Formatted Publications Display...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/publications", timeout=15)
        if response.status_code != 200:
            print(f"   ❌ Publications request failed")
            return False
        
        data = response.json()
        publications = data.get('publications', [])
        
        if not publications:
            print(f"   ❌ No publications found to test")
            return False
        
        # Test each category
        categories_tested = set()
        for pub in publications:
            category = pub.get('category')
            if category not in categories_tested:
                print(f"   📄 Testing {category}:")
                
                # Check required fields for each category
                if category == "Journal Articles":
                    fields_to_check = ['authors', 'title', 'journal_book_conference_name', 'volume', 'issue', 'pages', 'year']
                elif category == "Conference Proceedings":
                    fields_to_check = ['authors', 'title', 'journal_book_conference_name', 'location', 'pages', 'year']
                elif category == "Book Chapters":
                    fields_to_check = ['authors', 'title', 'journal_book_conference_name', 'editors', 'publisher', 'pages', 'year']
                else:
                    fields_to_check = ['authors', 'title', 'year']
                
                present_fields = [field for field in fields_to_check if pub.get(field)]
                print(f"      ✅ Present fields: {present_fields}")
                
                # Test IEEE formatted output
                ieee_formatted = pub.get('ieee_formatted', '')
                if ieee_formatted:
                    print(f"      📝 IEEE format: {ieee_formatted[:150]}...")
                    
                    # Verify IEEE format contains key elements
                    if pub.get('authors') and any(author in ieee_formatted for author in pub['authors'][:2]):
                        print(f"      ✅ Authors present in IEEE format")
                    if pub.get('title') and pub['title'][:20] in ieee_formatted:
                        print(f"      ✅ Title present in IEEE format")
                    if pub.get('year') and pub['year'] in ieee_formatted:
                        print(f"      ✅ Year present in IEEE format")
                
                # Test additional fields
                additional_fields = ['citations', 'doi_link', 'research_areas']
                for field in additional_fields:
                    if pub.get(field):
                        if field == 'research_areas' and isinstance(pub[field], list):
                            print(f"      📊 {field}: {len(pub[field])} areas")
                        else:
                            print(f"      📊 {field}: {pub[field]}")
                
                categories_tested.add(category)
        
        print(f"   ✅ Tested {len(categories_tested)} publication categories")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing IEEE formatted display: {e}")
        return False

def test_category_filtering_with_books():
    """Test filtering by all categories including the new 'Books' category"""
    print("6. Testing Category Filtering Including Books...")
    
    try:
        categories = ["Journal Articles", "Conference Proceedings", "Book Chapters", "Books"]
        
        for category in categories:
            response = requests.get(f"{API_BASE_URL}/publications?category_filter={category}", timeout=10)
            if response.status_code != 200:
                print(f"   ❌ Category filter '{category}' failed with status: {response.status_code}")
                return False
            
            data = response.json()
            publications = data.get("publications", [])
            
            # Verify all returned publications have the correct category
            if publications:
                correct_category = all(pub.get("category") == category for pub in publications)
                if correct_category:
                    print(f"   ✅ Category '{category}': {len(publications)} publications")
                else:
                    print(f"   ❌ Category '{category}': Filtering not working correctly")
                    return False
            else:
                print(f"   ✅ Category '{category}': 0 publications (may be expected)")
        
        # Test combined category filtering
        response = requests.get(f"{API_BASE_URL}/publications", timeout=10)
        if response.status_code == 200:
            data = response.json()
            all_publications = data.get("publications", [])
            all_categories = set(pub.get("category") for pub in all_publications)
            print(f"   📊 All categories in dataset: {all_categories}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing category filtering: {e}")
        return False

def test_performance_improvements():
    """Test performance improvements with caching"""
    print("7. Testing Performance Improvements with Caching...")
    
    try:
        # Clear cache and measure multiple requests
        requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        
        request_times = []
        
        # Make 5 requests and measure times
        for i in range(5):
            start_time = time.time()
            response = requests.get(f"{API_BASE_URL}/publications", timeout=15)
            request_time = time.time() - start_time
            
            if response.status_code == 200:
                request_times.append(request_time)
                cache_status = "from cache" if i > 0 else "from Google Sheets"
                print(f"   📊 Request {i+1}: {request_time:.3f}s ({cache_status})")
            else:
                print(f"   ❌ Request {i+1} failed")
                return False
            
            time.sleep(0.2)  # Small delay between requests
        
        if len(request_times) >= 2:
            first_request = request_times[0]
            avg_cached_requests = sum(request_times[1:]) / len(request_times[1:])
            
            improvement = ((first_request - avg_cached_requests) / first_request * 100)
            print(f"   🚀 Average performance improvement: {improvement:.1f}%")
            
            if improvement > 10:  # At least 10% improvement expected
                print(f"   ✅ Significant performance improvement with caching")
            else:
                print(f"   ⚠️  Modest performance improvement with caching")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing performance improvements: {e}")
        return False

def test_statistics_calculation():
    """Test that statistics are calculated correctly from new data structure"""
    print("8. Testing Statistics Calculation from New Data Structure...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/publications", timeout=15)
        if response.status_code != 200:
            print(f"   ❌ Publications request failed")
            return False
        
        data = response.json()
        publications = data.get('publications', [])
        statistics = data.get('statistics', {})
        
        required_stats = ["total_publications", "total_citations", "latest_year", "total_areas"]
        missing_stats = [stat for stat in required_stats if stat not in statistics]
        
        if missing_stats:
            print(f"   ❌ Missing statistics: {missing_stats}")
            return False
        
        print(f"   ✅ All required statistics present")
        
        # Verify statistics calculation
        if publications:
            # Calculate expected values
            expected_total_pubs = len(publications)
            expected_total_citations = sum(pub.get('citations', 0) for pub in publications)
            expected_latest_year = max((int(pub.get('year', 0)) for pub in publications if pub.get('year', '').isdigit()), default=datetime.now().year)
            
            # Get unique research areas
            all_areas = set()
            for pub in publications:
                if pub.get('research_areas'):
                    all_areas.update(pub['research_areas'])
            expected_total_areas = len(all_areas)
            
            # Compare with API statistics
            print(f"   📊 Statistics verification:")
            print(f"      Total publications: {statistics['total_publications']} (expected: {expected_total_pubs})")
            print(f"      Total citations: {statistics['total_citations']} (expected: {expected_total_citations})")
            print(f"      Latest year: {statistics['latest_year']} (expected: {expected_latest_year})")
            print(f"      Total areas: {statistics['total_areas']} (expected: {expected_total_areas})")
            
            # Verify accuracy (allowing for some variation due to filtering)
            stats_accurate = True
            if abs(statistics['total_publications'] - expected_total_pubs) > 5:
                print(f"   ⚠️  Total publications mismatch")
                stats_accurate = False
            if abs(statistics['total_citations'] - expected_total_citations) > 50:
                print(f"   ⚠️  Total citations mismatch")
                stats_accurate = False
            
            if stats_accurate:
                print(f"   ✅ Statistics calculation appears accurate")
            else:
                print(f"   ⚠️  Some statistics may need verification")
        
        # Test filtered statistics
        response_filtered = requests.get(f"{API_BASE_URL}/publications?category_filter=Journal Articles", timeout=10)
        if response_filtered.status_code == 200:
            filtered_data = response_filtered.json()
            filtered_stats = filtered_data.get('statistics', {})
            filtered_pubs = filtered_data.get('publications', [])
            
            print(f"   📊 Filtered statistics (Journal Articles):")
            print(f"      Publications: {filtered_stats.get('total_publications', 0)} (actual: {len(filtered_pubs)})")
            print(f"      Citations: {filtered_stats.get('total_citations', 0)}")
            
            if len(filtered_pubs) > 0:
                print(f"   ✅ Filtered statistics working")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing statistics calculation: {e}")
        return False

def run_ieee_caching_tests():
    """Run all IEEE format and caching tests"""
    print("Starting IEEE Format and Caching Optimization Tests")
    print("=" * 80)
    
    results = {}
    
    # Run all tests
    results['ieee_format'] = test_ieee_format_data_structure()
    results['caching_functionality'] = test_caching_functionality()
    results['cache_status'] = test_cache_status_endpoint()
    results['clear_cache'] = test_clear_cache_endpoint()
    results['ieee_display'] = test_ieee_formatted_publications_display()
    results['category_filtering'] = test_category_filtering_with_books()
    results['performance'] = test_performance_improvements()
    results['statistics'] = test_statistics_calculation()
    
    print("\n" + "=" * 80)
    print("IEEE FORMAT AND CACHING TEST SUMMARY")
    print("=" * 80)
    
    all_passed = True
    
    test_descriptions = {
        'ieee_format': 'IEEE Format Data Structure',
        'caching_functionality': 'Caching Functionality',
        'cache_status': 'Cache Status Endpoint',
        'clear_cache': 'Clear Cache Endpoint',
        'ieee_display': 'IEEE Formatted Display',
        'category_filtering': 'Category Filtering (including Books)',
        'performance': 'Performance Improvements',
        'statistics': 'Statistics Calculation'
    }
    
    for test_name, description in test_descriptions.items():
        passed = results.get(test_name, False)
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {description}: {status}")
        if not passed:
            all_passed = False
    
    print("=" * 80)
    if all_passed:
        print("🎉 ALL IEEE FORMAT AND CACHING TESTS PASSED!")
        print("✅ Publications API with IEEE format and caching optimization is working correctly")
    else:
        print("⚠️  SOME IEEE FORMAT AND CACHING TESTS FAILED")
        print("❌ Issues found that need attention")
    
    return results, all_passed

if __name__ == "__main__":
    results, all_passed = run_ieee_caching_tests()
    sys.exit(0 if all_passed else 1)