# Portfolio

## Setup

Install dependencies and run development server:

```bash
npm install
npm run serve
```

### CSS Purge

Remove unused styles and minify:

```bash
npm run css:purge
```

### Image Optimization

Convert images to WebP and AVIF:

```bash
npm run images:opt
```

### Accessibility Lint

Run accessibility checks with Pa11y:

```bash
npm run lint:a11y
```

### Lighthouse

Generate Lighthouse report:

```bash
npx lhci autorun
```

Extend scripts in the `scripts/` folder to customize build steps.
