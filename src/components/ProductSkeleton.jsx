import React from 'react';

const ProductSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 md:gap-8">
            {Array.from({ length: count }).map((_, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 h-full flex flex-col"
                >
                    {/* Image Aspect Ratio Placeholder */}
                    <div className="relative aspect-[3/4] shimmer-card w-full"></div>

                    {/* Content Placeholders */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3 bg-white">
                        <div className="space-y-2">
                            {/* Category skeleton */}
                            <div className="h-3 shimmer-card rounded w-1/3"></div>
                            {/* Title skeleton */}
                            <div className="h-4 shimmer-card rounded w-3/4"></div>
                            <div className="h-4 shimmer-card rounded w-1/2"></div>
                        </div>

                        {/* Price skeleton */}
                        <div className="h-5 shimmer-card rounded w-1/4 mt-2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSkeleton;
