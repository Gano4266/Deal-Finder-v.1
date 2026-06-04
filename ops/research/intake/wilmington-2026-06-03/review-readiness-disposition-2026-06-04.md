# Review Readiness Disposition - 2026-06-04

Scope: disposition prep for the 9 Wilmington On Our Radar candidates in `deal-intake.csv`.

Rules followed: no public fixture CSVs edited, no deals approved or promoted, no commits, and AI output treated only as review support. This handoff inspected current intake CSVs, review tasks, source captures, the evidence capture summary, and local evidence notes/artifacts where available.

## Summary

| Bucket | Count | Candidates |
|---|---:|---|
| `ready_for_human_decision` | 4 | Cornelia's wings; Cornelia's smashburgers; Michaelangelo's slice/drink; Fortunate Glass soup |
| `needs_direct_confirmation` | 2 | Tomiko-San Sushi Hour; Tidewater Daily Specials |
| `let_expire_if_not_reviewed` | 2 | Might As Well June 4 cheeseburgers; Sawmill June 4 Pasta Night |
| `reject_or_rewrite_recommended` | 1 | El Cerro Monkey Junction Lunch Specials menu |

All candidates remain `workflow_status=needs_review`, `mvp_publish_eligible=false`, `public_copy_approved=false`, and without an approval decision.

## Candidate Dispositions

### `cand-wilmington-cornelias-thu-wings-2026-06-04`

- Bucket: `ready_for_human_decision`
- Why: current row has official `tier_1_official` evidence, exact Thursday schedule, 4-9 pm time window, $10 price, durable screenshot, normalized text, and recorded hashes through `cap-wilmington-cornelias-weekly-specials-2026-06-04`.
- Remaining blockers: public access at The Davis Community remains unconfirmed; food-only copy must suppress alcohol-adjacent source text; restrictions are incomplete.
- Next reviewer action: review the saved screenshot/normalized text, decide whether public access is sufficient for publication, and either approve with careful food-only copy plus recheck date or reject/hold for direct access confirmation.

### `cand-wilmington-cornelias-thu-smashburger-2026-06-04`

- Bucket: `ready_for_human_decision`
- Why: current row has official `tier_1_official` evidence, exact Thursday schedule, 4-9 pm time window, $10 price, durable screenshot, normalized text, and recorded hashes through the same Cornelia's capture packet.
- Remaining blockers: public access at The Davis Community remains unconfirmed; food-only copy must suppress alcohol-adjacent source text; restrictions are incomplete.
- Next reviewer action: review the saved evidence and make the same public-access decision as the wing candidate; approve only if access and copy gates can be satisfied.

### `cand-wilmington-tomiko-san-sushi-hour-2026-06-04`

- Bucket: `needs_direct_confirmation`
- Why: the official source supports a Sushi Hour Tue-Thu, 5-7 pm, but the row still lacks durable capture fields and does not expose exact food item/pricing details.
- Remaining blockers: durable screenshot/archive/hash missing; exact food items and prices missing; mixed food/drink copy requires suppression.
- Next reviewer action: directly confirm current food items, prices, restrictions, and recurrence with the restaurant, or capture stronger official page evidence if the site is updated. Keep out of public fixtures until exact food-safe terms are supported.

### `cand-wilmington-el-cerro-mj-lunch-specials-2026-06-04`

- Bucket: `reject_or_rewrite_recommended`
- Why: official evidence supports a Lunch Specials menu category, but the policy warns against promoting routine menu availability or standard menu categories as deals unless meaningful deal value is clear. This row also remains Monkey Junction boundary-sensitive.
- Remaining blockers: regular-menu qualification unresolved; durable capture missing; Monkey Junction boundary review required before any publication path.
- Next reviewer action: reject as a deal candidate unless a reviewer determines the lunch menu is a meaningful special under the Deal Value Gate. If kept, rewrite as an ops/source-gap item first and capture both menu and location evidence before considering any future candidate.

### `cand-wilmington-michaelangelos-mj-slices-drink-2026-06-04`

- Bucket: `ready_for_human_decision`
- Why: official `tier_1_official` evidence is now hardened with page HTML, page screenshot, exact image asset, normalized OCR text, and hashes. The price and service restrictions are captured for reviewer comparison.
- Remaining blockers: reviewer must verify OCR against the saved image; the source says limited time with no explicit end date; Monkey Junction boundary review is required; public copy is not approved.
- Next reviewer action: compare OCR to the image asset, set a conservative expiry or recheck, complete Monkey Junction boundary review, and then approve/reject. Do not import other Michaelangelo's specials without their own OCR/evidence packets.

### `cand-wilmington-might-as-well-cheeseburgers-2026-06-04`

- Bucket: `let_expire_if_not_reviewed`
- Why: official source text supports a Thursday June 4 cheeseburger special and the normalized text/hash were captured, but the candidate is date-specific and expires `2026-06-05`.
- Remaining blockers: no screenshot; alcohol-adjacent source copy must be suppressed; no human approval; same-day freshness window.
- Next reviewer action: if reviewed before expiry, decide same-day approval/rejection with food-only copy. If not reviewed by `2026-06-05`, move toward `expired` or `needs_recheck` rather than keeping the candidate open as current.

### `cand-wilmington-sawmill-pasta-night-2026-06-04`

- Bucket: `let_expire_if_not_reviewed`
- Why: official source text supports a Thursday June 4 Pasta Night title and time window, but it is date-specific, expires `2026-06-05`, and lacks price and exact dish detail.
- Remaining blockers: price missing; exact dish details missing; no screenshot; Monkey Junction boundary review required; no human approval.
- Next reviewer action: directly confirm price/details immediately if a same-day decision is still possible. Otherwise mark stale via `expired` or `needs_recheck` after `2026-06-05`.

### `cand-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04`

- Bucket: `ready_for_human_decision`
- Why: official homepage links the Weekly Specials PDF, and the packet now includes PDF artifact, homepage HTML, normalized text, content hash, and evidence file hash. The candidate is food-only after alcohol suppression.
- Remaining blockers: no day/time window found in the PDF text; restrictions are unclear; reviewer must decide whether the PDF price `18` should be represented as `$18`; public copy remains unapproved.
- Next reviewer action: review the PDF artifact and normalized text, decide whether a weekly PDF food special without a time window qualifies, set conservative recheck/freshness metadata, and approve/reject.

### `cand-wilmington-tidewater-daily-specials-food-2026-06-04`

- Bucket: `needs_direct_confirmation`
- Why: the exact item list came from a `tier_3_partner` Toast source, not a restaurant-owned page or direct confirmation. Confidence is correctly `probable`.
- Remaining blockers: durable partner capture missing; no current official capture for exact items; no time window, recurrence, day applicability, or restrictions; same-day/next-day freshness required.
- Next reviewer action: call or otherwise directly confirm current food specials with Tidewater before publication. If only Toast evidence remains, keep it internal and short-lived.

## Edits Made

- Added this Markdown handoff only: `review-readiness-disposition-2026-06-04.md`.
- No CSV statuses changed.
- No public fixture CSVs edited.
- No deals approved, promoted, published, or committed.

## Follow-Up Order

1. Human reviewer decision: Cornelia's wings, Cornelia's smashburgers, Michaelangelo's slice/drink, Fortunate Glass soup.
2. Direct confirmation: Tomiko-San and Tidewater.
3. Expiry handling after `2026-06-05`: Might As Well and Sawmill if no reviewer action occurred.
4. Rejection/rewrite review: El Cerro Monkey Junction lunch specials.
