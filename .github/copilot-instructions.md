# Global Instructions for This Repo (Astro + Tailwind, multilingual)

You are auditing and improving a personal research portfolio built with **Astro** and **Tailwind** with localized routes (`/en`, `/es`, `/ca`). Priorities, in order:

1) **Accessibility**: semantic landmarks, headings, form labels, focus order, visible focus rings, color contrast against Tailwind tokens, and `prefers-reduced-motion` fallbacks.
2) **Performance/Core Web Vitals**: responsive images/videos, posters, lazy loading where appropriate, no layout shift, reduce JS where possible.
3) **SEO & structured data**: `Person` JSON-LD (name, affiliation, ORCID, sameAs), and `ScholarlyArticle` JSON-LD for top first-author papers; correct `canonical`, `sitemap.xml`, and `rel="alternate" hreflang"` for `/en|/es|/ca`.
4) **Video hygiene**: use a reusable `SmartVideo.astro` wrapper with MP4+WebM sources and a poster; constrain 720p media to avoid blur on desktop; respect reduced-motion.
5) **Minimal diffs**: always propose smallest workable changes with exact **file paths** and **code blocks**; explain risk/rollback in one line.

When asked to change multiple files, propose **multi-file edits** that I can apply in one go. Prefer runnable commands for any tooling. Do not invent dependencies; respect Astro/Tailwind conventions.
