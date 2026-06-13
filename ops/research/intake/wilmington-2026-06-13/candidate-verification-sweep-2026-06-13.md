# Candidate Verification Sweep - 2026-06-13

Scope: candidate leads from the June 13 source-gap scan plus stronger official-source food leads surfaced while checking those pages. This pass used official restaurant websites, restaurant-owned social pages when readable without login, and saved local captures under `verification-sweep-captures/`.

No public fixture rows were promoted by this sweep. AI output is not evidence.

## Summary

- New review-only intake rows created from this sweep: 11.
- Already-public or earlier-canonical rows were rechecked but not duplicated.
- Denied rows are kept out of `deal-intake.csv` unless a reviewer wants explicit rejected-row tracking.
- Still requires human/public-copy review before publication: every verified non-approved row.

## Verified Source-Backed Candidates

| Lead | Source capture | Disposition | Notes |
|---|---|---|---|
| South Front Tavern Mon-Fri `$5 Happy Hour Bar Bites` | `verification-sweep-captures/south-front-home.txt` | `verified` / `needs_review` | Official homepage confirms Mon-Fri 4-6 PM, bar and outside high tops. Decide whether to supersede/expand the existing Friday row. |
| South Front Tavern Monday `$4 empanadas` | `verification-sweep-captures/south-front-home.txt` | `verified` / already public | Existing public row remains supported. |
| South Front Tavern Wednesday half-price quesadillas | `verification-sweep-captures/south-front-home.txt` | `verified` / already public | Existing public row remains supported. |
| South Front Tavern Thursday `$5 SmashBurger` | `verification-sweep-captures/south-front-home.txt` | `verified` / already public | Existing public row remains supported. |
| Caprice Bistro Monday `$15 mussels and frites` | `verification-sweep-captures/caprice-weekly.txt` | `verified` / already public | Existing public row remains supported; beer pairing copy remains suppressed. |
| Caprice Bistro Wednesday `$15 fromage and charcuterie board` | `verification-sweep-captures/caprice-weekly.txt` | `verified` / `needs_review` | Candidate list lead confirmed. Suppress wine copy. |
| Caprice Bistro daily `$7 Petit Plates` | `verification-sweep-captures/caprice-weekly.txt` | `verified` / already public | Existing public row remains supported. |
| Fortunate Glass soup and flatbread PDF candidates | `verification-sweep-captures/fortunate-glass-weekly-specials-2026-06-13.pdf` | `verified_source` / existing canonical rows | June 3 candidates remain canonical; PDF was re-downloaded and still current by `last-modified` header. Missing day/time/restrictions still block publication. |
| Cornelia's Thursday 6 wings for `$10` | `verification-sweep-captures/cornelias-menus.txt` | `verified` / existing canonical row | Do not duplicate; June 3 candidate remains canonical and blocked on public-access review. |
| Cornelia's Thursday `$10 smashburgers` | `verification-sweep-captures/cornelias-menus.txt` | `verified` / existing canonical row | Do not duplicate; June 3 candidate remains canonical and blocked on public-access review. |
| Kornerstone Bistro Monday Kids Eat Free | `verification-sweep-captures/kornerstone-home.txt` | `verified` / `needs_review` | Official source confirms food offer and dine-in-only note; missing age/adult-entree/limit/time restrictions. |
| Coquina Fishbar `$14` Tue-Fri lunch specials | `screenshots/src-coquina-fishbar-daily-lunch-specials-2026-06-13.png` | `verified` / existing June 13 row | Already captured as `cand-wilmington-2026-06-13-coquina-daily-lunch-specials`. |
| Block Taco Pizza Box `$55` | `verification-sweep-captures/block-taco-home.txt` | `verified` / existing canonical row | June 3 candidate exists; still needs group-pack deal-value review. |
| Block Taco Mon-Tue two tacos/chips/salsa `$10` | `verification-sweep-captures/block-taco-home.txt` | `verified` / already public | Existing public row remains supported. |
| Block Taco Fri-Sun two tacos and loaded nacho `$20` | `verification-sweep-captures/block-taco-home.txt` | `verified` / already public | Existing public row remains supported. |
| Za Pie One Stop Special `$20.25` | `verification-sweep-captures/za-pie-home.txt` | `verified` / already public | Existing public row remains supported. |
| Za Pie Cheesy Trio `$29.99` | `verification-sweep-captures/za-pie-home.txt` | `verified` / `needs_review` | Candidate list lead confirmed. |
| Za Pie Red Di Riso Di `$30.75` | `verification-sweep-captures/za-pie-home.txt` | `verified` / `needs_review` | Candidate list lead confirmed. |
| Za Pie Dinner for Two `$28.99` | `verification-sweep-captures/za-pie-home.txt` | `verified` / already public | Existing public row remains supported. |
| Katy's Monday Philly cheesesteak `$10.99` | `screenshots/src-katys-grill-bar-weekly-specials-2026-06-13.png` | `verified` / existing June 13 row | Already captured as review-only intake. |
| Katy's Tuesday half-price burgers | `screenshots/src-katys-grill-bar-weekly-specials-2026-06-13.png` | `verified` / existing June 13 row | Already captured as review-only intake. |
| Katy's Wednesday half-price chicken sandwiches | `screenshots/src-katys-grill-bar-weekly-specials-2026-06-13.png` | `verified` / existing June 13 row | Already captured as review-only intake. |
| Katy's Thursday wings with fries `$9.99` | `screenshots/src-katys-grill-bar-weekly-specials-2026-06-13.png` | `verified` / existing June 13 row | Already captured as review-only intake. |
| Katy's Friday hotdogs with fries `$8.99` | `screenshots/src-katys-grill-bar-weekly-specials-2026-06-13.png` | `verified` / existing June 13 row | Already captured as review-only intake. |
| Michaelangelo's MJ image specials | `verification-sweep-captures/michaelangelos-images/` | `verified_source` / existing canonical rows | Official page and image assets were re-downloaded. June 3 rows remain canonical; OCR/public boundary review still required. |
| Sawmill June 13 coffee cake and avocado-toast specials | `verification-sweep-captures/sawmill-daily.txt` | `verified` / `needs_review` | The current page is no longer stale; it shows June 12-18 terms. Monkey Junction boundary review still applies. |
| Might As Well June 14 buffet/pizza, June 15 appetizer menu, June 16 quesadilla, June 18 cheeseburgers | `verification-sweep-captures/might-as-well-specials.txt` | `verified` / existing June 13 or new review rows | Official source gives current date-windowed food claims. Expiry handling is mandatory. |
| The Melting Pot Military Mondays | existing June 13 capture | `verified` / existing June 13 row | Already captured as review-only intake; restricted-audience copy is the blocker. |
| Beer Barrio June 16 `$4 pulled pork tacos` | `verification-sweep-captures/beer-barrio-specials.txt` | `verified` / `needs_review` | Earlier stale concern is resolved for this page version; current source shows June 13-18 specials. |
| Ponysaurus Thursday `$5 flat breads` | `verification-sweep-captures/ponysaurus-ilm.txt` | `verified` / `needs_review` | Agent audit corrected the earlier rejected disposition; official captured text supports Thursday 5-10 PM. |
| Whiskey Trail Wednesday `10 wings for $10` | `verification-sweep-captures/whiskey-trail-specials.txt` | `verified` / already public | Existing public row remains supported. |
| Whiskey Trail Thursday `$3 off burgers` | `verification-sweep-captures/whiskey-trail-specials.txt` | `verified` / already public | Existing public row remains supported. |
| Fire Bowl lunch specials | `verification-sweep-captures/fire-bowl-lunch.txt` | `verified` / already public | Existing June 13 public row remains supported. |
| Blue Surf current public food rows | `verification-sweep-captures/blue-surf-menu.txt` | `verified` / already public | Existing public Tuesday-Friday food rows remain supported; no new deal row from rotating-specials language. |
| Fentoni's lunch special | `verification-sweep-captures/fentonis-daily.txt` | `verified` / already public | Existing public row remains supported. |
| HopLite Sunday brunch specials | `verification-sweep-captures/hoplite-brunch.txt` | `verified` / already public | Existing public row remains supported. |

