import { PurgeCSS } from 'purgecss';
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

// Configure PurgeCSS for production optimization
const purgeCSSConfig = {
  content: ['./dist/**/*.html', './dist/**/*.js'],
  css: ['./dist/**/*.css'],
  safelist: {
    standard: [/^astro-/, /^dark/, /^hover:/, /^focus:/, /^motion-/],
    deep: [/animate-/],
    greedy: [/transition/],
  },
  blocklist: [],
  keyframes: true,
  variables: true,
  fontFace: true,
};

async function optimizeBuild() {
  console.log('🎯 Starting CSS optimization...');
  
  try {
    // Run PurgeCSS
    const purgeCSSResults = await new PurgeCSS().purge(purgeCSSConfig);
    
    // Write optimized CSS files
    for (const result of purgeCSSResults) {
      if (result.file) {
        await writeFile(result.file, result.css);
        const originalSize = result.css.length;
        const optimizedSize = result.css.length;
        console.log(`✅ Optimized ${result.file}: ${originalSize} → ${optimizedSize} bytes`);
      }
    }
    
    // Generate optimization report
    const report = {
      timestamp: new Date().toISOString(),
      filesOptimized: purgeCSSResults.length,
      totalSavings: purgeCSSResults.reduce((acc, r) => acc + (r.rejected?.length || 0), 0),
    };
    
    await writeFile('./dist/optimization-report.json', JSON.stringify(report, null, 2));
    console.log('📊 Optimization complete! Report saved to dist/optimization-report.json');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

optimizeBuild();