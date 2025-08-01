# Portfolio Development Memory Log

## Project Overview
Portfolio website for Ramon using Astro.js with React components, featuring interactive visualizations and multilingual support (English, Spanish, Catalan).

## Key User Requirements
1. **Design**: Red color scheme with interactive mouse scroll indicator
2. **Content**: 16 publications prioritized by first authorship/impact
3. **Infographic**: Resistance timeline with better contrast and legibility
4. **Language**: Consistent Catalan and Spanish pages
5. **Music**: Apple Music logo for music links
6. **Remove**: All "Ramon's approach" references
7. **Remove**: Real AAV Vector to Real world application sections

## Technical Stack
- **Framework**: Astro.js
- **Components**: React with TypeScript (.tsx)
- **Visualizations**: D3.js
- **Deployment**: GitHub Pages
- **Styling**: CSS with custom properties, glass morphism effects

## Key Files Modified

### Components
- `src/components/AntimicrobialResistanceTimeline.tsx` - Interactive D3 timeline
- `src/components/GeneTherapy.astro` - Wrapper for gene therapy viz
- `src/components/AntimicrobialTimeline.astro` - Wrapper for resistance timeline
- `src/components/GeneTherapyVisualization.tsx` - React component for gene therapy

### Pages
- `src/pages/index.astro` - Main landing page with red design
- `src/pages/en/index.astro` - English version
- `src/pages/es/index.astro` - Spanish version
- `src/pages/ca/index.astro` - Catalan version

### Data
- `src/data/publications.js` - 16 publications with proper prioritization

## Design Features (Enhanced Version)
- Glass morphism effects with gradient orbs
- Interactive mouse scroll indicator with animated wheel
- Red gradient backgrounds and effects
- Modern card-based design with hover animations
- Beautiful typography with gradient text
- Compelling scroll-driven animations

## Issues Resolved
1. **404 Error**: Missing root index.html - fixed with redirect page
2. **Git Conflicts**: Accidentally reverted design - restored from commit history
3. **Build Errors**: Missing dependencies and undefined references
4. **Design Restoration**: Found correct enhanced red design with mouse interactions

## Commits Referenced
- Commit 6755098: Contains the beautiful red design with mouse scroll indicator
- Various commits for resistance infographic improvements
- Publication updates and language consistency fixes

## Current Status
- Need to find and restore the CORRECT enhanced version (not the basic one)
- Remove Real AAV Vector to Real world application sections as requested
- Deploy the proper enhanced design

## User Feedback Notes
- "the one that was all red and with a mouse thingy that compelled you to scroll down that was a really good design"
- "this is not the enhanced version i mentioned, you are being lazy"
- Wants sections removed: "Real AAV Vector to Real world application sections"

## Next Steps
1. Search git history for the correct enhanced version
2. Remove specified sections
3. Deploy the proper enhanced design