import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmartNavigationProps {
  lang?: 'en' | 'es' | 'ca';
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
}

const SmartNavigation: React.FC<SmartNavigationProps> = ({ lang = 'en', className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; href: string }>>([]);
  
  const navRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Internationalization
  const content = {
    en: {
      navigation: [
        { id: 'home', label: 'Home', href: '/en/' },
        { id: 'about', label: 'About', href: '/en/#about' },
        { id: 'research', label: 'Research', href: '/en/#research', children: [
          { id: 'publications', label: 'Publications', href: '/en/#publications' },
          { id: 'projects', label: 'Projects', href: '/en/#projects' },
          { id: 'timeline', label: 'Timeline', href: '/en/#timeline' }
        ]},
        { id: 'contact', label: 'Contact', href: '/en/#contact' }
      ],
      languages: [
        { code: 'en', label: 'English', href: '/en/' },
        { code: 'es', label: 'Español', href: '/es/' },
        { code: 'ca', label: 'Català', href: '/ca/' }
      ],
      skipToContent: 'Skip to main content',
      menu: 'Menu',
      close: 'Close menu',
      currentPage: 'Current page',
      scrollProgress: 'Page progress'
    },
    es: {
      navigation: [
        { id: 'home', label: 'Inicio', href: '/es/' },
        { id: 'about', label: 'Acerca', href: '/es/#about' },
        { id: 'research', label: 'Investigación', href: '/es/#research', children: [
          { id: 'publications', label: 'Publicaciones', href: '/es/#publications' },
          { id: 'projects', label: 'Proyectos', href: '/es/#projects' },
          { id: 'timeline', label: 'Cronología', href: '/es/#timeline' }
        ]},
        { id: 'contact', label: 'Contacto', href: '/es/#contact' }
      ],
      languages: [
        { code: 'en', label: 'English', href: '/en/' },
        { code: 'es', label: 'Español', href: '/es/' },
        { code: 'ca', label: 'Català', href: '/ca/' }
      ],
      skipToContent: 'Saltar al contenido principal',
      menu: 'Menú',
      close: 'Cerrar menú',
      currentPage: 'Página actual',
      scrollProgress: 'Progreso de la página'
    },
    ca: {
      navigation: [
        { id: 'home', label: 'Inici', href: '/ca/' },
        { id: 'about', label: 'Sobre', href: '/ca/#about' },
        { id: 'research', label: 'Recerca', href: '/ca/#research', children: [
          { id: 'publications', label: 'Publicacions', href: '/ca/#publications' },
          { id: 'projects', label: 'Projectes', href: '/ca/#projects' },
          { id: 'timeline', label: 'Cronologia', href: '/ca/#timeline' }
        ]},
        { id: 'contact', label: 'Contacte', href: '/ca/#contact' }
      ],
      languages: [
        { code: 'en', label: 'English', href: '/en/' },
        { code: 'es', label: 'Español', href: '/es/' },
        { code: 'ca', label: 'Català', href: '/ca/' }
      ],
      skipToContent: 'Saltar al contingut principal',
      menu: 'Menú',
      close: 'Tancar menú',
      currentPage: 'Pàgina actual',
      scrollProgress: 'Progrés de la pàgina'
    }
  };

  const currentContent = content[lang];

  // Auto-hide/show navigation based on scroll direction
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // Calculate scroll progress
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(currentScrollY / windowHeight, 1);
        setScrollProgress(progress * 100);

        // Auto-hide/show logic
        if (currentScrollY > 100) {
          if (currentScrollY > lastScrollY.current && !isMenuOpen) {
            setIsVisible(false); // Hide on scroll down
          } else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true); // Show on scroll up
          }
        } else {
          setIsVisible(true); // Always show at top
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    }
    ticking.current = true;
  }, [isMenuOpen]);

  // Section highlighting based on scroll position
  const updateActiveSection = useCallback(() => {
    const sections = document.querySelectorAll('section[id], div[id]');
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = section as HTMLElement;
      const offsetTop = element.offsetTop;
      const height = element.offsetHeight;
      
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
        setActiveSection(element.id);
        break;
      }
    }
  }, []);

  // Generate breadcrumbs based on current page
  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    const breadcrumbItems = [
      { label: currentContent.navigation[0].label, href: currentContent.navigation[0].href }
    ];

    if (pathSegments.length > 1) {
      // Add research breadcrumb if in research section
      if (pathSegments.includes('research')) {
        breadcrumbItems.push({
          label: currentContent.navigation.find(item => item.id === 'research')?.label || 'Research',
          href: `/${lang}/research`
        });
      }
      
      // Add specific page breadcrumb
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment !== lang) {
        breadcrumbItems.push({
          label: lastSegment.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          href: currentPath
        });
      }
    }

    setBreadcrumbs(breadcrumbItems);
  }, [lang, currentContent.navigation]);

  // Initialize scroll listeners and animations
  useEffect(() => {
    // Throttled scroll handler
    let rafId: number;
    const throttledScroll = () => {
      rafId = requestAnimationFrame(() => {
        handleScroll();
        updateActiveSection();
      });
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // GSAP animations for navigation visibility
    if (navRef.current) {
      gsap.set(navRef.current, { y: 0, opacity: 1 });
    }

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll, updateActiveSection]);

  // Handle navigation visibility animations
  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0.95,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isVisible]);

  // Handle mobile menu animations
  useEffect(() => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        x: isMenuOpen ? 0 : '100%',
        duration: 0.4,
        ease: 'power3.inOut'
      });
    }

    // Lock body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Smooth anchor scrolling
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault();
      const targetId = href.split('#')[1];
      const target = document.getElementById(targetId);
      
      if (target) {
        const navHeight = navRef.current?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu
        setIsMenuOpen(false);
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
      >
        {currentContent.skipToContent}
      </a>

      {/* Main Navigation */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/80 border-b border-white/10 ${className}`}
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-150 z-50"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-label={currentContent.scrollProgress}
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <a
                href={currentContent.navigation[0].href}
                className="text-white font-bold text-xl hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                onClick={(e) => handleAnchorClick(e, currentContent.navigation[0].href)}
              >
                RRP
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {currentContent.navigation.map((item) => (
                  <div key={item.id} className="relative group">
                    <a
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
                        activeSection === item.id
                          ? 'text-red-400 bg-red-400/10'
                          : 'text-white hover:text-red-400 hover:bg-white/5'
                      }`}
                      onClick={(e) => handleAnchorClick(e, item.href)}
                      aria-current={activeSection === item.id ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                    
                    {/* Dropdown Menu for Research */}
                    {item.children && (
                      <div className="absolute left-0 top-full mt-2 w-48 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {item.children.map((child) => (
                            <a
                              key={child.id}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-white hover:text-red-400 hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/10"
                              onClick={(e) => handleAnchorClick(e, child.href)}
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Language Switcher & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative group">
                <button
                  className="text-white hover:text-red-400 transition-colors text-sm font-medium px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Choose language"
                >
                  {lang.toUpperCase()}
                  <svg className="ml-1 h-3 w-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-32 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {currentContent.languages.map((language) => (
                      <a
                        key={language.code}
                        href={language.href}
                        className={`block px-4 py-2 text-sm transition-colors focus:outline-none focus:bg-white/10 ${
                          language.code === lang
                            ? 'text-red-400 bg-red-400/10'
                            : 'text-white hover:text-red-400 hover:bg-white/5'
                        }`}
                        aria-current={language.code === lang ? 'page' : undefined}
                      >
                        {language.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded p-2"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? currentContent.close : currentContent.menu}
              >
                <div className="w-6 h-6 relative">
                  <span
                    className={`absolute left-0 top-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 top-2.5' : ''
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-2.5 w-6 h-0.5 bg-current transition-opacity duration-300 ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-5 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 top-2.5' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="border-t border-white/10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <nav aria-label="Breadcrumb" className="py-2">
                <ol className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg className="h-4 w-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-red-400 font-medium" aria-current="page">
                          {crumb.label}
                        </span>
                      ) : (
                        <a
                          href={crumb.href}
                          className="text-white hover:text-red-400 transition-colors focus:outline-none focus:text-red-400"
                          onClick={(e) => handleAnchorClick(e, crumb.href)}
                        >
                          {crumb.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 bottom-0 z-40 w-64 bg-black/95 backdrop-blur-md border-l border-white/10 md:hidden"
        style={{ transform: 'translateX(100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-white font-semibold">Navigation</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
              aria-label={currentContent.close}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {currentContent.navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
                      activeSection === item.id
                        ? 'text-red-400 bg-red-400/10'
                        : 'text-white hover:text-red-400 hover:bg-white/5'
                    }`}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                  
                  {/* Mobile Submenu */}
                  {item.children && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={child.href}
                            className="block px-3 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 rounded transition-colors focus:outline-none focus:bg-white/10"
                            onClick={(e) => handleAnchorClick(e, child.href)}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Language Switcher */}
          <div className="border-t border-white/10 p-4">
            <h3 className="text-white text-sm font-medium mb-3">Language</h3>
            <div className="space-y-1">
              {currentContent.languages.map((language) => (
                <a
                  key={language.code}
                  href={language.href}
                  className={`block px-3 py-2 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
                    language.code === lang
                      ? 'text-red-400 bg-red-400/10'
                      : 'text-white hover:text-red-400 hover:bg-white/5'
                  }`}
                  aria-current={language.code === lang ? 'page' : undefined}
                >
                  {language.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartNavigation;