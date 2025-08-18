// Analytics Dashboard Component
import React, { useState, useEffect, useMemo } from 'react';
import type { AnalyticsMetrics, AnalyticsEvent, UserSession } from '../types/analytics';

interface AnalyticsDashboardProps {
  className?: string;
  adminMode?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'percentage' | 'time' | 'bytes';
  icon?: string;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  className = '',
  adminMode = false,
  dateRange 
}) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'engagement' | 'research'>('overview');

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeFilter, dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from your analytics API
      const mockMetrics = generateMockMetrics();
      const mockEvents = generateMockEvents();
      const mockSessions = generateMockSessions();
      
      setMetrics(mockMetrics);
      setEvents(mockEvents);
      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for demonstration
  const generateMockMetrics = (): AnalyticsMetrics => ({
    pageViews: 2847,
    uniqueVisitors: 1234,
    sessions: 1456,
    bounceRate: 32.5,
    avgSessionDuration: 245000, // 4 minutes 5 seconds
    avgPageViews: 2.3,
    totalEngagementTime: 89420000, // Total engagement time in ms
    avgEngagementTime: 185000, // 3 minutes 5 seconds
    interactionRate: 68.2,
    scrollDepth: 75.4,
    avgPageLoadTime: 2340,
    avgFCP: 1850,
    avgLCP: 2980,
    avgCLS: 0.08,
    avgFID: 89,
    topPages: [
      { page: '/', views: 1245, uniqueViews: 892, avgTime: 195000, bounceRate: 28.5 },
      { page: '/research', views: 567, uniqueViews: 445, avgTime: 312000, bounceRate: 22.1 },
      { page: '/publications', views: 423, uniqueViews: 356, avgTime: 425000, bounceRate: 18.7 },
      { page: '/projects', views: 298, uniqueViews: 234, avgTime: 267000, bounceRate: 35.2 },
      { page: '/about', views: 234, uniqueViews: 198, avgTime: 156000, bounceRate: 42.3 },
    ],
    topReferrers: [
      { referrer: 'google.com', visits: 456, percentage: 45.6 },
      { referrer: 'scholar.google.com', visits: 234, percentage: 23.4 },
      { referrer: 'linkedin.com', visits: 123, percentage: 12.3 },
      { referrer: 'github.com', visits: 89, percentage: 8.9 },
      { referrer: 'direct', visits: 98, percentage: 9.8 },
    ],
    topPublications: [
      { title: 'Antimicrobial protein design', views: 234, downloads: 45, citations: 12 },
      { title: 'Gene therapy vectors', views: 189, downloads: 32, citations: 8 },
      { title: 'Functional inclusion bodies', views: 156, downloads: 28, citations: 15 },
    ],
    searchQueries: [
      { query: 'antimicrobial resistance', count: 45, resultClicks: 32 },
      { query: 'protein design', count: 38, resultClicks: 28 },
      { query: 'gene therapy', count: 29, resultClicks: 21 },
    ],
    conversions: {
      contactForms: 23,
      newsletterSignups: 67,
      publicationDownloads: 234,
      socialShares: 89,
    },
    timeRange: {
      start: Date.now() - (7 * 24 * 60 * 60 * 1000),
      end: Date.now(),
    },
  });

  const generateMockEvents = (): AnalyticsEvent[] => {
    // Generate mock events for the last 7 days
    const events: AnalyticsEvent[] = [];
    const now = Date.now();
    
    for (let i = 0; i < 100; i++) {
      const timestamp = now - (Math.random() * 7 * 24 * 60 * 60 * 1000);
      events.push({
        id: `event_${i}`,
        timestamp,
        category: ['page_view', 'user_interaction', 'engagement'][Math.floor(Math.random() * 3)] as any,
        action: 'test',
        sessionId: `session_${Math.floor(i / 10)}`,
        page: {
          path: ['/', '/research', '/publications'][Math.floor(Math.random() * 3)],
          title: 'Test Page',
          url: 'https://example.com',
          referrer: '',
          language: 'en',
        },
        device: {
          type: 'desktop',
          browser: 'Chrome',
          os: 'macOS',
          screenResolution: '1920x1080',
          viewportSize: '1920x1080',
        },
      } as any);
    }
    
    return events.sort((a, b) => b.timestamp - a.timestamp);
  };

  const generateMockSessions = (): UserSession[] => {
    const sessions: UserSession[] = [];
    for (let i = 0; i < 20; i++) {
      sessions.push({
        id: `session_${i}`,
        startTime: Date.now() - (i * 60 * 60 * 1000),
        endTime: Date.now() - (i * 60 * 60 * 1000) + (Math.random() * 30 * 60 * 1000),
        duration: Math.random() * 30 * 60 * 1000,
        pageViews: Math.floor(Math.random() * 10) + 1,
        events: Math.floor(Math.random() * 50) + 10,
        bounced: Math.random() > 0.7,
        entryPage: '/',
        device: {
          type: 'desktop',
          browser: 'Chrome',
          os: 'macOS',
          screenResolution: '1920x1080',
        },
        totalScrollDepth: Math.random() * 100,
        avgTimePerPage: Math.random() * 300000,
        interactions: Math.floor(Math.random() * 20),
      });
    }
    return sessions;
  };

  // Calculate key metrics for cards
  const metricCards = useMemo<MetricCard[]>(() => {
    if (!metrics) return [];

    return [
      {
        title: 'Page Views',
        value: metrics.pageViews.toLocaleString(),
        change: 12.5,
        trend: 'up',
        icon: '👁️',
      },
      {
        title: 'Unique Visitors',
        value: metrics.uniqueVisitors.toLocaleString(),
        change: 8.2,
        trend: 'up',
        icon: '👤',
      },
      {
        title: 'Bounce Rate',
        value: `${metrics.bounceRate}%`,
        change: -3.1,
        trend: 'down',
        format: 'percentage',
        icon: '⚡',
      },
      {
        title: 'Avg. Session Duration',
        value: formatDuration(metrics.avgSessionDuration),
        change: 15.7,
        trend: 'up',
        format: 'time',
        icon: '⏱️',
      },
      {
        title: 'Page Load Time',
        value: `${(metrics.avgPageLoadTime / 1000).toFixed(2)}s`,
        change: -8.3,
        trend: 'down',
        format: 'time',
        icon: '🚀',
      },
      {
        title: 'Core Web Vitals',
        value: getCoreWebVitalsScore(metrics),
        change: 5.2,
        trend: 'up',
        icon: '📊',
      },
    ];
  }, [metrics]);

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getCoreWebVitalsScore = (metrics: AnalyticsMetrics): string => {
    // Simplified scoring based on Core Web Vitals
    let score = 0;
    if (metrics.avgLCP <= 2500) score += 25;
    else if (metrics.avgLCP <= 4000) score += 15;
    
    if (metrics.avgFID <= 100) score += 25;
    else if (metrics.avgFID <= 300) score += 15;
    
    if (metrics.avgCLS <= 0.1) score += 25;
    else if (metrics.avgCLS <= 0.25) score += 15;
    
    if (metrics.avgFCP <= 1800) score += 25;
    else if (metrics.avgFCP <= 3000) score += 15;
    
    return `${score}/100`;
  };

  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const renderMetricCard = (metric: MetricCard) => (
    <div key={metric.title} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
        </div>
        <div className="text-2xl">{metric.icon}</div>
      </div>
      {metric.change !== undefined && (
        <div className={`flex items-center mt-2 text-sm ${
          metric.trend === 'up' ? 'text-green-600' : 
          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          <span className="mr-1">
            {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '➡️'}
          </span>
          {Math.abs(metric.change)}% vs last period
        </div>
      )}
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map(renderMetricCard)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <div className="space-y-3">
            {metrics?.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{page.page}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{page.views.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{page.bounceRate}% bounce</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {metrics?.topReferrers.map((referrer, index) => (
              <div key={referrer.referrer} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-medium">{referrer.referrer}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{referrer.visits}</div>
                  <div className="text-xs text-gray-500">{referrer.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">LCP</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              (metrics?.avgLCP || 0) <= 2500 ? 'bg-green-100 text-green-800' : 
              (metrics?.avgLCP || 0) <= 4000 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {(metrics?.avgLCP || 0) <= 2500 ? 'Good' : 
               (metrics?.avgLCP || 0) <= 4000 ? 'Needs Improvement' : 'Poor'}
            </span>
          </div>
          <div className="text-lg font-bold mt-1">
            {((metrics?.avgLCP || 0) / 1000).toFixed(2)}s
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">FID</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              (metrics?.avgFID || 0) <= 100 ? 'bg-green-100 text-green-800' : 
              (metrics?.avgFID || 0) <= 300 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {(metrics?.avgFID || 0) <= 100 ? 'Good' : 
               (metrics?.avgFID || 0) <= 300 ? 'Needs Improvement' : 'Poor'}
            </span>
          </div>
          <div className="text-lg font-bold mt-1">
            {metrics?.avgFID || 0}ms
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">CLS</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              (metrics?.avgCLS || 0) <= 0.1 ? 'bg-green-100 text-green-800' : 
              (metrics?.avgCLS || 0) <= 0.25 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {(metrics?.avgCLS || 0) <= 0.1 ? 'Good' : 
               (metrics?.avgCLS || 0) <= 0.25 ? 'Needs Improvement' : 'Poor'}
            </span>
          </div>
          <div className="text-lg font-bold mt-1">
            {(metrics?.avgCLS || 0).toFixed(3)}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">FCP</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              (metrics?.avgFCP || 0) <= 1800 ? 'bg-green-100 text-green-800' : 
              (metrics?.avgFCP || 0) <= 3000 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {(metrics?.avgFCP || 0) <= 1800 ? 'Good' : 
               (metrics?.avgFCP || 0) <= 3000 ? 'Needs Improvement' : 'Poor'}
            </span>
          </div>
          <div className="text-lg font-bold mt-1">
            {((metrics?.avgFCP || 0) / 1000).toFixed(2)}s
          </div>
        </div>
      </div>
    </div>
  );

  const renderEngagementTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Engagement Rate</h3>
          <div className="text-3xl font-bold text-red-600">{metrics?.interactionRate}%</div>
          <p className="text-sm text-gray-500 mt-1">Users who interacted with content</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Avg. Scroll Depth</h3>
          <div className="text-3xl font-bold text-blue-600">{metrics?.scrollDepth}%</div>
          <p className="text-sm text-gray-500 mt-1">Average page scroll percentage</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Avg. Engagement Time</h3>
          <div className="text-3xl font-bold text-green-600">
            {formatDuration(metrics?.avgEngagementTime || 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Time actively engaging with content</p>
        </div>
      </div>
    </div>
  );

  const renderResearchTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Publications</h3>
          <div className="space-y-3">
            {metrics?.topPublications.map((pub, index) => (
              <div key={pub.title} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{pub.title}</div>
                  <div className="text-xs text-gray-500">{pub.views} views • {pub.downloads} downloads</div>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {pub.citations} citations
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Search Queries</h3>
          <div className="space-y-3">
            {metrics?.searchQueries.map((query, index) => (
              <div key={query.query} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">"{query.query}"</div>
                  <div className="text-xs text-gray-500">{query.count} searches</div>
                </div>
                <div className="text-sm text-gray-700">
                  {Math.round((query.resultClicks / query.count) * 100)}% CTR
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Conversions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics?.conversions.contactForms}</div>
            <div className="text-sm text-gray-500">Contact Forms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics?.conversions.newsletterSignups}</div>
            <div className="text-sm text-gray-500">Newsletter Signups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics?.conversions.publicationDownloads}</div>
            <div className="text-sm text-gray-500">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics?.conversions.socialShares}</div>
            <div className="text-sm text-gray-500">Social Shares</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!adminMode) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-yellow-800">
            <h3 className="font-semibold mb-2">Access Restricted</h3>
            <p className="text-sm">Analytics dashboard is only available in admin mode.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`analytics-dashboard ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📊 Analytics Dashboard</h1>
          
          {/* Time Filter */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(['24h', '7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeFilter === period
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period === '24h' ? 'Last 24h' : 
                   period === '7d' ? 'Last 7 days' :
                   period === '30d' ? 'Last 30 days' : 'Last 90 days'}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-500">
              Updated {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {([
                { id: 'overview', label: 'Overview', icon: '📈' },
                { id: 'performance', label: 'Performance', icon: '⚡' },
                { id: 'engagement', label: 'Engagement', icon: '💫' },
                { id: 'research', label: 'Research', icon: '🔬' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'engagement' && renderEngagementTab()}
          {activeTab === 'research' && renderResearchTab()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;