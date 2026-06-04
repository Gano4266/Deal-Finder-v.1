# Agent Volatile Official Recheck - 2026-06-04

Scope: official restaurant website pages only.

Operating date: 2026-06-04, America/New_York.

Canonical CSVs edited: no.

Validation command: not run, because `deal-intake.csv`, `source-captures.csv`, and `review-tasks.csv` were not edited.

## Sources Rechecked

| Restaurant | Official source URL | Result |
| --- | --- | --- |
| Might As Well Bar & Grill | https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials | Current/future date-windowed food terms remain visible. Alcohol/event copy must be suppressed. |
| Sawmill Restaurant | https://thesawmillrestaurant.com/daily-specials/ | Current/future date-windowed food terms remain visible. Priced rows are limited to Saturday/Sunday breakfast/brunch items; Monkey Junction boundary review still applies. |
| Rooster & The Crow | https://roosterandthecrow.com/wilmington-downtown-rooster-and-the-crow-happy-hours-specials | Future meatloaf special remains visible, but no price is shown. Hold as lead / needs confirmation. |

## Evidence Created

| Restaurant | Raw official HTML | Raw SHA-256 | Normalized evidence | Normalized SHA-256 |
| --- | --- | --- | --- | --- |
| Might As Well | `ops/research/intake/wilmington-2026-06-03/evidence/might-as-well/official-specials-page-2026-06-04.html` | `65416d2bbc34b46c2ee00d8079386c32a5088f64e5389a5ba8ddd1b2df48ae11` | `ops/research/intake/wilmington-2026-06-03/evidence/might-as-well/official-specials-normalized-2026-06-04.txt` | `53bd689fb48b83aed72893379454379d79b9face0fd5d9d62667911c4ef1730e` |
| Sawmill | `ops/research/intake/wilmington-2026-06-03/evidence/sawmill-restaurant/official-daily-specials-page-2026-06-04.html` | `5d9abb55fc59980dfa3ac70a493ba906b495efff80b919e0651985f02192f158` | `ops/research/intake/wilmington-2026-06-03/evidence/sawmill-restaurant/official-daily-specials-normalized-2026-06-04.txt` | `9aaf44265b5b28d76208c18bda4d9bf7f967c3657a528cd1afb999180af04b0e` |
| Rooster & The Crow | `ops/research/intake/wilmington-2026-06-03/evidence/rooster-and-the-crow/official-specials-page-2026-06-04.html` | `48ae8079cded79126ff948ee19934fb2ae9cbc71651870fd75d1b5bc553a5e0a` | `ops/research/intake/wilmington-2026-06-03/evidence/rooster-and-the-crow/official-specials-normalized-2026-06-04.txt` | `7d81f1648f87e38a56189da3d5eb0d4433cd92eab16f585eef5f6bf3ad1466ca` |

## Food Terms Found

| Restaurant | Date | Food-only term | Price / discount visible | Time visible | Disposition |
| --- | --- | --- | --- | --- | --- |
| Might As Well | Thu 2026-06-04 | Cheese burgers | `$5.99` | 12:00 PM - 02:00 AM | Already represented by `cand-wilmington-might-as-well-cheeseburgers-2026-06-04`; same-day expiry pressure. |
| Might As Well | Fri 2026-06-05 | Wings | `$0.99` | 12:00 AM - 02:00 AM; source also says all day | Already represented by `cand-wilmington-might-as-well-wings-2026-06-05`; time conflict needs review. |
| Might As Well | Sun 2026-06-07 | Sunday buffet | `$15.99` | 12:30 PM - 02:00 AM | Already represented by `cand-wilmington-might-as-well-sunday-buffet-2026-06-07`; confirm service window. |
| Might As Well | Sun 2026-06-07 | Large pizza discount | `$5 off` | 12:30 PM - 02:00 AM | Already represented by `cand-wilmington-might-as-well-large-pizza-discount-2026-06-07`; confirm service window. |
| Might As Well | Mon 2026-06-08 | Appetizer menu | `$5` | 12:00 PM - 02:00 PM | Already represented by `cand-wilmington-might-as-well-appetizer-menu-2026-06-08`; suppress event/alcohol copy. |
| Might As Well | Tue 2026-06-09 | Cheese quesadilla | `$1` | 12:00 PM - 02:00 AM | Already represented by `cand-wilmington-might-as-well-cheese-quesadilla-2026-06-09`; suppress alcohol copy and confirm service window. |
| Sawmill | Sat 2026-06-06 | Coffee and coffee cake combo | `$6` | 10:00 AM - 02:00 PM | Already represented by `cand-wilmington-sawmill-coffee-cake-combo-2026-06-06`; boundary review required. |
| Sawmill | Sat 2026-06-06 | Avocado toast with optional bacon add-on | `$11`; bacon add-on `$2` | 10:00 AM - 02:00 PM | Already represented by `cand-wilmington-sawmill-avocado-toast-2026-06-06`; boundary and add-on wording review required. |
| Sawmill | Sun 2026-06-07 | Avocado toast with optional bacon add-on | `$11`; bacon add-on `$2` | 11:00 AM - 02:00 PM | Already represented by `cand-wilmington-sawmill-avocado-toast-2026-06-07`; boundary and add-on wording review required. |
| Sawmill | Sun 2026-06-07 | Coffee and coffee cake combo | `$6` | 11:00 AM - 02:00 PM | Already represented by `cand-wilmington-sawmill-coffee-cake-combo-2026-06-07`; boundary review required. |
| Rooster & The Crow | Wed 2026-06-10 | Meatloaf with two sides | Not visible | 04:30 PM - 08:30 PM | Hold as lead. Official and future-dated, but missing price; needs direct confirmation or reviewer decision before intake. |

