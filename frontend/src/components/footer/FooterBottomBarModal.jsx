import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { useFooter } from '../../contexts/FooterContext';

const FooterBottomBarModal = ({ isOpen, onClose }) => {
  const { footerData, updateBottomBar, addBottomBarLink, updateBottomBarLink, deleteBottomBarLink } = useFooter();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [copyrightText, setCopyrightText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    url: ''
  });

  // Load current data when modal opens
  useEffect(() => {
    if (isOpen && footerData?.bottomBar) {
      setCopyrightText(footerData.bottomBar.copyright || '');
      setIsAddingLink(false);
      setEditingLink(null);
      setFormData({ title: '', url: '' });
    }
  }, [isOpen, footerData]);

  // Load editing data
  useEffect(() => {
    if (editingLink) {
      setFormData({
        title: editingLink.title,
        url: editingLink.url
      });
    }
  }, [editingLink]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingLink) {
        await updateBottomBarLink(editingLink.id, formData);
        alert('Bottom bar link updated successfully!');
      } else {
        await addBottomBarLink(formData);
        alert('Bottom bar link added successfully!');
      }
      
      // Reset form
      setFormData({ title: '', url: '' });
      setIsAddingLink(false);
      setEditingLink(null);
    } catch (error) {
      console.error('Error saving bottom bar link:', error);
      alert('Failed to save bottom bar link. Please try again.');
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setIsAddingLink(true);
  };

  const handleDelete = async (linkId) => {
    if (confirm('Are you sure you want to delete this bottom bar link?')) {
      try {
        await deleteBottomBarLink(linkId);
        alert('Bottom bar link deleted successfully!');
      } catch (error) {
        console.error('Error deleting bottom bar link:', error);
        alert('Failed to delete bottom bar link. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancelForm = () => {
    setFormData({ title: '', url: '' });
    setIsAddingLink(false);
    setEditingLink(null);
  };

  const handleCopyrightUpdate = async () => {
    try {
      await updateBottomBar({ copyright: copyrightText });
      alert('Copyright text updated successfully!');
    } catch (error) {
      console.error('Error updating copyright:', error);
      alert('Failed to update copyright text. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Manage Bottom Bar</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Copyright Text */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Copyright Text</h3>
            <div className="space-y-3">
              <textarea
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Sustainable Energy and Smart Grid Research. All rights reserved."
              />
              <p className="text-xs text-gray-500">
                Note: The current year (© {new Date().getFullYear()}) will be automatically added before this text.
              </p>
              <Button
                onClick={handleCopyrightUpdate}
                className="bg-gray-600 hover:bg-gray-700"
                size="sm"
              >
                Update Copyright
              </Button>
            </div>
          </div>

          {/* Add New Link Button */}
          {!isAddingLink && (
            <div>
              <Button
                onClick={() => setIsAddingLink(true)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Bottom Bar Link
              </Button>
            </div>
          )}

          {/* Add/Edit Form */}
          {isAddingLink && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">
                {editingLink ? 'Edit Bottom Bar Link' : 'Add New Bottom Bar Link'}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="Privacy Policy"
                      required
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL *
                    </label>
                    <input
                      type="text"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="/privacy"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Internal links start with / (e.g., /contact, /about)
                    </p>
                  </div>
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
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    {editingLink ? 'Update Link' : 'Add Link'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Bottom Bar Links List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Bottom Bar Links ({footerData?.bottomBar?.links?.length || 0})</h3>
            
            {footerData?.bottomBar?.links?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bottom bar links added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {footerData?.bottomBar?.links?.map((link) => (
                  <div key={link.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{link.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{link.url}</p>
                        <span className="inline-block px-2 py-1 rounded-full text-xs mt-2 bg-gray-100 text-gray-800">
                          Footer Link
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

          {/* Footer Preview */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-900 text-gray-300">
            <h3 className="text-lg font-medium mb-4 text-white">Footer Preview</h3>
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p>
                © {new Date().getFullYear()} {copyrightText}
              </p>
              <div className="flex items-center space-x-4 mt-2 md:mt-0">
                {footerData?.bottomBar?.links?.map((link, index) => (
                  <React.Fragment key={link.id}>
                    <span className="text-gray-400 hover:text-emerald-400 cursor-pointer">
                      {link.title}
                    </span>
                    {index < footerData.bottomBar.links.length - 1 && (
                      <span className="text-gray-600">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomBarModal;