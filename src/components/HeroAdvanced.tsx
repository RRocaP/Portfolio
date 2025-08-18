import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface HeroAdvancedProps {
  lang?: 'en' | 'es' | 'ca';
  className?: string;
}

interface ParticleSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  mouse: { x: number; y: number };
  animationId: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  trail: { x: number; y: number; opacity: number }[];
}

const HeroAdvanced: React.FC<HeroAdvancedProps> = ({ lang = 'en', className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [particleSystem, setParticleSystem] = useState<ParticleSystem | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Internationalization content
  const content = {
    en: {
      title: "Ramon Roca Pinilla",
      typewriter: ["Biomedical Engineer", "Molecular Biologist", "AI Researcher", "Innovation Leader"],
      subtitle: "Pioneering next-generation antimicrobial therapies through AI-driven protein engineering and cutting-edge biotechnology solutions.",
      cta: "Explore Research",
      secondary: "View Publications"
    },
    es: {
      title: "Ramon Roca Pinilla",
      typewriter: ["Ingeniero Biomédico", "Biólogo Molecular", "Investigador IA", "Líder en Innovación"],
      subtitle: "Pionero en terapias antimicrobianas de próxima generación a través de ingeniería de proteínas impulsada por IA y soluciones biotecnológicas de vanguardia.",
      cta: "Explorar Investigación",
      secondary: "Ver Publicaciones"
    },
    ca: {
      title: "Ramon Roca Pinilla",
      typewriter: ["Enginyer Biomèdic", "Biòleg Molecular", "Investigador IA", "Líder en Innovació"],
      subtitle: "Pioner en teràpies antimicrobianes de nova generació mitjançant enginyeria de proteïnes impulsada per IA i solucions biotecnològiques d'avantguarda.",
      cta: "Explorar Recerca",
      secondary: "Veure Publicacions"
    }
  };

  const currentContent = content[lang];

  // Initialize particle system
  useEffect(() => {
    if (!particleCanvasRef.current) return;

    const canvas = particleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '#DA291C' : '#FFFFFF',
        trail: []
      });
    }

    const system: ParticleSystem = {
      canvas,
      ctx,
      particles,
      mouse: { x: 0, y: 0 },
      animationId: 0
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Mouse interaction
        const dx = system.mouse.x - particle.x;
        const dy = system.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }

        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
        if (particle.trail.length > 10) particle.trail.shift();

        // Draw trail
        particle.trail.forEach((point, i) => {
          const trailOpacity = point.opacity * (i / particle.trail.length) * 0.5;
          ctx.globalAlpha = trailOpacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.globalAlpha = (120 - distance) / 120 * 0.2;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      system.animationId = requestAnimationFrame(animate);
    };

    animate();
    setParticleSystem(system);

    return () => {
      cancelAnimationFrame(system.animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Mouse tracking for particles and magnetic cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (particleSystem) {
        particleSystem.mouse.x = x * window.devicePixelRatio;
        particleSystem.mouse.y = y * window.devicePixelRatio;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [particleSystem]);

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !subtitleRef.current || !ctaRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setIsLoaded(true)
    });

    // Initial states
    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
      opacity: 0,
      y: 50
    });

    // Main animation sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.4");

    // Typewriter effect for subtitle
    let typewriterIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (!titleRef.current) return;
      
      const currentText = currentContent.typewriter[typewriterIndex];
      gsap.to(titleRef.current.querySelector('.typewriter'), {
        duration: 0.05,
        text: currentText,
        ease: "none"
      });
      
      typewriterIndex = (typewriterIndex + 1) % currentContent.typewriter.length;
    }, 3000);

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(containerRef.current, {
          y: -100 * progress,
          opacity: 1 - progress * 0.5,
          duration: 0.3
        });
      }
    });

    return () => {
      clearInterval(typewriterInterval);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [currentContent, lang]);

  // Magnetic cursor effect
  const handleMagneticHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(button, {
      x: x * 0.3,
      y: y * 0.3,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <>
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="fixed w-6 h-6 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background: 'radial-gradient(circle, rgba(218,41,28,0.8) 0%, rgba(218,41,28,0.2) 70%, transparent 100%)',
          borderRadius: '50%',
          transform: 'scale(var(--cursor-scale, 1))',
          transition: 'transform 0.2s ease-out'
        }}
      />

      <section 
        ref={containerRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black ${className}`}
      >
        {/* Particle Canvas Background */}
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Background Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-yellow-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main Title with Typewriter */}
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-red-400"
          >
            {currentContent.title}
            <br />
            <span className="typewriter text-4xl md:text-6xl text-red-400 font-light">
              {currentContent.typewriter[0]}
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            {currentContent.subtitle}
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onMouseMove={handleMagneticHover}
              onMouseLeave={(e) => {
                handleMagneticLeave(e);
                (e.currentTarget as any).style.setProperty('--cursor-scale', '1');
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-lg shadow-2xl transition-all duration-300 hover:shadow-red-500/25 overflow-hidden"
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.setProperty('--cursor-scale', '2');
              }}
            >
              <span className="relative z-10">{currentContent.cta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </button>

            <button
              onMouseMove={handleMagneticHover}
              onMouseLeave={(e) => {
                handleMagneticLeave(e);
                (e.currentTarget as any).style.setProperty('--cursor-scale', '1');
              }}
              className="group px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-lg backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10"
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.setProperty('--cursor-scale', '2');
              }}
            >
              {currentContent.secondary}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
          <p className="text-white/60 text-sm mt-2 font-light">Scroll</p>
        </div>

        {/* Performance Monitor */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
            <div>Particles: {particleSystem?.particles.length || 0}</div>
            <div>FPS: {Math.round(1000 / 16)}</div>
            <div>Loaded: {isLoaded ? 'Yes' : 'No'}</div>
          </div>
        )}
      </section>
    </>
  );
};

export default HeroAdvanced;