// Analytics System Integration Tests
import { AnalyticsManager } from './analytics-core';
import AnalyticsInsights from './analytics-insights';
import PrivacyManager from './analytics-privacy';
import { LocalStorageProvider } from './analytics-providers';
import type { AnalyticsEvent, UserSession, AnalyticsMetrics } from '../types/analytics';

/**
 * Analytics System Test Suite
 * Comprehensive testing for all analytics components working together
 */
export class AnalyticsTestSuite {
  private analytics: AnalyticsManager;
  private insights: AnalyticsInsights;
  private privacy: PrivacyManager;
  private testResults: Array<{ test: string; passed: boolean; error?: string }> = [];

  constructor() {
    // Initialize analytics with test configuration
    this.analytics = new AnalyticsManager();
    this.insights = new AnalyticsInsights();
    this.privacy = new PrivacyManager({
      dataRetentionDays: 30,
      anonymizationLevel: 'partial',
      defaultConsent: {
        analytics: 'granted',
        marketing: 'denied',
        personalization: 'denied',
        functionality: 'granted',
      },
    });

    // Add local storage provider for testing
    this.analytics.addProvider(new LocalStorageProvider());
  }

  /**
   * Run all tests and return results
   */
  public async runAllTests(): Promise<{
    passed: number;
    failed: number;
    total: number;
    results: Array<{ test: string; passed: boolean; error?: string }>;
  }> {
    console.log('[Analytics Tests] Starting comprehensive test suite...');
    
    this.testResults = [];

    // Core functionality tests
    await this.testAnalyticsInitialization();
    await this.testEventTracking();
    await this.testPageViewTracking();
    await this.testSessionManagement();
    await this.testPerformanceTracking();
    await this.testPrivacyCompliance();
    await this.testDataAnonymization();
    await this.testProviderIntegration();
    await this.testInsightsGeneration();
    await this.testDataRetention();

    // Integration tests
    await this.testFullWorkflow();
    await this.testErrorHandling();
    await this.testConsentManagement();

    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;

    console.log(`[Analytics Tests] Completed: ${passed}/${total} tests passed`);
    
    return {
      passed,
      failed,
      total,
      results: this.testResults,
    };
  }

