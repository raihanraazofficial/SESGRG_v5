import React, { useState, useEffect } from 'react';
import { X, Edit3, Loader2, Trophy, Calendar, Tag, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import RichTextEditor from '../RichTextEditor';

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
        date: achievement.date || new Date().toISOString().split('T')[0],
        image: achievement.image || '',
        featured: achievement.featured || false
      });
    }
  }, [achievement]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      
      await onUpdate(achievement.id, cleanedData);
      onClose();
    } catch (error) {
      console.error('Error updating achievement:', error);
      alert('Error updating achievement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-[1080px] my-4 mx-4 shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]">
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Achievement</h2>
              <p className="text-sm text-gray-600 mt-1">Update achievement information and details</p>
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
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <Edit3 className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter achievement title"
                      required
                      className="text-base"
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
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Date and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="text-base"
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
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

                  {/* Featured Checkbox */}
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      Featured Achievement (will appear first)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Content Editor */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Full Description (Rich Content)
                </h3>
                <div className="text-sm text-gray-600 mb-4 p-4 bg-white rounded-md border">
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
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
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
        </div>
      </div>
    </div>
  );
};

export default EditAchievementModal;