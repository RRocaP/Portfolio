import { test, expect } from '../fixtures/test-fixtures';

test.describe('Visual Regression Testing', () => {
  test.beforeEach(async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.disableAnimations();
    await page.waitForLoadState('networkidle');
  });

  test('should match homepage hero section', async ({ homePage, page }) => {
    await test.step('Hero section visual test', async () => {
      // Ensure hero is visible and stable
      await expect(homePage.hero).toBeVisible();
      await page.waitForTimeout(1000); // Allow any late-loading elements
      
      // Take screenshot of hero section
      await expect(homePage.hero).toHaveScreenshot('hero-section.png', {
        mask: [
          // Mask dynamic elements like animated orbs
          page.locator('.gradient-orb'),
          page.locator('.hero-scroll-indicator')
        ],
        fullPage: false
      });
    });
  });

  test('should match navigation bar', async ({ homePage, page }) => {
    await test.step('Navigation visual test', async () => {
      await expect(homePage.navigation).toBeVisible();
      
      await expect(homePage.navigation).toHaveScreenshot('navigation.png', {
        fullPage: false
      });
    });
  });

  test('should match about section', async ({ homePage, page }) => {
    await test.step('About section visual test', async () => {
      await homePage.scrollToSection('about');
      await page.waitForTimeout(500);
      
      await expect(homePage.aboutSection).toHaveScreenshot('about-section.png', {
        mask: [
          // Mask animated statistics
          homePage.publicationsCount,
          homePage.patentsCount,
          homePage.yearsResearchCount
        ]
      });
    });
  });

  test('should match research cards', async ({ homePage, page }) => {
    await test.step('Research cards visual test', async () => {
      await homePage.scrollToSection('research');
      await page.waitForTimeout(500);
      
      const researchGrid = page.locator('.research-grid');
      await expect(researchGrid).toHaveScreenshot('research-cards.png');
    });
  });

  test('should match publications section', async ({ homePage, page }) => {
    await test.step('Publications section visual test', async () => {
      await homePage.scrollToSection('publications');
      await page.waitForTimeout(500);
      
      await expect(homePage.publicationsSection).toHaveScreenshot('publications-section.png');
    });
  });

  test('should match contact section', async ({ homePage, page }) => {
    await test.step('Contact section visual test', async () => {
      await homePage.scrollToSection('contact');
      await page.waitForTimeout(500);
      
      await expect(homePage.contactSection).toHaveScreenshot('contact-section.png');
    });
  });

  test('should match timeline section', async ({ homePage, page }) => {
    await test.step('Timeline visual test', async () => {
      await homePage.scrollToSection('journey');
      await page.waitForTimeout(500);
      
      await expect(homePage.journeySection).toHaveScreenshot('timeline-section.png', {
        mask: [
          // Mask any animated timeline elements
          page.locator('.timeline-path'),
          page.locator('[data-animate]')
        ]
      });
    });
  });

  test('should match full page layout', async ({ homePage, page }) => {
    await test.step('Full page visual test', async () => {
      // Scroll to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('full-page.png', {
        fullPage: true,
        mask: [
          // Mask dynamic/animated elements
          page.locator('.gradient-orb'),
          page.locator('.hero-scroll-indicator'),
          page.locator('[data-animate]'),
          page.locator('.timeline-path')
        ]
      });
    });
  });
});

test.describe('Visual Regression - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }
  });

  test.beforeEach(async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.disableAnimations();
    await page.waitForLoadState('networkidle');
  });

  test('should match mobile hero section', async ({ homePage, page }) => {
    await test.step('Mobile hero visual test', async () => {
      await expect(homePage.hero).toBeVisible();
      await page.waitForTimeout(1000);
      
      await expect(homePage.hero).toHaveScreenshot('mobile-hero-section.png', {
        mask: [page.locator('.gradient-orb')],
        fullPage: false
      });
    });
  });

  test('should match mobile navigation', async ({ homePage, page }) => {
    await test.step('Mobile navigation visual test', async () => {
      await expect(homePage.navigation).toHaveScreenshot('mobile-navigation.png');
    });
  });

  test('should match mobile research cards', async ({ homePage, page }) => {
    await test.step('Mobile research cards visual test', async () => {
      await homePage.scrollToSection('research');
      await page.waitForTimeout(500);
      
      const researchGrid = page.locator('.research-grid');
      await expect(researchGrid).toHaveScreenshot('mobile-research-cards.png');
    });
  });

  test('should match mobile contact section', async ({ homePage, page }) => {
    await test.step('Mobile contact visual test', async () => {
      await homePage.scrollToSection('contact');
      await page.waitForTimeout(500);
      
      await expect(homePage.contactSection).toHaveScreenshot('mobile-contact-section.png');
    });
  });
});

