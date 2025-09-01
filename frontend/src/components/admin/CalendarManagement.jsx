import React, { useState, useEffect } from 'react';
import { Calendar, Save, RotateCcw, ExternalLink, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const CalendarManagement = () => {
  const [settings, setSettings] = useState({
    title: 'Upcoming Events Calendar',
    calendarUrl: 'https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka',
    height: '400px',
    description: 'Stay updated with our upcoming events and important dates.'
  });

  const [originalSettings, setOriginalSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('sesg_calendar_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
        setOriginalSettings(parsedSettings);
      } else {
        setOriginalSettings(settings);
      }
    } catch (error) {
      console.error('Error loading calendar settings:', error);
      setOriginalSettings(settings);
    }
  }, []);

  // Update preview URL when calendar URL changes
  useEffect(() => {
    if (settings.calendarUrl) {
      setPreviewUrl(settings.calendarUrl);
    }
  }, [settings.calendarUrl]);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaveStatus(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);

      // Validate required fields
      if (!settings.title.trim()) {
        throw new Error('Calendar title is required');
      }
      if (!settings.calendarUrl.trim()) {
        throw new Error('Calendar URL is required');
      }

      // Validate URL format
      if (!settings.calendarUrl.includes('calendar.google.com')) {
        throw new Error('Please provide a valid Google Calendar embed URL');
      }

      // Save to localStorage
      localStorage.setItem('sesg_calendar_settings', JSON.stringify(settings));
      setOriginalSettings(settings);
      
      // Show success message
      setSaveStatus({ type: 'success', message: 'Calendar settings saved successfully!' });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);

    } catch (error) {
      console.error('Error saving calendar settings:', error);
      setSaveStatus({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setSaveStatus(null);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Management</h1>
          <p className="text-gray-600 mt-2">Manage the Google Calendar widget settings for News & Events page</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">Admin Access</span>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-4 rounded-lg border ${
          saveStatus.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {saveStatus.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
              Calendar Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calendar Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calendar Title
              </label>
              <Input
                value={settings.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter calendar title"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                This title will be displayed above the calendar widget
              </p>
            </div>

            {/* Calendar URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Calendar Embed URL
              </label>
              <Textarea
                value={settings.calendarUrl}
                onChange={(e) => handleInputChange('calendarUrl', e.target.value)}
                placeholder="Paste your Google Calendar embed URL here"
                rows={3}
                className="w-full font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this URL from Google Calendar → Settings → Integrate calendar → Embed code
              </p>
            </div>

            {/* Calendar Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calendar Height
              </label>
              <Input
                value={settings.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="e.g., 400px, 50vh, 600px"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set the height of the calendar widget (e.g., 400px, 50vh)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <Textarea
                value={settings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description about the calendar"
                rows={2}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional description text shown below the calendar title
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={!hasChanges}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Quick Access Link */}
            <div className="pt-4 border-t">
              <a
                href="/news-events"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View News & Events Page
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Calendar Preview
              </span>
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                size="sm"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showPreview ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {settings.title || 'Calendar Title'}
                  </h3>
                  {settings.description && (
                    <p className="text-gray-600 text-sm mb-4">{settings.description}</p>
                  )}
                </div>
                
                {settings.calendarUrl && settings.calendarUrl.includes('calendar.google.com') ? (
                  <div 
                    className="w-full rounded-lg overflow-hidden border"
                    style={{ height: settings.height || '400px' }}
                  >
                    <iframe
                      src={settings.calendarUrl}
                      style={{ border: 0 }}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      className="rounded-lg"
                      title={settings.title || 'Calendar Preview'}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {settings.calendarUrl ? 
                        'Invalid Google Calendar URL' : 
                        'Enter a Google Calendar embed URL to see preview'
                      }
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Calendar Preview</p>
                <p className="text-gray-400 text-sm">
                  Click "Show Preview" to see how your calendar will look
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            How to Get Google Calendar Embed URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to <strong>Google Calendar</strong> and sign in to your account</li>
              <li>Select the calendar you want to embed from the left sidebar</li>
              <li>Click on the <strong>three dots</strong> next to the calendar name</li>
              <li>Select <strong>"Settings and sharing"</strong></li>
              <li>Scroll down to <strong>"Integrate calendar"</strong> section</li>
              <li>Copy the <strong>"Embed code"</strong> and paste only the <strong>src URL</strong> part here</li>
            </ol>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2"><strong>Example:</strong></p>
              <code className="text-xs text-gray-800 break-all">
                https://calendar.google.com/calendar/embed?src=your-calendar-id&ctz=Asia%2FDhaka
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarManagement;