import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  type: 'education' | 'career' | 'research' | 'achievement' | 'publication';
  location?: string;
  organization?: string;
  details?: string[];
  links?: {
    label: string;
    url: string;
    type: 'publication' | 'website' | 'github' | 'linkedin';
  }[];
  skills?: string[];
  featured?: boolean;
}

interface TimelineProps {
  lang?: 'en' | 'es' | 'ca';
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
}

const TimelineComponent: React.FC<TimelineProps> = ({ 
  lang = 'en',
  className = '',
  showFilters = true,
  maxItems
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visibleItems, setVisibleItems] = useState<number>(6);

  // Internationalization
  const content = {
    en: {
      title: 'Professional Journey',
      subtitle: 'Key milestones in my academic and professional career',
      filters: {
        all: 'All Events',
        education: 'Education',
        career: 'Career',
        research: 'Research',
        achievement: 'Achievements',
        publication: 'Publications'
      },
      labels: {
        location: 'Location',
        organization: 'Organization',
        skills: 'Skills Developed',
        showMore: 'Show More',
        showLess: 'Show Less',
        readMore: 'Read More',
        readLess: 'Read Less'
      },
      present: 'Present'
    },
    es: {
      title: 'Trayectoria Profesional',
      subtitle: 'Hitos clave en mi carrera académica y profesional',
      filters: {
        all: 'Todos los Eventos',
        education: 'Educación',
        career: 'Carrera',
        research: 'Investigación',
        achievement: 'Logros',
        publication: 'Publicaciones'
      },
      labels: {
        location: 'Ubicación',
        organization: 'Organización',
        skills: 'Habilidades Desarrolladas',
        showMore: 'Mostrar Más',
        showLess: 'Mostrar Menos',
        readMore: 'Leer Más',
        readLess: 'Leer Menos'
      },
      present: 'Presente'
    },
    ca: {
      title: 'Trajectòria Professional',
      subtitle: 'Fites clau en la meva carrera acadèmica i professional',
      filters: {
        all: 'Tots els Esdeveniments',
        education: 'Educació',
        career: 'Carrera',
        research: 'Recerca',
        achievement: 'Assoliments',
        publication: 'Publicacions'
      },
      labels: {
        location: 'Ubicació',
        organization: 'Organització',
        skills: 'Habilitats Desenvolupades',
        showMore: 'Mostrar Més',
        showLess: 'Mostrar Menys',
        readMore: 'Llegir Més',
        readLess: 'Llegir Menys'
      },
      present: 'Present'
    }
  };

  const currentContent = content[lang];

  // Timeline data
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'current-role',
      date: '2023 - Present',
      title: 'Senior Biomedical Engineer',
      subtitle: 'Protein Engineering & Therapeutics',
      description: 'Leading research in antimicrobial resistance and therapeutic protein development. Managing interdisciplinary teams and driving innovation in biomedical engineering.',
      type: 'career',
      location: 'Barcelona, Spain',
      organization: 'Biotech Research Institute',
      details: [
        'Led 5+ protein engineering projects resulting in 3 patents',
        'Managed €2M research budget across multiple initiatives',
        'Published 8 peer-reviewed papers in high-impact journals',
        'Established partnerships with 3 pharmaceutical companies'
      ],
      skills: ['Project Management', 'Team Leadership', 'Grant Writing', 'Strategic Planning'],
      featured: true
    },
    {
      id: 'phd-completion',
      date: '2020 - 2023',
      title: 'Ph.D. in Biomedical Engineering',
      subtitle: 'Summa Cum Laude',
      description: 'Doctoral thesis on "Functional Inclusion Bodies: Engineering Protein Aggregates for Therapeutic Applications". Groundbreaking research in protein aggregation control.',
      type: 'education',
      location: 'Autonomous University of Barcelona',
      organization: 'UAB Institute for Biotechnology',
      details: [
        'Developed novel methods for controlled protein aggregation',
        'Published 12 first-author papers (h-index: 15)',
        'Won Young Researcher Award 2023',
        'Completed research stay at MIT (6 months)'
      ],
      links: [
        {
          label: 'Thesis Defense Video',
          url: 'https://example.com/thesis',
          type: 'website'
        }
      ],
      skills: ['Protein Engineering', 'Research Design', 'Data Analysis', 'Scientific Writing'],
      featured: true
    },
    {
      id: 'mit-collaboration',
      date: '2022',
      title: 'Visiting Researcher',
      subtitle: 'MIT Synthetic Biology Center',
      description: 'Collaborative research on synthetic biology applications of functional protein aggregates. Worked with leading experts in the field.',
      type: 'research',
      location: 'Cambridge, MA, USA',
      organization: 'Massachusetts Institute of Technology',
      details: [
        'Collaborated with Dr. Sarah Johnson on novel expression systems',
        'Developed new protocols for protein characterization',
        'Co-authored 2 Nature Biotechnology papers',
        'Established ongoing international collaboration'
      ],
      skills: ['International Collaboration', 'Synthetic Biology', 'Protocol Development'],
      featured: true
    },
    {
      id: 'breakthrough-publication',
      date: '2021',
      title: 'Nature Biotechnology Publication',
      subtitle: 'First-author breakthrough paper',
      description: '"Engineered inclusion bodies for enhanced protein stability and activity" - Revolutionary approach to protein engineering.',
      type: 'publication',
      details: [
        'Cited 150+ times in first year',
        'Featured on journal cover',
        'Subject of Nature News & Views commentary',
        'Presented at 5 international conferences'
      ],
      links: [
        {
          label: 'Read Paper',
          url: 'https://example.com/nature-paper',
          type: 'publication'
        }
      ],
      featured: true
    },
    {
      id: 'startup-experience',
      date: '2019 - 2020',
      title: 'Biotech Startup Co-founder',
      subtitle: 'ProteineX Therapeutics',
      description: 'Co-founded startup focused on therapeutic protein development. Led technical development and proof-of-concept studies.',
      type: 'career',
      location: 'Barcelona, Spain',
      details: [
        'Secured €500K seed funding',
        'Developed 3 therapeutic protein candidates',
        'Built team of 8 researchers',
        'Established IP portfolio (5 patents filed)'
      ],
      skills: ['Entrepreneurship', 'Business Development', 'IP Strategy', 'Team Building']
    },
    {
      id: 'masters-degree',
      date: '2017 - 2019',
      title: 'M.Sc. Biotechnology',
      subtitle: 'First Class Honours',
      description: 'Master\'s degree specializing in protein engineering and bioprocess development. Thesis on antimicrobial peptide production.',
      type: 'education',
      location: 'University of Barcelona',
      organization: 'Department of Chemical Engineering',
      details: [
        'GPA: 3.9/4.0',
        'Research excellence scholarship recipient',
        'Teaching assistant for biochemistry courses',
        'Completed industry internship at Grifols'
      ],
      skills: ['Bioprocess Engineering', 'Protein Purification', 'Teaching', 'Quality Control']
    },
    {
      id: 'industry-internship',
      date: '2018',
      title: 'Research Intern',
      subtitle: 'Grifols Pharmaceutical',
      description: 'Industrial internship focusing on plasma protein fractionation and purification processes. Gained valuable industry experience.',
      type: 'career',
      location: 'Barcelona, Spain',
      organization: 'Grifols S.A.',
      details: [
        'Optimized protein purification protocols',
        'Reduced production costs by 15%',
        'Implemented new quality control measures',
        'Received outstanding intern evaluation'
      ],
      skills: ['Industrial Biotechnology', 'Process Optimization', 'GMP Compliance']
    },
    {
      id: 'conference-award',
      date: '2018',
      title: 'Best Student Presentation Award',
      subtitle: 'European Biotechnology Conference',
      description: 'Recognized for outstanding research presentation on "Novel Antimicrobial Peptides from Inclusion Bodies".',
      type: 'achievement',
      location: 'Vienna, Austria',
      details: [
        'Competed against 200+ student presentations',
        'Featured in conference proceedings',
        'Invited for follow-up collaboration discussions'
      ]
    },
    {
      id: 'bachelors-degree',
      date: '2013 - 2017',
      title: 'B.Sc. Biochemistry',
      subtitle: 'Honors Degree',
      description: 'Bachelor\'s degree in Biochemistry with focus on molecular biology and protein chemistry. Strong foundation in life sciences.',
      type: 'education',
      location: 'University of Barcelona',
      organization: 'Faculty of Biology',
      details: [
        'Dean\'s List all semesters',
        'Undergraduate research project on protein folding',
        'President of Biochemistry Student Association',
        'Volunteer tutor for first-year students'
      ],
      skills: ['Biochemistry', 'Molecular Biology', 'Leadership', 'Academic Excellence']
    },
    {
      id: 'first-publication',
      date: '2016',
      title: 'First Scientific Publication',
      subtitle: 'Journal of Biological Chemistry',
      description: 'First peer-reviewed publication as undergraduate researcher: "Characterization of novel protein-protein interactions in bacterial systems".',
      type: 'publication',
      details: [
        'First undergraduate author in department',
        'Resulted from summer research program',
        'Led to invitation for graduate studies'
      ],
      links: [
        {
          label: 'View Publication',
          url: 'https://example.com/first-paper',
          type: 'publication'
        }
      ]
    }
  ];

  // Filter events
  const filteredEvents = timelineEvents.filter(event => 
    activeFilter === 'all' || event.type === activeFilter
  );

  const displayedEvents = maxItems 
    ? filteredEvents.slice(0, Math.min(maxItems, visibleItems))
    : filteredEvents.slice(0, visibleItems);

  // Type colors and icons
  const typeConfig = {
    education: { color: '#0EA5E9', icon: '🎓' },
    career: { color: '#10B981', icon: '💼' },
    research: { color: '#8B5CF6', icon: '🔬' },
    achievement: { color: '#F59E0B', icon: '🏆' },
    publication: { color: '#EF4444', icon: '📄' }
  };

  // Animations
  useEffect(() => {
    if (!timelineRef.current) return;

    const items = timelineRef.current.querySelectorAll('.timeline-item');
    
    gsap.fromTo(items,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Animate timeline line
    const timelineLine = timelineRef.current.querySelector('.timeline-line');
    if (timelineLine) {
      gsap.fromTo(timelineLine,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, [filteredEvents, visibleItems]);

  const formatDate = (dateString: string) => {
    if (dateString.includes('Present')) {
      return dateString.replace('Present', currentContent.present);
    }
    return dateString;
  };

  const handleShowMore = () => {
    setVisibleItems(prev => Math.min(prev + 6, filteredEvents.length));
  };

  const handleShowLess = () => {
    setVisibleItems(6);
  };

  return (
    <section className={`py-16 bg-gradient-to-b from-gray-900 to-black ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(currentContent.filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveFilter(key);
                  setVisibleItems(6);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === key
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-transparent timeline-line" />

          {/* Timeline items */}
          <div className="space-y-12">
            {displayedEvents.map((event, index) => (
              <div key={event.id} className="relative timeline-item">
                {/* Timeline dot */}
                <div 
                  className="absolute left-6 w-4 h-4 rounded-full border-4 border-gray-900 z-10"
                  style={{ backgroundColor: typeConfig[event.type].color }}
                />

                {/* Event card */}
                <div className="ml-20 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{typeConfig[event.type].icon}</span>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {event.title}
                          </h3>
                          {event.subtitle && (
                            <p className="text-sm text-gray-400">{event.subtitle}</p>
                          )}
                        </div>
                        {event.featured && (
                          <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div 
                        className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${typeConfig[event.type].color}20`,
                          color: typeConfig[event.type].color 
                        }}
                      >
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </div>

                  {/* Location & Organization */}
                  {(event.location || event.organization) && (
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                      {event.location && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </div>
                      )}
                      {event.organization && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {event.organization}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-300 mb-4">{event.description}</p>

                  {/* Details */}
                  {event.details && event.details.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white mb-2">Key Accomplishments</h4>
                      <ul className="space-y-1">
                        {event.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-gray-400 flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills */}
                  {event.skills && event.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white mb-2">{currentContent.labels.skills}</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {event.links && event.links.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {event.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                            link.type === 'publication'
                              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                              : link.type === 'github'
                              ? 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                              : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                          }`}
                        >
                          {link.type === 'publication' && (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          {link.type === 'github' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          )}
                          {link.type === 'website' && (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Show more/less buttons */}
          {filteredEvents.length > 6 && (
            <div className="text-center mt-12">
              {visibleItems < filteredEvents.length ? (
                <button
                  onClick={handleShowMore}
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  {currentContent.labels.showMore} ({filteredEvents.length - visibleItems} more)
                </button>
              ) : visibleItems > 6 ? (
                <button
                  onClick={handleShowLess}
                  className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  {currentContent.labels.showLess}
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-red-400 mb-1">10+</div>
            <div className="text-sm text-gray-400">Years Experience</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400 mb-1">25+</div>
            <div className="text-sm text-gray-400">Publications</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">8</div>
            <div className="text-sm text-gray-400">Awards</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">5</div>
            <div className="text-sm text-gray-400">Patents</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineComponent;