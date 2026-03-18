import React from 'react';
import Skeleton from './Skeleton';

const HomepageSkeleton = () => {
    return (
        <div className="container mx-auto px-6 py-8 space-y-16 animate-in fade-in duration-500">
            {/* Hero Skeleton */}
            <Skeleton className="h-[450px] md:h-[500px]" />

            {/* Categories Grid Skeleton */}
            <section>
                <div className="flex flex-col items-center mb-12 space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-96" />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square sm:aspect-video" />
                    ))}
                </div>
            </section>

            {/* Products Grid Skeleton */}
            <section>
                <div className="flex flex-col items-center mb-12 space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-96" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[4/3]" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomepageSkeleton;
