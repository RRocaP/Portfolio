// Core analytics system implementation
import type {
  AnalyticsEvent,
  AnalyticsConfig,
  AnalyticsProvider,
  AnalyticsStorage,
  AnalyticsHooks,
  UserSession,
  ConsentSettings,
  ConsentStatus,
  EventCategory,
  BaseEvent,
  PageViewEvent,
  UserInteractionEvent,
  PerformanceEvent,
  ErrorEvent,
  AnalyticsError,
} from '../types/analytics';

/**
 * Core Analytics Manager
 * Handles event tracking, session management, and provider integration
 */
export class AnalyticsManager {
  private config: AnalyticsConfig;
  private providers: Map<string, AnalyticsProvider> = new Map();
  private storage: AnalyticsStorage | null = null;
  private hooks: AnalyticsHooks = {};
  private currentSession: UserSession | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private isInitialized = false;
  private consentSettings: ConsentSettings = {
    analytics: 'pending',
    marketing: 'denied',
    personalization: 'denied',
    functionality: 'granted',
  };

  constructor(config: AnalyticsConfig) {
    this.config = { ...this.getDefaultConfig(), ...config };
    this.initializeCore();
  }

  private getDefaultConfig(): AnalyticsConfig {
    return {
      enabled: true,
      debug: false,
      anonymizeIP: true,
      respectDNT: true,
      trackPageViews: true,
      trackUserInteractions: true,
      trackPerformance: true,
      trackErrors: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxSessionDuration: 4 * 60 * 60 * 1000, // 4 hours
      cookieConsent: true,
      dataRetentionDays: 90,
      services: {},
    };
  }

  /**
   * Initialize the analytics system
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check Do Not Track
      if (this.config.respectDNT && this.isDNTEnabled()) {
        this.config.enabled = false;
        this.log('Analytics disabled due to Do Not Track');
        return;
      }

      // Initialize providers
      await this.initializeProviders();

      // Start session tracking
      if (this.config.trackPageViews) {
        this.startSession();
      }

      // Set up error tracking
      if (this.config.trackErrors) {
        this.initializeErrorTracking();
      }

      // Set up performance tracking
      if (this.config.trackPerformance) {
        this.initializePerformanceTracking();
      }

      // Process queued events
      await this.processEventQueue();

      this.isInitialized = true;
      this.log('Analytics system initialized');

    } catch (error) {
      this.handleError(new AnalyticsError(
        'Failed to initialize analytics',
        'INIT_ERROR',
        error
      ));
    }
  }

  private initializeCore(): void {
    // Set up visibility change tracking
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Set up beforeunload tracking
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    // Set up performance observer
    if ('PerformanceObserver' in window) {
      this.initializePerformanceObserver();
    }
  }

  /**
   * Track an analytics event
   */
  public async track(
    category: EventCategory,
    action: string,
    properties?: Record<string, any>
  ): Promise<void> {
    if (!this.shouldTrack()) return;

    try {
      const event = this.createEvent(category, action, properties);
      
      // Run pre-track hook
      if (this.hooks.beforeTrack) {
        await this.hooks.beforeTrack(event);
      }

      // Store event locally
      if (this.storage) {
        await this.storage.storeEvent(event);
      }

      // Send to providers
      for (const provider of this.providers.values()) {
        if (provider.initialized) {
          await provider.track(event);
        }
      }

      // Update session
      this.updateSession(event);

      // Run post-track hook
      if (this.hooks.afterTrack) {
        await this.hooks.afterTrack(event);
      }

      this.log('Event tracked:', event);

    } catch (error) {
      this.handleError(new AnalyticsError(
        'Failed to track event',
        'TRACK_ERROR',
        { category, action, properties, error }
      ));
    }
  }

