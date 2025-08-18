// Session tracking and page view analytics
import type { UserSession, AnalyticsEvent, PageViewEvent } from '../types/analytics';

/**
 * Session Manager for analytics tracking
 * Handles session lifecycle, page views, and user engagement
 */
export class SessionManager {
  private currentSession: UserSession | null = null;
  private sessionTimeout: number;
  private timeoutId: NodeJS.Timeout | null = null;
  private startTime: number = Date.now();
  private lastActivityTime: number = Date.now();
  private pageViewStartTime: number = Date.now();
  private scrollCheckInterval: NodeJS.Timeout | null = null;
  private engagementCheckInterval: NodeJS.Timeout | null = null;

  // Session configuration
  private config = {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxSessionDuration: 4 * 60 * 60 * 1000, // 4 hours
    heartbeatInterval: 30 * 1000, // 30 seconds
    scrollCheckInterval: 5 * 1000, // 5 seconds
    engagementThreshold: 15 * 1000, // 15 seconds for engagement
  };

  // Tracking state
  private maxScrollDepth = 0;
  private totalScrollTime = 0;
  private isEngaged = false;
  private interactionCount = 0;
  private pageStartTime = Date.now();

  constructor(sessionTimeout?: number) {
    this.sessionTimeout = sessionTimeout || this.config.sessionTimeout;
    this.initializeSessionTracking();
  }

  /**
   * Initialize session tracking
   */
  private initializeSessionTracking(): void {
    // Start initial session
    this.startNewSession();

    // Set up activity tracking
    this.setupActivityTracking();

    // Set up page visibility tracking
    this.setupVisibilityTracking();

    // Set up beforeunload tracking
    this.setupUnloadTracking();

    // Start engagement monitoring
    this.startEngagementMonitoring();
  }

  /**
   * Start a new session
   */
  private startNewSession(): void {
    const sessionId = this.generateSessionId();
    const now = Date.now();

    this.currentSession = {
      id: sessionId,
      userId: this.getUserId(),
      startTime: now,
      pageViews: 0,
      events: 0,
      bounced: true,
      entryPage: window.location.pathname,
      referrer: document.referrer,
      device: this.getDeviceInfo(),
      totalScrollDepth: 0,
      avgTimePerPage: 0,
      interactions: 0,
      customDimensions: this.getCustomDimensions(),
    };

    // Extract UTM parameters
    this.extractUTMParameters();

    // Set session timeout
    this.resetSessionTimeout();

    this.logSession('Session started', this.currentSession);
  }

  /**
   * Get current session
   */
  public getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  /**
   * Track page view
   */
  public trackPageView(path?: string, title?: string): PageViewEvent | null {
    if (!this.currentSession) return null;

    const currentPath = path || window.location.pathname;
    const currentTitle = title || document.title;
    const now = Date.now();

    // Calculate time on previous page
    const timeOnPreviousPage = now - this.pageStartTime;

    // Update session
    this.currentSession.pageViews++;
    this.currentSession.events++;
    
    // Update bounce status
    if (this.currentSession.pageViews > 1) {
      this.currentSession.bounced = false;
    }

    // Calculate average time per page
    if (this.currentSession.pageViews > 0) {
      const totalSessionTime = now - this.currentSession.startTime;
      this.currentSession.avgTimePerPage = totalSessionTime / this.currentSession.pageViews;
    }

    // Reset page-specific tracking
    this.pageStartTime = now;
    this.maxScrollDepth = 0;
    this.resetActivityTime();

    // Create page view event
    const pageViewEvent: PageViewEvent = {
      id: this.generateEventId(),
      timestamp: now,
      category: 'page_view',
      action: 'view',
      userId: this.currentSession.userId,
      sessionId: this.currentSession.id,
      page: {
        path: currentPath,
        title: currentTitle,
        url: window.location.href,
        referrer: document.referrer,
        language: navigator.language,
      },
      device: this.getDeviceInfo(),
      properties: {
        loadTime: this.getPageLoadTime(),
        scrollDepth: 0,
        timeOnPage: 0,
        timeOnPreviousPage,
      },
    };

    this.logSession('Page view tracked', pageViewEvent);
    return pageViewEvent;
  }

