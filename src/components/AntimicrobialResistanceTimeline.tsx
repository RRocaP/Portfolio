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

    const colorScale = d3.scaleOrdinal()
      .domain(Array.from(new Set(antibioticData.map(d => d.category))))
      .range(['#DA291C', '#FFD93D', '#4A90E2', '#50C878', '#FF6B6B', '#9B59B6', '#F39C12']);

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
      .append('text')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Year');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale));

    // Timeline bars
    const bars = g.selectAll('.timeline-bar')
      .data(antibioticData)
      .enter()
      .append('g')
      .attr('class', 'timeline-bar');

    // Introduction to resistance bars
    bars.append('rect')
      .attr('x', d => xScale(d.yearIntroduced))
      .attr('y', d => yScale(d.antibiotic)!)
      .attr('width', d => Math.max(0, xScale(d.yearResistanceDetected) - xScale(d.yearIntroduced)))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.category))
      .attr('opacity', 0.8)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        setSelectedAntibiotic(d);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8);
      });

    // Resistance continuation (dashed)
    bars.append('rect')
      .attr('x', d => xScale(d.yearResistanceDetected))
      .attr('y', d => yScale(d.antibiotic)!)
      .attr('width', d => xScale(2025) - xScale(d.yearResistanceDetected))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.category))
      .attr('opacity', 0.3)
      .attr('rx', 4)
      .style('stroke', d => colorScale(d.category))
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5,5');

    // Introduction markers
    bars.append('circle')
      .attr('cx', d => xScale(d.yearIntroduced))
      .attr('cy', d => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
      .attr('r', 6)
      .attr('fill', 'white')
      .attr('stroke', d => colorScale(d.category))
      .attr('stroke-width', 3);

    // Resistance detection markers
    bars.append('text')
      .attr('x', d => xScale(d.yearResistanceDetected))
      .attr('y', d => yScale(d.antibiotic)! + yScale.bandwidth() / 2)
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
      .style('font-size', '24px')
      .style('font-weight', 'bold')
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
      .attr('transform', (d, i) => `translate(0, ${i * 25})`)
      .each(function(d) {
        const g = d3.select(this);
        g.append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', colorScale(d))
          .attr('rx', 3);
        g.append('text')
          .attr('x', -5)
          .attr('y', 9)
          .attr('dy', '0.35em')
          .style('text-anchor', 'end')
          .style('font-size', '12px')
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
      .text("Ramon's Approach →");

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
        <h3>Ramon's Solution: Modular Antimicrobial Proteins</h3>
        <p>Instead of traditional antibiotics, I engineer proteins with multiple functional domains that:</p>
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
        }
        .info-panel {
          position: absolute;
          top: 100px;
          left: 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 300px;
          z-index: 10;
        }
        .info-panel h3 {
          margin: 0 0 0.5rem 0;
          color: #DA291C;
        }
        .info-panel p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }
        .solution-box {
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.1) 0%, rgba(255, 217, 61, 0.1) 100%);
          border: 2px solid #50C878;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .solution-box h3 {
          color: #50C878;
          margin-bottom: 1rem;
        }
        .solution-box ul {
          margin-left: 1.5rem;
        }
        .solution-box li {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}