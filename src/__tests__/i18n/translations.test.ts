import { describe, it, expect } from 'vitest';
import enTranslations from '../../i18n/en.json';
import esTranslations from '../../i18n/es.json';
import caTranslations from '../../i18n/ca.json';

describe('Translation Tests', () => {
  describe('Translation File Structure', () => {
    it('has consistent structure across all languages', () => {
      const languages = [
        { name: 'English', data: enTranslations },
        { name: 'Spanish', data: esTranslations },
        { name: 'Catalan', data: caTranslations },
      ];

      // Get the structure of English as the reference
      const referenceKeys = getNestedKeys(enTranslations);

      languages.forEach(lang => {
        const langKeys = getNestedKeys(lang.data);
        expect(langKeys).toEqual(referenceKeys);
      });
    });

    it('contains all required top-level sections', () => {
      const requiredSections = ['nav', 'hero', 'research', 'timeline', 'publications', 'contact', 'footer'];
      
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        requiredSections.forEach(section => {
          expect(translations).toHaveProperty(section);
          expect(typeof translations[section as keyof typeof translations]).toBe('object');
        });
      });
    });

    it('has no empty translation values', () => {
      const languages = [
        { name: 'English', data: enTranslations },
        { name: 'Spanish', data: esTranslations },
        { name: 'Catalan', data: caTranslations },
      ];

      languages.forEach(lang => {
        const flattenedTranslations = flattenObject(lang.data);
        Object.entries(flattenedTranslations).forEach(([key, value]) => {
          if (typeof value === 'string') {
            expect(value.trim()).not.toBe('');
          }
        });
      });
    });
  });

  describe('Navigation Translations', () => {
    it('has all navigation items translated', () => {
      const requiredNavItems = ['home', 'research', 'timeline', 'publications', 'contact'];
      
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        requiredNavItems.forEach(item => {
          expect(translations.nav).toHaveProperty(item);
          expect(typeof translations.nav[item as keyof typeof translations.nav]).toBe('string');
          expect(translations.nav[item as keyof typeof translations.nav].trim()).not.toBe('');
        });
      });
    });

    it('maintains navigation consistency across languages', () => {
      expect(enTranslations.nav.home).toBe('Home');
      expect(esTranslations.nav.home).toBe('Inicio');
      expect(caTranslations.nav.home).toBe('Inici');
      
      expect(enTranslations.nav.research).toBe('Research');
      expect(esTranslations.nav.research).toBe('Investigación');
      expect(caTranslations.nav.research).toBe('Recerca');
    });
  });

  describe('Hero Section Translations', () => {
    it('has complete hero content in all languages', () => {
      const requiredHeroFields = ['name', 'title', 'tagline', 'cta_research', 'cta_contact'];
      
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        requiredHeroFields.forEach(field => {
          expect(translations.hero).toHaveProperty(field);
          expect(typeof translations.hero[field as keyof typeof translations.hero]).toBe('string');
        });
      });
    });

    it('maintains name consistency across languages', () => {
      const name = 'Ramon Roca Pinilla';
      expect(enTranslations.hero.name).toBe(name);
      expect(esTranslations.hero.name).toBe(name);
      expect(caTranslations.hero.name).toBe(name);
    });

    it('translates professional titles appropriately', () => {
      expect(enTranslations.hero.title).toContain('Engineer');
      expect(esTranslations.hero.title).toContain('Ingeniero');
      expect(caTranslations.hero.title).toContain('Enginyer');
      
      expect(enTranslations.hero.title).toContain('Biologist');
      expect(esTranslations.hero.title).toContain('Biólogo');
      expect(caTranslations.hero.title).toContain('Biòleg');
    });
  });

  describe('Research Section Translations', () => {
    it('has all research areas translated', () => {
      const requiredAreas = ['antimicrobial', 'protein', 'gene'];
      
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        requiredAreas.forEach(area => {
          expect(translations.research.areas).toHaveProperty(area);
          const areaData = translations.research.areas[area as keyof typeof translations.research.areas];
          expect(areaData).toHaveProperty('title');
          expect(areaData).toHaveProperty('description');
          expect(areaData).toHaveProperty('highlights');
          expect(Array.isArray(areaData.highlights)).toBe(true);
          expect(areaData.highlights.length).toBeGreaterThan(0);
        });
      });
    });

    it('translates scientific terminology consistently', () => {
      // CRISPR should be mentioned in all languages
      const crispMentions = [
        enTranslations.research.areas.antimicrobial.highlights.some(h => h.includes('CRISPR')),
        esTranslations.research.areas.antimicrobial.highlights.some(h => h.includes('CRISPR')),
        caTranslations.research.areas.antimicrobial.highlights.some(h => h.includes('CRISPR')),
      ];
      expect(crispMentions.every(mentioned => mentioned)).toBe(true);
      
      // AAV should be mentioned in gene therapy
      const aavMentions = [
        enTranslations.research.areas.gene.highlights.some(h => h.includes('AAV')),
        esTranslations.research.areas.gene.highlights.some(h => h.includes('AAV')),
        caTranslations.research.areas.gene.highlights.some(h => h.includes('AAV')),
      ];
      expect(aavMentions.every(mentioned => mentioned)).toBe(true);
    });
  });

  describe('Timeline Translations', () => {
    it('has timeline title and institution translations', () => {
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        expect(translations.timeline).toHaveProperty('title');
        expect(translations.timeline).toHaveProperty('institutions');
        expect(translations.timeline.institutions).toHaveProperty('uab');
        expect(translations.timeline.institutions).toHaveProperty('uc_irvine');
      });
    });

    it('translates academic journey appropriately', () => {
      expect(enTranslations.timeline.title).toBe('Academic Journey');
      expect(esTranslations.timeline.title).toBe('Trayectoria Académica');
      expect(caTranslations.timeline.title).toBe('Trajectòria Acadèmica');
    });

    it('maintains institutional name accuracy', () => {
      // UAB should be translated
      expect(enTranslations.timeline.institutions.uab).toBe('Autonomous University of Barcelona');
      expect(esTranslations.timeline.institutions.uab).toBe('Universidad Autónoma de Barcelona');
      expect(caTranslations.timeline.institutions.uab).toBe('Universitat Autònoma de Barcelona');
      
      // UC Irvine should remain consistent (proper noun)
      expect(enTranslations.timeline.institutions.uc_irvine).toBe('UC Irvine');
      expect(esTranslations.timeline.institutions.uc_irvine).toBe('UC Irvine');
      expect(caTranslations.timeline.institutions.uc_irvine).toBe('UC Irvine');
    });
  });

  describe('Publications Section Translations', () => {
    it('has publications section properly translated', () => {
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        expect(translations.publications).toHaveProperty('title');
        expect(translations.publications).toHaveProperty('view_all');
      });
    });

    it('translates publications terminology correctly', () => {
      expect(enTranslations.publications.title).toContain('Publications');
      expect(esTranslations.publications.title).toContain('Publicaciones');
      expect(caTranslations.publications.title).toContain('Publicacions');
    });
  });

  describe('Contact Section Translations', () => {
    it('has complete contact information', () => {
      const requiredContactFields = ['title', 'description', 'email', 'linkedin', 'github', 'orcid'];
      
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        requiredContactFields.forEach(field => {
          expect(translations.contact).toHaveProperty(field);
          expect(typeof translations.contact[field as keyof typeof translations.contact]).toBe('string');
        });
      });
    });

    it('maintains professional platform names', () => {
      // Platform names should remain consistent
      ['linkedin', 'github', 'orcid'].forEach(platform => {
        const enValue = enTranslations.contact[platform as keyof typeof enTranslations.contact];
        const esValue = esTranslations.contact[platform as keyof typeof esTranslations.contact];
        const caValue = caTranslations.contact[platform as keyof typeof caTranslations.contact];
        
        if (platform !== 'email') { // Email might be translated
          expect(enValue).toBe(esValue);
          expect(esValue).toBe(caValue);
        }
      });
    });
  });

  describe('Footer Translations', () => {
    it('has footer content translated', () => {
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        expect(translations.footer).toHaveProperty('copyright');
        expect(translations.footer).toHaveProperty('built_with');
      });
    });

    it('maintains copyright year consistency', () => {
      expect(enTranslations.footer.copyright).toContain('2024');
      expect(esTranslations.footer.copyright).toContain('2024');
      expect(caTranslations.footer.copyright).toContain('2024');
    });

    it('keeps technology names consistent', () => {
      expect(enTranslations.footer.built_with).toContain('Astro');
      expect(esTranslations.footer.built_with).toContain('Astro');
      expect(caTranslations.footer.built_with).toContain('Astro');
      
      expect(enTranslations.footer.built_with).toContain('Tailwind');
      expect(esTranslations.footer.built_with).toContain('Tailwind');
      expect(caTranslations.footer.built_with).toContain('Tailwind');
    });
  });

  describe('Translation Quality', () => {
    it('has no untranslated placeholders', () => {
      const languages = [
        { name: 'Spanish', data: esTranslations },
        { name: 'Catalan', data: caTranslations },
      ];

      languages.forEach(lang => {
        const flattenedTranslations = flattenObject(lang.data);
        Object.entries(flattenedTranslations).forEach(([key, value]) => {
          if (typeof value === 'string') {
            // Check for common placeholder patterns
            expect(value).not.toMatch(/\[.*\]/); // [placeholder]
            expect(value).not.toMatch(/\{.*\}/); // {placeholder}
            expect(value).not.toMatch(/TODO/i); // TODO items
            expect(value).not.toMatch(/FIXME/i); // FIXME items
          }
        });
      });
    });

    it('maintains appropriate text length balance', () => {
      // Translations shouldn't be dramatically longer or shorter
      const keyPaths = [
        'hero.title',
        'research.title',
        'timeline.title',
        'publications.title',
        'contact.title'
      ];

      keyPaths.forEach(path => {
        const enValue = getNestedValue(enTranslations, path);
        const esValue = getNestedValue(esTranslations, path);
        const caValue = getNestedValue(caTranslations, path);

        if (typeof enValue === 'string' && typeof esValue === 'string' && typeof caValue === 'string') {
          const enLength = enValue.length;
          const esLength = esValue.length;
          const caLength = caValue.length;

          // Spanish/Catalan shouldn't be more than 2x longer than English
          expect(esLength).toBeLessThan(enLength * 2);
          expect(caLength).toBeLessThan(enLength * 2);
          
          // And shouldn't be less than half the length
          expect(esLength).toBeGreaterThan(enLength * 0.5);
          expect(caLength).toBeGreaterThan(enLength * 0.5);
        }
      });
    });

    it('uses appropriate punctuation for each language', () => {
      // Spanish uses inverted question marks and exclamation marks
      // This test checks that the translations are linguistically appropriate
      
      // Contact description should be a question or statement
      expect(typeof esTranslations.contact.description).toBe('string');
      expect(typeof caTranslations.contact.description).toBe('string');
      
      // Check that Spanish uses appropriate punctuation
      if (esTranslations.contact.description.includes('?')) {
        expect(esTranslations.contact.description).toMatch(/¿.*\?/);
      }
    });
  });

  describe('Accessibility Considerations', () => {
    it('provides descriptive text for screen readers', () => {
      [enTranslations, esTranslations, caTranslations].forEach(translations => {
        // CTA buttons should be descriptive
        expect(translations.hero.cta_research).not.toBe('Click here');
        expect(translations.hero.cta_contact).not.toBe('Click here');
        
        // Research descriptions should be informative
        Object.values(translations.research.areas).forEach(area => {
          expect(area.description.length).toBeGreaterThan(20);
        });
      });
    });

    it('avoids relying on visual-only cues in text', () => {
      const languages = [
        { name: 'English', data: enTranslations },
        { name: 'Spanish', data: esTranslations },
        { name: 'Catalan', data: caTranslations },
      ];

      languages.forEach(lang => {
        const flattenedTranslations = flattenObject(lang.data);
        Object.entries(flattenedTranslations).forEach(([key, value]) => {
          if (typeof value === 'string') {
            // Avoid phrases like "click here", "see above", "below"
            expect(value.toLowerCase()).not.toContain('click here');
            expect(value.toLowerCase()).not.toContain('see above');
            expect(value.toLowerCase()).not.toContain('see below');
            expect(value.toLowerCase()).not.toContain('shown in red');
            expect(value.toLowerCase()).not.toContain('green button');
          }
        });
      });
    });
  });
});

// Helper functions
function getNestedKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys.push(...getNestedKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  });
  
  return keys.sort();
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], fullKey));
    } else {
      flattened[fullKey] = obj[key];
    }
  });
  
  return flattened;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}