Scientific portfolio front‑end overhaul (compact plan)

Constraints
- Keep all existing copy and fonts (Outfit for display, Inter for body).
- Preserve current color identity (red/black) but polish contrast, depth, and motion.
- Avoid heavy rewrites to content structure; focus on presentation, rhythm, and micro‑interactions.

High‑level goals
- Increase perceived quality: spacing, alignment, contrast, and subtle depth.
- Introduce restrained motion: gentle parallax, micro‑interactions, section reveals (prefers‑reduced‑motion respected).
- Create a cinematic hero inspired by latentlabs.com/latent-x while retaining this site’s red/black aesthetic.
- Improve scannability: clearer section hierarchy, consistent cards, and stronger grid rhythm.

Key updates (by area)
- Navigation (src/components/NavigationPremium.astro)
  - Keep current structure; refine transparency, blur, and active states.
  - Add subtle underline slide on hover and compact language pills.

- Hero (src/components/HeroFinal.astro)
  - Layered background: video + red glow orbs + faint dot grid; deepen gradients and edge vignettes.
  - Typography: maintain current sizes; add gradient text for last name and improved weight contrast.
  - CTAs: primary solid red with soft glow, secondary glassy border; consistent 44px+ hit targets.
  - Scroll hint: simplified capsule with animated dot.

- Global layout and theme (src/layouts/Layout.astro)
  - Ensure global tokens: --accent-red, surfaces, borders, and hero accent shapes (top‑right red glow, bottom‑left dark glow) with slow drift.
  - Respect reduced motion for all animations.

- Sections and cards
  - Unify card surfaces: surface/surface‑elevated, 1px borders, soft inner shadows on hover.
  - Animate in on scroll with fade‑up; stagger children for lists and grids.
  - Publications: featured badge, year pill, 8–12px elevation on hover with color‑matched rim light.

- Motion system (src/styles/animations.css, src/components/EnhancedAnimations.astro)
  - Use easing tokens (expo/quint/back) and standard durations (200/300/500/800ms).
  - Parallax only for decorative layers; clamp translation and disable when reduced motion is set.
  - Micro‑interactions: hover‑lift, link underline grow, molecular‑pulse for primary CTAs (paused on hover).

Performance and accessibility
- Maintain AA contrast on dark surfaces; increase legibility for small caption text.
- Keep animations GPU‑friendly (transform/opacity), no layout thrash; rely on will‑change sparingly.
- Guard all non‑essential motion with prefers‑reduced‑motion.
- Budget: keep main thread work minimal; avoid large runtime libs.

Implementation checklist (files already present in repo)
- src/layouts/Layout.astro
  - Tokens set for background, surfaces, borders, and accent red; includes hero accent dual‑shape drift.
  - Meta/SEO and font preloads preserved.

- src/components/NavigationPremium.astro
  - Sticky blurred nav, underline hover, compact language switcher, mobile menu slide‑in.

- src/components/HeroFinal.astro
  - Video layer with gradient/overlay, glow orbs, dot grid, and refined type/CTAs/scroll indicator.

- src/components/EnhancedAnimations.astro and src/styles/animations.css
  - Centralized animation tokens and utilities; intersection‑observer reveal and micro‑interactions.

- src/styles/design-system.css and src/styles/main.css
  - Typographic scale, spacing grid, surfaces, borders, shadows, utilities for consistent cards and grids.

Polish passes to consider next (optional)
- Add a very subtle red chromatic aberration on hero title during initial reveal (1s, opacity‑only fallback).
- Introduce section header component to standardize title/accent‑bar/description layout.
- Replace inline style animation‑delays with utility classes to reduce in‑markup timing noise.

Acceptance criteria
- Visual: refined hero with layered depth and smooth motion; consistent card styling; centered, calm rhythm across sections.
- Accessibility: reduced‑motion respected; focus rings visible; link underlines present; contrast AA+ for body/caption text on dark.
- Performance: no layout jank from animations; images/video lazy where possible; build passes without regressions.

How to preview
- npm ci
- npm run dev (open local preview)
- npm run build (checks production output)

Notes
- Fonts and copy remain unchanged per requirement; the overhaul is purely stylistic and interaction‑level.
