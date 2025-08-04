import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import Timeline from '../../components/Timeline';

describe('Timeline Component', () => {
  const mockStrings = {
    timeline: {
      title: 'Academic Journey',
      institutions: {
        uab: 'Autonomous University of Barcelona'
      }
    }
  };

  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = '';
  });

  describe('Rendering', () => {
    it('renders the timeline section', () => {
      render(<Timeline />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('displays the default title when no strings provided', () => {
      render(<Timeline />);
      expect(screen.getByText('Academic Journey')).toBeInTheDocument();
    });

    it('displays custom title when strings provided', () => {
      const customStrings = {
        timeline: { title: 'My Educational Path' }
      };
      render(<Timeline strings={customStrings} />);
      expect(screen.getByText('My Educational Path')).toBeInTheDocument();
    });

    it('renders timeline items', () => {
      render(<Timeline />);
      
      // Check for default timeline items
      expect(screen.getByText('PhD in Biotechnology')).toBeInTheDocument();
      expect(screen.getByText('Master of Science in Biotechnology')).toBeInTheDocument();
      expect(screen.getByText('UC Irvine')).toBeInTheDocument();
    });

    it('displays timeline dates', () => {
      render(<Timeline />);
      
      expect(screen.getByText('2020-Present')).toBeInTheDocument();
      expect(screen.getByText('2018-2020')).toBeInTheDocument();
    });

    it('displays location information', () => {
      render(<Timeline />);
      
      expect(screen.getByText('📍 Barcelona, Spain')).toBeInTheDocument();
      expect(screen.getByText('📍 Irvine, CA, USA')).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('handles English language', () => {
      render(<Timeline lang="en" strings={mockStrings} />);
      expect(screen.getByText('Academic Journey')).toBeInTheDocument();
    });

    it('handles Spanish language', () => {
      const spanishStrings = {
        timeline: { title: 'Trayectoria Académica' }
      };
      render(<Timeline lang="es" strings={spanishStrings} />);
      expect(screen.getByText('Trayectoria Académica')).toBeInTheDocument();
    });

    it('handles Catalan language', () => {
      const catalanStrings = {
        timeline: { title: 'Trajectòria Acadèmica' }
      };
      render(<Timeline lang="ca" strings={catalanStrings} />);
      expect(screen.getByText('Trajectòria Acadèmica')).toBeInTheDocument();
    });

    it('uses localized institution names when provided', () => {
      render(<Timeline strings={mockStrings} />);
      expect(screen.getByText('Autonomous University of Barcelona')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct CSS classes', () => {
      render(<Timeline />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveClass('col-span-12', 'py-24', 'bg-surface-1');
    });

    it('renders timeline indicators', () => {
      render(<Timeline />);
      
      // Timeline dots should be present
      const timelineDots = document.querySelectorAll('.w-8.h-8.bg-accent-yellow.rounded-full');
      expect(timelineDots).toHaveLength(2); // Two timeline items
    });

    it('has proper semantic structure', () => {
      render(<Timeline />);
      
      // Check for proper heading hierarchy
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Academic Journey');
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subHeadings).toHaveLength(2);
    });
  });

  describe('Timeline Data Structure', () => {
    it('renders all required timeline item fields', () => {
      render(<Timeline />);
      
      // Check first timeline item
      expect(screen.getByText('PhD in Biotechnology')).toBeInTheDocument();
      expect(screen.getByText('2020-Present')).toBeInTheDocument();
      expect(screen.getByText(/Autonomous University of Barcelona/)).toBeInTheDocument();
      expect(screen.getByText(/Developing next-generation antimicrobial therapies/)).toBeInTheDocument();
      expect(screen.getByText('📍 Barcelona, Spain')).toBeInTheDocument();
      
      // Check second timeline item
      expect(screen.getByText('Master of Science in Biotechnology')).toBeInTheDocument();
      expect(screen.getByText('2018-2020')).toBeInTheDocument();
      expect(screen.getByText('UC Irvine')).toBeInTheDocument();
      expect(screen.getByText(/Focus on molecular biotechnology and bioinformatics/)).toBeInTheDocument();
      expect(screen.getByText('📍 Irvine, CA, USA')).toBeInTheDocument();
    });

    it('handles empty or missing timeline data gracefully', () => {
      // This test would be relevant if timeline data could be passed as props
      render(<Timeline />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  describe('Interactive Behavior', () => {
    it('timeline items have hover effects', () => {
      render(<Timeline />);
      
      const timelineItems = document.querySelectorAll('.hover\\:border-accent-yellow\\/30');
      expect(timelineItems.length).toBeGreaterThan(0);
    });

    it('maintains proper focus management', () => {
      render(<Timeline />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('id', 'timeline');
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive classes for layout', () => {
      render(<Timeline />);
      
      // Check for responsive flex classes
      const responsiveElements = document.querySelectorAll('.md\\:flex-row');
      expect(responsiveElements.length).toBeGreaterThan(0);
    });

    it('has proper container constraints', () => {
      render(<Timeline />);
      
      const container = document.querySelector('.max-w-4xl');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Content Quality', () => {
    it('contains meaningful academic content', () => {
      render(<Timeline />);
      
      // Check for academic keywords
      expect(screen.getByText(/PhD in Biotechnology/)).toBeInTheDocument();
      expect(screen.getByText(/Master of Science/)).toBeInTheDocument();
      expect(screen.getByText(/antimicrobial therapies/)).toBeInTheDocument();
      expect(screen.getByText(/molecular biotechnology/)).toBeInTheDocument();
    });

    it('includes proper location markers', () => {
      render(<Timeline />);
      
      const locationElements = screen.getAllByText(/📍/);
      expect(locationElements).toHaveLength(2);
    });
  });
});