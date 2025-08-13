# 🚀 CRITICAL: Deploy Premium Video Portfolio - FREE/Open-Source Only

**Author:** @RRocaP  
**Priority:** 🔴 CRITICAL - IMMEDIATE  
**Created:** 2025-08-13

## FREE Video Hosting Strategy
```
Primary Solutions (All FREE):
  - GitHub Releases: Up to 2GB per file
  - GitHub LFS: 1GB free storage, 1GB bandwidth/month
  - jsDelivr CDN: FREE CDN for GitHub repos
  - Cloudflare Pages: Unlimited bandwidth (free tier)
  - IPFS: Decentralized, permanent hosting
```

## Video Optimization Pipeline (FREE Tools)
- FFmpeg (transcoding, CRF-based quality ladder)
- Optional HandBrake CLI (additional tuning)
- AV1/VP9 (royalty-free, high compression efficiency)
- HLS.js (adaptive streaming if added later)

## GitHub Actions Workflow
See `.github/workflows/free-video-pipeline.yml` for automated VP9 multi-rendition + poster extraction + release upload + jsDelivr access path.

## Delivery Strategy
1. Small videos (<100MB): keep low-res in repo -> jsDelivr CDN.
2. Larger assets (<2GB): GitHub Release tag `video-assets` (direct + jsDelivr once mirrored).
3. Optional adaptive HLS: future task (segment + manifest build) using ffmpeg.
4. Progressive fallback: `<video>` sources (SmartVideo component) + poster frames.

## Quality Ladder (current)
| Label | Scale | Target CRF | Approx Use |
|-------|-------|-----------|------------|
| 1080p | <=1920w | 30 | Primary desktop |
| 720p  | <=1280w | 34 | Mid bandwidth |
| 480p  | <=854w  | 38 | Low bandwidth / mobile |

Future: Add AV1 ladder when encoder time acceptable.

## Action Items TODAY
- [x] Set up video compression workflow (FFmpeg) ✅
- [ ] Configure GitHub Release tagging automation (versioning strategy) → CURRENT: static `video-assets` tag (improve with date stamp?)
- [ ] Integrate SmartVideo dynamic source selection by viewport / connection
- [ ] Add lazy loading IntersectionObserver enhancement (progressive hydration) (partially present via component; add threshold tuning)
- [ ] Introduce AV1 encoding experimental job (behind input boolean)
- [ ] Optional IPFS pin script (future)

## Access Patterns
```js
const videoSources = {
  cdn: `https://cdn.jsdelivr.net/gh/${REPO}@main/public/videos/`,
  releases: `https://github.com/${REPO}/releases/download/video-assets/`,
  // ipfs: 'https://ipfs.io/ipfs/<hash>' (future)
};
```

## Next Enhancements
- Add SHA based cache-busting to poster filenames
- Generate JSON manifest mapping base name -> renditions for SmartVideo auto selection
- HLS/ DASH packager optional workflow stage
- Integrate RUM metrics for video start latency logging

---
Prepared automatically by automation assistant.