## Denied Or Rejected For Current Deal Intake

| Lead | Source capture | Disposition | Why denied |
|---|---|---|---|
| Caprice Bistro Tuesday Coq au Vin | `verification-sweep-captures/caprice-weekly.txt` | `rejected` | Official source has a recurring feature but no price, discount, or value signal. |
| Castle Street Kitchen rotating tacos | `verification-sweep-captures/castle-street-home.txt` | `rejected` | Official source says to call for current selection; no price, day, time, recurrence, or current item. |
| Rooster & The Crow June 17 meatloaf | `verification-sweep-captures/rooster-specials.txt` | `rejected` | Official source has date/time and item but no price or discount. |
| YoSake old daily-specials PDF | `verification-sweep-captures/yosake-daily-specials-2026-06-13.pdf` | `rejected_current` | PDF is reachable, but HTTP `last-modified` is 2024-10-19; direct confirmation needed before any current row. |
| Cornelia's Saturday date-night prix fixe | `verification-sweep-captures/cornelias-menus.txt` | `rejected_current` | Official source lacks price/menu contents and public access remains unresolved. |
| Cornelia's event dinner lead | `verification-sweep-captures/cornelias-events.txt` | `rejected` | Events page exposes no concrete current event/date/price terms in captured text. |
| Roko Italian Friday/Saturday House Special | `verification-sweep-captures/roko-weekly.txt` | `rejected` | Food claim is too vague: no item, price, discount, or restrictions. |
| Tomiko-San Sushi Hour | `verification-sweep-captures/tomiko-sushi-hour.txt` | `rejected_current` | Official source confirms a food-adjacent event but no visible food prices or eligible item details. |
| Tomiko-San Late Night Weekends | `verification-sweep-captures/tomiko-late-night.txt` | `rejected` | Special menu / extended-hours signal, not a price-bearing deal. |
| Tidewater Oyster Bar daily/weekly specials | `verification-sweep-captures/tidewater-home.txt` | `rejected_current` | Official source says specials exist but instructs users to check board/call/follow; no exact deal terms. |
| The Half seasonal specials | `verification-sweep-captures/the-half-home.txt` | `rejected` | Generic seasonal-specials language only; no food item/price/day/time. |
| K38 fajita Tuesday at Independence/Oleander/Carolina Beach/Porters Neck/Forum | `verification-sweep-captures/k38-*.txt` | `rejected_current` | Official source says special-priced fajitas but exposes no exact price or discount. Direct confirmation needed. |
| K38 Baja Bounce Back gift-card offer | `verification-sweep-captures/k38-*.txt` | `rejected` | Gift-card purchase incentive, not a food-first public deal. |
| Cape Fear Seafood MJ weekend brunch specials | `verification-sweep-captures/cfsc-monkey-junction.txt` | `rejected_current` | Captured page does not expose brunch-special prices/details; Monkey Junction boundary review would still apply. |
| El Cerro MJ lunch specials | `verification-sweep-captures/el-cerro-menu.txt` | `rejected_current` | Official source shows regular lunch-menu pricing; deal-value gate not met without reviewer exception. |
| Winnie’s half-price apps social lead | `verification-sweep-captures/winnies-fb.txt`; `verification-sweep-captures/winnies-ig.txt` | `needs_recheck_not_current` | Official-social pages are readable, but posts are from 2024 / 116 weeks old. Do not treat as current without direct confirmation or fresh post. |
| C-Street Instagram lunch-special lead | `verification-sweep-captures/cstreet-ig-lunch.txt` | `rejected_current` | Readable post text only says all day today; no captured item/price terms, and source/location conflict remains. |
| Flaming Amy's chimichanga lead | `verification-sweep-captures/flaming-amys-fb-photo.txt` | `rejected_current` | Captured official-social page exposes no deal text beyond a recent photo shell. |
| Fire Bowl coupon page | `verification-sweep-captures/fire-bowl-coupon.txt` | `rejected_current` | Coupon page is real but captured text exposes no coupon terms. Lunch-special page remains the verified usable source. |
| Whiskey Trail Sunday Yuengling/wings bundle | `verification-sweep-captures/whiskey-trail-specials.txt` | `rejected_current` | Price bundles alcohol with wings and gives no food-only price. Public food deal needs direct confirmation. |
| Katy's fish and chips `$12.99` | prior Katy's capture | `rejected_current` | Source placement does not clearly assign this to Friday; hold out until reviewed or directly confirmed. |

