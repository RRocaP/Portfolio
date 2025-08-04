import { test, expect } from '../fixtures/test-fixtures';

test.describe('Performance Testing', () => {
  test.describe('Core Web Vitals', () => {
    test('should have good Largest Contentful Paint (LCP)', async ({ homePage, page }) => {
      await test.step('Measure LCP', async () => {
        await homePage.goto();
        
        const vitals = await homePage.measureCoreWebVitals();
        const lcp = (vitals as any).lcp;
        
        // LCP should be under 2.5s for good rating
        expect(lcp).toBeLessThan(2500);
      });
    });

    test('should have low Cumulative Layout Shift (CLS)', async ({ homePage, page }) => {
      await test.step('Measure CLS', async () => {
        await homePage.goto();
        await page.waitForLoadState('networkidle');
        
        // Wait for any layout shifts to occur
        await page.waitForTimeout(3000);
        
        const vitals = await homePage.measureCoreWebVitals();
        const cls = (vitals as any).cls;
        
        // CLS should be under 0.1 for good rating
        expect(cls).toBeLessThan(0.1);
      });
    });

    test('should have good First Input Delay (FID) equivalent', async ({ homePage, page }) => {
      await test.step('Measure interaction responsiveness', async () => {
        await homePage.goto();
        await page.waitForLoadState('networkidle');
        
        // Measure interaction time
        const startTime = Date.now();
        await homePage.heroCTALearnMore.click();
        await expect(homePage.aboutSection).toBeInViewport();
        const interactionTime = Date.now() - startTime;
        
        // Interaction should be under 100ms for good rating
        expect(interactionTime).toBeLessThan(200); // More lenient for E2E testing
      });
    });
  });

  test.describe('Page Load Performance', () => {
    test('should load within acceptable time', async ({ homePage, page }) => {
      await test.step('Measure page load time', async () => {
        const startTime = Date.now();
        await homePage.goto();
        await homePage.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        // Page should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
      });
    });

    test('should have fast Time to First Byte (TTFB)', async ({ homePage, page }) => {
      await test.step('Measure TTFB', async () => {
        const navigationTiming = await page.evaluate(() => {
          return performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        });
        
        const ttfb = navigationTiming.responseStart - navigationTiming.fetchStart;
        
        // TTFB should be under 600ms
        expect(ttfb).toBeLessThan(600);
      });
    });

    test('should have fast DOM Content Loaded', async ({ homePage, page }) => {
      await test.step('Measure DOM Content Loaded', async () => {
        await homePage.goto();
        
        const domContentLoaded = await page.evaluate(() => {
          return performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        });
        
        const dcl = domContentLoaded.domContentLoadedEventEnd - domContentLoaded.fetchStart;
        
        // DOM Content Loaded should be under 1.5s
        expect(dcl).toBeLessThan(1500);
      });
    });
  });

  test.describe('Resource Performance', () => {
    test('should load critical resources efficiently', async ({ homePage, page }) => {
      const resourceTimings: any[] = [];
      
      page.on('response', response => {
        if (response.url().includes(page.url().split('/')[2])) { // Same origin
          resourceTimings.push({
            url: response.url(),
            status: response.status(),
            size: response.headers()['content-length'],
            timing: response.timing()
          });
        }
      });

      await test.step('Analyze resource loading', async () => {
        await homePage.goto();
        await page.waitForLoadState('networkidle');
        
        // Critical resources should load quickly
        const criticalResources = resourceTimings.filter(r => 
          r.url.includes('.css') || r.url.includes('.js') || r.url.endsWith('.html')
        );
        
        expect(criticalResources.length).toBeGreaterThan(0);
        
        for (const resource of criticalResources.slice(0, 5)) {
          expect(resource.status).toBe(200);
        }
      });
    });

    test('should compress resources properly', async ({ homePage, page }) => {
      const responses: any[] = [];
      
      page.on('response', response => {
        responses.push({
          url: response.url(),
          headers: response.headers(),
          size: response.headers()['content-length']
        });
      });

      await test.step('Check resource compression', async () => {
        await homePage.goto();
        await page.waitForLoadState('networkidle');
        
        // Check for compression headers
        const compressibleResources = responses.filter(r => 
          r.url.includes('.css') || r.url.includes('.js') || r.url.includes('.html')
        );
        
        for (const resource of compressibleResources.slice(0, 3)) {
          const contentEncoding = resource.headers['content-encoding'];
          // Resources should be compressed (gzip, br, etc.)
          if (resource.size && parseInt(resource.size) > 1000) {
            expect(contentEncoding).toBeTruthy();
          }
        }
      });
    });

    test('should cache resources appropriately', async ({ homePage, page }) => {
      const cacheHeaders: any[] = [];
      
      page.on('response', response => {
        if (response.url().includes('.css') || response.url().includes('.js') || response.url().includes('.png') || response.url().includes('.jpg')) {
          cacheHeaders.push({
            url: response.url(),
            cacheControl: response.headers()['cache-control'],
            etag: response.headers()['etag'],
            lastModified: response.headers()['last-modified']
          });
        }
      });

      await test.step('Check caching headers', async () => {
        await homePage.goto();
        await page.waitForLoadState('networkidle');
        
        // Static resources should have caching headers
        for (const resource of cacheHeaders.slice(0, 5)) {
          const hasCaching = resource.cacheControl || resource.etag || resource.lastModified;
          expect(hasCaching).toBeTruthy();
        }
      });
    });
  });

  test.describe('Mobile Performance', () => {
    test.use({
      viewport: { width: 375, height: 667 }
    });

    test('should load efficiently on mobile', async ({ homePage, page }) => {
      await test.step('Mobile load performance', async () => {
        const startTime = Date.now();
        await homePage.goto();
        await homePage.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        // Mobile should load within 4 seconds (slightly more lenient)
        expect(loadTime).toBeLessThan(4000);
      });
    });

    test('should have good mobile Core Web Vitals', async ({ homePage, page }) => {
      await test.step('Mobile Core Web Vitals', async () => {
        await homePage.goto();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const vitals = await homePage.measureCoreWebVitals();
        const lcp = (vitals as any).lcp;
        const cls = (vitals as any).cls;
        
        // Mobile thresholds might be slightly more lenient
        expect(lcp).toBeLessThan(3000);
        expect(cls).toBeLessThan(0.15);
      });
    });
  });

  test.describe('Animation Performance', () => {
    test('should have smooth scroll performance', async ({ homePage, page }) => {
      await test.step('Measure scroll performance', async () => {
        await homePage.goto();
        
        // Measure frame rate during scroll
        let frameCount = 0;
        const startTime = Date.now();
        
        const frameCounter = () => {
          frameCount++;
          if (Date.now() - startTime < 1000) {
            requestAnimationFrame(frameCounter);
          }
        };
        
        await page.evaluate(() => {
          let frameCount = 0;
          const startTime = Date.now();
          
          const frameCounter = () => {
            frameCount++;
            if (Date.now() - startTime < 1000) {
              requestAnimationFrame(frameCounter);
            } else {
              (window as any).frameRate = frameCount;
            }
          };
          
          requestAnimationFrame(frameCounter);
        });
        
        // Scroll during measurement
        await homePage.scrollToSection('research');
        await homePage.scrollToSection('publications');
        
        await page.waitForTimeout(1100);
        
        const frameRate = await page.evaluate(() => (window as any).frameRate || 0);
        
        // Should maintain at least 30 FPS (ideally 60)
        expect(frameRate).toBeGreaterThan(30);
      });
    });

    test('should handle animation efficiently', async ({ homePage, page }) => {
      await test.step('Animation performance test', async () => {
        await homePage.goto();
        
        // Test hover animations don't cause jank
        const startTime = Date.now();
        
        const cards = await homePage.researchCards.all();
        for (const card of cards.slice(0, 3)) {
          await card.hover();
          await page.waitForTimeout(100);
        }
        
        const animationTime = Date.now() - startTime;
        
        // Animations should be responsive
        expect(animationTime).toBeLessThan(1000);
      });
    });
  });

  test.describe('Memory Performance', () => {
    test('should not have significant memory leaks', async ({ homePage, page }) => {
      await test.step('Memory usage test', async () => {
        await homePage.goto();
        
        // Get initial memory usage
        const initialMemory = await page.evaluate(() => {
          return (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize
          } : null;
        });
        
        // Perform navigation and interactions
        await homePage.validateSmoothScrolling();
        await homePage.validatePublicationsFilter();
        await homePage.validateResearchCards();
        
        // Wait for potential memory cleanup
        await page.waitForTimeout(2000);
        
        const finalMemory = await page.evaluate(() => {
          return (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize
          } : null;
        });
        
        if (initialMemory && finalMemory) {
          const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
          const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;
          
          // Memory shouldn't increase by more than 50% during normal usage
          expect(memoryIncreasePercent).toBeLessThan(50);
        }
      });
    });
  });

  test.describe('Network Performance', () => {
    test('should handle slow networks gracefully', async ({ homePage, page }) => {
      await test.step('Slow 3G simulation', async () => {
        // Simulate slow 3G
        const client = await page.context().newCDPSession(page);
        await client.send('Network.emulateNetworkConditions', {
          offline: false,
          downloadThroughput: 500 * 1024 / 8, // 500kb/s
          uploadThroughput: 500 * 1024 / 8,
          latency: 400
        });
        
        const startTime = Date.now();
        await homePage.goto();
        await homePage.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;
        
        // Should still load reasonably on slow networks
        expect(loadTime).toBeLessThan(10000); // 10 seconds max
        
        // Content should be visible
        await homePage.validateHeroSection();
        
        // Reset network conditions
        await client.send('Network.emulateNetworkConditions', {
          offline: false,
          downloadThroughput: -1,
          uploadThroughput: -1,
          latency: 0
        });
      });
    });

    test('should handle network failures gracefully', async ({ homePage, page }) => {
      await test.step('Network failure handling', async () => {
        await homePage.goto();
        
        // Block non-critical resources
        await page.route('**/*.{png,jpg,jpeg,webp,gif}', route => route.abort());
        
        // Page should still be functional
        await homePage.validateNavigation();
        await homePage.validateHeroSection();
        
        // Unblock resources
        await page.unroute('**/*.{png,jpg,jpeg,webp,gif}');
      });
    });
  });

  test.describe('Bundle Size Performance', () => {
    test('should have reasonable bundle sizes', async ({ homePage, page }) => {
      const resourceSizes: { [key: string]: number } = {};
      
      page.on('response', response => {
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          const url = response.url();
          resourceSizes[url] = parseInt(contentLength);
        }
      });

      await test.step('Analyze bundle sizes', async () => {
        await homePage.goto();
        await page.waitForLoadState('networkidle');
        
        // Check JavaScript bundle sizes
        const jsResources = Object.entries(resourceSizes).filter(([url]) => 
          url.includes('.js') && !url.includes('node_modules')
        );
        
        for (const [url, size] of jsResources) {
          // Individual JS bundles shouldn't be too large
          expect(size).toBeLessThan(500 * 1024); // 500KB max per bundle
        }
        
        // Check CSS bundle sizes
        const cssResources = Object.entries(resourceSizes).filter(([url]) => 
          url.includes('.css')
        );
        
        for (const [url, size] of cssResources) {
          // CSS bundles should be reasonable
          expect(size).toBeLessThan(200 * 1024); // 200KB max
        }
      });
    });
  });

  test.describe('User Experience Performance', () => {
    test('should feel responsive to user interactions', async ({ homePage, page }) => {
      await test.step('Interaction responsiveness', async () => {
        await homePage.goto();
        
        // Test navigation responsiveness
        const interactions = [
          () => homePage.clickNavItem('research'),
          () => homePage.filterPublications('peptides'),
          () => homePage.antimicrobialCard.hover(),
          () => homePage.heroCTALearnMore.click()
        ];
        
        for (const interaction of interactions) {
          const startTime = Date.now();
          await interaction();
          await page.waitForTimeout(100); // Minimum wait for visual feedback
          const responseTime = Date.now() - startTime;
          
          // Interactions should feel instant (under 100ms)
          expect(responseTime).toBeLessThan(200);
        }
      });
    });

    test('should provide visual feedback quickly', async ({ homePage, page }) => {
      await test.step('Visual feedback timing', async () => {
        await homePage.goto();
        await homePage.scrollToSection('research');
        
        // Test hover feedback timing
        const card = homePage.antimicrobialCard;
        
        const startTime = Date.now();
        await card.hover();
        
        // Wait for hover effects to be visible
        await page.waitForTimeout(50);
        
        const feedbackTime = Date.now() - startTime;
        
        // Visual feedback should be immediate
        expect(feedbackTime).toBeLessThan(100);
      });
    });
  });
});