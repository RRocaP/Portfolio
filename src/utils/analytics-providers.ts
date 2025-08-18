// Analytics providers integration
import type { AnalyticsProvider, AnalyticsEvent, PageViewEvent, ConsentSettings } from '../types/analytics';

/**
 * Google Analytics 4 Provider
 */
export class GoogleAnalytics4Provider implements AnalyticsProvider {
  public name = 'google-analytics-4';
  public initialized = false;
  private measurementId: string;
  private config: any;

  constructor(measurementId: string, config?: any) {
    this.measurementId = measurementId;
    this.config = config || {};
  }

  async initialize(config: any): Promise<void> {
    try {
      // Load Google Analytics script
      await this.loadGtagScript();
      
      // Configure GA4
      this.configureGA4();
      
      this.initialized = true;
      console.log(`[Analytics] ${this.name} initialized`);
    } catch (error) {
      console.error(`[Analytics] Failed to initialize ${this.name}:`, error);
      throw error;
    }
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.initialized || !window.gtag) return;

    try {
      const eventData = this.convertToGA4Event(event);
      window.gtag('event', eventData.name, eventData.parameters);
    } catch (error) {
      console.error(`[Analytics] ${this.name} track error:`, error);
    }
  }

  async page(pageData: PageViewEvent): Promise<void> {
    if (!this.initialized || !window.gtag) return;

    try {
      window.gtag('config', this.measurementId, {
        page_title: pageData.page.title,
        page_location: pageData.page.url,
        page_referrer: pageData.page.referrer,
      });
    } catch (error) {
      console.error(`[Analytics] ${this.name} page error:`, error);
    }
  }

  async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    if (!this.initialized || !window.gtag) return;

    try {
      window.gtag('config', this.measurementId, {
        user_id: userId,
        custom_map: properties,
      });
    } catch (error) {
      console.error(`[Analytics] ${this.name} identify error:`, error);
    }
  }

  async group(groupId: string, properties?: Record<string, any>): Promise<void> {
    // GA4 doesn't have direct group support, using custom dimensions
    if (!this.initialized || !window.gtag) return;

    try {
      window.gtag('config', this.measurementId, {
        custom_map: {
          group_id: groupId,
          ...properties,
        },
      });
    } catch (error) {
      console.error(`[Analytics] ${this.name} group error:`, error);
    }
  }

  async alias(newId: string, previousId?: string): Promise<void> {
    // GA4 handles this automatically with user_id
    if (!this.initialized || !window.gtag) return;
    
    try {
      window.gtag('config', this.measurementId, {
        user_id: newId,
      });
    } catch (error) {
      console.error(`[Analytics] ${this.name} alias error:`, error);
    }
  }

  async reset(): Promise<void> {
    if (!this.initialized) return;
    
    try {
      // Clear user data
      window.gtag('config', this.measurementId, {
        user_id: null,
      });
    } catch (error) {
      console.error(`[Analytics] ${this.name} reset error:`, error);
    }
  }

  public setConsent(consent: ConsentSettings): void {
    if (!window.gtag) return;

    window.gtag('consent', 'update', {
      analytics_storage: consent.analytics === 'granted' ? 'granted' : 'denied',
      ad_storage: consent.marketing === 'granted' ? 'granted' : 'denied',
      personalization_storage: consent.personalization === 'granted' ? 'granted' : 'denied',
      functionality_storage: consent.functionality === 'granted' ? 'granted' : 'denied',
    });
  }

  private async loadGtagScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gtag) {
        resolve();
        return;
      }

      // Load gtag script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Analytics script'));
      document.head.appendChild(script);

      // Initialize gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
    });
  }

  private configureGA4(): void {
    window.gtag('config', this.measurementId, {
      send_page_view: false, // We'll send manually
      anonymize_ip: true,
      allow_google_signals: this.config.allowGoogleSignals || false,
      allow_ad_personalization_signals: this.config.allowAdPersonalization || false,
      ...this.config,
    });

    // Set initial consent state
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'granted',
    });
  }

  private convertToGA4Event(event: AnalyticsEvent): { name: string; parameters: any } {
    const baseParameters = {
      event_category: event.category,
      event_label: event.action,
      page_title: event.page.title,
      page_location: event.page.url,
      page_referrer: event.page.referrer,
      language: event.page.language,
      screen_resolution: event.device.screenResolution,
      user_agent: navigator.userAgent,
    };

    // Map event categories to GA4 events
    switch (event.category) {
      case 'page_view':
        return {
          name: 'page_view',
          parameters: {
            ...baseParameters,
            page_title: event.page.title,
            page_location: event.page.url,
            page_referrer: event.page.referrer,
          },
        };

      case 'user_interaction':
        return {
          name: event.action === 'click' ? 'select_item' : event.action,
          parameters: {
            ...baseParameters,
            item_name: event.properties?.element,
            content_type: event.properties?.elementText,
          },
        };

      case 'engagement':
        return {
          name: 'engagement',
          parameters: {
            ...baseParameters,
            engagement_time_msec: event.properties?.engagementTime || 0,
            content_id: event.properties?.contentId,
          },
        };

      case 'performance':
        return {
          name: 'timing_complete',
          parameters: {
            ...baseParameters,
            name: event.properties?.metric,
            value: event.properties?.value,
          },
        };

      case 'research':
        if (event.action === 'publication_view') {
          return {
            name: 'view_item',
            parameters: {
              ...baseParameters,
              item_id: event.properties?.publicationId,
              item_name: event.properties?.publicationTitle,
              item_category: 'publication',
            },
          };
        } else if (event.action === 'publication_download') {
          return {
            name: 'file_download',
            parameters: {
              ...baseParameters,
              file_name: event.properties?.publicationId,
              link_url: event.properties?.downloadUrl,
            },
          };
        }
        break;

      case 'conversion':
        if (event.action === 'contact_form') {
          return {
            name: 'generate_lead',
            parameters: {
              ...baseParameters,
              currency: 'USD',
              value: 1,
            },
          };
        } else if (event.action === 'newsletter_signup') {
          return {
            name: 'sign_up',
            parameters: {
              ...baseParameters,
              method: 'newsletter',
            },
          };
        }
        break;
    }

    // Default event
    return {
      name: 'custom_event',
      parameters: {
        ...baseParameters,
        custom_event_type: event.category,
        custom_action: event.action,
        ...event.properties,
      },
    };
  }
}

