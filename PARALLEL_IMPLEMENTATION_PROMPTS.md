# PARALLEL SONNET 4 IMPLEMENTATION PROMPTS

## MASTER CONTEXT FOR ALL INSTANCES

**Portfolio Architecture**: Astro.js + React + TypeScript scientific portfolio for biomedical engineer Ramon Roca Pinilla
**Base URL**: `https://rrocap.github.io/Portfolio`
**Languages**: English (en), Spanish (es), Catalan (ca)
**Theme**: Dark-first design with Catalan colors (red #DA291C, yellow #FFD93D)
**Performance**: Target <150KB JS, <50KB CSS, Lighthouse 95+, WCAG AA compliance

**Existing Completed Components**:
- HeroAdvanced.tsx (GSAP animations, particle system)
- ProjectShowcase.tsx (3D cards, filtering)
- HeroIntegrated.tsx (progressive enhancement wrapper)

**Dependencies Already Installed**: 
- GSAP 3.13.0, React 19, TypeScript, Zod 3.25.76
- Astro 5.12.8, Tailwind CSS, D3.js 7.9.0

**Code Style Requirements**:
- TypeScript strict mode, proper interfaces
- React 19 features (no legacy patterns)
- Tailwind for styling, custom CSS variables from design system
- WCAG AA compliance mandatory
- Mobile-first responsive design
- Performance-optimized (GPU acceleration, lazy loading)

---

## COMPONENT 3: SMART NAVIGATION SYSTEM

**File**: `src/components/SmartNavigation.tsx`

**Requirements**: 
Create an intelligent navigation system with auto-hide on scroll down, show on scroll up behavior. Include progress indicator for page scroll, smooth section anchoring, mobile hamburger with gesture support, active section highlighting, and breadcrumbs for deep pages.

**Specifications**:
- Auto-hide/show based on scroll direction using IntersectionObserver
- Progress bar showing scroll completion (0-100%)
- Smooth anchor navigation with offset for fixed header
- Mobile: hamburger menu with slide-in animation and touch gestures
- Active section highlighting based on scroll position
- Breadcrumb navigation for research pages
- Language switcher with proper routing
- Accessibility: keyboard navigation, focus management, skip links
- Performance: throttled scroll handlers, GPU acceleration
- Internationalization: full EN/ES/CA support

**Expected Output**: Complete TypeScript React component with all features, proper types, and integration examples.

---

## COMPONENT 4: SECURE CONTACT FORM

**File**: `src/components/ContactForm.tsx`

**Requirements**:
Build a secure contact form with real-time validation using Zod, honeypot and reCAPTCHA integration, email service integration, success/error animations with smooth transitions, rate limiting logic, and full accessibility compliance.

**Specifications**:
- Zod schema validation with real-time feedback
- Honeypot field for bot detection (invisible to users)
- reCAPTCHA v3 integration with score-based validation
- Email integration ready (SendGrid/Resend compatible)
- Form states: idle, validating, submitting, success, error
- Smooth animations for all state transitions
- Rate limiting: max 3 submissions per hour per IP
- File attachment support (optional, with virus scanning prep)
- Accessibility: proper labels, error announcements, keyboard navigation
- Security: XSS protection, CSRF tokens, input sanitization
- Internationalization: error messages in all languages

**Expected Output**: Production-ready secure form component with validation, animations, and security features.

---

## COMPONENT 5: THEME SYSTEM

**File**: `src/utils/theme.ts` and `src/components/ThemeProvider.tsx`

**Requirements**:
Create a comprehensive theme system with dark/light mode support, system preference detection, smooth theme transitions, CSS custom properties architecture, color palette with accessibility contrast, typography scale system, and spacing/breakpoint tokens.

**Specifications**:
- Dark/light mode toggle with system preference detection
- Smooth theme transitions (300ms) without flash
- CSS custom properties for all design tokens
- Color palette: ensure AA contrast ratios (4.5:1 minimum)
- Typography: fluid scale using clamp(), proper line heights
- Spacing system: 8px grid system with semantic naming
- Breakpoint system: mobile-first responsive utilities
- Theme persistence in localStorage
- Context provider for React components
- Integration with existing Catalan brand colors
- Accessibility: respects prefers-color-scheme, high contrast support
- Performance: minimal CSS variables, efficient updates

**Expected Output**: Complete theme system with provider, utilities, and CSS variable architecture.

---

## COMPONENT 6: SKILLS VISUALIZATION

**File**: `src/components/SkillsRadar.tsx`

**Requirements**:
Create an interactive skills radar chart using D3.js with animated skill levels on scroll, hover tooltips with project examples, responsive sizing, and categorical grouping (Frontend/Backend/Tools/Research).

**Specifications**:
- D3.js radar chart with smooth animations
- Skills data: Frontend (React, TypeScript, CSS), Backend (Node.js, Python, Databases), Research (Protein Engineering, AI/ML, Bioinformatics), Tools (Git, Docker, AWS)
- Scroll-triggered animations using GSAP/IntersectionObserver
- Interactive tooltips showing related projects
- Responsive: adapts from mobile (simplified) to desktop (full radar)
- Categorical color coding matching brand palette
- Skill level indicators (1-10 scale) with animated progression
- Accessibility: keyboard navigation, screen reader descriptions
- Performance: optimized D3 rendering, requestAnimationFrame
- Export functionality (SVG/PNG download)

**Expected Output**: Interactive D3.js visualization component with full responsiveness and accessibility.

---

## COMPONENT 7: TIMELINE COMPONENT

**File**: `src/components/Timeline.tsx`

**Requirements**:
Build a career/education timeline with vertical layout, scroll animations, milestone markers with icons, expandable detail cards, connection lines with SVG, and mobile-friendly horizontal scroll alternative.

**Specifications**:
- Vertical timeline for desktop, horizontal scroll for mobile
- Timeline data: education, research positions, publications, awards
- SVG connection lines with animated drawing effect
- Milestone markers: different icons for education/work/publications
- Expandable cards with detailed information
- Smooth scroll animations triggered by viewport intersection
- Date formatting with internationalization
- Filter options: All, Education, Research, Publications
- Accessibility: chronological order, keyboard navigation
- Performance: virtualization for long timelines
- Print-friendly styles

**Expected Output**: Responsive timeline component with smooth animations and detailed milestone information.

---

## COMPONENT 8: TESTIMONIALS SLIDER

**File**: `src/components/Testimonials.tsx`

**Requirements**:
Create a testimonials carousel with auto-play functionality, pause on hover, touch/swipe support for mobile, pagination dots and arrows, LinkedIn integration for photos, rating stars display, and smooth transitions.

**Specifications**:
- Auto-play carousel (5s intervals) with pause on hover/focus
- Touch gestures: swipe left/right on mobile
- Navigation: dots pagination + arrow buttons
- Testimonial data: colleague recommendations, supervisor feedback
- LinkedIn profile integration for photos (with fallback avatars)
- Star ratings (1-5) with animated fill effect
- Smooth transitions using CSS transforms
- Infinite loop carousel behavior
- Accessibility: keyboard navigation, pause button, screen reader announcements
- Performance: lazy load images, efficient transitions
- Admin mode: easy testimonial management

**Expected Output**: Full-featured carousel component with testimonial management system.

---

## COMPONENT 9: BLOG SYSTEM

**File**: `src/components/BlogPost.tsx` and `src/utils/mdx.ts`

**Requirements**:
Implement a blog post component with MDX support, syntax highlighting, table of contents generation, reading time calculation, share buttons for social media, related posts suggestion, and comment system integration readiness.

**Specifications**:
- MDX rendering with custom components
- Syntax highlighting: Prism.js with scientific/code themes
- Auto-generated table of contents from headings
- Reading time estimation based on word count
- Social share buttons: Twitter, LinkedIn, email
- Related posts: based on tags/categories similarity
- Comment system prep: Disqus/GitHub comments integration
- SEO optimization: structured data, meta tags
- Print styles: clean, readable formatting
- Accessibility: heading hierarchy, skip links, focus management
- Performance: code splitting, lazy loading for non-critical features

**Expected Output**: Complete blog system with MDX rendering and content management features.

---

## COMPONENT 10: SEARCH FEATURE

**File**: `src/components/Search.tsx`

**Requirements**:
Build instant search functionality with fuzzy search using Fuse.js, command palette style (cmd+k), search preview with highlighting, keyboard navigation, recent searches storage, and category filtering.

**Specifications**:
- Fuzzy search with Fuse.js across all content
- Command palette UI: overlay with cmd+k/ctrl+k trigger
- Search categories: Publications, Projects, Blog posts, Pages
- Real-time results with highlighted matches
- Keyboard navigation: arrow keys, enter, escape
- Recent searches persistence (localStorage)
- Search suggestions based on content
- Accessibility: proper ARIA labels, focus trap, announcements
- Performance: debounced search, index optimization
- Analytics: search term tracking (privacy-compliant)

**Expected Output**: Advanced search component with command palette interface and content indexing.

---

## COMPONENT 11: SERVICE WORKER

**File**: `public/sw.js`

**Requirements**:
Implement a PWA service worker with offline support, cache strategies, background sync for forms, push notification handling, update prompts, asset versioning, and network-first for API calls.

**Specifications**:
- Cache strategies: Stale-while-revalidate for pages, Cache-first for assets
- Offline page with essential navigation
- Background sync for contact form submissions
- Push notifications for blog updates (optional)
- Update notifications with user prompt
- Asset versioning and cache invalidation
- Network-first strategy for API endpoints
- Skip-waiting option for updates
- Web App Manifest integration
- Performance: efficient caching, cleanup strategies

**Expected Output**: Production-ready service worker with comprehensive PWA features.

---

## COMPONENT 12: PERFORMANCE MONITOR

**File**: `src/utils/performance.ts`

**Requirements**:
Create performance monitoring system with Core Web Vitals tracking, Real User Monitoring (RUM), error boundary reporting, memory leak detection, bundle size analysis, and Lighthouse CI integration.

**Specifications**:
- Core Web Vitals: LCP, FID, CLS, TTFB measurement
- RUM data collection with user consent
- Error tracking with stack traces and user context
- Memory leak detection for long-running sessions
- Bundle analysis integration with webpack-bundle-analyzer
- Performance budgets with alerts
- Lighthouse CI integration for automated testing
- Analytics export (privacy-compliant)
- Performance regression detection
- Real-time monitoring dashboard (development)

**Expected Output**: Complete performance monitoring system with analytics and alerting.

---

## COMPONENT 13: OPTIMIZED IMAGE COMPONENT

**File**: `src/components/OptimizedImage.tsx`

**Requirements**:
Build an image optimization component with lazy loading using Intersection Observer, progressive image loading (LQIP), WebP with fallbacks, responsive srcset generation, blur-up effect, and CDN integration.

**Specifications**:
- Intersection Observer for lazy loading
- LQIP (Low Quality Image Placeholder) with blur-up transition
- WebP format with JPEG/PNG fallbacks
- Responsive images with srcset for different screen sizes
- CDN integration for automatic optimization
- Art direction with picture element
- Loading states with skeleton placeholders
- Error handling with fallback images
- Accessibility: proper alt text, loading announcements
- Performance: efficient loading, memory management

**Expected Output**: Advanced image component with modern optimization techniques.

---

## COMPONENT 14: SEO MANAGER

**File**: `src/utils/seo.tsx`

**Requirements**:
Implement comprehensive SEO management with dynamic meta tags, Open Graph generation, structured data (JSON-LD), sitemap generation, robots.txt management, and canonical URLs.

**Specifications**:
- Dynamic meta tags based on page content
- Open Graph and Twitter Card generation
- Structured data: Person, Organization, Article, Research schemas
- XML sitemap with priority and change frequency
- Robots.txt with proper crawl directives
- Canonical URLs with hreflang for multilingual
- Breadcrumb structured data
- Local SEO optimization for research institution
- Performance: efficient meta tag updates
- Analytics integration for SEO tracking

**Expected Output**: Complete SEO management system with structured data and meta optimization.

---

## COMPONENT 15: ANALYTICS SYSTEM

**File**: `src/utils/analytics.ts`

**Requirements**:
Create analytics implementation with Google Analytics 4, custom event tracking, conversion goal tracking, privacy-compliant GDPR handling, heatmap integration, and A/B testing framework.

**Specifications**:
- Google Analytics 4 with enhanced e-commerce
- Custom events: scroll depth, downloads, form interactions
- Conversion tracking: contact form, publication downloads
- GDPR compliance: consent management, data anonymization
- Privacy-first: no PII collection, IP anonymization
- Heatmap integration (Hotjar/Microsoft Clarity)
- A/B testing framework for content optimization
- Real-time dashboard integration
- Performance impact: minimal script loading
- Cookie-less tracking options

**Expected Output**: Privacy-compliant analytics system with comprehensive tracking.

---

## COMPONENT 16: 3D BACKGROUND

**File**: `src/components/ThreeBackground.tsx`

**Requirements**:
Create a Three.js background with particle system or mesh animation, mouse interaction parallax, performance optimization (60fps), mobile fallback, reduced motion support, and WebGL detection.

**Specifications**:
- Three.js particle system with interactive effects
- Mouse parallax with smooth following
- WebGL detection with Canvas 2D fallback
- Performance: 60fps target, efficient rendering
- Mobile optimization: reduced particle count
- Reduced motion: static alternative
- GPU acceleration with proper disposal
- Dynamic loading based on device capabilities
- Memory management for long sessions
- Integration with existing particle system

**Expected Output**: Advanced Three.js background component with performance optimization.

---

## COMPONENT 17: API ROUTES

**File**: `src/pages/api/[...routes].ts`

**Requirements**:
Build API endpoint handlers for contact form submission, newsletter subscription, view counting, rate limiting middleware, CORS configuration, and comprehensive error handling.

**Specifications**:
- Contact form: validation, email sending, spam protection
- Newsletter: email validation, double opt-in
- Analytics endpoints: page views, event tracking
- Rate limiting: IP-based with Redis/memory store
- CORS: proper origin configuration
- Authentication: API key management
- Error handling: structured responses, logging
- Validation: Zod schemas for all endpoints
- Security: input sanitization, XSS protection
- Performance: efficient processing, caching

**Expected Output**: Complete API system with security and performance optimization.

---

## COMPONENT 18: ANIMATION CONTROLLER

**File**: `src/utils/animations.ts`

**Requirements**:
Create a master animation system with GSAP timeline management, scroll-triggered animations, reduced motion preferences, stagger effects, page transitions, and performance optimization.

**Specifications**:
- GSAP timeline coordination across components
- Scroll-triggered animations with IntersectionObserver
- Reduced motion: graceful fallbacks
- Stagger animations for lists and grids
- Page transition animations (enter/exit)
- Animation queuing and priority system
- Performance: requestAnimationFrame optimization
- Memory management: proper cleanup
- Debug mode: animation timing visualization
- Integration with existing components

**Expected Output**: Centralized animation system with performance optimization.

---

## COMPONENT 19: TESTING SUITE

**File**: `tests/e2e.spec.ts`

**Requirements**:
Implement comprehensive tests with E2E testing using Playwright, component testing setup, accessibility tests (axe-core), performance benchmarks, visual regression tests, and CI/CD integration.

**Specifications**:
- E2E tests: user journeys, form submissions, navigation
- Component testing: React Testing Library
- Accessibility: axe-core automated testing
- Performance: Lighthouse CI, bundle size monitoring
- Visual regression: screenshot comparison
- Cross-browser testing: Chrome, Firefox, Safari
- Mobile testing: responsive design validation
- CI/CD integration: GitHub Actions
- Test reporting: coverage and performance metrics
- Parallel test execution

**Expected Output**: Complete testing suite with automated CI/CD integration.

---

## COMPONENT 20: BUILD CONFIGURATION

**File**: `vite.config.ts` (enhancement to existing astro.config.mjs)

**Requirements**:
Enhance build configuration with advanced code splitting strategies, tree shaking optimization, compression (gzip/brotli), asset optimization, environment variables management, and deployment configuration.

**Specifications**:
- Advanced code splitting: vendor, features, utilities
- Tree shaking: eliminate unused code
- Compression: gzip + brotli for all assets
- Asset optimization: images, fonts, SVGs
- Environment management: development/staging/production
- Bundle analysis: size tracking and alerts
- Source maps: optimized for production
- Performance budgets: automatic enforcement
- CDN integration: asset prefixing
- Deploy optimization: static asset caching

**Expected Output**: Production-optimized build configuration with performance monitoring.

---

## IMPLEMENTATION GUIDELINES FOR ALL COMPONENTS

### Code Quality Standards:
```typescript
// Use strict TypeScript with proper interfaces
interface ComponentProps {
  lang: 'en' | 'es' | 'ca';
  className?: string;
}

// React 19 patterns (no legacy)
const Component: React.FC<ComponentProps> = ({ lang, className }) => {
  // Implementation
};
```

### Performance Requirements:
- Bundle size: Each component <15KB uncompressed
- Runtime: 60fps animations, <100ms interaction response
- Accessibility: WCAG AA compliance mandatory
- Loading: Progressive enhancement with fallbacks

### Integration Pattern:
```astro
---
// Astro page integration
import Component from '../components/Component';
---
<Component lang={lang} client:load />
```

### Testing Requirements:
- Unit tests for all utilities
- Integration tests for components
- E2E tests for user journeys
- Accessibility automated testing

**Expected Deliverables**: Each component should be production-ready with full documentation, type safety, and integration examples.