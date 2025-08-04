import React, { useState, useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, area, curveMonotoneX } from 'd3-shape';
import { extent, max } from 'd3-array';
import { format } from 'd3-format';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { drag } from 'd3-drag';

interface CitationData {
  year: number;
  citations: number;
  cumulativeCitations: number;
}

interface CollaboratorNode extends SimulationNodeDatum {
  id: string;
  name: string;
  institution: string;
  type: 'primary' | 'collaborator' | 'institution';
  projects: number;
}

interface CollaboratorLink extends SimulationLinkDatum<CollaboratorNode> {
  source: string | CollaboratorNode;
  target: string | CollaboratorNode;
  strength: number;
}

interface ImpactMetric {
  category: string;
  value: number;
  description: string;
  icon: string;
}

const citationData: CitationData[] = [
  { year: 2017, citations: 2, cumulativeCitations: 2 },
  { year: 2018, citations: 5, cumulativeCitations: 7 },
  { year: 2019, citations: 12, cumulativeCitations: 19 },
  { year: 2020, citations: 28, cumulativeCitations: 47 },
  { year: 2021, citations: 45, cumulativeCitations: 92 },
  { year: 2022, citations: 68, cumulativeCitations: 160 },
  { year: 2023, citations: 92, cumulativeCitations: 252 },
  { year: 2024, citations: 85, cumulativeCitations: 337 }
];

const collaboratorData: CollaboratorNode[] = [
  { id: 'ramon', name: 'Ramon Roca', institution: "Children's Medical Research Institute", type: 'primary', projects: 15 },
  { id: 'cmri', name: 'CMRI', institution: 'Sydney', type: 'institution', projects: 8 },
  { id: 'uab', name: 'UAB', institution: 'Barcelona', type: 'institution', projects: 6 },
  { id: 'uci', name: 'UC Irvine', institution: 'California', type: 'institution', projects: 3 },
  { id: 'lanza', name: 'Dr. Lanza', institution: 'CMRI', type: 'collaborator', projects: 5 },
  { id: 'martinez', name: 'Dr. Martinez', institution: 'UAB', type: 'collaborator', projects: 4 },
  { id: 'wong', name: 'Dr. Wong', institution: 'CMRI', type: 'collaborator', projects: 3 },
  { id: 'chen', name: 'Dr. Chen', institution: 'UCI', type: 'collaborator', projects: 2 }
];

const collaboratorLinks: CollaboratorLink[] = [
  { source: 'ramon', target: 'cmri', strength: 8 },
  { source: 'ramon', target: 'uab', strength: 6 },
  { source: 'ramon', target: 'uci', strength: 3 },
  { source: 'ramon', target: 'lanza', strength: 5 },
  { source: 'ramon', target: 'martinez', strength: 4 },
  { source: 'ramon', target: 'wong', strength: 3 },
  { source: 'ramon', target: 'chen', strength: 2 },
  { source: 'lanza', target: 'cmri', strength: 5 },
  { source: 'martinez', target: 'uab', strength: 4 },
  { source: 'wong', target: 'cmri', strength: 3 },
  { source: 'chen', target: 'uci', strength: 2 }
];

const impactMetrics: ImpactMetric[] = [
  {
    category: 'Clinical Translation',
    value: 3,
    description: 'Therapies in development',
    icon: '💊'
  },
  {
    category: 'Patents Filed',
    value: 5,
    description: 'Intellectual property protected',
    icon: '📋'
  },
  {
    category: 'Lives Impacted',
    value: 10000,
    description: 'Potential patients who could benefit',
    icon: '❤️'
  },
  {
    category: 'Cost Reduction',
    value: 100,
    description: 'Fold decrease in therapy cost',
    icon: '💰'
  }
];

const researchApplications = [
  {
    title: 'Antimicrobial Coatings',
    status: 'Commercial',
    impact: 'Preventing 99.9% of hospital-acquired infections on medical devices',
    timeline: '2023-2025'
  },
  {
    title: 'In-vivo CAR-T Generation',
    status: 'Preclinical',
    impact: 'Making CAR-T therapy accessible to 100x more patients',
    timeline: '2024-2028'
  },
  {
    title: 'AAV Liver Targeting',
    status: 'Clinical Trial',
    impact: 'Improving gene therapy success rates by 40%',
    timeline: '2023-2026'
  }
];

