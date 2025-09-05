import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const FullScreenModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop, not on modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center admin-modal-overlay"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Modal - Full Screen */}
      <div 
        className="admin-modal-content bg-white w-full h-full shadow-2xl overflow-hidden flex flex-col"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header sticky top-0 bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Close</span>
          </Button>
        </div>
        
        {/* Content */}
        <div className="admin-modal-scrollable flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;