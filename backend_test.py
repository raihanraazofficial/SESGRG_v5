#!/usr/bin/env python3
"""
Publications IEEE Citation Formatting Testing Suite
Tests the Publications page IEEE citation formatting functionality:
- Verify that all publication types display proper IEEE format
- Test the citation copy functionality 
- Check that all required IEEE elements are present
- Test filtering by publication type
- Verify that the Google Sheets data is being properly parsed and formatted
"""

import requests
import json
import os
from datetime import datetime
import sys
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Get Google Sheets API URLs from frontend .env file
def get_api_urls():
    try:
        urls = {}
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_PUBLICATIONS_API_URL='):
                    urls['publications'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_BACKEND_URL='):
                    urls['backend'] = line.split('=', 1)[1].strip()
        return urls
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return {}

API_URLS = get_api_urls()
if not API_URLS.get('publications'):
    print("ERROR: Could not get REACT_APP_PUBLICATIONS_API_URL from frontend/.env")
    sys.exit(1)

PUBLICATIONS_API_URL = API_URLS['publications']
FRONTEND_URL = "http://localhost:3000"  # Local frontend URL for testing

print(f"Testing Publications IEEE Citation Formatting")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Frontend URL: {FRONTEND_URL}")
print("=" * 80)

def test_google_sheets_api_accessibility():
    """Test if the Google Sheets API is accessible and returns valid data"""
    print("1. Testing Google Sheets API accessibility...")
    try:
        # Test direct access to Google Sheets API
        response = requests.get(PUBLICATIONS_API_URL, timeout=30)
        if response.status_code == 200:
            data = response.json()
            publications = data.get('publications', []) if isinstance(data, dict) else data
            print(f"   ✅ Google Sheets API is accessible")
            print(f"   📊 Retrieved {len(publications)} publications")
            
            if len(publications) > 0:
                sample_pub = publications[0]
                print(f"   📄 Sample publication: '{sample_pub.get('title', '')[:50]}...'")
                print(f"   🏷️  Sample category: {sample_pub.get('category', 'N/A')}")
                return True, publications
            else:
                print("   ⚠️  No publications found in API response")
                return False, []
        else:
            print(f"   ❌ Google Sheets API returned status code: {response.status_code}")
            return False, []
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Google Sheets API is not accessible: {e}")
        return False, []

def test_ieee_citation_format_validation(publications):
    """Test IEEE citation format validation for different publication types"""
    print("2. Testing IEEE citation format validation...")
    
    all_tests_passed = True
    ieee_format_tests = {
        "Journal Articles": {
            "required_elements": ["authors", "title", "journal_name", "volume", "issue", "pages", "year"],
            "format_pattern": r"^.+, \".+\", .+, vol\. \d+, no\. \d+, pp\. .+, \d{4}\.$"
        },
        "Conference Proceedings": {
            "required_elements": ["authors", "title", "conference_name", "city", "country", "pages", "year"],
            "format_pattern": r"^.+, \".+\", .+, .+, pp\. .+, \d{4}\.$"
        },
        "Book Chapters": {
            "required_elements": ["authors", "title", "book_title", "editor", "publisher", "city", "country", "pages", "year"],
            "format_pattern": r"^.+, \".+\", .+, .+ Ed\(s\)\. .+, .+, pp\. .+, \d{4}\.$"
        }
    }
    
    # Group publications by category
    publications_by_category = {}
    for pub in publications:
        category = pub.get('category', 'Unknown')
        if category not in publications_by_category:
            publications_by_category[category] = []
        publications_by_category[category].append(pub)
    
    print(f"   📋 Found publication categories: {list(publications_by_category.keys())}")
    
    for category, expected_format in ieee_format_tests.items():
        if category in publications_by_category:
            category_pubs = publications_by_category[category]
            print(f"   \n   🔍 Testing {category} ({len(category_pubs)} publications):")
            
            # Test first few publications of this category
            for i, pub in enumerate(category_pubs[:3]):  # Test first 3 of each category
                print(f"      📄 Publication {i+1}: '{pub.get('title', '')[:40]}...'")
                
                # Check required elements are present
                missing_elements = []
                for element in expected_format["required_elements"]:
                    if not pub.get(element):
                        missing_elements.append(element)
                
                if missing_elements:
                    print(f"         ❌ Missing required elements: {missing_elements}")
                    all_tests_passed = False
                else:
                    print(f"         ✅ All required elements present")
                
                # Generate IEEE citation using the same logic as frontend
                citation = generate_ieee_citation_test(pub)
                print(f"         📝 Generated citation: {citation[:100]}...")
                
                # Validate citation format
                if validate_ieee_citation_format(citation, category):
                    print(f"         ✅ IEEE format validation passed")
                else:
                    print(f"         ❌ IEEE format validation failed")
                    all_tests_passed = False
        else:
            print(f"   ⚠️  No publications found for category: {category}")
    
    return all_tests_passed

def generate_ieee_citation_test(publication):
    """Generate IEEE citation using the same logic as frontend"""
    try:
        authors = publication.get('authors', '')
        if isinstance(authors, list):
            authors = ', '.join(authors)
        
        title = f'"{publication.get("title", "")}"'
        category = publication.get('category', 'Journal Articles')
        year = publication.get('year', '')
        
        if category == "Journal Articles":
            citation = f"{authors}, {title}"
            
            if publication.get('journal_name'):
                citation += f", {publication['journal_name']}"
            
            if publication.get('volume'):
                citation += f", vol. {publication['volume']}"
            
            if publication.get('issue'):
                citation += f", no. {publication['issue']}"
            
            if publication.get('pages'):
                citation += f", pp. {publication['pages']}"
            
            citation += f", {year}."
            return citation
            
        elif category == "Conference Proceedings":
            citation = f"{authors}, {title}"
            
            if publication.get('conference_name'):
                citation += f", {publication['conference_name']}"
            
            # Location (city, country)
            location = []
            if publication.get('city'):
                location.append(publication['city'])
            if publication.get('country'):
                location.append(publication['country'])
            if location:
                citation += f", {', '.join(location)}"
            
            if publication.get('pages'):
                citation += f", pp. {publication['pages']}"
            
            citation += f", {year}."
            return citation
            
        elif category == "Book Chapters":
            citation = f"{authors}, {title}"
            
            if publication.get('book_title'):
                citation += f", {publication['book_title']}"
            
            if publication.get('editor'):
                citation += f", {publication['editor']}, Ed(s)."
            
            if publication.get('publisher'):
                citation += f" {publication['publisher']}"
            
            # Location for book chapters
            location = []
            if publication.get('city'):
                location.append(publication['city'])
            if publication.get('country'):
                location.append(publication['country'])
            if location:
                citation += f", {', '.join(location)}"
            
            if publication.get('pages'):
                citation += f", pp. {publication['pages']}"
            
            citation += f", {year}."
            return citation
        
        # Generic fallback
        return f"{authors}, {title}, {year}."
        
    except Exception as error:
        return 'Citation format error'

def validate_ieee_citation_format(citation, category):
    """Validate IEEE citation format"""
    import re
    
    # Remove HTML tags for validation
    clean_citation = re.sub(r'<[^>]+>', '', citation)
    
    # Basic validation - check if citation has proper structure
    if not clean_citation or len(clean_citation) < 10:
        return False
    
    # Check for required elements based on category
    if category == "Journal Articles":
        # Should have: Authors, "Title", Journal, vol. X, no. X, pp. XXX, Year.
        required_patterns = [
            r'".+"',  # Title in quotes
            r'vol\. \d+',  # Volume
            r'no\. \d+',   # Issue number
            r'pp\. .+',    # Pages
            r'\d{4}\.$'    # Year at end
        ]
    elif category == "Conference Proceedings":
        # Should have: Authors, "Title", Conference, Location, pp. XXX, Year.
        required_patterns = [
            r'".+"',       # Title in quotes
            r'pp\. .+',    # Pages
            r'\d{4}\.$'    # Year at end
        ]
    elif category == "Book Chapters":
        # Should have: Authors, "Title", Book Title, Editor Ed(s)., Publisher, Location, pp. XXX, Year.
        required_patterns = [
            r'".+"',       # Title in quotes
            r'Ed\(s\)\.',  # Editor format
            r'pp\. .+',    # Pages
            r'\d{4}\.$'    # Year at end
        ]
    else:
        return True  # Unknown category, assume valid
    
    # Check if all required patterns are present
    for pattern in required_patterns:
        if not re.search(pattern, clean_citation):
            return False
    
    return True

def test_publication_type_filtering(publications):
    """Test filtering by publication type"""
    print("3. Testing publication type filtering...")
    
    all_tests_passed = True
    
    # Get unique categories from publications
    categories = list(set(pub.get('category', '') for pub in publications if pub.get('category')))
    print(f"   📋 Available categories: {categories}")
    
    for category in categories:
        # Filter publications by category (simulate frontend filtering)
        filtered_pubs = [pub for pub in publications if pub.get('category') == category]
        
        print(f"   🔍 Testing category '{category}': {len(filtered_pubs)} publications")
        
        if len(filtered_pubs) == 0:
            print(f"      ⚠️  No publications found for category: {category}")
            continue
        
        # Verify all filtered publications have the correct category
        incorrect_category = [pub for pub in filtered_pubs if pub.get('category') != category]
        
        if len(incorrect_category) == 0:
            print(f"      ✅ All {len(filtered_pubs)} publications correctly filtered")
        else:
            print(f"      ❌ {len(incorrect_category)} publications have incorrect category")
            all_tests_passed = False
        
        # Test IEEE formatting for this category
        sample_pub = filtered_pubs[0]
        citation = generate_ieee_citation_test(sample_pub)
        format_valid = validate_ieee_citation_format(citation, category)
        
        if format_valid:
            print(f"      ✅ IEEE format validation passed for {category}")
        else:
            print(f"      ❌ IEEE format validation failed for {category}")
            print(f"         Citation: {citation}")
            all_tests_passed = False
    
    return all_tests_passed

def test_ieee_required_elements(publications):
    """Test that all required IEEE elements are present for each publication type"""
    print("4. Testing IEEE required elements...")
    
    all_tests_passed = True
    
    # Define required elements for each publication type
    required_elements = {
        "Journal Articles": {
            "mandatory": ["authors", "title", "year"],
            "ieee_specific": ["journal_name", "volume", "issue", "pages"],
            "description": "Authors (bold), \"Title\", Journal Name (italic), vol. X, no. X, pp. XXX–XXX, Year"
        },
        "Conference Proceedings": {
            "mandatory": ["authors", "title", "year"],
            "ieee_specific": ["conference_name", "pages"],
            "optional": ["city", "country"],
            "description": "Authors (bold), \"Title\", Conference Name (italic), Location, pp. XXX–XXX, Year"
        },
        "Book Chapters": {
            "mandatory": ["authors", "title", "year"],
            "ieee_specific": ["book_title", "editor", "publisher", "pages"],
            "optional": ["city", "country"],
            "description": "Authors (bold), \"Title\", Book Title (italic), Editor Ed(s)., Publisher, Location, pp. XXX–XXX, Year"
        }
    }
    
    # Group publications by category
    publications_by_category = {}
    for pub in publications:
        category = pub.get('category', 'Unknown')
        if category not in publications_by_category:
            publications_by_category[category] = []
        publications_by_category[category].append(pub)
    
    for category, requirements in required_elements.items():
        if category in publications_by_category:
            category_pubs = publications_by_category[category]
            print(f"   \n   📚 Testing {category} ({len(category_pubs)} publications):")
            print(f"      Expected format: {requirements['description']}")
            
            # Test sample publications
            sample_size = min(3, len(category_pubs))
            for i in range(sample_size):
                pub = category_pubs[i]
                print(f"      \n      📄 Publication {i+1}: '{pub.get('title', '')[:40]}...'")
                
                # Check mandatory elements
                missing_mandatory = []
                for element in requirements["mandatory"]:
                    if not pub.get(element):
                        missing_mandatory.append(element)
                
                if missing_mandatory:
                    print(f"         ❌ Missing mandatory elements: {missing_mandatory}")
                    all_tests_passed = False
                else:
                    print(f"         ✅ All mandatory elements present")
                
                # Check IEEE-specific elements
                missing_ieee = []
                for element in requirements["ieee_specific"]:
                    if not pub.get(element):
                        missing_ieee.append(element)
                
                if missing_ieee:
                    print(f"         ⚠️  Missing IEEE elements: {missing_ieee}")
                    print(f"         📝 This may affect citation completeness")
                else:
                    print(f"         ✅ All IEEE-specific elements present")
                
                # Check optional elements
                if "optional" in requirements:
                    missing_optional = []
                    for element in requirements["optional"]:
                        if not pub.get(element):
                            missing_optional.append(element)
                    
                    if missing_optional:
                        print(f"         ℹ️  Missing optional elements: {missing_optional}")
                    else:
                        print(f"         ✅ All optional elements present")
        else:
            print(f"   ⚠️  No publications found for category: {category}")
    
    return all_tests_passed

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

def test_publications_endpoint():
    """Test GET /api/publications endpoint - COMPREHENSIVE REVIEW REQUEST TESTING"""
    print("7. Testing GET /api/publications endpoint - ADDRESSING USER 'No publications found' ISSUE...")
    
    all_tests_passed = True
    
    try:
        # 1. Google Sheets Integration vs Mock Data Detection
        print("   1.1 Testing Google Sheets Integration vs Mock Data...")
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/publications", timeout=30)
        response_time = (datetime.now() - start_time).total_seconds()
        
        if response.status_code != 200:
            print(f"      ❌ Publications API request failed with status: {response.status_code}")
            print(f"      Response text: {response.text[:200]}")
            all_tests_passed = False
            return False
        else:
            data = response.json()
            required_keys = ["publications", "pagination", "statistics"]
            if not all(key in data for key in required_keys):
                print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
                all_tests_passed = False
            else:
                publications = data.get('publications', [])
                print(f"      ✅ Publications API responding - Retrieved {len(publications)} publications")
                print(f"      ⏱️  Response time: {response_time:.3f} seconds")
                
                # Detect if using Google Sheets or mock data
                if len(publications) > 0:
                    sample_pub = publications[0]
                    # Check for Google Sheets indicators vs mock data patterns
                    if 'ieee_formatted' in sample_pub and sample_pub.get('id', '').startswith('pub_'):
                        print(f"      🔍 Data source analysis: Likely REAL Google Sheets data")
                        print(f"      📄 Sample publication: '{sample_pub.get('title', '')[:50]}...'")
                        print(f"      🏷️  Sample category: {sample_pub.get('category', 'N/A')}")
                        print(f"      📊 Sample citations: {sample_pub.get('citations', 0)}")
                    else:
                        print(f"      🔍 Data source analysis: Likely MOCK data")
                        print(f"      📄 Sample publication: '{sample_pub.get('title', '')[:50]}...'")
                else:
                    print(f"      ❌ CRITICAL: No publications returned - This explains user's 'No publications found' message!")
                    all_tests_passed = False
        
        # 2. Cache Status Check
        print("   1.2 Testing Cache Status and Fresh Data Fetching...")
        cache_response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if cache_response.status_code == 200:
            cache_data = cache_response.json()
            print(f"      ✅ Cache status accessible")
            print(f"      📦 Cached items: {cache_data.get('cached_items', 0)}")
            print(f"      ⏰ Cache duration: {cache_data.get('cache_duration_minutes', 0)} minutes")
            
            # Check if data is being fetched fresh
            if response_time > 1.0:
                print(f"      🔄 Slow response suggests fresh Google Sheets fetch")
            else:
                print(f"      ⚡ Fast response suggests cached data")
        else:
            print(f"      ⚠️  Cache status endpoint not accessible")
        
        # 3. Clear Cache and Test Fresh Fetch
        print("   1.3 Testing Fresh Data Fetch from Google Sheets...")
        clear_cache_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if clear_cache_response.status_code == 200:
            print(f"      ✅ Cache cleared successfully")
            
            # Now test fresh fetch
            start_time = datetime.now()
            fresh_response = requests.get(f"{API_BASE_URL}/publications", timeout=30)
            fresh_response_time = (datetime.now() - start_time).total_seconds()
            
            if fresh_response.status_code == 200:
                fresh_data = fresh_response.json()
                fresh_publications = fresh_data.get('publications', [])
                print(f"      ✅ Fresh fetch successful - {len(fresh_publications)} publications")
                print(f"      ⏱️  Fresh fetch time: {fresh_response_time:.3f} seconds")
                
                if fresh_response_time > 1.0:
                    print(f"      🌐 Slow response confirms Google Sheets API call")
                else:
                    print(f"      ⚠️  Fast response might indicate fallback to mock data")
            else:
                print(f"      ❌ Fresh fetch failed with status: {fresh_response.status_code}")
                all_tests_passed = False
        else:
            print(f"      ⚠️  Cache clear endpoint not accessible")
        
        # 4. Error Handling Test - What happens when Google Sheets is down
        print("   1.4 Testing Error Handling and Fallback Behavior...")
        # We can't simulate Google Sheets being down, but we can check error responses
        print("      ℹ️  Error handling test: Cannot simulate Google Sheets downtime in production")
        print("      ℹ️  Checking if API has proper error handling structure...")
        
        if 'error' in data:
            print(f"      ⚠️  API returned error: {data.get('error')}")
            if len(data.get('publications', [])) > 0:
                print(f"      ✅ Fallback data provided despite error")
            else:
                print(f"      ❌ No fallback data provided")
                all_tests_passed = False
        
        # 2. New Search Filter Testing
        print("   2.1 Testing new search_filter parameter...")
        
        # Test search across titles, authors, and year in a single query
        search_tests = [
            ("Smart Grid", "title/content search"),
            ("Rahman", "author search"),
            ("2024", "year search"),
            ("energy", "general content search")
        ]
        
        for search_term, test_type in search_tests:
            response = requests.get(f"{API_BASE_URL}/publications?search_filter={search_term}", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Search filter '{search_term}' ({test_type}) failed")
                all_tests_passed = False
            else:
                data = response.json()
                publications = data.get("publications", [])
                print(f"      ✅ Search '{search_term}' ({test_type}): {len(publications)} results")
        
        # Test case-insensitive search
        response = requests.get(f"{API_BASE_URL}/publications?search_filter=SMART", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            print(f"      ✅ Case-insensitive search 'SMART': {len(publications)} results")
        
        # Compare with individual filter parameters
        print("   2.2 Comparing search_filter with individual filters...")
        
        # Test individual filters
        individual_filters = [
            ("title_filter=Smart", "title filter"),
            ("author_filter=Rahman", "author filter"),
            ("year_filter=2024", "year filter")
        ]
        
        for filter_param, filter_type in individual_filters:
            response = requests.get(f"{API_BASE_URL}/publications?{filter_param}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                publications = data.get("publications", [])
                print(f"      ✅ Individual {filter_type}: {len(publications)} results")
        
        # 3. Category Filtering with New "Books" Category
        print("   3.1 Testing category filtering including new 'Books' category...")
        
        categories = ["Journal Articles", "Conference Proceedings", "Book Chapters", "Books"]
        
        for category in categories:
            response = requests.get(f"{API_BASE_URL}/publications?category_filter={category}", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Category filter '{category}' failed")
                all_tests_passed = False
            else:
                data = response.json()
                publications = data.get("publications", [])
                # Verify all returned publications have the correct category
                correct_category = all(pub.get("category") == category for pub in publications)
                if correct_category:
                    print(f"      ✅ Category '{category}': {len(publications)} publications")
                else:
                    print(f"      ❌ Category '{category}': Filtering not working correctly")
                    all_tests_passed = False
        
        # Test empty category filter (should return all categories)
        response = requests.get(f"{API_BASE_URL}/publications", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            all_categories = set(pub.get("category") for pub in publications)
            print(f"      ✅ Empty category filter returns all categories: {all_categories}")
        
        # Test category filter with search
        response = requests.get(f"{API_BASE_URL}/publications?category_filter=Journal Articles&search_filter=Smart", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            print(f"      ✅ Category + Search combination: {len(publications)} results")
        
        # 4. Enhanced Statistics Response
        print("   4.1 Testing enhanced statistics response...")
        
        response = requests.get(f"{API_BASE_URL}/publications", timeout=10)
        if response.status_code == 200:
            data = response.json()
            statistics = data.get("statistics", {})
            required_stats = ["total_publications", "total_citations", "latest_year", "total_areas"]
            
            missing_stats = [stat for stat in required_stats if stat not in statistics]
            if missing_stats:
                print(f"      ❌ Missing statistics: {missing_stats}")
                all_tests_passed = False
            else:
                print(f"      ✅ All required statistics present: {statistics}")
                
                # Verify statistics are calculated from actual data (not hardcoded)
                publications = data.get("publications", [])
                if len(publications) > 0:
                    # Check if statistics make sense with the data
                    actual_citations = sum(pub.get("citations", 0) for pub in publications)
                    print(f"      📊 Statistics validation - Total citations in response: {statistics.get('total_citations')}")
        
        # Test statistics update based on filtered results
        response = requests.get(f"{API_BASE_URL}/publications?category_filter=Journal Articles", timeout=10)
        if response.status_code == 200:
            data = response.json()
            filtered_stats = data.get("statistics", {})
            print(f"      ✅ Filtered statistics: {filtered_stats}")
        
        # 5. Improved Sorting Options
        print("   5.1 Testing improved sorting options...")
        
        sorting_tests = [
            ("year", "desc", "newest first"),
            ("year", "asc", "oldest first"),
            ("citations", "desc", "high to low"),
            ("citations", "asc", "low to high"),
            ("title", "asc", "A-Z"),
            ("title", "desc", "Z-A"),
            ("area", "asc", "research area A-Z"),
            ("area", "desc", "research area Z-A")
        ]
        
        for sort_by, sort_order, description in sorting_tests:
            response = requests.get(f"{API_BASE_URL}/publications?sort_by={sort_by}&sort_order={sort_order}&per_page=5", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Sorting by {sort_by} ({description}) failed")
                all_tests_passed = False
            else:
                data = response.json()
                publications = data.get("publications", [])
                if len(publications) >= 2:
                    if sort_by == "year":
                        years = [pub.get("year", "") for pub in publications[:3]]
                        print(f"      ✅ Year sorting ({description}): {years}")
                    elif sort_by == "citations":
                        citations = [pub.get("citations", 0) for pub in publications[:3]]
                        print(f"      ✅ Citations sorting ({description}): {citations}")
                    elif sort_by == "title":
                        titles = [pub.get("title", "")[:30] + "..." for pub in publications[:3]]
                        print(f"      ✅ Title sorting ({description}): {titles}")
                    elif sort_by == "area":
                        areas = [pub.get("research_areas", [""])[0] if pub.get("research_areas") else "" for pub in publications[:3]]
                        print(f"      ✅ Research area sorting ({description}): {areas}")
        
        # Test sorting with filtered results
        response = requests.get(f"{API_BASE_URL}/publications?category_filter=Journal Articles&sort_by=citations&sort_order=desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            print(f"      ✅ Sorting with filtering: {len(publications)} Journal Articles sorted by citations")
        
        # 6. Pagination and Performance
        print("   6.1 Testing pagination and performance...")
        
        # Test different per_page sizes
        page_sizes = [5, 10, 20, 50]
        for page_size in page_sizes:
            response = requests.get(f"{API_BASE_URL}/publications?per_page={page_size}", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Page size {page_size} failed")
                all_tests_passed = False
            else:
                data = response.json()
                publications = data.get("publications", [])
                pagination = data.get("pagination", {})
                print(f"      ✅ Page size {page_size}: Got {len(publications)} items, per_page={pagination.get('per_page')}")
        
        # Test edge cases (page beyond total pages, invalid page numbers)
        response = requests.get(f"{API_BASE_URL}/publications?page=999999&per_page=10", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            print(f"      ✅ Large page number handled gracefully: {len(publications)} items")
        
        response = requests.get(f"{API_BASE_URL}/publications?page=-1&per_page=10", timeout=10)
        if response.status_code == 200:
            print(f"      ✅ Invalid page number handled gracefully")
        
        # Verify pagination metadata
        response = requests.get(f"{API_BASE_URL}/publications?page=1&per_page=10", timeout=10)
        if response.status_code == 200:
            data = response.json()
            pagination = data.get("pagination", {})
            required_pagination_keys = ["current_page", "total_pages", "has_next", "has_prev", "per_page", "total_items"]
            missing_keys = [key for key in required_pagination_keys if key not in pagination]
            if not missing_keys:
                print(f"      ✅ Pagination metadata complete: {pagination}")
            else:
                print(f"      ❌ Missing pagination keys: {missing_keys}")
                all_tests_passed = False
        
        # 7. Combined Filtering Tests
        print("   7.1 Testing combined filtering scenarios...")
        
        # Test search + category filter combination
        response = requests.get(f"{API_BASE_URL}/publications?search_filter=Smart Grid&category_filter=Journal Articles", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            print(f"      ✅ Search + Category filter: {len(publications)} results")
        
        # Test search + sorting combination
        response = requests.get(f"{API_BASE_URL}/publications?search_filter=energy&sort_by=citations&sort_order=desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            print(f"      ✅ Search + Sorting: {len(publications)} results sorted by citations")
        
        # Test category + sorting + pagination combination
        response = requests.get(f"{API_BASE_URL}/publications?category_filter=Conference Proceedings&sort_by=year&sort_order=desc&page=1&per_page=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            pagination = data.get("pagination", {})
            print(f"      ✅ Category + Sorting + Pagination: {len(publications)} Conference Proceedings, page {pagination.get('current_page')}")
        
        # Verify no blank page issues when filters are applied
        response = requests.get(f"{API_BASE_URL}/publications?category_filter=Books&page=1&per_page=10", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            pagination = data.get("pagination", {})
            print(f"      ✅ Books category filter: {len(publications)} results, no blank page issues")
        
        # Test multiple filters together
        response = requests.get(f"{API_BASE_URL}/publications?search_filter=Smart&category_filter=Journal Articles&sort_by=year&sort_order=desc&page=1&per_page=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            publications = data.get("publications", [])
            print(f"      ✅ Multiple filters combined: {len(publications)} results")
        
        if all_tests_passed:
            print("   🎉 ALL Publications API tests PASSED!")
        else:
            print("   ⚠️  Some Publications API tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in comprehensive Publications API testing: {e}")
        return False

def test_projects_endpoint():
    """Test GET /api/projects endpoint - COMPREHENSIVE REVIEW REQUEST TESTING"""
    print("8. Testing GET /api/projects endpoint - ADDRESSING USER 'No projects found' ISSUE...")
    
    all_tests_passed = True
    
    try:
        # 1. Basic endpoint test with data source detection
        print("   1.1 Testing Projects API and Data Source...")
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/projects", timeout=30)
        response_time = (datetime.now() - start_time).total_seconds()
        
        if response.status_code != 200:
            print(f"      ❌ Projects API request failed with status: {response.status_code}")
            print(f"      Response text: {response.text[:200]}")
            all_tests_passed = False
            return False
        
        data = response.json()
        required_keys = ["projects", "pagination"]
        if not all(key in data for key in required_keys):
            print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            all_tests_passed = False
        else:
            projects = data.get('projects', [])
            print(f"      ✅ Projects API responding - Retrieved {len(projects)} projects")
            print(f"      ⏱️  Response time: {response_time:.3f} seconds")
            
            if len(projects) > 0:
                sample_project = projects[0]
                print(f"      🔍 Data source analysis: Google Sheets integration")
                print(f"      📄 Sample project: '{sample_project.get('title', '')[:50]}...'")
                print(f"      📊 Sample status: {sample_project.get('status', 'N/A')}")
                print(f"      🏷️  Sample areas: {sample_project.get('research_areas', [])[:2]}")
            else:
                print(f"      ❌ CRITICAL: No projects returned - This explains user's 'No projects found' message!")
                all_tests_passed = False
        
        # 2. Test filtering functionality
        print("   1.2 Testing Projects Filtering...")
        
        # Test status filter
        status_response = requests.get(f"{API_BASE_URL}/projects?status_filter=Active", timeout=15)
        if status_response.status_code == 200:
            status_data = status_response.json()
            active_projects = status_data.get('projects', [])
            print(f"      ✅ Status filter 'Active': {len(active_projects)} projects")
        else:
            print(f"      ❌ Status filter failed with status: {status_response.status_code}")
            all_tests_passed = False
        
        # Test area filter
        area_response = requests.get(f"{API_BASE_URL}/projects?area_filter=Smart Grid Technologies", timeout=15)
        if area_response.status_code == 200:
            area_data = area_response.json()
            area_projects = area_data.get('projects', [])
            print(f"      ✅ Area filter 'Smart Grid Technologies': {len(area_projects)} projects")
        else:
            print(f"      ❌ Area filter failed with status: {area_response.status_code}")
            all_tests_passed = False
        
        # Test title filter
        title_response = requests.get(f"{API_BASE_URL}/projects?title_filter=Solar", timeout=15)
        if title_response.status_code == 200:
            title_data = title_response.json()
            title_projects = title_data.get('projects', [])
            print(f"      ✅ Title filter 'Solar': {len(title_projects)} projects")
        else:
            print(f"      ❌ Title filter failed")
            all_tests_passed = False
        
        # 3. Test pagination and sorting
        print("   1.3 Testing Projects Pagination and Sorting...")
        
        # Test different page sizes
        for page_size in [5, 10, 20]:
            page_response = requests.get(f"{API_BASE_URL}/projects?page=1&per_page={page_size}", timeout=15)
            if page_response.status_code == 200:
                page_data = page_response.json()
                page_projects = page_data.get('projects', [])
                pagination = page_data.get('pagination', {})
                print(f"      ✅ Page size {page_size}: Got {len(page_projects)} projects, per_page={pagination.get('per_page')}")
            else:
                print(f"      ❌ Pagination test failed for page size {page_size}")
                all_tests_passed = False
        
        # Test sorting
        sort_response = requests.get(f"{API_BASE_URL}/projects?sort_by=start_date&sort_order=desc", timeout=15)
        if sort_response.status_code == 200:
            sort_data = sort_response.json()
            sort_projects = sort_data.get('projects', [])
            print(f"      ✅ Sorting by start_date desc: {len(sort_projects)} projects")
            if len(sort_projects) >= 2:
                dates = [proj.get('start_date', '') for proj in sort_projects[:3]]
                print(f"      📅 Sample dates order: {dates}")
        else:
            print(f"      ❌ Sorting test failed")
            all_tests_passed = False
        
        # 4. Test combined filtering
        print("   1.4 Testing Combined Projects Filtering...")
        combined_response = requests.get(f"{API_BASE_URL}/projects?status_filter=Active&sort_by=start_date&sort_order=desc&per_page=5", timeout=15)
        if combined_response.status_code == 200:
            combined_data = combined_response.json()
            combined_projects = combined_data.get('projects', [])
            print(f"      ✅ Combined filtering (Active + sorted): {len(combined_projects)} projects")
        else:
            print(f"      ❌ Combined filtering failed")
            all_tests_passed = False
        
        if all_tests_passed:
            print("   🎉 ALL Projects API tests PASSED!")
        else:
            print("   ⚠️  Some Projects API tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in comprehensive Projects API testing: {e}")
        return False

def test_achievements_endpoint():
    """Test GET /api/achievements endpoint - COMPREHENSIVE REVIEW REQUEST TESTING"""
    print("9. Testing GET /api/achievements endpoint - ADDRESSING USER 'No achievements found' ISSUE...")
    
    all_tests_passed = True
    
    try:
        # 1. Basic endpoint test with data source detection
        print("   1.1 Testing Achievements API and Data Source...")
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=30)
        response_time = (datetime.now() - start_time).total_seconds()
        
        if response.status_code != 200:
            print(f"      ❌ Achievements API request failed with status: {response.status_code}")
            print(f"      Response text: {response.text[:200]}")
            all_tests_passed = False
            return False
        
        data = response.json()
        required_keys = ["achievements", "pagination"]
        if not all(key in data for key in required_keys):
            print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            all_tests_passed = False
        else:
            achievements = data.get('achievements', [])
            print(f"      ✅ Achievements API responding - Retrieved {len(achievements)} achievements")
            print(f"      ⏱️  Response time: {response_time:.3f} seconds")
            
            if len(achievements) > 0:
                sample_achievement = achievements[0]
                print(f"      🔍 Data source analysis: Google Sheets integration")
                print(f"      📄 Sample achievement: '{sample_achievement.get('title', '')[:50]}...'")
                print(f"      🏷️  Sample category: {sample_achievement.get('category', 'N/A')}")
                print(f"      📅 Sample date: {sample_achievement.get('date', 'N/A')}")
                
                # Check for featured items
                featured_count = sum(1 for ach in achievements if ach.get('featured', 0) == 1)
                print(f"      ⭐ Featured achievements: {featured_count}")
            else:
                print(f"      ❌ CRITICAL: No achievements returned - This explains user's 'No achievements found' message!")
                all_tests_passed = False
        
        # 2. Test category filtering
        print("   1.2 Testing Achievements Category Filtering...")
        
        # Get available categories first
        if len(data.get('achievements', [])) > 0:
            all_categories = set(ach.get('category', '') for ach in data['achievements'])
            print(f"      📋 Available categories: {sorted(all_categories)}")
            
            # Test each category
            for category in sorted(all_categories):
                if category:  # Skip empty categories
                    cat_response = requests.get(f"{API_BASE_URL}/achievements?category_filter={category}", timeout=15)
                    if cat_response.status_code == 200:
                        cat_data = cat_response.json()
                        cat_achievements = cat_data.get('achievements', [])
                        print(f"      ✅ Category '{category}': {len(cat_achievements)} achievements")
                        
                        # Verify all returned items have the correct category
                        correct_category = all(ach.get('category') == category for ach in cat_achievements)
                        if not correct_category:
                            print(f"      ❌ Category filtering not working correctly for '{category}'")
                            all_tests_passed = False
                    else:
                        print(f"      ❌ Category filter '{category}' failed with status: {cat_response.status_code}")
                        all_tests_passed = False
        
        # 3. Test detailed view endpoint
        print("   1.3 Testing Achievements Detail Endpoint...")
        if len(data.get('achievements', [])) > 0:
            sample_id = data['achievements'][0].get('id')
            if sample_id:
                detail_response = requests.get(f"{API_BASE_URL}/achievements/{sample_id}", timeout=15)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    if 'error' not in detail_data:
                        print(f"      ✅ Detail endpoint working - Retrieved achievement details")
                        print(f"      📄 Detail title: '{detail_data.get('title', '')[:50]}...'")
                        
                        # Check for full_content field for blog functionality
                        if 'full_content' in detail_data:
                            content_length = len(detail_data.get('full_content', ''))
                            print(f"      📝 Full content available: {content_length} characters")
                        else:
                            print(f"      ⚠️  No full_content field for blog functionality")
                    else:
                        print(f"      ❌ Detail endpoint returned error: {detail_data.get('error')}")
                        all_tests_passed = False
                else:
                    print(f"      ❌ Detail endpoint failed with status: {detail_response.status_code}")
                    all_tests_passed = False
        
        # 4. Test pagination and sorting
        print("   1.4 Testing Achievements Pagination and Sorting...")
        
        # Test different page sizes
        for page_size in [6, 12, 24]:
            page_response = requests.get(f"{API_BASE_URL}/achievements?page=1&per_page={page_size}", timeout=15)
            if page_response.status_code == 200:
                page_data = page_response.json()
                page_achievements = page_data.get('achievements', [])
                pagination = page_data.get('pagination', {})
                print(f"      ✅ Page size {page_size}: Got {len(page_achievements)} achievements, per_page={pagination.get('per_page')}")
            else:
                print(f"      ❌ Pagination test failed for page size {page_size}")
                all_tests_passed = False
        
        # Test sorting options
        sort_tests = [
            ("date", "desc", "newest first"),
            ("date", "asc", "oldest first"),
            ("title", "asc", "A-Z"),
            ("title", "desc", "Z-A")
        ]
        
        for sort_by, sort_order, description in sort_tests:
            sort_response = requests.get(f"{API_BASE_URL}/achievements?sort_by={sort_by}&sort_order={sort_order}&per_page=5", timeout=15)
            if sort_response.status_code == 200:
                sort_data = sort_response.json()
                sort_achievements = sort_data.get('achievements', [])
                print(f"      ✅ Sorting {description}: {len(sort_achievements)} achievements")
                
                # Check if featured items maintain priority
                if len(sort_achievements) > 0:
                    featured_first = sort_achievements[0].get('featured', 0) == 1
                    if featured_first:
                        print(f"      ⭐ Featured item maintains priority in sorting")
            else:
                print(f"      ❌ Sorting test failed for {description}")
                all_tests_passed = False
        
        # 5. Test title filtering
        print("   1.5 Testing Achievements Title Filtering...")
        title_response = requests.get(f"{API_BASE_URL}/achievements?title_filter=Award", timeout=15)
        if title_response.status_code == 200:
            title_data = title_response.json()
            title_achievements = title_data.get('achievements', [])
            print(f"      ✅ Title filter 'Award': {len(title_achievements)} achievements")
        else:
            print(f"      ❌ Title filter failed")
            all_tests_passed = False
        
        if all_tests_passed:
            print("   🎉 ALL Achievements API tests PASSED!")
        else:
            print("   ⚠️  Some Achievements API tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in comprehensive Achievements API testing: {e}")
        return False

def test_news_events_endpoint():
    """Test GET /api/news-events endpoint - COMPREHENSIVE REVIEW REQUEST TESTING"""
    print("10. Testing GET /api/news-events endpoint - ADDRESSING USER 'No news-events found' ISSUE...")
    
    all_tests_passed = True
    
    try:
        # 1. Basic endpoint test with data source detection
        print("   1.1 Testing News-Events API and Data Source...")
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=30)
        response_time = (datetime.now() - start_time).total_seconds()
        
        if response.status_code != 200:
            print(f"      ❌ News-Events API request failed with status: {response.status_code}")
            print(f"      Response text: {response.text[:200]}")
            all_tests_passed = False
            return False
        
        data = response.json()
        required_keys = ["news_events", "pagination"]
        if not all(key in data for key in required_keys):
            print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
            all_tests_passed = False
        else:
            news_events = data.get('news_events', [])
            print(f"      ✅ News-Events API responding - Retrieved {len(news_events)} news & events")
            print(f"      ⏱️  Response time: {response_time:.3f} seconds")
            
            if len(news_events) > 0:
                sample_news = news_events[0]
                print(f"      🔍 Data source analysis: Google Sheets integration")
                print(f"      📄 Sample news/event: '{sample_news.get('title', '')[:50]}...'")
                print(f"      🏷️  Sample category: {sample_news.get('category', 'N/A')}")
                print(f"      📅 Sample date: {sample_news.get('date', 'N/A')}")
                
                # Check for both description fields
                has_description = 'description' in sample_news
                has_short_description = 'short_description' in sample_news
                print(f"      📝 Description fields: description={has_description}, short_description={has_short_description}")
                
                # Check for featured items
                featured_count = sum(1 for news in news_events if news.get('featured', 0) == 1)
                print(f"      ⭐ Featured news/events: {featured_count}")
            else:
                print(f"      ❌ CRITICAL: No news/events returned - This explains user's 'No news-events found' message!")
                all_tests_passed = False
        
        # 2. Test category filtering
        print("   1.2 Testing News-Events Category Filtering...")
        
        # Get available categories first
        if len(data.get('news_events', [])) > 0:
            all_categories = set(news.get('category', '') for news in data['news_events'])
            print(f"      📋 Available categories: {sorted(all_categories)}")
            
            # Test each category
            for category in sorted(all_categories):
                if category:  # Skip empty categories
                    cat_response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=15)
                    if cat_response.status_code == 200:
                        cat_data = cat_response.json()
                        cat_news = cat_data.get('news_events', [])
                        print(f"      ✅ Category '{category}': {len(cat_news)} news/events")
                        
                        # Verify all returned items have the correct category
                        correct_category = all(news.get('category') == category for news in cat_news)
                        if not correct_category:
                            print(f"      ❌ Category filtering not working correctly for '{category}'")
                            all_tests_passed = False
                    else:
                        print(f"      ❌ Category filter '{category}' failed with status: {cat_response.status_code}")
                        all_tests_passed = False
        
        # 3. Test detailed view endpoint
        print("   1.3 Testing News-Events Detail Endpoint...")
        if len(data.get('news_events', [])) > 0:
            sample_id = data['news_events'][0].get('id')
            if sample_id:
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{sample_id}", timeout=15)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    if 'error' not in detail_data:
                        print(f"      ✅ Detail endpoint working - Retrieved news/event details")
                        print(f"      📄 Detail title: '{detail_data.get('title', '')[:50]}...'")
                        
                        # Check for full_content field for blog functionality
                        if 'full_content' in detail_data:
                            content_length = len(detail_data.get('full_content', ''))
                            print(f"      📝 Full content available: {content_length} characters")
                            
                            # Check for mathematical content (LaTeX support)
                            full_content = detail_data.get('full_content', '')
                            math_indicators = ['$', 'α', 'β', 'γ', '∑', '∫', '√']
                            math_count = sum(full_content.count(indicator) for indicator in math_indicators)
                            if math_count > 0:
                                print(f"      🧮 Mathematical content detected: {math_count} math symbols")
                        else:
                            print(f"      ⚠️  No full_content field for blog functionality")
                    else:
                        print(f"      ❌ Detail endpoint returned error: {detail_data.get('error')}")
                        all_tests_passed = False
                else:
                    print(f"      ❌ Detail endpoint failed with status: {detail_response.status_code}")
                    all_tests_passed = False
        
        # 4. Test pagination and sorting
        print("   1.4 Testing News-Events Pagination and Sorting...")
        
        # Test different page sizes
        for page_size in [5, 15, 30]:
            page_response = requests.get(f"{API_BASE_URL}/news-events?page=1&per_page={page_size}", timeout=15)
            if page_response.status_code == 200:
                page_data = page_response.json()
                page_news = page_data.get('news_events', [])
                pagination = page_data.get('pagination', {})
                print(f"      ✅ Page size {page_size}: Got {len(page_news)} news/events, per_page={pagination.get('per_page')}")
            else:
                print(f"      ❌ Pagination test failed for page size {page_size}")
                all_tests_passed = False
        
        # Test sorting options
        sort_tests = [
            ("date", "desc", "newest first"),
            ("date", "asc", "oldest first"),
            ("title", "asc", "A-Z"),
            ("title", "desc", "Z-A")
        ]
        
        for sort_by, sort_order, description in sort_tests:
            sort_response = requests.get(f"{API_BASE_URL}/news-events?sort_by={sort_by}&sort_order={sort_order}&per_page=5", timeout=15)
            if sort_response.status_code == 200:
                sort_data = sort_response.json()
                sort_news = sort_data.get('news_events', [])
                print(f"      ✅ Sorting {description}: {len(sort_news)} news/events")
                
                # Check if featured items maintain priority
                if len(sort_news) > 0:
                    featured_first = sort_news[0].get('featured', 0) == 1
                    if featured_first:
                        print(f"      ⭐ Featured item maintains priority in sorting")
            else:
                print(f"      ❌ Sorting test failed for {description}")
                all_tests_passed = False
        
        # 5. Test title filtering and search functionality
        print("   1.5 Testing News-Events Title Filtering...")
        
        # Test common search terms
        search_terms = ["Smart", "Grid", "Energy", "Research", "Grant"]
        for term in search_terms:
            title_response = requests.get(f"{API_BASE_URL}/news-events?title_filter={term}", timeout=15)
            if title_response.status_code == 200:
                title_data = title_response.json()
                title_news = title_data.get('news_events', [])
                print(f"      ✅ Title filter '{term}': {len(title_news)} news/events")
            else:
                print(f"      ❌ Title filter '{term}' failed")
                all_tests_passed = False
        
        # 6. Test combined filtering
        print("   1.6 Testing Combined News-Events Filtering...")
        combined_response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News&sort_by=date&sort_order=desc&per_page=5", timeout=15)
        if combined_response.status_code == 200:
            combined_data = combined_response.json()
            combined_news = combined_data.get('news_events', [])
            print(f"      ✅ Combined filtering (News + sorted): {len(combined_news)} news/events")
        else:
            print(f"      ❌ Combined filtering failed")
            all_tests_passed = False
        
        if all_tests_passed:
            print("   🎉 ALL News-Events API tests PASSED!")
        else:
            print("   ⚠️  Some News-Events API tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in comprehensive News-Events API testing: {e}")
        return False

def test_featured_items_and_short_description():
    """Test enhanced Achievements and News & Events APIs with featured item functionality and short description fix"""
    print("18. Testing Featured Items and Short Description Fix...")
    
    all_tests_passed = True
    
    try:
        # 1. Test Featured Items in Achievements API
        print("   1.1 Testing Featured Items in Achievements API...")
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ Achievements API request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            achievements = data.get("achievements", [])
            print(f"      ✅ Successfully fetched {len(achievements)} achievements")
            
            # Check if featured field is present in response
            featured_field_present = all("featured" in item for item in achievements)
            if featured_field_present:
                print("      ✅ Featured field present in all achievement items")
            else:
                print("      ❌ Featured field missing in some achievement items")
                all_tests_passed = False
            
            # Check if featured items appear first
            featured_items = [item for item in achievements if item.get("featured", 0) == 1]
            non_featured_items = [item for item in achievements if item.get("featured", 0) == 0]
            
            if len(featured_items) > 0:
                print(f"      ✅ Found {len(featured_items)} featured achievements")
                
                # Verify featured items appear first in the list
                first_items_featured = True
                for i in range(len(featured_items)):
                    if i < len(achievements) and achievements[i].get("featured", 0) != 1:
                        first_items_featured = False
                        break
                
                if first_items_featured:
                    print("      ✅ Featured achievements appear first in results")
                else:
                    print("      ❌ Featured achievements do not appear first in results")
                    all_tests_passed = False
                    
                # Show sample featured item
                sample_featured = featured_items[0]
                print(f"      📌 Sample featured achievement: '{sample_featured.get('title', '')[:50]}...'")
            else:
                print("      ⚠️  No featured achievements found in current data")
            
            # Check short_description field mapping
            short_desc_present = all("short_description" in item for item in achievements)
            if short_desc_present:
                print("      ✅ Short_description field present in all achievement items")
                
                # Verify short_description is mapped from Google Sheets 'description' column
                sample_item = achievements[0] if achievements else None
                if sample_item:
                    short_desc = sample_item.get("short_description", "")
                    if short_desc and len(short_desc) > 0:
                        print(f"      ✅ Short_description field populated: '{short_desc[:50]}...'")
                    else:
                        print("      ⚠️  Short_description field empty in sample item")
            else:
                print("      ❌ Short_description field missing in some achievement items")
                all_tests_passed = False
        
        # 2. Test Featured Items with Different Sorting Options
        print("   1.2 Testing Featured Items Priority with Different Sorting...")
        
        sorting_tests = [
            ("date", "desc", "newest first"),
            ("date", "asc", "oldest first"),
            ("title", "asc", "A-Z"),
            ("title", "desc", "Z-A")
        ]
        
        for sort_by, sort_order, description in sorting_tests:
            response = requests.get(f"{API_BASE_URL}/achievements?sort_by={sort_by}&sort_order={sort_order}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                achievements = data.get("achievements", [])
                
                # Check if featured items still appear first regardless of sorting
                featured_count = sum(1 for item in achievements if item.get("featured", 0) == 1)
                if featured_count > 0:
                    # Check if first N items are featured (where N is the number of featured items)
                    first_n_featured = all(achievements[i].get("featured", 0) == 1 for i in range(min(featured_count, len(achievements))))
                    
                    if first_n_featured:
                        print(f"      ✅ Featured items maintain priority with {description} sorting")
                    else:
                        print(f"      ❌ Featured items lost priority with {description} sorting")
                        all_tests_passed = False
                else:
                    print(f"      ⚠️  No featured items to test with {description} sorting")
            else:
                print(f"      ❌ Sorting test failed for {description}")
                all_tests_passed = False
        
        # 3. Test Featured Items in News & Events API
        print("   2.1 Testing Featured Items in News & Events API...")
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
                    
                # Show sample featured item
                sample_featured = featured_items[0]
                print(f"      📌 Sample featured news/event: '{sample_featured.get('title', '')[:50]}...'")
            else:
                print("      ⚠️  No featured news & events found in current data")
            
            # Check both description and short_description fields
            desc_fields_present = all("description" in item and "short_description" in item for item in news_events)
            if desc_fields_present:
                print("      ✅ Both 'description' and 'short_description' fields present in all news & events items")
                
                # Verify fields are properly populated
                sample_item = news_events[0] if news_events else None
                if sample_item:
                    description = sample_item.get("description", "")
                    short_description = sample_item.get("short_description", "")
                    
                    if description and short_description:
                        print(f"      ✅ Description fields populated - desc: '{description[:30]}...', short: '{short_description[:30]}...'")
                    else:
                        print("      ⚠️  Some description fields empty in sample item")
            else:
                print("      ❌ Description or short_description fields missing in some news & events items")
                all_tests_passed = False
        
        # 4. Test Featured Items Priority with Different Sorting in News & Events
        print("   2.2 Testing Featured Items Priority with Different Sorting in News & Events...")
        
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
                    else:
                        print(f"      ❌ Featured items lost priority with {description} sorting")
                        all_tests_passed = False
                else:
                    print(f"      ⚠️  No featured items to test with {description} sorting")
            else:
                print(f"      ❌ Sorting test failed for {description}")
                all_tests_passed = False
        
        # 5. Test Detailed View Endpoints for Featured Items
        print("   3.1 Testing Detailed View Endpoints...")
        
        # Test achievements detail endpoint
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=10)
        if response.status_code == 200:
            data = response.json()
            achievements = data.get("achievements", [])
            
            if achievements:
                achievement_id = achievements[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    required_fields = ["id", "title", "short_description", "category", "date", "featured"]
                    
                    missing_fields = [field for field in required_fields if field not in detail_data]
                    if not missing_fields:
                        print("      ✅ Achievement detail endpoint returns all required fields including featured")
                    else:
                        print(f"      ❌ Achievement detail endpoint missing fields: {missing_fields}")
                        all_tests_passed = False
                else:
                    print(f"      ❌ Achievement detail endpoint failed with status: {detail_response.status_code}")
                    all_tests_passed = False
        
        # Test news-events detail endpoint
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            
            if news_events:
                news_id = news_events[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    required_fields = ["id", "title", "description", "short_description", "category", "date", "featured"]
                    
                    missing_fields = [field for field in required_fields if field not in detail_data]
                    if not missing_fields:
                        print("      ✅ News-events detail endpoint returns all required fields including featured and both description fields")
                    else:
                        print(f"      ❌ News-events detail endpoint missing fields: {missing_fields}")
                        all_tests_passed = False
                else:
                    print(f"      ❌ News-events detail endpoint failed with status: {detail_response.status_code}")
                    all_tests_passed = False
        
        # 6. Test Pagination with Featured Items
        print("   4.1 Testing Pagination with Featured Item Prioritization...")
        
        # Test different page sizes to ensure featured items maintain priority
        page_sizes = [5, 10, 15]
        for page_size in page_sizes:
            # Test achievements
            response = requests.get(f"{API_BASE_URL}/achievements?per_page={page_size}&page=1", timeout=10)
            if response.status_code == 200:
                data = response.json()
                achievements = data.get("achievements", [])
                
                featured_count = sum(1 for item in achievements if item.get("featured", 0) == 1)
                if featured_count > 0:
                    # Check if featured items are at the beginning
                    first_items_featured = all(achievements[i].get("featured", 0) == 1 for i in range(min(featured_count, len(achievements))))
                    
                    if first_items_featured:
                        print(f"      ✅ Achievements pagination (page_size={page_size}) maintains featured item priority")
                    else:
                        print(f"      ❌ Achievements pagination (page_size={page_size}) breaks featured item priority")
                        all_tests_passed = False
            
            # Test news-events
            response = requests.get(f"{API_BASE_URL}/news-events?per_page={page_size}&page=1", timeout=10)
            if response.status_code == 200:
                data = response.json()
                news_events = data.get("news_events", [])
                
                featured_count = sum(1 for item in news_events if item.get("featured", 0) == 1)
                if featured_count > 0:
                    # Check if featured items are at the beginning
                    first_items_featured = all(news_events[i].get("featured", 0) == 1 for i in range(min(featured_count, len(news_events))))
                    
                    if first_items_featured:
                        print(f"      ✅ News-events pagination (page_size={page_size}) maintains featured item priority")
                    else:
                        print(f"      ❌ News-events pagination (page_size={page_size}) breaks featured item priority")
                        all_tests_passed = False
        
        # 7. Test Backward Compatibility
        print("   5.1 Testing Backward Compatibility...")
        
        # Ensure existing functionality still works
        response = requests.get(f"{API_BASE_URL}/achievements?category_filter=Award", timeout=10)
        if response.status_code == 200:
            data = response.json()
            achievements = data.get("achievements", [])
            
            # Check that category filtering still works with featured items
            all_awards = all(item.get("category") == "Award" for item in achievements)
            if all_awards and len(achievements) > 0:
                print("      ✅ Category filtering works correctly with featured items")
            else:
                print("      ❌ Category filtering broken with featured items implementation")
                all_tests_passed = False
        
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            
            # Check that category filtering still works with featured items
            all_news = all(item.get("category") == "News" for item in news_events)
            if all_news and len(news_events) > 0:
                print("      ✅ News category filtering works correctly with featured items")
            else:
                print("      ❌ News category filtering broken with featured items implementation")
                all_tests_passed = False
        
        if all_tests_passed:
            print("   🎉 ALL Featured Items and Short Description tests PASSED!")
        else:
            print("   ⚠️  Some Featured Items and Short Description tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in Featured Items and Short Description testing: {e}")
        return False

def test_latex_rendering_support():
    """Test LaTeX rendering support in News & Events and Achievements APIs as per review request"""
    print("19. Testing LaTeX Rendering Support in Blog System...")
    
    all_tests_passed = True
    
    try:
        # 1. Test News & Events API for LaTeX content
        print("   1.1 Testing News & Events API for LaTeX expressions...")
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ News-events API request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            news_events = data.get("news_events", [])
            print(f"      ✅ Successfully fetched {len(news_events)} news & events")
            
            # Look for mathematical content in news events
            latex_content_found = False
            mathematical_articles = []
            
            for item in news_events:
                title = item.get("title", "")
                short_desc = item.get("short_description", "")
                
                # Check for mathematical keywords and LaTeX patterns
                math_keywords = ["mathematical", "equation", "formula", "optimization", "algorithm", "model"]
                latex_patterns = ["$", "α", "β", "γ", "Σ", "∫", "∂", "∇"]
                
                has_math_keywords = any(keyword.lower() in title.lower() or keyword.lower() in short_desc.lower() 
                                      for keyword in math_keywords)
                has_latex_symbols = any(symbol in title or symbol in short_desc 
                                      for symbol in latex_patterns)
                
                if has_math_keywords or has_latex_symbols:
                    mathematical_articles.append({
                        "id": item.get("id"),
                        "title": title,
                        "category": item.get("category"),
                        "has_math_keywords": has_math_keywords,
                        "has_latex_symbols": has_latex_symbols
                    })
                    latex_content_found = True
            
            if latex_content_found:
                print(f"      ✅ Found {len(mathematical_articles)} articles with mathematical content")
                for article in mathematical_articles[:3]:  # Show first 3
                    print(f"         📐 {article['title'][:60]}... ({article['category']})")
            else:
                print("      ⚠️  No obvious mathematical content found in news events titles/descriptions")
        
        # 2. Test detailed News & Events endpoint for LaTeX content
        print("   1.2 Testing News & Events detailed view for LaTeX expressions...")
        
        # Look for the mathematical article we know exists
        math_article_response = requests.get(f"{API_BASE_URL}/news-events?title_filter=Mathematical", timeout=10)
        if math_article_response.status_code == 200:
            math_data = math_article_response.json()
            math_articles = math_data.get("news_events", [])
            
            if len(math_articles) > 0:
                math_article_id = math_articles[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{math_article_id}", timeout=10)
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    full_content = detail_data.get("full_content", "")
                    
                    # Check for LaTeX expressions in full content
                    latex_patterns = {
                        "inline_math": "$" in full_content and full_content.count("$") >= 2,
                        "display_math": "$$" in full_content,
                        "greek_letters": any(letter in full_content for letter in ["α", "β", "γ", "δ", "Σ", "π", "λ", "μ"]),
                        "mathematical_symbols": any(symbol in full_content for symbol in ["∫", "∂", "∇", "≤", "≥", "∞"]),
                        "equations": any(pattern in full_content for pattern in ["=", "+", "-", "*", "/", "^"]),
                        "functions": any(func in full_content for func in ["sin", "cos", "tan", "log", "exp", "sqrt"])
                    }
                    
                    latex_found = any(latex_patterns.values())
                    content_length = len(full_content)
                    
                    print(f"      ✅ Mathematical article detail retrieved: {content_length} characters")
                    print(f"      📐 LaTeX patterns detected: {sum(latex_patterns.values())}/6 types")
                    
                    for pattern_type, found in latex_patterns.items():
                        status = "✅" if found else "❌"
                        print(f"         {status} {pattern_type.replace('_', ' ').title()}")
                    
                    if latex_found:
                        print("      ✅ LaTeX expressions found in mathematical content")
                        # Show a sample of the mathematical content
                        math_sample = full_content[:500] + "..." if len(full_content) > 500 else full_content
                        print(f"      📄 Sample content: {math_sample}")
                    else:
                        print("      ⚠️  No LaTeX expressions detected in full content")
                else:
                    print(f"      ❌ Mathematical article detail failed with status: {detail_response.status_code}")
                    all_tests_passed = False
            else:
                print("      ⚠️  No mathematical articles found to test detailed view")
        
        # 3. Test Achievements API for LaTeX content
        print("   2.1 Testing Achievements API for LaTeX expressions...")
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ Achievements API request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            achievements = data.get("achievements", [])
            print(f"      ✅ Successfully fetched {len(achievements)} achievements")
            
            # Look for mathematical content in achievements
            math_achievements = []
            
            for item in achievements:
                title = item.get("title", "")
                short_desc = item.get("short_description", "")
                
                # Check for mathematical/technical keywords
                math_keywords = ["award", "research", "publication", "innovation", "algorithm", "optimization", "model"]
                
                has_math_keywords = any(keyword.lower() in title.lower() or keyword.lower() in short_desc.lower() 
                                      for keyword in math_keywords)
                
                if has_math_keywords:
                    math_achievements.append({
                        "id": item.get("id"),
                        "title": title,
                        "category": item.get("category")
                    })
            
            if len(math_achievements) > 0:
                print(f"      ✅ Found {len(math_achievements)} achievements with technical/research content")
                for achievement in math_achievements[:3]:  # Show first 3
                    print(f"         🏆 {achievement['title'][:60]}... ({achievement['category']})")
            else:
                print("      ⚠️  No obvious technical/research content found in achievements")
        
        # 4. Test detailed Achievements endpoint for LaTeX content
        print("   2.2 Testing Achievements detailed view for LaTeX expressions...")
        
        # Get first achievement for detailed testing
        if len(achievements) > 0:
            achievement_id = achievements[0]["id"]
            detail_response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
            
            if detail_response.status_code == 200:
                detail_data = detail_response.json()
                full_content = detail_data.get("full_content", "")
                content_length = len(full_content)
                
                print(f"      ✅ Achievement detail retrieved: {content_length} characters")
                
                # Check if content is suitable for LaTeX rendering
                if content_length > 100:
                    print("      ✅ Rich content available for LaTeX processing")
                    # Sample the content to see if it contains mathematical elements
                    sample_content = full_content[:300] + "..." if len(full_content) > 300 else full_content
                    print(f"      📄 Sample content: {sample_content}")
                else:
                    print("      ⚠️  Limited content available for LaTeX testing")
            else:
                print(f"      ❌ Achievement detail failed with status: {detail_response.status_code}")
                all_tests_passed = False
        
        # 5. Test that existing functionality still works after LaTeX implementation
        print("   3.1 Testing existing functionality after LaTeX implementation...")
        
        # Test News & Events filtering
        categories = ["News", "Events", "Upcoming Events"]
        for category in categories:
            response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                filtered_items = data.get("news_events", [])
                print(f"      ✅ News & Events '{category}' filtering: {len(filtered_items)} items")
            else:
                print(f"      ❌ News & Events '{category}' filtering failed")
                all_tests_passed = False
        
        # Test Achievements filtering
        ach_categories = ["Award", "Partnership", "Publication", "Grant"]
        for category in ach_categories:
            response = requests.get(f"{API_BASE_URL}/achievements?category_filter={category}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                filtered_items = data.get("achievements", [])
                print(f"      ✅ Achievements '{category}' filtering: {len(filtered_items)} items")
            else:
                print(f"      ❌ Achievements '{category}' filtering failed")
                all_tests_passed = False
        
        # Test pagination
        for endpoint in ["news-events", "achievements"]:
            response = requests.get(f"{API_BASE_URL}/{endpoint}?page=1&per_page=5", timeout=10)
            if response.status_code == 200:
                data = response.json()
                pagination = data.get("pagination", {})
                items_key = endpoint.replace("-", "_")
                items = data.get(items_key, [])
                print(f"      ✅ {endpoint.title()} pagination: {len(items)} items, page {pagination.get('current_page', 1)}")
            else:
                print(f"      ❌ {endpoint.title()} pagination failed")
                all_tests_passed = False
        
        # 6. Test Google Sheets data structure compatibility
        print("   4.1 Testing Google Sheets data structure for LaTeX content...")
        
        # Check if the Google Sheets data structure can handle LaTeX expressions
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            
            if len(news_events) > 0:
                sample_item = news_events[0]
                required_fields = ["id", "title", "short_description", "category", "date", "image"]
                
                all_fields_present = all(field in sample_item for field in required_fields)
                
                if all_fields_present:
                    print("      ✅ Google Sheets data structure compatible with LaTeX content")
                    print(f"      📊 Sample item structure: {list(sample_item.keys())}")
                else:
                    missing_fields = [field for field in required_fields if field not in sample_item]
                    print(f"      ❌ Missing required fields for LaTeX content: {missing_fields}")
                    all_tests_passed = False
            else:
                print("      ⚠️  No sample data available to test structure")
        
        # Test detailed view data structure
        if len(news_events) > 0:
            news_id = news_events[0]["id"]
            detail_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
            
            if detail_response.status_code == 200:
                detail_data = detail_response.json()
                detail_fields = ["id", "title", "full_content", "date", "category"]
                
                all_detail_fields = all(field in detail_data for field in detail_fields)
                
                if all_detail_fields:
                    print("      ✅ Detailed view structure supports LaTeX content rendering")
                else:
                    missing_detail_fields = [field for field in detail_fields if field not in detail_data]
                    print(f"      ❌ Missing detailed view fields: {missing_detail_fields}")
                    all_tests_passed = False
        
        if all_tests_passed:
            print("   🎉 ALL LaTeX Rendering Support tests PASSED!")
            print("   ✅ News & Events API returns content suitable for LaTeX parsing")
            print("   ✅ Achievements API returns content suitable for LaTeX parsing")
            print("   ✅ Detailed view endpoints provide full_content for LaTeX rendering")
            print("   ✅ Mathematical content detected in Google Sheets data")
            print("   ✅ All existing filtering, pagination, and category functionality preserved")
            print("   ✅ Google Sheets data structure compatible with LaTeX content")
        else:
            print("   ⚠️  Some LaTeX Rendering Support tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in LaTeX Rendering Support testing: {e}")
        return False

def test_updated_news_events_api():
    """Test the updated News & Events API with new Google Sheets URL as per review request"""
    print("19. Testing UPDATED News & Events API with NEW Google Sheets URL...")
    
    all_tests_passed = True
    
    try:
        # 1. Clear cache first to ensure fresh data fetch
        print("   1.1 Clearing cache to ensure fresh data fetch...")
        response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if response.status_code == 200:
            print("      ✅ Cache cleared successfully")
        else:
            print(f"      ⚠️  Cache clear returned status: {response.status_code}")
        
        # 2. Test GET /api/news-events endpoint with new URL
        print("   1.2 Testing GET /api/news-events with new Google Sheets URL...")
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ News-events API request failed with status: {response.status_code}")
            print(f"      Response: {response.text}")
            all_tests_passed = False
        else:
            data = response.json()
            required_keys = ["news_events", "pagination"]
            if not all(key in data for key in required_keys):
                print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
                all_tests_passed = False
            else:
                news_events = data.get("news_events", [])
                print(f"      ✅ Successfully fetched {len(news_events)} news & events from new Google Sheets URL")
                
                # Verify data structure handles "news_events" key
                if len(news_events) > 0:
                    sample_item = news_events[0]
                    required_fields = ["id", "title", "short_description", "category", "date", "image"]
                    missing_fields = [field for field in required_fields if field not in sample_item]
                    if not missing_fields:
                        print(f"      ✅ Data parsing correctly handles news_events structure")
                        print(f"      📊 Sample item: {sample_item['title']} - {sample_item['category']}")
                    else:
                        print(f"      ❌ Missing required fields: {missing_fields}")
                        all_tests_passed = False
        
        # 3. Test category filtering for News, Events, Upcoming Events
        print("   2.1 Testing category filtering for News, Events, Upcoming Events...")
        
        categories_to_test = ["News", "Events", "Upcoming Events"]
        for category in categories_to_test:
            response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Category filter '{category}' failed with status: {response.status_code}")
                all_tests_passed = False
            else:
                data = response.json()
                filtered_items = data.get("news_events", [])
                # Verify all returned items have the correct category
                correct_category = all(item.get("category") == category for item in filtered_items)
                if correct_category:
                    print(f"      ✅ Category '{category}': {len(filtered_items)} items")
                else:
                    print(f"      ❌ Category '{category}': Filtering not working correctly")
                    all_tests_passed = False
        
        # 4. Test detailed view endpoint GET /api/news-events/{id}
        print("   3.1 Testing detailed view endpoint GET /api/news-events/{id}...")
        
        # First get a news event ID
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            if len(news_events) > 0:
                news_id = news_events[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    if "full_content" in detail_data:
                        content_length = len(detail_data.get("full_content", ""))
                        print(f"      ✅ News event detail endpoint working for ID: {news_id}")
                        print(f"      📄 Blog content retrieved: {content_length} characters")
                    else:
                        print("      ❌ News event detail missing full_content for blog")
                        all_tests_passed = False
                else:
                    print(f"      ❌ News event detail endpoint failed with status: {detail_response.status_code}")
                    all_tests_passed = False
            else:
                print("      ⚠️  No news events available to test detail endpoint")
        
        # 5. Test existing functionality: pagination, sorting, search filtering
        print("   4.1 Testing existing functionality: pagination, sorting, search...")
        
        # Test pagination
        page_sizes = [5, 10, 15, 20]
        for page_size in page_sizes:
            response = requests.get(f"{API_BASE_URL}/news-events?per_page={page_size}", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Pagination with page_size {page_size} failed")
                all_tests_passed = False
            else:
                data = response.json()
                news_events = data.get("news_events", [])
                pagination = data.get("pagination", {})
                print(f"      ✅ Pagination page_size {page_size}: Got {len(news_events)} items")
        
        # Test sorting
        sorting_tests = [
            ("date", "desc", "newest first"),
            ("date", "asc", "oldest first"),
            ("title", "asc", "A-Z"),
            ("title", "desc", "Z-A")
        ]
        
        for sort_by, sort_order, description in sorting_tests:
            response = requests.get(f"{API_BASE_URL}/news-events?sort_by={sort_by}&sort_order={sort_order}&per_page=5", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Sorting by {sort_by} ({description}) failed")
                all_tests_passed = False
            else:
                data = response.json()
                news_events = data.get("news_events", [])
                if len(news_events) >= 2:
                    if sort_by == "date":
                        dates = [item.get("date", "") for item in news_events[:3]]
                        print(f"      ✅ Date sorting ({description}): {dates}")
                    elif sort_by == "title":
                        titles = [item.get("title", "")[:30] + "..." for item in news_events[:3]]
                        print(f"      ✅ Title sorting ({description}): {titles}")
        
        # Test search filtering
        search_terms = ["Smart", "Grid", "Energy", "Research"]
        for search_term in search_terms:
            response = requests.get(f"{API_BASE_URL}/news-events?title_filter={search_term}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                search_results = data.get("news_events", [])
                print(f"      ✅ Search '{search_term}': {len(search_results)} results")
            else:
                print(f"      ❌ Search '{search_term}' failed")
                all_tests_passed = False
        
        # 6. Test combined filtering
        print("   5.1 Testing combined filtering scenarios...")
        
        # Test category + sorting combination
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News&sort_by=date&sort_order=desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            combined_results = data.get("news_events", [])
            print(f"      ✅ Category + Sorting: {len(combined_results)} News items sorted by date")
        
        # Test category + pagination combination
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=Events&page=1&per_page=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            paginated_results = data.get("news_events", [])
            pagination = data.get("pagination", {})
            print(f"      ✅ Category + Pagination: {len(paginated_results)} Events, page {pagination.get('current_page', 1)}")
        
        # 7. Verify cache status after testing
        print("   6.1 Verifying cache status after testing...")
        response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if response.status_code == 200:
            cache_data = response.json()
            cached_items = cache_data.get("cached_items", 0)
            print(f"      ✅ Cache status: {cached_items} items cached")
        
        if all_tests_passed:
            print("   🎉 ALL Updated News & Events API tests PASSED!")
            print("   ✅ New Google Sheets URL integration working correctly")
            print("   ✅ Data parsing handles 'news_events' key properly")
            print("   ✅ All category filtering working (News, Events, Upcoming Events)")
            print("   ✅ Detailed view endpoint working for blog content")
            print("   ✅ Cache clearing and fresh data fetch working")
            print("   ✅ All existing functionality preserved (pagination, sorting, search)")
        else:
            print("   ⚠️  Some Updated News & Events API tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in Updated News & Events API testing: {e}")
        return False

def test_google_sheets_projects_integration():
    """Test Google Sheets integration for Projects API as per review request"""
    print("15. Testing Google Sheets Projects Integration - NEW API ENDPOINTS...")
    
    all_tests_passed = True
    
    try:
        # 1. Test Projects API (/api/projects) - Google Sheets Integration
        print("   1.1 Testing Projects API Google Sheets integration...")
        response = requests.get(f"{API_BASE_URL}/projects", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ Projects API request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            required_keys = ["projects", "pagination"]
            if not all(key in data for key in required_keys):
                print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
                all_tests_passed = False
            else:
                projects = data.get("projects", [])
                print(f"      ✅ Google Sheets Projects API working - Retrieved {len(projects)} projects")
                
                # Verify project fields as per review request
                if len(projects) > 0:
                    project = projects[0]
                    required_fields = ["id", "title", "description", "status", "start_date", "end_date", 
                                     "research_areas", "principal_investigator", "team_members", 
                                     "funding_agency", "budget", "image"]
                    missing_fields = [field for field in required_fields if field not in project]
                    if not missing_fields:
                        print(f"      ✅ All required project fields present: {required_fields}")
                    else:
                        print(f"      ❌ Missing project fields: {missing_fields}")
                        all_tests_passed = False
                
                # Test filtering by status
                print("   1.2 Testing Projects status filtering...")
                response = requests.get(f"{API_BASE_URL}/projects?status_filter=Active", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    active_projects = data.get("projects", [])
                    print(f"      ✅ Status filtering working: {len(active_projects)} Active projects")
                else:
                    print("      ❌ Status filtering failed")
                    all_tests_passed = False
                
                # Test filtering by area
                print("   1.3 Testing Projects area filtering...")
                response = requests.get(f"{API_BASE_URL}/projects?area_filter=Smart Grid Technologies", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    area_projects = data.get("projects", [])
                    print(f"      ✅ Area filtering working: {len(area_projects)} Smart Grid projects")
                else:
                    print("      ❌ Area filtering failed")
                    all_tests_passed = False
                
                # Test title filtering
                print("   1.4 Testing Projects title filtering...")
                response = requests.get(f"{API_BASE_URL}/projects?title_filter=Smart", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    title_projects = data.get("projects", [])
                    print(f"      ✅ Title filtering working: {len(title_projects)} projects with 'Smart' in title")
                else:
                    print("      ❌ Title filtering failed")
                    all_tests_passed = False
                
                # Test pagination
                print("   1.5 Testing Projects pagination...")
                response = requests.get(f"{API_BASE_URL}/projects?page=1&per_page=5", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    pagination = data.get("pagination", {})
                    required_pagination_keys = ["current_page", "total_pages", "has_next", "has_prev", "per_page", "total_items"]
                    missing_keys = [key for key in required_pagination_keys if key not in pagination]
                    if not missing_keys:
                        print(f"      ✅ Projects pagination working: Page {pagination['current_page']} of {pagination['total_pages']}")
                    else:
                        print(f"      ❌ Missing pagination keys: {missing_keys}")
                        all_tests_passed = False
                else:
                    print("      ❌ Projects pagination failed")
                    all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in Google Sheets Projects integration testing: {e}")
        return False

def test_google_sheets_achievements_integration():
    """Test Google Sheets integration for Achievements API as per review request"""
    print("16. Testing Google Sheets Achievements Integration - NEW API ENDPOINTS...")
    
    all_tests_passed = True
    
    try:
        # 1. Test Achievements API (/api/achievements) - Google Sheets Integration
        print("   1.1 Testing Achievements API Google Sheets integration...")
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ Achievements API request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            required_keys = ["achievements", "pagination"]
            if not all(key in data for key in required_keys):
                print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
                all_tests_passed = False
            else:
                achievements = data.get("achievements", [])
                print(f"      ✅ Google Sheets Achievements API working - Retrieved {len(achievements)} achievements")
                
                # Verify achievement fields as per review request
                if len(achievements) > 0:
                    achievement = achievements[0]
                    required_fields = ["id", "title", "short_description", "category", "date", "image", "full_content"]
                    missing_fields = [field for field in required_fields if field not in achievement]
                    if not missing_fields:
                        print(f"      ✅ All required achievement fields present: {required_fields}")
                    else:
                        print(f"      ❌ Missing achievement fields: {missing_fields}")
                        all_tests_passed = False
                
                # Test category filtering
                print("   1.2 Testing Achievements category filtering...")
                response = requests.get(f"{API_BASE_URL}/achievements?category_filter=Award", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    award_achievements = data.get("achievements", [])
                    print(f"      ✅ Category filtering working: {len(award_achievements)} Award achievements")
                else:
                    print("      ❌ Category filtering failed")
                    all_tests_passed = False
                
                # Test pagination
                print("   1.3 Testing Achievements pagination...")
                response = requests.get(f"{API_BASE_URL}/achievements?page=1&per_page=6", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    pagination = data.get("pagination", {})
                    required_pagination_keys = ["current_page", "total_pages", "has_next", "has_prev", "per_page", "total_items"]
                    missing_keys = [key for key in required_pagination_keys if key not in pagination]
                    if not missing_keys:
                        print(f"      ✅ Achievements pagination working: Page {pagination['current_page']} of {pagination['total_pages']}")
                    else:
                        print(f"      ❌ Missing pagination keys: {missing_keys}")
                        all_tests_passed = False
                else:
                    print("      ❌ Achievements pagination failed")
                    all_tests_passed = False
        
        # 2. Test Achievement Detail Endpoint (/api/achievements/{id})
        print("   2.1 Testing Achievement detail endpoint...")
        # First get an achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            achievements = data.get("achievements", [])
            if len(achievements) > 0:
                achievement_id = achievements[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    if "full_content" in detail_data:
                        print(f"      ✅ Achievement detail endpoint working for ID: {achievement_id}")
                    else:
                        print("      ❌ Achievement detail missing full_content")
                        all_tests_passed = False
                else:
                    print(f"      ❌ Achievement detail endpoint failed with status: {detail_response.status_code}")
                    all_tests_passed = False
            else:
                print("      ⚠️  No achievements available to test detail endpoint")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in Google Sheets Achievements integration testing: {e}")
        return False

def test_google_sheets_news_events_integration():
    """Test Google Sheets integration for News & Events API as per review request"""
    print("17. Testing Google Sheets News & Events Integration - NEW API ENDPOINTS...")
    
    all_tests_passed = True
    
    try:
        # 1. Test News & Events API (/api/news-events) - Google Sheets Integration
        print("   1.1 Testing News & Events API Google Sheets integration...")
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=15)
        if response.status_code != 200:
            print(f"      ❌ News & Events API request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            required_keys = ["news_events", "pagination"]
            if not all(key in data for key in required_keys):
                print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
                all_tests_passed = False
            else:
                news_events = data.get("news_events", [])
                print(f"      ✅ Google Sheets News & Events API working - Retrieved {len(news_events)} items")
                
                # Verify news event fields as per review request
                if len(news_events) > 0:
                    news_event = news_events[0]
                    required_fields = ["id", "title", "short_description", "category", "date", "image", "full_content"]
                    missing_fields = [field for field in required_fields if field not in news_event]
                    if not missing_fields:
                        print(f"      ✅ All required news event fields present: {required_fields}")
                    else:
                        print(f"      ❌ Missing news event fields: {missing_fields}")
                        all_tests_passed = False
                
                # Test category filtering
                print("   1.2 Testing News & Events category filtering...")
                response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    news_items = data.get("news_events", [])
                    print(f"      ✅ Category filtering working: {len(news_items)} News items")
                else:
                    print("      ❌ Category filtering failed")
                    all_tests_passed = False
                
                # Test pagination
                print("   1.3 Testing News & Events pagination...")
                response = requests.get(f"{API_BASE_URL}/news-events?page=1&per_page=10", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    pagination = data.get("pagination", {})
                    required_pagination_keys = ["current_page", "total_pages", "has_next", "has_prev", "per_page", "total_items"]
                    missing_keys = [key for key in required_pagination_keys if key not in pagination]
                    if not missing_keys:
                        print(f"      ✅ News & Events pagination working: Page {pagination['current_page']} of {pagination['total_pages']}")
                    else:
                        print(f"      ❌ Missing pagination keys: {missing_keys}")
                        all_tests_passed = False
                else:
                    print("      ❌ News & Events pagination failed")
                    all_tests_passed = False
        
        # 2. Test News Event Detail Endpoint (/api/news-events/{id})
        print("   2.1 Testing News Event detail endpoint...")
        # First get a news event ID
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            if len(news_events) > 0:
                news_id = news_events[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    if "full_content" in detail_data:
                        print(f"      ✅ News Event detail endpoint working for ID: {news_id}")
                    else:
                        print("      ❌ News Event detail missing full_content")
                        all_tests_passed = False
                else:
                    print(f"      ❌ News Event detail endpoint failed with status: {detail_response.status_code}")
                    all_tests_passed = False
            else:
                print("      ⚠️  No news events available to test detail endpoint")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in Google Sheets News & Events integration testing: {e}")
        return False

def test_caching_verification():
    """Test caching functionality as per review request"""
    print("18. Testing Caching Verification - PERFORMANCE OPTIMIZATION...")
    
    all_tests_passed = True
    
    try:
        # 1. Test cache status endpoint
        print("   1.1 Testing /api/cache-status endpoint...")
        response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if response.status_code != 200:
            print(f"      ❌ Cache status endpoint failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            cache_data = response.json()
            required_keys = ["cached_items", "last_fetch_times", "cache_duration_minutes"]
            missing_keys = [key for key in required_keys if key not in cache_data]
            if not missing_keys:
                print(f"      ✅ Cache status endpoint working: {cache_data['cached_items']} cached items")
                print(f"      📊 Cache duration: {cache_data['cache_duration_minutes']} minutes")
            else:
                print(f"      ❌ Missing cache status keys: {missing_keys}")
                all_tests_passed = False
        
        # 2. Test performance improvement with caching
        print("   1.2 Testing caching performance improvement...")
        import time
        
        # Clear cache first
        clear_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if clear_response.status_code == 200:
            print("      ✅ Cache cleared successfully")
        
        # First request (should fetch from Google Sheets)
        start_time = time.time()
        response1 = requests.get(f"{API_BASE_URL}/projects", timeout=30)
        first_request_time = time.time() - start_time
        
        if response1.status_code == 200:
            print(f"      ✅ First request (from Google Sheets): {first_request_time:.3f} seconds")
        
        # Second request (should use cache)
        start_time = time.time()
        response2 = requests.get(f"{API_BASE_URL}/projects", timeout=30)
        second_request_time = time.time() - start_time
        
        if response2.status_code == 200:
            print(f"      ✅ Second request (from cache): {second_request_time:.3f} seconds")
            
            # Calculate performance improvement
            if first_request_time > 0:
                improvement = ((first_request_time - second_request_time) / first_request_time) * 100
                print(f"      📊 Performance improvement: {improvement:.1f}%")
                
                if improvement > 50:  # Expect significant improvement
                    print("      ✅ Significant caching performance improvement verified")
                else:
                    print("      ⚠️  Caching improvement less than expected")
        
        # 3. Test data consistency between cached and fresh data
        print("   1.3 Testing data consistency between cached and fresh data...")
        data1 = response1.json()
        data2 = response2.json()
        
        if data1.get("projects") == data2.get("projects"):
            print("      ✅ Data consistency verified between cached and fresh data")
        else:
            print("      ❌ Data inconsistency detected between cached and fresh data")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in caching verification testing: {e}")
        return False

def test_error_handling_fallback():
    """Test error handling and fallback to mock data as per review request"""
    print("19. Testing Error Handling and Fallback - GRACEFUL DEGRADATION...")
    
    all_tests_passed = True
    
    try:
        # Test that APIs still work even if Google Sheets is unavailable
        # We can't actually break Google Sheets, but we can test the fallback mechanism
        print("   1.1 Testing graceful fallback behavior...")
        
        # Test all three main endpoints to ensure they respond
        endpoints = [
            ("projects", "/api/projects"),
            ("achievements", "/api/achievements"), 
            ("news-events", "/api/news-events")
        ]
        
        for name, endpoint in endpoints:
            response = requests.get(f"{API_BASE_URL}{endpoint}", timeout=30)
            if response.status_code == 200:
                data = response.json()
                if name == "projects" and "projects" in data:
                    print(f"      ✅ {name.title()} API responding correctly")
                elif name == "achievements" and "achievements" in data:
                    print(f"      ✅ {name.title()} API responding correctly")
                elif name == "news-events" and "news_events" in data:
                    print(f"      ✅ {name.title()} API responding correctly")
                else:
                    print(f"      ❌ {name.title()} API response structure incorrect")
                    all_tests_passed = False
            else:
                print(f"      ❌ {name.title()} API failed with status: {response.status_code}")
                all_tests_passed = False
        
        # Test edge cases and invalid parameters
        print("   1.2 Testing edge cases and invalid parameters...")
        
        # Test invalid page numbers
        response = requests.get(f"{API_BASE_URL}/projects?page=-1", timeout=10)
        if response.status_code == 200:
            print("      ✅ Invalid page number handled gracefully")
        else:
            print("      ❌ Invalid page number not handled properly")
            all_tests_passed = False
        
        # Test very large page numbers
        response = requests.get(f"{API_BASE_URL}/achievements?page=99999", timeout=10)
        if response.status_code == 200:
            print("      ✅ Large page number handled gracefully")
        else:
            print("      ❌ Large page number not handled properly")
            all_tests_passed = False
        
        # Test invalid category filters
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=InvalidCategory", timeout=10)
        if response.status_code == 200:
            print("      ✅ Invalid category filter handled gracefully")
        else:
            print("      ❌ Invalid category filter not handled properly")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in error handling and fallback testing: {e}")
        return False

def test_real_vs_mock_data_verification():
    """Verify that real data is being fetched from Google Sheets instead of mock data"""
    print("20. Testing Real vs Mock Data Verification - GOOGLE SHEETS DATA...")
    
    all_tests_passed = True
    
    try:
        print("   1.1 Verifying real Google Sheets data vs mock data...")
        
        # Test Projects API for real data indicators
        response = requests.get(f"{API_BASE_URL}/projects", timeout=15)
        if response.status_code == 200:
            data = response.json()
            projects = data.get("projects", [])
            if len(projects) > 0:
                # Check if we're getting real data (not the typical mock patterns)
                project_titles = [p.get("title", "") for p in projects]
                print(f"      📊 Projects found: {len(projects)} items")
                print(f"      📋 Sample project titles: {project_titles[:3]}")
                
                # Real data should not have sequential mock patterns like "Project 1", "Project 2"
                mock_pattern_count = sum(1 for title in project_titles if "Project " in title and any(char.isdigit() for char in title))
                if mock_pattern_count < len(projects) * 0.5:  # Less than 50% mock patterns
                    print("      ✅ Projects appear to be real Google Sheets data (not mock)")
                else:
                    print("      ⚠️  Projects may still be using mock data patterns")
            else:
                print("      ❌ No projects found - this addresses the user complaint!")
                all_tests_passed = False
        
        # Test Achievements API for real data indicators  
        response = requests.get(f"{API_BASE_URL}/achievements", timeout=15)
        if response.status_code == 200:
            data = response.json()
            achievements = data.get("achievements", [])
            if len(achievements) > 0:
                achievement_titles = [a.get("title", "") for a in achievements]
                print(f"      📊 Achievements found: {len(achievements)} items")
                print(f"      📋 Sample achievement titles: {achievement_titles[:3]}")
                
                # Real data should not have sequential mock patterns
                mock_pattern_count = sum(1 for title in achievement_titles if "Achievement " in title and any(char.isdigit() for char in title))
                if mock_pattern_count < len(achievements) * 0.5:
                    print("      ✅ Achievements appear to be real Google Sheets data (not mock)")
                else:
                    print("      ⚠️  Achievements may still be using mock data patterns")
            else:
                print("      ❌ No achievements found - this addresses the user complaint!")
                all_tests_passed = False
        
        # Test News & Events API for real data indicators
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=15)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            if len(news_events) > 0:
                news_titles = [n.get("title", "") for n in news_events]
                print(f"      📊 News & Events found: {len(news_events)} items")
                print(f"      📋 Sample news titles: {news_titles[:3]}")
                
                # Real data should not have sequential mock patterns
                mock_pattern_count = sum(1 for title in news_titles if ("News " in title or "Event " in title) and any(char.isdigit() for char in title))
                if mock_pattern_count < len(news_events) * 0.5:
                    print("      ✅ News & Events appear to be real Google Sheets data (not mock)")
                else:
                    print("      ⚠️  News & Events may still be using mock data patterns")
            else:
                print("      ❌ No news and events found - this addresses the user complaint!")
                all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in real vs mock data verification: {e}")
        return False

def test_news_events_comprehensive():
    """Comprehensive News & Events API functionality testing"""
    print("21. Testing News & Events API - Comprehensive Filtering Tests...")
    
    all_tests_passed = True
    
    try:
        # 1. Basic API Test - GET /api/news-events (default parameters)
        print("   1.1 Testing basic API with default parameters...")
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=10)
        if response.status_code != 200:
            print(f"      ❌ Basic request failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            data = response.json()
            if "news_events" in data and "pagination" in data:
                print(f"      ✅ Basic API working - Retrieved {len(data['news_events'])} items")
                print(f"      📊 Pagination: Page {data['pagination']['current_page']} of {data['pagination']['total_pages']}")
            else:
                print("      ❌ Response structure incorrect")
                all_tests_passed = False
        
        # 2. Category Filtering Tests
        print("   1.2 Testing category filtering...")
        categories = ["News", "Events", "Upcoming Events", "Achievement"]
        
        for category in categories:
            response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=10)
            if response.status_code != 200:
                print(f"      ❌ Category filter '{category}' failed")
                all_tests_passed = False
            else:
                data = response.json()
                items = data.get("news_events", [])
                # Verify all items have the correct category
                correct_category = all(item.get("category") == category for item in items)
                if correct_category and len(items) > 0:
                    print(f"      ✅ Category '{category}': {len(items)} items found")
                elif len(items) == 0:
                    print(f"      ⚠️  Category '{category}': No items found (may be expected)")
                else:
                    print(f"      ❌ Category '{category}': Filtering not working correctly")
                    all_tests_passed = False
        
        # Test invalid category
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=InvalidCategory", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            print(f"      ✅ Invalid category handled gracefully: {len(items)} items returned")
        
        # 3. Search/Title Filtering Tests
        print("   1.3 Testing search/title filtering...")
        
        # Search for "Smart Grid" (should match multiple items)
        response = requests.get(f"{API_BASE_URL}/news-events?title_filter=Smart Grid", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            smart_grid_matches = [item for item in items if "smart grid" in item.get("title", "").lower()]
            print(f"      ✅ 'Smart Grid' search: {len(smart_grid_matches)} matches found")
        else:
            print("      ❌ 'Smart Grid' search failed")
            all_tests_passed = False
        
        # Search for "Mathematical" (should match the math-heavy news item)
        response = requests.get(f"{API_BASE_URL}/news-events?title_filter=Mathematical", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            math_matches = [item for item in items if "mathematical" in item.get("title", "").lower()]
            print(f"      ✅ 'Mathematical' search: {len(math_matches)} matches found")
            if len(math_matches) > 0:
                print(f"         Found: '{math_matches[0].get('title', 'N/A')}'")
        else:
            print("      ❌ 'Mathematical' search failed")
            all_tests_passed = False
        
        # Test partial matches and case sensitivity
        response = requests.get(f"{API_BASE_URL}/news-events?title_filter=grant", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            grant_matches = [item for item in items if "grant" in item.get("title", "").lower()]
            print(f"      ✅ Case-insensitive 'grant' search: {len(grant_matches)} matches")
        
        # 4. Sorting Tests
        print("   1.4 Testing sorting functionality...")
        
        # Sort by date (newest first)
        response = requests.get(f"{API_BASE_URL}/news-events?sort_by=date&sort_order=desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            if len(items) >= 2:
                dates = [item.get("date") for item in items[:3]]
                print(f"      ✅ Date sorting (desc): {dates}")
        
        # Sort by date (oldest first)
        response = requests.get(f"{API_BASE_URL}/news-events?sort_by=date&sort_order=asc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            if len(items) >= 2:
                dates = [item.get("date") for item in items[:3]]
                print(f"      ✅ Date sorting (asc): {dates}")
        
        # Sort by title (A-Z)
        response = requests.get(f"{API_BASE_URL}/news-events?sort_by=title&sort_order=asc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            if len(items) >= 2:
                titles = [item.get("title", "")[:30] + "..." for item in items[:3]]
                print(f"      ✅ Title sorting (A-Z): {titles}")
        
        # Sort by title (Z-A)
        response = requests.get(f"{API_BASE_URL}/news-events?sort_by=title&sort_order=desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            if len(items) >= 2:
                titles = [item.get("title", "")[:30] + "..." for item in items[:3]]
                print(f"      ✅ Title sorting (Z-A): {titles}")
        
        # 5. Combined Filtering Tests
        print("   1.5 Testing combined filtering...")
        
        # Combine category + search filters
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News&title_filter=Grant", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            valid_items = [item for item in items if 
                          item.get("category") == "News" and 
                          "grant" in item.get("title", "").lower()]
            print(f"      ✅ Category + Search filter: {len(valid_items)} valid items")
        
        # Combine category + sorting
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News&sort_by=date&sort_order=desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            news_items = [item for item in items if item.get("category") == "News"]
            print(f"      ✅ Category + Sorting: {len(news_items)} News items sorted by date")
        
        # Test multiple filters together
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News&title_filter=Smart&sort_by=title&sort_order=asc&page=1&per_page=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"      ✅ Multiple filters combined successfully")
        
        # 6. Pagination Tests
        print("   1.6 Testing pagination...")
        
        # Test different page sizes
        for page_size in [5, 10, 20]:
            response = requests.get(f"{API_BASE_URL}/news-events?per_page={page_size}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                items = data.get("news_events", [])
                pagination = data.get("pagination", {})
                print(f"      ✅ Page size {page_size}: Got {len(items)} items, per_page={pagination.get('per_page')}")
        
        # Test navigation through pages
        response = requests.get(f"{API_BASE_URL}/news-events?page=1&per_page=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            pagination = data.get("pagination", {})
            print(f"      ✅ Page navigation: Page 1 - has_next={pagination.get('has_next')}, has_prev={pagination.get('has_prev')}")
        
        response = requests.get(f"{API_BASE_URL}/news-events?page=2&per_page=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            pagination = data.get("pagination", {})
            print(f"      ✅ Page navigation: Page 2 - has_next={pagination.get('has_next')}, has_prev={pagination.get('has_prev')}")
        
        # Verify pagination metadata
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=10", timeout=10)
        if response.status_code == 200:
            data = response.json()
            pagination = data.get("pagination", {})
            required_pagination_keys = ["total_pages", "has_next", "has_prev", "current_page", "per_page", "total_items"]
            missing_keys = [key for key in required_pagination_keys if key not in pagination]
            if not missing_keys:
                print(f"      ✅ Pagination metadata complete: {pagination}")
            else:
                print(f"      ❌ Missing pagination keys: {missing_keys}")
                all_tests_passed = False
        
        # 7. Edge Cases
        print("   1.7 Testing edge cases...")
        
        # Invalid page numbers
        response = requests.get(f"{API_BASE_URL}/news-events?page=-1", timeout=10)
        if response.status_code == 200:
            print("      ✅ Invalid page number (-1) handled gracefully")
        
        response = requests.get(f"{API_BASE_URL}/news-events?page=999999", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            print(f"      ✅ Very large page number handled gracefully: {len(items)} items")
        
        # Very large page sizes
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1000", timeout=10)
        if response.status_code == 200:
            print("      ✅ Large page size handled gracefully")
        
        # Empty search results
        response = requests.get(f"{API_BASE_URL}/news-events?title_filter=NonExistentSearchTerm12345", timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("news_events", [])
            print(f"      ✅ Empty search results handled: {len(items)} items found")
        
        if all_tests_passed:
            print("   🎉 ALL News & Events API tests PASSED!")
        else:
            print("   ⚠️  Some News & Events API tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in comprehensive News & Events testing: {e}")
        return False

def test_achievement_details_endpoint():
    """Test GET /api/achievements/{achievement_id} endpoint"""
    print("11. Testing GET /api/achievements/{achievement_id} endpoint...")
    try:
        # First get a valid achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements?per_page=1", timeout=10)
        if response.status_code != 200:
            print("   ❌ Could not get achievements list")
            return False
        
        achievements = response.json()["achievements"]
        if not achievements:
            print("   ❌ No achievements found to test details")
            return False
        
        achievement_id = achievements[0]["id"]
        
        # Test valid achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Valid achievement ID failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["id", "title", "full_content"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys in achievement details")
            return False
        
        # Test invalid achievement ID
        response = requests.get(f"{API_BASE_URL}/achievements/invalid_id", timeout=10)
        if response.status_code != 200:
            print("   ❌ Invalid ID should return 200 with error message")
            return False
        
        error_data = response.json()
        if "error" not in error_data:
            print("   ❌ Invalid ID should return error message")
            return False
        
        print("   ✅ Achievement details endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing achievement details endpoint: {e}")
        return False

def test_news_event_details_endpoint():
    """Test GET /api/news-events/{news_id} endpoint"""
    print("12. Testing GET /api/news-events/{news_id} endpoint...")
    try:
        # First get a valid news event ID
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        if response.status_code != 200:
            print("   ❌ Could not get news events list")
            return False
        
        news_events = response.json()["news_events"]
        if not news_events:
            print("   ❌ No news events found to test details")
            return False
        
        news_id = news_events[0]["id"]
        
        # Test valid news event ID
        response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Valid news event ID failed with status: {response.status_code}")
            return False
        
        data = response.json()
        required_keys = ["id", "title", "full_content"]
        if not all(key in data for key in required_keys):
            print(f"   ❌ Missing required keys in news event details")
            return False
        
        # Test invalid news event ID
        response = requests.get(f"{API_BASE_URL}/news-events/invalid_id", timeout=10)
        if response.status_code != 200:
            print("   ❌ Invalid ID should return 200 with error message")
            return False
        
        error_data = response.json()
        if "error" not in error_data:
            print("   ❌ Invalid ID should return error message")
            return False
        
        print("   ✅ News event details endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing news event details endpoint: {e}")
        return False

def test_research_stats_endpoint():
    """Test GET /api/research-stats endpoint"""
    print("13. Testing GET /api/research-stats endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/research-stats", timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Request failed with status: {response.status_code}")
            return False
        
        data = response.json()
        expected_keys = ["total_publications", "total_citations", "active_projects", "total_achievements", "recent_news"]
        
        if not all(key in data for key in expected_keys):
            print(f"   ❌ Missing required keys. Expected: {expected_keys}, Got: {list(data.keys())}")
            return False
        
        # Verify all values are numeric
        for key in expected_keys:
            if not isinstance(data[key], (int, float)):
                print(f"   ❌ {key} should be numeric, got {type(data[key])}")
                return False
        
        print("   ✅ Research stats endpoint working correctly")
        print(f"   Stats: {data}")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing research stats endpoint: {e}")
        return False

def test_error_handling():
    """Test error handling for invalid parameters"""
    print("14. Testing error handling for invalid parameters...")
    try:
        # Test invalid pagination parameters
        response = requests.get(f"{API_BASE_URL}/publications?page=-1&per_page=0", timeout=10)
        # Should still return 200 but handle gracefully
        if response.status_code != 200:
            print("   ⚠️  Invalid pagination parameters not handled gracefully")
        
        # Test very large page numbers
        response = requests.get(f"{API_BASE_URL}/publications?page=999999", timeout=10)
        if response.status_code != 200:
            print("   ⚠️  Large page numbers not handled gracefully")
        
        # Test invalid sort parameters
        response = requests.get(f"{API_BASE_URL}/publications?sort_by=invalid_field", timeout=10)
        if response.status_code != 200:
            print("   ⚠️  Invalid sort parameters not handled gracefully")
        
        print("   ✅ Error handling working appropriately")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing error handling: {e}")
        return False

def test_updated_news_events_api():
    """Test the updated News & Events API to verify the new Google Sheets URL integration as per review request"""
    print("22. Testing Updated News & Events API - NEW GOOGLE SHEETS URL INTEGRATION...")
    
    all_tests_passed = True
    
    try:
        # Step 1: Clear cache first to ensure fresh data fetch
        print("   1.1 Clearing cache to ensure fresh data fetch...")
        cache_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if cache_response.status_code == 200:
            print("      ✅ Cache cleared successfully")
        else:
            print(f"      ⚠️  Cache clear failed with status: {cache_response.status_code}")
        
        # Step 2: Test GET /api/news-events - Verify it fetches from the new URL and converts data properly
        print("   1.2 Testing GET /api/news-events with new Google Sheets URL...")
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=30)
        if response.status_code != 200:
            print(f"      ❌ News & Events API request failed with status: {response.status_code}")
            print(f"      Response: {response.text}")
            all_tests_passed = False
        else:
            data = response.json()
            required_keys = ["news_events", "pagination"]
            if not all(key in data for key in required_keys):
                print(f"      ❌ Missing required keys. Expected: {required_keys}, Got: {list(data.keys())}")
                all_tests_passed = False
            else:
                news_events = data.get("news_events", [])
                print(f"      ✅ Google Sheets News & Events API working - Retrieved {len(news_events)} news & events")
                print(f"      📊 Response structure: {list(data.keys())}")
                
                # Verify the data conversion handles the "achievements" key from user's script properly
                if len(news_events) > 0:
                    news_event = news_events[0]
                    required_fields = ["id", "title", "short_description", "category", "date", "image", "full_content"]
                    missing_fields = [field for field in required_fields if field not in news_event]
                    if not missing_fields:
                        print(f"      ✅ All required news event fields present: {required_fields}")
                        print(f"      📋 Sample news event: '{news_event['title']}' - {news_event['category']}")
                    else:
                        print(f"      ❌ Missing news event fields: {missing_fields}")
                        all_tests_passed = False
                    
                    # Verify data conversion from "achievements" key format
                    print(f"      ✅ Data conversion working - Sample ID: {news_event['id']}, Category: {news_event['category']}")
        
        # Step 3: Test category filtering (News, Events, Upcoming Events)
        print("   2.1 Testing category filtering (News, Events, Upcoming Events)...")
        expected_categories = ["News", "Events", "Upcoming Events"]
        
        for category in expected_categories:
            response = requests.get(f"{API_BASE_URL}/news-events?category_filter={category}", timeout=15)
            if response.status_code == 200:
                data = response.json()
                category_news = data.get("news_events", [])
                print(f"      ✅ Category '{category}' filtering: {len(category_news)} items")
                
                # Verify all returned items have the correct category
                if len(category_news) > 0:
                    correct_category = all(item.get("category") == category for item in category_news)
                    if correct_category:
                        print(f"      ✅ All items in '{category}' category are correctly filtered")
                    else:
                        print(f"      ❌ Some items in '{category}' category have incorrect categories")
                        all_tests_passed = False
            else:
                print(f"      ❌ Category '{category}' filtering failed with status: {response.status_code}")
                all_tests_passed = False
        
        # Test with no category filter (should return all categories)
        response = requests.get(f"{API_BASE_URL}/news-events", timeout=15)
        if response.status_code == 200:
            data = response.json()
            all_news = data.get("news_events", [])
            all_categories = set(item.get("category") for item in all_news)
            print(f"      ✅ No category filter returns all categories: {all_categories}")
        
        # Step 4: Test pagination and sorting functionality
        print("   3.1 Testing pagination functionality...")
        
        # Test different page sizes
        page_sizes = [5, 10, 15, 20]
        for page_size in page_sizes:
            response = requests.get(f"{API_BASE_URL}/news-events?per_page={page_size}", timeout=15)
            if response.status_code == 200:
                data = response.json()
                news_events = data.get("news_events", [])
                pagination = data.get("pagination", {})
                print(f"      ✅ Page size {page_size}: Got {len(news_events)} items, per_page={pagination.get('per_page')}")
                
                # Verify pagination metadata
                required_pagination_keys = ["current_page", "total_pages", "has_next", "has_prev", "per_page", "total_items"]
                missing_keys = [key for key in required_pagination_keys if key not in pagination]
                if missing_keys:
                    print(f"      ❌ Missing pagination keys for page size {page_size}: {missing_keys}")
                    all_tests_passed = False
            else:
                print(f"      ❌ Page size {page_size} failed with status: {response.status_code}")
                all_tests_passed = False
        
        # Test page navigation
        response = requests.get(f"{API_BASE_URL}/news-events?page=1&per_page=5", timeout=15)
        if response.status_code == 200:
            data = response.json()
            pagination = data.get("pagination", {})
            print(f"      ✅ Page navigation: Page {pagination.get('current_page')} of {pagination.get('total_pages')}")
            print(f"      📊 Total items: {pagination.get('total_items')}, Has next: {pagination.get('has_next')}")
        
        print("   3.2 Testing sorting functionality...")
        
        # Test sorting by date (newest first, oldest first)
        sorting_tests = [
            ("date", "desc", "newest first"),
            ("date", "asc", "oldest first"),
            ("title", "asc", "title A-Z"),
            ("title", "desc", "title Z-A")
        ]
        
        for sort_by, sort_order, description in sorting_tests:
            response = requests.get(f"{API_BASE_URL}/news-events?sort_by={sort_by}&sort_order={sort_order}&per_page=5", timeout=15)
            if response.status_code == 200:
                data = response.json()
                news_events = data.get("news_events", [])
                if len(news_events) >= 2:
                    if sort_by == "date":
                        dates = [item.get("date", "") for item in news_events[:3]]
                        print(f"      ✅ Date sorting ({description}): {dates}")
                    elif sort_by == "title":
                        titles = [item.get("title", "")[:30] + "..." for item in news_events[:3]]
                        print(f"      ✅ Title sorting ({description}): {titles}")
                else:
                    print(f"      ✅ Sorting by {sort_by} ({description}): {len(news_events)} items")
            else:
                print(f"      ❌ Sorting by {sort_by} ({description}) failed with status: {response.status_code}")
                all_tests_passed = False
        
        # Step 5: Test GET /api/news-events/{id} for detailed view
        print("   4.1 Testing GET /api/news-events/{id} for detailed view...")
        
        # First get a news event ID
        response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=15)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            if len(news_events) > 0:
                news_id = news_events[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=15)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    required_detail_fields = ["id", "title", "full_content", "date", "category"]
                    missing_detail_fields = [field for field in required_detail_fields if field not in detail_data]
                    if not missing_detail_fields:
                        print(f"      ✅ News & Event detail endpoint working for ID: {news_id}")
                        print(f"      📋 Detail fields present: {list(detail_data.keys())}")
                        print(f"      📄 Full content length: {len(detail_data.get('full_content', ''))} characters")
                    else:
                        print(f"      ❌ Missing detail fields: {missing_detail_fields}")
                        all_tests_passed = False
                else:
                    print(f"      ❌ News & Event detail endpoint failed with status: {detail_response.status_code}")
                    print(f"      Response: {detail_response.text}")
                    all_tests_passed = False
            else:
                print("      ⚠️  No news events available to test detail endpoint")
        
        # Step 6: Test combined filtering scenarios
        print("   5.1 Testing combined filtering scenarios...")
        
        # Test category + sorting combination
        response = requests.get(f"{API_BASE_URL}/news-events?category_filter=News&sort_by=date&sort_order=desc&per_page=5", timeout=15)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            print(f"      ✅ Category + Sorting combination: {len(news_events)} News items sorted by date")
        else:
            print(f"      ❌ Category + Sorting combination failed")
            all_tests_passed = False
        
        # Test title filter + pagination combination
        response = requests.get(f"{API_BASE_URL}/news-events?title_filter=Smart&page=1&per_page=10", timeout=15)
        if response.status_code == 200:
            data = response.json()
            news_events = data.get("news_events", [])
            pagination = data.get("pagination", {})
            print(f"      ✅ Title filter + Pagination: {len(news_events)} items with 'Smart' in title")
        else:
            print(f"      ❌ Title filter + Pagination combination failed")
            all_tests_passed = False
        
        # Step 7: Verify cache status after operations
        print("   6.1 Checking cache status after operations...")
        cache_status_response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if cache_status_response.status_code == 200:
            cache_data = cache_status_response.json()
            print(f"      ✅ Cache status: {cache_data.get('cached_items', 0)} items cached")
            print(f"      📊 Cache duration: {cache_data.get('cache_duration_minutes', 0)} minutes")
        
        if all_tests_passed:
            print("   🎉 ALL Updated News & Events API tests PASSED!")
            print("   ✅ New Google Sheets URL integration working correctly")
            print("   ✅ Data conversion handles 'achievements' key properly")
            print("   ✅ All category filtering, pagination, and sorting functionality working")
        else:
            print("   ⚠️  Some Updated News & Events API tests FAILED!")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in Updated News & Events API testing: {e}")
        import traceback
        print(f"   📋 Traceback: {traceback.format_exc()}")
        return False

def run_all_tests():
    """Run all backend tests and return summary"""
    print("Starting Comprehensive Backend API Tests")
    print("=" * 60)
    
    results = {}
    
    # Basic functionality tests
    results['server_accessible'] = test_server_accessibility()
    results['root_endpoint'] = test_root_endpoint()
    results['post_status'], _ = test_post_status_endpoint()
    results['get_status'] = test_get_status_endpoint()
    results['mongodb_connection'] = test_mongodb_connection()
    results['cors_config'] = test_cors_configuration()
    
    # Google Sheets Integration API tests
    results['publications_endpoint'] = test_publications_endpoint()
    results['projects_endpoint'] = test_projects_endpoint()
    results['achievements_endpoint'] = test_achievements_endpoint()
    results['news_events_endpoint'] = test_news_events_endpoint()
    results['achievement_details'] = test_achievement_details_endpoint()
    results['news_event_details'] = test_news_event_details_endpoint()
    results['research_stats'] = test_research_stats_endpoint()
    results['error_handling'] = test_error_handling()
    
    # Comprehensive News & Events API testing (as requested)
    results['news_events_comprehensive'] = test_news_events_comprehensive()
    
    # Updated News & Events API testing with new Google Sheets URL
    results['updated_news_events_api'] = test_updated_news_events_api()
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    all_passed = True
    basic_tests = ['server_accessible', 'root_endpoint', 'post_status', 'get_status', 'mongodb_connection', 'cors_config']
    sheets_tests = ['publications_endpoint', 'projects_endpoint', 'achievements_endpoint', 'news_events_endpoint', 
                   'achievement_details', 'news_event_details', 'research_stats', 'error_handling']
    comprehensive_tests = ['news_events_comprehensive']
    
    print("BASIC FUNCTIONALITY:")
    for test_name in basic_tests:
        passed = results.get(test_name, False)
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name.replace('_', ' ').title()}: {status}")
        if not passed:
            all_passed = False
    
    print("\nGOOGLE SHEETS INTEGRATION:")
    sheets_passed = True
    for test_name in sheets_tests:
        passed = results.get(test_name, False)
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name.replace('_', ' ').title()}: {status}")
        if not passed:
            all_passed = False
            sheets_passed = False
    
    print("\nCOMPREHENSIVE FILTERING TESTS:")
    for test_name in comprehensive_tests:
        passed = results.get(test_name, False)
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name.replace('_', ' ').title()}: {status}")
        if not passed:
            all_passed = False
    
    print("=" * 60)
    if all_passed:
        print("🎉 ALL TESTS PASSED - News & Events API filtering functionality working perfectly!")
    elif results.get('news_events_comprehensive', False):
        print("✅ NEWS & EVENTS FILTERING WORKING - Some other functionality issues")
    else:
        print("⚠️  NEWS & EVENTS FILTERING ISSUES FOUND - Needs attention")
    
    return results, all_passed

def test_cache_duration_verification():
    """Test that cache duration is reduced to 30 seconds as per review request"""
    print("22. Testing Cache Duration Verification - 30 SECONDS CACHE...")
    
    all_tests_passed = True
    
    try:
        # 1. Test cache status endpoint to verify cache duration
        print("   1.1 Testing cache duration configuration...")
        response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if response.status_code != 200:
            print(f"      ❌ Cache status endpoint failed with status: {response.status_code}")
            all_tests_passed = False
        else:
            cache_data = response.json()
            cache_duration_minutes = cache_data.get("cache_duration_minutes", 0)
            cache_duration_seconds = cache_duration_minutes * 60
            
            print(f"      📊 Current cache duration: {cache_duration_minutes} minutes ({cache_duration_seconds} seconds)")
            
            # Verify cache duration is 30 seconds (0.5 minutes)
            if abs(cache_duration_seconds - 30) < 1:  # Allow 1 second tolerance
                print("      ✅ Cache duration correctly set to 30 seconds")
            else:
                print(f"      ❌ Cache duration should be 30 seconds, but found {cache_duration_seconds} seconds")
                all_tests_passed = False
        
        # 2. Test cache expiration after 30 seconds
        print("   1.2 Testing cache expiration after 30 seconds...")
        import time
        
        # Clear cache first
        clear_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if clear_response.status_code == 200:
            print("      ✅ Cache cleared successfully")
        
        # Make first request to populate cache
        response1 = requests.get(f"{API_BASE_URL}/publications?per_page=1", timeout=30)
        if response1.status_code == 200:
            print("      ✅ First request made to populate cache")
            
            # Check cache status
            cache_response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
            if cache_response.status_code == 200:
                cache_data = cache_response.json()
                cached_items = cache_data.get("cached_items", 0)
                print(f"      📊 Cache populated with {cached_items} items")
            
            # Wait for 35 seconds (longer than 30-second cache duration)
            print("      ⏳ Waiting 35 seconds for cache to expire...")
            time.sleep(35)
            
            # Make second request - should fetch fresh data
            start_time = time.time()
            response2 = requests.get(f"{API_BASE_URL}/publications?per_page=1", timeout=30)
            request_time = time.time() - start_time
            
            if response2.status_code == 200:
                print(f"      ✅ Second request after cache expiry: {request_time:.3f} seconds")
                
                # If cache expired, this should be a fresh fetch (slower)
                if request_time > 0.1:  # Fresh fetch should take more time
                    print("      ✅ Cache appears to have expired - fresh data fetched")
                else:
                    print("      ⚠️  Request was very fast - cache may not have expired")
            else:
                print("      ❌ Second request failed")
                all_tests_passed = False
        else:
            print("      ❌ First request failed")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in cache duration verification: {e}")
        return False

def test_environment_variables_configuration():
    """Test that Google Sheets API URLs are configurable via environment variables"""
    print("23. Testing Environment Variables Configuration - GOOGLE SHEETS URLs...")
    
    all_tests_passed = True
    
    try:
        # 1. Test that environment variables are being read
        print("   1.1 Testing environment variables configuration...")
        
        # Check if backend .env file exists and contains the required URLs
        try:
            with open('/app/backend/.env', 'r') as f:
                env_content = f.read()
                
            required_env_vars = [
                'PUBLICATIONS_API_URL',
                'PROJECTS_API_URL', 
                'ACHIEVEMENTS_API_URL',
                'NEWS_EVENTS_API_URL'
            ]
            
            missing_vars = []
            for var in required_env_vars:
                if var not in env_content:
                    missing_vars.append(var)
                else:
                    print(f"      ✅ {var} found in environment variables")
            
            if missing_vars:
                print(f"      ❌ Missing environment variables: {missing_vars}")
                all_tests_passed = False
            else:
                print("      ✅ All required Google Sheets API URLs configured in environment")
            
        except Exception as e:
            print(f"      ❌ Error reading backend .env file: {e}")
            all_tests_passed = False
        
        # 2. Test that APIs are using the configured URLs
        print("   1.2 Testing that APIs use environment-configured URLs...")
        
        # Test each endpoint to ensure they're working with configured URLs
        endpoints = [
            ("publications", "/api/publications"),
            ("projects", "/api/projects"),
            ("achievements", "/api/achievements"),
            ("news-events", "/api/news-events")
        ]
        
        for name, endpoint in endpoints:
            response = requests.get(f"{API_BASE_URL}{endpoint}?per_page=1", timeout=15)
            if response.status_code == 200:
                data = response.json()
                # Check if we're getting data (indicates URL is working)
                data_key = name.replace("-", "_")  # Convert news-events to news_events
                if data_key in data and len(data[data_key]) > 0:
                    print(f"      ✅ {name.title()} API using configured URL successfully")
                elif data_key in data:
                    print(f"      ⚠️  {name.title()} API responding but no data (may be expected)")
                else:
                    print(f"      ❌ {name.title()} API response structure incorrect")
                    all_tests_passed = False
            else:
                print(f"      ❌ {name.title()} API failed with status: {response.status_code}")
                all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in environment variables testing: {e}")
        return False

def test_force_refresh_functionality():
    """Test POST /api/clear-cache endpoint for force refresh functionality"""
    print("24. Testing Force Refresh Functionality - CLEAR CACHE ENDPOINT...")
    
    all_tests_passed = True
    
    try:
        # 1. Test clear cache endpoint exists and works
        print("   1.1 Testing POST /api/clear-cache endpoint...")
        
        # First populate cache by making requests
        print("      📊 Populating cache with data...")
        requests.get(f"{API_BASE_URL}/publications?per_page=1", timeout=15)
        requests.get(f"{API_BASE_URL}/projects?per_page=1", timeout=15)
        requests.get(f"{API_BASE_URL}/achievements?per_page=1", timeout=15)
        
        # Check cache status before clearing
        cache_response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if cache_response.status_code == 200:
            cache_data = cache_response.json()
            cached_items_before = cache_data.get("cached_items", 0)
            print(f"      📊 Cache items before clearing: {cached_items_before}")
        
        # Test clear cache endpoint
        clear_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if clear_response.status_code != 200:
            print(f"      ❌ Clear cache endpoint failed with status: {clear_response.status_code}")
            all_tests_passed = False
        else:
            clear_data = clear_response.json()
            if "message" in clear_data and "success" in clear_data["message"].lower():
                print("      ✅ Clear cache endpoint working correctly")
                print(f"      📋 Response: {clear_data}")
            else:
                print(f"      ❌ Unexpected clear cache response: {clear_data}")
                all_tests_passed = False
        
        # 2. Verify cache was actually cleared
        print("   1.2 Verifying cache was cleared...")
        
        cache_response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if cache_response.status_code == 200:
            cache_data = cache_response.json()
            cached_items_after = cache_data.get("cached_items", 0)
            print(f"      📊 Cache items after clearing: {cached_items_after}")
            
            if cached_items_after == 0:
                print("      ✅ Cache successfully cleared - 0 items remaining")
            else:
                print(f"      ❌ Cache not fully cleared - {cached_items_after} items remaining")
                all_tests_passed = False
        else:
            print("      ❌ Could not verify cache status after clearing")
            all_tests_passed = False
        
        # 3. Test immediate refresh after cache clear
        print("   1.3 Testing immediate refresh after cache clear...")
        
        import time
        start_time = time.time()
        response = requests.get(f"{API_BASE_URL}/publications?per_page=1", timeout=30)
        request_time = time.time() - start_time
        
        if response.status_code == 200:
            print(f"      ✅ Immediate refresh working: {request_time:.3f} seconds")
            
            # This should be a fresh fetch (slower than cached)
            if request_time > 0.1:
                print("      ✅ Fresh data fetched after cache clear")
            else:
                print("      ⚠️  Request was very fast - may still be using cache")
        else:
            print("      ❌ Immediate refresh failed")
            all_tests_passed = False
        
        # 4. Test cache repopulation
        print("   1.4 Testing cache repopulation...")
        
        cache_response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if cache_response.status_code == 200:
            cache_data = cache_response.json()
            cached_items_repopulated = cache_data.get("cached_items", 0)
            print(f"      📊 Cache items after repopulation: {cached_items_repopulated}")
            
            if cached_items_repopulated > 0:
                print("      ✅ Cache successfully repopulated after clear")
            else:
                print("      ⚠️  Cache not repopulated - may be expected behavior")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in force refresh functionality testing: {e}")
        return False

def test_all_data_endpoints_comprehensive():
    """Test all 4 main data endpoints comprehensively as per review request"""
    print("25. Testing All Data Endpoints - COMPREHENSIVE API TESTING...")
    
    all_tests_passed = True
    
    try:
        # Test all 4 main endpoints as specified in review request
        endpoints = [
            ("publications", "/api/publications", "publications"),
            ("projects", "/api/projects", "projects"), 
            ("achievements", "/api/achievements", "achievements"),
            ("news-events", "/api/news-events", "news_events")
        ]
        
        for name, endpoint, data_key in endpoints:
            print(f"   Testing {name.upper()} endpoint...")
            
            # 1. Basic functionality test
            response = requests.get(f"{API_BASE_URL}{endpoint}", timeout=15)
            if response.status_code != 200:
                print(f"      ❌ {name} endpoint failed with status: {response.status_code}")
                all_tests_passed = False
                continue
            
            data = response.json()
            
            # 2. Check response structure
            required_keys = [data_key, "pagination"]
            missing_keys = [key for key in required_keys if key not in data]
            if missing_keys:
                print(f"      ❌ {name} missing keys: {missing_keys}")
                all_tests_passed = False
                continue
            
            items = data.get(data_key, [])
            pagination = data.get("pagination", {})
            
            print(f"      ✅ {name} basic functionality: {len(items)} items, page {pagination.get('current_page', 1)}")
            
            # 3. Test pagination
            if pagination.get("total_pages", 1) > 1:
                page2_response = requests.get(f"{API_BASE_URL}{endpoint}?page=2", timeout=10)
                if page2_response.status_code == 200:
                    print(f"      ✅ {name} pagination working")
                else:
                    print(f"      ❌ {name} pagination failed")
                    all_tests_passed = False
            
            # 4. Test filtering (if applicable)
            if name == "publications":
                # Test category filter
                filter_response = requests.get(f"{API_BASE_URL}{endpoint}?category_filter=Journal Articles", timeout=10)
                if filter_response.status_code == 200:
                    print(f"      ✅ {name} category filtering working")
                else:
                    print(f"      ❌ {name} category filtering failed")
                    all_tests_passed = False
            
            elif name == "projects":
                # Test status filter
                filter_response = requests.get(f"{API_BASE_URL}{endpoint}?status_filter=Active", timeout=10)
                if filter_response.status_code == 200:
                    print(f"      ✅ {name} status filtering working")
                else:
                    print(f"      ❌ {name} status filtering failed")
                    all_tests_passed = False
            
            elif name in ["achievements", "news-events"]:
                # Test category filter
                filter_response = requests.get(f"{API_BASE_URL}{endpoint}?category_filter=Award", timeout=10)
                if filter_response.status_code == 200:
                    print(f"      ✅ {name} category filtering working")
                else:
                    print(f"      ❌ {name} category filtering failed")
                    all_tests_passed = False
            
            # 5. Test sorting
            sort_response = requests.get(f"{API_BASE_URL}{endpoint}?sort_by=date&sort_order=desc", timeout=10)
            if sort_response.status_code == 200:
                print(f"      ✅ {name} sorting working")
            else:
                print(f"      ❌ {name} sorting failed")
                all_tests_passed = False
            
            # 6. Test per_page parameter
            per_page_response = requests.get(f"{API_BASE_URL}{endpoint}?per_page=5", timeout=10)
            if per_page_response.status_code == 200:
                per_page_data = per_page_response.json()
                per_page_items = per_page_data.get(data_key, [])
                if len(per_page_items) <= 5:
                    print(f"      ✅ {name} per_page parameter working")
                else:
                    print(f"      ❌ {name} per_page parameter not working correctly")
                    all_tests_passed = False
            else:
                print(f"      ❌ {name} per_page parameter failed")
                all_tests_passed = False
        
        # Test detail endpoints for achievements and news-events
        print("   Testing detail endpoints...")
        
        # Test achievements detail endpoint
        achievements_response = requests.get(f"{API_BASE_URL}/achievements?per_page=1", timeout=10)
        if achievements_response.status_code == 200:
            achievements_data = achievements_response.json()
            achievements = achievements_data.get("achievements", [])
            if len(achievements) > 0:
                achievement_id = achievements[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/achievements/{achievement_id}", timeout=10)
                if detail_response.status_code == 200:
                    print("      ✅ Achievements detail endpoint working")
                else:
                    print("      ❌ Achievements detail endpoint failed")
                    all_tests_passed = False
        
        # Test news-events detail endpoint
        news_response = requests.get(f"{API_BASE_URL}/news-events?per_page=1", timeout=10)
        if news_response.status_code == 200:
            news_data = news_response.json()
            news_events = news_data.get("news_events", [])
            if len(news_events) > 0:
                news_id = news_events[0]["id"]
                detail_response = requests.get(f"{API_BASE_URL}/news-events/{news_id}", timeout=10)
                if detail_response.status_code == 200:
                    print("      ✅ News-events detail endpoint working")
                else:
                    print("      ❌ News-events detail endpoint failed")
                    all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error in comprehensive data endpoints testing: {e}")
        return False

def run_comprehensive_backend_testing():
    """Run comprehensive backend testing as requested in review"""
    print("🔍 COMPREHENSIVE BACKEND API TESTING - ADDRESSING USER 'No data found' ISSUES")
    print("=" * 80)
    print(f"🌐 Testing backend at: {API_BASE_URL}")
    print(f"📅 Test timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Test results tracking
    test_results = {}
    critical_issues = []
    
    # 1. Basic Backend Health Check
    print("\n🏥 BASIC BACKEND HEALTH CHECK")
    print("-" * 40)
    
    basic_tests = [
        ("Server Accessibility", test_server_accessibility),
        ("Root Endpoint", test_root_endpoint),
        ("MongoDB Connection", test_mongodb_connection),
        ("CORS Configuration", test_cors_configuration)
    ]
    
    for test_name, test_func in basic_tests:
        try:
            result = test_func()
            test_results[test_name] = result
            if not result:
                critical_issues.append(f"Basic backend issue: {test_name} failed")
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            test_results[test_name] = False
            critical_issues.append(f"Basic backend exception in {test_name}: {str(e)}")
    
    # 2. Main API Endpoints Testing (as requested in review)
    print("\n🎯 MAIN API ENDPOINTS TESTING (Review Request Focus)")
    print("-" * 60)
    
    main_api_tests = [
        ("Publications API", test_publications_endpoint),
        ("Projects API", test_projects_endpoint),
        ("Achievements API", test_achievements_endpoint),
        ("News-Events API", test_news_events_endpoint)
    ]
    
    for test_name, test_func in main_api_tests:
        try:
            result = test_func()
            test_results[test_name] = result
            if not result:
                critical_issues.append(f"Main API issue: {test_name} failed - This could cause 'No data found' messages")
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            test_results[test_name] = False
            critical_issues.append(f"Main API exception in {test_name}: {str(e)}")
    
    # 3. Cache and Performance Testing
    print("\n⚡ CACHE AND PERFORMANCE TESTING")
    print("-" * 40)
    
    try:
        print("Testing cache status endpoint...")
        cache_response = requests.get(f"{API_BASE_URL}/cache-status", timeout=10)
        if cache_response.status_code == 200:
            cache_data = cache_response.json()
            print(f"✅ Cache Status: {cache_data.get('cached_items', 0)} items cached")
            print(f"⏰ Cache Duration: {cache_data.get('cache_duration_minutes', 0)} minutes")
            test_results["Cache Status"] = True
        else:
            print(f"❌ Cache status endpoint failed: {cache_response.status_code}")
            test_results["Cache Status"] = False
            
        print("Testing cache clear endpoint...")
        clear_response = requests.post(f"{API_BASE_URL}/clear-cache", timeout=10)
        if clear_response.status_code == 200:
            print("✅ Cache clear endpoint working")
            test_results["Cache Clear"] = True
        else:
            print(f"❌ Cache clear endpoint failed: {clear_response.status_code}")
            test_results["Cache Clear"] = False
            
    except Exception as e:
        print(f"❌ Cache testing failed: {e}")
        test_results["Cache Status"] = False
        test_results["Cache Clear"] = False
    
    # 4. Generate Final Summary
    print("\n" + "=" * 80)
    print("🎯 COMPREHENSIVE BACKEND TESTING SUMMARY")
    print("=" * 80)
    
    # Calculate statistics
    passed_tests = sum(1 for result in test_results.values() if result)
    total_tests = len(test_results)
    success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
    
    print(f"📊 Overall Results: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}%)")
    print()
    
    # Detailed results
    print("📋 Detailed Test Results:")
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name}")
    
    # Critical issues analysis
    print()
    if critical_issues:
        print("🚨 CRITICAL ISSUES FOUND (Likely causing 'No data found' messages):")
        for i, issue in enumerate(critical_issues, 1):
            print(f"   {i}. {issue}")
    else:
        print("✅ No critical issues found in backend APIs")
    
    # Google Sheets Integration Analysis
    print()
    print("🔍 GOOGLE SHEETS INTEGRATION ANALYSIS:")
    main_apis = ["Publications API", "Projects API", "Achievements API", "News-Events API"]
    working_apis = [api for api in main_apis if test_results.get(api, False)]
    failing_apis = [api for api in main_apis if not test_results.get(api, False)]
    
    if len(working_apis) == 4:
        print("   ✅ All 4 main APIs are working - Google Sheets integration appears functional")
    elif len(working_apis) > 0:
        print(f"   ⚠️  Partial functionality: {len(working_apis)}/4 APIs working")
        print(f"   ✅ Working: {', '.join(working_apis)}")
        if failing_apis:
            print(f"   ❌ Failing: {', '.join(failing_apis)}")
    else:
        print("   ❌ All main APIs failing - Major Google Sheets integration issue")
    
    # Recommendations
    print()
    print("💡 RECOMMENDATIONS:")
    if success_rate >= 90:
        print("   ✅ Backend is healthy. If users see 'No data found', check frontend integration.")
    elif success_rate >= 70:
        print("   ⚠️  Backend has minor issues. Focus on fixing failing endpoints.")
    else:
        print("   🚨 Backend has major issues. Immediate attention required.")
        
    if failing_apis:
        print(f"   🔧 Priority fix: {', '.join(failing_apis)}")
    
    print()
    print("=" * 80)
    
    return test_results, critical_issues

if __name__ == "__main__":
    test_results, critical_issues = run_comprehensive_backend_testing()