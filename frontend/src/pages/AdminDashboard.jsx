import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Shield,
  UserPlus,
  Edit3,
  Trash2,
  Plus,
  Eye,
  BarChart3,
  Award,
  Calendar,
  Image,
  Phone,
  TrendingUp,
  Activity,
  Globe,
  Database
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { usePeople } from '../contexts/PeopleContext';
import { usePublications } from '../contexts/PublicationsContext';
import { useProjects } from '../contexts/ProjectsContext';
import { useAchievements } from '../contexts/AchievementsContext';
import { useNewsEvents } from '../contexts/NewsEventsContext';
import { useContact } from '../contexts/ContactContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin, hasPermission, PERMISSIONS } = useAuth();
  const navigate = useNavigate();

  // Context data for statistics
  const { peopleData } = usePeople();
  const { publicationsData } = usePublications();
  const { projectsData } = useProjects();
  const { achievementsData } = useAchievements();
  const { newsEventsData } = useNewsEvents();
  const { getInquiryStats } = useContact();

  // Calculate statistics
  const inquiryStats = getInquiryStats();
  const stats = {
    totalPeople: (peopleData?.advisors?.length || 0) + 
                 (peopleData?.teamMembers?.length || 0) + 
                 (peopleData?.collaborators?.length || 0),
    totalPublications: publicationsData?.length || 0,
    totalProjects: projectsData?.length || 0,
    totalAchievements: achievementsData?.length || 0,
    totalNewsEvents: newsEventsData?.length || 0,
    totalInquiries: inquiryStats?.total || 0,
    newInquiries: inquiryStats?.new || 0,
    activeProjects: projectsData?.filter(p => p.status === 'Active')?.length || 0,
    completedProjects: projectsData?.filter(p => p.status === 'Completed')?.length || 0,
    totalContent: (publicationsData?.length || 0) + 
                  (projectsData?.length || 0) + 
                  (achievementsData?.length || 0) + 
                  (newsEventsData?.length || 0)
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation items with permission checks
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      description: 'Manage all website content',
      permission: PERMISSIONS.EDIT_CONTENT
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage admin users',
      permission: PERMISSIONS.VIEW_USERS,
      adminOnly: true
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Website analytics',
      permission: PERMISSIONS.VIEW_ANALYTICS
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      description: 'System configuration',
      permission: PERMISSIONS.SYSTEM_SETTINGS,
      adminOnly: true
    }
  ];

  // Handle content management navigation
  const handleContentManagement = (contentType) => {
    // This will open in a separate window as requested
    const contentUrl = `/admin/content/${contentType}`;
    window.open(contentUrl, `_blank_${contentType}`, 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interactive Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back, {user?.username}! Here's your website overview.</p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 px-6 py-3 rounded-xl">
          <Shield className="h-5 w-5" />
          <span className="font-semibold">{user?.role} Access</span>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Globe className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats.totalContent}</div>
            <p className="text-xs text-gray-600 mt-1">
              Publications, Projects, Achievements, News
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.activeProjects}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.completedProjects} Completed Projects
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.totalPeople}</div>
            <p className="text-xs text-gray-600 mt-1">
              Advisors, Team Members, Collaborators
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.newInquiries}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.totalInquiries} Total Inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Management Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
            <CardTitle className="flex items-center text-emerald-800">
              <Plus className="h-5 w-5 mr-2" />
              Content Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-6">Manage all your website content with professional rich text editor</p>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="flex items-center justify-center h-16 bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100"
                variant="outline"
                onClick={() => handleContentManagement('publications')}
              >
                <FileText className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Publications</div>
                  <div className="text-xs">{stats.totalPublications} items</div>
                </div>
              </Button>
              
              <Button 
                className="flex items-center justify-center h-16 bg-purple-50 text-purple-700 border-2 border-purple-200 hover:bg-purple-100"
                variant="outline"
                onClick={() => handleContentManagement('projects')}
              >
                <Database className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Projects</div>
                  <div className="text-xs">{stats.totalProjects} items</div>
                </div>
              </Button>
              
              <Button 
                className="flex items-center justify-center h-16 bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-100"
                variant="outline"
                onClick={() => handleContentManagement('achievements')}
              >
                <Award className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Achievements</div>
                  <div className="text-xs">{stats.totalAchievements} items</div>
                </div>
              </Button>
              
              <Button 
                className="flex items-center justify-center h-16 bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                variant="outline"
                onClick={() => handleContentManagement('news-events')}  
              >
                <Calendar className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">News & Events</div>
                  <div className="text-xs">{stats.totalNewsEvents} items</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center text-blue-800">
              <Eye className="h-5 w-5 mr-2" />
              Quick Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium">People Management</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleContentManagement('people')}
                >
                  Manage ({stats.totalPeople})
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Image className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Gallery Management</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleContentManagement('gallery')}
                >
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium">Contact Inquiries</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleContentManagement('contact')}
                >
                  View ({stats.totalInquiries})
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium">Homepage Content</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleContentManagement('home')}
                >
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Website Navigation */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="flex items-center text-gray-800">
            <Globe className="h-5 w-5 mr-2" />
            Website Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Home', path: '/' },
              { name: 'People', path: '/people' },
              { name: 'Publications', path: '/publications' },
              { name: 'Projects', path: '/projects' },
              { name: 'Achievements', path: '/achievements' },
              { name: 'News & Events', path: '/news-events' },
              { name: 'Research Areas', path: '/research-areas' },
              { name: 'Gallery', path: '/gallery' }
            ].map((page) => (
              <Link 
                key={page.name}
                to={page.path}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 text-center bg-gradient-to-br from-white to-gray-50 hover:from-emerald-50 hover:to-emerald-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 shadow-sm hover:shadow-md"
              >
                {page.name}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'content':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">Content management forms will open in separate browser windows with rich text editor.</p>
            <DashboardContent />
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Create and manage Admin and Moderator accounts with role-based permissions.</p>
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>User Management System</p>
                  <p className="text-sm">Coming in next phase...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Website analytics and performance metrics.</p>
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics Dashboard</p>
                  <p className="text-sm">Coming in next phase...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">System configuration and preferences.</p>
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>System Settings</p>
                  <p className="text-sm">Coming in next phase...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img 
                    src="/Logo.jpg" 
                    alt="SESG Logo" 
                    className="w-10 h-10 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">SESG Admin</h2>
                  <p className="text-xs text-emerald-600">New Dashboard</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              // Check permissions
              if (item.adminOnly && !isAdmin()) return null;
              if (item.permission && !hasPermission(item.permission)) return null;
              
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-sm">{user?.username}</div>
                <div className="text-xs text-emerald-600">{user?.role}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                View Website
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;