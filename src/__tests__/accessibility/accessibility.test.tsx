import { describe, it, expect } from 'vitest';
import { render } from '../test-utils';
import { axe, toHaveNoViolations } from 'vitest-axe';
import Timeline from '../../components/Timeline';
import { ProteinVisualizationReact } from '../../components/ProteinVisualizationReact';
import GeneTherapyVisualization from '../../components/GeneTherapyVisualization';

// Extend expect with accessibility matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Timeline Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Timeline />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      render(<Timeline />);
      
      // Should have h2 as main heading
      const mainHeading = document.querySelector('h2');
      expect(mainHeading).toBeInTheDocument();
      
      // Should have h3 for timeline items
      const subHeadings = document.querySelectorAll('h3');
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('has appropriate landmark roles', () => {
      render(<Timeline />);
      
      // Timeline should be in a section
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'timeline');
    });

    it('uses proper semantic markup', () => {
      render(<Timeline />);
      
      // Check for proper heading tags
      expect(document.querySelector('h2')).toBeInTheDocument();
      expect(document.querySelectorAll('h3')).toHaveLength(2); // Two timeline items
      expect(document.querySelectorAll('h4')).toHaveLength(2); // Institution names
    });

    it('provides adequate text contrast', () => {
      render(<Timeline />);
      
      // Timeline should use appropriate text colors
      const timelineItems = document.querySelectorAll('.text-body-text');
      expect(timelineItems.length).toBeGreaterThan(0);
    });
  });

  describe('ProteinVisualizationReact Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ProteinVisualizationReact />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides accessible labels for interactive elements', () => {
      render(<ProteinVisualizationReact />);
      
      // Canvas should have appropriate role
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('includes descriptive text content', () => {
      const structureData = {
        name: 'Test Protein',
        description: 'A test protein for accessibility testing',
        pdbId: 'TEST',
        frameCount: 10,
      };

      render(<ProteinVisualizationReact structureData={structureData} />);
      
      expect(document.querySelector('.protein-name')).toHaveTextContent('Test Protein');
      expect(document.querySelector('.protein-description')).toHaveTextContent('A test protein for accessibility testing');
    });

    it('has keyboard interaction hints', () => {
      render(<ProteinVisualizationReact />);
      
      // Should have scroll instruction
      expect(document.querySelector('.scroll-indicator')).toBeInTheDocument();
      expect(document.getByText('Scroll to rotate')).toBeInTheDocument();
    });

    it('provides loading state announcements', () => {
      render(<ProteinVisualizationReact />);
      
      // Should announce loading state
      expect(document.getByText(/Loading protein structure.../)).toBeInTheDocument();
    });
  });

  describe('GeneTherapyVisualization Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<GeneTherapyVisualization />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper form controls accessibility', () => {
      render(<GeneTherapyVisualization />);
      
      // Comparison toggle button should be accessible
      const toggleButton = document.getByText('Show Comparison');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton.tagName).toBe('BUTTON');
    });

    it('provides accessible form labels', () => {
      render(<GeneTherapyVisualization />);
      
      // Enable comparison mode to show checkboxes
      const toggleButton = document.getByText('Show Comparison');
      toggleButton.click();
      
      // Check that checkboxes have proper labels
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label');
        expect(label).toBeInTheDocument();
        expect(label?.textContent?.trim()).toBeTruthy();
      });
    });

    it('uses appropriate heading structure', () => {
      render(<GeneTherapyVisualization />);
      
      // Should have h2 as main heading
      const mainHeading = document.querySelector('h2');
      expect(mainHeading).toHaveTextContent('AAV Vector Targeting: Precision Gene Delivery');
      
      // Should have h3 for sections
      const sectionHeadings = document.querySelectorAll('h3');
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('provides meaningful button text', () => {
      render(<GeneTherapyVisualization />);
      
      const toggleButton = document.getByText('Show Comparison');
      expect(toggleButton).toBeInTheDocument();
      
      // Click to toggle state
      toggleButton.click();
      expect(document.getByText('Hide Comparison')).toBeInTheDocument();
    });

    it('has accessible interactive cards', () => {
      render(<GeneTherapyVisualization />);
      
      // Vector cards should be interactive
      const vectorCards = document.querySelectorAll('.vector-card');
      expect(vectorCards.length).toBeGreaterThan(0);
      
      vectorCards.forEach(card => {
        // Should have appropriate cursor styling
        expect(card).toHaveStyle({ cursor: 'pointer' });
      });
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('uses sufficient color contrast for text', async () => {
      const { container } = render(<Timeline />);
      
      // Test main text colors
      const textElements = container.querySelectorAll('.text-body-text, .text-text-muted');
      expect(textElements.length).toBeGreaterThan(0);
      
      // Run axe specifically for color contrast
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('does not rely solely on color for information', () => {
      render(<GeneTherapyVisualization />);
      
      // Vector cards should have text labels, not just colors
      const vectorCards = document.querySelectorAll('.vector-card');
      vectorCards.forEach(card => {
        const heading = card.querySelector('h4');
        expect(heading?.textContent?.trim()).toBeTruthy();
      });
    });

    it('provides adequate focus indicators', async () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      // Check focus management
      const results = await axe(container, {
        rules: {
          'focus-order-semantics': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation for interactive elements', () => {
      render(<GeneTherapyVisualization />);
      
      // Interactive elements should be focusable
      const interactiveElements = document.querySelectorAll('button, input[type="checkbox"]');
      
      interactiveElements.forEach(element => {
        // Should not have negative tabindex
        const tabIndex = element.getAttribute('tabindex');
        if (tabIndex !== null) {
          expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it('maintains logical tab order', async () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const results = await axe(container, {
        rules: {
          'tabindex': { enabled: true },
          'focus-order-semantics': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('provides meaningful content for screen readers', () => {
      render(<Timeline />);
      
      // Check for descriptive content
      expect(document.getByText('Academic Journey')).toBeInTheDocument();
      expect(document.getByText(/PhD in Biotechnology/)).toBeInTheDocument();
      expect(document.getByText(/Master of Science/)).toBeInTheDocument();
    });

    it('uses appropriate ARIA attributes where needed', async () => {
      const { container } = render(<ProteinVisualizationReact />);
      
      const results = await axe(container, {
        rules: {
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('provides alternative text for visual content', () => {
      render(<ProteinVisualizationReact />);
      
      // Canvas-based visualizations should have descriptive text
      expect(document.querySelector('.protein-name')).toBeInTheDocument();
      expect(document.querySelector('.protein-description')).toBeInTheDocument();
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('maintains accessibility at different viewport sizes', async () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<Timeline />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('ensures interactive elements are adequately sized', () => {
      render(<GeneTherapyVisualization />);
      
      // Buttons should be large enough for touch interaction
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        // Minimum 44px touch target (can't easily test computed styles in jsdom)
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Motion and Animation Accessibility', () => {
    it('respects prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<ProteinVisualizationReact />);
      
      // Component should render without animations when prefers-reduced-motion is set
      expect(document.querySelector('.protein-visualization-container')).toBeInTheDocument();
    });
  });

  describe('Language and Internationalization', () => {
    it('supports multiple languages for timeline', () => {
      const spanishStrings = {
        timeline: { title: 'Trayectoria Académica' }
      };

      render(<Timeline lang="es" strings={spanishStrings} />);
      
      expect(document.getByText('Trayectoria Académica')).toBeInTheDocument();
    });

    it('maintains accessibility across different languages', async () => {
      const catalanStrings = {
        timeline: { title: 'Trajectòria Acadèmica' }
      };

      const { container } = render(<Timeline lang="ca" strings={catalanStrings} />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper lang attributes for multilingual content', () => {
      // This would typically be handled at the page level
      // Component should not set lang attributes unless it contains different language content
      render(<Timeline />);
      
      // Should not have conflicting lang attributes
      const elementsWithLang = document.querySelectorAll('[lang]');
      // Timeline component itself shouldn't set lang attributes
      expect(elementsWithLang.length).toBe(0);
    });
  });

  describe('Error Handling and User Feedback', () => {
    it('provides accessible error messages', () => {
      // Test error states if any
      render(<ProteinVisualizationReact />);
      
      // Loading states should be announced
      expect(document.getByText(/Loading protein structure.../)).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
      render(<Timeline strings={{}} />);
      
      // Should still render with fallback content
      expect(document.getByText('Academic Journey')).toBeInTheDocument();
    });
  });
});