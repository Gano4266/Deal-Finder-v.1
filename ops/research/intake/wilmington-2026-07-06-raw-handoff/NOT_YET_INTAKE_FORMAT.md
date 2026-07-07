# Raw developer handoff -- NOT yet in Deal Finder intake shape

This folder preserves the text/CSV/manifest contents of
`forkcast_clean_developer_handoff_2026-07-06.zip` (uploaded 2026-07-06). It is
filed here for continuity between sessions, not because it is ready to run
through `npm run research:validate`.

## What this is not

- This is **not** shaped like `deal-intake.csv` / `restaurant-source-list.csv`
  / `review-tasks.csv` / `source-captures.csv` / `source-inventory.csv` (see
  `ops/templates/*-template.csv` and the sibling `wilmington-2026-07-05/`
  folder for the real shape). It is GPT's own ad-hoc research/matrix format
  across multiple discovery passes (`00_final_handoff/`, `01_current_master_matrix/`,
  `02_restaurant_breadth_passes/`, `03_source_capture_batches/`,
  `04_hardening_and_p1_sprint/`).
- Per the package's own `README_HANDOFF.md`: "Nothing in this handoff is
  public-ready by itself." No row here has passed source capture, durable
  evidence, human review, freshness fields, or copy approval.
- The original zip's `.xlsx` workbooks, `.zip` evidence bundles, dashboard
  preview `.png` files, and the `06_optional_app_audit/` package were **not**
  copied into the repo (binary/evidence artifacts stay out of git per the
  `ops/evidence/**` and `ops/research/intake/**/raw|screenshots/*` gitignore
  rules, and per AGENTS.md's "Do Not Commit" section). The operator has the
  original zip; ask them for it if a workbook needs to be reopened.

## Headline numbers (from the package's own HANDOFF_SUMMARY.json)

- Restaurants/concepts tracked: 207
- Deal/item rows normalized: 570
- Strong A candidates: 54
- B source-backed/capture-needed rows: 127
- C leads needing official confirmation: 169
- Happy-hour rows preserved: 50
- Prior row-based source capture reviewed: 75 rows / 23 restaurants
- Corrected breadth coverage completed: 30 distinct restaurants (2 batches)

See `README_HANDOFF.md` in this folder for the full current-state summary,
strongest item-expansion candidates, and the persistent-blocker/manual-social
queue list, all written by the package's own author.

## What still needs to happen before any of this reaches `/tonight`

1. Convert winning candidates into the real intake shape (a proper
   `wilmington-YYYY-MM-DD/deal-intake.csv` + `source-captures.csv` +
   `review-tasks.csv`), the same way `wilmington-2026-07-05/` was produced
   from an earlier, smaller batch (~28 candidates). At 570 rows across 207
   restaurants, this is its own dedicated pass, not a same-session
   same-sitting task.
2. Attach real screenshots/archives or direct confirmations (this package's
   own note: "local text cards are not screenshots").
3. Run `npm run research:validate -- ops/research/intake/<area>-YYYY-MM-DD`
   against the converted, real intake folder.
4. Human review and approval per `docs/review-workflow.md` before any row can
   be marked `approved` / `approved_with_uncertainty` and promoted into
   `fixtures/prototype/deals.csv`.

## App-audit note (06_optional_app_audit/, not copied here)

That sub-package is a static source read of the public GitHub repo -- the
GPT sandbox that produced it had no DNS, so it could not clone, install, or
run anything. Its one concrete recommendation ("add a first-class Happy Hour
filter") is already implemented as of the `today-gates-1-5` branch / PR #1
(Open now / Happy hour / Dinner / Lunch / $10 & under / Takeout intent
chips). Nothing else in it is new information beyond what's already known
about this repo.
