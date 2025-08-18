import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  responsive?: boolean;
  srcSet?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  style,
  responsive = true,
  srcSet,
  objectFit = 'cover',
  objectPosition = 'center',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current || isInView || priority || loading === 'eager') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isInView, priority, loading]);

  // Generate responsive image paths
  const generateSrcSet = (baseSrc: string): string => {
    if (srcSet) return srcSet;
    
    const basePath = baseSrc.replace(/\.[^/.]+$/, ''); // Remove file extension
    const extension = baseSrc.split('.').pop();
    
    // Generate different sizes for responsive images
    const sizes = [480, 768, 1024, 1280, 1920];
    return sizes
      .map(size => `${basePath}-${size}w.${extension} ${size}w`)
      .join(', ');
  };

  const generateModernFormats = (baseSrc: string) => {
    const basePath = baseSrc.replace(/\.[^/.]+$/, '');
    return {
      avif: `${basePath}.avif`,
      webp: `${basePath}.webp`,
    };
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder if needed
  const generateBlurDataURL = (width: number, height: number): string => {
    if (blurDataURL) return blurDataURL;
    
    // Create a simple gray blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 10, 10);
      return canvas.toDataURL();
    }
    return '';
  };

  const modernFormats = generateModernFormats(src);
  const responsiveSrcSet = generateSrcSet(src);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    ...(!responsive && width && height && { width, height }),
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    display: 'block',
    maxWidth: '100%',
    height: responsive ? 'auto' : '100%',
    objectFit,
    objectPosition,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 0 : 1,
    pointerEvents: 'none',
  };

  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={containerStyle}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && width && height && (
        <div style={placeholderStyle}>
          <img
            src={generateBlurDataURL(width, height)}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(10px)',
              transform: 'scale(1.1)', // Slightly larger to hide blur edges
            }}
            aria-hidden="true"
          />
        </div>
      )}
      
      {/* Loading placeholder */}
      {placeholder === 'empty' && (
        <div style={placeholderStyle}>
          <div className="animate-pulse bg-gray-200 w-full h-full rounded" />
        </div>
      )}

      {/* Main image with modern formats */}
      {isInView && (
        <picture>
          {/* Modern formats with responsive srcsets */}
          <source 
            srcSet={generateSrcSet(modernFormats.avif)}
            type="image/avif"
            sizes={sizes}
          />
          <source 
            srcSet={generateSrcSet(modernFormats.webp)}
            type="image/webp" 
            sizes={sizes}
          />
          
          {/* Fallback image */}
          <img
            ref={imgRef}
            src={src}
            srcSet={responsiveSrcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={handleLoad}
            onError={handleError}
            style={imageStyle}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;