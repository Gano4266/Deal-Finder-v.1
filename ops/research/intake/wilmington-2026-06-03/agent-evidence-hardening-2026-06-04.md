# Agent Evidence Hardening - 2026-06-04

Scope: stable official-source Wilmington On Our Radar candidates only: `cornelias`, `tomiko-san`, `el-cerro-grande-monkey-junction`, and `michaelangelos-pizza-monkey-junction`.

Rules followed: no public fixture CSVs edited, no promotions or approvals, no commits, no external API use, and AI output treated only as review support. Current intake files inspected: `deal-intake.csv`, `source-captures.csv`, `review-tasks.csv`, `source-inventory.csv`, and `restaurant-source-list.csv`.

## Summary

All four official sources were reachable during this pass and still support keeping the current rows as official-source, review-only candidates. None are publication-ready because the intake rows still lack durable artifact fields. `cornelias`, `tomiko-san`, and `el-cerro-grande-monkey-junction` can be hardened with text-page screenshot/archive/hash capture. `michaelangelos-pizza-monkey-junction` must stay image/OCR-gated because the price terms are in image assets.

No shared CSVs were changed in this task.

## Candidate Findings

### `cornelias`

- Exact source URL: https://corneliasrestaurant.com/menus/
- Current source support: yes. The live official menu page still supports Thursday weekly specials from 4-9 PM, including the two current intake rows: `Thursday 6 wings for $10` and `Thursday $10 smashburgers`.
- Existing source capture: keep partial for now. `cap-wilmington-cornelias-weekly-specials-2026-06-04` should remain `capture_status=needs_durable_capture` until durable artifacts are added.
- Missing artifact fields: `source-captures.csv` has blank `content_hash`, `screenshot_path`, and `archive_url_or_path`; `metadata_json` does not include `evidence_file_sha256`. Linked `deal-intake.csv` rows also have blank `content_hash`, `screenshot_path`, and `archive_url_or_path`.
- Copyright-safe quote: "6 for $10 wings, $10 smashburgers"
- Recommended next action: capture a screenshot or archive of the weekly-specials page, generate normalized text hash, add artifact SHA in `metadata_json`, then review food-only public copy and public access at The Davis Community.
- Row-level issues found: evidence fields are correctly blocking publication. Separate CSV alignment issue noted below affects `reviewed_at`, `public_copy_approved`, `restriction_notes`, `uncertainty_flags`, `conflict_detected`, `validation_notes`, `added_by`, and date fields.

### `tomiko-san`

- Exact source URL: https://www.tomiko-san.com/event/sushi-hour/
- Current source support: yes, with limits. The official event page still supports Sushi Hour Tuesday-Thursday, 5:00-7:00 PM, with a food signal for rolls and bites. It does not support exact item prices.
- Existing source capture: keep partial for now. `cap-wilmington-tomiko-san-sushi-hour-2026-06-04` should remain `capture_status=needs_durable_capture`.
- Missing artifact fields: `source-captures.csv` has blank `content_hash`, `screenshot_path`, and `archive_url_or_path`; `metadata_json` does not include `evidence_file_sha256`. The linked intake row also has blank `content_hash`, `screenshot_path`, and `archive_url_or_path`.
- Copyright-safe quote: "exclusive rolls, chef-curated bites"
- Recommended next action: capture durable page evidence and keep `workflow_status=needs_review`; reviewer should approve only food-safe copy or direct-confirm exact food item/pricing details.
- Row-level issues found: current row appropriately leaves `price` blank and carries `price_missing`, `exact_food_items_missing`, and `mixed_food_alcohol` blockers. The row should not be upgraded to publishable without price/detail review or cautious approved-with-uncertainty review. Separate CSV alignment issue noted below.

### `el-cerro-grande-monkey-junction`

