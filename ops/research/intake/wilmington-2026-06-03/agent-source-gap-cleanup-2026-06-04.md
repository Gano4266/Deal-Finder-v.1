# Source-Gap Cleanup Handoff - 2026-06-04

Scope: direct-confirmation and source-gap audit for `roko-italian-cuisine`, `castle-street-kitchen`, `yosake`, `c-street-mexican-grill`, `fortunate-glass`, and `tidewater-oyster-bar`.

Guardrails followed:

- No public fixture CSVs edited.
- No deals promoted, approved, or committed.
- AI/agent notes treated as leads, not evidence.
- Shared intake CSVs were inspected only; no shared CSV edits were made.
- Official web/PDF/official-linked partner pages checked on 2026-06-04.

## Files Inspected

- `ops/research/intake/wilmington-2026-06-03/review-tasks.csv`
- `ops/research/intake/wilmington-2026-06-03/restaurant-source-list.csv`
- `ops/research/intake/wilmington-2026-06-03/source-inventory.csv`
- `ops/research/intake/wilmington-2026-06-03/source-captures.csv`
- `ops/research/intake/wilmington-2026-06-03/deal-intake.csv`
- Relevant fixture rows were read for context only.

## Official Sources Checked

| restaurant_id | source checked | result |
|---|---|---|
| `roko-italian-cuisine` | https://www.rokoitalian.com/weekly-specials | Official page confirms Wilmington identity and weekly-specials page. Friday/Saturday only says "House Special"; no food item, price, time, or restrictions. |
| `castle-street-kitchen` | https://www.castlestkitchen.com/ | Official page confirms 509 Castle Street and a rotating-taco lead, but instructs callers to ask what tacos are available. No price/day/time/current item. |
| `yosake` | https://yosake.com/ and current linked PDF `YOSAKE_MENU_April_NEW_copy_1.pdf` | Official page confirms 33 S Front. Current page/PDF support regular menu and broad specials language, not exact current happy-hour food terms. |
| `c-street-mexican-grill` | https://www.cstreetmex.com/ and https://www.cstreetmex.com/menu | Official page confirms restaurant identity, but address fields conflict. No food-special signal beyond regular menu/ordering. |
| `fortunate-glass` | https://www.fortunateglass.com/ and official Weekly Specials PDF | Official page links a PDF with Weekly Food Specials. PDF can resolve the source gap once screenshot/archive/hash fields are captured. |
| `tidewater-oyster-bar` | https://tidewateroysterbar.com/ and official-linked Toast | Official site links Toast. Toast exposes a Daily Specials section with food items/prices, but no date/recurrence/time. |

## Tasks Needing Phone or Direct Confirmation

| review_task_id | restaurant_id | why phone/direct confirmation is still needed |
|---|---|---|
| `rt-wilmington-roko-direct-confirm-house-special-2026-06-04` | `roko-italian-cuisine` | Official page gives Friday/Saturday "House Special" only. Need food item, price, time window, recurrence, and restrictions before any deal-intake row. |
| `rt-wilmington-castle-street-kitchen-direct-confirm-tacos-2026-06-04` | `castle-street-kitchen` | Official page gives rotating tacos but explicitly points people to call for the selection. Need current item, price, day/time, recurrence, restrictions. |
| `rt-wilmington-yosake-direct-confirm-current-happy-hour-food-2026-06-04` | `yosake` | Current official page/menu did not expose exact happy-hour food terms. Direct confirmation is needed unless a current official PDF/page with exact terms is found. |
| `rt-wilmington-c-street-direct-confirm-address-specials-2026-06-04` | `c-street-mexican-grill` | Address/ZIP conflict must be resolved first. After identity cleanup, ask whether current food specials exist and capture exact terms. |
| `rt-wilmington-tidewater-daily-specials-2026-06-04` | `tidewater-oyster-bar` | Not required for internal same-day review, but required for a stronger publication path because the exact specials are on partner Toast. |

## Tasks Resolvable by Official Web/PDF Capture

| review_task_id | restaurant_id | source path to resolve |
|---|---|---|
| `rt-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04` | `fortunate-glass` | Capture exact official PDF URL, screenshot/archive path, normalized text hash, and `metadata_json.evidence_file_sha256`. Suppress wine/beer copy. |
| `rt-wilmington-tidewater-daily-specials-2026-06-04` | `tidewater-oyster-bar` | Capture Toast page screenshot/archive/hash if keeping as short-lived partner-current intake. Add same-day/next-day expiry unless direct-confirmed. |

