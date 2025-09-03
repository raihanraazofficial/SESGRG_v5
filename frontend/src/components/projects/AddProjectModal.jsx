import React, { useState } from 'react';
import { X, FolderOpen, Loader2, Calendar, Users, Tag, FileText, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FullScreenModal from '../ui/FullScreenModal';
import '../../styles/checkbox-fix.css';

const AddProjectModal = ({ isOpen, onClose, onAdd, researchAreas, statuses }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active',
    research_areas: [],
    principal_investigator: '',
    co_investigators: [''],
    start_date: '',
    end_date: '',
    funding_amount: '',
    funding_source: '',
    keywords: [''],
    objectives: ['']
  });
  
  const [loading, setLoading] = useState(false);

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
    console.log('Project research area toggle clicked:', area);
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
      setLoading(true);
      
      // Clean up the data
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        principal_investigator: formData.principal_investigator.trim(),
        co_investigators: formData.co_investigators.filter(inv => inv.trim()),
        keywords: formData.keywords.filter(keyword => keyword.trim()),
        objectives: formData.objectives.filter(obj => obj.trim()),
        funding_amount: formData.funding_amount ? parseFloat(formData.funding_amount) : null
      };
      
      await onAdd(cleanedData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'Active',
        research_areas: [],
        principal_investigator: '',
        co_investigators: [''],
        start_date: '',
        end_date: '',
        funding_amount: '',
        funding_source: '',
        keywords: [''],
        objectives: ['']
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error adding project. Please try again.');
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
            <FolderOpen className="h-4 w-4 mr-2" />
            Add Project
          </>
        )}
      </Button>
    </>
  );

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Project"
      description="Create a new research project"
      icon={FolderOpen}
      loading={loading}
      footer={modalFooter}
      className="max-w-[95vw] max-h-[95vh] lg:max-w-[1200px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center mb-4 lg:mb-6">
              <FolderOpen className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-emerald-600" />
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

        {/* Project Timeline */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 inline mr-2" />
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

        {/* Funding Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 inline mr-2" />
              Funding Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Amount
                </label>
                <Input
                  type="number"
                  value={formData.funding_amount}
                  onChange={(e) => handleInputChange('funding_amount', e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className="text-sm lg:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Source
                </label>
                <Input
                  value={formData.funding_source}
                  onChange={(e) => handleInputChange('funding_source', e.target.value)}
                  placeholder="Enter funding source"
                  className="text-sm lg:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Co-Investigators */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 inline mr-2" />
              Co-Investigators
            </h3>
            {formData.co_investigators.map((investigator, index) => (
              <div key={index} className="flex gap-2 lg:gap-3 mb-3">
                <Input
                  value={investigator}
                  onChange={(e) => handleArrayChange('co_investigators', index, e.target.value)}
                  placeholder={`Co-Investigator ${index + 1}`}
                  className="text-sm lg:text-base"
                />
                {formData.co_investigators.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('co_investigators', index)}
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
              onClick={() => addArrayItem('co_investigators')}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Add Co-Investigator
            </Button>
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              <Tag className="h-4 w-4 lg:h-5 lg:w-5 inline mr-2" />
              Keywords
            </h3>
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
              <Tag className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Add Keyword
            </Button>
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 lg:p-6 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5 inline mr-2" />
              Project Objectives
            </h3>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex gap-2 lg:gap-3 mb-3">
                <textarea
                  value={objective}
                  onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                  placeholder={`Objective ${index + 1}`}
                  rows={2}
                  className="flex-1 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {formData.objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('objectives', index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 self-start"
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
              onClick={() => addArrayItem('objectives')}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Add Objective
            </Button>
          </div>
        </div>
      </form>
    </FullScreenModal>
  );
};

export default AddProjectModal;