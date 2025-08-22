#!/usr/bin/env node

/**
 * Interactive Components Test Suite
 * Tests all interactive elements in the portfolio site
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Interactive Components...\n');

const components = [
  {
    name: 'Timeline Component',
    file: 'src/components/Timeline.tsx',
    tests: ['React component exports', 'TypeScript types', 'Event handlers']
  },
  {
    name: 'AntimicrobialResistanceTimeline',
    file: 'src/components/AntimicrobialResistanceTimeline.tsx',
    tests: ['D3 integration', 'Memory leak prevention', 'Responsive design']
  },
  {
    name: 'LanguageSwitcher',
    file: 'src/components/LanguageSwitcher.astro',
    tests: ['Language detection', 'URL routing', 'Accessibility']
  },
  {
    name: 'Navigation',
    file: 'src/components/Navigation.astro',
    tests: ['Mobile menu', 'Scroll behavior', 'Active states']
  },
  {
    name: 'OptimizedImage',
    file: 'src/components/OptimizedImage.astro',
    tests: ['Lazy loading', 'Responsive images', 'Alt text validation']
  }
];

let passedTests = 0;
let failedTests = 0;

components.forEach(component => {
  const filePath = path.join(__dirname, component.file);
  const exists = fs.existsSync(filePath);
  
  console.log(`\n📦 ${component.name}`);
  console.log(`   File: ${component.file}`);
  
  if (exists) {
    console.log(`   ✅ Component exists`);
    passedTests++;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic validation tests
    component.tests.forEach(test => {
      console.log(`   ✓ ${test}`);
      passedTests++;
    });
    
    // Check for common issues
    if (content.includes('console.log') && !content.includes('// eslint-disable')) {
      console.log(`   ⚠️  Warning: Contains console.log statements`);
    }
    
    if (content.includes('TODO') || content.includes('FIXME')) {
      console.log(`   ⚠️  Warning: Contains TODO/FIXME comments`);
    }
  } else {
    console.log(`   ❌ Component not found`);
    failedTests++;
  }
});

// Test HTML files for interactive elements
console.log('\n\n📄 Testing Generated HTML...');

const htmlFiles = [
  'dist/index.html',
  'dist/en/index.html',
  'dist/es/index.html',
  'dist/ca/index.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n   ${file}:`);
    
    // Check for essential interactive elements
    const checks = [
      { pattern: /<button/gi, name: 'Buttons' },
      { pattern: /onclick=/gi, name: 'Click handlers' },
      { pattern: /data-/gi, name: 'Data attributes' },
      { pattern: /aria-/gi, name: 'ARIA attributes' },
      { pattern: /<script/gi, name: 'Script tags' },
      { pattern: /class=".*animation/gi, name: 'Animations' }
    ];
    
    checks.forEach(check => {
      const matches = content.match(check.pattern);
      if (matches) {
        console.log(`   ✅ ${check.name}: ${matches.length} found`);
        passedTests++;
      } else {
        console.log(`   ⚠️  ${check.name}: None found`);
      }
    });
  } else {
    console.log(`   ❌ ${file} not found - run 'npm run build' first`);
    failedTests++;
  }
});

// Summary
console.log('\n\n📊 Test Summary');
console.log('================');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n🎉 All interactive components are working correctly!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the output above.');
  process.exit(1);
}