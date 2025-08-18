// Analytics system type definitions and data models

export interface AnalyticsConfig {
  // Service configuration
  enabled: boolean;
  debug: boolean;
  anonymizeIP: boolean;
  respectDNT: boolean; // Do Not Track
  
  // Data collection settings
  trackPageViews: boolean;
  trackUserInteractions: boolean;
  trackPerformance: boolean;
  trackErrors: boolean;
  
  // Session configuration
  sessionTimeout: number; // in milliseconds
  maxSessionDuration: number; // in milliseconds
  
  // Privacy settings
  cookieConsent: boolean;
  dataRetentionDays: number;
  
  // External services
  services: {
    googleAnalytics?: {
      measurementId: string;
      gtag?: boolean;
    };
    plausible?: {
      domain: string;
      apiHost?: string;
    };
    mixpanel?: {
      token: string;
    };
    posthog?: {
      apiKey: string;
      apiHost?: string;
    };
  };
}

// Core event types
export type EventCategory = 
  | 'page_view'
  | 'user_interaction' 
  | 'navigation'
  | 'engagement'
  | 'performance'
  | 'error'
  | 'conversion'
  | 'research'
  | 'content';

export interface BaseEvent {
  // Event identification
  id: string;
  timestamp: number;
  category: EventCategory;
  action: string;
  
  // User context
  userId?: string; // Anonymous user ID
  sessionId: string;
  
  // Page context  
  page: {
    path: string;
    title: string;
    url: string;
    referrer?: string;
    language: string;
  };
  
  // Device/browser context
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
    screenResolution: string;
    viewportSize: string;
    connection?: string;
  };
  
  // Custom properties
  properties?: Record<string, any>;
}

// Specific event types
export interface PageViewEvent extends BaseEvent {
  category: 'page_view';
  action: 'view';
  properties: {
    loadTime?: number;
    scrollDepth?: number;
    timeOnPage?: number;
    exitIntent?: boolean;
  };
}

export interface UserInteractionEvent extends BaseEvent {
  category: 'user_interaction';
  action: 'click' | 'scroll' | 'hover' | 'focus' | 'submit' | 'download' | 'share';
  properties: {
    element: string;
    elementText?: string;
    elementPosition?: string;
    value?: string | number;
    target?: string;
  };
}

export interface NavigationEvent extends BaseEvent {
  category: 'navigation';
  action: 'navigate' | 'back' | 'forward' | 'reload' | 'external_link';
  properties: {
    from: string;
    to: string;
    method: 'click' | 'browser' | 'direct';
  };
}

export interface EngagementEvent extends BaseEvent {
  category: 'engagement';
  action: 'read' | 'view' | 'interact' | 'share' | 'bookmark' | 'print';
  properties: {
    contentType: string;
    contentId: string;
    engagementTime?: number;
    scrollPercentage?: number;
    interactionDepth?: number;
  };
}

export interface PerformanceEvent extends BaseEvent {
  category: 'performance';
  action: 'timing' | 'resource' | 'navigation' | 'paint' | 'layout_shift' | 'input_delay';
  properties: {
    metric: string;
    value: number;
    unit: 'ms' | 'bytes' | 'score' | 'ratio';
    resource?: string;
    timing?: {
      dns?: number;
      connect?: number;
      request?: number;
      response?: number;
      domLoad?: number;
      domReady?: number;
      load?: number;
    };
  };
}

export interface ErrorEvent extends BaseEvent {
  category: 'error';
  action: 'javascript' | 'network' | 'resource' | 'csp' | 'unhandled';
  properties: {
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    resource?: string;
    statusCode?: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface ResearchEvent extends BaseEvent {
  category: 'research';
  action: 'publication_view' | 'publication_download' | 'citation_copy' | 'search' | 'filter';
  properties: {
    publicationId?: string;
    publicationTitle?: string;
    searchQuery?: string;
    filterType?: string;
    filterValue?: string;
    resultCount?: number;
  };
}

export interface ConversionEvent extends BaseEvent {
  category: 'conversion';
  action: 'contact_form' | 'newsletter_signup' | 'email_click' | 'social_follow' | 'download';
  properties: {
    formId?: string;
    formStep?: number;
    value?: number;
    currency?: string;
    items?: string[];
  };
}

export type AnalyticsEvent = 
  | PageViewEvent 
  | UserInteractionEvent 
  | NavigationEvent 
  | EngagementEvent 
  | PerformanceEvent 
  | ErrorEvent 
  | ResearchEvent
  | ConversionEvent;

// Session data
export interface UserSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  events: number;
  bounced: boolean;
  
  // Entry/exit data
  entryPage: string;
  exitPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Device context
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
    screenResolution: string;
  };
  
