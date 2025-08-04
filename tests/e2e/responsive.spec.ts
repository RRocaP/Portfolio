import { test, expect } from '../fixtures/test-fixtures';

test.describe('Responsive Design - Mobile Devices', () => {
  test('should work on iPhone SE', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Validate mobile layout', async () => {
      await homePage.validateHeroSection();
      await homePage.validateNavigation();
      
      // Check that elements stack properly on mobile
      const aboutGrid = homePage.page.locator('.about-grid');
      if (await aboutGrid.count() > 0) {
        const boundingBox = await aboutGrid.boundingBox();
        expect(boundingBox?.height).toBeGreaterThan(boundingBox?.width || 0);
      }
    });

    await test.step('Test mobile interactions', async () => {
      await homePage.testMobileMenu();
      await homePage.validateSmoothScrolling();
    });

    await test.step('Check text readability', async () => {
      const heroTitle = homePage.heroTitle;
      const fontSize = await heroTitle.evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      
      // Font should be at least 16px for mobile readability
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(24); // Hero should be larger
    });
  });

  test('should work on iPhone 12', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Validate content visibility', async () => {
      await homePage.validateHeroSection();
      await homePage.validateResearchCards();
      await homePage.validateContactSection();
    });

    await test.step('Test touch interactions', async () => {
      // Test touch scrolling
      await page.touchscreen.tap(200, 400);
      
      // Test card interactions with touch
      const researchCards = await homePage.researchCards.all();
      for (const card of researchCards.slice(0, 2)) {
        await card.tap();
        await page.waitForTimeout(100);
      }
    });
  });

  test('should work on Android devices', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 360, height: 740 }); // Pixel 5
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Android-specific interactions', async () => {
      await homePage.validateNavigation();
      
      // Test Android-specific behaviors
      const backButton = page.locator('[data-testid="back-button"]');
      if (await backButton.count() > 0) {
        await expect(backButton).toBeVisible();
      }
    });
  });
});

test.describe('Responsive Design - Tablet Devices', () => {
  test('should work on iPad', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Validate tablet layout', async () => {
      await homePage.validateHeroSection();
      await homePage.validateResearchCards();
      
      // Check that grid layouts work well on tablet
      const researchGrid = homePage.page.locator('.research-grid');
      if (await researchGrid.count() > 0) {
        const gridCols = await researchGrid.evaluate(el => 
          window.getComputedStyle(el).gridTemplateColumns
        );
        
        // Should have appropriate grid columns for tablet
        expect(gridCols).not.toBe('none');
      }
    });

    await test.step('Test tablet-specific interactions', async () => {
      // Tablets might show desktop or mobile nav depending on design
      await homePage.validateNavigation();
      
      // Test that hover effects work (tablets support hover)
      await homePage.antimicrobialCard.hover();
      await page.waitForTimeout(100);
    });
  });

  test('should work on iPad Pro', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Large tablet layout', async () => {
      await homePage.validateSectionsVisible();
      
      // Large tablets should show more content
      const contactWrapper = homePage.page.locator('.contact-wrapper');
      if (await contactWrapper.count() > 0) {
        const gridCols = await contactWrapper.evaluate(el => 
          window.getComputedStyle(el).gridTemplateColumns
        );
        
        // Should have multi-column layout
        expect(gridCols.split(' ').length).toBeGreaterThanOrEqual(2);
      }
    });
  });
});

test.describe('Responsive Design - Desktop Breakpoints', () => {
  test('should work on small desktop (1024px)', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Small desktop layout', async () => {
      await homePage.validateHeroSection();
      await homePage.validateResearchCards();
      
      // Desktop navigation should be visible
      await expect(homePage.navigation).toBeVisible();
      
      // Check horizontal layout for about section
      const aboutGrid = homePage.page.locator('.about-grid');
      if (await aboutGrid.count() > 0) {
        const gridCols = await aboutGrid.evaluate(el => 
          window.getComputedStyle(el).gridTemplateColumns
        );
        
        // Should have multi-column layout on desktop
        expect(gridCols.split(' ').length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  test('should work on large desktop (1440px)', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Large desktop layout', async () => {
      await homePage.validateSectionsVisible();
      
      // Check that content doesn't stretch too wide
      const container = homePage.page.locator('.container').first();
      const containerWidth = await container.evaluate(el => el.offsetWidth);
      
      // Should have max-width constraint
      expect(containerWidth).toBeLessThanOrEqual(1200);
    });
  });

  test('should work on ultra-wide (1920px)', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Ultra-wide layout', async () => {
      await homePage.validateHeroSection();
      
      // Content should remain centered and readable
      const heroContent = homePage.page.locator('.hero-content');
      const contentWidth = await heroContent.evaluate(el => el.offsetWidth);
      
      // Content shouldn't span the full ultra-wide width
      expect(contentWidth).toBeLessThan(1920);
    });
  });
});

