# Placeholder Media Assets

## Development Placeholders

For development and testing, we use placeholder poster images. These will be replaced with actual Sora-generated videos and extracted poster frames.

### Current Placeholders
- `hero-16x9-poster.jpg` - Hero desktop poster (1920×1080)
- `hero-9x16-poster.jpg` - Hero mobile poster (720×1280) 
- `amp-research-poster.jpg` - Antimicrobial peptides research (720×720)
- `inclusion-bodies-poster.jpg` - Inclusion bodies research (720×720)
- `latent-space-banner-poster.jpg` - Latent space banner (1280×549)

### Future Video Assets
When Sora videos are generated, add:
- `.mp4` files (H.264 encoded)
- `.webm` files (VP9 encoded)  
- Extracted `.jpg` poster frames

### Usage in Components
```astro
<SmartVideo
  mp4Src="/media/hero/sequence-structure-binder-16x9.mp4"
  webmSrc="/media/hero/sequence-structure-binder-16x9.webm"
  poster="/media/posters/hero-16x9-poster.jpg"
  aspect="16/9"
  ariaLabel="Protein design animation showing sequence to structure to binding"
/>
```