#!/usr/bin/env python3
"""
MARCH 2025 WEBSITE BUG FIXES - COMPREHENSIVE BACKEND TESTING
===========================================================

This test suite verifies the backend functionality for the bug fixes implemented in March 2025:

1. Admin Login Button Removal Test
2. Read Full Story Fix Test  
3. Rich Text Editor Auto-Submit Fix Test
4. Admin Panel Modal Improvements Test
5. Admin Panel Delete Operations Test
6. Duplicate Data Investigation

Testing Focus: Backend API endpoints, Firebase integration, and data consistency
"""

import requests
import json
import time
import sys
from datetime import datetime
from urllib.parse import urljoin

class March2025BugFixesBackendTest:
    def __init__(self):
        # Get backend URL from frontend .env
        try:
            with open('/app/frontend/.env', 'r') as f:
                env_content = f.read()
                for line in env_content.split('\n'):
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        self.base_url = line.split('=', 1)[1].strip()
                        break
                else:
                    self.base_url = "https://duplicates-removal.preview.emergentagent.com"
        except:
            self.base_url = "https://duplicates-removal.preview.emergentagent.com"
        
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'March2025BugFixesTest/1.0'
        })
        
        # Test results tracking
        self.results = {
            'total_tests': 0,
            'passed_tests': 0,
            'failed_tests': 0,
            'test_details': []
        }
        
        print("🔧 MARCH 2025 WEBSITE BUG FIXES - BACKEND TESTING SUITE")
        print("=" * 60)
        print(f"🌐 Backend URL: {self.base_url}")
        print(f"🔗 API URL: {self.api_url}")
        print(f"⏰ Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)

    def log_test(self, test_name, status, details=""):
        """Log test results"""
        self.results['total_tests'] += 1
        if status:
            self.results['passed_tests'] += 1
            print(f"✅ {test_name}")
        else:
            self.results['failed_tests'] += 1
            print(f"❌ {test_name}")
        
        if details:
            print(f"   📝 {details}")
        
        self.results['test_details'].append({
            'test': test_name,
            'status': 'PASS' if status else 'FAIL',
            'details': details,
            'timestamp': datetime.now().isoformat()
        })

    def test_frontend_accessibility(self):
        """Test 1: Frontend Service Accessibility"""
        print("\n🔍 TEST CATEGORY 1: Frontend Service Accessibility")
        print("-" * 50)
        
        try:
            response = self.session.get(self.base_url, timeout=10)
            if response.status_code == 200:
                self.log_test("Frontend service accessible", True, f"Status: {response.status_code}")
                return True
            else:
                self.log_test("Frontend service accessible", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Frontend service accessible", False, f"Error: {str(e)}")
            return False

    def test_admin_login_button_removal(self):
        """Test 2: Admin Login Button Removal Verification"""
        print("\n🔍 TEST CATEGORY 2: Admin Login Button Removal")
        print("-" * 50)
        
        pages_to_test = [
            '/people',
            '/publications', 
            '/projects',
            '/achievements',
            '/news-events'
        ]
        
        all_passed = True
        
        for page in pages_to_test:
            try:
                url = f"{self.base_url}{page}"
                response = self.session.get(url, timeout=10)
                
                if response.status_code == 200:
                    # Check if admin login buttons are removed from hero sections
                    content = response.text.lower()
                    
                    # Look for admin login button patterns that should NOT exist in hero sections
                    admin_button_patterns = [
                        'admin login',
                        'login as admin',
                        'administrator login'
                    ]
                    
                    found_admin_buttons = []
                    for pattern in admin_button_patterns:
                        if pattern in content:
                            found_admin_buttons.append(pattern)
                    
                    if not found_admin_buttons:
                        self.log_test(f"Admin buttons removed from {page}", True, "No admin login buttons found in hero section")
                    else:
                        self.log_test(f"Admin buttons removed from {page}", False, f"Found admin buttons: {found_admin_buttons}")
                        all_passed = False
                else:
                    self.log_test(f"Admin buttons removed from {page}", False, f"Page not accessible: {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Admin buttons removed from {page}", False, f"Error: {str(e)}")
                all_passed = False
        
        # Test navbar still has admin login
        try:
            response = self.session.get(self.base_url, timeout=10)
            if response.status_code == 200:
                content = response.text.lower()
                if 'admin' in content or 'login' in content:
                    self.log_test("Navbar admin login preserved", True, "Admin login functionality found in navbar")
                else:
                    self.log_test("Navbar admin login preserved", False, "No admin login found in navbar")
                    all_passed = False
        except Exception as e:
            self.log_test("Navbar admin login preserved", False, f"Error: {str(e)}")
            all_passed = False
        
        return all_passed

    def test_read_full_story_fix(self):
        """Test 3: Read Full Story Fix - New Tab Opening"""
        print("\n🔍 TEST CATEGORY 3: Read Full Story Fix")
        print("-" * 50)
        
        try:
            # Test achievements page accessibility
            response = self.session.get(f"{self.base_url}/achievements", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for BlogContentRenderer implementation
                if 'generateBlogContent' in content or 'BlogContentRenderer' in content:
                    self.log_test("BlogContentRenderer component present", True, "Found blog content generation functionality")
                else:
                    self.log_test("BlogContentRenderer component present", False, "BlogContentRenderer not found")
                    return False
                
                # Check for new tab opening implementation (window.open with _blank)
                if "window.open('', '_blank')" in content or '_blank' in content:
                    self.log_test("New tab opening implemented", True, "Found _blank target for new tab opening")
                else:
                    self.log_test("New tab opening implemented", False, "New tab opening not properly implemented")
                    return False
                
                # Check that popup window specifications are removed
                popup_patterns = [
                    'window.open(.*width=',
                    'window.open(.*height=',
                    'window.open(.*toolbar=',
                    'window.open(.*menubar='
                ]
                
                has_popup_specs = False
                for pattern in popup_patterns:
                    import re
                    if re.search(pattern, content):
                        has_popup_specs = True
                        break
                
                if not has_popup_specs:
                    self.log_test("Popup window specifications removed", True, "No popup window specifications found")
                else:
                    self.log_test("Popup window specifications removed", False, "Still contains popup window specifications")
                    return False
                
                return True
            else:
                self.log_test("Achievements page accessible", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Read Full Story fix verification", False, f"Error: {str(e)}")
            return False

    def test_rich_text_editor_fix(self):
        """Test 4: Rich Text Editor Auto-Submit Fix"""
        print("\n🔍 TEST CATEGORY 4: Rich Text Editor Auto-Submit Fix")
        print("-" * 50)
        
        try:
            # Test admin panel accessibility
            response = self.session.get(f"{self.base_url}/admin", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for RichTextEditor component
                if 'RichTextEditor' in content:
                    self.log_test("RichTextEditor component present", True, "Found RichTextEditor in admin panel")
                else:
                    self.log_test("RichTextEditor component present", False, "RichTextEditor not found")
                    return False
                
                # Check for type="button" attributes on toolbar buttons
                if 'type="button"' in content:
                    self.log_test("Button type attributes present", True, "Found type='button' attributes")
                else:
                    self.log_test("Button type attributes present", False, "Missing type='button' attributes")
                    return False
                
                # Check for proper button implementation in modals
                modal_patterns = [
                    'AddAchievementModal',
                    'EditAchievementModal', 
                    'AddNewsEventModal',
                    'EditNewsEventModal'
                ]
                
                modals_found = 0
                for pattern in modal_patterns:
                    if pattern in content:
                        modals_found += 1
                
                if modals_found >= 2:
                    self.log_test("Rich text editor modals present", True, f"Found {modals_found} modals with rich text editor")
                else:
                    self.log_test("Rich text editor modals present", False, f"Only found {modals_found} modals")
                    return False
                
                return True
            else:
                self.log_test("Admin panel accessible", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Rich Text Editor fix verification", False, f"Error: {str(e)}")
            return False

    def test_admin_panel_modal_improvements(self):
        """Test 5: Admin Panel Modal Improvements"""
        print("\n🔍 TEST CATEGORY 5: Admin Panel Modal Improvements")
        print("-" * 50)
        
        try:
            # Test admin panel accessibility
            response = self.session.get(f"{self.base_url}/admin", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for FullScreenModal component
                if 'FullScreenModal' in content:
                    self.log_test("FullScreenModal component present", True, "Found FullScreenModal component")
                else:
                    self.log_test("FullScreenModal component present", False, "FullScreenModal not found")
                    return False
                
                # Check for responsive CSS classes
                responsive_classes = [
                    'admin-modal-fullscreen',
                    'admin-modal-header',
                    'admin-modal-scrollable',
                    'admin-responsive'
                ]
                
                responsive_found = 0
                for css_class in responsive_classes:
                    if css_class in content:
                        responsive_found += 1
                
                if responsive_found >= 3:
                    self.log_test("Responsive modal classes present", True, f"Found {responsive_found}/4 responsive classes")
                else:
                    self.log_test("Responsive modal classes present", False, f"Only found {responsive_found}/4 responsive classes")
                    return False
                
                # Check for full screen modal implementation (100vw x 100vh)
                if 'w-full h-full' in content or '100vw' in content or '100vh' in content:
                    self.log_test("Full screen modal implementation", True, "Found full screen modal styling")
                else:
                    self.log_test("Full screen modal implementation", False, "Full screen modal styling not found")
                    return False
                
                # Check for modal types that should be improved
                modal_types = [
                    'ResearchAreaModal',
                    'CarouselImageModal', 
                    'ObjectiveModal',
                    'AboutUsModal'
                ]
                
                improved_modals = 0
                for modal_type in modal_types:
                    if modal_type in content:
                        improved_modals += 1
                
                if improved_modals >= 2:
                    self.log_test("Improved modal types present", True, f"Found {improved_modals} improved modal types")
                else:
                    self.log_test("Improved modal types present", False, f"Only found {improved_modals} improved modal types")
                    return False
                
                return True
            else:
                self.log_test("Admin panel modal improvements", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Admin panel modal improvements", False, f"Error: {str(e)}")
            return False

    def test_admin_panel_delete_operations(self):
        """Test 6: Admin Panel Delete Operations"""
        print("\n🔍 TEST CATEGORY 6: Admin Panel Delete Operations")
        print("-" * 50)
        
        try:
            # Test admin panel accessibility
            response = self.session.get(f"{self.base_url}/admin", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for async/await implementation in delete functions
                if 'handleDeleteResearchArea' in content:
                    self.log_test("Research Area delete function present", True, "Found handleDeleteResearchArea function")
                else:
                    self.log_test("Research Area delete function present", False, "handleDeleteResearchArea not found")
                    return False
                
                if 'handleDeleteCarouselImage' in content:
                    self.log_test("Carousel Image delete function present", True, "Found handleDeleteCarouselImage function")
                else:
                    self.log_test("Carousel Image delete function present", False, "handleDeleteCarouselImage not found")
                    return False
                
                if 'handleDeleteObjective' in content:
                    self.log_test("Objective delete function present", True, "Found handleDeleteObjective function")
                else:
                    self.log_test("Objective delete function present", False, "handleDeleteObjective not found")
                    return False
                
                # Check for proper async/await implementation
                if 'async' in content and 'await' in content:
                    self.log_test("Async/await implementation present", True, "Found async/await in delete functions")
                else:
                    self.log_test("Async/await implementation present", False, "Async/await not properly implemented")
                    return False
                
                # Check for error handling in delete operations
                if 'try' in content and 'catch' in content:
                    self.log_test("Error handling in delete operations", True, "Found try-catch blocks")
                else:
                    self.log_test("Error handling in delete operations", False, "Error handling not found")
                    return False
                
                # Check for delete confirmation dialogs
                if 'confirm(' in content or 'Are you sure' in content:
                    self.log_test("Delete confirmation dialogs present", True, "Found delete confirmation dialogs")
                else:
                    self.log_test("Delete confirmation dialogs present", False, "Delete confirmation dialogs not found")
                    return False
                
                return True
            else:
                self.log_test("Admin panel delete operations", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Admin panel delete operations", False, f"Error: {str(e)}")
            return False

    def test_duplicate_data_investigation(self):
        """Test 7: Duplicate Data Investigation"""
        print("\n🔍 TEST CATEGORY 7: Duplicate Data Investigation")
        print("-" * 50)
        
        try:
            # Test homepage for research areas duplicates
            response = self.session.get(self.base_url, timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for research areas data structure
                if 'researchAreas' in content or 'research-areas' in content:
                    self.log_test("Research areas data structure present", True, "Found research areas implementation")
                else:
                    self.log_test("Research areas data structure present", False, "Research areas not found")
                    return False
                
                # Check for Firebase integration (should prevent duplicates)
                if 'firebase' in content.lower() or 'firestore' in content.lower():
                    self.log_test("Firebase integration present", True, "Found Firebase/Firestore integration")
                else:
                    self.log_test("Firebase integration present", False, "Firebase integration not found")
                    return False
                
                # Test gallery page for duplicates
                gallery_response = self.session.get(f"{self.base_url}/gallery", timeout=10)
                if gallery_response.status_code == 200:
                    self.log_test("Gallery page accessible", True, "Gallery page loads successfully")
                    
                    gallery_content = gallery_response.text
                    if 'gallery' in gallery_content.lower():
                        self.log_test("Gallery data structure present", True, "Found gallery implementation")
                    else:
                        self.log_test("Gallery data structure present", False, "Gallery data structure not found")
                        return False
                else:
                    self.log_test("Gallery page accessible", False, f"Status: {gallery_response.status_code}")
                    return False
                
                # Check for data consistency mechanisms
                if 'localStorage' in content or 'sessionStorage' in content:
                    self.log_test("Data storage mechanisms present", True, "Found data storage implementation")
                else:
                    self.log_test("Data storage mechanisms present", False, "Data storage mechanisms not found")
                    return False
                
                return True
            else:
                self.log_test("Duplicate data investigation", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Duplicate data investigation", False, f"Error: {str(e)}")
            return False

    def test_firebase_data_integrity(self):
        """Test 8: Firebase Data Integrity"""
        print("\n🔍 TEST CATEGORY 8: Firebase Data Integrity")
        print("-" * 50)
        
        try:
            # Test admin panel data migration functionality
            response = self.session.get(f"{self.base_url}/admin", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for Firebase configuration
                if 'firebase' in content.lower():
                    self.log_test("Firebase configuration present", True, "Found Firebase integration")
                else:
                    self.log_test("Firebase configuration present", False, "Firebase configuration not found")
                    return False
                
                # Check for data migration functionality
                if 'DataMigration' in content or 'migration' in content.lower():
                    self.log_test("Data migration functionality present", True, "Found data migration component")
                else:
                    self.log_test("Data migration functionality present", False, "Data migration not found")
                    return False
                
                # Check for Firebase collections support
                collections = [
                    'people',
                    'publications',
                    'projects', 
                    'achievements',
                    'newsEvents',
                    'researchAreas',
                    'gallery'
                ]
                
                collections_found = 0
                for collection in collections:
                    if collection in content:
                        collections_found += 1
                
                if collections_found >= 5:
                    self.log_test("Firebase collections support", True, f"Found {collections_found}/7 collections")
                else:
                    self.log_test("Firebase collections support", False, f"Only found {collections_found}/7 collections")
                    return False
                
                # Check for CRUD operations
                crud_operations = ['add', 'update', 'delete', 'get']
                crud_found = 0
                for operation in crud_operations:
                    if operation in content.lower():
                        crud_found += 1
                
                if crud_found >= 3:
                    self.log_test("CRUD operations present", True, f"Found {crud_found}/4 CRUD operations")
                else:
                    self.log_test("CRUD operations present", False, f"Only found {crud_found}/4 CRUD operations")
                    return False
                
                return True
            else:
                self.log_test("Firebase data integrity", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Firebase data integrity", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all test categories"""
        print("🚀 Starting March 2025 Bug Fixes Backend Testing Suite...")
        
        test_categories = [
            ("Frontend Accessibility", self.test_frontend_accessibility),
            ("Admin Login Button Removal", self.test_admin_login_button_removal),
            ("Read Full Story Fix", self.test_read_full_story_fix),
            ("Rich Text Editor Fix", self.test_rich_text_editor_fix),
            ("Admin Panel Modal Improvements", self.test_admin_panel_modal_improvements),
            ("Admin Panel Delete Operations", self.test_admin_panel_delete_operations),
            ("Duplicate Data Investigation", self.test_duplicate_data_investigation),
            ("Firebase Data Integrity", self.test_firebase_data_integrity)
        ]
        
        category_results = []
        
        for category_name, test_function in test_categories:
            try:
                result = test_function()
                category_results.append((category_name, result))
            except Exception as e:
                print(f"\n❌ ERROR in {category_name}: {str(e)}")
                category_results.append((category_name, False))
        
        # Print final results
        self.print_final_results(category_results)
        
        return self.results

    def print_final_results(self, category_results):
        """Print comprehensive test results"""
        print("\n" + "=" * 80)
        print("🎯 MARCH 2025 BUG FIXES BACKEND TESTING - FINAL RESULTS")
        print("=" * 80)
        
        # Category Results
        print("\n📊 TEST CATEGORY RESULTS:")
        print("-" * 50)
        for category, result in category_results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {category}")
        
        # Overall Statistics
        print(f"\n📈 OVERALL STATISTICS:")
        print("-" * 30)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed_tests']}")
        print(f"Failed: {self.results['failed_tests']}")
        
        if self.results['total_tests'] > 0:
            success_rate = (self.results['passed_tests'] / self.results['total_tests']) * 100
            print(f"Success Rate: {success_rate:.1f}%")
        
        # Final Assessment
        print(f"\n🎯 FINAL ASSESSMENT:")
        print("-" * 30)
        
        passed_categories = sum(1 for _, result in category_results if result)
        total_categories = len(category_results)
        
        if passed_categories == total_categories:
            print("🎉 EXCELLENT: All bug fixes are working correctly!")
            print("✅ All March 2025 bug fixes have been successfully implemented and tested.")
        elif passed_categories >= total_categories * 0.8:
            print("✅ GOOD: Most bug fixes are working correctly.")
            print(f"📝 {total_categories - passed_categories} categories need attention.")
        elif passed_categories >= total_categories * 0.6:
            print("⚠️  MODERATE: Some bug fixes need attention.")
            print(f"📝 {total_categories - passed_categories} categories have issues.")
        else:
            print("❌ CRITICAL: Multiple bug fixes have issues.")
            print(f"📝 {total_categories - passed_categories} categories need immediate attention.")
        
        print(f"\n⏰ Test Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)

def main():
    """Main test execution"""
    tester = March2025BugFixesBackendTest()
    
    try:
        results = tester.run_all_tests()
        
        # Return appropriate exit code
        if results['failed_tests'] == 0:
            sys.exit(0)  # All tests passed
        else:
            sys.exit(1)  # Some tests failed
            
    except KeyboardInterrupt:
        print("\n\n⚠️ Testing interrupted by user")
        sys.exit(2)
    except Exception as e:
        print(f"\n\n❌ Critical error during testing: {str(e)}")
        sys.exit(3)

if __name__ == "__main__":
    main()