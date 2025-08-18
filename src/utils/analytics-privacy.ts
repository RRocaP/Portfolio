// Privacy-compliant data collection for analytics
import type { ConsentSettings, ConsentStatus, AnalyticsEvent, UserSession } from '../types/analytics';

/**
 * Privacy Manager for Analytics
 * Handles GDPR/CCPA compliance, consent management, and data anonymization
 */
export class PrivacyManager {
  private consentSettings: ConsentSettings;
  private consentCallbacks: ((consent: ConsentSettings) => void)[] = [];
  private dataRetentionDays: number;
  private anonymizationLevel: 'none' | 'partial' | 'full';
  
  // Storage keys
  private readonly CONSENT_KEY = 'analytics_consent';
  private readonly USER_ID_KEY = 'analytics_user_id';
  private readonly DNT_CHECKED_KEY = 'analytics_dnt_checked';

  constructor(config?: {
    dataRetentionDays?: number;
    anonymizationLevel?: 'none' | 'partial' | 'full';
    defaultConsent?: Partial<ConsentSettings>;
  }) {
    this.dataRetentionDays = config?.dataRetentionDays || 90;
    this.anonymizationLevel = config?.anonymizationLevel || 'partial';
    
    // Initialize consent settings
    this.consentSettings = {
      analytics: 'pending',
      marketing: 'denied',
      personalization: 'denied',
      functionality: 'granted',
      ...config?.defaultConsent,
    };

    this.initializePrivacyCompliance();
  }

  /**
   * Initialize privacy compliance
   */
  private initializePrivacyCompliance(): void {
    // Load existing consent
    this.loadStoredConsent();
    
    // Check Do Not Track
    this.checkDoNotTrack();
    
    // Set up consent banner if needed
    this.showConsentBannerIfNeeded();
    
    // Clean up old data
    this.cleanupOldData();
  }

  /**
   * Set user consent
   */
  public setConsent(consent: Partial<ConsentSettings>): void {
    const previousConsent = { ...this.consentSettings };
    this.consentSettings = { ...this.consentSettings, ...consent };
    
    // Store consent with timestamp
    this.storeConsent();
    
    // Handle consent changes
    this.handleConsentChanges(previousConsent, this.consentSettings);
    
    // Notify callbacks
    this.notifyConsentCallbacks();
    
    this.logPrivacy('Consent updated', this.consentSettings);
  }

  /**
   * Get current consent settings
   */
  public getConsent(): ConsentSettings {
    return { ...this.consentSettings };
  }

  /**
   * Check if analytics is allowed
   */
  public isAnalyticsAllowed(): boolean {
    return this.consentSettings.analytics === 'granted' && 
           !this.isDoNotTrackEnabled() &&
           !this.isOptedOut();
  }

  /**
   * Check if marketing tracking is allowed
   */
  public isMarketingAllowed(): boolean {
    return this.consentSettings.marketing === 'granted' &&
           this.isAnalyticsAllowed();
  }

  /**
   * Check if personalization is allowed
   */
  public isPersonalizationAllowed(): boolean {
    return this.consentSettings.personalization === 'granted' &&
           this.isAnalyticsAllowed();
  }

  /**
   * Anonymize analytics event based on privacy settings
   */
  public anonymizeEvent(event: AnalyticsEvent): AnalyticsEvent {
    const anonymizedEvent = { ...event };

    // Always remove/hash user ID if not consented to analytics
    if (!this.isAnalyticsAllowed()) {
      delete anonymizedEvent.userId;
      anonymizedEvent.sessionId = this.hashString(event.sessionId);
    } else if (this.anonymizationLevel === 'full') {
      // Full anonymization
      delete anonymizedEvent.userId;
      anonymizedEvent.sessionId = this.hashString(event.sessionId);
      anonymizedEvent.page.url = this.sanitizeUrl(event.page.url);
      anonymizedEvent.page.referrer = this.sanitizeUrl(event.page.referrer || '');
    } else if (this.anonymizationLevel === 'partial') {
      // Partial anonymization
      if (anonymizedEvent.userId) {
        anonymizedEvent.userId = this.hashString(event.userId);
      }
      anonymizedEvent.page.url = this.sanitizeUrl(event.page.url);
      anonymizedEvent.page.referrer = this.sanitizeUrl(event.page.referrer || '');
    }

    // Remove sensitive device information
    if (!this.isPersonalizationAllowed()) {
      anonymizedEvent.device = this.sanitizeDeviceInfo(event.device);
    }

    // Remove marketing-related properties
    if (!this.isMarketingAllowed()) {
      if (anonymizedEvent.properties) {
        delete anonymizedEvent.properties.utm_source;
        delete anonymizedEvent.properties.utm_medium;
        delete anonymizedEvent.properties.utm_campaign;
        delete anonymizedEvent.properties.utm_content;
        delete anonymizedEvent.properties.utm_term;
      }
    }

    return anonymizedEvent;
  }

