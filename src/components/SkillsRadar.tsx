import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { gsap } from 'gsap';

interface SkillCategory {
  name: string;
  value: number;
  projects?: string[];
}

interface CustomData {
  [key: string]: SkillCategory[];
}

interface SkillsRadarProps {
  lang: 'en' | 'es' | 'ca';
  className?: string;
  data?: CustomData;
  onExport?: (blob: Blob) => void;
}

const defaultData: CustomData = {
  en: [
    { name: 'Frontend', value: 90, projects: ['React Portfolio', 'D3 Visualizations', 'Astro Sites'] },
    { name: 'Backend', value: 85, projects: ['Node.js APIs', 'Python Services', 'Database Design'] },
    { name: 'Tools', value: 80, projects: ['Docker', 'CI/CD', 'Testing Frameworks'] },
    { name: 'Research', value: 95, projects: ['Protein Engineering', 'Antimicrobial Peptides', 'Gene Therapy'] }
  ],
  es: [
    { name: 'Frontend', value: 90, projects: ['Portfolio React', 'Visualizaciones D3', 'Sitios Astro'] },
    { name: 'Backend', value: 85, projects: ['APIs Node.js', 'Servicios Python', 'Diseño BD'] },
    { name: 'Herramientas', value: 80, projects: ['Docker', 'CI/CD', 'Testing'] },
    { name: 'Investigación', value: 95, projects: ['Ingeniería Proteínas', 'Péptidos Antimicrobianos', 'Terapia Génica'] }
  ],
  ca: [
    { name: 'Frontend', value: 90, projects: ['Portfolio React', 'Visualitzacions D3', 'Llocs Astro'] },
    { name: 'Backend', value: 85, projects: ['APIs Node.js', 'Serveis Python', 'Disseny BD'] },
    { name: 'Eines', value: 80, projects: ['Docker', 'CI/CD', 'Testing'] },
    { name: 'Recerca', value: 95, projects: ['Enginyeria Proteïnes', 'Pèptids Antimicrobians', 'Teràpia Gènica'] }
  ]
};

