// Modern Portfolio App with Optimized Loading
(() => {
  // Performance and loading optimizations
  const isProduction = import.meta?.env?.PROD ?? false;
  const debug = import.meta?.env?.VITE_DEBUG ?? !isProduction;
  
  // Lazy loading utilities
  const lazyLoad = {
    // Intersection Observer for lazy loading
    observer: null,
    
    init() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const target = entry.target;
                if (target.dataset.src) {
                  target.src = target.dataset.src;
                  target.removeAttribute('data-src');
                }
                if (target.dataset.lazycss) {
                  const link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.href = target.dataset.lazycss;
                  document.head.appendChild(link);
                  target.removeAttribute('data-lazycss');
                }
                this.observer.unobserve(target);
              }
            });
          },
          { rootMargin: '50px' }
        );
      }
    },
    
    observe(element) {
      if (this.observer) {
        this.observer.observe(element);
      }
    }
  };

  // Initialize lazy loading
  lazyLoad.init();
  
  // Site data parsing with error handling
  const dataEl = document.getElementById('site-data');
  let data = { owner: { github: '#', linkedin: '#' }, projects: [], publications: [] };
  try {
    data = JSON.parse((dataEl && dataEl.textContent) || '{}');
  } catch (e) {
    if (debug) console.error('Invalid site-data JSON', e);
  }

  const grid = document.getElementById('projectGrid');
  const pubList = document.getElementById('pubList');

  // ========================================
  //   Enhanced Theme System
  // ========================================
  
  class ThemeManager {
    constructor() {
      this.themes = ['light', 'dark'];
      this.storageKey = 'portfolio-theme-preference';
      this.dataAttribute = 'data-theme';
      this.themeToggle = document.getElementById('themeToggle');
      this.themeToggleMobile = document.getElementById('themeToggleMobile');
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      
      // Initialize theme system
      this.init();
    }
    
    init() {
      // Prevent flash of unstyled content during theme initialization
      document.documentElement.classList.add('theme-transition-disable');
      
      // Set initial theme
      const theme = this.getPreferredTheme();
      this.setTheme(theme, false);
      
      // Enable transitions after a brief delay
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transition-disable');
      });
      
      // Set up event listeners
      this.setupEventListeners();
    }
    
    getPreferredTheme() {
      // Priority: stored preference > system preference > default (dark)
      const stored = this.getStoredTheme();
      if (stored && this.themes.includes(stored)) {
        return stored;
      }
      
      // Check system preference
      if (this.mediaQuery.matches) {
        return 'light';
      }
      
      return 'dark';
    }
    
    getStoredTheme() {
      try {
        return localStorage.getItem(this.storageKey);
      } catch (e) {
        console.warn('localStorage not available:', e);
        return null;
      }
    }
    
    setStoredTheme(theme) {
      try {
        localStorage.setItem(this.storageKey, theme);
      } catch (e) {
        console.warn('Could not save theme preference:', e);
      }
    }
    
    setTheme(theme, persist = true) {
      if (!this.themes.includes(theme)) {
        console.warn(`Invalid theme: ${theme}`);
        return;
      }
      
      // Remove existing theme attributes
      document.documentElement.removeAttribute(this.dataAttribute);
      document.body.classList.remove('light', 'dark');
      
      // Apply new theme
      if (theme !== 'dark') { // dark is default
        document.documentElement.setAttribute(this.dataAttribute, theme);
        document.body.classList.add(theme);
      }
      
      // Update color-scheme meta
      this.updateColorSchemeMeta(theme);
      
      // Update toggle buttons
      this.updateToggleButtons(theme);
      
      // Persist preference
      if (persist) {
        this.setStoredTheme(theme);
      }
      
      // Emit custom event for other components
      this.emitThemeChange(theme);
    }
    
    updateColorSchemeMeta(theme) {
      let meta = document.querySelector('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'color-scheme';
        document.head.appendChild(meta);
      }
      meta.content = theme === 'light' ? 'light dark' : 'dark light';
    }
    
    updateToggleButtons(theme) {
      const icon = theme === 'light' ? '🌙' : '☀️';
      const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
      
      [this.themeToggle, this.themeToggleMobile].forEach(toggle => {
        if (toggle) {
          toggle.textContent = icon;
          toggle.setAttribute('aria-label', label);
          toggle.setAttribute('title', label);
        }
      });
    }
    
    toggleTheme() {
      const currentTheme = this.getCurrentTheme();
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(nextTheme);
    }
    
    getCurrentTheme() {
      if (document.documentElement.hasAttribute(this.dataAttribute)) {
        return document.documentElement.getAttribute(this.dataAttribute);
      }
      return document.body.classList.contains('light') ? 'light' : 'dark';
    }
    
    setupEventListeners() {
      const handleToggle = () => this.toggleTheme();
      
      // Theme toggle buttons
      [this.themeToggle, this.themeToggleMobile].forEach(toggle => {
        if (toggle) {
          toggle.addEventListener('click', handleToggle);
          
          // Keyboard support
          toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.toggleTheme();
            }
          });
        }
      });
      
      // System preference changes
      this.mediaQuery.addEventListener('change', (e) => {
        // Only respond to system changes if no manual preference is stored
        if (!this.getStoredTheme()) {
          const systemTheme = e.matches ? 'light' : 'dark';
          this.setTheme(systemTheme, false); // Don't persist automatic changes
        }
      });
      
      // Handle storage changes from other tabs
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey && e.newValue) {
          this.setTheme(e.newValue, false);
        }
      });
    }
    
    emitThemeChange(theme) {
      const event = new CustomEvent('themechange', {
        detail: { theme, timestamp: Date.now() }
      });
      document.dispatchEvent(event);
    }
    
    // Public API for other modules
    getTheme() {
      return this.getCurrentTheme();
    }
    
    // Force theme without persistence (useful for previews)
    previewTheme(theme) {
      this.setTheme(theme, false);
    }
    
    // Reset to system preference
    resetToSystem() {
      try {
        localStorage.removeItem(this.storageKey);
      } catch (e) {
        console.warn('Could not remove theme preference:', e);
      }
      
      const systemTheme = this.mediaQuery.matches ? 'light' : 'dark';
      this.setTheme(systemTheme, false);
    }
  }
  
  // Initialize theme manager
  const themeManager = new ThemeManager();
  
  // Make theme manager globally available for debugging
  if (typeof window !== 'undefined') {
    window.themeManager = themeManager;
    
    // Development helpers
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      window.themeDebug = {
        testContrast: () => {
          const elements = [
            { selector: 'body', bg: 'background-color', text: 'color' },
            { selector: '.card', bg: 'background-color', text: 'color' },
            { selector: '.btn.primary', bg: 'background-color', text: 'color' },
            { selector: '.chip.active', bg: 'background-color', text: 'color' }
          ];
          
          elements.forEach(({ selector, bg, text }) => {
            const el = document.querySelector(selector);
            if (el) {
              const styles = getComputedStyle(el);
              const bgColor = styles.getPropertyValue(bg);
              const textColor = styles.getPropertyValue(text);
              console.log(`${selector}: bg(${bgColor}) text(${textColor})`);
            }
          });
        },
        
        validateTheme: (theme) => {
          if (!['light', 'dark'].includes(theme)) {
            console.error('Invalid theme:', theme);
            return false;
          }
          
          themeManager.previewTheme(theme);
          
          // Check for CSS custom properties
          const root = getComputedStyle(document.documentElement);
          const requiredProps = [
            '--color-bg-primary',
            '--color-text-primary', 
            '--color-interactive-primary',
            '--color-border-primary'
          ];
          
          const missing = requiredProps.filter(prop => 
            !root.getPropertyValue(prop).trim()
          );
          
          if (missing.length) {
            console.warn('Missing CSS properties:', missing);
            return false;
          }
          
          console.log(`✅ Theme '${theme}' validation passed`);
          return true;
        },
        
        simulateSystemChange: (preferLight = true) => {
          const mockMediaQuery = {
            matches: preferLight,
            addEventListener: () => {},
            removeEventListener: () => {}
          };
          
          themeManager.mediaQuery = mockMediaQuery;
          themeManager.resetToSystem();
          console.log(`Simulated system preference: ${preferLight ? 'light' : 'dark'}`);
        }
      };
    }
  }

  // Responsive Navigation System
  class ResponsiveNavigation {
    constructor() {
      this.navToggle = document.getElementById('navToggle');
      this.navMobile = document.getElementById('navMobile');
      this.navOverlay = document.getElementById('navOverlay');
      this.header = document.querySelector('.site-header');
      this.navLinks = document.querySelectorAll('.nav-link');
      this.focusableElements = [];
      
      // State management
      this.isMenuOpen = false;
      this.lastScrollY = 0;
      this.scrollThreshold = 10;
      this.isScrollingDown = false;
      
      // Touch gesture support
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchEndX = 0;
      this.touchEndY = 0;
      this.minSwipeDistance = 50;
      
      this.init();
    }

    init() {
      this.setupEventListeners();
      this.setupIntersectionObserver();
      this.setupScrollBehavior();
      this.updateFocusableElements();
    }

    setupEventListeners() {
      // Hamburger menu toggle
      this.navToggle.addEventListener('click', () => this.toggleMenu());
      
      // Overlay click to close
      this.navOverlay.addEventListener('click', () => this.closeMenu());
      
      // Navigation link clicks
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => this.handleNavClick(e));
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
      
      // Touch gesture support
      this.setupTouchGestures();
      
      // Window resize handling
      window.addEventListener('resize', () => this.handleResize());
    }

    setupTouchGestures() {
      // Touch events for mobile menu
      this.navMobile.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.navMobile.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      this.navMobile.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
      
      // Body touch events for swipe-to-open
      document.body.addEventListener('touchstart', (e) => this.handleBodyTouchStart(e), { passive: true });
      document.body.addEventListener('touchend', (e) => this.handleBodyTouchEnd(e), { passive: true });
    }

    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
      // Prevent default to allow custom swipe behavior
      if (Math.abs(e.touches[0].clientX - this.touchStartX) > 20) {
        e.preventDefault();
      }
    }

    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].clientX;
      this.touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = this.touchEndX - this.touchStartX;
      const deltaY = Math.abs(this.touchEndY - this.touchStartY);
      
      // Swipe right to close menu (must be primarily horizontal)
      if (deltaX > this.minSwipeDistance && deltaY < 100 && this.isMenuOpen) {
        this.closeMenu();
      }
    }

    handleBodyTouchStart(e) {
      // Only track touches near the right edge for swipe-to-open
      const screenWidth = window.innerWidth;
      const touchX = e.touches[0].clientX;
      
      if (touchX > screenWidth - 30 && !this.isMenuOpen) {
        this.touchStartX = touchX;
      }
    }

    handleBodyTouchEnd(e) {
      if (this.isMenuOpen) return;
      
      this.touchEndX = e.changedTouches[0].clientX;
      const deltaX = this.touchStartX - this.touchEndX;
      
      // Swipe left from right edge to open menu
      if (deltaX > this.minSwipeDistance && this.touchStartX > window.innerWidth - 30) {
        this.openMenu();
      }
    }

    toggleMenu() {
      if (this.isMenuOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }

    openMenu() {
      this.isMenuOpen = true;
      this.navToggle.classList.add('active');
      this.navToggle.setAttribute('aria-expanded', 'true');
      this.navMobile.classList.add('active');
      this.navMobile.setAttribute('aria-hidden', 'false');
      this.navOverlay.classList.add('active');
      this.navOverlay.setAttribute('aria-hidden', 'false');
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Update tabindex for mobile nav links
      this.navMobile.querySelectorAll('.nav-link, .theme-toggle-mobile').forEach(el => {
        el.setAttribute('tabindex', '0');
      });
      
      // Focus trap
      this.setupFocusTrap();
      
      // Focus first link
      setTimeout(() => {
        const firstLink = this.navMobile.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
      }, 100);
    }

    closeMenu() {
      this.isMenuOpen = false;
      this.navToggle.classList.remove('active');
      this.navToggle.setAttribute('aria-expanded', 'false');
      this.navMobile.classList.remove('active');
      this.navMobile.setAttribute('aria-hidden', 'true');
      this.navOverlay.classList.remove('active');
      this.navOverlay.setAttribute('aria-hidden', 'true');
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Update tabindex for mobile nav links
      this.navMobile.querySelectorAll('.nav-link, .theme-toggle-mobile').forEach(el => {
        el.setAttribute('tabindex', '-1');
      });
      
      // Return focus to hamburger button
      this.navToggle.focus();
    }

    setupFocusTrap() {
      this.focusableElements = this.navMobile.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      
      if (this.focusableElements.length > 0) {
        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];
        
        // Handle Tab key within mobile nav
        this.navMobile.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              // Shift + Tab
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              // Tab
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        });
      }
    }

    handleKeydown(e) {
      // Close menu with Escape key
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
      
      // Open menu with keyboard shortcut (Alt + M)
      if (e.altKey && e.key.toLowerCase() === 'm' && !this.isMenuOpen) {
        e.preventDefault();
        this.openMenu();
      }
    }

    handleNavClick(e) {
      const link = e.target;
      const href = link.getAttribute('href');
      
      // Handle anchor links
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (this.isMenuOpen) {
          this.closeMenu();
        }
        
        // Smooth scroll to target
        this.scrollToSection(href);
        
        // Update active nav link
        this.updateActiveNavLink(href);
      }
    }

    scrollToSection(targetId) {
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = this.header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra padding
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }

    updateActiveNavLink(activeHref) {
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
          link.classList.add('active');
        }
      });
    }

    setupScrollBehavior() {
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const scrollDifference = Math.abs(currentScrollY - this.lastScrollY);
            
            if (scrollDifference > this.scrollThreshold) {
              if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                // Scrolling down and past header height
                this.header.classList.add('hidden');
              } else if (currentScrollY < this.lastScrollY) {
                // Scrolling up
                this.header.classList.remove('hidden');
              }
              
              this.lastScrollY = currentScrollY;
            }
            
            ticking = false;
          });
          
          ticking = true;
        }
      };
      
      // Throttled scroll listener
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupIntersectionObserver() {
      const sections = document.querySelectorAll('section[id]');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const activeHref = `#${entry.target.id}`;
            this.updateActiveNavLink(activeHref);
          }
        });
      }, {
        threshold: 0.5,
        rootMargin: '-80px 0px -50% 0px'
      });
      
      sections.forEach(section => observer.observe(section));
    }

    handleResize() {
      // Close mobile menu if window is resized to desktop
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    }

    updateFocusableElements() {
      // Update focusable elements when content changes
      if (this.isMenuOpen) {
        this.setupFocusTrap();
      }
    }

    destroy() {
      // Clean up event listeners
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  // Initialize responsive navigation
  const navigation = new ResponsiveNavigation();
  
  // Make navigation available globally for GSAP integration
  window.responsiveNavigation = navigation;

  // Create a project card element
  const createProjectElement = (project) => {
    const el = document.createElement('article');
    el.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.innerHTML = svgFor(project.thumb);

    const title = document.createElement('h3');
    title.textContent = project.title;

    const blurb = document.createElement('p');
    blurb.textContent = project.blurb;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = (project.tags || []).map((t) => `#${t}`).join(' ');

    el.appendChild(thumb);
    el.appendChild(title);
    el.appendChild(blurb);
    el.appendChild(meta);

    const clickHandler = () => window.open(project.link, '_blank');
    el.addEventListener('click', clickHandler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    });
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Open ${project.title} project`);

    return el;
  };

  // Render projects
  const render = (items) => {
    const fragment = document.createDocumentFragment();
    grid.textContent = '';
    for (const project of items) fragment.appendChild(createProjectElement(project));
    grid.appendChild(fragment);
  };

  // Filters
  function initFilters() {
    const chips = Array.from(document.querySelectorAll('.chip'));
    for (const c of chips) {
      c.addEventListener('click', () => {
        chips.forEach((x) => x.classList.remove('active'));
        c.classList.add('active');
        const f = c.dataset.filter;
        const newItems = f === 'all' ? data.projects : data.projects.filter((p) => (p.tags || []).includes(f));
        render(newItems);
      });
    }
  }

  // Simple inline SVG placeholders
  function svgFor(name) {
    if (name && name.endsWith('.svg')) {
      if (name.includes('pipeline')) return iconPipeline();
      if (name.includes('plot')) return iconPlot();
      if (name.includes('volcano')) return iconVolcano();
    }
    return iconGeneric();
  }
  function iconPipeline(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#7dd3fc"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <g stroke="url(#g)" stroke-width="3" fill="none">
        <rect x="20" y="30" width="40" height="24" rx="6"/>
        <rect x="80" y="30" width="40" height="24" rx="6"/>
        <rect x="140" y="30" width="40" height="24" rx="6"/>
        <path d="M60 42h18M120 42h18"/>
        <rect x="50" y="86" width="100" height="30" rx="8"/>
      </g>
    </svg>`;
  }
  function iconPlot(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <g stroke="#2a3140">
        ${Array.from({length:5}, (_,i)=>`<path d="M20 ${120 - i*20}h160"/>`).join('')}
        ${Array.from({length:7}, (_,i)=>`<path d="M${20 + i*24} 20v100"/>`).join('')}
      </g>
      <g>
        ${Array.from({length:25}, ()=>{
          const x = 30 + Math.random()*150; const y = 30 + Math.random()*90; const c = Math.random()>.5? '#7dd3fc':'#a78bfa';
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${c}"/>`;
        }).join('')}
      </g>
    </svg>`;
  }
  function iconVolcano(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <path d="M30 120 C60 60, 80 60, 100 120 S 160 60, 170 120" fill="none" stroke="#a78bfa" stroke-width="3"/>
      <g>
        <circle cx="70" cy="70" r="5" fill="#22c55e"/>
        <circle cx="130" cy="70" r="5" fill="#ef4444"/>
      </g>
    </svg>`;
  }
  function iconGeneric(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g2" x1="0" x2="1"><stop stop-color="#4f46e5"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs>
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <circle cx="100" cy="70" r="46" fill="none" stroke="url(#g2)" stroke-width="4"/>
    </svg>`;
  }

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Initialize components
  const gh = document.getElementById('githubLink');
  const li = document.getElementById('linkedinLink');
  if (gh) gh.href = data.owner.github || '#';
  if (li) li.href = data.owner.linkedin || '#';

  render(data.projects || []);
  initFilters();

  // Publications
  for (const p of data.publications || []) {
    const liEl = document.createElement('li');
    liEl.innerHTML = `<a href="${p.link}" target="_blank" rel="noopener">${p.title}</a> <span style="color:#8892a6">(${p.year})</span>`;
    pubList.appendChild(liEl);
  }

  // Dynamic GSAP Animation Orchestrator with lazy loading
  class AnimationOrchestrator {
    constructor() {
      this.masterTimeline = null;
      this.scrollTriggers = [];
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.isMobile = window.innerWidth <= 900;
      this.gsapLoaded = false;
      
      // Only initialize animations if motion is not reduced
      if (!this.isReducedMotion) {
        this.loadGSAP().then(() => this.init());
      }
    }

    async loadGSAP() {
      // Check if GSAP is already loaded from CDN
      if (typeof window.gsap !== 'undefined') {
        this.gsapLoaded = true;
        return Promise.resolve();
      }
      
      // Dynamically load GSAP if not available
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = () => {
          this.gsapLoaded = true;
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    init() {
      if (!this.gsapLoaded || !window.gsap) return;
      
      // Initialize the master timeline
      this.masterTimeline = gsap.timeline();
      
      // Register plugins if available
      if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
      if (window.TextPlugin) gsap.registerPlugin(TextPlugin);
      
      // Set defaults
      gsap.defaults({
        ease: "power2.out",
        duration: 0.8
      });

      // Initial state
      this.setInitialStates();
      
      // Create animations
      this.createLoadingAnimations();
      this.createScrollAnimations();
      this.createInteractiveAnimations();
      
      if (!this.isMobile) {
        this.createParallaxEffects();
      }
      
      // Handle resize
      this.handleResize();
      
      if (debug) console.log('✨ Animations initialized');
    }

    setInitialStates() {
      // Hide elements for entrance animations
      gsap.set('.hero-inner > *', { opacity: 0, y: 30 });
      gsap.set('.orb', { scale: 0, opacity: 0 });
      gsap.set('.grid', { opacity: 0 });
      gsap.set('.section', { opacity: 0, y: 50 });
      gsap.set('.card', { opacity: 0, y: 30 });
    }

    createLoadingAnimations() {
      const tl = gsap.timeline({ delay: 0.2 });
      
      // Hero entrance sequence
      tl.to('.hero-inner h1', { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: "power3.out"
      })
      .to('.hero-inner .lead', { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      }, "-=0.6")
      .to('.hero-inner .cta', { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      }, "-=0.4")
      .to('.hero-inner .meta', { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      }, "-=0.4")
      .to('.orb', { 
        scale: 1, 
        opacity: 1, 
        duration: 1.2,
        ease: "elastic.out(1, 0.8)"
      }, "-=0.8")
      .to('.grid', { 
        opacity: 0.1, 
        duration: 1 
      }, "-=0.6");

      // Stagger cards entrance
      tl.to('.card', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: {
          amount: 0.4,
          from: "start"
        },
        ease: "power2.out"
      }, "-=0.4");

      this.masterTimeline.add(tl);
    }

    createScrollAnimations() {
      // Section reveals
      gsap.utils.toArray('.section').forEach(section => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () => {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out"
            });
          },
          once: true
        });
        this.scrollTriggers.push(trigger);
      });

      // Skills pills animation
      const skillsTrigger = ScrollTrigger.create({
        trigger: '#skills',
        start: "top 75%",
        onEnter: () => {
          gsap.to('#skills li', {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.7)"
          });
        },
        once: true
      });
      this.scrollTriggers.push(skillsTrigger);

      // Publications list animation
      const pubsTrigger = ScrollTrigger.create({
        trigger: '#pubList',
        start: "top 75%",
        onEnter: () => {
          gsap.to('#pubList li', {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
          });
        },
        once: true
      });
      this.scrollTriggers.push(pubsTrigger);
    }

    createParallaxEffects() {
      // Hero parallax
      gsap.to('.hero-visual', {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: '.hero',
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Orb independent movement
      gsap.to('.orb', {
        yPercent: -50,
        xPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: '.hero',
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        }
      });
    }

    createInteractiveAnimations() {
      // Navigation animations
      this.createNavigationAnimations();
      
      // Enhanced card hovers
      document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          if (this.isReducedMotion) return;
          gsap.to(card, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          if (this.isReducedMotion) return;
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Filter chip animations
      document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          if (this.isReducedMotion) return;
          gsap.fromTo(chip, 
            { scale: 0.95 },
            { 
              scale: 1,
              duration: 0.3,
              ease: "back.out(2)"
            }
          );

          // Animate filtered cards
          gsap.fromTo('.card',
            { 
              opacity: 0,
              scale: 0.9,
              y: 20
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.out"
            }
          );
        });
      });

      // Enhanced theme toggle animation
      document.addEventListener('themechange', (e) => {
        if (this.isReducedMotion) return;
        
        const toggles = ['#themeToggle', '#themeToggleMobile'];
        toggles.forEach(selector => {
          const toggle = document.querySelector(selector);
          if (!toggle) return;
          
          // Create a smooth rotation animation
          gsap.to(toggle, {
            rotation: "+=180",
            duration: 0.6,
            ease: "power2.inOut"
          });
          
          // Add a subtle scale animation
          gsap.fromTo(toggle, 
            { scale: 1 },
            { 
              scale: 1.1,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.out"
            }
          );
        });
        
        // Animate theme-sensitive elements
        const themeElements = ['.orb', '.card', '.hero-visual'];
        themeElements.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            gsap.fromTo(el,
              { opacity: 0.8 },
              {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
              }
            );
          });
        });
      });
    }

    createNavigationAnimations() {
      // Animate mobile menu open/close
      const navToggle = document.getElementById('navToggle');
      const navMobile = document.getElementById('navMobile');
      const navOverlay = document.getElementById('navOverlay');
      
      if (navToggle && navMobile && navOverlay) {
        const navTl = gsap.timeline({ paused: true });
        
        navTl.set(navMobile, { display: 'block' })
             .fromTo(navOverlay, 
               { opacity: 0 }, 
               { opacity: 1, duration: 0.3, ease: "power2.out" })
             .fromTo(navMobile, 
               { x: '100%' }, 
               { x: '0%', duration: 0.4, ease: "power3.out" }, 0.1)
             .fromTo('.nav-mobile .nav-link', 
               { opacity: 0, x: 30 }, 
               { 
                 opacity: 1, 
                 x: 0, 
                 duration: 0.3, 
                 stagger: 0.05, 
                 ease: "power2.out" 
               }, 0.2);

        // Store timeline for navigation class access
        window.navAnimationTimeline = navTl;

        // Hamburger animation
        navToggle.addEventListener('click', () => {
          if (this.isReducedMotion) return;
          
          const isActive = navToggle.classList.contains('active');
          gsap.to('.hamburger-line:nth-child(1)', {
            rotation: isActive ? 45 : 0,
            y: isActive ? 6 : 0,
            duration: 0.3,
            ease: "power2.inOut"
          });
          
          gsap.to('.hamburger-line:nth-child(2)', {
            opacity: isActive ? 0 : 1,
            duration: 0.2,
            ease: "power2.inOut"
          });
          
          gsap.to('.hamburger-line:nth-child(3)', {
            rotation: isActive ? -45 : 0,
            y: isActive ? -6 : 0,
            duration: 0.3,
            ease: "power2.inOut"
          });
        });
      }

      // Header scroll animations
      const header = document.querySelector('.site-header');
      if (header) {
        gsap.set(header, { y: 0 });
        
        let lastScrollY = 0;
        let ticking = false;
        
        const updateHeader = () => {
          const scrollY = window.scrollY;
          const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
          
          if (scrollDirection === 'down' && scrollY > 100) {
            gsap.to(header, { y: '-100%', duration: 0.3, ease: "power2.inOut" });
          } else if (scrollDirection === 'up') {
            gsap.to(header, { y: '0%', duration: 0.3, ease: "power2.inOut" });
          }
          
          lastScrollY = scrollY;
          ticking = false;
        };
        
        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
          }
        }, { passive: true });
      }
    }

    handleResize() {
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.isMobile = window.innerWidth <= 900;
          ScrollTrigger.refresh();
        }, 250);
      });
    }

    destroy() {
      this.masterTimeline.kill();
      this.scrollTriggers.forEach(st => st.kill());
      ScrollTrigger.getAll().forEach(st => st.kill());
      ScrollTrigger.refresh();
    }
  }

  // Performance-optimized initialization
  const initApp = () => {
    if (debug) console.log('🚀 App initializing...');
    
    // Initialize the main animation orchestrator
    const animator = new AnimationOrchestrator();
    
    // Register service worker for caching in production
    if ('serviceWorker' in navigator && isProduction) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          if (debug) console.log('📦 Service Worker registered');
        })
        .catch(err => {
          if (debug) console.error('Service Worker registration failed:', err);
        });
    }
    
    // Debug helpers (development only)
    if (debug || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      window.animator = animator;
      window.lazyLoad = lazyLoad;
      
      if (window.ScrollTrigger) {
        window.toggleScrollTriggerMarkers = () => {
          ScrollTrigger.getAll().forEach(st => {
            st.vars.markers = !st.vars.markers;
            st.refresh();
          });
        };
      }
      
      window.killAllAnimations = () => animator.destroy();
      
      // Performance monitoring
      if (window.performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('⚡ Performance metrics:', {
              domLoad: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
              fullLoad: Math.round(perfData.loadEventEnd - perfData.navigationStart)
            });
          }, 1000);
        });
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();

