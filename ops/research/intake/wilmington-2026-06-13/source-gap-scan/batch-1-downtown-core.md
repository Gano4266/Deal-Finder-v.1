# Batch 1 Downtown Core Source-Gap Scan

Access date for all source checks: 2026-06-13.

AI output is not evidence. This scan records leads from official or restaurant-owned sources only; no deals were promoted, no fixture CSVs were edited, and no screenshots or raw captures were added.

## Summary

- Restaurants checked: 13 active Wilmington prototype restaurants.
- High-confidence official leads not covered by current fixture deal rows: South Front Tavern $5 weekday bar-bites window, Caprice Bistro Wednesday $15 fromage/charcuterie board, Fortunate Glass weekly soup and flatbread PDF items, and Ponysaurus Wilmington Thursday $5 flat breads.
- Needs-review leads: Caprice Tuesday Coq au Vin, Castle Street Kitchen rotating tacos, Rooster & The Crow date-windowed meatloaf, and YoSake older official daily-specials PDF.
- No new official food-special lead found on this pass: Rx Chicken & Oysters, Beat Street, Hell's Kitchen, Front Street Brewery, Tacobaby, and Copper Penny.
- Existing reviewed fixture rows for these restaurants do not appear stale as of 2026-06-13, but several next-check dates are close: 2026-06-15 for most June 2 captures and 2026-06-16 for Ponysaurus.

## High-confidence official leads

| Restaurant | Source URL | Source tier | Observed claim | Confidence | Promotion readiness |
| --- | --- | --- | --- | --- | --- |
| South Front Tavern | https://www.southfronttavern.com/ | `tier_1_official` | Homepage says the `$5 HAPPY HOUR BAR BITES MENU` is available every Mon-Fri, 4-6 pm at the bar and outside high tops. Existing fixture coverage only has Friday $5 Bar Bites from 12-6. | `verified` for source-backed claim | Not promotion-ready. Needs exact eligible bar-bites item list or reviewer-approved generic copy, plus decision whether to create Mon-Thu rows or supersede/expand the Friday row. |
| South Front Tavern | https://www.southfronttavern.com/summer%20has%20arrived%20at%20south%20front%20tavern | `tier_1_official` | Summer page reinforces Friday noon-6 `$5 Bar Bites Menu` and describes it as small plates. | `verified` | Not a new public row by itself because Friday is already covered; useful as recheck/supporting source for the existing Friday deal. |
| Caprice Bistro | https://www.capricebistro.com/weekly-specials | `tier_1_official` | `Date Night à Deux Wednesdays`: every Wednesday, shared fromage and charcuterie board for $15. | `verified` | Not promotion-ready. Needs food-only copy, review approval, time/service restrictions, and alcohol-adjacent copy suppression. |
| Fortunate Glass | https://cdn.prod.website-files.com/5dcc3f2fe62de194794ac6ab/6a078f1a114bab7f2aabc7d9_WINES%20-%202026-05-15T150957.674.pdf | `tier_1_official` | Official Weekly Specials PDF remains live; prior normalized official-PDF text records Chicken Mole Black Bean Soup at 18 and Spicy Garden Flatbread at 18. HTTP header on 2026-06-13 returned `last-modified: Fri, 15 May 2026 21:24:43 GMT`. | `verified` for current PDF availability and prior captured text | Not promotion-ready. Existing 2026-06-04 intake already treats these as review-only; still needs human food-only approval, price-format review, and missing day/time/restriction handling. |
| Ponysaurus Brewing Co. Wilmington | https://www.ponysaurusbrewing.com/ilm | `tier_1_official` | Wilmington page lists weekly food specials including Thursday `$5 FLAT BREADS`. Current fixture rows cover Monday wings, Tuesday pizza, and Wednesday burgers, but not Thursday flat breads. | `verified` | Not promotion-ready. Needs source capture/review row, food-only public copy, and restrictions/time-window review. |

## Needs-review leads

| Restaurant | Source URL | Source tier | Observed claim | Confidence | Why review is needed |
| --- | --- | --- | --- | --- | --- |
| Caprice Bistro | https://www.capricebistro.com/weekly-specials | `tier_1_official` | `Coq au Vin Tuesday`: every Tuesday, braised chicken thigh in Burgundy wine sauce, only on Tuesday nights. | `probable` | Official source supports a recurring food feature, but no price or exact time window is listed. It may be a feature rather than a value deal. |
| Castle Street Kitchen | https://www.castlestkitchen.com/ | `tier_1_official` | Homepage says `Weekly Feature` and `Rotating tacos for the win`, and asks users to call for the current taco selection. | `probable` | Missing price, exact day/time, current taco item, recurrence details, and restrictions. Treat as a direct-confirmation target before any deal-intake row. |
| Rooster & The Crow | https://roosterandthecrow.com/wilmington-downtown-rooster-and-the-crow-happy-hours-specials | `tier_1_official` | Specials page lists Wednesday June 17th meatloaf with two sides, 04:30 PM-08:30 PM. | `probable` | Future date-windowed official lead, but no price is visible. Requires direct confirmation or reviewer decision; if captured, expiry should be 2026-06-18. |
| YoSake | https://yosake.com/wp-content/static/documents/24-2-16-daily.pdf | `tier_1_official` | Older official daily-specials PDF lists food terms including Two For Tuesday specialty rolls for $25, Thursday $12 noodle dishes, and Sunday BOGO up to $10 for entrees, curries, and specialty rolls. | `unverified` | HTTP header on 2026-06-13 showed `last-modified: Sat, 19 Oct 2024 22:09:02 GMT`; current menu PDF is newer and does not clearly surface these daily specials. Needs direct confirmation before intake. |

