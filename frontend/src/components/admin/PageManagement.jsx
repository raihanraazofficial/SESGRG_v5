import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  Globe,
  Layout,
  Code,
  Save,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

const PageManagement = () => {
  // Pages stored in localStorage
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    status: 'draft',
    showInNavbar: false,
    navbarOrder: 0
  });

  // Load pages from localStorage
  useEffect(() => {
    const storedPages = localStorage.getItem('custom_pages');
    if (storedPages) {
      setPages(JSON.parse(storedPages));
    } else {
      // Initialize with some default pages
      const defaultPages = [
        {
          id: 'page-1',
          title: 'About Us',
          slug: 'about-us',
          content: '<h1>About SESG Research</h1><p>Welcome to our research lab...</p>',
          metaDescription: 'Learn more about SESG Research and our mission',
          status: 'published',
          showInNavbar: true,
          navbarOrder: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'page-2',
          title: 'FAQ',
          slug: 'faq',
          content: '<h1>Frequently Asked Questions</h1><div class="space-y-6">...</div>',
          metaDescription: 'Find answers to common questions about our research',
          status: 'published',
          showInNavbar: true,
          navbarOrder: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setPages(defaultPages);
      localStorage.setItem('custom_pages', JSON.stringify(defaultPages));
    }
  }, []);

  // Save pages to localStorage
  const savePages = (updatedPages) => {
    setPages(updatedPages);
    localStorage.setItem('custom_pages', JSON.stringify(updatedPages));
  };

  // Filter pages
  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  // Generate unique ID
  const generateID = () => {
    return 'page-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  // Check if slug exists
  const slugExists = (slug, excludeId = null) => {
    return pages.some(page => page.slug === slug && page.id !== excludeId);
  };

  // Handle add page
  const handleAddPage = async () => {
    if (!formData.title || !formData.slug) {
      alert('Please fill in title and slug fields');
      return;
    }

    if (slugExists(formData.slug)) {
      alert('A page with this slug already exists');
      return;
    }

    setIsLoading(true);
    try {
      const newPage = {
        ...formData,
        id: generateID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedPages = [...pages, newPage];
      savePages(updatedPages);
      
      alert('Page created successfully!');
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      alert('Error creating page: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit page
  const handleEditPage = async () => {
    if (!editingPage) return;

    if (!formData.title || !formData.slug) {
      alert('Please fill in title and slug fields');
      return;
    }

    if (slugExists(formData.slug, editingPage.id)) {
      alert('A page with this slug already exists');
      return;
    }

    setIsLoading(true);
    try {
      const updatedPages = pages.map(page => 
        page.id === editingPage.id 
          ? { ...page, ...formData, updatedAt: new Date().toISOString() }
          : page
      );
      
      savePages(updatedPages);
      
      alert('Page updated successfully!');
      setIsEditModalOpen(false);
      setEditingPage(null);
      resetForm();
    } catch (error) {
      alert('Error updating page: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete page
  const handleDeletePage = async () => {
    if (!editingPage) return;

    setIsLoading(true);
    try {
      const updatedPages = pages.filter(page => page.id !== editingPage.id);
      savePages(updatedPages);
      
      alert('Page deleted successfully!');
      setIsDeleteModalOpen(false);
      setEditingPage(null);
    } catch (error) {
      alert('Error deleting page: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaDescription: '',
      status: 'draft',
      showInNavbar: false,
      navbarOrder: 0
    });
  };

  // Open modals
  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaDescription: page.metaDescription,
      status: page.status,
      showInNavbar: page.showInNavbar,
      navbarOrder: page.navbarOrder || 0
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (page) => {
    setEditingPage(page);
    setIsDeleteModalOpen(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Page Management</h1>
          <p className="text-gray-600 mt-2">Create and manage website pages</p>
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Page
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <Card key={page.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{page.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">/{page.slug}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                      {page.status}
                    </span>
                    {page.showInNavbar && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        In Navbar
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                    title="Preview Page"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(page)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteModal(page)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>{page.metaDescription || 'No description'}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span>Created:</span>
                  <span>{new Date(page.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Updated:</span>
                  <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                </div>

                {page.showInNavbar && (
                  <div className="flex items-center justify-between">
                    <span>Nav Order:</span>
                    <span>#{page.navbarOrder || 0}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No pages match your search criteria.' : 'Get started by creating your first page.'}
          </p>
          <Button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Create First Page
          </Button>
        </div>
      )}

      {/* Add/Edit Page Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isAddModalOpen ? 'Create New Page' : 'Edit Page'}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Title *
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="Enter page title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug *
                    </label>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-1">/{}</span>
                      <Input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleFormChange('slug', e.target.value)}
                        placeholder="page-url-slug"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleFormChange('metaDescription', e.target.value)}
                      placeholder="Brief description for SEO"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.showInNavbar}
                        onChange={(e) => handleFormChange('showInNavbar', e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show in Navigation Bar</span>
                    </label>

                    {formData.showInNavbar && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Navigation Order
                        </label>
                        <Input
                          type="number"
                          value={formData.navbarOrder}
                          onChange={(e) => handleFormChange('navbarOrder', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Content (HTML)
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleFormChange('content', e.target.value)}
                    placeholder="Enter HTML content for the page..."
                    rows={20}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags and Tailwind CSS classes for styling.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={isAddModalOpen ? handleAddPage : handleEditPage}
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? 'Saving...' : (isAddModalOpen ? 'Create Page' : 'Update Page')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingPage(null);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the page "{editingPage.title}"? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={handleDeletePage}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? 'Deleting...' : 'Delete Page'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageManagement;