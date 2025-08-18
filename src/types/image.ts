export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResponsiveImageBreakpoint {
  width: number;
  mediaQuery?: string;
}

export interface ImageFormat {
  format: 'avif' | 'webp' | 'jpeg' | 'png' | 'gif';
  quality?: number;
}

export interface OptimizedImageConfig {
  formats: ImageFormat[];
  breakpoints: ResponsiveImageBreakpoint[];
  defaultQuality: number;
  lazyLoadMargin: string;
  placeholderType: 'blur' | 'empty' | 'solid';
  placeholderColor?: string;
}

export interface ImageLoadState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface ImageMetrics {
  loadTime: number;
  renderTime: number;
  fileSize?: number;
  dimensions: ImageDimensions;
  format: string;
}

export type ImageObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type ImageObjectPosition = string;
export type ImageLoading = 'lazy' | 'eager';
export type ImageDecoding = 'async' | 'sync' | 'auto';
export type ImageFetchPriority = 'high' | 'low' | 'auto';

export interface BaseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface OptimizedImageProps extends BaseImageProps {
  loading?: ImageLoading;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  responsive?: boolean;
  srcSet?: string;
  objectFit?: ImageObjectFit;
  objectPosition?: ImageObjectPosition;
  decoding?: ImageDecoding;
  fetchPriority?: ImageFetchPriority;
  formats?: ImageFormat[];
  breakpoints?: ResponsiveImageBreakpoint[];
}

export interface ResponsiveImageSet {
  src: string;
  width: number;
  height: number;
  format: string;
}

export interface GeneratedImageSources {
  avif: ResponsiveImageSet[];
  webp: ResponsiveImageSet[];
  fallback: ResponsiveImageSet[];
}

export interface ImageOptimizationResult {
  sources: GeneratedImageSources;
  placeholder?: string;
  aspectRatio: number;
  totalFileSize: number;
  formats: string[];
}