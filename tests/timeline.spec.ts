/**
 * Timeline Component Tests
 * Tests for filter toggles, expand/collapse a11y, reduced-motion behavior
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Timeline Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page that contains the Timeline component
    await page.goto('/en');
    
    // Wait for Timeline component to be visible if it's on the page
    await page.waitForSelector('.timeline-container', { timeout: 10000 });
  });

  test('should display timeline with filters', async ({ page }) => {
    // Check if timeline container is visible
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Check if filter buttons are present
    const filterButtons = page.locator('.timeline-container button').filter({ hasText: /All|Education|Research|Publications/ });
    await expect(filterButtons).toHaveCount(4);
    
    // Check if timeline items are displayed
    const timelineCards = page.locator('.timeline-card');
    await expect(timelineCards.first()).toBeVisible();
  });

  test('should filter timeline items correctly', async ({ page }) => {
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Get initial item count
    const initialItems = await page.locator('.timeline-card').count();
    expect(initialItems).toBeGreaterThan(0);
    
    // Click on Education filter
    await page.locator('button').filter({ hasText: 'Education' }).click();
    
    // Check if filter is active (aria-pressed should be true)
    const educationFilter = page.locator('button').filter({ hasText: 'Education' });
    await expect(educationFilter).toHaveAttribute('aria-pressed', 'true');
    
    // Click on Research filter
    await page.locator('button').filter({ hasText: 'Research' }).click();
    
    // Check if research filter is now active
    const researchFilter = page.locator('button').filter({ hasText: 'Research' });
    await expect(researchFilter).toHaveAttribute('aria-pressed', 'true');
    
    // Reset to All filter
    await page.locator('button').filter({ hasText: 'All' }).click();
    
    // Check if All items are visible again
    const allItems = await page.locator('.timeline-card').count();
    expect(allItems).toBe(initialItems);
  });

  test('should expand and collapse timeline items', async ({ page }) => {
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Find first timeline card with expand/collapse functionality
    const firstCard = page.locator('.timeline-card').first();
    const expandButton = firstCard.locator('button').filter({ hasText: /Read more|Leer más|Llegir més/ });
    
    if (await expandButton.count() > 0) {
      // Check initial state - should be collapsed
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      
      // Click to expand
      await expandButton.click();
      
      // Check if expanded
      await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
      
      // Check if details section is visible
      const details = firstCard.locator('.details');
      await expect(details).toBeVisible();
      
      // Click to collapse
      const collapseButton = firstCard.locator('button').filter({ hasText: /Read less|Leer menos|Llegir menys/ });
      await collapseButton.click();
      
      // Check if collapsed again
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Focus on first filter button
    const firstFilter = page.locator('.timeline-container button').first();
    await firstFilter.focus();
    
    // Check if filter is focused
    await expect(firstFilter).toBeFocused();
    
    // Navigate through filters with Tab key
    await page.keyboard.press('Tab');
    const secondFilter = page.locator('.timeline-container button').nth(1);
    await expect(secondFilter).toBeFocused();
    
    // Test Enter key activation
    await page.keyboard.press('Enter');
    await expect(secondFilter).toHaveAttribute('aria-pressed', 'true');
  });

  test('should respect reduced motion preferences', async ({ page, context }) => {
    // Set reduced motion preference
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        value: (query: string) => ({
          matches: query.includes('prefers-reduced-motion: reduce'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      });
    });
    
    await page.reload();
    await page.waitForSelector('.timeline-container');
    
    // Check that animations are disabled or static
    const svgPath = page.locator('svg path');
    if (await svgPath.count() > 0) {
      // In reduced motion mode, stroke-dasharray should be 'none' or not animated
      const pathElement = await svgPath.first().evaluate(el => ({
        strokeDasharray: getComputedStyle(el).strokeDasharray,
        transition: getComputedStyle(el).transition
      }));
      
      // Should not have animation-heavy transitions in reduced motion mode
      expect(pathElement.transition).not.toContain('stroke-dashoffset');
    }
  });

  test('should be accessible', async ({ page }) => {
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.timeline-container')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Check for proper ARIA attributes
    const filterGroup = page.locator('[role="group"]');
    if (await filterGroup.count() > 0) {
      await expect(filterGroup).toHaveAttribute('aria-label');
    }
    
    // Check for proper heading structure
    const timelineHeadings = page.locator('.timeline-card h3');
    const headingCount = await timelineHeadings.count();
    if (headingCount > 0) {
      // Each timeline item should have a proper heading
      for (let i = 0; i < Math.min(headingCount, 3); i++) {
        await expect(timelineHeadings.nth(i)).toBeVisible();
      }
    }
    
    // Check expandable content has proper ARIA attributes
    const expandButtons = page.locator('[aria-expanded]');
    const expandButtonCount = await expandButtons.count();
    
    for (let i = 0; i < Math.min(expandButtonCount, 3); i++) {
      const button = expandButtons.nth(i);
      await expect(button).toHaveAttribute('aria-expanded');
      
      const isExpanded = await button.getAttribute('aria-expanded');
      const controlsId = await button.getAttribute('aria-controls');
      
      if (controlsId) {
        const controlledElement = page.locator(`#${controlsId}`);
        if (await controlledElement.count() > 0) {
          if (isExpanded === 'true') {
            await expect(controlledElement).toBeVisible();
          } else {
            // Element should exist but be hidden
            await expect(controlledElement).toHaveCount(1);
          }
        }
      }
    }
  });

  test('should handle mobile vs desktop layout', async ({ page }) => {
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Test desktop layout (default)
    const desktopTimeline = page.locator('.timeline.desktop');
    if (await desktopTimeline.count() > 0) {
      await expect(desktopTimeline).toBeVisible();
    }
    
    // Test mobile layout by setting viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait a moment for responsive changes
    await page.waitForTimeout(500);
    
    const mobileTimeline = page.locator('.timeline.mobile');
    if (await mobileTimeline.count() > 0) {
      await expect(mobileTimeline).toBeVisible();
      
      // Check horizontal scrolling container
      const scrollContainer = page.locator('[style*="overflow-x: auto"]');
      if (await scrollContainer.count() > 0) {
        await expect(scrollContainer).toBeVisible();
      }
    }
  });

  test('should display timeline items with proper content', async ({ page }) => {
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    const timelineCards = page.locator('.timeline-card');
    const cardCount = await timelineCards.count();
    
    if (cardCount > 0) {
      const firstCard = timelineCards.first();
      
      // Check if card has required content
      await expect(firstCard).toBeVisible();
      
      // Should have a date
      const dateElement = firstCard.locator('text=/\\d{4}/');
      if (await dateElement.count() > 0) {
        await expect(dateElement).toBeVisible();
      }
      
      // Should have a title (h3)
      const titleElement = firstCard.locator('h3');
      if (await titleElement.count() > 0) {
        await expect(titleElement).toBeVisible();
        await expect(titleElement).not.toBeEmpty();
      }
      
      // Should have a category badge
      const categoryBadge = firstCard.locator('[style*="backgroundColor"]');
      if (await categoryBadge.count() > 0) {
        await expect(categoryBadge).toBeVisible();
      }
    }
  });

  test('should support print styles', async ({ page }) => {
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    
    // Timeline should still be visible in print mode
    await expect(timeline).toBeVisible();
    
    // Check if print-specific styles are applied
    const timelineCards = page.locator('.timeline-card');
    if (await timelineCards.count() > 0) {
      // In print mode, details should be visible by default
      const details = page.locator('.details');
      if (await details.count() > 0) {
        // Print styles should make details visible
        const detailStyle = await details.first().evaluate(el => getComputedStyle(el).display);
        expect(detailStyle).not.toBe('none');
      }
    }
  });

  test('should handle empty state', async ({ page }) => {
    // This test would need to be adapted based on how empty state is triggered
    // For example, if there's a way to filter to show no items
    
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Try to filter to a category that might have no items
    const filters = page.locator('.timeline-container button').filter({ hasText: /Publications|Publicaciones|Publicacions/ });
    if (await filters.count() > 0) {
      await filters.click();
      
      // Wait for filtering to complete
      await page.waitForTimeout(500);
      
      const items = page.locator('.timeline-card');
      const itemCount = await items.count();
      
      // If no items, check for empty state message
      if (itemCount === 0) {
        const emptyMessage = page.locator('text=/No items|No hay|No hi ha/');
        if (await emptyMessage.count() > 0) {
          await expect(emptyMessage).toBeVisible();
        }
      }
    }
  });
});

// Snapshot test for visual regression
test.describe('Timeline Visual Tests', () => {
  test('should match timeline snapshot', async ({ page }) => {
    await page.goto('/en');
    
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Wait for animations to complete
    await page.waitForTimeout(1000);
    
    // Take screenshot for visual regression testing
    await expect(timeline).toHaveScreenshot('timeline-component.png');
  });
  
  test('should match mobile timeline snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    
    const timeline = page.locator('.timeline-container');
    await expect(timeline).toBeVisible();
    
    // Wait for responsive changes and animations
    await page.waitForTimeout(1000);
    
    // Take screenshot for mobile layout
    await expect(timeline).toHaveScreenshot('timeline-mobile.png');
  });
});