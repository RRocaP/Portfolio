/**
 * Lazy Loading Utility for Performance Optimization
 * Implements dynamic imports and intersection observer patterns
 */

export interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
  fallback?: () => void;
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImages(selector: string = 'img[data-src]'): void {
  const images = document.querySelectorAll<HTMLImageElement>(selector);
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            // Create a new image to preload
            const newImg = new Image();
            newImg.onload = () => {
              img.src = src;
              img.classList.add('loaded');
              img.removeAttribute('data-src');
            };
            newImg.src = src;
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.classList.add('loaded');
      }
    });
  }
}

/**
 * Lazy load D3.js when needed for visualizations
 * Now code-split into separate vendor chunk
 */
export async function loadD3() {
  try {
    // Wait for idle callback to avoid blocking main thread
    await new Promise(resolve => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(resolve, { timeout: 1000 });
      } else {
        setTimeout(resolve, 16);
      }
    });
    
    const d3Module = await import('d3');
    return d3Module;
  } catch (error) {
    console.error('Failed to load D3.js:', error);
    throw error;
  }
}

/**
 * Lazy load visualization components with budget awareness
 */
export async function loadVisualizationComponent(componentName: 'timeline' | 'protein') {
  if (!navigator.connection || navigator.connection.effectiveType !== 'slow-2g') {
    try {
      switch (componentName) {
        case 'timeline':
          return await import('../components/AntimicrobialResistanceTimeline.tsx');
        case 'protein':
          return await import('../utils/ProteinVisualization.ts');
        default:
          throw new Error(`Unknown component: ${componentName}`);
      }
    } catch (error) {
      console.error(`Failed to load ${componentName} component:`, error);
      return null;
    }
  }
  return null; // Skip on slow connections
}

/**
 * Lazy load React components with loading state
 */
export async function loadReactComponent<T = any>(
  componentPath: string,
  containerId: string,
  props?: Record<string, any>
): Promise<T | null> {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }
  
  // Show loading state
  container.innerHTML = `
    <div class="loading-wrapper">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading component...</p>
    </div>
  `;
  
  try {
    const [React, ReactDOM, Component] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import(componentPath)
    ]);
    
    const root = ReactDOM.createRoot(container);
    const ComponentClass = Component.default || Component;
    
    root.render(
      React.createElement(ComponentClass, props)
    );
    
    return ComponentClass;
  } catch (error) {
    console.error(`Failed to load component from ${componentPath}:`, error);
    container.innerHTML = `
      <div class="error-state">
        <p>Failed to load component</p>
      </div>
    `;
    return null;
  }
}

/**
 * Progressive enhancement for interactive elements
 */
export function progressiveEnhancement(
  selector: string,
  enhancementFn: (element: Element) => void,
  options: LazyLoadOptions = {}
): void {
  const elements = document.querySelectorAll(selector);
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          enhancementFn(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: options.rootMargin || '100px 0px',
      threshold: options.threshold || 0
    });
    
    elements.forEach(el => observer.observe(el));
  } else {
    // Immediate enhancement for older browsers
    elements.forEach(enhancementFn);
  }
}

/**
 * Debounced dynamic import for heavy libraries
 */
let importTimeout: NodeJS.Timeout | null = null;

export function debouncedImport<T = any>(
  importFn: () => Promise<T>,
  delay: number = 300
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (importTimeout) {
      clearTimeout(importTimeout);
    }
    
    importTimeout = setTimeout(async () => {
      try {
        const module = await importFn();
        resolve(module);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(resources: string[]): void {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    // Determine resource type
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(woff2?|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
}

/**
 * Initialize all lazy loading features
 */
export function initLazyLoading(): void {
  // Lazy load images
  lazyLoadImages();
  
  // Preload critical fonts
  preloadCriticalResources([
    '/fonts/Inter-Variable.woff2',
    '/fonts/Outfit-Variable.woff2'
  ]);
  
  // Progressive enhancement for protein visualizations
  progressiveEnhancement(
    '.protein-visualization',
    async (element) => {
      const d3 = await loadD3();
      // Initialize protein visualization with D3
      element.classList.add('enhanced');
    }
  );
}

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
  } else {
    initLazyLoading();
  }
}