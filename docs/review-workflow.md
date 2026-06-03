# Review Workflow

Use [data-model.md](data-model.md) as the canonical reference for status fields.

## Workflow Statuses

- `lead`: possible deal; not publishable.
- `needs_review`: evidence or extraction needs human review.
- `approved`: source-backed and publishable.
- `approved_with_uncertainty`: publishable with cautious wording.
- `rejected`: not usable.
- `needs_recheck`: stale or reported.
- `expired`: no longer active.
- `superseded`: replaced by newer evidence.

## Confidence Statuses

- `verified`: current official or directly confirmed source.
- `probable`: credible but incomplete or older supporting evidence.
- `unverified`: missing date, unclear ownership/location, user-submitted only, or stale source.

## Intake

Leads can come from official websites, menus, social posts, user tips, newsletters, direct confirmation, or future scanner output. Each intake record must include source information before it can leave `lead`.

Seed files may use simple deal labels such as `candidate`, `needs_review`, `verified`, `published`, `expired`, and `rejected` for operator readability. Treat those as derived labels only; [data-model.md](data-model.md) remains the canonical status reference.

## AI Extraction

AI may extract:

- deal title and description
- price if explicitly visible
- days and times
- restrictions
- source quote or evidence summary
- uncertainty flags

AI must not infer prices, schedules, recurring availability, active status from old posts, or "best deal" labels.

## Human Review

Reviewer actions:

- approve
- approve with uncertainty
- reject
- edit structured fields
- mark as needs call/verification
- set expiration or next recheck date

Every approval or rejection must record:

- `review_task_id`
- `review_decision`
- `decision_reason`
- `reviewed_by`
- `reviewed_at`
- supporting `source_capture_id` or `direct_confirmation_id`
- `next_check_due` or `expires_on`

High-risk records always require review:

- user-submitted deals
- social-only deals
- screenshot/image/PDF-only evidence
- price-specific claims
- free/BOGO claims
- ambiguous schedule or restrictions
- conflicting sources

## Takedown And Corrections

Restaurant corrections should be handled quickly. If a credible correction says a public deal is wrong, lower confidence and route to review until resolved.

The static `/report` route is an in-app intake surface that sends review leads through `/api/reports` to HubSpot when configured. When a user or restaurant correction arrives through HubSpot, webhook fallback, email, or another manual channel, create or update a review task with the report source, affected deal or restaurant, reason, priority, next action, and decision.

`approved_with_uncertainty` is public only when evidence is still publishable, and it should not publish with `confidence_status=unverified`. Expired deals are hidden unless newer evidence extends them. Source failure, conflict, credible public report, or restaurant correction routes affected public deals to `needs_review` or `needs_recheck`.
