import React, { useState, useEffect } from 'react';
import HeroAdvanced from './HeroAdvanced';

interface HeroIntegratedProps {
  lang?: 'en' | 'es' | 'ca';
  enableAdvanced?: boolean;
  fallback?: React.ReactNode;
}

const HeroIntegrated: React.FC<HeroIntegratedProps> = ({ 
  lang = 'en', 
  enableAdvanced = true,
  fallback 
}) => {
  const [shouldUseAdvanced, setShouldUseAdvanced] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Feature detection and performance checks
    const checkAdvancedSupport = () => {
      // Check for required features
      const hasIntersectionObserver = 'IntersectionObserver' in window;
      const hasRequestAnimationFrame = 'requestAnimationFrame' in window;
      const hasCanvas = (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext && canvas.getContext('2d'));
        } catch (e) {
          return false;
        }
      })();
      
      // Performance checks
      const hasGoodPerformance = (() => {
        // Check connection speed if available
        const connection = (navigator as any).connection;
        if (connection) {
          return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g';
        }
        // Fallback: check device memory (if available)
        const deviceMemory = (navigator as any).deviceMemory;
        return !deviceMemory || deviceMemory >= 2;
      })();

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      return hasIntersectionObserver && 
             hasRequestAnimationFrame && 
             hasCanvas && 
             hasGoodPerformance && 
             !prefersReducedMotion &&
             enableAdvanced;
    };

    setShouldUseAdvanced(checkAdvancedSupport());
  }, [enableAdvanced]);

  if (!isClient) {
    // SSR fallback - render basic hero structure
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white">
            Ramon Roca Pinilla
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12">
            {lang === 'es' ? 
              'Pionero en terapias antimicrobianas de próxima generación a través de ingeniería de proteínas impulsada por IA' :
              lang === 'ca' ?
              'Pioner en teràpies antimicrobianes de nova generació mitjançant enginyeria de proteïnes impulsada per IA' :
              'Pioneering next-generation antimicrobial therapies through AI-driven protein engineering'
            }
          </p>
        </div>
      </section>
    );
  }

  if (shouldUseAdvanced) {
    return <HeroAdvanced lang={lang} />;
  }

  // Fallback to original hero or provided fallback
  return fallback || (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-red-400">
          Ramon Roca Pinilla
        </h1>
        <h2 className="text-2xl md:text-4xl text-red-400 font-light mb-8">
          {lang === 'es' ? 'Ingeniero Biomédico • Biólogo Molecular' :
           lang === 'ca' ? 'Enginyer Biomèdic • Biòleg Molecular' :
           'Biomedical Engineer • Molecular Biologist'}
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
          {lang === 'es' ? 
            'Pionero en terapias antimicrobianas de próxima generación a través de ingeniería de proteínas impulsada por IA y soluciones biotecnológicas de vanguardia.' :
            lang === 'ca' ?
            'Pioner en teràpies antimicrobianes de nova generació mitjançant enginyeria de proteïnes impulsada per IA i solucions biotecnològiques d\'avantguarda.' :
            'Pioneering next-generation antimicrobial therapies through AI-driven protein engineering and cutting-edge biotechnology solutions.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-lg shadow-2xl transition-all duration-300 hover:shadow-red-500/25">
            {lang === 'es' ? 'Explorar Investigación' :
             lang === 'ca' ? 'Explorar Recerca' :
             'Explore Research'}
          </button>
          <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-lg backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10">
            {lang === 'es' ? 'Ver Publicaciones' :
             lang === 'ca' ? 'Veure Publicacions' :
             'View Publications'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroIntegrated;