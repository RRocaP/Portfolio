# Performance Reports

This directory contains performance analysis and optimization reports for the portfolio project.

## 📊 Reports Overview

### Bundle Analysis

- **[dist-sizes.json](./dist-sizes.json)** - Complete bundle size analysis
  - CSS and JavaScript bundle sizes
  - Performance metrics (LCP, FID, CLS, TTFB)
  - Lighthouse scores
  - Image optimization results

### CSS Optimization

- **[optimization-report.json](./optimization-report.json)** - CSS optimization results
  - Original vs optimized file sizes
  - Unused CSS removal statistics
  - Gzipped size comparisons

- **[css-unused-baseline.json](./css-unused-baseline.json)** - Baseline for unused CSS detection
  - Reference point for CSS optimization

## 🎯 Current Performance Targets

Based on the latest audit results:

### ✅ Achieved Targets

- **CSS Bundle**: < 25kB gzipped → 18.2kB achieved
- **LCP (Largest Contentful Paint)**: < 1.8s → 1.2s achieved
- **CLS (Cumulative Layout Shift)**: < 0.1 → 0.08 achieved
- **Lighthouse Performance**: > 90 → 95 achieved
- **Lighthouse Accessibility**: 100 achieved

### ⚠️ In Progress

- **JavaScript Bundle**: < 35kB gzipped → Currently ~70kB (needs optimization)
  - Main client bundle: 135.61kB (43.80kB gzipped)
  - Timeline component: 66.67kB (22.26kB gzipped)

## 📈 Performance Monitoring

These reports are generated automatically during the build process and updated with each deployment. Key metrics tracked include:

- Bundle size analysis
- Core Web Vitals metrics
- Lighthouse performance scores
- CSS optimization effectiveness
- Image optimization results

## 🔄 Regenerating Reports

To update performance reports:

```bash
# Build the project (generates dist-sizes.json)
npm run build

# Run CSS optimization (generates optimization-report.json)
npm run optimize-css
```

Reports are automatically updated during CI/CD pipeline execution.

---

For detailed performance analysis and optimization recommendations, see the [complete audit report](../audits/portfolio-audit.md).
