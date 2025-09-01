import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

const DeleteGalleryModal = ({ isOpen, onClose, onConfirm, item }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Gallery Item</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this gallery item? This action cannot be undone.
            </p>
            
            {/* Item Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-start gap-4">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkgyNFYzMkg1NlYzMkg1NlY0OEg1NlY0OEgyNFY0OEgyNFYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.caption}</h4>
                  <p className="text-sm text-gray-600 mt-1">Category: {item.category}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteGalleryModal;