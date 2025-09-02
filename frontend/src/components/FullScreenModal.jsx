import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const FullScreenModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full h-full max-w-7xl max-h-screen bg-white shadow-2xl overflow-hidden flex flex-col admin-modal-fullscreen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10 admin-modal-header">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <Button
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
        <div className="flex-1 overflow-y-auto p-6 admin-modal-scrollable">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;