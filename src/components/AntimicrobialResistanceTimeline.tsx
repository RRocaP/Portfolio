import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface AntibioticData {
  antibiotic: string;
  yearIntroduced: number;
  yearResistanceDetected: number;
  category: string;
  description: string;
  impact: string;
}

const antibioticData: AntibioticData[] = [
  {
    antibiotic: "Penicillin",
    yearIntroduced: 1942,
    yearResistanceDetected: 1942,
    category: "Beta-lactam",
    description: "First widely used antibiotic",
    impact: "Resistance detected in the same year as introduction"
  },
  {
    antibiotic: "Streptomycin",
    yearIntroduced: 1946,
    yearResistanceDetected: 1946,
    category: "Aminoglycoside",
    description: "First antibiotic for tuberculosis",
    impact: "Resistance emerged immediately"
  },
  {
    antibiotic: "Tetracycline",
    yearIntroduced: 1952,
    yearResistanceDetected: 1959,
    category: "Tetracycline",
    description: "Broad-spectrum antibiotic",
    impact: "7 years to resistance"
  },
  {
    antibiotic: "Methicillin",
    yearIntroduced: 1960,
    yearResistanceDetected: 1962,
    category: "Beta-lactam",
    description: "Developed to combat penicillin resistance",
    impact: "MRSA emerged in just 2 years"
  },
  {
    antibiotic: "Vancomycin",
    yearIntroduced: 1972,
    yearResistanceDetected: 1988,
    category: "Glycopeptide",
    description: "Last-resort antibiotic",
    impact: "16 years to resistance, now widespread"
  },
  {
    antibiotic: "Fluoroquinolones",
    yearIntroduced: 1985,
    yearResistanceDetected: 1990,
    category: "Quinolone",
    description: "Synthetic broad-spectrum",
    impact: "5 years to resistance"
  },
  {
    antibiotic: "Daptomycin",
    yearIntroduced: 2003,
    yearResistanceDetected: 2004,
    category: "Lipopeptide",
    description: "Novel mechanism of action",
    impact: "Resistance in 1 year"
  },
  {
    antibiotic: "Ceftaroline",
    yearIntroduced: 2010,
    yearResistanceDetected: 2011,
    category: "Cephalosporin",
    description: "5th generation cephalosporin",
    impact: "Resistance detected within a year"
  }
];

