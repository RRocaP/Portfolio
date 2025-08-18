// Privacy-first analytics with GA4 integration, consent management, and custom event tracking
// Designed for Astro + React applications with static hosting support

import { FEATURE_FLAGS, getExternalServiceConfig } from './featureFlags';

// Types for analytics events and configuration
export interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  consentRequired: boolean;
  debug: boolean;
}

export interface AnalyticsEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface PageViewEvent {
  page_title?: string;
  page_location?: string;
  page_referrer?: string;
  language?: string;
}

export interface CustomEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  non_interaction?: boolean;
}

// Analytics state management
interface AnalyticsState {
  isLoaded: boolean;
  hasConsent: boolean;
  isEnabled: boolean;
  eventQueue: AnalyticsEvent[];
}

let analyticsState: AnalyticsState = {
  isLoaded: false,
  hasConsent: false,
  isEnabled: false,
  eventQueue: []
};

// Configuration
const getAnalyticsConfig = (): AnalyticsConfig => {
  const serviceConfig = getExternalServiceConfig();
  return {
    measurementId: serviceConfig.analytics.id,
    enabled: FEATURE_FLAGS.enableAnalytics && serviceConfig.analytics.enabled,
    consentRequired: true, // Always require consent for privacy
    debug: import.meta.env.DEV
  };
};

// Consent management
export const setAnalyticsConsent = (granted: boolean): void => {
  analyticsState.hasConsent = granted;
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied', // Always deny ad storage for privacy
    });
  }

  if (granted && !analyticsState.isLoaded) {
    initializeAnalytics();
  }

  // Process queued events if consent granted and GA loaded
  if (granted && analyticsState.isLoaded) {
    processEventQueue();
  }
};

export const hasAnalyticsConsent = (): boolean => {
  return analyticsState.hasConsent;
};

// GA4 initialization with privacy-first approach
const initializeAnalytics = async (): Promise<void> => {
  const config = getAnalyticsConfig();
  
  if (!config.enabled || !config.measurementId || typeof window === 'undefined') {
    return;
  }

  try {
    // Load GA4 script with defer and async for performance
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    script.async = true;
    script.defer = true;
    
    // Wait for script to load
    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GA4 script'));
      document.head.appendChild(script);
    });

    // Initialize gtag with privacy settings
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Set up consent mode before GA initialization
    window.gtag('consent', 'default', {
      analytics_storage: analyticsState.hasConsent ? 'granted' : 'denied',
      ad_storage: 'denied',
      wait_for_update: 500
    });

    // Initialize GA4 with privacy-focused config
    window.gtag('config', config.measurementId, {
      // Privacy settings
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      
      // Performance settings
      send_page_view: false, // We'll send manually for better control
      
      // Debug mode in development
      debug_mode: config.debug,
      
      // Custom settings for portfolio
      custom_map: {
        custom_language: 'language',
        custom_section: 'section'
      }
    });

    analyticsState.isLoaded = true;
    analyticsState.isEnabled = true;

    if (config.debug) {
      console.log('[Analytics] GA4 initialized with measurement ID:', config.measurementId);
    }

    // Process any queued events
    processEventQueue();

  } catch (error) {
    console.error('[Analytics] Failed to initialize:', error);
    analyticsState.isEnabled = false;
  }
};

