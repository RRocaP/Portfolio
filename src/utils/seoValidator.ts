/**
 * SEO Validation and Testing Utilities
 * 
 * Provides comprehensive SEO validation, testing, and reporting
 * for the Astro portfolio site.
 */

import type { SEOConfig, SEOAudit } from './seoManager';
import { seoHooks } from './seoHooks';

export interface ValidationRule {
  name: string;
  description: string;
  category: 'meta' | 'structure' | 'content' | 'performance' | 'accessibility';
  severity: 'error' | 'warning' | 'info';
  test: (html: string, config?: SEOConfig) => Promise<ValidationResult>;
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  details?: string;
  suggestion?: string;
  score: number; // 0-100
}

export interface SEOReport {
  url: string;
  timestamp: string;
  overallScore: number;
  categoryScores: {
    meta: number;
    structure: number;
    content: number;
    performance: number;
    accessibility: number;
  };
  results: Array<{
    rule: string;
    category: string;
    severity: string;
    passed: boolean;
    message: string;
    suggestion?: string;
    score: number;
  }>;
  recommendations: string[];
  lighthouse?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

export class SEOValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.initializeRules();
  }

  /**
   * Add a custom validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  /**
   * Validate a page's HTML against all SEO rules
   */
  async validatePage(html: string, config?: SEOConfig): Promise<SEOReport> {
    const results = await Promise.all(
      this.rules.map(async (rule) => ({
        rule: rule.name,
        category: rule.category,
        severity: rule.severity,
        ...await rule.test(html, config)
      }))
    );

    const categoryScores = this.calculateCategoryScores(results);
    const overallScore = Object.values(categoryScores).reduce((a, b) => a + b, 0) / 5;
    const recommendations = this.generateRecommendations(results);

    return {
      url: this.extractUrlFromHtml(html) || 'unknown',
      timestamp: new Date().toISOString(),
      overallScore: Math.round(overallScore),
      categoryScores,
      results,
      recommendations
    };
  }

  /**
   * Generate a comprehensive SEO audit report
   */
  async generateAuditReport(urls: string[]): Promise<{
    summary: {
      totalPages: number;
      averageScore: number;
      criticalIssues: number;
      warnings: number;
    };
    pageReports: SEOReport[];
    globalIssues: string[];
  }> {
    // This would typically fetch and analyze multiple pages
    // For now, we'll create a structure for future implementation
    const pageReports: SEOReport[] = [];
    
    // In a real implementation, you'd fetch each URL and validate
    const totalPages = urls.length;
    const averageScore = pageReports.length > 0 
      ? pageReports.reduce((sum, report) => sum + report.overallScore, 0) / pageReports.length
      : 0;
    
    const criticalIssues = pageReports.reduce((sum, report) => 
      sum + report.results.filter(r => r.severity === 'error' && !r.passed).length, 0);
    
    const warnings = pageReports.reduce((sum, report) => 
      sum + report.results.filter(r => r.severity === 'warning' && !r.passed).length, 0);

    return {
      summary: {
        totalPages,
        averageScore: Math.round(averageScore),
        criticalIssues,
        warnings
      },
      pageReports,
      globalIssues: this.generateGlobalIssues(pageReports)
    };
  }

  /**
   * Validate structured data (JSON-LD)
   */
  async validateStructuredData(html: string): Promise<ValidationResult[]> {
    const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis) || [];
    const results: ValidationResult[] = [];

    for (const match of jsonLdMatches) {
      const jsonMatch = match.match(/>(.*?)<\/script>/is);
      if (!jsonMatch) continue;

      try {
        const data = JSON.parse(jsonMatch[1]);
        const validation = await this.validateJsonLd(data);
        results.push(validation);
      } catch (error) {
        results.push({
          passed: false,
          message: 'Invalid JSON-LD syntax',
          details: error instanceof Error ? error.message : 'Unknown error',
          suggestion: 'Fix JSON-LD syntax errors',
          score: 0
        });
      }
    }

    return results;
  }

  /**
   * Test page performance for SEO impact
   */
  async testPerformanceMetrics(html: string): Promise<{
    criticalResources: number;
    totalRequests: number;
    estimatedLoadTime: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    suggestions: string[];
  }> {
    // Extract resources from HTML
    const cssLinks = (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length;
    const jsScripts = (html.match(/<script[^>]+src=/gi) || []).length;
    const images = (html.match(/<img[^>]+src=/gi) || []).length;
    const fonts = (html.match(/fonts\.googleapis\.com/gi) || []).length;

    const criticalResources = cssLinks + jsScripts;
    const totalRequests = criticalResources + images + fonts;
    
    // Estimate load time based on resource count (simplified)
    const estimatedLoadTime = (totalRequests * 100) + (criticalResources * 200); // ms
    
    // Mock Core Web Vitals (in practice, these would be measured)
    const coreWebVitals = {
      lcp: Math.min(2500, estimatedLoadTime * 0.8), // Target: < 2.5s
      fid: Math.min(100, totalRequests * 2), // Target: < 100ms
      cls: Math.min(0.1, images * 0.01) // Target: < 0.1
    };

    const suggestions: string[] = [];
    if (criticalResources > 10) {
      suggestions.push('Reduce number of render-blocking resources');
    }
    if (coreWebVitals.lcp > 2500) {
      suggestions.push('Optimize Largest Contentful Paint (LCP)');
    }
    if (coreWebVitals.fid > 100) {
      suggestions.push('Improve First Input Delay (FID)');
    }
    if (coreWebVitals.cls > 0.1) {
      suggestions.push('Reduce Cumulative Layout Shift (CLS)');
    }

    return {
      criticalResources,
      totalRequests,
      estimatedLoadTime,
      coreWebVitals,
      suggestions
    };
  }

  /**
   * Generate SEO score based on multiple factors
   */
  calculateSEOScore(html: string, config?: SEOConfig): number {
    let score = 100;

    // Title optimization
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (!titleMatch || titleMatch[1].length < 30 || titleMatch[1].length > 60) {
      score -= 15;
    }

    // Meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
    if (!descMatch || descMatch[1].length < 120 || descMatch[1].length > 160) {
      score -= 15;
    }

    // Headings structure
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    if (h1Count !== 1) score -= 10;

    const headings = html.match(/<h[2-6][^>]*>/gi) || [];
    if (headings.length < 2) score -= 5;

    // Images with alt text
    const images = html.match(/<img[^>]*>/gi) || [];
    const imagesWithoutAlt = images.filter(img => !img.includes('alt='));
    if (imagesWithoutAlt.length > 0) {
      score -= Math.min(20, imagesWithoutAlt.length * 3);
    }

    // Internal links
    const internalLinks = (html.match(/<a[^>]+href=["'][^"']*rrocap\.github\.io[^"']*["']/gi) || []).length;
    if (internalLinks < 3) score -= 5;

    // Structured data
    const jsonLd = html.match(/<script[^>]+type=["']application\/ld\+json["']/gi) || [];
    if (jsonLd.length === 0) score -= 10;

    return Math.max(0, score);
  }

  // Private methods
  private initializeRules(): void {
    // Title optimization rules
    this.rules.push({
      name: 'title-length',
      description: 'Title should be between 30-60 characters',
      category: 'meta',
      severity: 'error',
      test: async (html) => {
        const match = html.match(/<title>(.*?)<\/title>/i);
        const title = match ? match[1].trim() : '';
        const length = title.length;
        const optimal = length >= 30 && length <= 60;
        
        return {
          passed: optimal,
          message: optimal 
            ? `Title length is optimal (${length} characters)`
            : `Title length is ${length < 30 ? 'too short' : 'too long'} (${length} characters)`,
          suggestion: optimal ? undefined : 'Optimize title to be between 30-60 characters',
          score: optimal ? 100 : Math.max(0, 100 - Math.abs(45 - length) * 2)
        };
      }
    });

    // Meta description rules
    this.rules.push({
      name: 'meta-description',
      description: 'Meta description should be between 120-160 characters',
      category: 'meta',
      severity: 'error',
      test: async (html) => {
        const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
        const description = match ? match[1].trim() : '';
        const length = description.length;
        const optimal = length >= 120 && length <= 160;
        
        return {
          passed: optimal && description.length > 0,
          message: description.length === 0 
            ? 'Missing meta description'
            : optimal 
              ? `Meta description length is optimal (${length} characters)`
              : `Meta description is ${length < 120 ? 'too short' : 'too long'} (${length} characters)`,
          suggestion: description.length === 0 
            ? 'Add a compelling meta description'
            : optimal ? undefined : 'Optimize meta description to be between 120-160 characters',
          score: description.length === 0 ? 0 : optimal ? 100 : Math.max(0, 100 - Math.abs(140 - length))
        };
      }
    });

    // Heading structure rules
    this.rules.push({
      name: 'heading-structure',
      description: 'Page should have proper heading hierarchy',
      category: 'structure',
      severity: 'warning',
      test: async (html) => {
        const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
        const headings = html.match(/<h[1-6][^>]*>/gi) || [];
        
        const hasUniqueH1 = h1Count === 1;
        const hasSufficientHeadings = headings.length >= 2;
        const passed = hasUniqueH1 && hasSufficientHeadings;
        
        let message = '';
        if (h1Count === 0) message = 'Missing H1 heading';
        else if (h1Count > 1) message = `Multiple H1 headings found (${h1Count})`;
        else if (!hasSufficientHeadings) message = 'Insufficient heading structure';
        else message = 'Good heading structure';
        
        return {
          passed,
          message,
          suggestion: passed ? undefined : 'Use exactly one H1 and create a logical heading hierarchy',
          score: passed ? 100 : hasUniqueH1 ? 70 : 40
        };
      }
    });

    // Image optimization rules
    this.rules.push({
      name: 'image-alt-text',
      description: 'All images should have descriptive alt text',
      category: 'accessibility',
      severity: 'warning',
      test: async (html) => {
        const images = html.match(/<img[^>]*>/gi) || [];
        const imagesWithoutAlt = images.filter(img => !img.includes('alt=') || img.includes('alt=""'));
        const totalImages = images.length;
        const passed = imagesWithoutAlt.length === 0;
        
        return {
          passed,
          message: passed 
            ? `All ${totalImages} images have alt text`
            : `${imagesWithoutAlt.length} of ${totalImages} images missing alt text`,
          suggestion: passed ? undefined : 'Add descriptive alt text to all images',
          score: totalImages === 0 ? 100 : Math.round((totalImages - imagesWithoutAlt.length) / totalImages * 100)
        };
      }
    });

    // Canonical URL rules
    this.rules.push({
      name: 'canonical-url',
      description: 'Page should have a canonical URL',
      category: 'meta',
      severity: 'warning',
      test: async (html) => {
        const hasCanonical = html.includes('rel="canonical"');
        return {
          passed: hasCanonical,
          message: hasCanonical ? 'Canonical URL present' : 'Missing canonical URL',
          suggestion: hasCanonical ? undefined : 'Add canonical URL to prevent duplicate content issues',
          score: hasCanonical ? 100 : 60
        };
      }
    });

    // Structured data rules
    this.rules.push({
      name: 'structured-data',
      description: 'Page should include structured data (JSON-LD)',
      category: 'structure',
      severity: 'info',
      test: async (html) => {
        const jsonLdCount = (html.match(/<script[^>]+type=["']application\/ld\+json["']/gi) || []).length;
        const passed = jsonLdCount > 0;
        
        return {
          passed,
          message: passed 
            ? `${jsonLdCount} structured data blocks found`
            : 'No structured data found',
          suggestion: passed ? undefined : 'Add JSON-LD structured data for better search engine understanding',
          score: passed ? 100 : 80
        };
      }
    });
  }

  private async validateJsonLd(data: any): Promise<ValidationResult> {
    // Basic JSON-LD validation
    if (!data['@context']) {
      return {
        passed: false,
        message: 'Missing @context in JSON-LD',
        suggestion: 'Add @context property to JSON-LD',
        score: 0
      };
    }

    if (!data['@type']) {
      return {
        passed: false,
        message: 'Missing @type in JSON-LD',
        suggestion: 'Add @type property to JSON-LD',
        score: 20
      };
    }

    // Validate specific schema types
    if (data['@type'] === 'Person') {
      const requiredFields = ['name', 'jobTitle'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        return {
          passed: false,
          message: `Person schema missing required fields: ${missingFields.join(', ')}`,
          suggestion: 'Add missing required fields to Person schema',
          score: Math.max(0, 100 - missingFields.length * 25)
        };
      }
    }

    return {
      passed: true,
      message: 'Valid JSON-LD structured data',
      score: 100
    };
  }

  private calculateCategoryScores(results: any[]): SEOReport['categoryScores'] {
    const categories = ['meta', 'structure', 'content', 'performance', 'accessibility'] as const;
    const scores: any = {};

    categories.forEach(category => {
      const categoryResults = results.filter(r => r.category === category);
      if (categoryResults.length === 0) {
        scores[category] = 100;
        return;
      }
      
      const totalScore = categoryResults.reduce((sum, r) => sum + r.score, 0);
      scores[category] = Math.round(totalScore / categoryResults.length);
    });

    return scores;
  }

  private generateRecommendations(results: any[]): string[] {
    const recommendations: string[] = [];
    const failedResults = results.filter(r => !r.passed && r.severity === 'error');
    const warnings = results.filter(r => !r.passed && r.severity === 'warning');

    // Priority recommendations for errors
    failedResults.forEach(result => {
      if (result.suggestion) {
        recommendations.push(`🔴 ${result.suggestion}`);
      }
    });

    // Secondary recommendations for warnings
    warnings.slice(0, 3).forEach(result => {
      if (result.suggestion) {
        recommendations.push(`🟡 ${result.suggestion}`);
      }
    });

    return recommendations;
  }

  private generateGlobalIssues(reports: SEOReport[]): string[] {
    const issues: string[] = [];
    
    // Check for common issues across pages
    const lowPerformancePages = reports.filter(r => r.categoryScores.performance < 70).length;
    if (lowPerformancePages > 0) {
      issues.push(`${lowPerformancePages} pages have performance issues`);
    }

    const missingStructuredData = reports.filter(r => 
      r.results.some(res => res.rule === 'structured-data' && !res.passed)
    ).length;
    if (missingStructuredData > 0) {
      issues.push(`${missingStructuredData} pages missing structured data`);
    }

    return issues;
  }

  private extractUrlFromHtml(html: string): string | null {
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)/i);
    if (canonicalMatch) return canonicalMatch[1];
    
    const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)/i);
    if (ogUrlMatch) return ogUrlMatch[1];
    
    return null;
  }
}

// Export singleton instance and utility functions
export const seoValidator = new SEOValidator();
export const validatePage = (html: string, config?: SEOConfig) => seoValidator.validatePage(html, config);
export const calculateSEOScore = (html: string, config?: SEOConfig) => seoValidator.calculateSEOScore(html, config);
export const testPerformance = (html: string) => seoValidator.testPerformanceMetrics(html);