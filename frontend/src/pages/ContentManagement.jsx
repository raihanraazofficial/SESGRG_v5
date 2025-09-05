import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Home,
  Save,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../contexts/AuthContext';
import { usePeople } from '../contexts/PeopleContext';
import { usePublications } from '../contexts/PublicationsContext';
import { useProjects } from '../contexts/ProjectsContext';
import { useAchievements } from '../contexts/AchievementsContext';
import { useNewsEvents } from '../contexts/NewsEventsContext';
import { useContact } from '../contexts/ContactContext';
import { useGallery } from '../contexts/GalleryContext';
import { useHome } from '../contexts/HomeContext';

const ContentManagement = () => {
  const { contentType } = useParams();
  const { user, hasPermission, PERMISSIONS } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Context data
  const { peopleData, addPerson, updatePerson, deletePerson } = usePeople();
  const { publicationsData, addPublication, updatePublication, deletePublication } = usePublications();
  const { projectsData, addProject, updateProject, deleteProject } = useProjects();
  const { achievementsData, addAchievement, updateAchievement, deleteAchievement } = useAchievements();
  const { newsEventsData, addNewsEvent, updateNewsEvent, deleteNewsEvent } = useNewsEvents();
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useGallery();
  const { inquiries } = useContact();

  // Get content config based on type
  const getContentConfig = () => {
    switch (contentType) {
      case 'people':
        return {
          title: 'People Management',
          icon: Users,
          data: [
            ...peopleData.advisors.map(p => ({ ...p, category: 'Advisor' })),
            ...peopleData.teamMembers.map(p => ({ ...p, category: 'Team Member' })),
            ...peopleData.collaborators.map(p => ({ ...p, category: 'Collaborator' }))
          ],
          fields: [
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'designation', label: 'Designation', type: 'text', required: true },
            { name: 'affiliation', label: 'Affiliation', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'profilePicture', label: 'Profile Picture URL', type: 'url' },
            { name: 'bio', label: 'Biography', type: 'richtext' },
            { name: 'category', label: 'Category', type: 'select', options: ['Advisor', 'Team Member', 'Collaborator'], required: true }
          ]
        };
      case 'publications':
        return {
          title: 'Publications Management',
          icon: FileText,
          data: publicationsData || [],
          fields: [
            { name: 'title', label: 'Publication Title', type: 'text', required: true },
            { name: 'authors', label: 'Authors', type: 'text', required: true },
            { name: 'journal', label: 'Journal/Conference', type: 'text', required: true },
            { name: 'year', label: 'Year', type: 'number', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Journal Article', 'Conference Paper', 'Book Chapter'], required: true },
            { name: 'abstract', label: 'Abstract', type: 'richtext' },
            { name: 'doi', label: 'DOI', type: 'text' },
            { name: 'pdf_url', label: 'PDF URL', type: 'url' },
            { name: 'featured', label: 'Featured Publication', type: 'checkbox' },
            { name: 'open_access', label: 'Open Access', type: 'checkbox' }
          ]
        };
      case 'projects':
        return {
          title: 'Projects Management',
          icon: FolderOpen,
          data: projectsData || [],
          fields: [
            { name: 'title', label: 'Project Title', type: 'text', required: true },
            { name: 'principal_investigator', label: 'Principal Investigator', type: 'text', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Completed', 'Planning'], required: true },
            { name: 'start_date', label: 'Start Date', type: 'date' },
            { name: 'end_date', label: 'End Date', type: 'date' },
            { name: 'description', label: 'Description', type: 'richtext' },
            { name: 'funding_amount', label: 'Funding Amount', type: 'number' },
            { name: 'funding_source', label: 'Funding Source', type: 'text' }
          ]
        };
      case 'achievements':
        return {
          title: 'Achievements Management',
          icon: Trophy,
          data: achievementsData || [],
          fields: [
            { name: 'title', label: 'Achievement Title', type: 'text', required: true },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Award', 'Grant', 'Recognition', 'Publication'], required: true },
            { name: 'short_description', label: 'Short Description', type: 'text', required: true },
            { name: 'detailed_description', label: 'Detailed Description (Blog Style)', type: 'richtext' },
            { name: 'featured', label: 'Featured Achievement', type: 'checkbox' },
            { name: 'image_url', label: 'Image URL', type: 'url' }
          ]
        };
      case 'news-events':
        return {
          title: 'News & Events Management',
          icon: Calendar,
          data: newsEventsData || [],
          fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['News', 'Event', 'Workshop', 'Conference'], required: true },
            { name: 'short_description', label: 'Short Description', type: 'text', required: true },
            { name: 'detailed_description', label: 'Detailed Description (Blog Style)', type: 'richtext' },
            { name: 'featured', label: 'Featured Item', type: 'checkbox' },
            { name: 'image_url', label: 'Image URL', type: 'url' },
            { name: 'location', label: 'Location', type: 'text' }
          ]
        };
      case 'gallery':
        return {
          title: 'Gallery Management',
          icon: Image,
          data: galleryItems || [],
          fields: [
            { name: 'caption', label: 'Caption', type: 'text', required: true },
            { name: 'url', label: 'Image URL', type: 'url', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Research', 'Events', 'Team', 'Lab'], required: true },
            { name: 'description', label: 'Description', type: 'richtext' },
            { name: 'date_taken', label: 'Date Taken', type: 'date' }
          ]
        };
      case 'contact':
        return {
          title: 'Contact Inquiries',
          icon: Phone,
          data: inquiries || [],
          fields: [] // Read-only for inquiries
        };
      case 'home':
        return {
          title: 'Homepage Management',
          icon: Home,
          data: [],
          fields: [] // Special handling for homepage
        };
      default:
        return {
          title: 'Content Management',
          icon: FileText,
          data: [],
          fields: []
        };
    }
  };

  const config = getContentConfig();
  const Icon = config.icon;

  // Filter data
  const filteredData = config.data.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caption?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                           item.status?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Handle form operations
  const handleAdd = () => {
    setFormMode('add');
    setSelectedItem(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormMode('edit');
    setSelectedItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name || item.title || item.caption}"?`)) {
      performDelete(item);
    }
  };

  const performDelete = async (item) => {
    try {
      switch (contentType) {
        case 'people':
          const categoryMap = {
            'Advisor': 'advisors',
            'Team Member': 'teamMembers', 
            'Collaborator': 'collaborators'
          };
          const storageCategory = categoryMap[item.category];
          deletePerson(storageCategory, item.id);
          break;
        case 'publications':
          deletePublication(item.id);
          break;
        case 'projects':
          deleteProject(item.id);
          break;
        case 'achievements':
          deleteAchievement(item.id);
          break;
        case 'news-events':
          deleteNewsEvent(item.id);
          break;
        case 'gallery':
          await deleteGalleryItem(item.id);
          break;
      }
      alert('Item deleted successfully!');
    } catch (error) {
      alert('Error deleting item: ' + error.message);
    }
  };

  const handleSave = async () => {
    try {
      if (formMode === 'add') {
        switch (contentType) {
          case 'people':
            await addPerson(formData);
            break;
          case 'publications':
            await addPublication(formData);
            break;
          case 'projects':
            await addProject(formData);
            break;
          case 'achievements':
            await addAchievement(formData);
            break;
          case 'news-events':
            await addNewsEvent(formData);
            break;
          case 'gallery':
            await addGalleryItem(formData);
            break;
        }
        alert('Item added successfully!');
      } else if (formMode === 'edit') {
        switch (contentType) {
          case 'people':
            await updatePerson(selectedItem.id, formData);
            break;
          case 'publications':
            await updatePublication(selectedItem.id, formData);
            break;
          case 'projects':
            await updateProject(selectedItem.id, formData);
            break;
          case 'achievements':
            await updateAchievement(selectedItem.id, formData);
            break;
          case 'news-events':
            await updateNewsEvent(selectedItem.id, formData);
            break;
          case 'gallery':
            await updateGalleryItem(selectedItem.id, formData);
            break;
        }
        alert('Item updated successfully!');
      }
      setIsFormOpen(false);
      setFormData({});
      setSelectedItem(null);
    } catch (error) {
      alert('Error saving item: ' + error.message);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required={field.required}
            placeholder={field.label}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>{field.label}</span>
          </label>
        );
      case 'richtext':
        return (
          <RichTextEditor
            value={value}
            onChange={(content) => handleFieldChange(field.name, content)}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            className="min-h-[300px]"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-gray-600">Professional content management with rich text editor</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {config.fields.length > 0 && hasPermission(PERMISSIONS.CREATE_CONTENT) && (
              <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => window.close()}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        {config.fields.length > 0 && (
          <div className="flex gap-4 mb-6 p-4 bg-white rounded-lg border">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {/* Add category options based on content type */}
            </select>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <Card key={item.id || index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.name || item.title || item.caption}
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  {item.category && (
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full mr-2">
                      {item.category}
                    </span>
                  )}
                  {item.status && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {item.status}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {hasPermission(PERMISSIONS.EDIT_CONTENT) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                  {hasPermission(PERMISSIONS.DELETE_CONTENT) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formMode === 'add' ? 'Add New' : 'Edit'} {config.title.replace(' Management', '')}
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setIsFormOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {config.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;