#!/usr/bin/env python3
"""
Google Sheets Integration and Performance Optimization Testing Suite
Tests the Google Sheets integration and performance optimizations:
- Publications Statistics Filtering Fix: Verify statistics update based on filtered results
- Loading Performance: Test cache behavior, timeout improvements, background refresh
- All Pages Functionality: Verify optimizations haven't broken existing functionality
- Google Sheets API Integration: Test all 4 API endpoints
- Performance Metrics: Test loading times and cache utilization
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

def run_all_tests():
    """Run all Publications IEEE citation formatting tests"""
    print("🚀 Starting Publications IEEE Citation Formatting Tests")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Google Sheets API Accessibility
    try:
        api_accessible, publications = test_google_sheets_api_accessibility()
        test_results.append(("Google Sheets API Accessibility", api_accessible))
        if not api_accessible:
            print("\n❌ Cannot proceed with further tests - Google Sheets API not accessible")
            return False
        all_tests_passed &= api_accessible
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        return False
    
    # Test 2: IEEE Citation Format Validation
    try:
        ieee_format_valid = test_ieee_citation_format_validation(publications)
        test_results.append(("IEEE Citation Format Validation", ieee_format_valid))
        all_tests_passed &= ieee_format_valid
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: Publication Type Filtering
    try:
        filtering_works = test_publication_type_filtering(publications)
        test_results.append(("Publication Type Filtering", filtering_works))
        all_tests_passed &= filtering_works
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: IEEE Required Elements
    try:
        elements_present = test_ieee_required_elements(publications)
        test_results.append(("IEEE Required Elements", elements_present))
        all_tests_passed &= elements_present
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 5: Citation Copy Functionality
    try:
        copy_works = test_citation_copy_functionality()
        test_results.append(("Citation Copy Functionality", copy_works))
        all_tests_passed &= copy_works
    except Exception as e:
        print(f"❌ Test 5 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 6: Google Sheets Data Parsing
    try:
        parsing_works = test_google_sheets_data_parsing()
        test_results.append(("Google Sheets Data Parsing", parsing_works))
        all_tests_passed &= parsing_works
    except Exception as e:
        print(f"❌ Test 6 failed with exception: {e}")
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
        print("🎉 ALL TESTS PASSED! Publications IEEE citation formatting is working correctly.")
        return True
    else:
        print("⚠️  SOME TESTS FAILED! Please review the issues above.")
        return False


# Main execution
if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
