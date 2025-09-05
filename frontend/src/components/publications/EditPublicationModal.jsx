import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, FileText, BookOpen, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import '../../styles/checkbox-fix.css';

const EditPublicationModal = ({ isOpen, onClose, onUpdate, publication, researchAreas }) => {
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

  // Categories for publications
  const categories = [
    'Journal Articles',
    'Conference Papers',
    'Book Chapters',
    'Books',
    'Other Publications'
  ];

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title || '',
        authors: publication.authors && publication.authors.length > 0 ? publication.authors : [''],
        year: publication.year || new Date().getFullYear(),
        category: publication.category || 'Journal Articles',
        research_areas: publication.research_areas || [],
        citations: publication.citations || 0,
        journal_name: publication.journal_name || '',
        conference_name: publication.conference_name || '',
        book_title: publication.book_title || '',
        volume: publication.volume || '',
        issue: publication.issue || '',
        pages: publication.pages || '',
        publisher: publication.publisher || '',
        editor: publication.editor || '',
        city: publication.city || '',
        country: publication.country || '',
        doi_link: publication.doi_link || '',
        paper_link: publication.paper_link || '',
        open_access: publication.open_access || false,
        featured: publication.featured || false,
        abstract: publication.abstract || '',
        keywords: publication.keywords && publication.keywords.length > 0 ? publication.keywords : ['']
      });
    }
  }, [publication]);

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

    setLoading(true);
    try {
      const cleanedData = {
        ...formData,
        authors: formData.authors.filter(author => author.trim()),
        keywords: formData.keywords.filter(keyword => keyword.trim()),
        citations: parseInt(formData.citations) || 0,
        year: parseInt(formData.year) || new Date().getFullYear()
      };
      
      await onUpdate(publication.id, cleanedData);
      onClose();
    } catch (error) {
      console.error('Error updating publication:', error);
      alert('Error updating publication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop, not on modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !publication) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-[1080px] my-4 mx-4 shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Publication</h2>
              <p className="text-sm text-gray-600 mt-1">Update publication information and details</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter publication title"
                      required
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'pointer' }}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="2024"
                      min="1900"
                      max="2099"
                      required
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Citations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Citations
                    </label>
                    <Input
                      type="number"
                      value={formData.citations}
                      onChange={(e) => handleInputChange('citations', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>
                </div>
              </div>

              {/* Authors */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-emerald-600" />
                  Authors
                </h3>
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <Input
                      value={author}
                      onChange={(e) => handleArrayChange('authors', index, e.target.value)}
                      placeholder={`Author ${index + 1}`}
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                    {formData.authors.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('authors', index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Author
                </Button>
              </div>

              {/* Research Areas */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Research Areas *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {researchAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        id={`edit_research_${index}`}
                        checked={formData.research_areas.includes(area.name)}
                        onChange={() => handleResearchAreaToggle(area.name)}
                        className="publication-checkbox h-5 w-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      />
                      <label 
                        htmlFor={`edit_research_${index}`}
                        className="text-sm text-gray-700 font-medium cursor-pointer flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleResearchAreaToggle(area.name);
                        }}
                      >
                        {area.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publication Details by Category */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Publication Details
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Journal Articles Fields */}
                  {formData.category === 'Journal Articles' && (
                    <>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Journal Name
                        </label>
                        <Input
                          value={formData.journal_name}
                          onChange={(e) => handleInputChange('journal_name', e.target.value)}
                          placeholder="Enter journal name"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
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
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
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
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pages
                        </label>
                        <Input
                          value={formData.pages}
                          onChange={(e) => handleInputChange('pages', e.target.value)}
                          placeholder="e.g., 123-145"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                    </>
                  )}

                  {/* Conference Papers Fields */}
                  {formData.category === 'Conference Papers' && (
                    <>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conference Name
                        </label>
                        <Input
                          value={formData.conference_name}
                          onChange={(e) => handleInputChange('conference_name', e.target.value)}
                          placeholder="Enter conference name"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
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
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
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
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pages
                        </label>
                        <Input
                          value={formData.pages}
                          onChange={(e) => handleInputChange('pages', e.target.value)}
                          placeholder="e.g., 123-145"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                    </>
                  )}

                  {/* Book Chapters Fields */}
                  {formData.category === 'Book Chapters' && (
                    <>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Book Title
                        </label>
                        <Input
                          value={formData.book_title}
                          onChange={(e) => handleInputChange('book_title', e.target.value)}
                          placeholder="Enter book title"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Editor(s)
                        </label>
                        <Input
                          value={formData.editor}
                          onChange={(e) => handleInputChange('editor', e.target.value)}
                          placeholder="Book editor(s)"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
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
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pages
                        </label>
                        <Input
                          value={formData.pages}
                          onChange={(e) => handleInputChange('pages', e.target.value)}
                          placeholder="e.g., 123-145"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                    </>
                  )}

                  {/* Books Fields */}
                  {formData.category === 'Books' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Publisher
                        </label>
                        <Input
                          value={formData.publisher}
                          onChange={(e) => handleInputChange('publisher', e.target.value)}
                          placeholder="Publisher name"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Publication city"
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                      </div>
                    </>
                  )}

                  {/* Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DOI Link
                    </label>
                    <Input
                      type="url"
                      value={formData.doi_link}
                      onChange={(e) => handleInputChange('doi_link', e.target.value)}
                      placeholder="https://doi.org/..."
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paper Link
                    </label>
                    <Input
                      type="url"
                      value={formData.paper_link}
                      onChange={(e) => handleInputChange('paper_link', e.target.value)}
                      placeholder="https://..."
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="lg:col-span-2 flex flex-wrap gap-6">
                    <div className="checkbox-container featured-select bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="edit_open_access"
                          checked={formData.open_access}
                          onChange={(e) => handleInputChange('open_access', e.target.checked)}
                          className="publication-checkbox h-5 w-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        />
                        <label 
                          htmlFor="edit_open_access"
                          className="text-sm text-gray-700 font-medium cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open Access
                        </label>
                      </div>
                    </div>
                    
                    <div className="checkbox-container featured-select bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="edit_featured"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="publication-checkbox h-5 w-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        />
                        <label 
                          htmlFor="edit_featured"
                          className="text-sm text-gray-700 font-medium cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Featured Publication
                        </label>
                      </div>
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
                      rows={5}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    {formData.keywords.map((keyword, index) => (
                      <div key={index} className="flex gap-3 mb-3">
                        <Input
                          value={keyword}
                          onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                          placeholder={`Keyword ${index + 1}`}
                          className="text-base"
                          style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                        />
                        {formData.keywords.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('keywords', index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Keyword
                    </Button>
                  </div>
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
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Publication'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPublicationModal;