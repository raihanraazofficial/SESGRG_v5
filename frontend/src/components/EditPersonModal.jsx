import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { usePeople } from '../contexts/PeopleContext';

const EditPersonModal = ({ person, category, isOpen, onClose }) => {
  const { researchAreas, updatePerson } = usePeople();
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

  const [availableAreas, setAvailableAreas] = useState([]);

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || '',
        designation: person.designation || '',
        affiliation: person.affiliation || '',
        description: person.description || '',
        expertise: person.expertise || [],
        photo: person.photo || '',
        email: person.email || '',
        phone: person.phone || '',
        googleScholar: person.googleScholar || '',
        researchGate: person.researchGate || '',
        orcid: person.orcid || '',
        linkedin: person.linkedin || '',
        github: person.github || '',
        ieee: person.ieee || '',
        website: person.website || ''
      });
    }
    
    // Set available research areas
    setAvailableAreas(researchAreas.map((area, index) => ({ index, name: area })));
  }, [person, researchAreas]);

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
    updatePerson(category, person.id, formData);
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

  if (!isOpen || !person) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit {person.name}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliation</label>
                <input
                  type="text"
                  value={formData.affiliation}
                  onChange={(e) => handleInputChange('affiliation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => handleInputChange('photo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Scholar</label>
                <input
                  type="url"
                  value={formData.googleScholar}
                  onChange={(e) => handleInputChange('googleScholar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ResearchGate</label>
                <input
                  type="url"
                  value={formData.researchGate}
                  onChange={(e) => handleInputChange('researchGate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ORCID</label>
                <input
                  type="url"
                  value={formData.orcid}
                  onChange={(e) => handleInputChange('orcid', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IEEE</label>
                <input
                  type="url"
                  value={formData.ieee}
                  onChange={(e) => handleInputChange('ieee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Research Interest */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Research Interest (Max 4)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableAreas.map((area) => (
                <div
                  key={area.index}
                  onClick={() => handleExpertiseToggle(area.index)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
            <p className="text-sm text-gray-500 mt-2">
              Selected: {formData.expertise.length}/4 areas
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPersonModal;