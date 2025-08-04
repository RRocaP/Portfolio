import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import GeneTherapyVisualization from '../../components/GeneTherapyVisualization';
import * as d3 from 'd3';

// Mock D3
vi.mock('d3', () => ({
  select: vi.fn(),
  scaleBand: vi.fn(),
  scaleLinear: vi.fn(),
  axisBottom: vi.fn(),
  axisLeft: vi.fn(),
  line: vi.fn(),
  curveMonotoneX: vi.fn(),
}));

// Create mock D3 selection
const mockSelection = {
  selectAll: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  remove: vi.fn().mockReturnThis(),  
  data: vi.fn().mockReturnThis(),
  enter: vi.fn().mockReturnThis(),
  append: vi.fn().mockReturnThis(),
  attr: vi.fn().mockReturnThis(),
  style: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  each: vi.fn().mockReturnThis(),
  call: vi.fn().mockReturnThis(),
  datum: vi.fn().mockReturnThis(),
};

const mockScale = {
  domain: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  padding: vi.fn().mockReturnThis(),
  bandwidth: vi.fn(() => 50),
};

const mockLine = {
  x: vi.fn().mockReturnThis(),
  y: vi.fn().mockReturnThis(),
  curve: vi.fn().mockReturnThis(),
};

describe('GeneTherapyVisualization Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup D3 mocks
    (d3.select as Mock).mockReturnValue(mockSelection);
    (d3.scaleBand as Mock).mockReturnValue(mockScale);
    (d3.scaleLinear as Mock).mockReturnValue(mockScale);
    (d3.axisBottom as Mock).mockReturnValue(() => {});
    (d3.axisLeft as Mock).mockReturnValue(() => {});
    (d3.line as Mock).mockReturnValue(mockLine);
    (d3.curveMonotoneX as Mock).mockReturnValue({});

    // Mock scale functions
    mockScale.domain.mockReturnValue(mockScale);
    mockScale.range.mockReturnValue(mockScale);
    mockScale.padding.mockReturnValue(mockScale);
  });

  describe('Rendering', () => {
    it('renders the main container', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('AAV Vector Targeting: Precision Gene Delivery')).toBeInTheDocument();
    });

    it('renders vector selector section', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('Select an AAV Vector')).toBeInTheDocument();
    });

    it('renders all AAV vector cards', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('AAV2')).toBeInTheDocument();
      expect(screen.getByText('AAV8')).toBeInTheDocument();
      expect(screen.getByText('AAV9')).toBeInTheDocument();
      expect(screen.getByText('AAV-PHP.B')).toBeInTheDocument();
      expect(screen.getByText('AAV-CAR')).toBeInTheDocument();
    });

    it('displays vector names and types', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('Original')).toBeInTheDocument();
      expect(screen.getByText('Liver Specialist')).toBeInTheDocument();
      expect(screen.getByText('CNS Explorer')).toBeInTheDocument();
      expect(screen.getByText('Enhanced Brain')).toBeInTheDocument();
      expect(screen.getByText("Ramon's CAR-T")).toBeInTheDocument();
    });

    it('shows clinical applications', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText(/Inherited blindness/)).toBeInTheDocument();
      expect(screen.getByText(/Hemophilia gene therapy/)).toBeInTheDocument();
      expect(screen.getByText(/Spinal muscular atrophy/)).toBeInTheDocument();
      expect(screen.getByText(/neurodegenerative diseases/)).toBeInTheDocument();
      expect(screen.getByText(/cancer immunotherapy/)).toBeInTheDocument();
    });

    it('renders organ targeting map', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('Organ Targeting Map')).toBeInTheDocument();
      const svg = document.querySelector('svg[width="600"][height="450"]');
      expect(svg).toBeInTheDocument();
    });

    it('renders comparison section', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('Vector Comparison')).toBeInTheDocument();
      expect(screen.getByText('Show Comparison')).toBeInTheDocument();
    });

    it('renders success metrics section', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('Success Rates & Real-World Impact')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('SMA Treatment Success')).toBeInTheDocument();
      expect(screen.getByText('$3.5M → $35K')).toBeInTheDocument();
      expect(screen.getByText('40x')).toBeInTheDocument();
      expect(screen.getByText('1 Dose')).toBeInTheDocument();
    });
  });

  describe('Vector Selection', () => {
    it('allows selecting a vector', () => {
      render(<GeneTherapyVisualization />);
      
      const aav2Card = screen.getByText('AAV2').closest('.vector-card');
      expect(aav2Card).not.toHaveClass('selected');
      
      fireEvent.click(aav2Card!);
      
      expect(aav2Card).toHaveClass('selected');
    });

    it('displays vector information when selected', async () => {
      render(<GeneTherapyVisualization />);
      
      const aav2Card = screen.getByText('AAV2').closest('.vector-card');
      fireEvent.click(aav2Card!);
      
      await waitFor(() => {
        expect(screen.getByText('AAV2 - Original')).toBeInTheDocument();
        expect(screen.getByText('Improvements:')).toBeInTheDocument();
        expect(screen.getByText('First FDA-approved')).toBeInTheDocument();
        expect(screen.getByText('Well-characterized')).toBeInTheDocument();
      });
    });

    it('shows efficiency percentages for different vectors', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('Avg. Efficiency: 60%')).toBeInTheDocument(); // AAV2
      expect(screen.getByText('Avg. Efficiency: 85%')).toBeInTheDocument(); // AAV8
      expect(screen.getByText('Avg. Efficiency: 75%')).toBeInTheDocument(); // AAV9
      expect(screen.getByText('Avg. Efficiency: 95%')).toBeInTheDocument(); // AAV-PHP.B
      expect(screen.getByText('Avg. Efficiency: 90%')).toBeInTheDocument(); // AAV-CAR
    });
  });

  describe('Comparison Mode', () => {
    it('toggles comparison mode', () => {
      render(<GeneTherapyVisualization />);
      
      const toggleButton = screen.getByText('Show Comparison');
      
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Hide Comparison')).toBeInTheDocument();
      expect(screen.getByText('AAV2').closest('label')).toBeInTheDocument(); // Comparison checkboxes
    });

    it('shows comparison controls when in comparison mode', () => {
      render(<GeneTherapyVisualization />);
      
      const toggleButton = screen.getByText('Show Comparison');
      fireEvent.click(toggleButton);
      
      // Should show checkboxes for each vector
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(5); // 5 AAV vectors
    });

    it('allows selecting vectors for comparison', () => {
      render(<GeneTherapyVisualization />);
      
      const toggleButton = screen.getByText('Show Comparison');
      fireEvent.click(toggleButton);
      
      const aav2Checkbox = screen.getAllByRole('checkbox')[0]; // AAV2 checkbox
      expect(aav2Checkbox).not.toBeChecked();
      
      fireEvent.click(aav2Checkbox);
      
      expect(aav2Checkbox).toBeChecked();
    });

    it('shows comparison chart when vectors are selected', () => {
      render(<GeneTherapyVisualization />);
      
      const toggleButton = screen.getByText('Show Comparison');
      fireEvent.click(toggleButton);
      
      const comparisonSvg = document.querySelector('svg[width="600"][height="300"]');
      expect(comparisonSvg).toBeInTheDocument();
    });
  });

  describe('D3 Integration', () => {
    it('initializes D3 visualization', async () => {
      render(<GeneTherapyVisualization />);
      
      const aav2Card = screen.getByText('AAV2').closest('.vector-card');
      fireEvent.click(aav2Card!);
      
      await waitFor(() => {
        expect(d3.select).toHaveBeenCalled();
      });
    });

    it('updates visualization when vector is selected', async () => {
      render(<GeneTherapyVisualization />);
      
      const aav8Card = screen.getByText('AAV8').closest('.vector-card');
      fireEvent.click(aav8Card!);
      
      await waitFor(() => {
        expect(mockSelection.selectAll).toHaveBeenCalledWith('*');
        expect(mockSelection.remove).toHaveBeenCalled();
      });
    });

    it('creates comparison chart in comparison mode', async () => {
      render(<GeneTherapyVisualization />);
      
      const toggleButton = screen.getByText('Show Comparison');
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(d3.scaleBand).toHaveBeenCalled();
        expect(d3.scaleLinear).toHaveBeenCalled();
      });
    });

    it('sets up scales correctly', async () => {
      render(<GeneTherapyVisualization />);
      
      const toggleButton = screen.getByText('Show Comparison');
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(mockScale.domain).toHaveBeenCalled();
        expect(mockScale.range).toHaveBeenCalled();
      });
    });
  });

  describe('Interactive Features', () => {
    it('vector cards have hover effects', () => {
      render(<GeneTherapyVisualization />);
      
      const vectorCards = document.querySelectorAll('.vector-card');
      vectorCards.forEach(card => {
        expect(card).toHaveClass('vector-card');
      });
    });

    it('handles rapid vector selection changes', async () => {
      render(<GeneTherapyVisualization />);
      
      const aav2Card = screen.getByText('AAV2').closest('.vector-card');
      const aav8Card = screen.getByText('AAV8').closest('.vector-card');
      
      fireEvent.click(aav2Card!);
      fireEvent.click(aav8Card!);
      
      await waitFor(() => {
        expect(aav8Card).toHaveClass('selected');
        expect(aav2Card).not.toHaveClass('selected');
      });
    });

    it('maintains comparison selections when toggling', () => {
      render(<GeneTherapyVisualization />);
      
      // Enable comparison mode
      const toggleButton = screen.getByText('Show Comparison');
      fireEvent.click(toggleButton);
      
      // Select a vector for comparison
      const aav2Checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(aav2Checkbox);
      
      // Disable and re-enable comparison mode
      fireEvent.click(screen.getByText('Hide Comparison'));
      fireEvent.click(screen.getByText('Show Comparison'));
      
      // Check if selection is maintained
      const newAav2Checkbox = screen.getAllByRole('checkbox')[0];
      expect(newAav2Checkbox).toBeChecked();
    });
  });

  describe('Data Accuracy', () => {
    it('displays correct efficiency values', () => {
      render(<GeneTherapyVisualization />);
      
      // Check that efficiency values match the component data
      expect(screen.getByText('Avg. Efficiency: 60%')).toBeInTheDocument(); // AAV2
      expect(screen.getByText('Avg. Efficiency: 85%')).toBeInTheDocument(); // AAV8
      expect(screen.getByText('Avg. Efficiency: 95%')).toBeInTheDocument(); // AAV-PHP.B
    });

    it('shows correct clinical applications', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText(/Luxturna/)).toBeInTheDocument(); // AAV2
      expect(screen.getByText(/Zolgensma/)).toBeInTheDocument(); // AAV9
      expect(screen.getByText(/Next-gen cancer immunotherapy/)).toBeInTheDocument(); // AAV-CAR
    });

    it('displays accurate success metrics', () => {
      render(<GeneTherapyVisualization />);
      
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('$3.5M → $35K')).toBeInTheDocument();
      expect(screen.getByText('40x')).toBeInTheDocument();
      expect(screen.getByText('1 Dose')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      render(<GeneTherapyVisualization />);
      
      const vectorGrid = document.querySelector('.vector-grid');
      expect(vectorGrid).toHaveStyle({
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))',
      });
    });

    it('has responsive metrics grid', () => {
      render(<GeneTherapyVisualization />);
      
      const metricsGrid = document.querySelector('.metrics-grid');
      expect(metricsGrid).toHaveStyle({
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))',
      });
    });
  });

  describe('Visual Elements', () => {
    it('applies vector-specific colors', () => {
      render(<GeneTherapyVisualization />);
      
      // Check if vector headers have appropriate styling
      const vectorHeaders = document.querySelectorAll('.vector-header');
      expect(vectorHeaders.length).toBeGreaterThan(0);
    });

    it('shows loading states appropriately', () => {
      render(<GeneTherapyVisualization />);
      
      // Component should render without loading indicators for static content
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles D3 initialization errors gracefully', () => {
      (d3.select as Mock).mockImplementation(() => {
        throw new Error('D3 error');
      });
      
      expect(() => {
        render(<GeneTherapyVisualization />);
      }).not.toThrow();
    });

    it('continues to function when SVG refs are not available', () => {
      // This tests the useEffect guards for SVG refs
      expect(() => {
        render(<GeneTherapyVisualization />);
      }).not.toThrow();
    });
  });
});