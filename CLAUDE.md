# CLAUDE.md — Portfolio Visual Pipeline

## Goal
Elevate the portfolio to Refik Anadol-tier visual quality using SOTA open-source generative models and, where available, Google's Veo/Imagen via Gemini CLI.

---

## Visual Asset Pipeline

### Step 1: Try Gemini CLI first (highest quality ceiling)
Before generating locally, always attempt via `gemini-cli`:

```bash
# Check if Veo / Imagen access is available
gemini generate video --prompt "..." --model veo-2 --output hero.mp4
gemini generate image --prompt "..." --model imagen-3 --output hero.png

# If nano/flash tier is all that's available, still worth it for stills
gemini generate image --prompt "..." --model gemini-2.0-flash-preview-image-generation
```

If Veo 3 / Nano Banana Pro tier is accessible, use it. Don't downgrade silently — tell me what tier you got.

### Step 2: Open-source fallback stack

| Asset type | Tool | Command |
|---|---|---|
| Video (cinematic) | Wan2.1-T2V-14B | `python generate.py --prompt "..." --steps 50` |
| Video (fast) | LTX-Video | `ltx-video generate --prompt "..."` |
| Image (photorealistic) | FLUX.1-dev | `python flux_generate.py` |
| Image (artistic) | Stable Diffusion 3.5 | via diffusers |
| Real-time shader | Three.js + GLSL | inline in portfolio |

### Step 3: Asset delivery
- Host video assets on **Vercel Blob** or **Cloudinary** (never commit binaries to git)
- Use `<video autoplay muted loop playsinline>` for web embedding
- Compress with `ffmpeg -crf 23 -preset slow` before upload

---

## Prompt Style (Anadol-inspired)

Always use prompts that match the portfolio's research narrative:

```
Base prompt template:
"[Scientific phenomenon] rendered as fluid data sculpture.
Vast particle systems, bioluminescent palette, Refik Anadol aesthetic.
[Domain-specific detail: protein folding / neural activity / genomic data].
Cinematic, 4K, dark background, flowing light streams."
```

Domain specifics to weave in:
- Antimicrobial peptide sequences → fluid ribbon structures
- Genomic data → particle clouds with DNA helix motifs
- AAV capsids → crystalline spherical forms dissolving into data streams
- Barcelona / Mediterranean context → warm blue-gold palette

---

## Integration into Portfolio

### Hero section
- Use generated video as full-bleed background (`position: fixed`, `z-index: -1`)
- Overlay: minimal text, high contrast, no clutter

### Research section
- Per-project generated still → WebGL particle effect on hover
- Generate 1 image per major research area

### Real-time (if feasible)
```javascript
// Three.js particle system seeded from actual peptide data
const positions = peptideEmbeddings.map(emb => ({
  x: emb[0] * 100, y: emb[1] * 100, z: emb[2] * 100
}));
```

---

## Workflow for Claude Code

When I say "generate assets for [section]":

1. **Try `gemini-cli` first** — report model tier achieved
2. **Fall back to Wan2.1 or FLUX** if Gemini unavailable or rate-limited
3. **Upload to Vercel Blob**, return the URL
4. **Wire into the component** — don't leave it as a TODO
5. **Report what you generated**: model used, prompt, resolution, duration

Never use placeholder images. Never commit large files to git. Always tell me the quality tier of what was generated.

---

## Quality Bar

Reference: https://refikanadol.com
Portfolio: https://vercel.com/ramon-roca-pinillas-projects/portfolio

The gap is art direction + generative assets, not CSS. Every iteration should close that gap with real generated content, not styling passes.
