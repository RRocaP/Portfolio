# Title

Full Website Audit (Astro/Tailwind, multilingual, video)

# What this does

Runs a 6-phase audit with model-specific prompts. Before each phase, pick the model indicated.

# Phase 0 — Repo scan & plan  [Model: GPT-5 or Claude 3.7 Sonnet if GPT-5 unavailable]

Prompt to send:
“Scan this workspace. Identify Astro version, Tailwind config, routing for /en|/es|/ca. List pages rendering the hero, publications, and contact. Produce a bullet plan for Phases 1–5: exact files to touch, commands to run, and risks. Keep under 150 lines.”

# Phase 1 — A11y & semantics  [Model: Claude 3.7 Sonnet]

Prompt to send:
“Audit accessibility: landmarks, headings, label/for/id, alt text, focus order, keyboard traps, color contrast vs Tailwind tokens, prefers-reduced-motion. Propose minimal diffs with exact file paths. Include a runnable axe check using Playwright with config for key pages.”

(Switch model in the picker if needed; Copilot supports model selection in chat.)

# Phase 2 — Performance & media  [Model: Claude 3.7 Sonnet]

Prompt to send:
“Add a SmartVideo.astro utility with MP4/WebM sources and poster, and integrate prefers-reduced-motion. Replace any full-bleed 720p uses with constrained containers or responsive sources. Provide ffmpeg commands and the exact imports/props required for hero, cards, and banners. Keep diffs minimal.”

# Phase 3 — SEO, structured data, sitemaps  [Model: Gemini 2.5 Pro]

Prompt to send:
“Generate JSON-LD blocks for: Person (me), and ScholarlyArticle for my top first-author papers (I’ll paste DOIs). Create rel=alternate hreflang tags for /en|/es|/ca, canonical + sitemap updates. Output exact code and where to inject in Astro layouts. Validate with schema.org constraints.”

(Gemini 2.5 Pro is positioned by Google for complex coding/reasoning; it’s a good fit for structured artifacts.)

# Phase 4 — i18n hygiene & canonicalization  [Model: Gemini 2.5 Pro]

Prompt to send:
“Check language routing. Emit a table of URLs → hreflang clusters and canonical targets. Generate the <link rel=\"alternate\" hreflang> set for each page. Propose 3 tests to assert correct language selection and non-duplication.”

# Phase 5 — Publications section & research visuals  [Model: Claude 3.7 Sonnet]

Prompt to send:
“Refactor Publications: badge first-author works, 1-line claims, and add placeholders for Sora videos (per file list). Provide component diffs and ensure no layout shift. Keep typography consistent and motion subtle.”

# Phase 6 — CI checks & commands  [Model: Claude 3.7 Sonnet]

Prompt to send:
“Produce a one-shot script to run Astro diagnostics, build, a11y tests (axe/playwright), and a headless Lighthouse pass for main routes. Emit a GitHub Actions workflow ci.yml using Node LTS, caching, and artifacts for reports.”

# Notes
•    If a model isn’t available in the picker, say so and suggest the closest alternative or ask me to run via external CLI and paste results back.
•    Keep answers surgical; prefer diffs.
•    Never bake text into videos; use captions/components.
•    Respect prefers-reduced-motion.

# How you’ll run it (fast)
•    1.  Open site-audit.prompt.md in VS Code → click Run Prompt (or @workspace /prompt Full Website Audit).
•    2.  Before each Phase, switch model in the Copilot Chat model picker as specified.
•    3.  Paste your DOIs when Phase 3 asks (for accurate ScholarlyArticle JSON-LD).
•    4.  Approve diffs; let Copilot Apply in Workspace for multi-file edits (supported feature).

# What about GPT-5 inside Copilot?

Copilot is multi-model and has added Anthropic and Google models; however, GPT-5 access/limits are in flux. If you don’t see GPT-5 in the model picker, run that phase with Claude 3.7 Sonnet or Gemini 2.5 Pro. (Recent reports show uneven GPT-5 rollout and quotas; don’t hinge your workflow on it.)

# Ratios for your Sora videos (recap)
•    Hero desktop: 16:9 (prefer 1080p; if capped at 720p, constrain container width).
•    Hero mobile: 9:16 (720×1280).
•    Research cards: 1:1 (720×720).
•    Banners: 21:9 (1280×549).
    Good enough at 720p for inline/mobile; for full-bleed desktop, 720p will look soft—constrain or provide 1080p sources.

If you want, I’ll drop in the two files (instructions.md + site-audit.prompt.md) pre-filled with your exact routes/components so you can run Phase 0 immediately.
