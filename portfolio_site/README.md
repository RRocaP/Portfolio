# Portfolio Site - Optimized Build Configuration

A high-performance portfolio site built with Vite, featuring advanced optimization techniques for minimal bundle sizes and fast loading times.

## 🚀 Performance Features

- **Optimized Bundle Splitting**: Intelligent code splitting with separate chunks for GSAP animations, utilities, and application code
- **Advanced Compression**: Dual compression with gzip and brotli for maximum size reduction
- **Progressive Web App**: Service worker caching with intelligent cache strategies
- **Lazy Loading**: Intersection Observer-based lazy loading for images and non-critical resources
- **Resource Hints**: Preconnect, dns-prefetch, and preload optimizations
- **Tree Shaking**: Dead code elimination for minimal bundle sizes
- **Modern CSS**: Lightning CSS for faster builds and optimized stylesheets

## 📊 Build Metrics

Expected performance improvements:
- **Bundle Size**: ~60% reduction with gzip compression
- **Initial Load**: <2s on 3G networks
- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: All metrics in green

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle
npm run build:analyze
```

## 📈 Performance Scripts

```bash
# Size analysis
npm run size

# Lighthouse audit
npm run lighthouse

# Complete performance test
npm run perf
```

## 🏗️ Build Configuration

### Code Splitting Strategy
- `vendor-animations`: GSAP libraries
- `vendor`: Node modules
- `utils`: Utility functions
- `app`: Main application code

### Optimization Features
- Terser minification with advanced options
- CSS extraction and optimization
- Asset optimization with proper hashing
- Legacy browser support with polyfills

### Caching Strategy
- Long-term caching with content hashes
- Service worker caching for static assets
- CDN resource caching (GSAP, fonts)

## 🌐 Deployment

The build output is optimized for:
- Static hosting (Netlify, Vercel, GitHub Pages)
- CDN deployment
- Progressive enhancement
- Offline functionality

## 🔧 Environment Configuration

- `.env.development` - Development settings
- `.env.production` - Production optimizations  
- `.env.staging` - Staging environment
- `vite.config.js` - Build configuration
- `.browserslistrc` - Browser support targets