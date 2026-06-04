# Post-Research Audit Prompt

Audit the research intake below before it is mapped into repository templates. Do not invent missing facts or upgrade any candidate based on inference. AI output is not a source.

Check every candidate against these rules:

- Publishable evidence requires an official website, official menu, PDF/menu file, official ordering page, official restaurant social post, or direct restaurant confirmation.
- Blogs, Yelp, Google reviews, Tripadvisor, Reddit, comments, search snippets, user notes, and uncited summaries are discovery only.
- No official evidence or direct confirmation means no publish.
- No durable evidence pointer, screenshot/archive path when needed, or direct confirmation means no publish.
- No human approval means no public deal.
- Do not create new `source_tier`, `confidence_status`, or `workflow_status` values.

For each row, return an audit table with:

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
- `audit_result`
- `required_next_action`

Use `workflow_status=lead` for discovery-only items and `workflow_status=needs_review` for source-backed or ambiguous items that need a human decision. Do not emit `approved` or `approved_with_uncertainty` from research intake; identify rows as ready for human review instead.