  /**
   * Track page view
   */
  public async trackPageView(
    path?: string,
    title?: string,
    properties?: Record<string, any>
  ): Promise<void> {
    const currentPath = path || window.location.pathname;
    const currentTitle = title || document.title;

    const pageViewProperties = {
      ...properties,
      loadTime: this.getPageLoadTime(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    };

    await this.track('page_view', 'view', {
      ...pageViewProperties,
      page: currentPath,
      title: currentTitle,
    });
  }

  /**
   * Track user interaction
   */
  public async trackInteraction(
    element: string,
    action: string,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.track('user_interaction', action, {
      element,
      ...properties,
      timestamp: Date.now(),
    });
  }

  /**
   * Track performance metrics
   */
  public async trackPerformance(
    metric: string,
    value: number,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.track('performance', 'timing', {
      metric,
      value,
      unit: 'ms',
      ...properties,
    });
  }

  /**
   * Track error
   */
  public async trackError(
    message: string,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.track('error', 'javascript', {
      message,
      severity: 'medium',
      ...properties,
    });
  }

  /**
   * Set user consent
   */
  public setConsent(consentSettings: Partial<ConsentSettings>): void {
    this.consentSettings = { ...this.consentSettings, ...consentSettings };
    
    // Update providers with consent
    for (const provider of this.providers.values()) {
      if ('setConsent' in provider && typeof provider.setConsent === 'function') {
        (provider as any).setConsent(this.consentSettings);
      }
    }

    // If analytics consent is granted and we're not initialized, initialize now
    if (this.consentSettings.analytics === 'granted' && !this.isInitialized) {
      this.initialize();
    }

    this.log('Consent updated:', this.consentSettings);
  }

  /**
   * Get current consent status
   */
  public getConsent(): ConsentSettings {
    return { ...this.consentSettings };
  }

  /**
   * Add analytics provider
   */
  public async addProvider(name: string, provider: AnalyticsProvider): Promise<void> {
    try {
      this.providers.set(name, provider);
      
      if (this.shouldTrack()) {
        await provider.initialize(this.config.services[name as keyof typeof this.config.services]);
        this.log(`Provider ${name} initialized`);
      }
    } catch (error) {
      this.handleError(new AnalyticsError(
        `Failed to add provider ${name}`,
        'PROVIDER_ERROR',
        error
      ));
    }
  }

  /**
   * Set analytics storage
   */
  public setStorage(storage: AnalyticsStorage): void {
    this.storage = storage;
  }

  /**
   * Set analytics hooks
   */
  public setHooks(hooks: Partial<AnalyticsHooks>): void {
    this.hooks = { ...this.hooks, ...hooks };
  }

  /**
   * Get current session
   */
  public getSession(): UserSession | null {
    return this.currentSession;
  }

  /**
   * Create a new event
   */
  private createEvent(
    category: EventCategory,
    action: string,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    const baseEvent: BaseEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      category,
      action,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      page: {
        path: window.location.pathname,
        title: document.title,
        url: window.location.href,
        referrer: document.referrer,
        language: navigator.language,
      },
      device: this.getDeviceInfo(),
      properties: properties || {},
    };

    return baseEvent as AnalyticsEvent;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create user ID
   */
  private getUserId(): string | undefined {
    if (this.consentSettings.analytics !== 'granted') {
      return undefined;
    }

    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    if (!this.currentSession) {
      this.startSession();
    }
    return this.currentSession?.id || 'no_session';
  }

  /**
   * Start new session
   */
  private startSession(): void {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      id: sessionId,
      userId: this.getUserId(),
      startTime: Date.now(),
      pageViews: 0,
      events: 0,
      bounced: true,
      entryPage: window.location.pathname,
      referrer: document.referrer,
      device: this.getDeviceInfo(),
      totalScrollDepth: 0,
      avgTimePerPage: 0,
      interactions: 0,
    };

    // Set session timeout
    setTimeout(() => {
      this.endSession();
    }, this.config.sessionTimeout);

    this.log('Session started:', this.currentSession);
  }

  /**
   * Update session with event data
   */
  private updateSession(event: AnalyticsEvent): void {
    if (!this.currentSession) return;

    this.currentSession.events++;
    
    if (event.category === 'page_view') {
      this.currentSession.pageViews++;
      this.currentSession.bounced = this.currentSession.pageViews <= 1;
    }
    
    if (event.category === 'user_interaction') {
      this.currentSession.interactions++;
      this.currentSession.bounced = false;
    }

    // Update scroll depth
    const scrollDepth = this.getScrollDepth();
    if (scrollDepth > this.currentSession.totalScrollDepth) {
      this.currentSession.totalScrollDepth = scrollDepth;
    }
  }

  /**
   * End current session
   */
  private async endSession(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
    this.currentSession.exitPage = window.location.pathname;
    
    if (this.currentSession.pageViews > 0) {
      this.currentSession.avgTimePerPage = this.currentSession.duration / this.currentSession.pageViews;
    }

    // Store session
    if (this.storage) {
      await this.storage.storeSession(this.currentSession);
    }

    // Notify hooks
    if (this.hooks.onSession) {
      this.hooks.onSession(this.currentSession);
    }

    this.log('Session ended:', this.currentSession);
    this.currentSession = null;
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): BaseEvent['device'] {
    const userAgent = navigator.userAgent;
    
    return {
      type: this.getDeviceType(),
      browser: this.getBrowserName(userAgent),
      os: this.getOSName(userAgent),
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      connection: this.getConnectionInfo(),
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      return 'mobile';
    } else if (/Tablet|iPad/i.test(navigator.userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOSName(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('iOS')) return 'iOS';
    if (userAgent.includes('Android')) return 'Android';
    return 'Other';
  }

  private getConnectionInfo(): string | undefined {
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? `${connection.effectiveType}-${connection.downlink}mbps` : undefined;
  }

  /**
   * Get page load time
   */
  private getPageLoadTime(): number | undefined {
    if ('performance' in window && 'navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation ? navigation.loadEventEnd - navigation.fetchStart : undefined;
    }
    return undefined;
  }

  /**
   * Get scroll depth percentage
   */
  private getScrollDepth(): number {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
  }

  /**
   * Initialize providers
   */
  private async initializeProviders(): Promise<void> {
    const providerPromises = Array.from(this.providers.entries()).map(async ([name, provider]) => {
      try {
        const config = this.config.services[name as keyof typeof this.config.services];
        if (config) {
          await provider.initialize(config);
          this.log(`Provider ${name} initialized`);
        }
      } catch (error) {
        this.handleError(new AnalyticsError(
          `Failed to initialize provider ${name}`,
          'PROVIDER_INIT_ERROR',
          error
        ));
      }
    });

    await Promise.allSettled(providerPromises);
  }

  /**
   * Initialize error tracking
   */
  private initializeErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackError(event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        severity: 'high',
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('Unhandled Promise Rejection', {
        reason: event.reason?.toString(),
        severity: 'medium',
      });
    });
  }

