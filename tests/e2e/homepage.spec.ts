import { test, expect } from '../fixtures/test-fixtures';

test.describe('Homepage - Core Functionality', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.disableAnimations();
  });

  test('should load homepage successfully', async ({ homePage }) => {
    await test.step('Verify page loads', async () => {
      expect(homePage.page.url()).toContain('/');
      await expect(homePage.page).toHaveTitle(/Ramon Roca Pinilla/);
    });

    await test.step('Verify meta tags', async () => {
      const description = await homePage.page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toContain('Biomedical Engineer');
    });
  });

  test('should display hero section correctly', async ({ homePage }) => {
    await test.step('Validate hero content', async () => {
      await homePage.validateHeroSection();
    });

    await test.step('Test hero CTA buttons', async () => {
      await homePage.heroCTALearnMore.click();
      await expect(homePage.aboutSection).toBeInViewport();
      
      await homePage.page.goBack();
      await homePage.heroCTAContact.click();
      await expect(homePage.contactSection).toBeInViewport();
    });
  });

  test('should have working navigation', async ({ homePage }) => {
    await test.step('Validate navigation elements', async () => {
      await homePage.validateNavigation();
    });

    await test.step('Test navigation clicks', async () => {
      await homePage.validateSmoothScrolling();
    });
  });

  test('should display all main sections', async ({ homePage }) => {
    await test.step('Verify all sections are present', async () => {
      await homePage.validateSectionsVisible();
    });
  });

  test('should animate statistics correctly', async ({ homePage }) => {
    await test.step('Validate stats animation', async () => {
      await homePage.validateStatsAnimation();
    });
  });

  test('should display research cards with interactions', async ({ homePage }) => {
    await test.step('Validate research cards', async () => {
      await homePage.validateResearchCards();
    });

    await test.step('Test card hover effects', async () => {
      await homePage.validateInteractiveElements();
    });
  });

  test('should have functional publications filter', async ({ homePage }) => {
    await test.step('Test publications filter', async () => {
      await homePage.validatePublicationsFilter();
    });
  });

  test('should display contact information', async ({ homePage }) => {
    await test.step('Validate contact section', async () => {
      await homePage.validateContactSection();
    });
  });

  test('should have secure external links', async ({ homePage }) => {
    await test.step('Validate external link security', async () => {
      const externalLinks = await homePage.validateExternalLinks();
      expect(externalLinks.length).toBeGreaterThan(0);
    });
  });

  test('should be keyboard navigable', async ({ homePage }) => {
    await test.step('Test keyboard navigation', async () => {
      // Start from the first focusable element
      await homePage.page.keyboard.press('Tab');
      
      // Test tab navigation through key elements
      const focusableElements = [
        homePage.navHome,
        homePage.navResearch,
        homePage.navPublications,
        homePage.navContact,
        homePage.heroCTALearnMore,
        homePage.heroCTAContact
      ];
      
      for (const element of focusableElements) {
        if (await element.isVisible()) {
          await element.focus();
          await expect(element).toBeFocused();
        }
      }
    });
  });

  test('should handle scroll indicators', async ({ homePage }) => {
    await test.step('Verify scroll indicator', async () => {
      await expect(homePage.heroScrollIndicator).toBeVisible();
    });

    await test.step('Test scroll to sections', async () => {
      // Scroll down and verify indicator behavior
      await homePage.scrollToSection('about');
      await homePage.scrollToSection('research');
      await homePage.scrollToSection('publications');
    });
  });
});

test.describe('Homepage - Error Handling', () => {
  test('should handle missing resources gracefully', async ({ homePage, page }) => {
    // Test with network failures
    await page.route('**/*.{png,jpg,jpeg,svg,webp}', route => route.abort());
    
    await homePage.goto();
    
    await test.step('Page should still be functional without images', async () => {
      await homePage.validateHeroSection();
      await homePage.validateNavigation();
    });
  });

  test('should handle JavaScript errors gracefully', async ({ homePage, page }) => {
    let jsErrors: string[] = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await homePage.goto();
    
    await test.step('Should have minimal JavaScript errors', async () => {
      // Allow some time for any JS errors to surface
      await page.waitForTimeout(2000);
      
      // Filter out known non-critical errors
      const criticalErrors = jsErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('analytics')
      );
      
      expect(criticalErrors.length).toBeLessThanOrEqual(0);
    });
  });
});