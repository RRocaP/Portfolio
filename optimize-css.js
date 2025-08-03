#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.error('dist/ directory not found. Run astro build first.');
  process.exit(1);
}

// gather gzipped size of all css in dist
const assetDir = path.join(distDir, '_assets');
let totalGzip = 0;
if (fs.existsSync(assetDir)) {
  for (const file of fs.readdirSync(assetDir)) {
    if (file.endsWith('.css')) {
      const cssPath = path.join(assetDir, file);
      const gz = zlib.gzipSync(fs.readFileSync(cssPath));
      totalGzip += gz.length;
    }
  }
}
const sizeKB = totalGzip / 1024;
console.log(`📦 CSS size (gzipped): ${sizeKB.toFixed(2)}kB`);

const baselinePath = path.join(process.cwd(), 'dist-sizes.json');
let baselineKB = 0;
let baselineData = {};
if (fs.existsSync(baselinePath)) {
  baselineData = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const gz = baselineData?.bundleSize?.css?.gzipped || '0kB';
  baselineKB = parseFloat(gz.replace('kB', ''));
}

if (baselineKB && sizeKB > baselineKB * 1.1) {
  console.error(`❌ CSS size increased more than 10% (prev ${baselineKB.toFixed(2)}kB)`);
  process.exit(1);
}

// update baseline file
const updated = {
  ...baselineData,
  status: 'success',
  timestamp: new Date().toISOString(),
  bundleSize: {
    ...(baselineData.bundleSize || {}),
    css: {
      raw: baselineData?.bundleSize?.css?.raw || `${(sizeKB*2).toFixed(1)}kB`,
      gzipped: `${sizeKB.toFixed(1)}kB`
    }
  }
};
fs.writeFileSync(baselinePath, JSON.stringify(updated, null, 2));
console.log('📋 Updated dist-sizes.json with new CSS size baseline');
