# Wilmington On Our Radar Expiry/Recheck Playbook

Created: 2026-06-04
Current operating date: 2026-06-04 America/New_York
Scope: volatile candidates in `ops/research/intake/wilmington-2026-06-03`, especially:

| candidate_id | restaurant_id | candidate | active date | expires_on | current workflow |
|---|---|---|---|---|---|
| `cand-wilmington-might-as-well-cheeseburgers-2026-06-04` | `might-as-well-wilmington` | Thursday cheeseburgers | 2026-06-04 | 2026-06-05 | `needs_review` |
| `cand-wilmington-sawmill-pasta-night-2026-06-04` | `sawmill-restaurant` | Thursday Pasta Night | 2026-06-04 | 2026-06-05 | `needs_review` |

This is a playbook only. Do not apply expiry on 2026-06-04. Do not edit public fixture CSVs, approve/promote deals, or treat this note as evidence.

## Policy Anchors

- AI output is never evidence.
- `expires_on` is the public-hide boundary; `next_check_due` is the operational review boundary.
- If both dates are present, review the earlier date first.
- Expired deals must not appear in the public feed.
- Overdue rechecks should downgrade to `needs_recheck`.
- Terminal states such as `expired` should not be reactivated directly. Newer evidence should create a new candidate or superseding deal.
- Monkey Junction candidates require boundary-sensitive review before any public publication.

## June 4 Handling

Leave both volatile rows as `workflow_status=needs_review` on 2026-06-04 if:

- The row is still within the active date or before `expires_on=2026-06-05`.
- No human reviewer has made a decision yet.
- The row is still a live review opportunity for same-day internal evaluation.
- Publication gates remain closed: `mvp_publish_eligible=false`, `public_copy_approved=false`, and blank `review_decision`.

Do not set `expired` or `needs_recheck` early on 2026-06-04 just because review is incomplete.

## June 5 Or Later Sweep

Run this sweep on or after 2026-06-05 America/New_York.

### Set `workflow_status=expired`

Use `expired` when the original date-windowed offer is no longer active and there is no fresh acceptable evidence extending it.

Apply this to a candidate when any of these are true:

- Current date is after the candidate `end_date` and at or after `expires_on`, and no same-day reviewer approval happened before expiry.
- Official source no longer lists the June 4 offer.
- Official source lists newer specials instead of the June 4 offer.
- The offer was date-specific to June 4 and there is no direct confirmation that it still applies.
- The source is reachable, but the exact candidate terms are no longer visible.

For Might As Well cheeseburgers, prefer `expired` after 2026-06-05 unless a fresh official source or direct confirmation supports a new/current cheeseburger special.

For Sawmill Pasta Night, prefer `expired` after 2026-06-05 if the June 4 Pasta Night is no longer present or if price/item details remain unavailable.

### Set `workflow_status=needs_recheck`

Use `needs_recheck` when the candidate should stay in the operator queue because a fresh check could plausibly resolve it, but the existing evidence is not enough for review or publication.

Apply this when any of these are true:

- The official page is unreachable, blocked, or materially changed, so the original evidence cannot be confirmed.
- The official source still suggests a similar recurring or rolling special, but the exact active date, price, item, or time window is unclear.
- A newer official page appears to support a similar current deal, but it should be captured as new evidence before review.
- The candidate has unresolved required fields and the reviewer wants a direct-confirmation follow-up instead of terminal expiry.
- A human reviewer requests a source recheck rather than rejection or expiry.

For Might As Well cheeseburgers, use `needs_recheck` only if the official page still suggests an active/current cheeseburger special but the date or terms changed and need a new capture.

For Sawmill Pasta Night, use `needs_recheck` if the official source still advertises Pasta Night or another current pasta special but price, exact item, or recurrence remains unclear.

### Leave `workflow_status=needs_review`

Leave `needs_review` only when a human approval decision is still realistically pending on timely evidence.

This is appropriate when:

- The sweep is still on 2026-06-04 before expiry.
- A human reviewer captured acceptable same-day evidence before expiry and is actively deciding the row.
- Direct confirmation was obtained before expiry and recorded in the correct evidence/direct-confirmation fields, but final review fields are intentionally still blank.
- The row has not passed `expires_on`.

