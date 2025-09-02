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
  Filter,
  Phone,
  Image,
  Home
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import '../../styles/admin-responsive.css';
import { usePeople } from '../../contexts/PeopleContext';
import { usePublications } from '../../contexts/PublicationsContext';
import { useProjects } from '../../contexts/ProjectsContext';
import { useAchievements } from '../../contexts/AchievementsContext';
import { useNewsEvents } from '../../contexts/NewsEventsContext';
import { useContact } from '../../contexts/ContactContext';
import { useGallery } from '../../contexts/GalleryContext';
import { useHome } from '../../contexts/HomeContext';
import { useResearchAreas } from '../../contexts/ResearchAreasContext';

// Import People modals
import EditPersonModal from '../EditPersonModal';
import AddPersonModal from '../AddPersonModal';
import DeleteConfirmModal from '../DeleteConfirmModal';

// Import Publications modals
import AddPublicationModal from '../publications/AddPublicationModal';
import EditPublicationModal from '../publications/EditPublicationModal';
import DeletePublicationModal from '../publications/DeletePublicationModal';

// Import Projects modals
import AddProjectModal from '../projects/AddProjectModal';
import EditProjectModal from '../projects/EditProjectModal';
import DeleteProjectModal from '../projects/DeleteProjectModal';

// Import Achievements modals
import AddAchievementModal from '../achievements/AddAchievementModal';
import EditAchievementModal from '../achievements/EditAchievementModal';
import DeleteAchievementModal from '../achievements/DeleteAchievementModal';

// Import NewsEvents modals
import AddNewsEventModal from '../newsevents/AddNewsEventModal';
import EditNewsEventModal from '../newsevents/EditNewsEventModal';
import DeleteNewsEventModal from '../newsevents/DeleteNewsEventModal';

// Import Calendar Management
import CalendarManagement from './CalendarManagement';

// Import Contact Management
import ContactManagement from './ContactManagement';

// Import Gallery modals
import AddGalleryModal from '../gallery/AddGalleryModal';
import EditGalleryModal from '../gallery/EditGalleryModal';
import DeleteGalleryModal from '../gallery/DeleteGalleryModal';