  // Geographic data (if available)
  geo?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  
  // Engagement metrics
  totalScrollDepth: number;
  avgTimePerPage: number;
  interactions: number;
  
  // Custom dimensions
  customDimensions?: Record<string, string>;
}

// Analytics insights and metrics
export interface AnalyticsMetrics {
  // Traffic metrics
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  avgPageViews: number;
  
  // Engagement metrics
  totalEngagementTime: number;
  avgEngagementTime: number;
  interactionRate: number;
  scrollDepth: number;
  
  // Performance metrics
  avgPageLoadTime: number;
  avgFCP: number; // First Contentful Paint
  avgLCP: number; // Largest Contentful Paint
  avgCLS: number; // Cumulative Layout Shift
  avgFID: number; // First Input Delay
  
  // Content metrics
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
    avgTime: number;
    bounceRate: number;
  }>;
  
  topReferrers: Array<{
    referrer: string;
    visits: number;
    percentage: number;
  }>;
  
  // Research-specific metrics
  topPublications: Array<{
    title: string;
    views: number;
    downloads: number;
    citations: number;
  }>;
  
  searchQueries: Array<{
    query: string;
    count: number;
    resultClicks: number;
  }>;
  
  // Conversion metrics
  conversions: {
    contactForms: number;
    newsletterSignups: number;
    publicationDownloads: number;
    socialShares: number;
  };
  
  // Time-based data
  timeRange: {
    start: number;
    end: number;
  };
  
  // Comparison data
  previousPeriod?: {
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

// Analytics storage interface
export interface AnalyticsStorage {
  // Event storage
  storeEvent(event: AnalyticsEvent): Promise<void>;
  getEvents(filters?: EventFilters): Promise<AnalyticsEvent[]>;
  
  // Session storage
  storeSession(session: UserSession): Promise<void>;
  getSession(sessionId: string): Promise<UserSession | null>;
  getSessions(filters?: SessionFilters): Promise<UserSession[]>;
  
  // Metrics calculation
  calculateMetrics(filters?: MetricFilters): Promise<AnalyticsMetrics>;
  
  // Data management
  cleanupOldData(olderThan: number): Promise<void>;
  exportData(filters?: ExportFilters): Promise<any>;
}

// Filter interfaces
export interface EventFilters {
  startDate?: number;
  endDate?: number;
  categories?: EventCategory[];
  actions?: string[];
  pages?: string[];
  userIds?: string[];
  sessionIds?: string[];
  limit?: number;
  offset?: number;
}

export interface SessionFilters {
  startDate?: number;
  endDate?: number;
  minDuration?: number;
  maxDuration?: number;
  bounced?: boolean;
  deviceTypes?: string[];
  browsers?: string[];
  countries?: string[];
  limit?: number;
  offset?: number;
}

export interface MetricFilters {
  startDate?: number;
  endDate?: number;
  pages?: string[];
  segments?: string[];
  compareWith?: {
    startDate: number;
    endDate: number;
  };
}

export interface ExportFilters extends EventFilters {
  format: 'json' | 'csv' | 'xlsx';
  fields?: string[];
}

// Analytics provider interface
export interface AnalyticsProvider {
  name: string;
  initialized: boolean;
  
  initialize(config: any): Promise<void>;
  track(event: AnalyticsEvent): Promise<void>;
  page(pageData: PageViewEvent): Promise<void>;
  identify(userId: string, properties?: Record<string, any>): Promise<void>;
  group(groupId: string, properties?: Record<string, any>): Promise<void>;
  alias(newId: string, previousId?: string): Promise<void>;
  reset(): Promise<void>;
}

// Error types
export class AnalyticsError extends Error {
  public code: string;
  public context?: any;
  
  constructor(message: string, code: string, context?: any) {
    super(message);
    this.name = 'AnalyticsError';
    this.code = code;
    this.context = context;
  }
}

// Utility types
export type EventHandler<T extends AnalyticsEvent = AnalyticsEvent> = (event: T) => void | Promise<void>;

export interface AnalyticsHooks {
  beforeTrack?: EventHandler;
  afterTrack?: EventHandler;
  onError?: (error: AnalyticsError) => void;
  onSession?: (session: UserSession) => void;
}

export type ConsentStatus = 'granted' | 'denied' | 'pending';

export interface ConsentSettings {
  analytics: ConsentStatus;
  marketing: ConsentStatus;
  personalization: ConsentStatus;
  functionality: ConsentStatus;
}

export default AnalyticsEvent;