import React, { useState, useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

interface ProteinDomain {
  id: string;
  name: string;
  type: string;
  function: string;
  color: string;
  size: number;
  description: string;
}

const proteinDomains: ProteinDomain[] = [
  {
    id: 'lytic',
    name: 'Lytic Domain',
    type: 'antimicrobial',
    function: 'Membrane Disruption',
    color: '#DA291C',
    size: 150,
    description: 'Punches holes in bacterial cell membranes, causing rapid cell death. Derived from bacteriophage endolysins.'
  },
  {
    id: 'binding',
    name: 'Binding Domain',
    type: 'targeting',
    function: 'Bacterial Recognition',
    color: '#4A90E2',
    size: 120,
    description: 'Specifically recognizes and binds to bacterial surface markers, ensuring targeted killing.'
  },
  {
    id: 'immune',
    name: 'Immunomodulatory',
    type: 'immune',
    function: 'Immune Recruitment',
    color: '#50C878',
    size: 100,
    description: 'Recruits and activates immune cells to the infection site for enhanced bacterial clearance.'
  },
  {
    id: 'antibiofilm',
    name: 'Anti-biofilm',
    type: 'prevention',
    function: 'Biofilm Disruption',
    color: '#FFD93D',
    size: 130,
    description: 'Breaks down bacterial biofilms that protect bacteria from antibiotics and immune responses.'
  },
  {
    id: 'penetrating',
    name: 'Cell Penetrating',
    type: 'delivery',
    function: 'Intracellular Access',
    color: '#9B59B6',
    size: 90,
    description: 'Allows the protein to enter host cells to kill intracellular bacteria.'
  }
];

interface AssembledProtein {
  domains: string[];
  name: string;
  effectiveness: number;
  targets: string[];
}

const proteinCombinations: AssembledProtein[] = [
  {
    domains: ['lytic', 'binding', 'antibiofilm'],
    name: 'BiofilmBuster-1',
    effectiveness: 95,
    targets: ['MRSA', 'Pseudomonas aeruginosa']
  },
  {
    domains: ['lytic', 'immune', 'penetrating'],
    name: 'ImmunoKiller-X',
    effectiveness: 88,
    targets: ['Tuberculosis', 'Intracellular pathogens']
  },
  {
    domains: ['binding', 'antibiofilm', 'immune'],
    name: 'SurfaceGuard-Pro',
    effectiveness: 92,
    targets: ['Medical device infections', 'Catheter-associated UTIs']
  }
];

export default function ProteinEngineeringInteractive() {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [assembledProtein, setAssembledProtein] = useState<AssembledProtein | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const proteinSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create domain circles in a circular layout
    const angleStep = (2 * Math.PI) / proteinDomains.length;
    const radius = 120;

    const g = svg.append('g');

    // Add connecting lines for selected domains
    if (selectedDomains.length > 1) {
      const selectedCoords = selectedDomains.map(id => {
        const index = proteinDomains.findIndex(d => d.id === id);
        const angle = index * angleStep - Math.PI / 2;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });

      const lineGenerator = d3.line<{ x: number; y: number }>()
        .x((d: { x: number; y: number }) => d.x)
        .y((d: { x: number; y: number }) => d.y)
        .curve(d3.curveCardinal.tension(0.5));

      g.append('path')
        .datum(selectedCoords)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    }

    // Create domain groups
    const domainGroups = g.selectAll('.domain-group')
      .data(proteinDomains)
      .enter()
      .append('g')
      .attr('class', 'domain-group')
      .attr('transform', (_d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `translate(${x}, ${y})`;
      })
      .style('cursor', 'pointer')
      .on('click', (_event, d) => toggleDomain(d.id))
      .on('mouseenter', (_event, d) => setHoveredDomain(d.id))
      .on('mouseleave', () => setHoveredDomain(null));

    // Add circles
    domainGroups.append('circle')
      .attr('r', d => d.size / 4)
      .attr('fill', d => d.color)
      .attr('opacity', d => selectedDomains.includes(d.id) ? 1 : 0.6)
      .attr('stroke', d => selectedDomains.includes(d.id) ? '#333' : 'none')
      .attr('stroke-width', 3)
      .transition()
      .duration(300)
      .attr('r', d => (hoveredDomain === d.id ? d.size / 3.5 : d.size / 4));

    // Add labels
    domainGroups.append('text')
      .attr('dy', d => d.size / 4 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => d.name);

    // Add function labels
    domainGroups.append('text')
      .attr('dy', d => d.size / 4 + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text(d => d.function);

  }, [selectedDomains, hoveredDomain]);

  useEffect(() => {
    // Visualize assembled protein
    if (!proteinSvgRef.current || selectedDomains.length === 0) return;

    const svg = d3.select(proteinSvgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    
    const domainWidth = 100;
    const domainHeight = 60;
    const spacing = 20;

    const g = svg.append('g')
      .attr('transform', `translate(${(width - (selectedDomains.length * (domainWidth + spacing) - spacing)) / 2}, 70)`);

    // Draw domains as connected rectangles
    selectedDomains.forEach((domainId, i) => {
      const domain = proteinDomains.find(d => d.id === domainId)!;
      
      // Connector
      if (i > 0) {
        g.append('rect')
          .attr('x', i * (domainWidth + spacing) - spacing)
          .attr('y', domainHeight / 2 - 5)
          .attr('width', spacing)
          .attr('height', 10)
          .attr('fill', '#999');
      }

      // Domain rectangle
      g.append('rect')
        .attr('x', i * (domainWidth + spacing))
        .attr('y', 0)
        .attr('width', domainWidth)
        .attr('height', domainHeight)
        .attr('fill', domain.color)
        .attr('rx', 10)
        .attr('opacity', 0.8);

      // Domain label
      g.append('text')
        .attr('x', i * (domainWidth + spacing) + domainWidth / 2)
        .attr('y', domainHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(domain.name.split(' ')[0]);
    });

    // Check for known combinations
    const combination = proteinCombinations.find(p => 
      p.domains.length === selectedDomains.length &&
      p.domains.every(d => selectedDomains.includes(d))
    );
    
    if (combination) {
      setAssembledProtein(combination);
    } else {
      setAssembledProtein(null);
    }

  }, [selectedDomains]);

  const toggleDomain = (domainId: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domainId)) {
        return prev.filter(id => id !== domainId);
      } else if (prev.length < 4) {
        return [...prev, domainId];
      }
      return prev;
    });
  };

  const resetSelection = () => {
    setSelectedDomains([]);
    setAssembledProtein(null);
  };

  return (
    <div className="protein-engineering-container">
      <div className="controls">
        <h2>Build Your Modular Antimicrobial Protein</h2>
        <p>Click on domains to assemble them into a custom protein. Different combinations have different effects!</p>
      </div>

      <div className="visualization-grid">
        <div className="domain-selector">
          <h3>Available Domains</h3>
          <svg ref={svgRef} width="400" height="400" />
          {hoveredDomain && (
            <div className="domain-tooltip">
              {proteinDomains.find(d => d.id === hoveredDomain)?.description}
            </div>
          )}
        </div>

        <div className="protein-assembly">
          <h3>Assembled Protein</h3>
          <svg ref={proteinSvgRef} width="600" height="200" />
          
          {selectedDomains.length > 0 && (
            <div className="assembly-info">
              <p>Selected domains: {selectedDomains.length}</p>
              <button onClick={resetSelection}>Reset</button>
            </div>
          )}

          {assembledProtein && (
            <div className="protein-info">
              <h4>{assembledProtein.name}</h4>
              <div className="effectiveness-bar">
                <div className="effectiveness-label">Effectiveness: {assembledProtein.effectiveness}%</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${assembledProtein.effectiveness}%` }}
                  />
                </div>
              </div>
              <p><strong>Effective against:</strong></p>
              <ul>
                {assembledProtein.targets.map(target => (
                  <li key={target}>{target}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="explanation">
        <h3>How Modular Protein Design Works</h3>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h4>Select Functional Domains</h4>
            <p>Each domain has a specific function like membrane disruption or immune recruitment.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h4>AI Predicts Folding</h4>
            <p>Machine learning models predict how the domains will fold together in 3D space.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h4>Express & Test</h4>
            <p>The designed protein is expressed in bacteria and tested against pathogens.</p>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <h4>Optimize & Scale</h4>
            <p>Successful designs are optimized for stability and scaled for production.</p>
          </div>
        </div>
      </div>

      <style>{`
        .protein-engineering-container {
          margin: 2rem 0;
        }
        
        .controls {
          text-align: center;
          margin-bottom: 2rem;
        }

        .visualization-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .domain-selector {
          position: relative;
        }

        .domain-tooltip {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          max-width: 300px;
          text-align: center;
        }

        .protein-assembly {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .assembly-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        .assembly-info button {
          background: #DA291C;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .assembly-info button:hover {
          background: #b01e15;
        }

        .protein-info {
          margin-top: 2rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .protein-info h4 {
          color: #50C878;
          margin-bottom: 1rem;
        }

        .effectiveness-bar {
          margin: 1rem 0;
        }

        .effectiveness-label {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .bar-container {
          width: 100%;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #50C878, #FFD93D);
          transition: width 0.5s ease;
        }

        .protein-info ul {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .explanation {
          background: linear-gradient(135deg, rgba(218, 41, 28, 0.05) 0%, rgba(255, 217, 61, 0.05) 100%);
          border-radius: 8px;
          padding: 2rem;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .step {
          text-align: center;
        }

        .step-number {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: #DA291C;
          color: white;
          border-radius: 50%;
          line-height: 40px;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .step h4 {
          margin: 0.5rem 0;
          color: #333;
        }

        .step p {
          font-size: 0.9rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .visualization-grid {
            grid-template-columns: 1fr;
          }
          
          .steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}