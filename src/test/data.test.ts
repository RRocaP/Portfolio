import { describe, it, expect } from 'vitest';
import { publications } from '@/data/publications.js';

describe('Publications Data', () => {
  it('should have valid publication structure', () => {
    expect(publications).toBeDefined();
    expect(Array.isArray(publications)).toBe(true);
    expect(publications.length).toBeGreaterThan(0);
  });

  it('should have required fields for each publication', () => {
    publications.forEach((publication, index) => {
      expect(publication.title, `Publication ${index} missing title`).toBeDefined();
      expect(publication.year, `Publication ${index} missing year`).toBeDefined();
      expect(publication.journal, `Publication ${index} missing journal`).toBeDefined();
      
      // Title should be non-empty string
      expect(typeof publication.title).toBe('string');
      expect(publication.title.length).toBeGreaterThan(0);
      
      // Year should be valid
      expect(typeof publication.year).toBe('string');
      expect(publication.year).toMatch(/^\d{4}$/);
      
      // Journal should be non-empty string
      expect(typeof publication.journal).toBe('string');
      expect(publication.journal.length).toBeGreaterThan(0);
    });
  });

  it('should have valid years within reasonable range', () => {
    const currentYear = new Date().getFullYear();
    publications.forEach((publication, index) => {
      const year = parseInt(publication.year);
      expect(year, `Publication ${index} year out of range`).toBeGreaterThanOrEqual(2000);
      expect(year, `Publication ${index} year in future`).toBeLessThanOrEqual(currentYear + 1);
    });
  });

  it('should have valid featured flag when present', () => {
    publications.forEach((publication, index) => {
      if ('featured' in publication) {
        expect(typeof publication.featured, `Publication ${index} featured flag should be boolean`).toBe('boolean');
      }
    });
  });

  it('should have at least some featured publications', () => {
    const featuredCount = publications.filter(pub => pub.featured).length;
    expect(featuredCount).toBeGreaterThan(0);
  });
});