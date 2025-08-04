import { test, expect } from '../fixtures/test-fixtures';

test.describe('Navigation - Desktop', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should navigate between sections smoothly', async ({ homePage }) => {
    const sections = [
      { name: 'research', element: homePage.researchSection },
      { name: 'timeline', element: homePage.journeySection },
      { name: 'publications', element: homePage.publicationsSection },
      { name: 'contact', element: homePage.contactSection },
      { name: 'home', element: homePage.hero }
    ];

    for (const section of sections) {
      await test.step(`Navigate to ${section.name}`, async () => {
        await homePage.clickNavItem(section.name as any);
        await expect(section.element).toBeInViewport({ ratio: 0.1 });
      });
    }
  });

  test('should highlight active navigation item', async ({ homePage, page }) => {
    await test.step('Check active states during scroll', async () => {
      // Scroll to research section
      await homePage.scrollToSection('research');
      await page.waitForTimeout(100);
      
      // Scroll to publications section
      await homePage.scrollToSection('publications');
      await page.waitForTimeout(100);
      
      // Navigation should update based on current section
      const navItems = await homePage.navigation.locator('a').all();
      let hasActiveItem = false;
      
      for (const item of navItems) {
        const classes = await item.getAttribute('class');
        if (classes && classes.includes('active')) {
          hasActiveItem = true;
          break;
        }
      }
      
      // At least some navigation system should be active
      expect(hasActiveItem).toBeTruthy();
    });
  });

  test('should handle hash navigation', async ({ homePage, page }) => {
    await test.step('Direct hash navigation', async () => {
      await page.goto('/#research');
      await page.waitForLoadState('networkidle');
      await expect(homePage.researchSection).toBeInViewport();
      
      await page.goto('/#contact');
      await page.waitForLoadState('networkidle');
      await expect(homePage.contactSection).toBeInViewport();
    });
  });

  test('should maintain navigation during page interactions', async ({ homePage }) => {
    await test.step('Navigation during form interactions', async () => {
      await homePage.scrollToSection('publications');
      
      // Test filter interactions don't break navigation
      await homePage.filterPublications('peptides');
      await homePage.clickNavItem('contact');
      await expect(homePage.contactSection).toBeInViewport();
    });
  });
});

test.describe('Navigation - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should show mobile menu toggle', async ({ homePage }) => {
    await test.step('Mobile menu button should be visible', async () => {
      // Check if mobile menu toggle exists and is visible
      const mobileToggle = homePage.page.locator('.mobile-menu-toggle, .hamburger, [aria-label*="menu"]');
      
      if (await mobileToggle.count() > 0) {
        await expect(mobileToggle.first()).toBeVisible();
      } else {
        // If no mobile menu, regular nav should adapt to mobile
        await expect(homePage.navigation).toBeVisible();
      }
    });
  });

  test('should handle mobile navigation', async ({ homePage }) => {
    await test.step('Test mobile menu functionality', async () => {
      await homePage.testMobileMenu();
    });
  });

  test('should maintain touch navigation', async ({ homePage, page }) => {
    await test.step('Touch scroll navigation', async () => {
      // Test touch scrolling to different sections
      const startY = 400;
      const endY = 100;
      
      // Swipe up to scroll down
      await page.touchscreen.tap(200, startY);
      await page.touchscreen.tap(200, endY);
      
      // Should be able to navigate after touch interaction
      await homePage.clickNavItem('contact');
      await expect(homePage.contactSection).toBeInViewport();
    });
  });

  test('should handle mobile viewport changes', async ({ homePage, page }) => {
    await test.step('Test different mobile orientations', async () => {
      // Portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await homePage.validateNavigation();
      
      // Landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await homePage.validateNavigation();
      
      // Large mobile
      await page.setViewportSize({ width: 414, height: 896 });
      await homePage.validateNavigation();
    });
  });
});

test.describe('Navigation - Accessibility', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should support keyboard navigation', async ({ homePage, page }) => {
    await test.step('Tab navigation through nav items', async () => {
      await page.keyboard.press('Tab');
      
      const navLinks = await homePage.navigation.locator('a').all();
      
      for (let i = 0; i < navLinks.length; i++) {
        const currentLink = navLinks[i];
        if (await currentLink.isVisible()) {
          await expect(currentLink).toBeFocused();
          
          // Test Enter key activation
          await page.keyboard.press('Enter');
          await page.waitForTimeout(500);
          
          // Navigate back to test next item
          if (i < navLinks.length - 1) {
            await page.keyboard.press('Tab');
          }
        }
      }
    });
  });

  test('should have proper ARIA attributes', async ({ homePage }) => {
    await test.step('Check navigation ARIA attributes', async () => {
      const nav = homePage.navigation;
      
      // Check for navigation role or aria-label
      const role = await nav.getAttribute('role');
      const ariaLabel = await nav.getAttribute('aria-label');
      
      expect(role === 'navigation' || ariaLabel !== null).toBeTruthy();
    });
  });

  test('should indicate current page/section', async ({ homePage }) => {
    await test.step('Check aria-current or similar indicators', async () => {
      await homePage.scrollToSection('research');
      await homePage.page.waitForTimeout(500);
      
      const navLinks = await homePage.navigation.locator('a').all();
      let hasCurrentIndicator = false;
      
      for (const link of navLinks) {
        const ariaCurrent = await link.getAttribute('aria-current');
        const classes = await link.getAttribute('class');
        
        if (ariaCurrent === 'page' || ariaCurrent === 'true' || 
            (classes && classes.includes('active'))) {
          hasCurrentIndicator = true;
          break;
        }
      }
      
      // Should have some way to indicate current section
      expect(hasCurrentIndicator).toBeTruthy();
    });
  });

  test('should work with screen readers', async ({ homePage, page }) => {
    await test.step('Check screen reader accessibility', async () => {
      // Test that navigation has proper semantic structure
      const navElement = homePage.navigation;
      await expect(navElement).toBeVisible();
      
      // Check for list structure (nav > ul > li > a)
      const list = navElement.locator('ul');
      if (await list.count() > 0) {
        await expect(list).toBeVisible();
        
        const listItems = list.locator('li');
        const listItemCount = await listItems.count();
        expect(listItemCount).toBeGreaterThan(0);
      }
    });
  });
});

test.describe('Navigation - Performance', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should have fast navigation transitions', async ({ homePage, page }) => {
    await test.step('Measure navigation speed', async () => {
      const startTime = Date.now();
      await homePage.clickNavItem('research');
      await expect(homePage.researchSection).toBeInViewport();
      const navigationTime = Date.now() - startTime;
      
      expect(navigationTime).toBeLessThan(1000); // Should be under 1 second
    });
  });

  test('should not cause layout shifts during navigation', async ({ homePage, page }) => {
    await test.step('Check for layout stability', async () => {
      // Monitor for layout shifts
      let layoutShifts = 0;
      
      await page.evaluate(() => {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              (window as any).layoutShiftScore = ((window as any).layoutShiftScore || 0) + entry.value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
      });
      
      // Navigate between sections
      await homePage.clickNavItem('research');
      await homePage.clickNavItem('publications');
      await homePage.clickNavItem('contact');
      
      await page.waitForTimeout(1000);
      
      const layoutShiftScore = await page.evaluate(() => (window as any).layoutShiftScore || 0);
      expect(layoutShiftScore).toBeLessThan(0.1); // Good CLS score
    });
  });
});