test.describe('Responsive Design - Orientation Changes', () => {
  test('should handle portrait to landscape transitions', async ({ homePage, page }) => {
    // Start in mobile portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Portrait layout', async () => {
      await homePage.validateHeroSection();
    });

    await test.step('Switch to landscape', async () => {
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500); // Allow layout to settle
      
      // Content should still be accessible
      await homePage.validateHeroSection();
      await homePage.validateNavigation();
    });
  });

  test('should handle tablet orientation changes', async ({ homePage, page }) => {
    // iPad portrait
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Tablet portrait', async () => {
      await homePage.validateResearchCards();
    });

    await test.step('Switch to tablet landscape', async () => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(500);
      
      await homePage.validateResearchCards();
      await homePage.validatePublicationsFilter();
    });
  });
});

test.describe('Responsive Design - Content Adaptation', () => {
  test('should adapt images responsively', async ({ homePage, page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1200, height: 800, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await test.step(`Test images at ${viewport.name}`, async () => {
        await page.setViewportSize(viewport);
        await homePage.goto();
        await homePage.disableAnimations();

        // Check that images are properly sized
        const images = await homePage.page.locator('img').all();
        
        for (const img of images.slice(0, 3)) { // Test first 3 images
          if (await img.isVisible()) {
            const boundingBox = await img.boundingBox();
            if (boundingBox) {
              // Images shouldn't overflow viewport
              expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
              expect(boundingBox.height).toBeGreaterThan(0);
            }
          }
        }
      });
    }
  });

  test('should adapt typography responsively', async ({ homePage, page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'small mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1440, height: 900, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await test.step(`Test typography at ${viewport.name}`, async () => {
        await page.setViewportSize(viewport);
        await homePage.goto();
        await homePage.disableAnimations();

        const heroTitle = homePage.heroTitle;
        const fontSize = await heroTitle.evaluate(el => 
          parseInt(window.getComputedStyle(el).fontSize)
        );

        // Font sizes should scale appropriately
        if (viewport.width <= 768) {
          expect(fontSize).toBeLessThanOrEqual(48); // Mobile shouldn't be too large
        } else {
          expect(fontSize).toBeGreaterThanOrEqual(32); // Desktop should be readable
        }
      });
    }
  });

  test('should maintain aspect ratios', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();
    await homePage.disableAnimations();

    await test.step('Check container aspect ratios', async () => {
      const cards = await homePage.researchCards.all();
      
      for (const card of cards.slice(0, 2)) {
        if (await card.isVisible()) {
          const boundingBox = await card.boundingBox();
          if (boundingBox) {
            // Cards should maintain reasonable aspect ratios
            const aspectRatio = boundingBox.width / boundingBox.height;
            expect(aspectRatio).toBeGreaterThan(0.5);
            expect(aspectRatio).toBeLessThan(4);
          }
        }
      }
    });
  });
});

test.describe('Responsive Design - Performance', () => {
  test('should load efficiently on mobile', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await test.step('Measure mobile load time', async () => {
      const startTime = Date.now();
      await homePage.goto();
      await homePage.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Mobile should load reasonably fast
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test('should not download unnecessary resources on mobile', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const networkRequests: string[] = [];
    page.on('request', request => {
      networkRequests.push(request.url());
    });

    await homePage.goto();
    await page.waitForTimeout(2000);

    await test.step('Check resource efficiency', async () => {
      // Should not load desktop-only resources
      const desktopOnlyResources = networkRequests.filter(url => 
        url.includes('desktop') || url.includes('large')
      );
      
      // Most resources should be mobile-friendly
      expect(desktopOnlyResources.length).toBeLessThan(5);
    });
  });
});