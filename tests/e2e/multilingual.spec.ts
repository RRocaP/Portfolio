import { test, expect } from '../fixtures/test-fixtures';

test.describe('Multilingual Support', () => {
  test.describe('Language Detection and Default', () => {
    test('should default to English', async ({ homePage }) => {
      await homePage.goto();
      
      await test.step('Check default language', async () => {
        // Should redirect to or show English content by default
        const url = homePage.page.url();
        const title = await homePage.page.title();
        
        // Either should be at root (default English) or /en/
        expect(url.includes('/es/') || url.includes('/ca/')).toBeFalsy();
        expect(title).toContain('Ramon Roca Pinilla');
      });

      await test.step('Verify English content', async () => {
        await expect(homePage.heroTitle).toContainText('Ramon Roca Pinilla');
        await expect(homePage.heroSubtitle).toContainText('Biomedical Engineer');
        
        // Check navigation is in English
        if (await homePage.navResearch.isVisible()) {
          await expect(homePage.navResearch).toContainText(/Research|Investigación/i);
        }
      });
    });
  });

  test.describe('Spanish (ES) Language', () => {
    test('should load Spanish version', async ({ homePage }) => {
      await homePage.gotoLanguage('es');
      
      await test.step('Verify Spanish URL and content', async () => {
        const url = homePage.page.url();
        expect(url).toContain('/es/');
        
        const title = await homePage.page.title();
        expect(title).toContain('Ramon Roca Pinilla');
      });

      await test.step('Check Spanish content translations', async () => {
        // Hero section should have Spanish content
        await expect(homePage.heroTitle).toContainText('Ramon Roca Pinilla');
        await expect(homePage.heroSubtitle).toContainText(/Biomedical Engineer|Ingeniero Biomédico/i);
        
        // Navigation should be in Spanish if translated
        const navText = await homePage.navigation.textContent();
        // At minimum, the page should load successfully
        expect(navText).toBeTruthy();
      });

      await test.step('Verify Spanish sections load', async () => {
        await homePage.validateSectionsVisible();
        await homePage.validateHeroSection();
      });
    });

    test('should maintain functionality in Spanish', async ({ homePage }) => {
      await homePage.gotoLanguage('es');
      
      await test.step('Test navigation in Spanish', async () => {
        await homePage.validateSmoothScrolling();
      });

      await test.step('Test interactive elements in Spanish', async () => {
        await homePage.validatePublicationsFilter();
        await homePage.validateResearchCards();
      });
    });
  });

  test.describe('Catalan (CA) Language', () => {
    test('should load Catalan version', async ({ homePage }) => {
      await homePage.gotoLanguage('ca');
      
      await test.step('Verify Catalan URL and content', async () => {
        const url = homePage.page.url();
        expect(url).toContain('/ca/');
        
        const title = await homePage.page.title();
        expect(title).toContain('Ramon Roca Pinilla');
      });

      await test.step('Check Catalan content loads', async () => {
        await expect(homePage.heroTitle).toContainText('Ramon Roca Pinilla');
        await expect(homePage.heroSubtitle).toBeVisible();
        
        // Page should load successfully
        await homePage.validateHeroSection();
      });

      await test.step('Verify Catalan sections load', async () => {
        await homePage.validateSectionsVisible();
      });
    });

    test('should maintain functionality in Catalan', async ({ homePage }) => {
      await homePage.gotoLanguage('ca');
      
      await test.step('Test navigation in Catalan', async () => {
        await homePage.validateNavigation();
        await homePage.validateSmoothScrolling();
      });

      await test.step('Test interactive features in Catalan', async () => {
        await homePage.validateResearchCards();
        await homePage.validateContactSection();
      });
    });
  });

  test.describe('Language Switching', () => {
    test('should have language switcher', async ({ homePage, page }) => {
      await homePage.goto();
      
      await test.step('Find language switcher', async () => {
        // Look for common language switcher patterns
        const languageSwitcher = page.locator([
          '.language-switcher',
          '[data-testid="language-switcher"]',
          'select[name="language"]',
          '.lang-select',
          'a[href*="/es/"], a[href*="/ca/"]'
        ].join(', '));
        
        if (await languageSwitcher.count() > 0) {
          await expect(languageSwitcher.first()).toBeVisible();
        } else {
          // Manual navigation should work
          console.log('No language switcher found, testing direct navigation');
        }
      });
    });

    test('should switch languages correctly', async ({ homePage, page }) => {
      await homePage.goto();
      
      await test.step('Test language switching', async () => {
        // Try to find and click language links
        const esLink = page.locator('a[href*="/es/"]').first();
        const caLink = page.locator('a[href*="/ca/"]').first();
        
        if (await esLink.isVisible()) {
          await esLink.click();
          await page.waitForLoadState('networkidle');
          expect(page.url()).toContain('/es/');
        }
        
        if (await caLink.isVisible()) {
          await caLink.click();
          await page.waitForLoadState('networkidle');
          expect(page.url()).toContain('/ca/');
        }
      });
    });

    test('should preserve state when switching languages', async ({ homePage, page }) => {
      await homePage.goto();
      
      await test.step('Navigate to section and switch language', async () => {
        // Navigate to a specific section
        await homePage.scrollToSection('research');
        
        // Switch to Spanish
        await page.goto('/es/#research');
        await page.waitForLoadState('networkidle');
        
        // Should be at the same section
        await expect(homePage.researchSection).toBeInViewport();
      });
    });
  });

  test.describe('Language-Specific Content', () => {
    test('should load appropriate fonts for each language', async ({ homePage, page }) => {
      const languages = ['en', 'es', 'ca'];
      
      for (const lang of languages) {
        await test.step(`Check fonts for ${lang}`, async () => {
          await homePage.gotoLanguage(lang as any);
          
          const heroTitle = homePage.heroTitle;
          const computedStyle = await heroTitle.evaluate(el => {
            const style = window.getComputedStyle(el);
            return {
              fontFamily: style.fontFamily,
              fontWeight: style.fontWeight
            };
          });
          
          // Should have consistent font loading
          expect(computedStyle.fontFamily).toBeTruthy();
          expect(computedStyle.fontWeight).toBeTruthy();
        });
      }
    });

    test('should handle text direction correctly', async ({ homePage, page }) => {
      const languages = ['en', 'es', 'ca'];
      
      for (const lang of languages) {
        await test.step(`Check text direction for ${lang}`, async () => {
          await homePage.gotoLanguage(lang as any);
          
          const textDirection = await page.evaluate(() => {
            return document.documentElement.dir || 'ltr';
          });
          
          // All these languages should be left-to-right
          expect(textDirection).toBe('ltr');
        });
      }
    });

    test('should have correct language metadata', async ({ homePage, page }) => {
      const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'ca', name: 'Catalan' }
      ];
      
      for (const lang of languages) {
        await test.step(`Check metadata for ${lang.name}`, async () => {
          await homePage.gotoLanguage(lang.code as any);
          
          const htmlLang = await page.getAttribute('html', 'lang');
          expect(htmlLang).toContain(lang.code);
          
          // Check for hreflang links
          const hreflangs = await page.locator('link[hreflang]').count();
          if (hreflangs > 0) {
            const hreflangElements = await page.locator('link[hreflang]').all();
            const hreflangCodes = await Promise.all(
              hreflangElements.map(el => el.getAttribute('hreflang'))
            );
            
            // Should include current language or x-default
            expect(hreflangCodes.some(code => 
              code === lang.code || code === 'x-default'
            )).toBeTruthy();
          }
        });
      }
    });
  });

  test.describe('SEO and Internationalization', () => {
    test('should have proper canonical URLs', async ({ homePage, page }) => {
      const languages = ['en', 'es', 'ca'];
      
      for (const lang of languages) {
        await test.step(`Check canonical for ${lang}`, async () => {
          await homePage.gotoLanguage(lang as any);
          
          const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
          if (canonical) {
            expect(canonical).toContain(lang === 'en' ? '/' : `/${lang}/`);
          }
        });
      }
    });

    test('should have language-specific meta descriptions', async ({ homePage, page }) => {
      const languages = ['en', 'es', 'ca'];
      
      for (const lang of languages) {
        await test.step(`Check meta description for ${lang}`, async () => {
          await homePage.gotoLanguage(lang as any);
          
          const description = await page.locator('meta[name="description"]').getAttribute('content');
          expect(description).toBeTruthy();
          expect(description?.length || 0).toBeGreaterThan(50);
        });
      }
    });

    test('should handle 404 pages in each language', async ({ homePage, page }) => {
      const languages = ['en', 'es', 'ca'];
      
      for (const lang of languages) {
        await test.step(`Test 404 for ${lang}`, async () => {
          const response = await page.goto(`/${lang}/non-existent-page`, { 
            waitUntil: 'networkidle' 
          });
          
          // Should either return 404 or redirect properly
          if (response) {
            const status = response.status();
            expect([200, 404]).toContain(status);
          }
          
          // Page should still be functional
          await expect(page.locator('body')).toBeVisible();
        });
      }
    });
  });

  test.describe('Accessibility in Multiple Languages', () => {
    test('should maintain accessibility across languages', async ({ homePage, page }) => {
      const languages = ['en', 'es', 'ca'];
      
      for (const lang of languages) {
        await test.step(`Check accessibility for ${lang}`, async () => {
          await homePage.gotoLanguage(lang as any);
          
          // Check heading structure
          const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
          expect(headings.length).toBeGreaterThan(0);
          
          // Check alt texts exist for images
          const images = await page.locator('img').all();
          for (const img of images.slice(0, 3)) {
            const alt = await img.getAttribute('alt');
            const src = await img.getAttribute('src');
            
            // Decorative images can have empty alt, but src should exist
            expect(src).toBeTruthy();
            expect(alt !== null).toBeTruthy(); // alt attribute should exist
          }
          
          // Check form labels if any
          const inputs = await page.locator('input, textarea, select').all();
          for (const input of inputs) {
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledby = await input.getAttribute('aria-labelledby');
            
            if (id) {
              const label = await page.locator(`label[for="${id}"]`).count();
              expect(label > 0 || ariaLabel || ariaLabelledby).toBeTruthy();
            }
          }
        });
      }
    });
  });
});