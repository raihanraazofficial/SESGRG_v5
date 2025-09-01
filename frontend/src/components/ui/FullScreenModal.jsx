import React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

const FullScreenModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon: Icon, 
  children, 
  footer,
  loading = false,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-fullscreen admin-modal-overlay">
      <div className={`admin-modal-content bg-white rounded-xl w-full shadow-2xl flex flex-col ${className}`}>
        
        {/* Fixed Header */}
        <div className="admin-modal-header sticky top-0 bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="bg-emerald-100 p-2 rounded-full">
                <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-600" />
              </div>
            )}
            <div>
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">{title}</h2>
              {description && (
                <p className="text-xs lg:text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2"
            disabled={loading}
          >
            <X className="h-5 w-5 lg:h-6 lg:w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="admin-modal-scrollable flex-1 overflow-y-auto">
          <div className="admin-modal-form p-4 lg:p-6">
            {children}
          </div>
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="admin-modal-footer sticky bottom-0 bg-white border-t border-gray-200 p-4 lg:p-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenModal;