# Acceptance Criteria

## Phase 1 Static App Acceptance

- Planned top-level docs exist.
- Planned focused docs exist under `docs/`.
- CSV templates exist under `ops/templates/`.
- A lean Next.js/PWA static prototype exists under `app/`.
- The app has no live scraping, auth, payments, maps, database, or AI automation.
- Docs consistently state Wilmington, NC only.
- Docs consistently state food-only MVP scope and alcohol suppression.
- Docs consistently state mobile-first web/PWA first.
- No policy permits publishing a deal without source evidence.

## Template Acceptance

- Restaurant template includes identity, location, official URLs, source URLs, status, and last checked date.
- Deal template includes source URL, source tier, evidence capture date, freshness fields, workflow status, reviewer decision fields, and expiration fields.
- Deal template includes provenance, durable evidence, reviewer fields, `confidence_status`, `workflow_status`, `expires_on`, and `next_check_due`.
- Source inventory tracks each source independently with source type, source tier, owner, priority, cadence, status, and next check due.
- Source captures, direct confirmations, review tasks, and audit events have CSV templates.
- Source checks template includes check result, evidence references, change detection, affected deals, action taken, and next check due.
- Weekly audit summary template exists for counts, overdue checks, evidence gaps, restaurants needing attention, and decisions recorded.

## First 25-Restaurant Milestone

- 25 Wilmington restaurants are seeded.
- Each restaurant has at least one source.
- At least 20 restaurants have a successful source capture or manual evidence note.
- Every published deal has source evidence.
- Stale or ambiguous deals route to review.
- A reviewer can trace any visible deal back through:

```text
visible deal
-> review decision
-> source capture or direct confirmation
-> source check history
-> next scheduled check or expiration
```
- A weekly refresh produces an audit summary.
- The app or prototype clearly labels demo data until live verification exists.
- The current weekly audit artifact lives under `ops/audits/`.

## Wilmington Seed Market Acceptance

- README explains the Wilmington seed market, source authority policy, and static-data `/tonight` next milestone.
- `research/wilmington-seed-restaurants.md` documents the 25 seed restaurants.
- `ops/seeds/wilmington-restaurant-sources.csv` and `ops/seeds/wilmington-deal-candidates.csv` exist and parse cleanly.
- Original user-provided handwritten/screenshot deals are preserved as candidates, not verified facts.
- No seed deal can be considered publishable without an acceptable official source or direct confirmation.
- Seed docs point toward a static-data `/tonight` MVP, not crawling, scraping, browser automation, or native app work.
- Existing README doc links remain valid.

## Phase 1B Data Contract Acceptance

- `docs/prototype-data-contract.md` defines the public `/tonight` data source and filter.
- `/tonight` reads reviewed public rows from `fixtures/prototype/deals.csv`, not seed candidates.
- Source-backed seed candidates appear only in `/admin/review` until reviewer decision, public copy approval, and freshness fields are present.
- Public fixture rows may exist, but every visible deal must pass the public deal filter, day filtering, evidence checks, freshness gates, and static-prototype labeling.
- Empty-state copy does not imply live availability.
- Review tasks exist for each source-backed seed candidate.

## Carryout Seed Acceptance

- Carryout rows remain ops-only seed backlog.
- The public MVP does not expose `/carryout`.
- Carryout rows do not imply any restaurant special is published.
- A carryout place can become a public deal only through the normal `fixtures/prototype/deals.csv` public deal filter.
