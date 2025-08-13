## Copilot Instructions for RRocaP Portfolio

Primary Scope: Audit & improve an Astro + Tailwind multilingual research portfolio with routes `/en`, `/es`, `/ca`.

PRIORITIES (strict order):
1. Accessibility (landmarks, headings, form labels, visible focus, reduced motion fallbacks, contrast ≥4.5:1)
2. Core Web Vitals & performance (LCP, CLS, TBT, responsive media, lazy loading)
3. SEO & structured data (Person + ScholarlyArticle JSON-LD, canonical, sitemap, hreflang)
4. i18n hygiene (proper locale routing, `rel="alternate" hreflang`, canonicalization)
5. Video hygiene (SmartVideo wrapper, MP4/WebM, posters, aspect classes, `prefers-reduced-motion`)

Always produce: concise, diff-ready output with exact file paths and minimal necessary changes. Precede code edits with a checklist referencing each change. Explain risk & rollback in one line per diff group.

Never: invent dependencies/files, introduce broad refactors, or degrade a11y/performance.

---
## Project Context
Framework: Astro 4.x + Tailwind CSS • TypeScript & TSX for interactive components • Route-based i18n (EN/ES/CA) • Red/black theme (Outfit + Inter fonts) • Deployed via GitHub Actions / Pages.

Key Theming Tokens:
	--accent-red: #dc2626
	--accent-red-rgb: 220, 38, 38

Refer also to: `AGENTS.md`, `PREFLIGHT.md`, `github_prompts_site-audit.prompt_Version3.md`, `.github/copilot-instructions.md`, and `.copilot/prompts/site-audit.prompt.md` for phase audit prompts.

---
## Code Style Guidelines
General:
	- Minimal, surgical diffs; avoid unrelated reformatting
	- Composition over inheritance
	- Strong typing (no implicit any / loose `any` unless unavoidable)
	- Follow existing component & folder conventions

File Organization:
```
src/
	components/   (Astro + React/TSX components)
	layouts/      (Page layouts)
	pages/        (i18n routes: en/, es/, ca/)
	data/         (static data, metrics, publications)
	styles/       (global or theme styles)
```

Astro vs React:
	- Use `.astro` for mostly static/templated content
	- Use `.tsx` for stateful / interactive logic
	- Define a `Props` interface near top; keep props minimal
	- Respect `prefers-reduced-motion` in any animation logic

Styling:
	- Prefer Tailwind utility classes; only add custom CSS when utilities insufficient
	- Use CSS variables for theme values (no hard-coded hex when a token exists)
	- Mobile-first; ensure responsive breakpoints mirror current patterns
	- Maintain red-black aesthetic, avoid introducing new palette without justification

Performance:
	- Ensure images/videos use responsive sizing & modern formats (AVIF/WEBP for images where possible)
	- Add `loading="lazy"` / `decoding="async"` to non-critical images
	- Avoid layout shifts: reserve space with aspect wrappers (`aspect-video`, etc.)
	- Keep JS payload small; prefer server/astro-side logic where feasible

Accessibility:
	- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
	- Proper heading hierarchy (no skipping levels)
	- Associate labels with inputs (`for` / `id` or wrapping label)
	- Provide descriptive alt text (empty only for decorative images)
	- Ensure focus states are visible & high contrast
	- All interactive elements must be keyboard reachable & operable
	- Provide motion alternatives or disable animations for reduced-motion users

Commits (when suggesting messages):
	- feat:, fix:, chore:, docs:, perf:, a11y:, seo:, refactor:

Testing & Validation:
	- `npm run preflight` before recommending deployment
	- `npm run build` to confirm production build
	- `npm run test` / `npm run test:types` for type + unit
	- Add minimal tests for new public APIs or search logic changes

---
## Specific Patterns & Components
Hero Sections:
	- Background media via `SmartVideo` or static gradients
	- Language-specific text from dictionaries or i18n data
	- Reduce motion: disable autoplay video when `prefers-reduced-motion` is set

Timeline / Data Viz (React):
	- Use SVG responsive containers; avoid fixed pixel widths
	- Provide text equivalents (ARIA labels / `aria-describedby`)

Video Handling:
	- Always include poster images
	- Provide WebM + MP4 sources; prefer 1080p + 720p ladder if file size acceptable
	- Use `SmartVideo.astro` or `AdaptiveVideoPlayer.astro` for logic consolidation

Plugin System:
	- Register via `definePlugin` in `src/plugins` with a `*.plugin.ts` naming pattern
	- Keep plugin metadata minimal and ensure `enable` respects env when necessary

Search / AI Components:
	- Offload heavy work to worker (`vectorWorker.ts`)
	- Maintain optional WASM fallback (`wasm.ts`) gracefully

---
## Deployment
	- Production: merge/push to `main`
	- Validate CI passes (build, tests, lighthouse budgets)
	- Do not alter workflows unless required for a stated improvement (then justify)

---
## What NOT To Do
	- Do NOT add new dependencies without explicit performance/accessibility justification
	- Do NOT remove existing a11y or i18n constructs
	- Do NOT introduce large design overhauls in an audit response
	- Do NOT leave TypeScript errors / eslint violations unresolved in proposed diffs
	- Do NOT inline large media in code (keep under version control or pipeline)

---
## Quick Commands
```
npm ci
npm run dev
npm run build
npm run preflight
npm run test:types
npm run lint:fix
```

---
## Assistance Protocol
1. Identify scope & map each requested improvement to files.
2. Produce a checklist (Done / Pending) before showing code.
3. Output minimal diffs (only changed lines) per file.
4. Add a one-line risk/rollback note.
5. Confirm no introduced type or lint errors (mention if external verification needed).

If a model prompt phase (see site-audit prompt files) is invoked, follow its phase-specific rules while still honoring these base instructions.

---
## Reference Files
	- AGENTS.md (design/agent context)
	- PREFLIGHT.md / PREFLIGHT_COMMANDS.md (validation steps)
	- github_prompts_site-audit.prompt_Version3.md (audit variants)
	- .copilot/prompts/site-audit.prompt.md (multi-model orchestration)
	- .github/copilot-instructions.md (global priorities summary)

---
Reminder: Keep answers surgical, evidence-based, and diff-centric. When uncertain, gather context (list or read files) before proposing changes.

(Attached to all Copilot chats – do not duplicate in responses.)
