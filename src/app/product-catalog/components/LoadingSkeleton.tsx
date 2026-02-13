import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 })?.map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-lg shadow-warm overflow-hidden animate-pulse"
        >
          <div className="h-64 bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="flex items-center gap-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-4 bg-muted rounded w-12" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-8 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;