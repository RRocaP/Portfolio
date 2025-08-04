#!/usr/bin/env bash
set -euo pipefail
PORT=${PORT:-8080}
# Build the site
npm run build
# Serve dist/ via Python; capture PID & ensure cleanup
uv run python -m http.server "$PORT" --directory dist >/dev/null 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT

# Lighthouse CI assertions (uses .lighthouserc.json if present)
npx lhci autorun --config=.lighthouserc.json

# Playwright smoke tests via pytest
uv run pytest -q
