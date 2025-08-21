/**
 * Accessibility Controller for Enhanced A11y Support
 * Provides comprehensive accessibility features and WCAG 2.1 AA compliance
 */

interface AccessibilityOptions {
  enableHighContrast?: boolean;
  enableFocusManagement?: boolean;
  enableScreenReaderOptimizations?: boolean;
  enableReducedMotion?: boolean;
  enableKeyboardNavigation?: boolean;
  announcePageChanges?: boolean;
}

interface FocusableElement extends HTMLElement {
  tabIndex: number;
}

class AccessibilityController {
  private options: Required<AccessibilityOptions>;
  private focusHistory: HTMLElement[] = [];
  private announcer: HTMLElement | null = null;
  private focusVisible = false;
  private reducedMotion = false;
  private highContrast = false;
  private keyboardUser = false;

  constructor(options: AccessibilityOptions = {}) {
    this.options = {
      enableHighContrast: true,
      enableFocusManagement: true,
      enableScreenReaderOptimizations: true,
      enableReducedMotion: true,
      enableKeyboardNavigation: true,
      announcePageChanges: true,
      ...options
    };

    this.init();
  }

  private init(): void {
    this.detectUserPreferences();
    this.setupScreenReaderOptimizations();
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.setupReducedMotionHandling();
    this.setupHighContrastHandling();
    this.setupLiveRegions();
    this.optimizeForScreenReaders();
  }

