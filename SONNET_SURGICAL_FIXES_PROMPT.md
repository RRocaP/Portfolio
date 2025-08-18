# Sonnet 4 Surgical Fix Implementation Guide

## Executive Summary
You are implementing critical surgical fixes for an Astro + React portfolio to achieve successful production build and GitHub Pages deployment. Focus on minimal, targeted edits to fix compilation errors, encoding issues, and ensure static hosting compatibility.

## Context & Constraints
- **Stack**: Astro 5, React 19, TypeScript, Tailwind, D3, GSAP, Zod
- **Hosting**: GitHub Pages (static output, base=/Portfolio)
- **Performance Targets**: <150KB JS, <50KB CSS, Lighthouse ≥95
- **Accessibility**: WCAG AA compliant, respects prefers-reduced-motion
- **Key Principle**: Surgical edits only - minimize diff size, no new dependencies

## Section 1: Plan and Order of Operations

### Phase 1: Fix Build-Breaking Syntax Issues (Priority 1)
1. **Fix Timeline.tsx** - Remove markdown fences breaking TSX compilation
2. **Fix seo.tsx** - Remove corrupted appended component code
3. **Fix Testimonials.tsx** - Fix missing type import preventing compilation

### Phase 2: Implement Missing Core Utilities (Priority 2)
4. **Implement mdx.ts** - Add minimal MDX utilities for content rendering
5. **Fix analytics.ts** - Ensure consent gating and safe defaults

### Phase 3: Fix Encoding & Quality Issues (Priority 3)
6. **Fix SkillsRadar.tsx** - Repair mojibake in i18n strings
7. **Update Testimonials.tsx** - Fix mojibake in testimonial content
8. **Verify sw.js** - Ensure proper cache exclusions and versioning

### Why This Order:
- **Phase 1 first**: Compilation errors block all progress
- **Phase 2 second**: Core utilities needed by multiple components
- **Phase 3 last**: Quality improvements that don't block build
- **Dependencies flow**: seo.tsx → components → i18n fixes
- **Risk mitigation**: Each phase independently deployable

## Section 2: Acceptance Criteria Checklist

### Per-Edit Requirements:
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Astro build succeeds (`npm run build`)
- [ ] No runtime reference errors in browser console
- [ ] UTF-8 text renders correctly (Spanish: Español, Catalan: Català)
- [ ] No layout jank or animation issues
- [ ] Respects `prefers-reduced-motion` media query
- [ ] No new npm dependencies added
- [ ] Bundle stays within targets (<150KB JS, <50KB CSS)
- [ ] Static output compatible with GitHub Pages
- [ ] Base path `/Portfolio` properly handled in all URLs

## Section 3: Sonnet 4 Job Cards

### Job Card 1: Fix Timeline.tsx Syntax
**Goal**: Remove markdown code fences that break TSX compilation
**File**: `src/components/Timeline.tsx`
**Exact Edits**:
1. Remove any leading ` ```typescript` or ` ```tsx` at the start
2. Remove any trailing ` ``` ` at the end
3. Ensure file starts with valid imports and ends with valid export
**Return Format**: Full replacement file without any markdown formatting
**Validation**: 
```bash
npm run type-check
grep -E '^\`\`\`' src/components/Timeline.tsx # Should return nothing
```

### Job Card 2: Fix seo.tsx Corruption
**Goal**: Remove appended component code, export clean SEO helpers
**File**: `src/utils/seo.tsx`
**Exact Edits**:
1. Remove any component code after the last legitimate function
2. Export only pure helper functions:
   - `getCanonicalUrl(pathname: string, base?: string): string`
   - `generateMetaTags(props: SEOProps): MetaTag[]`
   - `generateHreflangTags(langs: string[], currentPath: string): LinkTag[]`
   - `generateJSONLD(data: PersonSchema | WebSiteSchema): string`
3. Return objects/arrays that Astro can use in <head>, not React components
**Return Format**: Full replacement file with clean exports only
**Validation**:
```bash
npm run type-check
grep -A5 "export.*Component" src/utils/seo.tsx # Should not find React components
```

### Job Card 3: Fix Testimonials.tsx Type Import
**Goal**: Replace non-existent type import with inline type definition
**File**: `src/components/Testimonials.tsx`
**Exact Edits**:
1. Remove: `import type { Testimonial } from '../types/testimonials'`
2. Add inline type before component:
```typescript
interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  text: string
  rating?: number
  image?: string
}
```
3. Fix mojibake: Replace garbled characters with proper UTF-8
   - "IngenierÃ­a" → "Ingeniería"
   - "investigaciÃ³n" → "investigación"
   - Similar fixes for all Spanish/Catalan text
**Return Format**: Unified diff against current file
**Validation**:
```bash
npm run type-check
grep "IngenierÃ" src/components/Testimonials.tsx # Should return nothing
```

### Job Card 4: Implement mdx.ts Utilities
**Goal**: Add minimal MDX utilities without heavy dependencies
**File**: `src/utils/mdx.ts`
**Exact Implementation**:
```typescript
// Minimal implementation - no heavy deps
export function renderMDXToReact(md: string, components?: Record<string, any>): string {
  // Basic markdown to HTML (use built-in or lightweight approach)
  return md; // Simplified for now
}

export function getTOC(md: string): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const lines = md.split('\n');
  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      headings.push({ id, text, level });
    }
  });
  return headings;
}

