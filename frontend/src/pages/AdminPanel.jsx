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
  BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { usePeople } from '../contexts/PeopleContext';
import { usePublications } from '../contexts/PublicationsContext';
import { useProjects } from '../contexts/ProjectsContext';
import { useAchievements } from '../contexts/AchievementsContext';
import { useNewsEvents } from '../contexts/NewsEventsContext';
import ContentManagement from '../components/admin/ContentManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Context data for statistics
  const { peopleData } = usePeople();
  const { publications } = usePublications();
  const { projects } = useProjects();
  const { achievements } = useAchievements();
  const { newsEvents } = useNewsEvents();

  // Calculate statistics
  const stats = {
    totalPeople: (peopleData?.advisors?.length || 0) + 
                 (peopleData?.teamMembers?.length || 0) + 
                 (peopleData?.collaborators?.length || 0),
    totalPublications: publications?.length || 0,
    totalProjects: projects?.length || 0,
    totalAchievements: achievements?.length || 0,
    totalNewsEvents: newsEvents?.length || 0,
    activeProjects: projects?.filter(p => p.status === 'Active')?.length || 0,
    completedProjects: projects?.filter(p => p.status === 'Completed')?.length || 0
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation items
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview and statistics'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage admin and moderator accounts',
      adminOnly: true
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      description: 'Manage publications, projects, people, etc.'
    },
    {
      id: 'pages',
      label: 'Page Management',
      icon: Edit3,
      description: 'Create and manage website pages'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'System configuration',
      adminOnly: true
    }
  ];

  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.username}!</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">{user?.role} Access</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total People</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPeople}</div>
            <p className="text-xs text-gray-600">
              Advisors, Team Members & Collaborators
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPublications}</div>
            <p className="text-xs text-gray-600">
              Journal Articles, Conference Papers & Books
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-gray-600">
              {stats.activeProjects} Active, {stats.completedProjects} Completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAchievements}</div>
            <p className="text-xs text-gray-600">
              Awards, Grants & Recognition
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-emerald-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('content')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Team Member
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('content')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Add New Publication
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('content')}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('pages')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Page
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last login</span>
                <span className="font-medium">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'First time'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account created</span>
                <span className="font-medium">Admin Account</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total content items</span>
                <span className="font-medium">
                  {stats.totalPublications + stats.totalProjects + stats.totalAchievements + stats.totalNewsEvents}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Website Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-purple-600" />
            Website Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                className="p-3 text-center bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-gray-900"
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
      case 'users':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage admin and moderator accounts</p>
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
      case 'content':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">Manage all website content from one place</p>
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Centralized Content Management</p>
                  <p className="text-sm">Coming in next phase...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'pages':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Page Management</h1>
            <p className="text-gray-600">Create and manage website pages</p>
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>WordPress-style Page Management</p>
                  <p className="text-sm">Coming in next phase...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">System configuration and preferences</p>
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
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src="/Logo.jpg" 
                    alt="SESG Logo" 
                    className="w-8 h-8 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">SESG Admin</h2>
                  <p className="text-xs text-gray-500">Control Panel</p>
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
              if (item.adminOnly && !isAdmin()) return null;
              
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
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
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-sm">{user?.username}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
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

export default AdminPanel;