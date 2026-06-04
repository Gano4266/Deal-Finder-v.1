# Agent Review Packet - Top Website-Backed Candidates - 2026-06-04

Scope: existing Wilmington broad-market intake only. This packet was prepared from `deal-intake.csv`, `source-captures.csv`, `review-tasks.csv`, and `agent-review-readiness-qa-2026-06-04.md`.

No CSVs or public fixtures were edited. No candidate is approved by this packet. All public copy below is marked `UNAPPROVED` and is only a reviewer starting point.

## Gate Snapshot

- Deal candidates reviewed for prioritization: 24
- Included in this packet: 8
- Current workflow state for included rows: `needs_review`
- Current public gates for included rows: `mvp_publish_eligible=false`, `public_copy_approved=false`, blank `review_decision`
- Publication rule: do not promote any row until a human reviewer resolves the blocker, approves public copy, records review fields, and confirms freshness metadata.

## Top 8 Review Queue

### 1. Might As Well Bar & Grill - Sunday buffet

- Candidate row: `cand-wilmington-might-as-well-sunday-buffet-2026-06-07`
- Review task: `rt-wilmington-might-as-well-sunday-buffet-2026-06-07`
- Source capture: `cap-wilmington-might-as-well-future-specials-2026-06-04`
- Source URL: `https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials`
- Evidence path: `ops/research/intake/wilmington-2026-06-03/evidence/might-as-well/2026-06-05-09-food-specials-normalized.txt`
- Source quote: `Sunday Buffett $15.99`
- Why review first: official website-backed, price-specific, future date window, Wilmington-confirmed, food-only candidate copy.
- Exact blocker: displayed end time is `02:00`; reviewer must confirm whether that is buffet service time or venue-hours bleed-through. Evidence is normalized text only, no screenshot.
- UNAPPROVED public title draft: `Sunday buffet at Might As Well`
- UNAPPROVED public description draft: `Listed for Sunday, June 7: buffet at $15.99. Reviewer must confirm the buffet service window before this can publish.`
- Approve checklist: confirm source still shows the June 7 buffet; confirm service window; keep food-only copy; set `review_decision=approved` or `approved_with_uncertainty`; set reviewer fields; approve public copy; confirm `expires_on=2026-06-08` or update freshness.
- Reject checklist: reject if the buffet service window cannot be confirmed, the source no longer shows the deal, the item is not food-first, or the date has passed without same-day review.

### 2. Might As Well Bar & Grill - Sunday large pizza discount

- Candidate row: `cand-wilmington-might-as-well-large-pizza-discount-2026-06-07`
- Review task: `rt-wilmington-might-as-well-large-pizza-discount-2026-06-07`
- Source capture: `cap-wilmington-might-as-well-future-specials-2026-06-04`
- Source URL: `https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials`
- Evidence path: `ops/research/intake/wilmington-2026-06-03/evidence/might-as-well/2026-06-05-09-food-specials-normalized.txt`
- Source quote: `$5 Off Large Pizza's`
- Why review first: official website-backed, explicit discount, future date window, Wilmington-confirmed, no alcohol claim needed in public copy.
- Exact blocker: displayed end time is `02:00`; reviewer must confirm whether that applies to the pizza discount. Evidence is normalized text only, no screenshot.
- UNAPPROVED public title draft: `$5 off large pizzas at Might As Well`
- UNAPPROVED public description draft: `Listed for Sunday, June 7: $5 off large pizzas. Reviewer must confirm the service window and restrictions before publication.`
- Approve checklist: confirm source still shows the June 7 pizza discount; confirm time window; confirm dine-in applicability; keep copy food-only; record reviewer fields; approve public copy; confirm `expires_on=2026-06-08` or update freshness.
- Reject checklist: reject if the discount window is unsupported, the source no longer shows the row, the discount is not food-specific, or restrictions cannot be stated without guessing.

### 3. Hurricane Alley's - CB Centennial peel-and-eat shrimp

