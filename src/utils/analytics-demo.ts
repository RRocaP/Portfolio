// Analytics System Demonstration
import { AnalyticsManager } from './analytics-core';
import AnalyticsInsights from './analytics-insights';
import PrivacyManager from './analytics-privacy';
import { 
  GoogleAnalytics4Provider, 
  PlausibleProvider, 
  LocalStorageProvider 
} from './analytics-providers';

/**
 * Complete Analytics System Demo
 * Shows how to integrate and use all analytics components together
 */
export class AnalyticsDemo {
  private analytics: AnalyticsManager;
  private insights: AnalyticsInsights;
  private privacy: PrivacyManager;

  constructor() {
    // Initialize privacy manager first
    this.privacy = new PrivacyManager({
      dataRetentionDays: 90,
      anonymizationLevel: 'partial',
      defaultConsent: {
        analytics: 'pending',
        marketing: 'denied',
        personalization: 'denied',
        functionality: 'granted',
      },
    });

    // Initialize analytics manager
    this.analytics = new AnalyticsManager();
    
    // Initialize insights generator
    this.insights = new AnalyticsInsights();

    // Set up privacy consent handling
    this.setupPrivacyHandling();
  }

  /**
   * Initialize the complete analytics system
   */
  public async initialize(): Promise<void> {
    console.log('🔧 Initializing Analytics System...');

    try {
      // Add analytics providers
      await this.addProviders();

      // Initialize analytics
      await this.analytics.initialize({
        siteName: 'Portfolio Website',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        trackPageViews: true,
        trackInteractions: true,
        trackPerformance: true,
        privacyManager: this.privacy,
      });

      // Set up automatic tracking
      this.setupAutomaticTracking();

      console.log('✅ Analytics system initialized successfully');
      this.showSystemStatus();

    } catch (error) {
      console.error('❌ Failed to initialize analytics:', error);
    }
  }

  /**
   * Add analytics providers based on environment and consent
   */
  private async addProviders(): Promise<void> {
    // Always add local storage provider for offline analytics
    const localProvider = new LocalStorageProvider();
    this.analytics.addProvider(localProvider);

    // Add external providers only if consent is granted
    if (this.privacy.isAnalyticsAllowed()) {
      // Google Analytics 4 (if environment variables are set)
      const gaId = process.env.GOOGLE_ANALYTICS_ID;
      if (gaId) {
        const gaProvider = new GoogleAnalytics4Provider(gaId, {
          allowGoogleSignals: this.privacy.isPersonalizationAllowed(),
          allowAdPersonalization: this.privacy.isMarketingAllowed(),
        });
        this.analytics.addProvider(gaProvider);
      }

      // Plausible Analytics (privacy-friendly alternative)
      const plausibleDomain = process.env.PLAUSIBLE_DOMAIN;
      if (plausibleDomain) {
        const plausibleProvider = new PlausibleProvider(plausibleDomain);
        this.analytics.addProvider(plausibleProvider);
      }
    }

    console.log(`📊 Added ${this.analytics.getProviders().length} analytics providers`);
  }

  /**
   * Set up privacy consent handling
   */
  private setupPrivacyHandling(): void {
    // Listen for consent changes
    this.privacy.onConsentChange((consent) => {
      console.log('🔒 Consent updated:', consent);
      
      // Update provider consent settings
      this.analytics.getProviders().forEach(provider => {
        if ('setConsent' in provider && typeof provider.setConsent === 'function') {
          provider.setConsent(consent);
        }
      });
    });
  }

  /**
   * Set up automatic tracking for common events
   */
  private setupAutomaticTracking(): void {
    // Track page views on navigation
    this.trackPageViewsAutomatically();
    
    // Track user interactions
    this.trackInteractionsAutomatically();
    
    // Track performance metrics
    this.trackPerformanceAutomatically();
    
    // Track research-specific events
    this.trackResearchEventsAutomatically();

    console.log('🤖 Automatic tracking configured');
  }

