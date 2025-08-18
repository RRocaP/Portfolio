#!/usr/bin/env node

/**
 * SEO Audit Script
 * 
 * Comprehensive SEO analysis and reporting for the Portfolio site.
 * Runs validation, generates reports, and provides actionable insights.
 * 
 * Usage:
 *   npm run seo:audit
 *   node scripts/seo-audit.mjs --url=https://rrocap.github.io/Portfolio/
 *   node scripts/seo-audit.mjs --local --port=4321
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  baseUrl: 'https://rrocap.github.io/Portfolio',
  localUrl: 'http://localhost:4321',
  outputDir: path.join(__dirname, '../seo-reports'),
  languages: ['en', 'es', 'ca'],
  pages: [
    '',
    'research/',
    'about/',
    'contact/'
  ]
};

// SEO validation rules (simplified version for Node.js)
const seoRules = {
  async validateTitle(html) {
    const match = html.match(/<title>(.*?)<\/title>/i);
    const title = match ? match[1].trim() : '';
    const length = title.length;
    const optimal = length >= 30 && length <= 60;
    
    return {
      name: 'Title Length',
      passed: optimal,
      score: optimal ? 100 : Math.max(0, 100 - Math.abs(45 - length) * 2),
      message: optimal 
        ? `✅ Title length is optimal (${length} chars)`
        : `❌ Title ${length < 30 ? 'too short' : 'too long'} (${length} chars)`,
      suggestion: optimal ? null : 'Optimize title to 30-60 characters'
    };
  },

  async validateMetaDescription(html) {
    const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
    const description = match ? match[1].trim() : '';
    const length = description.length;
    const optimal = length >= 120 && length <= 160;
    
    return {
      name: 'Meta Description',
      passed: optimal && length > 0,
      score: length === 0 ? 0 : optimal ? 100 : Math.max(0, 100 - Math.abs(140 - length)),
      message: length === 0 
        ? '❌ Missing meta description'
        : optimal 
          ? `✅ Meta description optimal (${length} chars)`
          : `⚠️ Meta description ${length < 120 ? 'too short' : 'too long'} (${length} chars)`,
      suggestion: length === 0 ? 'Add meta description' : optimal ? null : 'Optimize to 120-160 characters'
    };
  },

  async validateHeadings(html) {
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    const allHeadings = (html.match(/<h[1-6][^>]*>/gi) || []).length;
    const passed = h1Count === 1 && allHeadings >= 2;
    
    return {
      name: 'Heading Structure',
      passed,
      score: passed ? 100 : h1Count === 1 ? 70 : 40,
      message: h1Count === 0 
        ? '❌ Missing H1 heading'
        : h1Count > 1 
          ? `❌ Multiple H1 headings (${h1Count})`
          : allHeadings < 2
            ? '⚠️ Insufficient heading structure'
            : '✅ Good heading hierarchy',
      suggestion: passed ? null : 'Use exactly one H1 and create logical hierarchy'
    };
  },

  async validateImages(html) {
    const images = html.match(/<img[^>]*>/gi) || [];
    const imagesWithoutAlt = images.filter(img => !img.includes('alt=') || img.includes('alt=""'));
    const passed = imagesWithoutAlt.length === 0;
    
    return {
      name: 'Image Alt Text',
      passed,
      score: images.length === 0 ? 100 : Math.round((images.length - imagesWithoutAlt.length) / images.length * 100),
      message: passed 
        ? `✅ All ${images.length} images have alt text`
        : `❌ ${imagesWithoutAlt.length}/${images.length} images missing alt text`,
      suggestion: passed ? null : 'Add descriptive alt text to all images'
    };
  },

  async validateCanonical(html) {
    const hasCanonical = html.includes('rel="canonical"');
    return {
      name: 'Canonical URL',
      passed: hasCanonical,
      score: hasCanonical ? 100 : 70,
      message: hasCanonical ? '✅ Canonical URL present' : '⚠️ Missing canonical URL',
      suggestion: hasCanonical ? null : 'Add canonical URL'
    };
  },

  async validateHreflang(html) {
    const hreflangCount = (html.match(/hreflang=/gi) || []).length;
    const hasExpectedCount = hreflangCount >= 4; // en, es, ca, x-default
    
    return {
      name: 'Hreflang Tags',
      passed: hasExpectedCount,
      score: hasExpectedCount ? 100 : Math.max(0, hreflangCount * 25),
      message: hasExpectedCount 
        ? `✅ Complete hreflang setup (${hreflangCount} tags)`
        : `⚠️ Incomplete hreflang (${hreflangCount}/4 expected)`,
      suggestion: hasExpectedCount ? null : 'Add hreflang for all languages'
    };
  },

  async validateStructuredData(html) {
    const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis) || [];
    let validSchemas = 0;
    
    for (const match of jsonLdMatches) {
      try {
        const jsonMatch = match.match(/>(.*?)<\/script>/is);
        if (jsonMatch) {
          JSON.parse(jsonMatch[1]);
          validSchemas++;
        }
      } catch (e) {
        // Invalid JSON-LD
      }
    }
    
    const passed = validSchemas > 0;
    return {
      name: 'Structured Data',
      passed,
      score: passed ? 100 : 80,
      message: passed 
        ? `✅ ${validSchemas} valid JSON-LD schemas`
        : '⚠️ No structured data found',
      suggestion: passed ? null : 'Add JSON-LD structured data'
    };
  },

  async validateOpenGraph(html) {
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    const presentTags = ogTags.filter(tag => html.includes(`property="${tag}"`));
    const passed = presentTags.length === ogTags.length;
    
    return {
      name: 'Open Graph',
      passed,
      score: (presentTags.length / ogTags.length) * 100,
      message: passed 
        ? '✅ Complete Open Graph tags'
        : `⚠️ Missing OG tags: ${ogTags.filter(tag => !presentTags.includes(tag)).join(', ')}`,
      suggestion: passed ? null : 'Add all required Open Graph tags'
    };
  },

  async validatePerformance(html) {
    const cssLinks = (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length;
    const jsScripts = (html.match(/<script[^>]+src=/gi) || []).length;
    const images = (html.match(/<img[^>]+src=/gi) || []).length;
    
    const criticalResources = cssLinks + jsScripts;
    const totalResources = criticalResources + images;
    const score = Math.max(0, 100 - (criticalResources * 5) - (totalResources * 2));
    
    return {
      name: 'Performance Impact',
      passed: criticalResources <= 10,
      score,
      message: criticalResources <= 10 
        ? `✅ Good resource count (${criticalResources} critical, ${totalResources} total)`
        : `⚠️ High resource count (${criticalResources} critical, ${totalResources} total)`,
      suggestion: criticalResources > 10 ? 'Optimize and reduce resource count' : null
    };
  }
};

class SEOAuditor {
  constructor() {
    this.results = new Map();
    this.summaryStats = {
      totalPages: 0,
      avgScore: 0,
      criticalIssues: 0,
      warnings: 0
    };
  }

  async fetchPageContent(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error.message);
      return null;
    }
  }

  async auditPage(url) {
    console.log(`\n🔍 Auditing: ${url}`);
    
    const html = await this.fetchPageContent(url);
    if (!html) {
      return null;
    }

    const results = [];
    let totalScore = 0;

    // Run all SEO rule validations
    for (const [ruleName, ruleFunc] of Object.entries(seoRules)) {
      try {
        const result = await ruleFunc(html);
        results.push(result);
        totalScore += result.score;
      } catch (error) {
        console.error(`Error running rule ${ruleName}:`, error);
      }
    }

    const avgScore = Math.round(totalScore / results.length);
    const criticalIssues = results.filter(r => !r.passed && r.suggestion).length;

    const report = {
      url,
      timestamp: new Date().toISOString(),
      score: avgScore,
      results,
      criticalIssues,
      summary: this.generatePageSummary(results)
    };

    this.results.set(url, report);
    this.updateSummaryStats(report);

    return report;
  }

  generatePageSummary(results) {
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const suggestions = results.filter(r => r.suggestion).map(r => r.suggestion);

    return {
      passed,
      failed,
      total: results.length,
      suggestions
    };
  }

  updateSummaryStats(report) {
    this.summaryStats.totalPages++;
    this.summaryStats.avgScore = Math.round(
      (this.summaryStats.avgScore * (this.summaryStats.totalPages - 1) + report.score) / 
      this.summaryStats.totalPages
    );
    this.summaryStats.criticalIssues += report.criticalIssues;
    this.summaryStats.warnings += report.results.filter(r => !r.passed && !r.suggestion).length;
  }

  async generateReport() {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportData = {
      meta: {
        generated: new Date().toISOString(),
        baseUrl: config.baseUrl,
        toolVersion: '1.0.0'
      },
      summary: this.summaryStats,
      pages: Array.from(this.results.values()),
      recommendations: this.generateGlobalRecommendations()
    };

    // Ensure output directory exists
    await fs.mkdir(config.outputDir, { recursive: true });

    // Write JSON report
    const jsonPath = path.join(config.outputDir, `seo-audit-${timestamp}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(reportData, null, 2));

    // Write HTML report
    const htmlPath = path.join(config.outputDir, `seo-audit-${timestamp}.html`);
    await fs.writeFile(htmlPath, this.generateHtmlReport(reportData));

    return { jsonPath, htmlPath, data: reportData };
  }

  generateGlobalRecommendations() {
    const allResults = Array.from(this.results.values());
    const commonIssues = new Map();

    // Count common issues across pages
    allResults.forEach(report => {
      report.results.forEach(result => {
        if (!result.passed && result.suggestion) {
          const key = result.name;
          commonIssues.set(key, (commonIssues.get(key) || 0) + 1);
        }
      });
    });

    // Generate recommendations for issues affecting multiple pages
    const recommendations = [];
    commonIssues.forEach((count, issue) => {
      if (count > 1) {
        recommendations.push({
          issue,
          affectedPages: count,
          priority: count > allResults.length / 2 ? 'high' : 'medium'
        });
      }
    });

    return recommendations.sort((a, b) => b.affectedPages - a.affectedPages);
  }

  generateHtmlReport(data) {
    const pageRows = data.pages.map(page => `
      <tr class="${page.score < 70 ? 'error' : page.score < 85 ? 'warning' : 'success'}">
        <td><a href="${page.url}" target="_blank">${page.url}</a></td>
        <td>${page.score}/100</td>
        <td>${page.summary.passed}/${page.summary.total}</td>
        <td>${page.criticalIssues}</td>
        <td><small>${new Date(page.timestamp).toLocaleString()}</small></td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Audit Report - ${new Date(data.meta.generated).toLocaleDateString()}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; line-height: 1.6; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
    .stat-value { font-size: 2rem; font-weight: bold; color: #007bff; }
    .stat-label { color: #6c757d; font-size: 0.9rem; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
    th { background-color: #f8f9fa; font-weight: 600; }
    .success { background-color: #d4edda; }
    .warning { background-color: #fff3cd; }
    .error { background-color: #f8d7da; }
    .recommendations { background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
    .rec-item { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .priority-high { border-left: 3px solid #dc3545; }
    .priority-medium { border-left: 3px solid #ffc107; }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 SEO Audit Report</h1>
    <p>Generated: ${new Date(data.meta.generated).toLocaleString()}</p>
    <p>Base URL: ${data.meta.baseUrl}</p>
  </div>

  <div class="summary">
    <div class="stat">
      <div class="stat-value">${data.summary.totalPages}</div>
      <div class="stat-label">Pages Audited</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.summary.avgScore}/100</div>
      <div class="stat-label">Average Score</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.summary.criticalIssues}</div>
      <div class="stat-label">Critical Issues</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.summary.warnings}</div>
      <div class="stat-label">Warnings</div>
    </div>
  </div>

  <h2>📊 Page Results</h2>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Score</th>
        <th>Tests Passed</th>
        <th>Issues</th>
        <th>Audited</th>
      </tr>
    </thead>
    <tbody>
      ${pageRows}
    </tbody>
  </table>

  <div class="recommendations">
    <h2>💡 Global Recommendations</h2>
    ${data.recommendations.map(rec => `
      <div class="rec-item priority-${rec.priority}">
        <strong>${rec.issue}</strong> - Affects ${rec.affectedPages} pages
      </div>
    `).join('')}
  </div>

  <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 0.9rem;">
    <p>Generated by Portfolio SEO Auditor v${data.meta.toolVersion}</p>
  </footer>
</body>
</html>`;
  }

  async printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 SEO AUDIT SUMMARY');
    console.log('='.repeat(60));
    console.log(`📄 Pages Audited: ${this.summaryStats.totalPages}`);
    console.log(`📈 Average Score: ${this.summaryStats.avgScore}/100`);
    console.log(`🚨 Critical Issues: ${this.summaryStats.criticalIssues}`);
    console.log(`⚠️  Warnings: ${this.summaryStats.warnings}`);

    console.log('\n📝 Page Details:');
    this.results.forEach((report, url) => {
      const status = report.score >= 85 ? '✅' : report.score >= 70 ? '⚠️' : '❌';
      console.log(`${status} ${url}: ${report.score}/100 (${report.summary.passed}/${report.summary.total} tests passed)`);
      
      if (report.summary.suggestions.length > 0) {
        report.summary.suggestions.slice(0, 2).forEach(suggestion => {
          console.log(`   💡 ${suggestion}`);
        });
      }
    });
  }
}

// Main execution
async function main() {
  const auditor = new SEOAuditor();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const isLocal = args.includes('--local');
  const customUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];
  
  const baseUrl = customUrl || (isLocal ? config.localUrl : config.baseUrl);
  
  console.log('🚀 Starting SEO Audit...');
  console.log(`🌐 Base URL: ${baseUrl}`);
  
  // Build list of URLs to audit
  const urlsToAudit = [];
  
  for (const lang of config.languages) {
    for (const page of config.pages) {
      const url = `${baseUrl}/${lang}/${page}`;
      urlsToAudit.push(url);
    }
  }

  // Audit each page
  for (const url of urlsToAudit) {
    await auditor.auditPage(url);
    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Generate and save reports
  const { jsonPath, htmlPath } = await auditor.generateReport();
  
  // Print results to console
  await auditor.printResults();
  
  console.log('\n📋 Reports Generated:');
  console.log(`📄 JSON: ${jsonPath}`);
  console.log(`🌐 HTML: ${htmlPath}`);
  console.log('\n✨ Audit Complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default SEOAuditor;