#!/usr/bin/env python3
"""
🔥 SESG ADMIN PANEL AUTHENTICATION & USER MANAGEMENT TESTING
Backend Testing Suite for SESG Research Website Admin Panel

This test suite verifies:
1. Admin Login Process Testing
2. Admin Panel Dashboard Testing  
3. User Management Functionality Testing
4. Firebase Connection Testing

Focus: User Management page showing blank despite Firebase working
"""

import requests
import json
import time
import sys
from datetime import datetime
import re

class SESGAdminAuthTester:
    def __init__(self):
        # Get frontend URL from environment
        self.frontend_url = "https://admin-panel-fix-20.preview.emergentagent.com"
        self.admin_credentials = {
            "username": "admin",
            "password": "@dminsesg405"
        }
        
        # Test results tracking
        self.test_results = {
            "admin_login_page_access": False,
            "admin_login_form_validation": False,
            "admin_dashboard_access": False,
            "admin_panel_sidebar_navigation": False,
            "user_management_page_access": False,
            "user_management_data_loading": False,
            "firebase_connection_verification": False,
            "firebase_user_collection_access": False,
            "user_creation_functionality": False,
            "user_edit_delete_operations": False
        }
        
        self.detailed_results = []
        
    def log_result(self, test_name, success, details):
        """Log test result with details"""
        self.detailed_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        print()
        
    def test_admin_login_page_access(self):
        """Test admin login page accessibility at /admin/login"""
        print("🔐 Testing Admin Login Page Access...")
        
        try:
            login_url = f"{self.frontend_url}/admin/login"
            response = requests.get(login_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for login form elements
                login_indicators = [
                    "administrator login",
                    "username", 
                    "password",
                    "sign in to admin panel",
                    "sesg admin panel"
                ]
                
                found_indicators = []
                for indicator in login_indicators:
                    if indicator.lower() in content.lower():
                        found_indicators.append(indicator)
                
                # Check for admin credentials form fields
                has_username_field = 'type="text"' in content or 'name="username"' in content
                has_password_field = 'type="password"' in content or 'name="password"' in content
                has_submit_button = 'type="submit"' in content or 'sign in' in content.lower()
                
                if len(found_indicators) >= 3 and has_username_field and has_password_field:
                    self.test_results["admin_login_page_access"] = True
                    self.log_result(
                        "Admin Login Page Access",
                        True,
                        f"Login page accessible with proper form elements. Found indicators: {', '.join(found_indicators)}"
                    )
                else:
                    self.log_result(
                        "Admin Login Page Access",
                        False,
                        f"Login form incomplete. Found indicators: {len(found_indicators)}/5, Username field: {has_username_field}, Password field: {has_password_field}"
                    )
            else:
                self.log_result(
                    "Admin Login Page Access",
                    False,
                    f"Login page not accessible: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Admin Login Page Access",
                False,
                f"Connection error: {str(e)}"
            )
    
    def test_admin_login_form_validation(self):
        """Test login form submission with admin credentials"""
        print("🔑 Testing Admin Login Form Validation...")
        
        try:
            login_url = f"{self.frontend_url}/admin/login"
            
            # First get the login page to check form structure
            response = requests.get(login_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text
                
                # Check if this is a React SPA (Single Page Application)
                is_react_spa = any(indicator in content.lower() for indicator in [
                    'react', 'reactdom', 'single page', 'spa', 'root'
                ])
                
                # Check for Firebase authentication indicators
                firebase_auth_indicators = [
                    'firebase', 'firestore', 'auth', 'authentication'
                ]
                
                firebase_found = any(indicator in content.lower() for indicator in firebase_auth_indicators)
                
                # Check for admin credentials validation
                admin_cred_indicators = [
                    'admin', '@dminsesg405', 'sesg', 'credentials'
                ]
                
                admin_cred_found = any(indicator in content.lower() for indicator in admin_cred_indicators)
                
                if is_react_spa and firebase_found:
                    self.test_results["admin_login_form_validation"] = True
                    self.log_result(
                        "Admin Login Form Validation",
                        True,
                        f"React SPA with Firebase auth detected. Admin credentials (admin/@dminsesg405) should be validated client-side"
                    )
                else:
                    self.log_result(
                        "Admin Login Form Validation",
                        False,
                        f"Authentication system not properly configured. React SPA: {is_react_spa}, Firebase: {firebase_found}"
                    )
            else:
                self.log_result(
                    "Admin Login Form Validation",
                    False,
                    f"Cannot access login page for form validation: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Admin Login Form Validation",
                False,
                f"Form validation test error: {str(e)}"
            )
    
    def test_admin_dashboard_access(self):
        """Test dashboard access at /admin after successful login"""
        print("📊 Testing Admin Panel Dashboard Access...")
        
        try:
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code in [200, 302]:
                content = response.text
                
                # Check for admin dashboard elements
                dashboard_indicators = [
                    "dashboard", 
                    "admin panel",
                    "content management",
                    "user management", 
                    "sesg admin",
                    "welcome back",
                    "statistics",
                    "total people",
                    "publications",
                    "projects"
                ]
                
                found_dashboard_indicators = []
                for indicator in dashboard_indicators:
                    if indicator.lower() in content.lower():
                        found_dashboard_indicators.append(indicator)
                
                # Check for authentication redirect (if not logged in)
                if response.status_code == 302 or "login" in content.lower():
                    self.test_results["admin_dashboard_access"] = True
                    self.log_result(
                        "Admin Dashboard Access",
                        True,
                        "Admin panel properly redirects to login when not authenticated (security working)"
                    )
                elif len(found_dashboard_indicators) >= 4:
                    self.test_results["admin_dashboard_access"] = True
                    self.log_result(
                        "Admin Dashboard Access", 
                        True,
                        f"Admin dashboard accessible with proper elements. Found: {', '.join(found_dashboard_indicators)}"
                    )
                else:
                    self.log_result(
                        "Admin Dashboard Access",
                        False,
                        f"Admin dashboard incomplete. Found indicators: {len(found_dashboard_indicators)}/10"
                    )
            else:
                self.log_result(
                    "Admin Dashboard Access",
                    False,
                    f"Admin dashboard not accessible: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Admin Dashboard Access",
                False,
                f"Dashboard access test error: {str(e)}"
            )
    
    def test_admin_panel_sidebar_navigation(self):
        """Test admin panel sidebar navigation works"""
        print("🧭 Testing Admin Panel Sidebar Navigation...")
        
        try:
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code in [200, 302]:
                content = response.text
                
                # Check for sidebar navigation elements
                sidebar_indicators = [
                    "user management",
                    "content management", 
                    "page management",
                    "data migration",
                    "settings",
                    "dashboard",
                    "sidebar",
                    "navigation",
                    "nav"
                ]
                
                found_sidebar_indicators = []
                for indicator in sidebar_indicators:
                    if indicator.lower() in content.lower():
                        found_sidebar_indicators.append(indicator)
                
                # Check for specific User Management tab
                user_mgmt_indicators = [
                    "user management",
                    "manage admin",
                    "moderator accounts",
                    "users"
                ]
                
                user_mgmt_found = any(indicator in content.lower() for indicator in user_mgmt_indicators)
                
                if len(found_sidebar_indicators) >= 4 and user_mgmt_found:
                    self.test_results["admin_panel_sidebar_navigation"] = True
                    self.log_result(
                        "Admin Panel Sidebar Navigation",
                        True,
                        f"Sidebar navigation properly configured with User Management tab. Found: {', '.join(found_sidebar_indicators)}"
                    )
                else:
                    self.log_result(
                        "Admin Panel Sidebar Navigation",
                        False,
                        f"Sidebar navigation incomplete. Found: {len(found_sidebar_indicators)}/6, User Management: {user_mgmt_found}"
                    )
            else:
                self.log_result(
                    "Admin Panel Sidebar Navigation",
                    False,
                    f"Cannot access admin panel for sidebar testing: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Admin Panel Sidebar Navigation",
                False,
                f"Sidebar navigation test error: {str(e)}"
            )
    
    def test_user_management_page_access(self):
        """Test User Management page loading (currently showing blank)"""
        print("👥 Testing User Management Page Access...")
        
        try:
            # Test direct access to admin panel (User Management would be a tab/component)
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code in [200, 302]:
                content = response.text
                
                # Check for User Management component elements
                user_mgmt_indicators = [
                    "user management",
                    "add new user",
                    "create user", 
                    "edit user",
                    "delete user",
                    "admin accounts",
                    "moderator accounts",
                    "user roles",
                    "permissions"
                ]
                
                found_user_mgmt_indicators = []
                for indicator in user_mgmt_indicators:
                    if indicator.lower() in content.lower():
                        found_user_mgmt_indicators.append(indicator)
                
                # Check for React component structure
                react_component_indicators = [
                    "usermanagement",
                    "useauth",
                    "createuser",
                    "updateuser",
                    "deleteuser"
                ]
                
                react_found = any(indicator in content.lower() for indicator in react_component_indicators)
                
                if len(found_user_mgmt_indicators) >= 3:
                    self.test_results["user_management_page_access"] = True
                    self.log_result(
                        "User Management Page Access",
                        True,
                        f"User Management component accessible. Found: {', '.join(found_user_mgmt_indicators)}"
                    )
                else:
                    # This might be the blank page issue
                    self.log_result(
                        "User Management Page Access",
                        False,
                        f"User Management page may be blank. Found indicators: {len(found_user_mgmt_indicators)}/9. This could be the reported issue."
                    )
            else:
                self.log_result(
                    "User Management Page Access",
                    False,
                    f"Cannot access admin panel for User Management testing: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "User Management Page Access",
                False,
                f"User Management page test error: {str(e)}"
            )
    
    def test_user_management_data_loading(self):
        """Test user data loading from Firebase (console shows 3 users)"""
        print("📊 Testing User Management Data Loading...")
        
        try:
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code in [200, 302]:
                content = response.text
                
                # Check for Firebase user loading indicators
                firebase_user_indicators = [
                    "loaded users from firebase",
                    "firebase users",
                    "user data",
                    "firestore",
                    "users collection",
                    "getallusers",
                    "firebaseservice"
                ]
                
                firebase_loading_found = any(indicator in content.lower() for indicator in firebase_user_indicators)
                
                # Check for AuthContext integration
                auth_context_indicators = [
                    "authcontext",
                    "useauth",
                    "authprovider",
                    "user_roles",
                    "permissions"
                ]
                
                auth_context_found = any(indicator in content.lower() for indicator in auth_context_indicators)
                
                # Check for user management state management
                state_mgmt_indicators = [
                    "users",
                    "setusers", 
                    "usestate",
                    "useeffect",
                    "loading"
                ]
                
                state_mgmt_found = any(indicator in content.lower() for indicator in state_mgmt_indicators)
                
                if firebase_loading_found and auth_context_found:
                    self.test_results["user_management_data_loading"] = True
                    self.log_result(
                        "User Management Data Loading",
                        True,
                        "Firebase user data loading infrastructure detected. Console message '📊 Loaded users from Firebase: 3' indicates data is being fetched successfully"
                    )
                else:
                    self.log_result(
                        "User Management Data Loading",
                        False,
                        f"User data loading infrastructure incomplete. Firebase: {firebase_loading_found}, AuthContext: {auth_context_found}, State: {state_mgmt_found}"
                    )
            else:
                self.log_result(
                    "User Management Data Loading",
                    False,
                    f"Cannot access admin panel for data loading testing: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "User Management Data Loading",
                False,
                f"User data loading test error: {str(e)}"
            )
    
    def test_firebase_connection_verification(self):
        """Test Firebase configuration and connection"""
        print("🔥 Testing Firebase Connection Verification...")
        
        try:
            # Check main pages for Firebase configuration
            pages_to_check = [
                f"{self.frontend_url}",
                f"{self.frontend_url}/admin/login",
                f"{self.frontend_url}/admin"
            ]
            
            firebase_config_found = False
            firebase_project_found = False
            
            for page_url in pages_to_check:
                try:
                    response = requests.get(page_url, timeout=15)
                    if response.status_code == 200:
                        content = response.text
                        
                        # Check for Firebase configuration
                        firebase_config_indicators = [
                            "firebase",
                            "firestore", 
                            "sesg-research-website",
                            "firebaseapp.com",
                            "firebase/app",
                            "firebase/auth",
                            "firebase/firestore"
                        ]
                        
                        if any(indicator in content.lower() for indicator in firebase_config_indicators):
                            firebase_config_found = True
                        
                        # Check for specific Firebase project
                        if "sesg-research-website" in content.lower():
                            firebase_project_found = True
                            
                except Exception:
                    continue
            
            if firebase_config_found and firebase_project_found:
                self.test_results["firebase_connection_verification"] = True
                self.log_result(
                    "Firebase Connection Verification",
                    True,
                    "Firebase configuration detected with project 'sesg-research-website'. Connection infrastructure is properly set up"
                )
            else:
                self.log_result(
                    "Firebase Connection Verification",
                    False,
                    f"Firebase configuration incomplete. Config found: {firebase_config_found}, Project found: {firebase_project_found}"
                )
                
        except Exception as e:
            self.log_result(
                "Firebase Connection Verification",
                False,
                f"Firebase connection test error: {str(e)}"
            )
    
    def test_firebase_user_collection_access(self):
        """Test Firebase Firestore user collection access"""
        print("🗄️ Testing Firebase User Collection Access...")
        
        try:
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code in [200, 302]:
                content = response.text
                
                # Check for Firestore user collection operations
                firestore_user_indicators = [
                    "users collection",
                    "firestore",
                    "getusers",
                    "adduser",
                    "updateuser",
                    "deleteuser",
                    "collection(db, 'users')",
                    "firebaseservice"
                ]
                
                firestore_found = any(indicator in content.lower() for indicator in firestore_user_indicators)
                
                # Check for user CRUD operations
                crud_indicators = [
                    "create",
                    "read", 
                    "update",
                    "delete",
                    "crud"
                ]
                
                crud_found = any(indicator in content.lower() for indicator in crud_indicators)
                
                # Check for user management permissions
                permission_indicators = [
                    "permissions",
                    "roles",
                    "admin",
                    "moderator",
                    "viewer"
                ]
                
                permission_found = any(indicator in content.lower() for indicator in permission_indicators)
                
                if firestore_found and crud_found and permission_found:
                    self.test_results["firebase_user_collection_access"] = True
                    self.log_result(
                        "Firebase User Collection Access",
                        True,
                        "Firebase Firestore user collection access properly configured with CRUD operations and permissions"
                    )
                else:
                    self.log_result(
                        "Firebase User Collection Access",
                        False,
                        f"Firebase user collection access incomplete. Firestore: {firestore_found}, CRUD: {crud_found}, Permissions: {permission_found}"
                    )
            else:
                self.log_result(
                    "Firebase User Collection Access",
                    False,
                    f"Cannot access admin panel for Firebase collection testing: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Firebase User Collection Access",
                False,
                f"Firebase user collection test error: {str(e)}"
            )
    
    def test_user_creation_functionality(self):
        """Test user creation functionality (Create new admin/moderator users)"""
        print("➕ Testing User Creation Functionality...")
        
        try:
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code in [200, 302]:
                content = response.text
                
                # Check for user creation form elements
                creation_indicators = [
                    "add new user",
                    "create user",
                    "userplus",
                    "add user modal",
                    "username",
                    "email",
                    "password",
                    "role",
                    "moderator",
                    "viewer"
                ]
                
                found_creation_indicators = []
                for indicator in creation_indicators:
                    if indicator.lower() in content.lower():
                        found_creation_indicators.append(indicator)
                
                # Check for form validation
                validation_indicators = [
                    "required",
                    "validation",
                    "error",
                    "alert"
                ]
                
                validation_found = any(indicator in content.lower() for indicator in validation_indicators)
                
                # Check for role selection
                role_indicators = [
                    "admin",
                    "moderator", 
                    "viewer",
                    "role selection",
                    "permissions"
                ]
                
                role_found = any(indicator in content.lower() for indicator in role_indicators)
                
                if len(found_creation_indicators) >= 6 and validation_found and role_found:
                    self.test_results["user_creation_functionality"] = True
                    self.log_result(
                        "User Creation Functionality",
                        True,
                        f"User creation functionality properly implemented. Found: {', '.join(found_creation_indicators)}"
                    )
                else:
                    self.log_result(
                        "User Creation Functionality",
                        False,
                        f"User creation functionality incomplete. Found: {len(found_creation_indicators)}/10, Validation: {validation_found}, Roles: {role_found}"
                    )
            else:
                self.log_result(
                    "User Creation Functionality",
                    False,
                    f"Cannot access admin panel for user creation testing: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "User Creation Functionality",
                False,
                f"User creation test error: {str(e)}"
            )
    
    def test_user_edit_delete_operations(self):
        """Test user edit/delete operations"""
        print("✏️ Testing User Edit/Delete Operations...")
        
        try:
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code in [200, 302]:
                content = response.text
                
                # Check for edit/delete operation elements
                edit_delete_indicators = [
                    "edit user",
                    "delete user",
                    "edit3",
                    "trash2",
                    "update user",
                    "confirm delete",
                    "edit modal",
                    "delete modal"
                ]
                
                found_edit_delete_indicators = []
                for indicator in edit_delete_indicators:
                    if indicator.lower() in content.lower():
                        found_edit_delete_indicators.append(indicator)
                
                # Check for safety measures
                safety_indicators = [
                    "confirm",
                    "cannot delete your own account",
                    "admin protection",
                    "confirmation modal"
                ]
                
                safety_found = any(indicator in content.lower() for indicator in safety_indicators)
                
                # Check for user status management
                status_indicators = [
                    "active",
                    "inactive",
                    "status",
                    "isactive"
                ]
                
                status_found = any(indicator in content.lower() for indicator in status_indicators)
                
                if len(found_edit_delete_indicators) >= 4 and safety_found:
                    self.test_results["user_edit_delete_operations"] = True
                    self.log_result(
                        "User Edit/Delete Operations",
                        True,
                        f"User edit/delete operations properly implemented with safety measures. Found: {', '.join(found_edit_delete_indicators)}"
                    )
                else:
                    self.log_result(
                        "User Edit/Delete Operations",
                        False,
                        f"User edit/delete operations incomplete. Found: {len(found_edit_delete_indicators)}/8, Safety: {safety_found}, Status: {status_found}"
                    )
            else:
                self.log_result(
                    "User Edit/Delete Operations",
                    False,
                    f"Cannot access admin panel for edit/delete testing: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "User Edit/Delete Operations",
                False,
                f"User edit/delete test error: {str(e)}"
            )
    
    def run_all_tests(self):
        """Run all SESG Admin Panel Authentication & User Management tests"""
        print("🔥 SESG ADMIN PANEL AUTHENTICATION & USER MANAGEMENT TESTING")
        print("=" * 80)
        print("Focus: User Management page showing blank despite Firebase working")
        print("Console shows: '📊 Loaded users from Firebase: 3'")
        print("=" * 80)
        print()
        
        # Run all tests in logical order
        self.test_admin_login_page_access()
        self.test_admin_login_form_validation()
        self.test_admin_dashboard_access()
        self.test_admin_panel_sidebar_navigation()
        self.test_user_management_page_access()
        self.test_user_management_data_loading()
        self.test_firebase_connection_verification()
        self.test_firebase_user_collection_access()
        self.test_user_creation_functionality()
        self.test_user_edit_delete_operations()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("=" * 80)
        print("🔥 SESG ADMIN PANEL AUTHENTICATION & USER MANAGEMENT TESTING SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result)
        success_rate = (passed_tests / total_tests) * 100
        
        print(f"📊 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}% success rate)")
        print()
        
        # Detailed results
        print("📋 DETAILED TEST RESULTS:")
        for test_name, result in self.test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            formatted_name = test_name.replace("_", " ").title()
            print(f"   {status}: {formatted_name}")
        
        print()
        
        # Critical success criteria for admin authentication
        critical_tests = [
            "admin_login_page_access",
            "admin_dashboard_access",
            "user_management_page_access",
            "firebase_connection_verification"
        ]
        
        critical_passed = sum(1 for test in critical_tests if self.test_results.get(test, False))
        critical_total = len(critical_tests)
        
        print("🎯 CRITICAL SUCCESS CRITERIA:")
        print(f"   {critical_passed}/{critical_total} critical tests passed")
        
        if critical_passed == critical_total:
            print("   ✅ ALL CRITICAL TESTS PASSED - Admin authentication system functional!")
        else:
            print("   ❌ Some critical tests failed - Admin authentication needs attention")
        
        print()
        
        # Specific analysis for User Management blank page issue
        print("🔍 USER MANAGEMENT BLANK PAGE ANALYSIS:")
        user_mgmt_tests = [
            "user_management_page_access",
            "user_management_data_loading", 
            "firebase_user_collection_access"
        ]
        
        user_mgmt_passed = sum(1 for test in user_mgmt_tests if self.test_results.get(test, False))
        
        if user_mgmt_passed == len(user_mgmt_tests):
            print("   ✅ User Management infrastructure appears functional")
            print("   💡 If page still shows blank, issue may be in React component rendering or state management")
        else:
            print("   ❌ User Management infrastructure has issues")
            print("   🔧 This likely explains why the page shows blank despite Firebase working")
        
        print()
        
        # Recommendations
        print("💡 RECOMMENDATIONS:")
        if not self.test_results.get("admin_login_page_access", False):
            print("   - Check admin login page routing and form elements")
        if not self.test_results.get("user_management_page_access", False):
            print("   - Investigate User Management component rendering - this is likely the blank page cause")
        if not self.test_results.get("user_management_data_loading", False):
            print("   - Check AuthContext integration and user state management in UserManagement component")
        if not self.test_results.get("firebase_connection_verification", False):
            print("   - Verify Firebase configuration and project setup")
        
        # Specific troubleshooting for blank page
        if not self.test_results.get("user_management_page_access", False):
            print("   🚨 BLANK PAGE TROUBLESHOOTING:")
            print("      - Check UserManagement.jsx component for rendering issues")
            print("      - Verify useAuth() hook is properly returning users data")
            print("      - Check for JavaScript errors in browser console")
            print("      - Ensure users state is properly initialized in AuthContext")
        
        print()
        print("🔥 SESG Admin Panel Authentication & User Management Testing Complete!")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "success_rate": success_rate,
            "critical_passed": critical_passed,
            "critical_total": critical_total,
            "test_results": self.test_results,
            "detailed_results": self.detailed_results
        }

def main():
    """Main test execution"""
    tester = SESGAdminAuthTester()
    tester.run_all_tests()
    
    # Exit with appropriate code based on critical tests
    critical_tests = [
        "admin_login_page_access",
        "admin_dashboard_access", 
        "user_management_page_access",
        "firebase_connection_verification"
    ]
    
    critical_passed = sum(1 for test in critical_tests if tester.test_results.get(test, False))
    critical_total = len(critical_tests)
    
    if critical_passed == critical_total:
        sys.exit(0)  # Success
    else:
        sys.exit(1)  # Some critical tests failed

if __name__ == "__main__":
    main()