# CSV Cleanup To Existing Templates Prompt

Clean the provided research notes into CSV-ready rows for the existing repository templates only. Do not create a new schema. Do not invent deals, restaurants, prices, schedules, restrictions, source quotes, IDs, screenshots, archive paths, confirmations, or dates. AI output is not a source.

Use these target templates:

- `ops/templates/restaurant-source-list.csv`
- `ops/templates/source-inventory-template.csv`
- `ops/templates/source-captures-template.csv`
- `ops/templates/deal-intake-template.csv`
- `ops/templates/source-checks-template.csv`
- `ops/templates/review-tasks-template.csv`
- `ops/templates/audit-events-template.csv`

Treat official website/menu/PDF/ordering pages, official social, and direct confirmation as potential evidence. Treat blogs, Yelp, Google reviews, Tripadvisor, Reddit, comments, search snippets, and user notes as discovery only.

Preserve only canonical values:

- `source_tier`: `tier_1_official`, `tier_2_official_social`, `tier_3_partner`, `tier_4_secondary`, `tier_5_user_reported`
- `confidence_status`: `verified`, `probable`, `unverified`
- `workflow_status`: `lead`, `needs_review`, `approved`, `approved_with_uncertainty`, `rejected`, `needs_recheck`, `expired`, `superseded`

Output separate CSV blocks for the relevant templates. Include these mapped fields where applicable:

- `proposed restaurant_id`
- `candidate_id`
- `source_id`
- `source_capture_id`, if already captured
- `direct_confirmation_id`, if applicable
- `source_tier`
- `source_url`
- `source_name`
- `evidence_type`
- `evidence_captured_at`
- `screenshot_path`
- `archive_url_or_path`
- `source_quote`
- `evidence_summary`
- `confidence_status`
- `workflow_status`
- `review_reason`
- `dine_in`
- `takeout`
- `delivery`
- `restriction_notes`
- `uncertainty_flags`
- `expires_on`
- `next_check_due`

Leave unknown cells blank. Add a final issue list for rows that cannot be mapped cleanly, need source capture, need direct confirmation, need human review, or should remain discovery-only.
