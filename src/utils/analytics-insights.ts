// Analytics reporting and insights generation
import type { 
  AnalyticsEvent, 
  AnalyticsMetrics, 
  UserSession, 
  EventFilters, 
  SessionFilters 
} from '../types/analytics';

/**
 * Analytics Insights Generator
 * Processes raw analytics data to generate meaningful insights and reports
 */
export class AnalyticsInsights {
  private events: AnalyticsEvent[] = [];
  private sessions: UserSession[] = [];

  constructor(events: AnalyticsEvent[] = [], sessions: UserSession[] = []) {
    this.events = events;
    this.sessions = sessions;
  }

  /**
   * Update data
   */
  public updateData(events: AnalyticsEvent[], sessions: UserSession[]): void {
    this.events = events;
    this.sessions = sessions;
  }

  /**
   * Generate comprehensive metrics report
   */
  public generateMetrics(timeRange?: { start: number; end: number }): AnalyticsMetrics {
    const filteredEvents = this.filterEventsByTimeRange(this.events, timeRange);
    const filteredSessions = this.filterSessionsByTimeRange(this.sessions, timeRange);

    return {
      // Traffic metrics
      pageViews: this.calculatePageViews(filteredEvents),
      uniqueVisitors: this.calculateUniqueVisitors(filteredSessions),
      sessions: filteredSessions.length,
      bounceRate: this.calculateBounceRate(filteredSessions),
      avgSessionDuration: this.calculateAvgSessionDuration(filteredSessions),
      avgPageViews: this.calculateAvgPageViews(filteredSessions),

      // Engagement metrics
      totalEngagementTime: this.calculateTotalEngagementTime(filteredEvents),
      avgEngagementTime: this.calculateAvgEngagementTime(filteredEvents),
      interactionRate: this.calculateInteractionRate(filteredEvents, filteredSessions),
      scrollDepth: this.calculateAvgScrollDepth(filteredSessions),

      // Performance metrics
      avgPageLoadTime: this.calculateAvgPageLoadTime(filteredEvents),
      avgFCP: this.calculateAvgMetric(filteredEvents, 'FCP'),
      avgLCP: this.calculateAvgMetric(filteredEvents, 'LCP'),
      avgCLS: this.calculateAvgMetric(filteredEvents, 'CLS'),
      avgFID: this.calculateAvgMetric(filteredEvents, 'FID'),

      // Content insights
      topPages: this.getTopPages(filteredEvents, filteredSessions),
      topReferrers: this.getTopReferrers(filteredSessions),
      topPublications: this.getTopPublications(filteredEvents),
      searchQueries: this.getTopSearchQueries(filteredEvents),

      // Conversions
      conversions: this.calculateConversions(filteredEvents),

      // Time range
      timeRange: timeRange || {
        start: Math.min(...this.events.map(e => e.timestamp)),
        end: Math.max(...this.events.map(e => e.timestamp)),
      },
    };
  }

  /**
   * Generate user behavior insights
   */
  public generateUserBehaviorInsights(): {
    userJourney: Array<{ step: string; users: number; dropOff: number }>;
    deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
    timeOnSiteDistribution: Array<{ range: string; count: number; percentage: number }>;
    engagementSegments: Array<{ segment: string; count: number; characteristics: string[] }>;
    returningUserRate: number;
  } {
    return {
      userJourney: this.analyzeUserJourney(),
      deviceBreakdown: this.analyzeDeviceBreakdown(),
      timeOnSiteDistribution: this.analyzeTimeOnSiteDistribution(),
      engagementSegments: this.analyzeEngagementSegments(),
      returningUserRate: this.calculateReturningUserRate(),
    };
  }

  /**
   * Generate content performance insights
   */
  public generateContentInsights(): {
    contentPerformance: Array<{
      page: string;
      views: number;
      uniqueViews: number;
      avgTimeOnPage: number;
      bounceRate: number;
      exitRate: number;
      conversionRate: number;
    }>;
    contentFlow: Array<{ from: string; to: string; count: number }>;
    searchInsights: {
      topQueries: Array<{ query: string; count: number; ctr: number }>;
      zeroResultQueries: Array<{ query: string; count: number }>;
      queryCategories: Array<{ category: string; count: number }>;
    };
  } {
    return {
      contentPerformance: this.analyzeContentPerformance(),
      contentFlow: this.analyzeContentFlow(),
      searchInsights: this.analyzeSearchInsights(),
    };
  }