export default function AntimicrobialResistanceTimeline() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<AntibioticData | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: Math.min(width - 40, 1000), height: 600 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 80, right: 200, bottom: 80, left: 120 }; // Increased right margin for legend
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1940, 2025])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(antibioticData.map(d => d.antibiotic))
      .range([0, height])
      .padding(0.3);

    // Roma colormap from crameri palette (scientific color maps)
    const romaColors = [
      '#7E1900', // Deep red-brown
      '#B73D1A', // Rust orange
      '#E06E3B', // Orange
      '#F5A572', // Light orange
      '#FCD8AF', // Peach
      '#E6E4E1', // Light gray
      '#B4C5D7', // Light blue
      '#7FA2C5', // Sky blue
      '#4A7BB7', // Blue
      '#2A4A7F', // Deep blue
      '#0E1E44'  // Navy
    ];
    
    const categories = Array.from(new Set(antibioticData.map(d => d.category)));
    const colorScale = d3.scaleOrdinal<string, string>()
      .domain(categories)
      .range(romaColors.slice(0, categories.length));

    // Enhanced grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '1,3')
      .style('opacity', 0.15)
      .selectAll('line')
      .style('stroke', 'var(--border-subtle, #e0e0e0)');

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
        .ticks(10))
      .selectAll('text')
      .attr('fill', 'var(--secondary, #666)')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .style('font-size', '12px')
      .append('text')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('fill', 'var(--primary, #333)')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .style('font-weight', '500')
      .text('Year');

    // Enhanced Y axis
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0).tickPadding(10));
    
    yAxis.select('.domain').remove();
    
    yAxis.selectAll('text')
      .attr('fill', 'var(--primary, #333)')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .style('font-size', '13px')
      .style('font-weight', '500');

    // Timeline bars
    const bars = g.selectAll('.timeline-bar')
      .data(antibioticData)
      .enter()
      .append('g')
      .attr('class', 'timeline-bar');

    // Add subtle gradient definitions
    const defs = svg.append('defs');
    
    categories.forEach((category, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${category.replace(/\s+/g, '-')}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', colorScale(category))
        .style('stop-opacity', 0.9);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .style('stop-color', colorScale(category))
        .style('stop-opacity', 0.7);
    });

    // Introduction to resistance bars with gradients
    bars.append('rect')
      .attr('x', (d: AntibioticData) => xScale(d.yearIntroduced))
      .attr('y', (d: AntibioticData) => yScale(d.antibiotic)!)
      .attr('width', (d: AntibioticData) => Math.max(0, xScale(d.yearResistanceDetected) - xScale(d.yearIntroduced)))
      .attr('height', yScale.bandwidth())
      .attr('fill', (d: AntibioticData) => `url(#gradient-${d.category.replace(/\s+/g, '-')})`)
      .attr('stroke', (d: AntibioticData) => colorScale(d.category))
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.9)
      .attr('rx', 8)
      .style('filter', 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))')
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s ease')
      .on('mouseover', function(_event: MouseEvent, d: AntibioticData) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke-width', 2)
          .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))');
        setSelectedAntibiotic(d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.9)
          .attr('stroke-width', 0.5)
          .style('filter', 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))');
      });

    // Resistance continuation with pattern
    const patterns = defs.selectAll('.pattern')
      .data(categories)
      .enter()
      .append('pattern')
      .attr('id', (d: string) => `pattern-${d.replace(/\s+/g, '-')}`)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 8)
      .attr('height', 8);
    
    patterns.append('rect')
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', (d: string) => colorScale(d))
      .attr('opacity', 0.15);
    
    patterns.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 8)
      .attr('y2', 8)
      .attr('stroke', (d: string) => colorScale(d))
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.3);

    bars.append('rect')
      .attr('x', (d: AntibioticData) => xScale(d.yearResistanceDetected))
      .attr('y', (d: AntibioticData) => yScale(d.antibiotic)!)
      .attr('width', (d: AntibioticData) => xScale(2025) - xScale(d.yearResistanceDetected))
      .attr('height', yScale.bandwidth())
      .attr('fill', (d: AntibioticData) => `url(#pattern-${d.category.replace(/\s+/g, '-')})`)
      .attr('stroke', (d: AntibioticData) => colorScale(d.category))
      .attr('stroke-width', 1)
      .attr('opacity', 0.8)
      .attr('rx', 8)
      .style('stroke-dasharray', '12,4');

    // Enhanced introduction markers
    const introMarkers = bars.append('g')
      .attr('class', 'intro-marker');
    
    introMarkers.append('circle')
      .attr('cx', (d: AntibioticData) => xScale(d.yearIntroduced))
      .attr('cy', (d: AntibioticData) => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
      .attr('r', 8)
      .attr('fill', 'var(--background, white)')
      .attr('stroke', (d: AntibioticData) => colorScale(d.category))
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');
    
    introMarkers.append('circle')
      .attr('cx', (d: AntibioticData) => xScale(d.yearIntroduced))
      .attr('cy', (d: AntibioticData) => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
      .attr('r', 4)
      .attr('fill', (d: AntibioticData) => colorScale(d.category));

    // Enhanced resistance detection markers
    const resistanceMarkers = bars.append('g')
      .attr('class', 'resistance-marker');
    
    resistanceMarkers.append('circle')
      .attr('cx', (d: AntibioticData) => xScale(d.yearResistanceDetected))
      .attr('cy', (d: AntibioticData) => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
      .attr('r', 10)
      .attr('fill', '#D72638')
      .attr('opacity', 0.15);
    
    resistanceMarkers.append('text')
      .attr('x', (d: AntibioticData) => xScale(d.yearResistanceDetected))
      .attr('y', (d: AntibioticData) => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', '700')
      .style('fill', '#D72638')
      .text('!');

    // Title with white text
    svg.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F3F3F3')
      .style('font-size', '28px')
      .style('font-weight', '600')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .text('The Race Against Resistance: Antibiotic Timeline');
    
    // Add subtitle
    svg.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', 55)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--secondary, #666)')
      .style('font-size', '14px')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .text('Time from introduction to first detected resistance');

    // Enhanced Legend with no background
    const legendWidth = 160;
    const legendHeight = categories.length * 28 + 40;
    
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${dimensions.width - margin.right + 20}, ${margin.top})`);
    
    // Legend title with white text
    legendGroup.append('text')
      .attr('x', legendWidth / 2 - 10)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F3F3F3')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .text('Antibiotic Classes');
    
    const legend = legendGroup.append('g')
      .attr('transform', 'translate(0, 15)');
    
    const legendItems = legend.selectAll('.legend-item')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_d, i) => `translate(10, ${i * 28})`)
      .style('cursor', 'pointer');
    
    legendItems.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', (d: string) => colorScale(d))
      .attr('rx', 4)
      .attr('stroke', 'var(--border-subtle, rgba(0,0,0,0.1))')
      .attr('stroke-width', 1);
    
    legendItems.append('text')
      .attr('x', 28)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .attr('fill', '#F3F3F3')
      .style('font-size', '13px')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .style('font-weight', '400')
      .text((d: string) => d);
    
    // Add hover effect to legend
    legendItems
      .on('mouseover', function(event: MouseEvent, category: string) {
        // Highlight bars of this category
        bars.selectAll('rect')
          .attr('opacity', (d: AntibioticData) => d.category === category ? 1 : 0.2);
        d3.select(this).select('rect')
          .attr('stroke-width', 2)
          .attr('stroke', 'var(--primary, #333)');
      })
      .on('mouseout', function() {
        // Reset opacity
        bars.selectAll('rect')
          .attr('opacity', (_d, i) => i === 0 ? 0.8 : 0.3);
        d3.select(this).select('rect')
          .attr('stroke-width', 1)
          .attr('stroke', 'var(--border-subtle, rgba(0,0,0,0.1))');
      });

    // Ramon's solution annotation
    const solutionYear = 2024;
    g.append('line')
      .attr('x1', xScale(solutionYear))
      .attr('y1', 0)
      .attr('x2', xScale(solutionYear))
      .attr('y2', height)
      .attr('stroke', '#50C878')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '10,5')
      .attr('opacity', 0.7);

    g.append('text')
      .attr('x', xScale(solutionYear))
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#50C878')
      .text("Next-Gen Solutions →");

  }, [dimensions]);

  return (
    <div className="timeline-container" style={{ position: 'relative' }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      {selectedAntibiotic && (
        <div className="info-panel">
          <h3>{selectedAntibiotic.antibiotic}</h3>
          <p><strong>Category:</strong> {selectedAntibiotic.category}</p>
          <p><strong>Introduced:</strong> {selectedAntibiotic.yearIntroduced}</p>
          <p><strong>Resistance Detected:</strong> {selectedAntibiotic.yearResistanceDetected}</p>
          <p><strong>Time to Resistance:</strong> {selectedAntibiotic.yearResistanceDetected - selectedAntibiotic.yearIntroduced} years</p>
          <p>{selectedAntibiotic.description}</p>
          <p><em>{selectedAntibiotic.impact}</em></p>
        </div>
      )}
      <div className="solution-box">
        <h3>Next-Generation Antimicrobial Proteins</h3>
        <p>Engineering proteins with multiple functional domains that:</p>
        <ul>
          <li>Target multiple bacterial systems simultaneously</li>
          <li>Recruit the immune system for enhanced killing</li>
          <li>Prevent biofilm formation</li>
          <li>Are customizable for specific infections</li>
        </ul>
        <p>This multi-target approach makes resistance evolution significantly harder for bacteria.</p>
      </div>
      <style>{`
        .timeline-container {
          position: relative;
          margin: 2rem 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .info-panel {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: var(--background, white);
          color: var(--primary, #333);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          max-width: 320px;
          z-index: 10;
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.98);
          border: 2px solid var(--accent-yellow, #FFD300);
          transform: translateY(0);
          transition: all 0.3s ease;
        }
        .info-panel:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        }
        @media (prefers-color-scheme: dark) {
          .info-panel {
            background: rgba(17, 17, 17, 0.98);
            border: 2px solid var(--accent-yellow, #FFD300);
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          }
          .info-panel:hover {
            box-shadow: 0 12px 32px rgba(0,0,0,0.5);
          }
        }
        .info-panel h3 {
          margin: 0 0 0.5rem 0;
          color: var(--accent-red, #D72638);
          font-weight: 600;
          font-size: 1.1rem;
        }
        .info-panel p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--secondary, #666);
        }
        .info-panel strong {
          color: var(--primary, #333);
          font-weight: 500;
        }
        .solution-box {
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.05) 0%, rgba(255, 217, 61, 0.05) 100%);
          border: 2px solid transparent;
          border-image: linear-gradient(135deg, #50C878, #FFD300) 1;
          border-radius: 12px;
          padding: 2rem;
          margin-top: 2.5rem;
          color: var(--primary, #333);
          position: relative;
          overflow: hidden;
        }
        .solution-box::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #50C878, #FFD300);
          border-radius: 12px;
          opacity: 0.1;
          z-index: -1;
        }
        .solution-box h3 {
          color: var(--accent-red, #D72638);
          margin-bottom: 1rem;
          font-weight: 600;
          font-size: 1.2rem;
        }
        .solution-box p {
          color: var(--secondary, #666);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .solution-box ul {
          margin-left: 1.5rem;
          color: var(--secondary, #666);
        }
        .solution-box li {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        @media (prefers-color-scheme: dark) {
          .solution-box {
            background: linear-gradient(135deg, rgba(80, 200, 120, 0.03) 0%, rgba(255, 235, 59, 0.03) 100%);
          }
          .solution-box::before {
            opacity: 0.05;
          }
        }
        @media (max-width: 768px) {
          .info-panel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}