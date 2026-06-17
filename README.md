# Forkcast

Forkcast is a static-data MVP prototype for a Wilmington, North Carolina restaurant specials app. The first product goal is practical: answer "What is worth going out for tonight?" with source-grounded food specials, clear freshness metadata, and no hallucinated offers.

This repository currently contains operating docs, validation rules, CSV templates, prototype fixtures, and a runnable mobile-first Next.js/PWA scaffold in `app/`.

## MVP Direction

- Start with Wilmington, NC only.
- Prioritize trustworthy, source-backed deals over broad coverage.
- Use a mobile-first web/PWA path before native iOS.
- Keep social media manual or browser-assisted until the core workflow is reliable.
- Require human review before publishing deals in the first version.

## Wilmington Seed Market

The first build began with 25 Wilmington, NC restaurant targets and now tracks an expanded static prototype set. Nearby or boundary-sensitive restaurants stay out of the public feed unless Wilmington relevance is explicitly confirmed. The seed market is an operating backlog, not proof that any deal is live. Candidate deals from notes, screenshots, aggregators, comments, or social chatter must stay in review until an acceptable source or direct confirmation supports publication.

See [Wilmington seed restaurants](research/wilmington-seed-restaurants.md) and the seed CSVs in [ops/seeds](ops/seeds/).

## Ops-Only Carryout Seeds

The repo also tracks a small Monkey Junction / South Wilmington carryout seed list for future research. These rows are ops-only place/source records, not deal claims, and they are no longer part of the public MVP navigation. A special still cannot appear in `/tonight` unless it has deal-specific source evidence, review, and freshness metadata.

## Source Authority

Use this source priority order when deciding whether a deal can move toward publication:

1. Official restaurant website, menu, or specials page.
2. Official restaurant Instagram/Facebook post.
3. Direct confirmation from restaurant.
4. Local deal aggregators used as discovery only.
5. Reddit/reviews/comments used as leads only.

AI output is never a source. Third-party aggregators, Reddit, reviews, comments, and user notes can create candidates, but they cannot make a deal publishable by themselves.

## Doc Map

- [Project brief](PROJECT_BRIEF.md)
- [Product spec](PRODUCT_SPEC.md)
- [Deployment guide](DEPLOYMENT.md)
- [Friend pilot guide](PILOT.md)
- [Roadmap](ROADMAP.md)
- [Decision log](DECISIONS.md)
- [Brand direction](docs/brand.md)
- [MVP scope](docs/mvp-scope.md)
- [Implementation handoff](docs/implementation-handoff.md)
- [Data model](docs/data-model.md)
- [Prototype data contract](docs/prototype-data-contract.md)
- [Data sources](docs/data-sources.md)
- [Deal validation policy](docs/deal-validation-policy.md)
- [Review workflow](docs/review-workflow.md)
- [Anti-staleness policy](docs/anti-staleness-policy.md)
- [PWA and iOS path](docs/pwa-ios-path.md)
- [Platform options](docs/platform-options.md)
- [Privacy and safety](docs/privacy-and-safety.md)
- [Acceptance criteria](docs/acceptance-criteria.md)

## Operating Templates

- [Restaurant source list](ops/templates/restaurant-source-list.csv)
- [Source inventory template](ops/templates/source-inventory-template.csv)
- [Source captures template](ops/templates/source-captures-template.csv)
- [Deal intake template](ops/templates/deal-intake-template.csv)
- [Source checks template](ops/templates/source-checks-template.csv)
- [Direct confirmations template](ops/templates/direct-confirmations-template.csv)
- [Review tasks template](ops/templates/review-tasks-template.csv)
- [Audit events template](ops/templates/audit-events-template.csv)
- [Review checklist](ops/templates/review-checklist.md)
- [Weekly audit summary template](ops/templates/weekly-audit-summary-template.md)
- [Weekly ops runbook](ops/weekly-ops-runbook.md)

