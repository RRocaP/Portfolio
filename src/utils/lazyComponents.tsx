/**
 * Lazy Loading Utilities for React Components
 * Provides performance-optimized lazy loading with fallbacks
 */

import { lazy, Suspense, type ComponentType, type ReactElement } from 'react';

interface LazyLoadConfig {
  fallback?: ReactElement;
  retryCount?: number;
  retryDelay?: number;
  threshold?: number; // For intersection observer
  rootMargin?: string;
}

const DEFAULT_CONFIG: LazyLoadConfig = {
  retryCount: 3,
  retryDelay: 1000,
  threshold: 0.1,
  rootMargin: '50px 0px'
};

/**
 * Enhanced lazy loading with retry logic
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  config: LazyLoadConfig = {}
): ComponentType<React.ComponentProps<T>> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const LazyComponent = lazy(() => {
    let retries = 0;
    
    const attemptImport = (): Promise<{ default: T }> => {
      return importFunction().catch((error) => {
        if (retries < finalConfig.retryCount!) {
          retries++;
          console.warn(`Lazy import failed, retrying (${retries}/${finalConfig.retryCount}):`, error);
          return new Promise(resolve => {
            setTimeout(() => resolve(attemptImport()), finalConfig.retryDelay);
          });
        }
        throw error;
      });
    };
    
    return attemptImport();
  });

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={finalConfig.fallback || <LazyComponentFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Intersection observer based lazy loading
 */
export function createIntersectionLazyComponent<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  config: LazyLoadConfig = {}
): ComponentType<React.ComponentProps<T> & { className?: string }> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  return function IntersectionLazyWrapper(props: React.ComponentProps<T> & { className?: string }) {
    const [shouldLoad, setShouldLoad] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container || shouldLoad) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              observer.disconnect();
            }
          });
        },
        {
          threshold: finalConfig.threshold,
          rootMargin: finalConfig.rootMargin
        }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, [shouldLoad]);

    if (!shouldLoad) {
      return (
        <div 
          ref={containerRef} 
          className={props.className}
          style={{ minHeight: '200px' }}
        >
          {finalConfig.fallback || <LazyComponentFallback />}
        </div>
      );
    }

    const LazyComponent = createLazyComponent(importFunction, config);
    return <LazyComponent {...props} />;
  };
}

/**
 * Default fallback component
 */
function LazyComponentFallback() {
  return (
    <div className="lazy-component-loading" role="status" aria-label="Loading component">
      <div className="lazy-spinner" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Pre-configured lazy components for common use cases
export const LazySearch = createLazyComponent(() => import('../components/Search.tsx'));

export const LazyProjectShowcase = createIntersectionLazyComponent(
  () => import('../components/ProjectShowcase.tsx'),
  {
    fallback: (
      <div className="project-showcase-skeleton">
        <div className="skeleton-header">
          <div className="skeleton-line skeleton-line-wide" />
          <div className="skeleton-line skeleton-line-narrow" />
        </div>
        <div className="skeleton-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image" />
              <div className="skeleton-text">
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line-narrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
);

export const LazyHeroIntegrated = createIntersectionLazyComponent(
  () => import('../components/HeroIntegrated.tsx'),
  {
    fallback: (
      <div className="hero-skeleton" style={{ height: '100vh', background: '#0A0A0A' }}>
        <div className="hero-skeleton-content">
          <div className="skeleton-title" />
          <div className="skeleton-subtitle" />
          <div className="skeleton-actions" />
        </div>
      </div>
    )
  }
);

export const LazyBlogList = createIntersectionLazyComponent(
  () => import('../components/BlogList.tsx'),
  {
    fallback: (
      <div className="blog-list-skeleton">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton-blog-card">
            <div className="skeleton-blog-meta" />
            <div className="skeleton-line skeleton-line-wide" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line-narrow" />
          </div>
        ))}
      </div>
    )
  }
);

// React import (only needed for intersection observer)
import React from 'react';