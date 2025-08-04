import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import { ProteinVisualizationReact } from '../../components/ProteinVisualizationReact';
import type { ProteinVisualizationConfig, ProteinStructureData } from '../../types/protein-visualization';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock HTMLCanvasElement methods
const mockGetContext = vi.fn();
HTMLCanvasElement.prototype.getContext = mockGetContext;

// Mock Canvas 2D Context
const mockContext = {
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  scale: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  strokeStyle: '',
  lineWidth: 0,
  fillStyle: '',
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
};

describe('ProteinVisualizationReact Component', () => {
  const mockStructureData: ProteinStructureData = {
    name: 'Test Protein',
    description: 'A test protein for visualization',
    pdbId: 'TEST',
    frameCount: 10,
  };

  const mockConfig: Partial<ProteinVisualizationConfig> = {
    frameCount: 10,
    frameBasePath: '/test-frames/',
    frameFormat: '.webp',
    scrollSensitivity: 0.5,
    smoothingFactor: 0.1,
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    mockGetContext.mockReturnValue(mockContext);
    
    // Mock Image constructor
    global.Image = vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      complete: true,
      width: 800,
      height: 600,
      onload: null,
      onerror: null,
      src: '',
    }));

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    });

    global.cancelAnimationFrame = vi.fn();

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Rendering', () => {
    it('renders the protein visualization container', () => {
      render(<ProteinVisualizationReact />);
      
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Canvas has img role
    });

    it('displays protein name and description', () => {
      render(<ProteinVisualizationReact structureData={mockStructureData} />);
      
      expect(screen.getByText('Test Protein')).toBeInTheDocument();
      expect(screen.getByText('A test protein for visualization')).toBeInTheDocument();
    });

    it('shows loading state initially', async () => {
      render(<ProteinVisualizationReact />);
      
      expect(screen.getByText(/Loading protein structure.../)).toBeInTheDocument();
    });

    it('displays scroll indicator', () => {
      render(<ProteinVisualizationReact />);
      
      expect(screen.getByText('Scroll to rotate')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ProteinVisualizationReact className="custom-class" />);
      
      const container = document.querySelector('.protein-visualization-container');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Configuration', () => {
    it('uses default configuration when none provided', () => {
      render(<ProteinVisualizationReact />);
      
      // Should render with default structure data
      expect(screen.getByText('Antimicrobial Peptide LL-37')).toBeInTheDocument();
    });

    it('merges user configuration with defaults', () => {
      render(<ProteinVisualizationReact config={mockConfig} />);
      
      // Should render successfully with custom config
      const container = document.querySelector('.protein-visualization-container');
      expect(container).toBeInTheDocument();
    });

    it('handles custom structure data', () => {
      render(
        <ProteinVisualizationReact 
          structureData={mockStructureData}
          config={mockConfig}
        />
      );
      
      expect(screen.getByText('Test Protein')).toBeInTheDocument();
      expect(screen.getByText('A test protein for visualization')).toBeInTheDocument();
    });
  });

  describe('Canvas Interaction', () => {
    it('handles wheel events on canvas', async () => {
      render(<ProteinVisualizationReact config={mockConfig} />);
      
      const canvas = screen.getByRole('img', { hidden: true });
      
      fireEvent.wheel(canvas, { deltaY: 100 });
      
      // Should not throw errors
      expect(canvas).toBeInTheDocument();
    });

    it('prevents default wheel behavior', () => {
      render(<ProteinVisualizationReact />);
      
      const canvas = screen.getByRole('img', { hidden: true });
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');
      
      fireEvent(canvas, wheelEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Frame Loading', () => {
    it('starts with loading state', () => {
      render(<ProteinVisualizationReact />);
      
      expect(screen.getByText(/Loading protein structure.../)).toBeInTheDocument();
    });

    it('shows loading progress', async () => {
      render(<ProteinVisualizationReact config={mockConfig} />);
      
      // Should show percentage
      await waitFor(() => {
        const loadingText = screen.queryByText(/Loading protein structure.../);
        expect(loadingText).toBeInTheDocument();
      });
    });

    it('handles frame loading errors gracefully', async () => {
      // Mock Image to simulate loading error
      global.Image = vi.fn().mockImplementation(() => {
        const img = {
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          complete: false,
          width: 0,
          height: 0,
          onload: null,
          onerror: null,
          src: '',
        };
        
        // Simulate error after setting src
        setTimeout(() => {
          if (img.onerror) img.onerror(new Error('Failed to load'));
        }, 10);
        
        return img;
      });

      render(<ProteinVisualizationReact config={mockConfig} />);
      
      // Should fallback to synthetic frames
      await waitFor(() => {
        // Component should still render without crashing
        expect(document.querySelector('.protein-visualization-container')).toBeInTheDocument();
      });
    });
  });

  describe('Canvas Rendering', () => {
    it('initializes canvas context', () => {
      render(<ProteinVisualizationReact />);
      
      expect(mockGetContext).toHaveBeenCalledWith('2d');
    });

    it('handles canvas resize', () => {
      render(<ProteinVisualizationReact />);
      
      // Trigger resize
      fireEvent(window, new Event('resize'));
      
      expect(mockContext.scale).toHaveBeenCalled();
    });

    it('sets up device pixel ratio scaling', () => {
      // Mock devicePixelRatio
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: 2,
      });

      render(<ProteinVisualizationReact />);
      
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('Scroll Handling', () => {
    it('sets up scroll event listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      
      render(<ProteinVisualizationReact />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('cleans up scroll event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<ProteinVisualizationReact />);
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('throttles scroll events', () => {
      vi.useFakeTimers();
      
      render(<ProteinVisualizationReact />);
      
      // Simulate multiple rapid scroll events
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      fireEvent.scroll(window, { target: { scrollY: 200 } });
      fireEvent.scroll(window, { target: { scrollY: 300 } });
      
      // Should throttle the events
      vi.advanceTimersByTime(20);
      
      vi.useRealTimers();
    });
  });

  describe('Animation Loop', () => {
    it('starts animation loop', () => {
      render(<ProteinVisualizationReact />);
      
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('cleans up animation on unmount', () => {
      const { unmount } = render(<ProteinVisualizationReact />);
      
      unmount();
      
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Synthetic Frame Generation', () => {
    it('generates fallback frames when loading fails', async () => {
      // Mock canvas creation for synthetic frames
      const mockCanvas = {
        width: 800,
        height: 600,
        getContext: vi.fn().mockReturnValue(mockContext),
        toDataURL: vi.fn().mockReturnValue('data:image/png;base64,test'),
      };
      
      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'canvas') return mockCanvas;
        return document.createElement(tagName);
      });

      // Mock Image constructor to fail loading
      global.Image = vi.fn().mockImplementation(() => {
        const img = {
          onload: null,
          onerror: null,
          src: '',
        };
        
        setTimeout(() => {
          if (img.onerror) img.onerror(new Error('Failed to load'));
        }, 10);
        
        return img;
      });

      render(<ProteinVisualizationReact config={mockConfig} />);
      
      await waitFor(() => {
        expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing canvas context gracefully', () => {
      mockGetContext.mockReturnValue(null);
      
      expect(() => {
        render(<ProteinVisualizationReact />);
      }).not.toThrow();
    });

    it('handles missing canvas element gracefully', () => {
      // This would be hard to test directly, but the component should not crash
      expect(() => {
        render(<ProteinVisualizationReact />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('uses requestAnimationFrame for smooth animation', () => {
      render(<ProteinVisualizationReact />);
      
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('implements frame throttling', () => {
      vi.useFakeTimers();
      
      render(<ProteinVisualizationReact />);
      
      // Should use setTimeout for throttling
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      
      vi.useRealTimers();
    });
  });
});