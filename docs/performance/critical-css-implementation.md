# Critical CSS Implementation

This document describes the critical CSS inlining implementation for the Ramon Roca Pinilla portfolio website to improve First Contentful Paint (FCP) and Largest Contentful Paint (LCP) performance metrics.

## Overview

Critical CSS inlining eliminates render-blocking CSS by identifying and inlining only the styles needed for above-the-fold content, while loading non-critical styles asynchronously.

## Implementation Details

### 1. Critical CSS Extraction

**Script:** `scripts/extract-critical-css.js`

The extraction script identifies critical selectors for:

- CSS custom properties (CSS variables)
- Reset and base styles
- Typography essentials
- Navigation components
- Hero section styles
- Button components
- Layout utilities
- Accessibility features
- Responsive design breakpoints
- Accessibility media queries (reduced motion, high contrast, dark mode)

**Generated Size:** 7.50KB (well under the recommended 14KB limit)

### 2. Inlined Critical CSS

**Location:** `src/layouts/Layout.astro`

Critical CSS is inlined directly in the `<head>` section of the main layout, ensuring immediate availability for above-the-fold rendering.

**Key Features:**

- CSS custom properties for consistent theming
- Complete navigation styles (including mobile responsive)
- Typography system with fluid scaling
- Button components
- Layout utilities (grid, flexbox, containers)
- Accessibility features (skip links, focus management)
- Dark mode support via `prefers-color-scheme`
- Reduced motion support via `prefers-reduced-motion`
- High contrast support via `prefers-contrast`

### 3. Async CSS Loading

**Method:** LoadCSS pattern with fallback

Non-critical stylesheets are loaded asynchronously using the loadCSS utility:

- `src/styles/global.css` - Full stylesheet with all components
- `src/styles/animations.css` - Animation definitions
- Google Fonts - With font-display: swap

**Fallback:** `<noscript>` tags ensure styles load even with JavaScript disabled.

### 4. Resource Optimization

**Preconnections:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**Preloading:**

```html
<link rel="preload" href="/src/styles/global.css" as="style" />
<link rel="preload" href="/src/styles/animations.css" as="style" />
```

**DNS Prefetch:**

```html
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
```

## Build Integration

### Automatic Extraction

The build process automatically extracts critical CSS:

```bash
npm run build          # Extracts critical CSS then builds
npm run extract:critical  # Extract critical CSS only
```

### Testing

Comprehensive testing ensures implementation quality:

```bash
npm run test:critical   # Run critical CSS tests
```

**Test Coverage:**

- Critical CSS size validation (<14KB)
- Layout.astro integration verification
- Critical selectors presence check
- Responsive design implementation
- Performance optimization validation

## Performance Benefits

### Expected Improvements

- **First Contentful Paint (FCP):** 200-500ms improvement
- **Largest Contentful Paint (LCP):** 300-800ms improvement
- **Render-blocking CSS:** Eliminated for above-the-fold content
- **Flash of Unstyled Content (FOUC):** Prevented
- **Critical CSS size:** 7.50KB (inlined, no additional request)

### Core Web Vitals Impact

1. **FCP:** Immediate rendering of above-the-fold content
2. **LCP:** Hero section and navigation render without waiting for external CSS
3. **CLS:** Layout stability maintained with inlined layout styles
4. **FID:** No impact on interactivity (CSS loading doesn't block JavaScript)

## Critical Selectors Included

### Base Styles

- `html`, `body`
- `*, *::before, *::after` (box-sizing reset)
- CSS custom properties (`:root`)

### Typography

- `h1, h2, h3, h4, h5, h6`
- `p`, `a`
- Font families and sizes

### Navigation

- `.navigation`, `.nav-wrapper`
- `.logo`, `.nav-links`
- `.mobile-menu-toggle`, `.hamburger-line`
- Mobile responsive navigation

### Layout

- `.container-12`, `.grid-12`
- `.col-span-12`, `.flex`
- Responsive breakpoints

### Components

- `.btn`, `.btn-primary`, `.btn-secondary`
- Hero section containers

### Accessibility

- `.skip-link`, `.sr-only`
- `:focus-visible`
- High contrast and reduced motion support

## Maintenance

### Updating Critical CSS

1. Modify the extraction script (`scripts/extract-critical-css.js`) to add/remove selectors
2. Run `npm run extract:critical` to regenerate
3. Test with `npm run test:critical`
4. Build and deploy

### Adding New Critical Styles

1. Add selectors to `CRITICAL_SELECTORS` array in extraction script
2. Ensure styles are needed for above-the-fold content
3. Verify size remains under 14KB
4. Update tests if necessary

### Monitoring

- Monitor Core Web Vitals in production
- Use Lighthouse audits to verify performance improvements
- Track FCP/LCP metrics over time
- Validate no render-blocking CSS warnings

## Browser Support

- **Modern Browsers:** Full support with loadCSS
- **Legacy Browsers:** Graceful degradation with noscript fallbacks
- **No JavaScript:** Complete fallback via noscript tags
- **High Contrast Mode:** Enhanced styles via media queries
- **Reduced Motion:** Respected via prefers-reduced-motion

## Files Modified

- `src/layouts/Layout.astro` - Inlined critical CSS and async loading
- `scripts/extract-critical-css.js` - Critical CSS extraction logic
- `scripts/test-critical-css.js` - Comprehensive testing suite
- `package.json` - Build integration scripts
- `src/styles/critical.css` - Generated critical CSS file

## Deployment Checklist

- [ ] Critical CSS size is <14KB
- [ ] All tests pass (`npm run test:critical`)
- [ ] Build process includes extraction (`npm run build`)
- [ ] Lighthouse audit shows no render-blocking CSS warnings
- [ ] FCP/LCP improvements validated
- [ ] No FOUC on slow connections
- [ ] Mobile navigation works correctly
- [ ] Dark mode support functional
- [ ] Accessibility features intact

## Further Optimizations

Consider implementing these additional optimizations:

1. **Service Worker:** Cache critical CSS for return visits
2. **HTTP/2 Push:** Push critical CSS with initial page request
3. **Image Optimization:** Optimize above-the-fold images
4. **Font Optimization:** Use variable fonts or font subsetting
5. **JavaScript Optimization:** Code splitting for non-critical features

---

_Last updated: January 2025_
_Implementation by: Claude Code Assistant_
