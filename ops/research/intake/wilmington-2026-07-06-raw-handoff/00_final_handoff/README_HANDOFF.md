# Forkcast / Deal Finder Developer Handoff — Greater Wilmington Coverage

Generated: 2026-07-06

## Purpose

This package is for the main developers / Codex / Claude workers. It summarizes the corrected state of the Greater Wilmington Forkcast restaurant/deal coverage work after the process was corrected from row-based batching to distinct-restaurant breadth batching.

## Critical process correction

Do **not** continue processing the Source_Capture_Queue as “15 rows at a time.”

That caused item-rich restaurants to dominate the work. The corrected rule is:

> One breadth batch = 15 distinct restaurants/concepts. Make one restaurant-level decision first. Item expansion happens only after a restaurant has strong official source-backed deal terms.

## What this package includes

- `restaurant_breadth_batch02.csv`
- `deal_signals_batch02.csv`
- `cumulative_breadth_review.csv`
- `hardening_review_all_workstreams.csv`
- `artifact_manifest.csv`
- `HANDOFF_SUMMARY.json`
- `restaurant_breadth_batch02_2026-07-06.xlsx`
- `developer_handoff_forkcast_coverage_2026-07-06.xlsx`

## Batch 02 headline

Batch 02 covered 15 distinct restaurants:
- RUMCOW. — C_manual_social_needed
- On Thyme Restaurant — C_manual_social_needed
- Fish House Grill — D_checked_no_offer_found
- Bluewater Waterfront Grill — D_checked_no_offer_found
- Oceanic at Crystal Pier — D_checked_no_offer_found
- Vicious Biscuit — Wilmington — B_source_backed_needs_capture
- Brasserie du Soleil — D_checked_no_offer_found
- Little Dipper Fondue — C_experience_lead_not_deal
- The Eagles Dare — C_event_food_lead
- Hieronymus Seafood Restaurant & Oyster Bar — C_source_discovery_needed
- Paddy's Hollow Restaurant & Pub — D_checked_no_offer_found
- The German Cafe — E_suppressed_drink_only
- Islands Fresh Mex Grill — A_source_backed_candidate_after_review
- Blueberry's Grill — Wilmington — D_checked_no_offer_found
- Drift Coffee & Kitchen — C_loyalty_or_item_lead_not_deal

Strong item-expansion candidates from Batch 02:
- Islands Fresh Mex Grill — daily taco specials before/after 5 PM.
- Vicious Biscuit — rewards/free biscuit Monday-Friday dine-in claim; requires rewards/copy capture.

Most other rows are coverage-only, manual/social-needed, or suppressed.

## Developer next action

1. Continue with Restaurant Breadth Batch 03: 15 new distinct restaurants.
2. Item-expand only the winners: Islands Fresh Mex Grill, Vicious Biscuit, City Barbeque, Moe's BBQ.
3. Keep P1 source groups for screenshot/archive capture.
4. Do not call local text cards screenshot evidence.
5. Keep happy hour first-class and suppress alcohol-only rows.

## Publication boundary

Nothing in this package is public-ready. Public fixture promotion still requires source capture, durable screenshot/archive or direct confirmation, human review, freshness fields, public copy approval, and native Deal Finder readiness.
