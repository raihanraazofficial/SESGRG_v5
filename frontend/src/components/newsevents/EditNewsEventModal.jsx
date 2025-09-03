import React, { useState, useEffect } from 'react';
import { Calendar, Type, FileText, MapPin, Image, Tags, Star, Edit3, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import RichTextEditor from '../RichTextEditor';
import FullScreenModal from '../ui/FullScreenModal';
import '../../styles/checkbox-fix.css';

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

  // Populate form when newsEvent changes
  useEffect(() => {
    if (newsEvent) {
      setFormData({
        title: newsEvent.title || '',
        short_description: newsEvent.short_description || '',
        description: newsEvent.description || '',
        full_content: newsEvent.full_content || '',
        category: newsEvent.category || 'News',
        date: newsEvent.date ? newsEvent.date.split('T')[0] : new Date().toISOString().split('T')[0],
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

  const handleCheckboxToggle = (field) => {
    console.log(`Toggling ${field}:`, !formData[field]);
    handleChange(field, !formData[field]);
  };

  const modalFooter = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={loading}
        className="flex-1 sm:flex-none px-4 lg:px-6 py-2"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
        onClick={handleSubmit}
        className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none px-4 lg:px-6 py-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Edit3 className="h-4 w-4 mr-2" />
            Update News/Event
          </>
        )}
      </Button>
    </>
  );

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit News/Event"
      description="Update the news article or event information"
      icon={Edit3}
      loading={loading}
      footer={modalFooter}
      className="max-w-[95vw] max-h-[95vh] lg:max-w-[1200px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <Edit3 className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-emerald-600" />
              Basic Information
            </h3>
            
            <div className="space-y-4 lg:space-y-6">
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
                  className="text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Short Description
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  placeholder="Enter a brief description"
                  rows={3}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Category and Date */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tags className="h-4 w-4 inline mr-2" />
                    Category *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger className="text-sm lg:text-base">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              {/* Location and Image */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Enter location (if applicable)"
                    className="text-sm lg:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Image className="h-4 w-4 inline mr-2" />
                    Image URL
                  </label>
                  <Input
                    value={formData.image}
                    onChange={(e) => handleChange('image', e.target.value)}
                    placeholder="Enter image URL"
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              {/* Featured checkbox */}
              <div 
                className="flex items-center space-x-3 p-3 lg:p-4 bg-yellow-50 rounded-lg checkbox-container featured-select"
                onClick={() => handleCheckboxToggle('featured')}
              >
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleChange('featured', e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 lg:w-5 lg:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 featured-checkbox"
                />
                <label 
                  htmlFor="featured" 
                  className="flex items-center text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCheckboxToggle('featured');
                  }}
                >
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Mark as Featured
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-blue-600" />
              Content
            </h3>
            
            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Basic Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter basic description"
                  rows={4}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Content (Rich Text)
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <RichTextEditor
                    value={formData.full_content}
                    onChange={(value) => handleChange('full_content', value)}
                    placeholder="Enter detailed content with rich formatting..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </FullScreenModal>
  );
};

export default EditNewsEventModal;