import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, userEvent } from '../test-utils';
import Timeline from '../../components/Timeline';
import { ProteinVisualizationReact } from '../../components/ProteinVisualizationReact';
import GeneTherapyVisualization from '../../components/GeneTherapyVisualization';

// Mock user event
const user = userEvent.setup();

describe('User Workflow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });

    // Mock smooth scrolling
    Element.prototype.scrollIntoView = vi.fn();
  });

  describe('Portfolio Navigation Workflow', () => {
    it('allows user to navigate through timeline chronologically', () => {
      render(<Timeline />);
      
      // User should see timeline in chronological order
      const timelineItems = screen.getAllByRole('heading', { level: 3 });
      expect(timelineItems).toHaveLength(2);
      
      // Check chronological order (most recent first)
      expect(timelineItems[0]).toHaveTextContent('PhD in Biotechnology');
      expect(timelineItems[1]).toHaveTextContent('Master of Science in Biotechnology');
      
      // Verify dates are displayed
      expect(screen.getByText('2020-Present')).toBeInTheDocument();
      expect(screen.getByText('2018-2020')).toBeInTheDocument();
    });

    it('provides comprehensive academic information', () => {
      render(<Timeline />);
      
      // User should get complete information about each position
      expect(screen.getByText(/Autonomous University of Barcelona/)).toBeInTheDocument();
      expect(screen.getByText(/antimicrobial therapies/)).toBeInTheDocument();
      expect(screen.getByText('📍 Barcelona, Spain')).toBeInTheDocument();
      
      expect(screen.getByText('UC Irvine')).toBeInTheDocument();
      expect(screen.getByText(/molecular biotechnology and bioinformatics/)).toBeInTheDocument();
      expect(screen.getByText('📍 Irvine, CA, USA')).toBeInTheDocument();
    });
  });

  describe('Protein Visualization Interaction Workflow', () => {
    it('loads and displays protein visualization progressively', async () => {
      render(<ProteinVisualizationReact />);
      
      // User initially sees loading state
      expect(screen.getByText(/Loading protein structure.../)).toBeInTheDocument();
      
      // Protein information is visible during loading
      expect(screen.getByText('Antimicrobial Peptide LL-37')).toBeInTheDocument();
      expect(screen.getByText(/Human cathelicidin with broad-spectrum antimicrobial activity/)).toBeInTheDocument();
      
      // Interaction hint is provided
      expect(screen.getByText('Scroll to rotate')).toBeInTheDocument();
    });

    it('responds to scroll interactions for protein rotation', async () => {
      render(<ProteinVisualizationReact />);
      
      const canvas = screen.getByRole('img', { hidden: true });
      
      // Verify canvas is interactive
      expect(canvas).toHaveAttribute('class', 'protein-canvas');
      
      // User can interact with mouse wheel
      fireEvent.wheel(canvas, { deltaY: 100 });
      
      // Should not throw errors
      expect(canvas).toBeInTheDocument();
    });

    it('provides feedback during loading process', async () => {
      render(<ProteinVisualizationReact />);
      
      // User sees loading progress
      const loadingText = screen.getByText(/Loading protein structure.../);
      expect(loadingText).toBeInTheDocument();
      
      // Progress percentage should be visible
      expect(loadingText.textContent).toMatch(/\d+%/);
    });

    it('handles different protein configurations', () => {
      const customProtein = {
        name: 'Custom Enzyme',
        description: 'A custom enzyme for testing',
        pdbId: 'CUST',
        frameCount: 60,
      };

      render(<ProteinVisualizationReact structureData={customProtein} />);
      
      expect(screen.getByText('Custom Enzyme')).toBeInTheDocument();
      expect(screen.getByText('A custom enzyme for testing')).toBeInTheDocument();
    });
  });

  describe('Gene Therapy Research Exploration Workflow', () => {
    it('allows user to explore different AAV vectors systematically', async () => {
      render(<GeneTherapyVisualization />);
      
      // User sees overview of all vectors
      expect(screen.getByText('AAV Vector Targeting: Precision Gene Delivery')).toBeInTheDocument();
      expect(screen.getByText('Select an AAV Vector')).toBeInTheDocument();
      
      // All vector options are visible
      expect(screen.getByText('AAV2')).toBeInTheDocument();
      expect(screen.getByText('AAV8')).toBeInTheDocument();
      expect(screen.getByText('AAV9')).toBeInTheDocument();
      expect(screen.getByText('AAV-PHP.B')).toBeInTheDocument();
      expect(screen.getByText('AAV-CAR')).toBeInTheDocument();
      
      // User can see basic information for each
      expect(screen.getByText('Avg. Efficiency: 60%')).toBeInTheDocument(); // AAV2
      expect(screen.getByText('Avg. Efficiency: 95%')).toBeInTheDocument(); // AAV-PHP.B
    });

    it('provides detailed information when user selects a vector', async () => {
      render(<GeneTherapyVisualization />);
      
      // User clicks on AAV2
      const aav2Card = screen.getByText('AAV2').closest('.vector-card');
      expect(aav2Card).not.toHaveClass('selected');
      
      await user.click(aav2Card!);
      
      // Card becomes selected
      expect(aav2Card).toHaveClass('selected');
      
      // Detailed information appears
      await waitFor(() => {
        expect(screen.getByText('AAV2 - Original')).toBeInTheDocument();
        expect(screen.getByText('Improvements:')).toBeInTheDocument();
        expect(screen.getByText('First FDA-approved')).toBeInTheDocument();
        expect(screen.getByText('Well-characterized')).toBeInTheDocument();
      });
    });

    it('enables vector comparison workflow', async () => {
      render(<GeneTherapyVisualization />);
      
      // User wants to compare vectors
      const compareButton = screen.getByText('Show Comparison');
      await user.click(compareButton);
      
      // Comparison mode is activated
      expect(screen.getByText('Hide Comparison')).toBeInTheDocument();
      
      // Comparison controls appear
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(5); // One for each vector
      
      // User selects vectors to compare
      await user.click(checkboxes[0]); // Select AAV2
      await user.click(checkboxes[1]); // Select AAV8
      
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      
      // Comparison chart should be visible
      const comparisonChart = document.querySelector('svg[width="600"][height="300"]');
      expect(comparisonChart).toBeInTheDocument();
    });

    it('shows success metrics and real-world impact', () => {
      render(<GeneTherapyVisualization />);
      
      // User can see research impact
      expect(screen.getByText('Success Rates & Real-World Impact')).toBeInTheDocument();
      
      // Concrete metrics are displayed
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('SMA Treatment Success')).toBeInTheDocument();
      expect(screen.getByText('Zolgensma (AAV9) - Prevents paralysis in infants')).toBeInTheDocument();
      
      expect(screen.getByText('$3.5M → $35K')).toBeInTheDocument();
      expect(screen.getByText('Cost Reduction Potential')).toBeInTheDocument();
      expect(screen.getByText("Ramon's in-vivo CAR-T approach")).toBeInTheDocument();
    });
  });

  describe('Multilingual Content Workflow', () => {
    it('adapts timeline content to different languages', () => {
      const spanishStrings = {
        timeline: {
          title: 'Trayectoria Académica',
          institutions: {
            uab: 'Universidad Autónoma de Barcelona'
          }
        }
      };

      render(<Timeline lang="es" strings={spanishStrings} />);
      
      // User sees content in Spanish
      expect(screen.getByText('Trayectoria Académica')).toBeInTheDocument();
      expect(screen.getByText('Universidad Autónoma de Barcelona')).toBeInTheDocument();
    });

    it('maintains functionality across language changes', () => {
      const catalanStrings = {
        timeline: {
          title: 'Trajectòria Acadèmica'
        }
      };

      render(<Timeline lang="ca" strings={catalanStrings} />);
      
      // All timeline functionality should work in Catalan
      expect(screen.getByText('Trajectòria Acadèmica')).toBeInTheDocument();
      expect(screen.getByText('PhD in Biotechnology')).toBeInTheDocument(); // Fallback for missing translations
    });
  });

  describe('Mobile User Experience Workflow', () => {
    beforeEach(() => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
    });

    it('provides touch-friendly interface for gene therapy exploration', async () => {
      render(<GeneTherapyVisualization />);
      
      // Vector cards should be easily tappable
      const vectorCards = document.querySelectorAll('.vector-card');
      expect(vectorCards.length).toBeGreaterThan(0);
      
      // Cards should have pointer cursor for touch interaction
      vectorCards.forEach(card => {
        expect(card).toHaveStyle({ cursor: 'pointer' });
      });
    });

    it('maintains protein visualization usability on mobile', () => {
      render(<ProteinVisualizationReact />);
      
      // Visualization should be responsive
      const container = document.querySelector('.protein-visualization-container');
      expect(container).toBeInTheDocument();
      
      // Canvas should be present for touch interactions
      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toBeInTheDocument();
    });

    it('adapts timeline layout for mobile viewing', () => {
      render(<Timeline />);
      
      // Timeline should use responsive classes
      const responsiveElements = document.querySelectorAll('.md\\:flex-row');
      expect(responsiveElements.length).toBeGreaterThan(0);
      
      // Content should be accessible on mobile
      expect(screen.getByText('Academic Journey')).toBeInTheDocument();
    });
  });

  describe('Performance and Loading Workflow', () => {
    it('shows progressive loading states to keep user engaged', async () => {
      render(<ProteinVisualizationReact />);
      
      // User sees immediate feedback
      expect(screen.getByText(/Loading protein structure.../)).toBeInTheDocument();
      
      // Protein information is available immediately
      expect(screen.getByText('Antimicrobial Peptide LL-37')).toBeInTheDocument();
      
      // User guidance is provided
      expect(screen.getByText('Scroll to rotate')).toBeInTheDocument();
    });

    it('handles component interactions without blocking UI', async () => {
      render(<GeneTherapyVisualization />);
      
      // User can interact immediately
      const compareButton = screen.getByText('Show Comparison');
      await user.click(compareButton);
      
      // UI responds quickly
      expect(screen.getByText('Hide Comparison')).toBeInTheDocument();
      
      // Multiple rapid interactions work
      await user.click(screen.getByText('Hide Comparison'));
      expect(screen.getByText('Show Comparison')).toBeInTheDocument();
    });
  });

  describe('Error Recovery Workflow', () => {
    it('handles missing data gracefully', () => {
      // Timeline with minimal data
      render(<Timeline strings={{}} />);
      
      // User still gets meaningful content
      expect(screen.getByText('Academic Journey')).toBeInTheDocument();
      expect(screen.getByText('PhD in Biotechnology')).toBeInTheDocument();
    });

    it('provides fallback visualization when protein data fails', () => {
      // Simulate protein loading failure
      const mockConfig = {
        frameCount: 5,
        frameBasePath: '/non-existent-path/',
      };

      render(<ProteinVisualizationReact config={mockConfig} />);
      
      // User still sees the component
      expect(screen.getByText('Antimicrobial Peptide LL-37')).toBeInTheDocument();
      expect(screen.getByText('Scroll to rotate')).toBeInTheDocument();
    });
  });

  describe('Accessibility-First User Workflow', () => {
    it('supports keyboard-only navigation through gene therapy interface', async () => {
      render(<GeneTherapyVisualization />);
      
      // User can navigate to comparison button
      const compareButton = screen.getByText('Show Comparison');
      compareButton.focus();
      
      // User can activate with keyboard
      fireEvent.keyDown(compareButton, { key: 'Enter' });
      
      // Interface responds appropriately
      expect(screen.getByText('Hide Comparison')).toBeInTheDocument();
    });

    it('provides screen reader friendly content structure', () => {
      render(<Timeline />);
      
      // Proper heading hierarchy for screen readers
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Academic Journey');
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subHeadings).toHaveLength(2);
      
      // Descriptive content for each timeline item
      expect(screen.getByText(/Developing next-generation antimicrobial therapies/)).toBeInTheDocument();
      expect(screen.getByText(/Focus on molecular biotechnology and bioinformatics/)).toBeInTheDocument();
    });

    it('maintains focus management during interactions', async () => {
      render(<GeneTherapyVisualization />);
      
      const compareButton = screen.getByText('Show Comparison');
      
      // User focuses on button
      compareButton.focus();
      expect(document.activeElement).toBe(compareButton);
      
      // After interaction, focus is preserved appropriately
      await user.click(compareButton);
      
      // Focus should remain manageable
      expect(document.activeElement).toBeDefined();
    });
  });

  describe('Research Discovery Workflow', () => {
    it('guides user through research exploration journey', () => {
      render(<GeneTherapyVisualization />);
      
      // User starts with clear overview
      expect(screen.getByText('AAV Vector Targeting: Precision Gene Delivery')).toBeInTheDocument();
      
      // Each vector has clear research context
      expect(screen.getByText(/Inherited blindness \(Luxturna\)/)).toBeInTheDocument();
      expect(screen.getByText(/Spinal muscular atrophy \(Zolgensma\)/)).toBeInTheDocument();
      expect(screen.getByText(/Next-gen cancer immunotherapy/)).toBeInTheDocument();
      
      // Real-world impact is highlighted
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('SMA Treatment Success')).toBeInTheDocument();
      expect(screen.getByText('$3.5M → $35K')).toBeInTheDocument();
      expect(screen.getByText('Cost Reduction Potential')).toBeInTheDocument();
    });

    it('enables deep dive into specific research areas', async () => {
      render(<GeneTherapyVisualization />);
      
      // User can explore Ramon's specific contribution
      const carTCard = screen.getByText("Ramon's CAR-T").closest('.vector-card');
      await user.click(carTCard!);
      
      // Detailed information about the innovation
      await waitFor(() => {
        expect(screen.getByText('AAV-CAR - Ramon\'s CAR-T')).toBeInTheDocument();
        expect(screen.getByText('Direct in-vivo CAR-T generation')).toBeInTheDocument();
        expect(screen.getByText('Cost-effective')).toBeInTheDocument();
        expect(screen.getByText('Safer')).toBeInTheDocument();
      });
    });
  });
});