// Event queue processing
const processEventQueue = (): void => {
  if (!analyticsState.isLoaded || !analyticsState.hasConsent) {
    return;
  }

  while (analyticsState.eventQueue.length > 0) {
    const event = analyticsState.eventQueue.shift();
    if (event && window.gtag) {
      window.gtag('event', event.event_name, {
        event_category: event.event_category,
        event_label: event.event_label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }
};

// Core tracking functions
export const trackPageView = (data: PageViewEvent = {}): void => {
  const event: AnalyticsEvent = {
    event_name: 'page_view',
    custom_parameters: {
      page_title: data.page_title || document?.title,
      page_location: data.page_location || window?.location?.href,
      page_referrer: data.page_referrer || document?.referrer,
      language: data.language || document?.documentElement?.lang,
      timestamp: new Date().toISOString()
    }
  };

  queueOrSendEvent(event);
};

export const trackEvent = (eventData: CustomEvent): void => {
  const event: AnalyticsEvent = {
    event_name: eventData.action,
    event_category: eventData.category,
    event_label: eventData.label,
    value: eventData.value,
    custom_parameters: {
      non_interaction: eventData.non_interaction || false,
      timestamp: new Date().toISOString()
    }
  };

  queueOrSendEvent(event);
};

// Specialized tracking functions for portfolio
export const trackScrollDepth = (percentage: number): void => {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${percentage}%`,
    value: percentage
  });
};

export const trackDownload = (filename: string, category: string = 'download'): void => {
  trackEvent({
    action: 'download',
    category,
    label: filename
  });
};

export const trackFormInteraction = (formName: string, action: string): void => {
  trackEvent({
    action: `form_${action}`,
    category: 'form',
    label: formName,
    non_interaction: action === 'view'
  });
};

export const trackNavigation = (section: string, method: string = 'click'): void => {
  trackEvent({
    action: 'navigation',
    category: 'ui',
    label: section,
    value: method === 'scroll' ? 1 : 0
  });
};

export const trackSearch = (query: string, results: number): void => {
  trackEvent({
    action: 'search',
    category: 'search',
    label: query.toLowerCase().slice(0, 100), // Limit query length for privacy
    value: results
  });
};

export const trackLanguageChange = (fromLang: string, toLang: string): void => {
  trackEvent({
    action: 'language_change',
    category: 'i18n',
    label: `${fromLang}_to_${toLang}`
  });
};

export const trackThemeToggle = (theme: string): void => {
  trackEvent({
    action: 'theme_toggle',
    category: 'ui',
    label: theme
  });
};

// Performance tracking
export const trackPerformance = (metric: string, value: number, unit: string = 'ms'): void => {
  trackEvent({
    action: 'performance_metric',
    category: 'performance',
    label: `${metric}_${unit}`,
    value: Math.round(value)
  });
};

// Error tracking (privacy-safe)
export const trackError = (error: string, context: string = 'general'): void => {
  // Only track error types, not sensitive content
  const sanitizedError = error.split(':')[0] || 'unknown_error';
  
  trackEvent({
    action: 'error',
    category: 'error',
    label: `${context}:${sanitizedError}`,
    non_interaction: true
  });
};

// Event queueing system
const queueOrSendEvent = (event: AnalyticsEvent): void => {
  if (!FEATURE_FLAGS.enableAnalytics) {
    return;
  }

  if (analyticsState.isLoaded && analyticsState.hasConsent && window.gtag) {
    // Send immediately
    window.gtag('event', event.event_name, {
      event_category: event.event_category,
      event_label: event.event_label,
      value: event.value,
      ...event.custom_parameters
    });
    
    if (getAnalyticsConfig().debug) {
      console.log('[Analytics] Event sent:', event);
    }
  } else {
    // Queue for later
    analyticsState.eventQueue.push(event);
    
    if (getAnalyticsConfig().debug) {
      console.log('[Analytics] Event queued:', event);
    }
  }
};

// Initialization and setup
export const initAnalytics = (options: Partial<AnalyticsConfig> = {}): Promise<void> => {
  const config = { ...getAnalyticsConfig(), ...options };
  
  if (!config.enabled || typeof window === 'undefined') {
    return Promise.resolve();
  }

  // Don't initialize until consent is given
  if (config.consentRequired && !analyticsState.hasConsent) {
    return Promise.resolve();
  }

  return initializeAnalytics();
};

// Cleanup for SPA navigation
export const resetAnalytics = (): void => {
  analyticsState.eventQueue = [];
};

// Utility functions
export const getAnalyticsState = () => ({
  isLoaded: analyticsState.isLoaded,
  hasConsent: analyticsState.hasConsent,
  isEnabled: analyticsState.isEnabled,
  queueLength: analyticsState.eventQueue.length
});

// Auto-initialize on import if in browser and consent already given
if (typeof window !== 'undefined' && FEATURE_FLAGS.enableAnalytics) {
  // Check for stored consent preference
  const storedConsent = localStorage.getItem('analytics_consent');
  if (storedConsent === 'granted') {
    setAnalyticsConsent(true);
  }
}

// Declare global gtag interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Export types for use in components
export type { AnalyticsConfig, AnalyticsEvent, PageViewEvent, CustomEvent };