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

    const margin = { top: 80, right: 120, bottom: 80, left: 80 };
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

    const colorScale = d3.scaleOrdinal<string, string>()
      .domain(Array.from(new Set(antibioticData.map(d => d.category))))
      .range(['#DA291C', '#FFD93D', '#4A90E2', '#50C878', '#FF6B6B', '#9B59B6', '#E67E22']);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3);

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

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', 'var(--secondary, #666)')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .style('font-size', '12px');

    // Timeline bars
    const bars = g.selectAll('.timeline-bar')
      .data(antibioticData)
      .enter()
      .append('g')
      .attr('class', 'timeline-bar');

    // Introduction to resistance bars
    bars.append('rect')
      .attr('x', (d: AntibioticData) => xScale(d.yearIntroduced))
      .attr('y', (d: AntibioticData) => yScale(d.antibiotic)!)
      .attr('width', (d: AntibioticData) => Math.max(0, xScale(d.yearResistanceDetected) - xScale(d.yearIntroduced)))
      .attr('height', yScale.bandwidth())
      .attr('fill', (d: AntibioticData) => colorScale(d.category) as string)
      .attr('opacity', 0.8)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(_event: MouseEvent, d: AntibioticData) {
        d3.select(this).attr('opacity', 1);
        setSelectedAntibiotic(d);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8);
      });

    // Resistance continuation (dashed)
    bars.append('rect')
      .attr('x', (d: AntibioticData) => xScale(d.yearResistanceDetected))
      .attr('y', (d: AntibioticData) => yScale(d.antibiotic)!)
      .attr('width', (d: AntibioticData) => xScale(2025) - xScale(d.yearResistanceDetected))
      .attr('height', yScale.bandwidth())
      .attr('fill', (d: AntibioticData) => colorScale(d.category as string))
      .attr('opacity', 0.3)
      .attr('rx', 4)
      .style('stroke', (d: AntibioticData): string => colorScale(d.category))
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5,5');

    // Introduction markers
    bars.append('circle')
      .attr('cx', (d: AntibioticData) => xScale(d.yearIntroduced))
      .attr('cy', (d: AntibioticData) => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
      .attr('r', 6)
      .attr('fill', 'white')
      .attr('stroke', (d: AntibioticData) => colorScale(d.category))
      .attr('stroke-width', 3);

    // Resistance detection markers
    bars.append('text')
      .attr('x', (d: AntibioticData) => xScale(d.yearResistanceDetected))
      .attr('y', (d: AntibioticData) => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '20px')
      .style('fill', '#DA291C')
      .text('⚠');

    // Title
    svg.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--primary, #333)')
      .style('font-size', '24px')
      .style('font-weight', '600')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .text('The Race Against Resistance: Antibiotic Timeline');

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${dimensions.width - 100}, ${margin.top})`);

    const categories = Array.from(new Set(antibioticData.map(d => d.category)));
    
    legend.selectAll('.legend-item')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_d, i) => `translate(0, ${i * 25})`)
      .each(function(d: string) {
        const g = d3.select(this);
        g.append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', colorScale(d as string))
          .attr('rx', 3);
        g.append('text')
          .attr('x', -5)
          .attr('y', 9)
          .attr('dy', '0.35em')
          .attr('fill', 'var(--secondary, #666)')
          .style('text-anchor', 'end')
          .style('font-size', '12px')
          .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
          .style('font-weight', '400')
          .text(d);
      });

    // Ramon's solution annotation
    const solutionYear = 2024;
    g.append('line')
      .attr('x1', xScale(solutionYear))
      .attr('y1', 0)
      .attr('x2', xScale(solutionYear))
      .attr('y2', height)
      .attr('stroke', '#50C878')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '10,5');

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
    <div className="timeline-container">
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
          top: 100px;
          left: 20px;
          background: var(--background, white);
          color: var(--primary, #333);
          border: 1px solid var(--border, #ddd);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 300px;
          z-index: 10;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
        @media (prefers-color-scheme: dark) {
          .info-panel {
            background: rgba(30, 30, 30, 0.95);
            border-color: var(--border, #2a2a2a);
          }
        }
        .info-panel h3 {
          margin: 0 0 0.5rem 0;
          color: var(--accent-red, #DA291C);
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
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.08) 0%, rgba(255, 217, 61, 0.08) 100%);
          border: 2px solid var(--accent-yellow, #FFD93D);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
          color: var(--primary, #333);
        }
        .solution-box h3 {
          color: var(--accent-red, #DA291C);
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
            background: linear-gradient(135deg, rgba(80, 200, 120, 0.05) 0%, rgba(255, 235, 59, 0.05) 100%);
            border-color: var(--accent-yellow, #ffeb3b);
          }
        }
      `}</style>
    </div>
  );
}