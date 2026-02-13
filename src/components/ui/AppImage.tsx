'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    [key: string]: any;
}

function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    fill = false,
    sizes,
    onClick,
    fallbackSrc = '/assets/images/no_image.png',
    ...props
}: AppImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // More reliable external URL detection
    const isExternal = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
    const isLocal = imageSrc.startsWith('/') || imageSrc.startsWith('./') || imageSrc.startsWith('data:');

    const handleError = () => {
        if (!hasError && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(true);
        }
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const getCloudinaryUrl = (url: string) => {
        if (!url.includes('res.cloudinary.com')) return url;

        // Add auto-format, auto-quality and resizing if width/height provided
        // Example: https://res.cloudinary.com/demo/image/upload/sample.jpg
        // Transform: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_500/sample.jpg
        const parts = url.split('/upload/');
        if (parts.length !== 2) return url;

        let transformations = 'f_auto,q_auto';
        if (width && !fill) transformations += `,w_${width}`;
        if (height && !fill) transformations += `,h_${height},c_limit`;

        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    };

    const optimizedSrc = getCloudinaryUrl(imageSrc);

    const commonClassName = `${className} ${isLoading ? 'bg-gray-200' : ''} ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`;

    // For external URLs or when in doubt, use regular img tag
    if (isExternal && !isLocal) {
        const imgStyle: React.CSSProperties = {};

        if (width) imgStyle.width = width;
        if (height) imgStyle.height = height;

        if (fill) {
            return (
                <div className={`relative ${className}`} style={{ width: width || '100%', height: height || '100%' }}>
                    <img
                        src={optimizedSrc}
                        alt={alt}
                        className={`${commonClassName} absolute inset-0 w-full h-full object-cover`}
                        onError={handleError}
                        onLoad={handleLoad}
                        onClick={onClick}
                        style={imgStyle}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <img
                src={optimizedSrc}
                alt={alt}
                className={commonClassName}
                onError={handleError}
                onLoad={handleLoad}
                onClick={onClick}
                style={imgStyle}
                loading="lazy"
                {...props}
            />
        );
    }

    // For local images and data URLs, use Next.js Image component
    const imageProps = {
        src: optimizedSrc,
        alt,
        className: commonClassName,
        priority,
        quality,
        placeholder,
        blurDataURL,
        unoptimized: true,
        onError: handleError,
        onLoad: handleLoad,
        onClick,
        ...props,
    };

    if (fill) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    {...imageProps}
                    fill
                    sizes={sizes || '100vw'}
                    style={{ objectFit: 'cover' }}
                />
            </div>
        );
    }

    return (
        <Image
            {...imageProps}
            width={width || 400}
            height={height || 300}
        />
    );
}

export default AppImage;