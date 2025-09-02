import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import FullScreenModal from '../FullScreenModal';

const ObjectiveModal = ({ isOpen, onClose, objective, index, onSave, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    objective: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && objective) {
      setFormData({
        objective: objective || ''
      });
    } else {
      setFormData({
        objective: ''
      });
    }
  }, [objective, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.objective.trim()) {
      alert('Please enter an objective');
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (mode === 'add') {
        result = onSave(formData.objective);
      } else {
        result = onSave(index, formData.objective);
      }
      
      if (result.success) {
        alert(`Objective ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        onClose();
      } else {
        alert(result.error || `Failed to ${mode} objective`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing objective:`, error);
      alert(`Error ${mode}ing objective. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      objective: value
    }));
  };

  if (!isOpen) return null;

  return (
    <FullScreenModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${mode === 'add' ? 'Add' : 'Edit'} Objective`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Objective Content */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Target className="h-5 w-5 mr-2 text-emerald-600" />
                Objective Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <textarea
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                placeholder="Enter the objective description..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                This objective will be displayed in the "Our Objectives" section on the homepage.
              </p>
            </CardContent>
          </Card>

          {mode === 'edit' && (
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-center text-blue-700">
                  <Target className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    Position: #{index + 1} in the objectives list
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : `${mode === 'add' ? 'Add' : 'Update'} Objective`}
          </Button>
        </div>
      </form>
    </FullScreenModal>
  );
};

export default ObjectiveModal;