  /**
   * Anonymize user session data
   */
  public anonymizeSession(session: UserSession): UserSession {
    const anonymizedSession = { ...session };

    if (!this.isAnalyticsAllowed()) {
      delete anonymizedSession.userId;
      anonymizedSession.id = this.hashString(session.id);
    } else if (this.anonymizationLevel === 'full') {
      delete anonymizedSession.userId;
      anonymizedSession.id = this.hashString(session.id);
      anonymizedSession.referrer = this.sanitizeUrl(session.referrer || '');
      delete anonymizedSession.geo;
      delete anonymizedSession.utmSource;
      delete anonymizedSession.utmMedium;
      delete anonymizedSession.utmCampaign;
    } else if (this.anonymizationLevel === 'partial') {
      if (anonymizedSession.userId) {
        anonymizedSession.userId = this.hashString(session.userId);
      }
      anonymizedSession.referrer = this.sanitizeUrl(session.referrer || '');
      
      // Anonymize geographic data to country level only
      if (anonymizedSession.geo) {
        delete anonymizedSession.geo.region;
        delete anonymizedSession.geo.city;
      }
    }

    if (!this.isPersonalizationAllowed()) {
      anonymizedSession.device = this.sanitizeDeviceInfo(session.device);
      delete anonymizedSession.customDimensions;
    }

    if (!this.isMarketingAllowed()) {
      delete anonymizedSession.utmSource;
      delete anonymizedSession.utmMedium;
      delete anonymizedSession.utmCampaign;
    }

    return anonymizedSession;
  }

  /**
   * Check if data should be collected
   */
  public shouldCollectData(category: 'analytics' | 'marketing' | 'personalization'): boolean {
    switch (category) {
      case 'analytics':
        return this.isAnalyticsAllowed();
      case 'marketing':
        return this.isMarketingAllowed();
      case 'personalization':
        return this.isPersonalizationAllowed();
      default:
        return false;
    }
  }

  /**
   * Get or create anonymous user ID
   */
  public getAnonymousUserId(): string | undefined {
    if (!this.isAnalyticsAllowed()) {
      return undefined;
    }

    let userId = localStorage.getItem(this.USER_ID_KEY);
    if (!userId) {
      userId = this.generateAnonymousId();
      localStorage.setItem(this.USER_ID_KEY, userId);
    }

    return this.anonymizationLevel === 'none' ? userId : this.hashString(userId);
  }

  /**
   * Delete user data (right to be forgotten)
   */
  public deleteUserData(): void {
    // Remove local storage
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.CONSENT_KEY);
    localStorage.removeItem('analytics_session_id');
    localStorage.removeItem('analytics_events');
    localStorage.removeItem('analytics_sessions');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Reset consent
    this.consentSettings = {
      analytics: 'denied',
      marketing: 'denied',
      personalization: 'denied',
      functionality: 'granted',
    };
    