const SkillsRadar: React.FC<SkillsRadarProps> = ({ 
  lang, 
  className = '', 
  data = defaultData, 
  onExport 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [tooltipData, setTooltipData] = useState<{ skill: SkillCategory; x: number; y: number } | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const skills = data[lang] || defaultData[lang];
  const size = 300;
  const margin = 60;
  const radius = (size - margin * 2) / 2;
  const center = size / 2;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const angleSlice = (Math.PI * 2) / skills.length;

  const getCoordinates = useCallback((value: number, index: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r
    };
  }, [angleSlice, center, radius]);

  const createRadarChart = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('class', 'radar-chart');

    // Background circles
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      g.append('circle')
        .attr('cx', center)
        .attr('cy', center)
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(156, 163, 175, 0.3)')
        .attr('stroke-width', 1);
      
      // Level labels
      if (i === levels) {
        g.append('text')
          .attr('x', center + levelRadius + 5)
          .attr('y', center + 4)
          .attr('font-size', '12px')
          .attr('fill', 'rgba(156, 163, 175, 0.7)')
          .text('100%');
      }
    }

    // Axis lines
    skills.forEach((_, index) => {
      const angle = angleSlice * index - Math.PI / 2;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      
      g.append('line')
        .attr('x1', center)
        .attr('y1', center)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'rgba(156, 163, 175, 0.3)')
        .attr('stroke-width', 1);
    });

    // Skill area
    const pathData = skills.map((skill, index) => {
      const coords = getCoordinates(skill.value, index);
      return `${index === 0 ? 'M' : 'L'} ${coords.x},${coords.y}`;
    }).join(' ') + ' Z';

    const skillPath = g.append('path')
      .attr('d', pathData)
      .attr('fill', 'rgba(218, 41, 28, 0.2)')
      .attr('stroke', '#DA291C')
      .attr('stroke-width', 2)
      .attr('opacity', prefersReducedMotion ? 1 : 0);

    // Skill points
    const skillPoints = g.selectAll('.skill-point')
      .data(skills)
      .enter()
      .append('g')
      .attr('class', 'skill-point')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d, i) => `${d.name}: ${d.value}%. ${d.projects ? d.projects.join(', ') : ''}`)
      .style('cursor', 'pointer')
      .on('focus', (event, d) => {
        const index = skills.indexOf(d);
        setFocusedIndex(index);
        showTooltip(d, index);
      })
      .on('blur', () => {
        setFocusedIndex(-1);
        setTooltipData(null);
      })
      .on('mouseenter', (event, d) => {
        const index = skills.indexOf(d);
        showTooltip(d, index);
      })
      .on('mouseleave', () => setTooltipData(null));

    skillPoints.each(function(d, i) {
      const coords = getCoordinates(d.value, i);
      const point = d3.select(this);
      
      point.append('circle')
        .attr('cx', coords.x)
        .attr('cy', coords.y)
        .attr('r', focusedIndex === i ? 8 : 6)
        .attr('fill', '#DA291C')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('opacity', prefersReducedMotion ? 1 : 0);
    });

    // Labels
    skills.forEach((skill, index) => {
      const angle = angleSlice * index - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = center + Math.cos(angle) * labelRadius;
      const y = center + Math.sin(angle) * labelRadius;
      
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .text(skill.name);
    });

    // Animate if motion is allowed
    if (!prefersReducedMotion && !isAnimated) {
      requestAnimationFrame(() => {
        gsap.fromTo(skillPath.node(), 
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
        
        gsap.fromTo(skillPoints.selectAll('circle').nodes(),
          { opacity: 0, scale: 0 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: 'back.out(1.7)',
            delay: 0.4
          }
        );
      });
      setIsAnimated(true);
    }
  }, [skills, getCoordinates, prefersReducedMotion, isAnimated, focusedIndex, center, radius, angleSlice]);

  const showTooltip = useCallback((skill: SkillCategory, index: number) => {
    const coords = getCoordinates(skill.value, index);
    setTooltipData({ skill, x: coords.x, y: coords.y });
  }, [getCoordinates]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimated) {
            createRadarChart();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [createRadarChart, isAnimated]);

  useEffect(() => {
    if (isAnimated || prefersReducedMotion) {
      createRadarChart();
    }
  }, [lang, data, focusedIndex, createRadarChart, isAnimated, prefersReducedMotion]);

  const handleExport = useCallback(async (format: 'svg' | 'png') => {
    if (!svgRef.current || !onExport) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      onExport(blob);
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = size * 2;
      canvas.height = size * 2;
      
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        if (ctx) {
          ctx.scale(2, 2);
          ctx.fillStyle = '#0A0A0A';
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          
          canvas.toBlob((pngBlob) => {
            if (pngBlob) onExport(pngBlob);
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    }
  }, [onExport, size]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (focusedIndex + 1) % skills.length;
      const nextElement = containerRef.current?.querySelector(`[tabindex="0"]:nth-of-type(${nextIndex + 1})`) as HTMLElement;
      nextElement?.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = focusedIndex === 0 ? skills.length - 1 : focusedIndex - 1;
      const prevElement = containerRef.current?.querySelector(`[tabindex="0"]:nth-of-type(${prevIndex + 1})`) as HTMLElement;
      prevElement?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const skill = skills[focusedIndex];
      if (skill) {
        showTooltip(skill, focusedIndex);
      }
    }
  }, [focusedIndex, skills, showTooltip]);

  return (
    <div 
      ref={containerRef}
      className={`skills-radar-container relative ${className}`}
      onKeyDown={handleKeyDown}
      role="img"
      aria-label={`Skills radar chart showing proficiency levels in ${skills.map(s => s.name).join(', ')}`}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full h-auto"
        role="presentation"
      />
      
      {tooltipData && (
        <div
          className="absolute z-10 bg-gray-900 text-white p-3 rounded-lg shadow-lg pointer-events-none max-w-xs"
          style={{
            left: tooltipData.x + 10,
            top: tooltipData.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-semibold text-red-400">{tooltipData.skill.name}</div>
          <div className="text-sm text-gray-300">{tooltipData.skill.value}% proficiency</div>
          {tooltipData.skill.projects && (
            <div className="text-xs text-gray-400 mt-1">
              <div className="font-medium">Related projects:</div>
              <ul className="list-disc list-inside">
                {tooltipData.skill.projects.map((project, idx) => (
                  <li key={idx}>{project}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {onExport && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handleExport('svg')}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Export radar chart as SVG"
          >
            Export SVG
          </button>
          <button
            onClick={() => handleExport('png')}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Export radar chart as PNG"
          >
            Export PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsRadar;