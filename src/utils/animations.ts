/**
 * Advanced Animation Controller for Portfolio
 * Provides centralized animation management with performance monitoring
 */

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
      status: 'idle'
    };

    this.animations.set(id, state);
    this.metrics.totalAnimations++;

    // Auto-observe scroll-based animations
    if (type === 'scroll' && this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }

    this.debugLog(`Registered animation: ${id} (${type}, ${priority})`);
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

      // Create and start animation
      const animation = state.element.animate(keyframes, {
        duration: 600,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        ...options
      });

      state.animation = animation;
      state.status = 'running';
      state.startTime = performance.now();
      state.duration = typeof options.duration === 'number' ? options.duration : 600;
      state.options = options;
      this.metrics.runningAnimations++;

      animation.addEventListener('finish', () => {
        state.status = 'completed';
        this.metrics.runningAnimations--;
        this.metrics.completedAnimations++;
        this.debugLog(`Animation ${id} completed`);
        resolve();
      });

      animation.addEventListener('cancel', () => {
        state.status = 'cancelled';
        this.metrics.runningAnimations--;
        this.debugLog(`Animation ${id} cancelled`);
        reject(new Error(`Animation ${id} was cancelled`));
      });

      this.debugLog(`Started animation: ${id}`);
    });
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

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * Create magnetic button effect
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

    button.addEventListener('mouseenter', () => {
      isHovering = true;
      button.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    button.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isHovering) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    });

    button.addEventListener('mouseleave', () => {
      isHovering = false;
      button.style.transform = '';
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
 * Convenience functions for common animations
 */
export const animations = {
  fadeIn: [
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  
  slideUp: [
    { transform: 'translateY(100px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  
  scaleIn: [
    { transform: 'scale(0.8)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  
  bounceIn: [
    { transform: 'scale(0.3)', opacity: 0 },
    { transform: 'scale(1.05)', opacity: 0.8, offset: 0.6 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  
  slideInLeft: [
    { transform: 'translateX(-100px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  
  slideInRight: [
    { transform: 'translateX(100px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  
  pulse: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.05)' },
    { transform: 'scale(1)' }
  ]
};

export type { AnimationController, AnimationState, AnimationMetrics, AnimationConfig };