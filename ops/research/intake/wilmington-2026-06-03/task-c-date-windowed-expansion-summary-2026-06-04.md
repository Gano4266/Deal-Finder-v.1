# Task C Date-Windowed Expansion Summary - 2026-06-04

Scope: Might As Well Bar & Grill and Sawmill Restaurant official website-backed candidates for future/non-expired June 5-9 rows.

This is internal review intake only. No public fixture CSVs were edited, no approvals were recorded, and AI output is not evidence.

## Sources Rechecked

- Might As Well official specials page: `https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials`
- Sawmill official daily specials page: `https://thesawmillrestaurant.com/daily-specials/`

## Evidence Artifacts Added

- `ops/research/intake/wilmington-2026-06-03/evidence/might-as-well/2026-06-05-09-food-specials-normalized.txt`
  - SHA-256: `4ec0b320444ca3531b59d8a896e9ef28c8bd647e552ca797b98d297987de352b`
- `ops/research/intake/wilmington-2026-06-03/evidence/sawmill-restaurant/2026-06-05-09-priced-food-specials-normalized.txt`
  - SHA-256: `c49227dd01a7d94cb1ff1170720e6ff9af09b8f713fddbc84485c8470d79258d`

## Candidates Added

Might As Well:

- June 5 Friday 99 cent wings
- June 7 Sunday buffet
- June 7 large pizza discount
- June 8 $5 appetizer menu
- June 9 $1 cheese quesadilla

Sawmill:

- June 6 coffee cake combo
- June 6 avocado toast
- June 7 avocado toast
- June 7 coffee cake combo

## Rows Intentionally Excluded

- Sawmill Friday Prime Rib and Stew Beef: no price visible.
- Sawmill Monday Meatloaf: no price visible.
- Sawmill Tuesday Chicken and Pastry: no price visible.
- Sawmill 222 breakfast entries: no price visible.
- Sawmill Rose Sangria rows: alcohol-only.

## Gates

Every added deal-intake row remains:

- `confidence_status=verified`
- `workflow_status=needs_review`
- `mvp_publish_eligible=false`
- `public_copy_approved=false`
- `review_decision` blank
- `conflict_detected=false`

Every date-specific candidate has `expires_on` set to the special date plus one day and `next_check_due=2026-06-05`.

Review blockers preserved:

- Might As Well alcohol/event copy suppression.
- Might As Well odd or late displayed time windows.
- Sawmill Monkey Junction boundary review.
- Sawmill alcohol-only rows excluded from food copy.