test.describe('Visual Regression - Tablet', () => {
  test.use({
    viewport: { width: 768, height: 1024 }
  });

  test.beforeEach(async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.disableAnimations();
    await page.waitForLoadState('networkidle');
  });

  test('should match tablet layout', async ({ homePage, page }) => {
    await test.step('Tablet full page visual test', async () => {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('tablet-full-page.png', {
        fullPage: true,
        mask: [
          page.locator('.gradient-orb'),
          page.locator('[data-animate]')
        ]
      });
    });
  });
});

test.describe('Visual Regression - Interactive States', () => {
  test.beforeEach(async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.disableAnimations();
    await page.waitForLoadState('networkidle');
  });

  test('should match button hover states', async ({ homePage, page }) => {
    await test.step('Button hover visual test', async () => {
      // Hover over primary CTA
      await homePage.heroCTALearnMore.hover();
      await page.waitForTimeout(200);
      
      await expect(homePage.heroCTALearnMore).toHaveScreenshot('button-hover-primary.png');
      
      // Hover over secondary CTA
      await homePage.heroCTAContact.hover();
      await page.waitForTimeout(200);
      
      await expect(homePage.heroCTAContact).toHaveScreenshot('button-hover-secondary.png');
    });
  });

  test('should match card hover states', async ({ homePage, page }) => {
    await test.step('Research card hover visual test', async () => {
      await homePage.scrollToSection('research');
      await page.waitForTimeout(500);
      
      // Hover over first research card
      await homePage.antimicrobialCard.hover();
      await page.waitForTimeout(200);
      
      await expect(homePage.antimicrobialCard).toHaveScreenshot('research-card-hover.png');
    });
  });

  test('should match publication filter states', async ({ homePage, page }) => {
    await test.step('Publication filter visual test', async () => {
      await homePage.scrollToSection('publications');
      await page.waitForTimeout(500);
      
      // Default state
      await expect(homePage.publicationsFilter).toHaveScreenshot('publications-filter-default.png');
      
      // Click peptides filter
      await homePage.filterPeptides.click();
      await page.waitForTimeout(300);
      
      await expect(homePage.publicationsFilter).toHaveScreenshot('publications-filter-peptides.png');
    });
  });

  test('should match form focus states', async ({ homePage, page }) => {
    await test.step('Form element focus visual test', async () => {
      await homePage.scrollToSection('contact');
      
      // Test any input fields that exist
      const inputs = await page.locator('input, textarea, button').all();
      
      for (let i = 0; i < Math.min(inputs.length, 3); i++) {
        const input = inputs[i];
        if (await input.isVisible()) {
          await input.focus();
          await page.waitForTimeout(100);
          
          await expect(input).toHaveScreenshot(`form-focus-${i}.png`);
        }
      }
    });
  });
});

test.describe('Visual Regression - Error States', () => {
  test('should match 404 page', async ({ homePage, page }) => {
    await test.step('404 page visual test', async () => {
      const response = await page.goto('/non-existent-page', { 
        waitUntil: 'networkidle' 
      });
      
      await page.waitForTimeout(1000);
      
      // Take screenshot of error page if it exists
      await expect(page).toHaveScreenshot('404-page.png', {
        fullPage: true
      });
    });
  });

  test('should match offline state', async ({ homePage, page }) => {
    await test.step('Offline state visual test', async () => {
      // Simulate offline condition
      await page.context().setOffline(true);
      
      try {
        await page.reload({ waitUntil: 'networkidle' });
      } catch (error) {
        // Page might not load offline, which is expected
      }
      
      await page.waitForTimeout(2000);
      
      // Take screenshot of offline state
      await expect(page).toHaveScreenshot('offline-state.png', {
        fullPage: true
      });
      
      // Restore online state
      await page.context().setOffline(false);
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test.use({
    colorScheme: 'dark'
  });

  test.beforeEach(async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.disableAnimations();
    await page.waitForLoadState('networkidle');
  });

  test('should match dark mode homepage', async ({ homePage, page }) => {
    await test.step('Dark mode full page visual test', async () => {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('dark-mode-full-page.png', {
        fullPage: true,
        mask: [
          page.locator('.gradient-orb'),
          page.locator('[data-animate]')
        ]
      });
    });
  });

  test('should match dark mode components', async ({ homePage, page }) => {
    await test.step('Dark mode components visual test', async () => {
      // Hero section
      await expect(homePage.hero).toHaveScreenshot('dark-mode-hero.png', {
        mask: [page.locator('.gradient-orb')]
      });
      
      // Research cards
      await homePage.scrollToSection('research');
      await page.waitForTimeout(500);
      
      const researchGrid = page.locator('.research-grid');
      await expect(researchGrid).toHaveScreenshot('dark-mode-research-cards.png');
    });
  });
});

test.describe('Visual Regression - Print Styles', () => {
  test('should match print layout', async ({ homePage, page }) => {
    await test.step('Print layout visual test', async () => {
      // Emulate print media
      await page.emulateMedia({ media: 'print' });
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('print-layout.png', {
        fullPage: true
      });
      
      // Reset to screen media
      await page.emulateMedia({ media: 'screen' });
    });
  });
});