/**
 * Plausible Analytics Provider
 */
export class PlausibleProvider implements AnalyticsProvider {
  public name = 'plausible';
  public initialized = false;
  private domain: string;
  private apiHost: string;

  constructor(domain: string, apiHost = 'https://plausible.io') {
    this.domain = domain;
    this.apiHost = apiHost;
  }

  async initialize(config: any): Promise<void> {
    try {
      await this.loadPlausibleScript();
      this.initialized = true;
      console.log(`[Analytics] ${this.name} initialized`);
    } catch (error) {
      console.error(`[Analytics] Failed to initialize ${this.name}:`, error);
      throw error;
    }
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.initialized || !window.plausible) return;

    try {
      const eventData = this.convertToPlausibleEvent(event);
      window.plausible(eventData.name, eventData.options);
    } catch (error) {
      console.error(`[Analytics] ${this.name} track error:`, error);
    }
  }

  async page(pageData: PageViewEvent): Promise<void> {
    if (!this.initialized || !window.plausible) return;

    try {
      window.plausible('pageview', {
        u: pageData.page.url,
        r: pageData.page.referrer,
      });
    } catch (error) {
      console.error(`[Analytics] ${this.name} page error:`, error);
    }
  }

  async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    // Plausible doesn't support user identification
    console.warn(`[Analytics] ${this.name} does not support user identification`);
  }

  async group(groupId: string, properties?: Record<string, any>): Promise<void> {
    // Plausible doesn't support grouping
    console.warn(`[Analytics] ${this.name} does not support grouping`);
  }

  async alias(newId: string, previousId?: string): Promise<void> {
    // Plausible doesn't support aliasing
    console.warn(`[Analytics] ${this.name} does not support aliasing`);
  }

  async reset(): Promise<void> {
    // Nothing to reset in Plausible
  }

  private async loadPlausibleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.plausible) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `${this.apiHost}/js/plausible.js`;
      script.defer = true;
      script.setAttribute('data-domain', this.domain);
      script.onload = () => {
        // Wait a bit for plausible to initialize
        setTimeout(resolve, 100);
      };
      script.onerror = () => reject(new Error('Failed to load Plausible script'));
      document.head.appendChild(script);
    });
  }

  private convertToPlausibleEvent(event: AnalyticsEvent): { name: string; options: any } {
    const baseProps = {
      category: event.category,
      action: event.action,
      page: event.page.path,
      device: event.device.type,
    };

    switch (event.category) {
      case 'user_interaction':
        return {
          name: `${event.action}_${event.properties?.element}`,
          options: {
            props: {
              ...baseProps,
              element: event.properties?.element,
              text: event.properties?.elementText,
            },
          },
        };

      case 'research':
        return {
          name: event.action,
          options: {
            props: {
              ...baseProps,
              publication_id: event.properties?.publicationId,
              search_query: event.properties?.searchQuery,
            },
          },
        };

      case 'conversion':
        return {
          name: event.action,
          options: {
            props: {
              ...baseProps,
              form_id: event.properties?.formId,
            },
            revenue: {
              currency: 'USD',
              amount: event.properties?.value || 0,
            },
          },
        };

      default:
        return {
          name: `${event.category}_${event.action}`,
          options: {
            props: {
              ...baseProps,
              ...event.properties,
            },
          },
        };
    }
  }
}

