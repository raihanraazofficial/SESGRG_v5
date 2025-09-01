import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Minus, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { usePeople } from '../contexts/PeopleContext';

const AddPersonModal = ({ isOpen, onClose, category = 'advisors' }) => {
  const { researchAreas, addPerson } = usePeople();
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    affiliation: '',
    description: '',
    expertise: [],
    photo: '',
    email: '',
    phone: '',
    googleScholar: '',
    researchGate: '',
    orcid: '',
    linkedin: '',
    github: '',
    ieee: '',
    website: ''
  });

  const [selectedCategory, setSelectedCategory] = useState(category);
  const [availableAreas, setAvailableAreas] = useState([]);

  useEffect(() => {
    setAvailableAreas(researchAreas.map((area, index) => ({ index, name: area })));
  }, [researchAreas]);

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExpertiseToggle = (areaIndex) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(areaIndex)
        ? prev.expertise.filter(i => i !== areaIndex)
        : prev.expertise.length < 4 
          ? [...prev.expertise, areaIndex]
          : prev.expertise // Max 4 areas
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.designation.trim() || !formData.affiliation.trim()) {
      alert('Please fill in all required fields (Name, Designation, Affiliation)');
      return;
    }

    // Set default photo if not provided
    const personData = {
      ...formData,
      photo: formData.photo.trim() || 'https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/noimg.jpg'
    };

    addPerson(selectedCategory, personData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      designation: '',
      affiliation: '',
      description: '',
      expertise: [],
      photo: '',
      email: '',
      phone: '',
      googleScholar: '',
      researchGate: '',
      orcid: '',
      linkedin: '',
      github: '',
      ieee: '',
      website: ''
    });
    onClose();
  };

  const getResearchAreaColor = (index) => {
    const colors = [
      'bg-emerald-100 text-emerald-700 border-emerald-300',
      'bg-blue-100 text-blue-700 border-blue-300',
      'bg-purple-100 text-purple-700 border-purple-300',
      'bg-orange-100 text-orange-700 border-orange-300',
      'bg-red-100 text-red-700 border-red-300',
      'bg-indigo-100 text-indigo-700 border-indigo-300',
      'bg-pink-100 text-pink-700 border-pink-300'
    ];
    return colors[index % colors.length];
  };

  const getCategoryDisplayName = (cat) => {
    switch (cat) {
      case 'advisors': return 'Advisor';
      case 'teamMembers': return 'Team Member';
      case 'collaborators': return 'Collaborator';
      default: return 'Member';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-5xl my-4 mx-4 shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]">
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <UserPlus className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Team Member</h2>
              <p className="text-sm text-gray-600 mt-1">Create a new {getCategoryDisplayName(selectedCategory).toLowerCase()} profile</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            
            {/* Category Selection */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Category</label>
                <div className="flex space-x-3">
                  {[
                    { key: 'advisors', label: 'Advisor' },
                    { key: 'teamMembers', label: 'Team Member' },
                    { key: 'collaborators', label: 'Collaborator' }
                  ].map((cat) => (
                    <Button
                      key={cat.key}
                      variant={selectedCategory === cat.key ? "default" : "outline"}
                      onClick={() => setSelectedCategory(cat.key)}
                      className="px-6 py-2"
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Associate Professor, Research Assistant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Affiliation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.affiliation}
                        onChange={(e) => handleInputChange('affiliation', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Department of EEE, BRAC University"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Brief description of research interests and expertise"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                      <input
                        type="url"
                        value={formData.photo}
                        onChange={(e) => handleInputChange('photo', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://example.com/photo.jpg (optional)"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty to use default placeholder image</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="+880-1xxxxxxxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Google Scholar</label>
                      <input
                        type="url"
                        value={formData.googleScholar}
                        onChange={(e) => handleInputChange('googleScholar', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://scholar.google.com/citations?user=..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ResearchGate</label>
                      <input
                        type="url"
                        value={formData.researchGate}
                        onChange={(e) => handleInputChange('researchGate', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://www.researchgate.net/profile/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ORCID</label>
                      <input
                        type="url"
                        value={formData.orcid}
                        onChange={(e) => handleInputChange('orcid', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://orcid.org/0000-0000-0000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">IEEE</label>
                      <input
                        type="url"
                        value={formData.ieee}
                        onChange={(e) => handleInputChange('ieee', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://ieeexplore.ieee.org/author/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Interest */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Research Interest (Max 4)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableAreas.map((area) => (
                    <div
                      key={area.index}
                      onClick={() => handleExpertiseToggle(area.index)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.expertise.includes(area.index)
                          ? getResearchAreaColor(area.index)
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{area.name}</span>
                        {formData.expertise.includes(area.index) ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Selected: {formData.expertise.length}/4 areas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-4 rounded-b-xl">
          <Button variant="outline" onClick={handleClose} className="px-6 py-2">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2">
            <Save className="h-4 w-4 mr-2" />
            Add {getCategoryDisplayName(selectedCategory)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;