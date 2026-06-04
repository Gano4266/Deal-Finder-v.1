# Agent Review Readiness QA - Wilmington Intake - 2026-06-04

Scope: existing intake files only:

- `deal-intake.csv`
- `source-captures.csv`
- `review-tasks.csv`

No new restaurant research was performed. No public fixture rows were promoted or edited.

## Executive Summary

- Deal intake rows reviewed: 23
- Source capture rows reviewed: 14
- Review task rows reviewed: 27
- Public gate status: all deal rows remain closed
- Intake validator result: passed on 2026-06-04 with 6 file(s), 89 CSV row(s), and 0 warning(s)

All 23 deal rows are internal `needs_review` candidates with `mvp_publish_eligible=false`, `public_copy_approved=false`, blank review decision fields, no `published_at`, and `conflict_detected=false`.

## Highest-Priority Reviewer Queue

### 1. Closest to human approval

These rows have official/source-backed food claims, explicit price or discount, Wilmington-confirmed location, and no missing durable-capture link. They still need human review, public copy approval, and freshness handling before any promotion.

| Priority | Candidate row ID | Review task ID | Source capture ID | Why close | Remaining reviewer action |
|---|---|---|---|---|---|
| 1 | `cand-wilmington-might-as-well-sunday-buffet-2026-06-07` | `rt-wilmington-might-as-well-sunday-buffet-2026-06-07` | `cap-wilmington-might-as-well-future-specials-2026-06-04` | Website-backed, price present, future date window, Wilmington-confirmed, no alcohol blocker on the candidate copy. | Confirm whether the late end time is buffet service or venue hours; approve cautious food-only copy or reject. |
| 2 | `cand-wilmington-might-as-well-large-pizza-discount-2026-06-07` | `rt-wilmington-might-as-well-large-pizza-discount-2026-06-07` | `cap-wilmington-might-as-well-future-specials-2026-06-04` | Website-backed, discount present, future date window, Wilmington-confirmed, no alcohol blocker on the candidate copy. | Confirm whether the late end time applies to the pizza discount; approve cautious food-only copy or reject. |

### 2. Urgent expiry/date-window review

These rows have very short date windows or next-day expiry. They should be reviewed quickly or left to expire.

| Candidate row ID | Review task ID | Date window | Expires | Main blocker |
|---|---|---:|---:|---|
| `cand-wilmington-might-as-well-cheeseburgers-2026-06-04` | `rt-wilmington-might-as-well-cheeseburgers-2026-06-04` | 2026-06-04 | 2026-06-05 | Alcohol-adjacent source copy; volatile same-day candidate. |
| `cand-wilmington-sawmill-pasta-night-2026-06-04` | `rt-wilmington-sawmill-pasta-night-2026-06-04` | 2026-06-04 | 2026-06-05 | Missing price/item detail and Monkey Junction boundary-sensitive location. |
| `cand-wilmington-tidewater-daily-specials-food-2026-06-04` | `rt-wilmington-tidewater-daily-specials-2026-06-04` | 2026-06-04 | 2026-06-05 | Partner-source confidence only, no durable artifact path in source capture, no time/recurrence detail. |
| `cand-wilmington-might-as-well-wings-2026-06-05` | `rt-wilmington-might-as-well-wings-2026-06-05` | 2026-06-05 | 2026-06-06 | Alcohol-adjacent source copy and time-window conflict. |

### 3. Good official evidence, but public copy or completeness blocks approval

| Candidate row ID | Review task ID | Source capture ID | Blockers |
|---|---|---|---|
| `cand-wilmington-cornelias-thu-wings-2026-06-04` | `rt-wilmington-cornelias-thu-wings-2026-06-04` | `cap-wilmington-cornelias-weekly-specials-2026-06-04` | Public-access uncertainty at The Davis Community; alcohol-adjacent weekly-specials framing requires food-only copy. |
| `cand-wilmington-cornelias-thu-smashburger-2026-06-04` | `rt-wilmington-cornelias-thu-smashburger-2026-06-04` | `cap-wilmington-cornelias-weekly-specials-2026-06-04` | Public-access uncertainty at The Davis Community; alcohol-adjacent weekly-specials framing requires food-only copy. |
| `cand-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04` | `rt-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04` | `cap-wilmington-fortunate-glass-weekly-food-pdf-2026-06-04` | Missing day/time window and restrictions; alcohol suppression required because source context is wine-bar weekly-specials PDF. |
| `cand-wilmington-fortunate-glass-spicy-garden-flatbread-2026-06-04` | `rt-wilmington-fortunate-glass-spicy-garden-flatbread-2026-06-04` | `cap-wilmington-fortunate-glass-weekly-food-pdf-2026-06-04` | Missing day/time window and restrictions; alcohol suppression required because source context is wine-bar weekly-specials PDF. |
| `cand-wilmington-might-as-well-appetizer-menu-2026-06-08` | `rt-wilmington-might-as-well-appetizer-menu-2026-06-08` | `cap-wilmington-might-as-well-future-specials-2026-06-04` | Alcohol/event-adjacent source context; reviewer must confirm appetizer-menu scope. |
| `cand-wilmington-might-as-well-cheese-quesadilla-2026-06-09` | `rt-wilmington-might-as-well-cheese-quesadilla-2026-06-09` | `cap-wilmington-might-as-well-future-specials-2026-06-04` | Alcohol-adjacent source context; reviewer must confirm whether late end time applies to food service. |

## Blocked Rows by Reason

### Missing durable artifact path in source capture

These have `source_capture_id` links, but the capture row does not carry a screenshot/archive artifact path. Treat as not ready for approval until durable capture is completed or direct confirmation is recorded.

