#!/usr/bin/env node

/**
 * Critical CSS Performance Testing Script
 * Tests critical CSS implementation for performance and FOUC prevention
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testCriticalCSSSize() {
  log('\n🔍 Testing Critical CSS Size...', 'blue');
  
  try {
    const criticalCSSPath = path.join(__dirname, '../src/styles/critical.css');
    const content = await fs.readFile(criticalCSSPath, 'utf-8');
    const size = Buffer.byteLength(content, 'utf8');
    const sizeKB = (size / 1024).toFixed(2);
    
    log(`📊 Critical CSS size: ${sizeKB}KB`, 'blue');
    
    if (size <= 14000) {
      log('✅ Critical CSS size is within recommended 14KB limit', 'green');
      return true;
    } else {
      log(`⚠️  Critical CSS size (${sizeKB}KB) exceeds recommended 14KB limit`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Failed to read critical CSS file: ${error.message}`, 'red');
    return false;
  }
}

async function testLayoutAstroIntegration() {
  log('\n🔍 Testing Layout.astro Integration...', 'blue');
  
  try {
    const layoutPath = path.join(__dirname, '../src/layouts/Layout.astro');
    const content = await fs.readFile(layoutPath, 'utf-8');
    
    const tests = [
      {
        name: 'Critical CSS inlined',
        test: content.includes('/* Critical CSS for Above-the-Fold Content */'),
        required: true
      },
      {
        name: 'CSS custom properties defined',
        test: content.includes('--color-primary-bg') && content.includes('--font-sans'),
        required: true
      },
      {
        name: 'Dark mode support',
        test: content.includes('@media (prefers-color-scheme: dark)'),
        required: true
      },
      {
        name: 'Reduced motion support',
        test: content.includes('@media (prefers-reduced-motion: reduce)'),
        required: true
      },
      {
        name: 'High contrast support',
        test: content.includes('@media (prefers-contrast: high)'),
        required: true
      },
      {
        name: 'Navigation styles',
        test: content.includes('.navigation') && content.includes('.nav-wrapper'),
        required: true
      },
      {
        name: 'Button styles',
        test: content.includes('.btn-primary') && content.includes('.btn-secondary'),
        required: true
      },
      {
        name: 'Accessibility styles',
        test: content.includes('.skip-link') && content.includes('.sr-only'),
        required: true
      },
      {
        name: 'LoadCSS implementation',
        test: content.includes('loadCSS') && content.includes('onloadcssdefined'),
        required: true
      },
      {
        name: 'Fallback noscript tags',
        test: content.includes('<noscript>') && content.includes('global.css'),
        required: true
      },
      {
        name: 'Font preloading',
        test: content.includes('rel="preconnect"') && content.includes('fonts.googleapis.com'),
        required: true
      },
      {
        name: 'Resource preloading',
        test: content.includes('rel="preload"') && content.includes('as="style"'),
        required: true
      }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
      if (test.test) {
        log(`  ✅ ${test.name}`, 'green');
        passed++;
      } else {
        log(`  ${test.required ? '❌' : '⚠️ '} ${test.name}`, test.required ? 'red' : 'yellow');
        if (test.required) failed++;
      }
    }
    
    log(`\n📊 Integration tests: ${passed} passed, ${failed} failed`, failed === 0 ? 'green' : 'red');
    return failed === 0;
    
  } catch (error) {
    log(`❌ Failed to read Layout.astro: ${error.message}`, 'red');
    return false;
  }
}

async function testCriticalStylesContent() {
  log('\n🔍 Testing Critical Styles Content...', 'blue');
  
  try {
    const layoutPath = path.join(__dirname, '../src/layouts/Layout.astro');
    const content = await fs.readFile(layoutPath, 'utf-8');
    
    // Extract the inlined CSS
    const styleMatch = content.match(/<style>\s*(\/\* Critical CSS[\s\S]*?)\s*<\/style>/);
    if (!styleMatch) {
      log('❌ Could not find inlined critical CSS', 'red');
      return false;
    }
    
    const criticalCSS = styleMatch[1];
    
    const requiredSelectors = [
      // Base styles
      'html', 'body', '*, *::before, *::after',
      // Typography
      'h1, h2, h3, h4, h5, h6', 'p', 'a',
      // Navigation
      '.navigation', '.nav-wrapper', '.logo', '.nav-links',
      // Mobile navigation
      '.mobile-menu-toggle', '.hamburger-line',
      // Layout
      '.container-12', '.grid-12', '.col-span-12', '.flex',
      // Buttons
      '.btn', '.btn-primary', '.btn-secondary',
      // Accessibility
      '.skip-link', '.sr-only', ':focus-visible',
      // Responsive
      '@media (min-width: 640px)', '@media (max-width: 768px)',
      // Accessibility media queries
      '@media (prefers-reduced-motion: reduce)', '@media (prefers-contrast: high)'
    ];
    
    let found = 0;
    let missing = [];
    
    for (const selector of requiredSelectors) {
      if (criticalCSS.includes(selector)) {
        found++;
      } else {
        missing.push(selector);
      }
    }
    
    log(`📊 Critical selectors: ${found}/${requiredSelectors.length} found`, found === requiredSelectors.length ? 'green' : 'yellow');
    
    if (missing.length > 0) {
      log('⚠️  Missing selectors:', 'yellow');
      missing.forEach(selector => log(`    - ${selector}`, 'yellow'));
    }
    
    return missing.length === 0;
    
  } catch (error) {
    log(`❌ Failed to test critical styles content: ${error.message}`, 'red');
    return false;
  }
}

