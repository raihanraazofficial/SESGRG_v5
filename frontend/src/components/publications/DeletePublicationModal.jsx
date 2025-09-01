import React, { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { Button } from '../ui/button';

const DeletePublicationModal = ({ isOpen, onClose, onDelete, publication }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(publication.id);
      onClose();
    } catch (error) {
      console.error('Error deleting publication:', error);
      alert('Error deleting publication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !publication) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Publication</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this publication? This action cannot be undone.
          </p>
          
          {/* Publication Preview */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-2">
              {publication.title}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Authors:</strong> {publication.authors.join(', ')}</p>
              <p><strong>Year:</strong> {publication.year}</p>
              <p><strong>Category:</strong> {publication.category}</p>
              <p><strong>Research Areas:</strong> {publication.research_areas.join(', ')}</p>
              {publication.citations && (
                <p><strong>Citations:</strong> {publication.citations}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, Delete Publication'
            )}
          </Button>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletePublicationModal;