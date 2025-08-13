#!/usr/bin/env bash
set -euo pipefail

echo "Note: This script installs multiple global CLIs; run only if desired."

command -v vercel >/dev/null || npm i -g vercel || true
command -v netlify >/dev/null || npm i -g netlify-cli || true
command -v wrangler >/dev/null || npm i -g wrangler || true
command -v surge >/dev/null || npm i -g surge || true

echo "Setup complete. Configure each platform manually for auth if needed."
