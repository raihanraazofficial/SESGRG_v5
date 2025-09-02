import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useFooter } from '../../contexts/FooterContext';

const FooterContactModal = ({ isOpen, onClose }) => {
  const { footerData, updateContactInfo } = useFooter();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      line3: ''
    },
    mapLink: '',
    mapText: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load current data when modal opens
  useEffect(() => {
    if (isOpen && footerData?.contactInfo) {
      setFormData({
        email: footerData.contactInfo.email || '',
        phone: footerData.contactInfo.phone || '',
        address: {
          line1: footerData.contactInfo.address?.line1 || '',
          line2: footerData.contactInfo.address?.line2 || '',
          line3: footerData.contactInfo.address?.line3 || ''
        },
        mapLink: footerData.contactInfo.mapLink || '',
        mapText: footerData.contactInfo.mapText || ''
      });
    }
  }, [isOpen, footerData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateContactInfo(formData);
      alert('Contact information updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating contact info:', error);
      alert('Failed to update contact information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Edit Contact Information</h2>
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
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="sesg@bracu.ac.bd"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="+880-2-9844051-4"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Address
            </label>
            <div className="space-y-2">
              <input
                type="text"
                name="address.line1"
                value={formData.address.line1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Organization name"
                required
              />
              <input
                type="text"
                name="address.line2"
                value={formData.address.line2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Street address"
                required
              />
              <input
                type="text"
                name="address.line3"
                value={formData.address.line3}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          {/* Map Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Map Link
            </label>
            <input
              type="text"
              name="mapLink"
              value={formData.mapLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="/contact"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Internal link to contact/map page (e.g., /contact)
            </p>
          </div>

          {/* Map Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Map Link Text
            </label>
            <input
              type="text"
              name="mapText"
              value={formData.mapText}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="View on Map →"
              required
            />
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
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Contact Info'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FooterContactModal;