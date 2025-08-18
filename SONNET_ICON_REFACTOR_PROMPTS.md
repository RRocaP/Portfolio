# Claude Code (Sonnet) Prompts — Icons + Front‑End Refactor

Below are the ready‑to‑paste prompts tuned for Claude Code (Sonnet) targeting this Astro + Tailwind repo structure.

---

## 1) Icon set (small, consistent SVGs — no “gigantic Jesus”)

Prompt (paste into Claude Code):

You are a senior icon designer + front-end engineer. Generate a compact, consistent SVG icon set (stroke style, 24×24 grid, 1.75px stroke, rounded caps/joins, no fills unless necessary). Icons needed:
  1) GitHub (mark), 2) Publications/star, 3) ORCID, 4) Google Scholar, 5) LinkedIn, 6) Email, 7) Download CV, 8) External link, 9) Language (EN/ES/CA globe), 10) Research (flask/minimal beaker), 11) AAV/capsid (icosahedron outline), 12) Protein/helix (simple alpha-helix), 13) Contact.

Constraints:
  • Size defaults: 20–24 px inline; do not exceed 28 px on any breakpoint.
  • Provide pure inline SVG sources and a TypeScript React wrapper for Astro: src/components/icons/*.tsx, plus an index.ts that re-exports named icons.
  • Match current stack (Astro + Tailwind) and export props {size=24, className, title}.
  • Add accessible <title> elements and aria-hidden when title is absent.
  • Include dark-mode aware classes via currentColor only. No hardcoded colors.

Deliverables:
  • src/components/icons/ with one TSX per icon + index.ts.
  • Example usage snippet that replaces large raster/emoji icons on the homepage and publications sections.
  • A Tailwind utility note: recommend icon-sm = h-5 w-5, icon = h-6 w-6.
  • Ensure the icons visually align with the typographic rhythm of headings and links—no visual dominance.

After generating the files, produce a unified patch (git diff) that:
  • Imports icons and replaces any oversized icon elements in the site header, social links, publications list, and “Research” cards with the new SVG components set to className="icon" or className="icon-sm".
  • Adds a sr-only label where needed for accessibility.
  • Explains exactly where to paste or move the files in this repo (Astro project rooted at /, Tailwind present). Refer to concrete paths.

Why this fits your repo/site: You’re on Astro + Tailwind and your current UI uses heavy, large visuals and inconsistent iconography; this prompt enforces small, accessible, code-native SVGs wired into Astro components.

---

## 2) Front-end refactor (layout, spacing, typography, performance)

Prompt (paste into Claude Code):

Act as a front-end lead refactoring an Astro + Tailwind portfolio to improve legibility, hierarchy, and performance without changing content.

Goals:
  • Type scale & rhythm: Define a 4-step modular scale. Replace ad-hoc text sizes with a system (text-sm/base/lg/xl/2xl/3xl) and consistent leading.
  • Spacing: Adopt space-y-* and gap-* tokens; remove magic margins.
  • Cards/sections: Convert hero + “Protein Design in Action” + “Research/AAV/AMP” blocks to a clean grid (mobile-first, 12-col at lg+), with subtle borders (border-white/10 in dark), rounded-2xl, shadow-sm.
  • Icons: integrate the new SVG icon set from src/components/icons/ with sizes icon-sm/icon.
  • Links: Standardize external links to have inline-flex items-center gap-1 and append the ExternalLink icon at icon-sm.
  • Publications list: Tighten density; move metrics into a quiet subline; make the venue a subdued accent; ensure consistent icon size.
  • Performance:
    • Convert decorative PNGs/JPGs to <Image /> / optimized assets or remove if not adding value;
    • Prefer SVG for line art (helix/capsid).
    • Lazy-load non-critical sections.
  • A11y: Ensure headings are sequential (h1 → h2), icons have title or aria-hidden, sufficient contrast.

Implementation requests:
  • Produce minimal diffs for Astro pages/components under src/ to apply the above (show exact files/lines).
  • Introduce src/styles/tokens.css for type scale and spacing shorthands, referenced in Tailwind config if needed.
  • Remove inline styles; replace with Tailwind utilities.
  • Keep copy as-is.

Output: a git patch I can apply, plus a 10-line checklist to verify rendering.

Why this fits: Your site’s hero and research blocks show inconsistent hierarchy and oversized visuals; repo indicates Tailwind + Astro, so the refactor can be applied as small diffs.

---

## 3) Micro-prompt to regenerate only the icons (fast iteration)

Prompt (short):

Generate 24×24 stroke SVGs for: GitHub, Publications star, ORCID, Scholar, LinkedIn, Email, CV download, External link, Language globe (EN/ES/CA), Research flask, Icosahedral capsid, Alpha-helix, Contact.
Style: single stroke weight 1.75px, rounded caps/joins, currentColor, accessible <title>.
Output: one inline SVG per icon and a single TypeScript React wrapper per icon under src/components/icons/, with export { IconName } from index.ts.
Show usage replacing current large icons in the header and publications lists. Keep display size 20–24px.

---

Notes from a quick audit
  • Framework/stack: Astro + Tailwind; repo includes astro.config.mjs and tailwind.config.mjs.
  • Design pain points on the live page: oversized graphics and uneven typographic hierarchy; iconography lacks a consistent system; publications and research cards present visual noise.

Optional
If desired, generate a git apply-ready patch that: adds the icon components, normalizes the header and publications list, and adjusts the hero grid.

