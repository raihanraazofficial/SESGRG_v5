import React, { useState } from 'react';
import { X, Trophy, Loader2, Calendar, Tag, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import RichTextEditor from '../RichTextEditor';
import FullScreenModal from '../ui/FullScreenModal';
import '../../styles/checkbox-fix.css';

const AddAchievementModal = ({ isOpen, onClose, onAdd, categories }) => {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxToggle = (field) => {
    console.log(`Toggling ${field}:`, !formData[field]);
    handleInputChange(field, !formData[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
      
      // Clean up the data
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        short_description: formData.short_description.trim(),
        description: formData.description.trim()
      };
      
      await onAdd(cleanedData);
      
      // Reset form
      setFormData({
        title: '',
        short_description: '',
        description: '',
        category: 'Award',
        date: new Date().toISOString().split('T')[0],
        image: '',
        featured: false
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding achievement:', error);
      alert('Error adding achievement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            Adding...
          </>
        ) : (
          <>
            <Trophy className="h-4 w-4 mr-2" />
            Add Achievement
          </>
        )}
      </Button>
    </>
  );

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Achievement"
      description="Create a new achievement record"
      icon={Trophy}
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
                  Title *
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
                  placeholder="Enter a brief description (will be shown on cards)"
                  rows={4}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Date and Category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="h-4 w-4 inline mr-2" />
                  Image URL (Optional)
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                  className="text-sm lg:text-base"
                />
                {formData.image && (
                  <div className="mt-4">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-lg border shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-3 p-3 lg:p-4 bg-yellow-50 rounded-lg checkbox-container featured-select">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 featured-checkbox"
                />
                <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Featured Achievement (will appear first)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Rich Content Editor */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              Full Description (Rich Content)
            </h3>
            <div className="text-xs lg:text-sm text-gray-600 mb-4 p-3 lg:p-4 bg-white rounded-md border">
              <p className="font-medium mb-2">Rich Text Editor Features:</p>
              <ul className="text-xs space-y-1">
                <li>• <strong>Text Formatting:</strong> Bold, Italic, Underline, Colors</li>
                <li>• <strong>Mathematics:</strong> LaTeX formulas with $$formula$$</li>
                <li>• <strong>Structure:</strong> Headers, Lists, Tables, Code blocks</li>
                <li>• <strong>Media:</strong> Images, Videos, Links</li>
                <li>• <strong>Advanced:</strong> Blockquotes, Subscript, Superscript</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border p-1">
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Write the full story of this achievement. You can use rich formatting, add images, LaTeX formulas, code blocks, tables, and more..."
              />
            </div>
          </div>
        </div>
      </form>
    </FullScreenModal>
  );
};

export default AddAchievementModal;