#!/usr/bin/env node
import fs from 'fs';
import { PurgeCSS } from 'purgecss';

const DIST_CSS_GLOB = './dist/**/*.css';
const DIST_CONTENT_GLOB = ['./dist/**/*.html', './dist/**/*.js'];
const REPORT_FILE = './optimization-report.json';

(async () => {
  console.log('🎨 Analyzing CSS usage...');
  const results = await new PurgeCSS().purge({ content: DIST_CONTENT_GLOB, css: [DIST_CSS_GLOB] });
  let unused = 0;
  for (const res of results) unused += res.rejected?.length || 0;

  const report = { timestamp: new Date().toISOString(), unusedSelectors: unused };

  if (fs.existsSync(REPORT_FILE)) {
    const baseline = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    const prev = baseline.unusedSelectors ?? 0;
    if (unused > prev * 1.1) {
      console.error(`❌ Unused CSS selectors increased from ${prev} to ${unused}`);
      fs.writeFileSync(REPORT_FILE, JSON.stringify({ ...report, baseline: prev }, null, 2));
      process.exit(1);
    }
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`✅ Unused selectors: ${unused}`);
})();