## Duplicate / Existing Canonical Rows

- Cornelia's Thursday wings and smashburgers: use June 3 canonical intake rows; do not create June 13 duplicates.
- Michaelangelo's MJ image specials: use June 3 canonical rows and new image downloads only as recheck evidence.
- Block Taco Pizza Box: use June 3 canonical row.
- Katy's and Coquina: already added to June 13 review-only intake.
- Public rows for South Front Tavern Monday/Wednesday/Thursday/Friday, Caprice Monday/daily Petit Plates, Block Taco Mon-Tue/Fri-Sun, Za Pie One Stop/Dinner for Two, Whiskey Trail, Fire Bowl, Blue Surf, Fentoni's, and HopLite remain supported by current official captures.

## Capture Inventory

- Page text and screenshots: `ops/research/intake/wilmington-2026-06-13/verification-sweep-captures/`
- Fortunate Glass PDF: `verification-sweep-captures/fortunate-glass-weekly-specials-2026-06-13.pdf` (`sha256:20b6615ae5e449e389f33db7531ca74b0b1a96b7c75e8b348f3cf506344012d0`)
- YoSake PDF: `verification-sweep-captures/yosake-daily-specials-2026-06-13.pdf` (`sha256:f7492dea3a86621cf02ec730f85275ade3d03716455b25102c995b9508f1afe9`)
- Michaelangelo's downloaded image hashes:
  - `2-cheese-slices-and-fountain-drink.png`: `sha256:47e3e2409a2dd726d4fe29961cc87d73d1a6e9daed671db41905a9b03a703ebe`
  - `18-inch-pizza-1-topping.png`: `sha256:39933f8a4d3774950cd1d292ed8a6ec9baa4121e0456c408cea2bbaa6d4d59da`
  - `16-inch-pizza-1-topping-and-cheesy-bread.png`: `sha256:606ba0077d03d4f8ff7580d09aee91f0f70b9a3e15f8eccfb58d75c191e0dc15`
  - `2-14-inches-pizzas-1-topping.png`: `sha256:a13cd004fb6d6fd16ef1b18b50dfe71112e7393b04f871bc7dc50475ea449f05`
  - `2-18-inches-pizzas-1-topping.png`: `sha256:9055a2e5adbbdf81101da43d1c097950d82a742a2d254b298988cee3b2899300`

## Recommended Next Action

Review the larger intake batch created from the strongest verified gaps:

1. South Front Tavern: Mon-Fri bar bites overlap/supersession decision.
2. Caprice Bistro: Wednesday charcuterie.
3. Kornerstone Bistro: Monday Kids Eat Free restrictions.
4. Za Pie: Cheesy Trio and Red Di Riso Di.
5. Beer Barrio: June 16 pulled pork tacos with short expiry.
6. Might As Well: date-windowed June 14-18 rows with expiry and alcohol/event suppression.
7. Ponysaurus: Thursday $5 flat breads.

Keep denied rows out of `deal-intake.csv` unless a reviewer wants explicit rejected-row tracking.
