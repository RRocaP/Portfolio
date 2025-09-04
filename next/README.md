# Next.js Prototype — Ramon Roca‑Pinilla

Quick start
- cd next
- npm i
- npm run dev

Static export for GitHub Pages
- Build: `GITHUB_PAGES=true npm run build` (writes to `next/out/`)
- Serve locally: `npx serve out`

Notes
- App Router with Space Grotesk + Inter; Senyera accents as micro‑details.
- ORCID fetch runs at build time; if rate‑limited, falls back to curated list.
- For Pages under `/Portfolio`, `GITHUB_PAGES=true` sets `basePath`/`assetPrefix`.

