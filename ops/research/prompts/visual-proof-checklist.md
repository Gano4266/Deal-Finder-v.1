# Visual Proof Checklist Prompt

Review the candidate evidence for visual-proof readiness. Do not invent missing screenshots, archive paths, source quotes, capture dates, IDs, or confirmations. AI output is not a source.

A candidate can move toward publication only when supported by an official website, official menu, PDF/menu file, official ordering page, official restaurant social post, or direct restaurant confirmation. Blogs, Yelp, Google reviews, Tripadvisor, Reddit, comments, search snippets, and user notes are discovery only.

For each candidate, inspect and report these fields:

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
- `visual_proof_status`
- `missing_visual_proof_fields`

Check that volatile, visual, social, PDF, story, email, or screenshot-only evidence has a durable `screenshot_path` or `archive_url_or_path` when needed. Check that `source_quote` is copied from the source, `evidence_captured_at` is present, and the row can point to `source_capture_id` or `direct_confirmation_id`.

Use only canonical statuses. Keep discovery-only inputs at `workflow_status=lead` or `workflow_status=needs_review`; do not promote them.
