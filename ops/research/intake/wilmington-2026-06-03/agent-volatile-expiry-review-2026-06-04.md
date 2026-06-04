# Volatile Expiry Review - 2026-06-04

Scope: `might-as-well-wilmington` and `sawmill-restaurant` only.

This is an agent handoff note, not evidence, approval, or publication. AI output is not evidence. No public fixture CSVs were edited. No shared CSVs were edited.

Current date context: Thursday, June 4, 2026, America/New_York.

## Files Reviewed

- `ops/research/intake/wilmington-2026-06-03/deal-intake.csv`
- `ops/research/intake/wilmington-2026-06-03/source-captures.csv`
- `ops/research/intake/wilmington-2026-06-03/review-tasks.csv`
- `ops/research/intake/wilmington-2026-06-03/source-inventory.csv`
- `ops/research/intake/wilmington-2026-06-03/restaurant-source-list.csv`
- `ops/research/intake/wilmington-2026-06-03/agent-draft-volatile-csv-2026-06-04.md`

## Official Sources Rechecked

- Might As Well official specials page: `https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials`
- Sawmill Restaurant official daily specials page: `https://thesawmillrestaurant.com/daily-specials/`

Short source quotes, kept under 25 words per source:

- Might As Well: "Thursday Game Night! $5.99 cheese burgers"
- Sawmill: "Daily Special: Pasta Night"

## Current Structured Rows

The shared `deal-intake.csv` currently contains the conservative subset only:

| candidate_id | restaurant_id | active date | expires_on | current status | urgency |
|---|---|---:|---:|---|---|
| `cand-wilmington-might-as-well-cheeseburgers-2026-06-04` | `might-as-well-wilmington` | 2026-06-04 | 2026-06-05 | `confidence_status=verified`; `workflow_status=needs_review`; `mvp_publish_eligible=false` | Urgent same-day review |
| `cand-wilmington-sawmill-pasta-night-2026-06-04` | `sawmill-restaurant` | 2026-06-04 | 2026-06-05 | `confidence_status=verified`; `workflow_status=needs_review`; `mvp_publish_eligible=false` | Urgent same-day review |

Both rows are date-windowed June 4 candidates. Per `docs/anti-staleness-policy.md`, explicit date-specific candidates expire on the date plus one day, and same-day wording should expire quickly unless confirmed again.

## Expiry Assessment

### Already Expiring / Urgent

- `cand-wilmington-might-as-well-cheeseburgers-2026-06-04` is same-day active on June 4 and should be reviewed immediately if anyone wants to preserve it as an internal reviewed candidate. If not reviewed with durable capture by June 5, leave it unpromoted and move it toward `expired` or `needs_recheck` depending on whether a fresh official page still supports it.
- `cand-wilmington-sawmill-pasta-night-2026-06-04` is also same-day active on June 4 and should be reviewed immediately. It has extra blockers: missing price/details plus Monkey Junction boundary-sensitive handling.

### Conservative Subset Check

The current shared `deal-intake.csv` subset is sensible. It keeps only one high-signal June 4 row per restaurant instead of importing all volatile future candidates from the draft note.

- Might As Well cheeseburgers are the better June 4 test row because the official page shows a food item, price, and time window. Alcohol-adjacent copy remains suppressed.
- Sawmill Pasta Night is reasonable as a test row because it is official and date-specific, but it is weaker than the Might As Well row because price and item details are missing.
- The larger draft packet should remain background until durable capture and review capacity exist. Bulk-importing the full June 5-9 volatile schedule would create many rows that can stale before review.

## Future Rows From Draft Packet

The draft note includes additional June 5-9 candidates, but they are not in the shared CSV. Suggested handling:

| date | restaurant | candidate family | later status if not reviewed by date |
|---:|---|---|---|
| 2026-06-05 | Might As Well | Friday wings | Mark `needs_recheck` on June 5 before use; mark `expired` on June 6 without fresh evidence. |
| 2026-06-05 | Sawmill | Friday breakfast / dinner specials | Mark `needs_recheck` on June 5 before use; mark `expired` on June 6 without fresh evidence. |
| 2026-06-06 | Sawmill | coffee cake / avocado toast | Mark `needs_recheck` on June 6 before use; mark `expired` on June 7 without fresh evidence. |
| 2026-06-07 | Might As Well and Sawmill | Sunday food specials | Mark `needs_recheck` on June 7 before use; mark `expired` on June 8 without fresh evidence. |
| 2026-06-08 | Might As Well and Sawmill | Monday specials | Mark `needs_recheck` on June 8 before use; mark `expired` on June 9 without fresh evidence. |
| 2026-06-09 | Might As Well and Sawmill | Tuesday specials | Mark `needs_recheck` on June 9 before use; mark `expired` on June 10 without fresh evidence. |

## Recommended Next Review Order

1. `cand-wilmington-might-as-well-cheeseburgers-2026-06-04`
   - Best immediate candidate. Review food-only public copy, suppress alcohol language, capture durable evidence, and either approve internally or let expire.
2. `cand-wilmington-sawmill-pasta-night-2026-06-04`
   - Review only if there is capacity today. Confirm price/item details and apply Monkey Junction boundary review before any approval.
3. Might As Well Friday wings from the draft packet
   - Recheck on June 5 before any row import. The page has useful food/price signal but odd time handling.
4. Sawmill June 5 rows from the draft packet
   - Recheck on June 5 before import. Price gaps and boundary review make these slower than Might As Well.
5. Later June 6-9 draft rows
   - Keep as leads until the morning of their active date. Create or update rows only after same-day official recheck and durable capture.

## Specific Status Recommendations

- Keep both existing `deal-intake.csv` rows at `workflow_status=needs_review` on June 4.
- If no durable capture/review happens by June 5:
  - mark both existing candidates `workflow_status=expired` if the June 4 date has passed and no fresh official recurrence supports them.
  - use `workflow_status=needs_recheck` only if a reviewer intends to re-open from a fresh official page before deciding.
- Keep `mvp_publish_eligible=false` and `public_copy_approved=false` unless a human reviewer completes all gates.
- Do not promote Sawmill without Monkey Junction boundary approval, freshness metadata, public copy approval, and the full public fixture filter.

## Edits Made

Created this Markdown handoff only:

- `ops/research/intake/wilmington-2026-06-03/agent-volatile-expiry-review-2026-06-04.md`

No CSV or public fixture edits were made.
