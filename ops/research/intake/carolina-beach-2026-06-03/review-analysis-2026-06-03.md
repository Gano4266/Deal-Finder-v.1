# Carolina Beach Review Analysis - 2026-06-03

Scope note: none of these candidates are publish-ready for the current public prototype because `docs/prototype-data-contract.md` and `scripts/validate-data.mjs` keep public fixture restaurants/deals scoped to Wilmington, NC. I did not edit shared public fixture CSVs.

## Candidate Decisions

### cand-cb-fentonis-lunch-special

- Decision: not ready for current public publish; source-backed if Carolina Beach scope is approved and human review is completed.
- Source checked: https://fentonispizza.com/daily-specials
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/fentonis-daily-specials-2026-06-03.png`
- Capture: `cap-cb-fentonis-daily-specials-20260603`
- Public-safe fields if scope-approved: title `Fentoni's weekday lunch special`; description `Two slices and a fountain drink for $8.41 plus tax. Dine-in only at the Publix location.`; schedule `Monday-Friday, 11:00-14:00`; price `$8.41 plus tax`; service modes `dine_in=true, takeout=false, delivery=false`.
- Blockers: Carolina Beach out of current public scope; needs reviewer approval and next_check_due/expires_on before promotion.

### cand-cb-k38-cinco-de-monday

- Decision: not ready for current public publish; source-backed if Carolina Beach scope is approved and human review accepts blank end time.
- Source checked: https://k38bajagrill.com/locations/carolina-beach/
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/k38-carolina-beach-location-2026-06-03.png`
- Capture: `cap-cb-k38-location-20260603`
- Public-safe fields if scope-approved: title `K38 Cinco de Monday`; description `$5 Monday food specials include Baja Fish Tacos, large queso, large guac, large elote, Poor Surfer, and Chicken Elote Rolls. Dine-in only.`; schedule `Monday, starts at 17:00, end time not listed`; price `$5 listed food-special items`; service modes `dine_in=true, takeout=false, delivery=false`.
- Blockers: Carolina Beach out of current public scope; end time missing; includes drink items on source, so public copy must stay food-only; needs reviewer approval and next_check_due/expires_on.

### cand-cb-k38-quesadilla-wednesday

- Decision: not ready for current public publish; source-backed if Carolina Beach scope is approved and human review accepts blank end time.
- Source checked: https://k38bajagrill.com/locations/carolina-beach/
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/k38-carolina-beach-location-2026-06-03.png`
- Capture: `cap-cb-k38-location-20260603`
- Public-safe fields if scope-approved: title `K38 Quesadilla Wednesday`; description `Half off De La Casa quesadillas, including chicken, cheese, or veggie. Dine-in only.`; schedule `Wednesday, starts at 17:00, end time not listed`; price `half off De La Casa quesadilla`; service modes `dine_in=true, takeout=false, delivery=false`.
- Blockers: Carolina Beach out of current public scope; end time missing; source also lists drink special, so public copy must stay food-only; needs reviewer approval and next_check_due/expires_on.

### cand-cb-hoplite-sunday-brunch

- Decision: not ready for current public publish; source-backed if Carolina Beach scope is approved and human review uses cautious menu-special wording.
- Source checked: https://hopliterestaurant.com/brunch-menu/
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/hoplite-brunch-menu-2026-06-03.png`
- Capture: `cap-cb-hoplite-brunch-20260603`
- Public-safe fields if scope-approved: title `HopLite Sunday brunch specials`; description `Sunday brunch menu with breakfast specials such as Classic Breakfast, Loaded Irish Breakfast, French Toast, and Waffles.`; schedule `Sunday, 10:00-14:00`; price `items listed from $9-$14 for captured breakfast specials`; service modes `dine_in=true, takeout=unknown, delivery=unknown`.
- Blockers: Carolina Beach out of current public scope; service modes beyond dine-in not confirmed; this is a menu-special claim rather than a discount claim; needs reviewer approval and next_check_due/expires_on.

### cand-cb-lazy-pirate-ayce-crab-legs

- Decision: not ready.
- Sources checked: https://lazypiratesportsgrill.com/ and https://lazypiratesportsgrill.com/about/
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/lazy-pirate-home-2026-06-03.png`; `ops/research/intake/carolina-beach-2026-06-03/screenshots/lazy-pirate-events-2026-06-03.png`
- Captures: `cap-cb-lazy-pirate-home-20260603`; `cap-cb-lazy-pirate-events-20260603`
- Blockers: official homepage supports all-you-can-eat crab legs and 16:00-20:00 only; official day and price not found; Carolina Beach out of current public scope; needs reviewer approval and next_check_due/expires_on.

### cand-cb-shuckin-thursday-crab-legs

- Decision: not ready.
- Source checked: https://www.theshuckinshack.com/events/thursday-5db408fd
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/shuckin-shack-thursday-event-2026-06-03.png`
- Capture: `cap-cb-shuckin-thursday-event-20260603`
- Blockers: official event supports Thursday and `$29.99 a lb. Crab Legs`, but captured page did not identify Carolina Beach or a time window; Carolina Beach out of current public scope; needs location-specific official evidence or direct confirmation.

### cand-cb-michaels-lunch-specials

- Decision: not ready.
- Source checked: https://mikescfood.com/menu
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/michaels-menu-2026-06-03.png`
- Capture: `cap-cb-michaels-menu-20260603`
- Blockers: official menu shows a Lunch Specials category and item prices, but not a dated or promotional deal; keep as restaurant/source candidate.

### cand-cb-seaworthy-daily-happy-hour

- Decision: not ready.
- Source checked: https://seaworthycb.com/
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/seaworthy-home-2026-06-03.png`
- Capture: `cap-cb-seaworthy-home-20260603`
- Blockers: official page supports broad daily 3-5 happy-hour and food-specials language, but no specific food items or prices; alcohol/drink context requires food-only proof before publication.

### cand-cb-stoked-bacon-jam-gouda-burger

- Decision: not ready.
- Sources checked: official menu https://stokedrestaurant.com/carolina-beach-stoked-restaurant-food-menu; intake Toast URL not used as proof.
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/stoked-official-food-menu-2026-06-03.png`
- Capture: `cap-cb-stoked-official-menu-20260603`
- Blockers: official menu capture did not show Bacon Jam and Gouda Burger lunch special; Toast remains partner/discovery-only; needs official social post or direct confirmation.

### cand-cb-bella-vita-999-lunch-specials

- Decision: not ready.
- Source checked: https://bellavitancb.com/
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/bella-vita-home-2026-06-03.png`
- Capture: `cap-cb-bella-vita-home-20260603`
- Blockers: official website confirms identity as Bella Vita, formerly Uncle Vinny's, but no `$9.99 lunch specials` claim was found; needs dated official social proof or direct confirmation.

### cand-cb-nollies-taco-bundle-pricing

- Decision: not ready.
- Source checked: https://www.facebook.com/nolliescb/
- Evidence: `ops/research/intake/carolina-beach-2026-06-03/screenshots/nollies-facebook-2026-06-03.png`
- Capture: `cap-cb-nollies-facebook-20260603`
- Blockers: Facebook page loaded a title but no readable Taco Tuesday post or pricing proof rendered; snippet-only evidence is not publishable; needs dated official post capture or direct confirmation.