- Exact source URLs: https://elcerrogranderestaurant.com/menu and https://elcerrogranderestaurant.com/monkeyjunction
- Current source support: yes, with policy blocker. The official menu still supports a Lunch Specials section, Monday-Saturday 11 AM-2:30 PM, with item prices. The location page still confirms Monkey Junction/Wilmington identity.
- Existing source capture: keep partial for now. `cap-wilmington-el-cerro-mj-lunch-specials-2026-06-04` should remain `capture_status=needs_durable_capture`.
- Missing artifact fields: `source-captures.csv` has blank `content_hash`, `screenshot_path`, and `archive_url_or_path`; `metadata_json` does not include `evidence_file_sha256`. The linked intake row also has blank `content_hash`, `screenshot_path`, and `archive_url_or_path`.
- Copyright-safe quote: "Lunch Specials. Mon-Sat 11 AM - 2:30 PM"
- Recommended next action: capture durable menu and location evidence, then have a reviewer decide whether a regular lunch-menu category qualifies as a deal. Complete Monkey Junction boundary review before any future public fixture consideration.
- Row-level issues found: current `confidence_status=verified` is supportable for official evidence, but `workflow_status=needs_review` must remain because this may be a standard menu category rather than a special. Separate CSV alignment issue noted below.

### `michaelangelos-pizza-monkey-junction`

- Exact source URL: https://www.michaelangelosmj.com/specials
- Current source support: yes, image-based. The official page still supports an Our Specials page, location at 5617 Carolina Beach Rd #110, and general restrictions. The specific `2 cheese slices and fountain drink` price is visible in the linked image asset, not durable page text.
- Existing source capture: keep as image/OCR-gated. `cap-wilmington-michaelangelos-mj-specials-2026-06-04` should remain `capture_status=needs_screenshot_ocr`.
- Missing artifact fields: `source-captures.csv` has blank `content_hash`, `screenshot_path`, and `archive_url_or_path`; `metadata_json` includes OCR/boundary flags but not `evidence_file_sha256`. The linked intake row also has blank `content_hash`, `screenshot_path`, and `archive_url_or_path`.
- Copyright-safe quote: "2 Cheese Slices + Fountain Drink"
- Recommended next action: save screenshot/OCR evidence for the specials page and image asset, generate normalized OCR text hash, record artifact SHA, and review limited-time restrictions plus Monkey Junction boundary status.
- Row-level issues found: the current shared `deal-intake.csv` includes only the slices/drink row from the broader draft set. That is conservative and acceptable. Do not add the other image specials until OCR/durable evidence is captured. Separate CSV alignment issue noted below.

## Cross-File Issues

### Durable evidence fields are still missing

For all four target restaurants, the source captures are not ready to upgrade because the hardening fields are missing:

- `source-captures.csv`: `content_hash`
- `source-captures.csv`: `screenshot_path`
- `source-captures.csv`: `archive_url_or_path`
- `source-captures.csv`: `metadata_json.evidence_file_sha256`
- linked `deal-intake.csv` rows: `content_hash`
- linked `deal-intake.csv` rows: `screenshot_path`
- linked `deal-intake.csv` rows: `archive_url_or_path`

Recommended status: keep source captures partial (`needs_durable_capture` or `needs_screenshot_ocr`) until the artifact packet is complete.

### `deal-intake.csv` row alignment issue

The five target rows in `ops/research/intake/wilmington-2026-06-03/deal-intake.csv` appear shifted beginning at `reviewed_at`.

Observed pattern:

- `reviewed_at` contains `false`
- `public_copy_approved` contains restriction prose
- `restriction_notes` contains uncertainty flags
- `uncertainty_flags` contains `false`
- `conflict_detected` is blank
- `validation_notes` contains `codex_agent_intake`
- `added_by` contains the created date
- `created_at` contains the updated date

Expected mechanical correction for each affected row:

- `reviewed_at` should be blank
- `public_copy_approved` should be `false`
- restriction prose should move to `restriction_notes`
- blocker flags should move to `uncertainty_flags`
- `conflict_detected` should be `false`
- `conflicting_source_url` should be blank
- `validation_notes` should retain the non-public/review-only note
- `added_by` should be `codex_agent_intake`
- `created_at` and `updated_at` should retain the row dates

No CSV edit was made in this handoff because the requested output was markdown-only.

## Recommended Next Packet

Run a narrow CSV cleanup packet for `deal-intake.csv` alignment, then perform durable artifact capture for the four sources. After that, re-run:

```bash
npm run research:validate -- ops/research/intake/wilmington-2026-06-03
```

Do not approve, promote, or edit public fixture CSVs as part of that cleanup.
