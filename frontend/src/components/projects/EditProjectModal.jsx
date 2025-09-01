import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, DollarSign, Users, Folder, Edit3, Loader2, Tag, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FullScreenModal from '../ui/FullScreenModal';

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
    keywords: ['']
  });

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'Planning',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        principal_investigator: project.principal_investigator || '',
        team_members: Array.isArray(project.team_members) && project.team_members.length > 0 
          ? project.team_members 
          : [''],
        funding_agency: project.funding_agency || '',
        budget: project.budget || '',
        research_areas: Array.isArray(project.research_areas) 
          ? project.research_areas 
          : [],
        objectives: Array.isArray(project.objectives) && project.objectives.length > 0 
          ? project.objectives 
          : [''],
        expected_outcomes: Array.isArray(project.expected_outcomes) && project.expected_outcomes.length > 0 
          ? project.expected_outcomes 
          : [''],
        keywords: Array.isArray(project.keywords) && project.keywords.length > 0 
          ? project.keywords 
          : ['']
      });
    }
  }, [project]);

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
    
    if (!formData.description.trim()) {
      alert('Description is required');
      return;
    }
    
    if (!formData.principal_investigator.trim()) {
      alert('Principal Investigator is required');
      return;
    }
    
    if (formData.research_areas.length === 0) {
      alert('At least one research area is required');
      return;
    }

    try {
      setIsLoading(true);
      
      // Clean up the data
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        principal_investigator: formData.principal_investigator.trim(),
        team_members: formData.team_members.filter(member => member.trim()),
        objectives: formData.objectives.filter(obj => obj.trim()),
        expected_outcomes: formData.expected_outcomes.filter(outcome => outcome.trim()),
        keywords: formData.keywords.filter(keyword => keyword.trim()),
        budget: formData.budget ? parseFloat(formData.budget) : null
      };
      
      await onUpdate(project.id, cleanedData);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalFooter = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isLoading}
        className="flex-1 sm:flex-none px-4 lg:px-6 py-2"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        onClick={handleSubmit}
        className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none px-4 lg:px-6 py-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Edit3 className="h-4 w-4 mr-2" />
            Update Project
          </>
        )}
      </Button>
    </>
  );

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      description="Update the research project information"
      icon={Edit3}
      loading={isLoading}
      footer={modalFooter}
      className="max-w-[95vw] max-h-[95vh] lg:max-w-[1200px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <Folder className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-emerald-600" />
              Basic Information
            </h3>
            
            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                  required
                  className="text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter project description"
                  rows={5}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Status and Principal Investigator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-2" />
                    Principal Investigator *
                  </label>
                  <Input
                    value={formData.principal_investigator}
                    onChange={(e) => handleInputChange('principal_investigator', e.target.value)}
                    placeholder="Enter PI name"
                    required
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Research Areas */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-purple-600" />
              Research Areas *
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {researchAreas.map(area => (
                <label key={area} className="flex items-center space-x-3 p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.research_areas.includes(area)}
                    onChange={() => handleResearchAreaToggle(area)}
                    className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm lg:text-base text-gray-700 font-medium">{area}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Project Timeline */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-blue-600" />
              Project Timeline
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="text-sm lg:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="text-sm lg:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-green-600" />
              Team Members
            </h3>
            
            <div className="space-y-3 lg:space-y-4">
              {formData.team_members.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={member}
                    onChange={(e) => handleArrayChange('team_members', index, e.target.value)}
                    placeholder={`Team member ${index + 1}`}
                    className="flex-1 text-sm lg:text-base"
                  />
                  {formData.team_members.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('team_members', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('team_members')}
                className="mt-3 text-sm lg:text-base"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>
        </div>

        {/* Funding Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-yellow-600" />
              Funding Information
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Agency
                </label>
                <Input
                  value={formData.funding_agency}
                  onChange={(e) => handleInputChange('funding_agency', e.target.value)}
                  placeholder="Enter funding agency"
                  className="text-sm lg:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (Amount)
                </label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Enter budget amount"
                  className="text-sm lg:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-indigo-600" />
              Project Details
            </h3>
            
            <div className="space-y-6">
              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Objectives
                </label>
                <div className="space-y-3">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <textarea
                        value={objective}
                        onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                        placeholder={`Objective ${index + 1}`}
                        rows={2}
                        className="flex-1 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                      {formData.objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('objectives', index)}
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('objectives')}
                    className="text-sm lg:text-base"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Expected Outcomes
                </label>
                <div className="space-y-3">
                  {formData.expected_outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <textarea
                        value={outcome}
                        onChange={(e) => handleArrayChange('expected_outcomes', index, e.target.value)}
                        placeholder={`Expected outcome ${index + 1}`}
                        rows={2}
                        className="flex-1 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                      {formData.expected_outcomes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('expected_outcomes', index)}
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('expected_outcomes')}
                    className="text-sm lg:text-base"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expected Outcome
                  </Button>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Keywords
                </label>
                <div className="space-y-3">
                  {formData.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Input
                        value={keyword}
                        onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                        placeholder={`Keyword ${index + 1}`}
                        className="flex-1 text-sm lg:text-base"
                      />
                      {formData.keywords.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('keywords', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('keywords')}
                    className="text-sm lg:text-base"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Keyword
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </FullScreenModal>
  );
};

export default EditProjectModal;