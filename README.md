# Portfolio

This project contains a lightweight static version of my personal site. After installing dependencies with `npm install` you can run:

- `npm run build` – Purges and minifies CSS to `styles.min.css`.
- `npm run serve` – Serves the site locally.
- `npm run images:opt` – Converts JPG/PNG assets in `public/` to WebP and AVIF.
- `npm run lint:a11y` – Runs accessibility linting via pa11y-ci.

A sample command to check performance budgets:

```sh
npx lhci autorun
```

You can extend the site by editing `index.html` and `styles.css` then re-running the build script.