Do not leave `needs_review` indefinitely after `expires_on=2026-06-05` without a documented reason in `validation_notes` and an open review task explaining why the candidate is still decision-ready.

## Fields To Update Later

If applying `expired` or `needs_recheck`, update only ops intake files in `ops/research/intake/wilmington-2026-06-03`. Do not edit `fixtures/prototype/*.csv`.

In `deal-intake.csv`, update the affected candidate row:

- `workflow_status`: set to `expired` or `needs_recheck`.
- `mvp_publish_eligible`: keep `false`.
- `public_copy_approved`: keep `false`.
- `review_decision`: leave blank unless a human reviewer has explicitly decided.
- `decision_reason`: leave blank unless paired with a human decision; otherwise use `validation_notes`.
- `reviewed_by`, `reviewed_at`: leave blank unless a human reviewer made a decision.
- `last_seen_active`: do not advance unless the source still shows the exact candidate as active.
- `last_verified_at`: set only if a reviewer or direct confirmation actually verified the candidate terms.
- `next_check_due`: for `needs_recheck`, set the next practical recheck date. For urgent volatile rows, use the same day as the sweep or the next business day.
- `expires_on`: preserve the original expiry unless fresh evidence creates a new candidate or superseding row.
- `hidden_at`: optional for ops-only rows, but if used for `expired`, set to the sweep timestamp.
- `validation_notes`: summarize why the row expired or needs recheck, including the sweep date and source result.
- `uncertainty_flags`: preserve existing flags; append a semicolon-delimited flag only if it maps to existing vocabulary such as `expired_date_window`, `needs_direct_confirmation`, or `source_changed`.
- `conflict_detected`: keep existing value unless the recheck finds a real source conflict.

In `review-tasks.csv`, update the linked task:

- `status`: keep `open` for `needs_recheck`; set to a closed/resolved status only if the existing workflow supports it and the row is truly terminal.
- `decision`: leave blank unless a human reviewer made a decision.
- `decision_reason`, `decided_at`, `decided_by`: leave blank unless paired with a human decision.
- `next_action`: for `expired`, state that the original date-windowed candidate expired and newer evidence must create a new candidate. For `needs_recheck`, state the exact source or direct-confirmation step needed.
- `next_action_due`: for `needs_recheck`, set the next recheck date. For `expired`, leave blank or set to the sweep date only if the task remains open for cleanup.
- `public_copy_approval_status`: keep `not_started` or `pending`; do not mark approved.
- `resolution_notes`: summarize the sweep outcome and whether a new candidate is required.

In `source-captures.csv`, do not rewrite prior evidence. Add a new capture row only if a fresh source check creates a new durable artifact. If the source is checked but no artifact is captured, keep the result in `review-tasks.csv` notes or create a proper source-check/audit row if the workflow requires it.

If adding `audit-events.csv` later, use it only to record the operator status change. The audit event is not evidence for the deal terms.

## Candidate-Specific Calls

### Might As Well Cheeseburgers

Current strengths:

- Official source.
- Food-only candidate can suppress alcohol-adjacent copy.
- Price and time window were captured in normalized text.

After 2026-06-05:

- Set `expired` if the June 4 cheeseburger row is gone or replaced.
- Set `needs_recheck` if the official page still indicates a current cheeseburger special but terms/date changed.
- Leave `needs_review` only if a human reviewer is deciding timely evidence captured before expiry.

### Sawmill Pasta Night

Current strengths:

- Official source.
- Date-specific Pasta Night title and time window were captured in normalized text.

Current blockers:

- Missing price.
- Missing exact dish details.
- Monkey Junction boundary-sensitive handling required before any public path.

After 2026-06-05:

- Set `expired` if there is no fresh official/direct-confirmed Pasta Night evidence.
- Set `needs_recheck` if the page still suggests a current Pasta Night or similar special but price/details still need confirmation.
- Do not approve from this row without direct confirmation or reviewer acceptance of the missing price/details and boundary-sensitive context.

## Validation Commands

Run from repo root:

```sh
npm run research:validate -- ops/research/intake/wilmington-2026-06-03
```

If any app-facing fixture or shared data file is changed later, also run:

```sh
cd app
npm run validate:data
npm run lint
npm run build
```

For this playbook-only task, no CSV status updates are expected.
