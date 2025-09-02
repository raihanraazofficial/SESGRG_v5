import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Image, Link, Type } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import FullScreenModal from '../FullScreenModal';

const CarouselImageModal = ({ isOpen, onClose, image, onSave, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    url: '',
    alt: '',
    caption: '',
    link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && image) {
      setFormData({
        url: image.url || '',
        alt: image.alt || '',
        caption: image.caption || '',
        link: image.link || ''
      });
    } else {
      setFormData({
        url: '',
        alt: '',
        caption: '',
        link: ''
      });
    }
  }, [image, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim() || !formData.alt.trim()) {
      alert('Please fill in required fields (URL and Alt Text)');
      return;
    }

    // Validate URL
    try {
      new URL(formData.url);
    } catch {
      alert('Please enter a valid image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = onSave(formData);
      if (result.success) {
        alert(`Carousel image ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        onClose();
      } else {
        alert(result.error || `Failed to ${mode} carousel image`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing carousel image:`, error);
      alert(`Error ${mode}ing carousel image. Please try again.`);
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
      title={`${mode === 'add' ? 'Add' : 'Edit'} Carousel Image`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Image URL Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Image className="h-5 w-5 mr-2 text-blue-600" />
                Image URL *
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {formData.url && (
                <div className="mt-3">
                  <img 
                    src={formData.url} 
                    alt="Preview" 
                    className="w-full max-w-md h-32 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alt Text Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Type className="h-5 w-5 mr-2 text-emerald-600" />
                Alt Text *
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="text"
                name="alt"
                value={formData.alt}
                onChange={handleChange}
                placeholder="Descriptive text for the image"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Alt text is important for accessibility and SEO.
              </p>
            </CardContent>
          </Card>

          {/* Caption Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Type className="h-5 w-5 mr-2 text-purple-600" />
                Caption
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                placeholder="Image caption (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Caption will be displayed on the image in the carousel.
              </p>
            </CardContent>
          </Card>

          {/* Link Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Link className="h-5 w-5 mr-2 text-amber-600" />
                Link URL
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Optional link to redirect when image is clicked.
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
            {isSubmitting ? 'Saving...' : `${mode === 'add' ? 'Add' : 'Update'} Image`}
          </Button>
        </div>
      </form>
    </FullScreenModal>
  );
};

export default CarouselImageModal;