Metrics log directory. Files:
- metrics-latest.json: latest snapshot written by check-budgets.mjs
- metrics-prev.json: previous baseline snapshot for regression comparison
- metrics-log.jsonl: append-only historical snapshots (one JSON object per line)
- REGRESSION.md: generated summary when a regression threshold is crossed