/**
 * Mixpanel Provider
 */
export class MixpanelProvider implements AnalyticsProvider {
  public name = 'mixpanel';
  public initialized = false;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async initialize(config: any): Promise<void> {
    try {
      await this.loadMixpanelScript();
      window.mixpanel.init(this.token, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: false,
        persistence: 'localStorage',
        ...config,
      });
      this.initialized = true;
      console.log(`[Analytics] ${this.name} initialized`);
    } catch (error) {
      console.error(`[Analytics] Failed to initialize ${this.name}:`, error);
      throw error;
    }
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.initialized || !window.mixpanel) return;

    try {
      const eventData = this.convertToMixpanelEvent(event);
      window.mixpanel.track(eventData.name, eventData.properties);
    } catch (error) {
      console.error(`[Analytics] ${this.name} track error:`, error);
    }
  }

  async page(pageData: PageViewEvent): Promise<void> {
    if (!this.initialized || !window.mixpanel) return;

    try {
      window.mixpanel.track('Page View', {
        page_title: pageData.page.title,
        page_url: pageData.page.url,
        page_path: pageData.page.path,
        referrer: pageData.page.referrer,
        load_time: pageData.properties.loadTime,
      });
    } catch (error) {
      console.error(`[Analytics] ${this.name} page error:`, error);
    }
  }

  async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    if (!this.initialized || !window.mixpanel) return;

    try {
      window.mixpanel.identify(userId);
      if (properties) {
        window.mixpanel.people.set(properties);
      }
    } catch (error) {
      console.error(`[Analytics] ${this.name} identify error:`, error);
    }
  }

  async group(groupId: string, properties?: Record<string, any>): Promise<void> {
    if (!this.initialized || !window.mixpanel) return;

    try {
      window.mixpanel.set_group('organization', groupId);
      if (properties) {
        window.mixpanel.get_group('organization', groupId).set(properties);
      }
    } catch (error) {
      console.error(`[Analytics] ${this.name} group error:`, error);
    }
  }

  async alias(newId: string, previousId?: string): Promise<void> {
    if (!this.initialized || !window.mixpanel) return;

    try {
      window.mixpanel.alias(newId, previousId);
    } catch (error) {
      console.error(`[Analytics] ${this.name} alias error:`, error);
    }
  }

  async reset(): Promise<void> {
    if (!this.initialized || !window.mixpanel) return;

    try {
      window.mixpanel.reset();
    } catch (error) {
      console.error(`[Analytics] ${this.name} reset error:`, error);
    }
  }

  private async loadMixpanelScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.mixpanel) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Mixpanel script'));
      document.head.appendChild(script);
    });
  }

  private convertToMixpanelEvent(event: AnalyticsEvent): { name: string; properties: any } {
    const baseProperties = {
      $current_url: event.page.url,
      $referrer: event.page.referrer,
      $browser: event.device.browser,
      $os: event.device.os,
      $screen_resolution: event.device.screenResolution,
      category: event.category,
      action: event.action,
      session_id: event.sessionId,
      timestamp: event.timestamp,
      ...event.properties,
    };

    // Create meaningful event names
    switch (event.category) {
      case 'page_view':
        return {
          name: 'Page Viewed',
          properties: {
            ...baseProperties,
            page_title: event.page.title,
            page_path: event.page.path,
          },
        };

      case 'user_interaction':
        return {
          name: `${event.action.charAt(0).toUpperCase() + event.action.slice(1)} Element`,
          properties: {
            ...baseProperties,
            element_type: event.properties?.element,
            element_text: event.properties?.elementText,
          },
        };

      case 'research':
        if (event.action === 'publication_view') {
          return {
            name: 'Publication Viewed',
            properties: {
              ...baseProperties,
              publication_id: event.properties?.publicationId,
              publication_title: event.properties?.publicationTitle,
            },
          };
        } else if (event.action === 'search') {
          return {
            name: 'Search Performed',
            properties: {
              ...baseProperties,
              search_query: event.properties?.searchQuery,
              query_length: event.properties?.queryLength,
            },
          };
        }
        break;

      case 'conversion':
        return {
          name: `${event.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
          properties: {
            ...baseProperties,
            conversion_type: event.action,
            value: event.properties?.value || 1,
          },
        };
    }

    return {
      name: `${event.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${event.action}`,
      properties: baseProperties,
    };
  }
}

/**
 * Local Storage Provider (for offline/privacy-first analytics)
 */
export class LocalStorageProvider implements AnalyticsProvider {
  public name = 'local-storage';
  public initialized = false;
  private storageKey = 'analytics_events';
  private maxEvents = 1000;

  async initialize(config: any): Promise<void> {
    this.maxEvents = config?.maxEvents || 1000;
    this.initialized = true;
    console.log(`[Analytics] ${this.name} initialized`);
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.initialized) return;

    try {
      const events = this.getStoredEvents();
      events.push(event);

      // Keep only the most recent events
      if (events.length > this.maxEvents) {
        events.splice(0, events.length - this.maxEvents);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(events));
    } catch (error) {
      console.error(`[Analytics] ${this.name} track error:`, error);
    }
  }

  async page(pageData: PageViewEvent): Promise<void> {
    return this.track(pageData);
  }

  async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    localStorage.setItem('analytics_user_id', userId);
    if (properties) {
      localStorage.setItem('analytics_user_properties', JSON.stringify(properties));
    }
  }

  async group(groupId: string, properties?: Record<string, any>): Promise<void> {
    localStorage.setItem('analytics_group_id', groupId);
    if (properties) {
      localStorage.setItem('analytics_group_properties', JSON.stringify(properties));
    }
  }

  async alias(newId: string, previousId?: string): Promise<void> {
    localStorage.setItem('analytics_user_id', newId);
    if (previousId) {
      localStorage.setItem('analytics_previous_user_id', previousId);
    }
  }

  async reset(): Promise<void> {
    localStorage.removeItem('analytics_user_id');
    localStorage.removeItem('analytics_user_properties');
    localStorage.removeItem('analytics_group_id');
    localStorage.removeItem('analytics_group_properties');
    localStorage.removeItem('analytics_previous_user_id');
  }

  public getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public exportData(): any {
    return {
      events: this.getStoredEvents(),
      userId: localStorage.getItem('analytics_user_id'),
      userProperties: localStorage.getItem('analytics_user_properties'),
      groupId: localStorage.getItem('analytics_group_id'),
      groupProperties: localStorage.getItem('analytics_group_properties'),
    };
  }
}

// Type declarations for external libraries
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    plausible: (event: string, options?: any) => void;
    mixpanel: any;
  }
}

export { GoogleAnalytics4Provider, PlausibleProvider, MixpanelProvider, LocalStorageProvider };