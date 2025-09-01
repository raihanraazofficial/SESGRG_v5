import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

const DeleteAchievementModal = ({ isOpen, onClose, onDelete, achievement }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(achievement.id);
      onClose();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert('Error deleting achievement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Achievement</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this achievement? This action cannot be undone.
            </p>
            
            {/* Achievement Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-start space-x-3">
                {achievement.image && (
                  <img 
                    src={achievement.image} 
                    alt={achievement.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {achievement.short_description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                      {achievement.category}
                    </span>
                    <span>{formatDate(achievement.date)}</span>
                    {achievement.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Achievement
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAchievementModal;