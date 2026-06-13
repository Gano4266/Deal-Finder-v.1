# Consolidated Source Gap Summary - 2026-06-13

Scope: active Wilmington and Carolina Beach public prototype restaurants. Southport remains parked. This is a leads-only research scan; it does not approve, promote, publish, or replace fixture evidence.

AI output is not evidence. Every lead below still needs durable official evidence capture, source check wiring, review metadata, food-only public copy, freshness metadata, and validation before any public fixture work.

## Coverage Baseline

- Active restaurants scanned: 51
- Restaurants with at least one public deal: 31
- Restaurants with no public deals: 20
- Batch reports:
  - `batch-1-downtown-core.md`
  - `batch-2-midtown-north.md`
  - `batch-3-south-monkey-junction.md`
  - `batch-4-beaches-new-promotions.md`
  - `no-deal-keyword-scan.md`

## Best Next Capture Candidates

These are the cleanest official-source leads to turn into intake rows or refreshed source captures next.

| Priority | Restaurant | Lead | Source | Why this is next | Main blocker |
|---:|---|---|---|---|---|
| 1 | Katy's Grill & Bar | Monday-Friday lunch/dinner food specials, including half-price burgers and chicken sandwiches | https://katysbarandgrill.com/weekly-specials/ | Official page, multiple price-bearing food specials, existing fixture only covers breakfast | Needs durable capture and separate review rows |
| 2 | Coquina Fishbar | $14 daily lunch specials with fountain beverage | https://coquinafishbar.com/daily-lunch-specials/ | Official page, clear price, time window, food items | Decide one broad row vs day-specific rows |
| 3 | Cornelia's | Thursday 6 for $10 wings and $10 smashburgers | https://corneliasrestaurant.com/menus/ | Official source, explicit Thursday food prices | Suppress beer language; confirm service restrictions |
| 4 | South Front Tavern | Mon-Fri $5 happy hour bar bites | https://www.southfronttavern.com/ | Official source expands existing Friday-only fixture coverage | Needs eligible item/public-copy decision and supersede strategy |
| 5 | Ponysaurus Wilmington | Thursday $5 flat breads | https://www.ponysaurusbrewing.com/ilm | Official source, missing from current Monday-Wednesday coverage | Time/restriction review and food-only copy |
| 6 | Caprice Bistro | Wednesday $15 fromage/charcuterie board | https://www.capricebistro.com/weekly-specials | Official source, clear price | Time/restrictions missing; suppress wine/date-night context |
| 7 | Might As Well | June 14-18 date-windowed food specials | https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials | Official source and current date-windowed food prices | Very short expiry; suppress alcohol/event copy |

## Strong But Needs Product Review

| Restaurant | Lead | Source | Review reason |
|---|---|---|---|
| Block Taco | Pizza Box, 10 tacos plus chips/dips for $55 | https://blocktaco.com/ | Group-pack value fit needs reviewer decision |
| Za Pie Pizzeria | Cheesy Trio and Red Di Riso Di specials | https://www.zapie.com/ | Standing specials need recurrence/restriction review; Monkey Junction sensitivity applies |
| Melting Pot Wilmington | Military Monday food discount | https://www.meltingpot.com/wilmington-nc/melting-pot-events.aspx | Restricted audience and "up to" discount copy |
| K38 locations | Tuesday special-priced fajitas | K38 location pages | Official but missing exact price/base price |
| Whiskey Trail | Sunday wings/Yuengling bundle | https://whiskeytrailsportspub.com/wilmington-whiskey-trail-happy-hours-specials/ | Price includes alcohol; food-only value needs direct confirmation |
| Tomiko-San | Sushi Hour bites and rolls | https://www.tomiko-san.com/event/sushi-hour/ | Food-adjacent but lacks price/item detail |

## Boundary-Sensitive Leads

Monkey Junction rows require confirmed Wilmington relevance, official evidence or direct confirmation, review approval, public copy approval, freshness metadata, and full public fixture filtering before publication.

| Restaurant | Lead | Source | Notes |
|---|---|---|---|
| Michaelangelo's Pizza - Monkey Junction | Multiple image-based pizza specials | https://www.michaelangelosmj.com/specials | Strong official source, but needs screenshot/OCR capture and boundary review |
| El Cerro Grande - Monkey Junction | Mon-Sat lunch specials | https://elcerrogranderestaurant.com/menu | May be regular lunch menu rather than special; boundary review required |
| Cape Fear Seafood - Monkey Junction | Weekend brunch specials | https://capefearseafoodcompany.com/locations/monkey-junction/ | Needs price/detail capture and deal-value review |
| Sawmill Restaurant | Daily-special page | https://thesawmillrestaurant.com/daily-specials/ | Source showed stale June 4-10 style windows in agent scan; rough local scan saw June 12-13 text, so fresh manual capture is required before any intake |

## Social Or Direct-Confirmation Leads Only

These are not evidence yet because the agent could not read the owned-social source directly, or only a search/snippet was available.

| Restaurant | Possible lead | Source type | Required next action |
|---|---|---|---|
| Winnie's Tavern | Half-price appetizers Mon-Thu 4-6 PM | restaurant-owned Facebook/Instagram snippets | Manual social capture or direct confirmation |
| C-Street Mexican Grill | Lunch specials / burrito specials | restaurant-owned Instagram snippets | Manual social capture/direct confirmation and source/location conflict review |
| Flaming Amy's Burrito Barn | Same-day chimichanga / taco Tuesday snippets | restaurant-owned Facebook snippets | Manual social capture/direct confirmation; short expiry if current |
| Tidewater Oyster Bar | Daily/weekly specials exist | official website language | Direct confirmation or specific official post with exact terms |

## No New Lead Found Or Already Covered

Agents found no additional official food-special lead beyond current coverage for:

- Rx Chicken & Oysters
- Beat Street
- Hell's Kitchen
- Front Street Brewery
- Tacobaby
- Copper Penny
- The Cardinal
- True Blue Butcher & Table
- True Blue Butcher & Barrel
- Rebellion NC
- Shuckin' Shack Wilmington
- Islands Fresh Mex Monkey Junction
- Italian Bistro Monkey Junction
- P.T.'s Olde Fashioned Grille Monkey Junction
- Blue Surf Cafe
- Fentoni's Pizza
- HopLite Irish Pub
- Fire Bowl lunch-special menu beyond the already-promoted row

## Recheck Notes

- Beer Barrio: official specials page still appears date-specific/stale for the prior pork taco lead. Treat as `needs_recheck` or direct-confirm before any public work.
- Fortunate Glass: official weekly-special PDF remains a lead, but day/time/restriction handling is incomplete.
- YoSake: older daily-specials PDF is stale-risk evidence and should not be used without direct confirmation.
- Existing approved rows in the scan were not contradicted by official pages, but normal scheduled `next_check_due` reviews still apply.

## Recommended Next Work Packet

1. Build an intake capture packet for Katy's weekly lunch/dinner specials, Coquina $14 daily lunch specials, and Cornelia's Thursday wings/burgers.
2. Capture durable official evidence and screenshots for those sources.
3. Add source captures/checks/deal-intake/review tasks as `needs_review`, not public.
4. Run `npm run research:validate -- ops/research/intake/wilmington-2026-06-13`.
5. Only after review, consider a narrow promotion packet.
