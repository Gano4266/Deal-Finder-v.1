# Decisions

This file records defaults chosen for the MVP scaffold. Revisit decisions when product evidence changes.

## 2026-06-01: Web/PWA First

Decision: Start with a mobile-first web/PWA path instead of Xcode/SwiftUI.

Reason: The riskiest part of the MVP is accurate deal inventory and operations, not native UI. Web gives faster iteration, shareable pages, and simpler admin tooling.

## 2026-06-01: Wilmington, NC Only

Decision: The first market is Wilmington, North Carolina only.

Reason: A narrow local market makes source quality, restaurant coverage, and weekly operations testable.

## 2026-06-01: Source Evidence Required

Decision: No public deal can be published without evidence.

Reason: Trust is the product. Each public deal must have a source URL or direct-confirmation note, capture date, source tier, reviewer/status, and recheck or expiration date.

## 2026-06-01: Human Review Before Publication

Decision: Human review is required before a deal appears publicly in the first MVP.

Reason: Source formats are messy, social posts are stale quickly, and AI extraction can overstate certainty.

## 2026-06-01: CSV Templates As First Ops Workflow

Decision: Use repo-managed CSV and Markdown templates for the first operating workflow.

Reason: They are easy to audit, version, and later import into a database.

## 2026-06-03: Carolina Beach Authorized as Wilmington Broad Scope

Decision: Carolina Beach, NC is authorized as part of the Wilmington broad market scope. Carolina Beach deals appear in the main `/tonight` and `/deals` feeds under the "Carolina Beach" area group — not as a separate market route.

Reason: Carolina Beach is geographically and culturally part of the greater Wilmington area. Including it in the main Wilmington feed keeps the product coherent and avoids fragmenting a small market into a separate shell route. The existing area filter on `/deals` already supports the "Carolina Beach" group.

What this authorizes:
- Carolina Beach restaurants and deals in `fixtures/prototype/restaurants.csv` and `fixtures/prototype/deals.csv` alongside Wilmington rows.
- Carolina Beach deals visible on `/tonight`, `/deals`, and `/restaurants` filtered by area.
- The `publicFixtureCities` set in `scripts/validate-data.mjs` and `app/lib/data.ts` already includes "Carolina Beach" — no code change required.
- Intake review for Carolina Beach candidates flows through `/admin/review` (which reads all research intake folders automatically).

What this does not authorize:
- A separate `/carolina-beach` public route is not needed; use `/deals?area=Carolina+Beach`.
- Kure Beach, Oak Island (except as part of the Southport pilot), or other nearby areas outside Southport and Carolina Beach remain future-market only.
- The same full evidence, review, and publish gates apply — no AI-only approvals.

Carolina Beach intake research lives in `ops/research/intake/carolina-beach-YYYY-MM-DD/`. Do not promote intake rows to `fixtures/prototype/` without human review.

## 2026-06-03: Southport Soft-Pilot Market Authorized (Phase A Shell Only)

Decision: Southport, NC is authorized as a soft-pilot market, starting with a clearly labeled prototype shell route at `/southport`. Southport remains separate from the Wilmington broad feed; Carolina Beach remains governed by the separate Wilmington broad-scope decision above.

Reason: A family research preview of Southport deals has been identified as a near-term goal. The safest first version is a prototype-labeled landing surface that honestly shows zero reviewed deals until the full review gates pass, rather than a second live feed or a hidden alternate inside `/tonight`.

Phase A authorizes:
- A `/southport` route shell with clear prototype labeling.
- Reading only reviewed prototype rows from `fixtures/prototype/deals.csv` filtered to Southport restaurants. These may appear on `/southport`, but not in the main `/tonight`, `/deals`, or `/restaurants` Wilmington surfaces.
- A Southport-specific route and review workflow, rather than main-feed area filters.
- The framework changes in `app/lib/data.ts` and `scripts/validate-data.mjs` that allow Southport and Oak Island as valid fixture cities (groundwork for Phase C).

Phase A does not authorize:
- Hydrating `/southport` from `ops/research/intake/` directly.
- Labeling any Southport row as `approved` or `approved_with_uncertainty` without official source evidence and human reviewer sign-off.
- Wording like "available tonight," "verified today," or "current Southport deals" until the full review gates pass.
- Adding Kure Beach or any other nearby market to public fixtures. Carolina Beach is handled by the separate Wilmington broad-scope decision above.

Phase B (optional, later): A private Southport review dashboard showing intake candidate count, blocked rows, missing evidence, and next manual actions. Rows must be labeled "research lead," "needs review," or "not publishable yet."

Phase C (later, deliberate): True Southport main-feed listings after the market earns enough reviewed rows and a stronger product reason to merge markets. Requires a follow-on decision entry here before any Southport deal appears in `/tonight` or the main `/deals` feed.

Southport intake research lives in `ops/research/intake/southport-YYYY-MM-DD/`. Do not promote intake rows to `fixtures/prototype/deals.csv` without human review and a new decision entry if it changes the scope of what this decision authorizes.

## 2026-06-03: Carryout Route Suppressed From Public MVP

Decision: The `/carryout` route is no longer part of the public MVP navigation.

Reason: Carryout place rows in `ops/seeds/wilmington-carryout-places.csv` are ops-only place and source records, not deal claims. Exposing a `/carryout` public route implied availability that the static prototype cannot support. Carryout seeds remain in the ops backlog. A carryout place can become a public deal only by passing the full public deal filter in `fixtures/prototype/deals.csv`. Do not revive `/carryout` as a public route without an explicit new decision here.

## 2026-06-03: Forkcast Brand Direction

Decision: Use Forkcast as the product name and lock the brand direction around "Today's forecast."

Reason: Forkcast gives the product a stronger, more memorable frame than Deal Finder. It supports a local dining intelligence position instead of a generic coupon or listing-app position. The exact production logo vector remains provisional until the Signal F mark is tested at app-icon sizes.
