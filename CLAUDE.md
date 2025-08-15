# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### Preflight Commands
```bash
# Run full preflight check suite (if configured)
npm run preflight

# Verbose preflight with detailed progress
npm run preflight:verbose
```

**Note**: Preflight commands may not be currently configured in package.json - check PREFLIGHT.md for setup instructions.

## Architecture Overview

This is a multilingual scientific portfolio website built with **Astro.js + React + TypeScript**, featuring:

### Key Technologies
- **Astro 5.x** - Static site generator with islands architecture
- **React 19** - Interactive components (protein visualizations, animations)
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling with custom design system
- **D3.js** - Data visualizations and protein structure rendering

### Site Structure
```
src/
├── pages/
│   ├── index.astro          # Redirects to /en/
│   ├── en/index.astro       # English homepage
│   ├── es/index.astro       # Spanish homepage
│   ├── ca/index.astro       # Catalan homepage
│   └── {lang}/research/     # Research article pages per language
├── layouts/
│   ├── Layout.astro         # Main layout with SEO, fonts, global styles
│   └── ResearchLayout.astro # Research page layout
├── components/              # Astro and React components
├── data/                    # Content data files (publications, metrics, i18n)
├── styles/                  # CSS modules
└── utils/                   # Shared utilities
```

### Deployment Configuration
- **Site URL**: `https://rrocap.github.io`
- **Base path**: `/Portfolio`
- **Output**: Static site
- **Deployment**: GitHub Pages via `gh-pages` package

## Content Management

### Multilingual Setup
- **Languages**: English (en), Spanish (es), Catalan (ca)
- **Default locale**: English
- **Structure**: Each language has its own page hierarchy under `/[lang]/`
- **SEO**: Proper hreflang tags and canonical URLs configured
- **Content**: Managed through data files in `src/data/` (publications.js, i18n.ts, etc.)

### Key Data Files
- `src/data/publications.js` - Research publications with translations
- `src/data/i18n.ts` - Internationalization strings
- `src/data/metrics.ts` - Performance and research metrics
- `src/data/features.ts` - Feature descriptions for the portfolio

## Design System

### CSS Architecture
- **Primary**: Custom CSS variables in `src/layouts/Layout.astro`
- **Tailwind**: Utility classes with custom theme extensions
- **Modular styles**: Organized in `src/styles/` directory
  - `design-system.css` - Core design tokens
  - `performance-optimizations.css` - Performance-focused styles
  - `accessibility-fixes.css` - WCAG compliance styles
  - `main.css` - Global styles and animations

### Color Scheme
- **Theme**: Dark-first design with Catalan-inspired accent colors
- **Primary accent**: Red (`#DA291C` - Catalan red)
- **Secondary accent**: Yellow (`#FFD93D` - Catalan yellow)
- **Backgrounds**: Dark grays (`#0A0A0A`, `#171717`)

### Typography
- **Primary font**: Inter (system fallbacks)
- **Display font**: Outfit (headings)
- **Mono font**: SF Mono/Monaco

## Interactive Components

### Protein Visualizations
- Located in `src/components/Protein*` components
- Uses D3.js for rendering molecular structures
- Custom TypeScript types in `src/types/protein-visualization.ts`
- Canvas-based animations in `src/utils/ProteinVisualization.ts`

### Key Interactive Components
- `HeroFinal.astro` - Main hero section with animations
- `ProteinDesignShowcase.astro` - Interactive protein showcase
- `AntimicrobialTimeline.astro` - Animated research timeline
- `NavigationPremium.astro` - Main navigation with smooth transitions

## Performance Optimizations

### Build Configuration
- **Bundle splitting**: D3.js separated into its own chunk
- **Image optimization**: Multiple formats (AVIF, WebP, JPEG) with responsive images
- **Font loading**: Preload critical fonts with proper fallbacks
- **CSS**: Inlined critical styles, modular approach

