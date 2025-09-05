import React, { useState } from 'react';
import { X, Plus, Loader2, User, Mail, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AddPersonModal = ({ isOpen, onClose, onAdd, category, researchAreas }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    qualification: '',
    affiliation: '',
    profilePicture: '',
    researchInterests: [],
    linkedinProfile: '',
    googleScholarProfile: '',
    researchGateProfile: '',
    biography: '',
    achievements: ['']
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

  const handleResearchInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.includes(interest)
        ? prev.researchInterests.filter(i => i !== interest)
        : [...prev.researchInterests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }

    setLoading(true);
    try {
      const cleanedData = {
        ...formData,
        achievements: formData.achievements.filter(achievement => achievement.trim()),
      };
      
      await onAdd(cleanedData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        designation: '',
        qualification: '',
        affiliation: '',
        profilePicture: '',
        researchInterests: [],
        linkedinProfile: '',
        googleScholarProfile: '',
        researchGateProfile: '',
        biography: '',
        achievements: ['']
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding person:', error);
      alert('Error adding person. Please try again.');
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-4xl my-4 mx-4 shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add {category}</h2>
              <p className="text-sm text-gray-600 mt-1">Add new person to {category} section</p>
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
                  <User className="h-5 w-5 mr-2 text-emerald-600" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      required
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      required
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <Input
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      placeholder="Enter designation"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <Input
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      placeholder="e.g., PhD in Computer Science"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Affiliation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affiliation
                    </label>
                    <Input
                      value={formData.affiliation}
                      onChange={(e) => handleInputChange('affiliation', e.target.value)}
                      placeholder="e.g., BRAC University"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture URL
                    </label>
                    <Input
                      type="url"
                      value={formData.profilePicture}
                      onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>
                </div>
              </div>

              {/* Research Interests */}
              {researchAreas && researchAreas.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Research Interests
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {researchAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                        <input
                          type="checkbox"
                          id={`research_${index}`}
                          checked={formData.researchInterests.includes(area.name)}
                          onChange={() => handleResearchInterestToggle(area.name)}
                          className="research-area-checkbox h-5 w-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        />
                        <label 
                          htmlFor={`research_${index}`}
                          className="text-sm text-gray-700 font-medium cursor-pointer flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleResearchInterestToggle(area.name);
                          }}
                        >
                          {area.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Profiles */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-emerald-600" />
                  Professional Profiles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <Input
                      type="url"
                      value={formData.linkedinProfile}
                      onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* Google Scholar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Scholar Profile
                    </label>
                    <Input
                      type="url"
                      value={formData.googleScholarProfile}
                      onChange={(e) => handleInputChange('googleScholarProfile', e.target.value)}
                      placeholder="https://scholar.google.com/citations?user="
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>

                  {/* ResearchGate */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ResearchGate Profile
                    </label>
                    <Input
                      type="url"
                      value={formData.researchGateProfile}
                      onChange={(e) => handleInputChange('researchGateProfile', e.target.value)}
                      placeholder="https://www.researchgate.net/profile/"
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Biography
                </h3>
                <textarea
                  value={formData.biography}
                  onChange={(e) => handleInputChange('biography', e.target.value)}
                  placeholder="Enter person's biography..."
                  rows={5}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                />
              </div>

              {/* Achievements */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notable Achievements
                </h3>
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <Input
                      value={achievement}
                      onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                      placeholder={`Achievement ${index + 1}`}
                      className="text-base"
                      style={{ pointerEvents: 'auto', userSelect: 'text', cursor: 'text' }}
                    />
                    {formData.achievements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('achievements', index)}
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
                  onClick={() => addArrayItem('achievements')}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
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
                Adding...
              </>
            ) : (
              `Add ${category}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;