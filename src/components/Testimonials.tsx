import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Testimonial {
  id: string;
  name: { en: string; es: string; ca: string };
  role: { en: string; es: string; ca: string };
  quote: { en: string; es: string; ca: string };
  rating: number;
  photo: string;
  linkedin?: string;
}

interface TestimonialsProps {
  lang: 'en' | 'es' | 'ca';
  items?: Testimonial[];
  className?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: { en: 'Dr. Sarah Chen', es: 'Dra. Sarah Chen', ca: 'Dra. Sarah Chen' },
    role: { 
      en: 'Principal Investigator, Stanford Medicine',
      es: 'Investigadora Principal, Stanford Medicine',
      ca: 'Investigadora Principal, Stanford Medicine'
    },
    quote: {
      en: 'Ramon\'s innovative approach to protein engineering has opened new avenues in antimicrobial research. His work on inclusion bodies represents a paradigm shift.',
      es: 'El enfoque innovador de Ramon hacia la ingeniería de proteínas ha abierto nuevos caminos en la investigación antimicrobiana. Su trabajo sobre cuerpos de inclusión representa un cambio de paradigma.',
      ca: 'L\'enfocament innovador del Ramon cap a l\'enginyeria de proteïnes ha obert nous camins en la recerca antimicrobiana. El seu treball sobre cossos d\'inclusió representa un canvi de paradigma.'
    },
    rating: 5,
    photo: 'https://media.licdn.com/dms/image/placeholder-1/v1/profile.jpg',
    linkedin: 'https://linkedin.com/in/sarahchen'
  },
  {
    id: '2',
    name: { en: 'Prof. Michael Torres', es: 'Prof. Michael Torres', ca: 'Prof. Michael Torres' },
    role: {
      en: 'Department Head, Biomedical Engineering',
      es: 'Jefe de Departamento, Ingeniería Biomédica',
      ca: 'Cap de Departament, Enginyeria Biomèdica'
    },
    quote: {
      en: 'Exceptional analytical skills and deep understanding of protein dynamics. Ramon consistently delivers breakthrough insights in complex biological systems.',
      es: 'Habilidades analíticas excepcionales y comprensión profunda de la dinámica de proteínas. Ramon constantemente ofrece ideas revolucionarias en sistemas biológicos complejos.',
      ca: 'Habilitats analítiques excepcionals i comprensió profunda de la dinàmica de proteïnes. El Ramon ofereix constantment idees revolucionàries en sistemes biològics complexos.'
    },
    rating: 5,
    photo: 'https://media.licdn.com/dms/image/placeholder-2/v1/profile.jpg',
    linkedin: 'https://linkedin.com/in/michaeltorres'
  },
  {
    id: '3',
    name: { en: 'Dr. Elena Rodriguez', es: 'Dra. Elena Rodríguez', ca: 'Dra. Elena Rodríguez' },
    role: {
      en: 'Senior Scientist, Pharmaceutical Research',
      es: 'Científica Senior, Investigación Farmacéutica',
      ca: 'Científica Sènior, Recerca Farmacèutica'
    },
    quote: {
      en: 'Ramon\'s interdisciplinary approach bridges computational biology and experimental validation beautifully. A true innovator in the field.',
      es: 'El enfoque interdisciplinario de Ramon conecta hermosamente la biología computacional y la validación experimental. Un verdadero innovador en el campo.',
      ca: 'L\'enfocament interdisciplinari del Ramon connecta bellament la biologia computacional i la validació experimental. Un veritable innovador en el camp.'
    },
    rating: 5,
    photo: 'https://media.licdn.com/dms/image/placeholder-3/v1/profile.jpg',
    linkedin: 'https://linkedin.com/in/elenarodriguez'
  }
];

const StarRating: React.FC<{ rating: number; animated?: boolean }> = ({ 
  rating, 
  animated = false 
}) => {
  const [animatedRating, setAnimatedRating] = useState(animated ? 0 : rating);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (animated && !prefersReducedMotion) {
      const timer = setTimeout(() => setAnimatedRating(rating), 300);
      return () => clearTimeout(timer);
    }
  }, [rating, animated, prefersReducedMotion]);

  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 transition-all duration-300 ${
            star <= (animated ? animatedRating : rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-600 fill-current'
          }`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const Testimonials: React.FC<TestimonialsProps> = ({
  lang,
  items = defaultTestimonials,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const pauseAutoplay = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeAutoplay = useCallback(() => {
    setIsPaused(false);
    if (isPlaying && !intervalRef.current) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
  }, [isPlaying, nextSlide]);

  const toggleAutoplay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      pauseAutoplay();
    } else {
      setIsPlaying(true);
      if (!isPaused) {
        intervalRef.current = setInterval(nextSlide, 5000);
      }
    }
  }, [isPlaying, isPaused, nextSlide, pauseAutoplay]);

  useEffect(() => {
    if (isPlaying && !isPaused && !prefersReducedMotion) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isPaused, nextSlide, prefersReducedMotion]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextSlide();
        break;
      case ' ':
        e.preventDefault();
        toggleAutoplay();
        break;
    }
  };

  const currentTestimonial = items[currentIndex];

  return (
    <section
      className={`relative w-full max-w-4xl mx-auto p-6 ${className}`}
      ref={containerRef}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocus={pauseAutoplay}
      onBlur={resumeAutoplay}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Customer testimonials carousel"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="sr-only" aria-live="polite" id="carousel-status">
        {`Testimonial ${currentIndex + 1} of ${items.length}`}
      </div>

      <div
        className="relative overflow-hidden rounded-lg bg-gray-900 border border-gray-800"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: prefersReducedMotion ? 'none' : undefined
          }}
        >
          {items.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 p-8"
              aria-hidden={index !== currentIndex}
            >
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                  <img
                    src={testimonial.photo}
                    alt={`${testimonial.name[lang]} profile photo`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23374151'/%3E%3Ctext x='40' y='45' text-anchor='middle' fill='%23D1D5DB' font-family='sans-serif' font-size='14'%3E${testimonial.name[lang].charAt(0)}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-gray-200 text-lg md:text-xl leading-relaxed mb-4">
                    "{testimonial.quote[lang]}"
                  </blockquote>
                  
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <div>
                      <cite className="text-white font-semibold not-italic">
                        {testimonial.linkedin ? (
                          <a
                            href={testimonial.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                            aria-label={`View ${testimonial.name[lang]}'s LinkedIn profile`}
                          >
                            {testimonial.name[lang]}
                          </a>
                        ) : (
                          testimonial.name[lang]
                        )}
                      </cite>
                      <p className="text-gray-400 text-sm">
                        {testimonial.role[lang]}
                      </p>
                    </div>
                    <StarRating rating={testimonial.rating} animated={index === currentIndex} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={toggleAutoplay}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4a8 8 0 1116 0c0 2.485-.204 4.915-.589 7.248" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 focus:ring-offset-gray-900 ${
                index === currentIndex 
                  ? 'bg-red-400 scale-110' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};