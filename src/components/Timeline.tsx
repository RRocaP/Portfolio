import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from '../utils/animations';

export interface TimelineItem {
  id: string;
  date: string;
  title: {
    en: string;
    es: string;
    ca: string;
  };
  description: {
    en: string;
    es: string;
    ca: string;
  };
  category: 'education' | 'research' | 'publications' | 'experience';
  location?: string;
  link?: string;
  tags?: string[];
}

interface TimelineProps {
  lang: 'en' | 'es' | 'ca';
  items?: TimelineItem[];
  className?: string;
}

const DEFAULT_ITEMS: TimelineItem[] = [
  {
    id: '2024-phd',
    date: '2024',
    title: {
      en: 'PhD in Biomedical Engineering',
      es: 'Doctorado en Ingeniería Biomédica',
      ca: 'Doctorat en Enginyeria Biomèdica'
    },
    description: {
      en: 'Advanced research in protein engineering and antimicrobial resistance mechanisms.',
      es: 'Investigación avanzada en ingeniería de proteínas y mecanismos de resistencia antimicrobiana.',
      ca: 'Recerca avançada en enginyeria de proteïnes i mecanismes de resistència antimicrobiana.'
    },
    category: 'education',
    location: 'University Research Center'
  },
  {
    id: '2023-research',
    date: '2023',
    title: {
      en: 'Protein Design Publication',
      es: 'Publicación sobre Diseño de Proteínas',
      ca: 'Publicació sobre Disseny de Proteïnes'
    },
    description: {
      en: 'Published breakthrough research on computational protein design methodologies.',
      es: 'Publicó investigación pionera sobre metodologías computacionales de diseño de proteínas.',
      ca: 'Va publicar recerca pionera sobre metodologies computacionals de disseny de proteïnes.'
    },
    category: 'publications',
    link: '#'
  },
  {
    id: '2022-masters',
    date: '2022',
    title: {
      en: 'MSc in Biotechnology',
      es: 'Máster en Biotecnología',
      ca: 'Màster en Biotecnologia'
    },
    description: {
      en: 'Specialized in computational biology and bioinformatics applications.',
      es: 'Especializado en biología computacional y aplicaciones de bioinformática.',
      ca: 'Especialitzat en biologia computacional i aplicacions de bioinformàtica.'
    },
    category: 'education',
    location: 'Barcelona Tech Institute'
  }
];

const CATEGORY_LABELS = {
  all: { en: 'All', es: 'Todo', ca: 'Tot' },
  education: { en: 'Education', es: 'Educación', ca: 'Educació' },
  research: { en: 'Research', es: 'Investigación', ca: 'Recerca' },
  publications: { en: 'Publications', es: 'Publicaciones', ca: 'Publicacions' },
  experience: { en: 'Experience', es: 'Experiencia', ca: 'Experiència' }
};

const VIRTUAL_ITEM_HEIGHT = 200; // Approximate height per item
const OVERSCAN = 5; // Number of items to render outside viewport

