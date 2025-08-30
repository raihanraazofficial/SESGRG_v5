import React from 'react';

const SkeletonCard = ({ variant = 'regular' }) => {
  if (variant === 'featured') {
    return (
      <div className="hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-gradient-to-r from-white to-emerald-50 border-2 border-emerald-200 rounded-lg animate-pulse">
        <div className="md:flex">
          {/* Featured Image Skeleton */}
          <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden bg-gray-300"></div>
          
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="space-y-6">
              {/* Date Skeleton */}
              <div className="flex items-center">
                <div className="h-5 w-5 bg-gray-300 rounded mr-3"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
              </div>

              {/* Title Skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-300 rounded w-full"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>

              {/* Button Skeleton */}
              <div className="pt-6">
                <div className="h-12 bg-gray-300 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-lg border bg-white animate-pulse">
      {/* Regular Image Skeleton */}
      <div className="relative h-48 overflow-hidden bg-gray-300"></div>
      
      <div className="p-6">
        <div className="space-y-4">
          {/* Date Skeleton */}
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 rounded w-full"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
          </div>

          {/* Short Description Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

          {/* Button Skeleton */}
          <div className="pt-4 border-t border-gray-200">
            <div className="h-9 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;