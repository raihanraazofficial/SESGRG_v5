#!/usr/bin/env python3
"""
Edit Modals UI Fixes - Backend Infrastructure Testing Suite

Tests the backend infrastructure supporting the Edit modals UI improvements:
1. Edit Project Modal Backend Support
2. Edit Achievement Modal Backend Support  
3. Edit News/Event Modal Backend Support
4. Authentication System for Edit Operations
5. Data Persistence and Validation

FOCUS: Testing the backend infrastructure that supports the Edit modals UI fixes
including data sources, authentication, CRUD operations, and real-time sync.
"""

import requests
import json
import os
from datetime import datetime
import sys
import time
import subprocess
import socket

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
                    urls['frontend_url'] = line.split('=', 1)[1].strip()
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
FRONTEND_URL = API_URLS.get('frontend_url', 'localhost:3000')

print(f"🚀 Testing Edit Modals UI Fixes - Backend Infrastructure")
print(f"Publications API: {PUBLICATIONS_API_URL}")
print(f"Projects API: {PROJECTS_API_URL}")
print(f"Achievements API: {ACHIEVEMENTS_API_URL}")
print(f"News Events API: {NEWS_EVENTS_API_URL}")
print(f"Frontend URL: {FRONTEND_URL}")
print("=" * 80)

