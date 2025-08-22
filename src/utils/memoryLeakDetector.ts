// Memory Leak Detection Utility for React Components
// Helps identify and prevent common memory leaks in the portfolio

interface ComponentMemoryTracker {
  componentName: string;
  mountTime: number;
  eventListeners: EventListener[];
  timeouts: number[];
  intervals: number[];
  observerInstances: (ResizeObserver | IntersectionObserver | MutationObserver)[];
}

class MemoryLeakDetector {
  private static instance: MemoryLeakDetector;
  private componentTrackers = new Map<string, ComponentMemoryTracker>();
  private performanceMetrics: PerformanceEntry[] = [];

  static getInstance(): MemoryLeakDetector {
    if (!MemoryLeakDetector.instance) {
      MemoryLeakDetector.instance = new MemoryLeakDetector();
    }
    return MemoryLeakDetector.instance;
  }

  // Track component mount
  trackComponentMount(componentName: string): string {
    const trackerId = `${componentName}-${Date.now()}-${Math.random()}`;
    
    this.componentTrackers.set(trackerId, {
      componentName,
      mountTime: Date.now(),
      eventListeners: [],
      timeouts: [],
      intervals: [],
      observerInstances: []
    });

    return trackerId;
  }

  // Track event listener addition
  trackEventListener(trackerId: string, listener: EventListener): void {
    const tracker = this.componentTrackers.get(trackerId);
    if (tracker) {
      tracker.eventListeners.push(listener);
    }
  }

  // Track timeout creation
  trackTimeout(trackerId: string, timeoutId: number): void {
    const tracker = this.componentTrackers.get(trackerId);
    if (tracker) {
      tracker.timeouts.push(timeoutId);
    }
  }

  // Track interval creation
  trackInterval(trackerId: string, intervalId: number): void {
    const tracker = this.componentTrackers.get(trackerId);
    if (tracker) {
      tracker.intervals.push(intervalId);
    }
  }

  // Track observer instances
  trackObserver(trackerId: string, observer: ResizeObserver | IntersectionObserver | MutationObserver): void {
    const tracker = this.componentTrackers.get(trackerId);
    if (tracker) {
      tracker.observerInstances.push(observer);
    }
  }

  // Clean up component resources
  cleanupComponent(trackerId: string): void {
    const tracker = this.componentTrackers.get(trackerId);
    if (!tracker) return;

    // Clear timeouts
    tracker.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    
    // Clear intervals
    tracker.intervals.forEach(intervalId => clearInterval(intervalId));
    
    // Disconnect observers
    tracker.observerInstances.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting observer:', error);
      }
    });

    // Remove tracker
    this.componentTrackers.delete(trackerId);
  }

  // Get memory usage report
  getMemoryReport(): object {
    const report = {
      timestamp: new Date().toISOString(),
      totalTrackedComponents: this.componentTrackers.size,
      components: [] as any[],
      memoryUsage: this.getMemoryUsage(),
      recommendations: [] as string[]
    };

    this.componentTrackers.forEach((tracker, trackerId) => {
      const componentReport = {
        trackerId,
        componentName: tracker.componentName,
        mountDuration: Date.now() - tracker.mountTime,
        eventListenerCount: tracker.eventListeners.length,
        activeTimeouts: tracker.timeouts.length,
        activeIntervals: tracker.intervals.length,
        activeObservers: tracker.observerInstances.length
      };

      report.components.push(componentReport);

      // Generate recommendations
      if (componentReport.eventListenerCount > 10) {
        report.recommendations.push(`${tracker.componentName}: High number of event listeners (${componentReport.eventListenerCount})`);
      }
      
      if (componentReport.activeTimeouts > 5) {
        report.recommendations.push(`${tracker.componentName}: Many active timeouts (${componentReport.activeTimeouts})`);
      }
      
      if (componentReport.mountDuration > 60000 && componentReport.activeIntervals > 0) {
        report.recommendations.push(`${tracker.componentName}: Long-lived component with active intervals`);
      }
    });

    return report;
  }

  // Get browser memory usage (if available)
  private getMemoryUsage(): object {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        memoryPressure: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      };
    }
    return { available: false };
  }

  // Monitor performance entries
  monitorPerformance(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        this.performanceMetrics.push(...list.getEntries());
        
        // Keep only recent entries (last 100)
        if (this.performanceMetrics.length > 100) {
          this.performanceMetrics = this.performanceMetrics.slice(-100);
        }
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    }
  }

  // Detect potential memory leaks
  detectLeaks(): string[] {
    const leaks: string[] = [];
    const now = Date.now();

    this.componentTrackers.forEach((tracker, trackerId) => {
      const age = now - tracker.mountTime;
      
      // Component mounted for more than 5 minutes with many resources
      if (age > 300000) { // 5 minutes
        if (tracker.eventListeners.length > 20) {
          leaks.push(`${tracker.componentName}: Potential memory leak - too many event listeners`);
        }
        
        if (tracker.timeouts.length > 10) {
          leaks.push(`${tracker.componentName}: Potential memory leak - many uncleaned timeouts`);
        }
        
        if (tracker.intervals.length > 3) {
          leaks.push(`${tracker.componentName}: Potential memory leak - multiple intervals running`);
        }
      }
    });

    return leaks;
  }
}

// React Hook for memory leak detection
export function useMemoryLeakDetector(componentName: string) {
  const detector = MemoryLeakDetector.getInstance();
  const trackerIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    trackerIdRef.current = detector.trackComponentMount(componentName);
    
    return () => {
      if (trackerIdRef.current) {
        detector.cleanupComponent(trackerIdRef.current);
      }
    };
  }, [componentName]);

  const trackEventListener = React.useCallback((listener: EventListener) => {
    if (trackerIdRef.current) {
      detector.trackEventListener(trackerIdRef.current, listener);
    }
  }, []);

  const trackTimeout = React.useCallback((timeoutId: number) => {
    if (trackerIdRef.current) {
      detector.trackTimeout(trackerIdRef.current, timeoutId);
    }
  }, []);

  const trackInterval = React.useCallback((intervalId: number) => {
    if (trackerIdRef.current) {
      detector.trackInterval(trackerIdRef.current, intervalId);
    }
  }, []);

  const trackObserver = React.useCallback((observer: ResizeObserver | IntersectionObserver | MutationObserver) => {
    if (trackerIdRef.current) {
      detector.trackObserver(trackerIdRef.current, observer);
    }
  }, []);

  return {
    trackEventListener,
    trackTimeout,
    trackInterval,
    trackObserver
  };
}

// Global memory monitoring
export function initMemoryMonitoring(): void {
  const detector = MemoryLeakDetector.getInstance();
  detector.monitorPerformance();

  // Check for leaks every 2 minutes
  setInterval(() => {
    const leaks = detector.detectLeaks();
    if (leaks.length > 0) {
      console.warn('Potential memory leaks detected:', leaks);
      
      // In development, also log the full memory report
      if (process.env.NODE_ENV === 'development') {
        console.log('Memory Report:', detector.getMemoryReport());
      }
    }
  }, 120000);

  // Log memory usage every 5 minutes in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      console.log('Memory Report:', detector.getMemoryReport());
    }, 300000);
  }
}

export default MemoryLeakDetector;