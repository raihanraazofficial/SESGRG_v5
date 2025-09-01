import React, { useState, useEffect } from 'react';
import { X, Calendar, Link, Type, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const CalendarSettingsModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: 'Upcoming Events Calendar',
    calendarUrl: 'https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka',
    height: '400px',
    description: 'Stay updated with our upcoming events and important dates.'
  });

  const [loading, setLoading] = useState(false);

  // Load existing settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('sesg_calendar_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setFormData(prev => ({
          ...prev,
          ...settings
        }));
      }
    } catch (error) {
      console.error('Error loading calendar settings:', error);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a calendar title');
      return;
    }

    if (!formData.calendarUrl.trim()) {
      alert('Please enter a calendar URL');
      return;
    }

    try {
      setLoading(true);
      
      // Save to localStorage
      localStorage.setItem('sesg_calendar_settings', JSON.stringify(formData));
      
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error saving calendar settings:', error);
      alert('Failed to save calendar settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefault = () => {
    setFormData({
      title: 'Upcoming Events Calendar',
      calendarUrl: 'https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka',
      height: '400px',
      description: 'Stay updated with our upcoming events and important dates.'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{overflow: 'hidden'}}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-3 text-emerald-600" />
            Calendar Settings
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Calendar Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="h-4 w-4 inline mr-2" />
              Calendar Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter calendar title"
              required
            />
          </div>

          {/* Calendar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="h-4 w-4 inline mr-2" />
              Google Calendar Embed URL *
            </label>
            <Input
              value={formData.calendarUrl}
              onChange={(e) => handleChange('calendarUrl', e.target.value)}
              placeholder="https://calendar.google.com/calendar/embed?src=..."
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              📝 <strong>How to get Google Calendar embed URL:</strong><br/>
              1. Go to your Google Calendar<br/>
              2. Click Settings → Settings<br/>
              3. Select your calendar from left sidebar<br/>
              4. Scroll to "Integrate calendar"<br/>
              5. Copy the "Embed code" URL (the src="..." part)
            </p>
          </div>

          {/* Calendar Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calendar Height
            </label>
            <Input
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="400px"
            />
            <p className="text-sm text-gray-600 mt-1">
              Examples: 400px, 500px, 600px
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description about the calendar"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Preview:</h4>
            <div className="bg-white rounded border p-4">
              <h3 className="text-lg font-bold mb-2">{formData.title}</h3>
              {formData.description && (
                <p className="text-gray-600 text-sm mb-3">{formData.description}</p>
              )}
              <div className="bg-gray-200 rounded" style={{height: formData.height || '400px'}}>
                <div className="flex items-center justify-center h-full text-gray-500">
                  Calendar Preview ({formData.height || '400px'})
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button type="button" variant="outline" onClick={resetToDefault}>
              Reset to Default
            </Button>
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarSettingsModal;