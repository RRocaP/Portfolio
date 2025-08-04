import { Page, expect } from '@playwright/test';

export class TestHelpers {
  static async waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async disableAnimations(page: Page): Promise<void> {
    await page.addStyleTag({
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

  static async enableAnimations(page: Page): Promise<void> {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: unset !important;
          animation-delay: unset !important;
          transition-duration: unset !important;
          transition-delay: unset !important;
          scroll-behavior: unset !important;
        }
      `
    });
  }

  static async checkConsoleErrors(page: Page): Promise<string[]> {
    return new Promise((resolve) => {
      const errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
      });
      
      setTimeout(() => resolve(errors), 1000);
    });
  }

  static async measurePerformance(page: Page): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
  }> {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
  }

  static async simulateSlowNetwork(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500kb/s
      uploadThroughput: 500 * 1024 / 8,
      latency: 400
    });
  }

  static async resetNetwork(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0
    });
  }

  static async takeFullPageScreenshot(page: Page, name: string): Promise<Buffer> {
    return await page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    });
  }

  static async scrollToElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Wait for scroll animation
  }

  static async checkElementVisibility(page: Page, selectors: string[]): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};
    
    for (const selector of selectors) {
      try {
        const element = page.locator(selector).first();
        results[selector] = await element.isVisible();
      } catch {
        results[selector] = false;
      }
    }
    
    return results;
  }

  static async waitForElement(page: Page, selector: string, timeout = 10000): Promise<void> {
    await page.waitForSelector(selector, { timeout, state: 'visible' });
  }

  static async getElementBoundingBox(page: Page, selector: string): Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null> {
    return await page.locator(selector).first().boundingBox();
  }

  static async checkResponsiveLayout(page: Page, breakpoints: number[] = [320, 768, 1024, 1440]): Promise<{
    breakpoint: number;
    width: number;
    height: number;
    isResponsive: boolean;
  }[]> {
    const results = [];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint, height: 800 });
      await page.waitForTimeout(500);
      
      const viewport = page.viewportSize();
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      
      results.push({
        breakpoint,
        width: viewport?.width || 0,
        height: viewport?.height || 0,
        isResponsive: bodyWidth <= breakpoint + 20 // Allow small margins
      });
    }
    
    return results;
  }

  static async checkExternalLinks(page: Page): Promise<{
    url: string;
    status: number | null;
    hasTargetBlank: boolean;
    hasNoopener: boolean;
  }[]> {
    const links = await page.locator('a[href^="http"]').all();
    const results = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      
      if (href) {
        // Check if link opens in new tab and has security attributes
        results.push({
          url: href,
          status: null, // Would need separate HTTP request to check
          hasTargetBlank: target === '_blank',
          hasNoopener: rel?.includes('noopener') || false
        });
      }
    }
    
    return results;
  }

  static async simulateUserJourney(page: Page, actions: Array<() => Promise<void>>): Promise<{
    totalTime: number;
    actionTimes: number[];
  }> {
    const actionTimes: number[] = [];
    const startTime = Date.now();
    
    for (const action of actions) {
      const actionStart = Date.now();
      await action();
      const actionTime = Date.now() - actionStart;
      actionTimes.push(actionTime);
    }
    
    const totalTime = Date.now() - startTime;
    
    return { totalTime, actionTimes };
  }

  static async checkA11yViolations(page: Page): Promise<any[]> {
    // This would integrate with axe-core
    try {
      const AxeBuilder = require('@axe-core/playwright');
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      return accessibilityScanResults.violations;
    } catch (error) {
      console.warn('Axe-core not available for accessibility testing');
      return [];
    }
  }

  static async mockAPI(page: Page, endpoint: string, response: any): Promise<void> {
    await page.route(endpoint, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  static async clearBrowserData(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Clear cookies
    const context = page.context();
    await context.clearCookies();
  }

  static generateTestData(type: 'email' | 'name' | 'text', length = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    
    switch (type) {
      case 'email':
        return `test${Math.random().toString(36).substring(7)}@example.com`;
      case 'name':
        return chars.charAt(Math.floor(Math.random() * chars.length)).toUpperCase() + 
               Array.from({ length: length - 1 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
      case 'text':
        return Array.from({ length }, () => 
          chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
      default:
        return 'test-data';
    }
  }
}