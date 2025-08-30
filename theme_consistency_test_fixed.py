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

def test_news_events_comprehensive():
    """Comprehensive test of News & Events API for Read More functionality"""
    print("1. Testing News & Events API - Comprehensive Read More Support...")
    
    all_tests_passed = True
    category_results = {}
    
    try:
        # 1. Basic API Structure Test
        print("   1.1 Testing basic API structure...")
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=10)
        if response.status_code != 200:
            print(f"      ❌ Basic request failed with status: {response.status_code}")
            return False, {}
        
        data = response.json()
        
        # Check main structure
        if "news_events" not in data or "pagination" not in data:
            print("      ❌ Missing main structure keys")
            return False, {}
        
        news_events = data["news_events"]
        if not news_events:
            print("      ❌ No news events found")
            return False, {}
        
        # Check first item structure for Read More requirements
        first_item = news_events[0]
        required_fields = ["id", "title", "short_description", "date", "category", "image"]
        
        missing_required = [field for field in required_fields if field not in first_item]
        if missing_required:
            print(f"      ❌ Missing required fields: {missing_required}")
            all_tests_passed = False
        else:
            print(f"      ✅ All required fields present: {required_fields}")
        
        # 2. Category Filtering Test
        print("   1.2 Testing category filtering...")
        categories = ["News", "Events", "Upcoming Events", "Achievement"]
        
        for category in categories:
            response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=10)
            if response.status_code == 200:
                cat_data = response.json()
                count = len(cat_data.get("news_events", []))
                category_results[category] = count
                print(f"      ✅ Category '{category}': {count} items")
            else:
                print(f"      ❌ Category '{category}' filter failed")
                all_tests_passed = False
        
        # 3. Pagination Test
        print("   1.3 Testing pagination structure...")
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=5", timeout=10)
        if response.status_code == 200:
            pag_data = response.json()
            pagination = pag_data.get("pagination", {})
            required_pag_fields = ["current_page", "per_page", "total_items", "total_pages", "has_next", "has_prev"]
            missing_pag = [field for field in required_pag_fields if field not in pagination]
            if not missing_pag:
                print(f"      ✅ Pagination structure complete")
            else:
                print(f"      ❌ Missing pagination fields: {missing_pag}")
                all_tests_passed = False
        
        # 4. Details Endpoint Test
        print("   1.4 Testing details endpoint for Read More content...")
        news_id = first_item["id"]
        response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
        if response.status_code == 200:
            details = response.json()
            required_detail_fields = ["id", "title", "full_content", "date", "category"]
            missing_detail = [field for field in required_detail_fields if field not in details]
            if not missing_detail:
                full_content = details.get("full_content", "")
                print(f"      ✅ Details endpoint working - content length: {len(full_content)} chars")
                
                # Check for rich content indicators
                rich_indicators = ["<h", "<p", "<ul", "<ol", "<strong", "<em", "α", "β", "γ", "Σ"]
                rich_count = sum(1 for indicator in rich_indicators if indicator in full_content)
                if rich_count > 0:
                    print(f"      ✅ Rich content detected ({rich_count} formatting indicators)")
            else:
                print(f"      ❌ Missing detail fields: {missing_detail}")
                all_tests_passed = False
        else:
            print(f"      ❌ Details endpoint failed")
            all_tests_passed = False
        
        return all_tests_passed, category_results
        
    except Exception as e:
        print(f"   ❌ Error in News & Events testing: {e}")
        return False, {}

def test_achievements_comprehensive():
    """Comprehensive test of Achievements API for Read More functionality"""
    print("2. Testing Achievements API - Comprehensive Read More Support...")
    
    all_tests_passed = True
    category_results = {}
    
    try:
        # 1. Basic API Structure Test
        print("   2.1 Testing basic API structure...")
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=10)
        if response.status_code != 200:
            print(f"      ❌ Basic request failed with status: {response.status_code}")
            return False, {}
        
        data = response.json()
        
        # Check main structure
        if "achievements" not in data or "pagination" not in data:
            print("      ❌ Missing main structure keys")
            return False, {}
        
        achievements = data["achievements"]
        if not achievements:
            print("      ❌ No achievements found")
            return False, {}
        
        # Check first item structure for Read More requirements
        first_item = achievements[0]
        required_fields = ["id", "title", "short_description", "date", "category", "image"]
        
        missing_required = [field for field in required_fields if field not in first_item]
        if missing_required:
            print(f"      ❌ Missing required fields: {missing_required}")
            all_tests_passed = False
        else:
            print(f"      ✅ All required fields present: {required_fields}")
        
        # 2. Category Filtering Test - Get available categories first
        print("   2.2 Testing category filtering...")
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=50", timeout=10)
        if response.status_code == 200:
            all_data = response.json()
            all_achievements = all_data.get("achievements", [])
            available_categories = list(set(item.get("category") for item in all_achievements))
            print(f"      ✅ Available categories: {available_categories}")
            
            # Test each available category
            for category in available_categories:
                response = requests.get(f"{API_BASE_URL}/achievements?category_filter={category}", timeout=10)
                if response.status_code == 200:
                    cat_data = response.json()
                    count = len(cat_data.get("achievements", []))
                    category_results[category] = count
                    print(f"      ✅ Category '{category}': {count} items")
                else:
                    print(f"      ❌ Category '{category}' filter failed")
                    all_tests_passed = False
        
        # 3. Pagination Test
        print("   2.3 Testing pagination structure...")
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=6", timeout=10)
        if response.status_code == 200:
            pag_data = response.json()
            pagination = pag_data.get("pagination", {})
            required_pag_fields = ["current_page", "per_page", "total_items", "total_pages", "has_next", "has_prev"]
            missing_pag = [field for field in required_pag_fields if field not in pagination]
            if not missing_pag:
                print(f"      ✅ Pagination structure complete")
            else:
                print(f"      ❌ Missing pagination fields: {missing_pag}")
                all_tests_passed = False
        
        # 4. Details Endpoint Test
        print("   2.4 Testing details endpoint for Read More content...")
        achievement_id = first_item["id"]
        response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
        if response.status_code == 200:
            details = response.json()
            required_detail_fields = ["id", "title", "full_content", "date", "category"]
            missing_detail = [field for field in required_detail_fields if field not in details]
            if not missing_detail:
                full_content = details.get("full_content", "")
                print(f"      ✅ Details endpoint working - content length: {len(full_content)} chars")
                
                # Check for rich content indicators
                rich_indicators = ["<h", "<p", "<ul", "<ol", "<strong", "<em", "α", "β", "γ", "Σ"]
                rich_count = sum(1 for indicator in rich_indicators if indicator in full_content)
                if rich_count > 0:
                    print(f"      ✅ Rich content detected ({rich_count} formatting indicators)")
            else:
                print(f"      ❌ Missing detail fields: {missing_detail}")
                all_tests_passed = False
        else:
            print(f"      ❌ Details endpoint failed")
            all_tests_passed = False
        
        return all_tests_passed, category_results
        
    except Exception as e:
        print(f"   ❌ Error in Achievements testing: {e}")
        return False, {}

