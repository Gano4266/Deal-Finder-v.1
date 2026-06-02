# Deal Finder App

This folder contains the Phase 1 mobile-first Next.js/PWA scaffold.

The app currently reads repo-managed CSV data only. It does not scrape, crawl, use auth, call AI services, or connect to a database.

## Routes

- `/tonight`: public feed. Reads reviewed public rows from `../fixtures/prototype/deals.csv` and applies the filter in `../docs/prototype-data-contract.md`.
- `/deals`: all reviewed prototype deals.
- `/deals/[dealId]`: public detail and evidence page for a reviewed deal.
- `/restaurants`: static Wilmington restaurant source directory.
- `/restaurants/[restaurantId]`: restaurant profile with reviewed public deals for that restaurant.
- `/report`: lightweight correction intake. It does not store submissions unless a future backend is added.
- `/admin` and `/admin/ops`: read-only ops dashboard for public-feed health, rechecks, evidence hardening, source gaps, and seed backlog.
- `/admin/source-gaps`: static source-gap report.
- `/admin/review`: internal review queue. Reads source-backed seed candidates and review tasks from `../ops/seeds/`.

## Current Behavior

The current prototype has reviewed static public deals in `../fixtures/prototype/deals.csv`. `/tonight` filters those rows by the current Wilmington weekday and freshness gates. Source-backed or conflicted candidates that still need human work appear in `/admin/review`. Carryout rows remain ops-only seed backlog.

## Local Development

```sh
npm install
npm run dev
```

## Admin Route Guard

Admin routes are available during local development. In production, `/admin/*`
returns 404 unless `DEAL_FINDER_ADMIN_ENABLED=true` is set. Use this only for
private Phase 1 testing; real authentication is still a later milestone.

Set `DEAL_FINDER_REPO_ROOT` if the app is launched from an unusual working
directory and cannot locate the repo CSV files automatically.

Copy `.env.example` to `.env.local` for local-only settings. Configure
`NEXT_PUBLIC_REPORT_EMAIL` before relying on the static report/correction page.
For local fixture testing only, `DEAL_FINDER_OPERATING_DATE=2026-06-02` can
pin the operating date; production ignores this override.