### Runtime Performance
- **Astro Islands**: JavaScript only loads for interactive components
- **Lazy loading**: Images and non-critical components
- **Service Worker**: Configured in `public/sw.js` for caching

## SEO & Accessibility

### SEO Features
- **Structured data**: Schema.org Person and WebSite markup
- **Open Graph**: Complete OG and Twitter Card meta tags
- **Sitemap**: Generated automatically via @astrojs/sitemap
- **Multilingual SEO**: Proper hreflang and canonical tag implementation

### Accessibility
- **WCAG 2.1 AA compliance**: Custom accessibility fixes
- **Skip links**: Keyboard navigation support
- **Focus management**: Proper focus indicators and tab order
- **Color contrast**: All colors meet AA contrast requirements
- **Semantic HTML**: Proper heading hierarchy and ARIA labels

## Common Patterns

### Adding New Components
1. Create in `src/components/`
2. Use TypeScript for props interface
3. Follow naming convention: PascalCase for React, PascalCase.astro for Astro
4. Import and use in page files

### Adding New Content
1. Update data files in `src/data/`
2. Add translations for all supported languages
3. Update TypeScript types if needed

### Styling Guidelines
- Use CSS custom properties from the design system
- Prefer Tailwind utilities for layout and spacing
- Custom CSS for complex animations and unique styling
- Follow mobile-first responsive approach

## File Naming Conventions
- **Pages**: kebab-case (`functional-inclusion-bodies.astro`)
- **Components**: PascalCase (`HeroFinal.astro`, `ProteinViewer.astro`)
- **Utilities**: camelCase (`generateProteinFrames.ts`)
- **Data files**: camelCase (`publications.js`)
- **Styles**: kebab-case (`design-system.css`)

## Advanced Architecture

### Micro-Frontend & Plugin System
The portfolio implements a plugin-based architecture for extensibility:
- Uses `import.meta.glob` for zero-config component discovery
- Plugin registry system for decoupled cross-cutting features
- Dynamic component rendering based on slot-based plugin system

### Data & AI Layer
```
publications.js → SDK/publications → TfidfVectorStore → AIChat Component
publications.js → GraphQL Schema → Client Queries
```
- TF-IDF vector store for content search (can be upgraded to WASM-based approximate nearest neighbor)
- GraphQL schema generation for type-safe queries
- AI chat integration using OpenAI API

### Performance & Prefetch Strategy
- Service Worker with intelligent prefetching based on navigation patterns
- Frequency heuristics for resource prioritization
- Can evolve to Markov chain-based predictive models
- IndexedDB for navigation bigram persistence

### Future Enhancements (Planned)
1. Replace TF-IDF with WASM-based approximate nearest neighbor index
2. Streaming SSR with partial hydration (islands scheduling)
3. Advanced predictive model using navigation bigrams
4. Rust-based image analysis & critical CSS extraction
5. Unified CLI for all codegen steps

## Development Workflows

### Quality Assurance
The project uses a preflight system for code quality:
1. **Type checking**: TypeScript & Astro components
2. **Linting**: ESLint with custom rules
3. **Build verification**: Ensures production build succeeds
4. **Performance monitoring**: Lighthouse score validation

See `PREFLIGHT.md` for detailed setup instructions.

### Scripts and Automation
Located in `scripts/` directory:
- `analyze-bundle.mjs` - Bundle analysis and optimization
- `check-budgets.mjs` - Performance budget validation
- `generate-*.mjs` - Various code generation utilities
- `update-metrics.py` - Metrics collection and reporting

## Important Notes
- This is a scientific portfolio showcasing biomedical engineering research
- Focus is on protein engineering, antimicrobial resistance, and gene therapy
- Performance is critical - maintain lighthouse scores >95
- Accessibility is mandatory - all features must be WCAG compliant
- The site is deployed to GitHub Pages with the base path `/Portfolio`
- Architecture supports future expansion with plugin system and AI integration