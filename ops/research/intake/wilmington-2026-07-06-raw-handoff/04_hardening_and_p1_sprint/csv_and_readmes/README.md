# Source Capture P1 Sprint — 2026-07-06

This package processes the full P1 bucket from the prior hardening review.

## Result

- P1 rows processed: 41
- Source groups processed: 12
- Restaurants/concepts touched: 11
- Happy-hour food rows preserved: 9
- Food-copy/alcohol-suppression rows: 20
- Scope-review rows: 3
- Recurrence-review rows: 2
- Rows still needing durable screenshot/archive: 41
- Public-ready rows: 0

## Files

- `p1_sprint_rows.csv` — row-level status and next action.
- `source_group_manifest.csv` — source-level grouping so duplicate URL work is not repeated.
- `text_captures/` — source-text archive notes with hashes.
- `capture_cards/` — local evidence-support cards for review; these are not raw webpage screenshots.

## Boundary

This sprint creates review-supporting source archives and capture cards. It does not update the public app, approve any row, publish any fixture, or claim that a raw browser screenshot was captured. Final public promotion still requires durable screenshot/archive where applicable, human review, food-safe copy, freshness fields, and native Deal Finder readiness.
