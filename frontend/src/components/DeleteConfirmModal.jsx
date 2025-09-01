import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, person, isLoading = false }) => {
  if (!isOpen || !person) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to permanently delete this member? This action cannot be undone.
            </p>
            
            {/* Member Info Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-start space-x-3">
                <img 
                  src={person.photo}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{person.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{person.designation}</p>
                  <p className="text-xs text-gray-500 truncate">{person.affiliation}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Member</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;