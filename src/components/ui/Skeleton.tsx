import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

const Skeleton = ({ className = '', variant = 'rect' }: SkeletonProps) => {
    const variantClasses = {
        text: 'h-4 w-full rounded',
        rect: 'h-full w-full rounded-2xl',
        circle: 'h-12 w-12 rounded-full',
    };

    return (
        <div
            className={`animate-pulse bg-muted/60 relative overflow-hidden ${variantClasses[variant]} ${className}`}
        >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
    );
};

export default Skeleton;
