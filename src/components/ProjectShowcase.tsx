import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  category: 'research' | 'development' | 'publication';
  year: number;
  status: 'completed' | 'in-progress' | 'published';
  links: {
    github?: string;
    demo?: string;
    paper?: string;
    doi?: string;
  };
  metrics: {
    stars?: number;
    citations?: number;
    impact?: string;
  };
  featured: boolean;
}

interface ProjectShowcaseProps {
  projects: Project[];
  lang?: 'en' | 'es' | 'ca';
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects, lang = 'en' }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'research' | 'development' | 'publication'>('all');
  const [sortBy, setSortBy] = useState<'year' | 'title' | 'status'>('year');
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Internationalization
  const content = {
    en: {
      title: "Research & Projects",
      subtitle: "Breakthrough innovations in biomedical engineering and AI-driven therapeutics",
      filters: {
        all: "All Projects",
        research: "Research",
        development: "Development",
        publication: "Publications"
      },
      sort: {
        year: "Year",
        title: "Title",
        status: "Status"
      },
      actions: {
        viewDetails: "View Details",
        viewCode: "View Code",
        readPaper: "Read Paper",
        viewDemo: "Live Demo",
        close: "Close"
      },
      stats: {
        citations: "Citations",
        stars: "Stars",
        impact: "Impact Factor"
      },
      status: {
        completed: "Completed",
        'in-progress': "In Progress",
        published: "Published"
      }
    },
    es: {
      title: "Investigación y Proyectos",
      subtitle: "Innovaciones revolucionarias en ingeniería biomédica y terapéuticas impulsadas por IA",
      filters: {
        all: "Todos los Proyectos",
        research: "Investigación",
        development: "Desarrollo",
        publication: "Publicaciones"
      },
      sort: {
        year: "Año",
        title: "Título",
        status: "Estado"
      },
      actions: {
        viewDetails: "Ver Detalles",
        viewCode: "Ver Código",
        readPaper: "Leer Artículo",
        viewDemo: "Demo en Vivo",
        close: "Cerrar"
      },
      stats: {
        citations: "Citas",
        stars: "Estrellas",
        impact: "Factor de Impacto"
      },
      status: {
        completed: "Completado",
        'in-progress': "En Progreso",
        published: "Publicado"
      }
    },
    ca: {
      title: "Recerca i Projectes",
      subtitle: "Innovacions revolucionàries en enginyeria biomèdica i terapèutiques impulsades per IA",
      filters: {
        all: "Tots els Projectes",
        research: "Recerca",
        development: "Desenvolupament",
        publication: "Publicacions"
      },
      sort: {
        year: "Any",
        title: "Títol",
        status: "Estat"
      },
      actions: {
        viewDetails: "Veure Detalls",
        viewCode: "Veure Codi",
        readPaper: "Llegir Article",
        viewDemo: "Demo en Viu",
        close: "Tancar"
      },
      stats: {
        citations: "Cites",
        stars: "Estrelles",
        impact: "Factor d'Impacte"
      },
      status: {
        completed: "Completat",
        'in-progress': "En Progrés",
        published: "Publicat"
      }
    }
  };

  const currentContent = content[lang];

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return b.year - a.year;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [projects, filter, sortBy]);

  // Initialize GSAP animations
  useEffect(() => {
    if (!containerRef.current || !gridRef.current) return;

    // Entrance animation
    gsap.set('.project-card', { y: 100, opacity: 0, rotateX: -15 });
    
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to('.project-card', {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredAndSortedProjects]);

  // 3D hover effects
  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, entering: boolean) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    if (entering) {
      const rotateX = (e.clientY - centerY) / 10;
      const rotateY = (centerX - e.clientX) / 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        z: 50,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000
      });
      
      gsap.to(card.querySelector('.card-content'), {
        z: 20,
        duration: 0.3
      });
    } else {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        z: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      gsap.to(card.querySelector('.card-content'), {
        z: 0,
        duration: 0.5
      });
    }
  };

  // Lightbox functionality
  const openLightbox = (project: Project) => {
    setSelectedProject(project);
    setLightboxOpen(true);
    
    if (lightboxRef.current) {
      gsap.set(lightboxRef.current, { opacity: 0, scale: 0.8 });
      gsap.to(lightboxRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    }
    
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (lightboxRef.current) {
      gsap.to(lightboxRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        onComplete: () => {
          setLightboxOpen(false);
          setSelectedProject(null);
        }
      });
    }
    
    document.body.style.overflow = 'auto';
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
      <div className="bg-gray-700/50 h-48 rounded-lg mb-4" />
      <div className="bg-gray-700/50 h-6 rounded mb-2" />
      <div className="bg-gray-700/50 h-4 rounded mb-4" />
      <div className="flex gap-2">
        <div className="bg-gray-700/50 h-6 w-16 rounded" />
        <div className="bg-gray-700/50 h-6 w-20 rounded" />
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(currentContent.filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === key
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {Object.entries(currentContent.sort).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Projects Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: '1000px' }}
        >
          {filteredAndSortedProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group cursor-pointer"
              onMouseMove={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              onClick={() => openLightbox(project)}
            >
              <div className="card-content bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-red-500/30 transition-colors duration-300">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  {isLoading[project.id] ? (
                    <div className="w-full h-full bg-gray-700/50 animate-pulse" />
                  ) : (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onLoad={() => setIsLoading(prev => ({ ...prev, [project.id]: false }))}
                        onError={() => setIsLoading(prev => ({ ...prev, [project.id]: false }))}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-600 text-white' :
                        project.status === 'in-progress' ? 'bg-blue-600 text-white' :
                        'bg-purple-600 text-white'
                      }`}>
                        {currentContent.status[project.status]}
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-sm text-gray-400">{project.year}</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-700/50 text-xs text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-xs text-gray-400 rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    {project.metrics.stars && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {project.metrics.stars}
                      </div>
                    )}
                    {project.metrics.citations && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                        </svg>
                        {project.metrics.citations}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show skeleton cards if loading */}
        {Object.values(isLoading).some(Boolean) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={lightboxRef}
            className="bg-gray-900/95 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{selectedProject.year}</span>
                    <span className="capitalize">{selectedProject.category}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      selectedProject.status === 'completed' ? 'bg-green-600' :
                      selectedProject.status === 'in-progress' ? 'bg-blue-600' :
                      'bg-purple-600'
                    }`}>
                      {currentContent.status[selectedProject.status]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeLightbox}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-gray-300 leading-relaxed">
                  {selectedProject.longDescription}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedProject.metrics.stars && (
                    <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-400">{selectedProject.metrics.stars}</div>
                      <div className="text-sm text-gray-400">{currentContent.stats.stars}</div>
                    </div>
                  )}
                  {selectedProject.metrics.citations && (
                    <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">{selectedProject.metrics.citations}</div>
                      <div className="text-sm text-gray-400">{currentContent.stats.citations}</div>
                    </div>
                  )}
                  {selectedProject.metrics.impact && (
                    <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">{selectedProject.metrics.impact}</div>
                      <div className="text-sm text-gray-400">{currentContent.stats.impact}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {selectedProject.links.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    {currentContent.actions.viewCode}
                  </a>
                )}
                {selectedProject.links.demo && (
                  <a
                    href={selectedProject.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {currentContent.actions.viewDemo}
                  </a>
                )}
                {selectedProject.links.paper && (
                  <a
                    href={selectedProject.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {currentContent.actions.readPaper}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectShowcase;