# Round 2 Integration Summary - 2026-06-04

This pass integrated official-website-backed candidates from the agent discovery packets. No public fixtures were edited and no candidate was approved or promoted.

## Added Internal Deal Candidates

All rows were added with `workflow_status=needs_review`, `mvp_publish_eligible=false`, `public_copy_approved=false`, blank review decisions, and `conflict_detected=false`.

| Candidate | Restaurant | Source | Key blocker |
| --- | --- | --- | --- |
| `cand-wilmington-k38-porters-neck-monday-5-food-items-2026-06-04` | K38 Porters Neck | Official location page | Food-only copy and missing end time |
| `cand-wilmington-k38-porters-neck-wednesday-half-off-quesadilla-2026-06-04` | K38 Porters Neck | Official location page | Missing end time and base price |
| `cand-wilmington-k38-forum-monday-5-food-items-2026-06-04` | K38 Forum | Official location page | Food-only copy and missing end time |
| `cand-wilmington-k38-forum-wednesday-half-off-quesadilla-2026-06-04` | K38 Forum | Official location page | Missing end time and base price |
| `cand-wilmington-prost-flounder-sandwich-2026-06-05` | Prost Biergarten | Official specials page | Date-windowed, time-display conflict, service mode unknown |
| `cand-wilmington-prost-smash-burger-2026-06-09` | Prost Biergarten | Official specials page | Date-windowed and service mode unknown |
| `cand-wilmington-block-taco-pizza-box-2026-06-04` | Block Taco | Official website current specials | Group-pack/deal qualification and service mode unknown |
| `cand-fentonis-weekday-2-slice-lunch-2026-06-04` | Fentoni's Pizza | Official daily-specials page | Restriction copy for plus tax, dine-in only, Publix location only |
| `cand-k38-cb-cinco-monday-food-2026-06-04` | K38 Baja Grill Carolina Beach | Official location page | Food-only copy and missing end time |
| `cand-k38-cb-quesadilla-wednesday-2026-06-04` | K38 Baja Grill Carolina Beach | Official location page | Missing end time |

## Added Supporting Records

- 6 restaurant source-list rows
- 6 source-inventory rows
- 6 source-capture rows
- 10 review-task rows

## Held As Leads

- Shuckin' Shack Thursday crab legs: official price found, but Carolina Beach applicability/time window need confirmation before import.
- Kornerstone Bistro kids-eat-free lead: official signal exists, but restriction details are incomplete.
- K38 Tuesday fajitas: official pages do not show exact food price or discount.
- Prost June 4 pierogies: official page has food details but no price.

## Validation Snapshot

- `npm run research:validate -- ops/research/intake/wilmington-2026-06-03`: passed with 138 CSV rows and 0 warnings.
- Public gate audit after import: 34 internal deal rows, 0 bad gates.
