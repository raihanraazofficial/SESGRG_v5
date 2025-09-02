import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Image, Facebook, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '../ui/button';
import { useFooter } from '../../contexts/FooterContext';

const FooterSocialModal = ({ isOpen, onClose }) => {
  const { footerData, addSocialMedia, updateSocialMedia, deleteSocialMedia, updateSocialDescription } = useFooter();
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialDescription, setSocialDescription] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: 'Facebook',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700'
  });

  const availableIcons = [
    { name: 'Facebook', icon: Facebook, bgColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
    { name: 'Linkedin', icon: Linkedin, bgColor: 'bg-blue-700', hoverColor: 'hover:bg-blue-800' },
    { name: 'Twitter', icon: Twitter, bgColor: 'bg-sky-500', hoverColor: 'hover:bg-sky-600' },
    { name: 'Instagram', icon: Instagram, bgColor: 'bg-pink-600', hoverColor: 'hover:bg-pink-700' },
    { name: 'Youtube', icon: Youtube, bgColor: 'bg-red-600', hoverColor: 'hover:bg-red-700' }
  ];

  // Load current data when modal opens
  useEffect(() => {
    if (isOpen && footerData) {
      setSocialDescription(footerData.socialDescription || '');
      setIsAddingSocial(false);
      setEditingSocial(null);
      setFormData({ name: '', url: '', icon: 'Facebook', bgColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' });
    }
  }, [isOpen, footerData]);

  // Load editing data
  useEffect(() => {
    if (editingSocial) {
      setFormData({
        name: editingSocial.name,
        url: editingSocial.url,
        icon: editingSocial.icon,
        bgColor: editingSocial.bgColor,
        hoverColor: editingSocial.hoverColor
      });
    }
  }, [editingSocial]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSocial) {
        await updateSocialMedia(editingSocial.id, formData);
        alert('Social media link updated successfully!');
      } else {
        await addSocialMedia(formData);
        alert('Social media link added successfully!');
      }
      
      // Reset form
      setFormData({ name: '', url: '', icon: 'Facebook', bgColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' });
      setIsAddingSocial(false);
      setEditingSocial(null);
    } catch (error) {
      console.error('Error saving social media:', error);
      alert('Failed to save social media link. Please try again.');
    }
  };

  const handleEdit = (social) => {
    setEditingSocial(social);
    setIsAddingSocial(true);
  };

  const handleDelete = async (socialId) => {
    if (confirm('Are you sure you want to delete this social media link?')) {
      try {
        await deleteSocialMedia(socialId);
        alert('Social media link deleted successfully!');
      } catch (error) {
        console.error('Error deleting social media:', error);
        alert('Failed to delete social media link. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'icon') {
      const selectedIcon = availableIcons.find(icon => icon.name === value);
      setFormData(prev => ({
        ...prev,
        icon: value,
        bgColor: selectedIcon.bgColor,
        hoverColor: selectedIcon.hoverColor
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', url: '', icon: 'Facebook', bgColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' });
    setIsAddingSocial(false);
    setEditingSocial(null);
  };

  const handleDescriptionUpdate = async () => {
    try {
      await updateSocialDescription(socialDescription);
      alert('Social media description updated successfully!');
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Failed to update description. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image className="h-5 w-5 mr-2 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-800">Manage Social Media</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Social Description */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Social Media Description</h3>
            <div className="space-y-3">
              <textarea
                value={socialDescription}
                onChange={(e) => setSocialDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Stay connected with our latest research updates and announcements."
              />
              <Button
                onClick={handleDescriptionUpdate}
                className="bg-orange-600 hover:bg-orange-700"
                size="sm"
              >
                Update Description
              </Button>
            </div>
          </div>

          {/* Add New Social Media Button */}
          {!isAddingSocial && (
            <div>
              <Button
                onClick={() => setIsAddingSocial(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Social Media
              </Button>
            </div>
          )}

          {/* Add/Edit Form */}
          {isAddingSocial && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">
                {editingSocial ? 'Edit Social Media' : 'Add New Social Media'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform *
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      {availableIcons.map((iconOption) => (
                        <option key={iconOption.name} value={iconOption.name}>
                          {iconOption.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Platform Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Facebook"
                      required
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://facebook.com/yourpage"
                    required
                  />
                </div>

                {/* Color Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Preview
                  </label>
                  <div className={`w-12 h-12 ${formData.bgColor} ${formData.hoverColor} rounded-full flex items-center justify-center`}>
                    {React.createElement(availableIcons.find(icon => icon.name === formData.icon)?.icon || Facebook, {
                      className: "h-6 w-6 text-white"
                    })}
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
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {editingSocial ? 'Update' : 'Add'} Social Media
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Social Media List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Social Media ({footerData?.socialMedia?.length || 0})</h3>
            
            {footerData?.socialMedia?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No social media links added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {footerData?.socialMedia?.map((social) => {
                  const IconComponent = availableIcons.find(icon => icon.name === social.icon)?.icon || Facebook;
                  return (
                    <div key={social.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${social.bgColor} rounded-full flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{social.name}</h4>
                            <p className="text-sm text-gray-600 break-all">{social.url}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEdit(social)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(social.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

export default FooterSocialModal;