import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const RefreshButton = ({ onRefresh, refreshing, size = "sm", className = "" }) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onRefresh}
      disabled={refreshing}
      className={`flex items-center space-x-2 ${className}`}
    >
      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
      <span className="hidden md:inline">{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
    </Button>
  );
};

export default RefreshButton;