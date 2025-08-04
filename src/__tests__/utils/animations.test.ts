import { describe, it, expect, beforeEach, vi, afterEach, Mock } from 'vitest';
import {
  initScrollAnimations,
  initParallax,
  initSmoothScroll,
  initTypewriter,
  initFloatingShapes,
  initCardHoverEffects,
  showLoading,
  hideLoading,
  initAnimations,
} from '../../utils/animations';

// Mock DOM methods
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockQuerySelector = vi.fn();
const mockQuerySelectorAll = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();
const mockRequestAnimationFrame = vi.fn();
const mockSetTimeout = vi.fn();
const mockClearTimeout = vi.fn();

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn().mockImplementation((callback, options) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  root: null,
  rootMargin: options?.rootMargin || '0px',
  thresholds: [options?.threshold || 0],
}));

describe('Animation Utilities', () => {
  let mockElement: HTMLElement;
  let mockElements: HTMLElement[];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock DOM element
    mockElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
      },
      dataset: {},
      style: {},
      children: [],
      textContent: '',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      getBoundingClientRect: vi.fn(() => ({
        top: 100,
        left: 0,
        right: 800,
        bottom: 200,
        width: 800,
        height: 100,
      })),
      appendChild: vi.fn(),
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
    } as any;

    mockElements = [mockElement];

    // Mock global objects
    global.window = {
      IntersectionObserver: mockIntersectionObserver,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      requestAnimationFrame: mockRequestAnimationFrame,
      pageYOffset: 0,
      innerHeight: 800,
      scrollTo: vi.fn(),
      history: {
        pushState: vi.fn(),
      },
    } as any;

    global.document = {
      querySelectorAll: mockQuerySelectorAll.mockReturnValue(mockElements),
      querySelector: mockQuerySelector.mockReturnValue(mockElement),
      readyState: 'complete',
      addEventListener: mockAddEventListener,
      createElement: vi.fn(() => mockElement),
    } as any;

    global.setTimeout = mockSetTimeout.mockImplementation((fn, delay) => {
      fn();
      return 1;
    });
    
    global.clearTimeout = mockClearTimeout;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initScrollAnimations', () => {
    it('initializes IntersectionObserver when supported', () => {
      initScrollAnimations();

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(2); // One for single elements, one for staggered
      expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-animate]');
      expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-animate-children]');
    });

    it('falls back when IntersectionObserver is not supported', () => {
      delete (global.window as any).IntersectionObserver;

      initScrollAnimations();

      expect(mockElement.classList.add).toHaveBeenCalledWith('animate-in');
    });

    it('observes elements with data-animate attribute', () => {
      initScrollAnimations();

      expect(mockElement.classList.add).toHaveBeenCalledWith('will-animate');
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });

    it('handles intersection callback correctly', () => {
      let intersectionCallback: Function;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
      });

      initScrollAnimations();

      // Simulate intersection
      const mockEntry = {
        target: mockElement,
        isIntersecting: true,
      };

      intersectionCallback([mockEntry]);

      expect(mockElement.classList.add).toHaveBeenCalledWith('animate-in');
    });

    it('handles animation delay from dataset', () => {
      mockElement.dataset.animateDelay = '100';
      
      let intersectionCallback: Function;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
      });

      initScrollAnimations();

      const mockEntry = {
        target: mockElement,
        isIntersecting: true,
      };

      intersectionCallback([mockEntry]);

      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
    });

    it('unobserves elements after animation by default', () => {
      let intersectionCallback: Function;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
      });

      initScrollAnimations();

      const mockEntry = {
        target: mockElement,
        isIntersecting: true,
      };

      intersectionCallback([mockEntry]);

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
    });

    it('handles staggered children animations', () => {
      const childElement = { ...mockElement, style: { transitionDelay: '' } };
      mockElement.children = [childElement] as any;

      let staggerCallback: Function;
      mockIntersectionObserver.mockImplementationOnce(() => ({ 
        observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() 
      }))
      .mockImplementationOnce((callback) => {
        staggerCallback = callback;
        return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
      });

      initScrollAnimations();

      const mockEntry = {
        target: mockElement,
        isIntersecting: true,
      };

      staggerCallback([mockEntry]);

      expect(mockElement.classList.add).toHaveBeenCalledWith('animate-in');
      expect(mockSetTimeout).toHaveBeenCalled();
    });
  });

  describe('initParallax', () => {
    beforeEach(() => {
      mockElement.classList.add('parallax-element');
      mockQuerySelectorAll.mockReturnValue([mockElement]);
    });

    it('initializes parallax for elements with parallax-element class', () => {
      initParallax();

      expect(mockQuerySelectorAll).toHaveBeenCalledWith('.parallax-element');
      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    });

    it('does nothing when no parallax elements exist', () => {
      mockQuerySelectorAll.mockReturnValue([]);

      initParallax();

      expect(mockAddEventListener).not.toHaveBeenCalled();
    });

    it('updates parallax transform on scroll', () => {
      mockElement.dataset.parallaxSpeed = '0.3';
      global.window.pageYOffset = 100;

      initParallax();

      // Trigger the scroll handler
      const scrollHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'scroll'
      )?.[1];

      if (scrollHandler) {
        scrollHandler();
        // RequestAnimationFrame callback should be called
        const rafCallback = mockRequestAnimationFrame.mock.calls[0]?.[0];
        if (rafCallback) {
          rafCallback();
          
          // Check if transform was applied
          expect(mockElement.style.transform).toBeDefined();
        }
      }
    });

    it('uses default parallax speed when not specified', () => {
      initParallax();

      const scrollHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'scroll'
      )?.[1];

      expect(scrollHandler).toBeDefined();
    });
  });

  describe('initSmoothScroll', () => {
    beforeEach(() => {
      mockElement.getAttribute = vi.fn().mockReturnValue('#target');
      const targetElement = { ...mockElement };
      mockQuerySelector.mockReturnValue(targetElement);
      mockQuerySelectorAll.mockReturnValue([mockElement]);
    });

    it('adds click listeners to anchor links', () => {
      initSmoothScroll();

      expect(mockQuerySelectorAll).toHaveBeenCalledWith('a[href^="#"]');
      expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('prevents default click behavior', () => {
      initSmoothScroll();

      const clickHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'click'
      )?.[1];

      const mockEvent = { preventDefault: vi.fn() };
      
      if (clickHandler) {
        clickHandler.call(mockElement, mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
      }
    });

    it('scrolls to target element with header offset', () => {
      const targetElement = {
        getBoundingClientRect: vi.fn(() => ({ top: 200 })),
      };
      mockQuerySelector.mockReturnValue(targetElement);

      initSmoothScroll();

      const clickHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'click'
      )?.[1];

      const mockEvent = { preventDefault: vi.fn() };

      if (clickHandler) {
        clickHandler.call(mockElement, mockEvent);
        
        expect(global.window.scrollTo).toHaveBeenCalledWith({
          top: 200 - 80, // 200 (target position) - 80 (header height)
          behavior: 'smooth',
        });
      }
    });

    it('updates browser history', () => {
      initSmoothScroll();

      const clickHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'click'
      )?.[1];

      const mockEvent = { preventDefault: vi.fn() };

      if (clickHandler) {
        clickHandler.call(mockElement, mockEvent);
        
        expect(global.window.history.pushState).toHaveBeenCalledWith(null, null, '#target');
      }
    });

    it('handles missing target elements gracefully', () => {
      mockQuerySelector.mockReturnValue(null);

      initSmoothScroll();

      const clickHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'click'
      )?.[1];

      const mockEvent = { preventDefault: vi.fn() };

      expect(() => {
        if (clickHandler) {
          clickHandler.call(mockElement, mockEvent);
        }
      }).not.toThrow();
    });
  });

  describe('initTypewriter', () => {
    it('types text with specified speed', () => {
      const text = 'Hello World';
      const speed = 50;

      initTypewriter(mockElement, text, speed);

      expect(mockElement.textContent).toBe('');
      expect(mockElement.classList.add).toHaveBeenCalledWith('typewriter');
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 500); // Initial delay
    });

    it('handles empty text', () => {
      initTypewriter(mockElement, '', 100);

      expect(mockElement.classList.add).toHaveBeenCalledWith('typewriter');
    });

    it('does nothing with null element', () => {
      expect(() => {
        initTypewriter(null as any, 'text', 100);
      }).not.toThrow();
    });

    it('removes cursor after typing completion', () => {
      const text = 'A';
      
      // Mock setTimeout to execute immediately for the first few calls
      let callCount = 0;
      mockSetTimeout.mockImplementation((fn, delay) => {
        callCount++;
        if (callCount <= 3) { // Initial delay + typing + cursor removal
          fn();
        }
        return callCount;
      });

      initTypewriter(mockElement, text, 50);

      // After typing completion, cursor should be removed
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });
  });

  describe('initFloatingShapes', () => {
    it('creates floating shapes in container', () => {
      const container = { ...mockElement, appendChild: vi.fn() };

      initFloatingShapes(container as any);

      expect(container.appendChild).toHaveBeenCalledTimes(3); // 3 shapes
    });

    it('applies different styles for different shape types', () => {
      const container = { ...mockElement, appendChild: vi.fn() };
      const createdElements: any[] = [];
      
      global.document.createElement = vi.fn(() => {
        const element = {
          className: '',
          style: {},
        };
        createdElements.push(element);
        return element as any;
      });

      initFloatingShapes(container as any);

      expect(createdElements).toHaveLength(3);
      
      // Check that different classes are applied
      const classNames = createdElements.map(el => el.className);
      expect(classNames).toContain('floating-shape circle float-animation');
      expect(classNames).toContain('floating-shape square float-animation');
      expect(classNames).toContain('floating-shape triangle float-animation');
    });

    it('does nothing with null container', () => {
      expect(() => {
        initFloatingShapes(null as any);
      }).not.toThrow();
    });

    it('sets random positioning for shapes', () => {
      const container = { ...mockElement, appendChild: vi.fn() };
      const createdElements: any[] = [];
      
      // Mock Math.random to return predictable values
      const originalRandom = Math.random;
      Math.random = vi.fn()
        .mockReturnValueOnce(0.5) // left position for shape 1
        .mockReturnValueOnce(0.3) // top position for shape 1
        .mockReturnValueOnce(0.7) // left position for shape 2
        .mockReturnValueOnce(0.9); // top position for shape 2

      global.document.createElement = vi.fn(() => {
        const element = { className: '', style: {} };
        createdElements.push(element);
        return element as any;
      });

      initFloatingShapes(container as any);

      // Restore Math.random
      Math.random = originalRandom;

      expect(createdElements[0].style.left).toBe('50%');
      expect(createdElements[0].style.top).toBe('30%');
    });
  });

  describe('initCardHoverEffects', () => {
    beforeEach(() => {
      mockElement.className = 'research-card';
      mockElement.style.setProperty = vi.fn();
      mockQuerySelectorAll.mockReturnValue([mockElement]);
    });

    it('adds mouseenter listeners to card elements', () => {
      initCardHoverEffects();

      expect(mockQuerySelectorAll).toHaveBeenCalledWith('.research-card, .publication-card, .contact-card');
      expect(mockAddEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    });

    it('sets CSS custom properties on hover', () => {
      initCardHoverEffects();

      const mouseenterHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'mouseenter'
      )?.[1];

      const mockEvent = {
        clientX: 150,
        clientY: 200,
      };

      if (mouseenterHandler) {
        mouseenterHandler.call(mockElement, mockEvent);

        expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mouse-x', '150px');
        expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mouse-y', '100px'); // 200 - 100 (rect.top)
      }
    });
  });

  describe('Loading Utilities', () => {
    describe('showLoading', () => {
      it('adds skeleton class', () => {
        showLoading(mockElement);
        expect(mockElement.classList.add).toHaveBeenCalledWith('skeleton');
      });
    });

    describe('hideLoading', () => {
      it('removes skeleton class', () => {
        hideLoading(mockElement);
        expect(mockElement.classList.remove).toHaveBeenCalledWith('skeleton');
      });
    });
  });

  describe('initAnimations', () => {
    it('initializes all animation systems when DOM is ready', () => {
      global.document.readyState = 'complete';
      
      // Mock specific elements for typewriter and floating shapes
      const taglineElement = { ...mockElement, textContent: 'Test tagline' };
      const heroElement = { ...mockElement };
      
      mockQuerySelector
        .mockReturnValueOnce(taglineElement) // For .hero-tagline
        .mockReturnValueOnce(heroElement);   // For .hero

      initAnimations();

      // Should initialize all systems
      expect(mockIntersectionObserver).toHaveBeenCalled(); // From initScrollAnimations
      expect(mockAddEventListener).toHaveBeenCalled(); // From various init functions
    });

    it('waits for DOM to load when document is still loading', () => {
      global.document.readyState = 'loading';

      initAnimations();

      expect(mockAddEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    });

    it('handles navigation events for SPAs', () => {
      global.window.navigation = {
        addEventListener: vi.fn(),
      };

      initAnimations();

      expect(global.window.navigation.addEventListener).toHaveBeenCalledWith('navigate', expect.any(Function));
    });

    it('gracefully handles missing elements', () => {
      mockQuerySelector.mockReturnValue(null);

      expect(() => {
        initAnimations();
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('handles missing IntersectionObserver gracefully', () => {
      delete (global.window as any).IntersectionObserver;

      expect(() => {
        initScrollAnimations();
      }).not.toThrow();
    });

    it('handles malformed dataset values', () => {
      mockElement.dataset.animateDelay = 'invalid';
      mockElement.dataset.parallaxSpeed = 'not-a-number';

      expect(() => {
        initScrollAnimations();
        initParallax();
      }).not.toThrow();
    });

    it('handles missing DOM elements', () => {
      mockQuerySelectorAll.mockReturnValue([]);
      mockQuerySelector.mockReturnValue(null);

      expect(() => {
        initScrollAnimations();
        initParallax();
        initSmoothScroll();
        initCardHoverEffects();
      }).not.toThrow();
    });
  });

  describe('Performance Optimizations', () => {
    it('uses requestAnimationFrame for parallax updates', () => {
      mockElement.classList.add('parallax-element');
      mockQuerySelectorAll.mockReturnValue([mockElement]);

      initParallax();

      // Should use requestAnimationFrame
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('implements throttling for scroll events', () => {
      mockElement.classList.add('parallax-element');
      mockQuerySelectorAll.mockReturnValue([mockElement]);

      initParallax();

      const scrollHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'scroll'
      )?.[1];

      // Multiple rapid calls should be throttled
      if (scrollHandler) {
        scrollHandler();
        scrollHandler();
        scrollHandler();

        // Should only call requestAnimationFrame once due to throttling
        expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
      }
    });

    it('uses passive event listeners for scroll', () => {
      mockElement.classList.add('parallax-element');
      mockQuerySelectorAll.mockReturnValue([mockElement]);

      initParallax();

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true }
      );
    });
  });
});