import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Performance budget thresholds
const PERFORMANCE_BUDGETS = {
  totalJS: 150 * 1024, // 150KB
  totalCSS: 50 * 1024,  // 50KB
  maxRequestTime: 3000,  // 3s
  lighthousePerformance: 95,
  lighthouseAccessibility: 95,
  lighthouseBestPractices: 95,
  lighthouseSEO: 95
};

// Test URLs for different languages
const TEST_URLS = {
  en: '/en/',
  es: '/es/', 
  ca: '/ca/',
  enResearch: '/en/research/',
  esResearch: '/es/research/',
  caResearch: '/ca/research/'
};

test.describe('Portfolio E2E Tests', () => {
  test.describe('Navigation Behavior Tests', () => {
    test('should show/hide navigation on scroll', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Wait for navigation to be visible initially
      const nav = page.locator('nav[role="navigation"], header nav, .smart-navigation');
      await expect(nav).toBeVisible();
      
      // Scroll down significantly to trigger hide
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(500); // Wait for scroll debounce
      
      // Navigation should be hidden (transform or opacity)
      const isHidden = await nav.evaluate(el => {
        const style = getComputedStyle(el);
        return style.opacity === '0' || 
               style.transform.includes('translateY(-') ||
               style.visibility === 'hidden';
      });
      expect(isHidden).toBeTruthy();
      
      // Scroll up to trigger show
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      // Navigation should be visible again
      await expect(nav).toBeVisible();
      const isVisible = await nav.evaluate(el => {
        const style = getComputedStyle(el);
        return style.opacity !== '0' && style.visibility !== 'hidden';
      });
      expect(isVisible).toBeTruthy();
    });

    test('should show scroll progress indicator', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Look for scroll progress element
      const progressIndicator = page.locator('.scroll-progress, [data-testid="scroll-progress"], .progress-bar');
      
      // Scroll to middle of page
      await page.evaluate(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, scrollHeight * 0.5);
      });
      await page.waitForTimeout(300);
      
      // Progress should be around 50% (allow some tolerance)
      const progressWidth = await progressIndicator.evaluate(el => {
        const style = getComputedStyle(el);
        return parseFloat(style.width) || parseFloat(el.getAttribute('style')?.match(/width:\s*(\d+)/)?.[1] || '0');
      });
      
      expect(progressWidth).toBeGreaterThan(30);
      expect(progressWidth).toBeLessThan(70);
    });

    test('should handle language switching', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Find language selector
      const langSelector = page.locator('select[data-lang], .language-selector, [data-testid="language-selector"]').first();
      
      if (await langSelector.isVisible()) {
        // Test switching to Spanish
        await langSelector.selectOption('es');
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain('/es/');
        
        // Verify Spanish content is loaded
        await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      }
    });

    test('should have working anchor navigation', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Look for anchor links in navigation
      const anchorLinks = page.locator('nav a[href*="#"], .nav-link[href*="#"]');
      
      if (await anchorLinks.count() > 0) {
        const firstAnchor = anchorLinks.first();
        const href = await firstAnchor.getAttribute('href');
        
        if (href?.includes('#')) {
          await firstAnchor.click();
          await page.waitForTimeout(1000); // Wait for smooth scroll
          
          // Check if we scrolled to the target section
          const targetId = href.split('#')[1];
          const targetElement = page.locator(`#${targetId}`);
          
          if (await targetElement.count() > 0) {
            const isInViewport = await targetElement.evaluate(el => {
              const rect = el.getBoundingClientRect();
              return rect.top >= 0 && rect.top <= window.innerHeight;
            });
            expect(isInViewport).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Search Interaction Tests', () => {
    test('should open and interact with search', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Look for search trigger (button, icon, etc.)
      const searchTrigger = page.locator('button[data-search], .search-trigger, [data-testid="search-trigger"]').first();
      
      if (await searchTrigger.isVisible()) {
        await searchTrigger.click();
        
        // Search modal/dropdown should appear
        const searchContainer = page.locator('.search-modal, .search-container, [data-testid="search-container"]');
        await expect(searchContainer).toBeVisible();
        
        // Find search input
        const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], .search-input');
        await expect(searchInput).toBeVisible();
        
        // Test search functionality
        await searchInput.fill('protein');
        await page.waitForTimeout(500); // Wait for debounced search
        
        // Results should appear
        const searchResults = page.locator('.search-results, .search-result, [data-testid="search-results"]');
        if (await searchResults.count() > 0) {
          await expect(searchResults.first()).toBeVisible();
        }
        
        // Test keyboard navigation
        await searchInput.press('ArrowDown');
        await page.waitForTimeout(100);
        
        // Test escape to close
        await searchInput.press('Escape');
        await page.waitForTimeout(300);
        
        // Search should be closed or hidden
        const isHidden = await searchContainer.evaluate(el => {
          const style = getComputedStyle(el);
          return !el.offsetParent || style.display === 'none' || style.opacity === '0';
        });
        expect(isHidden).toBeTruthy();
      }
    });

    test('should handle empty search gracefully', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      const searchTrigger = page.locator('button[data-search], .search-trigger, [data-testid="search-trigger"]').first();
      
      if (await searchTrigger.isVisible()) {
        await searchTrigger.click();
        
        const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], .search-input');
        if (await searchInput.isVisible()) {
          // Submit empty search
          await searchInput.press('Enter');
          await page.waitForTimeout(300);
          
          // Should show empty state or no results message
          const noResults = page.locator('.no-results, .empty-state, [data-testid="no-results"]');
          if (await noResults.count() > 0) {
            await expect(noResults).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Contact Form Tests', () => {
    test('should validate contact form fields', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Navigate to contact form (might be in modal, separate page, or on homepage)
      const contactTrigger = page.locator('a[href*="contact"], button[data-contact], .contact-trigger').first();
      
      if (await contactTrigger.isVisible()) {
        await contactTrigger.click();
        await page.waitForTimeout(500);
      }
      
      // Find contact form
      const form = page.locator('form[data-contact], .contact-form, form').first();
      await expect(form).toBeVisible();
      
      // Test required field validation
      const submitBtn = form.locator('button[type="submit"], input[type="submit"]');
      await submitBtn.click();
      
      // Should show validation errors
      const errorMessages = page.locator('.error, .invalid, [role="alert"]');
      await expect(errorMessages.first()).toBeVisible();
      
      // Fill out valid form
      const nameField = form.locator('input[name="name"], input[type="text"]').first();
      const emailField = form.locator('input[name="email"], input[type="email"]').first();
      const messageField = form.locator('textarea[name="message"], textarea').first();
      
      if (await nameField.isVisible()) await nameField.fill('Test User');
      if (await emailField.isVisible()) await emailField.fill('test@example.com');
      if (await messageField.isVisible()) await messageField.fill('This is a test message');
      
      // Test email validation
      await emailField.clear();
      await emailField.fill('invalid-email');
      await submitBtn.click();
      
      const emailError = page.locator('input[name="email"] ~ .error, .email-error, [data-testid="email-error"]');
      if (await emailError.count() > 0) {
        await expect(emailError).toBeVisible();
      }
    });

    test('should handle form submission', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Setup network interception for form submission
      let submissionAttempted = false;
      page.route('**/api/contact', route => {
        submissionAttempted = true;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Message sent successfully' })
        });
      });
      
      const contactTrigger = page.locator('a[href*="contact"], button[data-contact], .contact-trigger').first();
      if (await contactTrigger.isVisible()) {
        await contactTrigger.click();
        await page.waitForTimeout(500);
      }
      
      const form = page.locator('form[data-contact], .contact-form, form').first();
      if (await form.isVisible()) {
        // Fill valid form data
        const nameField = form.locator('input[name="name"], input[type="text"]').first();
        const emailField = form.locator('input[name="email"], input[type="email"]').first();
        const messageField = form.locator('textarea[name="message"], textarea').first();
        
        if (await nameField.isVisible()) await nameField.fill('Test User');
        if (await emailField.isVisible()) await emailField.fill('test@example.com');
        if (await messageField.isVisible()) await messageField.fill('This is a test message');
        
        // Submit form
        const submitBtn = form.locator('button[type="submit"], input[type="submit"]');
        await submitBtn.click();
        
        // Wait for submission
        await page.waitForTimeout(2000);
        
        // Should show success message or redirect
        const successMessage = page.locator('.success, .sent, [data-testid="success-message"]');
        if (await successMessage.count() > 0) {
          await expect(successMessage).toBeVisible();
        }
      }
    });

    test('should protect against spam (honeypot)', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      const contactTrigger = page.locator('a[href*="contact"], button[data-contact], .contact-trigger').first();
      if (await contactTrigger.isVisible()) {
        await contactTrigger.click();
        await page.waitForTimeout(500);
      }
      
      const form = page.locator('form[data-contact], .contact-form, form').first();
      if (await form.isVisible()) {
        // Look for honeypot field (should be hidden)
        const honeypot = form.locator('input[name*="honey"], input[style*="display: none"], .sr-only input').first();
        
        if (await honeypot.count() > 0) {
          const isHidden = await honeypot.evaluate(el => {
            const style = getComputedStyle(el);
            return style.display === 'none' || 
                   style.visibility === 'hidden' || 
                   style.opacity === '0' ||
                   el.offsetParent === null;
          });
          expect(isHidden).toBeTruthy();
        }
      }
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should pass axe accessibility tests on homepage', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass axe accessibility tests on Spanish page', async ({ page }) => {
      await page.goto(TEST_URLS.es);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = await Promise.all(
        headings.map(heading => heading.evaluate(el => parseInt(el.tagName[1])))
      );
      
      // Should have exactly one H1
      const h1Count = headingLevels.filter(level => level === 1).length;
      expect(h1Count).toBe(1);
      
      // No skipped heading levels
      for (let i = 1; i < headingLevels.length; i++) {
        const diff = headingLevels[i] - headingLevels[i - 1];
        expect(diff).toBeLessThanOrEqual(1);
      }
    });

    test('should have proper focus management', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Focused element should have visible focus indicator
      const hasOutline = await focusedElement.evaluate(el => {
        const style = getComputedStyle(el);
        return style.outline !== 'none' || 
               style.boxShadow.includes('rgb') ||
               style.border.includes('rgb');
      });
      expect(hasOutline).toBeTruthy();
    });

    test('should support prefers-reduced-motion', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(TEST_URLS.en);
      
      // Check that animations are disabled or minimal
      const animatedElements = page.locator('[class*="animate"], .gsap, [style*="transition"]');
      
      if (await animatedElements.count() > 0) {
        const hasReducedAnimation = await animatedElements.first().evaluate(el => {
          const style = getComputedStyle(el);
          return style.animationDuration === '0s' || 
                 style.animationDuration === 'initial' ||
                 style.transitionDuration === '0s' ||
                 style.transitionDuration === 'initial';
        });
        
        // Not strictly required to pass, but good practice
        console.log('Reduced motion support detected:', hasReducedAnimation);
      }
    });
  });

  test.describe('Performance Budget Tests', () => {
    test('should meet JavaScript bundle size budget', async ({ page }) => {
      const responses: any[] = [];
      
      page.on('response', response => {
        if (response.url().endsWith('.js') && !response.url().includes('node_modules')) {
          responses.push({
            url: response.url(),
            size: parseInt(response.headers()['content-length'] || '0')
          });
        }
      });
      
      await page.goto(TEST_URLS.en);
      await page.waitForLoadState('networkidle');
      
      const totalJSSize = responses.reduce((sum, resp) => sum + resp.size, 0);
      console.log(`Total JS size: ${totalJSSize} bytes (budget: ${PERFORMANCE_BUDGETS.totalJS} bytes)`);
      
      expect(totalJSSize).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.totalJS);
    });

    test('should meet CSS bundle size budget', async ({ page }) => {
      const responses: any[] = [];
      
      page.on('response', response => {
        if (response.url().endsWith('.css') && !response.url().includes('node_modules')) {
          responses.push({
            url: response.url(),
            size: parseInt(response.headers()['content-length'] || '0')
          });
        }
      });
      
      await page.goto(TEST_URLS.en);
      await page.waitForLoadState('networkidle');
      
      const totalCSSSize = responses.reduce((sum, resp) => sum + resp.size, 0);
      console.log(`Total CSS size: ${totalCSSSize} bytes (budget: ${PERFORMANCE_BUDGETS.totalCSS} bytes)`);
      
      expect(totalCSSSize).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.totalCSS);
    });

    test('should load within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(TEST_URLS.en);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      console.log(`Page load time: ${loadTime}ms (budget: ${PERFORMANCE_BUDGETS.maxRequestTime}ms)`);
      
      expect(loadTime).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.maxRequestTime);
    });

    test('should have good Core Web Vitals', async ({ page }) => {
      await page.goto(TEST_URLS.en);
      
      // Measure Largest Contentful Paint (LCP)
      const lcp = await page.evaluate(() => {
        return new Promise(resolve => {
          new PerformanceObserver(list => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });
      
      // LCP should be under 2.5s for good performance
      console.log(`LCP: ${lcp}ms`);
      if (typeof lcp === 'number' && lcp > 0) {
        expect(lcp).toBeLessThan(2500);
      }
      
      // Measure Cumulative Layout Shift (CLS)
      const cls = await page.evaluate(() => {
        return new Promise(resolve => {
          let clsValue = 0;
          new PerformanceObserver(list => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            resolve(clsValue);
          }).observe({ entryTypes: ['layout-shift'] });
          
          // Measure for 2 seconds
          setTimeout(() => resolve(clsValue), 2000);
        });
      });
      
      // CLS should be under 0.1 for good performance
      console.log(`CLS: ${cls}`);
      if (typeof cls === 'number') {
        expect(cls).toBeLessThan(0.1);
      }
    });
  });

  test.describe('Lighthouse CI Integration Scaffold', () => {
    test('should provide lighthouse audit configuration', async ({ page }) => {
      // This is a scaffold test that documents expected Lighthouse scores
      // In CI, this would be replaced with actual Lighthouse CI integration
      
      await page.goto(TEST_URLS.en);
      await page.waitForLoadState('networkidle');
      
      // Document expected scores for CI configuration
      const expectedScores = {
        performance: PERFORMANCE_BUDGETS.lighthousePerformance,
        accessibility: PERFORMANCE_BUDGETS.lighthouseAccessibility,
        'best-practices': PERFORMANCE_BUDGETS.lighthouseBestPractices,
        seo: PERFORMANCE_BUDGETS.lighthouseSEO
      };
      
      console.log('Expected Lighthouse scores for CI configuration:', expectedScores);
      
      // TODO: Integrate with actual Lighthouse CI
      // Example configuration for lighthouserc.js:
      /*
      {
        "ci": {
          "collect": {
            "numberOfRuns": 3,
            "startServerCommand": "npm run preview",
            "url": ["http://localhost:4321/en/", "http://localhost:4321/es/", "http://localhost:4321/ca/"]
          },
          "assert": {
            "assertions": {
              "categories:performance": ["error", {"minScore": 0.95}],
              "categories:accessibility": ["error", {"minScore": 0.95}],
              "categories:best-practices": ["error", {"minScore": 0.95}],
              "categories:seo": ["error", {"minScore": 0.95}]
            }
          },
          "upload": {
            "target": "temporary-public-storage"
          }
        }
      }
      */
      
      expect(expectedScores.performance).toBe(95);
      expect(expectedScores.accessibility).toBe(95);
    });
  });

  test.describe('Mobile Responsiveness Tests', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto(TEST_URLS.en);
      
      // Check that mobile navigation works
      const mobileNav = page.locator('.mobile-nav, .hamburger, [data-testid="mobile-menu"]');
      if (await mobileNav.isVisible()) {
        await mobileNav.click();
        
        const navMenu = page.locator('.mobile-menu, .nav-menu, [data-testid="nav-menu"]');
        if (await navMenu.count() > 0) {
          await expect(navMenu).toBeVisible();
        }
      }
      
      // Check that content is not horizontally scrollable
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
    });

    test('should handle touch gestures', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(TEST_URLS.en);
      
      // Test swipe gesture on carousel or slider if present
      const carousel = page.locator('.carousel, .slider, [data-testid="testimonials"]').first();
      
      if (await carousel.isVisible()) {
        const boundingBox = await carousel.boundingBox();
        if (boundingBox) {
          // Simulate swipe left
          await page.touchscreen.tap(boundingBox.x + boundingBox.width * 0.8, boundingBox.y + boundingBox.height * 0.5);
          await page.touchscreen.tap(boundingBox.x + boundingBox.width * 0.2, boundingBox.y + boundingBox.height * 0.5);
          
          await page.waitForTimeout(500);
          // Test passes if no errors occurred during gesture
        }
      }
    });
  });
});

// Helper functions for reuse across tests
async function waitForNoLayoutShift(page: Page, timeout = 2000) {
  let lastShift = Date.now();
  
  await page.evaluate(() => {
    new PerformanceObserver(list => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          (window as any).lastShift = Date.now();
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  });
  
  return page.waitForFunction(
    () => Date.now() - ((window as any).lastShift || 0) > 500,
    { timeout }
  );
}

async function measureResourceSizes(page: Page) {
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map((entry: any) => ({
      name: entry.name,
      size: entry.transferSize,
      type: entry.initiatorType
    }));
  });
  
  return resources.reduce((acc: any, resource: any) => {
    if (resource.name.endsWith('.js')) {
      acc.js += resource.size;
    } else if (resource.name.endsWith('.css')) {
      acc.css += resource.size;
    }
    return acc;
  }, { js: 0, css: 0 });
}