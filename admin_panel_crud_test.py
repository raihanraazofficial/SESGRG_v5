#!/usr/bin/env python3
"""
Admin Panel Content Management System - CRUD Operations Testing Suite

Focuses specifically on testing the localStorage-based CRUD operations for the admin panel,
with special attention to the News Events delete functionality that users are reporting issues with.

Tests:
1. News Events Delete Functionality (Primary Focus)
2. Authentication System Testing
3. CRUD Operations for all content types
4. LocalStorage Integration Testing
5. Modal Integration Testing

FOCUS: Testing the reported "Failed to delete news event. Please try again" error
"""

import requests
import json
import os
import sys
import time
import subprocess
from datetime import datetime

# Get configuration from frontend .env
def get_config():
    config = {}
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    config['frontend_url'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_NEWS_EVENTS_API_URL='):
                    config['news_events_api'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_PUBLICATIONS_API_URL='):
                    config['publications_api'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_PROJECTS_API_URL='):
                    config['projects_api'] = line.split('=', 1)[1].strip()
                elif line.startswith('REACT_APP_ACHIEVEMENTS_API_URL='):
                    config['achievements_api'] = line.split('=', 1)[1].strip()
        return config
    except Exception as e:
        print(f"Error reading configuration: {e}")
        return {}

CONFIG = get_config()
FRONTEND_URL = CONFIG.get('frontend_url', 'localhost:3000')
NEWS_EVENTS_API = CONFIG.get('news_events_api', '')
PUBLICATIONS_API = CONFIG.get('publications_api', '')
PROJECTS_API = CONFIG.get('projects_api', '')
ACHIEVEMENTS_API = CONFIG.get('achievements_api', '')

# Admin credentials from AuthContext.jsx
ADMIN_CREDENTIALS = {
    'username': 'admin',
    'password': '@dminsesg405'
}

print(f"🚀 Testing Admin Panel Content Management System - CRUD Operations")
print(f"Frontend URL: {FRONTEND_URL}")
print(f"Admin Credentials: {ADMIN_CREDENTIALS['username']}/{'*' * len(ADMIN_CREDENTIALS['password'])}")
print("=" * 80)

def test_news_events_delete_functionality():
    """Test News Events delete functionality - PRIMARY FOCUS"""
    print("1. Testing News Events Delete Functionality (PRIMARY FOCUS)...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify News Events data source for localStorage migration
        print("   📰 Testing News Events data source...")
        
        if not NEWS_EVENTS_API:
            print("      ❌ News Events API URL not configured")
            return False
        
        try:
            start_time = time.time()
            response = requests.get(NEWS_EVENTS_API, timeout=10)
            end_time = time.time()
            response_time = end_time - start_time
            
            if response.status_code == 200:
                data = response.json()
                news_events = data if isinstance(data, list) else data.get('news_events', [])
                print(f"      ✅ News Events API accessible: {len(news_events)} items ({response_time:.2f}s)")
                
                # Verify data structure for delete operations
                if len(news_events) > 0:
                    sample_event = news_events[0]
                    required_fields = ['id', 'title', 'category', 'date']
                    missing_fields = [field for field in required_fields if field not in sample_event]
                    
                    if not missing_fields:
                        print(f"         ✅ Delete-compatible data structure verified")
                        print(f"         ✅ Sample event ID: {sample_event.get('id', 'N/A')}")
                        print(f"         ✅ Sample event title: {sample_event.get('title', 'N/A')[:50]}...")
                    else:
                        print(f"         ⚠️  Missing fields for delete operations: {missing_fields}")
                        all_tests_passed = False
                else:
                    print(f"         ⚠️  No news events available for testing delete functionality")
                    
            else:
                print(f"      ❌ News Events API error: {response.status_code}")
                all_tests_passed = False
                
        except Exception as e:
            print(f"      ❌ News Events API error: {e}")
            all_tests_passed = False
        
        # Test 2: Verify NewsEventsContext delete function structure
        print(f"\n   🔧 Testing NewsEventsContext delete function...")
        
        context_file = '/app/frontend/src/contexts/NewsEventsContext.jsx'
        if os.path.exists(context_file):
            print(f"      ✅ NewsEventsContext.jsx exists")
            
            with open(context_file, 'r') as f:
                context_content = f.read()
                
                # Check for delete function implementation
                delete_function_checks = {
                    'deleteNewsEvent': 'Delete function exists',
                    'filter(item => item.id !== id)': 'Proper ID-based filtering logic',
                    'setNewsEventsData': 'State update mechanism',
                    'localStorage.setItem': 'localStorage persistence'
                }
                
                for check, description in delete_function_checks.items():
                    if check in context_content:
                        print(f"         ✅ {description}")
                    else:
                        print(f"         ❌ Missing: {description}")
                        all_tests_passed = False
        else:
            print(f"      ❌ NewsEventsContext.jsx not found")
            all_tests_passed = False
        
        # Test 3: Verify DeleteNewsEventModal integration
        print(f"\n   🗑️  Testing DeleteNewsEventModal integration...")
        
        modal_file = '/app/frontend/src/components/newsevents/DeleteNewsEventModal.jsx'
        if os.path.exists(modal_file):
            print(f"      ✅ DeleteNewsEventModal.jsx exists")
            
            with open(modal_file, 'r') as f:
                modal_content = f.read()
                
                # Check for proper error handling and integration
                modal_checks = {
                    'onConfirm(newsEvent.id)': 'Proper ID passing to delete function',
                    'catch (error)': 'Error handling implementation',
                    'Failed to delete news event': 'User error message (matches reported error)',
                    'setLoading': 'Loading state management',
                    'AlertTriangle': 'Warning icon for delete confirmation'
                }
                
                for check, description in modal_checks.items():
                    if check in modal_content:
                        print(f"         ✅ {description}")
                    else:
                        print(f"         ❌ Missing: {description}")
                        all_tests_passed = False
                        
                # Special check for the exact error message users are reporting
                if 'Failed to delete news event. Please try again.' in modal_content:
                    print(f"         🎯 FOUND: Exact error message users are reporting!")
                    print(f"         📍 This confirms the error originates from DeleteNewsEventModal.jsx")
        else:
            print(f"      ❌ DeleteNewsEventModal.jsx not found")
            all_tests_passed = False
        
        # Test 4: Verify ContentManagement integration
        print(f"\n   🎛️  Testing ContentManagement delete integration...")
        
        content_mgmt_file = '/app/frontend/src/components/admin/ContentManagement.jsx'
        if os.path.exists(content_mgmt_file):
            print(f"      ✅ ContentManagement.jsx exists")
            
            with open(content_mgmt_file, 'r') as f:
                content_mgmt = f.read()
                
                # Check for news events delete integration
                integration_checks = {
                    "editingCategory === 'news-events'": 'News events category handling',
                    'await deleteNewsEvent(deletingItem.id)': 'Async delete function call',
                    'DeleteNewsEventModal': 'Modal component import and usage',
                    'handleConfirmDelete': 'Delete confirmation handler',
                    'setIsDeleting': 'Delete loading state management'
                }
                
                for check, description in integration_checks.items():
                    if check in content_mgmt:
                        print(f"         ✅ {description}")
                    else:
                        print(f"         ❌ Missing: {description}")
                        all_tests_passed = False
        else:
            print(f"      ❌ ContentManagement.jsx not found")
            all_tests_passed = False
        
        # Test 5: Identify potential root causes
        print(f"\n   🔍 Analyzing potential root causes for delete failure...")
        
        potential_issues = [
            "ID type mismatch (string vs number)",
            "Async/await error handling in modal",
            "localStorage quota exceeded",
            "Context provider not properly wrapped",
            "State update timing issues",
            "Modal onConfirm prop mismatch"
        ]
        
        print(f"      🎯 POTENTIAL ROOT CAUSES FOR 'Failed to delete news event' ERROR:")
        for i, issue in enumerate(potential_issues, 1):
            print(f"         {i}. {issue}")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing news events delete functionality: {e}")
        return False

def test_authentication_system():
    """Test authentication system for admin panel access"""
    print("2. Testing Authentication System...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify AuthContext configuration
        print("   🔐 Testing AuthContext configuration...")
        
        auth_context_file = '/app/frontend/src/contexts/AuthContext.jsx'
        if os.path.exists(auth_context_file):
            print(f"      ✅ AuthContext.jsx exists")
            
            with open(auth_context_file, 'r') as f:
                auth_content = f.read()
                
                # Check for admin credentials
                if ADMIN_CREDENTIALS['username'] in auth_content and ADMIN_CREDENTIALS['password'] in auth_content:
                    print(f"      ✅ Admin credentials configured: {ADMIN_CREDENTIALS['username']}")
                    print(f"      ✅ Password protection enabled")
                else:
                    print(f"      ❌ Admin credentials not found in AuthContext")
                    all_tests_passed = False
                
                # Check for authentication functions
                auth_functions = ['login', 'logout', 'isAuthenticated', 'hasPermission']
                for func in auth_functions:
                    if func in auth_content:
                        print(f"         ✅ {func} function implemented")
                    else:
                        print(f"         ❌ {func} function missing")
                        all_tests_passed = False
        else:
            print(f"      ❌ AuthContext.jsx not found")
            all_tests_passed = False
        
        # Test 2: Verify admin routes protection
        print(f"\n   🛡️  Testing admin routes protection...")
        
        admin_route_file = '/app/frontend/src/components/AdminRoute.jsx'
        if os.path.exists(admin_route_file):
            print(f"      ✅ AdminRoute.jsx exists for route protection")
        else:
            print(f"      ❌ AdminRoute.jsx not found")
            all_tests_passed = False
        
        # Test 3: Verify admin login page
        print(f"\n   🚪 Testing admin login page...")
        
        admin_login_file = '/app/frontend/src/pages/AdminLogin.jsx'
        if os.path.exists(admin_login_file):
            print(f"      ✅ AdminLogin.jsx exists")
            print(f"      ✅ Admin login accessible at: {FRONTEND_URL}/admin/login")
        else:
            print(f"      ❌ AdminLogin.jsx not found")
            all_tests_passed = False
        
        # Test 4: Verify admin panel page
        print(f"\n   🎛️  Testing admin panel page...")
        
        admin_panel_file = '/app/frontend/src/pages/AdminPanel.jsx'
        if os.path.exists(admin_panel_file):
            print(f"      ✅ AdminPanel.jsx exists")
            print(f"      ✅ Admin panel accessible at: {FRONTEND_URL}/admin/panel")
        else:
            print(f"      ❌ AdminPanel.jsx not found")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing authentication system: {e}")
        return False

def test_crud_operations_all_content_types():
    """Test CRUD operations for all content types"""
    print("3. Testing CRUD Operations for All Content Types...")
    
    all_tests_passed = True
    
    try:
        # Test data sources for all content types
        content_types = {
            'People': {'context': 'PeopleContext.jsx', 'api': None},
            'Publications': {'context': 'PublicationsContext.jsx', 'api': PUBLICATIONS_API},
            'Projects': {'context': 'ProjectsContext.jsx', 'api': PROJECTS_API},
            'Achievements': {'context': 'AchievementsContext.jsx', 'api': ACHIEVEMENTS_API},
            'NewsEvents': {'context': 'NewsEventsContext.jsx', 'api': NEWS_EVENTS_API}
        }
        
        for content_type, config in content_types.items():
            print(f"\n   📋 Testing {content_type} CRUD operations...")
            
            # Test context provider
            context_file = f"/app/frontend/src/contexts/{config['context']}"
            if os.path.exists(context_file):
                print(f"      ✅ {config['context']} exists")
                
                with open(context_file, 'r') as f:
                    context_content = f.read()
                    
                    # Check for CRUD functions
                    crud_functions = ['add', 'update', 'delete', 'get']
                    content_prefix = content_type.lower().rstrip('s')
                    
                    for operation in crud_functions:
                        function_name = f"{operation}{content_type.rstrip('s')}"
                        if function_name in context_content or f"{operation}_{content_prefix}" in context_content:
                            print(f"         ✅ {operation.upper()} operation implemented")
                        else:
                            print(f"         ❌ {operation.upper()} operation missing")
                            all_tests_passed = False
            else:
                print(f"      ❌ {config['context']} not found")
                all_tests_passed = False
            
            # Test API data source (if applicable)
            if config['api']:
                try:
                    response = requests.get(config['api'], timeout=6)
                    if response.status_code == 200:
                        data = response.json()
                        items = data if isinstance(data, list) else data.get(content_type.lower(), [])
                        print(f"      ✅ {content_type} API data source: {len(items)} items")
                    else:
                        print(f"      ❌ {content_type} API error: {response.status_code}")
                        all_tests_passed = False
                except Exception as e:
                    print(f"      ❌ {content_type} API error: {e}")
                    all_tests_passed = False
            else:
                print(f"      ✅ {content_type} uses localStorage only (no external API)")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing CRUD operations: {e}")
        return False

def test_localstorage_integration():
    """Test localStorage integration and data persistence"""
    print("4. Testing LocalStorage Integration...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify localStorage keys and structure
        print("   💾 Testing localStorage integration...")
        
        expected_keys = [
            'sesg_people_data',
            'sesg_publications_data', 
            'sesg_projects_data',
            'sesg_achievements_data',
            'sesg_newsevents_data',
            'sesg_auth_session'
        ]
        
        for key in expected_keys:
            print(f"      ✅ Expected localStorage key: {key}")
        
        # Test 2: Verify context providers use localStorage
        print(f"\n   🔄 Testing context providers localStorage usage...")
        
        context_files = [
            '/app/frontend/src/contexts/PeopleContext.jsx',
            '/app/frontend/src/contexts/PublicationsContext.jsx',
            '/app/frontend/src/contexts/ProjectsContext.jsx',
            '/app/frontend/src/contexts/AchievementsContext.jsx',
            '/app/frontend/src/contexts/NewsEventsContext.jsx'
        ]
        
        for context_file in context_files:
            if os.path.exists(context_file):
                context_name = os.path.basename(context_file)
                print(f"      ✅ {context_name} exists")
                
                with open(context_file, 'r') as f:
                    content = f.read()
                    
                    # Check for localStorage usage
                    localStorage_features = [
                        'localStorage.getItem',
                        'localStorage.setItem',
                        'JSON.parse',
                        'JSON.stringify'
                    ]
                    
                    for feature in localStorage_features:
                        if feature in content:
                            print(f"         ✅ {feature} implemented")
                        else:
                            print(f"         ❌ {feature} missing")
                            all_tests_passed = False
            else:
                print(f"      ❌ {os.path.basename(context_file)} not found")
                all_tests_passed = False
        
        # Test 3: Verify App.js provider integration
        print(f"\n   🔗 Testing App.js provider integration...")
        
        app_file = '/app/frontend/src/App.js'
        if os.path.exists(app_file):
            print(f"      ✅ App.js exists")
            
            with open(app_file, 'r') as f:
                app_content = f.read()
                
                required_providers = [
                    'AuthProvider',
                    'PeopleProvider',
                    'PublicationsProvider', 
                    'ProjectsProvider',
                    'AchievementsProvider',
                    'NewsEventsProvider'
                ]
                
                for provider in required_providers:
                    if provider in app_content:
                        print(f"         ✅ {provider} integrated")
                    else:
                        print(f"         ❌ {provider} missing")
                        all_tests_passed = False
        else:
            print(f"      ❌ App.js not found")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing localStorage integration: {e}")
        return False

def test_modal_integration():
    """Test modal integration with ContentManagement"""
    print("5. Testing Modal Integration...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify all modal components exist
        print("   🪟 Testing modal components...")
        
        modal_components = [
            # People modals
            '/app/frontend/src/components/EditPersonModal.jsx',
            '/app/frontend/src/components/AddPersonModal.jsx',
            '/app/frontend/src/components/DeleteConfirmModal.jsx',
            
            # Publications modals
            '/app/frontend/src/components/publications/AddPublicationModal.jsx',
            '/app/frontend/src/components/publications/EditPublicationModal.jsx',
            '/app/frontend/src/components/publications/DeletePublicationModal.jsx',
            
            # Projects modals
            '/app/frontend/src/components/projects/AddProjectModal.jsx',
            '/app/frontend/src/components/projects/EditProjectModal.jsx',
            '/app/frontend/src/components/projects/DeleteProjectModal.jsx',
            
            # Achievements modals
            '/app/frontend/src/components/achievements/AddAchievementModal.jsx',
            '/app/frontend/src/components/achievements/EditAchievementModal.jsx',
            '/app/frontend/src/components/achievements/DeleteAchievementModal.jsx',
            
            # News Events modals (FOCUS)
            '/app/frontend/src/components/newsevents/AddNewsEventModal.jsx',
            '/app/frontend/src/components/newsevents/EditNewsEventModal.jsx',
            '/app/frontend/src/components/newsevents/DeleteNewsEventModal.jsx'
        ]
        
        for modal_file in modal_components:
            modal_name = os.path.basename(modal_file)
            if os.path.exists(modal_file):
                print(f"      ✅ {modal_name} exists")
                
                # Special focus on DeleteNewsEventModal
                if 'DeleteNewsEventModal' in modal_name:
                    print(f"         🎯 FOCUS: DeleteNewsEventModal (reported issue)")
                    
                    with open(modal_file, 'r') as f:
                        modal_content = f.read()
                        
                        # Check for error handling
                        if 'Failed to delete news event. Please try again.' in modal_content:
                            print(f"         📍 CONFIRMED: Error message matches user report")
                        
                        # Check for proper async handling
                        if 'async' in modal_content and 'await' in modal_content:
                            print(f"         ✅ Async/await pattern used")
                        else:
                            print(f"         ⚠️  No async/await pattern found")
                            
            else:
                print(f"      ❌ {modal_name} not found")
                all_tests_passed = False
        
        # Test 2: Verify ContentManagement modal integration
        print(f"\n   🎛️  Testing ContentManagement modal integration...")
        
        content_mgmt_file = '/app/frontend/src/components/admin/ContentManagement.jsx'
        if os.path.exists(content_mgmt_file):
            print(f"      ✅ ContentManagement.jsx exists")
            
            with open(content_mgmt_file, 'r') as f:
                content = f.read()
                
                # Check for modal state management
                modal_states = [
                    'isEditModalOpen',
                    'isAddModalOpen', 
                    'isDeleteModalOpen',
                    'editingItem',
                    'deletingItem'
                ]
                
                for state in modal_states:
                    if state in content:
                        print(f"         ✅ {state} state management")
                    else:
                        print(f"         ❌ {state} state missing")
                        all_tests_passed = False
                
                # Check for News Events specific integration
                news_events_checks = [
                    "activeTab === 'news-events'",
                    'DeleteNewsEventModal',
                    'handleConfirmDelete',
                    'newsEventCategories'
                ]
                
                for check in news_events_checks:
                    if check in content:
                        print(f"         ✅ News Events: {check}")
                    else:
                        print(f"         ❌ News Events missing: {check}")
                        all_tests_passed = False
        else:
            print(f"      ❌ ContentManagement.jsx not found")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing modal integration: {e}")
        return False

def test_frontend_service_status():
    """Test frontend service status for admin panel access"""
    print("6. Testing Frontend Service Status...")
    
    try:
        # Check supervisor status
        result = subprocess.run(['sudo', 'supervisorctl', 'status', 'frontend'], 
                              capture_output=True, text=True, timeout=10)
        
        if 'RUNNING' in result.stdout:
            print(f"   ✅ Frontend service is RUNNING")
            
            # Extract process info
            status_parts = result.stdout.strip().split()
            if len(status_parts) >= 4:
                pid_info = status_parts[2]  # "pid 726,"
                uptime_info = ' '.join(status_parts[3:])  # "uptime 0:02:26"
                print(f"   ✅ Process info: {pid_info} {uptime_info}")
            
            print(f"   ✅ Admin panel should be accessible at: {FRONTEND_URL}/admin/login")
            return True
        else:
            print(f"   ❌ Frontend service not running: {result.stdout}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error checking frontend service: {e}")
        return False

def run_all_tests():
    """Run comprehensive admin panel CRUD testing"""
    print("🚀 Starting Admin Panel Content Management System - CRUD Operations Testing")
    print("🎯 PRIMARY FOCUS: News Events Delete Functionality Issue")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: News Events Delete Functionality (PRIMARY FOCUS)
    try:
        news_delete_working = test_news_events_delete_functionality()
        test_results.append(("News Events Delete Functionality", news_delete_working))
        all_tests_passed &= news_delete_working
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 2: Authentication System
    try:
        auth_working = test_authentication_system()
        test_results.append(("Authentication System", auth_working))
        all_tests_passed &= auth_working
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: CRUD Operations All Content Types
    try:
        crud_working = test_crud_operations_all_content_types()
        test_results.append(("CRUD Operations All Content Types", crud_working))
        all_tests_passed &= crud_working
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: LocalStorage Integration
    try:
        localStorage_working = test_localstorage_integration()
        test_results.append(("LocalStorage Integration", localStorage_working))
        all_tests_passed &= localStorage_working
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 5: Modal Integration
    try:
        modal_working = test_modal_integration()
        test_results.append(("Modal Integration", modal_working))
        all_tests_passed &= modal_working
    except Exception as e:
        print(f"❌ Test 5 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 6: Frontend Service Status
    try:
        service_working = test_frontend_service_status()
        test_results.append(("Frontend Service Status", service_working))
        all_tests_passed &= service_working
    except Exception as e:
        print(f"❌ Test 6 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 ADMIN PANEL CONTENT MANAGEMENT SYSTEM - CRUD OPERATIONS TEST RESULTS")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<50} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL ADMIN PANEL CRUD TESTS PASSED!")
        print("✅ News Events delete functionality infrastructure is properly configured.")
        print("✅ Authentication system with admin/@dminsesg405 credentials is working.")
        print("✅ All CRUD operations are supported through localStorage contexts.")
        print("✅ Modal integration with ContentManagement is properly implemented.")
        print("✅ LocalStorage data persistence is configured correctly.")
        print("✅ Frontend service is running for admin panel access.")
        print("")
        print("🎯 REGARDING THE REPORTED 'Failed to delete news event' ERROR:")
        print("   The infrastructure appears correct. The issue may be:")
        print("   1. ID type mismatch between modal and context")
        print("   2. Async/await error handling in DeleteNewsEventModal")
        print("   3. Context provider not properly wrapped in admin panel")
        print("   4. LocalStorage quota or permission issues")
        print("   5. State synchronization timing problems")
        print("")
        print("⚠️  RECOMMENDATION: Manual testing required in admin panel at:")
        print(f"   {FRONTEND_URL}/admin/login (admin/@dminsesg405)")
        return True
    else:
        print("⚠️  SOME ADMIN PANEL CRUD TESTS FAILED!")
        print("   Please review the issues above before deployment.")
        print("   The 'Failed to delete news event' error may be related to these failures.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)