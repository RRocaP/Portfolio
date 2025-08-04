import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '') {
    await this.page.goto(path);
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle') {
    await this.page.waitForLoadState(state);
  }

  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async waitForAnimation() {
    // Wait for CSS animations to complete
    await this.page.waitForTimeout(300);
  }

  async disableAnimations() {
    // Disable CSS animations for consistent testing
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `
    });
  }

  async checkResponsiveness(selector: string, breakpoints = [320, 768, 1024, 1200]) {
    const results = [];
    
    for (const width of breakpoints) {
      await this.page.setViewportSize({ width, height: 800 });
      await this.waitForAnimation();
      
      const element = this.page.locator(selector);
      const isVisible = await element.isVisible();
      const boundingBox = await element.boundingBox();
      
      results.push({
        width,
        isVisible,
        boundingBox
      });
    }
    
    return results;
  }

  async takeScreenshot(name: string, options?: any) {
    return await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
      ...options
    });
  }

  async checkExternalLinks(selector: string) {
    const links = await this.page.locator(selector).all();
    const results = [];

    for (const link of links) {
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');

      if (href && href.startsWith('http')) {
        results.push({
          href,
          target,
          rel,
          hasNoopener: rel?.includes('noopener'),
          hasNoreferrer: rel?.includes('noreferrer'),
          opensInNewTab: target === '_blank'
        });
      }
    }

    return results;
  }

  async measureLoadTime(): Promise<number> {
    const navigationTiming = await this.page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    });

    return navigationTiming.loadEventEnd - navigationTiming.fetchStart;
  }

  async measureCoreWebVitals() {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          lcp: 0,
          fid: 0,
          cls: 0
        };

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            vitals.fid = entry.processingStart - entry.startTime;
          }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              vitals.cls += entry.value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });

        // Return metrics after a short delay to capture measurements
        setTimeout(() => resolve(vitals), 3000);
      });
    });
  }
}