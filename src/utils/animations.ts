/**
 * Advanced Animation Controller for Portfolio
 * Provides centralized animation management with performance monitoring
 */
import React from 'react';

interface AnimationState {
  id: string;
  element: HTMLElement;
  animation?: Animation;
  type: 'scroll' | 'hover' | 'click' | 'load' | 'parallax';
  status: 'idle' | 'running' | 'paused' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  startTime?: number;
  duration?: number;
  options?: KeyframeAnimationOptions;
  gpuAccelerated?: boolean;
  willChangeManaged?: boolean;
  cleanup?: () => void;
}

interface AnimationMetrics {
  totalAnimations: number;
  runningAnimations: number;
  completedAnimations: number;
  droppedFrames: number;
  averageFrameTime: number;
  performanceScore: number;
}

interface AnimationConfig {
  respectReducedMotion: boolean;
  maxConcurrentAnimations: number;
  frameRateThreshold: number;
  enablePerformanceMonitoring: boolean;
  enableDebugMode: boolean;
  enableGPUAcceleration: boolean;
  enableWillChangeManagement: boolean;
  enableHapticFeedback: boolean;
  networkAwarePreloading: boolean;
}

class AnimationController {
  private animations: Map<string, AnimationState> = new Map();
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private frameCount = 0;
  private lastTime = 0;
  private frameRateHistory: number[] = [];
  private config: AnimationConfig;
  private metrics: AnimationMetrics = {
    totalAnimations: 0,
    runningAnimations: 0,
    completedAnimations: 0,
    droppedFrames: 0,
    averageFrameTime: 0,
    performanceScore: 100
  };

  constructor(config: Partial<AnimationConfig> = {}) {
    this.config = {
      respectReducedMotion: true,
      maxConcurrentAnimations: 10,
      frameRateThreshold: 50,
      enablePerformanceMonitoring: true,
      enableDebugMode: false,
      enableGPUAcceleration: true,
      enableWillChangeManagement: true,
      enableHapticFeedback: true,
      networkAwarePreloading: true,
      ...config
    };

    this.init();
  }

  private init(): void {
    this.setupIntersectionObserver();
    this.setupResizeObserver();
    
    if (this.config.enablePerformanceMonitoring) {
      this.startPerformanceMonitoring();
    }

    // Respect user's motion preferences
    if (this.config.respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', this.handleMotionPreferenceChange.bind(this));
      
      if (mediaQuery.matches) {
        this.pauseAllAnimations();
      }
    }

    this.debugLog('AnimationController initialized');
  }

  /**
   * Register an animation for management
   */
  register(
    id: string,
    element: HTMLElement,
    type: AnimationState['type'] = 'load',
    priority: AnimationState['priority'] = 'medium'
  ): void {
    if (this.animations.has(id)) {
      this.debugLog(`Animation ${id} already exists, updating...`);
    }

    const state: AnimationState = {
      id,
      element,
      type,
      priority,
      status: 'idle',
      gpuAccelerated: false,
      willChangeManaged: false
    };

    this.animations.set(id, state);
    this.metrics.totalAnimations++;

    // Prepare element for GPU acceleration
    if (this.config.enableGPUAcceleration) {
      this.enableGPUAcceleration(element, state);
    }

    // Auto-observe scroll-based animations
    if (type === 'scroll' && this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }

    this.debugLog(`Registered animation: ${id} (${type}, ${priority})`);
  }

  /**
   * Enable GPU acceleration for an element
   */
  private enableGPUAcceleration(element: HTMLElement, state: AnimationState): void {
    if (state.gpuAccelerated) return;

    // Force GPU layer creation with minimal visual impact
    element.style.transform = element.style.transform || 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
    
    state.gpuAccelerated = true;
    this.debugLog(`GPU acceleration enabled for ${state.id}`);
  }

  /**
   * Manage will-change property for performance
   */
  private manageWillChange(element: HTMLElement, state: AnimationState, properties: string[]): void {
    if (!this.config.enableWillChangeManagement) return;

    if (state.status === 'running' && !state.willChangeManaged) {
      element.style.willChange = properties.join(', ');
      state.willChangeManaged = true;
      this.debugLog(`will-change set for ${state.id}: ${properties.join(', ')}`);
    } else if (state.status === 'completed' && state.willChangeManaged) {
      element.style.willChange = 'auto';
      state.willChangeManaged = false;
      this.debugLog(`will-change cleared for ${state.id}`);
    }
  }