  /**
   * Automatically track page views
   */
  private trackPageViewsAutomatically(): void {
    // Track initial page load
    this.analytics.trackPageView({
      path: window.location.pathname,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
    });

    // Track navigation changes (for SPAs)
    let lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        this.analytics.trackPageView({
          path: window.location.pathname,
          title: document.title,
          url: window.location.href,
          referrer: document.referrer,
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Automatically track user interactions
   */
  private trackInteractionsAutomatically(): void {
    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track navigation clicks
      if (target.matches('a[href]')) {
        this.analytics.track({
          category: 'user_interaction',
          action: 'click',
          properties: {
            element: 'link',
            elementText: target.textContent?.trim(),
            href: target.getAttribute('href'),
            isExternal: target.getAttribute('href')?.startsWith('http'),
          },
        });
      }

      // Track button clicks
      if (target.matches('button') || target.closest('button')) {
        const button = target.matches('button') ? target : target.closest('button')!;
        this.analytics.track({
          category: 'user_interaction',
          action: 'click',
          properties: {
            element: 'button',
            elementText: button.textContent?.trim(),
            buttonId: button.id,
            buttonClass: button.className,
          },
        });
      }

      // Track form submissions
      if (target.matches('form') || target.closest('form')) {
        this.analytics.track({
          category: 'conversion',
          action: 'form_submission',
          properties: {
            formId: target.id || target.closest('form')?.id,
          },
        });
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    document.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
        maxScrollDepth = scrollPercent;
        this.analytics.track({
          category: 'engagement',
          action: 'scroll',
          properties: {
            scrollDepth: scrollPercent,
            page: window.location.pathname,
          },
        });
      }
    });
  }

  /**
   * Automatically track performance metrics
   */
  private trackPerformanceAutomatically(): void {
    // Track Core Web Vitals when available
    if ('web-vitals' in window || typeof window.webVitals !== 'undefined') {
      // Web Vitals library integration would go here
      // For demo, we'll simulate the metrics
      setTimeout(() => {
        this.analytics.trackPerformance('LCP', 2500);
        this.analytics.trackPerformance('FID', 100);
        this.analytics.trackPerformance('CLS', 0.1);
        this.analytics.trackPerformance('FCP', 1800);
      }, 2000);
    }

    // Track page load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        this.analytics.track({
          category: 'performance',
          action: 'page_load',
          properties: {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstByte: perfData.responseStart - perfData.requestStart,
          },
        });
      }
    });
  }

  /**
   * Track research-specific events
   */
  private trackResearchEventsAutomatically(): void {
    // Track publication views
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const publicationLink = target.closest('[data-publication-id]');
      
      if (publicationLink) {
        this.analytics.track({
          category: 'research',
          action: 'publication_view',
          properties: {
            publicationId: publicationLink.getAttribute('data-publication-id'),
            publicationTitle: publicationLink.getAttribute('data-publication-title'),
            publicationType: publicationLink.getAttribute('data-publication-type'),
          },
        });
      }
    });

    // Track search queries
    document.addEventListener('submit', (event) => {
      const target = event.target as HTMLFormElement;
      if (target.matches('[data-search-form]')) {
        const searchInput = target.querySelector('input[type="search"], input[name="query"]') as HTMLInputElement;
        if (searchInput) {
          this.analytics.track({
            category: 'research',
            action: 'search',
            properties: {
              searchQuery: searchInput.value,
              queryLength: searchInput.value.length,
              searchContext: target.getAttribute('data-search-context'),
            },
          });
        }
      }
    });

    // Track publication downloads
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('[data-download-publication]') || target.closest('[data-download-publication]')) {
        const downloadLink = target.matches('[data-download-publication]') 
          ? target 
          : target.closest('[data-download-publication]')!;
        
        this.analytics.track({
          category: 'research',
          action: 'publication_download',
          properties: {
            publicationId: downloadLink.getAttribute('data-publication-id'),
            downloadFormat: downloadLink.getAttribute('data-download-format'),
            downloadUrl: downloadLink.getAttribute('href'),
          },
        });
      }
    });
  }

  /**
   * Generate and display insights
   */
  public async generateInsights(): Promise<void> {
    console.log('📈 Generating analytics insights...');

    try {
      // Get stored data
      const events = this.getStoredEvents();
      const sessions = this.getStoredSessions();

      if (events.length === 0) {
        console.log('📊 No analytics data available yet');
        return;
      }

      // Update insights with current data
      this.insights.updateData(events, sessions);

      // Generate comprehensive metrics
      const metrics = this.insights.generateMetrics();
      console.log('📊 Analytics Metrics:', {
        pageViews: metrics.pageViews,
        uniqueVisitors: metrics.uniqueVisitors,
        avgSessionDuration: `${Math.round(metrics.avgSessionDuration / 1000)}s`,
        bounceRate: `${metrics.bounceRate}%`,
        topPages: metrics.topPages.slice(0, 3),
      });

      // Generate user behavior insights
      const behaviorInsights = this.insights.generateUserBehaviorInsights();
      console.log('👤 User Behavior:', {
        returningUserRate: `${behaviorInsights.returningUserRate}%`,
        deviceBreakdown: behaviorInsights.deviceBreakdown.slice(0, 3),
      });

      // Generate performance insights
      const performanceInsights = this.insights.generatePerformanceInsights();
      console.log('⚡ Performance:', {
        lcp: `${performanceInsights.coreWebVitals.lcp.value}ms (${performanceInsights.coreWebVitals.lcp.score})`,
        cls: `${performanceInsights.coreWebVitals.cls.value} (${performanceInsights.coreWebVitals.cls.score})`,
      });

      // Generate research insights
      const researchInsights = this.insights.generateResearchInsights();
      console.log('🔬 Research Engagement:', {
        topPublications: researchInsights.publicationMetrics.slice(0, 3),
        scholarReferrals: researchInsights.academicTraffic.scholarReferrals,
      });

      // Generate actionable recommendations
      const recommendations = this.insights.generateRecommendations();
      console.log('💡 Recommendations:', recommendations.slice(0, 3).map(r => ({
        title: r.title,
        priority: r.priority,
        category: r.category,
      })));

    } catch (error) {
      console.error('❌ Failed to generate insights:', error);
    }
  }

  /**
   * Show current system status
   */
  private showSystemStatus(): void {
    console.log('\n📊 ANALYTICS SYSTEM STATUS');
    console.log('================================');
    console.log(`Initialized: ${this.analytics.isInitialized() ? '✅' : '❌'}`);
    console.log(`Providers: ${this.analytics.getProviders().length}`);
    
    this.analytics.getProviders().forEach(provider => {
      console.log(`  - ${provider.name}: ${provider.initialized ? '✅' : '❌'}`);
    });
    
    const consent = this.privacy.getConsent();
    console.log(`Privacy Consent:`);
    console.log(`  - Analytics: ${consent.analytics === 'granted' ? '✅' : '❌'}`);
    console.log(`  - Marketing: ${consent.marketing === 'granted' ? '✅' : '❌'}`);
    console.log(`  - Personalization: ${consent.personalization === 'granted' ? '✅' : '❌'}`);
    
    console.log('================================\n');
  }

  /**
   * Demo usage scenarios
   */
  public runUsageExamples(): void {
    console.log('🎯 Running analytics usage examples...');

    // Example 1: Track page view
    this.analytics.trackPageView({
      path: '/research',
      title: 'Research | Portfolio',
      url: 'https://portfolio.com/research',
      referrer: 'https://google.com',
    });

    // Example 2: Track user interaction
    this.analytics.track({
      category: 'user_interaction',
      action: 'click',
      properties: {
        element: 'navigation-link',
        elementText: 'Research',
        section: 'header',
      },
    });

    // Example 3: Track research engagement
    this.analytics.track({
      category: 'research',
      action: 'publication_view',
      properties: {
        publicationId: 'antimicrobial-2024',
        publicationTitle: 'Novel Antimicrobial Proteins',
        publicationType: 'journal-article',
      },
    });

    // Example 4: Track performance metric
    this.analytics.trackPerformance('LCP', 2300);

    // Example 5: Track conversion
    this.analytics.track({
      category: 'conversion',
      action: 'contact_form',
      properties: {
        formId: 'contact-form',
        formType: 'collaboration-inquiry',
      },
    });

    console.log('✅ Usage examples completed');
  }

  /**
   * Get stored events (from LocalStorage provider)
   */
  private getStoredEvents(): any[] {
    const localStorage = window.localStorage;
    try {
      const stored = localStorage.getItem('analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get stored sessions
   */
  private getStoredSessions(): any[] {
    const localStorage = window.localStorage;
    try {
      const stored = localStorage.getItem('analytics_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

// Export demo runner function
export async function runAnalyticsDemo(): Promise<void> {
  console.log('🚀 Starting Analytics System Demo...\n');

  const demo = new AnalyticsDemo();
  
  // Initialize system
  await demo.initialize();

  // Run usage examples
  demo.runUsageExamples();

  // Wait a bit for data to be processed
  setTimeout(async () => {
    // Generate insights
    await demo.generateInsights();
    
    console.log('\n🎉 Analytics demo completed successfully!');
    console.log('The system is now ready for production use.');
  }, 1000);
}

export default AnalyticsDemo;