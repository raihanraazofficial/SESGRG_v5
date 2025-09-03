import React, { useState, useEffect } from 'react';
import { Edit3, Loader2, Trophy, Calendar, Tag, Image as ImageIcon, Star, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import RichTextEditor from '../RichTextEditor';
import FullScreenModal from '../ui/FullScreenModal';
import '../../styles/checkbox-fix.css';

const EditAchievementModal = ({ isOpen, onClose, onUpdate, achievement, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    category: 'Award',
    date: new Date().toISOString().split('T')[0],
    image: '',
    featured: false
  });
  
  const [loading, setLoading] = useState(false);

  // Populate form when achievement changes
  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || '',
        short_description: achievement.short_description || '',
        description: achievement.description || '',
        category: achievement.category || 'Award',
        date: achievement.date ? achievement.date.split('T')[0] : new Date().toISOString().split('T')[0],
        image: achievement.image || '',
        featured: achievement.featured || false
      });
    }
  }, [achievement]);

  const handleCheckboxToggle = (field) => {
    console.log(`Toggling ${field}:`, !formData[field]);
    handleInputChange(field, !formData[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.short_description.trim()) {
      alert('Short description is required');
      return;
    }

    try {
      setLoading(true);
      
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        short_description: formData.short_description.trim(),
        description: formData.description.trim()
      };
      
      await onUpdate(achievement.id, cleanedData);
      onClose();
    } catch (error) {
      console.error('Error updating achievement:', error);
      alert('Error updating achievement. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Update Achievement
          </>
        )}
      </Button>
    </>
  );

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Achievement"
      description="Update the achievement information"
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
              <Trophy className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-emerald-600" />
              Basic Information
            </h3>
            
            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievement Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter achievement title"
                  required
                  className="text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Enter a brief description"
                  rows={3}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  required
                />
              </div>

              {/* Category and Date */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="h-4 w-4 inline mr-2" />
                  Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="Enter image URL"
                  className="text-sm lg:text-base"
                />
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center space-x-3 p-3 lg:p-4 bg-yellow-50 rounded-lg checkbox-container featured-select">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 lg:w-5 lg:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 featured-checkbox"
                />
                <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Mark as Featured
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Rich Text Content */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-blue-600" />
              Detailed Content
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description (Rich Text)
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Enter detailed achievement content with rich formatting..."
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use the rich text editor to format your content with headings, lists, links, and more.
              </p>
            </div>
          </div>
        </div>

      </form>
    </FullScreenModal>
  );
};

export default EditAchievementModal;