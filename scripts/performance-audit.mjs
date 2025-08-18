#!/usr/bin/env node
/**
 * Enhanced Performance Audit Script
 * Comprehensive performance validation that extends the budget checking system
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error('❌ dist/ not found. Run build first.');
  process.exit(1);
}

// Performance audit configuration
const PERFORMANCE_BUDGETS = {
  // File size budgets (in bytes)
  sizes: {
    script: 200 * 1024,      // 200KB total JS
    stylesheet: 80 * 1024,   // 80KB total CSS
    image: 500 * 1024,       // 500KB total images
    font: 100 * 1024,        // 100KB total fonts
    total: 1024 * 1024       // 1MB total
  },
  
  // File count budgets
  counts: {
    script: 5,               // Max 5 JS files
    stylesheet: 10,          // Max 10 CSS files
    font: 4                  // Max 4 font files
  },
  
  // Runtime performance budgets (estimated)
  runtime: {
    lcp: 2500,               // LCP target: 2.5s
    fid: 100,                // FID target: 100ms
    cls: 0.1,                // CLS target: 0.1
    fcp: 1800,               // FCP target: 1.8s
    ttfb: 800                // TTFB target: 800ms
  }
};

const FILE_EXTENSIONS = {
  script: ['.js', '.mjs'],
  stylesheet: ['.css'],
  image: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif'],
  font: ['.woff', '.woff2', '.ttf', '.otf', '.eot']
};

// Results tracking
const results = {
  sizes: { script: 0, stylesheet: 0, image: 0, font: 0, total: 0 },
  counts: { script: 0, stylesheet: 0, font: 0 },
  files: [],
  violations: [],
  recommendations: []
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  for (const [type, extensions] of Object.entries(FILE_EXTENSIONS)) {
    if (extensions.includes(ext)) return type;
  }
  return 'other';
}

function analyzeDirectory(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      analyzeDirectory(fullPath);
    } else {
      const type = getFileType(fullPath);
      const relativePath = path.relative(dist, fullPath);
      
      results.files.push({
        path: relativePath,
        type,
        size: stats.size,
        gzipEstimate: Math.ceil(stats.size * 0.3) // Rough gzip estimate
      });
      
      if (results.sizes[type] !== undefined) {
        results.sizes[type] += stats.size;
      }
      results.sizes.total += stats.size;
      
      if (results.counts[type] !== undefined) {
        results.counts[type]++;
      }
    }
  }
}

function checkBudgets() {
  console.log('🔍 Checking Performance Budgets...\n');
  
  // Size budget checks
  for (const [type, actual] of Object.entries(results.sizes)) {
    const budget = PERFORMANCE_BUDGETS.sizes[type];
    if (budget && actual > budget) {
      const overage = actual - budget;
      results.violations.push({
        type: 'size',
        category: type,
        actual,
        budget,
        overage,
        severity: overage > budget * 0.5 ? 'high' : 'medium'
      });
      
      console.log(`❌ ${type} size budget exceeded: ${formatBytes(actual)} > ${formatBytes(budget)} (+${formatBytes(overage)})`);
    } else if (budget) {
      const utilization = ((actual / budget) * 100).toFixed(1);
      console.log(`✅ ${type} size budget: ${formatBytes(actual)} / ${formatBytes(budget)} (${utilization}%)`);
    }
  }
  
  console.log('');
  
  // Count budget checks
  for (const [type, actual] of Object.entries(results.counts)) {
    const budget = PERFORMANCE_BUDGETS.counts[type];
    if (budget && actual > budget) {
      const overage = actual - budget;
      results.violations.push({
        type: 'count',
        category: type,
        actual,
        budget,
        overage,
        severity: 'medium'
      });
      
      console.log(`❌ ${type} count budget exceeded: ${actual} > ${budget} (+${overage})`);
    } else if (budget) {
      console.log(`✅ ${type} count budget: ${actual} / ${budget}`);
    }
  }
}

function analyzeLargestFiles() {
  console.log('\n📊 Largest Files:');
  
  const sortedFiles = results.files
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  
  for (const file of sortedFiles) {
    const sizeStr = formatBytes(file.size);
    const gzipStr = formatBytes(file.gzipEstimate);
    console.log(`   ${file.path} - ${sizeStr} (${gzipStr} gzipped)`);
    
    // Flag large individual files
    if (file.size > 100 * 1024) { // 100KB
      results.recommendations.push({
        type: 'optimization',
        target: file.path,
        issue: `Large file (${sizeStr})`,
        suggestion: 'Consider code splitting, lazy loading, or compression'
      });
    }
  }
}

function generateRecommendations() {
  console.log('\n💡 Performance Recommendations:');
  
  // File-specific recommendations
  for (const file of results.files) {
    if (file.type === 'image' && file.size > 50 * 1024) {
      results.recommendations.push({
        type: 'image-optimization',
        target: file.path,
        issue: `Large image (${formatBytes(file.size)})`,
        suggestion: 'Optimize with WebP/AVIF, resize appropriately, or implement lazy loading'
      });
    }
    
    if (file.type === 'script' && file.size > 100 * 1024) {
      results.recommendations.push({
        type: 'bundle-optimization',
        target: file.path,
        issue: `Large JavaScript bundle (${formatBytes(file.size)})`,
        suggestion: 'Consider code splitting, tree shaking, or lazy loading'
      });
    }
  }
  
  // General recommendations based on violations
  if (results.violations.some(v => v.category === 'total')) {
    results.recommendations.push({
      type: 'overall-size',
      issue: 'Total bundle size exceeds budget',
      suggestion: 'Implement aggressive code splitting and lazy loading'
    });
  }
  
  if (results.counts.script > 3) {
    results.recommendations.push({
      type: 'script-consolidation',
      issue: `Too many script files (${results.counts.script})`,
      suggestion: 'Bundle related scripts together to reduce HTTP requests'
    });
  }
  
  // Display recommendations
  if (results.recommendations.length === 0) {
    console.log('   🎉 No specific recommendations - performance looks good!');
  } else {
    for (const rec of results.recommendations) {
      console.log(`   • ${rec.issue}`);
      console.log(`     ${rec.suggestion}`);
      if (rec.target) {
        console.log(`     File: ${rec.target}`);
      }
      console.log('');
    }
  }
}

function estimateRuntimePerformance() {
  console.log('⚡ Runtime Performance Estimates:');
  
  const { script: jsSize, stylesheet: cssSize, total: totalSize } = results.sizes;
  
  // Rough estimates based on bundle sizes
  const estimatedLCP = Math.max(1000, totalSize / 1000); // Base 1s + 1ms per KB
  const estimatedFCP = Math.max(800, (jsSize + cssSize) / 1000); // Base 800ms + JS/CSS load time
  const estimatedTTFB = 200; // Assuming good server performance
  
  const estimates = {
    lcp: estimatedLCP,
    fcp: estimatedFCP,
    ttfb: estimatedTTFB
  };
  
  for (const [metric, estimate] of Object.entries(estimates)) {
    const budget = PERFORMANCE_BUDGETS.runtime[metric];
    const status = estimate <= budget ? '✅' : '⚠️';
    const unit = metric === 'cls' ? '' : 'ms';
    
    console.log(`   ${status} ${metric.toUpperCase()}: ~${estimate.toFixed(0)}${unit} (budget: ${budget}${unit})`);
    
    if (estimate > budget) {
      results.violations.push({
        type: 'runtime-estimate',
        category: metric,
        actual: estimate,
        budget,
        severity: 'medium'
      });
    }
  }
}

function saveMetricsSnapshot() {
  // Ensure metrics directory exists
  const metricsDir = path.resolve('metrics');
  if (!fs.existsSync(metricsDir)) {
    fs.mkdirSync(metricsDir, { recursive: true });
  }
  
  const snapshot = {
    timestamp: new Date().toISOString(),
    sizes: results.sizes,
    counts: results.counts,
    violations: results.violations,
    recommendations: results.recommendations.slice(0, 5), // Limit to top 5
    budgets: PERFORMANCE_BUDGETS,
    files: results.files.length
  };
  
  // Update latest snapshot
  fs.writeFileSync(
    path.join(metricsDir, 'performance-audit-latest.json'),
    JSON.stringify(snapshot, null, 2)
  );
  
  // Append to audit log
  fs.appendFileSync(
    path.join(metricsDir, 'performance-audit-log.jsonl'),
    JSON.stringify(snapshot) + '\n'
  );
  
  console.log(`\n📈 Metrics saved to metrics/performance-audit-latest.json`);
}

function generateSummary() {
  const violationsCount = results.violations.length;
  const recommendationsCount = results.recommendations.length;
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 PERFORMANCE AUDIT SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`Total Files: ${results.files.length}`);
  console.log(`Total Size: ${formatBytes(results.sizes.total)}`);
  console.log(`Budget Violations: ${violationsCount}`);
  console.log(`Recommendations: ${recommendationsCount}`);
  
  if (violationsCount === 0) {
    console.log('\n🎉 All performance budgets passed!');
    return 0;
  } else {
    const highSeverity = results.violations.filter(v => v.severity === 'high').length;
    console.log(`\n⚠️  Performance issues detected (${highSeverity} high priority)`);
    return highSeverity > 0 ? 2 : 1;
  }
}

// Main execution
console.log('🚀 Enhanced Performance Audit');
console.log('='.repeat(40));

analyzeDirectory(dist);
checkBudgets();
analyzeLargestFiles();
estimateRuntimePerformance();
generateRecommendations();
saveMetricsSnapshot();

const exitCode = generateSummary();
process.exit(exitCode);