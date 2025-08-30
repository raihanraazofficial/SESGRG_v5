#!/usr/bin/env python3
"""
Theme Consistency Backend Testing Suite
Specifically tests News & Events and Achievements APIs after frontend theme consistency fix
Focus on "Read More" functionality data structure requirements
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
print("=" * 80)
print("THEME CONSISTENCY BACKEND TESTING - NEWS & EVENTS AND ACHIEVEMENTS")
print("=" * 80)

def test_news_events_api_structure():
    """Test GET /api/news-events endpoint for Read More functionality support"""
    print("1. Testing News & Events API Structure for Read More Support...")
    
    try:
        # Test basic endpoint
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Basic request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        
        # Check main structure
        if "news_events" not in data or "pagination" not in data:
            print("   ❌ Missing main structure keys")
            return False
        
        news_events = data["news_events"]
        if not news_events:
            print("   ❌ No news events found")
            return False
        
        # Check first item structure for Read More requirements
        first_item = news_events[0]
        required_fields = ["id", "title", "description", "date", "category", "image"]
        optional_fields = ["short_description", "full_content"]
        
        missing_required = [field for field in required_fields if field not in first_item]
        if missing_required:
            print(f"   ❌ Missing required fields: {missing_required}")
            return False
        
        print(f"   ✅ All required fields present: {required_fields}")
        
        # Check optional fields for Read More
        present_optional = [field for field in optional_fields if field in first_item]
        print(f"   ✅ Optional fields present: {present_optional}")
        
        # Test category filtering
        categories = ["News", "Events", "Upcoming Events", "Achievement"]
        category_results = {}
        
        for category in categories:
            response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=10)
            if response.status_code == 200:
                cat_data = response.json()
                count = len(cat_data.get("news_events", []))
                category_results[category] = count
                print(f"   ✅ Category '{category}': {count} items")
            else:
                print(f"   ❌ Category '{category}' filter failed")
                return False
        
        # Test pagination
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=5", timeout=10)
        if response.status_code == 200:
            pag_data = response.json()
            pagination = pag_data.get("pagination", {})
            required_pag_fields = ["current_page", "per_page", "total_items", "total_pages", "has_next", "has_prev"]
            missing_pag = [field for field in required_pag_fields if field not in pagination]
            if not missing_pag:
                print(f"   ✅ Pagination structure complete")
            else:
                print(f"   ❌ Missing pagination fields: {missing_pag}")
                return False
        
        print("   🎉 News & Events API structure PERFECT for Read More functionality!")
        return True, category_results
        
    except Exception as e:
        print(f"   ❌ Error testing News & Events API: {e}")
        return False, {}

def test_news_events_details_api():
    """Test GET /api/news-events/{id} endpoint for Read More content"""
    print("2. Testing News & Events Details API for Read More Content...")
    
    try:
        # First get a valid news event ID
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        if response.status_code != 200:
            print("   ❌ Could not get news events list")
            return False
        
        news_events = response.json()["news_events"]
        if not news_events:
            print("   ❌ No news events found")
            return False
        
        news_id = news_events[0]["id"]
        news_title = news_events[0]["title"]
        
        # Test details endpoint
        response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Details request failed with status: {response.status_code}")
            return False
        
        details = response.json()
        
        # Check required fields for blog-style content
        required_detail_fields = ["id", "title", "full_content", "date", "category"]
        optional_detail_fields = ["description", "short_description", "image", "author"]
        
        missing_required = [field for field in required_detail_fields if field not in details]
        if missing_required:
            print(f"   ❌ Missing required detail fields: {missing_required}")
            return False
        
        print(f"   ✅ All required detail fields present")
        
        # Check full_content for blog generation
        full_content = details.get("full_content", "")
        if len(full_content) < 100:
            print(f"   ⚠️  Full content seems short ({len(full_content)} chars) - may affect blog quality")
        else:
            print(f"   ✅ Full content substantial ({len(full_content)} chars) - good for blog generation")
        
        # Check if content has rich formatting potential
        rich_indicators = ["<h", "<p", "<ul", "<ol", "<strong", "<em", "α", "β", "γ", "Σ", "∑", "∫"]
        rich_count = sum(1 for indicator in rich_indicators if indicator in full_content)
        
        if rich_count > 0:
            print(f"   ✅ Rich content detected ({rich_count} formatting indicators) - excellent for themed blogs")
        else:
            print(f"   ✅ Plain content - will work with theme styling")
        
        print(f"   ✅ Testing with: '{news_title[:50]}...'")
        print("   🎉 News & Events Details API PERFECT for Read More blogs!")
        return True, details
        
    except Exception as e:
        print(f"   ❌ Error testing News & Events Details API: {e}")
        return False, {}

def test_achievements_api_structure():
    """Test GET /api/achievements endpoint for Read More functionality support"""
    print("3. Testing Achievements API Structure for Read More Support...")
    
    try:
        # Test basic endpoint
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Basic request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        
        # Check main structure
        if "achievements" not in data or "pagination" not in data:
            print("   ❌ Missing main structure keys")
            return False
        
        achievements = data["achievements"]
        if not achievements:
            print("   ❌ No achievements found")
            return False
        
        # Check first item structure for Read More requirements
        first_item = achievements[0]
        required_fields = ["id", "title", "description", "date", "category", "image"]
        optional_fields = ["short_description", "full_content"]
        
        missing_required = [field for field in required_fields if field not in first_item]
        if missing_required:
            print(f"   ❌ Missing required fields: {missing_required}")
            return False
        
        print(f"   ✅ All required fields present: {required_fields}")
        
        # Check optional fields for Read More
        present_optional = [field for field in optional_fields if field in first_item]
        print(f"   ✅ Optional fields present: {present_optional}")
        
        # Test category filtering - check available categories
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=50", timeout=10)
        if response.status_code == 200:
            all_data = response.json()
            all_achievements = all_data.get("achievements", [])
            available_categories = list(set(item.get("category") for item in all_achievements))
            print(f"   ✅ Available categories: {available_categories}")
            
            # Test each category
            category_results = {}
            for category in available_categories:
                response = requests.get(f"{API_BASE_URL}/achievements?category_filter={category}", timeout=10)
                if response.status_code == 200:
                    cat_data = response.json()
                    count = len(cat_data.get("achievements", []))
                    category_results[category] = count
                    print(f"   ✅ Category '{category}': {count} items")
                else:
                    print(f"   ❌ Category '{category}' filter failed")
                    return False
        
        # Test pagination
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=6", timeout=10)
        if response.status_code == 200:
            pag_data = response.json()
            pagination = pag_data.get("pagination", {})
            required_pag_fields = ["current_page", "per_page", "total_items", "total_pages", "has_next", "has_prev"]
            missing_pag = [field for field in required_pag_fields if field not in pagination]
            if not missing_pag:
                print(f"   ✅ Pagination structure complete")
            else:
                print(f"   ❌ Missing pagination fields: {missing_pag}")
                return False
        
        print("   🎉 Achievements API structure PERFECT for Read More functionality!")
        return True, category_results
        
    except Exception as e:
        print(f"   ❌ Error testing Achievements API: {e}")
        return False, {}

def test_achievements_details_api():
    """Test GET /api/achievements/{id} endpoint for Read More content"""
    print("4. Testing Achievements Details API for Read More Content...")
    
    try:
        # First get a valid achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=1", timeout=10)
        if response.status_code != 200:
            print("   ❌ Could not get achievements list")
            return False
        
        achievements = response.json()["achievements"]
        if not achievements:
            print("   ❌ No achievements found")
            return False
        
        achievement_id = achievements[0]["id"]
        achievement_title = achievements[0]["title"]
        
        # Test details endpoint
        response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Details request failed with status: {response.status_code}")
            return False
        
        details = response.json()
        
        # Check required fields for blog-style content
        required_detail_fields = ["id", "title", "full_content", "date", "category"]
        optional_detail_fields = ["description", "short_description", "image", "author"]
        
        missing_required = [field for field in required_detail_fields if field not in details]
        if missing_required:
            print(f"   ❌ Missing required detail fields: {missing_required}")
            return False
        
        print(f"   ✅ All required detail fields present")
        
        # Check full_content for blog generation
        full_content = details.get("full_content", "")
        if len(full_content) < 100:
            print(f"   ⚠️  Full content seems short ({len(full_content)} chars) - may affect blog quality")
        else:
            print(f"   ✅ Full content substantial ({len(full_content)} chars) - good for blog generation")
        
        # Check if content has rich formatting potential
        rich_indicators = ["<h", "<p", "<ul", "<ol", "<strong", "<em", "α", "β", "γ", "Σ", "∑", "∫"]
        rich_count = sum(1 for indicator in rich_indicators if indicator in full_content)
        
        if rich_count > 0:
            print(f"   ✅ Rich content detected ({rich_count} formatting indicators) - excellent for themed blogs")
        else:
            print(f"   ✅ Plain content - will work with theme styling")
        
        print(f"   ✅ Testing with: '{achievement_title[:50]}...'")
        print("   🎉 Achievements Details API PERFECT for Read More blogs!")
        return True, details
        
    except Exception as e:
        print(f"   ❌ Error testing Achievements Details API: {e}")
        return False, {}

def test_theme_consistency_requirements():
    """Test that both APIs provide identical data structure for theme consistency"""
    print("5. Testing Theme Consistency Requirements...")
    
    try:
        # Get sample data from both APIs
        news_response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        achievements_response = requests.get(f"{API_BASE_URL}/achievements?per_page=1", timeout=10)
        
        if news_response.status_code != 200 or achievements_response.status_code != 200:
            print("   ❌ Could not fetch sample data from both APIs")
            return False
        
        news_data = news_response.json()
        achievements_data = achievements_response.json()
        
        # Check structure consistency
        news_item = news_data["news_events"][0] if news_data["news_events"] else {}
        achievement_item = achievements_data["achievements"][0] if achievements_data["achievements"] else {}
        
        # Common fields that should exist in both
        common_fields = ["id", "title", "description", "date", "category", "image"]
        
        news_fields = set(news_item.keys())
        achievement_fields = set(achievement_item.keys())
        
        # Check if both have the common fields
        news_missing = [field for field in common_fields if field not in news_fields]
        achievement_missing = [field for field in common_fields if field not in achievement_fields]
        
        if news_missing:
            print(f"   ❌ News & Events missing fields: {news_missing}")
            return False
        
        if achievement_missing:
            print(f"   ❌ Achievements missing fields: {achievement_missing}")
            return False
        
        print(f"   ✅ Both APIs have consistent structure with common fields: {common_fields}")
        
        # Check pagination structure consistency
        news_pagination = news_data.get("pagination", {})
        achievements_pagination = achievements_data.get("pagination", {})
        
        pagination_fields = ["current_page", "per_page", "total_items", "total_pages", "has_next", "has_prev"]
        
        news_pag_missing = [field for field in pagination_fields if field not in news_pagination]
        achievement_pag_missing = [field for field in pagination_fields if field not in achievements_pagination]
        
        if news_pag_missing or achievement_pag_missing:
            print(f"   ❌ Pagination structure inconsistent")
            return False
        
        print(f"   ✅ Both APIs have consistent pagination structure")
        
        # Test details endpoints consistency
        news_id = news_item["id"]
        achievement_id = achievement_item["id"]
        
        news_details_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
        achievement_details_response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
        
        if news_details_response.status_code != 200 or achievement_details_response.status_code != 200:
            print("   ❌ Could not fetch details from both APIs")
            return False
        
        news_details = news_details_response.json()
        achievement_details = achievement_details_response.json()
        
        # Check details structure consistency
        detail_fields = ["id", "title", "full_content", "date", "category"]
        
        news_detail_missing = [field for field in detail_fields if field not in news_details]
        achievement_detail_missing = [field for field in detail_fields if field not in achievement_details]
        
        if news_detail_missing or achievement_detail_missing:
            print(f"   ❌ Details structure inconsistent")
            return False
        
        print(f"   ✅ Both detail APIs have consistent structure with fields: {detail_fields}")
        print("   🎉 PERFECT theme consistency - both APIs provide identical data structure!")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing theme consistency: {e}")
        return False

def run_theme_consistency_tests():
    """Run all theme consistency tests"""
    print("STARTING THEME CONSISTENCY BACKEND TESTS")
    print("Focus: News & Events and Achievements APIs for Read More functionality")
    print("=" * 80)
    
    results = {}
    
    # Test News & Events API
    results['news_events_structure'], news_categories = test_news_events_api_structure()
    results['news_events_details'], news_sample = test_news_events_details_api()
    
    print()
    
    # Test Achievements API  
    results['achievements_structure'], achievement_categories = test_achievements_api_structure()
    results['achievements_details'], achievement_sample = test_achievements_details_api()
    
    print()
    
    # Test theme consistency
    results['theme_consistency'] = test_theme_consistency_requirements()
    
    print("\n" + "=" * 80)
    print("THEME CONSISTENCY TEST SUMMARY")
    print("=" * 80)
    
    all_passed = True
    
    print("NEWS & EVENTS API:")
    news_status = "✅ PASS" if results.get('news_events_structure') and results.get('news_events_details') else "❌ FAIL"
    print(f"  Structure & Details: {news_status}")
    if results.get('news_events_structure'):
        print(f"  Available Categories: {list(news_categories.keys()) if 'news_categories' in locals() else 'N/A'}")
    
    print("\nACHIEVEMENTS API:")
    achievements_status = "✅ PASS" if results.get('achievements_structure') and results.get('achievements_details') else "❌ FAIL"
    print(f"  Structure & Details: {achievements_status}")
    if results.get('achievements_structure'):
        print(f"  Available Categories: {list(achievement_categories.keys()) if 'achievement_categories' in locals() else 'N/A'}")
    
    print("\nTHEME CONSISTENCY:")
    consistency_status = "✅ PASS" if results.get('theme_consistency') else "❌ FAIL"
    print(f"  Data Structure Consistency: {consistency_status}")
    
    # Overall result
    all_passed = all(results.values())
    
    print("=" * 80)
    if all_passed:
        print("🎉 ALL THEME CONSISTENCY TESTS PASSED!")
        print("✅ Backend APIs fully support Read More functionality with consistent themes")
        print("✅ Both News & Events and Achievements provide identical data structure")
        print("✅ Category filtering, pagination, and detailed content all working perfectly")
    else:
        failed_tests = [test for test, passed in results.items() if not passed]
        print(f"⚠️  SOME TESTS FAILED: {failed_tests}")
        print("❌ Backend may need fixes for proper Read More theme consistency")
    
    return results, all_passed

if __name__ == "__main__":
    results, all_passed = run_theme_consistency_tests()
    sys.exit(0 if all_passed else 1)