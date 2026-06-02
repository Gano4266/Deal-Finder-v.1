# Data Model

This is a conceptual model, not a database migration.

## Statuses

`confidence_status` describes evidence strength:

- `verified`
- `probable`
- `unverified`

`workflow_status` describes operational state:

- `lead`
- `needs_review`
- `approved`
- `approved_with_uncertainty`
- `rejected`
- `needs_recheck`
- `expired`
- `superseded`

`needs_review` must never be used as a confidence status. It means a human decision is required. `needs_recheck` means evidence freshness or source verification is required.

`review_decision`, `decision_reason`, `reviewed_by`, and `reviewed_at` are review fields, not statuses.

Terminal states (`rejected`, `expired`, `superseded`) should not be reactivated directly. Newer evidence should create a new candidate or superseding deal.

## Simple Deal Statuses

Use these simple labels for seed backlogs, prototype summaries, and user-facing state. They are derived from the canonical fields above and do not replace `confidence_status` or `workflow_status`.

- `candidate`: found from a weak or unreviewed source; usually maps to `workflow_status=lead`.
- `needs_review`: needs human/source verification; maps to `workflow_status=needs_review` or `workflow_status=needs_recheck`.
- `verified`: source-backed by an acceptable source or direct confirmation, but not public yet unless publish gates are also satisfied; requires `confidence_status=verified`.
- `published`: eligible for the user-facing tonight view after publish gates are satisfied.
- `expired`: stale, outdated, or date-limited; maps to `workflow_status=expired`.
- `rejected`: inaccurate, unverifiable, duplicate, or not a food deal; maps to `workflow_status=rejected`.

Do not store `published` as a shortcut for approval. A published deal is an approved deal with source evidence, review decision, and `next_check_due` or `expires_on`.

## Restaurant

Represents a Wilmington, NC restaurant being tracked.

Required fields:

- restaurant ID
- name
- city and state
- address or location note
- neighborhood
- status
- primary source links

## Source

Represents a place where deal information may be found.

Required fields:

- source URL or direct-confirmation note
- source tier
- source owner
- restaurant ID
- source type
- crawl or review priority
- last checked date
- next check due

Relationship: one restaurant can have many sources. A source can have many source captures and source checks.

## Source Capture

Represents evidence collected from a source at a point in time.

Required fields:

- source URL
- captured timestamp
- extracted text or confirmation note
- evidence type
- content hash for the normalized captured text
- screenshot/archive path when available
- durable evidence artifact hash in `metadata_json.evidence_file_sha256` for publishable local archives

Relationship: a source capture belongs to one source and may support many deal candidates, review tasks, or source checks.

## Deal Candidate

Represents a possible deal found by manual review, source capture, user tip, or AI extraction.

Required fields:

- restaurant ID
- deal title and description
- source tier and URL
- evidence capture date
- proposed days/times
- restrictions
- confidence status
- workflow status

Relationship: a deal candidate points to source evidence through `source_capture_id` or `direct_confirmation_id`.

## Deal

Represents a reviewed public or internal deal record.

Required fields:

- restaurant ID
- title and description
- deal type
- days and times
- price or discount if visible in source
- restrictions
- source reference
- last seen active
- expiration or next recheck date
- workflow status
- review task
- reviewer decision

Relationship: a deal should point to the review task and evidence that justified publication.

## Review Task

Represents human work needed before publication or continued display.

Required fields:

- related deal or candidate
- review reason
- assigned reviewer
- status
- notes
- next action date

Relationship: a review task should reference a deal candidate, deal, source capture, or direct confirmation.

## Source Check

Represents a manual or automated recheck of a source.

Required fields:

- checked at
- checked by
- source URL
- result
- confidence after check
- next check due

Relationship: a source check should reference the source checked, the before/after source capture when available, affected deals, and any review task opened.

## Audit Event

Represents a durable record of important changes.

Examples:

- candidate approved
- deal expired
- source failed
- restaurant marked closed
- user report received

Relationship: audit events should reference the affected entity and evidence or review task whenever possible.
