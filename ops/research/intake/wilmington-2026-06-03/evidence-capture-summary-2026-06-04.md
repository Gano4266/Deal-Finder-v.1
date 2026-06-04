# Evidence Capture Summary - 2026-06-04

Scope: agent-assisted non-public evidence hardening for selected Wilmington On Our Radar review candidates. No public fixture CSVs were edited, no rows were approved, and all public gates remain closed.

## Hardened Evidence Packets

| Restaurant | Candidate | Evidence state | Remaining blockers |
|---|---|---|---|
| Cornelia's | Thursday wings and smashburgers | Screenshot, normalized text, evidence note, and hashes captured under `evidence/cornelias/`. | Human review, food-only copy, restrictions, and public access at The Davis Community. |
| Fortunate Glass | Chicken Mole Black Bean Soup | Official PDF, homepage HTML, normalized text, evidence note, and hashes captured under `evidence/fortunate-glass/`. | Human review, food-only copy, PDF visual review, and time/restriction uncertainty. |
| Michaelangelo's Pizza - Monkey Junction | 2 cheese slices and fountain drink | Page screenshot, HTML archive, image asset, normalized OCR text, evidence note, and hashes captured under `evidence/michaelangelos-pizza-monkey-junction/`. | OCR review, limited-time freshness, restrictions, and Monkey Junction boundary review. |
| Might As Well Bar & Grill | June 4 cheeseburgers | Normalized text/hash captured under `evidence/might-as-well/`. | Same-day human review before `expires_on=2026-06-05`; otherwise let expire or mark `needs_recheck`. |
| Sawmill Restaurant | June 4 Pasta Night | Normalized text/hash captured under `evidence/sawmill-restaurant/`. | Price and dish details missing; direct confirmation or expiry after `2026-06-05`; Monkey Junction boundary review. |

## Still Needs Direct Confirmation Or Stronger Official Evidence

- Roko Italian Cuisine: confirm whether Friday/Saturday House Special is food and capture exact terms.
- Castle Street Kitchen: confirm current rotating taco feature, price, day/time, and recurrence.
- YoSake: current official source does not expose exact happy-hour food terms.
- C-Street Mexican Grill: resolve address/ZIP conflict before deal research.
- Tidewater Oyster Bar: exact Daily Specials items came from `tier_3_partner` Toast; confidence stays `probable` until direct confirmation or stronger official capture.

## Validation

- `npm run research:validate -- ops/research/intake/wilmington-2026-06-03` passed with 0 warnings.
- `cd app && npm run validate:data` passed.
- Cross-file gate audit found no candidates with `mvp_publish_eligible=true`, `public_copy_approved=true`, or `review_decision=approved`.
