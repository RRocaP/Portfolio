// Performance metrics tracking for analytics
import type { PerformanceEvent, AnalyticsEvent } from '../types/analytics';

/**
 * Performance Tracker
 * Monitors and reports Core Web Vitals and custom performance metrics
 */
export class PerformanceTracker {
  private sessionId: string;
  private userId?: string;
  private eventCallbacks: ((event: AnalyticsEvent) => void)[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private metrics: Map<string, number> = new Map();
  
  // Performance thresholds (in ms or score)
  private thresholds = {
    // Core Web Vitals thresholds
    LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
    FID: { good: 100, poor: 300 },        // First Input Delay  
    CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
    FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
    TTFB: { good: 800, poor: 1800 },      // Time to First Byte
    
    // Custom thresholds
    pageLoad: { good: 3000, poor: 6000 },
    domReady: { good: 2000, poor: 4000 },
    resourceLoad: { good: 500, poor: 2000 },
  };

  private vitalsCollected: Set<string> = new Set();

  constructor(sessionId: string, userId?: string) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.initializePerformanceTracking();
  }

  /**
   * Add event callback
   */
  public onEvent(callback: (event: AnalyticsEvent) => void): void {
    this.eventCallbacks.push(callback);
  }

  /**
   * Initialize performance tracking
   */
  private initializePerformanceTracking(): void {
    // Track navigation timing on page load
    if (document.readyState === 'loading') {
      window.addEventListener('load', () => this.trackNavigationTiming());
    } else {
      // Page already loaded
      setTimeout(() => this.trackNavigationTiming(), 0);
    }

    // Set up Core Web Vitals tracking
    this.trackCoreWebVitals();

    // Track resource loading performance
    this.trackResourceTiming();

    // Track memory usage (if available)
    this.trackMemoryUsage();

    // Track network information
    this.trackNetworkInfo();

    // Set up periodic performance monitoring
    this.setupPerformanceMonitoring();
  }

  /**
   * Track Core Web Vitals
   */
  private trackCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    this.trackLCP();

    // First Input Delay (FID)
    this.trackFID();

    // Cumulative Layout Shift (CLS)
    this.trackCLS();

    // First Contentful Paint (FCP)
    this.trackFCP();