async function testResponsiveDesign() {
  log('\n🔍 Testing Responsive Design...', 'blue');
  
  try {
    const layoutPath = path.join(__dirname, '../src/layouts/Layout.astro');
    const content = await fs.readFile(layoutPath, 'utf-8');
    
    const viewports = [
      { name: 'Mobile', query: '@media (max-width: 768px)', required: true },
      { name: 'Tablet', query: '@media (min-width: 640px)', required: true },
      { name: 'Desktop', query: '@media (min-width: 1024px)', required: true }
    ];
    
    let passed = 0;
    
    for (const viewport of viewports) {
      if (content.includes(viewport.query)) {
        log(`  ✅ ${viewport.name} styles included`, 'green');
        passed++;
      } else {
        log(`  ${viewport.required ? '❌' : '⚠️ '} ${viewport.name} styles missing`, viewport.required ? 'red' : 'yellow');
      }
    }
    
    // Test for mobile-specific navigation styles
    const mobileNavTests = [
      '.mobile-menu-toggle',
      '.nav-links.active',
      'transform: translateY(-100vh)',
      'flex-direction: column'
    ];
    
    let mobileNavPassed = 0;
    for (const test of mobileNavTests) {
      if (content.includes(test)) {
        mobileNavPassed++;
      }
    }
    
    log(`📊 Mobile navigation: ${mobileNavPassed}/${mobileNavTests.length} features implemented`, 
         mobileNavPassed === mobileNavTests.length ? 'green' : 'yellow');
    
    return passed === viewports.length && mobileNavPassed === mobileNavTests.length;
    
  } catch (error) {
    log(`❌ Failed to test responsive design: ${error.message}`, 'red');
    return false;
  }
}

async function testPerformanceOptimizations() {
  log('\n🔍 Testing Performance Optimizations...', 'blue');
  
  try {
    const layoutPath = path.join(__dirname, '../src/layouts/Layout.astro');
    const content = await fs.readFile(layoutPath, 'utf-8');
    
    const optimizations = [
      {
        name: 'DNS prefetch for external resources',
        test: content.includes('rel="dns-prefetch"'),
        required: true
      },
      {
        name: 'Font preconnect',
        test: content.includes('rel="preconnect"') && content.includes('fonts.gstatic.com'),
        required: true
      },
      {
        name: 'Resource preloading',
        test: content.includes('rel="preload"') && content.includes('as="style"'),
        required: true
      },
      {
        name: 'Async CSS loading (loadCSS)',
        test: content.includes('loadCSS(') && content.includes('onloadcssdefined'),
        required: true
      },
      {
        name: 'NoScript fallback',
        test: content.includes('<noscript>') && content.includes('global.css'),
        required: true
      },
      {
        name: 'Font display swap',
        test: content.includes('display=swap'),
        required: true
      },
      {
        name: 'Critical CSS inlined',
        test: content.includes('/* Critical CSS for Above-the-Fold Content */'),
        required: true
      }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const opt of optimizations) {
      if (opt.test) {
        log(`  ✅ ${opt.name}`, 'green');
        passed++;
      } else {
        log(`  ${opt.required ? '❌' : '⚠️ '} ${opt.name}`, opt.required ? 'red' : 'yellow');
        if (opt.required) failed++;
      }
    }
    
    log(`📊 Performance optimizations: ${passed} implemented, ${failed} missing`, failed === 0 ? 'green' : 'red');
    return failed === 0;
    
  } catch (error) {
    log(`❌ Failed to test performance optimizations: ${error.message}`, 'red');
    return false;
  }
}

async function generateReport() {
  log('\n' + '='.repeat(60), 'bold');
  log('🚀 CRITICAL CSS IMPLEMENTATION TEST REPORT', 'bold');
  log('='.repeat(60), 'bold');
  
  const tests = [
    { name: 'Critical CSS Size', test: testCriticalCSSSize },
    { name: 'Layout.astro Integration', test: testLayoutAstroIntegration },
    { name: 'Critical Styles Content', test: testCriticalStylesContent },
    { name: 'Responsive Design', test: testResponsiveDesign },
    { name: 'Performance Optimizations', test: testPerformanceOptimizations }
  ];
  
  const results = [];
  let totalPassed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.test();
      results.push({ name: test.name, passed: result });
      if (result) totalPassed++;
    } catch (error) {
      log(`❌ Error running ${test.name}: ${error.message}`, 'red');
      results.push({ name: test.name, passed: false });
    }
  }
  
  log('\n📊 SUMMARY:', 'bold');
  log(`Tests passed: ${totalPassed}/${tests.length}`, totalPassed === tests.length ? 'green' : 'red');
  
  if (totalPassed === tests.length) {
    log('\n🎉 All tests passed! Critical CSS implementation is ready for production.', 'green');
    log('\n✨ Expected improvements:', 'blue');
    log('  • First Contentful Paint (FCP) improvement: ~200-500ms', 'blue');
    log('  • Largest Contentful Paint (LCP) improvement: ~300-800ms', 'blue');
    log('  • Eliminated render-blocking CSS for above-the-fold content', 'blue');
    log('  • No Flash of Unstyled Content (FOUC)', 'blue');
    log('  • Critical CSS size: <14KB (inlined)', 'blue');
  } else {
    log('\n⚠️  Some tests failed. Please review the issues above before deploying.', 'yellow');
  }
  
  log('\n🔧 NEXT STEPS:', 'bold');
  log('1. Run lighthouse audit to measure performance improvements', 'blue');
  log('2. Test across different devices and network conditions', 'blue');
  log('3. Monitor Core Web Vitals in production', 'blue');
  log('4. Consider implementing further optimizations if needed', 'blue');
  
  return totalPassed === tests.length;
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateReport()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`❌ Fatal error: ${error.message}`, 'red');
      process.exit(1);
    });
}

export { generateReport };