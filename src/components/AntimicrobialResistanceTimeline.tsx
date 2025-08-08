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
  const [dimensions, setDimensions] = useState({ width: 1000, height: 620 });

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

    // Compute dynamic left margin based on longest label to avoid clipping (e.g., "Fluoroquinolones")
    const maxLabelChars = d3.max(antibioticData, (d) => d.antibiotic.length) ?? 12;
    const charPx = 7.5; // approx char width
    const dynamicLeft = Math.min(260, Math.max(90, 24 + maxLabelChars * charPx));

    // Balanced margins with extra bottom for the legend
    const margin = { top: 80, right: 80, bottom: 140, left: dynamicLeft };
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

    // CMC (Crameri) inspired discrete palette for high contrast (batlow-inspired)
    const cmcPalette = [
      '#011959', '#20496E', '#4C6E70', '#7E9171', '#BFB56F', '#FBD065', '#FC9662'
    ];
    const colorScale = d3.scaleOrdinal<string, string>()
      .domain(Array.from(new Set(antibioticData.map(d => d.category))))
      .range(cmcPalette);

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

    // Y axis with safe spacing so long labels are fully readable
    const yAxis = g.append('g').call(d3.axisLeft(yScale));
    yAxis
      .selectAll('text')
      .attr('fill', 'var(--secondary, #666)')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
      .style('font-size', dimensions.width < 520 ? '11px' : '12px')
      .attr('dx', '-4')
      .style('text-anchor', 'end');

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
      .style('fill', '#FBD065')
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

    // Legend (centered horizontally under the plot)
    const categories = Array.from(new Set(antibioticData.map(d => d.category)));
    const approxTextWidth = (label: string) => Math.max(50, label.length * 7);
    const legendItems = categories.map(c => ({
      label: c,
      color: colorScale(c),
      width: 18 + 8 + approxTextWidth(c) + 16 // rect + gap + text + padding
    }));
    const totalLegendWidth = legendItems.reduce((acc, it) => acc + it.width, 0);
    const startX = Math.max(0, (width - totalLegendWidth) / 2);

    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${height + 50})`);

    let cursorX = startX;
    legendItems.forEach((it) => {
      const item = legend.append('g').attr('transform', `translate(${cursorX}, 0)`);
      item.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', it.color)
        .attr('rx', 3);
      item.append('text')
        .attr('x', 18 + 8)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .attr('fill', 'var(--secondary, #666)')
        .style('text-anchor', 'start')
        .style('font-size', '12px')
        .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif')
        .style('font-weight', '400')
        .text(it.label);
      cursorX += it.width;
    });

    // Ramon's solution annotation
    const solutionYear = 2024;
    g.append('line')
      .attr('x1', xScale(solutionYear))
      .attr('y1', 0)
      .attr('x2', xScale(solutionYear))
      .attr('y2', height)
      .attr('stroke', '#7E9171')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '10,5');

    g.append('text')
      .attr('x', xScale(solutionYear))
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#7E9171')
      .text("Next-Gen Solutions →");

  }, [dimensions]);

  return (
    <div className="timeline-container">
      <svg ref={svgRef} className="timeline-svg" width={dimensions.width} height={dimensions.height} />
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
        <h3>Next‑Generation Antimicrobial Proteins</h3>
        <p>
          I design modular proteins that combine orthogonal mechanisms—membrane disruption, enzymatic cell‑wall attack, and
          biofilm dispersion—to make resistance evolution much harder. I tune domain order and linkers for potency, stability and
          manufacturability, then validate at the bench against priority pathogens.
        </p>
        <div className="bullets">
          <ul>
            <li>Multiple mechanisms in one scaffold (membrane, enzymatic, anti‑biofilm)</li>
            <li>Rational linkers and domain ordering; production‑aware constructs</li>
            <li>Vector delivery feasibility where relevant (AAV and related systems)</li>
            <li>Bench assays: MIC/MBEC, time‑kill, biofilm, and resistance‑trajectory tracking</li>
          </ul>
          <ul>
            <li>Rapid in‑silico design and screening</li>
            <li>Cloning strategy and construct design</li>
            <li>Expression/solubility optimization; inclusion‑body rescue when useful</li>
            <li>Reproducible analysis and clear reporting for decisions</li>
          </ul>
        </div>
        <p className="closing">If you’re exploring hard‑to‑treat infections or want to test a concept quickly, I’m keen to collaborate.</p>
      </div>
      <style>{`
        .timeline-container {
          position: relative;
          margin: 2rem 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .timeline-svg { display: block; margin: 0 auto; }
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
          max-width: 960px;
          margin: 2.5rem auto 0;
          padding: 1.5rem 1.75rem;
          background: var(--background-card, #1e1e1e);
          border: 1px solid var(--border, #333);
          border-left: 3px solid var(--accent-red, #DA291C);
          border-radius: 12px;
          color: var(--primary, #eaeaea);
        }
        .solution-box h3 { margin: 0 0 0.75rem 0; font-weight: 700; font-size: 1.2rem; color: var(--accent-red, #DA291C); }
        .solution-box p { color: var(--secondary, #b5b5b5); line-height: 1.7; margin-bottom: 1rem; }
        .bullets { display: grid; grid-template-columns: 1fr; gap: 0.5rem 1.5rem; margin: 0.5rem 0 0.5rem; }
        .bullets ul { margin: 0; padding-left: 1.1rem; color: var(--secondary, #b5b5b5); }
        .bullets li { margin: 0.35rem 0; line-height: 1.5; }
        .closing { margin-top: 0.75rem; }
        @media (min-width: 900px) { .bullets { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
