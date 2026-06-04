# Wilmington Official Discovery Round 2

Date: 2026-06-04
Scope: Wilmington, NC official restaurant websites only
Output stance: proposed rows only; canonical CSVs and public fixtures were not edited

## Summary

This pass found 7 intake-ready proposed candidates backed by official restaurant websites and 3 useful lead/blocker findings. The strongest additions are K38 Porters Neck, K38 Forum, Prost Biergarten, and Block Taco. Kornerstone Bistro has one official family-deal lead, but it needs restriction review before import.

## Intake-Ready Proposed Candidates

### 1. K38 Porters Neck - Monday $5 Food Items

- Proposed candidate_id: `cand-wilmington-k38-porters-neck-monday-5-food-items-2026-06-04`
- Restaurant: K38 Porters Neck
- Restaurant id suggestion: `k38-porters-neck`
- Official source: https://k38bajagrill.com/locations/porters-neck/
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/k38-porters-neck/official-specials-normalized-2026-06-04.txt`
- Deal title: Monday $5 food items
- Deal type: `mexican_special`
- Alcohol classification: `food_only`
- Days available: Monday
- Start time: 17:00
- End time: blank
- Recurrence: weekly
- Price: `$5`
- Service mode: dine-in true; takeout false; delivery false
- Location scope: `wilmington_confirmed`
- Confidence/workflow: `verified`, `needs_review`
- Review flags: `exact_end_time_missing;alcohol_adjacent_source;human_review_required`
- Review note: source includes drink copy; public copy should name only food items and dine-in restriction.

### 2. K38 Porters Neck - Wednesday Half-Off De La Casa Quesadilla

- Proposed candidate_id: `cand-wilmington-k38-porters-neck-wednesday-half-off-quesadilla-2026-06-04`
- Restaurant: K38 Porters Neck
- Official source: https://k38bajagrill.com/locations/porters-neck/
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/k38-porters-neck/official-specials-normalized-2026-06-04.txt`
- Deal title: Wednesday half-off De La Casa quesadilla
- Deal type: `quesadilla_special`
- Alcohol classification: `food_only`
- Days available: Wednesday
- Start time: 17:00
- End time: blank
- Recurrence: weekly
- Discount: `50% off`
- Service mode: dine-in true; takeout false; delivery false
- Location scope: `wilmington_confirmed`
- Confidence/workflow: `verified`, `needs_review`
- Review flags: `exact_end_time_missing;price_base_not_captured;alcohol_adjacent_source;human_review_required`

### 3. K38 Forum - Monday $5 Food Items

- Proposed candidate_id: `cand-wilmington-k38-forum-monday-5-food-items-2026-06-04`
- Restaurant: K38 Forum
- Restaurant id suggestion: `k38-forum`
- Official source: https://k38bajagrill.com/locations/forum/
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/k38-forum/official-specials-normalized-2026-06-04.txt`
- Deal title: Monday $5 food items
- Deal type: `mexican_special`
- Alcohol classification: `food_only`
- Days available: Monday
- Start time: 17:00
- End time: blank
- Recurrence: weekly
- Price: `$5`
- Service mode: dine-in true; takeout false; delivery false
- Location scope: `wilmington_confirmed`
- Confidence/workflow: `verified`, `needs_review`
- Review flags: `exact_end_time_missing;alcohol_adjacent_source;human_review_required`

### 4. K38 Forum - Wednesday Half-Off De La Casa Quesadilla

- Proposed candidate_id: `cand-wilmington-k38-forum-wednesday-half-off-quesadilla-2026-06-04`
- Restaurant: K38 Forum
- Official source: https://k38bajagrill.com/locations/forum/
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/k38-forum/official-specials-normalized-2026-06-04.txt`
- Deal title: Wednesday half-off De La Casa quesadilla
- Deal type: `quesadilla_special`
- Alcohol classification: `food_only`
- Days available: Wednesday
- Start time: 17:00
- End time: blank
- Recurrence: weekly
- Discount: `50% off`
- Service mode: dine-in true; takeout false; delivery false
- Location scope: `wilmington_confirmed`
- Confidence/workflow: `verified`, `needs_review`
- Review flags: `exact_end_time_missing;price_base_not_captured;alcohol_adjacent_source;human_review_required`

### 5. Prost Biergarten - Friday Flounder Sandwich Lunch Special

