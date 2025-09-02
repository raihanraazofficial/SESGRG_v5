import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import FullScreenModal from '../FullScreenModal';

const EditAboutUsModal = ({ isOpen, onClose, aboutUs, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (aboutUs) {
      setFormData({
        title: aboutUs.title || '',
        content: aboutUs.content || ''
      });
    }
  }, [aboutUs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = onUpdate(formData);
      if (result.success) {
        alert('About Us content updated successfully!');
        onClose();
      } else {
        alert(result.error || 'Failed to update About Us content');
      }
    } catch (error) {
      console.error('Error updating About Us:', error);
      alert('Error updating About Us content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="Edit About Us Section">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Title Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Section Title
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter section title (e.g., About Us)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </CardContent>
          </Card>

          {/* Content Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                About Us Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter the About Us content..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                This content will be displayed in the About Us section on the homepage.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Updating...' : 'Update About Us'}
          </Button>
        </div>
      </form>
    </FullScreenModal>
  );
};

export default EditAboutUsModal;