- Candidate row: `cand-hurricane-alleys-cb-centennial-shrimp-2026-06-04`
- Review task: `rt-hurricane-alleys-cb-centennial-shrimp-2026-06-04`
- Source capture: `cap-hurricane-alleys-cb-centennial-shrimp-2026-06-04`
- Source URL: `https://hurricanealleyscb.com/hurricane-alleys-restaurant-menu/`
- Evidence path: `ops/research/intake/wilmington-2026-06-03/evidence/carolina-beach-official-scan/hurricane-alleys-cb-centennial-shrimp-normalized-2026-06-04.txt`
- Source quote: `Official menu text lists a CB Centenial special with over a pound for $19.95.`
- Why review first: official restaurant menu, exact price, Carolina Beach is in Wilmington broad-market scope, newly integrated candidate.
- Exact blocker: recurrence and active-special status are unclear; reviewer must decide whether this is a current special or a standing menu item. Public copy spelling also needs review because source text says `Centenial`.
- UNAPPROVED public title draft: `CB Centennial peel-and-eat shrimp`
- UNAPPROVED public description draft: `Hurricane Alley's menu lists a CB Centennial shrimp special: over a pound for $19.95. Reviewer must confirm active status and recurrence before publication.`
- Approve checklist: confirm the menu page still shows the item; confirm it is a current special rather than ordinary menu availability; confirm spelling for public copy; set review fields; approve public copy; keep Carolina Beach location scope; set next check due or expiration.
- Reject checklist: reject if it is only a standard menu item, no longer visible, not active, or cannot be distinguished from ordinary menu availability.

### 4. Sawmill Restaurant - Sunday coffee cake combo

- Candidate row: `cand-wilmington-sawmill-coffee-cake-combo-2026-06-07`
- Review task: `rt-wilmington-sawmill-coffee-cake-combo-2026-06-07`
- Source capture: `cap-wilmington-sawmill-priced-future-specials-2026-06-04`
- Source URL: `https://thesawmillrestaurant.com/daily-specials/`
- Evidence path: `ops/research/intake/wilmington-2026-06-03/evidence/sawmill-restaurant/2026-06-05-09-priced-food-specials-normalized.txt`
- Source quote: `Cup of Coffee and Slice of Coffee Cake - $6`
- Why review first: official website-backed, exact date, exact price, exact time window, food-safe copy is straightforward after boundary review.
- Exact blocker: Monkey Junction boundary review is required; evidence is normalized text only, no screenshot. Alcohol item from same date must remain excluded.
- UNAPPROVED public title draft: `Sunday coffee cake combo at Sawmill`
- UNAPPROVED public description draft: `Listed for Sunday, June 7 from 11 AM to 2 PM: cup of coffee and slice of coffee cake for $6. Reviewer must complete Wilmington boundary review before publication.`
- Approve checklist: confirm June 7 row remains visible; complete Monkey Junction boundary review; keep alcohol row excluded; verify dine-in/takeout service modes; record reviewer fields; approve public copy; confirm `expires_on=2026-06-08`.
- Reject checklist: reject if boundary review fails, the item disappears, the date has passed without review, or the source context cannot support food-only copy.

### 5. Sawmill Restaurant - Sunday avocado toast

- Candidate row: `cand-wilmington-sawmill-avocado-toast-2026-06-07`
- Review task: `rt-wilmington-sawmill-avocado-toast-2026-06-07`
- Source capture: `cap-wilmington-sawmill-priced-future-specials-2026-06-04`
- Source URL: `https://thesawmillrestaurant.com/daily-specials/`
- Evidence path: `ops/research/intake/wilmington-2026-06-03/evidence/sawmill-restaurant/2026-06-05-09-priced-food-specials-normalized.txt`
- Source quote: `Avocado Toast $11; bacon for $2`
- Why review first: official website-backed, exact date, exact time window, exact base price, clear add-on caveat.
- Exact blocker: Monkey Junction boundary review is required; bacon is a separately priced add-on; evidence is normalized text only, no screenshot. Alcohol item from same date must remain excluded.
- UNAPPROVED public title draft: `Sunday avocado toast at Sawmill`
- UNAPPROVED public description draft: `Listed for Sunday, June 7 from 11 AM to 2 PM: avocado toast for $11, with bacon listed as a $2 add-on. Reviewer must complete boundary review before publication.`
- Approve checklist: confirm June 7 row remains visible; complete Monkey Junction boundary review; preserve the add-on caveat; keep alcohol row excluded; record reviewer fields; approve public copy; confirm `expires_on=2026-06-08`.
- Reject checklist: reject if boundary review fails, the source no longer shows the item, the add-on wording is unclear, or the date has passed without timely review.

