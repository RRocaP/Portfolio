import { describe, it, expect } from 'vitest';
import { render } from '../test-utils';
import Timeline from '../../components/Timeline';
import { ProteinVisualizationReact } from '../../components/ProteinVisualizationReact';
import GeneTherapyVisualization from '../../components/GeneTherapyVisualization';

describe('Component Snapshot Tests', () => {
  describe('Timeline Component Snapshots', () => {
    it('renders with default props', () => {
      const { container } = render(<Timeline />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with English language', () => {
      const strings = {
        timeline: {
          title: 'Academic Journey',
          institutions: {
            uab: 'Autonomous University of Barcelona'
          }
        }
      };
      
      const { container } = render(<Timeline lang="en" strings={strings} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with Spanish language', () => {
      const strings = {
        timeline: {
          title: 'Trayectoria Académica',
          institutions: {
            uab: 'Universidad Autónoma de Barcelona'
          }
        }
      };
      
      const { container } = render(<Timeline lang="es" strings={strings} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with Catalan language', () => {
      const strings = {
        timeline: {
          title: 'Trajectòria Acadèmica',
          institutions: {
            uab: 'Universitat Autònoma de Barcelona'
          }
        }
      };
      
      const { container } = render(<Timeline lang="ca" strings={strings} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with custom strings', () => {
      const customStrings = {
        timeline: {
          title: 'My Custom Timeline',
          institutions: {
            uab: 'Custom University Name'
          }
        }
      };
      
      const { container } = render(<Timeline strings={customStrings} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with minimal strings', () => {
      const minimalStrings = {};
      
      const { container } = render(<Timeline strings={minimalStrings} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('ProteinVisualizationReact Component Snapshots', () => {
    it('renders with default props', () => {
      const { container } = render(<ProteinVisualizationReact />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with custom structure data', () => {
      const customStructureData = {
        name: 'Test Enzyme',
        description: 'A custom enzyme for testing visualization',
        pdbId: 'TEST',
        frameCount: 90,
      };
      
      const { container } = render(
        <ProteinVisualizationReact structureData={customStructureData} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with custom configuration', () => {
      const customConfig = {
        frameCount: 60,
        frameBasePath: '/custom-frames/',
        frameFormat: '.png',
        scrollSensitivity: 0.8,
        smoothingFactor: 0.2,
      };
      
      const { container } = render(
        <ProteinVisualizationReact config={customConfig} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <ProteinVisualizationReact className="custom-visualization-class" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with minimal configuration', () => {
      const minimalStructureData = {
        name: 'Simple Protein',
        description: 'Basic protein structure',
        pdbId: 'SIMP',
        frameCount: 30,
      };
      
      const minimalConfig = {
        frameCount: 30,
      };
      
      const { container } = render(
        <ProteinVisualizationReact 
          structureData={minimalStructureData}
          config={minimalConfig}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('GeneTherapyVisualization Component Snapshots', () => {
    it('renders with default state', () => {
      const { container } = render(<GeneTherapyVisualization />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders the complete component structure', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      // Take snapshot of the entire component
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders vector selector section', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const vectorSelector = container.querySelector('.vector-selector');
      expect(vectorSelector).toMatchSnapshot();
    });

    it('renders organ targeting map section', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const bodyMap = container.querySelector('.body-map');
      expect(bodyMap).toMatchSnapshot();
    });

    it('renders success metrics section', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const successMetrics = container.querySelector('.success-metrics');
      expect(successMetrics).toMatchSnapshot();
    });

    it('renders vector cards layout', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const vectorGrid = container.querySelector('.vector-grid');
      expect(vectorGrid).toMatchSnapshot();
    });

    it('renders individual vector card', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const firstVectorCard = container.querySelector('.vector-card');
      expect(firstVectorCard).toMatchSnapshot();
    });

    it('renders comparison section in hidden state', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const comparisonSection = container.querySelector('.comparison-section');
      expect(comparisonSection).toMatchSnapshot();
    });

    it('renders metrics grid layout', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const metricsGrid = container.querySelector('.metrics-grid');
      expect(metricsGrid).toMatchSnapshot();
    });

    it('renders individual metric card', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      const firstMetricCard = container.querySelector('.metric-card');
      expect(firstMetricCard).toMatchSnapshot();
    });
  });

  describe('Component States Snapshots', () => {
    it('captures Timeline with hover states (simulated)', () => {
      const { container } = render(<Timeline />);
      
      // Timeline items have hover effects via CSS classes
      const timelineItems = container.querySelectorAll('.hover\\:border-accent-yellow\\/30');
      expect(timelineItems.length).toBeGreaterThan(0);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('captures ProteinVisualization loading state', () => {
      const { container } = render(<ProteinVisualizationReact />);
      
      // Loading state should be visible
      const loadingOverlay = container.querySelector('.loading-overlay');
      expect(loadingOverlay).toMatchSnapshot();
    });

    it('captures GeneTherapy with all vector information visible', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      // All vector cards should be rendered
      const vectorCards = container.querySelectorAll('.vector-card');
      expect(vectorCards).toHaveLength(5);
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Responsive Layout Snapshots', () => {
    it('captures Timeline mobile layout simulation', () => {
      // Simulate smaller viewport by checking responsive classes
      const { container } = render(<Timeline />);
      
      // Components should have responsive classes
      const responsiveElements = container.querySelectorAll('.md\\:flex-row');
      expect(responsiveElements.length).toBeGreaterThan(0);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('captures GeneTherapy grid layouts', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      // Grid layouts should be captured
      const vectorGrid = container.querySelector('.vector-grid');
      const metricsGrid = container.querySelector('.metrics-grid');
      const visualizationArea = container.querySelector('.visualization-area');
      
      expect(vectorGrid).toMatchSnapshot();
      expect(metricsGrid).toMatchSnapshot();
      expect(visualizationArea).toMatchSnapshot();
    });
  });

  describe('Content Variation Snapshots', () => {
    it('captures Timeline with different content lengths', () => {
      const longStrings = {
        timeline: {
          title: 'Very Long Academic Journey Title That Spans Multiple Lines',
          institutions: {
            uab: 'Very Long University Name That Tests Text Wrapping Behavior'
          }
        }
      };
      
      const { container } = render(<Timeline strings={longStrings} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('captures ProteinVisualization with long descriptions', () => {
      const longDescriptionData = {
        name: 'Extremely Long Protein Name That Tests Layout Flexibility',
        description: 'This is a very long description that tests how the component handles extensive text content and ensures proper text wrapping and layout maintenance across different content lengths.',
        pdbId: 'LONG',
        frameCount: 120,
      };
      
      const { container } = render(
        <ProteinVisualizationReact structureData={longDescriptionData} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Edge Cases Snapshots', () => {
    it('captures Timeline with empty strings object', () => {
      const { container } = render(<Timeline strings={{}} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('captures ProteinVisualization with minimal config', () => {
      const minimalConfig = { frameCount: 1 };
      
      const { container } = render(
        <ProteinVisualizationReact config={minimalConfig} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('captures GeneTherapy component on initial render', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      // Should capture the initial state with no selections
      const selectedCards = container.querySelectorAll('.vector-card.selected');
      expect(selectedCards).toHaveLength(0);
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('CSS Classes and Styling Snapshots', () => {
    it('captures Timeline with all CSS classes applied', () => {
      const { container } = render(<Timeline />);
      
      // Verify key styling classes are present
      const sectionElement = container.querySelector('section');
      expect(sectionElement).toHaveClass('col-span-12', 'py-24', 'bg-surface-1');
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('captures ProteinVisualization styling structure', () => {
      const { container } = render(<ProteinVisualizationReact />);
      
      // Key styling elements should be present
      const visualizationContainer = container.querySelector('.protein-visualization-container');
      const canvas = container.querySelector('.protein-canvas');
      const scrollIndicator = container.querySelector('.scroll-indicator');
      
      expect(visualizationContainer).not.toBeNull();
      expect(canvas).not.toBeNull();
      expect(scrollIndicator).not.toBeNull();
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('captures GeneTherapy component styling hierarchy', () => {
      const { container } = render(<GeneTherapyVisualization />);
      
      // Verify styling structure
      const geneTherapyContainer = container.querySelector('.gene-therapy-container');
      const vectorGrid = container.querySelector('.vector-grid');
      const metricsGrid = container.querySelector('.metrics-grid');
      
      expect(geneTherapyContainer).not.toBeNull();
      expect(vectorGrid).not.toBeNull();
      expect(metricsGrid).not.toBeNull();
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Internationalization Snapshots', () => {
    it('compares Timeline across all languages', () => {
      const languages = [
        {
          lang: 'en' as const,
          strings: { timeline: { title: 'Academic Journey' } }
        },
        {
          lang: 'es' as const,
          strings: { timeline: { title: 'Trayectoria Académica' } }
        },
        {
          lang: 'ca' as const,
          strings: { timeline: { title: 'Trajectòria Acadèmica' } }
        }
      ];

      languages.forEach(({ lang, strings }) => {
        const { container } = render(<Timeline lang={lang} strings={strings} />);
        expect(container.firstChild).toMatchSnapshot(`timeline-${lang}`);
      });
    });
  });
});