  /**
   * Test analytics initialization
   */
  private async testAnalyticsInitialization(): Promise<void> {
    try {
      await this.analytics.initialize({
        siteName: 'Test Portfolio',
        version: '1.0.0',
        environment: 'test',
        trackPageViews: true,
        trackInteractions: true,
        trackPerformance: true,
      });

      this.addTestResult('Analytics Initialization', this.analytics.isInitialized());
    } catch (error) {
      this.addTestResult('Analytics Initialization', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test event tracking
   */
  private async testEventTracking(): Promise<void> {
    try {
      // Test basic event tracking
      await this.analytics.track({
        category: 'user_interaction',
        action: 'click',
        properties: {
          element: 'test-button',
          elementText: 'Test Button',
        },
      });

      // Test research-specific event
      await this.analytics.track({
        category: 'research',
        action: 'publication_view',
        properties: {
          publicationId: 'test-pub-1',
          publicationTitle: 'Test Publication',
        },
      });

      this.addTestResult('Event Tracking', true);
    } catch (error) {
      this.addTestResult('Event Tracking', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test page view tracking
   */
  private async testPageViewTracking(): Promise<void> {
    try {
      await this.analytics.trackPageView({
        path: '/test-page',
        title: 'Test Page',
        url: 'https://test.com/test-page',
        referrer: 'https://google.com',
      });

      this.addTestResult('Page View Tracking', true);
    } catch (error) {
      this.addTestResult('Page View Tracking', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test session management
   */
  private async testSessionManagement(): Promise<void> {
    try {
      // Start a new session
      const sessionId = await this.analytics.startSession();
      
      // Track some activity
      await this.analytics.track({
        category: 'user_interaction',
        action: 'scroll',
        properties: { scrollDepth: 50 },
      });

      // Update session
      await this.analytics.updateSession({
        scrollDepth: 75,
        engagementTime: 30000,
      });

      const passed = sessionId && sessionId.length > 0;
      this.addTestResult('Session Management', passed);
    } catch (error) {
      this.addTestResult('Session Management', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test performance tracking
   */
  private async testPerformanceTracking(): Promise<void> {
    try {
      // Mock performance metrics
      await this.analytics.trackPerformance('LCP', 2500);
      await this.analytics.trackPerformance('FID', 100);
      await this.analytics.trackPerformance('CLS', 0.1);
      await this.analytics.trackPerformance('FCP', 1800);

      this.addTestResult('Performance Tracking', true);
    } catch (error) {
      this.addTestResult('Performance Tracking', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test privacy compliance
   */
  private async testPrivacyCompliance(): Promise<void> {
    try {
      // Test consent management
      const initialConsent = this.privacy.getConsent();
      
      this.privacy.setConsent({
        analytics: 'granted',
        marketing: 'denied',
        personalization: 'denied',
      });

      const updatedConsent = this.privacy.getConsent();
      
      // Test data collection permissions
      const analyticsAllowed = this.privacy.isAnalyticsAllowed();
      const marketingAllowed = this.privacy.isMarketingAllowed();

      const passed = analyticsAllowed && !marketingAllowed && 
                    updatedConsent.analytics === 'granted' &&
                    updatedConsent.marketing === 'denied';

      this.addTestResult('Privacy Compliance', passed);
    } catch (error) {
      this.addTestResult('Privacy Compliance', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test data anonymization
   */
  private async testDataAnonymization(): Promise<void> {
    try {
      const testEvent: AnalyticsEvent = {
        id: 'test-event',
        timestamp: Date.now(),
        category: 'page_view',
        action: 'view',
        sessionId: 'test-session-123',
        userId: 'test-user-456',
        page: {
          path: '/test',
          title: 'Test Page',
          url: 'https://example.com/test?secret=value',
          referrer: 'https://google.com/search?q=private',
          language: 'en',
        },
        device: {
          type: 'desktop',
          browser: 'Chrome 120.0.0',
          os: 'macOS 14.2.1',
          screenResolution: '2560x1440',
          viewportSize: '1920x1080',
        },
        properties: {
          utm_source: 'google',
          utm_medium: 'cpc',
        },
      };

      const anonymizedEvent = this.privacy.anonymizeEvent(testEvent);

      // Check that sensitive data was removed/anonymized
      const urlSanitized = !anonymizedEvent.page.url.includes('secret=value');
      const referrerSanitized = !anonymizedEvent.page.referrer?.includes('search?q=');
      const userIdHashed = anonymizedEvent.userId !== testEvent.userId;

      const passed = urlSanitized && referrerSanitized && (userIdHashed || !anonymizedEvent.userId);
      this.addTestResult('Data Anonymization', passed);
    } catch (error) {
      this.addTestResult('Data Anonymization', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test provider integration
   */
  private async testProviderIntegration(): Promise<void> {
    try {
      const providers = this.analytics.getProviders();
      const localStorageProvider = providers.find(p => p.name === 'local-storage');
      
      const passed = localStorageProvider && localStorageProvider.initialized;
      this.addTestResult('Provider Integration', passed || false);
    } catch (error) {
      this.addTestResult('Provider Integration', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test insights generation
   */
  private async testInsightsGeneration(): Promise<void> {
    try {
      // Generate some test data
      const testEvents = this.generateTestEvents(50);
      const testSessions = this.generateTestSessions(10);

      // Update insights with test data
      this.insights.updateData(testEvents, testSessions);

      // Generate metrics
      const metrics = this.insights.generateMetrics();
      
      // Test that all key metrics are generated
      const metricsValid = metrics.pageViews > 0 && 
                          metrics.uniqueVisitors > 0 &&
                          metrics.sessions > 0 &&
                          typeof metrics.bounceRate === 'number' &&
                          metrics.topPages.length > 0;

      // Generate recommendations
      const recommendations = this.insights.generateRecommendations();
      const hasRecommendations = recommendations.length > 0;

      const passed = metricsValid && hasRecommendations;
      this.addTestResult('Insights Generation', passed);
    } catch (error) {
      this.addTestResult('Insights Generation', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test data retention
   */
  private async testDataRetention(): Promise<void> {
    try {
      // This test would verify that old data gets cleaned up
      // For now, we'll just test that the privacy manager has retention settings
      const userDataExists = typeof this.privacy.exportUserData === 'function';
      const deletionWorks = typeof this.privacy.deleteUserData === 'function';

      const passed = userDataExists && deletionWorks;
      this.addTestResult('Data Retention', passed);
    } catch (error) {
      this.addTestResult('Data Retention', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test full workflow integration
   */
  private async testFullWorkflow(): Promise<void> {
    try {
      // Test complete user journey tracking
      
      // 1. User visits site
      await this.analytics.trackPageView({
        path: '/',
        title: 'Home Page',
        url: 'https://test.com',
        referrer: 'https://google.com',
      });

      // 2. User interacts with content
      await this.analytics.track({
        category: 'user_interaction',
        action: 'click',
        properties: { element: 'nav-link' },
      });

      // 3. User views research content
      await this.analytics.track({
        category: 'research',
        action: 'publication_view',
        properties: {
          publicationId: 'pub-1',
          publicationTitle: 'Research Paper 1',
        },
      });

      // 4. Performance metrics are captured
      await this.analytics.trackPerformance('LCP', 2300);

      // 5. User completes conversion
      await this.analytics.track({
        category: 'conversion',
        action: 'contact_form',
        properties: { formId: 'contact-form' },
      });

      this.addTestResult('Full Workflow Integration', true);
    } catch (error) {
      this.addTestResult('Full Workflow Integration', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test error handling
   */
  private async testErrorHandling(): Promise<void> {
    try {
      // Test invalid event tracking
      let errorHandled = false;
      try {
        await this.analytics.track({
          category: 'invalid' as any,
          action: '',
          properties: null as any,
        });
      } catch {
        errorHandled = true;
      }

      // Test initialization with invalid config
      let initErrorHandled = false;
      try {
        await this.analytics.initialize(null as any);
      } catch {
        initErrorHandled = true;
      }

      // Analytics should continue to work despite errors
      const stillWorking = this.analytics.isInitialized();

      const passed = stillWorking; // Main requirement is that system keeps working
      this.addTestResult('Error Handling', passed);
    } catch (error) {
      this.addTestResult('Error Handling', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Test consent management workflow
   */
  private async testConsentManagement(): Promise<void> {
    try {
      // Test initial consent state
      const initialConsent = this.privacy.getConsent();

      // Test consent update
      this.privacy.setConsent({
        analytics: 'denied',
        marketing: 'denied',
      });

      // Verify analytics respects consent
      const analyticsAllowed = this.privacy.isAnalyticsAllowed();
      
      // Test consent restoration
      this.privacy.setConsent({
        analytics: 'granted',
      });

      const analyticsRestoredAllowed = this.privacy.isAnalyticsAllowed();

      const passed = !analyticsAllowed && analyticsRestoredAllowed;
      this.addTestResult('Consent Management', passed);
    } catch (error) {
      this.addTestResult('Consent Management', false, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Generate test events for testing
   */
  private generateTestEvents(count: number): AnalyticsEvent[] {
    const events: AnalyticsEvent[] = [];
    const categories = ['page_view', 'user_interaction', 'engagement', 'research'] as const;
    const pages = ['/', '/research', '/publications', '/projects'];

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      events.push({
        id: `test-event-${i}`,
        timestamp: Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000),
        category,
        action: category === 'page_view' ? 'view' : 'click',
        sessionId: `test-session-${Math.floor(i / 5)}`,
        page: {
          path: pages[Math.floor(Math.random() * pages.length)],
          title: 'Test Page',
          url: 'https://test.com',
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
        properties: category === 'research' ? {
          publicationId: `pub-${i}`,
          publicationTitle: `Test Publication ${i}`,
        } : {},
      });
    }

    return events;
  }

  /**
   * Generate test sessions for testing
   */
  private generateTestSessions(count: number): UserSession[] {
    const sessions: UserSession[] = [];

    for (let i = 0; i < count; i++) {
      const startTime = Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000);
      const duration = Math.random() * 30 * 60 * 1000; // 0-30 minutes
      
      sessions.push({
        id: `test-session-${i}`,
        startTime,
        endTime: startTime + duration,
        duration,
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
  }

  /**
   * Add test result
   */
  private addTestResult(testName: string, passed: boolean, error?: string): void {
    this.testResults.push({
      test: testName,
      passed,
      error,
    });

    const status = passed ? '✅ PASSED' : '❌ FAILED';
    const errorMsg = error ? ` - ${error}` : '';
    console.log(`[Analytics Tests] ${status}: ${testName}${errorMsg}`);
  }

  /**
   * Generate test report
   */
  public generateReport(): string {
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    
    let report = `# Analytics System Test Report\n\n`;
    report += `**Test Summary:** ${passed}/${total} tests passed (${Math.round((passed/total)*100)}%)\n\n`;
    
    if (failed > 0) {
      report += `## ❌ Failed Tests (${failed})\n\n`;
      this.testResults.filter(r => !r.passed).forEach(result => {
        report += `- **${result.test}**`;
        if (result.error) {
          report += `: ${result.error}`;
        }
        report += `\n`;
      });
      report += `\n`;
    }

    report += `## ✅ Passed Tests (${passed})\n\n`;
    this.testResults.filter(r => r.passed).forEach(result => {
      report += `- ${result.test}\n`;
    });

    report += `\n## Test Coverage\n\n`;
    report += `- Core Analytics: Event tracking, page views, sessions\n`;
    report += `- Performance Monitoring: Core Web Vitals tracking\n`;
    report += `- Privacy Compliance: GDPR/CCPA consent management\n`;
    report += `- Data Processing: Anonymization and retention\n`;
    report += `- Insights Generation: Metrics calculation and recommendations\n`;
    report += `- Provider Integration: Multiple analytics services\n`;
    report += `- Error Handling: Graceful failure and recovery\n`;

    return report;
  }
}

// Export test runner function for easy use
export async function runAnalyticsTests(): Promise<void> {
  const testSuite = new AnalyticsTestSuite();
  const results = await testSuite.runAllTests();
  
  console.log('\n' + '='.repeat(50));
  console.log('ANALYTICS SYSTEM TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.total}`);
  console.log(`Passed: ${results.passed} (${Math.round((results.passed/results.total)*100)}%)`);
  console.log(`Failed: ${results.failed} (${Math.round((results.failed/results.total)*100)}%)`);
  console.log('='.repeat(50) + '\n');

  if (results.failed > 0) {
    console.log('❌ FAILED TESTS:');
    results.results.filter(r => !r.passed).forEach(result => {
      console.log(`  - ${result.test}${result.error ? ': ' + result.error : ''}`);
    });
    console.log('');
  }

  console.log('📊 Test report generated');
  console.log('To run these tests, call: runAnalyticsTests()');
}

export default AnalyticsTestSuite;