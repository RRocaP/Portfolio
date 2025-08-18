import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillData {
  category: string;
  skills: {
    name: string;
    level: number; // 0-100
    yearsExperience: number;
    projects: string[];
    description: string;
  }[];
  color: string;
}

interface SkillsVisualizationProps {
  lang?: 'en' | 'es' | 'ca';
  className?: string;
  interactive?: boolean;
  showLegend?: boolean;
}

const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({ 
  lang = 'en',
  className = '',
  interactive = true,
  showLegend = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Internationalization
  const content = {
    en: {
      title: 'Technical Expertise',
      subtitle: 'Interactive visualization of my skills and experience across different domains',
      categories: {
        'Frontend Development': 'Frontend Development',
        'Backend & Infrastructure': 'Backend & Infrastructure',
        'Data Science & Analysis': 'Data Science & Analysis',
        'Research & Biology': 'Research & Biology',
        'Tools & Platforms': 'Tools & Platforms'
      },
      labels: {
        level: 'Proficiency Level',
        experience: 'Years of Experience',
        projects: 'Related Projects',
        hover: 'Hover over skills to see details'
      }
    },
    es: {
      title: 'Experiencia Técnica',
      subtitle: 'Visualización interactiva de mis habilidades y experiencia en diferentes dominios',
      categories: {
        'Frontend Development': 'Desarrollo Frontend',
        'Backend & Infrastructure': 'Backend e Infraestructura',
        'Data Science & Analysis': 'Ciencia de Datos y Análisis',
        'Research & Biology': 'Investigación y Biología',
        'Tools & Platforms': 'Herramientas y Plataformas'
      },
      labels: {
        level: 'Nivel de Competencia',
        experience: 'Años de Experiencia',
        projects: 'Proyectos Relacionados',
        hover: 'Pasa el cursor sobre las habilidades para ver detalles'
      }
    },
    ca: {
      title: 'Experiència Tècnica',
      subtitle: 'Visualització interactiva de les meves habilitats i experiència en diferents dominis',
      categories: {
        'Frontend Development': 'Desenvolupament Frontend',
        'Backend & Infrastructure': 'Backend i Infraestructura',
        'Data Science & Analysis': 'Ciència de Dades i Anàlisi',
        'Research & Biology': 'Recerca i Biologia',
        'Tools & Platforms': 'Eines i Plataformes'
      },
      labels: {
        level: 'Nivell de Competència',
        experience: 'Anys d\'Experiència',
        projects: 'Projectes Relacionats',
        hover: 'Passa el cursor sobre les habilitats per veure detalls'
      }
    }
  };

  const currentContent = content[lang];

  // Skills data
  const skillsData: SkillData[] = [
    {
      category: 'Frontend Development',
      color: '#DA291C',
      skills: [
        {
          name: 'React/TypeScript',
          level: 95,
          yearsExperience: 4,
          projects: ['Portfolio Website', 'Research Dashboard', 'Protein Visualizer'],
          description: 'Advanced React patterns, hooks, TypeScript, modern state management'
        },
        {
          name: 'Astro.js',
          level: 90,
          yearsExperience: 2,
          projects: ['Scientific Portfolio', 'Static Site Generation'],
          description: 'Islands architecture, SSG, performance optimization'
        },
        {
          name: 'D3.js/Visualization',
          level: 88,
          yearsExperience: 3,
          projects: ['Protein Structure Viewer', 'Research Data Plots', 'Interactive Charts'],
          description: 'Complex data visualizations, SVG animations, scientific plotting'
        },
        {
          name: 'CSS/Tailwind',
          level: 92,
          yearsExperience: 5,
          projects: ['Responsive Design', 'Component Libraries', 'Design Systems'],
          description: 'Modern CSS, utility frameworks, responsive design, accessibility'
        },
        {
          name: 'GSAP/Animations',
          level: 85,
          yearsExperience: 2,
          projects: ['Interactive Timelines', 'Scroll Animations', 'UI Transitions'],
          description: 'Performance animations, scroll triggers, complex sequences'
        }
      ]
    },
    {
      category: 'Backend & Infrastructure',
      color: '#FFD93D',
      skills: [
        {
          name: 'Python/FastAPI',
          level: 93,
          yearsExperience: 6,
          projects: ['Research APIs', 'Data Processing Pipelines', 'ML Model Serving'],
          description: 'REST APIs, async programming, data validation, testing'
        },
        {
          name: 'Node.js/Express',
          level: 82,
          yearsExperience: 3,
          projects: ['Contact Forms', 'API Gateways', 'Serverless Functions'],
          description: 'Server-side JavaScript, API development, middleware'
        },
        {
          name: 'Docker/Containerization',
          level: 88,
          yearsExperience: 4,
          projects: ['Development Environments', 'CI/CD Pipelines', 'Microservices'],
          description: 'Container orchestration, multi-stage builds, deployment'
        },
        {
          name: 'PostgreSQL/Databases',
          level: 85,
          yearsExperience: 5,
          projects: ['Research Data Storage', 'User Management', 'Analytics'],
          description: 'Relational databases, query optimization, data modeling'
        },
        {
          name: 'AWS/Cloud',
          level: 78,
          yearsExperience: 3,
          projects: ['Static Hosting', 'Lambda Functions', 'Data Storage'],
          description: 'Cloud infrastructure, serverless computing, CDN'
        }
      ]
    },
    {
      category: 'Data Science & Analysis',
      color: '#0EA5E9',
      skills: [
        {
          name: 'Pandas/NumPy',
          level: 95,
          yearsExperience: 6,
          projects: ['Research Analysis', 'Publication Datasets', 'Statistical Modeling'],
          description: 'Data manipulation, statistical analysis, scientific computing'
        },
        {
          name: 'Matplotlib/Seaborn',
          level: 92,
          yearsExperience: 5,
          projects: ['Publication Figures', 'Research Visualizations', 'Statistical Plots'],
          description: 'Scientific plotting, publication-quality figures, custom visualizations'
        },
        {
          name: 'Scikit-learn',
          level: 87,
          yearsExperience: 4,
          projects: ['Protein Classification', 'Biomarker Discovery', 'Pattern Recognition'],
          description: 'Machine learning, feature engineering, model validation'
        },
        {
          name: 'Jupyter/Analysis',
          level: 93,
          yearsExperience: 6,
          projects: ['Research Notebooks', 'Data Exploration', 'Reproducible Analysis'],
          description: 'Interactive computing, research workflows, documentation'
        },
        {
          name: 'Statistical Analysis',
          level: 90,
          yearsExperience: 7,
          projects: ['Clinical Studies', 'Experimental Design', 'Hypothesis Testing'],
          description: 'Experimental design, hypothesis testing, clinical statistics'
        }
      ]
    },
    {
      category: 'Research & Biology',
      color: '#10B981',
      skills: [
        {
          name: 'Protein Engineering',
          level: 95,
          yearsExperience: 8,
          projects: ['Antimicrobial Peptides', 'Inclusion Body Refolding', 'Therapeutic Proteins'],
          description: 'Recombinant protein production, purification, characterization'
        },
        {
          name: 'Molecular Biology',
          level: 93,
          yearsExperience: 9,
          projects: ['Gene Cloning', 'Protein Expression', 'Cell Culture'],
          description: 'DNA manipulation, expression systems, cell culture techniques'
        },
        {
          name: 'Bioinformatics',
          level: 88,
          yearsExperience: 6,
          projects: ['Sequence Analysis', 'Structure Prediction', 'Database Mining'],
          description: 'Sequence analysis, structure prediction, phylogenetics'
        },
        {
          name: 'Research Methodology',
          level: 94,
          yearsExperience: 10,
          projects: ['Clinical Studies', 'Experimental Design', 'Grant Writing'],
          description: 'Experimental design, grant writing, project management'
        },
        {
          name: 'Scientific Writing',
          level: 91,
          yearsExperience: 8,
          projects: ['Research Papers', 'Grant Proposals', 'Conference Presentations'],
          description: 'Academic writing, peer review, scientific communication'
        }
      ]
    },
    {
      category: 'Tools & Platforms',
      color: '#8B5CF6',
      skills: [
        {
          name: 'Git/GitHub',
          level: 92,
          yearsExperience: 6,
          projects: ['Version Control', 'Collaboration', 'CI/CD'],
          description: 'Version control, collaboration workflows, automation'
        },
        {
          name: 'VS Code/Development',
          level: 94,
          yearsExperience: 5,
          projects: ['Code Editing', 'Debugging', 'Extensions'],
          description: 'Efficient development workflows, extensions, debugging'
        },
        {
          name: 'Linux/Command Line',
          level: 87,
          yearsExperience: 8,
          projects: ['Server Management', 'Automation Scripts', 'Development'],
          description: 'System administration, shell scripting, automation'
        },
        {
          name: 'Figma/Design',
          level: 75,
          yearsExperience: 2,
          projects: ['UI Design', 'Prototyping', 'Design Systems'],
          description: 'Interface design, prototyping, collaborative design'
        },
        {
          name: 'Testing/QA',
          level: 83,
          yearsExperience: 4,
          projects: ['Unit Testing', 'Integration Tests', 'E2E Testing'],
          description: 'Test automation, quality assurance, debugging'
        }
      ]
    }
  ];

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.max(400, Math.min(rect.width, 1200));
        const height = Math.max(300, width * 0.75);
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // D3 Radar Chart
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;
    const margin = { top: 40, right: 80, bottom: 40, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(chartWidth, chartHeight) / 2 - 20;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);

    // Get all unique skills across categories
    const allSkills = skillsData.flatMap(category => 
      category.skills.map(skill => ({ ...skill, category: category.category, color: category.color }))
    );

    // Create radar chart structure
    const numberOfSides = allSkills.length;
    const angleSlice = (Math.PI * 2) / numberOfSides;

    // Create scales
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 100]);

    // Draw background circles
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      g.append('circle')
        .attr('r', radius * (level / levels))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', 1);
    }

    // Draw axis lines and labels
    allSkills.forEach((skill, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const lineCoordinates = [
        [0, 0],
        [Math.cos(angle) * radius, Math.sin(angle) * radius]
      ];

      // Axis line
      g.append('line')
        .attr('x1', lineCoordinates[0][0])
        .attr('y1', lineCoordinates[0][1])
        .attr('x2', lineCoordinates[1][0])
        .attr('y2', lineCoordinates[1][1])
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-width', 1);

      // Skill labels
      const labelRadius = radius + 30;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', labelX > 0 ? 'start' : 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', skill.color)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .text(skill.name)
        .style('cursor', interactive ? 'pointer' : 'default')
        .on('mouseover', function(event) {
          if (interactive) {
            d3.select(this).attr('font-weight', '700');
            showTooltip(event, skill);
          }
        })
        .on('mouseout', function() {
          if (interactive) {
            d3.select(this).attr('font-weight', '500');
            hideTooltip();
          }
        })
        .on('click', function() {
          if (interactive) {
            setSelectedSkill(skill);
          }
        });
    });

    // Create radar area for each category
    skillsData.forEach((category, categoryIndex) => {
      if (activeCategory && activeCategory !== category.category) return;
      
      const categorySkills = category.skills;
      const pathData: [number, number][] = [];

      allSkills.forEach((skill, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const categorySkill = categorySkills.find(s => s.name === skill.name);
        
        if (categorySkill) {
          const value = rScale(categorySkill.level);
          pathData.push([
            Math.cos(angle) * value,
            Math.sin(angle) * value
          ]);
        } else {
          pathData.push([0, 0]);
        }
      });

      // Close the path
      if (pathData.length > 0) {
        pathData.push(pathData[0]);
      }

      const line = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveCardinalClosed);

      // Area
      g.append('path')
        .datum(pathData)
        .attr('d', line)
        .attr('fill', category.color)
        .attr('fill-opacity', activeCategory ? 0.4 : 0.1)
        .attr('stroke', category.color)
        .attr('stroke-width', activeCategory ? 3 : 2)
        .attr('stroke-opacity', activeCategory ? 1 : 0.6)
        .style('cursor', interactive ? 'pointer' : 'default')
        .on('mouseover', function() {
          if (interactive) {
            d3.select(this)
              .attr('fill-opacity', 0.3)
              .attr('stroke-width', 3);
          }
        })
        .on('mouseout', function() {
          if (interactive) {
            d3.select(this)
              .attr('fill-opacity', activeCategory ? 0.4 : 0.1)
              .attr('stroke-width', activeCategory ? 3 : 2);
          }
        })
        .on('click', function() {
          if (interactive) {
            setActiveCategory(activeCategory === category.category ? null : category.category);
          }
        });

      // Data points
      pathData.slice(0, -1).forEach((point, pointIndex) => {
        const skill = allSkills[pointIndex];
        const categorySkill = categorySkills.find(s => s.name === skill.name);
        
        if (categorySkill && (point[0] !== 0 || point[1] !== 0)) {
          g.append('circle')
            .attr('cx', point[0])
            .attr('cy', point[1])
            .attr('r', 4)
            .attr('fill', category.color)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('cursor', interactive ? 'pointer' : 'default')
            .on('mouseover', function(event) {
              if (interactive) {
                d3.select(this).attr('r', 6);
                showTooltip(event, categorySkill);
              }
            })
            .on('mouseout', function() {
              if (interactive) {
                d3.select(this).attr('r', 4);
                hideTooltip();
              }
            })
            .on('click', function() {
              if (interactive) {
                setSelectedSkill(categorySkill);
              }
            });
        }
      });
    });

    // Level labels (percentage)
    for (let level = 1; level <= levels; level++) {
      g.append('text')
        .attr('x', 5)
        .attr('y', -radius * (level / levels))
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgba(255, 255, 255, 0.6)')
        .attr('font-size', '10px')
        .text(`${(100 * level) / levels}%`);
    }

  }, [dimensions, skillsData, activeCategory, interactive]);

  // Tooltip functions
  const showTooltip = (event: any, skill: any) => {
    if (!tooltipRef.current) return;

    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style('opacity', 1)
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY - 10}px`)
      .html(`
        <div class="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white text-sm max-w-xs">
          <div class="font-semibold text-red-400 mb-1">${skill.name}</div>
          <div class="mb-1">${currentContent.labels.level}: <span class="font-medium">${skill.level}%</span></div>
          <div class="mb-1">${currentContent.labels.experience}: <span class="font-medium">${skill.yearsExperience} years</span></div>
          <div class="mb-2 text-gray-300 text-xs">${skill.description}</div>
          <div class="text-xs text-gray-400">
            <div class="font-medium mb-1">${currentContent.labels.projects}:</div>
            ${skill.projects.map((project: string) => `<div>• ${project}</div>`).join('')}
          </div>
        </div>
      `);
  };

  const hideTooltip = () => {
    if (!tooltipRef.current) return;
    d3.select(tooltipRef.current).style('opacity', 0);
  };

  // Scroll animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, []);

  return (
    <section className={`py-16 bg-gradient-to-b from-black to-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
          {interactive && (
            <p className="text-sm text-gray-400 mt-4">
              {currentContent.labels.hover}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Legend/Category Filter */}
          {showLegend && (
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    !activeCategory 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  All Skills
                </button>
                {skillsData.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setActiveCategory(
                      activeCategory === category.category ? null : category.category
                    )}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center ${
                      activeCategory === category.category
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">
                      {currentContent.categories[category.category] || category.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Skill Details */}
              {selectedSkill && (
                <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">{selectedSkill.name}</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>Level: {selectedSkill.level}%</div>
                    <div>Experience: {selectedSkill.yearsExperience} years</div>
                    <div className="text-xs text-gray-400 mt-2">{selectedSkill.description}</div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="mt-3 text-xs text-red-400 hover:text-red-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Radar Chart */}
          <div className={showLegend ? 'lg:col-span-3' : 'col-span-1'}>
            <div ref={containerRef} className="relative">
              <svg ref={svgRef} className="w-full h-auto" />
              
              {/* Tooltip */}
              <div
                ref={tooltipRef}
                className="absolute pointer-events-none z-10"
                style={{ opacity: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Skills Grid (Alternative View) */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Detailed Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData.map((category) => (
              <div
                key={category.category}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <h4 className="text-lg font-semibold text-white">
                    {currentContent.categories[category.category] || category.category}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-200">{skill.name}</span>
                        <span className="text-xs text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${skill.level}%`,
                            backgroundColor: category.color
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-400">
                        {skill.yearsExperience} years experience
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsVisualization;