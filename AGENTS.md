# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/`: Astro routes (localized: `en/`, `es/`, `ca/`, plus `index.astro`).
- `src/components/`: UI components in `.astro` and React `.tsx` (e.g., `ProteinEngineeringInteractive.tsx`).
- `src/layouts/`: Shared layouts (e.g., `Layout.astro`).
- `src/utils/`: Client utilities (e.g., `generateProteinFrames.ts`).
- `src/styles/`: Global styles (e.g., `animations.css`).
- `src/types/`: Type declarations (`.d.ts`, shared interfaces).
- `public/`: Static assets served at `/` (e.g., `favicon.svg`, `profile.jpg`).
- Config: `astro.config.mjs`, `eslint.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands
- `npm run dev` / `npm start`: Start local dev server.
- `npm run build`: Production build to `dist/`.
- `npm run preview`: Serve the production build locally.
- `npm run check`: Astro diagnostics; use `check:types` for Astro + `tsc`.
- `npm run lint` / `lint:fix`: ESLint across `.js/.ts/.tsx/.astro`.
- `npm test`: Currently a placeholder (no tests configured).

## Coding Style & Naming Conventions
- TypeScript-first: prefer explicit types, avoid `any`; keep shared types in `src/types/`.
- Indentation: 2 spaces; wrap lines reasonably; keep imports sorted.
- Components: PascalCase (`ProteinVisualizationReact.tsx`, `Footer.astro`).
- Utilities: camelCase filenames (`generateProteinFrames.ts`).
- Pages: lower-case route segments; localized under `src/pages/{lang}/`.
- Assets/CSS: kebab-case (`animations.css`, `profile.jpg`).

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest + Testing Library for React islands and Astro’s test utilities.
- Place tests near sources (`src/**/__tests__/*` or `*.test.ts(x)`); keep them fast and deterministic.
- Add `"test"` and `"coverage"` scripts; target critical components and utilities.

## Commit & Pull Request Guidelines
- Use Conventional Commits when possible: `feat:`, `fix:`, `chore:`, `ci:` (matches existing history).
- PRs: include a concise description, linked issue, and before/after screenshots for UI changes; note locale impact (`en/es/ca`) and a11y checks.
- CI checks to pass before merge: `npm run check:types`, `npm run lint`, `npm run build` (and tests if added).

## Security & Configuration Tips
- Do not commit secrets; this site is static—prefer build-time data when needed.
- Optimize assets in `public/`; respect `prefers-reduced-motion` and keep animations subtle.