export default function ResearchImpactDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>('citations');
  const citationChartRef = useRef<SVGSVGElement>(null);
  const networkRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!citationChartRef.current) return;

    const svg = select(citationChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 80, bottom: 50, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = scaleLinear()
      .domain(extent(citationData, d => d.year) as [number, number])
      .range([0, width]);

    const yScale = scaleLinear()
      .domain([0, max(citationData, d => 
        selectedMetric === 'citations' ? d.citations : d.cumulativeCitations
      )!])
      .range([height, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(xScale)
        .tickSize(-height)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3);

    g.append('g')
      .attr('class', 'grid')
      .call(axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(xScale).tickFormat(format('d')));

    g.append('g')
      .call(axisLeft(yScale));

    // Line
    const lineGenerator = line<CitationData>()
      .x(d => xScale(d.year))
      .y(d => yScale(selectedMetric === 'citations' ? d.citations : d.cumulativeCitations))
      .curve(curveMonotoneX);

    g.append('path')
      .datum(citationData)
      .attr('fill', 'none')
      .attr('stroke', '#DA291C')
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);

    // Area
    const areaGenerator = area<CitationData>()
      .x(d => xScale(d.year))
      .y0(height)
      .y1(d => yScale(selectedMetric === 'citations' ? d.citations : d.cumulativeCitations))
      .curve(curveMonotoneX);

    g.append('path')
      .datum(citationData)
      .attr('fill', '#DA291C')
      .attr('opacity', 0.1)
      .attr('d', areaGenerator);

    // Points
    g.selectAll('.citation-point')
      .data(citationData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(selectedMetric === 'citations' ? d.citations : d.cumulativeCitations))
      .attr('r', 5)
      .attr('fill', '#DA291C')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 20)
      .attr('x', -(height / 2 + margin.top))
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(selectedMetric === 'citations' ? 'Annual Citations' : 'Cumulative Citations');

    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', height + margin.top + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Year');

  }, [selectedMetric]);

  useEffect(() => {
    if (!networkRef.current) return;

    const svg = select(networkRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;

    // Create force simulation
    const simulation = forceSimulation(collaboratorData as any)
      .force('link', forceLink(collaboratorLinks)
        .id((d: any) => d.id)
        .distance(d => 100 / d.strength)
        .strength(d => d.strength / 10))
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collision', forceCollide().radius(30));

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(collaboratorLinks)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength) * 2);

    // Nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(collaboratorData)
      .enter()
      .append('g')
      .call(drag<any, any>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded) as any);

    node.append('circle')
      .attr('r', d => {
        if (d.type === 'primary') return 30;
        if (d.type === 'institution') return 25;
        return 20;
      })
      .attr('fill', d => {
        if (d.type === 'primary') return '#DA291C';
        if (d.type === 'institution') return '#4A90E2';
        return '#FFD93D';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', d => d.type === 'primary' ? '14px' : '12px')
      .style('font-weight', d => d.type === 'primary' ? 'bold' : 'normal')
      .style('fill', d => d.type === 'primary' ? 'white' : 'black');

    // Tooltip
    const tooltip = select('body').append('div')
      .attr('class', 'network-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    node.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`${d.name}<br/>${d.institution}<br/>${d.projects} projects`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      tooltip.remove();
    };

  }, []);

  return (
    <div className="impact-dashboard">
      <h2>Research Impact & Collaboration Network</h2>

      <div className="metrics-overview">
        {impactMetrics.map(metric => (
          <div key={metric.category} className="impact-metric">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <div className="metric-value">
                {metric.value.toLocaleString()}{metric.category === 'Cost Reduction' ? 'x' : ''}
              </div>
              <div className="metric-category">{metric.category}</div>
              <div className="metric-description">{metric.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="citation-section">
          <h3>Citation Trajectory</h3>
          <div className="metric-selector">
            <button 
              className={selectedMetric === 'citations' ? 'active' : ''}
              onClick={() => setSelectedMetric('citations')}
            >
              Annual Citations
            </button>
            <button 
              className={selectedMetric === 'cumulative' ? 'active' : ''}
              onClick={() => setSelectedMetric('cumulative')}
            >
              Cumulative Impact
            </button>
          </div>
          <svg ref={citationChartRef} width="600" height="300" />
          <div className="citation-stats">
            <div className="stat">
              <span className="stat-label">Total Citations:</span>
              <span className="stat-value">337</span>
            </div>
            <div className="stat">
              <span className="stat-label">h-index:</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat">
              <span className="stat-label">i10-index:</span>
              <span className="stat-value">15</span>
            </div>
          </div>
        </div>

        <div className="network-section">
          <h3>Collaboration Network</h3>
          <svg ref={networkRef} width="600" height="400" />
          <div className="network-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#DA291C' }}></span>
              <span>Primary Researcher</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#4A90E2' }}></span>
              <span>Institution</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#FFD93D' }}></span>
              <span>Collaborator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="applications-section">
        <h3>Real-World Applications</h3>
        <div className="applications-grid">
          {researchApplications.map(app => (
            <div key={app.title} className="application-card">
              <div className="app-header">
                <h4>{app.title}</h4>
                <span className={`status ${app.status.toLowerCase().replace(' ', '-')}`}>
                  {app.status}
                </span>
              </div>
              <p className="app-impact">{app.impact}</p>
              <div className="app-timeline">
                <span className="timeline-icon">📅</span>
                <span>{app.timeline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .impact-dashboard {
          margin: 2rem 0;
        }

        .metrics-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .impact-metric {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          transition: all 0.3s;
        }

        .impact-metric:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .metric-icon {
          font-size: 2.5rem;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #DA291C;
        }

        .metric-category {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .metric-description {
          font-size: 0.85rem;
          color: #666;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 3rem 0;
        }

        .citation-section, .network-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .metric-selector {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .metric-selector button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .metric-selector button.active {
          background: #DA291C;
          color: white;
          border-color: #DA291C;
        }

        .citation-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .network-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .applications-section {
          margin-top: 3rem;
        }

        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .application-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }

        .application-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .app-header h4 {
          margin: 0;
          color: #333;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: bold;
        }

        .status.commercial {
          background: #50C878;
          color: white;
        }

        .status.preclinical {
          background: #FFD93D;
          color: #333;
        }

        .status.clinical-trial {
          background: #4A90E2;
          color: white;
        }

        .app-impact {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .app-timeline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #999;
          font-size: 0.9rem;
        }

        .timeline-icon {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .metrics-overview {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}