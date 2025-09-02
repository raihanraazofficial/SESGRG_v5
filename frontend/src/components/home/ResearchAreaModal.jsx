import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Image, Type, FileText, Hash } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import FullScreenModal from '../FullScreenModal';

const ResearchAreaModal = ({ isOpen, onClose, area, onSave, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    areaNumber: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && area) {
      setFormData({
        title: area.title || '',
        description: area.description || '',
        image: area.image || '',
        areaNumber: area.areaNumber || 1
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        areaNumber: 1
      });
    }
  }, [area, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in required fields (Title and Description)');
      return;
    }

    // Validate image URL if provided
    if (formData.image.trim()) {
      try {
        new URL(formData.image);
      } catch {
        alert('Please enter a valid image URL');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let result;
      if (mode === 'add') {
        result = onSave(formData);
      } else {
        result = onSave(area.id, formData);
      }
      
      if (result.success) {
        alert(`Research area ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        onClose();
      } else {
        alert(result.error || `Failed to ${mode} research area`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing research area:`, error);
      alert(`Error ${mode}ing research area. Please try again.`);
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
    <FullScreenModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${mode === 'add' ? 'Add' : 'Edit'} Research Area`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Area Number */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Hash className="h-5 w-5 mr-2 text-indigo-600" />
                Area Number
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="number"
                name="areaNumber"
                value={formData.areaNumber}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={mode === 'edit'}
              />
              {mode === 'edit' && (
                <p className="text-sm text-gray-500 mt-2">
                  Area numbers are automatically managed and cannot be changed directly.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Title Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Type className="h-5 w-5 mr-2 text-blue-600" />
                Research Area Title *
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter research area title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                Description *
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter research area description..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
                required
              />
            </CardContent>
          </Card>

          {/* Image URL Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Image className="h-5 w-5 mr-2 text-amber-600" />
                Image URL
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {formData.image && (
                <div className="mt-3">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full max-w-md h-32 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Optional image to represent this research area.
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
            {isSubmitting ? 'Saving...' : `${mode === 'add' ? 'Add' : 'Update'} Research Area`}
          </Button>
        </div>
      </form>
    </FullScreenModal>
  );
};

export default ResearchAreaModal;