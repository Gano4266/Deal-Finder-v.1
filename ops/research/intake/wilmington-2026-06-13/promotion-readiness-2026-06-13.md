# Wilmington Promotion Readiness - 2026-06-13

Status: six Wilmington rows were approved and promoted to public static fixtures on 2026-06-13.

Promotion guard results:

- `ops/research/intake/wilmington-2026-06-03`: 34 deal rows scanned, 0 promotable.
- `ops/research/intake/wilmington-2026-06-13`: 11 deal rows scanned; 6 rows approved and mapped into public fixtures; 5 rows remain blocked by review/copy/service-mode gates.
- Public fixture validation is green with 75 public prototype deals across 64 restaurants.
- Local proof screenshots are captured for the 11 review-only deal candidates and wired into `source-captures.csv`, `source-checks.csv`, and `deal-intake.csv`.

This queue now includes two completed promotion packets. Remaining unapproved rows stay review-only and are not public.

## Completed Promotion - 2026-06-13

Promoted into public static fixtures:

- `deal-wilmington-k38-porters-neck-monday-5-food-items`
- `deal-wilmington-k38-porters-neck-wednesday-quesadilla`
- `deal-wilmington-k38-forum-monday-5-food-items`
- `deal-wilmington-k38-forum-wednesday-quesadilla`
- `deal-wilmington-fire-bowl-lunch-special`
- `deal-wilmington-melting-pot-thursdate`

Promotion notes:

- Official K38 location pages were used as tier-1 evidence.
- Public copy is food-only; alcohol/drink language is suppressed.
- Food specials start at 5 PM and are dine-in only.
- Exact end time is not listed; Wednesday base price is not captured.
- `next_check_due=2026-07-13`.
- Fixture relationships, support metadata, and manifest counts pass the promotion-packet check.
- Fire Bowl is published with its HTTP-only source caveat and local screenshot proof.
- Melting Pot Thursdate is published with minimum-purchase and Wilmington-location wording.

## First Promotion Queue

These are the cleanest Wilmington-only candidates to harden first because they are official-source backed, recurring or currently within freshness policy, and not Monkey Junction or future-market sensitive.

The 2026-06-13 intake now contains 11 review-only deal rows:

- 4 K38 Wilmington recurring candidates.
- 2 Prost Biergarten date-windowed lunch candidates.
- 1 Fire Bowl official lunch-special candidate.
- 2 Melting Pot Wilmington official promotion candidates.
- 2 restaurant-branded ordering-page lunch-special candidates for Lucky Star and Ming Wok.
- Seabird, Mess Hall, and Banh Sai remain source leads only because no exact official food-special claim was visible.

| Priority | Candidate | Current evidence | Main blockers | Promotion decision |
|---|---|---|---|---|
| 1 | `cand-wilmington-k38-porters-neck-monday-5-food-items-2026-06-04` | Official K38 Porters Neck source capture, `next_check_due=2026-07-04` | Missing human approval, public copy approval, `source_check_id`, fixture metadata, `published_at`; end time unknown | Review for cautious public copy; likely strongest candidate if reviewer accepts blank end time |
| 2 | `cand-wilmington-k38-porters-neck-wednesday-half-off-quesadilla-2026-06-04` | Official K38 Porters Neck source capture, `next_check_due=2026-07-04` | Missing human approval, public copy approval, `source_check_id`, fixture metadata, `published_at`; base price and end time unknown | Review for cautious public copy; likely strong if base-price absence is acceptable |
| 3 | `cand-wilmington-k38-forum-monday-5-food-items-2026-06-04` | Official K38 Forum source capture, `next_check_due=2026-07-04` | Missing human approval, public copy approval, `source_check_id`, fixture metadata, `published_at`; end time unknown | Review for cautious public copy; likely strong if reviewer accepts blank end time |
| 4 | `cand-wilmington-k38-forum-wednesday-half-off-quesadilla-2026-06-04` | Official K38 Forum source capture, `next_check_due=2026-07-04` | Missing human approval, public copy approval, `source_check_id`, fixture metadata, `published_at`; base price and end time unknown | Review for cautious public copy; likely strong if base-price absence is acceptable |
| 5 | `cand-wilmington-block-taco-pizza-box-2026-06-04` | Official Block Taco source capture, `next_check_due=2026-07-04` | Reviewer must decide whether a group pack qualifies as a public deal; service mode unknown; missing public approval and fixture metadata | Hold unless reviewer wants group-pack specials in the public feed |
| 6 | `cand-wilmington-cornelias-thu-wings-2026-06-04` | Official Cornelia's screenshot and normalized text, `next_check_due=2026-07-04` | Public access at The Davis Community must be confirmed; content hash format needs `sha256:` prefix; missing public approval and source check | Hold until public access is confirmed |
| 7 | `cand-wilmington-cornelias-thu-smashburger-2026-06-04` | Official Cornelia's screenshot and normalized text, `next_check_due=2026-07-04` | Public access at The Davis Community must be confirmed; content hash format needs `sha256:` prefix; missing public approval and source check | Hold until public access is confirmed |

