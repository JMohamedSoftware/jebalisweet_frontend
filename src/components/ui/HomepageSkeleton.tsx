import React from 'react';
import Skeleton from './Skeleton';

const HomepageSkeleton = () => {
    return (
        <div className="container mx-auto px-6 py-8 space-y-16 animate-in fade-in duration-500">
            {/* Hero Skeleton */}
            <Skeleton className="h-[450px] md:h-[500px]" />

            {/* Immersive Categories Skeleton */}
            <section className="space-y-0 w-full">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} h-[500px] md:h-[650px] w-full`}>
                        <Skeleton className="w-full md:w-1/2 h-64 md:h-full" />
                        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 bg-white flex flex-col justify-center space-y-6">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-6 w-full" />
                            <div className="space-y-4 pt-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                            <Skeleton className="h-12 w-48 rounded-full" />
                        </div>
                    </div>
                ))}
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