- Proposed candidate_id: `cand-wilmington-prost-flounder-sandwich-2026-06-05`
- Restaurant: Prost Biergarten
- Restaurant id suggestion: `prost-biergarten`
- Official source: https://prostilm.com/wilmington-downtown-prost-biergarten-happy-hours-specials
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/prost-biergarten/official-specials-normalized-2026-06-04.txt`
- Deal title: Friday flounder sandwich lunch special
- Deal type: `sandwich_special`
- Alcohol classification: `food_only`
- Days available: Friday
- Start date: 2026-06-05
- End date: 2026-06-05
- Start time: 11:00
- End time: 16:00
- Recurrence: `one_day_date_window`
- Price: `$15`
- Service mode: dine-in unknown; takeout unknown; delivery unknown
- Location scope: `wilmington_confirmed`
- Confidence/workflow: `verified`, `needs_review`
- Review flags: `date_windowed;source_time_display_conflict;alcohol_adjacent_source;service_mode_unknown;human_review_required`
- Review note: source text says 11-4, but page time block appears malformed as 11:00 PM to 04:00 PM.

### 6. Prost Biergarten - Tuesday Smash Burger Lunch Special

- Proposed candidate_id: `cand-wilmington-prost-smash-burger-2026-06-09`
- Restaurant: Prost Biergarten
- Official source: https://prostilm.com/wilmington-downtown-prost-biergarten-happy-hours-specials
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/prost-biergarten/official-specials-normalized-2026-06-04.txt`
- Deal title: Tuesday smash burger lunch special
- Deal type: `burger_special`
- Alcohol classification: `food_only`
- Days available: Tuesday
- Start date: 2026-06-09
- End date: 2026-06-09
- Start time: 11:00
- End time: 16:00
- Recurrence: `one_day_date_window`
- Price: `$10`
- Service mode: dine-in unknown; takeout unknown; delivery unknown
- Location scope: `wilmington_confirmed`
- Confidence/workflow: `verified`, `needs_review`
- Review flags: `date_windowed;alcohol_adjacent_source;service_mode_unknown;human_review_required`

### 7. Block Taco - Pizza Box

- Proposed candidate_id: `cand-wilmington-block-taco-pizza-box-2026-06-04`
- Restaurant: Block Taco
- Restaurant id suggestion: `block-taco`
- Official source: https://blocktaco.com/
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/block-taco/official-specials-normalized-2026-06-04.txt`
- Deal title: Pizza Box
- Deal type: `taco_special`
- Alcohol classification: `food_only`
- Days available: Monday;Tuesday;Wednesday;Thursday;Friday;Saturday;Sunday
- Start time: blank
- End time: blank
- Recurrence: weekly or ongoing menu special
- Price: `$55`
- Service mode: dine-in unknown; takeout unknown; delivery unknown
- Location scope: `wilmington_confirmed`
- Confidence/workflow: `verified`, `needs_review`
- Review flags: `catering_pack_qualification_required;service_mode_unknown;human_review_required`
- Review note: official source places this under Current Specials, but reviewer should decide whether a group-pack/catering-style offer qualifies for the user-facing prototype.

## Reviewable Lead

### Kornerstone Bistro - Monday Kids Eat Free

- Official source: https://www.kornerstonebistro.com/
- Evidence file: `ops/research/intake/wilmington-2026-06-03/evidence/kornerstone-bistro/official-specials-normalized-2026-06-04.txt`
- Proposed status: reviewable lead, not CSV-ready
- Reason: official site says Monday kids eat free and dine-in only, but does not show exact age range, adult entree requirement, time window, or other restrictions.

## Blocked Or Not New

- K38 Porters Neck and Forum Tuesday fajitas: official pages say special-priced fajitas but do not show an exact price or discount. Hold for direct confirmation.
- Prost Thursday June 4 pierogies: official page has food details and lunch window but no price. Hold.
- Kornerstone Tuesday half-price mussels: official and strong, but already represented in the public static prototype; not a new round-2 intake candidate.
- The Cardinal weekly specials: official and strong, but half-price pizza and $5 burgers already exist in public static prototype data; no new intake proposal made.
- Rx Chicken & Oysters oyster happy hour: official and strong, but already represented publicly; no new intake proposal made.
- Tequila's Waterfront: official menu page exists in search, but a current local news result says the waterfront location closed in May 2026. Do not pursue without operating-status confirmation.
- Front Street Brewery half-price appetizer lead: search results and secondary pages reference it, but the current official menu page found in this pass did not provide a clean official specials claim. Hold.

## Official URLs Checked

- https://k38bajagrill.com/locations/porters-neck/
- https://k38bajagrill.com/locations/forum/
- https://prostilm.com/wilmington-downtown-prost-biergarten-happy-hours-specials
- https://blocktaco.com/
- https://www.kornerstonebistro.com/
- https://thecardinalilm.com/
- https://www.rxwilmington.com/
- https://tequilaswaterfront.com/menus/
- https://www.frontstreetbrewery.com/menu/

## Publication Gate

No public fixture rows were edited. No candidate in this report is approved, MVP-publishable, or public-copy-approved. Any import from this report should create `needs_review` rows with `mvp_publish_eligible=false`, `public_copy_approved=false`, a durable capture reference, and reviewer approval still blank.
