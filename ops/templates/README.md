# Ops Template Guide

These templates are the Phase 0.5 operating contract for keeping Wilmington, NC restaurant deals traceable. Sources are evidence. Deals are claims. Published deals are verified claims.

## Template Boundaries

- `restaurant-source-list.csv`: restaurant identity and convenience links.
- `source-inventory-template.csv`: source governance, ownership, cadence, permissions, and source-level risk.
- `source-captures-template.csv`: raw evidence captured from a source.
- `source-checks-template.csv`: recheck history and source verification outcomes.
- `direct-confirmations-template.csv`: human confirmation evidence.
- `deal-intake-template.csv`: claim, public copy, publishability, and evidence pointers.
- `review-tasks-template.csv`: human work, reports/corrections, and decisions.
- `audit-events-template.csv`: durable change log.
- `weekly-audit-summary-template.md`: weekly operating summary.

## Field Requirement Levels

- `required`: must be present before the row can be used for its purpose.
- `conditional`: required only when the condition applies, such as screenshot paths for volatile sources.
- `optional`: helpful context that may be blank.

Leave unknown values blank rather than guessing.

## Field Ownership

Prefer pointers over duplicated facts. Authoritative source metadata belongs in `source-inventory-template.csv`. Raw evidence belongs in `source-captures-template.csv` or `direct-confirmations-template.csv`. Deal intake may duplicate names, URLs, source metadata, or evidence excerpts for operator convenience, but those fields are snapshots, not authoritative records.

Source checks may snapshot source URL, source tier, result, and status fields for audit value. Source inventory remains the authoritative source-governance record.

## Evidence Hashes

Use `content_hash` for the normalized text being asserted by the row, not for the whole source file. For example, a source capture hashes `extracted_text_or_confirmation_note`, while a public deal hashes the reviewed claim/public copy fields.

Use `metadata_json.evidence_file_sha256` in source captures to pin the local evidence artifact bytes. For public prototype rows, `metadata_json` should include `hash_subject`, `evidence_file_sha256`, `evidence_file_path`, and `official_url`. This keeps the reviewed claim hash separate from the durable evidence-file hash.

Source checks should point `evidence_url_or_path` to the same durable evidence artifact used by the after-capture when the check supports a public deal.

## Date And Time Conventions

- Use ISO dates for dates, for example `2026-06-01`.
- Use ISO timestamps when time matters, for example `2026-06-01T17:30:00-04:00`.
- Interpret operating dates in Wilmington, NC local time.
- Leave unknown dates/times blank.

## Enum Guidance

- `confidence_status`: `verified`, `probable`, `unverified`.
- `workflow_status`: `lead`, `needs_review`, `approved`, `approved_with_uncertainty`, `rejected`, `needs_recheck`, `expired`, `superseded`.
- `source_tier`: `tier_1_official`, `tier_2_official_social`, `tier_3_partner`, `tier_4_secondary`, `tier_5_user_reported`.
- `source_type`: `website`, `menu`, `ordering_page`, `google_business`, `instagram`, `facebook`, `tiktok`, `newsletter`, `direct_confirmation`, `partner_platform`, `secondary_article`, `user_tip`.
- `deal_type`: `happy_hour_food`, `taco_night`, `wing_deal`, `burger_special`, `bogo`, `kids_eat_free`, `brunch`, `lunch_special`, `event_food_special`, `other_food_special`.
- `review_decision`: `approve`, `approve_with_uncertainty`, `reject`, `needs_call`, `needs_source_check`, `expire`, `supersede`.
- `source_status`: `active`, `inactive`, `blocked`, `broken`, `needs_review`.
- `source_priority`: `critical`, `high`, `normal`, `low`.
- `check_type`: `routine`, `expiration`, `report`, `restaurant_correction`, `source_failure`, `conflict`, `manual_confirmation`.
- `result`: `confirmed`, `changed`, `not_found`, `blocked`, `failed`, `contradicted`, `unclear`.
- `capture_status`: `captured`, `partial`, `failed`, `blocked`, `not_applicable`.
- `review task status`: `open`, `in_progress`, `blocked`, `decided`, `closed`.
- `priority`: `critical`, `high`, `normal`, `low`.
- `alcohol_classification`: `food_only`, `mixed_food_alcohol`, `alcohol_only`, `unknown`.
- `location_scope_status`: `wilmington_confirmed`, `nearby_excluded`, `multi_location_unclear`, `out_of_scope`, `unknown`.

Use `true` or `false` for boolean fields such as `automation_allowed`, `permission_required`, `requires_manual_check`, `login_required`, and `volatile_source`.

Priority order is `critical`, then `high`, then `normal`, then `low`. Credible restaurant corrections and safety/publishability blockers should be `critical`; overdue source checks for visible public deals should be at least `high`.

## Reports And Corrections

For Phase 0.5, user reports and restaurant corrections become review task rows. Do not add a separate reports template unless reports become a larger product surface. Review tasks created from reports or corrections should capture report source, reason, affected deal/source, priority, next action, and decision.
