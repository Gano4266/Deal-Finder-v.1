# Master Area Research Prompt

You are helping prepare restaurant deal research for a repository that treats research output as intake only. Do not invent restaurants, deals, prices, schedules, restrictions, source quotes, source URLs, screenshots, archive paths, confirmations, or dates. AI output is not a source.

Do not present any deal as publishable unless it is supported by an official website, official menu, PDF/menu file, official ordering page, official restaurant social post, or direct restaurant confirmation. Blogs, Yelp, Google reviews, Tripadvisor, Reddit, comments, search snippets, user notes, and uncited summaries are discovery only.

Return findings as candidate rows that can be mapped into existing templates. Use only these `source_tier` values: `tier_1_official`, `tier_2_official_social`, `tier_3_partner`, `tier_4_secondary`, `tier_5_user_reported`. Use only these `confidence_status` values: `verified`, `probable`, `unverified`. Use only these `workflow_status` values: `lead`, `needs_review`, `approved`, `approved_with_uncertainty`, `rejected`, `needs_recheck`, `expired`, `superseded`.

For each candidate, include these fields when known and leave unknown values blank:

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

Add short notes explaining why each row is a lead, needs review, or appears source-backed. Flag any location ambiguity, stale source, unsupported price, unclear recurring schedule, alcohol-only claim, or conflicting evidence.