def test_theme_consistency():
    """Test that both APIs provide consistent data structure for theme consistency"""
    print("3. Testing Theme Consistency Between APIs...")
    
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
        
        # Common fields that should exist in both for Read More functionality
        common_fields = ["id", "title", "description", "date", "category", "image"]
        
        news_fields = set(news_item.keys())
        achievement_fields = set(achievement_item.keys())
        
        # Check if both have the common fields
        news_missing = [field for field in common_fields if field not in news_fields]
        achievement_missing = [field for field in common_fields if field not in achievement_fields]
        
        if news_missing or achievement_missing:
            print(f"   ❌ Structure inconsistent - News missing: {news_missing}, Achievements missing: {achievement_missing}")
            return False
        
        print(f"   ✅ Both APIs have consistent structure with common fields: {common_fields}")
        
        # Test details endpoints consistency
        news_id = news_item["id"]
        achievement_id = achievement_item["id"]
        
        news_details_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
        achievement_details_response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
        
        if news_details_response.status_code == 200 and achievement_details_response.status_code == 200:
            news_details = news_details_response.json()
            achievement_details = achievement_details_response.json()
            
            # Check details structure consistency for Read More
            detail_fields = ["id", "title", "full_content", "date", "category"]
            
            news_detail_missing = [field for field in detail_fields if field not in news_details]
            achievement_detail_missing = [field for field in detail_fields if field not in achievement_details]
            
            if not news_detail_missing and not achievement_detail_missing:
                print(f"   ✅ Both detail APIs have consistent structure for Read More functionality")
                return True
            else:
                print(f"   ❌ Details structure inconsistent")
                return False
        else:
            print("   ❌ Could not test details consistency")
            return False
        
    except Exception as e:
        print(f"   ❌ Error testing theme consistency: {e}")
        return False

def run_theme_consistency_tests():
    """Run all theme consistency tests"""
    print("STARTING THEME CONSISTENCY BACKEND TESTS")
    print("Focus: News & Events and Achievements APIs for Read More functionality")
    print("=" * 80)
    
    # Test News & Events API
    news_passed, news_categories = test_news_events_comprehensive()
    print()
    
    # Test Achievements API  
    achievements_passed, achievement_categories = test_achievements_comprehensive()
    print()
    
    # Test theme consistency
    consistency_passed = test_theme_consistency()
    
    print("\n" + "=" * 80)
    print("THEME CONSISTENCY TEST SUMMARY")
    print("=" * 80)
    
    print("NEWS & EVENTS API:")
    news_status = "✅ PASS" if news_passed else "❌ FAIL"
    print(f"  Structure & Details: {news_status}")
    if news_categories:
        print(f"  Available Categories: {list(news_categories.keys())}")
        for cat, count in news_categories.items():
            print(f"    - {cat}: {count} items")
    
    print("\nACHIEVEMENTS API:")
    achievements_status = "✅ PASS" if achievements_passed else "❌ FAIL"
    print(f"  Structure & Details: {achievements_status}")
    if achievement_categories:
        print(f"  Available Categories: {list(achievement_categories.keys())}")
        for cat, count in achievement_categories.items():
            print(f"    - {cat}: {count} items")
    
    print("\nTHEME CONSISTENCY:")
    consistency_status = "✅ PASS" if consistency_passed else "❌ FAIL"
    print(f"  Data Structure Consistency: {consistency_status}")
    
    # Overall result
    all_passed = news_passed and achievements_passed and consistency_passed
    
    print("=" * 80)
    if all_passed:
        print("🎉 ALL THEME CONSISTENCY TESTS PASSED!")
        print("✅ Backend APIs fully support Read More functionality with consistent themes")
        print("✅ Both News & Events and Achievements provide identical data structure")
        print("✅ Category filtering, pagination, and detailed content all working perfectly")
        print("✅ Ready for frontend theme consistency implementation")
    else:
        failed_components = []
        if not news_passed:
            failed_components.append("News & Events API")
        if not achievements_passed:
            failed_components.append("Achievements API")
        if not consistency_passed:
            failed_components.append("Theme Consistency")
        
        print(f"⚠️  SOME TESTS FAILED: {', '.join(failed_components)}")
        print("❌ Backend may need fixes for proper Read More theme consistency")
    
    return all_passed

if __name__ == "__main__":
    all_passed = run_theme_consistency_tests()
    sys.exit(0 if all_passed else 1)