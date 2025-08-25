/**
 * Performance and Accessibility Validator
 * Tests Core Web Vitals, WCAG compliance, and UX metrics
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  
  // Additional Performance Metrics
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  
  // UX Metrics
  touchTargetCompliance: number; // Percentage of compliant touch targets
  accessibilityScore: number; // WCAG compliance score
  
  // Performance Score
  overallScore: number;
}

export interface AccessibilityIssue {
  level: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  fix?: string;
}

export class PerformanceValidator {
  private observer: PerformanceObserver | null = null;
  private metrics: Partial<PerformanceMetrics> = {};
  private accessibilityIssues: AccessibilityIssue[] = [];
  
  constructor() {
    this.initPerformanceObserver();
    this.measureCoreWebVitals();
  }
  
  private initPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              this.metrics.lcp = entry.startTime;
              break;
            case 'first-input':
              this.metrics.fid = (entry as any).processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                this.metrics.cls = (this.metrics.cls || 0) + (entry as any).value;
              }
              break;
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                this.metrics.fcp = entry.startTime;
              }
              break;
            case 'navigation':
              const navEntry = entry as PerformanceNavigationTiming;
              this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
              break;
          }
        });
      });
      
      // Observe Core Web Vitals
      try {
        this.observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observer.observe({ entryTypes: ['first-input'] });
        this.observer.observe({ entryTypes: ['layout-shift'] });
        this.observer.observe({ entryTypes: ['paint'] });
        this.observer.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }
  
  private measureCoreWebVitals() {
    // Web Vitals library integration (if available)
    if (typeof (window as any).webVitals !== 'undefined') {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = (window as any).webVitals;
      
      getCLS((metric: any) => {
        this.metrics.cls = metric.value;
      });
      
      getFID((metric: any) => {
        this.metrics.fid = metric.value;
      });
      
      getFCP((metric: any) => {
        this.metrics.fcp = metric.value;
      });
      
      getLCP((metric: any) => {
        this.metrics.lcp = metric.value;
      });
      
      getTTFB((metric: any) => {
        this.metrics.ttfb = metric.value;
      });
    }
  }
  
  public async validateTouchTargets(): Promise<number> {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), .magnetic-button, .hover-card'
    );
    
    let compliantTargets = 0;
    const totalTargets = interactiveElements.length;
    
    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const minSize = window.innerWidth <= 768 ? 48 : 44; // Larger on mobile
      
      if (rect.width >= minSize && rect.height >= minSize) {
        compliantTargets++;
      } else {
        this.accessibilityIssues.push({
          level: 'warning',
          message: `Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (minimum: ${minSize}x${minSize}px)`,
          element: element as HTMLElement,
          fix: `Add min-width: ${minSize}px; min-height: ${minSize}px; to the element`
        });
      }
    });
    
    const compliance = totalTargets > 0 ? (compliantTargets / totalTargets) * 100 : 100;
    this.metrics.touchTargetCompliance = compliance;
    
    return compliance;
  }
  
  public async validateAccessibility(): Promise<number> {
    let score = 100;
    this.accessibilityIssues = [];
    
    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.hasAttribute('aria-label') && !img.hasAttribute('aria-labelledby')) {
        this.accessibilityIssues.push({
          level: 'error',
          message: 'Image missing alt text',
          element: img,
          fix: 'Add descriptive alt text or aria-label attribute'
        });
        score -= 5;
      }
    });
    
    // Check for proper heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let currentLevel = 0;
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1]);
      
      if (level > currentLevel + 1) {
        this.accessibilityIssues.push({
          level: 'warning',
          message: `Heading hierarchy skipped: ${heading.tagName} follows h${currentLevel}`,
          element: heading as HTMLElement,
          fix: 'Use proper heading hierarchy (h1 > h2 > h3, etc.)'
        });
        score -= 3;
      }
      
      currentLevel = level;
    });
    
    // Check for color contrast (simplified)
    const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
    let contrastIssues = 0;
    
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;
      
      // Simple contrast check (would need more sophisticated implementation)
      if (this.isLowContrast(color, backgroundColor)) {
        contrastIssues++;
        if (contrastIssues <= 5) { // Limit reported issues
          this.accessibilityIssues.push({
            level: 'warning',
            message: 'Potential low color contrast',
            element: element as HTMLElement,
            fix: 'Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text'
          });
        }
      }
    });
    
    score -= Math.min(contrastIssues * 2, 20); // Max 20 point deduction
    
    // Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    let keyboardIssues = 0;
    
    interactiveElements.forEach((element) => {
      const tabIndex = element.getAttribute('tabindex');
      
      if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
        keyboardIssues++;
        this.accessibilityIssues.push({
          level: 'error',
          message: 'Interactive element not keyboard accessible',
          element: element as HTMLElement,
          fix: 'Remove tabindex="-1" or add proper keyboard event handlers'
        });
      }
    });
    
    score -= keyboardIssues * 5;
    
    // Check for form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      const hasLabel = input.hasAttribute('aria-label') || 
                      input.hasAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`);
      
      if (!hasLabel && input.type !== 'hidden') {
        this.accessibilityIssues.push({
          level: 'error',
          message: 'Form input missing label',
          element: input as HTMLElement,
          fix: 'Add <label> element or aria-label attribute'
        });
        score -= 5;
      }
    });
    
    // Check for ARIA landmarks
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
    if (landmarks.length === 0) {
      this.accessibilityIssues.push({
        level: 'warning',
        message: 'No ARIA landmarks found',
        fix: 'Add semantic HTML elements (main, nav, header, footer) or ARIA landmark roles'
      });
      score -= 5;
    }
    
    this.metrics.accessibilityScore = Math.max(0, score);
    return this.metrics.accessibilityScore;
  }
  
  private isLowContrast(foreground: string, background: string): boolean {
    // Simplified contrast check - would need proper implementation
    // This is a placeholder for demonstration
    if (foreground === 'rgb(255, 255, 255)' && background === 'rgba(0, 0, 0, 0)') {
      return true;
    }
    return false;
  }
  
  public async validatePerformance(): Promise<number> {
    // Wait for metrics to be collected
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let score = 100;
    
    // LCP scoring (Good: <2.5s, Needs Improvement: 2.5s-4s, Poor: >4s)
    if (this.metrics.lcp) {
      if (this.metrics.lcp > 4000) {
        score -= 30;
      } else if (this.metrics.lcp > 2500) {
        score -= 15;
      }
    }
    
    // FID scoring (Good: <100ms, Needs Improvement: 100ms-300ms, Poor: >300ms)
    if (this.metrics.fid) {
      if (this.metrics.fid > 300) {
        score -= 25;
      } else if (this.metrics.fid > 100) {
        score -= 10;
      }
    }
    
    // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
    if (this.metrics.cls) {
      if (this.metrics.cls > 0.25) {
        score -= 25;
      } else if (this.metrics.cls > 0.1) {
        score -= 10;
      }
    }
    
    // FCP scoring (Good: <1.8s, Needs Improvement: 1.8s-3s, Poor: >3s)
    if (this.metrics.fcp) {
      if (this.metrics.fcp > 3000) {
        score -= 15;
      } else if (this.metrics.fcp > 1800) {
        score -= 8;
      }
    }
    
    // TTFB scoring (Good: <800ms, Poor: >1800ms)
    if (this.metrics.ttfb) {
      if (this.metrics.ttfb > 1800) {
        score -= 10;
      }
    }
    
    return Math.max(0, score);
  }
  
  public async generateReport(): Promise<PerformanceMetrics> {
    const [touchTargetCompliance, accessibilityScore, performanceScore] = await Promise.all([
      this.validateTouchTargets(),
      this.validateAccessibility(),
      this.validatePerformance()
    ]);
    
    const overallScore = Math.round(
      (performanceScore * 0.4 + accessibilityScore * 0.4 + touchTargetCompliance * 0.2)
    );
    
    const report: PerformanceMetrics = {
      lcp: this.metrics.lcp || null,
      fid: this.metrics.fid || null,
      cls: this.metrics.cls || null,
      fcp: this.metrics.fcp || null,
      ttfb: this.metrics.ttfb || null,
      touchTargetCompliance,
      accessibilityScore,
      overallScore
    };
    
    return report;
  }
  
  public getAccessibilityIssues(): AccessibilityIssue[] {
    return this.accessibilityIssues;
  }
  
  public async runContinuousMonitoring(interval: number = 30000) {
    const monitor = async () => {
      const report = await this.generateReport();
      
      // Log critical issues
      if (report.overallScore < 80) {
        console.warn('Performance/Accessibility issues detected:', report);
      }
      
      // Dispatch custom event with results
      document.dispatchEvent(new CustomEvent('performance-report', {
        detail: report
      }));
      
      // Schedule next check
      setTimeout(monitor, interval);
    };
    
    // Start monitoring after initial load
    setTimeout(monitor, 5000);
  }
  
  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Web Vitals integration helper
export const initWebVitalsTracking = () => {
  if (typeof (window as any).webVitals === 'undefined') {
    // Fallback implementation for basic metrics
    (window as any).webVitals = {
      getCLS: (callback: Function) => {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value;
              callback({ value: cls });
            }
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      },
      
      getFID: (callback: Function) => {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            const fid = entry.processingStart - entry.startTime;
            callback({ value: fid });
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
      },
      
      getFCP: (callback: Function) => {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              callback({ value: entry.startTime });
            }
          });
        });
        observer.observe({ entryTypes: ['paint'] });
      },
      
      getLCP: (callback: Function) => {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            callback({ value: entry.startTime });
          });
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      },
      
      getTTFB: (callback: Function) => {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            const ttfb = entry.responseStart - entry.requestStart;
            callback({ value: ttfb });
          });
        });
        observer.observe({ entryTypes: ['navigation'] });
      }
    };
  }
};

// Global performance validator instance
let globalValidator: PerformanceValidator | null = null;

export const getPerformanceValidator = (): PerformanceValidator => {
  if (!globalValidator) {
    initWebVitalsTracking();
    globalValidator = new PerformanceValidator();
  }
  return globalValidator;
};

// Auto-initialize in production for monitoring
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  document.addEventListener('DOMContentLoaded', () => {
    const validator = getPerformanceValidator();
    validator.runContinuousMonitoring();
  });
}