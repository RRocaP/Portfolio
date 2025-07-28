/**
 * Animation Utilities for Portfolio
 * Handles scroll-triggered animations, parallax effects, and smooth scrolling
 */

// Animation Configuration
const ANIMATION_CONFIG = {
  threshold: 0.1,
  rootMargin: '0px 0px -10% 0px',
  staggerDelay: 50,
  parallaxSpeed: 0.5,
};

/**
 * Initialize Intersection Observer for scroll-triggered animations
 */
export function initScrollAnimations() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements immediately
    document.querySelectorAll('[data-animate]').forEach(element => {
      element.classList.add('animate-in');
    });
    return;
  }

  // Create observer for single elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const targetElement = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        // Add animation with optional delay
        const delay = parseFloat(targetElement.dataset.animateDelay || '0');
        setTimeout(() => {
          targetElement.classList.add('animate-in');
        }, delay);

        // Optional: unobserve after animation to improve performance
        if (targetElement.dataset.animateOnce !== 'false') {
          observer.unobserve(targetElement);
        }
      } else if (targetElement.dataset.animateOnce === 'false') {
        // Remove animation class if element should animate multiple times
        targetElement.classList.remove('animate-in');
      }
    });
  }, {
    threshold: ANIMATION_CONFIG.threshold,
    rootMargin: ANIMATION_CONFIG.rootMargin,
  });

  // Create observer for staggered children animations
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const targetElement = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        targetElement.classList.add('animate-in');
        
        // Animate children with stagger effect
        const children = Array.from(targetElement.children) as HTMLElement[];
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.transitionDelay = `${index * ANIMATION_CONFIG.staggerDelay}ms`;
          }, 0);
        });

        if (targetElement.dataset.animateOnce !== 'false') {
          staggerObserver.unobserve(targetElement);
        }
      }
    });
  }, {
    threshold: ANIMATION_CONFIG.threshold,
    rootMargin: ANIMATION_CONFIG.rootMargin,
  });

  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(element => {
    element.classList.add('will-animate');
    observer.observe(element);
  });

  // Observe all elements with data-animate-children attribute
  document.querySelectorAll('[data-animate-children]').forEach(element => {
    element.classList.add('will-animate');
    staggerObserver.observe(element);
  });
}

/**
 * Initialize parallax scrolling effects
 */
export function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  if (parallaxElements.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const viewportHeight = window.innerHeight;

    parallaxElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      const speed = parseFloat(htmlElement.dataset.parallaxSpeed || String(ANIMATION_CONFIG.parallaxSpeed));
      
      // Only animate elements in viewport
      if (rect.bottom >= 0 && rect.top <= viewportHeight) {
        const yPos = -(scrolled * speed);
        htmlElement.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Listen to scroll events
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Initial call
  updateParallax();
}

/**
 * Initialize smooth scrolling for anchor links
 */
export function initSmoothScroll() {
  // Only apply to links with # hrefs
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      // Get the target position accounting for fixed header
      const headerHeight = 80; // Adjust based on your header height
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      // Smooth scroll to target
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Initialize typewriter effect
 */
export function initTypewriter(element: HTMLElement, text: string, speed = 100) {
  if (!element) return;

  element.textContent = '';
  element.classList.add('typewriter');
  
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        element.style.borderRight = 'none';
      }, 1000);
    }
  }

  // Start typing after a short delay
  setTimeout(type, 500);
}

/**
 * Initialize floating geometric shapes
 */
export function initFloatingShapes(container: HTMLElement) {
  if (!container) return;

  const shapes = [
    { type: 'circle', size: 60, color: 'rgba(218, 41, 28, 0.1)' },
    { type: 'square', size: 40, color: 'rgba(255, 217, 61, 0.1)' },
    { type: 'triangle', size: 50, color: 'rgba(218, 41, 28, 0.05)' },
  ];

  shapes.forEach((shape, index) => {
    const element = document.createElement('div');
    element.className = `floating-shape ${shape.type} float-animation`;
    element.style.cssText = `
      position: absolute;
      width: ${shape.size}px;
      height: ${shape.size}px;
      background: ${shape.color};
      pointer-events: none;
      z-index: 0;
      animation-delay: ${index * 0.5}s;
      animation-duration: ${3 + index}s;
    `;

    // Random positioning
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;

    // Shape-specific styles
    if (shape.type === 'circle') {
      element.style.borderRadius = '50%';
    } else if (shape.type === 'triangle') {
      element.style.width = '0';
      element.style.height = '0';
      element.style.borderLeft = `${shape.size/2}px solid transparent`;
      element.style.borderRight = `${shape.size/2}px solid transparent`;
      element.style.borderBottom = `${shape.size}px solid ${shape.color}`;
      element.style.background = 'transparent';
    }

    container.appendChild(element);
  });
}

/**
 * Add hover effect to cards
 */
export function initCardHoverEffects() {
  const cards = document.querySelectorAll('.research-card, .publication-card, .contact-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function(e: MouseEvent) {
      const rect = this.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;
      
      (this as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (this as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Initialize loading animations
 */
export function showLoading(element: HTMLElement) {
  element.classList.add('skeleton');
}

export function hideLoading(element: HTMLElement) {
  element.classList.remove('skeleton');
}

/**
 * Debounce function for performance
 */
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Initialize all animations
 */
export function initAnimations() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Initialize all animation systems
    initScrollAnimations();
    initParallax();
    initSmoothScroll();
    initCardHoverEffects();

    // Initialize typewriter for hero tagline
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) {
      const text = tagline.textContent;
      initTypewriter(tagline as HTMLElement, text || '', 50);
    }

    // Initialize floating shapes in hero
    const hero = document.querySelector('.hero');
    if (hero) {
      initFloatingShapes(hero as HTMLElement);
    }

    // Re-initialize on page navigation (for SPAs)
    if ('navigation' in window && (window as any).navigation) {
      (window as any).navigation.addEventListener('navigate', () => {
        setTimeout(initScrollAnimations, 100);
      });
    }
  }
}

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined') {
  initAnimations();
}