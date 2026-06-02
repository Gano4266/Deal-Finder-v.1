# Deal Finder

Deal Finder is a static-data MVP prototype for a Wilmington, North Carolina restaurant deals app. The first product goal is practical: answer "What are the best restaurant deals in Wilmington tonight?" with source-grounded food specials, clear freshness metadata, and no hallucinated offers.

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

## Monkey Junction Carryout Seeds

The prototype also tracks a small Monkey Junction / South Wilmington carryout seed list for practical "where can I grab food?" use cases. These rows are place/source records, not deal claims. A place can appear in `/carryout` with official carryout or ordering evidence, but a special still cannot appear in `/tonight` unless it has deal-specific source evidence, review, and freshness metadata.

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
- [Roadmap](ROADMAP.md)
- [Decision log](DECISIONS.md)
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

Static-data app prototype. `/tonight` reads reviewed public rows from `fixtures/prototype/deals.csv`, filters by Wilmington weekday and freshness gates, and links to deal detail pages. `/carryout` reads place/source seeds from `ops/seeds/wilmington-carryout-places.csv`. `/admin` is a read-only ops dashboard, with `/admin/review` and `/admin/source-gaps` as focused drilldowns for static review operations.

## Next Practical Milestone

Use the source-gap report and validation script to promote the next reviewed food deals safely. Do not automate crawling yet.
