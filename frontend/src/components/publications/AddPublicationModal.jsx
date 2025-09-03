import React, { useState } from 'react';
import { X, Plus, Loader2, FileText, BookOpen, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FullScreenModal from '../ui/FullScreenModal';

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
    paper_link: '',
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
        paper_link: '',
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
          'Add Publication'
        )}
      </Button>
    </>
  );

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Publication"
      description="Create a new research publication"
      icon={FileText}
      loading={loading}
      footer={modalFooter}
      className="max-w-[95vw] max-h-[95vh] lg:max-w-[1200px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-emerald-600" />
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
                  placeholder="Enter publication title"
                  required
                  className="text-sm lg:text-base"
                />
              </div>

              {/* Authors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Authors *
                </label>
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex gap-2 lg:gap-3 mb-3">
                    <Input
                      value={author}
                      onChange={(e) => handleArrayChange('authors', index, e.target.value)}
                      placeholder={`Author ${index + 1}`}
                      className="text-sm lg:text-base"
                    />
                    {formData.authors.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('authors', index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('authors')}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Add Author
                </Button>
              </div>

              {/* Year and Category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
                    className="text-sm lg:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>
          </div>
        </div>

        {/* Research Areas */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 lg:p-6 rounded-lg research-areas">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              Research Areas * (Select at least 1)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {researchAreas.map((area) => (
                <label key={area} className="flex items-center space-x-3 p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all checkbox-container">
                  <input
                    type="checkbox"
                    checked={formData.research_areas.includes(area)}
                    onChange={() => handleResearchAreaToggle(area)}
                    className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 research-area-checkbox"
                  />
                  <span className="text-xs lg:text-sm text-gray-700 font-medium">{area}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Publication Details based on Category */}
        {formData.category === 'Journal Articles' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-lg">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Journal Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journal Name
                  </label>
                  <Input
                    value={formData.journal_name}
                    onChange={(e) => handleInputChange('journal_name', e.target.value)}
                    placeholder="Enter journal name"
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {formData.category === 'Conference Proceedings' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-lg">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Conference Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conference Name
                  </label>
                  <Input
                    value={formData.conference_name}
                    onChange={(e) => handleInputChange('conference_name', e.target.value)}
                    placeholder="Enter conference name"
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {formData.category === 'Book Chapters' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-lg">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title
                  </label>
                  <Input
                    value={formData.book_title}
                    onChange={(e) => handleInputChange('book_title', e.target.value)}
                    placeholder="Enter book title"
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links and Additional Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            
            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paper Link (DOI or Direct Link)
                  </label>
                  <Input
                    value={formData.paper_link}
                    onChange={(e) => handleInputChange('paper_link', e.target.value)}
                    placeholder="https://doi.org/... or https://..."
                    className="text-sm lg:text-base"
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
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 lg:p-4 bg-yellow-50 rounded-lg checkbox-container">
                  <input
                    type="checkbox"
                    id="open_access"
                    checked={formData.open_access}
                    onChange={(e) => handleInputChange('open_access', e.target.checked)}
                    className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 featured-checkbox"
                  />
                  <label htmlFor="open_access" className="text-sm text-gray-700 font-medium cursor-pointer">Open Access</label>
                </div>
                <div className="flex items-center space-x-3 p-3 lg:p-4 bg-yellow-50 rounded-lg checkbox-container featured-select">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 featured-checkbox"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700 font-medium cursor-pointer">Featured Publication</label>
                </div>
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
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2 lg:gap-3 mb-3">
                    <Input
                      value={keyword}
                      onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                      placeholder={`Keyword ${index + 1}`}
                      className="text-sm lg:text-base"
                    />
                    {formData.keywords.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('keywords', index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('keywords')}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Add Keyword
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FullScreenModal>
  );
};

export default AddPublicationModal;