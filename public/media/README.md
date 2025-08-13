# Media Assets Directory

This directory contains video assets and poster images for the portfolio.

## Directory Structure

- `hero/` - Hero section videos (16:9 desktop, 9:16 mobile)
- `research/` - Research card videos (1:1 square format)
- `banners/` - Section banner videos (21:9 wide format)
- `posters/` - Static poster images for video fallbacks

## Video Specifications

### Hero Videos
- **Desktop**: 16:9 aspect ratio, 1080p preferred (720p acceptable), 8-12s loop
- **Mobile**: 9:16 aspect ratio, 720×1280, 6-8s loop
- **Formats**: MP4 (H.264) + WebM (VP9/AV1)

### Research Cards
- **Aspect**: 1:1 square, 720×720
- **Duration**: 4-6s loop
- **Topics**: Antimicrobial peptides, inclusion bodies, domain editing

### Banners
- **Aspect**: 21:9 ultrawide, 1280×549
- **Duration**: 6-8s loop
- **Topics**: Latent spaces, workflow diagrams

## Encoding Commands

### MP4 (H.264)
```bash
ffmpeg -i input.mp4 -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -profile:v high -crf 19 -preset slow -movflags +faststart -an output.mp4
```

### WebM (VP9)
```bash
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 28 -b:v 0 -row-mt 1 -an output.webm
```

### Poster Extraction
```bash
ffmpeg -ss 00:00:01 -i video.mp4 -frames:v 1 poster.jpg
```

## Sora Prompt References

See the main documentation for detailed Sora prompts for each video type:
- A) Hero: "Sequence → Structure → Binder"
- B) Antimicrobial peptides disrupting membranes
- C) Functional inclusion bodies
- D) Multidomain recombinant proteins
- E) AAV capsid evolution
- F) Latent space landscapes
- G) Closed data loops
- H) Macrocycle vs mini-binder comparisons
- I) Collaboration CTAs
- J) Music micro-loops