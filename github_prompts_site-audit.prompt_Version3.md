---
description: "Full website audit: accessibility, performance, SEO, i18n, video hygiene for Astro portfolio"
mode: "agent"
---

**Context:**
Astro + Tailwind portfolio with localized routes `/en`, `/es`, `/ca`.
Base path: `/Portfolio`
Site: https://RRocaP.github.io

**Goals (in order):**
1. Accessibility (a11y): semantic HTML, focus states, reduced-motion
2. Performance: responsive video, media hygiene, Core Web Vitals
3. SEO / JSON-LD: Person + first-author papers
4. i18n: hreflang, canonical, no duplicate content
5. Video hygiene: SmartVideo component, posters, sizing
6. CI checks: Lighthouse, a11y, build validation

**House rules:**
- Output **minimal, actionable diffs** with file paths
- Use **multi-file edits** when changing multiple files
- Avoid inventing dependencies; follow Astro/Tailwind conventions
- Do not bake text in video media; use components or overlay captions
- Respect `prefers-reduced-motion` for motion elements
- Maintain the red-black design system already in place

**Phases:**

## Phase 0 - Repository Scan & Architecture
*Model: Claude Opus 4.1 or GPT-5*
**Why: Deep codebase analysis, architectural planning, pattern recognition**

Scan repo structure:
- Analyze Astro/Tailwind setup and versions
- Map `/en`, `/es`, `/ca` route structures and components
- Identify existing design patterns and technical debt
- Review deployment pipeline and GitHub Actions
- Analyze performance bottlenecks

Output: Architectural audit with actionable plan under 200 lines

## Phase 1 - Accessibility Deep Dive
*Model: Claude Sonnet 4*
**Why: WCAG expertise, nuanced HTML semantics, comprehensive a11y patterns**

Focus areas:
- Complete WCAG 2.1 AA audit
- Semantic HTML5 with ARIA enhancement
- Keyboard navigation and focus management
- Screen reader optimization
- Color contrast verification (red #dc2626 on black)
- Motion sensitivity handling

Deliverables:
- Precise diffs with rollback notes
- Full Playwright + axe-core test coverage
- Accessibility scorecard

## Phase 2 - Advanced Video Component
*Model: Claude Sonnet 4*
**Why: Complex component architecture, performance patterns, Astro expertise**

Create `SmartVideo.astro`:
- Multi-codec support (H.264/VP9/AV1)
- Intelligent poster frames
- Aspect ratio system (16:9, 1:1, 21:9)
- Adaptive bitrate selection
- Intersection Observer lazy loading
- Reduced-motion fallbacks
- Picture-in-picture API

Include complete ffmpeg pipeline for video processing

## Phase 3 - SEO & Structured Data Excellence
*Model: Gemini 2.5 Pro*
**Why: Exhaustive schema.org knowledge, complex JSON-LD, SEO optimization**

Implement:
- Complete Person schema for researcher
- ScholarlyArticle with full metadata graph
- Organization and affiliation schemas
- BreadcrumbList navigation
- WebSite with SearchAction
- Rich snippets for publications
- Complete hreflang matrix
- Canonical URL strategy

Validation through Google Rich Results and schema.org

## Phase 4 - International Content Architecture
*Model: Gemini 2.5 Pro*
**Why: Multi-language SEO, regional optimization, content strategy**

Build complete i18n system:
- URL structure per locale
- hreflang cluster mapping
- Regional meta optimization
- Language-specific sitemaps
- Smart language detection
- Content parity tracking
- SEO-friendly language switcher

Testing matrix for all locale combinations

## Phase 5 - Research Showcase System
*Model: GPT-5*
**Why: Complex UI/UX patterns, data visualization, interactive components**

Enhanced publications:
- Dynamic author role badges
- Real-time citation metrics
- Interactive research timeline
- SmartVideo integration matrix:
  - Hero: 16:9 with chapters
  - Cards: 1:1 with preview
  - Banners: 21:9 cinematic
- Zero CLS implementation
- Smooth transitions

## Phase 6 - CI/CD Excellence
*Model: Claude Opus 4.1*
**Why: Complex GitHub Actions, testing orchestration, deployment optimization**

Complete CI pipeline:
- Multi-stage GitHub Actions workflow
- Parallel test execution:
  - TypeScript validation
  - ESLint with custom rules
  - Lighthouse CI with budgets
  - Axe-core accessibility
  - Visual regression tests
- Smart caching strategies
- Branch protection rules
- Deployment gates
- Performance budgets

Shell scripts for local validation

**Model Selection Notes:**
- **Claude Opus 4.1**: Best for complex code architecture, CI/CD, deep analysis
- **Claude Sonnet 4**: Best for precise implementation, component building, Astro-specific patterns
- **GPT-5**: Best for creative UI/UX, complex interactions, data visualization
- **Gemini 2.5 Pro**: Best for exhaustive SEO, structured data, multi-language optimization

**End of prompt**