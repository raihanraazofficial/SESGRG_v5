import React, { useState, useEffect } from 'react';
import { X, Calendar, Type, FileText, MapPin, Image, Tags, Star, Edit3 } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-5xl my-4 mx-4 shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]">
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit News/Event</h2>
              <p className="text-sm text-gray-600 mt-1">Update news or event information and details</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <Edit3 className="h-5 w-5 mr-2 text-emerald-600" />
                  Basic Information
                </h3>
                
                <div className="space-y-6">
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
                      className="text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Tags className="h-4 w-4 inline mr-2" />
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
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
                        className="text-base"
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
                      className="text-base"
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
                      className="text-base"
                    />
                    {formData.image && (
                      <div className="mt-4">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-40 h-40 object-cover rounded-lg border shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      Feature this news/event (will appear prominently)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Content & Descriptions
                </h3>
                
                <div className="space-y-6">
                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      rows="4"
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
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      rows="5"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Basic description text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Content Editor */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Full Content (Rich Text Editor)
                </h3>
                <div className="text-sm text-gray-600 mb-4 p-4 bg-white rounded-md border">
                  <p className="font-medium mb-2">WordPress/Blogger-style Rich Text Features:</p>
                  <ul className="text-xs space-y-1">
                    <li>• <strong>Text Formatting:</strong> **bold**, *italic*, `code`, Colors</li>
                    <li>• <strong>Mathematics:</strong> LaTeX formulas with $$formula$$</li>
                    <li>• <strong>Structure:</strong> ## Headers, Lists with -, Tables</li>
                    <li>• <strong>Media:</strong> [Links](url), Images, Videos</li>
                    <li>• <strong>Advanced:</strong> Blockquotes, Code blocks, Subscript/Superscript</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg border p-1">
                  <RichTextEditor
                    value={formData.full_content}
                    onChange={(value) => handleChange('full_content', value)}
                    placeholder="Write your full content here with rich formatting..."
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer with Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-4 rounded-b-xl">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2"
          >
            {loading ? 'Updating...' : 'Update News/Event'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditNewsEventModal;