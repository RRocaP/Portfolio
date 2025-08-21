/**
 * Advanced Lazy Loading System for Performance Optimization
 * Implements intelligent resource loading with connection awareness
 */

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  enableDataSaver?: boolean;
  preloadStrategy?: 'viewport' | 'interaction' | 'connection';
}

interface ModuleLoader {
  component: () => Promise<any>;
  preload?: () => Promise<void>;
  priority: 'high' | 'medium' | 'low';
  condition?: () => boolean;
}

class LazyLoader {
  private intersectionObserver: IntersectionObserver | null = null;
  private loadedModules = new Set<string>();
  private loadingPromises = new Map<string, Promise<any>>();
  private connectionSpeed: 'slow' | 'fast' | 'unknown' = 'unknown';
  private dataSaverEnabled: boolean = false;

  constructor(private options: LazyLoadOptions = {}) {
    this.detectNetworkConditions();
    this.setupIntersectionObserver();
  }

  private detectNetworkConditions(): void {
    // Detect data saver preference
    this.dataSaverEnabled = 
      (navigator as any)?.connection?.saveData || 
      window.matchMedia('(prefers-reduced-data: reduce)').matches;

    // Detect connection speed
    const connection = (navigator as any)?.connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      this.connectionSpeed = ['4g', '5g'].includes(effectiveType) ? 'fast' : 'slow';
    }
  }

  private setupIntersectionObserver(): void {
    const {
      rootMargin = '100px 0px',
      threshold = 0.1
    } = this.options;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const moduleId = element.dataset.lazyModule;
            
            if (moduleId) {
              this.loadModule(moduleId);
              this.intersectionObserver?.unobserve(element);
            }
          }
        });
      },
      { rootMargin, threshold }
    );
  }

  /**
   * Register a component for lazy loading
   */
  registerComponent(id: string, loader: ModuleLoader): void {
    // Skip loading if conditions aren't met
    if (loader.condition && !loader.condition()) {
      return;
    }

    // Skip heavy components on slow connections
    if (this.connectionSpeed === 'slow' && loader.priority === 'low') {
      console.warn(`Skipping low-priority component ${id} due to slow connection`);
      return;
    }

    // Store module loader
    (window as any).__lazyModules = (window as any).__lazyModules || {};
    (window as any).__lazyModules[id] = loader;

    // Preload high-priority modules immediately
    if (loader.priority === 'high' && !this.dataSaverEnabled) {
      this.preloadModule(id);
    }
  }

  /**
   * Load module when needed
   */
  async loadModule(id: string): Promise<any> {
    if (this.loadedModules.has(id)) {
      return;
    }

    // Check if already loading
    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id);
    }

    const modules = (window as any).__lazyModules;
    const loader = modules?.[id];
    
    if (!loader) {
      console.warn(`Module ${id} not found`);
      return;
    }

    // Start loading
    const loadPromise = this.loadComponentWithFallback(id, loader);
    this.loadingPromises.set(id, loadPromise);

    try {
      const result = await loadPromise;
      this.loadedModules.add(id);
      return result;
    } catch (error) {
      console.error(`Failed to load module ${id}:`, error);
      this.loadingPromises.delete(id);
      throw error;
    }
  }

  private async loadComponentWithFallback(id: string, loader: ModuleLoader): Promise<any> {
    try {
      // Set a timeout for module loading
      const timeout = this.connectionSpeed === 'slow' ? 10000 : 5000;
      
      return await Promise.race([
        loader.component(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Module load timeout')), timeout)
        )
      ]);
    } catch (error) {
      console.warn(`Failed to load module ${id}, using fallback`, error);
      
      // Return a simple fallback component
      return {
        default: () => {
          const div = document.createElement('div');
          div.className = 'lazy-fallback';
          div.textContent = 'Content loading...';
          return div;
        }
      };
    }
  }

  /**
   * Preload module for better UX
   */
  async preloadModule(id: string): Promise<void> {
    const modules = (window as any).__lazyModules;
    const loader = modules?.[id];
    
    if (loader?.preload && !this.loadedModules.has(id)) {
      try {
        await loader.preload();
      } catch (error) {
        console.warn(`Failed to preload module ${id}:`, error);
      }
    }
  }

  /**
   * Observe element for lazy loading
   */
  observe(element: HTMLElement, moduleId: string): void {
    if (!this.intersectionObserver) return;
    
    element.dataset.lazyModule = moduleId;
    this.intersectionObserver.observe(element);
  }

  /**
   * Load component based on user interaction
   */
  loadOnInteraction(element: HTMLElement, moduleId: string, events: string[] = ['click', 'touchstart']): void {
    const loadHandler = () => {
      this.loadModule(moduleId);
      events.forEach(event => element.removeEventListener(event, loadHandler));
    };

    events.forEach(event => {
      element.addEventListener(event, loadHandler, { passive: true, once: true });
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.intersectionObserver?.disconnect();
    this.loadingPromises.clear();
    this.loadedModules.clear();
  }
}

// Singleton instance
let lazyLoader: LazyLoader | null = null;

export function getLazyLoader(options?: LazyLoadOptions): LazyLoader {
  if (!lazyLoader) {
    lazyLoader = new LazyLoader(options);
  }
  return lazyLoader;
}

/**
 * Dynamic import with retry and timeout
 */
export async function importWithRetry<T>(
  importFn: () => Promise<T>,
  maxRetries: number = 3,
  timeout: number = 5000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await Promise.race([
        importFn(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Import timeout')), timeout)
        )
      ]);
    } catch (error) {
      lastError = error as Error;
      
      // Wait before retry (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Code splitting helpers
 */
export const dynamicImports = {
  // Heavy visualization components
  proteinVisualization: () => importWithRetry(
    () => import('../components/ProteinVisualization.astro')
  ),
  
  proteinViewer: () => importWithRetry(
    () => import('../components/ProteinViewer.astro')
  ),
  
  d3Visualizations: () => importWithRetry(
    () => import('../utils/d3-visualizations')
  ),
  
  // Animation libraries
  gsap: () => importWithRetry(
    () => import('gsap')
  ),
  
  // Research components
  researchTimeline: () => importWithRetry(
    () => import('../components/AntimicrobialTimeline.astro')
  ),
  
  // Dashboard components
  metricsViz: () => importWithRetry(
    () => import('../components/ResearchMetricsViz.astro')
  )
};

export type { LazyLoadOptions, ModuleLoader };