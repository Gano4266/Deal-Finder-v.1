# Forkcast / Deal Finder Clean Developer Handoff Package

Generated: 2026-07-06  
Audience: main developers / Codex / Claude workers  
Scope: Greater Wilmington restaurant-specials coverage, candidate sourcing, source-capture queue, and handoff state.

## Critical instruction

Do **not** continue the old source-capture queue as “15 rows at a time.” That allowed item-rich restaurants to dominate the work.

Use the corrected operating rule:

> One coverage batch = 15 distinct restaurants/concepts. Make one restaurant-level decision first. Item expansion happens only after a restaurant has strong official source-backed food terms.

## Publication boundary

Nothing in this handoff is public-ready by itself. Every future fixture promotion must still pass the original Deal Finder/Forkcast gates:

- source capture or direct confirmation;
- durable screenshot/archive where possible;
- human review and approval;
- freshness fields;
- food-safe public copy;
- alcohol-only suppression;
- native Deal Finder validation/readiness;
- no AI/model output as evidence.

## Package layout

- `00_final_handoff/` — final developer handoff workbook, dashboard, CSVs, and prior handoff zip.
- `01_current_master_matrix/` — master atlas, matrix workbook, deal matrix CSV, and dashboard previews.
- `02_restaurant_breadth_passes/` — corrected 15-distinct-restaurant breadth batches.
- `03_source_capture_batches/` — earlier source-capture row batches 01–05, evidence zips, CSVs, and dashboards.
- `04_hardening_and_p1_sprint/` — hardening review of prior 75/76 rows and P1 source-group sprint.
- `05_discovery_archive/` — earlier exploratory passes and supporting packages.
- `06_optional_app_audit/` — app audit/rebuild attempt package; optional context only.
- `99_reference/` — user note image reference.

## Current state in one page

The work moved through three modes:

1. **Discovery / market buildout** — multiple Wilmington/greater-area passes, hibachi/Japanese lane, BBQ/comfort, sports bars, edge markets.
2. **Source capture / evidence triage** — batches 01–05, then hardening review and P1 source-group sprint.
3. **Corrected breadth-first coverage** — two 15-distinct-restaurant breadth batches and a final developer handoff workbook.

The latest developer handoff workbook is the cleanest entry point:

`00_final_handoff/developer_handoff_forkcast_coverage_2026-07-06.xlsx`

The master matrix is the broadest tracker:

`01_current_master_matrix/greater_wilmington_specials_matrix_v1.xlsx`

## Key numbers from the current matrix/handoff

- Restaurants/concepts tracked in matrix: 207
- Deal/item rows normalized in matrix: 570
- Strong A candidates in matrix: 54
- B source-backed/capture-needed rows in matrix: 127
- C leads needing official confirmation in matrix: 169
- Happy-hour rows preserved in matrix: 50
- Prior row-based source capture reviewed: 75 rows across 23 restaurants/concepts
- Corrected breadth coverage completed: 30 distinct restaurants across two batches

## Strongest current item-expansion candidates

Start item expansion only after confirming official source terms and avoiding duplicate source work. Current strongest item-expansion candidates include:

- Islands Fresh Mex Grill — daily taco specials with before/after 5 PM prices and purchase restrictions.
- Vicious Biscuit — rewards/free biscuit Monday–Friday dine-in claim; needs rewards/copy capture.
- City Barbeque — Rib Bone Tuesday / family pack path; needs local price/order capture.
- Moe’s Original BBQ Wilmington — family packs and daily special sides; daily side needs same-day capture.
- Cape Fear Seafood Company — lunch specials under $15; source-backed and needs screenshot/archive.
- Caprice Bistro — weekly food specials / daily Petit Plates; needs screenshot/archive and food-safe copy.
- Circa 1922 — happy-hour food PDF item rows; needs durable PDF/archive binding.
- Hibachi Bistro — lunch specials + Kids Eat Free; needs screenshot/archive.
- Junction 421 — Daily Blue Plate lineup; needs screenshot/archive and deal-value review.
- Blue Surf Cafe — weekly food-special rows; needs alcohol suppression and screenshot/archive.
- San Felipe — lunch PDF rows; boundary-scope review.
- Tequila’s Waterfront — image-menu weekly deals; needs durable image capture.
- The Sounder — late-night food items; exact late-night availability window still needed.

## Persistent blockers / manual-social queue

Keep these out of public rows until exact terms are captured:

- Brent’s Bistro — official site points to Facebook weekly menus; manual/social capture needed.
- On Thyme Restaurant — official site failed; secondary happy-hour-food lead only.
- RUMCOW. — exact happy-hour food terms not captured.
- Bridge Tender — Nightly Feature target failed; exact terms not captured.
- Carolina Ale House Wilmington — official location/promotions surfaces exist, exact local terms not rendered.
- South Beach Grill — Chef’s Chalkboard specials signal exists, PDF/manual capture needed.
- SeaWitch Tiki Bar — rotating dinner-special signal, but standing visible specials drink-only.
- Fish Bites — official site points to social media for daily specials.
- JohnnyLukes — happy-hour food lead, exact official terms not captured.
- Frontier Food To Go / Tavern 14 / Keg and Egg / Boathouse — keep as manual/source-discovery targets until official deal terms are captured.

## Recommended next developer sequence

1. Open `00_final_handoff/developer_handoff_forkcast_coverage_2026-07-06.xlsx`.
2. Continue **Restaurant Breadth Batch 03** with 15 new distinct restaurants.
3. Separately run item-expansion only for winners listed above.
4. For item-expansion winners, create a dated Deal Finder intake folder using the repo templates.
5. Attach real screenshots/archives or direct confirmations; local text cards are not screenshots.
6. Run native Deal Finder scripts: research validate, summary, readiness, promotion packet, dry-run.
7. Add happy-hour UI/category support only after source-backed happy-hour food rows are cleanly represented.

## App integration reminder

The public app already has strong fixture gates and detail pages. The next challenge is not basic UI; it is transforming this research matrix into validated intake packets and then reviewed static fixture rows.
