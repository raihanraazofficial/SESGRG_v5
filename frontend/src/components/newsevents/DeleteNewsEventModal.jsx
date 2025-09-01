import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

const DeleteNewsEventModal = ({ isOpen, onClose, onConfirm, newsEvent }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(newsEvent.id);
      onClose();
    } catch (error) {
      console.error('Error deleting news event:', error);
      alert('Failed to delete news event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !newsEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{overflow: 'hidden'}}>
      <div className="bg-white rounded-lg w-full max-w-md m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            Delete News/Event
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this news/event? This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-2">{newsEvent.title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Category:</strong> {newsEvent.category}</p>
                <p><strong>Date:</strong> {new Date(newsEvent.date).toLocaleDateString()}</p>
                {newsEvent.location && <p><strong>Location:</strong> {newsEvent.location}</p>}
                {newsEvent.featured && (
                  <p className="text-yellow-600"><strong>Featured:</strong> Yes</p>
                )}
                {newsEvent.short_description && (
                  <p className="text-gray-500 text-xs mt-2 italic">
                    {newsEvent.short_description.substring(0, 100)}
                    {newsEvent.short_description.length > 100 ? '...' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {loading ? 'Deleting...' : 'Delete News/Event'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteNewsEventModal;