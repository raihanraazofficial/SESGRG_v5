import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, ExternalLink, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { useFooter } from '../../contexts/FooterContext';

const FooterQuickLinksModal = ({ isOpen, onClose }) => {
  const { footerData, addQuickLink, updateQuickLink, deleteQuickLink } = useFooter();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    isExternal: false
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsAddingLink(false);
      setEditingLink(null);
      setFormData({ title: '', url: '', isExternal: false });
    }
  }, [isOpen]);

  // Load editing data
  useEffect(() => {
    if (editingLink) {
      setFormData({
        title: editingLink.title,
        url: editingLink.url,
        isExternal: editingLink.isExternal
      });
    }
  }, [editingLink]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingLink) {
        await updateQuickLink(editingLink.id, formData);
        alert('Quick link updated successfully!');
      } else {
        await addQuickLink(formData);
        alert('Quick link added successfully!');
      }
      
      // Reset form
      setFormData({ title: '', url: '', isExternal: false });
      setIsAddingLink(false);
      setEditingLink(null);
    } catch (error) {
      console.error('Error saving quick link:', error);
      alert('Failed to save quick link. Please try again.');
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setIsAddingLink(true);
  };

  const handleDelete = async (linkId) => {
    if (confirm('Are you sure you want to delete this quick link?')) {
      try {
        await deleteQuickLink(linkId);
        alert('Quick link deleted successfully!');
      } catch (error) {
        console.error('Error deleting quick link:', error);
        alert('Failed to delete quick link. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const cancelForm = () => {
    setFormData({ title: '', url: '', isExternal: false });
    setIsAddingLink(false);
    setEditingLink(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Manage Quick Links</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Add New Link Button */}
          {!isAddingLink && (
            <div className="mb-6">
              <Button
                onClick={() => setIsAddingLink(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Quick Link
              </Button>
            </div>
          )}

          {/* Add/Edit Form */}
          {isAddingLink && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">
                {editingLink ? 'Edit Quick Link' : 'Add New Quick Link'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="BRAC University"
                      required
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://www.bracu.ac.bd or /research"
                      required
                    />
                  </div>
                </div>

                {/* External Link Checkbox */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isExternal"
                      checked={formData.isExternal}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      External link (opens in new tab)
                    </span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={cancelForm}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingLink ? 'Update Link' : 'Add Link'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Quick Links List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Quick Links ({footerData?.quickLinks?.length || 0})</h3>
            
            {footerData?.quickLinks?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No quick links added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {footerData?.quickLinks?.map((link) => (
                  <div key={link.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-800">{link.title}</h4>
                          {link.isExternal && (
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 break-all">{link.url}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                          link.isExternal 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {link.isExternal ? 'External' : 'Internal'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          onClick={() => handleEdit(link)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(link.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterQuickLinksModal;