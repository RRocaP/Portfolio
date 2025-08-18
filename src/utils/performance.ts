/**
 * Enhanced Performance Monitor
 * Comprehensive performance tracking for portfolio site
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  
  // Navigation Timing
  domContentLoaded?: number;
  loadComplete?: number;
  
  // Resource Performance
  resourceCount?: number;
  transferSize?: number;
  
  // Custom Metrics
  timeToInteractive?: number;
  firstPaint?: number;
  
  // Context
  timestamp: number;
  url: string;
  userAgent: string;
  viewport: { width: number; height: number };
  connection?: {
    effectiveType?: string;
    downlink?: number;
  };
}

export interface PerformanceBudget {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  transferSize: number;
  resourceCount: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private budget: PerformanceBudget;
  private observers: Map<string, PerformanceObserver> = new Map();
  private isInitialized = false;

  constructor(budget?: Partial<PerformanceBudget>) {
    this.budget = {
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1 score
      fcp: 1800, // 1.8s
      ttfb: 800, // 800ms
      transferSize: 1024 * 1024, // 1MB
      resourceCount: 50,
      ...budget
    };
  }

  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.isInitialized = true;
    this.setupWebVitalsTracking();
    this.setupNavigationTracking();
    this.setupResourceTracking();
    this.setupCustomMetrics();
    this.scheduleReporting();
  }

  private setupWebVitalsTracking(): void {
    // Use web-vitals library if available
    const webVitals = (window as any)['web-vitals'];
    if (webVitals) {
      const { onLCP, onFID, onCLS, onFCP, onTTFB } = webVitals;
      
      onLCP((metric: any) => this.recordMetric('lcp', metric.value));
      onFID((metric: any) => this.recordMetric('fid', metric.value));
      onCLS((metric: any) => this.recordMetric('cls', metric.value));
      onFCP((metric: any) => this.recordMetric('fcp', metric.value));
      onTTFB((metric: any) => this.recordMetric('ttfb', metric.value));
    }
  }

  private setupNavigationTracking(): void {
    window.addEventListener('load', () => {
      requestIdleCallback(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (nav) {
          this.recordMetric('domContentLoaded', nav.domContentLoadedEventEnd);
          this.recordMetric('loadComplete', nav.loadEventEnd);
          this.recordMetric('transferSize', nav.transferSize);
        }
      });
    });
  }

  private setupResourceTracking(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.recordMetric('resourceCount', entries.length);
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }
  }

  private setupCustomMetrics(): void {
    // Time to Interactive approximation
    window.addEventListener('load', () => {
      let lastLongTask = 0;
      
      if ('PerformanceObserver' in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            lastLongTask = entries[entries.length - 1].startTime + entries[entries.length - 1].duration;
          }
        });
        
        try {
          longTaskObserver.observe({ entryTypes: ['longtask'] });
          this.observers.set('longtask', longTaskObserver);
        } catch (e) {
          // Long task API not supported
        }
      }

      // Estimate TTI as 5 seconds after last long task
      setTimeout(() => {
        const tti = Math.max(lastLongTask + 5000, performance.now());
        this.recordMetric('timeToInteractive', tti);
      }, 10000);
    });

    // First Paint
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.name === 'first-paint') {
              this.recordMetric('firstPaint', entry.startTime);
            }
          }
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
      } catch (e) {
        // Paint API not supported
      }
    }
  }

  private recordMetric(key: keyof PerformanceMetrics, value: number): void {
    const currentMetric = this.getCurrentMetric();
    (currentMetric as any)[key] = value;
    
    // Check budget compliance
    this.checkBudgetCompliance(key, value);
  }

  private getCurrentMetric(): PerformanceMetrics {
    if (this.metrics.length === 0 || this.isMetricComplete(this.metrics[this.metrics.length - 1])) {
      this.metrics.push(this.createBaseMetric());
    }
    return this.metrics[this.metrics.length - 1];
  }

  private createBaseMetric(): PerformanceMetrics {
    const connection = (navigator as any).connection;
    
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink
      } : undefined
    };
  }

  private isMetricComplete(metric: PerformanceMetrics): boolean {
    return !!(metric.lcp && metric.fcp && metric.ttfb);
  }

  private checkBudgetCompliance(key: keyof PerformanceMetrics, value: number): void {
    const budgetValue = (this.budget as any)[key];
    if (budgetValue && value > budgetValue) {
      console.warn(`Performance budget exceeded for ${key}: ${value} > ${budgetValue}`);
      
      // Dispatch custom event for budget violations
      window.dispatchEvent(new CustomEvent('performance-budget-exceeded', {
        detail: { metric: key, value, budget: budgetValue }
      }));
    }
  }

  private scheduleReporting(): void {
    // Report metrics periodically
    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Every 30 seconds

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics(true);
    });

    // Report on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics(true);
      }
    });
  }

  private reportMetrics(force = false): void {
    const metricsToReport = this.metrics.filter(m => this.isMetricComplete(m));
    if (metricsToReport.length === 0 && !force) return;

    // Send to analytics if available
    if ((window as any).gtag) {
      metricsToReport.forEach(metric => {
        (window as any).gtag('event', 'performance_metrics', {
          custom_map: {
            dimension1: metric.lcp,
            dimension2: metric.fid,
            dimension3: metric.cls,
            dimension4: metric.fcp,
            dimension5: metric.ttfb
          }
        });
      });
    }

    // Store in localStorage for development
    if (typeof localStorage !== 'undefined') {
      const existingMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
      const newMetrics = [...existingMetrics, ...metricsToReport].slice(-50); // Keep last 50
      localStorage.setItem('performanceMetrics', JSON.stringify(newMetrics));
    }

    // Send to reporting endpoint if configured
    this.sendToReportingEndpoint(metricsToReport);

    // Clear reported metrics
    this.metrics = this.metrics.filter(m => !this.isMetricComplete(m));
  }

  private sendToReportingEndpoint(metrics: PerformanceMetrics[]): void {
    const reportingUrl = (window as any).PERFORMANCE_REPORTING_URL;
    if (!reportingUrl || metrics.length === 0) return;

    if ('sendBeacon' in navigator) {
      navigator.sendBeacon(reportingUrl, JSON.stringify(metrics));
    } else {
      fetch(reportingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
        keepalive: true
      }).catch(() => {}); // Silent fail
    }
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getBudgetStatus(): Record<string, { current?: number; budget: number; passed: boolean }> {
    const currentMetric = this.getCurrentMetric();
    const status: Record<string, { current?: number; budget: number; passed: boolean }> = {};

    for (const [key, budgetValue] of Object.entries(this.budget)) {
      const currentValue = (currentMetric as any)[key];
      status[key] = {
        current: currentValue,
        budget: budgetValue,
        passed: currentValue ? currentValue <= budgetValue : true
      };
    }

    return status;
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.isInitialized = false;
  }
}

// Global performance monitor instance
let globalMonitor: PerformanceMonitor | null = null;

export function initPerformanceMonitor(budget?: Partial<PerformanceBudget>): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor(budget);
    globalMonitor.init();
  }
  return globalMonitor;
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return globalMonitor;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initPerformanceMonitor();
  });
}