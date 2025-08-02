# Ramon Roca Pinilla - Portfolio

A bold, minimalistic portfolio showcasing biomedical engineering and molecular biology research. Built with modern web technologies for optimal performance and accessibility.

## 🚀 Tech Stack

- **Astro 4.14.2** - Static site generator
- **Tailwind CSS v3** - Utility-first CSS framework  
- **Inter Variable + Playfair Display** - Typography via @fontsource-variable
- **React 18** - For interactive components (antibiotic timeline)
- **TypeScript** - Type safety
- **Sharp** - Image optimization

## 🎨 Design System

### Color Palette
- **Primary Background**: `#2B0000` (Dark red)
- **Surface**: `#400000` (Medium red)
- **Accent Yellow**: `#FFD300` (High contrast)
- **Body Text**: `#F3F3F3` (Light gray)
- **Text Muted**: `#B8B8B8` (Medium gray)

### Typography
- **Body**: Inter Variable (400-600 weight)
- **Headings**: Playfair Display Variable (400-700 weight)
- **Max-width**: 1280px centered grid
- **Line length**: 45-75 characters for optimal readability
- **Text alignment**: Justified paragraphs

## 🌐 Internationalization

Supports three languages with proper locale strings:
- **English** (`/en/`) - Default
- **Spanish** (`/es/`)
- **Catalan** (`/ca/`)

All UI strings managed through JSON files in `src/i18n/`.

## ♿ Accessibility

- **WCAG 2.1-AA** contrast compliance
- **Skip links** for keyboard navigation
- **Focus management** with visible focus rings
- **Reduced motion** support
- **Screen reader** optimized markup
- **Semantic HTML** structure

## 📦 Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── BaseLayout.astro # Main layout wrapper
│   ├── Hero.astro       # Hero section
│   ├── Research.astro   # Research areas
│   ├── Timeline.astro   # Academic timeline
│   ├── Publications.astro # Publications list
│   ├── Contact.astro    # Contact information
│   └── AntimicrobialResistanceTimeline.tsx # Interactive D3 chart
├── i18n/                # Internationalization
│   ├── en.json         # English strings
│   ├── es.json         # Spanish strings
│   └── ca.json         # Catalan strings
├── pages/               # Route pages
│   ├── index.astro     # Root redirect
│   ├── en/index.astro  # English homepage
│   ├── es/index.astro  # Spanish homepage
│   └── ca/index.astro  # Catalan homepage
├── styles/
│   └── global.css      # Global styles & Tailwind imports
└── types.ts            # TypeScript definitions
```

## 🔧 Adding New Translations

1. Add new JSON file to `src/i18n/` (e.g., `fr.json`)
2. Copy structure from `en.json` and translate strings
3. Create new page in `src/pages/fr/index.astro`
4. Update `astro.config.mjs` sitemap i18n configuration
5. Add language option to Navigation component

## 📊 Performance

- **Bundle size**: <25kB CSS gzipped
- **JavaScript**: <35kB for interactive components
- **LCP target**: ≤1.8s
- **CLS target**: <0.1
- **Font loading**: `font-display: swap` for FOIT prevention

## 🚀 Deployment

Automated deployment via GitHub Actions to GitHub Pages:

```yaml
# .github/workflows/deploy.yml
- Builds on Node.js 20
- Generates bundle size reports
- Deploys to gh-pages branch
- Concurrency group prevents conflicts
```

## 📈 Features

### Interactive Timeline
- **D3.js visualization** of antibiotic resistance emergence
- **Roma colormap** from crameri scientific palette
- **White text** and clean backgrounds for readability
- **Responsive design** with mobile optimization

### Grid System
- **12-column CSS Grid** for consistent layouts
- **Container max-width**: 1280px
- **Responsive breakpoints** for mobile/tablet/desktop
- **Flexible component spanning**

### Font Loading
- **Variable fonts** for reduced bandwidth
- **Preload critical fonts** for performance
- **Fallback stacks** for progressive enhancement
- **OpenType features** enabled (ligatures, kerning)

## 📝 Content Management

**Important**: All biographical and research content is final. Do not edit personal details, particularly PhD affiliation with Autonomous University of Barcelona.

Content is managed through:
- **Component props** for dynamic data
- **JSON files** for translations
- **TypeScript interfaces** for type safety
- **Structured data** for SEO

## 🔍 SEO & Meta

- **Open Graph** tags for social sharing
- **Twitter Card** metadata
- **Canonical URLs** with hreflang
- **Sitemap** generation for all locales
- **Structured data** (JSON-LD) for rich snippets

## 🛠️ Build Optimization

- **Astro Image** service with Sharp
- **CSS purging** via PurgeCSS
- **Lightning CSS** for minification
- **Rollup optimization** for chunks
- **Asset fingerprinting** for caching

---

Built with ❤️ using modern web standards and accessibility best practices.