import React, { useState, useEffect } from 'react';
import { X, Upload, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { useFooter } from '../../contexts/FooterContext';

const FooterLabInfoModal = ({ isOpen, onClose }) => {
  const { footerData, updateLabInfo } = useFooter();
  const [formData, setFormData] = useState({
    logo: '',
    name: '',
    subtitle: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load current data when modal opens
  useEffect(() => {
    if (isOpen && footerData?.labInfo) {
      setFormData({
        logo: footerData.labInfo.logo || '',
        name: footerData.labInfo.name || '',
        subtitle: footerData.labInfo.subtitle || '',
        description: footerData.labInfo.description || ''
      });
    }
  }, [isOpen, footerData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateLabInfo(formData);
      alert('Lab information updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating lab info:', error);
      alert('Failed to update lab information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-800">Edit Lab Information</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <div className="space-y-2">
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/logo.jpg"
                required
              />
              {formData.logo && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <img 
                    src={formData.logo} 
                    alt="Logo preview" 
                    className="h-12 w-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="text-sm text-gray-600">Logo preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Lab Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lab Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="SESG Research"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Sustainable Energy & Smart Grid"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Brief description about the lab..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Lab Info'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FooterLabInfoModal;