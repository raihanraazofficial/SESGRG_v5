import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, DollarSign, Users, Folder } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AddProjectModal = ({ isOpen, onClose, onAdd, researchAreas, statuses }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Planning',
    start_date: '',
    end_date: '',
    principal_investigator: '',
    team_members: [''],
    funding_agency: '',
    budget: '',
    research_areas: [],
    objectives: [''],
    expected_outcomes: [''],
    current_progress: '',
    website: '',
    image: '',
    featured: false,
    keywords: ['']
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const toggleResearchArea = (area) => {
    setFormData(prev => ({
      ...prev,
      research_areas: prev.research_areas.includes(area)
        ? prev.research_areas.filter(a => a !== area)
        : [...prev.research_areas, area]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.principal_investigator.trim()) newErrors.principal_investigator = 'Principal Investigator is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (formData.research_areas.length === 0) newErrors.research_areas = 'At least one research area is required';
    
    // Validate that end date is after start date
    if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Clean up array fields (remove empty strings)
      const cleanedData = {
        ...formData,
        team_members: formData.team_members.filter(member => member.trim()),
        objectives: formData.objectives.filter(obj => obj.trim()),
        expected_outcomes: formData.expected_outcomes.filter(outcome => outcome.trim()),
        keywords: formData.keywords.filter(keyword => keyword.trim())
      };

      await onAdd(cleanedData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'Planning',
        start_date: '',
        end_date: '',
        principal_investigator: '',
        team_members: [''],
        funding_agency: '',
        budget: '',
        research_areas: [],
        objectives: [''],
        expected_outcomes: [''],
        current_progress: '',
        website: '',
        image: '',
        featured: false,
        keywords: ['']
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Folder className="h-5 w-5 mr-2 text-emerald-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter project description"
                  rows={4}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Investigator *
                </label>
                <Input
                  value={formData.principal_investigator}
                  onChange={(e) => handleInputChange('principal_investigator', e.target.value)}
                  placeholder="Enter principal investigator name"
                  className={errors.principal_investigator ? 'border-red-500' : ''}
                />
                {errors.principal_investigator && <p className="text-red-500 text-sm mt-1">{errors.principal_investigator}</p>}
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
              Timeline & Budget
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className={errors.start_date ? 'border-red-500' : ''}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className={errors.end_date ? 'border-red-500' : ''}
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Agency
                </label>
                <Input
                  value={formData.funding_agency}
                  onChange={(e) => handleInputChange('funding_agency', e.target.value)}
                  placeholder="Enter funding agency"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <Input
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="e.g., $50,000 or BDT 5,00,000"
                />
              </div>
            </div>
          </div>

          {/* Research Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Research Areas * (Select at least one)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {researchAreas.map((area, index) => (
                <label key={area} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.research_areas.includes(area)}
                    onChange={() => toggleResearchArea(area)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
            {errors.research_areas && <p className="text-red-500 text-sm mt-1">{errors.research_areas}</p>}
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald-600" />
              Team Members
            </h3>
            {formData.team_members.map((member, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={member}
                  onChange={(e) => handleArrayChange('team_members', index, e.target.value)}
                  placeholder={index === 0 ? "Enter team member name" : "Enter another team member name"}
                  className="flex-1"
                />
                {formData.team_members.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('team_members', index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('team_members')}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {/* Objectives */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Objectives</h3>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex space-x-2">
                <textarea
                  value={objective}
                  onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                  placeholder={index === 0 ? "Enter main objective" : "Enter additional objective"}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {formData.objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('objectives', index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('objectives')}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </div>

          {/* Expected Outcomes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Expected Outcomes</h3>
            {formData.expected_outcomes.map((outcome, index) => (
              <div key={index} className="flex space-x-2">
                <textarea
                  value={outcome}
                  onChange={(e) => handleArrayChange('expected_outcomes', index, e.target.value)}
                  placeholder={index === 0 ? "Enter expected outcome" : "Enter additional expected outcome"}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {formData.expected_outcomes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('expected_outcomes', index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('expected_outcomes')}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expected Outcome
            </Button>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Progress
              </label>
              <textarea
                value={formData.current_progress}
                onChange={(e) => handleInputChange('current_progress', e.target.value)}
                placeholder="Describe current progress..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Website
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://project-website.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://image-url.com/image.jpg"
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Keywords</h4>
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={keyword}
                    onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                    placeholder={index === 0 ? "Enter keyword" : "Enter another keyword"}
                    className="flex-1"
                  />
                  {formData.keywords.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('keywords', index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
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

            {/* Featured checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Featured Project (will appear prominently on homepage)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;