## Suppressed / Not Intake-Ready

| Restaurant | Date | Official term | Reason held |
| --- | --- | --- | --- |
| Sawmill | Thu 2026-06-04 | 2 eggs, 2 bacon, 2 pancakes | Price not visible; current same-day row would expire quickly. |
| Sawmill | Thu 2026-06-04 | Pasta Night | Price and exact dish details not visible; already present as weaker urgent candidate. |
| Sawmill | Fri 2026-06-05 | 2 eggs, 2 bacon, 2 pancakes | Price not visible. |
| Sawmill | Fri 2026-06-05 | Prime Rib, Stew Beef | Price not visible. |
| Sawmill | Mon 2026-06-08 | 2 eggs, 2 bacon, 2 pancakes | Price not visible. |
| Sawmill | Mon 2026-06-08 | Meatloaf | Price not visible. |
| Sawmill | Tue 2026-06-09 | 2 eggs, 2 bacon, 2 pancakes | Price not visible. |
| Sawmill | Tue 2026-06-09 | Chicken & Pastry | Price not visible. |
| Sawmill | Wed 2026-06-10 | 2 eggs, 2 bacon, 2 pancakes | Price not visible. |
| Sawmill | Wed 2026-06-10 | Country Style Steak | Price not visible. |
| Might As Well | Thu/Tue | Beer and margarita copy | Alcohol-only / alcohol-adjacent copy suppressed. |
| Might As Well | Fri | Mug specials copy | Drink/event-adjacent copy suppressed. |
| Might As Well | Mon | Bingo and bucket copy | Event/alcohol copy suppressed. |
| Sawmill | Sat/Sun | Rose Sangria | Alcohol-only row suppressed. |

## Parent Integration Disposition

No new `deal-intake.csv` rows are proposed in this packet because the priced, website-backed food candidates are already represented in the canonical intake files. Creating new deal rows for the same date/item/source would duplicate the existing candidate set.

Ready for parent integration as evidence refresh: yes, attach the three proposed `source-captures` rows below to the existing candidates if the parent wants a refreshed capture record.

Ready for new deal-intake integration: no new rows. Rooster & The Crow remains a lead until price is confirmed or a reviewer explicitly accepts a no-price daily special for internal review.

## Proposed `source-captures.csv` Rows

These rows are draft-only. They were not appended.

