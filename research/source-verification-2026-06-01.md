# Source Verification Notes - 2026-06-01

This is a browser-assisted source review for the Wilmington seed market. It verifies source locations and selected official deal evidence; it does not publish any deal.

Operating date: 2026-06-01, interpreted in Wilmington, NC local time.

Update note: later Phase 1 fixture passes promoted some candidates from this historical note into reviewed public prototype deals. Treat this file as discovery history; use `fixtures/prototype/deals.csv`, `fixtures/prototype/fixture-manifest.json`, and `ops/audits/week-of-2026-06-01.md` for current publication state.

## Rules Used

- Official restaurant websites, official specials pages, official social posts, and direct confirmations can support verification.
- Third-party aggregators, Reddit, reviews, comments, and user notes remain discovery only.
- Source verification is not the same as public publication. Public deals still need review decision, food-safe copy, and `next_check_due` or `expires_on`.

## Official Sources Found

| Restaurant | Official source reviewed | Source result | Deal evidence result |
|---|---|---|---|
| Dram Yard / Gazebo Bar | https://www.dramyard.com/gazebo-bar | Official Gazebo Bar page found; downtown Wilmington address and nightly-specials language present. | Exact user-seed claims remain `needs_review`; page does not verify the exact bartender-cocktail/bar-bites terms. |
| Rebellion NC | https://rebellionnc.com/ and https://rebellionnc.com/files/2025/03/DAILY-FEATURES-as-of-03.31.2025-01.jpg | Official site found; downtown Wilmington address and Daily Features image present. | Phase 1N promoted food-only rows for Monday half-price burgers, Tuesday `$3 off communal grub`, and Wednesday `$10 wings`; adjacent drink-special copy is suppressed. Original burger/beer seed lead is superseded. |
| Seabird | https://www.seabirdnc.com/home | Official site found; downtown Wilmington address present. | Exact $1 oyster lead remains `needs_review`; no exact official deal evidence captured in this pass. |
| Flying Machine Oyster Bar | https://www.flyingmachine.com/oyster-bar | Official Flying Machine Oyster Bar page found; Wrightsville Beach address and oyster-bar food context present. | Exact $1 oyster / taco leads remain `needs_review`; no exact official deal evidence captured in this pass. |
| Ponysaurus Brewing Co. Wilmington | https://www.ponysaurusbrewing.com/ilm | Official Wilmington page found. | Official page supports Monday 1/2 price wings, Tuesday $10 one-topping pizzas, and Wednesday 1/2 price burgers. These are source-backed candidates, not public deals. |
| Benny's Big Time Pizzeria | https://www.bennysbigtime.com/ | Official site found; Wilmington address present. | Exact two-pizza/salad lead remains `needs_review`; no exact official deal evidence captured in this pass. |
| Beat Street | https://www.beatstreetilm.com/ | Official site found; Cargo District address present. | Official site supports Tuesday $2 tacos and Wednesday $7 smashburgers. User-seed $5 burger conflicts with official price and remains blocked. |
| Bridgewater Wines + Dines | https://bridgewaterwines.com/ | Official site found; Porters Neck location present. | Exact 50% entree lead remains `needs_review`; no exact official deal evidence captured in this pass. |
| True Blue Butcher & Table | https://www.wearetrueblue.com/truebluebutcherandtable | Official concept page found; Wilmington address and weekly deals present. | Official site supports Wednesday $7 smash burgers and Fri/Sat half-priced appetizers, not the user-seed $5 burger or BOGO 1/2 off wording. |
| True Blue Butcher & Barrel | https://www.wearetrueblue.com/butcherandbarrel | Official concept page found; South Front District address and weekly deals present. | Phase 1L promoted source-backed food-only public rows for Wednesday $7 smash burgers, Thursday $1 oysters, and Fri/Sat $5 bar snacks. Do not merge with Butcher & Table evidence. |
| Shuckin' Shack Oyster Bar - Wilmington | https://www.theshuckinshack.com/location-wilmington | Official Wilmington location page found. | No exact seed deal captured in this pass. |
| Rx Chicken & Oysters | https://www.rxwilmington.com/ | Official site found; Wilmington address and weekly-specials section present. | Official page supports Wednesday-Friday 1/2 price oysters from 5-6 PM; no user-seed candidate row exists yet. |
| South Front Tavern | https://www.southfronttavern.com/ | Official site found; South Front District address and weekly-specials section present. | Official page supports several food specials, including happy-hour bar bites, empanadas, quesadillas, smashburger, and Friday bar bites; no user-seed candidate row exists yet. |
| Beer Barrio | https://beerbarrionc.com/specials | Official specials page found. | Official page supports Tuesday pork tacos; no user-seed deal row exists yet. |
| Caprice Bistro | https://www.capricebistro.com/weekly-specials | Official weekly-specials page found. | Official page supports Mussel Mondays, Tuesday Coq au Vin, Wednesday charcuterie, and daily petit plates; no user-seed candidate row exists yet. |
| Ceviche's | https://www.wbceviche.com/menu | Official menu page found with weekday specials section. | Official specials found are mostly drink-focused; no MVP food deal added. |
| Katy's Grill & Bar | https://katysbarandgrill.com/weekly-specials/ | Official weekly specials page found. | Official page supports several food specials; no user-seed deal row exists yet. |
| Islands Fresh Mex Grill | https://www.islandsfreshmexgrill.com/ | Official site found; multiple Wilmington locations and taco-special signals present. | Historical note: location-specific Monkey Junction capture was completed later in Phase 1k and public prototype taco rows now exist. |
| Hell's Kitchen | https://hellskitchenbar.com/ | Official site found; downtown Wilmington address and daily-specials section present. | Official page supports recurring lunch/food specials; no user-seed candidate row exists yet. |
| Slice of Life Pizzeria & Pub | https://www.grabslice.com/ | Official site found; multiple Wilmington-area locations present. | No exact food special captured in this pass. |
| Coquina Fishbar | https://coquinafishbar.com/ | Official site found; Mayfaire/Wilmington address and specials language present. | Phase 1L promoted source-backed Friday half-priced apps with food-only public copy and drink-special framing suppressed. |
| Four Corners Wrightsville Beach | https://fourcornerswb.com/-specials | Official specials page found; Wilmington address present. | Official page supports food specials such as wings, tacos, and half-priced apps; boundary risk lowered because source lists Wilmington address. |
| Whiskey Trail | https://whiskeytrailsportspub.com/wilmington-whiskey-trail-happy-hours-specials/ | Official specials page found; Masonboro and Midtown Wilmington locations present. | Official page supports wings/burgers food specials; no user-seed deal row exists yet. |

## Candidate Promotion Notes

- Promote only exact matches supported by official pages into `status=verified` in seed candidate files.
- Keep mixed alcohol/food specials blocked from MVP publication unless the public copy can be food-only.
- Keep contradictory user-seed prices blocked. Preserve the user note, but do not publish the contradicted amount.