  /**
   * Update engagement metrics
   */
  public updateEngagement(type: 'scroll' | 'interaction' | 'time', value?: number): void {
    if (!this.currentSession) return;

    switch (type) {
      case 'scroll':
        const scrollDepth = value || this.getCurrentScrollDepth();
        if (scrollDepth > this.maxScrollDepth) {
          this.maxScrollDepth = scrollDepth;
          this.currentSession.totalScrollDepth = Math.max(
            this.currentSession.totalScrollDepth, 
            scrollDepth
          );
        }
        break;

      case 'interaction':
        this.interactionCount++;
        this.currentSession.interactions++;
        this.currentSession.bounced = false;
        this.resetActivityTime();
        break;

      case 'time':
        // Check for engagement threshold
        const timeOnPage = Date.now() - this.pageStartTime;
        if (timeOnPage > this.config.engagementThreshold && !this.isEngaged) {
          this.isEngaged = true;
          this.currentSession.bounced = false;
        }
        break;
    }

    this.resetSessionTimeout();
  }

  /**
   * End current session
   */
  public endSession(): UserSession | null {
    if (!this.currentSession) return null;

    const now = Date.now();
    this.currentSession.endTime = now;
    this.currentSession.duration = now - this.currentSession.startTime;
    this.currentSession.exitPage = window.location.pathname;

    // Calculate final metrics
    if (this.currentSession.pageViews > 0) {
      this.currentSession.avgTimePerPage = this.currentSession.duration / this.currentSession.pageViews;
    }

    // Clear timeouts
    this.clearSessionTimeout();
    this.clearEngagementMonitoring();

    const endedSession = { ...this.currentSession };
    this.currentSession = null;

    this.logSession('Session ended', endedSession);
    return endedSession;
  }

  /**
   * Extend current session
   */
  public extendSession(): void {
    this.resetActivityTime();
    this.resetSessionTimeout();
  }

  /**
   * Get session duration
   */
  public getSessionDuration(): number {
    return this.currentSession 
      ? Date.now() - this.currentSession.startTime 
      : 0;
  }

  /**
   * Get page duration
   */
  public getPageDuration(): number {
    return Date.now() - this.pageStartTime;
  }

  /**
   * Check if session is active
   */
  public isSessionActive(): boolean {
    if (!this.currentSession) return false;
    
    const now = Date.now();
    const timeSinceActivity = now - this.lastActivityTime;
    const sessionAge = now - this.currentSession.startTime;
    
    return timeSinceActivity < this.sessionTimeout && 
           sessionAge < this.config.maxSessionDuration;
  }

  /**
   * Setup activity tracking
   */
  private setupActivityTracking(): void {
    const activityEvents = ['click', 'scroll', 'keypress', 'mousemove', 'touchstart'];
    
    const handleActivity = () => {
      this.resetActivityTime();
      this.updateEngagement('interaction');
    };

    // Throttle activity tracking to avoid excessive calls
    let lastActivityUpdate = 0;
    const throttledHandleActivity = () => {
      const now = Date.now();
      if (now - lastActivityUpdate > 1000) { // 1 second throttle
        handleActivity();
        lastActivityUpdate = now;
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, throttledHandleActivity, { passive: true });
    });