  /**
   * Detect user accessibility preferences
   */
  private detectUserPreferences(): void {
    // Reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // High contrast preference
    this.highContrast = window.matchMedia('(prefers-contrast: high)').matches ||
                       window.matchMedia('(-ms-high-contrast: active)').matches;

    // Listen for preference changes
    const mediaQueries = [
      { query: '(prefers-reduced-motion: reduce)', callback: this.handleReducedMotionChange.bind(this) },
      { query: '(prefers-contrast: high)', callback: this.handleHighContrastChange.bind(this) },
      { query: '(-ms-high-contrast: active)', callback: this.handleHighContrastChange.bind(this) }
    ];

    mediaQueries.forEach(({ query, callback }) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', callback);
    });
  }

  /**
   * Setup screen reader optimizations
   */
  private setupScreenReaderOptimizations(): void {
    if (!this.options.enableScreenReaderOptimizations) return;

    // Add screen reader only text for better context
    this.addScreenReaderContext();
    
    // Optimize heading structure
    this.optimizeHeadingStructure();
    
    // Add landmarks
    this.addLandmarks();
    
    // Improve form accessibility
    this.improveFormAccessibility();
  }

  /**
   * Setup comprehensive focus management
   */
  private setupFocusManagement(): void {
    if (!this.options.enableFocusManagement) return;

    // Detect keyboard usage
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.keyboardUser = true;
        document.body.classList.add('keyboard-user');
      }
    });

    document.addEventListener('mousedown', () => {
      this.keyboardUser = false;
      document.body.classList.remove('keyboard-user');
    });

    // Enhanced focus indicators
    this.setupFocusIndicators();
    
    // Focus trapping for modals
    this.setupFocusTrapping();
    
    // Skip links
    this.addSkipLinks();
    
    // Focus restoration
    this.setupFocusRestoration();
  }

  /**
   * Setup keyboard navigation enhancements
   */
  private setupKeyboardNavigation(): void {
    if (!this.options.enableKeyboardNavigation) return;

    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    
    // Add keyboard hints for interactive elements
    this.addKeyboardHints();
    
    // Improve button accessibility
    this.improveButtonAccessibility();
  }

  /**
   * Handle reduced motion preferences
   */
  private setupReducedMotionHandling(): void {
    if (!this.options.enableReducedMotion) return;

    this.applyReducedMotionStyles();
    
    // Provide animation controls
    this.addAnimationControls();
  }

  /**
   * Handle high contrast preferences
   */
  private setupHighContrastHandling(): void {
    if (!this.options.enableHighContrast) return;

    if (this.highContrast) {
      this.applyHighContrastStyles();
    }
  }

  /**
   * Setup live regions for dynamic content announcements
   */
  private setupLiveRegions(): void {
    if (!this.options.announcePageChanges) return;

    // Create polite announcer
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    document.body.appendChild(this.announcer);

    // Create assertive announcer for urgent messages
    const assertiveAnnouncer = this.announcer.cloneNode() as HTMLElement;
    assertiveAnnouncer.setAttribute('aria-live', 'assertive');
    assertiveAnnouncer.id = 'assertive-announcer';
    document.body.appendChild(assertiveAnnouncer);
  }

  /**
   * Add screen reader context for complex UI elements
   */
  private addScreenReaderContext(): void {
    // Add context for navigation
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }

    // Add context for interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      const text = button.textContent?.trim();
      if (!text || text.length < 3) {
        const context = button.getAttribute('data-context') || 'Interactive button';
        button.setAttribute('aria-label', context);
      }
    });

    // Add context for images
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      const imgEl = img as HTMLImageElement;
      const isDecorative = imgEl.getAttribute('data-decorative') === 'true';
      imgEl.alt = isDecorative ? '' : 'Image';
    });
  }

  /**
   * Optimize heading structure for screen readers
   */
  private optimizeHeadingStructure(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      
      // Warn about skipped heading levels
      if (level > currentLevel + 1) {
        console.warn(`Heading level jumped from h${currentLevel} to h${level}. Consider using h${currentLevel + 1} instead.`);
      }
      
      currentLevel = level;
    });
  }

  /**
   * Add semantic landmarks
   */
  private addLandmarks(): void {
    // Add main landmark if missing
    const main = document.querySelector('main');
    if (!main) {
      const content = document.querySelector('#main-content, .main-content, [role="main"]');
      if (content) {
        content.setAttribute('role', 'main');
      }
    }

    // Ensure navigation has proper role
    const navs = document.querySelectorAll('nav');
    navs.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : `Navigation ${index + 1}`);
      }
    });
  }

  /**
   * Improve form accessibility
   */
  private improveFormAccessibility(): void {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add form labels
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        const inputEl = input as HTMLInputElement;
        const label = form.querySelector(`label[for="${inputEl.id}"]`);
        
        if (!label && !inputEl.getAttribute('aria-label')) {
          const placeholder = inputEl.placeholder;
          if (placeholder) {
            inputEl.setAttribute('aria-label', placeholder);
          }
        }
      });

      // Add error announcements
      const errors = form.querySelectorAll('.error, [role="alert"]');
      errors.forEach(error => {
        if (!error.getAttribute('aria-live')) {
          error.setAttribute('aria-live', 'assertive');
        }
      });
    });
  }

  /**
   * Setup enhanced focus indicators
   */
  private setupFocusIndicators(): void {
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-user *:focus {
        outline: 3px solid #4A90E2 !important;
        outline-offset: 2px !important;
      }
      
      .keyboard-user button:focus,
      .keyboard-user [role="button"]:focus {
        outline: 3px solid #FFD93D !important;
        outline-offset: 2px !important;
      }
      
      .keyboard-user a:focus {
        outline: 3px solid #DA291C !important;
        outline-offset: 2px !important;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .keyboard-user *:focus {
          outline: 3px solid CanvasText !important;
          outline-offset: 2px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add skip links for keyboard navigation
   */
  private addSkipLinks(): void {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    `;
    
    const skipLinkStyles = document.createElement('style');
    skipLinkStyles.textContent = `
      .skip-links {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        z-index: 100000;
      }
      
      .skip-link:focus {
        top: 6px;
        outline: 3px solid #FFD93D;
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(skipLinkStyles);
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyboardNavigation(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        this.handleEscape();
        break;
      case 'Home':
        if (e.ctrlKey) {
          this.focusFirstHeading();
          e.preventDefault();
        }
        break;
      case 'End':
        if (e.ctrlKey) {
          this.focusLastFocusable();
          e.preventDefault();
        }
        break;
    }
  }

  /**
   * Handle escape key for dismissing modals/menus
   */
  private handleEscape(): void {
    const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"], .modal.open');
    if (activeModal) {
      const closeButton = activeModal.querySelector('[aria-label*="close"], .close-button');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    }
  }

  /**
   * Focus first heading
   */
  private focusFirstHeading(): void {
    const firstHeading = document.querySelector('h1, h2, h3, h4, h5, h6') as HTMLElement;
    if (firstHeading) {
      firstHeading.focus();
    }
  }

  /**
   * Focus last focusable element
   */
  private focusLastFocusable(): void {
    const focusables = document.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const lastFocusable = focusables[focusables.length - 1] as HTMLElement;
    if (lastFocusable) {
      lastFocusable.focus();
    }
  }

  /**
   * Apply reduced motion styles
   */
  private applyReducedMotionStyles(): void {
    if (this.reducedMotion) {
      const style = document.createElement('style');
      style.id = 'reduced-motion-styles';
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .parallax-element {
          transform: none !important;
        }
        
        .floating-element,
        .pulse-animation,
        .shimmer-loading {
          animation: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Apply high contrast styles
   */
  private applyHighContrastStyles(): void {
    const style = document.createElement('style');
    style.id = 'high-contrast-styles';
    style.textContent = `
      @media (prefers-contrast: high) {
        * {
          background-image: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        
        button, [role="button"] {
          border: 2px solid CanvasText !important;
        }
        
        a {
          text-decoration: underline !important;
        }
        
        .hero-background,
        .gradient-background {
          background: Canvas !important;
          color: CanvasText !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add animation controls
   */
  private addAnimationControls(): void {
    const controls = document.createElement('div');
    controls.className = 'animation-controls';
    controls.innerHTML = `
      <button type="button" class="animation-toggle" aria-pressed="${!this.reducedMotion}">
        <span class="sr-only">Toggle animations</span>
        🎬
      </button>
    `;
    
    const button = controls.querySelector('.animation-toggle') as HTMLButtonElement;
    button.addEventListener('click', this.toggleAnimations.bind(this));
    
    const controlsStyles = document.createElement('style');
    controlsStyles.textContent = `
      .animation-controls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
      
      .animation-toggle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 20px;
        cursor: pointer;
      }
      
      .animation-toggle:focus {
        outline: 3px solid #FFD93D;
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(controlsStyles);
    document.body.appendChild(controls);
  }

  /**
   * Toggle animations on/off
   */
  private toggleAnimations(): void {
    this.reducedMotion = !this.reducedMotion;
    
    const button = document.querySelector('.animation-toggle') as HTMLButtonElement;
    button.setAttribute('aria-pressed', (!this.reducedMotion).toString());
    
    if (this.reducedMotion) {
      this.applyReducedMotionStyles();
    } else {
      const existingStyles = document.getElementById('reduced-motion-styles');
      if (existingStyles) {
        existingStyles.remove();
      }
    }
    
    this.announce(`Animations ${this.reducedMotion ? 'disabled' : 'enabled'}`);
  }

  /**
   * Setup focus trapping for modals
   */
  private setupFocusTrapping(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (modal) {
          this.trapFocus(e, modal as HTMLElement);
        }
      }
    });
  }

  /**
   * Trap focus within an element
   */
  private trapFocus(e: KeyboardEvent, container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  /**
   * Setup focus restoration
   */
  private setupFocusRestoration(): void {
    // Store focus before opening modals
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('[data-opens-modal]')) {
        this.focusHistory.push(target);
      }
    });
  }

  /**
   * Add keyboard hints
   */
  private addKeyboardHints(): void {
    const interactiveElements = document.querySelectorAll('button, [role="button"], [tabindex]');
    
    interactiveElements.forEach(element => {
      const el = element as HTMLElement;
      if (!el.getAttribute('title')) {
        el.setAttribute('title', 'Press Enter or Space to activate');
      }
    });
  }

  /**
   * Improve button accessibility
   */
  private improveButtonAccessibility(): void {
    const buttons = document.querySelectorAll('button, [role="button"]');
    
    buttons.forEach(button => {
      const buttonEl = button as HTMLElement;
      
      // Add keyboard event handling
      buttonEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          buttonEl.click();
        }
      });
      
      // Ensure proper ARIA attributes
      if (!buttonEl.getAttribute('aria-label') && !buttonEl.textContent?.trim()) {
        console.warn('Button without accessible text found:', buttonEl);
      }
    });
  }

  /**
   * Optimize for screen readers
   */
  private optimizeForScreenReaders(): void {
    // Add ARIA live regions for dynamic content
    const dynamicContent = document.querySelectorAll('[data-dynamic]');
    dynamicContent.forEach(element => {
      if (!element.getAttribute('aria-live')) {
        element.setAttribute('aria-live', 'polite');
      }
    });
    
    // Improve table accessibility
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Data table';
        caption.className = 'sr-only';
        table.insertBefore(caption, table.firstChild);
      }
    });
  }

  /**
   * Handle preference changes
   */
  private handleReducedMotionChange(e: MediaQueryListEvent): void {
    this.reducedMotion = e.matches;
    if (this.reducedMotion) {
      this.applyReducedMotionStyles();
    } else {
      const existingStyles = document.getElementById('reduced-motion-styles');
      if (existingStyles) {
        existingStyles.remove();
      }
    }
  }

  private handleHighContrastChange(e: MediaQueryListEvent): void {
    this.highContrast = e.matches;
    if (this.highContrast) {
      this.applyHighContrastStyles();
    } else {
      const existingStyles = document.getElementById('high-contrast-styles');
      if (existingStyles) {
        existingStyles.remove();
      }
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) return;
    
    const announcer = priority === 'assertive' 
      ? document.getElementById('assertive-announcer') 
      : this.announcer;
    
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  }

  /**
   * Restore focus to previous element
   */
  restoreFocus(): void {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused) {
      lastFocused.focus();
    }
  }

  /**
   * Get accessibility status
   */
  getStatus() {
    return {
      reducedMotion: this.reducedMotion,
      highContrast: this.highContrast,
      keyboardUser: this.keyboardUser,
      focusVisible: this.focusVisible
    };
  }

  /**
   * Clean up
   */
  destroy(): void {
    // Remove event listeners and elements
    const addedStyles = document.querySelectorAll('#reduced-motion-styles, #high-contrast-styles');
    addedStyles.forEach(style => style.remove());
    
    if (this.announcer) {
      this.announcer.remove();
    }
    
    const assertiveAnnouncer = document.getElementById('assertive-announcer');
    if (assertiveAnnouncer) {
      assertiveAnnouncer.remove();
    }
  }
}

// Export for use in other modules
export default AccessibilityController;