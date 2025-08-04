import React from 'react';

interface TimelineData {
  antibiotic: string;
  yearIntroduced: number;
  yearResistanceDetected: number;
  category: string;
  description: string;
  impact: string;
}

const antibioticData: TimelineData[] = [
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

const categoryColors: Record<string, string> = {
  'Beta-lactam': '#7e1900',
  'Aminoglycoside': '#ae5d00',
  'Tetracycline': '#da9100',
  'Glycopeptide': '#f4be2f',
  'Quinolone': '#2f91be',
  'Lipopeptide': '#005dae',
  'Cephalosporin': '#00197e'
};

export default function SimpleTimeline() {
  const [selectedItem, setSelectedItem] = React.useState<TimelineData | null>(null);
  
  return (
    <div className="simple-timeline">
      <div className="timeline-container">
        {antibioticData.map((item, index) => {
          const timeToResistance = item.yearResistanceDetected - item.yearIntroduced;
          const barWidth = Math.max(timeToResistance * 2, 4); // Minimum 4px width
          
          return (
            <div 
              key={item.antibiotic}
              className="timeline-item"
              onMouseEnter={() => setSelectedItem(item)}
              onMouseLeave={() => setSelectedItem(null)}
            >
              <div className="item-header">
                <span className="antibiotic-name">{item.antibiotic}</span>
                <span className="years">{item.yearIntroduced} → {item.yearResistanceDetected}</span>
              </div>
              <div className="timeline-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${barWidth}px`,
                    backgroundColor: categoryColors[item.category] || '#666',
                  }}
                />
                <span className="resistance-time">{timeToResistance}y</span>
              </div>
              <div className="category-badge" style={{ backgroundColor: categoryColors[item.category] }}>
                {item.category}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedItem && (
        <div className="info-panel">
          <h3>{selectedItem.antibiotic}</h3>
          <p><strong>Category:</strong> {selectedItem.category}</p>
          <p><strong>Time to Resistance:</strong> {selectedItem.yearResistanceDetected - selectedItem.yearIntroduced} years</p>
          <p>{selectedItem.description}</p>
          <p><em>{selectedItem.impact}</em></p>
        </div>
      )}
      
      <div className="insights-box">
        <h3>Key Insights</h3>
        <p>The timeline reveals a critical pattern: resistance emergence is accelerating over time.</p>
        <ul>
          <li>Early antibiotics (1940s-1960s): Resistance within 0-7 years</li>
          <li>Modern antibiotics (2000s+): Resistance within 1-2 years</li>
          <li>Average time to resistance: Less than 5 years</li>
        </ul>
        <p>This highlights the urgent need for novel antimicrobial strategies beyond traditional small molecules.</p>
      </div>
      
      <style>{`
        .simple-timeline {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin: 2rem 0;
          position: relative;
          overflow: visible;
          min-height: 400px;
        }
        
        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .timeline-item {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        
        .timeline-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .antibiotic-name {
          font-weight: bold;
          font-size: 1.1rem;
          color: #fff;
        }
        
        .years {
          font-size: 0.9rem;
          color: #ccc;
        }
        
        .timeline-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
          min-height: 24px;
        }
        
        .bar-fill {
          height: 12px;
          border-radius: 6px;
          transition: all 0.3s;
          min-width: 4px;
        }
        
        .resistance-time {
          font-size: 0.9rem;
          color: #DA291C;
          font-weight: bold;
          min-width: 30px;
          text-align: right;
        }
        
        .category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          color: white;
          font-weight: 500;
        }
        
        .info-panel {
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          max-width: 300px;
          z-index: 1000;
          color: #333;
        }
        
        .info-panel h3 {
          margin: 0 0 0.5rem 0;
          color: #7e1900;
        }
        
        .info-panel p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }
        
        .insights-box {
          background: linear-gradient(135deg, rgba(126, 25, 0, 0.05) 0%, rgba(0, 25, 126, 0.05) 100%);
          border: 2px solid #ae5d00;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        
        .insights-box h3 {
          color: #7e1900;
          margin-bottom: 1rem;
        }
        
        .insights-box p {
          line-height: 1.6;
        }
        
        .insights-box ul {
          margin-left: 1.5rem;
        }
        
        .insights-box li {
          margin: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
          .item-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .info-panel {
            position: static;
            transform: none;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}