  /**
   * Generate research-specific insights
   */
  public generateResearchInsights(): {
    publicationMetrics: Array<{
      publicationId: string;
      title: string;
      views: number;
      downloads: number;
      avgTimeOnPage: number;
      shareRate: number;
      citationClicks: number;
    }>;
    researchInterests: Array<{ topic: string; engagement: number; growth: number }>;
    academicTraffic: {
      scholarReferrals: number;
      institutionalTraffic: number;
      researcherBehavior: {
        avgPublicationsViewed: number;
        downloadRate: number;
        citationCopyRate: number;
      };
    };
  } {
    return {
      publicationMetrics: this.analyzePublicationMetrics(),
      researchInterests: this.analyzeResearchInterests(),
      academicTraffic: this.analyzeAcademicTraffic(),
    };
  }

  /**
   * Generate performance insights
   */
  public generatePerformanceInsights(): {
    coreWebVitals: {
      lcp: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
      fid: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
      cls: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
      fcp: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
    };
    pageSpeedInsights: Array<{
      page: string;
      loadTime: number;
      performanceScore: number;
      recommendations: string[];
    }>;
    userExperienceCorrelation: {
      bounceRateByLoadTime: Array<{ loadTimeRange: string; bounceRate: number }>;
      engagementByPerformance: Array<{ performanceRange: string; avgEngagement: number }>;
    };
  } {
    return {
      coreWebVitals: this.analyzeCoreWebVitals(),
      pageSpeedInsights: this.analyzePageSpeedInsights(),
      userExperienceCorrelation: this.analyzeUXPerformanceCorrelation(),
    };
  }

