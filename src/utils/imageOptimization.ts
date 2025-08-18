import type { 
  ResponsiveImageBreakpoint, 
  ImageFormat, 
  OptimizedImageConfig,
  GeneratedImageSources,
  ResponsiveImageSet 
} from '../types/image';

export const DEFAULT_BREAKPOINTS: ResponsiveImageBreakpoint[] = [
  { width: 480, mediaQuery: '(max-width: 767px)' },
  { width: 768, mediaQuery: '(min-width: 768px) and (max-width: 1023px)' },
  { width: 1024, mediaQuery: '(min-width: 1024px) and (max-width: 1279px)' },
  { width: 1280, mediaQuery: '(min-width: 1280px) and (max-width: 1919px)' },
  { width: 1920, mediaQuery: '(min-width: 1920px)' },
];

export const DEFAULT_FORMATS: ImageFormat[] = [
  { format: 'avif', quality: 80 },
  { format: 'webp', quality: 85 },
  { format: 'jpeg', quality: 90 },
];

export const DEFAULT_CONFIG: OptimizedImageConfig = {
  formats: DEFAULT_FORMATS,
  breakpoints: DEFAULT_BREAKPOINTS,
  defaultQuality: 85,
  lazyLoadMargin: '50px',
  placeholderType: 'empty',
  placeholderColor: '#f3f4f6',
};

/**
 * Generates responsive image paths for different formats and sizes
 */
export function generateImageSources(
  baseSrc: string,
  breakpoints: ResponsiveImageBreakpoint[] = DEFAULT_BREAKPOINTS,
  formats: ImageFormat[] = DEFAULT_FORMATS
): GeneratedImageSources {
  const basePath = baseSrc.replace(/\.[^/.]+$/, '');
  const originalExtension = baseSrc.split('.').pop() || 'jpg';

  const createImageSet = (format: string): ResponsiveImageSet[] => {
    return breakpoints.map(bp => ({
      src: `${basePath}-${bp.width}w.${format}`,
      width: bp.width,
      height: Math.round(bp.width * 0.75), // Assume 4:3 aspect ratio
      format,
    }));
  };

  return {
    avif: createImageSet('avif'),
    webp: createImageSet('webp'),
    fallback: createImageSet(originalExtension),
  };
}

/**
 * Generates srcSet string for responsive images
 */
export function generateSrcSet(
  imageSets: ResponsiveImageSet[],
  includeDescriptors: boolean = true
): string {
  return imageSets
    .map(img => includeDescriptors ? `${img.src} ${img.width}w` : img.src)
    .join(', ');
}

/**
 * Generates sizes attribute based on breakpoints
 */
export function generateSizesAttribute(
  breakpoints: ResponsiveImageBreakpoint[],
  defaultSize: string = '100vw'
): string {
  const sizeRules = breakpoints
    .filter(bp => bp.mediaQuery)
    .map(bp => `${bp.mediaQuery} ${Math.round(bp.width * 0.9)}px`);
  
  sizeRules.push(defaultSize);
  return sizeRules.join(', ');
}

/**
 * Creates a blur placeholder data URL
 */
export function createBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#f3f4f6'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

/**
 * Calculates optimal image dimensions maintaining aspect ratio
 */
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  maintainAspectRatio: boolean = true
): { width: number; height: number } {
  if (!maintainAspectRatio) {
    return { width: targetWidth, height: originalHeight };
  }
  
  const aspectRatio = originalWidth / originalHeight;
  const height = Math.round(targetWidth / aspectRatio);
  
  return { width: targetWidth, height };
}

/**
 * Determines if WebP or AVIF is supported
 */
export function checkModernFormatSupport(): Promise<{
  webp: boolean;
  avif: boolean;
}> {
  return new Promise((resolve) => {
    const results = { webp: false, avif: false };
    let completed = 0;
    
    const checkComplete = () => {
      completed++;
      if (completed === 2) {
        resolve(results);
      }
    };
    
    // Check WebP support
    const webpImg = new Image();
    webpImg.onload = () => {
      results.webp = true;
      checkComplete();
    };
    webpImg.onerror = () => {
      results.webp = false;
      checkComplete();
    };
    webpImg.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    
    // Check AVIF support
    const avifImg = new Image();
    avifImg.onload = () => {
      results.avif = true;
      checkComplete();
    };
    avifImg.onerror = () => {
      results.avif = false;
      checkComplete();
    };
    avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
  });
}

/**
 * Image preloader for critical images
 */
export function preloadImage(
  src: string,
  priority: boolean = false
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (priority) {
      img.decoding = 'sync';
      img.fetchPriority = 'high';
    }
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch preload multiple images
 */
export function preloadImages(
  sources: string[],
  priority: boolean = false
): Promise<HTMLImageElement[]> {
  return Promise.all(
    sources.map(src => preloadImage(src, priority))
  );
}

/**
 * Estimate image file size based on dimensions and format
 */
export function estimateImageSize(
  width: number,
  height: number,
  format: string,
  quality: number = 85
): number {
  const pixels = width * height;
  const qualityFactor = quality / 100;
  
  switch (format.toLowerCase()) {
    case 'avif':
      return Math.round(pixels * 0.1 * qualityFactor);
    case 'webp':
      return Math.round(pixels * 0.15 * qualityFactor);
    case 'jpeg':
    case 'jpg':
      return Math.round(pixels * 0.25 * qualityFactor);
    case 'png':
      return Math.round(pixels * 0.5);
    default:
      return Math.round(pixels * 0.3 * qualityFactor);
  }
}

/**
 * Performance monitoring utilities
 */
export class ImagePerformanceMonitor {
  private static instance: ImagePerformanceMonitor;
  private metrics: Map<string, any> = new Map();
  
  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor();
    }
    return ImagePerformanceMonitor.instance;
  }
  
  startMeasure(imageId: string): void {
    this.metrics.set(imageId, {
      startTime: performance.now(),
      loadTime: null,
      renderTime: null,
    });
  }
  
  recordLoad(imageId: string): void {
    const metric = this.metrics.get(imageId);
    if (metric) {
      metric.loadTime = performance.now() - metric.startTime;
    }
  }
  
  recordRender(imageId: string): void {
    const metric = this.metrics.get(imageId);
    if (metric) {
      metric.renderTime = performance.now() - metric.startTime;
    }
  }
  
  getMetrics(imageId: string) {
    return this.metrics.get(imageId);
  }
  
  getAllMetrics() {
    return Array.from(this.metrics.entries());
  }
}