# Implementation Handoff

## Direction

The repo now contains a lean mobile-first Next.js app using static CSV data. The next implementation step should improve static review operations and promote more source-backed food deals before adding Postgres or automation.

## Future Stack Defaults

- Frontend: Next.js App Router with TypeScript.
- Styling: Tailwind or a lightweight component system chosen during app implementation.
- Data: static fixtures first, Postgres later.
- ORM: Prisma or Drizzle, chosen when database work begins.
- Workers: batch-oriented scanner and validator jobs, not real-time crawling.
- Native path: Expo/React Native or SwiftUI only after the web/PWA MVP proves repeat usage.

## Route Contract

- `/tonight`: primary feed. It must read reviewed public rows from `fixtures/prototype/deals.csv` only and apply the public filter in [prototype-data-contract.md](prototype-data-contract.md).
- `/deals/[dealId]`: deal details and evidence.
- `/deals`: all reviewed prototype deals with day filters.
- `/restaurants`: static Wilmington restaurant source directory.
- `/restaurants/[restaurantId]`: restaurant profile with reviewed public deals for that restaurant.
- `/report`: lightweight correction intake. Static prototype only; no stored submissions without backend work.
- `/admin`: read-only ops dashboard for public-feed health, freshness, evidence durability, source gaps, report handoff status, and seed backlog.
- `/admin/ops`: same ops dashboard route kept as an explicit deep link.
- `/admin/review`: candidate review queue. It may use `ops/seeds/` candidates and review tasks, but those rows are not public feed data.
- `/admin/source-gaps`: static source-gap report for seed restaurant operations.

Planned but not implemented yet:

- Backend-backed report storage or notifications.

## Seed Data Expectations

The static prototype uses clearly marked fixture data. Prototype deals must not be presented as live offers. Use fields from `ops/templates/deal-intake-template.csv` so migration to database tables is straightforward. Source-backed seed candidates still need reviewer decision, public copy approval, and `next_check_due` or `expires_on` before they can become public prototype rows.

## Current Runnable Command

To run the current static app:

```sh
cd app
npm install
npm run dev
```

For phone testing on the same network:

```sh
npm run dev:lan
```

For data validation:

```sh
npm run validate:data
```

## Static App Maintenance Checklist

- Public routes read only the intended fixture or seed CSVs.
- CSV templates include provenance and freshness fields.
- Docs consistently say Wilmington, NC only and web/PWA first.
- No policy permits unsourced public deals.
- `npm run validate:data`, `npm run lint`, and `npm run build` pass before promotion or deploy.
- Admin routes are gated before any public deployment.
- Carryout seed rows are ops-only backlog, not public deal claims.
