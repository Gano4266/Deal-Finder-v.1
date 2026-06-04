# Deal Validation Policy

No public deal can be published without source evidence.

Use [data-model.md](data-model.md) as the canonical reference for status fields.

## Required Evidence

- Restaurant name and Wilmington, NC location.
- Deal title and details.
- Source URL or direct-confirmation note.
- Durable evidence reference: `source_capture_id` or `direct_confirmation_id`.
- Source tier.
- Evidence capture date.
- Applicable day/date and time window when known.
- Restrictions.
- Confidence status.
- Workflow status.
- Review task, reviewer, decision, and decision reason.
- Recheck or expiration date.

## Confidence Statuses

- `verified`: current official or directly confirmed source.
- `probable`: credible but incomplete or older supporting evidence.
- `unverified`: missing date, unclear ownership/location, user-submitted only, or stale source.

## Workflow Statuses

- `lead`: possible deal; not publishable.
- `needs_review`: evidence or extraction needs human review.
- `approved`: source-backed and publishable.
- `approved_with_uncertainty`: publishable with cautious wording.
- `rejected`: not usable.
- `needs_recheck`: stale or reported.
- `expired`: no longer active.
- `superseded`: replaced by newer evidence.

For seed backlogs and prototype summaries, the simple labels `candidate`, `needs_review`, `verified`, `published`, `expired`, and `rejected` may be used as derived states. See [data-model.md](data-model.md) for the mapping. These labels do not replace publish gates or canonical status fields.

## Validation Gates

### Source Gate

Evidence exists, source tier is assigned, and the source is readable by a reviewer.

### Location Gate

The deal applies to a Wilmington, NC restaurant. Multi-location restaurants require Wilmington-specific evidence.

### Completeness Gate

The record includes enough deal detail, restrictions, and scheduling information to avoid misleading users.

### Freshness Gate

The source is inside the allowed freshness window and the deal has not passed an explicit end date.

### Conflict Gate

No newer official source contradicts the deal. If sources disagree, route to review.

### Copy Gate

Public copy must not infer savings, omit restrictions, or use "best," "guaranteed," or "always" unless the source supports that language.

### Publish Gate

Reviewer approval is present and a recheck or expiration date is assigned. The approved record must include `source_id`, `source_capture_id` or `direct_confirmation_id`, `source_tier`, `evidence_captured_at`, `review_task_id`, `review_decision`, `reviewed_by`, `reviewed_at`, and `next_check_due` or `expires_on`.

`approved_with_uncertainty` can publish only when evidence is still publishable, and it should not publish with `confidence_status=unverified`. Expired deals are hidden unless newer evidence extends them.

Source failure, conflict, credible public report, or restaurant correction routes affected public deals to `needs_review` or `needs_recheck`.

## Rejection Reasons

- Missing source evidence.
- Source is too old.
- Restaurant location is unclear or out of scope.
- Deal is a standard menu item, routine menu availability, or low-value daily item rather than a meaningful special.
- Price, time, or restrictions are unsupported.
- Source contradicts a newer official record.
- Restaurant reports the deal is wrong.
