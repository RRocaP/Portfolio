import React, { useState, useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveMonotoneX } from 'd3-shape';

interface AAVVector {
  serotype: string;
  name: string;
  targets: string[];
  efficiency: number;
  color: string;
  improvements: string[];
  clinicalUse: string;
}

interface OrganData {
  organ: string;
  x: number;
  y: number;
  radius: number;
  targetingData: {
    serotype: string;
    efficiency: number;
  }[];
}

const aavVectors: AAVVector[] = [
  {
    serotype: 'AAV2',
    name: 'Original',
    targets: ['Liver', 'Eye', 'Brain'],
    efficiency: 60,
    color: '#DA291C',
    improvements: ['First FDA-approved', 'Well-characterized'],
    clinicalUse: 'Inherited blindness (Luxturna)'
  },
  {
    serotype: 'AAV8',
    name: 'Liver Specialist',
    targets: ['Liver'],
    efficiency: 85,
    color: '#4A90E2',
    improvements: ['High liver tropism', 'Low immunogenicity'],
    clinicalUse: 'Hemophilia gene therapy'
  },
  {
    serotype: 'AAV9',
    name: 'CNS Explorer',
    targets: ['Brain', 'Spinal Cord', 'Heart'],
    efficiency: 75,
    color: '#9B59B6',
    improvements: ['Crosses blood-brain barrier', 'Broad distribution'],
    clinicalUse: 'Spinal muscular atrophy (Zolgensma)'
  },
  {
    serotype: 'AAV-PHP.B',
    name: 'Enhanced Brain',
    targets: ['Brain'],
    efficiency: 95,
    color: '#50C878',
    improvements: ['40x better brain targeting', 'Engineered capsid'],
    clinicalUse: 'Experimental - neurodegenerative diseases'
  },
  {
    serotype: 'AAV-CAR',
    name: "Ramon's CAR-T",
    targets: ['T Cells', 'Immune System'],
    efficiency: 90,
    color: '#FFD93D',
    improvements: ['Direct in-vivo CAR-T generation', 'Cost-effective', 'Safer'],
    clinicalUse: 'Next-gen cancer immunotherapy'
  }
];

const organData: OrganData[] = [
  {
    organ: 'Brain',
    x: 300,
    y: 100,
    radius: 60,
    targetingData: [
      { serotype: 'AAV2', efficiency: 30 },
      { serotype: 'AAV9', efficiency: 75 },
      { serotype: 'AAV-PHP.B', efficiency: 95 }
    ]
  },
  {
    organ: 'Liver',
    x: 350,
    y: 250,
    radius: 70,
    targetingData: [
      { serotype: 'AAV2', efficiency: 60 },
      { serotype: 'AAV8', efficiency: 85 },
      { serotype: 'AAV9', efficiency: 40 }
    ]
  },
  {
    organ: 'Heart',
    x: 250,
    y: 230,
    radius: 50,
    targetingData: [
      { serotype: 'AAV2', efficiency: 20 },
      { serotype: 'AAV9', efficiency: 70 }
    ]
  },
  {
    organ: 'Eye',
    x: 280,
    y: 80,
    radius: 30,
    targetingData: [
      { serotype: 'AAV2', efficiency: 80 },
      { serotype: 'AAV8', efficiency: 10 }
    ]
  },
  {
    organ: 'T Cells',
    x: 200,
    y: 350,
    radius: 45,
    targetingData: [
      { serotype: 'AAV-CAR', efficiency: 90 }
    ]
  }
];