- `cand-wilmington-tomiko-san-sushi-hour-2026-06-04` / `cap-wilmington-tomiko-san-sushi-hour-2026-06-04`
- `cand-wilmington-el-cerro-mj-lunch-specials-2026-06-04` / `cap-wilmington-el-cerro-mj-lunch-specials-2026-06-04`
- `cand-wilmington-tidewater-daily-specials-food-2026-06-04` / `cap-wilmington-tidewater-toast-daily-specials-2026-06-04`

### Ambiguous service mode

These rows use `service_mode_unknown`; reviewer must verify dine-in/takeout/delivery applicability before approval.

- `cand-wilmington-michaelangelos-mj-16-inch-cheesy-bread-2026-06-04`
- `cand-wilmington-michaelangelos-mj-two-14-inch-1-topping-2026-06-04`
- `cand-wilmington-michaelangelos-mj-two-18-inch-1-topping-2026-06-04`

### Boundary-sensitive location

These rows require Monkey Junction/Wilmington relevance review before any publication.

- `cand-wilmington-el-cerro-mj-lunch-specials-2026-06-04`
- `cand-wilmington-michaelangelos-mj-slices-drink-2026-06-04`
- `cand-wilmington-michaelangelos-mj-18-inch-1-topping-2026-06-04`
- `cand-wilmington-michaelangelos-mj-16-inch-cheesy-bread-2026-06-04`
- `cand-wilmington-michaelangelos-mj-two-14-inch-1-topping-2026-06-04`
- `cand-wilmington-michaelangelos-mj-two-18-inch-1-topping-2026-06-04`
- `cand-wilmington-sawmill-pasta-night-2026-06-04`
- `cand-wilmington-sawmill-coffee-cake-combo-2026-06-06`
- `cand-wilmington-sawmill-avocado-toast-2026-06-06`
- `cand-wilmington-sawmill-avocado-toast-2026-06-07`
- `cand-wilmington-sawmill-coffee-cake-combo-2026-06-07`

### Missing price, time, date, or recurrence detail

- `cand-wilmington-tomiko-san-sushi-hour-2026-06-04`: price and exact food items missing.
- `cand-wilmington-el-cerro-mj-lunch-specials-2026-06-04`: likely regular menu category; deal qualification needs review.
- `cand-wilmington-michaelangelos-mj-slices-drink-2026-06-04`: no day/date; limited-time source has no end date.
- `cand-wilmington-michaelangelos-mj-18-inch-1-topping-2026-06-04`: no day/date; limited-time source has no end date.
- `cand-wilmington-michaelangelos-mj-16-inch-cheesy-bread-2026-06-04`: no day/date; limited-time source has no end date.
- `cand-wilmington-michaelangelos-mj-two-14-inch-1-topping-2026-06-04`: no day/date; limited-time source has no end date.
- `cand-wilmington-michaelangelos-mj-two-18-inch-1-topping-2026-06-04`: no day/date; limited-time source has no end date.
- `cand-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04`: no weekday/time window or restrictions found in captured PDF text.
- `cand-wilmington-fortunate-glass-spicy-garden-flatbread-2026-06-04`: no weekday/time window or restrictions found in captured PDF text.
- `cand-wilmington-tidewater-daily-specials-food-2026-06-04`: no time window, recurrence, day applicability, or restrictions visible in notes.

### Alcohol-adjacent or mixed-source copy

These rows may still be viable as food-only candidates, but public copy must suppress alcohol/event claims and should be approved by a reviewer.

- `cand-wilmington-cornelias-thu-wings-2026-06-04`
- `cand-wilmington-cornelias-thu-smashburger-2026-06-04`
- `cand-wilmington-tomiko-san-sushi-hour-2026-06-04`
- `cand-wilmington-might-as-well-cheeseburgers-2026-06-04`
- `cand-wilmington-might-as-well-wings-2026-06-05`
- `cand-wilmington-might-as-well-appetizer-menu-2026-06-08`
- `cand-wilmington-might-as-well-cheese-quesadilla-2026-06-09`
- `cand-wilmington-sawmill-coffee-cake-combo-2026-06-06`
- `cand-wilmington-sawmill-avocado-toast-2026-06-06`
- `cand-wilmington-sawmill-avocado-toast-2026-06-07`
- `cand-wilmington-sawmill-coffee-cake-combo-2026-06-07`
- `cand-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04`
- `cand-wilmington-fortunate-glass-spicy-garden-flatbread-2026-06-04`

### Public-access uncertainty

- `cand-wilmington-cornelias-thu-wings-2026-06-04`
- `cand-wilmington-cornelias-thu-smashburger-2026-06-04`

### Stale or expired date window

As of 2026-06-04, no deal row is already past its `end_date` or `expires_on`. The same-day and near-future rows above need quick review because several expire on 2026-06-05 or 2026-06-06.

## Review Tasks Without Deal Rows

These open review tasks are source-gap/direct-confirmation work and do not currently map to a deal-intake row. Keep them as research/review leads until exact food deal terms are confirmed.

- `rt-wilmington-roko-direct-confirm-house-special-2026-06-04`
- `rt-wilmington-castle-street-kitchen-direct-confirm-tacos-2026-06-04`
- `rt-wilmington-yosake-direct-confirm-current-happy-hour-food-2026-06-04`
- `rt-wilmington-c-street-direct-confirm-address-specials-2026-06-04`

## Public Gate Audit

All 23 deal rows are closed to public publication:

- `workflow_status=needs_review`
- `mvp_publish_eligible=false`
- `public_copy_approved=false`
- `review_decision` blank
- `reviewed_by` blank
- `reviewed_at` blank
- `published_at` blank
- `conflict_detected=false`

No intake row should be promoted to `fixtures/prototype/deals.csv` without human review, approved public copy, freshness metadata, and either valid durable official evidence or direct confirmation.
