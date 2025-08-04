RE-AUDIT & FIXES (2025-08-04)

Goals (gate on each edit):

- Lighthouse: Performance ≥0.90, Accessibility ≥0.95, SEO ≥0.95.
- Core Web Vitals (lab proxy): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.

Tasks:

1. i18n & routing
   - Configure Astro i18n with locales ["en","es","ca"] and defaultLocale "en".
   - Ensure <html lang> reflects the active locale.
   - If a bare "/" exists, redirect to "/en/" and make canonical/hreflang pairs consistent.

2. Canonical & hreflang
   - Emit canonical per locale and cross-link with rel="alternate" hreflang="en|es|ca".
   - Ensure "/" canonical resolves to /en/ if redirecting.

3. Sitemap & robots
   - Add @astrojs/sitemap with the correct site in astro.config.mjs.
   - Advertise the sitemap in robots.txt with an absolute URL line: "Sitemap: https://<domain>/sitemap-index.xml".

4. Head SEO
   - Add Open Graph + Twitter Card tags (title, description, image, locale).
   - Add JSON-LD Person on the homepage (name, jobTitle, affiliation, url, sameAs for Scholar/ORCID, image).

5. Images & performance
   - Convert hero/cards to <picture> with avif/webp + fallback.
   - Provide accurate width/height and srcset/sizes; eager-load the LCP image with fetchpriority="high".
   - Do NOT increase shipped JS; preserve PurgeCSS/LightningCSS.

6. Content hygiene
   - Remove placeholder counters; unify metrics across locales.
   - Replace the tagline with: "Turning algorithms into therapies for drug-resistant infections."

7. Accessibility
   - Meaningful alt text; visible focus styles; no keyboard traps; avoid CLS.

Acceptance:

- Repeat edits until npm run qa passes the thresholds above.