// Import Home Management
import HomeManagement from './HomeManagement';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('home');
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
  const { publicationsData, addPublication, updatePublication, deletePublication, researchAreas: pubResearchAreas } = usePublications();
  const { projectsData, addProject, updateProject, deleteProject, researchAreas: projResearchAreas, statuses } = useProjects();
  const { achievementsData, addAchievement, updateAchievement, deleteAchievement, categories: achievementCategories } = useAchievements();
  const { newsEventsData, addNewsEvent, updateNewsEvent, deleteNewsEvent, categories: newsEventCategories } = useNewsEvents();
  const { inquiries, getInquiryStats } = useContact();
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem, categories: galleryCategories } = useGallery();
  const { aboutUs, carouselImages, objectives } = useHome();
  const { researchAreas } = useResearchAreas();

  // Content tabs
  const contentTabs = [
    {
      id: 'home',
      label: 'Homepage',
      icon: Home,
      count: (carouselImages?.length || 0) + (objectives?.length || 0) + (researchAreas?.length || 0) + 1 // +1 for about us
    },
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
      count: publicationsData?.length || 0
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      count: projectsData?.length || 0
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      count: achievementsData?.length || 0
    },
    {
      id: 'news-events',
      label: 'News & Events',
      icon: Calendar,
      count: newsEventsData?.length || 0
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: Image,
      count: galleryItems?.length || 0
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Phone,
      count: inquiries?.length || 0
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      count: null // Calendar doesn't have count
    }
  ];

  // Handle operations
  const handleAdd = (category) => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleEdit = (item, category) => {
    setEditingItem(item);
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item, category) => {
    setDeletingItem(item);
    setEditingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Validate required data before delete
      if (!deletingItem || !deletingItem.id || !editingCategory) {
        throw new Error('Missing required data for deletion');
      }
      
      if (editingCategory === 'people') {
        // Validate people-specific data
        if (!deletingItem.category) {
          throw new Error('Person category is required for deletion');
        }
        // Map display category to storage category
        const categoryMap = {
          'Advisor': 'advisors',
          'Team Member': 'teamMembers', 
          'Collaborator': 'collaborators'
        };
        const storageCategory = categoryMap[deletingItem.category];
        if (!storageCategory) {
          throw new Error(`Invalid person category: ${deletingItem.category}`);
        }
        deletePerson(storageCategory, deletingItem.id);
      } else if (editingCategory === 'publications') {
        await deletePublication(deletingItem.id);
      } else if (editingCategory === 'projects') {
        await deleteProject(deletingItem.id);
      } else if (editingCategory === 'achievements') {
        await deleteAchievement(deletingItem.id);
      } else if (editingCategory === 'news-events') {
        await deleteNewsEvent(deletingItem.id);
      } else if (editingCategory === 'gallery') {
        await deleteGalleryItem(deletingItem.id);
      }
      
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      setEditingCategory(null);
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error deleting item: ${error.message}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Add operations
  const handleAddItem = async (itemData) => {
    try {
      if (editingCategory === 'publications') {
        await addPublication(itemData);
      } else if (editingCategory === 'projects') {
        await addProject(itemData);
      } else if (editingCategory === 'achievements') {
        await addAchievement(itemData);
      } else if (editingCategory === 'news-events') {
        await addNewsEvent(itemData);
      } else if (editingCategory === 'gallery') {
        await addGalleryItem(itemData);
      }
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  // Handle Edit operations
  const handleEditItem = async (id, itemData) => {
    try {
      if (editingCategory === 'publications') {
        await updatePublication(id, itemData);
      } else if (editingCategory === 'projects') {
        await updateProject(id, itemData);
      } else if (editingCategory === 'achievements') {
        await updateAchievement(id, itemData);
      } else if (editingCategory === 'news-events') {
        await updateNewsEvent(id, itemData);
      } else if (editingCategory === 'gallery') {
        await updateGalleryItem(id, itemData);
      }
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
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
        return publicationsData || [];
      case 'projects':
        return projectsData || [];
      case 'achievements':
        return achievementsData || [];
      case 'news-events':
        return newsEventsData || [];
      case 'gallery':
        return galleryItems || [];
      case 'calendar':
        return []; // Calendar settings don't have list data
      default:
        return [];
    }
  };

  // Get proper add button text
  const getAddButtonText = () => {
    switch (activeTab) {
      case 'people':
        return 'Person';
      case 'publications':
        return 'Publication';
      case 'projects':
        return 'Project';
      case 'achievements':
        return 'Achievement';
      case 'news-events':
        return 'News/Event';
      case 'gallery':
        return 'Gallery Item';
      default:
        return 'Item';
    }
  };

  // Filter data based on search and category
  const filteredData = getTabData().filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caption?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                           item.status?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Render content based on active tab
  const renderContent = () => {
    // Special handling for home management
    if (activeTab === 'home') {
      return <HomeManagement />;
    }

    // Special handling for calendar settings
    if (activeTab === 'calendar') {
      return <CalendarManagement />;
    }

    // Special handling for contact management
    if (activeTab === 'contact') {
      return <ContactManagement />;
    }

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-8 lg:py-16">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
          </div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 px-4">
            {searchTerm ? 'No items match your search criteria.' : 'Get started by adding your first item.'}
          </p>
          <Button 
            onClick={() => handleAdd(activeTab)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3"
          >
            <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
            Add {getAddButtonText()}
          </Button>
        </div>
      );
    }

    return (
      <div className="admin-content-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6">
        {filteredData.map((item, index) => (
          <Card key={item.id || index} className="admin-card hover:shadow-lg transition-all duration-200 border border-gray-200">
            <CardContent className="admin-card-content p-3 lg:p-4 xl:p-6">
              <div className="flex flex-col space-y-3 lg:space-y-4">
                {/* Gallery thumbnail */}
                {activeTab === 'gallery' && item.url && (
                  <div className="w-full h-32 lg:h-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA1MEg4MFY1MEgxMjBWNTBIMTIwVjcwSDEyMFY3MEg4MFY3MEg4MFY1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1 min-h-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm lg:text-base xl:text-lg leading-tight">
                    {item.name || item.title || item.caption}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 lg:gap-2 mb-2 lg:mb-3">
                    {item.category && (
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs lg:text-sm font-medium rounded-full">
                        {item.category}
                      </span>
                    )}
                    {item.status && (
                      <span className={`inline-block px-2 py-1 text-xs lg:text-sm font-medium rounded-full ${
                        item.status === 'Active' ? 'bg-green-100 text-green-700' :
                        item.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  
                  {/* Display relevant info based on content type */}
                  <div className="text-xs lg:text-sm text-gray-600 space-y-1">
                    {activeTab === 'people' && (
                      <>
                        <p className="line-clamp-1">{item.designation}</p>
                        <p className="text-emerald-600 line-clamp-1">{item.affiliation}</p>
                      </>
                    )}
                    {activeTab === 'publications' && (
                      <>
                        <p className="line-clamp-1">{Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</p>
                        <p>{item.year} • {item.category}</p>
                      </>
                    )}
                    {activeTab === 'projects' && (
                      <>
                        <p className="line-clamp-1">{item.principal_investigator}</p>
                        <p>{item.status}</p>
                      </>
                    )}
                    {activeTab === 'achievements' && (
                      <>
                        <p className="line-clamp-2">{item.short_description}</p>
                        <p>{new Date(item.date).toLocaleDateString()}</p>
                      </>
                    )}
                    {activeTab === 'news-events' && (
                      <>
                        <p className="line-clamp-2">{item.short_description}</p>
                        <p>{new Date(item.date).toLocaleDateString()}</p>
                      </>
                    )}
                    {activeTab === 'gallery' && (
                      <>
                        <p className="line-clamp-2">{item.description}</p>
                        <p className="text-emerald-600">{item.category}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="admin-card-actions flex flex-row gap-2 pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item, activeTab)}
                    className="flex-1 text-xs lg:text-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  >
                    <Edit3 className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item, activeTab)}
                    className="flex-1 text-xs lg:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-content-management min-h-screen bg-gray-50 p-3 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="admin-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3 lg:gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Manage all your website content from one place</p>
          </div>
          {activeTab !== 'calendar' && activeTab !== 'contact' && (
            <Button
              onClick={() => handleAdd(activeTab)}
              className="admin-add-button bg-emerald-600 hover:bg-emerald-700 text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 w-full sm:w-auto"
            >
              <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              Add {getAddButtonText()}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="admin-tabs-container admin-content-tabs mb-4 lg:mb-6">
          {contentTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab-button flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-all duration-200 text-xs lg:text-sm xl:text-base ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
                }`}
              >
                <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        {activeTab !== 'calendar' && activeTab !== 'contact' && (
          <div className="admin-search-filters flex flex-col sm:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6 p-3 lg:p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${contentTabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input w-full pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="sm:w-48 lg:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="admin-filter-select w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
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
                    <option value="conference paper">Conference Papers</option>
                    <option value="book chapter">Book Chapters</option>
                  </>
                )}
                {activeTab === 'projects' && (
                  <>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planning">Planning</option>
                  </>
                )}
                {activeTab === 'achievements' && achievementCategories.map(category => (
                  <option key={category} value={category.toLowerCase()}>{category}</option>
                ))}
                {activeTab === 'news-events' && newsEventCategories.map(category => (
                  <option key={category} value={category.toLowerCase()}>{category}</option>
                ))}
                {activeTab === 'gallery' && galleryCategories.map(category => (
                  <option key={category} value={category.toLowerCase()}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
          {renderContent()}
        </div>

      </div>

      {/* Modals - People */}
      {activeTab === 'people' && (
        <>
          <AddPersonModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
          
          <EditPersonModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
              setEditingCategory(null);
            }}
            person={editingItem}
            category={editingCategory}
          />
          
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingItem(null);
            }}
            onConfirm={handleConfirmDelete}
            person={deletingItem}
            isDeleting={isDeleting}
          />
        </>
      )}

      {/* Modals - Publications */}
      {activeTab === 'publications' && (
        <>
          <AddPublicationModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingCategory(null);
            }}
            onAdd={handleAddItem}
            researchAreas={pubResearchAreas || []}
          />
          
          <EditPublicationModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
              setEditingCategory(null);
            }}
            onUpdate={handleEditItem}
            publication={editingItem}
            researchAreas={pubResearchAreas || []}
          />
          
          <DeletePublicationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingItem(null);
              setEditingCategory(null);
            }}
            onConfirm={handleConfirmDelete}
            publication={deletingItem}
            isDeleting={isDeleting}
          />
        </>
      )}

      {/* Modals - Projects */}
      {activeTab === 'projects' && (
        <>
          <AddProjectModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingCategory(null);
            }}
            onAdd={handleAddItem}
            researchAreas={projResearchAreas || []}
            statuses={statuses || []}
          />
          
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
              setEditingCategory(null);
            }}
            onUpdate={handleEditItem}
            project={editingItem}
            researchAreas={projResearchAreas || []}
            statuses={statuses || []}
          />
          
          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingItem(null);
              setEditingCategory(null);
            }}
            onConfirm={handleConfirmDelete}
            project={deletingItem}
            isDeleting={isDeleting}
          />
        </>
      )}

      {/* Modals - Achievements */}
      {activeTab === 'achievements' && (
        <>
          <AddAchievementModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingCategory(null);
            }}
            onAdd={handleAddItem}
            categories={achievementCategories || []}
          />
          
          <EditAchievementModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
              setEditingCategory(null);
            }}
            onUpdate={handleEditItem}
            achievement={editingItem}
            categories={achievementCategories || []}
          />
          
          <DeleteAchievementModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingItem(null);
              setEditingCategory(null);
            }}
            onConfirm={handleConfirmDelete}
            achievement={deletingItem}
            isDeleting={isDeleting}
          />
        </>
      )}

      {/* Modals - News Events */}
      {activeTab === 'news-events' && (
        <>
          <AddNewsEventModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingCategory(null);
            }}
            onSubmit={handleAddItem}
            categories={newsEventCategories || []}
          />
          
          <EditNewsEventModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
              setEditingCategory(null);
            }}
            onSubmit={handleEditItem}
            categories={newsEventCategories || []}
            newsEvent={editingItem}
          />
          
          <DeleteNewsEventModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingItem(null);
              setEditingCategory(null);
            }}
            onConfirm={handleConfirmDelete}
            newsEvent={deletingItem}
            isDeleting={isDeleting}
          />
        </>
      )}

      {/* Modals - Gallery */}
      {activeTab === 'gallery' && (
        <>
          <AddGalleryModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingCategory(null);
            }}
            onAdd={handleAddItem}
            categories={galleryCategories || []}
          />
          
          <EditGalleryModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
              setEditingCategory(null);
            }}
            onUpdate={handleEditItem}
            item={editingItem}
            categories={galleryCategories || []}
          />
          
          <DeleteGalleryModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingItem(null);
              setEditingCategory(null);
            }}
            onConfirm={handleConfirmDelete}
            item={deletingItem}
          />
        </>
      )}

    </div>
  );
};

export default ContentManagement;