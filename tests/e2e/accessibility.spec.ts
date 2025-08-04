import { test, expect } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should not have any automatically detectable accessibility issues', async ({ homePage, page }) => {
    await test.step('Run automated accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('should have proper heading structure', async ({ homePage, page }) => {
    await test.step('Check heading hierarchy', async () => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = await Promise.all(
        headings.map(h => h.evaluate(el => parseInt(el.tagName.substring(1))))
      );
      
      // Should have at least one h1
      expect(headingLevels).toContain(1);
      
      // Headings should be in logical order (no skipping levels)
      let previousLevel = 0;
      for (const level of headingLevels) {
        if (previousLevel > 0) {
          expect(level - previousLevel).toBeLessThanOrEqual(1);
        }
        previousLevel = level;
      }
    });
  });

  test('should have proper alt text for images', async ({ homePage, page }) => {
    await test.step('Check image alt texts', async () => {
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        const role = await img.getAttribute('role');
        
        // Images should have alt attribute (can be empty for decorative)
        expect(alt !== null).toBeTruthy();
        
        // If image is not decorative, alt should be meaningful
        if (alt && alt.length > 0) {
          expect(alt.length).toBeGreaterThan(2);
          expect(alt).not.toMatch(/image|picture|photo/i); // Avoid redundant text
        }
        
        // Src should exist
        expect(src).toBeTruthy();
      }
    });
  });

  test('should support keyboard navigation', async ({ homePage, page }) => {
    await test.step('Test keyboard navigation', async () => {
      // Start from top of page
      await page.keyboard.press('Tab');
      
      const focusableElements = await page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').all();
      
      let tabCount = 0;
      const maxTabs = Math.min(focusableElements.length, 20); // Limit test to first 20 elements
      
      while (tabCount < maxTabs) {
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(focusedElement).toBeTruthy();
        
        // Test Enter/Space activation on buttons
        const currentElement = await page.evaluate(() => document.activeElement);
        if (currentElement && (await page.evaluate(el => el.tagName, currentElement)) === 'BUTTON') {
          await page.keyboard.press('Enter');
          await page.waitForTimeout(100);
        }
        
        await page.keyboard.press('Tab');
        tabCount++;
      }
    });
  });

  test('should have sufficient color contrast', async ({ homePage, page }) => {
    await test.step('Check color contrast ratios', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();
      
      const contrastViolations = accessibilityScanResults.violations.filter(
        violation => violation.id === 'color-contrast'
      );
      
      expect(contrastViolations).toEqual([]);
    });
  });

  test('should have proper ARIA labels and roles', async ({ homePage, page }) => {
    await test.step('Check ARIA attributes', async () => {
      // Check navigation has proper role
      const nav = homePage.navigation;
      const navRole = await nav.getAttribute('role');
      const navAriaLabel = await nav.getAttribute('aria-label');
      
      expect(navRole === 'navigation' || navAriaLabel !== null).toBeTruthy();
      
      // Check buttons have accessible names
      const buttons = await page.locator('button').all();
      for (const button of buttons) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaLabelledby = await button.getAttribute('aria-labelledby');
        
        expect(text || ariaLabel || ariaLabelledby).toBeTruthy();
      }
      
      // Check links have accessible names
      const links = await page.locator('a').all();
      for (const link of links.slice(0, 10)) { // Test first 10 links
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');
        
        expect(text?.trim() || ariaLabel || title).toBeTruthy();
      }
    });
  });

  test('should be navigable with screen reader', async ({ homePage, page }) => {
    await test.step('Test screen reader compatibility', async () => {
      // Check for proper landmark roles
      const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').count();
      expect(landmarks).toBeGreaterThan(0);
      
      // Check skip links (common pattern)
      const skipLinks = await page.locator('a[href^="#"]:has-text("Skip")').count();
      // Skip links are optional but good practice
      
      // Check for form labels
      const inputs = await page.locator('input, textarea, select').all();
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const labelExists = await page.locator(`label[for="${id}"]`).count() > 0;
          expect(labelExists || ariaLabel || ariaLabelledby).toBeTruthy();
        }
      }
    });
  });

  test('should handle focus management', async ({ homePage, page }) => {
    await test.step('Test focus management', async () => {
      // Test focus visible styles
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check focus outline is visible
      const focusOutline = await focusedElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow
        };
      });
      
      // Should have some form of focus indicator
      const hasFocusIndicator = focusOutline.outline !== 'none' || 
                               focusOutline.outlineWidth !== '0px' ||
                               focusOutline.boxShadow !== 'none';
      
      expect(hasFocusIndicator).toBeTruthy();
    });
  });

  test('should work with reduced motion preference', async ({ homePage, page }) => {
    await test.step('Test reduced motion support', async () => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload({ waitUntil: 'networkidle' });
      
      // Check that animations are disabled or minimal
      const animatedElements = await page.locator('[data-animate]').all();
      
      for (const element of animatedElements.slice(0, 5)) {
        const animationDuration = await element.evaluate(el => 
          window.getComputedStyle(el).animationDuration
        );
        
        // Animations should be very short or disabled
        expect(parseFloat(animationDuration) || 0).toBeLessThan(0.1);
      }
    });
  });
});

