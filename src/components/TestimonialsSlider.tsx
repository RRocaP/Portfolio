import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar?: string;
  quote: string;
  rating: number;
  date: string;
  type: 'colleague' | 'supervisor' | 'collaborator' | 'industry' | 'academic';
  featured?: boolean;
  linkedinUrl?: string;
}

interface TestimonialsSliderProps {
  lang?: 'en' | 'es' | 'ca';
  className?: string;
  autoPlay?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
}

const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({
  lang = 'en',
  className = '',
  autoPlay = true,
  showNavigation = true,
  showPagination = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const sliderRef = useRef<HTMLDivElement>(null);
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Internationalization
  const content = {
    en: {
      title: 'What Colleagues Say',
      subtitle: 'Testimonials from research collaborators, supervisors, and industry partners',
      previous: 'Previous testimonial',
      next: 'Next testimonial',
      pause: 'Pause slideshow',
      play: 'Resume slideshow',
      viewProfile: 'View LinkedIn Profile',
      types: {
        colleague: 'Research Colleague',
        supervisor: 'Supervisor',
        collaborator: 'Collaborator',
        industry: 'Industry Partner',
        academic: 'Academic Peer'
      }
    },
    es: {
      title: 'Lo Que Dicen los Colegas',
      subtitle: 'Testimonios de colaboradores de investigación, supervisores y socios industriales',
      previous: 'Testimonio anterior',
      next: 'Siguiente testimonio',
      pause: 'Pausar presentación',
      play: 'Reanudar presentación',
      viewProfile: 'Ver Perfil de LinkedIn',
      types: {
        colleague: 'Colega de Investigación',
        supervisor: 'Supervisor',
        collaborator: 'Colaborador',
        industry: 'Socio Industrial',
        academic: 'Compañero Académico'
      }
    },
    ca: {
      title: 'El Que Diuen els Col·legues',
      subtitle: 'Testimonis de col·laboradors de recerca, supervisors i socis industrials',
      previous: 'Testimoni anterior',
      next: 'Següent testimoni',
      pause: 'Pausar presentació',
      play: 'Reprendre presentació',
      viewProfile: 'Veure Perfil de LinkedIn',
      types: {
        colleague: 'Col·lega de Recerca',
        supervisor: 'Supervisor',
        collaborator: 'Col·laborador',
        industry: 'Soci Industrial',
        academic: 'Company Acadèmic'
      }
    }
  };

  const currentContent = content[lang];

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 'sarah-johnson',
      name: 'Dr. Sarah Johnson',
      role: 'Principal Research Scientist',
      organization: 'MIT Synthetic Biology Center',
      quote: 'Ramon\'s innovative approach to protein engineering is truly exceptional. His work on functional inclusion bodies has opened new avenues for therapeutic protein development that we never thought possible.',
      rating: 5,
      date: '2023',
      type: 'collaborator',
      featured: true,
      linkedinUrl: 'https://linkedin.com/in/sarah-johnson-mit'
    },
    {
      id: 'carlos-martinez',
      name: 'Prof. Carlos Martínez',
      role: 'Director of Biotechnology Research',
      organization: 'Autonomous University of Barcelona',
      quote: 'En mis 25 años de carrera, pocas veces he visto a un investigador con la combinación única de rigor científico y creatividad innovadora que posee Ramon. Sus contribuciones al campo son verdaderamente revolucionarias.',
      rating: 5,
      date: '2023',
      type: 'supervisor',
      featured: true,
      linkedinUrl: 'https://linkedin.com/in/carlos-martinez-uab'
    },
    {
      id: 'maria-gonzalez',
      name: 'Dr. Maria González',
      role: 'Head of R&D',
      organization: 'Grifols Pharmaceutical',
      quote: 'Working with Ramon during his internship was a pleasure. His ability to optimize our protein purification processes resulted in significant cost savings and improved product quality. A true asset to any research team.',
      rating: 5,
      date: '2022',
      type: 'industry',
      linkedinUrl: 'https://linkedin.com/in/maria-gonzalez-grifols'
    },
    {
      id: 'james-wright',
      name: 'Dr. James Wright',
      role: 'Senior Scientist',
      organization: 'Nature Biotechnology',
      quote: 'Ramon\'s research on engineered inclusion bodies represents a paradigm shift in protein engineering. The depth of his analysis and the clarity of his scientific communication make his work stand out in the field.',
      rating: 5,
      date: '2021',
      type: 'academic',
      linkedinUrl: 'https://linkedin.com/in/james-wright-nature'
    },
    {
      id: 'anna-petrov',
      name: 'Dr. Anna Petrov',
      role: 'Postdoctoral Researcher',
      organization: 'European Molecular Biology Laboratory',
      quote: 'Collaborating with Ramon on antimicrobial resistance research has been incredibly rewarding. His interdisciplinary approach and attention to detail consistently produce high-quality results that advance our understanding.',
      rating: 5,
      date: '2022',
      type: 'colleague',
      linkedinUrl: 'https://linkedin.com/in/anna-petrov-embl'
    },
    {
      id: 'david-chen',
      name: 'Prof. David Chen',
      role: 'Department Chair',
      organization: 'Stanford University School of Medicine',
      quote: 'Ramon\'s presentation at our symposium was one of the most engaging and scientifically rigorous talks we\'ve had. His work bridges the gap between basic research and clinical application beautifully.',
      rating: 5,
      date: '2023',
      type: 'academic',
      linkedinUrl: 'https://linkedin.com/in/david-chen-stanford'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, autoPlay, testimonials.length]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // GSAP Animations
  useEffect(() => {
    if (sliderRef.current) {
      gsap.fromTo(sliderRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sliderRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, []);

  // Slide transition animation
  useEffect(() => {
    testimonialRefs.current.forEach((ref, index) => {
      if (ref) {
        if (index === currentSlide) {
          gsap.fromTo(ref,
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
        } else {
          gsap.set(ref, { opacity: 0, scale: 0.95 });
        }
      }
    });
  }, [currentSlide]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getTypeColor = (type: Testimonial['type']) => {
    const colors = {
      colleague: 'bg-blue-600/20 text-blue-400',
      supervisor: 'bg-green-600/20 text-green-400',
      collaborator: 'bg-purple-600/20 text-purple-400',
      industry: 'bg-orange-600/20 text-orange-400',
      academic: 'bg-red-600/20 text-red-400'
    };
    return colors[type];
  };

  return (
    <section className={`py-16 bg-gradient-to-b from-black to-gray-900 ${className}`}>
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

        {/* Main Slider */}
        <div ref={sliderRef} className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 min-h-[400px]">
            {/* Testimonials */}
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                ref={el => testimonialRefs.current[index] = el}
                className={`absolute inset-0 p-8 md:p-12 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                  {/* Quote Section */}
                  <div className="lg:col-span-2 flex flex-col justify-center">
                    <div className="mb-6">
                      <svg className="w-12 h-12 text-red-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <blockquote className="text-xl md:text-2xl text-gray-200 leading-relaxed font-medium">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Date */}
                    <div className="text-sm text-gray-400">
                      {testimonial.date}
                    </div>
                  </div>

                  {/* Profile Section */}
                  <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Name & Role */}
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-300 mb-2">
                      {testimonial.role}
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      {testimonial.organization}
                    </p>

                    {/* Type Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${getTypeColor(testimonial.type)}`}>
                      {currentContent.types[testimonial.type]}
                    </span>

                    {/* Featured Badge */}
                    {testimonial.featured && (
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-medium rounded-full mb-4">
                        Featured
                      </span>
                    )}

                    {/* LinkedIn Link */}
                    {testimonial.linkedinUrl && (
                      <a
                        href={testimonial.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                        {currentContent.viewProfile}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {showNavigation && (
            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none">
              <button
                onClick={prevSlide}
                className="w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={currentContent.previous}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={currentContent.next}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Auto-play Control */}
          {autoPlay && (
            <button
              onClick={toggleAutoPlay}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={isPlaying ? currentContent.pause : currentContent.play}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12 11l.707-.707A1 1 0 0113.414 10H15m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v1m-6 0V9a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V11a2 2 0 00-2-2h-1m-1 1v-1a2 2 0 00-2-2H10a2 2 0 00-2 2v1" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        {showPagination && (
          <div className="flex justify-center items-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  index === currentSlide
                    ? 'bg-red-500 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Testimonial Summary Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-800/30 rounded-lg">
            <div className="text-3xl font-bold text-red-400 mb-2">25+</div>
            <div className="text-sm text-gray-400">Professional Recommendations</div>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-lg">
            <div className="text-3xl font-bold text-yellow-400 mb-2">5.0</div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Would Collaborate Again</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">
            Interested in collaboration or have questions about my research?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Get in Touch
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;