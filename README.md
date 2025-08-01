# Ramon Roca Pinilla - Portfolio v2.0

High-performance portfolio site built with Astro 4, Tailwind CSS, and optimized for Core Web Vitals.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

- **Framework**: Astro 4.14.2 (Static Site Generation)
- **Styling**: Tailwind CSS v3 + LightningCSS
- **Optimization**: PurgeCSS for unused CSS removal
- **Images**: Sharp for automatic optimization
- **Fonts**: Local @fontsource for performance

## 🎯 Performance

- **Bundle size**: < 150KB gzipped
- **LCP**: < 1.8s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse Score**: 95+

## 🛠️ Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run deploy` | Deploy to GitHub Pages |

## 📁 Project Structure

```
src/
├── components/     # Reusable Astro components
├── layouts/        # Page layouts
├── pages/          # Route pages (i18n support)
├── styles/         # Global CSS with Tailwind
└── data/           # JSON/JS data files
```

## 🌐 Deployment

The site auto-deploys to GitHub Pages on push to `main` branch via GitHub Actions.

Manual deployment:
```bash
npm run build
npm run deploy
```

## 🎨 Design System

- **Primary**: Black (#000000)
- **Accent Yellow**: #FFD300
- **Accent Red**: #D72638
- **Typography**: Inter (body), Playfair Display (headings)

## 📄 License

MIT © 2024 Ramon Roca Pinilla
