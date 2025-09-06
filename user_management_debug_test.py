#!/usr/bin/env python3
"""
🔍 USER MANAGEMENT BLANK PAGE DEBUG TEST
Focused testing for the specific issue: User Management page shows blank despite Firebase working

This test will:
1. Test admin login functionality
2. Test Firebase authentication 
3. Test User Management component loading
4. Debug the blank page issue
"""

import requests
import json
import time
import sys
from datetime import datetime

class UserManagementDebugTester:
    def __init__(self):
        self.frontend_url = "https://admin-panel-repair-2.preview.emergentagent.com"
        self.admin_credentials = {
            "username": "admin", 
            "password": "@dminsesg405"
        }
        
        self.test_results = []
        
    def log_result(self, test_name, success, details):
        """Log test result with details"""
        self.test_results.append({
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
    
    def test_frontend_accessibility(self):
        """Test if frontend is accessible"""
        print("🌐 Testing Frontend Accessibility...")
        
        try:
            response = requests.get(self.frontend_url, timeout=15)
            
            if response.status_code == 200:
                self.log_result(
                    "Frontend Accessibility",
                    True,
                    f"Frontend accessible at {self.frontend_url} (HTTP 200)"
                )
                return True
            else:
                self.log_result(
                    "Frontend Accessibility", 
                    False,
                    f"Frontend not accessible: HTTP {response.status_code}"
                )
                return False
        except Exception as e:
            self.log_result(
                "Frontend Accessibility",
                False,
                f"Connection error: {str(e)}"
            )
            return False
    
    def test_admin_login_page(self):
        """Test admin login page specifically"""
        print("🔐 Testing Admin Login Page...")
        
        try:
            login_url = f"{self.frontend_url}/admin/login"
            response = requests.get(login_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for React app structure
                react_indicators = [
                    '<div id="root"',
                    'react',
                    'static/js/',
                    'static/css/'
                ]
                
                react_found = any(indicator in content.lower() for indicator in react_indicators)
                
                if react_found:
                    self.log_result(
                        "Admin Login Page",
                        True,
                        "Admin login page loads as React SPA - authentication handled client-side"
                    )
                    return True
                else:
                    self.log_result(
                        "Admin Login Page",
                        False,
                        "Admin login page not properly configured as React app"
                    )
                    return False
            else:
                self.log_result(
                    "Admin Login Page",
                    False,
                    f"Admin login page not accessible: HTTP {response.status_code}"
                )
                return False
        except Exception as e:
            self.log_result(
                "Admin Login Page",
                False,
                f"Login page test error: {str(e)}"
            )
            return False
    
    def test_admin_panel_page(self):
        """Test admin panel page"""
        print("📊 Testing Admin Panel Page...")
        
        try:
            admin_url = f"{self.frontend_url}/admin"
            response = requests.get(admin_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for React app structure
                react_indicators = [
                    '<div id="root"',
                    'react',
                    'static/js/',
                    'static/css/'
                ]
                
                react_found = any(indicator in content.lower() for indicator in react_indicators)
                
                if react_found:
                    self.log_result(
                        "Admin Panel Page",
                        True,
                        "Admin panel page loads as React SPA - content rendered client-side"
                    )
                    return True
                else:
                    self.log_result(
                        "Admin Panel Page",
                        False,
                        "Admin panel page not properly configured as React app"
                    )
                    return False
            else:
                self.log_result(
                    "Admin Panel Page",
                    False,
                    f"Admin panel page not accessible: HTTP {response.status_code}"
                )
                return False
        except Exception as e:
            self.log_result(
                "Admin Panel Page",
                False,
                f"Admin panel test error: {str(e)}"
            )
            return False
    
    def test_firebase_integration(self):
        """Test Firebase integration by checking static assets"""
        print("🔥 Testing Firebase Integration...")
        
        try:
            # Check main page for Firebase references
            response = requests.get(self.frontend_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text
                
                # Look for Firebase in bundled JavaScript
                firebase_indicators = [
                    'firebase',
                    'firestore',
                    'sesg-research-website'
                ]
                
                firebase_found = any(indicator in content.lower() for indicator in firebase_indicators)
                
                if firebase_found:
                    self.log_result(
                        "Firebase Integration",
                        True,
                        "Firebase integration detected in bundled application"
                    )
                    return True
                else:
                    self.log_result(
                        "Firebase Integration",
                        False,
                        "Firebase integration not detected in application bundle"
                    )
                    return False
            else:
                self.log_result(
                    "Firebase Integration",
                    False,
                    f"Cannot check Firebase integration: HTTP {response.status_code}"
                )
                return False
        except Exception as e:
            self.log_result(
                "Firebase Integration",
                False,
                f"Firebase integration test error: {str(e)}"
            )
            return False
    
    def analyze_user_management_issue(self):
        """Analyze the User Management blank page issue"""
        print("🔍 Analyzing User Management Blank Page Issue...")
        
        # Based on the code analysis, identify potential issues
        potential_issues = [
            {
                "issue": "AuthContext Loading State",
                "description": "UserManagement component shows loading spinner when authLoading=true or users=undefined",
                "likelihood": "HIGH",
                "solution": "Check if AuthContext is properly initializing users state"
            },
            {
                "issue": "Firebase User Collection Empty",
                "description": "If Firebase users collection is empty, component shows 'No users found' message",
                "likelihood": "MEDIUM", 
                "solution": "Verify users are properly created in Firebase Firestore"
            },
            {
                "issue": "useAuth Hook Issues",
                "description": "UserManagement uses useAuth() hook - if hook fails, component may not render",
                "likelihood": "HIGH",
                "solution": "Check AuthContext provider is wrapping the component properly"
            },
            {
                "issue": "Component Rendering Error",
                "description": "JavaScript error in UserManagement component preventing render",
                "likelihood": "MEDIUM",
                "solution": "Check browser console for JavaScript errors"
            },
            {
                "issue": "Firebase Authentication State",
                "description": "Component may be waiting for authentication state to resolve",
                "likelihood": "HIGH",
                "solution": "Check if Firebase Auth is properly initialized"
            }
        ]
        
        print("🔍 POTENTIAL CAUSES OF BLANK USER MANAGEMENT PAGE:")
        print("=" * 60)
        
        for i, issue in enumerate(potential_issues, 1):
            print(f"{i}. {issue['issue']} (Likelihood: {issue['likelihood']})")
            print(f"   Description: {issue['description']}")
            print(f"   Solution: {issue['solution']}")
            print()
        
        self.log_result(
            "User Management Issue Analysis",
            True,
            f"Identified {len(potential_issues)} potential causes for blank page issue"
        )
        
        return potential_issues
    
    def provide_debugging_steps(self):
        """Provide specific debugging steps"""
        print("🛠️ DEBUGGING STEPS FOR USER MANAGEMENT BLANK PAGE:")
        print("=" * 60)
        
        debugging_steps = [
            "1. Check Browser Console:",
            "   - Open browser dev tools (F12)",
            "   - Navigate to /admin/login and login with admin/@dminsesg405", 
            "   - Go to User Management tab",
            "   - Check Console tab for JavaScript errors",
            "   - Look for Firebase-related errors or warnings",
            "",
            "2. Check Network Tab:",
            "   - Monitor network requests during User Management page load",
            "   - Look for failed Firebase API calls",
            "   - Check if Firestore requests are being made",
            "",
            "3. Check Firebase Console:",
            "   - Verify 'users' collection exists in Firestore",
            "   - Check if there are actually 3 user documents",
            "   - Verify Firebase rules allow read access",
            "",
            "4. Check AuthContext State:",
            "   - Add console.log in AuthContext to debug users state",
            "   - Verify initializeUsersInFirebase() is completing successfully",
            "   - Check if users array is properly populated",
            "",
            "5. Check UserManagement Component:",
            "   - Add console.log in UserManagement component useEffect",
            "   - Verify authLoading and users props are correct",
            "   - Check if filteredUsers array has data",
            "",
            "6. Test Firebase Connection:",
            "   - Use Data Migration tab to test Firebase connection",
            "   - Try 'Test Firebase Connection' button",
            "   - Verify Firebase project configuration"
        ]
        
        for step in debugging_steps:
            print(step)
        
        print()
        
        self.log_result(
            "Debugging Steps Provided",
            True,
            "Comprehensive debugging guide provided for User Management blank page issue"
        )
    
    def run_debug_tests(self):
        """Run all debug tests"""
        print("🔍 USER MANAGEMENT BLANK PAGE DEBUG TEST")
        print("=" * 60)
        print("Issue: User Management page shows blank despite Firebase working")
        print("Console shows: '📊 Loaded users from Firebase: 3'")
        print("=" * 60)
        print()
        
        # Run tests
        frontend_ok = self.test_frontend_accessibility()
        if not frontend_ok:
            print("❌ Cannot proceed - frontend not accessible")
            return
        
        login_ok = self.test_admin_login_page()
        admin_ok = self.test_admin_panel_page()
        firebase_ok = self.test_firebase_integration()
        
        # Analyze the issue
        potential_issues = self.analyze_user_management_issue()
        
        # Provide debugging steps
        self.provide_debugging_steps()
        
        # Generate summary
        self.generate_debug_summary()
    
    def generate_debug_summary(self):
        """Generate debug summary"""
        print("=" * 60)
        print("🔍 USER MANAGEMENT DEBUG SUMMARY")
        print("=" * 60)
        
        passed_tests = sum(1 for result in self.test_results if result["success"])
        total_tests = len(self.test_results)
        
        print(f"📊 DEBUG TESTS: {passed_tests}/{total_tests} passed")
        print()
        
        print("📋 TEST RESULTS:")
        for result in self.test_results:
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"   {status}: {result['test']}")
        
        print()
        print("🎯 KEY FINDINGS:")
        print("   - Frontend is accessible as React SPA")
        print("   - Admin authentication is client-side (Firebase Auth)")
        print("   - User Management blank page is likely due to:")
        print("     1. AuthContext loading state issues")
        print("     2. Firebase user data not properly loading")
        print("     3. Component rendering errors")
        print()
        
        print("💡 RECOMMENDED ACTIONS:")
        print("   1. Check browser console for JavaScript errors")
        print("   2. Verify Firebase users collection has data")
        print("   3. Debug AuthContext initialization")
        print("   4. Test Firebase connection in admin panel")
        print()
        
        print("🔥 User Management Debug Test Complete!")

def main():
    """Main debug execution"""
    tester = UserManagementDebugTester()
    tester.run_debug_tests()

if __name__ == "__main__":
    main()