export default function Timeline({ lang, items = DEFAULT_ITEMS, className = '' }: TimelineProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  // Filter items based on active filter
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter(item => item.category === activeFilter);
  }, [items, activeFilter]);

  // Virtualization: calculate visible items based on scroll position
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const containerHeight = containerRef.current.clientHeight;
    
    const start = Math.max(0, Math.floor(scrollTop / VIRTUAL_ITEM_HEIGHT) - OVERSCAN);
    const end = Math.min(
      filteredItems.length,
      Math.ceil((scrollTop + containerHeight) / VIRTUAL_ITEM_HEIGHT) + OVERSCAN
    );
    
    setVisibleRange({ start, end });
  }, [filteredItems.length]);

  // Set up scroll listener for virtualization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateVisibleRange();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    updateVisibleRange(); // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateVisibleRange]);

  // Handle item expansion
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
    setExpandedItems(new Set()); // Collapse all when filtering
  }, []);

  // Generate SVG path for timeline connector
  const generateConnectorPath = useCallback((index: number, total: number) => {
    const isLast = index === total - 1;
    const height = VIRTUAL_ITEM_HEIGHT;
    
    if (isLast) {
      return `M 20 0 L 20 ${height * 0.3}`;
    }
    return `M 20 0 L 20 ${height}`;
  }, []);

  const visibleItems = filteredItems.slice(visibleRange.start, visibleRange.end);
  const totalHeight = filteredItems.length * VIRTUAL_ITEM_HEIGHT;
  const offsetY = visibleRange.start * VIRTUAL_ITEM_HEIGHT;

  return (
    <div className={`timeline-container ${className}`}>
      {/* Filter Controls */}
      <div className="timeline-filters" role="tablist" aria-label="Timeline category filters">
        {Object.entries(CATEGORY_LABELS).map(([key, labels]) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeFilter === key}
            aria-controls="timeline-content"
            className={`timeline-filter ${activeFilter === key ? 'active' : ''}`}
            onClick={() => handleFilterChange(key)}
          >
            {labels[lang]}
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <div
        ref={containerRef}
        id="timeline-content"
        className="timeline-scroll-container"
        role="tabpanel"
        aria-live="polite"
      >
        <div
          ref={listRef}
          className="timeline-list"
          style={{ height: totalHeight }}
        >
          <div
            className="timeline-visible-items"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleItems.map((item, index) => {
              const actualIndex = visibleRange.start + index;
              const isExpanded = expandedItems.has(item.id);
              const isEven = actualIndex % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`timeline-item ${isEven ? 'even' : 'odd'} ${isExpanded ? 'expanded' : ''}`}
                  style={{
                    transform: isReducedMotion ? 'none' : undefined,
                    transition: isReducedMotion ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
                  }}
                >
                  {/* SVG Connector */}
                  <div className="timeline-connector" aria-hidden="true">
                    <svg
                      width="40"
                      height={VIRTUAL_ITEM_HEIGHT}
                      className="timeline-svg"
                    >
                      <path
                        d={generateConnectorPath(actualIndex, filteredItems.length)}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className={isReducedMotion ? 'no-animation' : 'draw-animation'}
                        style={{
                          '--animation-delay': isReducedMotion ? '0s' : `${actualIndex * 0.1}s`
                        } as React.CSSProperties}
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="6"
                        fill="currentColor"
                        className="timeline-dot"
                      />
                    </svg>
                  </div>

                  {/* Content Card */}
                  <div className={`timeline-card ${isEven ? 'left' : 'right'}`}>
                    <div className="timeline-header">
                      <time className="timeline-date" dateTime={item.date}>
                        {item.date}
                      </time>
                      <span className={`timeline-category category-${item.category}`}>
                        {CATEGORY_LABELS[item.category][lang]}
                      </span>
                    </div>

                    <h3 className="timeline-title">
                      {item.title[lang]}
                    </h3>

                    <div className={`timeline-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                      <p>{item.description[lang]}</p>
                      
                      {item.location && (
                        <p className="timeline-location">
                          <span className="sr-only">Location: </span>
                          📍 {item.location}
                        </p>
                      )}

                      {item.tags && (
                        <div className="timeline-tags">
                          {item.tags.map(tag => (
                            <span key={tag} className="timeline-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          className="timeline-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more →
                        </a>
                      )}
                    </div>

                    <button
                      className="timeline-toggle"
                      onClick={() => toggleExpanded(item.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`timeline-content-${item.id}`}
                    >
                      {isExpanded ? '↑' : '↓'}
                      <span className="sr-only">
                        {isExpanded ? 'Collapse' : 'Expand'} details
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .timeline-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .timeline-filter {
          padding: 0.5rem 1rem;
          border: 1px solid #374151;
          border-radius: 6px;
          background: transparent;
          color: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .timeline-filter:hover {
          border-color: #da291c;
          color: #da291c;
        }

        .timeline-filter.active {
          background: #da291c;
          border-color: #da291c;
          color: white;
        }

        .timeline-filter:focus {
          outline: 2px solid #da291c;
          outline-offset: 2px;
        }

        .timeline-scroll-container {
          height: 600px;
          overflow-y: auto;
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: #374151 #1f2937;
        }

        .timeline-scroll-container::-webkit-scrollbar {
          width: 6px;
        }

        .timeline-scroll-container::-webkit-scrollbar-track {
          background: #1f2937;
        }

        .timeline-scroll-container::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }

        .timeline-list {
          position: relative;
        }

        .timeline-visible-items {
          position: relative;
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          min-height: ${VIRTUAL_ITEM_HEIGHT}px;
          margin-bottom: 2rem;
          opacity: 1;
        }

        .timeline-connector {
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .timeline-svg {
          color: #4b5563;
        }

        .draw-animation path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 0.6s ease-out forwards;
          animation-delay: var(--animation-delay);
        }

        .no-animation path {
          stroke-dasharray: none;
          stroke-dashoffset: 0;
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        .timeline-dot {
          color: #da291c;
        }

        .timeline-card {
          flex: 1;
          background: #1f2937;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #374151;
          position: relative;
          margin-left: 1rem;
        }

        .timeline-card.right {
          margin-left: 1rem;
          margin-right: 0;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .timeline-date {
          font-weight: 600;
          color: #ffd93d;
          font-size: 0.875rem;
        }

        .timeline-category {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .category-education {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }

        .category-research {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        .category-publications {
          background: rgba(168, 85, 247, 0.2);
          color: #c084fc;
        }

        .category-experience {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }

        .timeline-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .timeline-description {
          color: #d1d5db;
          line-height: 1.6;
        }

        .timeline-description.collapsed {
          max-height: 4.5rem;
          overflow: hidden;
          position: relative;
        }

        .timeline-description.collapsed::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2rem;
          background: linear-gradient(transparent, #1f2937);
        }

        .timeline-description.expanded {
          max-height: none;
        }

        .timeline-location {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .timeline-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .timeline-tag {
          padding: 0.25rem 0.5rem;
          background: #374151;
          color: #d1d5db;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .timeline-link {
          display: inline-block;
          margin-top: 1rem;
          color: #da291c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .timeline-link:hover {
          color: #ffd93d;
        }

        .timeline-toggle {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          border: 1px solid #374151;
          border-radius: 50%;
          background: #1f2937;
          color: #d1d5db;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .timeline-toggle:hover {
          border-color: #da291c;
          color: #da291c;
        }

        .timeline-toggle:focus {
          outline: 2px solid #da291c;
          outline-offset: 2px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .timeline-scroll-container {
            height: 500px;
          }
          
          .timeline-card {
            margin-left: 0.5rem;
            padding: 1rem;
          }
          
          .timeline-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .timeline-title {
            font-size: 1.125rem;
          }
        }

        /* Print styles */
        @media print {
          .timeline-container {
            max-width: none;
          }
          
          .timeline-scroll-container {
            height: auto;
            overflow: visible;
          }
          
          .timeline-list {
            height: auto !important;
          }
          
          .timeline-visible-items {
            transform: none !important;
          }
          
          .timeline-filters {
            display: none;
          }
          
          .timeline-toggle {
            display: none;
          }
          
          .timeline-description.collapsed {
            max-height: none;
          }
          
          .timeline-description.collapsed::after {
            display: none;
          }
        }

        /* Reduced motion respect */
        @media (prefers-reduced-motion: reduce) {
          .timeline-item {
            transition: none;
          }
          
          .draw-animation path {
            animation: none;
            stroke-dasharray: none;
            stroke-dashoffset: 0;
          }
          
          .timeline-filter,
          .timeline-link,
          .timeline-toggle {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
