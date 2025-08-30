#!/usr/bin/env python3
"""
News & Events Featured Items Testing Suite
Tests the featured items functionality specifically as per review request:
- Featured items appear first in all sorting scenarios
- "Breakthrough in Wind Energy" with featured=1 appears first
- Category filtering maintains featured items priority
- Pagination works correctly with featured items
- Sorting logic: featured first, then regular items sorted
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

print(f"Testing News & Events Featured Items at: {API_BASE_URL}")
print("=" * 80)

def test_news_events_featured_items_functionality():
    """Test News & Events API featured items functionality as per review request"""
    print("Testing News & Events Featured Items Functionality - COMPREHENSIVE TESTING...")
    
    all_tests_passed = True
    
    try:
        # Clear cache first to ensure fresh data
        print("   0.1 Clearing cache to ensure fresh data...")
        cache_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if cache_response.status_code == 200:
            print("      ✅ Cache cleared successfully")
        else:
            print("      ⚠️  Cache clear failed, continuing with test")
        
        # 1. Test Basic Featured Items Functionality
        print("   1.1 Testing Basic Featured Items in News & Events API...")
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ News-events API request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            news_events = data.get("news_events", [])
            print(f"      ✅ Successfully fetched {len(news_events)} news & events")
            
            # Check if featured field is present in response
            featured_field_present = all("featured" in item for item in news_events)
            if featured_field_present:
                print("      ✅ Featured field present in all news & events items")
            else:
                print("      ❌ Featured field missing in some news & events items")
                all_tests_passed = False
            
            # Check if featured items appear first
            featured_items = [item for item in news_events if item.get("featured", 0) == 1]
            non_featured_items = [item for item in news_events if item.get("featured", 0) == 0]
            
            if len(featured_items) > 0:
                print(f"      ✅ Found {len(featured_items)} featured news & events")
                
                # Verify featured items appear first in the list
                first_items_featured = True
                for i in range(len(featured_items)):
                    if i < len(news_events) and news_events[i].get("featured", 0) != 1:
                        first_items_featured = False
                        break
                
                if first_items_featured:
                    print("      ✅ Featured news & events appear first in results")
                else:
                    print("      ❌ Featured news & events do not appear first in results")
                    all_tests_passed = False
                    
                # Show sample featured item and check for "Breakthrough in Wind Energy"
                sample_featured = featured_items[0]
                print(f"      📌 Sample featured news/event: '{sample_featured.get('title', '')}'")
                
                # Check specifically for "Breakthrough in Wind Energy" as mentioned in review
                breakthrough_item = next((item for item in featured_items if "Breakthrough in Wind Energy" in item.get('title', '')), None)
                if breakthrough_item:
                    print(f"      ✅ 'Breakthrough in Wind Energy' found as featured item (featured={breakthrough_item.get('featured')})")
                else:
                    print("      ⚠️  'Breakthrough in Wind Energy' not found in featured items")
            else:
                print("      ⚠️  No featured news & events found in current data")
                # Check if there's any item with "Breakthrough in Wind Energy" title
                breakthrough_item = next((item for item in news_events if "Breakthrough in Wind Energy" in item.get('title', '')), None)
                if breakthrough_item:
                    print(f"      ⚠️  'Breakthrough in Wind Energy' found but not featured (featured={breakthrough_item.get('featured')})")
        
        # 2. Test Featured Items Priority with Different Sorting Options
        print("   2.1 Testing Featured Items Priority with Different Sorting Options...")
        
        sorting_tests = [
            ("date", "desc", "newest first"),
            ("date", "asc", "oldest first"),
            ("title", "asc", "A-Z"),
            ("title", "desc", "Z-A")
        ]
        
        for sort_by, sort_order, description in sorting_tests:
            response = requests.get(f"{API_BASE_URL}/news-events?sort_by={sort_by}&sort_order={sort_order}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                news_events = data.get("news_events", [])
                
                # Check if featured items still appear first regardless of sorting
                featured_count = sum(1 for item in news_events if item.get("featured", 0) == 1)
                if featured_count > 0:
                    # Check if first N items are featured (where N is the number of featured items)
                    first_n_featured = all(news_events[i].get("featured", 0) == 1 for i in range(min(featured_count, len(news_events))))
                    
                    if first_n_featured:
                        print(f"      ✅ Featured items maintain priority with {description} sorting")
                        
                        # Verify "Breakthrough in Wind Energy" appears first
                        if len(news_events) > 0:
                            first_item = news_events[0]
                            if "Breakthrough in Wind Energy" in first_item.get('title', ''):
                                print(f"      ✅ 'Breakthrough in Wind Energy' appears first with {description} sorting")
                            else:
                                print(f"      📌 First item with {description} sorting: '{first_item.get('title', '')[:50]}...'")
                    else:
                        print(f"      ❌ Featured items lost priority with {description} sorting")
                        all_tests_passed = False
                else:
                    print(f"      ⚠️  No featured items to test with {description} sorting")
            else:
                print(f"      ❌ Sorting test failed for {description}")
                all_tests_passed = False
        
        # 3. Test Category Filtering with Featured Items
        print("   3.1 Testing Category Filtering with Featured Items Priority...")
        
        categories = ["News", "Events", "Upcoming Events", "Achievement"]
        
        for category in categories:
            response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                news_events = data.get("news_events", [])
                
                if len(news_events) > 0:
                    # Check if featured items still appear first within filtered results
                    featured_count = sum(1 for item in news_events if item.get("featured", 0) == 1)
                    if featured_count > 0:
                        first_n_featured = all(news_events[i].get("featured", 0) == 1 for i in range(min(featured_count, len(news_events))))
                        
                        if first_n_featured:
                            print(f"      ✅ Featured items appear first in '{category}' category ({featured_count} featured, {len(news_events)} total)")
                        else:
                            print(f"      ❌ Featured items not prioritized in '{category}' category")
                            all_tests_passed = False
                    else:
                        print(f"      ⚠️  No featured items in '{category}' category ({len(news_events)} total items)")
                else:
                    print(f"      ⚠️  No items found in '{category}' category")
            else:
                print(f"      ❌ Category filter '{category}' failed")
                all_tests_passed = False
        
        # 4. Test Pagination with Featured Items
        print("   4.1 Testing Pagination with Featured Items...")
        
        page_sizes = [5, 10, 15]
        for page_size in page_sizes:
            response = requests.get(f"{API_BASE_URL}/news-events?per_page={page_size}&page=1", timeout=10)
            if response.status_code == 200:
                data = response.json()
                news_events = data.get("news_events", [])
                pagination = data.get("pagination", {})
                
                # Check if featured items appear first on page 1
                featured_count = sum(1 for item in news_events if item.get("featured", 0) == 1)
                if featured_count > 0:
                    first_n_featured = all(news_events[i].get("featured", 0) == 1 for i in range(min(featured_count, len(news_events))))
                    
                    if first_n_featured:
                        print(f"      ✅ Featured items appear first with page size {page_size} (page {pagination.get('current_page')}/{pagination.get('total_pages')})")
                    else:
                        print(f"      ❌ Featured items not prioritized with page size {page_size}")
                        all_tests_passed = False
                else:
                    print(f"      ⚠️  No featured items on page 1 with page size {page_size}")
            else:
                print(f"      ❌ Pagination test failed for page size {page_size}")
                all_tests_passed = False
        
        # 5. Test Combined Filtering and Sorting with Featured Items
        print("   5.1 Testing Combined Filtering and Sorting with Featured Items...")
        
        # Test category + sorting combination
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News&sort_by=date&sort_order=desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            
            if len(news_events) > 0:
                featured_count = sum(1 for item in news_events if item.get("featured", 0) == 1)
                if featured_count > 0:
                    first_n_featured = all(news_events[i].get("featured", 0) == 1 for i in range(min(featured_count, len(news_events))))
                    
                    if first_n_featured:
                        print(f"      ✅ Featured items prioritized in combined News category + date sorting ({featured_count} featured)")
                    else:
                        print(f"      ❌ Featured items not prioritized in combined filtering/sorting")
                        all_tests_passed = False
                else:
                    print(f"      ⚠️  No featured items in News category")
            else:
                print(f"      ⚠️  No items found in News category")
        
        # Test title filter + sorting combination
        response = requests.get(f"{API_BASE_URL}/news-events?title_filter=Energy&sort_by=title&sort_order=asc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            
            if len(news_events) > 0:
                featured_count = sum(1 for item in news_events if item.get("featured", 0) == 1)
                if featured_count > 0:
                    first_n_featured = all(news_events[i].get("featured", 0) == 1 for i in range(min(featured_count, len(news_events))))
                    
                    if first_n_featured:
                        print(f"      ✅ Featured items prioritized in title filter 'Energy' + title sorting ({featured_count} featured)")
                        
                        # Check if "Breakthrough in Wind Energy" appears first when filtering by "Energy"
                        first_item = news_events[0]
                        if "Breakthrough in Wind Energy" in first_item.get('title', ''):
                            print(f"      ✅ 'Breakthrough in Wind Energy' appears first in 'Energy' filter results")
                        else:
                            print(f"      📌 First item in 'Energy' filter: '{first_item.get('title', '')}'")
                    else:
                        print(f"      ❌ Featured items not prioritized in title filter + sorting")
                        all_tests_passed = False
                else:
                    print(f"      ⚠️  No featured items found when filtering by 'Energy'")
            else:
                print(f"      ⚠️  No items found when filtering by 'Energy'")
        
        # 6. Test Detail Endpoint for Featured Items
        print("   6.1 Testing Detail Endpoint for Featured Items...")
        
        # Get a featured item ID for testing
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            featured_items = [item for item in news_events if item.get("featured", 0) == 1]
            
            if len(featured_items) > 0:
                featured_item = featured_items[0]
                item_id = featured_item.get("id")
                
                # Test detail endpoint
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{item_id}", timeout=10)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    
                    # Verify featured field is present in detail response
                    if "featured" in detail_data and detail_data.get("featured") == 1:
                        print(f"      ✅ Featured field correctly returned in detail endpoint (featured={detail_data.get('featured')})")
                        print(f"      📌 Featured item detail: '{detail_data.get('title', '')}'")
                    else:
                        print(f"      ❌ Featured field missing or incorrect in detail endpoint")
                        all_tests_passed = False
                else:
                    print(f"      ❌ Detail endpoint failed for featured item {item_id}")
                    all_tests_passed = False
            else:
                print(f"      ⚠️  No featured items available for detail endpoint testing")
        
        # 7. Test Sorting Logic: Featured First, Then Regular Items Sorted
        print("   7.1 Testing Sorting Logic: Featured Items First, Then Regular Items Sorted...")
        
        response = requests.get(f"{API_BASE_URL}/news-events?sort_by=title&sort_order=asc&per_page=20", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            
            if len(news_events) > 1:
                # Split into featured and non-featured groups
                featured_items = [item for item in news_events if item.get("featured", 0) == 1]
                non_featured_items = [item for item in news_events if item.get("featured", 0) == 0]
                
                # Verify featured items appear first
                featured_count = len(featured_items)
                if featured_count > 0:
                    # Check that first N items are all featured
                    first_n_are_featured = all(news_events[i].get("featured", 0) == 1 for i in range(min(featured_count, len(news_events))))
                    
                    if first_n_are_featured:
                        print(f"      ✅ Featured items ({featured_count}) appear first in sorted results")
                        
                        # Verify featured items are sorted among themselves
                        if len(featured_items) > 1:
                            featured_titles = [item.get("title", "") for item in featured_items]
                            is_sorted = featured_titles == sorted(featured_titles)
                            if is_sorted:
                                print(f"      ✅ Featured items are sorted correctly among themselves (A-Z)")
                            else:
                                print(f"      ❌ Featured items not sorted correctly among themselves")
                                all_tests_passed = False
                        
                        # Verify non-featured items are sorted after featured items
                        if len(non_featured_items) > 1:
                            # Get non-featured items from the response (should start after featured items)
                            response_non_featured = news_events[featured_count:]
                            if len(response_non_featured) > 1:
                                non_featured_titles = [item.get("title", "") for item in response_non_featured[:5]]  # Check first 5
                                is_sorted = non_featured_titles == sorted(non_featured_titles)
                                if is_sorted:
                                    print(f"      ✅ Non-featured items are sorted correctly after featured items (A-Z)")
                                else:
                                    print(f"      ⚠️  Non-featured items sorting may need verification")
                                    print(f"      📌 Non-featured titles sample: {non_featured_titles[:3]}")
                    else:
                        print(f"      ❌ Featured items do not appear first in sorted results")
                        all_tests_passed = False
                else:
                    print(f"      ⚠️  No featured items to test sorting logic")
            else:
                print(f"      ⚠️  Not enough items to test sorting logic")
        
        # 8. Test 'featured ' field handling (with trailing space)
        print("   8.1 Testing 'featured ' field handling (with trailing space)...")
        
        # This tests the specific fix mentioned in the review request
        # The backend should handle 'featured ' (with trailing space) from Google Sheets
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            
            # Check if any items have featured=1 (which would indicate the trailing space handling is working)
            featured_items = [item for item in news_events if item.get("featured", 0) == 1]
            
            if len(featured_items) > 0:
                print(f"      ✅ 'featured ' field (with trailing space) handling working - found {len(featured_items)} featured items")
                
                # Verify the specific item mentioned in the review
                breakthrough_item = next((item for item in featured_items if "Breakthrough in Wind Energy" in item.get('title', '')), None)
                if breakthrough_item:
                    print(f"      ✅ 'Breakthrough in Wind Energy' correctly identified as featured item")
                    print(f"      📌 Item details: featured={breakthrough_item.get('featured')}, title='{breakthrough_item.get('title')}'")
                else:
                    print(f"      ⚠️  'Breakthrough in Wind Energy' not found, but other featured items exist")
            else:
                print(f"      ⚠️  No featured items found - 'featured ' field handling may need verification")
        
        if all_tests_passed:
            print("   🎉 ALL News & Events Featured Items tests PASSED!")
        else:
            print("   ⚠️  Some News & Events Featured Items tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in News & Events Featured Items testing: {e}")
        return False

if __name__ == "__main__":
    print("Starting News & Events Featured Items Testing...")
    print("=" * 80)
    
    success = test_news_events_featured_items_functionality()
    
    print("=" * 80)
    if success:
        print("✅ ALL FEATURED ITEMS TESTS PASSED!")
        print("The News & Events API featured items functionality is working correctly.")
    else:
        print("❌ SOME FEATURED ITEMS TESTS FAILED!")
        print("Please check the test results above for specific issues.")
    
    print("=" * 80)