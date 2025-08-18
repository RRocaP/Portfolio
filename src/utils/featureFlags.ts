// Feature flags and API endpoint configuration for development vs production environments

export interface ApiEndpoints {
  contact: string;
  search: string;
  analytics: string;
  newsletter: string;
}

export interface FeatureFlags {
  enableLocalApis: boolean;
  enableDynamicSearch: boolean;
  enableFormSubmission: boolean;
  enableAnalytics: boolean;
  enableServiceWorker: boolean;
  enableThreeBackground: boolean;
}

// Environment detection
const isDev = import.meta.env.DEV;
const isStaticBuild = import.meta.env.OUTPUT === 'static';

// Feature flag configuration
export const FEATURE_FLAGS: FeatureFlags = {
  // Enable local API routes only in development
  enableLocalApis: isDev && !isStaticBuild,
  
  // Dynamic search requires server-side processing (dev only)
  enableDynamicSearch: isDev,
  
  // Form submission works with external services in production
  enableFormSubmission: true,
  
  // Analytics should work in all environments
  enableAnalytics: true,
  
  // Service worker for PWA features
  enableServiceWorker: !isDev, // Typically disabled in dev
  
  // Three.js background (can be heavy, allow opt-out)
  enableThreeBackground: true,
};

// API endpoint configuration with fallbacks
export const API_ENDPOINTS: ApiEndpoints = {
  contact: FEATURE_FLAGS.enableLocalApis 
    ? '/api/contact' 
    : import.meta.env.PUBLIC_CONTACT_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID',
  
  search: FEATURE_FLAGS.enableLocalApis 
    ? '/api/search' 
    : '', // Client-side only in production
  
  analytics: FEATURE_FLAGS.enableLocalApis 
    ? '/api/analytics' 
    : '', // Direct GA4/analytics service in production
  
  newsletter: FEATURE_FLAGS.enableLocalApis 
    ? '/api/newsletter' 
    : import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT || 'https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe',
};

/**
 * Get the configured API endpoint for a service
 */
export const getApiEndpoint = (service: keyof ApiEndpoints): string => {
  return API_ENDPOINTS[service];
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return FEATURE_FLAGS[feature];
};

/**
 * Check if we're running in a static build environment
 */
export const isStaticDeployment = (): boolean => {
  return isStaticBuild;
};

/**
 * Check if local APIs are available
 */
export const hasLocalApis = (): boolean => {
  return FEATURE_FLAGS.enableLocalApis;
};

/**
 * Get environment-appropriate configuration for external services
 */
export const getExternalServiceConfig = () => {
  return {
    analytics: {
      id: import.meta.env.PUBLIC_ANALYTICS_ID || '',
      enabled: FEATURE_FLAGS.enableAnalytics,
    },
    contact: {
      endpoint: getApiEndpoint('contact'),
      enabled: FEATURE_FLAGS.enableFormSubmission,
    },
    newsletter: {
      endpoint: getApiEndpoint('newsletter'),
      enabled: true,
    },
  };
};

/**
 * Performance and feature detection helpers
 */
export const getPerformanceConfig = () => {
  // Detect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Detect connection quality (if available)
  const connection = typeof navigator !== 'undefined' && 'connection' in navigator
    ? (navigator as any).connection
    : null;

  const isSlowConnection = connection ? 
    connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' 
    : false;

  return {
    prefersReducedMotion,
    isSlowConnection,
    shouldDisableHeavyAnimations: prefersReducedMotion || isSlowConnection,
    shouldEnableThreeBackground: FEATURE_FLAGS.enableThreeBackground && !prefersReducedMotion && !isSlowConnection,
  };
};

// Type exports for components
export type { ApiEndpoints, FeatureFlags };