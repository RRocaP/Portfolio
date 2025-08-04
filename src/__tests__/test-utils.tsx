import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Make React available globally for JSX
globalThis.React = React;

// Mock i18n functionality
export const mockI18n = {
  en: {
    navigation: {
      home: 'Home',
      research: 'Research',
      publications: 'Publications',
      timeline: 'Timeline',
      contact: 'Contact',
    },
    hero: {
      title: 'Dr. Ramon Viñas',
      subtitle: 'Molecular Biologist & Protein Engineer',
      description: 'Pioneering research in gene therapy, protein engineering, and antimicrobial resistance.',
    },
    research: {
      title: 'Research Areas',
      geneTherapy: 'Gene Therapy',
      proteinEngineering: 'Protein Engineering',
      antimicrobialResistance: 'Antimicrobial Resistance',
    },
    timeline: {
      title: 'Career Timeline',
      present: 'Present',
    },
    publications: {
      title: 'Publications',
      viewPaper: 'View Paper',
      citations: 'citations',
    },
    contact: {
      title: 'Contact',
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
  },
};

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const createMockProteinData = () => ({
  id: 'test-protein-1',
  name: 'Test Protein',
  sequence: 'MKLLHVAAGLVLLGAALGVVPGAVAGVVGAVAGVVGAVAGVVGAV',
  structure: {
    alpha: 45,
    beta: 30,
    loop: 25,
  },
  bindingSites: [
    { position: 10, type: 'active' },
    { position: 25, type: 'allosteric' },
  ],
});

export const createMockPublicationData = () => ({
  id: 'pub-1',
  title: 'Test Publication Title',
  authors: ['Dr. Ramon Viñas', 'Dr. Test Author'],
  journal: 'Test Journal',
  year: 2023,
  doi: '10.1000/test.doi',
  pmid: '12345678',
  citations: 42,
  abstract: 'This is a test abstract for testing purposes.',
  keywords: ['protein engineering', 'gene therapy'],
});

export const createMockTimelineData = () => ({
  id: 'timeline-1',
  date: '2023-01-01',
  title: 'Test Position',
  organization: 'Test University',
  description: 'Test description for timeline item',
  type: 'position' as const,
  achievements: ['Achievement 1', 'Achievement 2'],
});

// Mock functions for common browser APIs
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

// Accessibility test helper
export const axeMatchers = {
  toHaveNoViolations: expect.extend({
    async toHaveNoViolations(received) {
      // This would be implemented with vitest-axe
      return {
        pass: true,
        message: () => 'Expected element to have no accessibility violations',
      };
    },
  }),
};

// Animation test helpers
export const mockAnimationFrame = () => {
  let id = 0;
  const callbacks = new Map();

  global.requestAnimationFrame = vi.fn((callback) => {
    const currentId = ++id;
    callbacks.set(currentId, callback);
    return currentId;
  });

  global.cancelAnimationFrame = vi.fn((id) => {
    callbacks.delete(id);
  });

  const triggerAnimationFrame = (timestamp = performance.now()) => {
    callbacks.forEach((callback) => callback(timestamp));
    callbacks.clear();
  };

  return { triggerAnimationFrame };
};

// D3 mock helpers
export const mockD3Selection = () => ({
  select: vi.fn().mockReturnThis(),
  selectAll: vi.fn().mockReturnThis(),
  append: vi.fn().mockReturnThis(),
  attr: vi.fn().mockReturnThis(),
  style: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  data: vi.fn().mockReturnThis(),
  enter: vi.fn().mockReturnThis(),
  exit: vi.fn().mockReturnThis(),
  remove: vi.fn().mockReturnThis(),
  transition: vi.fn().mockReturnThis(),
  duration: vi.fn().mockReturnThis(),
  on: vi.fn().mockReturnThis(),
  call: vi.fn().mockReturnThis(),
  node: vi.fn(() => document.createElement('div')),
  nodes: vi.fn(() => [document.createElement('div')]),
  size: vi.fn(() => 1),
  empty: vi.fn(() => false),
});

// Wait for async operations
export const waitForAsync = (ms = 0) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Test IDs constants
export const TEST_IDS = {
  HERO_SECTION: 'hero-section',
  NAVIGATION: 'navigation',
  TIMELINE: 'timeline',
  PROTEIN_VIEWER: 'protein-viewer',
  PUBLICATIONS: 'publications',
  RESEARCH_IMPACT: 'research-impact',
  CONTACT_FORM: 'contact-form',
  LANGUAGE_SWITCHER: 'language-switcher',
} as const;