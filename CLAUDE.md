# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run deploy       # Deploy to GitHub Pages

# Quality checks
npm run check:types  # TypeScript type checking (astro check)
npm run lint         # ESLint
npm run preflight    # Performance + SEO validation
npm run preflight:full  # Preflight + E2E tests
```

## Architecture

Multilingual scientific portfolio built with **Astro 5.x + React 19 + TypeScript**. Static output, deployed to GitHub Pages and Vercel.

### Dual Deployment

```javascript
// astro.config.mjs — auto-detects environment
site: process.env.VERCEL ? 'https://portfolio-...vercel.app' : 'https://rrocap.github.io'
base: process.env.VERCEL ? '/' : '/Portfolio'
```

All asset and navigation paths must use `import.meta.env.BASE_URL` — never hardcode `/Portfolio`.

### Multilingual System

Three languages: English (en), Spanish (es), Catalan (ca). English is default.

- **Pages**: `src/pages/{en,es,ca}/index.astro` — each imports the same components with `lang` prop
- **Translations**: `src/data/i18n.ts` — exports `translations` and `timelineData` typed as `Record<Lang, ...>`
- **Pattern**: Every component with user-visible text takes a `lang: Lang` prop and uses a `Record<Lang, string>` for translations

**Critical**: When adding text to any component, always translate for all 3 languages. Use proper Spanish/Catalan diacriticals — missing accents are immediately noticeable to native speakers.

### Active Component Set

The live site uses components from `src/components/ml/` exclusively. Legacy components exist at `src/components/` root but are not used on current pages.

**Page composition** (all three language pages are identical except for `lang` prop):
```
NavML → HeroInteractive → AboutSection → ResearchIdentity →
ImpactDashboard → PublicationList → CareerTimeline → TerminalContact → Footer
```

### Key Data Files

- `src/data/i18n.ts` — All UI strings and timeline data, typed with `Lang`
- `src/data/publications.js` — Research publications (used by PublicationList)
- `src/data/metrics.ts` — Research metrics

## Design System

### Theme: `ml-native`

All pages use `theme="ml-native"` which overrides Layout.astro's default CSS variables:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#080B11` | Page background |
| `--bg-surface` | `#0E1219` | Cards, elevated surfaces |
| `--bg-elevated` | `#141A24` | Terminal chrome, card headers |
| `--accent-red` | `#DA291C` | Primary accent (Catalan red) |
| `--accent-warm` | `#C4956A` | Secondary accent (warm gold) |
| `--text-primary` | `#EAEDF2` | Headings, primary text |
| `--text-secondary` | `#B8BFC9` | Body text |
| `--text-muted` | `#8B95A3` | Labels, metadata |

### Typography

| Var | Font | Usage |
|-----|------|-------|
| `--font-display` | Source Serif 4 | Headings, titles |
| `--font-body` | DM Sans | Body text, UI |
| `--font-mono` | JetBrains Mono | Code, badges, terminal |

### CSS Architecture

Components use Astro scoped `<style>` blocks with BEM-style class names (`ml-hero__btn--primary`).

**Known pattern**: Layout.astro defines global `a` styles (`border-bottom`, `transform: translateY(-1px)` on hover) that leak into component anchors. Fix with parent-child specificity (`.ml-nav .ml-nav__link`) rather than `!important`.

### Styling Conventions

- Scoped CSS in Astro components — no Tailwind in `ml/` components
- CSS custom properties from the theme (never hardcode colors)
- `transition` on interactive elements; `transform` for hover effects (not `padding`/`margin` — avoids reflow)
- `@media (prefers-reduced-motion: reduce)` on all animations
- Mobile breakpoint: `768px`, small mobile: `480px`

## Accessibility

- WCAG 2.1 AA compliance required
- Focus indicators: `outline: 2px solid var(--accent-red, #DA291C); outline-offset: 2-4px`
- All interactive elements need `min-height: 44px` touch targets
- Semantic HTML with proper ARIA labels on sections and interactive regions

## File Conventions

- **Components**: PascalCase (`HeroInteractive.astro`)
- **Pages**: kebab-case (`functional-inclusion-bodies.astro`)
- **Data/Utils**: camelCase (`publications.js`, `i18n.ts`)
- Active components live in `src/components/ml/`

## Important Constraints

- All text must be translated for en/es/ca — no hardcoded English strings in components
- Lighthouse scores must stay >95
- Base path is dynamic — use `import.meta.env.BASE_URL` for all internal links
- The `container` class (`max-width: 1280px; margin: 0 auto; padding: 0 1.5rem`) is defined as a global style in each page file, not in Layout.astro