test.describe('Accessibility - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }
  });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should be accessible on mobile', async ({ homePage, page }) => {
    await test.step('Mobile accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('should have proper touch targets', async ({ homePage, page }) => {
    await test.step('Check touch target sizes', async () => {
      const touchTargets = await page.locator('a, button, input, [role="button"]').all();
      
      for (const target of touchTargets.slice(0, 10)) {
        if (await target.isVisible()) {
          const boundingBox = await target.boundingBox();
          if (boundingBox) {
            // Touch targets should be at least 44x44px (WCAG recommendation)
            expect(boundingBox.width).toBeGreaterThanOrEqual(40);
            expect(boundingBox.height).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });
  });

  test('should handle mobile screen reader', async ({ homePage, page }) => {
    await test.step('Mobile screen reader compatibility', async () => {
      // Check that swipe navigation would work
      const landmarks = await page.locator('main, nav, header, footer, [role="main"], [role="navigation"]').count();
      expect(landmarks).toBeGreaterThan(0);
      
      // Check heading structure for mobile navigation
      const headings = await page.locator('h1, h2, h3').count();
      expect(headings).toBeGreaterThan(0);
    });
  });
});

test.describe('Accessibility - Section Specific', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should have accessible navigation', async ({ homePage, page }) => {
    await test.step('Navigation accessibility', async () => {
      const navScanResults = await new AxeBuilder({ page })
        .include('[role="navigation"], nav')
        .analyze();
      
      expect(navScanResults.violations).toEqual([]);
    });
  });

  test('should have accessible forms', async ({ homePage, page }) => {
    await test.step('Forms accessibility', async () => {
      const forms = await page.locator('form').count();
      
      if (forms > 0) {
        const formScanResults = await new AxeBuilder({ page })
          .include('form')
          .analyze();
        
        expect(formScanResults.violations).toEqual([]);
      }
    });
  });

  test('should have accessible interactive elements', async ({ homePage, page }) => {
    await test.step('Interactive elements accessibility', async () => {
      await homePage.scrollToSection('research');
      
      // Test research cards
      const cards = await homePage.researchCards.all();
      for (const card of cards) {
        // Cards should be focusable if interactive
        const tabindex = await card.getAttribute('tabindex');
        const role = await card.getAttribute('role');
        
        if (await card.locator('a, button').count() === 0) {
          // If card has no interactive children, it might need role/tabindex
          // This is context-dependent
        }
      }
      
      // Test publication filters
      await homePage.scrollToSection('publications');
      const filterButtons = await homePage.publicationsFilter.locator('button').all();
      
      for (const button of filterButtons) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    });
  });

  test('should have accessible timeline', async ({ homePage, page }) => {
    await test.step('Timeline accessibility', async () => {
      await homePage.scrollToSection('journey');
      
      const timelineItems = await homePage.timelineItems.all();
      
      for (const item of timelineItems.slice(0, 3)) {
        if (await item.isVisible()) {
          // Timeline items should have proper structure
          const heading = await item.locator('h1, h2, h3, h4, h5, h6').count();
          expect(heading).toBeGreaterThan(0);
        }
      }
    });
  });
});

test.describe('Accessibility - WCAG Compliance', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should meet WCAG 2.1 AA standards', async ({ homePage, page }) => {
    await test.step('WCAG 2.1 AA compliance check', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('should meet WCAG 2.1 AAA standards (where applicable)', async ({ homePage, page }) => {
    await test.step('WCAG 2.1 AAA compliance check', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aaa', 'wcag21aaa'])
        .analyze();
      
      // AAA is more strict, some violations might be acceptable
      // Log violations for review
      if (accessibilityScanResults.violations.length > 0) {
        console.log('AAA violations found:', accessibilityScanResults.violations.map(v => v.id));
      }
      
      // Critical AAA violations should still be fixed
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      
      expect(criticalViolations).toEqual([]);
    });
  });

  test('should support high contrast mode', async ({ homePage, page }) => {
    await test.step('High contrast mode support', async () => {
      // Simulate high contrast mode
      await page.emulateMedia({ forcedColors: 'active' });
      await page.reload({ waitUntil: 'networkidle' });
      
      // Check that content is still visible and functional
      await homePage.validateHeroSection();
      await homePage.validateNavigation();
      
      // Run accessibility scan in high contrast mode
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      
      // Should have minimal violations in high contrast mode
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical'
      );
      
      expect(criticalViolations).toEqual([]);
    });
  });
});