## Operator Commands

Run the full verification gate from the repo root:

```bash
npm run verify
```

Use the phase-based ops front door for intake readiness and release work:

```bash
npm run ops -- intake:new <area-slug> --area-name "Area Name"
npm run ops -- scrape ops/research/intake/<area>-YYYY-MM-DD --dry-run
npm run ops -- scrape ops/research/intake/<area>-YYYY-MM-DD --source <source_id> --confirm-terms-reviewed
npm run ops -- readiness ops/research/intake/<area>-YYYY-MM-DD
npm run ops -- promote:plan ops/research/intake/<area>-YYYY-MM-DD
npm run ops -- promote:apply ops/research/intake/<area>-YYYY-MM-DD --deal <deal_id> --dry-run
npm run ops -- deploy:check
```

Run the read-only research-to-publish flow for a dated intake packet:

```bash
npm run research:flow -- ops/research/intake/<area>-YYYY-MM-DD
```

`npm run verify` runs promotion-blocker regression tests, admin guard regression tests, ops readiness regression tests, app typecheck/lint, public fixture data validation, and production build.

`research:flow` validates the intake contract, runs the dry-run promotion guard, prints a fixture promotion packet, validates current public fixture data, typechecks, builds, and writes a human-readable `promotion-checklist.md` inside the intake folder. It does not edit `fixtures/prototype/*`, approve rows, scrape sites, call external APIs, or make research data public.

`ops intake:new` creates an empty canonical intake packet with template headers, `area_brief.json`, and local artifact folders. It does not research restaurants, scrape, approve rows, or write fixtures.

Phase 1 ops automation is intentionally read-only. `ops readiness` separates already-public fixture-clean rows from rows ready for exact-ID promotion and rows blocked by evidence, review, copy, freshness, scope, or metadata issues.

Phase 2 adds capture-only official-source automation. `ops scrape` can collect reviewed `tier_1_official` source pages from a canonical intake packet into `source-captures.csv`, `source-checks.csv`, local `raw/` text/HTML, and local `screenshots/` artifacts. It does not edit `deal-intake.csv`, approve rows, promote fixtures, publish data, or hydrate public routes. Sources with robots/terms notes require `--confirm-terms-reviewed`; third-party, social, login-required, permission-required, inactive, and non-automated rows are skipped.

Phase 3 adds exact-ID reviewed fixture apply. `ops promote:apply` requires one or more explicit `--deal <deal_id>` arguments and defaults to dry-run unless `--write-reviewed-fixtures` is passed. It refuses broad all-row promotion, blocked rows, existing public deal rewrites, missing support rows, support-row drift, missing local evidence, invalid relationships, and any write that fails `npm run validate:data` in `app/`. Successful writes update only reviewed fixture rows plus manifest counts and print the generated git diff.

## Seed Backlog

- [Wilmington restaurant sources](ops/seeds/wilmington-restaurant-sources.csv)
- [Wilmington carryout places](ops/seeds/wilmington-carryout-places.csv)
- [Wilmington deal candidates](ops/seeds/wilmington-deal-candidates.csv)
- [Wilmington review tasks](ops/seeds/wilmington-review-tasks.csv)

## Implementation Areas

- [Next.js prototype app](app/README.md)
- [Future backend](backend/README.md)
- [Future workers](workers/README.md)
- [Research](research/README.md)
- [Tests](tests/README.md)

## Current Status

Static-data app prototype. `/tonight` reads reviewed public rows from `fixtures/prototype/deals.csv`, filters by Wilmington weekday and freshness gates, and links to deal detail pages. Carryout seed rows remain ops-only backlog. `/admin` is a read-only ops dashboard, with `/admin/review` and `/admin/source-gaps` as focused drilldowns for static review operations.

## Next Practical Milestone

Use `ops scrape` to refresh official source captures for review, then use the source-gap report and validation scripts to promote the next reviewed food deals safely.
