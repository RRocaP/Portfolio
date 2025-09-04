# Project: Ramon Roca‑Pinilla — Portfolio (v1)

## Goal
Ship a fast, elegant personal site that presents Ramon’s research, publications, software, and one music piece in a **calm, minimal** style with **white/black + Catalan accents**. Keep funding as a **single lump sum** only.

## Information Architecture
- Home (hero, one‑line value prop, latest work highlights)
- Research (areas, current position at TVU @ CMRI; phage + AAV; antimicrobial focus)
- Publications (selected list; deep link to Google Scholar)
- Projects/Code (GitHub highlights)
- Music (Apple Music embed for *Cartographers’ Daughter*)
- CV (download + compact timeline)
- Contact (email, phone, Westmead address; LinkedIn handle)

## Brand & Visual System
- **Base**: white/black; large whitespace; grid/alignment strict.
- **Accents** (tiny doses only):  
  - `--accent-red: #CC0000`  
  - `--accent-yellow: #FFD700`  
  - `--accent-blue: #0F47AF` (optional, very sparingly)  
  Source for tones: Catalan/Estelada references.  
- **Type**: Display = Space Grotesk; Text = Inter (next/font). Letter‑spacing tight; sizes responsive.
- **Motion**: micro‑interactions (opacity/translate/scale ≤ 1.02). No parallax. 250–350ms easings.

## Content Rules
- **Voice**: precise, restrained, academic; minimal adjectives.  
- **Funding**: show **“≈€94.4k + US$222.6k in scholarships/grants”** only; omit itemized amounts.  
- **Bio lengths**: 40‑word, 120‑word, 250‑word versions.  
- **Publications**: show 6 curated; link “View all on Scholar”.  
- **Ethics**: avoid clinical claims; keep AAV/phage wording accurate and non‑promissory.

## Data Sources
- Google Scholar: `jYIZGT0AAAAJ`
- ORCID: `0000-0002-7393-6200`
- GitHub: `RRocaP`
- Apple Music track: *Cartographers’ Daughter* (AU store)

## Agents & Hand‑offs
1) **Creative Direction Agent**
   - Deliverables: moodboard (1 screen), palette tokens, type scale, component kit (Nav, Card, Button, Tag).
   - Acceptance: passes WCAG AA contrast; accent usage under 5% of pixels.

2) **“Codex” Content Agent**
   - Task: read CV + publications (Scholar/ORCID) to infer tone; draft 3 bio lengths; 6 highlighted publications (APA style); 3 research themes (1‑sentence each); 2 short blurbs for projects.
   - Acceptance: no hype, all claims cite a publication or program you actually did.

3) **Data Agent**
   - Build server utilities to pull:  
     - ORCID works (public API v3 JSON)  
     - Scholar profile (screen‑scrape or SerpAPI—optional, feature‑flagged)  
     - GitHub pinned repos (GraphQL or REST)  
   - Acceptance: resilient fallbacks to static lists; 500ms budget per source at build‑time.

4) **UI Engineer**
   - Stack: Next.js (App Router, RSC), TypeScript, TailwindCSS, MDX, `next/font`, edge runtime for light APIs.
   - Deliverables: pages + components below; Lighthouse ≥ 95 in PWA/Perf/A11y/SEO.
   - Acceptance: passes keyboard nav; prefers `prefers-reduced-motion`.

5) **Build/Infra**
   - Vercel project; preview deploys per PR; analytics + OG image generation; sitemap + robots.

6) **QA**
   - Check copy accuracy (affiliations, emails), alt text, responsive breakpoints, and schema.org.

## Pages & Components (MVP)
- Components: `NavBar`, `Footer`, `AccentStrip`, `Tag`, `Card`, `PubCard`, `Timeline`, `CTAButton`.
- Pages: `Home`, `Research`, `Publications`, `Projects`, `Music`, `CV`, `Contact`.

## Constraints
- No third‑party UI frameworks; optional `lucide-react` icons only.
- No heavy animations. No carousels.

## Timeline
- Day 1: brand tokens + shell + Home/Publications  
- Day 2: Research/Projects/Music/Contact + ORCID integration  
- Day 3: polish, a11y, SEO, deploy
