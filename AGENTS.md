Operational notes for future iterations and reproducibility

Scope
- This file captures the minimal, red–black design system and the deployment flow now wired into RRocaP/Portfolio so any agent can pick up, iterate, and redeploy consistently.

Key branches
- main: live production branch (auto‑deploy via GitHub Actions).
- gh-pages-staging: optional branch receiving dist/ for staging previews (manual workflow available).

Design targets (first fold)
- Background: pure black with minimal abstract shapes (hero only), not site‑wide.
  - Primary: top‑right red radial glow with gentle drift.
  - Secondary: bottom‑left dark radial glow, very subtle, also gently drifting.
  - Motion: very slow drift; disabled under prefers‑reduced‑motion.
  - Mobile: shapes scale and blur more to avoid overpowering on phones.
- Typography
  - Display: Outfit (for the name).
  - Body: Inter.
- CTAs: Learn More, Get in Touch (localized in ES/CA), stacked on mobile.
- Mouse indicator retained and simplified.

Where to edit
- Global hero background (both shapes, animation, reduced‑motion, mobile scale)
  - File: src/layouts/Layout.astro
  - Block: dark‑mode CSS near the end; selectors: .hero-accent::before / .hero-accent::after
  - Tuning knobs:
    - Alpha and falloff: rgba(var(--accent-red-rgb), A)
    - Size: width/height in vw
    - Position: top/right/left/bottom offsets in vh/vw
    - Motion amplitude: translate3d and rotate deltas inside @keyframes slow-drift and slow-drift-2
    - Motion speed: animation duration (e.g., 12s, 16s)
    - Mobile overrides: the @media (max-width: 480px) section at the end of the block

- Per‑language hero (local accent color + underline)
  - EN: src/pages/en/index.astro
  - ES: src/pages/es/index.astro
  - CA: src/pages/ca/index.astro
  - Local overrides in .hero { --accent-red, --accent-red-rgb } keep the darker Claude red only for the hero, not globally.
  - Underline is the ::after of .hero-title; width/height adjust the look.
  - Mobile tweaks (title size, stacked CTAs) live at the bottom of each page’s style block.

- Timeline visualization (centered legend/plot + improved solution panel)
  - File: src/components/AntimicrobialResistanceTimeline.tsx
  - Centered legend logic: legendItems + computed total width, then startX to center.
  - SVG centering: class timeline-svg with margin: 0 auto.
  - CMC‑inspired color palette: cmcPalette array (batlow‑like) for high contrast.
  - Solution panel copy: edit within the JSX; styles immediately below.

Plot palette for Python (if used offline)
- Existing scripts use cmcrameri (e.g., vikO) already.

Fonts
- Linked in src/layouts/Layout.astro head: Outfit (display) and Inter (body).
- To change weights/sizes: adjust h1–h3 styling in the same file or page‑local styles.

Deployment
- Production: .github/workflows/deploy.yml
  - Triggers: push to main (auto), or manual workflow_dispatch.
  - Uses actions/deploy-pages to publish the Astro build.
- Staging (branch artifact): .github/workflows/deploy-staging.yml
  - Manual only. Builds and force‑pushes dist/ to gh-pages-staging.

Developer commands
- Local
  - npm ci
  - npm run dev (local preview)
  - npm run build (generate dist)
- Trigger production deploy
  - Push to main, or run the workflow manually:
    - gh workflow run deploy.yml -R RRocaP/Portfolio
- Trigger staging deploy (to gh-pages-staging)
  - GitHub Actions → Deploy (staging) to branch → Run workflow
  - Or: gh workflow run deploy-staging.yml -R RRocaP/Portfolio

Astro config
- astro.config.mjs
  - site: https://RRocaP.github.io
  - base: /Portfolio
  - output: static

Accessibility and motion
- Reduced motion respected across hero shapes and animations.
- Contrast maintained for red/black on dark backgrounds.

Mobile checks
- Hero titles scale via clamp; CTAs stack; background shapes downscale.
- Pages: EN/ES/CA tested at <=480 px with simpler layout in each page’s CSS.

What to tweak quickly (common requests)
- More/less red accent: edit alpha and falloff in src/layouts/Layout.astro under .hero-accent::before.
- More/less motion: edit slow-drift and slow-drift-2 keyframes; increase/decrease translate/rotate deltas.
- Single‑shape vs dual‑shape: remove the ::after block in Layout if only one shape is desired.
- Hero underline thickness/length: change width/height in .hero-title::after in each language page.

Copy guidelines (first fold, solution panel)
- Avoid fluff; describe specific techniques and validation steps.
- Keep bullets scannable; emphasize multi‑mechanism strategy, manufacturability, and bench assays.

File map (touched in this iteration)
- src/layouts/Layout.astro (global hero accent, fonts, base theme)
- src/pages/en/index.astro (hero content and local darker red)
- src/pages/es/index.astro (hero content and local darker red)
- src/pages/ca/index.astro (hero content and local darker red)
- src/components/AntimicrobialResistanceTimeline.tsx (legend centering, palette, solution panel)
- .github/workflows/deploy.yml (auto deploy)
- .github/workflows/deploy-staging.yml (staging branch deploy)

Review checklist before pushing
- Build succeeds: npm run build
- Hero accent looks correct in EN/ES/CA and on mobile sizes.
- Reduced motion disables drift.
- Timeline legend centered and solution panel copy reads cleanly.
- Push to main → Actions shows “Deploy Astro site to GitHub Pages” and “Deploy to GitHub Pages”.

Support commands (gh)
- gh auth status -h github.com
- gh run list -R RRocaP/Portfolio --limit 5
- gh run view <run-id> -R RRocaP/Portfolio