  /**
   * Generate actionable recommendations
   */
  public generateRecommendations(): {
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    actions: string[];
  }[] {
    const recommendations = [];

    // Performance recommendations
    const coreWebVitals = this.analyzeCoreWebVitals();
    if (coreWebVitals.lcp.score === 'poor') {
      recommendations.push({
        priority: 'high' as const,
        category: 'Performance',
        title: 'Improve Largest Contentful Paint (LCP)',
        description: `Your LCP is ${coreWebVitals.lcp.value}ms, which is in the "poor" range. This impacts user experience and SEO.`,
        impact: 'Reducing LCP can improve bounce rate by 10-20% and search rankings.',
        effort: 'medium' as const,
        actions: [
          'Optimize hero image loading with preload hints',
          'Reduce server response times',
          'Remove render-blocking resources',
          'Implement image compression and next-gen formats',
        ],
      });
    }

    // Content recommendations
    const topPages = this.getTopPages(this.events, this.sessions);
    const highBouncePages = topPages.filter(page => page.bounceRate > 70);
    if (highBouncePages.length > 0) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Content',
        title: 'Reduce bounce rate on key pages',
        description: `${highBouncePages.length} important pages have bounce rates above 70%.`,
        impact: 'Improving content engagement can increase conversion rates by 15-25%.',
        effort: 'medium' as const,
        actions: [
          'Add internal links to related content',
          'Improve page loading speed',
          'Enhance content relevance and readability',
          'Add call-to-action buttons',
        ],
      });
    }

    // Research recommendations
    const searchQueries = this.getTopSearchQueries(this.events);
    const zeroResultQueries = searchQueries.filter(query => query.resultClicks === 0);
    if (zeroResultQueries.length > 0) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Research Content',
        title: 'Address zero-result search queries',
        description: `${zeroResultQueries.length} search queries return no results or get no clicks.`,
        impact: 'Creating content for unmet search needs can increase engagement by 20-30%.',
        effort: 'high' as const,
        actions: [
          'Create content for unaddressed research topics',
          'Improve search functionality and filters',
          'Add suggested searches and auto-complete',
          'Enhance publication tagging and categorization',
        ],
      });
    }

    // Engagement recommendations
    const avgEngagementTime = this.calculateAvgEngagementTime(this.events);
    if (avgEngagementTime < 120000) { // Less than 2 minutes
      recommendations.push({
        priority: 'medium' as const,
        category: 'Engagement',
        title: 'Increase content engagement time',
        description: `Average engagement time is ${Math.round(avgEngagementTime / 1000)}s, which is below optimal levels.`,
        impact: 'Higher engagement signals content quality to search engines and improves conversions.',
        effort: 'medium' as const,
        actions: [
          'Add interactive elements to research content',
          'Improve content structure with better headings',
          'Add related content recommendations',
          'Implement progress indicators for long content',
        ],
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Private calculation methods

  private filterEventsByTimeRange(events: AnalyticsEvent[], timeRange?: { start: number; end: number }): AnalyticsEvent[] {
    if (!timeRange) return events;
    return events.filter(event => event.timestamp >= timeRange.start && event.timestamp <= timeRange.end);
  }

  private filterSessionsByTimeRange(sessions: UserSession[], timeRange?: { start: number; end: number }): UserSession[] {
    if (!timeRange) return sessions;
    return sessions.filter(session => session.startTime >= timeRange.start && session.startTime <= timeRange.end);
  }

  private calculatePageViews(events: AnalyticsEvent[]): number {
    return events.filter(event => event.category === 'page_view').length;
  }

  private calculateUniqueVisitors(sessions: UserSession[]): number {
    const uniqueUsers = new Set(sessions.map(session => session.userId).filter(Boolean));
    return uniqueUsers.size || sessions.length; // Fallback to session count if no user IDs
  }

  private calculateBounceRate(sessions: UserSession[]): number {
    if (sessions.length === 0) return 0;
    const bouncedSessions = sessions.filter(session => session.bounced).length;
    return (bouncedSessions / sessions.length) * 100;
  }

  private calculateAvgSessionDuration(sessions: UserSession[]): number {
    if (sessions.length === 0) return 0;
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    return totalDuration / sessions.length;
  }

  private calculateAvgPageViews(sessions: UserSession[]): number {
    if (sessions.length === 0) return 0;
    const totalPageViews = sessions.reduce((sum, session) => sum + session.pageViews, 0);
    return totalPageViews / sessions.length;
  }

  private calculateTotalEngagementTime(events: AnalyticsEvent[]): number {
    const engagementEvents = events.filter(event => 
      event.category === 'engagement' && event.properties?.engagementTime
    );
    return engagementEvents.reduce((sum, event) => sum + (event.properties?.engagementTime || 0), 0);
  }

  private calculateAvgEngagementTime(events: AnalyticsEvent[]): number {
    const engagementEvents = events.filter(event => 
      event.category === 'engagement' && event.properties?.engagementTime
    );
    if (engagementEvents.length === 0) return 0;
    
    const totalTime = engagementEvents.reduce((sum, event) => sum + (event.properties?.engagementTime || 0), 0);
    return totalTime / engagementEvents.length;
  }

  private calculateInteractionRate(events: AnalyticsEvent[], sessions: UserSession[]): number {
    if (sessions.length === 0) return 0;
    const interactiveSessions = sessions.filter(session => session.interactions > 0).length;
    return (interactiveSessions / sessions.length) * 100;
  }

  private calculateAvgScrollDepth(sessions: UserSession[]): number {
    if (sessions.length === 0) return 0;
    const totalScrollDepth = sessions.reduce((sum, session) => sum + session.totalScrollDepth, 0);
    return totalScrollDepth / sessions.length;
  }

  private calculateAvgPageLoadTime(events: AnalyticsEvent[]): number {
    const pageViewEvents = events.filter(event => 
      event.category === 'page_view' && event.properties?.loadTime
    );
    if (pageViewEvents.length === 0) return 0;
    
    const totalLoadTime = pageViewEvents.reduce((sum, event) => sum + (event.properties?.loadTime || 0), 0);
    return totalLoadTime / pageViewEvents.length;
  }

  private calculateAvgMetric(events: AnalyticsEvent[], metricName: string): number {
    const performanceEvents = events.filter(event => 
      event.category === 'performance' && 
      event.properties?.metric === metricName &&
      event.properties?.value
    );
    if (performanceEvents.length === 0) return 0;
    
    const totalValue = performanceEvents.reduce((sum, event) => sum + (event.properties?.value || 0), 0);
    return totalValue / performanceEvents.length;
  }

  private getTopPages(events: AnalyticsEvent[], sessions: UserSession[]): Array<{
    page: string;
    views: number;
    uniqueViews: number;
    avgTime: number;
    bounceRate: number;
  }> {
    const pageStats = new Map<string, {
      views: number;
      uniqueViews: Set<string>;
      totalTime: number;
      bounces: number;
      sessions: number;
    }>();

    // Calculate page views
    events.filter(event => event.category === 'page_view').forEach(event => {
      const page = event.page.path;
      const stats = pageStats.get(page) || {
        views: 0,
        uniqueViews: new Set(),
        totalTime: 0,
        bounces: 0,
        sessions: 0,
      };
      
      stats.views++;
      if (event.sessionId) stats.uniqueViews.add(event.sessionId);
      pageStats.set(page, stats);
    });

    // Add session data
    sessions.forEach(session => {
      const page = session.entryPage;
      const stats = pageStats.get(page);
      if (stats) {
        stats.sessions++;
        stats.totalTime += session.duration || 0;
        if (session.bounced) stats.bounces++;
      }
    });

    return Array.from(pageStats.entries())
      .map(([page, stats]) => ({
        page,
        views: stats.views,
        uniqueViews: stats.uniqueViews.size,
        avgTime: stats.sessions > 0 ? stats.totalTime / stats.sessions : 0,
        bounceRate: stats.sessions > 0 ? (stats.bounces / stats.sessions) * 100 : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private getTopReferrers(sessions: UserSession[]): Array<{
    referrer: string;
    visits: number;
    percentage: number;
  }> {
    const referrerCounts = new Map<string, number>();
    
    sessions.forEach(session => {
      const referrer = session.referrer || 'direct';
      const domain = this.extractDomain(referrer);
      referrerCounts.set(domain, (referrerCounts.get(domain) || 0) + 1);
    });

    const totalSessions = sessions.length;
    
    return Array.from(referrerCounts.entries())
      .map(([referrer, visits]) => ({
        referrer,
        visits,
        percentage: (visits / totalSessions) * 100,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }

  private getTopPublications(events: AnalyticsEvent[]): Array<{
    title: string;
    views: number;
    downloads: number;
    citations: number;
  }> {
    const publicationStats = new Map<string, {
      title: string;
      views: number;
      downloads: number;
      citations: number;
    }>();

    events.filter(event => event.category === 'research').forEach(event => {
      const publicationId = event.properties?.publicationId;
      const title = event.properties?.publicationTitle || publicationId || 'Unknown';
      
      if (!publicationId) return;
      
      const stats = publicationStats.get(publicationId) || {
        title,
        views: 0,
        downloads: 0,
        citations: 0,
      };

      if (event.action === 'publication_view') stats.views++;
      if (event.action === 'publication_download') stats.downloads++;
      if (event.action === 'citation_copy') stats.citations++;

      publicationStats.set(publicationId, stats);
    });

    return Array.from(publicationStats.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private getTopSearchQueries(events: AnalyticsEvent[]): Array<{
    query: string;
    count: number;
    resultClicks: number;
  }> {
    const queryStats = new Map<string, { count: number; resultClicks: number }>();

    events.filter(event => 
      event.category === 'research' && 
      event.action === 'search' && 
      event.properties?.searchQuery
    ).forEach(event => {
      const query = event.properties.searchQuery.toLowerCase();
      const stats = queryStats.get(query) || { count: 0, resultClicks: 0 };
      stats.count++;
      
      // Check if there were follow-up result clicks
      // This would need to be correlated with subsequent events
      
      queryStats.set(query, stats);
    });

    return Array.from(queryStats.entries())
      .map(([query, stats]) => ({
        query,
        count: stats.count,
        resultClicks: stats.resultClicks,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateConversions(events: AnalyticsEvent[]): {
    contactForms: number;
    newsletterSignups: number;
    publicationDownloads: number;
    socialShares: number;
  } {
    const conversions = {
      contactForms: 0,
      newsletterSignups: 0,
      publicationDownloads: 0,
      socialShares: 0,
    };

    events.filter(event => event.category === 'conversion').forEach(event => {
      switch (event.action) {
        case 'contact_form':
          conversions.contactForms++;
          break;
        case 'newsletter_signup':
          conversions.newsletterSignups++;
          break;
        case 'download':
          conversions.publicationDownloads++;
          break;
        case 'social_share':
          conversions.socialShares++;
          break;
      }
    });

    return conversions;
  }

  // Additional analysis methods would be implemented here...
  
  private analyzeUserJourney(): Array<{ step: string; users: number; dropOff: number }> {
    // Implementation for user journey analysis
    return [];
  }

  private analyzeDeviceBreakdown(): Array<{ device: string; count: number; percentage: number }> {
    const deviceCounts = new Map<string, number>();
    
    this.sessions.forEach(session => {
      const device = session.device.type;
      deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
    });

    const total = this.sessions.length;
    
    return Array.from(deviceCounts.entries())
      .map(([device, count]) => ({
        device,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }

  private analyzeTimeOnSiteDistribution(): Array<{ range: string; count: number; percentage: number }> {
    // Implementation for time on site distribution
    return [];
  }

  private analyzeEngagementSegments(): Array<{ segment: string; count: number; characteristics: string[] }> {
    // Implementation for engagement segmentation
    return [];
  }

  private calculateReturningUserRate(): number {
    // Implementation for returning user rate calculation
    return 0;
  }

  private analyzeContentPerformance(): Array<{
    page: string;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
    exitRate: number;
    conversionRate: number;
  }> {
    // Implementation for content performance analysis
    return [];
  }

  private analyzeContentFlow(): Array<{ from: string; to: string; count: number }> {
    // Implementation for content flow analysis
    return [];
  }

  private analyzeSearchInsights(): {
    topQueries: Array<{ query: string; count: number; ctr: number }>;
    zeroResultQueries: Array<{ query: string; count: number }>;
    queryCategories: Array<{ category: string; count: number }>;
  } {
    // Implementation for search insights
    return {
      topQueries: [],
      zeroResultQueries: [],
      queryCategories: [],
    };
  }

  private analyzePublicationMetrics(): Array<{
    publicationId: string;
    title: string;
    views: number;
    downloads: number;
    avgTimeOnPage: number;
    shareRate: number;
    citationClicks: number;
  }> {
    // Implementation for publication metrics analysis
    return [];
  }

  private analyzeResearchInterests(): Array<{ topic: string; engagement: number; growth: number }> {
    // Implementation for research interests analysis
    return [];
  }

  private analyzeAcademicTraffic(): {
    scholarReferrals: number;
    institutionalTraffic: number;
    researcherBehavior: {
      avgPublicationsViewed: number;
      downloadRate: number;
      citationCopyRate: number;
    };
  } {
    // Implementation for academic traffic analysis
    return {
      scholarReferrals: 0,
      institutionalTraffic: 0,
      researcherBehavior: {
        avgPublicationsViewed: 0,
        downloadRate: 0,
        citationCopyRate: 0,
      },
    };
  }

  private analyzeCoreWebVitals(): {
    lcp: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
    fid: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
    cls: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
    fcp: { score: 'good' | 'needs-improvement' | 'poor'; value: number; trend: number };
  } {
    const lcpValue = this.calculateAvgMetric(this.events, 'LCP');
    const fidValue = this.calculateAvgMetric(this.events, 'FID');
    const clsValue = this.calculateAvgMetric(this.events, 'CLS');
    const fcpValue = this.calculateAvgMetric(this.events, 'FCP');

    return {
      lcp: {
        value: lcpValue,
        score: lcpValue <= 2500 ? 'good' : lcpValue <= 4000 ? 'needs-improvement' : 'poor',
        trend: 0, // Would calculate from historical data
      },
      fid: {
        value: fidValue,
        score: fidValue <= 100 ? 'good' : fidValue <= 300 ? 'needs-improvement' : 'poor',
        trend: 0,
      },
      cls: {
        value: clsValue,
        score: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
        trend: 0,
      },
      fcp: {
        value: fcpValue,
        score: fcpValue <= 1800 ? 'good' : fcpValue <= 3000 ? 'needs-improvement' : 'poor',
        trend: 0,
      },
    };
  }

  private analyzePageSpeedInsights(): Array<{
    page: string;
    loadTime: number;
    performanceScore: number;
    recommendations: string[];
  }> {
    // Implementation for page speed insights
    return [];
  }

  private analyzeUXPerformanceCorrelation(): {
    bounceRateByLoadTime: Array<{ loadTimeRange: string; bounceRate: number }>;
    engagementByPerformance: Array<{ performanceRange: string; avgEngagement: number }>;
  } {
    // Implementation for UX performance correlation
    return {
      bounceRateByLoadTime: [],
      engagementByPerformance: [],
    };
  }

  private extractDomain(url: string): string {
    if (!url || url === 'direct') return 'direct';
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'direct';
    }
  }
}

export default AnalyticsInsights;