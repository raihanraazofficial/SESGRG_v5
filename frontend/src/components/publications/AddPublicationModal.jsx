import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AddPublicationModal = ({ isOpen, onClose, onAdd, researchAreas }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: [''],
    year: new Date().getFullYear(),
    category: 'Journal Articles',
    research_areas: [],
    citations: 0,
    journal_name: '',
    conference_name: '',
    book_title: '',
    volume: '',
    issue: '',
    pages: '',
    publisher: '',
    editor: '',
    city: '',
    country: '',
    doi_link: '',
    full_paper_link: '',
    open_access: false,
    featured: false,
    abstract: '',
    keywords: ['']
  });
  
  const [loading, setLoading] = useState(false);

  const categories = ["Journal Articles", "Conference Proceedings", "Book Chapters"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleResearchAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      research_areas: prev.research_areas.includes(area)
        ? prev.research_areas.filter(a => a !== area)
        : [...prev.research_areas, area]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (formData.authors.filter(author => author.trim()).length === 0) {
      alert('At least one author is required');
      return;
    }
    
    if (formData.research_areas.length === 0) {
      alert('At least one research area is required');
      return;
    }

    try {
      setLoading(true);
      
      // Clean up the data
      const cleanedData = {
        ...formData,
        authors: formData.authors.filter(author => author.trim()),
        keywords: formData.keywords.filter(keyword => keyword.trim()),
        citations: parseInt(formData.citations) || 0,
        year: parseInt(formData.year) || new Date().getFullYear()
      };
      
      await onAdd(cleanedData);
      
      // Reset form
      setFormData({
        title: '',
        authors: [''],
        year: new Date().getFullYear(),
        category: 'Journal Articles',
        research_areas: [],
        citations: 0,
        journal_name: '',
        conference_name: '',
        book_title: '',
        volume: '',
        issue: '',
        pages: '',
        publisher: '',
        editor: '',
        city: '',
        country: '',
        doi_link: '',
        full_paper_link: '',
        open_access: false,
        featured: false,
        abstract: '',
        keywords: ['']
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding publication:', error);
      alert('Error adding publication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add New Publication</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter publication title"
                required
              />
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authors *
              </label>
              {formData.authors.map((author, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={author}
                    onChange={(e) => handleArrayChange('authors', index, e.target.value)}
                    placeholder={`Author ${index + 1}`}
                  />
                  {formData.authors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('authors', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('authors')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Author
              </Button>
            </div>

            {/* Year and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Research Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Research Areas * (Select at least 1)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {researchAreas.map((area) => (
                  <label key={area} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.research_areas.includes(area)}
                      onChange={() => handleResearchAreaToggle(area)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Publication Details based on Category */}
            {formData.category === 'Journal Articles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journal Name
                  </label>
                  <Input
                    value={formData.journal_name}
                    onChange={(e) => handleInputChange('journal_name', e.target.value)}
                    placeholder="Enter journal name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume
                  </label>
                  <Input
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    placeholder="Volume number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue
                  </label>
                  <Input
                    value={formData.issue}
                    onChange={(e) => handleInputChange('issue', e.target.value)}
                    placeholder="Issue number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages
                  </label>
                  <Input
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    placeholder="e.g., 123-145"
                  />
                </div>
              </div>
            )}

            {formData.category === 'Conference Proceedings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conference Name
                  </label>
                  <Input
                    value={formData.conference_name}
                    onChange={(e) => handleInputChange('conference_name', e.target.value)}
                    placeholder="Enter conference name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Conference city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Input
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Conference country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages
                  </label>
                  <Input
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    placeholder="e.g., 123-145"
                  />
                </div>
              </div>
            )}

            {formData.category === 'Book Chapters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title
                  </label>
                  <Input
                    value={formData.book_title}
                    onChange={(e) => handleInputChange('book_title', e.target.value)}
                    placeholder="Enter book title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Editor
                  </label>
                  <Input
                    value={formData.editor}
                    onChange={(e) => handleInputChange('editor', e.target.value)}
                    placeholder="Editor name(s)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher
                  </label>
                  <Input
                    value={formData.publisher}
                    onChange={(e) => handleInputChange('publisher', e.target.value)}
                    placeholder="Publisher name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages
                  </label>
                  <Input
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    placeholder="e.g., 123-145"
                  />
                </div>
              </div>
            )}

            {/* Links and Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DOI Link
                </label>
                <Input
                  value={formData.doi_link}
                  onChange={(e) => handleInputChange('doi_link', e.target.value)}
                  placeholder="https://doi.org/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Paper Link
                </label>
                <Input
                  value={formData.full_paper_link}
                  onChange={(e) => handleInputChange('full_paper_link', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Citations
                </label>
                <Input
                  type="number"
                  value={formData.citations}
                  onChange={(e) => handleInputChange('citations', e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.open_access}
                  onChange={(e) => handleInputChange('open_access', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Open Access</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Featured Publication</span>
              </label>
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract
              </label>
              <textarea
                value={formData.abstract}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
                placeholder="Enter publication abstract..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={keyword}
                    onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                    placeholder={`Keyword ${index + 1}`}
                  />
                  {formData.keywords.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('keywords', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('keywords')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Keyword
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Publication...
                </>
              ) : (
                'Add Publication'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPublicationModal;