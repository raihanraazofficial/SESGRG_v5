import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  FolderOpen, 
  Trophy, 
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { usePeople } from '../../contexts/PeopleContext';
import { usePublications } from '../../contexts/PublicationsContext';
import { useProjects } from '../../contexts/ProjectsContext';
import { useAchievements } from '../../contexts/AchievementsContext';
import { useNewsEvents } from '../../contexts/NewsEventsContext';

// Import modals
import EditPersonModal from '../EditPersonModal';
import AddPersonModal from '../AddPersonModal';
import DeleteConfirmModal from '../DeleteConfirmModal';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('people');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Context data
  const { peopleData, deletePerson } = usePeople();
  const { publications } = usePublications();
  const { projects } = useProjects();
  const { achievements } = useAchievements();
  const { newsEvents } = useNewsEvents();

  // Content tabs
  const contentTabs = [
    {
      id: 'people',
      label: 'People',
      icon: Users,
      count: (peopleData?.advisors?.length || 0) + 
             (peopleData?.teamMembers?.length || 0) + 
             (peopleData?.collaborators?.length || 0)
    },
    {
      id: 'publications',
      label: 'Publications',
      icon: FileText,
      count: publications?.length || 0
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      count: projects?.length || 0
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      count: achievements?.length || 0
    },
    {
      id: 'news-events',
      label: 'News & Events',
      icon: Calendar,
      count: newsEvents?.length || 0
    }
  ];

  // Handle CRUD operations
  const handleAdd = (contentType) => {
    setEditingCategory(contentType);
    setIsAddModalOpen(true);
  };

  const handleEdit = (item, contentType) => {
    setEditingItem(item);
    setEditingCategory(contentType);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item, contentType) => {
    setDeletingItem(item);
    setEditingCategory(contentType);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem || !editingCategory) return;
    
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call appropriate delete function based on content type
      if (editingCategory === 'people') {
        // Determine person category
        let category = 'advisors';
        if (peopleData.teamMembers?.some(p => p.id === deletingItem.id)) {
          category = 'teamMembers';
        } else if (peopleData.collaborators?.some(p => p.id === deletingItem.id)) {
          category = 'collaborators';
        }
        deletePerson(category, deletingItem.id);
      }
      // Add other delete operations for publications, projects, etc.
      
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get filtered data based on active tab
  const getTabData = () => {
    switch (activeTab) {
      case 'people':
        return [
          ...peopleData.advisors.map(p => ({ ...p, category: 'Advisor' })),
          ...peopleData.teamMembers.map(p => ({ ...p, category: 'Team Member' })),
          ...peopleData.collaborators.map(p => ({ ...p, category: 'Collaborator' }))
        ];
      case 'publications':
        return publications || [];
      case 'projects':
        return projects || [];
      case 'achievements':
        return achievements || [];
      case 'news-events':
        return newsEvents || [];
      default:
        return [];
    }
  };

  // Filter data based on search and category
  const filteredData = getTabData().filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           item.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Render content based on active tab
  const renderContent = () => {
    if (filteredData.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No items match your search criteria.' : 'Get started by adding your first item.'}
          </p>
          <Button onClick={() => handleAdd(activeTab)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add {contentTabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item, index) => (
          <Card key={item.id || index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {item.name || item.title}
                  </h3>
                  {item.category && (
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item, activeTab)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item, activeTab)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Display relevant info based on content type */}
              <div className="text-sm text-gray-600">
                {activeTab === 'people' && (
                  <>
                    <p className="mb-1">{item.designation}</p>
                    <p className="text-emerald-600">{item.affiliation}</p>
                  </>
                )}
                {activeTab === 'publications' && (
                  <>
                    <p className="mb-1">{item.authors}</p>
                    <p>{item.year} • {item.category}</p>
                  </>
                )}
                {activeTab === 'projects' && (
                  <>
                    <p className="mb-1">{item.principal_investigator}</p>
                    <p>{item.status}</p>
                  </>
                )}
                {activeTab === 'achievements' && (
                  <>
                    <p className="mb-1">{item.short_description}</p>
                    <p>{new Date(item.date).toLocaleDateString()}</p>
                  </>
                )}
                {activeTab === 'news-events' && (
                  <>
                    <p className="mb-1 line-clamp-2">{item.short_description}</p>
                    <p>{new Date(item.date).toLocaleDateString()}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Manage all website content from one place</p>
        </div>
        <Button 
          onClick={() => handleAdd(activeTab)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Content Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {contentTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {activeTab === 'people' && (
              <>
                <option value="advisor">Advisors</option>
                <option value="team member">Team Members</option>
                <option value="collaborator">Collaborators</option>
              </>
            )}
            {activeTab === 'publications' && (
              <>
                <option value="journal article">Journal Articles</option>
                <option value="conference proceeding">Conference Papers</option>
                <option value="book chapter">Book Chapters</option>
              </>
            )}
            {activeTab === 'projects' && (
              <>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Content Display */}
      {renderContent()}

      {/* Modals */}
      {activeTab === 'people' && (
        <>
          <EditPersonModal
            person={editingItem}
            category={editingCategory}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
              setEditingCategory(null);
            }}
          />
          
          <AddPersonModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingCategory(null);
            }}
            category={editingCategory}
          />
          
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingItem(null);
              setEditingCategory(null);
            }}
            onConfirm={handleConfirmDelete}
            person={deletingItem}
            isLoading={isDeleting}
          />
        </>
      )}
    </div>
  );
};

export default ContentManagement;