## No lead found

| Restaurant | Sources checked | Result |
| --- | --- | --- |
| Rx Chicken & Oysters | https://www.rxwilmington.com/ | Existing Wednesday-Friday 1/2 price oyster happy hour remains the only official food-special claim found. Tuesday wine and Sunday mimosa claims are alcohol-only and suppressed. |
| Beat Street | https://www.beatstreetilm.com/ | Existing Tuesday $2 tacos and Wednesday $7 smashburgers appear to cover the official specials visible on the page. |
| Hell's Kitchen | https://hellskitchenbar.com/ | Existing Monday-Friday food-special fixture rows cover the official lunch/food specials visible on the homepage. Drink-only specials are suppressed. |
| Front Street Brewery | https://www.frontstreetbrewery.com/ ; https://www.frontstreetbrewery.com/events/ ; https://www.frontstreetbrewery.com/menu/ | Official site/menu/happenings pages showed regular menu and event shell content, but no current food-special/deal claim. |
| Tacobaby | https://tacobabyusa.com/ ; https://tacobabyusa.com/specials | Existing $11 lunch special is still the official food-special claim found. Specials page lists date instances for the same lunch special, not a new lead. |
| Copper Penny | https://www.copperpennync.com/ ; https://www.copperpennync.com/menu | Official website/menu showed regular menu and identity content, but no current food-special/deal claim. Owned Instagram search snippets hinted at specials, but direct access to the profile failed, so no social lead is treated as evidence here. |

## Existing deal appears stale/needs recheck

- No existing fixture deal for this batch appears stale on 2026-06-13 based on `next_check_due` values in `fixtures/prototype/deals.csv`.
- South Front Tavern: existing Friday $5 Bar Bites fixture row is not contradicted, but the current official site supports a broader Mon-Fri 4-6 pm bar-bites window that is missing from fixtures.
- Ponysaurus Wilmington: existing Monday-Wednesday fixture rows are not contradicted, but the current official Wilmington page adds Thursday `$5 FLAT BREADS`, which is missing from fixtures.
- Fortunate Glass: official PDF was last modified 2026-05-15 and remains live, but any existing internal 2026-06-04 intake should be rechecked soon because prior suggested next check was 2026-06-14.
- YoSake: the older daily-specials PDF is stale-risk evidence, not a publishable source for current availability. Direct confirmation should come before any intake row.

## Suggested next intake rows

These are suggested row/action targets only; do not promote without source capture, review task, food-only copy approval, and freshness metadata.

| Suggested ID/action | Restaurant ID | Deal title | Source URL | Source tier | Confidence/workflow | Blocker |
| --- | --- | --- | --- | --- | --- | --- |
| `cand-wilmington-south-front-tavern-mon-fri-5-bar-bites-2026-06-13` | `south-front-tavern` | `$5 happy hour bar bites` | https://www.southfronttavern.com/ | `tier_1_official` | `verified` / `needs_review` | Eligible items and public copy need review; decide relationship to existing Friday row. |
| `cand-wilmington-caprice-bistro-wednesday-date-night-charcuterie-2026-06-13` | `caprice-bistro` | `$15 fromage and charcuterie board` | https://www.capricebistro.com/weekly-specials | `tier_1_official` | `verified` / `needs_review` | Time/restrictions missing; suppress wine copy. |
| `cand-wilmington-caprice-bistro-tuesday-coq-au-vin-2026-06-13` | `caprice-bistro` | `Coq au Vin Tuesday` | https://www.capricebistro.com/weekly-specials | `tier_1_official` | `probable` / `lead` | Price missing; confirm whether it is a deal or just a weekly feature. |
| Recheck existing Fortunate Glass internal candidates | `fortunate-glass` | `Chicken Mole Black Bean Soup`; `Spicy Garden Flatbread` | https://cdn.prod.website-files.com/5dcc3f2fe62de194794ac6ab/6a078f1a114bab7f2aabc7d9_WINES%20-%202026-05-15T150957.674.pdf | `tier_1_official` | `verified` / `needs_review` | Human food-only review, price-format review, and missing day/time/restrictions. |
| `cand-wilmington-ponysaurus-thursday-5-flat-breads-2026-06-13` | `ponysaurus-wilmington` | `$5 flat breads` | https://www.ponysaurusbrewing.com/ilm | `tier_1_official` | `verified` / `needs_review` | Time window and restrictions missing; brewery alcohol context requires food-only copy. |
| Review task only | `castle-street-kitchen` | `Rotating tacos weekly feature` | https://www.castlestkitchen.com/ | `tier_1_official` | `probable` / `lead` | Needs direct confirmation for current taco, price, day/time, and recurrence. |
| Review task only | `rooster-and-the-crow` | `June 17 meatloaf with two sides` | https://roosterandthecrow.com/wilmington-downtown-rooster-and-the-crow-happy-hours-specials | `tier_1_official` | `probable` / `needs_review` | No price; volatile one-day/date-windowed source. |
| Direct-confirmation task only | `yosake` | `Daily specials / happy-hour food terms` | https://yosake.com/wp-content/static/documents/24-2-16-daily.pdf | `tier_1_official` | `unverified` / `needs_recheck` | Older PDF last modified 2024-10-19; current status must be confirmed. |
