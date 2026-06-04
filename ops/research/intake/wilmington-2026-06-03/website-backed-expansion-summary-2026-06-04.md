# Website-Backed Expansion Summary - 2026-06-04

Scope: agent-assisted expansion of Wilmington review candidates using official restaurant websites or official-linked website evidence. No public fixture CSVs were edited, no rows were approved, and all publication gates remain closed.

## Added Internal Candidates

- Fortunate Glass: Spicy Garden Flatbread weekly food special.
- Michaelangelo's Pizza - Monkey Junction:
  - 18-inch 1-topping pizza.
  - 16-inch 1-topping pizza plus cheesy bread.
  - Two 14-inch 1-topping pizzas.
  - Two 18-inch 1-topping pizzas.
- Might As Well Bar & Grill:
  - June 5 wings.
  - June 7 Sunday buffet.
  - June 7 large pizza discount.
  - June 8 appetizer menu.
  - June 9 cheese quesadilla.
- Sawmill Restaurant:
  - June 6 coffee cake combo.
  - June 6 avocado toast.
  - June 7 avocado toast.
  - June 7 coffee cake combo.

## Rows Intentionally Not Added

- Cornelia's Tuesday hibachi, Wednesday pasta, and Saturday prix-fixe signals: official page has category signals but not enough price/detail support.
- Sawmill rows without visible price: skipped unless already in the original urgent review set.
- New restaurants outside the current intake set: scan found no official website-backed deal with enough exact fields for intake.

## Remaining Blockers

- Michaelangelo's rows remain image/OCR, limited-time, and Monkey Junction boundary review items.
- Might As Well and Sawmill date-window rows require short expiry handling.
- C-Street remains blocked by address/ZIP conflict.
- Roko, Castle Street Kitchen, YoSake, and Tidewater still need direct confirmation or stronger official evidence.

## Validation Notes

- Service mode for three Michaelangelo bundle rows is set to `unknown`, with `service_mode_unknown` retained in `uncertainty_flags`.
- All added candidates remain `workflow_status=needs_review`, `mvp_publish_eligible=false`, `public_copy_approved=false`, and unapproved.