export default function GeneTherapyVisualization() {
  const [selectedVector, setSelectedVector] = useState<AAVVector | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedVectors, setComparedVectors] = useState<string[]>([]);
  const bodyMapRef = useRef<SVGSVGElement>(null);
  const comparisonRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!bodyMapRef.current) return;

    const svg = select(bodyMapRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 450;

    // Draw body outline
    const bodyPath = `
      M ${width/2} 50
      Q ${width/2 - 50} 100 ${width/2 - 30} 150
      L ${width/2 - 40} 300
      Q ${width/2 - 45} 350 ${width/2 - 60} 400
      L ${width/2 - 40} 430
      L ${width/2 - 30} 430
      L ${width/2 - 20} 380
      L ${width/2} 350
      L ${width/2 + 20} 380
      L ${width/2 + 30} 430
      L ${width/2 + 40} 430
      L ${width/2 + 60} 400
      Q ${width/2 + 45} 350 ${width/2 + 40} 300
      L ${width/2 + 30} 150
      Q ${width/2 + 50} 100 ${width/2} 50
    `;

    svg.append('path')
      .attr('d', bodyPath)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 2);

    // Draw organs
    const organs = svg.selectAll('.organ')
      .data(organData)
      .enter()
      .append('g')
      .attr('class', 'organ')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    organs.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    organs.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(d => d.organ);

    // Show targeting efficiency when vector is selected
    if (selectedVector) {
      organs.each(function(d) {
        const targetData = d.targetingData.find(t => t.serotype === selectedVector.serotype);
        if (targetData) {
          const g = select(this);
          
          // Efficiency circle
          g.append('circle')
            .attr('r', d.radius)
            .attr('fill', selectedVector.color)
            .attr('opacity', targetData.efficiency / 100 * 0.7)
            .style('mix-blend-mode', 'multiply');

          // Efficiency text
          g.append('text')
            .attr('dy', d.radius + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', selectedVector.color)
            .text(`${targetData.efficiency}%`);
        }
      });

      // Draw delivery arrows
      const targetOrgans = organData.filter(o => 
        selectedVector.targets.includes(o.organ) && 
        o.targetingData.some(t => t.serotype === selectedVector.serotype)
      );

      targetOrgans.forEach(organ => {
        const startX = width / 2;
        const startY = height - 50;
        
        svg.append('path')
          .attr('d', `M ${startX} ${startY} Q ${(startX + organ.x) / 2} ${(startY + organ.y) / 2 - 50} ${organ.x} ${organ.y}`)
          .attr('fill', 'none')
          .attr('stroke', selectedVector.color)
          .attr('stroke-width', 3)
          .attr('opacity', 0.6)
          .attr('stroke-dasharray', '5,5')
          .style('animation', 'dash 2s linear infinite');
      });
    }

  }, [selectedVector]);

  useEffect(() => {
    if (!comparisonRef.current || !comparisonMode) return;

    const svg = select(comparisonRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter vectors for comparison
    const dataToShow = comparedVectors.length > 0 
      ? aavVectors.filter(v => comparedVectors.includes(v.serotype))
      : aavVectors;

    // Scales
    const xScale = scaleBand()
      .domain(organData.map(d => d.organ))
      .range([0, width])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(xScale));

    g.append('g')
      .call(axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('fill', 'black')
      .text('Targeting Efficiency (%)');

    // Lines for each vector
    dataToShow.forEach(vector => {
      const lineData = organData
        .map(organ => {
          const efficiency = organ.targetingData.find(t => t.serotype === vector.serotype)?.efficiency || 0;
          return { organ: organ.organ, efficiency };
        })
        .filter(d => d.efficiency > 0);

      const lineGenerator = line<{organ: string, efficiency: number}>()
        .x(d => xScale(d.organ)! + xScale.bandwidth() / 2)
        .y(d => yScale(d.efficiency))
        .curve(curveMonotoneX);

      g.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', vector.color)
        .attr('stroke-width', 3)
        .attr('d', lineGenerator);

      // Points
      g.selectAll(`.point-${vector.serotype}`)
        .data(lineData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.organ)! + xScale.bandwidth() / 2)
        .attr('cy', d => yScale(d.efficiency))
        .attr('r', 6)
        .attr('fill', vector.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    });

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + margin.left + 20}, ${margin.top})`);

    dataToShow.forEach((vector, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', vector.color);

      legendRow.append('text')
        .attr('x', 25)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .text(vector.serotype);
    });

  }, [comparisonMode, comparedVectors]);

  const toggleComparison = (serotype: string) => {
    setComparedVectors(prev => {
      if (prev.includes(serotype)) {
        return prev.filter(s => s !== serotype);
      } else {
        return [...prev, serotype];
      }
    });
  };

  return (
    <div className="gene-therapy-container">
      <h2>AAV Vector Targeting: Precision Gene Delivery</h2>
      
      <div className="vector-selector">
        <h3>Select an AAV Vector</h3>
        <div className="vector-grid">
          {aavVectors.map(vector => (
            <div
              key={vector.serotype}
              className={`vector-card ${selectedVector?.serotype === vector.serotype ? 'selected' : ''}`}
              onClick={() => setSelectedVector(vector)}
            >
              <div className="vector-header" style={{ backgroundColor: vector.color }}>
                <h4>{vector.serotype}</h4>
                <span>{vector.name}</span>
              </div>
              <div className="vector-content">
                <p className="efficiency">Avg. Efficiency: {vector.efficiency}%</p>
                <p className="clinical-use">{vector.clinicalUse}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="visualization-area">
        <div className="body-map">
          <h3>Organ Targeting Map</h3>
          <svg ref={bodyMapRef} width="600" height="450" />
          {selectedVector && (
            <div className="vector-info">
              <h4>{selectedVector.serotype} - {selectedVector.name}</h4>
              <p><strong>Improvements:</strong></p>
              <ul>
                {selectedVector.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="comparison-section">
          <div className="comparison-header">
            <h3>Vector Comparison</h3>
            <button 
              className="toggle-comparison"
              onClick={() => setComparisonMode(!comparisonMode)}
            >
              {comparisonMode ? 'Hide Comparison' : 'Show Comparison'}
            </button>
          </div>
          
          {comparisonMode && (
            <>
              <div className="comparison-controls">
                {aavVectors.map(vector => (
                  <label key={vector.serotype}>
                    <input
                      type="checkbox"
                      checked={comparedVectors.includes(vector.serotype)}
                      onChange={() => toggleComparison(vector.serotype)}
                    />
                    <span style={{ color: vector.color }}>{vector.serotype}</span>
                  </label>
                ))}
              </div>
              <svg ref={comparisonRef} width="600" height="300" />
            </>
          )}
        </div>
      </div>

      <div className="success-metrics">
        <h3>Success Rates & Real-World Impact</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">95%</div>
            <div className="metric-label">SMA Treatment Success</div>
            <div className="metric-detail">Zolgensma (AAV9) - Prevents paralysis in infants</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">$3.5M → $35K</div>
            <div className="metric-label">Cost Reduction Potential</div>
            <div className="metric-detail">Ramon's in-vivo CAR-T approach</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">40x</div>
            <div className="metric-label">Improved Brain Delivery</div>
            <div className="metric-detail">AAV-PHP.B vs traditional AAV</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">1 Dose</div>
            <div className="metric-label">Lifetime Treatment</div>
            <div className="metric-detail">Gene therapy vs daily medication</div>
          </div>
        </div>
      </div>

      <style>{`
        .gene-therapy-container {
          margin: 2rem 0;
        }

        .vector-selector {
          margin-bottom: 2rem;
        }

        .vector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .vector-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
        }

        .vector-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .vector-card.selected {
          border-width: 3px;
          border-color: #333;
        }

        .vector-header {
          padding: 1rem;
          color: white;
          text-align: center;
        }

        .vector-header h4 {
          margin: 0;
          font-size: 1.2rem;
        }

        .vector-header span {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .vector-content {
          padding: 1rem;
          background: #f9f9f9;
        }

        .efficiency {
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .clinical-use {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.4;
        }

        .visualization-area {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }

        .body-map {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .vector-info {
          margin-top: 1rem;
          padding: 1rem;
          background: #f0f0f0;
          border-radius: 4px;
        }

        .vector-info h4 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        .vector-info ul {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .comparison-section {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .toggle-comparison {
          background: #4A90E2;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle-comparison:hover {
          background: #357ABD;
        }

        .comparison-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .comparison-controls label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .success-metrics {
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.05) 0%, rgba(255, 217, 61, 0.05) 100%);
          border-radius: 8px;
          padding: 2rem;
          margin-top: 3rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .metric-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #50C878;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .metric-detail {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.4;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }

        @media (max-width: 768px) {
          .visualization-area {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}