## Active 2026-06-13 Review Candidates

These rows are structurally eligible for human review but blocked from public promotion.

The 2026-06-13 candidate rows now have local screenshot paths. They remain blocked by review, copy, approval, and fixture metadata gates.

| Candidate | Source | Why blocked |
|---|---|---|
| `cand-wilmington-2026-06-13-prost-tuesday-smash-burger` | Official Prost specials page | Needs human approval, reviewed metadata, public copy, takeout/delivery applicability, and final fixture metadata |
| `cand-wilmington-2026-06-13-prost-wednesday-reuben` | Official Prost specials page | Needs human approval, reviewed metadata, public copy, takeout/delivery applicability, and final fixture metadata |
| `cand-wilmington-2026-06-13-melting-pot-military-monday` | Official Melting Pot Wilmington events page | Needs human approval, reviewed metadata, public copy, restricted-audience review, chain-location specificity review, and final fixture metadata |
| `cand-wilmington-2026-06-13-lucky-star-lunch-special` | Lucky Star restaurant-branded ordering page | Needs human approval, reviewed metadata, public copy, official-ordering ownership review, and final fixture metadata |
| `cand-wilmington-2026-06-13-ming-wok-lunch-special` | Ming Wok restaurant-branded ordering page | Needs human approval, reviewed metadata, public copy, official-ordering ownership review, and final fixture metadata |

Recommended order:

1. Review Lucky Star and Ming Wok only after confirming the restaurant-branded ordering pages are acceptable official-ordering evidence.
2. Review Melting Pot Military Monday only if the restricted-audience and "up to" discount copy belongs in the public feed.
3. Handle Prost only if reviewer can resolve takeout/delivery applicability before the short date windows.
4. Keep Seabird, Mess Hall, and Banh Sai as source leads until official specials or direct confirmation exists.

## Do Not Promote Yet

- Prost Biergarten June 5 and June 9 rows: expired/overdue as of 2026-06-13 unless freshly rechecked.
- Might As Well rows: date-windowed rows are expired/overdue.
- Sawmill date-windowed rows: expired/overdue and Monkey Junction boundary-sensitive.
- Michaelangelo's and El Cerro Monkey Junction rows: boundary-sensitive; need full location-scope review.
- Tidewater Toast row: partner source is not enough for public fixture promotion.
- Carolina Beach rows in the Wilmington June 3 intake: defer because this pass is Wilmington-only.

## Required Work Before Fixture Promotion

For each selected candidate:

1. Add or map a `source_check_id` that points to the supporting official capture.
2. Draft public copy in `public_title` and `public_description`.
3. Record human review:
   - `workflow_status=approved` or `approved_with_uncertainty`
   - `review_decision=approved`
   - `decision_reason`
   - `reviewed_by`
   - `reviewed_at`
4. Set:
   - `public_copy_approved=true`
   - `mvp_publish_eligible=true`
   - `fixture_data_class=verified_static`
   - `is_live_data=false`
   - prototype notice text
5. Keep `published_at` blank until the final manual fixture promotion step.
6. Promote only after `npm run research:dry-run -- ops/research/intake/wilmington-2026-06-13` shows the selected rows are clean enough for fixture mapping.

## Final Fixture Files

Once rows are reviewed and approved, the final manual promotion touches:

- `fixtures/prototype/deals.csv`
- `fixtures/prototype/restaurants.csv`
- `fixtures/prototype/sources.csv`
- `fixtures/prototype/source-captures.csv`
- `fixtures/prototype/source-checks.csv`
- `fixtures/prototype/review-tasks.csv`
- `fixtures/prototype/audit-events.csv`
- `fixtures/prototype/fixture-manifest.json`

Run after promotion:

```bash
cd app
npm run validate:data
npm run lint
npm run build
DEAL_FINDER_SMOKE_BASE_URL=http://127.0.0.1:3001 DEAL_FINDER_SMOKE_ADMIN_MODE=disabled npm run smoke
DEAL_FINDER_SMOKE_BASE_URL=http://127.0.0.1:3001 npm run mobile:smoke
```