    // Time to First Byte (TTFB)
    this.trackTTFB();
  }

  /**
   * Track Largest Contentful Paint
   */
  private trackLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry && !this.vitalsCollected.has('LCP')) {
          this.trackMetric('LCP', lastEntry.startTime, {
            element: lastEntry.element?.tagName || 'unknown',
            loadState: lastEntry.loadState || 'unknown',
            url: lastEntry.url || window.location.href,
          });
          this.vitalsCollected.add('LCP');
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.set('LCP', observer);
    } catch (error) {
      this.logError('LCP tracking failed', error);
    }
  }

  /**
   * Track First Input Delay
   */
  private trackFID(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!this.vitalsCollected.has('FID')) {
            const fid = entry.processingStart - entry.startTime;
            this.trackMetric('FID', fid, {
              eventType: (entry as any).name,
              eventTarget: (entry as any).target?.tagName || 'unknown',
            });
            this.vitalsCollected.add('FID');
            break; // Only track the first input
          }
        }
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.set('FID', observer);
    } catch (error) {
      this.logError('FID tracking failed', error);
    }
  }

  /**
   * Track Cumulative Layout Shift
   */
  private trackCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let clsEntries: any[] = [];
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only count layout shifts without recent input
          if (!(entry as any).hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            // Check if this entry belongs to the current session window
            if (!sessionValue ||
                entry.startTime - lastSessionEntry.startTime < 1000 ||
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += (entry as any).value;
              sessionEntries.push(entry);
            } else {
              // Start new session
              sessionValue = (entry as any).value;
              sessionEntries = [entry];
            }

            // Update overall CLS value
            clsValue = Math.max(clsValue, sessionValue);
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('CLS', observer);

      // Report CLS when page becomes hidden
      this.reportCLSOnPageHide = () => {
        if (clsValue > 0 && !this.vitalsCollected.has('CLS')) {
          this.trackMetric('CLS', clsValue, {
            sessionEntries: sessionEntries.length,
            largestShift: Math.max(...sessionEntries.map(e => e.value), 0),
          });
          this.vitalsCollected.add('CLS');
        }
      };

      document.addEventListener('visibilitychange', this.reportCLSOnPageHide);
      window.addEventListener('pagehide', this.reportCLSOnPageHide);
    } catch (error) {
      this.logError('CLS tracking failed', error);
    }
  }

  private reportCLSOnPageHide?: () => void;

  /**
   * Track First Contentful Paint
   */
  private trackFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint' && !this.vitalsCollected.has('FCP')) {
            this.trackMetric('FCP', entry.startTime);
            this.vitalsCollected.add('FCP');
            break;
          }
        }
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.set('FCP', observer);
    } catch (error) {
      this.logError('FCP tracking failed', error);
    }
  }

  /**
   * Track Time to First Byte
   */
  private trackTTFB(): void {
    // Get TTFB from navigation timing
    if ('performance' in window && 'navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && navigation.responseStart > 0 && !this.vitalsCollected.has('TTFB')) {
        const ttfb = navigation.responseStart - navigation.fetchStart;
        this.trackMetric('TTFB', ttfb, {
          connectionType: this.getConnectionType(),
          protocol: location.protocol,
        });
        this.vitalsCollected.add('TTFB');
      }
    }
  }

  /**
   * Track navigation timing metrics
   */
  private trackNavigationTiming(): void {
    if (!('performance' in window) || !('navigation' in performance)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    // Calculate timing metrics
    const timings = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      connect: navigation.connectEnd - navigation.connectStart,
      ssl: navigation.secureConnectionStart > 0 
        ? navigation.connectEnd - navigation.secureConnectionStart 
        : 0,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      domParsing: navigation.domContentLoadedEventStart - navigation.responseEnd,
      domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      resourceLoading: navigation.loadEventStart - navigation.domContentLoadedEventEnd,
      pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart,
    };

    // Track individual timing metrics
    Object.entries(timings).forEach(([metric, value]) => {
      if (value >= 0) {
        this.trackMetric(`navigation_${metric}`, value, {
          navigationType: this.getNavigationType(navigation.type),
          redirectCount: navigation.redirectCount,
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize,
          decodedBodySize: navigation.decodedBodySize,
        });
      }
    });

    // Calculate derived metrics
    const pageLoadTime = timings.total;
    const domReadyTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    const timeToInteractive = this.estimateTimeToInteractive(navigation);

    this.trackMetric('page_load_time', pageLoadTime);
    this.trackMetric('dom_ready_time', domReadyTime);
    
    if (timeToInteractive > 0) {
      this.trackMetric('time_to_interactive', timeToInteractive);
    }
  }

  /**
   * Track resource timing
   */
  private trackResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          this.analyzeResourceTiming(resource);
        }
      });

      observer.observe({ type: 'resource', buffered: true });
      this.observers.set('resource', observer);
    } catch (error) {
      this.logError('Resource timing tracking failed', error);
    }
  }

  /**
   * Analyze individual resource timing
   */
  private analyzeResourceTiming(resource: PerformanceResourceTiming): void {
    const duration = resource.responseEnd - resource.requestStart;
    const resourceType = this.getResourceType(resource.name);
    
    // Track slow resources
    const threshold = this.thresholds.resourceLoad.good;
    if (duration > threshold) {
      this.trackMetric('slow_resource', duration, {
        resourceType,
        resourceUrl: this.sanitizeUrl(resource.name),
        transferSize: resource.transferSize,
        encodedBodySize: resource.encodedBodySize,
        cacheHit: resource.transferSize === 0 && resource.encodedBodySize > 0,
      });
    }

    // Aggregate resource metrics by type
    this.aggregateResourceMetrics(resourceType, {
      duration,
      transferSize: resource.transferSize,
      encodedBodySize: resource.encodedBodySize,
    });
  }

  /**
   * Track memory usage
   */
  private trackMemoryUsage(): void {
    // @ts-ignore - memory API is experimental
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      this.trackMetric('memory_used', memory.usedJSHeapSize, {
        totalHeapSize: memory.totalJSHeapSize,
        heapSizeLimit: memory.jsHeapSizeLimit,
        utilization: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
        unit: 'bytes',
      });
    }
  }

  /**
   * Track network information
   */
  private trackNetworkInfo(): void {
    // @ts-ignore - connection API is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      this.trackMetric('network_info', 0, {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
        connectionType: connection.type,
      });
    }
  }

  /**
   * Setup periodic performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor performance every 30 seconds
    setInterval(() => {
      this.checkPerformanceHealth();
    }, 30000);

    // Monitor on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkPerformanceHealth();
      }
    });
  }

  /**
   * Check overall performance health
   */
  private checkPerformanceHealth(): void {
    const metrics = {
      frameRate: this.measureFrameRate(),
      memoryPressure: this.checkMemoryPressure(),
      longTasks: this.countLongTasks(),
    };

    this.trackMetric('performance_health', 0, {
      frameRate: metrics.frameRate,
      memoryPressure: metrics.memoryPressure,
      longTasks: metrics.longTasks,
      timestamp: Date.now(),
    });
  }

  /**
   * Measure current frame rate
   */
  private measureFrameRate(): number {
    let frames = 0;
    const startTime = performance.now();
    
    const countFrames = () => {
      frames++;
      const elapsed = performance.now() - startTime;
      
      if (elapsed < 1000) {
        requestAnimationFrame(countFrames);
      }
    };
    
    requestAnimationFrame(countFrames);
    return frames; // Approximate FPS
  }

  /**
   * Check memory pressure
   */
  private checkMemoryPressure(): number {
    // @ts-ignore - memory API is experimental
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }
    return 0;
  }

  /**
   * Count long tasks
   */
  private countLongTasks(): number {
    // This would be accumulated from long task observer
    return this.metrics.get('longTaskCount') || 0;
  }

  /**
   * Track a performance metric
   */
  private trackMetric(
    metric: string, 
    value: number, 
    additionalProperties?: Record<string, any>
  ): void {
    const performanceEvent: PerformanceEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'performance',
      action: 'timing',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        metric,
        value,
        unit: 'ms',
        rating: this.getRating(metric, value),
        ...additionalProperties,
      },
    };

    // Store metric for aggregation
    this.metrics.set(metric, value);

    // Emit event
    this.emitEvent(performanceEvent);
    
    this.logMetric(metric, value, performanceEvent.properties.rating);
  }

  /**
   * Get performance rating (good/needs improvement/poor)
   */
  private getRating(metric: string, value: number): string {
    const threshold = this.thresholds[metric as keyof typeof this.thresholds];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get navigation type
   */
  private getNavigationType(type: number): string {
    const types = ['navigate', 'reload', 'back_forward', 'prerender'];
    return types[type] || 'unknown';
  }

  /**
   * Get connection type
   */
  private getConnectionType(): string {
    // @ts-ignore - connection API is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || 'unknown';
  }

  /**
   * Estimate Time to Interactive
   */
  private estimateTimeToInteractive(navigation: PerformanceNavigationTiming): number {
    // Simplified TTI estimation based on DOM ready + resource loading
    const domReady = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    const resourcesLoaded = navigation.loadEventEnd - navigation.domContentLoadedEventEnd;
    
    // TTI is typically when DOM is ready and no long tasks are running
    return domReady + (resourcesLoaded * 0.5); // Rough estimation
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (!extension) return 'unknown';
    
    if (['js', 'mjs'].includes(extension)) return 'script';
    if (['css'].includes(extension)) return 'stylesheet';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'].includes(extension)) return 'image';
    if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) return 'font';
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
    if (['json', 'xml'].includes(extension)) return 'data';
    
    return 'other';
  }

  /**
   * Sanitize URL for privacy
   */
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove query parameters and hash
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Aggregate resource metrics by type
   */
  private aggregateResourceMetrics(
    resourceType: string, 
    metrics: { duration: number; transferSize: number; encodedBodySize: number }
  ): void {
    const key = `resource_${resourceType}`;
    const existing = this.metrics.get(key) || { count: 0, totalDuration: 0, totalSize: 0 };
    
    this.metrics.set(key, {
      count: existing.count + 1,
      totalDuration: existing.totalDuration + metrics.duration,
      totalSize: existing.totalSize + metrics.transferSize,
      avgDuration: (existing.totalDuration + metrics.duration) / (existing.count + 1),
      avgSize: (existing.totalSize + metrics.transferSize) / (existing.count + 1),
    });
  }

  /**
   * Get current page info
   */
  private getCurrentPageInfo() {
    return {
      path: window.location.pathname,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
      language: navigator.language,
    };
  }

  /**
   * Get device info
   */
  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    return {
      type: /Mobi|Android/i.test(userAgent) ? 'mobile' as const : 
            /Tablet|iPad/i.test(userAgent) ? 'tablet' as const : 'desktop' as const,
      browser: userAgent.includes('Chrome') ? 'Chrome' : 
               userAgent.includes('Firefox') ? 'Firefox' : 
               userAgent.includes('Safari') ? 'Safari' : 'Other',
      os: userAgent.includes('Windows') ? 'Windows' : 
          userAgent.includes('Mac') ? 'macOS' : 'Other',
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    };
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Emit event to callbacks
   */
  private emitEvent(event: AnalyticsEvent): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Analytics event callback error:', error);
      }
    });
  }

  /**
   * Log performance metric
   */
  private logMetric(metric: string, value: number, rating: string): void {
    if (process.env.NODE_ENV === 'development') {
      const color = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
      console.log(`[Performance] ${color} ${metric}: ${Math.round(value)}ms (${rating})`);
    }
  }

  /**
   * Log errors
   */
  private logError(message: string, error: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Performance] ${message}:`, error);
    }
  }

  /**
   * Clean up observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    if (this.reportCLSOnPageHide) {
      document.removeEventListener('visibilitychange', this.reportCLSOnPageHide);
      window.removeEventListener('pagehide', this.reportCLSOnPageHide);
    }
  }

  /**
   * Get collected metrics summary
   */
  public getMetricsSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    this.metrics.forEach((value, key) => {
      summary[key] = value;
    });
    
    return summary;
  }
}

export default PerformanceTracker;