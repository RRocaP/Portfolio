#!/usr/bin/env node

/**
 * Lighthouse Performance Audit Script
 * Generates a comprehensive performance report for the portfolio site
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'http://localhost:4321'; // Local dev server
const PAGES = ['/', '/en/', '/es/', '/ca/'];

console.log('🔍 Lighthouse Performance Audit\n');
console.log('================================\n');

async function runLighthouseAudit(url, outputName) {
  console.log(`\n📊 Auditing: ${url}`);
  
  const outputPath = path.join(__dirname, `lighthouse-reports/${outputName}`);
  
  try {
    // Run Lighthouse CLI
    const command = `npx lighthouse ${url} \
      --output=html,json \
      --output-path="${outputPath}" \
      --chrome-flags="--headless" \
      --only-categories=performance,accessibility,best-practices,seo \
      --throttling-method=simulate \
      --quiet`;
    
    await execAsync(command);
    
    // Read the JSON report
    const jsonReport = JSON.parse(
      fs.readFileSync(`${outputPath}.report.json`, 'utf8')
    );
    
    // Extract scores
    const scores = {
      performance: Math.round(jsonReport.categories.performance.score * 100),
      accessibility: Math.round(jsonReport.categories.accessibility.score * 100),
      bestPractices: Math.round(jsonReport.categories['best-practices'].score * 100),
      seo: Math.round(jsonReport.categories.seo.score * 100)
    };
    
    // Core Web Vitals
    const metrics = {
      FCP: jsonReport.audits['first-contentful-paint'].displayValue,
      LCP: jsonReport.audits['largest-contentful-paint'].displayValue,
      TBT: jsonReport.audits['total-blocking-time'].displayValue,
      CLS: jsonReport.audits['cumulative-layout-shift'].displayValue,
      SI: jsonReport.audits['speed-index'].displayValue
    };
    
    console.log(`\n   📈 Scores:`);
    console.log(`   Performance:    ${getScoreEmoji(scores.performance)} ${scores.performance}/100`);
    console.log(`   Accessibility:  ${getScoreEmoji(scores.accessibility)} ${scores.accessibility}/100`);
    console.log(`   Best Practices: ${getScoreEmoji(scores.bestPractices)} ${scores.bestPractices}/100`);
    console.log(`   SEO:           ${getScoreEmoji(scores.seo)} ${scores.seo}/100`);
    
    console.log(`\n   ⚡ Core Web Vitals:`);
    console.log(`   FCP: ${metrics.FCP}`);
    console.log(`   LCP: ${metrics.LCP}`);
    console.log(`   TBT: ${metrics.TBT}`);
    console.log(`   CLS: ${metrics.CLS}`);
    console.log(`   Speed Index: ${metrics.SI}`);
    
    return { url, scores, metrics };
  } catch (error) {
    console.error(`   ❌ Error auditing ${url}:`, error.message);
    return null;
  }
}

function getScoreEmoji(score) {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟡';
  return '🔴';
}

async function generateSummaryReport(results) {
  const validResults = results.filter(r => r !== null);
  
  if (validResults.length === 0) {
    console.log('\n❌ No successful audits to summarize');
    return;
  }
  
  // Calculate averages
  const avgScores = {
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0
  };
  
  validResults.forEach(result => {
    avgScores.performance += result.scores.performance;
    avgScores.accessibility += result.scores.accessibility;
    avgScores.bestPractices += result.scores.bestPractices;
    avgScores.seo += result.scores.seo;
  });
  
  Object.keys(avgScores).forEach(key => {
    avgScores[key] = Math.round(avgScores[key] / validResults.length);
  });
  
  // Generate markdown report
  const report = `# 📊 Lighthouse Performance Report

## Summary
Generated: ${new Date().toISOString()}

## Overall Scores (Average)
- **Performance:** ${getScoreEmoji(avgScores.performance)} ${avgScores.performance}/100
- **Accessibility:** ${getScoreEmoji(avgScores.accessibility)} ${avgScores.accessibility}/100
- **Best Practices:** ${getScoreEmoji(avgScores.bestPractices)} ${avgScores.bestPractices}/100
- **SEO:** ${getScoreEmoji(avgScores.seo)} ${avgScores.seo}/100

## Page-by-Page Results

${validResults.map(r => `
### ${r.url}
**Scores:**
- Performance: ${r.scores.performance}/100
- Accessibility: ${r.scores.accessibility}/100
- Best Practices: ${r.scores.bestPractices}/100
- SEO: ${r.scores.seo}/100

**Core Web Vitals:**
- FCP: ${r.metrics.FCP}
- LCP: ${r.metrics.LCP}
- TBT: ${r.metrics.TBT}
- CLS: ${r.metrics.CLS}
- Speed Index: ${r.metrics.SI}
`).join('\n')}

## Recommendations

${avgScores.performance < 90 ? '- ⚠️ Performance needs improvement. Review bundle sizes and optimize critical rendering path.\n' : ''}
${avgScores.accessibility < 90 ? '- ⚠️ Accessibility can be improved. Check ARIA labels and color contrast.\n' : ''}
${avgScores.bestPractices < 90 ? '- ⚠️ Review best practices. Check for HTTPS, console errors, and deprecated APIs.\n' : ''}
${avgScores.seo < 90 ? '- ⚠️ SEO optimization needed. Review meta tags and structured data.\n' : ''}

## Status
${avgScores.performance >= 90 && avgScores.accessibility >= 90 && avgScores.bestPractices >= 90 && avgScores.seo >= 90 
  ? '✅ **All metrics are excellent! Site is production-ready.**' 
  : '⚠️ **Some metrics need improvement before production deployment.**'}
`;

  // Save report
  fs.writeFileSync(
    path.join(__dirname, 'LIGHTHOUSE_REPORT.md'),
    report
  );
  
  console.log('\n\n📝 Summary Report Generated: LIGHTHOUSE_REPORT.md');
  
  // Display summary
  console.log('\n🎯 Overall Average Scores:');
  console.log('==========================');
  console.log(`Performance:    ${getScoreEmoji(avgScores.performance)} ${avgScores.performance}/100`);
  console.log(`Accessibility:  ${getScoreEmoji(avgScores.accessibility)} ${avgScores.accessibility}/100`);
  console.log(`Best Practices: ${getScoreEmoji(avgScores.bestPractices)} ${avgScores.bestPractices}/100`);
  console.log(`SEO:           ${getScoreEmoji(avgScores.seo)} ${avgScores.seo}/100`);
}

async function main() {
  // Create reports directory
  const reportsDir = path.join(__dirname, 'lighthouse-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }
  
  console.log('Note: Make sure the dev server is running (npm run dev)\n');
  
  // Run audits for all pages
  const results = [];
  for (let i = 0; i < PAGES.length; i++) {
    const page = PAGES[i];
    const outputName = page === '/' ? 'index' : page.replace(/\//g, '');
    const result = await runLighthouseAudit(SITE_URL + page, outputName);
    results.push(result);
  }
  
  // Generate summary report
  await generateSummaryReport(results);
  
  console.log('\n✨ Lighthouse audit complete!');
  console.log('View detailed reports in: lighthouse-reports/');
}

// Run the audit
main().catch(console.error);