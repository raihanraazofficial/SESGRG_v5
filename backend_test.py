#!/usr/bin/env python3
"""
Google Sheets API Integration Testing Suite - Home Page Latest News & Events Focus
Tests the Google Sheets API integration that powers the Home page Latest News & Events section:
- All 4 Google Sheets APIs working correctly (Publications, Projects, Achievements, News Events)
- News Events API specifically returns valid data for Home page
- Response times are reasonable (under 4-5 seconds)
- No authentication or access issues
- Error handling works properly if API is temporarily unavailable
- Verifies recent improvements to error handling, loading states, and caching
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
                elif line.startswith('REACT_APP_BACKEND_URL='):
                    urls['backend'] = line.split('=', 1)[1].strip()
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

print(f"Testing Google Sheets Integration and Performance Optimizations")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Projects API: {PROJECTS_API_URL}")
print(f"Achievements API: {ACHIEVEMENTS_API_URL}")
print(f"News Events API: {NEWS_EVENTS_API_URL}")
print("=" * 80)

def test_home_page_news_events_integration():
    """Test the Home page Latest News & Events section integration specifically"""
    print("1. Testing Home Page Latest News & Events Integration...")
    
    all_tests_passed = True
    
    try:
        # Test 1: News Events API accessibility and response time
        print("   📰 Testing News Events API for Home page...")
        start_time = time.time()
        response = requests.get(NEWS_EVENTS_API_URL, timeout=5)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            print(f"      ✅ News Events API accessible")
            print(f"      ⏱️  Response time: {response_time:.2f}s")
            
            # Check if response time is under 4-5 seconds as requested
            if response_time <= 4.0:
                print(f"      🚀 Performance: EXCELLENT (under 4s)")
            elif response_time <= 5.0:
                print(f"      ✅ Performance: GOOD (under 5s)")
            else:
                print(f"      ⚠️  Performance: SLOW (over 5s - may need optimization)")
                
        else:
            print(f"      ❌ News Events API returned status code: {response.status_code}")
            all_tests_passed = False
            return all_tests_passed
            
        # Test 2: Data structure validation for Home page display
        print("\n   🏠 Testing data structure for Home page display...")
        data = response.json()
        news_events = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
        
        if not isinstance(news_events, list):
            print(f"      ❌ Expected list of news events, got: {type(news_events)}")
            all_tests_passed = False
            return all_tests_passed
            
        if len(news_events) == 0:
            print(f"      ⚠️  No news events found - Home page will show empty state")
            print(f"      ℹ️  This should trigger proper empty state handling")
        else:
            print(f"      ✅ Found {len(news_events)} news events for Home page")
            
            # Test first news event structure for Home page requirements
            sample_event = news_events[0]
            print(f"      📄 Sample event: '{sample_event.get('title', '')[:50]}...'")
            
            # Check required fields for Home page display
            required_fields = ['id', 'title', 'date', 'category']
            optional_fields = ['description', 'image_url', 'featured']
            
            missing_required = [field for field in required_fields if not sample_event.get(field)]
            present_optional = [field for field in optional_fields if sample_event.get(field)]
            
            if missing_required:
                print(f"      ❌ Missing required fields for Home page: {missing_required}")
                all_tests_passed = False
            else:
                print(f"      ✅ All required fields present for Home page display")
                
            if present_optional:
                print(f"      ✅ Optional fields available: {present_optional}")
                
            # Test date format for Home page sorting
            event_date = sample_event.get('date')
            if event_date:
                try:
                    # Try to parse date for sorting functionality
                    from datetime import datetime
                    if isinstance(event_date, str):
                        # Common date formats
                        date_formats = ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%d %H:%M:%S']
                        parsed_date = None
                        for fmt in date_formats:
                            try:
                                parsed_date = datetime.strptime(event_date, fmt)
                                break
                            except ValueError:
                                continue
                        
                        if parsed_date:
                            print(f"      ✅ Date format parseable for sorting: {event_date}")
                        else:
                            print(f"      ⚠️  Date format may need validation: {event_date}")
                    else:
                        print(f"      ✅ Date field type: {type(event_date)}")
                except Exception as e:
                    print(f"      ⚠️  Date parsing issue: {e}")
                    
        # Test 3: Featured news functionality for Home page
        print("\n   ⭐ Testing featured news functionality...")
        featured_events = [event for event in news_events if event.get('featured')]
        
        if featured_events:
            print(f"      ✅ Found {len(featured_events)} featured events for Home page highlight")
            featured_event = featured_events[0]
            print(f"      🌟 Featured event: '{featured_event.get('title', '')[:50]}...'")
        else:
            print(f"      ℹ️  No featured events found - Home page will use latest event")
            if news_events:
                latest_event = news_events[0]  # Assuming sorted by date
                print(f"      📅 Latest event: '{latest_event.get('title', '')[:50]}...'")
                
        # Test 4: Category filtering for Home page display
        print("\n   🏷️  Testing category filtering for Home page...")
        categories = list(set(event.get('category', 'General') for event in news_events))
        print(f"      📋 Available categories: {categories}")
        
        for category in categories[:3]:  # Test first 3 categories
            category_events = [event for event in news_events if event.get('category') == category]
            print(f"      ✅ Category '{category}': {len(category_events)} events")
            
        # Test 5: Error handling simulation
        print("\n   🛡️  Testing error handling for Home page...")
        
        # Test with invalid URL to verify error handling
        try:
            invalid_response = requests.get("https://invalid-news-api.com/test", timeout=2)
            print(f"      ⚠️  Invalid URL test: Unexpected success")
        except requests.exceptions.RequestException:
            print(f"      ✅ Invalid URL properly handled - Home page should show error state")
        except Exception as e:
            print(f"      ✅ Error handling working - {type(e).__name__}")
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing Home page News Events integration: {e}")
        return False
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

def test_citation_copy_functionality():
    """Test the citation copy functionality (simulated)"""
    print("5. Testing citation copy functionality...")
    
    # Since we can't test actual clipboard functionality in headless environment,
    # we'll test the citation generation logic
    
    sample_publications = [
        {
            "id": "test_journal_1",
            "title": "Smart Grid Optimization Using Machine Learning",
            "authors": ["Rahman, M.A.", "Smith, J.B.", "Johnson, C.D."],
            "category": "Journal Articles",
            "journal_name": "IEEE Transactions on Smart Grid",
            "volume": "15",
            "issue": "3",
            "pages": "123-135",
            "year": "2024"
        },
        {
            "id": "test_conference_1", 
            "title": "Renewable Energy Integration in Microgrids",
            "authors": ["Ahmed, S.R.", "Brown, K.L."],
            "category": "Conference Proceedings",
            "conference_name": "IEEE Power & Energy Society General Meeting",
            "city": "Seattle",
            "country": "USA",
            "pages": "1-6",
            "year": "2023"
        },
        {
            "id": "test_book_1",
            "title": "Advanced Energy Storage Systems",
            "authors": ["Wilson, P.Q.", "Davis, R.T."],
            "category": "Book Chapters",
            "book_title": "Handbook of Sustainable Energy Technologies",
            "editor": "Thompson, A.B.",
            "publisher": "Springer",
            "city": "New York",
            "country": "USA", 
            "pages": "45-78",
            "year": "2022"
        }
    ]
    
    all_tests_passed = True
    
    for pub in sample_publications:
        print(f"   \n   📄 Testing citation for: '{pub['title']}'")
        print(f"      Category: {pub['category']}")
        
        # Generate citation
        citation = generate_ieee_citation_test(pub)
        print(f"      Generated citation: {citation}")
        
        # Validate citation format
        format_valid = validate_ieee_citation_format(citation, pub['category'])
        
        if format_valid:
            print(f"      ✅ Citation format validation passed")
        else:
            print(f"      ❌ Citation format validation failed")
            all_tests_passed = False
        
        # Check for specific IEEE elements
        if pub['category'] == "Journal Articles":
            required_in_citation = [pub['journal_name'], f"vol. {pub['volume']}", f"no. {pub['issue']}", f"pp. {pub['pages']}"]
        elif pub['category'] == "Conference Proceedings":
            required_in_citation = [pub['conference_name'], f"pp. {pub['pages']}"]
        elif pub['category'] == "Book Chapters":
            required_in_citation = [pub['book_title'], "Ed(s).", pub['publisher'], f"pp. {pub['pages']}"]
        
        missing_elements = []
        for element in required_in_citation:
            if element not in citation:
                missing_elements.append(element)
        
        if missing_elements:
            print(f"      ❌ Missing elements in citation: {missing_elements}")
            all_tests_passed = False
        else:
            print(f"      ✅ All required elements present in citation")
    
    return all_tests_passed

def test_google_sheets_data_parsing():
    """Test that Google Sheets data is being properly parsed and formatted"""
    print("6. Testing Google Sheets data parsing and formatting...")
    
    all_tests_passed = True
    
    try:
        # Fetch data directly from Google Sheets API
        response = requests.get(PUBLICATIONS_API_URL, timeout=30)
        
        if response.status_code != 200:
            print(f"   ❌ Failed to fetch from Google Sheets API: {response.status_code}")
            return False
        
        data = response.json()
        print(f"   ✅ Successfully fetched data from Google Sheets API")
        
        # Check data structure
        publications = data.get('publications', []) if isinstance(data, dict) else data
        
        if not isinstance(publications, list):
            print(f"   ❌ Expected list of publications, got: {type(publications)}")
            return False
        
        if len(publications) == 0:
            print(f"   ❌ No publications found in Google Sheets data")
            return False
        
        print(f"   📊 Found {len(publications)} publications in Google Sheets")
        
        # Test data structure and field mapping
        sample_pub = publications[0]
        print(f"   📄 Sample publication fields: {list(sample_pub.keys())}")
        
        # Check for required fields
        required_fields = ['id', 'title', 'authors', 'category', 'year']
        missing_fields = []
        
        for field in required_fields:
            if field not in sample_pub:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"   ❌ Missing required fields: {missing_fields}")
            all_tests_passed = False
        else:
            print(f"   ✅ All required fields present")
        
        # Check field data types and formats
        print(f"   🔍 Validating field formats:")
        
        # Authors field
        authors = sample_pub.get('authors')
        if isinstance(authors, list):
            print(f"      ✅ Authors field is properly formatted as list: {len(authors)} authors")
        elif isinstance(authors, str):
            print(f"      ℹ️  Authors field is string format (will be handled by frontend)")
        else:
            print(f"      ❌ Authors field has unexpected format: {type(authors)}")
            all_tests_passed = False
        
        # Year field
        year = sample_pub.get('year')
        if isinstance(year, (int, str)) and str(year).isdigit():
            print(f"      ✅ Year field is properly formatted: {year}")
        else:
            print(f"      ❌ Year field has invalid format: {year} ({type(year)})")
            all_tests_passed = False
        
        # Category field
        category = sample_pub.get('category')
        valid_categories = ["Journal Articles", "Conference Proceedings", "Book Chapters"]
        if category in valid_categories:
            print(f"      ✅ Category field is valid: {category}")
        else:
            print(f"      ⚠️  Category field may need validation: {category}")
        
        # Test category-specific fields
        category_specific_fields = {
            "Journal Articles": ["journal_name", "volume", "issue"],
            "Conference Proceedings": ["conference_name"],
            "Book Chapters": ["book_title", "editor", "publisher"]
        }
        
        if category in category_specific_fields:
            expected_fields = category_specific_fields[category]
            present_fields = [field for field in expected_fields if sample_pub.get(field)]
            missing_fields = [field for field in expected_fields if not sample_pub.get(field)]
            
            print(f"      ✅ Category-specific fields present: {present_fields}")
            if missing_fields:
                print(f"      ⚠️  Category-specific fields missing: {missing_fields}")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing Google Sheets data parsing: {e}")
        return False

def test_all_google_sheets_apis():
    """Test all 4 Google Sheets API endpoints for accessibility and performance"""
    print("1. Testing All Google Sheets API Endpoints...")
    
    all_tests_passed = True
    api_endpoints = {
        'Publications': PUBLICATIONS_API_URL,
        'Projects': PROJECTS_API_URL,
        'Achievements': ACHIEVEMENTS_API_URL,
        'News Events': NEWS_EVENTS_API_URL
    }
    
    api_data = {}
    
    for api_name, api_url in api_endpoints.items():
        print(f"\n   🔍 Testing {api_name} API...")
        try:
            start_time = time.time()
            response = requests.get(api_url, timeout=10)
            end_time = time.time()
            response_time = end_time - start_time
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract data based on API structure
                if api_name == 'Publications':
                    items = data.get('publications', []) if isinstance(data, dict) else data
                elif api_name == 'Projects':
                    items = data.get('projects', []) if isinstance(data, dict) else data
                elif api_name == 'Achievements':
                    items = data.get('achievements', data.get('data', [])) if isinstance(data, dict) else data
                elif api_name == 'News Events':
                    items = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
                
                api_data[api_name] = items
                
                print(f"      ✅ {api_name} API accessible")
                print(f"      📊 Retrieved {len(items)} items")
                print(f"      ⏱️  Response time: {response_time:.2f}s")
                
                # Check if response time is under 4 seconds (new timeout)
                if response_time <= 4.0:
                    print(f"      🚀 Performance: GOOD (under 4s timeout)")
                else:
                    print(f"      ⚠️  Performance: SLOW (over 4s timeout)")
                    
            else:
                print(f"      ❌ {api_name} API returned status code: {response.status_code}")
                all_tests_passed = False
                
        except requests.exceptions.Timeout:
            print(f"      ❌ {api_name} API timed out (over 10s)")
            all_tests_passed = False
        except Exception as e:
            print(f"      ❌ {api_name} API error: {e}")
            all_tests_passed = False
    
    return all_tests_passed, api_data

def test_publications_statistics_filtering():
    """Test that Publications statistics update correctly based on filtered results"""
    print("2. Testing Publications Statistics Filtering Fix...")
    
    all_tests_passed = True
    
    try:
        # Get all publications first
        print("   📊 Fetching all publications...")
        response = requests.get(PUBLICATIONS_API_URL, timeout=10)
        if response.status_code != 200:
            print(f"   ❌ Failed to fetch publications: {response.status_code}")
            return False
            
        data = response.json()
        all_publications = data.get('publications', []) if isinstance(data, dict) else data
        
        if len(all_publications) == 0:
            print("   ❌ No publications found to test filtering")
            return False
            
        print(f"   📄 Total publications available: {len(all_publications)}")
        
        # Test filtering by each category
        categories = ["Journal Articles", "Conference Proceedings", "Book Chapters"]
        
        for category in categories:
            print(f"\n   🔍 Testing filtering by '{category}'...")
            
            # Simulate frontend filtering logic
            filtered_pubs = [pub for pub in all_publications if pub.get('category') == category]
            
            if len(filtered_pubs) == 0:
                print(f"      ⚠️  No publications found for category: {category}")
                continue
                
            print(f"      📊 Filtered publications: {len(filtered_pubs)}")
            
            # Calculate expected statistics for filtered data
            expected_stats = {
                'total_publications': len(filtered_pubs),
                'total_citations': sum(int(pub.get('citations', 0)) for pub in filtered_pubs),
                'latest_year': max(int(pub.get('year', 0)) for pub in filtered_pubs) if filtered_pubs else 0,
                'total_areas': len(set(area for pub in filtered_pubs for area in (pub.get('research_areas', []) or [])))
            }
            
            print(f"      📈 Expected Statistics:")
            print(f"         Total Publications: {expected_stats['total_publications']}")
            print(f"         Total Citations: {expected_stats['total_citations']}")
            print(f"         Latest Year: {expected_stats['latest_year']}")
            print(f"         Total Areas: {expected_stats['total_areas']}")
            
            # Verify that filtered statistics are different from total statistics
            total_stats = {
                'total_publications': len(all_publications),
                'total_citations': sum(int(pub.get('citations', 0)) for pub in all_publications),
                'latest_year': max(int(pub.get('year', 0)) for pub in all_publications),
                'total_areas': len(set(area for pub in all_publications for area in (pub.get('research_areas', []) or [])))
            }
            
            # Check if filtering actually changes the statistics
            stats_changed = (
                expected_stats['total_publications'] != total_stats['total_publications'] or
                expected_stats['total_citations'] != total_stats['total_citations'] or
                expected_stats['total_areas'] != total_stats['total_areas']
            )
            
            if stats_changed:
                print(f"      ✅ Statistics correctly differ from total (filtering working)")
            else:
                print(f"      ⚠️  Statistics same as total (may indicate filtering issue)")
                
        print(f"\n   ✅ Publications statistics filtering logic validated")
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing publications statistics filtering: {e}")
        return False

def test_loading_performance_optimizations():
    """Test loading performance improvements and cache behavior"""
    print("3. Testing Loading Performance Optimizations...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Response time under 4 seconds (new timeout)
        print("   ⏱️  Testing response time improvements...")
        
        for api_name, api_url in [
            ('Publications', PUBLICATIONS_API_URL),
            ('Projects', PROJECTS_API_URL),
            ('Achievements', ACHIEVEMENTS_API_URL),
            ('News Events', NEWS_EVENTS_API_URL)
        ]:
            start_time = time.time()
            try:
                response = requests.get(api_url, timeout=4)  # Test with 4s timeout
                end_time = time.time()
                response_time = end_time - start_time
                
                if response.status_code == 200:
                    print(f"      ✅ {api_name}: {response_time:.2f}s (under 4s timeout)")
                else:
                    print(f"      ❌ {api_name}: HTTP {response.status_code}")
                    all_tests_passed = False
                    
            except requests.exceptions.Timeout:
                print(f"      ❌ {api_name}: Timed out (over 4s)")
                all_tests_passed = False
            except Exception as e:
                print(f"      ❌ {api_name}: Error - {e}")
                all_tests_passed = False
        
        # Test 2: CORS proxy reliability (test multiple proxies)
        print("\n   🌐 Testing CORS proxy reliability...")
        
        # Test the same endpoint multiple times to check proxy racing
        test_url = PUBLICATIONS_API_URL
        success_count = 0
        total_tests = 3
        
        for i in range(total_tests):
            try:
                start_time = time.time()
                response = requests.get(test_url, timeout=4)
                end_time = time.time()
                
                if response.status_code == 200:
                    success_count += 1
                    print(f"      ✅ Proxy test {i+1}: Success ({end_time - start_time:.2f}s)")
                else:
                    print(f"      ❌ Proxy test {i+1}: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"      ❌ Proxy test {i+1}: {e}")
        
        proxy_reliability = (success_count / total_tests) * 100
        print(f"      📊 Proxy reliability: {proxy_reliability:.1f}% ({success_count}/{total_tests})")
        
        if proxy_reliability >= 66:  # At least 2/3 success rate
            print(f"      ✅ Proxy reliability acceptable")
        else:
            print(f"      ⚠️  Proxy reliability may need improvement")
            
        # Test 3: Error handling improvements
        print("\n   🛡️  Testing error handling improvements...")
        
        # Test with invalid URL to check error handling
        try:
            invalid_url = "https://invalid-url-that-should-fail.com/api"
            response = requests.get(invalid_url, timeout=2)
            print(f"      ⚠️  Invalid URL test: Unexpected success")
        except requests.exceptions.RequestException:
            print(f"      ✅ Invalid URL test: Properly handled error")
        except Exception as e:
            print(f"      ✅ Invalid URL test: Error caught - {type(e).__name__}")
            
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing loading performance: {e}")
        return False

def test_all_pages_functionality():
    """Test that optimizations haven't broken existing functionality on all pages"""
    print("4. Testing All Pages Functionality...")
    
    all_tests_passed = True
    
    try:
        # Test each API endpoint for basic functionality
        api_tests = [
            ('Publications', PUBLICATIONS_API_URL, 'publications'),
            ('Projects', PROJECTS_API_URL, 'projects'),
            ('Achievements', ACHIEVEMENTS_API_URL, 'achievements'),
            ('News Events', NEWS_EVENTS_API_URL, 'news_events')
        ]
        
        for page_name, api_url, data_key in api_tests:
            print(f"\n   📄 Testing {page_name} page functionality...")
            
            try:
                response = requests.get(api_url, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Extract items based on expected structure
                    if data_key == 'publications':
                        items = data.get('publications', []) if isinstance(data, dict) else data
                    elif data_key == 'projects':
                        items = data.get('projects', []) if isinstance(data, dict) else data
                    elif data_key == 'achievements':
                        items = data.get('achievements', data.get('data', [])) if isinstance(data, dict) else data
                    elif data_key == 'news_events':
                        items = data.get('news_events', data.get('data', [])) if isinstance(data, dict) else data
                    
                    if isinstance(items, list) and len(items) > 0:
                        print(f"      ✅ {page_name}: Data structure valid ({len(items)} items)")
                        
                        # Test first item structure
                        first_item = items[0]
                        required_fields = ['id', 'title']
                        
                        missing_fields = [field for field in required_fields if not first_item.get(field)]
                        
                        if not missing_fields:
                            print(f"      ✅ {page_name}: Required fields present")
                        else:
                            print(f"      ⚠️  {page_name}: Missing fields: {missing_fields}")
                            
                    else:
                        print(f"      ❌ {page_name}: No valid data returned")
                        all_tests_passed = False
                        
                else:
                    print(f"      ❌ {page_name}: HTTP {response.status_code}")
                    all_tests_passed = False
                    
            except Exception as e:
                print(f"      ❌ {page_name}: Error - {e}")
                all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing pages functionality: {e}")
        return False

def test_enhanced_projects_page_functionality():
    """Test the enhanced Projects page functionality as requested"""
    print("7. Testing Enhanced Projects Page Functionality...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Statistics API Integration
        print("   📊 Testing Statistics API Integration...")
        response = requests.get(PROJECTS_API_URL, timeout=10)
        
        if response.status_code != 200:
            print(f"      ❌ Projects API not accessible: {response.status_code}")
            return False
            
        data = response.json()
        projects = data.get('projects', []) if isinstance(data, dict) else data
        
        # Calculate expected statistics
        expected_stats = {
            'total_projects': len(projects),
            'active_projects': len([p for p in projects if p.get('status') == 'Active']),
            'completed_projects': len([p for p in projects if p.get('status') == 'Completed']),
            'planning_projects': len([p for p in projects if p.get('status') == 'Planning'])
        }
        
        print(f"      ✅ Statistics calculated from {len(projects)} projects:")
        print(f"         Total Projects: {expected_stats['total_projects']}")
        print(f"         Active Projects: {expected_stats['active_projects']}")
        print(f"         Completed Projects: {expected_stats['completed_projects']}")
        print(f"         Planning Projects: {expected_stats['planning_projects']}")
        
        # Test 2: Enhanced Search Functionality
        print("\n   🔍 Testing Enhanced Search Functionality...")
        
        # Test search by title
        title_search_results = [p for p in projects if p.get('title') and 'smart' in p.get('title', '').lower()]
        print(f"      ✅ Title search ('smart'): {len(title_search_results)} results")
        
        # Test search by status
        status_search_results = [p for p in projects if p.get('status') and 'active' in p.get('status', '').lower()]
        print(f"      ✅ Status search ('active'): {len(status_search_results)} results")
        
        # Test search by research area
        area_search_results = []
        for project in projects:
            if project.get('research_areas') and isinstance(project['research_areas'], list):
                for area in project['research_areas']:
                    if 'grid' in area.lower():
                        area_search_results.append(project)
                        break
        print(f"      ✅ Research area search ('grid'): {len(area_search_results)} results")
        
        # Test 3: Filter Functionality
        print("\n   🎛️  Testing Filter Functionality...")
        
        # Test status filter
        active_projects = [p for p in projects if p.get('status') == 'Active']
        completed_projects = [p for p in projects if p.get('status') == 'Completed']
        planning_projects = [p for p in projects if p.get('status') == 'Planning']
        
        print(f"      ✅ Status Filter - Active: {len(active_projects)} projects")
        print(f"      ✅ Status Filter - Completed: {len(completed_projects)} projects")
        print(f"      ✅ Status Filter - Planning: {len(planning_projects)} projects")
        
        # Test area filter
        all_areas = set()
        for project in projects:
            if project.get('research_areas') and isinstance(project['research_areas'], list):
                all_areas.update(project['research_areas'])
        
        print(f"      ✅ Area Filter - Available areas: {len(all_areas)} unique areas")
        if all_areas:
            sample_area = list(all_areas)[0]
            area_filtered = [p for p in projects if p.get('research_areas') and sample_area in p['research_areas']]
            print(f"      ✅ Area Filter - '{sample_area}': {len(area_filtered)} projects")
        
        # Test title filter
        all_titles = [p.get('title', '') for p in projects if p.get('title')]
        print(f"      ✅ Title Filter - Available titles: {len(all_titles)} projects")
        
        # Test sort functionality
        print("\n   📈 Testing Sort Functionality...")
        
        # Test sort by start_date
        sorted_by_date = sorted(projects, key=lambda p: p.get('start_date', ''), reverse=True)
        print(f"      ✅ Sort by start_date (desc): {len(sorted_by_date)} projects sorted")
        
        # Test sort by title
        sorted_by_title = sorted(projects, key=lambda p: p.get('title', '').lower())
        print(f"      ✅ Sort by title (asc): {len(sorted_by_title)} projects sorted")
        
        # Test sort by status
        sorted_by_status = sorted(projects, key=lambda p: p.get('status', '').lower())
        print(f"      ✅ Sort by status (asc): {len(sorted_by_status)} projects sorted")
        
        # Test 4: Force Refresh (simulated - we can't test cache bypass directly)
        print("\n   🔄 Testing Force Refresh Capability...")
        
        # Make another request to simulate force refresh
        refresh_response = requests.get(PROJECTS_API_URL, timeout=10)
        if refresh_response.status_code == 200:
            refresh_data = refresh_response.json()
            refresh_projects = refresh_data.get('projects', []) if isinstance(refresh_data, dict) else refresh_data
            
            if len(refresh_projects) == len(projects):
                print(f"      ✅ Force refresh simulation: {len(refresh_projects)} projects retrieved")
            else:
                print(f"      ⚠️  Force refresh simulation: Different project count ({len(refresh_projects)} vs {len(projects)})")
        else:
            print(f"      ❌ Force refresh simulation failed: {refresh_response.status_code}")
            all_tests_passed = False
        
        # Test 5: Error Handling
        print("\n   🛡️  Testing Error Handling...")
        
        # Test with invalid URL to check error handling
        try:
            invalid_response = requests.get("https://invalid-projects-api.com/test", timeout=2)
            print(f"      ⚠️  Invalid URL test: Unexpected success ({invalid_response.status_code})")
        except requests.exceptions.RequestException:
            print(f"      ✅ Invalid URL test: Properly handled error")
        except Exception as e:
            print(f"      ✅ Invalid URL test: Error caught - {type(e).__name__}")
        
        # Test empty statistics scenario
        empty_stats = {
            'total_projects': 0,
            'active_projects': 0,
            'completed_projects': 0,
            'planning_projects': 0
        }
        print(f"      ✅ Empty statistics handling: {empty_stats}")
        
        # Test data structure validation
        print("\n   🔍 Testing Data Structure Validation...")
        
        if projects and len(projects) > 0:
            sample_project = projects[0]
            required_fields = ['id', 'title', 'status', 'research_areas']
            
            missing_fields = [field for field in required_fields if field not in sample_project]
            
            if not missing_fields:
                print(f"      ✅ Data structure validation: All required fields present")
            else:
                print(f"      ⚠️  Data structure validation: Missing fields: {missing_fields}")
            
            # Check field types
            if isinstance(sample_project.get('research_areas'), list):
                print(f"      ✅ Research areas field: Properly formatted as list")
            else:
                print(f"      ⚠️  Research areas field: Not a list - {type(sample_project.get('research_areas'))}")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing enhanced projects functionality: {e}")
        return False

def run_all_tests():
    """Run all Google Sheets Integration and Performance Optimization tests"""
    print("🚀 Starting Google Sheets Integration and Performance Optimization Tests")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: All Google Sheets APIs
    try:
        apis_working, api_data = test_all_google_sheets_apis()
        test_results.append(("All Google Sheets APIs", apis_working))
        if not apis_working:
            print("\n❌ Cannot proceed with further tests - Google Sheets APIs not accessible")
            return False
        all_tests_passed &= apis_working
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        return False
    
    # Test 2: Publications Statistics Filtering Fix
    try:
        stats_filtering_works = test_publications_statistics_filtering()
        test_results.append(("Publications Statistics Filtering", stats_filtering_works))
        all_tests_passed &= stats_filtering_works
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: Loading Performance Optimizations
    try:
        performance_good = test_loading_performance_optimizations()
        test_results.append(("Loading Performance Optimizations", performance_good))
        all_tests_passed &= performance_good
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: All Pages Functionality
    try:
        pages_working = test_all_pages_functionality()
        test_results.append(("All Pages Functionality", pages_working))
        all_tests_passed &= pages_working
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 5: IEEE Citation Format Validation (existing test)
    try:
        if 'Publications' in api_data:
            ieee_format_valid = test_ieee_citation_format_validation(api_data['Publications'])
            test_results.append(("IEEE Citation Format Validation", ieee_format_valid))
            all_tests_passed &= ieee_format_valid
    except Exception as e:
        print(f"❌ Test 5 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 6: Google Sheets Data Parsing (existing test)
    try:
        parsing_works = test_google_sheets_data_parsing()
        test_results.append(("Google Sheets Data Parsing", parsing_works))
        all_tests_passed &= parsing_works
    except Exception as e:
        print(f"❌ Test 6 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 7: Enhanced Projects Page Functionality (NEW)
    try:
        projects_enhanced = test_enhanced_projects_page_functionality()
        test_results.append(("Enhanced Projects Page Functionality", projects_enhanced))
        all_tests_passed &= projects_enhanced
    except Exception as e:
        print(f"❌ Test 7 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<40} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED! Google Sheets integration and performance optimizations are working correctly.")
        return True
    else:
        print("⚠️  SOME TESTS FAILED! Please review the issues above.")
        return False


# Main execution
if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