| field | cap-wilmington-might-as-well-official-recheck-2026-06-04 | cap-wilmington-sawmill-official-recheck-2026-06-04 | cap-wilmington-rooster-official-recheck-2026-06-04 |
| --- | --- | --- | --- |
| source_capture_id | `cap-wilmington-might-as-well-official-recheck-2026-06-04` | `cap-wilmington-sawmill-official-recheck-2026-06-04` | `cap-wilmington-rooster-official-recheck-2026-06-04` |
| source_id | `src-might-as-well-wilmington-primary` | `src-sawmill-restaurant-primary` | `src-rooster-and-the-crow-primary` |
| restaurant_id | `might-as-well-wilmington` | `sawmill-restaurant` | `rooster-and-the-crow-wilmington` |
| captured_at | `2026-06-04T16:00:00-04:00` | `2026-06-04T16:00:00-04:00` | `2026-06-04T16:00:00-04:00` |
| captured_by | `codex_agent_volatile_recheck` | `codex_agent_volatile_recheck` | `codex_agent_volatile_recheck` |
| capture_method | `manual_web_review` | `manual_web_review` | `manual_web_review` |
| source_url | `https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials` | `https://thesawmillrestaurant.com/daily-specials/` | `https://roosterandthecrow.com/wilmington-downtown-rooster-and-the-crow-happy-hours-specials` |
| source_final_url | `https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials` | `https://thesawmillrestaurant.com/daily-specials/` | `https://roosterandthecrow.com/wilmington-downtown-rooster-and-the-crow-happy-hours-specials` |
| source_title | `Might As Well Bar & Grill - Wilmington - all specials` | `Sawmill Restaurant - Specials` | `Rooster & The Crow - Specials` |
| source_published_at |  |  |  |
| source_observed_at | `2026-06-04` | `2026-06-04` | `2026-06-04` |
| evidence_type | `official_website_normalized_text` | `official_website_normalized_text` | `official_website_normalized_text` |
| extracted_text_or_confirmation_note | `Official specials page lists June 4-9 food terms including $5.99 cheese burgers, 99 cent wings, $15.99 buffet, $5 off large pizza, $5 appetizer menu, and $1 cheese quesadilla; alcohol/event copy suppressed.` | `Official daily specials page lists June 4-10 food terms; priced food rows are June 6-7 coffee cake combo and avocado toast; alcohol rows suppressed.` | `Official specials page lists Wednesday June 10 meatloaf with two sides, 04:30 PM - 08:30 PM; price not visible.` |
| content_hash | `sha256:53bd689fb48b83aed72893379454379d79b9face0fd5d9d62667911c4ef1730e` | `sha256:9aaf44265b5b28d76208c18bda4d9bf7f967c3657a528cd1afb999180af04b0e` | `sha256:7d81f1648f87e38a56189da3d5eb0d4433cd92eab16f585eef5f6bf3ad1466ca` |
| screenshot_path |  |  |  |
| archive_url_or_path | `ops/research/intake/wilmington-2026-06-03/evidence/might-as-well/official-specials-page-2026-06-04.html` | `ops/research/intake/wilmington-2026-06-03/evidence/sawmill-restaurant/official-daily-specials-page-2026-06-04.html` | `ops/research/intake/wilmington-2026-06-03/evidence/rooster-and-the-crow/official-specials-page-2026-06-04.html` |
| metadata_json | `{"evidence_file_sha256":"53bd689fb48b83aed72893379454379d79b9face0fd5d9d62667911c4ef1730e","raw_html_sha256":"65416d2bbc34b46c2ee00d8079386c32a5088f64e5389a5ba8ddd1b2df48ae11","normalized_path":"ops/research/intake/wilmington-2026-06-03/evidence/might-as-well/official-specials-normalized-2026-06-04.txt"}` | `{"evidence_file_sha256":"9aaf44265b5b28d76208c18bda4d9bf7f967c3657a528cd1afb999180af04b0e","raw_html_sha256":"5d9abb55fc59980dfa3ac70a493ba906b495efff80b919e0651985f02192f158","normalized_path":"ops/research/intake/wilmington-2026-06-03/evidence/sawmill-restaurant/official-daily-specials-normalized-2026-06-04.txt"}` | `{"evidence_file_sha256":"7d81f1648f87e38a56189da3d5eb0d4433cd92eab16f585eef5f6bf3ad1466ca","raw_html_sha256":"48ae8079cded79126ff948ee19934fb2ae9cbc71651870fd75d1b5bc553a5e0a","normalized_path":"ops/research/intake/wilmington-2026-06-03/evidence/rooster-and-the-crow/official-specials-normalized-2026-06-04.txt"}` |
| capture_status | `captured` | `captured` | `captured` |
| notes | `Draft evidence refresh only; do not publish without human review and food-only copy approval.` | `Draft evidence refresh only; do not publish without human review, boundary review, and food-only copy approval.` | `Draft lead evidence only; price missing.` |