Fortunate Glass PDF detail: the official page links `https://cdn.prod.website-files.com/5dcc3f2fe62de194794ac6ab/6a078f1a114bab7f2aabc7d9_WINES%20-%202026-05-15T150957.674.pdf`. HEAD check returned `application/pdf`, last modified `Fri, 15 May 2026 21:24:43 GMT`, with ETag `739682c71d63be09ccbc690cdf817072`. Text inspection found food sections for soup and flatbread, including Chicken Mole Black Bean Soup and Spicy Garden Flatbread.

## Source ID and Consistency Issues

### Tidewater Toast

Current state is mostly correct but should be made explicit:

- `src-tidewater-oyster-bar-primary` is the tier-1 official site source.
- `src-tidewater-oyster-bar-toast-2026-06-04` is the tier-3 partner ordering source.
- `rt-wilmington-tidewater-daily-specials-2026-06-04` and `cap-wilmington-tidewater-toast-daily-specials-2026-06-04` point to the Toast source, which is correct for the exact observed food items/prices.
- Recommended adjustment: add a metadata/note relationship such as `linked_from_source_id=src-tidewater-oyster-bar-primary` because the official site links Toast, but do not upgrade the Toast source tier.
- Recommended adjustment: consider changing Tidewater deal-intake `confidence_status` from `verified` to `probable` until direct confirmation exists, because the exact deal terms are partner-current rather than restaurant-owned page text.

### Fortunate Glass PDF

Current `src-fortunate-glass-primary` points to the homepage while the actual deal evidence is the linked PDF.

- Recommended adjustment: either add a separate `src-fortunate-glass-weekly-specials-pdf-2026-05-15` tier-1 official source row, or keep `src-fortunate-glass-primary` and set source-capture `source_final_url` / `evidence_url_or_path` to the exact PDF URL.
- Required before promotion: screenshot/archive/content hash plus `evidence_file_sha256`.

### C-Street Source URL

Current intake source inventory has `src-c-street-mexican-grill-primary` pointing at `https://direct.chownow.com/order/28956/locations/42738`, but the current official site links:

- `https://direct.chownow.com/order/25580/locations/37827`
- `https://ordering.chownow.com/order/25580/locations?add_cn_ordering_class=true`

Recommended adjustment: do not silently overwrite until identity is resolved. Add/keep a tier-1 official website source for `https://www.cstreetmex.com/`, then mark the old ChowNow URL as stale/superseded or update it only after reviewer confirmation.

## C-Street Address Conflict

Observed conflicts:

- `restaurant-source-list.csv` and fixture row: `4110 Shipyard Blvd N, Wilmington, NC 28403`.
- Visible official footer: `4110 Shipyard Blvd.N | Wilmington, NC 28412`.
- Official site metadata/schema: `4410 Shipyard Boulevard, Wilmington, NC, 28412`.
- Current official site ChowNow links use order/location IDs `25580/37827`, not the stored `28956/42738`.

Recommendation:

- Keep `rt-wilmington-c-street-direct-confirm-address-specials-2026-06-04` as `critical`.
- Do not continue deal research until address/ZIP is direct-confirmed or corrected from a clear official source.
- After confirmation, update restaurant address/ZIP consistently across intake and fixture data in a separate reviewed cleanup packet.
- If the correct address is `4410 Shipyard Boulevard`, update the visible-address conflict notes too; if it is `4110`, the site metadata/schema likely needs restaurant correction.

## Recommended Next CSV Adjustments

No CSV adjustments were made in this pass. Recommended future edits, all review-only:

1. Add 2026-06-04 source captures for Roko, Castle, YoSake, and C-Street official web checks, each with `capture_status=partial` or `needs_direct_confirmation` and no deal rows.
2. Fortunate Glass: complete the existing PDF source capture with exact PDF URL, content hash, screenshot/archive path, and evidence file hash.
3. Tidewater: add official-link metadata between `src-tidewater-oyster-bar-primary` and `src-tidewater-oyster-bar-toast-2026-06-04`; keep Toast as `tier_3_partner`.
4. Tidewater: consider downgrading current candidate confidence to `probable` until direct confirmation exists, or keep internal-only with same-day/next-day expiry.
5. C-Street: add or restore a tier-1 official website source row separate from the ChowNow partner row; mark the stored old ChowNow URL stale/superseded after confirmation.
6. C-Street: resolve address first, then decide whether any food-special research should continue.

## Bottom Line

- Phone/direct confirmation lane: Roko, Castle Street Kitchen, YoSake, C-Street, and Tidewater if publication is desired.
- Web/PDF capture lane: Fortunate Glass and Tidewater internal partner-current candidate.
- Critical blocker: C-Street address and stale partner URL.
- Most important source-governance cleanup: make official-site-to-partner relationships explicit instead of treating partner pages as official evidence.
