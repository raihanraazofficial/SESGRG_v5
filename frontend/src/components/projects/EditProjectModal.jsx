import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, DollarSign, Users, Folder } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const EditProjectModal = ({ isOpen, onClose, onUpdate, project, researchAreas, statuses }) => {
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

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'Planning',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        principal_investigator: project.principal_investigator || '',
        team_members: project.team_members?.length > 0 ? project.team_members : [''],
        funding_agency: project.funding_agency || '',
        budget: project.budget || '',
        research_areas: project.research_areas || [],
        objectives: project.objectives?.length > 0 ? project.objectives : [''],
        expected_outcomes: project.expected_outcomes?.length > 0 ? project.expected_outcomes : [''],
        current_progress: project.current_progress || '',
        website: project.website || '',
        image: project.image || '',
        featured: project.featured || false,
        keywords: project.keywords?.length > 0 ? project.keywords : ['']
      });
    }
  }, [project]);

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

      await onUpdate(project.id, cleanedData);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-[1080px] h-[720px] my-4 mx-4 shadow-2xl flex flex-col">
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Folder className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
              <p className="text-sm text-gray-600 mt-1">Update project information and details</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <Folder className="h-5 w-5 mr-2 text-emerald-600" />
                  Basic Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter project title"
                      className={`text-base ${errors.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter project description"
                      rows={4}
                      className={`w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.description ? 'border-red-500' : ''}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Principal Investigator *
                      </label>
                      <Input
                        value={formData.principal_investigator}
                        onChange={(e) => handleInputChange('principal_investigator', e.target.value)}
                        placeholder="Enter principal investigator name"
                        className={`text-base ${errors.principal_investigator ? 'border-red-500' : ''}`}
                      />
                      {errors.principal_investigator && <p className="text-red-500 text-sm mt-1">{errors.principal_investigator}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline & Budget */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Timeline & Budget
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      className={`text-base ${errors.start_date ? 'border-red-500' : ''}`}
                    />
                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      className={`text-base ${errors.end_date ? 'border-red-500' : ''}`}
                    />
                    {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Funding Agency
                    </label>
                    <Input
                      value={formData.funding_agency}
                      onChange={(e) => handleInputChange('funding_agency', e.target.value)}
                      placeholder="Enter funding agency"
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget
                    </label>
                    <Input
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="e.g., $50,000 or BDT 5,00,000"
                      className="text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Research Areas */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Research Areas * (Select at least one)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {researchAreas.map((area, index) => (
                    <label key={area} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.research_areas.includes(area)}
                        onChange={() => toggleResearchArea(area)}
                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">{area}</span>
                    </label>
                  ))}
                </div>
                {errors.research_areas && <p className="text-red-500 text-sm mt-2">{errors.research_areas}</p>}
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Team Members
                </h3>
                {formData.team_members.map((member, index) => (
                  <div key={index} className="flex space-x-3 mb-3">
                    <Input
                      value={member}
                      onChange={(e) => handleArrayChange('team_members', index, e.target.value)}
                      placeholder={index === 0 ? "Enter team member name" : "Enter another team member name"}
                      className="flex-1 text-base"
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
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Progress
                    </label>
                    <textarea
                      value={formData.current_progress}
                      onChange={(e) => handleInputChange('current_progress', e.target.value)}
                      placeholder="Describe current progress..."
                      rows={4}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Website
                      </label>
                      <Input
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://project-website.com"
                        className="text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Image URL
                      </label>
                      <Input
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="https://image-url.com/image.jpg"
                        className="text-base"
                      />
                    </div>
                  </div>

                  {/* Featured checkbox */}
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700 font-medium">
                      Featured Project (will appear prominently on homepage)
                    </label>
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
            disabled={isLoading}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2"
          >
            {isLoading ? 'Updating...' : 'Update Project'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;