    this.logPrivacy('User data deleted');
  }

  /**
   * Export user data (data portability)
   */
  public exportUserData(): any {
    const data = {
      consent: this.consentSettings,
      userId: localStorage.getItem(this.USER_ID_KEY),
      events: this.getStoredEvents(),
      sessions: this.getStoredSessions(),
      exportDate: new Date().toISOString(),
    };

    return data;
  }

  /**
   * Add consent change callback
   */
  public onConsentChange(callback: (consent: ConsentSettings) => void): void {
    this.consentCallbacks.push(callback);
  }

  /**
   * Show consent banner
   */
  public showConsentBanner(): void {
    if (document.getElementById('analytics-consent-banner')) {
      return; // Banner already exists
    }

    const banner = this.createConsentBanner();
    document.body.appendChild(banner);
  }

  /**
   * Hide consent banner
   */
  public hideConsentBanner(): void {
    const banner = document.getElementById('analytics-consent-banner');
    if (banner) {
      banner.remove();
    }
  }

  /**
   * Load stored consent
   */
  private loadStoredConsent(): void {
    try {
      const stored = localStorage.getItem(this.CONSENT_KEY);
      if (stored) {
        const consentData = JSON.parse(stored);
        
        // Check if consent is still valid (not expired)
        if (this.isConsentValid(consentData.timestamp)) {
          this.consentSettings = { ...this.consentSettings, ...consentData.consent };
        } else {
          // Consent expired, remove it
          localStorage.removeItem(this.CONSENT_KEY);
        }
      }
    } catch (error) {
      this.logPrivacy('Failed to load stored consent:', error);
    }
  }

  /**
   * Store consent with timestamp
   */
  private storeConsent(): void {
    const consentData = {
      consent: this.consentSettings,
      timestamp: Date.now(),
      version: '1.0', // Consent version for tracking changes
    };
    
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consentData));
  }

  /**
   * Check if consent is still valid
   */
  private isConsentValid(timestamp: number): boolean {
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
    return Date.now() - timestamp < maxAge;
  }

  /**
   * Check Do Not Track setting
   */
  private checkDoNotTrack(): void {
    if (this.isDoNotTrackEnabled()) {
      this.consentSettings.analytics = 'denied';
      this.consentSettings.marketing = 'denied';
      this.consentSettings.personalization = 'denied';
      
      localStorage.setItem(this.DNT_CHECKED_KEY, 'true');
      this.logPrivacy('Do Not Track detected - analytics disabled');
    }
  }

  /**
   * Check if Do Not Track is enabled
   */
  private isDoNotTrackEnabled(): boolean {
    return navigator.doNotTrack === '1' || 
           (window as any).doNotTrack === '1' || 
           (navigator as any).msDoNotTrack === '1';
  }

  /**
   * Check if user has opted out
   */
  private isOptedOut(): boolean {
    // Check for global opt-out signals
    return (window as any).gaOptout === true ||
           localStorage.getItem('analytics_opt_out') === 'true';
  }

  /**
   * Show consent banner if needed
   */
  private showConsentBannerIfNeeded(): void {
    const hasStoredConsent = localStorage.getItem(this.CONSENT_KEY);
    const dntEnabled = this.isDoNotTrackEnabled();
    
    if (!hasStoredConsent && !dntEnabled && this.consentSettings.analytics === 'pending') {
      // Delay banner to avoid blocking page load
      setTimeout(() => this.showConsentBanner(), 1000);
    }
  }

  /**
   * Handle consent changes
   */
  private handleConsentChanges(previous: ConsentSettings, current: ConsentSettings): void {
    // If analytics consent was revoked, delete user data
    if (previous.analytics === 'granted' && current.analytics === 'denied') {
      this.deleteUserData();
    }
    
    // If marketing consent was revoked, remove marketing identifiers
    if (previous.marketing === 'granted' && current.marketing === 'denied') {
      this.removeMarketingData();
    }
  }

  /**
   * Remove marketing-related data
   */
  private removeMarketingData(): void {
    // Remove UTM parameters from stored data
    const events = this.getStoredEvents();
    const cleanedEvents = events.map(event => {
      if (event.properties) {
        delete event.properties.utm_source;
        delete event.properties.utm_medium;
        delete event.properties.utm_campaign;
        delete event.properties.utm_content;
        delete event.properties.utm_term;
      }
      return event;
    });
    
    this.storeEvents(cleanedEvents);
  }

  /**
   * Create consent banner element
   */
  private createConsentBanner(): HTMLElement {
    const banner = document.createElement('div');
    banner.id = 'analytics-consent-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1a1a1a;
      color: white;
      padding: 1rem;
      z-index: 10000;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    `;

    banner.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; items-center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="flex: 1; min-width: 300px;">
          <p style="margin: 0; color: #e5e5e5;">
            This website uses analytics cookies to understand how you interact with our content and improve your experience. 
            <a href="/privacy" target="_blank" style="color: #DA291C; text-decoration: underline;">Learn more</a>
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button id="consent-reject" style="
            background: transparent; 
            border: 1px solid #666; 
            color: #ccc; 
            padding: 0.5rem 1rem; 
            border-radius: 4px; 
            cursor: pointer;
            font-size: 14px;
          ">
            Reject All
          </button>
          <button id="consent-customize" style="
            background: transparent; 
            border: 1px solid #DA291C; 
            color: #DA291C; 
            padding: 0.5rem 1rem; 
            border-radius: 4px; 
            cursor: pointer;
            font-size: 14px;
          ">
            Customize
          </button>
          <button id="consent-accept" style="
            background: #DA291C; 
            border: 1px solid #DA291C; 
            color: white; 
            padding: 0.5rem 1rem; 
            border-radius: 4px; 
            cursor: pointer;
            font-size: 14px;
          ">
            Accept All
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    banner.querySelector('#consent-accept')?.addEventListener('click', () => {
      this.setConsent({
        analytics: 'granted',
        marketing: 'granted',
        personalization: 'granted',
      });
      this.hideConsentBanner();
    });

    banner.querySelector('#consent-reject')?.addEventListener('click', () => {
      this.setConsent({
        analytics: 'denied',
        marketing: 'denied',
        personalization: 'denied',
      });
      this.hideConsentBanner();
    });

    banner.querySelector('#consent-customize')?.addEventListener('click', () => {
      this.showConsentModal();
    });

    return banner;
  }

  /**
   * Show consent customization modal
   */
  private showConsentModal(): void {
    // This would open a detailed consent modal
    // For now, we'll just show a simple implementation
    const choices = {
      analytics: confirm('Allow analytics cookies to help us understand how you use our website?'),
      marketing: confirm('Allow marketing cookies for personalized content and advertisements?'),
      personalization: confirm('Allow personalization cookies to customize your experience?'),
    };

    this.setConsent({
      analytics: choices.analytics ? 'granted' : 'denied',
      marketing: choices.marketing ? 'granted' : 'denied',
      personalization: choices.personalization ? 'granted' : 'denied',
    });

    this.hideConsentBanner();
  }

  /**
   * Notify consent callbacks
   */
  private notifyConsentCallbacks(): void {
    this.consentCallbacks.forEach(callback => {
      try {
        callback(this.consentSettings);
      } catch (error) {
        this.logPrivacy('Consent callback error:', error);
      }
    });
  }

  /**
   * Clean up old data
   */
  private cleanupOldData(): void {
    const cutoffTime = Date.now() - (this.dataRetentionDays * 24 * 60 * 60 * 1000);
    
    // Clean up events
    const events = this.getStoredEvents();
    const recentEvents = events.filter(event => event.timestamp > cutoffTime);
    this.storeEvents(recentEvents);
    
    // Clean up sessions
    const sessions = this.getStoredSessions();
    const recentSessions = sessions.filter(session => session.startTime > cutoffTime);
    this.storeSessions(recentSessions);
  }

  // Utility methods
  private hashString(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove query parameters and hash to protect privacy
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return 'unknown';
    }
  }

  private sanitizeDeviceInfo(device: any): any {
    return {
      type: device.type,
      browser: this.sanitizeBrowserInfo(device.browser),
      os: this.sanitizeOSInfo(device.os),
      screenResolution: this.sanitizeResolution(device.screenResolution),
      viewportSize: this.sanitizeResolution(device.viewportSize),
    };
  }

  private sanitizeBrowserInfo(browser: string): string {
    // Return general browser family only
    if (browser.includes('Chrome')) return 'Chrome';
    if (browser.includes('Firefox')) return 'Firefox';
    if (browser.includes('Safari')) return 'Safari';
    if (browser.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private sanitizeOSInfo(os: string): string {
    // Return general OS family only
    if (os.includes('Windows')) return 'Windows';
    if (os.includes('Mac')) return 'macOS';
    if (os.includes('Linux')) return 'Linux';
    if (os.includes('iOS')) return 'iOS';
    if (os.includes('Android')) return 'Android';
    return 'Other';
  }

  private sanitizeResolution(resolution: string): string {
    // Round to common resolutions to reduce fingerprinting
    const [width, height] = resolution.split('x').map(Number);
    
    if (width >= 1920) return '1920x1080+';
    if (width >= 1366) return '1366x768';
    if (width >= 1024) return '1024x768';
    if (width >= 768) return '768x1024';
    return '<=768x1024';
  }

  private generateAnonymousId(): string {
    return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private storeEvents(events: AnalyticsEvent[]): void {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      this.logPrivacy('Failed to store events:', error);
    }
  }

  private getStoredSessions(): UserSession[] {
    try {
      const stored = localStorage.getItem('analytics_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private storeSessions(sessions: UserSession[]): void {
    try {
      localStorage.setItem('analytics_sessions', JSON.stringify(sessions));
    } catch (error) {
      this.logPrivacy('Failed to store sessions:', error);
    }
  }

  private logPrivacy(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Privacy]`, message, data);
    }
  }
}

export default PrivacyManager;