  /**
   * Trigger haptic feedback for supported devices
   */
  private triggerHapticFeedback(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (!this.config.enableHapticFeedback || !navigator.vibrate) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };

    navigator.vibrate(patterns[intensity]);
  }

  /**
   * Start a keyframe animation
   */
  animate(
    id: string,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const state = this.animations.get(id);
      if (!state) {
        reject(new Error(`Animation ${id} not registered`));
        return;
      }

      // Check if we should respect reduced motion
      if (this.shouldSkipAnimation()) {
        this.debugLog(`Skipping animation ${id} due to reduced motion preference`);
        resolve();
        return;
      }

      // Check concurrent animation limit
      if (this.metrics.runningAnimations >= this.config.maxConcurrentAnimations) {
        if (state.priority === 'low') {
          this.debugLog(`Skipping low-priority animation ${id} due to limit`);
          resolve();
          return;
        }
        // Cancel lowest priority running animation
        this.cancelLowestPriorityAnimation();
      }

      // Detect animated properties for will-change management
      const animatedProperties = this.detectAnimatedProperties(keyframes);
      
      // Manage will-change before animation starts
      this.manageWillChange(state.element, { ...state, status: 'running' }, animatedProperties);

      // Create and start animation with GPU-optimized defaults
      const animation = state.element.animate(keyframes, {
        duration: 600,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        composite: 'replace',
        ...options
      });

      state.animation = animation;
      state.status = 'running';
      state.startTime = performance.now();
      state.duration = typeof options.duration === 'number' ? options.duration : 600;
      state.options = options;
      this.metrics.runningAnimations++;

      // Trigger haptic feedback for high-priority animations
      if (state.priority === 'high' && (state.type === 'click' || state.type === 'hover')) {
        this.triggerHapticFeedback('light');
      }

      animation.addEventListener('finish', () => {
        state.status = 'completed';
        this.metrics.runningAnimations--;
        this.metrics.completedAnimations++;
        this.manageWillChange(state.element, state, animatedProperties);
        this.debugLog(`Animation ${id} completed`);
        resolve();
      });

      animation.addEventListener('cancel', () => {
        state.status = 'cancelled';
        this.metrics.runningAnimations--;
        this.manageWillChange(state.element, state, animatedProperties);
        this.debugLog(`Animation ${id} cancelled`);
        reject(new Error(`Animation ${id} was cancelled`));
      });

      this.debugLog(`Started animation: ${id}`);
    });
  }

  /**
   * Detect animated properties from keyframes for will-change optimization
   */
  private detectAnimatedProperties(keyframes: Keyframe[]): string[] {
    const properties = new Set<string>();
    
    keyframes.forEach(keyframe => {
      Object.keys(keyframe).forEach(property => {
        if (property !== 'offset' && property !== 'easing' && property !== 'composite') {
          properties.add(property);
        }
      });
    });
    
    return Array.from(properties);
  }

  /**
   * Pause a specific animation
   */
  pause(id: string): void {
    const state = this.animations.get(id);
    if (state?.animation && state.status === 'running') {
      state.animation.pause();
      state.status = 'paused';
      this.metrics.runningAnimations--;
      this.debugLog(`Paused animation: ${id}`);
    }
  }

  /**
   * Resume a paused animation
   */
  resume(id: string): void {
    const state = this.animations.get(id);
    if (state?.animation && state.status === 'paused') {
      state.animation.play();
      state.status = 'running';
      this.metrics.runningAnimations++;
      this.debugLog(`Resumed animation: ${id}`);
    }
  }

  /**
   * Cancel a specific animation
   */
  cancel(id: string): void {
    const state = this.animations.get(id);
    if (state?.animation) {
      state.animation.cancel();
      state.status = 'cancelled';
      this.debugLog(`Cancelled animation: ${id}`);
    }
  }

  /**
   * Pause all running animations
   */
  pauseAllAnimations(): void {
    this.animations.forEach((state, id) => {
      if (state.status === 'running') {
        this.pause(id);
      }
    });
  }

  /**
   * Resume all paused animations
   */
  resumeAllAnimations(): void {
    this.animations.forEach((state, id) => {
      if (state.status === 'paused') {
        this.resume(id);
      }
    });
  }

  /**
   * Get animation state
   */
  getState(id: string): AnimationState | undefined {
    return this.animations.get(id);
  }

  /**
   * Get performance metrics
   */
  getMetrics(): AnimationMetrics {
    return { ...this.metrics };
  }

  /**
   * Create scroll-triggered animation
   */
  onScroll(
    id: string,
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions & { threshold?: number; rootMargin?: string } = {}
  ): void {
    this.register(id, element, 'scroll');
    
    const { threshold = 0.1, rootMargin = '0px', ...animationOptions } = options;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === element) {
            this.animate(id, keyframes, animationOptions);
            observer.unobserve(element);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
  }

  /**
   * Create parallax effect
   */
  parallax(
    id: string,
    element: HTMLElement,
    speed: number = 0.5,
    priority: AnimationState['priority'] = 'low'
  ): void {
    this.register(id, element, 'parallax', priority);
    
    let ticking = false;
    let scrollHandler: (() => void) | null = null;
    
    const updateParallax = () => {
      const scrollY = window.pageYOffset;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Only animate if element is in viewport
      if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
        const yPos = (scrollY - elementTop) * speed;
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking && !this.shouldSkipAnimation()) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    scrollHandler = requestTick;
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Store cleanup function
    const state = this.animations.get(id);
    if (state) {
      state.cleanup = () => {
        if (scrollHandler) {
          window.removeEventListener('scroll', scrollHandler);
          scrollHandler = null;
        }
      };
    }
  }

  /**
   * Create magnetic button effect with enhanced performance and haptic feedback
   */
  magneticButton(
    id: string,
    button: HTMLElement,
    strength: number = 0.3,
    priority: AnimationState['priority'] = 'medium'
  ): void {
    this.register(id, button, 'hover', priority);

    if (this.shouldSkipAnimation()) return;

    let isHovering = false;
    let animationFrame: number | null = null;
    const state = this.animations.get(id);

    // Optimize for GPU acceleration
    if (state && this.config.enableGPUAcceleration) {
      this.enableGPUAcceleration(button, state);
    }

    // Manage will-change for transform property
    if (this.config.enableWillChangeManagement) {
      button.style.willChange = 'transform';
    }

    button.addEventListener('mouseenter', () => {
      isHovering = true;
      this.triggerHapticFeedback('light');
      
      // Smooth transition with GPU acceleration
      button.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
      
      // Add a subtle glow effect
      button.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
    });

    button.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isHovering) return;

      // Use RAF for smooth animation
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        
        // Enhanced magnetic effect with rotation
        const rotateX = (e.clientY - centerY) * 0.1;
        const rotateY = (centerX - e.clientX) * 0.1;
        
        button.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });

    button.addEventListener('mouseleave', () => {
      isHovering = false;
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      
      // Reset with smooth transition
      button.style.transform = '';
      button.style.boxShadow = '';
      
      // Clear will-change when not animating
      if (this.config.enableWillChangeManagement) {
        setTimeout(() => {
          if (!isHovering) {
            button.style.willChange = 'auto';
          }
        }, 300);
      }
    });

    // Add click feedback
    button.addEventListener('click', () => {
      this.triggerHapticFeedback('medium');
      
      // Quick pulse effect on click
      button.style.transform += ' scale(0.95)';
      setTimeout(() => {
        if (isHovering) {
          // Return to hover state
          const rect = button.getBoundingClientRect();
          button.style.transform = button.style.transform.replace(' scale(0.95)', '');
        }
      }, 100);
    });
  }

  /**
   * Create stagger animation for multiple elements
   */
  stagger(
    baseId: string,
    elements: HTMLElement[],
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions & { staggerDelay?: number } = {}
  ): Promise<void[]> {
    const { staggerDelay = 100, ...animationOptions } = options;
    
    const promises = elements.map((element, index) => {
      const id = `${baseId}-${index}`;
      this.register(id, element, 'load', 'medium');
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.animate(id, keyframes, animationOptions).then(resolve);
        }, index * staggerDelay);
      });
    });

    return Promise.all(promises);
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const animationId = element.dataset.animationId;
          
          if (animationId && entry.isIntersecting) {
            const state = this.animations.get(animationId);
            if (state && state.status === 'idle') {
              // Trigger scroll animation - this would be configured elsewhere
              this.debugLog(`Element ${animationId} entered viewport`);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      // Pause animations during resize to prevent jank
      const wasRunning: string[] = [];
      
      this.animations.forEach((state, id) => {
        if (state.status === 'running') {
          this.pause(id);
          wasRunning.push(id);
        }
      });

      // Resume after a short delay
      setTimeout(() => {
        wasRunning.forEach(id => this.resume(id));
      }, 150);
    });

    this.resizeObserver.observe(document.body);
  }

  private startPerformanceMonitoring(): void {
    const updateMetrics = (currentTime: number) => {
      this.frameCount++;
      
      if (this.lastTime) {
        const frameTime = currentTime - this.lastTime;
        this.frameRateHistory.push(1000 / frameTime);
        
        // Keep only last 60 frames
        if (this.frameRateHistory.length > 60) {
          this.frameRateHistory.shift();
        }
        
        // Calculate average frame rate
        const avgFrameRate = this.frameRateHistory.reduce((a, b) => a + b, 0) / this.frameRateHistory.length;
        
        // Update metrics
        this.metrics.averageFrameTime = frameTime;
        if (avgFrameRate < this.config.frameRateThreshold) {
          this.metrics.droppedFrames++;
        }
        
        // Calculate performance score (0-100)
        this.metrics.performanceScore = Math.max(0, Math.min(100, avgFrameRate * 2));
        
        // Auto-adjust if performance is poor
        if (this.metrics.performanceScore < 60 && this.metrics.runningAnimations > 3) {
          this.pauseLowestPriorityAnimations();
        }
      }
      
      this.lastTime = currentTime;
      requestAnimationFrame(updateMetrics);
    };

    requestAnimationFrame(updateMetrics);
  }

  private shouldSkipAnimation(): boolean {
    if (!this.config.respectReducedMotion) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private cancelLowestPriorityAnimation(): void {
    let lowestPriority: AnimationState | null = null;
    const priorityOrder = { low: 0, medium: 1, high: 2 };

    this.animations.forEach((state) => {
      if (state.status === 'running') {
        if (!lowestPriority || priorityOrder[state.priority] < priorityOrder[lowestPriority.priority]) {
          lowestPriority = state;
        }
      }
    });

    if (lowestPriority) {
      this.cancel(lowestPriority.id);
    }
  }

  private pauseLowestPriorityAnimations(): void {
    const lowPriorityAnimations = Array.from(this.animations.values())
      .filter(state => state.status === 'running' && state.priority === 'low');
    
    lowPriorityAnimations.forEach(state => this.pause(state.id));
    this.debugLog(`Paused ${lowPriorityAnimations.length} low-priority animations for performance`);
  }

  private handleMotionPreferenceChange(e: MediaQueryListEvent): void {
    if (e.matches) {
      this.pauseAllAnimations();
      this.debugLog('Paused all animations due to reduced motion preference');
    } else {
      this.resumeAllAnimations();
      this.debugLog('Resumed animations due to motion preference change');
    }
  }

  private debugLog(message: string): void {
    if (this.config.enableDebugMode) {
      console.log(`[AnimationController] ${message}`);
    }
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    this.pauseAllAnimations();
    
    // Run cleanup for all animations
    this.animations.forEach((state) => {
      if (state.cleanup) {
        state.cleanup();
      }
    });
    
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.animations.clear();
    this.debugLog('AnimationController destroyed');
  }
}

