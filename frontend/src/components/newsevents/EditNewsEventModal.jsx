import React, { useState, useEffect } from 'react';
import { X, Calendar, Type, FileText, MapPin, Image, Tags, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import RichTextEditor from '../RichTextEditor';

const EditNewsEventModal = ({ isOpen, onClose, onSubmit, categories, newsEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    full_content: '',
    category: 'News',
    date: new Date().toISOString().split('T')[0],
    location: '',
    image: '',
    featured: false
  });

  const [loading, setLoading] = useState(false);

  // Update form data when newsEvent changes
  useEffect(() => {
    if (newsEvent) {
      setFormData({
        title: newsEvent.title || '',
        short_description: newsEvent.short_description || '',
        description: newsEvent.description || '',
        full_content: newsEvent.full_content || '',
        category: newsEvent.category || 'News',
        date: newsEvent.date || new Date().toISOString().split('T')[0],
        location: newsEvent.location || '',
        image: newsEvent.image || '',
        featured: newsEvent.featured || false
      });
    }
  }, [newsEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(newsEvent.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating news event:', error);
      alert('Failed to update news event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !newsEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{overflow: 'hidden'}}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit News/Event</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="h-4 w-4 inline mr-2" />
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter news/event title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tags className="h-4 w-4 inline mr-2" />
                Category *
              </label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter event location (optional)"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="h-4 w-4 inline mr-2" />
              Image URL
            </label>
            <Input
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="Enter image URL (optional)"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Short Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
              value={formData.short_description}
              onChange={(e) => handleChange('short_description', e.target.value)}
              placeholder="Brief description for preview cards"
            />
          </div>

          {/* Basic Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="4"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Basic description text"
            />
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Content (Rich Text Editor)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Use WordPress/Blogger-style formatting: **bold**, *italic*, `code`, LaTeX formulas with $$formula$$, 
              headers with ## Header, lists with -, links with [text](url), etc.
            </p>
            <RichTextEditor
              value={formData.full_content}
              onChange={(value) => handleChange('full_content', value)}
              placeholder="Write your full content here with rich formatting..."
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Feature this news/event
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update News/Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewsEventModal;