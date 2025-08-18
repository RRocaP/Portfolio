// User interaction and engagement tracking
import type { 
  UserInteractionEvent, 
  EngagementEvent, 
  AnalyticsEvent, 
  ConversionEvent,
  ResearchEvent 
} from '../types/analytics';

/**
 * Interaction Tracker
 * Tracks user interactions with the portfolio elements
 */
export class InteractionTracker {
  private sessionId: string;
  private userId?: string;
  private eventCallbacks: ((event: AnalyticsEvent) => void)[] = [];
  private config = {
    trackScrolling: true,
    trackClicks: true,
    trackForms: true,
    trackDownloads: true,
    trackExternalLinks: true,
    debounceTime: 300, // ms
    scrollThreshold: 25, // pixels
  };

  // Tracking state
  private lastScrollPosition = 0;
  private scrollDirection: 'up' | 'down' | 'none' = 'none';
  private engagementStartTime = Date.now();
  private interactionCounts: Record<string, number> = {};
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(sessionId: string, userId?: string, config?: Partial<typeof InteractionTracker.prototype.config>) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.config = { ...this.config, ...config };
    this.initializeTracking();
  }

  /**
   * Add event callback
   */
  public onEvent(callback: (event: AnalyticsEvent) => void): void {
    this.eventCallbacks.push(callback);
  }

  /**
   * Initialize interaction tracking
   */
  private initializeTracking(): void {
    this.setupClickTracking();
    this.setupScrollTracking();
    this.setupFormTracking();
    this.setupDownloadTracking();
    this.setupHoverTracking();
    this.setupResearchInteractions();
    this.setupEngagementTracking();
  }

  /**
   * Setup click tracking
   */
  private setupClickTracking(): void {
    if (!this.config.trackClicks) return;

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      this.debounce('click', () => {
        this.trackClick(target, event);
      });
    }, { passive: true });
  }

  /**
   * Track click interactions
   */
  private trackClick(target: HTMLElement, event: MouseEvent): void {
    const elementInfo = this.getElementInfo(target);
    const isExternalLink = this.isExternalLink(target);
    
    // Track external links separately
    if (isExternalLink) {
      this.trackExternalLink(target);
      return;
    }

    // Track navigation clicks
    if (this.isNavigationElement(target)) {
      this.trackNavigation(target);
      return;
    }

    // Track button/CTA clicks
    if (this.isCTAElement(target)) {
      this.trackCTA(target);
      return;
    }

    // Generic click tracking
    const clickEvent: UserInteractionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'user_interaction',
      action: 'click',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        element: elementInfo.selector,
        elementText: elementInfo.text,
        elementPosition: elementInfo.position,
        target: elementInfo.href || elementInfo.id,
        clickX: event.clientX,
        clickY: event.clientY,
      },
    };

    this.incrementInteractionCount('click');
    this.emitEvent(clickEvent);
  }

  /**
   * Setup scroll tracking
   */
  private setupScrollTracking(): void {
    if (!this.config.trackScrolling) return;

    window.addEventListener('scroll', () => {
      this.debounce('scroll', () => {
        this.trackScroll();
      });
    }, { passive: true });
  }

  /**
   * Track scroll interactions
   */
  private trackScroll(): void {
    const currentPosition = window.scrollY;
    const scrollDepth = this.getScrollDepth();
    const direction = currentPosition > this.lastScrollPosition ? 'down' : 'up';
    
    // Only track if significant scroll movement
    if (Math.abs(currentPosition - this.lastScrollPosition) < this.config.scrollThreshold) {
      return;
    }

    // Track scroll milestones
    const milestones = [25, 50, 75, 90, 100];
    for (const milestone of milestones) {
      if (scrollDepth >= milestone && !this.hasReachedScrollMilestone(milestone)) {
        this.trackScrollMilestone(milestone);
        this.setScrollMilestone(milestone);
      }
    }

    this.lastScrollPosition = currentPosition;
    this.scrollDirection = direction;
  }

  /**
   * Track scroll milestone
   */
  private trackScrollMilestone(depth: number): void {
    const scrollEvent: EngagementEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'engagement',
      action: 'scroll',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        contentType: 'page',
        contentId: window.location.pathname,
        scrollPercentage: depth,
        scrollDirection: this.scrollDirection,
      },
    };

    this.incrementInteractionCount('scroll');
    this.emitEvent(scrollEvent);
  }

  /**
   * Setup form tracking
   */
  private setupFormTracking(): void {
    if (!this.config.trackForms) return;

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form && form.tagName === 'FORM') {
        this.trackFormSubmission(form);
      }
    });

    // Track form field interactions
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      if (this.isFormElement(target)) {
        this.trackFormFieldInteraction(target, 'focus');
      }
    });

    document.addEventListener('change', (event) => {
      const target = event.target as HTMLElement;
      if (this.isFormElement(target)) {
        this.trackFormFieldInteraction(target, 'change');
      }
    });
  }

  /**
   * Track form submission
   */
  private trackFormSubmission(form: HTMLFormElement): void {
    const formInfo = this.getFormInfo(form);
    
    const conversionEvent: ConversionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'conversion',
      action: 'contact_form', // Default - could be determined from form
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        formId: formInfo.id,
        formType: formInfo.type,
        fieldCount: formInfo.fieldCount,
      },
    };

    this.incrementInteractionCount('form_submit');
    this.emitEvent(conversionEvent);
  }

  /**
   * Track form field interactions
   */
  private trackFormFieldInteraction(element: HTMLElement, action: string): void {
    const fieldInfo = this.getFieldInfo(element);
    
    const interactionEvent: UserInteractionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'user_interaction',
      action,
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        element: 'form_field',
        elementText: fieldInfo.label,
        target: fieldInfo.name,
        fieldType: fieldInfo.type,
      },
    };

    this.incrementInteractionCount(`form_${action}`);
    this.emitEvent(interactionEvent);
  }

  /**
   * Setup download tracking
   */
  private setupDownloadTracking(): void {
    if (!this.config.trackDownloads) return;

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && this.isDownloadLink(link)) {
        this.trackDownload(link);
      }
    });
  }

  /**
   * Track download interactions
   */
  private trackDownload(link: HTMLAnchorElement): void {
    const downloadInfo = this.getDownloadInfo(link);
    
    const conversionEvent: ConversionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'conversion',
      action: 'download',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        fileName: downloadInfo.fileName,
        fileType: downloadInfo.fileType,
        fileSize: downloadInfo.fileSize,
        downloadUrl: downloadInfo.url,
      },
    };

    this.incrementInteractionCount('download');
    this.emitEvent(conversionEvent);
  }

  /**
   * Setup hover tracking for important elements
   */
  private setupHoverTracking(): void {
    const importantSelectors = [
      '.research-card',
      '.publication-item',
      '.project-card',
      '.contact-button',
      '.social-link',
    ];

    importantSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.setupElementHoverTracking(element as HTMLElement, selector);
      });
    });
  }

  /**
   * Setup hover tracking for specific element
   */
  private setupElementHoverTracking(element: HTMLElement, type: string): void {
    let hoverStartTime: number;
    
    element.addEventListener('mouseenter', () => {
      hoverStartTime = Date.now();
    });

    element.addEventListener('mouseleave', () => {
      const hoverDuration = Date.now() - hoverStartTime;
      
      // Only track hovers longer than 1 second
      if (hoverDuration > 1000) {
        this.trackHover(element, type, hoverDuration);
      }
    });
  }

  /**
   * Track hover interactions
   */
  private trackHover(element: HTMLElement, type: string, duration: number): void {
    const elementInfo = this.getElementInfo(element);
    
    const interactionEvent: UserInteractionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'user_interaction',
      action: 'hover',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        element: type,
        elementText: elementInfo.text,
        target: elementInfo.id,
        hoverDuration: duration,
      },
    };

    this.incrementInteractionCount('hover');
    this.emitEvent(interactionEvent);
  }

  /**
   * Setup research-specific interactions
   */
  private setupResearchInteractions(): void {
    // Publication view tracking
    this.trackPublicationViews();
    
    // Search interactions
    this.trackSearchInteractions();
    
    // Citation copying
    this.trackCitationCopying();
    
    // PDF downloads
    this.trackPDFInteractions();
  }

  /**
   * Track publication views
   */
  private trackPublicationViews(): void {
    const publicationElements = document.querySelectorAll('[data-publication-id]');
    
    // Use Intersection Observer for view tracking
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const publicationId = element.dataset.publicationId;
          const publicationTitle = element.dataset.publicationTitle || 
                                 element.querySelector('.publication-title')?.textContent;
          
          if (publicationId) {
            this.trackPublicationView(publicationId, publicationTitle);
            observer.unobserve(element); // Only track once per session
          }
        }
      });
    }, { threshold: 0.5 });

    publicationElements.forEach(element => observer.observe(element));
  }

  /**
   * Track publication view event
   */
  private trackPublicationView(publicationId: string, title?: string): void {
    const researchEvent: ResearchEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'research',
      action: 'publication_view',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        publicationId,
        publicationTitle: title,
        viewDuration: this.getEngagementTime(),
      },
    };

    this.incrementInteractionCount('publication_view');
    this.emitEvent(researchEvent);
  }

  /**
   * Track search interactions
   */
  private trackSearchInteractions(): void {
    // Track search form submissions
    const searchForms = document.querySelectorAll('form[role="search"], .search-form');
    
    searchForms.forEach(form => {
      form.addEventListener('submit', (event) => {
        const formElement = event.target as HTMLFormElement;
        const searchInput = formElement.querySelector('input[type="search"], input[name*="search"]') as HTMLInputElement;
        
        if (searchInput) {
          this.trackSearch(searchInput.value);
        }
      });
    });

    // Track search input interactions
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i]');
    
    searchInputs.forEach(input => {
      input.addEventListener('input', this.debounce('search_input', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.value.length >= 3) { // Only track meaningful searches
          this.trackSearch(target.value, false);
        }
      }, 1000));
    });
  }

  /**
   * Track search event
   */
  private trackSearch(query: string, submitted: boolean = true): void {
    const researchEvent: ResearchEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'research',
      action: 'search',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        searchQuery: query.toLowerCase(),
        queryLength: query.length,
        submitted,
      },
    };

    this.incrementInteractionCount('search');
    this.emitEvent(researchEvent);
  }

  /**
   * Track citation copying
   */
  private trackCitationCopying(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const citationButton = target.closest('.copy-citation, [data-action="copy-citation"]');
      
      if (citationButton) {
        const publicationId = citationButton.getAttribute('data-publication-id') || 
                            citationButton.closest('[data-publication-id]')?.getAttribute('data-publication-id');
        
        if (publicationId) {
          this.trackCitationCopy(publicationId);
        }
      }
    });
  }

  /**
   * Track citation copy event
   */
  private trackCitationCopy(publicationId: string): void {
    const researchEvent: ResearchEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'research',
      action: 'citation_copy',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        publicationId,
        copyMethod: 'button',
      },
    };

    this.incrementInteractionCount('citation_copy');
    this.emitEvent(researchEvent);
  }

  /**
   * Track PDF interactions
   */
  private trackPDFInteractions(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href*=".pdf"]') as HTMLAnchorElement;
      
      if (link) {
        this.trackPDFDownload(link);
      }
    });
  }

  /**
   * Track PDF download event
   */
  private trackPDFDownload(link: HTMLAnchorElement): void {
    const publicationId = link.getAttribute('data-publication-id') ||
                         link.closest('[data-publication-id]')?.getAttribute('data-publication-id');
    
    const researchEvent: ResearchEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'research',
      action: 'publication_download',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        publicationId: publicationId || 'unknown',
        downloadUrl: link.href,
        fileType: 'pdf',
      },
    };

    this.incrementInteractionCount('pdf_download');
    this.emitEvent(researchEvent);
  }

  /**
   * Setup engagement tracking
   */
  private setupEngagementTracking(): void {
    // Track reading time for content sections
    const contentSections = document.querySelectorAll('main, article, .content-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startContentEngagement(entry.target as HTMLElement);
        } else {
          this.endContentEngagement(entry.target as HTMLElement);
        }
      });
    }, { threshold: 0.1 });

    contentSections.forEach(section => observer.observe(section));
  }

  /**
   * Start content engagement tracking
   */
  private startContentEngagement(element: HTMLElement): void {
    const contentId = element.id || element.className.split(' ')[0] || 'main_content';
    element.dataset.engagementStart = Date.now().toString();
    
    // Set timer to track deep engagement (30+ seconds)
    setTimeout(() => {
      if (element.dataset.engagementStart) {
        this.trackDeepEngagement(contentId);
      }
    }, 30000);
  }

  /**
   * End content engagement tracking
   */
  private endContentEngagement(element: HTMLElement): void {
    const startTime = element.dataset.engagementStart;
    if (!startTime) return;

    const engagementTime = Date.now() - parseInt(startTime);
    const contentId = element.id || element.className.split(' ')[0] || 'main_content';
    
    // Only track meaningful engagement (5+ seconds)
    if (engagementTime > 5000) {
      this.trackContentEngagement(contentId, engagementTime);
    }

    delete element.dataset.engagementStart;
  }

  /**
   * Track content engagement
   */
  private trackContentEngagement(contentId: string, engagementTime: number): void {
    const engagementEvent: EngagementEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'engagement',
      action: 'read',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        contentType: 'section',
        contentId,
        engagementTime,
        scrollPercentage: this.getScrollDepth(),
      },
    };

    this.incrementInteractionCount('engagement');
    this.emitEvent(engagementEvent);
  }

  /**
   * Track deep engagement
   */
  private trackDeepEngagement(contentId: string): void {
    const engagementEvent: EngagementEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'engagement',
      action: 'deep_engagement',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        contentType: 'section',
        contentId,
        engagementTime: 30000, // 30+ seconds
        interactionDepth: this.getTotalInteractionCount(),
      },
    };

    this.incrementInteractionCount('deep_engagement');
    this.emitEvent(engagementEvent);
  }

  // Utility methods
  private debounce<T extends (...args: any[]) => void>(key: string, func: T, delay?: number): T {
    const debounceTime = delay || this.config.debounceTime;
    
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key)!);
    }
    
    const timeoutId = setTimeout(func, debounceTime);
    this.debounceTimers.set(key, timeoutId);
    
    return func;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentPageInfo() {
    return {
      path: window.location.pathname,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
      language: navigator.language,
    };
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    return {
      type: /Mobi|Android/i.test(userAgent) ? 'mobile' as const : 
            /Tablet|iPad/i.test(userAgent) ? 'tablet' as const : 'desktop' as const,
      browser: userAgent.includes('Chrome') ? 'Chrome' : 
               userAgent.includes('Firefox') ? 'Firefox' : 
               userAgent.includes('Safari') ? 'Safari' : 'Other',
      os: userAgent.includes('Windows') ? 'Windows' : 
          userAgent.includes('Mac') ? 'macOS' : 'Other',
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    };
  }

  private getElementInfo(element: HTMLElement) {
    return {
      selector: this.getElementSelector(element),
      text: element.textContent?.trim().substring(0, 100) || '',
      position: this.getElementPosition(element),
      href: element.getAttribute('href'),
      id: element.id,
      className: element.className,
    };
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private getElementPosition(element: HTMLElement): string {
    const rect = element.getBoundingClientRect();
    return `${Math.round(rect.left)},${Math.round(rect.top)}`;
  }

  private isExternalLink(element: HTMLElement): boolean {
    const link = element.closest('a[href]') as HTMLAnchorElement;
    if (!link) return false;
    
    try {
      const url = new URL(link.href, window.location.href);
      return url.hostname !== window.location.hostname;
    } catch {
      return false;
    }
  }

  private trackExternalLink(element: HTMLElement): void {
    const link = element.closest('a[href]') as HTMLAnchorElement;
    if (!link) return;

    const interactionEvent: UserInteractionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'user_interaction',
      action: 'external_link',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        element: 'external_link',
        elementText: link.textContent?.trim(),
        target: link.href,
        destination: new URL(link.href).hostname,
      },
    };

    this.incrementInteractionCount('external_link');
    this.emitEvent(interactionEvent);
  }

  private isNavigationElement(element: HTMLElement): boolean {
    return element.closest('nav, .navigation, .menu') !== null ||
           element.classList.contains('nav-link') ||
           element.hasAttribute('data-nav');
  }

  private trackNavigation(element: HTMLElement): void {
    const link = element.closest('a[href]') as HTMLAnchorElement;
    const elementInfo = this.getElementInfo(element);

    const interactionEvent: UserInteractionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'user_interaction',
      action: 'navigation',
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        element: 'navigation',
        elementText: elementInfo.text,
        target: link?.href || elementInfo.href,
        navigationSection: element.closest('nav')?.className || 'main_nav',
      },
    };

    this.incrementInteractionCount('navigation');
    this.emitEvent(interactionEvent);
  }

  private isCTAElement(element: HTMLElement): boolean {
    return element.classList.contains('cta') ||
           element.classList.contains('button') ||
           element.classList.contains('btn') ||
           element.tagName === 'BUTTON' ||
           element.hasAttribute('data-cta');
  }

  private trackCTA(element: HTMLElement): void {
    const elementInfo = this.getElementInfo(element);

    const conversionEvent: ConversionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category: 'conversion',
      action: this.getCTAType(element),
      userId: this.userId,
      sessionId: this.sessionId,
      page: this.getCurrentPageInfo(),
      device: this.getDeviceInfo(),
      properties: {
        buttonText: elementInfo.text,
        buttonType: element.tagName.toLowerCase(),
        buttonPosition: elementInfo.position,
      },
    };

    this.incrementInteractionCount('cta_click');
    this.emitEvent(conversionEvent);
  }

  private getCTAType(element: HTMLElement): string {
    const text = element.textContent?.toLowerCase() || '';
    const className = element.className.toLowerCase();
    
    if (text.includes('contact') || className.includes('contact')) return 'contact_form';
    if (text.includes('download') || className.includes('download')) return 'download';
    if (text.includes('subscribe') || className.includes('subscribe')) return 'newsletter_signup';
    if (text.includes('email') || className.includes('email')) return 'email_click';
    
    return 'cta_click';
  }

  private isFormElement(element: HTMLElement): boolean {
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);
  }

  private getFormInfo(form: HTMLFormElement) {
    return {
      id: form.id || form.className.split(' ')[0] || 'form',
      type: this.getFormType(form),
      fieldCount: form.querySelectorAll('input, textarea, select').length,
    };
  }

  private getFormType(form: HTMLFormElement): string {
    const className = form.className.toLowerCase();
    const id = form.id.toLowerCase();
    
    if (className.includes('contact') || id.includes('contact')) return 'contact';
    if (className.includes('newsletter') || id.includes('newsletter')) return 'newsletter';
    if (className.includes('search') || id.includes('search')) return 'search';
    
    return 'generic';
  }

  private getFieldInfo(element: HTMLElement) {
    const input = element as HTMLInputElement;
    return {
      name: input.name || input.id,
      type: input.type || element.tagName.toLowerCase(),
      label: this.getFieldLabel(input),
    };
  }

  private getFieldLabel(input: HTMLInputElement): string {
    const label = document.querySelector(`label[for="${input.id}"]`);
    return label?.textContent?.trim() || input.placeholder || input.name;
  }

  private isDownloadLink(link: HTMLAnchorElement): boolean {
    const href = link.href.toLowerCase();
    const downloadExtensions = ['.pdf', '.doc', '.docx', '.zip', '.csv', '.xls', '.xlsx'];
    
    return downloadExtensions.some(ext => href.includes(ext)) ||
           link.hasAttribute('download') ||
           link.textContent?.toLowerCase().includes('download');
  }

  private getDownloadInfo(link: HTMLAnchorElement) {
    const href = link.href;
    const fileName = href.split('/').pop() || 'unknown';
    const fileType = fileName.split('.').pop() || 'unknown';
    
    return {
      fileName,
      fileType,
      fileSize: undefined, // Would need server-side info
      url: href,
    };
  }

  private getScrollDepth(): number {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
  }

  private hasReachedScrollMilestone(milestone: number): boolean {
    const key = `scroll_${milestone}`;
    return localStorage.getItem(key) === 'true';
  }

  private setScrollMilestone(milestone: number): void {
    const key = `scroll_${milestone}`;
    localStorage.setItem(key, 'true');
  }

  private getEngagementTime(): number {
    return Date.now() - this.engagementStartTime;
  }

  private incrementInteractionCount(type: string): void {
    this.interactionCounts[type] = (this.interactionCounts[type] || 0) + 1;
  }

  private getTotalInteractionCount(): number {
    return Object.values(this.interactionCounts).reduce((sum, count) => sum + count, 0);
  }

  private emitEvent(event: AnalyticsEvent): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Analytics event callback error:', error);
      }
    });
  }
}

export default InteractionTracker;