// Singleton instance
let animationController: AnimationController | null = null;

/**
 * Get or create animation controller instance
 */
export function getAnimationController(config?: Partial<AnimationConfig>): AnimationController {
  if (!animationController) {
    animationController = new AnimationController(config);
  }
  return animationController;
}

/**
 * Convenience functions for common animations (GPU-optimized)
 */
export const animations = {
  // Basic fade with GPU acceleration
  fadeIn: [
    { opacity: 0, transform: 'translate3d(0, 30px, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  ],
  
  // Optimized slide animations
  slideUp: [
    { transform: 'translate3d(0, 100px, 0)', opacity: 0 },
    { transform: 'translate3d(0, 0, 0)', opacity: 1 }
  ],
  
  slideDown: [
    { transform: 'translate3d(0, -100px, 0)', opacity: 0 },
    { transform: 'translate3d(0, 0, 0)', opacity: 1 }
  ],
  
  slideInLeft: [
    { transform: 'translate3d(-100px, 0, 0)', opacity: 0 },
    { transform: 'translate3d(0, 0, 0)', opacity: 1 }
  ],
  
  slideInRight: [
    { transform: 'translate3d(100px, 0, 0)', opacity: 0 },
    { transform: 'translate3d(0, 0, 0)', opacity: 1 }
  ],
  
  // Scale animations with 3D transforms
  scaleIn: [
    { transform: 'scale3d(0.8, 0.8, 1)', opacity: 0 },
    { transform: 'scale3d(1, 1, 1)', opacity: 1 }
  ],
  
  scaleInDown: [
    { transform: 'scale3d(0.8, 0.8, 1) translate3d(0, -30px, 0)', opacity: 0 },
    { transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)', opacity: 1 }
  ],
  
  scaleInUp: [
    { transform: 'scale3d(0.8, 0.8, 1) translate3d(0, 30px, 0)', opacity: 0 },
    { transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)', opacity: 1 }
  ],
  
  // Bounce animation with better performance
  bounceIn: [
    { transform: 'scale3d(0.3, 0.3, 1)', opacity: 0 },
    { transform: 'scale3d(1.05, 1.05, 1)', opacity: 0.8, offset: 0.6 },
    { transform: 'scale3d(1, 1, 1)', opacity: 1 }
  ],
  
  // Rotation animations
  rotateIn: [
    { transform: 'rotate3d(0, 0, 1, -90deg)', opacity: 0 },
    { transform: 'rotate3d(0, 0, 1, 0deg)', opacity: 1 }
  ],
  
  flipIn: [
    { transform: 'rotate3d(1, 0, 0, -90deg)', opacity: 0 },
    { transform: 'rotate3d(1, 0, 0, 0deg)', opacity: 1 }
  ],
  
  // Attention seekers
  pulse: [
    { transform: 'scale3d(1, 1, 1)' },
    { transform: 'scale3d(1.05, 1.05, 1)' },
    { transform: 'scale3d(1, 1, 1)' }
  ],
  
  heartbeat: [
    { transform: 'scale3d(1, 1, 1)' },
    { transform: 'scale3d(1.3, 1.3, 1)', offset: 0.14 },
    { transform: 'scale3d(1, 1, 1)', offset: 0.28 },
    { transform: 'scale3d(1.3, 1.3, 1)', offset: 0.42 },
    { transform: 'scale3d(1, 1, 1)' }
  ],
  
  // Complex entrance animations
  fadeInUp: [
    { opacity: 0, transform: 'translate3d(0, 30px, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  ],
  
  fadeInDown: [
    { opacity: 0, transform: 'translate3d(0, -30px, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  ],
  
  zoomIn: [
    { opacity: 0, transform: 'scale3d(0.3, 0.3, 1)' },
    { opacity: 1, transform: 'scale3d(1, 1, 1)' }
  ],
  
  zoomInLeft: [
    { opacity: 0, transform: 'scale3d(0.1, 0.1, 1) translate3d(-1000px, 0, 0)' },
    { opacity: 1, transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' }
  ],
  
  zoomInRight: [
    { opacity: 0, transform: 'scale3d(0.1, 0.1, 1) translate3d(1000px, 0, 0)' },
    { opacity: 1, transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' }
  ],
  
  // Magnetic hover effects
  magneticHover: [
    { transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)' },
    { transform: 'translate3d(0, -2px, 0) scale3d(1.02, 1.02, 1)' }
  ],
  
  // Loading animations
  shimmer: [
    { transform: 'translate3d(-100%, 0, 0)' },
    { transform: 'translate3d(100%, 0, 0)' }
  ]
};

export type { AnimationController, AnimationState, AnimationMetrics, AnimationConfig };

/**
 * React hook to check for reduced motion preference
 */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}