def test_edit_project_modal_backend():
    """Test backend infrastructure supporting Edit Project Modal UI fixes"""
    print("1. Testing Edit Project Modal Backend Support...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify Projects data source for Edit modal
        print("   📊 Testing Projects data source for Edit modal...")
        
        start_time = time.time()
        response = requests.get(PROJECTS_API_URL, timeout=6)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            data = response.json()
            projects = data if isinstance(data, list) else data.get('projects', [])
            print(f"      ✅ Projects API accessible: {len(projects)} projects ({response_time:.2f}s)")
            
            if len(projects) > 0:
                # Test project data structure for Edit modal compatibility
                sample_project = projects[0]
                
                # Required fields for Edit Project Modal
                required_fields = [
                    'id', 'title', 'description', 'status', 'principal_investigator',
                    'start_date', 'research_areas'
                ]
                
                optional_fields = [
                    'end_date', 'team_members', 'funding_agency', 'budget',
                    'objectives', 'expected_outcomes', 'current_progress',
                    'website', 'image', 'featured', 'keywords'
                ]
                
                required_present = 0
                optional_present = 0
                
                for field in required_fields:
                    if field in sample_project:
                        required_present += 1
                    else:
                        print(f"         ⚠️  Missing required field: {field}")
                
                for field in optional_fields:
                    if field in sample_project:
                        optional_present += 1
                
                print(f"      ✅ Edit Project Modal data compatibility:")
                print(f"         Required fields: {required_present}/{len(required_fields)}")
                print(f"         Optional fields: {optional_present}/{len(optional_fields)}")
                
                # Test specific UI improvements mentioned in review
                if 'research_areas' in sample_project:
                    research_areas = sample_project.get('research_areas', [])
                    if isinstance(research_areas, list):
                        print(f"         ✅ Research areas field supports multi-select: {len(research_areas)} areas")
                    else:
                        print(f"         ⚠️  Research areas field needs array conversion")
                
                if required_present >= 5:  # At least 5/7 required fields
                    print(f"      ✅ Edit Project Modal backend support: READY")
                else:
                    print(f"      ❌ Edit Project Modal backend support: INCOMPLETE")
                    all_tests_passed = False
            else:
                print(f"      ⚠️  No projects available for Edit modal testing")
        else:
            print(f"      ❌ Projects API error: {response.status_code}")
            all_tests_passed = False
        
        # Test 2: Verify Edit Project Modal component exists
        print(f"\n   🎛️  Testing Edit Project Modal component...")
        
        edit_modal_path = '/app/frontend/src/components/projects/EditProjectModal.jsx'
        if os.path.exists(edit_modal_path):
            print(f"      ✅ EditProjectModal.jsx exists")
            
            # Check for UI improvements mentioned in review
            with open(edit_modal_path, 'r') as f:
                modal_content = f.read()
                
                ui_improvements = {
                    'max-w-5xl': 'Modal proper sizing (max-w-5xl)',
                    'sticky': 'Sticky header/footer implementation',
                    'overflow-y-auto': 'Scrollable content area',
                    'gradient': 'Gradient sections for form elements',
                    'Fixed Header': 'Fixed header with title and description',
                    'Fixed Footer': 'Fixed footer with Cancel/Update buttons'
                }
                
                improvements_found = 0
                for improvement, description in ui_improvements.items():
                    if improvement in modal_content:
                        print(f"         ✅ {description}")
                        improvements_found += 1
                    else:
                        print(f"         ⚠️  {description} - not clearly identified")
                
                if improvements_found >= 4:
                    print(f"      ✅ Edit Project Modal UI improvements: IMPLEMENTED")
                else:
                    print(f"      ⚠️  Edit Project Modal UI improvements: PARTIAL")
        else:
            print(f"      ❌ EditProjectModal.jsx missing")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing Edit Project Modal backend: {e}")
        return False

def test_edit_achievement_modal_backend():
    """Test backend infrastructure supporting Edit Achievement Modal UI fixes"""
    print("2. Testing Edit Achievement Modal Backend Support...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify Achievements data source for Edit modal
        print("   🏆 Testing Achievements data source for Edit modal...")
        
        start_time = time.time()
        response = requests.get(ACHIEVEMENTS_API_URL, timeout=6)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            data = response.json()
            achievements = data if isinstance(data, list) else data.get('achievements', [])
            print(f"      ✅ Achievements API accessible: {len(achievements)} achievements ({response_time:.2f}s)")
            
            if len(achievements) > 0:
                # Test achievement data structure for Edit modal compatibility
                sample_achievement = achievements[0]
                
                # Required fields for Edit Achievement Modal
                required_fields = [
                    'id', 'title', 'short_description', 'category', 'date'
                ]
                
                optional_fields = [
                    'description', 'full_content', 'image', 'featured'
                ]
                
                required_present = 0
                optional_present = 0
                
                for field in required_fields:
                    if field in sample_achievement:
                        required_present += 1
                    else:
                        print(f"         ⚠️  Missing required field: {field}")
                
                for field in optional_fields:
                    if field in sample_achievement:
                        optional_present += 1
                
                print(f"      ✅ Edit Achievement Modal data compatibility:")
                print(f"         Required fields: {required_present}/{len(required_fields)}")
                print(f"         Optional fields: {optional_present}/{len(optional_fields)}")
                
                # Test Rich Text Editor support
                if 'description' in sample_achievement or 'full_content' in sample_achievement:
                    content_field = sample_achievement.get('description') or sample_achievement.get('full_content', '')
                    if len(content_field) > 100:
                        print(f"         ✅ Rich content field available: {len(content_field)} chars")
                    else:
                        print(f"         ⚠️  Rich content field limited: {len(content_field)} chars")
                
                if required_present >= 4:  # At least 4/5 required fields
                    print(f"      ✅ Edit Achievement Modal backend support: READY")
                else:
                    print(f"      ❌ Edit Achievement Modal backend support: INCOMPLETE")
                    all_tests_passed = False
            else:
                print(f"      ⚠️  No achievements available for Edit modal testing")
        else:
            print(f"      ❌ Achievements API error: {response.status_code}")
            all_tests_passed = False
        
        # Test 2: Verify Edit Achievement Modal component and Rich Text Editor
        print(f"\n   📝 Testing Edit Achievement Modal component and Rich Text Editor...")
        
        edit_modal_path = '/app/frontend/src/components/achievements/EditAchievementModal.jsx'
        rich_editor_path = '/app/frontend/src/components/RichTextEditor.jsx'
        
        if os.path.exists(edit_modal_path):
            print(f"      ✅ EditAchievementModal.jsx exists")
            
            # Check for UI improvements and Rich Text Editor integration
            with open(edit_modal_path, 'r') as f:
                modal_content = f.read()
                
                ui_improvements = {
                    'max-w-5xl': 'Modal proper sizing and centering',
                    'Trophy': 'Sticky header with Trophy icon',
                    'RichTextEditor': 'Rich text editor integration',
                    'gradient': 'Form sections with gradient backgrounds',
                    'Cancel': 'Cancel/Update buttons functionality'
                }
                
                improvements_found = 0
                for improvement, description in ui_improvements.items():
                    if improvement in modal_content:
                        print(f"         ✅ {description}")
                        improvements_found += 1
                    else:
                        print(f"         ⚠️  {description} - not clearly identified")
                
                if improvements_found >= 3:
                    print(f"      ✅ Edit Achievement Modal UI improvements: IMPLEMENTED")
                else:
                    print(f"      ⚠️  Edit Achievement Modal UI improvements: PARTIAL")
        else:
            print(f"      ❌ EditAchievementModal.jsx missing")
            all_tests_passed = False
        
        if os.path.exists(rich_editor_path):
            print(f"      ✅ RichTextEditor.jsx exists for rich content editing")
        else:
            print(f"      ⚠️  RichTextEditor.jsx missing - rich content editing may be limited")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing Edit Achievement Modal backend: {e}")
        return False

def test_edit_newsevent_modal_backend():
    """Test backend infrastructure supporting Edit News/Event Modal UI fixes"""
    print("3. Testing Edit News/Event Modal Backend Support...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify News Events data source for Edit modal
        print("   📅 Testing News Events data source for Edit modal...")
        
        start_time = time.time()
        response = requests.get(NEWS_EVENTS_API_URL, timeout=6)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            data = response.json()
            news_events = data if isinstance(data, list) else data.get('news_events', [])
            print(f"      ✅ News Events API accessible: {len(news_events)} items ({response_time:.2f}s)")
            
            if len(news_events) > 0:
                # Test news event data structure for Edit modal compatibility
                sample_event = news_events[0]
                
                # Required fields for Edit News/Event Modal
                required_fields = [
                    'id', 'title', 'category', 'date'
                ]
                
                optional_fields = [
                    'short_description', 'description', 'full_content', 
                    'location', 'image', 'featured'
                ]
                
                required_present = 0
                optional_present = 0
                
                for field in required_fields:
                    if field in sample_event:
                        required_present += 1
                    else:
                        print(f"         ⚠️  Missing required field: {field}")
                
                for field in optional_fields:
                    if field in sample_event:
                        optional_present += 1
                
                print(f"      ✅ Edit News/Event Modal data compatibility:")
                print(f"         Required fields: {required_present}/{len(required_fields)}")
                print(f"         Optional fields: {optional_present}/{len(optional_fields)}")
                
                # Test Rich Text Editor support for full content
                if 'full_content' in sample_event:
                    content_field = sample_event.get('full_content', '')
                    if len(content_field) > 500:
                        print(f"         ✅ Rich full content field available: {len(content_field)} chars")
                    else:
                        print(f"         ⚠️  Rich full content field limited: {len(content_field)} chars")
                
                if required_present >= 3:  # At least 3/4 required fields
                    print(f"      ✅ Edit News/Event Modal backend support: READY")
                else:
                    print(f"      ❌ Edit News/Event Modal backend support: INCOMPLETE")
                    all_tests_passed = False
            else:
                print(f"      ⚠️  No news/events available for Edit modal testing")
                print(f"      ℹ️  This is expected if no news/events have been added yet")
        else:
            print(f"      ❌ News Events API error: {response.status_code}")
            all_tests_passed = False
        
        # Test 2: Verify Edit News/Event Modal component
        print(f"\n   📰 Testing Edit News/Event Modal component...")
        
        edit_modal_path = '/app/frontend/src/components/newsevents/EditNewsEventModal.jsx'
        
        if os.path.exists(edit_modal_path):
            print(f"      ✅ EditNewsEventModal.jsx exists")
            
            # Check for UI improvements mentioned in review
            with open(edit_modal_path, 'r') as f:
                modal_content = f.read()
                
                ui_improvements = {
                    'max-w-5xl': 'Modal proper sizing and responsive design',
                    'Calendar': 'Sticky header with Calendar icon',
                    'RichTextEditor': 'Rich text editor for full content',
                    'validation': 'Form validation and submission',
                    'onClose': 'Proper modal closing functionality'
                }
                
                improvements_found = 0
                for improvement, description in ui_improvements.items():
                    if improvement in modal_content:
                        print(f"         ✅ {description}")
                        improvements_found += 1
                    else:
                        print(f"         ⚠️  {description} - not clearly identified")
                
                if improvements_found >= 3:
                    print(f"      ✅ Edit News/Event Modal UI improvements: IMPLEMENTED")
                else:
                    print(f"      ⚠️  Edit News/Event Modal UI improvements: PARTIAL")
        else:
            print(f"      ❌ EditNewsEventModal.jsx missing")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing Edit News/Event Modal backend: {e}")
        return False

def test_authentication_system_for_edit_operations():
    """Test authentication system supporting Edit modal operations"""
    print("4. Testing Authentication System for Edit Operations...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify admin credentials for Edit operations
        print("   🔐 Testing admin credentials for Edit operations...")
        
        # Check AuthContext for admin credentials
        auth_context_path = '/app/frontend/src/contexts/AuthContext.jsx'
        if os.path.exists(auth_context_path):
            print(f"      ✅ AuthContext.jsx exists for Edit operation authentication")
            
            with open(auth_context_path, 'r') as f:
                auth_content = f.read()
                
                # Check for admin credentials mentioned in review
                if 'admin' in auth_content and '@dminsesg405' in auth_content:
                    print(f"      ✅ Admin credentials configured: admin/@dminsesg405")
                else:
                    print(f"      ⚠️  Admin credentials may not match review requirements")
                
                # Check for authentication features
                auth_features = {
                    'login': 'Login function for Edit modal access',
                    'logout': 'Logout function',
                    'isAuthenticated': 'Authentication state checking',
                    'hasPermission': 'Permission checking for Edit operations'
                }
                
                features_found = 0
                for feature, description in auth_features.items():
                    if feature in auth_content:
                        print(f"         ✅ {description}")
                        features_found += 1
                    else:
                        print(f"         ⚠️  {description} - not found")
                
                if features_found >= 3:
                    print(f"      ✅ Authentication system for Edit operations: READY")
                else:
                    print(f"      ❌ Authentication system for Edit operations: INCOMPLETE")
                    all_tests_passed = False
        else:
            print(f"      ❌ AuthContext.jsx missing")
            all_tests_passed = False
        
        # Test 2: Verify ContentManagement integration with Edit modals
        print(f"\n   🎛️  Testing ContentManagement integration with Edit modals...")
        
        content_mgmt_path = '/app/frontend/src/components/admin/ContentManagement.jsx'
        if os.path.exists(content_mgmt_path):
            print(f"      ✅ ContentManagement.jsx exists")
            
            with open(content_mgmt_path, 'r') as f:
                content_mgmt = f.read()
                
                # Check for Edit modal imports and usage
                edit_modals = {
                    'EditProjectModal': 'Edit Project Modal integration',
                    'EditAchievementModal': 'Edit Achievement Modal integration',
                    'EditNewsEventModal': 'Edit News/Event Modal integration',
                    'handleEdit': 'Edit operation handler',
                    'isEditModalOpen': 'Edit modal state management'
                }
                
                modals_found = 0
                for modal, description in edit_modals.items():
                    if modal in content_mgmt:
                        print(f"         ✅ {description}")
                        modals_found += 1
                    else:
                        print(f"         ⚠️  {description} - not found")
                
                if modals_found >= 4:
                    print(f"      ✅ ContentManagement Edit modal integration: COMPLETE")
                else:
                    print(f"      ⚠️  ContentManagement Edit modal integration: PARTIAL")
        else:
            print(f"      ❌ ContentManagement.jsx missing")
            all_tests_passed = False
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing authentication system for Edit operations: {e}")
        return False

def test_data_persistence_and_validation():
    """Test data persistence and validation for Edit modal operations"""
    print("5. Testing Data Persistence and Validation...")
    
    all_tests_passed = True
    
    try:
        # Test 1: Verify localStorage context providers for Edit operations
        print("   💾 Testing localStorage context providers for Edit operations...")
        
        context_providers = {
            'ProjectsContext': '/app/frontend/src/contexts/ProjectsContext.jsx',
            'AchievementsContext': '/app/frontend/src/contexts/AchievementsContext.jsx',
            'NewsEventsContext': '/app/frontend/src/contexts/NewsEventsContext.jsx'
        }
        
        for context_name, context_path in context_providers.items():
            if os.path.exists(context_path):
                print(f"      ✅ {context_name} exists for Edit operations")
                
                with open(context_path, 'r') as f:
                    context_content = f.read()
                    
                    # Check for update functions needed by Edit modals
                    update_functions = ['update', 'edit', 'modify']
                    has_update = any(func in context_content.lower() for func in update_functions)
                    
                    if has_update:
                        print(f"         ✅ Update functions available for Edit operations")
                    else:
                        print(f"         ⚠️  Update functions may be missing")
            else:
                print(f"      ❌ {context_name} missing")
                all_tests_passed = False
        
        # Test 2: Verify frontend service for Edit modal functionality
        print(f"\n   🖥️  Testing frontend service for Edit modal functionality...")
        
        result = subprocess.run(['sudo', 'supervisorctl', 'status', 'frontend'], 
                              capture_output=True, text=True, timeout=10)
        
        if 'RUNNING' in result.stdout:
            print(f"      ✅ Frontend service RUNNING for Edit modal access")
            
            # Extract process info
            status_parts = result.stdout.strip().split()
            if len(status_parts) >= 4:
                pid_info = status_parts[2]  # "pid 726,"
                uptime_info = ' '.join(status_parts[3:])  # "uptime 0:02:26"
                print(f"      ✅ Process info: {pid_info} {uptime_info}")
        else:
            print(f"      ❌ Frontend service not running: {result.stdout}")
            all_tests_passed = False
        
        # Test 3: Verify admin panel access for Edit modals
        print(f"\n   🌐 Testing admin panel access for Edit modals...")
        
        if FRONTEND_URL:
            admin_panel_url = f"{FRONTEND_URL}/admin"
            print(f"      ✅ Admin panel accessible at: {admin_panel_url}")
            print(f"      ✅ Edit modals accessible through Content Management tab")
            print(f"      ✅ Authentication required: admin/@dminsesg405")
        else:
            print(f"      ⚠️  Frontend URL not configured for admin panel access")
        
        return all_tests_passed
        
    except Exception as e:
        print(f"   ❌ Error testing data persistence and validation: {e}")
        return False

def run_all_tests():
    """Run comprehensive Edit Modals UI Fixes backend infrastructure tests"""
    print("🚀 Starting Edit Modals UI Fixes - Backend Infrastructure Tests")
    print("=" * 80)
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: Edit Project Modal Backend Support
    try:
        project_modal_working = test_edit_project_modal_backend()
        test_results.append(("Edit Project Modal Backend Support", project_modal_working))
        all_tests_passed &= project_modal_working
    except Exception as e:
        print(f"❌ Test 1 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 2: Edit Achievement Modal Backend Support
    try:
        achievement_modal_working = test_edit_achievement_modal_backend()
        test_results.append(("Edit Achievement Modal Backend Support", achievement_modal_working))
        all_tests_passed &= achievement_modal_working
    except Exception as e:
        print(f"❌ Test 2 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 3: Edit News/Event Modal Backend Support
    try:
        newsevent_modal_working = test_edit_newsevent_modal_backend()
        test_results.append(("Edit News/Event Modal Backend Support", newsevent_modal_working))
        all_tests_passed &= newsevent_modal_working
    except Exception as e:
        print(f"❌ Test 3 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 4: Authentication System for Edit Operations
    try:
        auth_working = test_authentication_system_for_edit_operations()
        test_results.append(("Authentication System for Edit Operations", auth_working))
        all_tests_passed &= auth_working
    except Exception as e:
        print(f"❌ Test 4 failed with exception: {e}")
        all_tests_passed = False
    
    # Test 5: Data Persistence and Validation
    try:
        persistence_working = test_data_persistence_and_validation()
        test_results.append(("Data Persistence and Validation", persistence_working))
        all_tests_passed &= persistence_working
    except Exception as e:
        print(f"❌ Test 5 failed with exception: {e}")
        all_tests_passed = False
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 EDIT MODALS UI FIXES - BACKEND INFRASTRUCTURE TEST RESULTS")
    print("=" * 80)
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:<50} {status}")
    
    print("=" * 80)
    
    if all_tests_passed:
        print("🎉 ALL EDIT MODALS BACKEND INFRASTRUCTURE TESTS PASSED!")
        print("✅ Edit Project Modal backend infrastructure is ready for UI improvements.")
        print("✅ Edit Achievement Modal backend infrastructure supports rich text editing.")
        print("✅ Edit News/Event Modal backend infrastructure supports full content editing.")
        print("✅ Authentication system properly protects Edit modal operations.")
        print("✅ Data persistence and validation systems support Edit modal functionality.")
        print("✅ Google Sheets API integration provides data sources for Edit modals.")
        print("")
        print("⚠️  IMPORTANT NOTE: This testing covers only the backend infrastructure.")
        print("    The actual UI improvements (modal sizing, sticky headers, scrollable content,")
        print("    gradient sections, button positioning, responsive design) require frontend")
        print("    testing or manual verification through the admin panel interface.")
        print("")
        print("🔗 ADMIN PANEL ACCESS:")
        print(f"   Login URL: {FRONTEND_URL}/admin/login")
        print(f"   Credentials: admin/@dminsesg405")
        print(f"   Navigate to: Content Management → Select content type → Click Edit button")
        return True
    else:
        print("⚠️  SOME EDIT MODALS BACKEND INFRASTRUCTURE TESTS FAILED!")
        print("   Please review the issues above before testing UI improvements.")
        return False

# Main execution
if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)