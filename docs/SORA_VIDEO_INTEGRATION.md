# Sora Video Integration Guide

## Video Assets Needed

Based on the audit, here are the priority video files to generate with Sora:

### 1. Hero Video (Priority 1)
**File:** `hero-sequence-structure-binder`
**Sora Prompt:**
```
Cinematic macro-to-meso transition of a de novo protein binder forming against a grey target surface. Start with an alphabet stream of amino-acid tokens (one-letter codes) flowing into a helix/strand scaffold, then snap into an all-atom ribbon model with sidechains. Show hydrogen bonds and π-stacking appearing as subtle pink lines. Minimal black background, high-contrast typography placeholders ("Design → Fold → Bind"). Smooth camera dolly, slow parallax, no brand logos, scientific but stylized.
[16:9, 8–10 s loop, 24 fps, neutral light, black/charcoal background, crisp edges, no text baked into pixels, loopable start/end]
```

### 2. Antimicrobial Peptides (Priority 2)
**File:** `antimicrobial-membrane-disruption`
**Sora Prompt:**
```
Cross-section of a bacterial lipid bilayer with dynamic lipids; cationic antimicrobial peptides insert, induce toroidal pores, dye-like ions leak through. Clean schematic realism, restrained palette, no blood/gore. Overlay labels OFF (graphics-free render). Gentle oscillation to enable seamless looping.
[1:1, 6–8 s loop, 24 fps]
```

### 3. Inclusion Bodies Assembly (Priority 3)
**File:** `inclusion-bodies-assembly`
**Sora Prompt:**
```
Protein monomers self-assemble into inclusion bodies; show a granular nanoparticle with retained enzyme/protein activity (glows at active patches). Time-lapse assembly, then a stable slow rotation. Clean lab-schematic aesthetic, no glassware clutter.
[1:1, 6–8 s loop]
```

### 4. AAV Capsid Evolution (Priority 4)
**File:** `aav-capsid-evolution`
**Sora Prompt:**
```
Library of capsid variants (hexagons) flows through a selection funnel; top performers rise as bright particles mapping to a simplified mouse silhouette (organ targeting heatmap), then resolve to a clean capsid schematic.
[16:9, 8–10 s loop]
```

## File Structure

After generating videos with Sora, use the encoding script:

```bash
# Encode each Sora video
./scripts/encode-videos.sh sora-hero-raw.mp4
./scripts/encode-videos.sh sora-antimicrobial-raw.mp4
./scripts/encode-videos.sh sora-inclusion-bodies-raw.mp4
./scripts/encode-videos.sh sora-aav-capsids-raw.mp4
```

This will generate:
```
public/Portfolio/media/
├── hero-sequence-structure-binder-16x9.mp4
├── hero-sequence-structure-binder-16x9.webm
├── hero-sequence-structure-binder-16x9-poster.jpg
├── antimicrobial-membrane-disruption-1x1.mp4
├── antimicrobial-membrane-disruption-1x1.webm
├── antimicrobial-membrane-disruption-1x1-poster.jpg
└── ... (additional formats)
```

## Component Integration

### Hero Section
```astro
<!-- In src/pages/en/index.astro -->
import VideoHero from '../../components/VideoHero.astro';

<VideoHero lang="en" />
```

### Research Cards
### Adaptive Player (Quality Ladder)
```astro
import AdaptiveVideoPlayer from '../components/AdaptiveVideoPlayer.astro';
<AdaptiveVideoPlayer base="/Portfolio/media/hero-sequence-structure-binder" label="Protein Binder Sequence" />
```

```astro
import ResearchVideoCard from '../components/ResearchVideoCard.astro';

<ResearchVideoCard
  title="Antimicrobial Peptide Engineering"
  description="Engineered IBs as robust, bioactive protein nanoparticles"
  videoMp4="/Portfolio/media/antimicrobial-membrane-disruption-1x1.mp4"
  videoWebm="/Portfolio/media/antimicrobial-membrane-disruption-1x1.webm"
  videoPoster="/Portfolio/media/antimicrobial-membrane-disruption-1x1-poster.jpg"
  badges={["First Author", "Antimicrobial", "Nanotechnology"]}
  isFirstAuthor={true}
  lang="en"
/>
```

## Publications with First-Author Badges

Update publications data with FA markers:
```javascript
// In src/data/publications.js
export const featuredPublications = [
  {
    title: "Functional Inclusion Bodies",
    year: "2022", 
    journal: "Trends in Biotechnology",
    url: "...",
    featured: true,
    isFirstAuthor: true,
    description: "Engineered IBs as robust, bioactive protein nanoparticles"
  },
  {
    title: "Sequence edition of single domains...",
    year: "2021",
    journal: "Journal of Biological Engineering", 
    url: "...",
    featured: true,
    isFirstAuthor: true,
    description: "Domain swaps tune immune and antimicrobial performance"
  }
];
```

## SEO & Accessibility Checklist

✅ **Implemented:**
- Enhanced structured data with ORCID and detailed publications
- SmartVideo component with reduced-motion support
- WCAG-compliant focus states and contrast
- Proper alt text for all videos
- Fallback poster images

✅ **Ready for:**
- hreflang alternates (already in Layout)
- First-author badges on publications
- Video loading optimization (preload metadata)

## Performance Notes

- Videos are capped at 720p to balance quality/performance
- WebM format provides ~30% better compression than MP4
- Poster frames ensure immediate visual feedback
- `prefers-reduced-motion` users get static images
- Critical hero video uses `preload="auto"` for instant playback

## Next Steps

1. Generate Sora videos using provided prompts
2. Run encoding script on each raw video
3. Update page components to use VideoHero and ResearchVideoCard
4. Test accessibility with screen readers
5. Validate structured data with Google's Rich Results Test
6. Monitor Core Web Vitals impact