## Proposed `review-tasks.csv` Rows

These rows are draft-only. They were not appended.

| field | rt-wilmington-might-as-well-official-recheck-2026-06-04 | rt-wilmington-sawmill-official-recheck-2026-06-04 | rt-wilmington-rooster-official-recheck-2026-06-04 |
| --- | --- | --- | --- |
| review_task_id | `rt-wilmington-might-as-well-official-recheck-2026-06-04` | `rt-wilmington-sawmill-official-recheck-2026-06-04` | `rt-wilmington-rooster-official-recheck-2026-06-04` |
| related_type | `source_capture` | `source_capture` | `source_capture` |
| related_id | `cap-wilmington-might-as-well-official-recheck-2026-06-04` | `cap-wilmington-sawmill-official-recheck-2026-06-04` | `cap-wilmington-rooster-official-recheck-2026-06-04` |
| deal_id |  |  |  |
| source_id | `src-might-as-well-wilmington-primary` | `src-sawmill-restaurant-primary` | `src-rooster-and-the-crow-primary` |
| restaurant_id | `might-as-well-wilmington` | `sawmill-restaurant` | `rooster-and-the-crow-wilmington` |
| source_capture_id | `cap-wilmington-might-as-well-official-recheck-2026-06-04` | `cap-wilmington-sawmill-official-recheck-2026-06-04` | `cap-wilmington-rooster-official-recheck-2026-06-04` |
| direct_confirmation_id |  |  |  |
| report_source | `agent_volatile_official_recheck` | `agent_volatile_official_recheck` | `agent_volatile_official_recheck` |
| opened_at | `2026-06-04T16:00:00-04:00` | `2026-06-04T16:00:00-04:00` | `2026-06-04T16:00:00-04:00` |
| opened_by | `codex_agent_volatile_recheck` | `codex_agent_volatile_recheck` | `codex_agent_volatile_recheck` |
| assigned_reviewer | `codex_research_review` | `codex_research_review` | `codex_research_review` |
| review_reason | `Attach refreshed official-page evidence to existing volatile Might As Well candidate rows; resolve food-only copy and time windows before approval.` | `Attach refreshed official-page evidence to existing volatile Sawmill candidate rows; complete boundary handling and suppress alcohol rows before approval.` | `Decide whether to keep Rooster June 10 meatloaf as a lead or seek direct confirmation because official page omits price.` |
| risk_flags | `alcohol_copy_suppression_required;event_copy_suppression_required;time_window_needs_review;volatile_date_window;human_review_required` | `monkey_junction_boundary_review_required;alcohol_copy_suppression_required;missing_price_for_many_rows;volatile_date_window;human_review_required` | `missing_price;volatile_date_window;human_review_required` |
| priority | `high` | `high` | `normal` |
| status | `open` | `open` | `open` |
| decision |  |  |  |
| decision_reason |  |  |  |
| decided_at |  |  |  |
| decided_by |  |  |  |
| next_action | `Review refreshed official evidence and update existing candidate rows only if approving public-copy-safe terms.` | `Review refreshed official evidence, apply Monkey Junction boundary policy, and keep only priced food rows unless directly confirmed.` | `Direct-confirm price or leave as lead; do not add public-facing copy from no-price source alone.` |
| next_action_due | `2026-06-05` | `2026-06-05` | `2026-06-05` |
| public_copy_approval_status | `pending` | `pending` | `pending` |
| food_alcohol_copy_check | `required` | `required` | `required` |
| next_check_due_required | `true` | `true` | `true` |
| expires_on_required | `true` | `true` | `true` |
| audit_event_id |  |  |  |
| resolution_notes | `Draft task only; no canonical CSV append performed.` | `Draft task only; no canonical CSV append performed.` | `Draft task only; no canonical CSV append performed.` |

## Recommended Next Step

1. For Might As Well, attach the refreshed capture to the existing five/six candidate rows only if review proceeds today. Do not carry expired same-day terms forward without a new official capture.
2. For Sawmill, prioritize the four priced June 6-7 rows. Keep no-price daily specials out unless directly confirmed or explicitly accepted as internal leads.
3. For Rooster & The Crow, use the official page as a lead and direct-confirm price before any deal-intake row.