export function getReadingTime(md: string): { minutes: number; words: number } {
  const words = md.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return { minutes, words };
}
```
**Return Format**: Full replacement file
**Validation**:
```bash
npm run type-check
```

### Job Card 5: Fix SkillsRadar.tsx Encoding
**Goal**: Fix mojibake in Spanish/Catalan labels
**File**: `src/components/SkillsRadar.tsx`
**Exact Edits**:
1. Find and replace all mojibake:
   - "ProteÃ­nas" → "Proteínas"
   - "IngenierÃ­a" → "Ingeniería"
   - "BiotecnologÃ­a" → "Biotecnología"
   - "InvestigaciÃ³n" → "Investigación"
   - "GestiÃ³n" → "Gestión"
   - Any other garbled UTF-8
**Return Format**: Unified diff showing only the string replacements
**Validation**:
```bash
grep -E "Ã|Â" src/components/SkillsRadar.tsx # Should return nothing
```

### Job Card 6: Verify Service Worker
**Goal**: Ensure proper cache exclusions and versioning
**File**: `public/sw.js`
**Required Features**:
1. Add version constant at top: `const CACHE_VERSION = 'v1.0.0';`
2. Verify exclusions exist:
   - Skip caching for: POST, PUT, DELETE methods
   - Skip caching for: URLs containing `/api/`
   - Skip caching for: URLs with query params `?nocache`
3. Ensure SWR for pages, cache-first for assets
4. Add update prompt flow if missing
**Return Format**: Unified diff if changes needed, or confirmation message if already correct
**Validation**:
```bash
grep "POST\|PUT" public/sw.js # Should show exclusion logic
grep "/api/" public/sw.js # Should show exclusion logic
```

### Job Card 7: Verify Analytics Safety
**Goal**: Ensure consent gating and safe defaults for static hosting
**File**: `src/utils/analytics.ts`
**Required Features**:
1. Default export must check:
   - User consent flag (localStorage or cookie)
   - Feature flag (disabled by default)
2. No automatic tracking on page load
3. Export initialization function that respects consent
**Return Format**: Unified diff if changes needed
**Validation**:
```bash
grep "consent" src/utils/analytics.ts # Should show consent checking
grep "enabled.*false" src/utils/analytics.ts # Should show disabled default
```

### Job Card 8: Global UTF-8 Encoding Sweep
**Goal**: Fix any remaining mojibake across new files
**Files**: All recently modified `.tsx`, `.ts` files
**Process**:
1. Search for common mojibake patterns: Ã¡, Ã©, Ã­, Ã³, Ãº, Ã±, Ã§
2. Replace with proper UTF-8: á, é, í, ó, ú, ñ, ç
3. Common fixes:
   - "EspaÃ±ol" → "Español"
   - "CatalÃ " → "Català"
   - "biologÃ­a" → "biología"
**Return Format**: List of files changed with unified diffs
**Validation**:
```bash
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "Ã" # Should return nothing
```

## Section 4: Verification and Deploy Steps

### Build Verification:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci

# Type checking
npm run type-check

# Build production
npm run build

# Preview locally (optional)
npm run preview
# Visit http://localhost:4321/Portfolio to verify

# Check bundle size
ls -lh dist/_astro/*.js | head -5
ls -lh dist/_astro/*.css | head -5
```

### Deploy to GitHub Pages:
```bash
# Ensure gh-pages branch exists
git branch -a | grep gh-pages

# Deploy (builds and pushes to gh-pages)
npm run deploy

# Verify deployment
# Visit: https://[username].github.io/Portfolio
```

### Post-Deploy Verification:
1. Check browser console for errors
2. Verify all text displays correctly (no mojibake)
3. Test navigation and interactive components
4. Run Lighthouse audit (target ≥95)
5. Test with screen reader for accessibility

## Section 5: Roll-back Plan

### If Build Fails After Changes:
```bash
# Revert to last known good commit
git log --oneline -10  # Find last working commit
git reset --hard <commit-hash>

# Or revert specific files
git checkout HEAD -- src/utils/seo.tsx
git checkout HEAD -- src/components/Timeline.tsx
# etc.
```

### If Deploy Introduces Regressions:
```bash
# Revert gh-pages to previous version
git checkout gh-pages
git log --oneline -5  # Find previous deploy
git reset --hard <previous-deploy-hash>
git push --force-with-lease origin gh-pages
```

### Emergency Hotfix Process:
1. Create hotfix branch from last known good
2. Apply minimal fix for critical issue only
3. Test locally with `npm run build && npm run preview`
4. Deploy directly with `npm run deploy`
5. Create PR to merge hotfix back to main

## Implementation Instructions for Sonnet

When implementing each job card:

1. **Read the current file first** to understand existing structure
2. **Make minimal changes** - preserve working code
3. **Test after each change** with `npm run type-check`
4. **Use exact replacements** from the job cards
5. **Return only code** - no markdown formatting or explanations
6. **Validate encoding** - ensure all text is proper UTF-8
7. **Preserve functionality** - don't break existing features

Priority order:
1. Fix compilation errors first (Timeline, seo, Testimonials type)
2. Implement missing utilities (mdx.ts)
3. Fix quality issues (encoding, service worker)

Success criteria:
- `npm run build` completes without errors
- No TypeScript compilation errors
- All text displays correctly
- Bundle sizes remain within targets
- Site deploys successfully to GitHub Pages