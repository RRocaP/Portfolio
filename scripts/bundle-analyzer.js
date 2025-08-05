#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * Analyzes the built bundle and provides insights on bundle size and optimization opportunities
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distPath = join(__dirname, '../dist');

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stats = statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dirPath}:`, error.message);
  }
  
  return totalSize;
}

function getFilesByType(dirPath, extensions = []) {
  const files = [];
  
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stats = statSync(itemPath);
      
      if (stats.isDirectory()) {
        files.push(...getFilesByType(itemPath, extensions));
      } else if (extensions.length === 0 || extensions.includes(extname(item))) {
        files.push({
          path: relative(distPath, itemPath),
          size: stats.size,
          ext: extname(item)
        });
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not analyze directory ${dirPath}:`, error.message);
  }
  
  return files;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Bundle Analysis Report');
  console.log('=' .repeat(50));
  
  try {
    // Check if dist directory exists
    const distStats = statSync(distPath);
    if (!distStats.isDirectory()) {
      throw new Error('dist directory not found');
    }
  } catch (error) {
    console.error('❌ Error: Build output not found. Please run "npm run build" first.');
    process.exit(1);
  }
  
  // Total bundle size
  const totalSize = getDirectorySize(distPath);
  console.log(`📦 Total Bundle Size: ${formatBytes(totalSize)}\n`);
  
  // JavaScript files analysis
  const jsFiles = getFilesByType(distPath, ['.js', '.mjs']);
  if (jsFiles.length > 0) {
    console.log('📜 JavaScript Files:');
    console.log('-'.repeat(30));
    
    const sortedJsFiles = jsFiles.sort((a, b) => b.size - a.size);
    let totalJsSize = 0;
    
    for (const file of sortedJsFiles) {
      console.log(`  ${file.path}: ${formatBytes(file.size)}`);
      totalJsSize += file.size;
    }
    
    console.log(`  Total JS: ${formatBytes(totalJsSize)}\n`);
    
    // Large files warning
    const largeFiles = sortedJsFiles.filter(file => file.size > 100 * 1024); // > 100KB
    if (largeFiles.length > 0) {
      console.log('⚠️  Large JavaScript Files (>100KB):');
      for (const file of largeFiles) {
        console.log(`  - ${file.path}: ${formatBytes(file.size)}`);
      }
      console.log('Consider code splitting or optimization.\n');
    }
  }
  
  // CSS files analysis
  const cssFiles = getFilesByType(distPath, ['.css']);
  if (cssFiles.length > 0) {
    console.log('🎨 CSS Files:');
    console.log('-'.repeat(30));
    
    const sortedCssFiles = cssFiles.sort((a, b) => b.size - a.size);
    let totalCssSize = 0;
    
    for (const file of sortedCssFiles) {
      console.log(`  ${file.path}: ${formatBytes(file.size)}`);
      totalCssSize += file.size;
    }
    
    console.log(`  Total CSS: ${formatBytes(totalCssSize)}\n`);
  }
  
  // Image files analysis
  const imageFiles = getFilesByType(distPath, ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg']);
  if (imageFiles.length > 0) {
    console.log('🖼️  Image Files:');
    console.log('-'.repeat(30));
    
    const sortedImageFiles = imageFiles.sort((a, b) => b.size - a.size);
    let totalImageSize = 0;
    
    for (const file of sortedImageFiles.slice(0, 10)) { // Show top 10
      console.log(`  ${file.path}: ${formatBytes(file.size)}`);
      totalImageSize += file.size;
    }
    
    if (sortedImageFiles.length > 10) {
      console.log(`  ... and ${sortedImageFiles.length - 10} more files`);
      totalImageSize = sortedImageFiles.reduce((sum, file) => sum + file.size, 0);
    }
    
    console.log(`  Total Images: ${formatBytes(totalImageSize)}\n`);
    
    // Large images warning
    const largeImages = sortedImageFiles.filter(file => file.size > 500 * 1024); // > 500KB
    if (largeImages.length > 0) {
      console.log('⚠️  Large Image Files (>500KB):');
      for (const file of largeImages) {
        console.log(`  - ${file.path}: ${formatBytes(file.size)}`);
      }
      console.log('Consider image optimization or modern formats (WebP/AVIF).\n');
    }
  }
  
  // Performance recommendations
  console.log('💡 Performance Recommendations:');
  console.log('-'.repeat(30));
  
  if (totalSize > 5 * 1024 * 1024) { // > 5MB
    console.log('  - Bundle size is quite large. Consider lazy loading and code splitting.');
  }
  
  const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
  if (totalJsSize > 1 * 1024 * 1024) { // > 1MB
    console.log('  - JavaScript bundle is large. Consider dynamic imports and tree shaking.');
  }
  
  const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
  if (totalCssSize > 200 * 1024) { // > 200KB
    console.log('  - CSS bundle is large. Consider CSS purging and critical CSS extraction.');
  }
  
  const hasUnoptimizedImages = imageFiles.some(file => 
    ['.jpg', '.jpeg', '.png'].includes(file.ext) && file.size > 200 * 1024
  );
  if (hasUnoptimizedImages) {
    console.log('  - Consider converting large images to WebP or AVIF format.');
  }
  
  if (totalSize < 1 * 1024 * 1024) { // < 1MB
    console.log('  ✅ Bundle size looks good!');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Analysis complete!');
}

// Run analysis
analyzeBundle();