  /**
   * Initialize performance tracking
   */
  private initializePerformanceTracking(): void {
    // Core Web Vitals
    this.trackWebVitals();
    
    // Navigation timing
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.trackNavigationTiming();
        }, 0);
      });
    }
  }

  /**
   * Initialize performance observer
   */
  private initializePerformanceObserver(): void {
    try {
      // LCP observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.trackPerformance('LCP', lastEntry.startTime, {
          element: lastEntry.element?.tagName || 'unknown',
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // FID observer
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformance('FID', entry.processingStart - entry.startTime, {
            eventType: (entry as any).name,
          });
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

    } catch (error) {
      this.log('Performance observer not supported:', error);
    }
  }

  /**
   * Track Web Vitals
   */
  private trackWebVitals(): void {
    // CLS tracking
    let clsValue = 0;
    let clsEntries: any[] = [];

    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = clsEntries[0];
          const lastSessionEntry = clsEntries[clsEntries.length - 1];

          if (!firstSessionEntry || 
              entry.startTime - lastSessionEntry.startTime < 1000 ||
              entry.startTime - firstSessionEntry.startTime < 5000) {
            clsEntries.push(entry);
            clsValue += (entry as any).value;
          } else {
            clsEntries = [entry];
            clsValue = (entry as any).value;
          }
        }
      }
    });

    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      this.log('CLS observer not supported:', error);
    }

    // Send CLS on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && clsValue > 0) {
        this.trackPerformance('CLS', clsValue, { unit: 'score' });
      }
    });
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (!('performance' in window) || !('navigation' in performance)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const timings = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      connect: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      load: navigation.loadEventEnd - navigation.loadEventStart,
    };

    // Track individual timing metrics
    Object.entries(timings).forEach(([metric, value]) => {
      if (value > 0) {
        this.trackPerformance(`navigation_${metric}`, value);
      }
    });

    // Track FCP if available
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      this.trackPerformance('FCP', fcpEntry.startTime);
    }
  }

  /**
   * Handle visibility change
   */
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      this.track('engagement', 'page_hidden', {
        timeOnPage: Date.now() - (this.currentSession?.startTime || Date.now()),
        scrollDepth: this.getScrollDepth(),
      });
    } else {
      this.track('engagement', 'page_visible');
    }
  }

  /**
   * Handle before unload
   */
  private handleBeforeUnload(): void {
    if (this.currentSession) {
      this.endSession();
    }
  }

  /**
   * Process queued events
   */
  private async processEventQueue(): Promise<void> {
    const events = [...this.eventQueue];
    this.eventQueue = [];

    for (const event of events) {
      try {
        for (const provider of this.providers.values()) {
          if (provider.initialized) {
            await provider.track(event);
          }
        }
      } catch (error) {
        this.handleError(new AnalyticsError(
          'Failed to process queued event',
          'QUEUE_ERROR',
          { event, error }
        ));
      }
    }
  }

  /**
   * Check if tracking should occur
   */
  private shouldTrack(): boolean {
    return this.config.enabled && 
           this.consentSettings.analytics === 'granted' && 
           (!this.config.respectDNT || !this.isDNTEnabled());
  }

  /**
   * Check if Do Not Track is enabled
   */
  private isDNTEnabled(): boolean {
    return navigator.doNotTrack === '1' || 
           (window as any).doNotTrack === '1' || 
           (navigator as any).msDoNotTrack === '1';
  }

  /**
   * Handle errors
   */
  private handleError(error: AnalyticsError): void {
    if (this.config.debug) {
      console.error('Analytics Error:', error);
    }

    if (this.hooks.onError) {
      this.hooks.onError(error);
    }
  }

  /**
   * Log debug messages
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Analytics]', ...args);
    }
  }
}

export default AnalyticsManager;