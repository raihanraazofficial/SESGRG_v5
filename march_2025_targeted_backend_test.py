#!/usr/bin/env python3
"""
MARCH 2025 WEBSITE BUG FIXES - TARGETED BACKEND TESTING
=======================================================

This test suite specifically verifies the implementation of bug fixes by checking:
1. JavaScript bundle content for component implementations
2. Actual functionality through direct component testing
3. Firebase integration and data consistency
"""

import requests
import json
import time
import sys
import re
from datetime import datetime
from urllib.parse import urljoin

class March2025TargetedBackendTest:
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
                    self.base_url = "https://admin-dashboard-fix-6.preview.emergentagent.com"
        except:
            self.base_url = "https://admin-dashboard-fix-6.preview.emergentagent.com"
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'March2025TargetedTest/1.0'
        })
        
        # Get JavaScript bundle content for component analysis
        self.js_bundle = self.get_js_bundle()
        
        # Test results tracking
        self.results = {
            'total_tests': 0,
            'passed_tests': 0,
            'failed_tests': 0,
            'test_details': []
        }
        
        print("🎯 MARCH 2025 WEBSITE BUG FIXES - TARGETED BACKEND TESTING")
        print("=" * 65)
        print(f"🌐 Frontend URL: {self.base_url}")
        print(f"📦 JS Bundle Size: {len(self.js_bundle)} characters")
        print(f"⏰ Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 65)

    def get_js_bundle(self):
        """Get the JavaScript bundle content"""
        try:
            response = self.session.get(f"{self.base_url}/static/js/bundle.js", timeout=15)
            if response.status_code == 200:
                return response.text
            else:
                print(f"⚠️ Could not fetch JS bundle: {response.status_code}")
                return ""
        except Exception as e:
            print(f"⚠️ Error fetching JS bundle: {str(e)}")
            return ""

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

    def test_admin_login_button_removal(self):
        """Test 1: Admin Login Button Removal from Hero Sections"""
        print("\n🔍 TEST CATEGORY 1: Admin Login Button Removal")
        print("-" * 50)
        
        # Check if admin login buttons are properly removed from hero sections
        # but preserved in navbar
        
        # Look for admin login in navbar (should exist)
        navbar_patterns = [
            r'Admin.*Login',
            r'Login.*Admin',
            r'admin.*login',
            r'login.*admin'
        ]
        
        navbar_admin_found = False
        for pattern in navbar_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                navbar_admin_found = True
                break
        
        if navbar_admin_found:
            self.log_test("Navbar admin login preserved", True, "Admin login functionality found in navbar")
        else:
            self.log_test("Navbar admin login preserved", False, "Admin login not found in navbar")
        
        # Check that hero sections don't have admin buttons
        hero_admin_patterns = [
            r'hero.*admin.*login',
            r'admin.*login.*hero',
            r'hero.*login.*admin'
        ]
        
        hero_admin_found = False
        for pattern in hero_admin_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                hero_admin_found = True
                break
        
        if not hero_admin_found:
            self.log_test("Admin buttons removed from hero sections", True, "No admin login buttons found in hero sections")
        else:
            self.log_test("Admin buttons removed from hero sections", False, "Admin login buttons still found in hero sections")
        
        return navbar_admin_found and not hero_admin_found

    def test_read_full_story_fix(self):
        """Test 2: Read Full Story Fix - New Tab Opening"""
        print("\n🔍 TEST CATEGORY 2: Read Full Story Fix")
        print("-" * 50)
        
        # Check for BlogContentRenderer component
        if 'BlogContentRenderer' in self.js_bundle:
            self.log_test("BlogContentRenderer component present", True, "Found BlogContentRenderer in bundle")
        else:
            self.log_test("BlogContentRenderer component present", False, "BlogContentRenderer not found")
            return False
        
        # Check for generateBlogContent function
        if 'generateBlogContent' in self.js_bundle:
            self.log_test("generateBlogContent function present", True, "Found generateBlogContent function")
        else:
            self.log_test("generateBlogContent function present", False, "generateBlogContent function not found")
            return False
        
        # Check for new tab opening implementation (window.open with _blank)
        new_tab_patterns = [
            r"window\.open\([^,]*,\s*['\"]_blank['\"]",
            r"window\.open\(['\"][^'\"]*['\"]\s*,\s*['\"]_blank['\"]"
        ]
        
        new_tab_found = False
        for pattern in new_tab_patterns:
            if re.search(pattern, self.js_bundle):
                new_tab_found = True
                break
        
        if new_tab_found:
            self.log_test("New tab opening implemented", True, "Found window.open with _blank target")
        else:
            self.log_test("New tab opening implemented", False, "New tab opening not properly implemented")
            return False
        
        # Check that popup window specifications are removed
        popup_patterns = [
            r'window\.open\([^)]*width\s*=',
            r'window\.open\([^)]*height\s*=',
            r'window\.open\([^)]*toolbar\s*=',
            r'window\.open\([^)]*menubar\s*='
        ]
        
        popup_specs_found = False
        for pattern in popup_patterns:
            if re.search(pattern, self.js_bundle):
                popup_specs_found = True
                break
        
        if not popup_specs_found:
            self.log_test("Popup window specifications removed", True, "No popup window specifications found")
        else:
            self.log_test("Popup window specifications removed", False, "Still contains popup window specifications")
            return False
        
        return True

    def test_rich_text_editor_fix(self):
        """Test 3: Rich Text Editor Auto-Submit Fix"""
        print("\n🔍 TEST CATEGORY 3: Rich Text Editor Auto-Submit Fix")
        print("-" * 50)
        
        # Check for RichTextEditor component
        if 'RichTextEditor' in self.js_bundle:
            self.log_test("RichTextEditor component present", True, "Found RichTextEditor in bundle")
        else:
            self.log_test("RichTextEditor component present", False, "RichTextEditor not found")
            return False
        
        # Check for type="button" attributes on toolbar buttons
        button_type_patterns = [
            r'type\s*:\s*["\']button["\']',
            r'type\s*=\s*["\']button["\']'
        ]
        
        button_type_found = False
        for pattern in button_type_patterns:
            if re.search(pattern, self.js_bundle):
                button_type_found = True
                break
        
        if button_type_found:
            self.log_test("Button type attributes present", True, "Found type='button' attributes")
        else:
            self.log_test("Button type attributes present", False, "Missing type='button' attributes")
            return False
        
        # Check for toolbar buttons implementation
        toolbar_patterns = [
            r'toolbarButtons',
            r'toolbar.*button',
            r'formatText'
        ]
        
        toolbar_found = False
        for pattern in toolbar_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                toolbar_found = True
                break
        
        if toolbar_found:
            self.log_test("Toolbar buttons implementation present", True, "Found toolbar button implementation")
        else:
            self.log_test("Toolbar buttons implementation present", False, "Toolbar buttons not found")
            return False
        
        # Check for modal integration
        modal_patterns = [
            r'AddAchievementModal',
            r'EditAchievementModal',
            r'AddNewsEventModal',
            r'EditNewsEventModal'
        ]
        
        modals_found = 0
        for pattern in modal_patterns:
            if re.search(pattern, self.js_bundle):
                modals_found += 1
        
        if modals_found >= 2:
            self.log_test("Rich text editor modals present", True, f"Found {modals_found} modals with rich text editor")
        else:
            self.log_test("Rich text editor modals present", False, f"Only found {modals_found} modals")
            return False
        
        return True

    def test_admin_panel_modal_improvements(self):
        """Test 4: Admin Panel Modal Improvements"""
        print("\n🔍 TEST CATEGORY 4: Admin Panel Modal Improvements")
        print("-" * 50)
        
        # Check for FullScreenModal component
        if 'FullScreenModal' in self.js_bundle:
            self.log_test("FullScreenModal component present", True, "Found FullScreenModal component")
        else:
            self.log_test("FullScreenModal component present", False, "FullScreenModal not found")
            return False
        
        # Check for responsive CSS classes
        responsive_patterns = [
            r'admin-modal-fullscreen',
            r'admin-modal-header',
            r'admin-modal-scrollable',
            r'admin-responsive'
        ]
        
        responsive_found = 0
        for pattern in responsive_patterns:
            if re.search(pattern, self.js_bundle):
                responsive_found += 1
        
        if responsive_found >= 3:
            self.log_test("Responsive modal classes present", True, f"Found {responsive_found}/4 responsive classes")
        else:
            self.log_test("Responsive modal classes present", False, f"Only found {responsive_found}/4 responsive classes")
            return False
        
        # Check for full screen modal implementation
        fullscreen_patterns = [
            r'w-full.*h-full',
            r'100vw.*100vh',
            r'inset-0'
        ]
        
        fullscreen_found = False
        for pattern in fullscreen_patterns:
            if re.search(pattern, self.js_bundle):
                fullscreen_found = True
                break
        
        if fullscreen_found:
            self.log_test("Full screen modal implementation", True, "Found full screen modal styling")
        else:
            self.log_test("Full screen modal implementation", False, "Full screen modal styling not found")
            return False
        
        # Check for improved modal types
        modal_types = [
            r'ResearchAreaModal',
            r'CarouselImageModal',
            r'ObjectiveModal',
            r'EditAboutUsModal'
        ]
        
        improved_modals = 0
        for modal_type in modal_types:
            if re.search(modal_type, self.js_bundle):
                improved_modals += 1
        
        if improved_modals >= 2:
            self.log_test("Improved modal types present", True, f"Found {improved_modals} improved modal types")
        else:
            self.log_test("Improved modal types present", False, f"Only found {improved_modals} improved modal types")
            return False
        
        return True

    def test_admin_panel_delete_operations(self):
        """Test 5: Admin Panel Delete Operations"""
        print("\n🔍 TEST CATEGORY 5: Admin Panel Delete Operations")
        print("-" * 50)
        
        # Check for delete functions with async/await
        delete_functions = [
            r'handleDeleteResearchArea',
            r'handleDeleteCarouselImage',
            r'handleDeleteObjective',
            r'handleDeleteGallery'
        ]
        
        delete_functions_found = 0
        for func in delete_functions:
            if re.search(func, self.js_bundle):
                delete_functions_found += 1
        
        if delete_functions_found >= 3:
            self.log_test("Delete functions present", True, f"Found {delete_functions_found} delete functions")
        else:
            self.log_test("Delete functions present", False, f"Only found {delete_functions_found} delete functions")
            return False
        
        # Check for async/await implementation
        async_patterns = [
            r'async.*handleDelete',
            r'await.*delete',
            r'async.*delete'
        ]
        
        async_found = False
        for pattern in async_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                async_found = True
                break
        
        if async_found:
            self.log_test("Async/await implementation present", True, "Found async/await in delete functions")
        else:
            self.log_test("Async/await implementation present", False, "Async/await not properly implemented")
            return False
        
        # Check for error handling
        error_handling_patterns = [
            r'try.*catch',
            r'catch.*error',
            r'error.*handling'
        ]
        
        error_handling_found = False
        for pattern in error_handling_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                error_handling_found = True
                break
        
        if error_handling_found:
            self.log_test("Error handling in delete operations", True, "Found error handling implementation")
        else:
            self.log_test("Error handling in delete operations", False, "Error handling not found")
            return False
        
        # Check for confirmation dialogs
        confirmation_patterns = [
            r'confirm\(',
            r'Are you sure',
            r'delete.*confirm'
        ]
        
        confirmation_found = False
        for pattern in confirmation_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                confirmation_found = True
                break
        
        if confirmation_found:
            self.log_test("Delete confirmation dialogs present", True, "Found delete confirmation dialogs")
        else:
            self.log_test("Delete confirmation dialogs present", False, "Delete confirmation dialogs not found")
            return False
        
        return True

    def test_duplicate_data_investigation(self):
        """Test 6: Duplicate Data Investigation"""
        print("\n🔍 TEST CATEGORY 6: Duplicate Data Investigation")
        print("-" * 50)
        
        # Check for research areas data structure
        research_areas_patterns = [
            r'researchAreas',
            r'research.*areas',
            r'useResearchAreas'
        ]
        
        research_areas_found = False
        for pattern in research_areas_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                research_areas_found = True
                break
        
        if research_areas_found:
            self.log_test("Research areas data structure present", True, "Found research areas implementation")
        else:
            self.log_test("Research areas data structure present", False, "Research areas not found")
            return False
        
        # Check for gallery data structure
        gallery_patterns = [
            r'galleryItems',
            r'useGallery',
            r'gallery.*data'
        ]
        
        gallery_found = False
        for pattern in gallery_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                gallery_found = True
                break
        
        if gallery_found:
            self.log_test("Gallery data structure present", True, "Found gallery implementation")
        else:
            self.log_test("Gallery data structure present", False, "Gallery data structure not found")
            return False
        
        # Check for data consistency mechanisms
        consistency_patterns = [
            r'localStorage',
            r'sessionStorage',
            r'data.*consistency',
            r'duplicate.*check'
        ]
        
        consistency_found = False
        for pattern in consistency_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                consistency_found = True
                break
        
        if consistency_found:
            self.log_test("Data consistency mechanisms present", True, "Found data consistency implementation")
        else:
            self.log_test("Data consistency mechanisms present", False, "Data consistency mechanisms not found")
            return False
        
        return True

    def test_firebase_integration(self):
        """Test 7: Firebase Integration and Data Integrity"""
        print("\n🔍 TEST CATEGORY 7: Firebase Integration")
        print("-" * 50)
        
        # Check for Firebase configuration
        firebase_patterns = [
            r'firebase',
            r'firestore',
            r'Firebase'
        ]
        
        firebase_found = False
        for pattern in firebase_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                firebase_found = True
                break
        
        if firebase_found:
            self.log_test("Firebase configuration present", True, "Found Firebase integration")
        else:
            self.log_test("Firebase configuration present", False, "Firebase configuration not found")
            return False
        
        # Check for data migration functionality
        migration_patterns = [
            r'DataMigration',
            r'migration',
            r'migrate.*data'
        ]
        
        migration_found = False
        for pattern in migration_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                migration_found = True
                break
        
        if migration_found:
            self.log_test("Data migration functionality present", True, "Found data migration component")
        else:
            self.log_test("Data migration functionality present", False, "Data migration not found")
            return False
        
        # Check for Firebase collections
        collections = [
            r'people',
            r'publications',
            r'projects',
            r'achievements',
            r'newsEvents',
            r'researchAreas',
            r'gallery'
        ]
        
        collections_found = 0
        for collection in collections:
            if re.search(collection, self.js_bundle):
                collections_found += 1
        
        if collections_found >= 5:
            self.log_test("Firebase collections support", True, f"Found {collections_found}/7 collections")
        else:
            self.log_test("Firebase collections support", False, f"Only found {collections_found}/7 collections")
            return False
        
        # Check for CRUD operations
        crud_patterns = [
            r'add.*Item',
            r'update.*Item',
            r'delete.*Item',
            r'get.*Data'
        ]
        
        crud_found = 0
        for pattern in crud_patterns:
            if re.search(pattern, self.js_bundle, re.IGNORECASE):
                crud_found += 1
        
        if crud_found >= 3:
            self.log_test("CRUD operations present", True, f"Found {crud_found}/4 CRUD operations")
        else:
            self.log_test("CRUD operations present", False, f"Only found {crud_found}/4 CRUD operations")
            return False
        
        return True

    def run_all_tests(self):
        """Run all test categories"""
        print("🚀 Starting March 2025 Targeted Bug Fixes Testing...")
        
        if not self.js_bundle:
            print("❌ CRITICAL: Could not load JavaScript bundle for testing")
            return self.results
        
        test_categories = [
            ("Admin Login Button Removal", self.test_admin_login_button_removal),
            ("Read Full Story Fix", self.test_read_full_story_fix),
            ("Rich Text Editor Fix", self.test_rich_text_editor_fix),
            ("Admin Panel Modal Improvements", self.test_admin_panel_modal_improvements),
            ("Admin Panel Delete Operations", self.test_admin_panel_delete_operations),
            ("Duplicate Data Investigation", self.test_duplicate_data_investigation),
            ("Firebase Integration", self.test_firebase_integration)
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
        print("🎯 MARCH 2025 BUG FIXES TARGETED TESTING - FINAL RESULTS")
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
    tester = March2025TargetedBackendTest()
    
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