### 6. Fortunate Glass - Spicy Garden Flatbread

- Candidate row: `cand-wilmington-fortunate-glass-spicy-garden-flatbread-2026-06-04`
- Review task: `rt-wilmington-fortunate-glass-spicy-garden-flatbread-2026-06-04`
- Source capture: `cap-wilmington-fortunate-glass-weekly-food-pdf-2026-06-04`
- Source URL: `https://cdn.prod.website-files.com/5dcc3f2fe62de194794ac6ab/6a078f1a114bab7f2aabc7d9_WINES%20-%202026-05-15T150957.674.pdf`
- Evidence path: `ops/research/intake/wilmington-2026-06-03/evidence/fortunate-glass/weekly-food-specials-normalized-text-2026-06-04.txt`
- Durable artifact: `ops/research/intake/wilmington-2026-06-03/evidence/fortunate-glass/weekly-specials-2026-05-15.pdf`
- Source quote: `Spicy Garden Flatbread`
- Why review first: official PDF artifact captured with normalized text/hash, exact price, Wilmington-confirmed.
- Exact blocker: no weekday or time window appears in captured PDF text; alcohol content from the same PDF must be suppressed.
- UNAPPROVED public title draft: `Spicy Garden Flatbread at Fortunate Glass`
- UNAPPROVED public description draft: `Fortunate Glass's weekly specials PDF lists a Spicy Garden Flatbread at $18. Reviewer must confirm timing and food-only copy before publication.`
- Approve checklist: verify the official PDF still supports the flatbread and price; decide how to handle missing time window; suppress alcohol items; record review fields; approve public copy; set an appropriate next check due.
- Reject checklist: reject if timing cannot be represented safely, the PDF is stale or removed, the price is unsupported, or alcohol-adjacent context makes food-only copy misleading.

### 7. Cornelia's - Thursday smashburger

- Candidate row: `cand-wilmington-cornelias-thu-smashburger-2026-06-04`
- Review task: `rt-wilmington-cornelias-thu-smashburger-2026-06-04`
- Source capture: `cap-wilmington-cornelias-weekly-specials-2026-06-04`
- Source URL: `https://corneliasrestaurant.com/menus/`
- Evidence path: `ops/research/intake/wilmington-2026-06-03/evidence/cornelias/cornelias-menus-normalized-evidence-2026-06-04.txt`
- Screenshot path: `ops/research/intake/wilmington-2026-06-03/evidence/cornelias/cornelias-menus-2026-06-04.png`
- Source quote: `Weekly Specials 4-9 PM; Thursday $10 smashburgers.`
- Why review first: official menus page, durable screenshot and normalized text, exact weekly day/time/price.
- Exact blocker: public access at The Davis Community is unclear; alcohol-adjacent weekly-specials framing must be suppressed.
- UNAPPROVED public title draft: `Thursday $10 smashburgers at Cornelia's`
- UNAPPROVED public description draft: `Cornelia's menu lists Thursday smashburgers for $10 from 4 PM to 9 PM. Reviewer must confirm public access before publication.`
- Approve checklist: confirm public access at The Davis Community; verify screenshot/text/hash; suppress alcohol copy; record reviewer fields; approve public copy; set next check due.
- Reject checklist: reject if the restaurant is not generally public-access, restrictions cannot be stated, or the source no longer supports the Thursday smashburger terms.

