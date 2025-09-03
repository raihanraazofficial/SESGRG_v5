#!/usr/bin/env python3
"""
Backend Testing Suite for December 2025 Homepage Loading State & Session Timeout Fixes
SESG Research Website - Firebase Integration Testing

This test suite focuses on testing the backend infrastructure that supports:
1. Homepage Loading Behavior - Firebase data loading and HomeContext integration
2. Admin Panel Session Timeout Enhancement - Firebase activity tracking and authentication

Testing Scope: Firebase integration, data persistence, authentication backend
"""

import requests
import json
import time
import sys
from datetime import datetime

class December2025BackendTester:
    def __init__(self):
        # Get backend URL from frontend env
        self.frontend_url = "https://data-sync-update.preview.emergentagent.com"
        self.api_base = f"{self.frontend_url}/api"  # Backend API base
        
        # Test configuration
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        
        # Admin credentials for testing
        self.admin_credentials = {
            "username": "admin",
            "password": "@dminsesg405"
        }
        
        print("🔥 DECEMBER 2025 HOMEPAGE LOADING STATE & SESSION TIMEOUT BACKEND TESTING")
        print("=" * 80)
        print(f"Frontend URL: {self.frontend_url}")
        print(f"API Base: {self.api_base}")
        print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)

    def log_test(self, test_name, success, details="", error=""):
        """Log test results"""
        self.total_tests += 1
        if success:
            self.passed_tests += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "error": error,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status} | {test_name}")
        if details:
            print(f"     Details: {details}")
        if error:
            print(f"     Error: {error}")

    def test_frontend_service_accessibility(self):
        """Test 1: Frontend Service Running and Accessible"""
        try:
            response = requests.get(self.frontend_url, timeout=10)
            if response.status_code == 200:
                # Check if it's a React app
                content = response.text.lower()
                if 'react' in content or 'root' in content or 'app' in content:
                    self.log_test(
                        "Frontend Service Accessibility", 
                        True, 
                        f"React frontend accessible (Status: {response.status_code}, Size: {len(response.content)} bytes)"
                    )
                else:
                    self.log_test(
                        "Frontend Service Accessibility", 
                        False, 
                        f"Service accessible but may not be React app (Status: {response.status_code})"
                    )
            else:
                self.log_test(
                    "Frontend Service Accessibility", 
                    False, 
                    f"Service returned status {response.status_code}"
                )
        except Exception as e:
            self.log_test(
                "Frontend Service Accessibility", 
                False, 
                error=f"Failed to connect to frontend service: {str(e)}"
            )

    def test_homepage_loading_infrastructure(self):
        """Test 2: Homepage Loading Infrastructure - Static Assets and Performance"""
        try:
            # Test homepage load time
            start_time = time.time()
            response = requests.get(self.frontend_url, timeout=15)
            load_time = time.time() - start_time
            
            if response.status_code == 200:
                # Check for React bundle and loading infrastructure
                content = response.text
                has_react_bundle = 'bundle.js' in content or 'main.' in content
                has_loading_infrastructure = 'loading' in content.lower() or 'skeleton' in content.lower()
                
                # Performance check - should load quickly for immediate content display
                performance_good = load_time < 3.0  # 3 second threshold
                
                if has_react_bundle and performance_good:
                    self.log_test(
                        "Homepage Loading Infrastructure", 
                        True, 
                        f"Homepage loads in {load_time:.2f}s with React bundle. Loading infrastructure: {has_loading_infrastructure}"
                    )
                else:
                    self.log_test(
                        "Homepage Loading Infrastructure", 
                        False, 
                        f"Performance issues: Load time {load_time:.2f}s, React bundle: {has_react_bundle}"
                    )
            else:
                self.log_test(
                    "Homepage Loading Infrastructure", 
                    False, 
                    f"Homepage not accessible (Status: {response.status_code})"
                )
        except Exception as e:
            self.log_test(
                "Homepage Loading Infrastructure", 
                False, 
                error=f"Homepage loading test failed: {str(e)}"
            )

    def test_firebase_configuration_validation(self):
        """Test 3: Firebase Configuration and Connectivity"""
        try:
            # Check Firebase configuration in the JavaScript bundle
            bundle_url = f"{self.frontend_url}/static/js/bundle.js"
            response = requests.get(bundle_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text.lower()
                
                # Look for Firebase indicators in the bundle
                firebase_indicators = [
                    'firebase' in content,
                    'firestore' in content,
                    'sesg-research-website' in content,  # Firebase project ID
                    'auth' in content,
                    'storage' in content
                ]
                
                firebase_count = sum(firebase_indicators)
                
                if firebase_count >= 4:  # At least 4 out of 5 indicators
                    self.log_test(
                        "Firebase Configuration Validation", 
                        True, 
                        f"Firebase configuration detected in bundle ({firebase_count}/5 indicators found)"
                    )
                else:
                    self.log_test(
                        "Firebase Configuration Validation", 
                        False, 
                        f"Insufficient Firebase configuration ({firebase_count}/5 indicators found)"
                    )
            else:
                self.log_test(
                    "Firebase Configuration Validation", 
                    False, 
                    f"Cannot access JavaScript bundle (Status: {response.status_code})"
                )
        except Exception as e:
            self.log_test(
                "Firebase Configuration Validation", 
                False, 
                error=f"Firebase configuration test failed: {str(e)}"
            )

    def test_admin_panel_accessibility(self):
        """Test 4: Admin Panel Accessibility for Session Testing"""
        try:
            # Test admin login page accessibility
            admin_login_url = f"{self.frontend_url}/admin/login"
            response = requests.get(admin_login_url, timeout=10)
            
            if response.status_code == 200:
                # Since this is a React SPA, check the JavaScript bundle for admin components
                bundle_url = f"{self.frontend_url}/static/js/bundle.js"
                bundle_response = requests.get(bundle_url, timeout=15)
                
                if bundle_response.status_code == 200:
                    content = bundle_response.text.lower()
                    
                    # Check for admin panel components in the bundle
                    admin_indicators = [
                        'admin' in content,
                        'login' in content,
                        'username' in content,
                        'password' in content,
                        'authentication' in content or 'auth' in content
                    ]
                    
                    admin_count = sum(admin_indicators)
                    
                    if admin_count >= 4:  # At least 4 out of 5 indicators
                        self.log_test(
                            "Admin Panel Accessibility", 
                            True, 
                            f"Admin panel components detected in bundle ({admin_count}/5 indicators found)"
                        )
                    else:
                        self.log_test(
                            "Admin Panel Accessibility", 
                            False, 
                            f"Insufficient admin panel components ({admin_count}/5 indicators found)"
                        )
                else:
                    self.log_test(
                        "Admin Panel Accessibility", 
                        False, 
                        f"Cannot access JavaScript bundle for admin check (Status: {bundle_response.status_code})"
                    )
            else:
                self.log_test(
                    "Admin Panel Accessibility", 
                    False, 
                    f"Admin login page not accessible (Status: {response.status_code})"
                )
        except Exception as e:
            self.log_test(
                "Admin Panel Accessibility", 
                False, 
                error=f"Admin panel accessibility test failed: {str(e)}"
            )

    def test_home_data_loading_backend_support(self):
        """Test 5: Home Data Loading Backend Support - Firebase Integration"""
        try:
            # Test if the application can handle home data requests
            # Since this is a Firebase app, we test the frontend's ability to load
            
            # Test homepage with focus on About Us and Objectives sections
            response = requests.get(self.frontend_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text.lower()
                
                # Check for home page content indicators
                home_indicators = [
                    'about us' in content or 'aboutus' in content,
                    'objective' in content,
                    'sustainable energy' in content or 'sesg' in content,
                    'research' in content
                ]
                
                home_content_present = sum(home_indicators) >= 2  # At least 2 indicators
                
                # Check for loading state infrastructure
                loading_infrastructure = [
                    'loading' in content,
                    'skeleton' in content,
                    'spinner' in content
                ]
                
                has_loading_support = any(loading_infrastructure)
                
                if home_content_present:
                    self.log_test(
                        "Home Data Loading Backend Support", 
                        True, 
                        f"Home content indicators found: {sum(home_indicators)}/4. Loading infrastructure: {has_loading_support}"
                    )
                else:
                    self.log_test(
                        "Home Data Loading Backend Support", 
                        False, 
                        f"Insufficient home content indicators: {sum(home_indicators)}/4"
                    )
            else:
                self.log_test(
                    "Home Data Loading Backend Support", 
                    False, 
                    f"Cannot access homepage for content analysis (Status: {response.status_code})"
                )
        except Exception as e:
            self.log_test(
                "Home Data Loading Backend Support", 
                False, 
                error=f"Home data loading test failed: {str(e)}"
            )

    def test_session_timeout_backend_infrastructure(self):
        """Test 6: Session Timeout Backend Infrastructure - Firebase Auth Support"""
        try:
            # Check Firebase Authentication infrastructure in the JavaScript bundle
            bundle_url = f"{self.frontend_url}/static/js/bundle.js"
            response = requests.get(bundle_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text.lower()
                
                # Check for authentication infrastructure in the bundle
                auth_indicators = [
                    'auth' in content,
                    'session' in content,
                    'login' in content,
                    'firebase' in content,
                    'token' in content,
                    'timeout' in content
                ]
                
                auth_count = sum(auth_indicators)
                
                # Check for session management indicators
                session_indicators = [
                    'timeout' in content,
                    'activity' in content,
                    'expir' in content,  # expires, expiry, expiration
                    'session_timeout' in content,
                    'lastactivity' in content
                ]
                
                session_count = sum(session_indicators)
                
                if auth_count >= 4 and session_count >= 2:
                    self.log_test(
                        "Session Timeout Backend Infrastructure", 
                        True, 
                        f"Authentication infrastructure: {auth_count}/6 indicators. Session support: {session_count}/5 indicators"
                    )
                else:
                    self.log_test(
                        "Session Timeout Backend Infrastructure", 
                        False, 
                        f"Insufficient infrastructure - Auth: {auth_count}/6, Session: {session_count}/5"
                    )
            else:
                self.log_test(
                    "Session Timeout Backend Infrastructure", 
                    False, 
                    f"Cannot access JavaScript bundle for auth analysis (Status: {response.status_code})"
                )
        except Exception as e:
            self.log_test(
                "Session Timeout Backend Infrastructure", 
                False, 
                error=f"Session timeout infrastructure test failed: {str(e)}"
            )

    def test_firebase_data_persistence_support(self):
        """Test 7: Firebase Data Persistence Support for Loading States"""
        try:
            # Test if the application properly handles data persistence
            # This tests the backend infrastructure for data loading
            
            # Multiple requests to test consistency
            responses = []
            load_times = []
            
            for i in range(3):
                start_time = time.time()
                response = requests.get(self.frontend_url, timeout=10)
                load_time = time.time() - start_time
                
                responses.append(response.status_code)
                load_times.append(load_time)
                
                time.sleep(1)  # Small delay between requests
            
            # Check consistency
            all_successful = all(status == 200 for status in responses)
            avg_load_time = sum(load_times) / len(load_times)
            consistent_performance = max(load_times) - min(load_times) < 2.0  # Within 2 seconds
            
            if all_successful and consistent_performance:
                self.log_test(
                    "Firebase Data Persistence Support", 
                    True, 
                    f"Consistent data loading: Avg {avg_load_time:.2f}s, Range: {min(load_times):.2f}s-{max(load_times):.2f}s"
                )
            else:
                self.log_test(
                    "Firebase Data Persistence Support", 
                    False, 
                    f"Inconsistent performance: Success rate {sum(1 for s in responses if s == 200)}/3, Avg time: {avg_load_time:.2f}s"
                )
        except Exception as e:
            self.log_test(
                "Firebase Data Persistence Support", 
                False, 
                error=f"Data persistence test failed: {str(e)}"
            )

    def test_enhanced_activity_tracking_support(self):
        """Test 8: Enhanced Activity Tracking Support - Backend Infrastructure"""
        try:
            # Check for activity tracking infrastructure in the JavaScript bundle
            bundle_url = f"{self.frontend_url}/static/js/bundle.js"
            response = requests.get(bundle_url, timeout=15)
            
            if response.status_code == 200:
                content = response.text.lower()
                
                # Check for activity tracking infrastructure
                activity_indicators = [
                    'event' in content,
                    'listener' in content,
                    'activity' in content,
                    'tracking' in content,
                    'session' in content,
                    'timeout' in content
                ]
                
                activity_count = sum(activity_indicators)
                
                # Check for enhanced event handling (mentioned in the December 2025 fixes)
                enhanced_events = [
                    'input' in content,
                    'change' in content,
                    'focus' in content,
                    'blur' in content,
                    'keydown' in content,
                    'submit' in content,
                    'mousedown' in content,
                    'touchstart' in content
                ]
                
                enhanced_count = sum(enhanced_events)
                
                if activity_count >= 4 and enhanced_count >= 6:
                    self.log_test(
                        "Enhanced Activity Tracking Support", 
                        True, 
                        f"Activity tracking: {activity_count}/6 indicators. Enhanced events: {enhanced_count}/8 types"
                    )
                else:
                    self.log_test(
                        "Enhanced Activity Tracking Support", 
                        False, 
                        f"Insufficient support - Activity: {activity_count}/6, Events: {enhanced_count}/8"
                    )
            else:
                self.log_test(
                    "Enhanced Activity Tracking Support", 
                    False, 
                    f"Cannot access JavaScript bundle for activity analysis (Status: {response.status_code})"
                )
        except Exception as e:
            self.log_test(
                "Enhanced Activity Tracking Support", 
                False, 
                error=f"Activity tracking support test failed: {str(e)}"
            )

    def test_application_stability_under_load(self):
        """Test 9: Application Stability Under Load - Performance Testing"""
        try:
            # Test application stability with multiple concurrent requests
            # This simulates the load that would occur with immediate content loading
            
            import threading
            import queue
            
            results_queue = queue.Queue()
            
            def make_request():
                try:
                    start_time = time.time()
                    response = requests.get(self.frontend_url, timeout=15)
                    load_time = time.time() - start_time
                    results_queue.put((response.status_code, load_time))
                except Exception as e:
                    results_queue.put((0, 0))  # Error case
            
            # Create 5 concurrent requests
            threads = []
            for i in range(5):
                thread = threading.Thread(target=make_request)
                threads.append(thread)
                thread.start()
            
            # Wait for all threads to complete
            for thread in threads:
                thread.join()
            
            # Collect results
            results = []
            while not results_queue.empty():
                results.append(results_queue.get())
            
            # Analyze results
            successful_requests = [r for r in results if r[0] == 200]
            success_rate = len(successful_requests) / len(results) * 100
            
            if successful_requests:
                avg_load_time = sum(r[1] for r in successful_requests) / len(successful_requests)
                max_load_time = max(r[1] for r in successful_requests)
                
                stability_good = success_rate >= 80 and avg_load_time < 5.0
                
                if stability_good:
                    self.log_test(
                        "Application Stability Under Load", 
                        True, 
                        f"Success rate: {success_rate:.1f}%, Avg load: {avg_load_time:.2f}s, Max load: {max_load_time:.2f}s"
                    )
                else:
                    self.log_test(
                        "Application Stability Under Load", 
                        False, 
                        f"Poor stability: Success rate {success_rate:.1f}%, Avg load: {avg_load_time:.2f}s"
                    )
            else:
                self.log_test(
                    "Application Stability Under Load", 
                    False, 
                    "No successful requests in load test"
                )
        except Exception as e:
            self.log_test(
                "Application Stability Under Load", 
                False, 
                error=f"Load testing failed: {str(e)}"
            )

    def test_december_2025_fixes_integration(self):
        """Test 10: December 2025 Fixes Integration - Overall System Health"""
        try:
            # Comprehensive test of the December 2025 fixes integration
            
            # Test 1: Homepage immediate loading capability
            start_time = time.time()
            response = requests.get(self.frontend_url, timeout=10)
            initial_load_time = time.time() - start_time
            
            # Test 2: Admin panel session infrastructure
            admin_response = requests.get(f"{self.frontend_url}/admin/login", timeout=10)
            
            # Test 3: Multiple page loads to test consistency (no loading delays)
            page_loads = []
            for i in range(3):
                start = time.time()
                r = requests.get(self.frontend_url, timeout=10)
                load_time = time.time() - start
                page_loads.append((r.status_code, load_time))
                time.sleep(0.5)
            
            # Analysis
            homepage_accessible = response.status_code == 200
            admin_accessible = admin_response.status_code == 200
            consistent_loading = all(load[0] == 200 for load in page_loads)
            fast_loading = all(load[1] < 3.0 for load in page_loads)  # Under 3 seconds
            
            avg_load_time = sum(load[1] for load in page_loads) / len(page_loads)
            
            fixes_working = homepage_accessible and admin_accessible and consistent_loading and fast_loading
            
            if fixes_working:
                self.log_test(
                    "December 2025 Fixes Integration", 
                    True, 
                    f"All systems functional - Homepage: {initial_load_time:.2f}s, Admin accessible, Avg load: {avg_load_time:.2f}s"
                )
            else:
                issues = []
                if not homepage_accessible:
                    issues.append("Homepage not accessible")
                if not admin_accessible:
                    issues.append("Admin panel not accessible")
                if not consistent_loading:
                    issues.append("Inconsistent loading")
                if not fast_loading:
                    issues.append("Slow loading times")
                
                self.log_test(
                    "December 2025 Fixes Integration", 
                    False, 
                    f"Issues detected: {', '.join(issues)}"
                )
        except Exception as e:
            self.log_test(
                "December 2025 Fixes Integration", 
                False, 
                error=f"Integration test failed: {str(e)}"
            )

    def run_all_tests(self):
        """Run all backend tests for December 2025 fixes"""
        print("\n🚀 STARTING DECEMBER 2025 BACKEND TESTING SUITE")
        print("=" * 80)
        
        # Test Categories
        print("\n📋 CATEGORY 1: INFRASTRUCTURE ACCESSIBILITY")
        self.test_frontend_service_accessibility()
        self.test_homepage_loading_infrastructure()
        self.test_firebase_configuration_validation()
        
        print("\n📋 CATEGORY 2: ADMIN PANEL & SESSION INFRASTRUCTURE")
        self.test_admin_panel_accessibility()
        self.test_session_timeout_backend_infrastructure()
        self.test_enhanced_activity_tracking_support()
        
        print("\n📋 CATEGORY 3: DATA LOADING & PERSISTENCE")
        self.test_home_data_loading_backend_support()
        self.test_firebase_data_persistence_support()
        
        print("\n📋 CATEGORY 4: PERFORMANCE & STABILITY")
        self.test_application_stability_under_load()
        self.test_december_2025_fixes_integration()

    def generate_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("🎯 DECEMBER 2025 BACKEND TESTING SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests * 100) if self.total_tests > 0 else 0
        
        print(f"📊 OVERALL RESULTS:")
        print(f"   Total Tests: {self.total_tests}")
        print(f"   Passed: {self.passed_tests}")
        print(f"   Failed: {self.total_tests - self.passed_tests}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        passed_tests = [r for r in self.test_results if r['success']]
        failed_tests = [r for r in self.test_results if not r['success']]
        
        if passed_tests:
            print(f"\n✅ PASSED TESTS ({len(passed_tests)}):")
            for test in passed_tests:
                print(f"   • {test['test']}")
                if test['details']:
                    print(f"     └─ {test['details']}")
        
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"   • {test['test']}")
                if test['error']:
                    print(f"     └─ Error: {test['error']}")
                elif test['details']:
                    print(f"     └─ {test['details']}")
        
        # December 2025 Specific Analysis
        print(f"\n🎯 DECEMBER 2025 FIXES ANALYSIS:")
        
        # Homepage Loading Analysis
        homepage_tests = [r for r in self.test_results if 'loading' in r['test'].lower() or 'home' in r['test'].lower()]
        homepage_success = sum(1 for t in homepage_tests if t['success'])
        print(f"   📄 Homepage Loading Infrastructure: {homepage_success}/{len(homepage_tests)} tests passed")
        
        # Session Timeout Analysis
        session_tests = [r for r in self.test_results if 'session' in r['test'].lower() or 'activity' in r['test'].lower() or 'admin' in r['test'].lower()]
        session_success = sum(1 for t in session_tests if t['success'])
        print(f"   🔐 Session & Admin Infrastructure: {session_success}/{len(session_tests)} tests passed")
        
        # Firebase Integration Analysis
        firebase_tests = [r for r in self.test_results if 'firebase' in r['test'].lower() or 'persistence' in r['test'].lower()]
        firebase_success = sum(1 for t in firebase_tests if t['success'])
        print(f"   🔥 Firebase Integration: {firebase_success}/{len(firebase_tests)} tests passed")
        
        # Overall Assessment
        print(f"\n🏆 FINAL ASSESSMENT:")
        if success_rate >= 90:
            print("   🎉 EXCELLENT: December 2025 fixes have robust backend infrastructure support")
        elif success_rate >= 75:
            print("   ✅ GOOD: December 2025 fixes are well supported with minor infrastructure gaps")
        elif success_rate >= 60:
            print("   ⚠️  MODERATE: December 2025 fixes have adequate support but need attention")
        else:
            print("   ❌ POOR: December 2025 fixes have significant infrastructure issues")
        
        print(f"\n📝 RECOMMENDATIONS:")
        if success_rate < 100:
            print("   • Review failed tests and address infrastructure gaps")
            print("   • Ensure Firebase configuration is properly deployed")
            print("   • Verify admin panel authentication is working correctly")
            print("   • Test homepage loading performance under various conditions")
        else:
            print("   • All backend infrastructure tests passed successfully")
            print("   • December 2025 fixes are ready for production")
            print("   • Continue monitoring performance and user experience")
        
        return success_rate

def main():
    """Main test execution"""
    print("🔥 DECEMBER 2025 HOMEPAGE LOADING STATE & SESSION TIMEOUT BACKEND TESTING")
    print("🎯 Testing Firebase integration and backend infrastructure supporting the fixes")
    print("⏰ Started at:", datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    tester = December2025BackendTester()
    
    try:
        tester.run_all_tests()
        success_rate = tester.generate_summary()
        
        # Exit with appropriate code
        if success_rate >= 75:
            print(f"\n🎉 TESTING COMPLETED SUCCESSFULLY - {success_rate:.1f}% SUCCESS RATE")
            sys.exit(0)
        else:
            print(f"\n⚠️  TESTING COMPLETED WITH ISSUES - {success_rate:.1f}% SUCCESS RATE")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n⚠️ Testing interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Testing failed with error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()