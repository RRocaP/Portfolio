#!/usr/bin/env node
/**
 * CSS Optimization Script
 * Consolidates and minifies CSS files for better performance
 */

import fs from 'node:fs';
import path from 'node:path';

const CSS_CONFIG = {
  // CSS files to consolidate in order of priority
  coreCss: [
    'public/styles/design-system.css',
    'public/styles/core-bundle.css',
    'public/styles/performance-optimizations.css'
  ],
  enhancedCss: [
    'public/styles/enhanced-bundle.css',
    'public/styles/animations.css',
    'public/styles/lazy-loading.css'
  ],
  accessibilityCss: [
    'public/styles/accessibility-fixes.css',
    'public/styles/accessibility-enhanced.css'
  ]
};

class CSSOptimizer {
  constructor() {
    this.stats = {
      originalSize: 0,
      optimizedSize: 0,
      filesProcessed: 0,
      filesConsolidated: 0
    };
  }

  /**
   * Minify CSS content
   */
  minifyCSS(css) {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove whitespace around operators
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .replace(/\s*}\s*/g, '}')
      .replace(/:\s*/g, ':')
      .replace(/,\s*/g, ',')
      // Remove trailing semicolons
      .replace(/;}/g, '}')
      // Remove empty rules
      .replace(/[^{}]*{}/g, '')
      // Remove leading/trailing whitespace
      .trim();
  }

  /**
   * Remove duplicate CSS rules
   */
  deduplicateCSS(css) {
    const rules = new Map();
    const lines = css.split('}');
    
    for (let line of lines) {
      line = line.trim();
      if (line && line.includes('{')) {
        const [selector, declaration] = line.split('{');
        const cleanSelector = selector.trim();
        const cleanDeclaration = declaration?.trim();
        
        if (cleanSelector && cleanDeclaration) {
          // Keep the last occurrence of each rule (allows for overrides)
          rules.set(cleanSelector, cleanDeclaration);
        }
      }
    }
    
    return Array.from(rules.entries())
      .map(([selector, declaration]) => `${selector}{${declaration}}`)
      .join('');
  }

  /**
   * Remove unused CSS (basic implementation)
   */
  removeUnusedCSS(css) {
    // Remove some known unused classes (could be expanded)
    const unusedPatterns = [
      // Debug classes
      /\.debug[^{]*{[^}]*}/g,
      // Print-only styles if not needed
      /@media\s+print[^{]*{[^{}]*{[^}]*}[^}]*}/g,
      // Unused animation keyframes (basic detection)
      /@keyframes\s+unused[^{]*{[^{}]*{[^}]*}[^}]*}/g
    ];
    
    let optimized = css;
    for (const pattern of unusedPatterns) {
      optimized = optimized.replace(pattern, '');
    }
    
    return optimized;
  }

  /**
   * Consolidate CSS files
   */
  async consolidateCSS(files, outputPath) {
    let combinedCSS = '';
    let totalOriginalSize = 0;
    
    console.log(`\n📦 Consolidating ${files.length} CSS files...`);
    
    for (const file of files) {
      if (!fs.existsSync(file)) {
        console.warn(`⚠️  File not found: ${file}`);
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf-8');
      const size = Buffer.byteLength(content, 'utf8');
      totalOriginalSize += size;
      
      combinedCSS += `\n/* === ${path.basename(file)} === */\n`;
      combinedCSS += content;
      
      console.log(`   ✓ ${path.basename(file)}: ${(size / 1024).toFixed(1)}KB`);
      this.stats.filesProcessed++;
    }
    
    // Optimize the combined CSS
    console.log(`\n🔧 Optimizing combined CSS...`);
    let optimizedCSS = this.minifyCSS(combinedCSS);
    optimizedCSS = this.deduplicateCSS(optimizedCSS);
    optimizedCSS = this.removeUnusedCSS(optimizedCSS);
    
    // Add a header comment
    const header = `/*! Optimized CSS Bundle | Generated: ${new Date().toISOString()} */\n`;
    optimizedCSS = header + optimizedCSS;
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write optimized file
    fs.writeFileSync(outputPath, optimizedCSS);
    
    const optimizedSize = Buffer.byteLength(optimizedCSS, 'utf8');
    const savings = totalOriginalSize - optimizedSize;
    const savingsPercent = (savings / totalOriginalSize * 100).toFixed(1);
    
    console.log(`   📁 Combined size: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
    console.log(`   ⚡ Optimized size: ${(optimizedSize / 1024).toFixed(1)}KB`);
    console.log(`   💾 Saved: ${(savings / 1024).toFixed(1)}KB (${savingsPercent}%)`);
    
    this.stats.originalSize += totalOriginalSize;
    this.stats.optimizedSize += optimizedSize;
    this.stats.filesConsolidated += files.length;
    
    return {
      originalSize: totalOriginalSize,
      optimizedSize: optimizedSize,
      savings: savings,
      savingsPercent: parseFloat(savingsPercent)
    };
  }

  /**
   * Create inline critical CSS
   */
  async generateCriticalCSS() {
    const criticalRules = [
      // Design system variables
      ':root{--catalan-red:#DA291C;--catalan-yellow:#FFD93D;--primary:#F5F5F5;--secondary:#D4D4D4;--tertiary:#B8B8B8;--accent-red:#EF4444;--accent-red-hover:#FF5555;--accent-red-bg:rgba(220,38,38,0.10);--accent-yellow:#FFD93D;--background:#0A0A0A;--background-alt:#171717;--background-card:#1E1E1E;--background-elevated:#252525;--background-rgb:10,10,10;--accent-red-rgb:220,38,38;--border:#333333;--border-light:#404040;--border-red:rgba(218,41,28,0.3);--font-primary:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--font-display:"Outfit",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--font-mono:"SF Mono",Monaco,"Cascadia Code",monospace;--space-xs:0.5rem;--space-sm:1rem;--space-md:2rem;--space-lg:4rem;--space-xl:8rem;--anim-duration-fast:200ms;--anim-duration-base:300ms;--anim-duration-slow:500ms;--anim-easing-default:cubic-bezier(0.4,0,0.2,1);--glass-bg:rgba(255,255,255,0.05);--glass-border:rgba(255,255,255,0.1);--glass-blur:16px;--z-base:0;--z-dropdown:100;--z-sticky:200;--z-modal:300;--z-toast:400}',
      
      // Reset and base styles
      '*{margin:0;padding:0;box-sizing:border-box}',
      'html{scroll-behavior:smooth}',
      'body{font-family:var(--font-primary);font-weight:400;line-height:1.75;color:var(--primary);background-color:var(--background);font-size:clamp(16px,2vw,18px);letter-spacing:0.01em;word-spacing:0.05em;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}',
      
      // Critical layout
      '.container{max-width:1280px;margin:0 auto;padding:0 25px}',
      '.section{padding:var(--space-xl) 0;position:relative}',
      
      // Hero styles (above the fold)
      '.hero-final{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--background);overflow:hidden}',
      
      // Navigation
      '.nav-premium{position:fixed;top:0;left:0;right:0;z-index:var(--z-sticky);background:radial-gradient(120% 100% at 50% -20%,rgba(15,15,15,0.75) 0%,rgba(10,10,10,0.7) 100%);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.05);transition:transform var(--anim-duration-base) var(--anim-easing-default);will-change:transform}',
      
      // Typography
      'h1,h2,h3,h4,h5,h6{font-family:var(--font-display);font-weight:700;line-height:1.15;margin-bottom:1rem;letter-spacing:-0.01em;color:var(--primary)}',
      'h1{font-size:clamp(2.5rem,5vw,4rem)}',
      'h2{font-size:clamp(2rem,4vw,3rem)}',
      'h3{font-size:clamp(1.5rem,3vw,2rem)}',
      
      // Buttons
      '.btn{padding:0.875rem 2rem;min-height:44px;font-size:1rem;font-weight:600;text-decoration:none;border-radius:8px;transition:all var(--anim-duration-base) var(--anim-easing-default);display:inline-flex;align-items:center;gap:0.75rem;position:relative;overflow:hidden;outline:none;cursor:pointer;border:none}',
      '.btn:focus-visible{box-shadow:0 0 0 3px rgba(239,68,68,.45),0 0 0 5px rgba(255,255,255,.15)}',
      '.btn-primary{background:var(--accent-red);color:#FFFFFF;border:1px solid var(--accent-red);box-shadow:0 8px 30px rgba(220,38,38,0.25)}',
      '.btn-primary:hover{background:var(--accent-red-hover);box-shadow:0 10px 40px rgba(220,38,38,0.3);transform:translateY(-2px)}',
      
      // Accessibility
      '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
      
      // Mobile responsive
      '@media(max-width:768px){.section{padding:var(--space-lg) 0}.container{padding:0 1rem}.btn{min-height:48px;min-width:48px}}',
      
      // Reduced motion
      '@media(prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}html{scroll-behavior:auto}}'
    ];
    
    const criticalCSS = criticalRules.join('');
    
    // Write critical CSS file
    const criticalPath = 'src/styles/critical.css';
    fs.writeFileSync(criticalPath, `/* Critical CSS - Above the fold styles */\n${criticalCSS}`);
    
    console.log(`\n🚀 Generated critical CSS: ${criticalPath} (${(criticalCSS.length / 1024).toFixed(1)}KB)`);
    
    return criticalCSS;
  }

  async run() {
    console.log('🎨 CSS Optimization Tool');
    console.log('=' .repeat(40));
    
    // Generate critical CSS
    await this.generateCriticalCSS();
    
    // Consolidate CSS bundles
    const results = {};
    
    // Core bundle (essential styles)
    results.core = await this.consolidateCSS(
      CSS_CONFIG.coreCss,
      'public/styles/optimized-core.css'
    );
    
    // Enhanced bundle (progressive enhancement)
    results.enhanced = await this.consolidateCSS(
      CSS_CONFIG.enhancedCss,
      'public/styles/optimized-enhanced.css'
    );
    
    // Accessibility bundle
    results.accessibility = await this.consolidateCSS(
      CSS_CONFIG.accessibilityCss,
      'public/styles/optimized-accessibility.css'
    );
    
    // Generate updated layout template
    await this.generateOptimizedLayout();
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 CSS OPTIMIZATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Files processed: ${this.stats.filesProcessed}`);
    console.log(`Files consolidated: ${this.stats.filesConsolidated} → 3 bundles`);
    console.log(`Original total size: ${(this.stats.originalSize / 1024).toFixed(1)}KB`);
    console.log(`Optimized total size: ${(this.stats.optimizedSize / 1024).toFixed(1)}KB`);
    
    if (this.stats.originalSize > 0) {
      const totalSavings = this.stats.originalSize - this.stats.optimizedSize;
      const totalPercent = (totalSavings / this.stats.originalSize * 100).toFixed(1);
      console.log(`Total saved: ${(totalSavings / 1024).toFixed(1)}KB (${totalPercent}%)`);
    }
    
    console.log('\n✅ CSS optimization complete!');
    console.log('\nOptimized files created:');
    console.log('- public/styles/optimized-core.css');
    console.log('- public/styles/optimized-enhanced.css');
    console.log('- public/styles/optimized-accessibility.css');
    console.log('- src/styles/critical.css');
    console.log('\nNext steps:');
    console.log('1. Update Layout.astro to use optimized CSS files');
    console.log('2. Test the site functionality');
    console.log('3. Run performance audit: npm run performance:audit');
  }

  async generateOptimizedLayout() {
    const layoutTemplate = `<!-- Optimized CSS Loading Strategy -->
<!-- Critical CSS is inlined in the main layout -->
<!-- Non-critical CSS is loaded asynchronously -->

<!-- Core styles (essential) -->
<link rel="preload" as="style" href="/Portfolio/styles/optimized-core.css" onload="this.onload=null;this.rel='stylesheet'">

<!-- Enhanced styles (progressive enhancement) -->
<link rel="preload" as="style" href="/Portfolio/styles/optimized-enhanced.css" onload="this.onload=null;this.rel='stylesheet'" media="screen">

<!-- Accessibility styles -->
<link rel="preload" as="style" href="/Portfolio/styles/optimized-accessibility.css" onload="this.onload=null;this.rel='stylesheet'">

<noscript>
  <link rel="stylesheet" href="/Portfolio/styles/optimized-core.css">
  <link rel="stylesheet" href="/Portfolio/styles/optimized-enhanced.css">
  <link rel="stylesheet" href="/Portfolio/styles/optimized-accessibility.css">
</noscript>`;

    fs.writeFileSync('css-optimization-instructions.md', `# CSS Optimization Instructions

## Files Created:
1. \`public/styles/optimized-core.css\` - Essential styles (${((this.stats.optimizedSize * 0.4) / 1024).toFixed(1)}KB est.)
2. \`public/styles/optimized-enhanced.css\` - Progressive enhancement (${((this.stats.optimizedSize * 0.4) / 1024).toFixed(1)}KB est.)  
3. \`public/styles/optimized-accessibility.css\` - Accessibility styles (${((this.stats.optimizedSize * 0.2) / 1024).toFixed(1)}KB est.)
4. \`src/styles/critical.css\` - Critical above-the-fold styles

## Implementation:
Replace the CSS loading section in \`src/layouts/Layout.astro\` with:

\`\`\`html
${layoutTemplate}
\`\`\`

## Benefits:
- Reduced CSS bundle size by ~${((this.stats.originalSize - this.stats.optimizedSize) / 1024).toFixed(1)}KB
- Consolidated ${this.stats.filesConsolidated} files into 3 optimized bundles
- Improved loading performance with critical CSS inlining
- Better caching strategy with logical file separation
`);

    console.log(`\n📝 Generated optimization instructions: css-optimization-instructions.md`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  new CSSOptimizer().run().catch(console.error);
}