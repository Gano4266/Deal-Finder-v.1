# Katy's and Coquina Review Packet - 2026-06-13

Fresh official captures were added for the next Wilmington review slice. These rows are intake-only and do not change the public prototype fixture.

## Added Candidates

| Candidate | Source | Status | Review focus |
|---|---|---|---|
| `cand-wilmington-2026-06-13-katys-monday-philly-cheesesteak` | `https://katysbarandgrill.com/weekly-specials/` | `needs_review` | Missing lunch/dinner time window, takeout/delivery applicability, and public copy approval. |
| `cand-wilmington-2026-06-13-katys-tuesday-half-price-burgers` | `https://katysbarandgrill.com/weekly-specials/` | `needs_review` | Base price, missing lunch/dinner time window, takeout/delivery applicability, and public copy approval. |
| `cand-wilmington-2026-06-13-katys-wednesday-half-price-chicken-sandwiches` | `https://katysbarandgrill.com/weekly-specials/` | `needs_review` | Base price, missing lunch/dinner time window, takeout/delivery applicability, and public copy approval. |
| `cand-wilmington-2026-06-13-katys-thursday-wings-fries` | `https://katysbarandgrill.com/weekly-specials/` | `needs_review` | Missing lunch/dinner time window, takeout/delivery applicability, and public copy approval. |
| `cand-wilmington-2026-06-13-katys-friday-hotdogs-fries` | `https://katysbarandgrill.com/weekly-specials/` | `needs_review` | Missing lunch/dinner time window, takeout/delivery applicability, and public copy approval. |
| `cand-wilmington-2026-06-13-coquina-daily-lunch-specials` | `https://coquinafishbar.com/daily-lunch-specials/` | `needs_review` | Decide broad row vs. day-specific rows; confirm service modes and restrictions. |

## Capture Notes

- Katy's screenshot: `ops/research/intake/wilmington-2026-06-13/screenshots/src-katys-grill-bar-weekly-specials-2026-06-13.png`
- Coquina screenshot: `ops/research/intake/wilmington-2026-06-13/screenshots/src-coquina-fishbar-daily-lunch-specials-2026-06-13.png`
- Katy's fish-and-chips claim was intentionally held out because the source placement needs review before assigning it to Friday.
- Cornelia's was intentionally not duplicated here; the existing June 3 review-only candidates remain the canonical blocked rows until public access is resolved.

## Validation

- `npm run research:validate -- ops/research/intake/wilmington-2026-06-13` passes with review-gap warnings only.
- `npm run research:summary -- ops/research/intake/wilmington-2026-06-13` reports 11 `needs_review` rows.
- `npm run research:promotion-packet -- ops/research/intake/wilmington-2026-06-13` sees only the six previously approved public rows; no new fixture promotion is proposed.
- `cd app && npm run validate:data` still validates 75 public prototype deals across 64 restaurants.