    // Specific scroll tracking
    document.addEventListener('scroll', () => {
      this.updateEngagement('scroll');
    }, { passive: true });
  }

  /**
   * Setup visibility tracking
   */
  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.resetActivityTime();
        this.resetSessionTimeout();
      } else {
        // Page is hidden - this could indicate end of session
        this.updateEngagement('time');
      }
    });
  }

  /**
   * Setup unload tracking
   */
  private setupUnloadTracking(): void {
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Handle page hide for mobile browsers
    document.addEventListener('pagehide', () => {
      this.endSession();
    });
  }

  /**
   * Start engagement monitoring
   */
  private startEngagementMonitoring(): void {
    // Check scroll depth periodically
    this.scrollCheckInterval = setInterval(() => {
      this.updateEngagement('scroll');
    }, this.config.scrollCheckInterval);

    // Check engagement time
    this.engagementCheckInterval = setInterval(() => {
      this.updateEngagement('time');
    }, this.config.heartbeatInterval);
  }

  /**
   * Clear engagement monitoring
   */
  private clearEngagementMonitoring(): void {
    if (this.scrollCheckInterval) {
      clearInterval(this.scrollCheckInterval);
      this.scrollCheckInterval = null;
    }
    if (this.engagementCheckInterval) {
      clearInterval(this.engagementCheckInterval);
      this.engagementCheckInterval = null;
    }
  }

  /**
   * Reset session timeout
   */
  private resetSessionTimeout(): void {
    this.clearSessionTimeout();
    
    this.timeoutId = setTimeout(() => {
      this.endSession();
    }, this.sessionTimeout);
  }

  /**
   * Clear session timeout
   */
  private clearSessionTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Reset activity time
   */
  private resetActivityTime(): void {
    this.lastActivityTime = Date.now();
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user ID (anonymous)
   */
  private getUserId(): string | undefined {
    // Check for existing user ID in localStorage
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): UserSession['device'] {
    return {
      type: this.getDeviceType(),
      browser: this.getBrowserName(),
      os: this.getOSName(),
      screenResolution: `${screen.width}x${screen.height}`,
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

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOSName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('iOS')) return 'iOS';
    if (userAgent.includes('Android')) return 'Android';
    return 'Other';
  }

  /**
   * Extract UTM parameters from URL
   */
  private extractUTMParameters(): void {
    if (!this.currentSession) return;

    const urlParams = new URLSearchParams(window.location.search);
    this.currentSession.utmSource = urlParams.get('utm_source') || undefined;
    this.currentSession.utmMedium = urlParams.get('utm_medium') || undefined;
    this.currentSession.utmCampaign = urlParams.get('utm_campaign') || undefined;
  }

  /**
   * Get custom dimensions
   */
  private getCustomDimensions(): Record<string, string> {
    return {
      portfolio_section: this.getPortfolioSection(),
      user_type: this.getUserType(),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private getPortfolioSection(): string {
    const path = window.location.pathname;
    if (path.includes('/research')) return 'research';
    if (path.includes('/publications')) return 'publications';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/about')) return 'about';
    if (path.includes('/contact')) return 'contact';
    return 'home';
  }

  private getUserType(): string {
    // Heuristic to determine user type based on behavior
    const referrer = document.referrer;
    if (referrer.includes('google.com') || referrer.includes('scholar.google.com')) {
      return 'researcher';
    }
    if (referrer.includes('linkedin.com')) {
      return 'professional';
    }
    if (referrer.includes('github.com')) {
      return 'developer';
    }
    return 'visitor';
  }

  /**
   * Get current scroll depth percentage
   */
  private getCurrentScrollDepth(): number {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
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
   * Log session events (debug mode)
   */
  private logSession(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SessionManager] ${message}`, data);
    }
  }
}

/**
 * Page View Tracker
 * Specialized class for tracking page views and navigation
 */
export class PageViewTracker {
  private sessionManager: SessionManager;
  private currentPath: string;
  private navigationStartTime: number = Date.now();

  constructor(sessionManager: SessionManager) {
    this.sessionManager = sessionManager;
    this.currentPath = window.location.pathname;
    this.setupNavigationTracking();
  }

  /**
   * Track initial page view
   */
  public trackInitialPageView(): PageViewEvent | null {
    return this.sessionManager.trackPageView();
  }

  /**
   * Track route change (for SPAs)
   */
  public trackRouteChange(newPath: string, newTitle?: string): PageViewEvent | null {
    if (newPath !== this.currentPath) {
      const event = this.sessionManager.trackPageView(newPath, newTitle);
      this.currentPath = newPath;
      this.navigationStartTime = Date.now();
      return event;
    }
    return null;
  }

  /**
   * Setup navigation tracking for traditional page loads
   */
  private setupNavigationTracking(): void {
    // Track initial page view on load
    window.addEventListener('load', () => {
      this.trackInitialPageView();
    });

    // Track popstate events (browser back/forward)
    window.addEventListener('popstate', () => {
      const newPath = window.location.pathname;
      this.trackRouteChange(newPath);
    });

    // For hash-based routing
    window.addEventListener('hashchange', () => {
      const newPath = window.location.pathname + window.location.hash;
      this.trackRouteChange(newPath);
    });
  }

  /**
   * Get navigation timing
   */
  public getNavigationTiming(): number {
    return Date.now() - this.navigationStartTime;
  }
}

export default SessionManager;