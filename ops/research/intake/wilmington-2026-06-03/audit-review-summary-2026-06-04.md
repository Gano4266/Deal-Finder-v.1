# Audit Review Summary - 2026-06-04

Scope: follow-up audit after structured Wilmington On Our Radar intake rows were created. This summary captures review-readiness decisions only. No public fixtures were edited and no candidates were approved or promoted.

## Fixes Applied

- Added `restaurant-source-list.csv` so `/admin/source-gaps` has research-intake source context.
- Added `source-inventory.csv` for the audited official/partner sources.
- Fixed `deal-intake.csv` field alignment for all 9 candidate rows:
  - `reviewed_at` is blank.
  - `public_copy_approved=false`.
  - restriction prose lives in `restriction_notes`.
  - blocker flags live in `uncertainty_flags`.
  - `conflict_detected=false`.
- Downgraded Tidewater Daily Specials from `confidence_status=verified` to `confidence_status=probable` because the exact item list came from a `tier_3_partner` Toast source. It should stay internal until direct confirmation or stronger official capture supports exact terms.

## Current Review State

- 9 open deal candidates remain in `deal-intake.csv`.
- 13 open review tasks remain in `review-tasks.csv`.
- 12 restaurant source rows are present.
- 13 source inventory rows are present, including a separate `tier_3_partner` Tidewater Toast source.

## Urgent Review Items

- Might As Well cheeseburgers and Sawmill Pasta Night are June 4 date-specific candidates with `expires_on=2026-06-05`; if not durably captured and reviewed by June 5, move them toward `expired` or `needs_recheck`.
- Fortunate Glass can be advanced by web/PDF capture, but needs exact PDF URL, screenshot/archive, content hash, and evidence file hash.
- Michaelangelo's needs screenshot/OCR before its image-based special can advance.
- C-Street remains the only critical source-gap task because fixture, official site, metadata, and ChowNow address/ZIP signals conflict.

## Agent Handoffs Added

- `agent-evidence-hardening-2026-06-04.md`
- `agent-volatile-expiry-review-2026-06-04.md`
- `agent-source-gap-cleanup-2026-06-04.md`