### 8. Michaelangelo's Pizza - Monkey Junction - 18-inch 1-topping pizza

- Candidate row: `cand-wilmington-michaelangelos-mj-18-inch-1-topping-2026-06-04`
- Review task: `rt-wilmington-michaelangelos-mj-18-inch-1-topping-2026-06-04`
- Source capture: `cap-wilmington-michaelangelos-mj-18-inch-1-topping-2026-06-04`
- Source URL: `https://www.michaelangelosmj.com/specials`
- Evidence image URL: `https://static7.mysiteserver.net/Images/michaelangelos/site/images/specials/18-inch-pizza-1-topping.png`
- HTML archive: `ops/research/intake/wilmington-2026-06-03/evidence/michaelangelos-pizza-monkey-junction/michaelangelos-specials-page-2026-06-04.html`
- Screenshot path: `ops/research/intake/wilmington-2026-06-03/evidence/michaelangelos-pizza-monkey-junction/michaelangelos-specials-page-2026-06-04.png`
- Source quote: `18-inch pizza (1 topping); pick up only; only $19.99.`
- Why review first: official specials page, exact price, clear pickup-only restriction, durable page screenshot/HTML archive.
- Exact blocker: image-based price needs reviewer verification; limited-time source has no end date; Monkey Junction boundary review is required.
- UNAPPROVED public title draft: `18-inch 1-topping pizza pickup special`
- UNAPPROVED public description draft: `Michaelangelo's Monkey Junction specials page lists an 18-inch 1-topping pizza for $19.99, pickup only. Reviewer must verify image text and boundary status before publication.`
- Approve checklist: compare screenshot/image against extracted text; confirm pickup-only restriction and cannot-combine/premium-topping caveats; complete Monkey Junction boundary review; set conservative expiration or next check; record reviewer fields; approve public copy.
- Reject checklist: reject if OCR/image verification fails, the special is no longer visible, boundary review fails, or the no-end-date freshness risk cannot be managed conservatively.

## Runner-Up Rows

These remain worth reviewing, but they did not make the top eight because they share a source with a stronger row, have a sharper blocker, or are less urgent for first approval.

- `cand-wilmington-cornelias-thu-wings-2026-06-04`: same Cornelia's source and public-access blocker as the smashburger row.
- `cand-wilmington-michaelangelos-mj-slices-drink-2026-06-04`: official and price-specific, but includes a fountain drink combo and image/OCR review.
- `cand-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04`: same Fortunate Glass PDF and missing time-window blocker as the flatbread row.
- `cand-wilmington-might-as-well-wings-2026-06-05`: exact price but near-expiry and time-window conflict.
- `cand-wilmington-sawmill-coffee-cake-combo-2026-06-06` and `cand-wilmington-sawmill-avocado-toast-2026-06-06`: same source/blockers as the June 7 Sawmill rows, but shorter review window.

## Reviewer Approval Skeleton

Use this checklist for any row before moving toward public fixtures:

- Source gate: official source still visible or direct confirmation recorded.
- Evidence gate: source capture has durable path/hash or direct confirmation note.
- Location gate: Wilmington or Carolina Beach scope confirmed; Monkey Junction rows get explicit boundary review.
- Completeness gate: price, date/day, time, service mode, and restrictions are stated without inference.
- Food gate: public copy is food-only and suppresses alcohol/event content.
- Freshness gate: `expires_on` or `next_check_due` is set and not stale.
- Copy gate: public title/description are approved by a human and avoid unsupported claims.
- Publish gate: review fields, public copy fields, and MVP flags are updated only after the reviewer decision.

## Reject Skeleton

Reject or leave unapproved when any of these are true:

- Source no longer supports the exact food claim.
- Price, schedule, recurrence, location, or restrictions require guessing.
- The offer is ordinary menu availability rather than a special.
- Public copy would need to omit material restrictions.
- Boundary-sensitive location cannot be resolved.
- Evidence is stale, image/OCR-only without reviewer verification, or not durable enough for publication.
