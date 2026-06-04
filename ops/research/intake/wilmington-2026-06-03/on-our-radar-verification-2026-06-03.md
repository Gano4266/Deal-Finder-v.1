# Wilmington On Our Radar Verification - 2026-06-03

Scope: manual official-source verification kickoff for Wilmington restaurants currently appearing in the public `/restaurants` "On our radar" bucket. This note is intake/review support only. No public fixture rows were promoted.

Policy guardrails applied:

- AI output is not evidence.
- Official restaurant sources and official-linked ordering/menu pages were treated as source checks only.
- Third-party/platform pages remain lead support unless official-linked and manually reviewed.
- Monkey Junction rows remain boundary-sensitive and need explicit review before publication.
- Date-windowed specials need short expiry/recheck handling.
- Mixed food/alcohol sources need food-only public copy review.

## Current Radar Count

- Wilmington On Our Radar: 19 restaurants.
- Carolina Beach On Our Radar: 0 restaurants in the current fixture state because Fentoni's, K38, and HopLite already have approved public deal rows.

## Strongest Wilmington Review Candidates

| Restaurant | Official source checked | Food-special signal | Current recommendation | Next action |
|---|---|---|---|---|
| Cornelia's | https://corneliasrestaurant.com/menus/ | Weekly specials 4-9 PM; Thursday includes 6 for $10 wings and $10 smashburgers; Tuesday/Wednesday/Saturday need more detail. | `confidence_status=verified`; `workflow_status=needs_review` | Create food-only internal candidates; confirm Tue/Wed/Sat prices/details before publication. |
| Rooster & The Crow | https://roosterandthecrow.com/wilmington-downtown-rooster-and-the-crow-happy-hours-specials | Date-specific June 3 meatloaf special with 4:30-8:30 PM window; price missing. | `confidence_status=verified`; `workflow_status=needs_review` | Treat as same-day/short-lived candidate; confirm price and set quick expiry. |
| Tomiko-San | https://www.tomiko-san.com/event/sushi-hour/ | Sushi Hour, Tuesday-Thursday, 5-7 PM; food signal present, mixed food/drink context, no prices visible. | `confidence_status=verified`; `workflow_status=needs_review` | Review food-only copy and confirm item/pricing terms. |
| Sawmill Restaurant | https://thesawmillrestaurant.com/daily-specials/ | June 3-9 date-windowed specials with food items/times/prices visible. | `confidence_status=verified`; `workflow_status=needs_review` | Boundary/freshness review; only create short-lived rows with expiry/recheck. |
| El Cerro Grande - Monkey Junction | https://elcerrogranderestaurant.com/monkeyjunction and https://elcerrogranderestaurant.com/menu | Lunch specials, Monday-Saturday, 11 AM-2:30 PM; item prices visible. | `confidence_status=verified`; `workflow_status=needs_review` | Boundary-sensitive review; decide whether menu lunch specials qualify as publishable deal rows. |
| Michaelangelo's Pizza - Monkey Junction | https://www.michaelangelosmj.com/specials | Image-based specials visible, including slice/drink and pizza bundle prices; restrictions visible. | `confidence_status=verified`; `workflow_status=needs_review` | Manual capture/OCR, freshness review, and Monkey Junction review before promotion. |
| Might As Well Bar & Grill | https://wilmington.mightaswellbarandgrill.com/wilmington-might-as-well-bar-and-grill-wilmington-happy-hours-specials | June 3-9 food signals include cheeseburgers, wings, Sunday buffet, appetizer menu, and cheese quesadilla; mixed alcohol terms present. | `confidence_status=verified`; `workflow_status=needs_review` | Food-only copy review; date-window expiry/recheck required. |

## Partial Or Needs Direct Confirmation

| Restaurant | Official source checked | Finding | Current recommendation | Next action |
|---|---|---|---|---|
| Roko Italian Cuisine | https://www.rokoitalian.com/weekly-specials | Friday/Saturday "House Special" visible, but no food detail, price, or time; Mon-Thu are alcohol-only. | `confidence_status=probable`; `workflow_status=needs_review` | Directly confirm whether House Special is food and capture price/time/restrictions. |
| Castle Street Kitchen | https://www.castlestkitchen.com/ | "Weekly Feature" says rotating tacos, but no day/time/price. | `confidence_status=probable`; `workflow_status=needs_review` | Directly confirm current taco feature, price, day/time, and recurrence. |
| Fortunate Glass | https://www.fortunateglass.com/ | Official page exposes a Weekly Food Specials link/PDF, but exact fields need visual/PDF review. | `confidence_status=probable`; `workflow_status=needs_recheck` | Manually inspect the PDF or call for current food specials; suppress alcohol-only items. |
| Tidewater Oyster Bar | https://tidewateroysterbar.com/ | Mentions daily/weekly specials, but no exact items/day/price on the checked page. | `confidence_status=probable`; `workflow_status=lead` | Call or directly confirm current food specials before creating a candidate. |
| YoSake | https://yosake.com/ | Page has menu/specials language, but no exact recurring food-deal terms visible in the pass. | `confidence_status=unverified`; `workflow_status=needs_recheck` | Recheck official menu/PDF or direct-confirm any happy-hour food terms. |
| C-Street Mexican Grill | https://www.cstreetmex.com/ | No food-special signal found; menu is mostly image-based; official ZIP appears to differ from fixture. | `confidence_status=unverified`; `workflow_status=needs_recheck` | Recheck address/ZIP and manually inspect official menu/order source for food specials. |

## Keep As Source Leads

| Restaurant | Official source checked | Finding | Current recommendation | Next action |
|---|---|---|---|---|
| Winnie's Tavern | https://www.wilmingtonsbestburger.com/ | Regular menu/ordering source only; no food-special signal found. | `confidence_status=unverified`; `workflow_status=lead` | Manual browser or phone check before creating any candidate. |
| The Half - Downtown | https://www.thehalfbev.com/ | Weak "seasonal specials" language only; no exact special fields. | `confidence_status=unverified`; `workflow_status=lead` | Check current specials manually or direct confirm. |
| Front Street Brewery | https://www.frontstreetbrewery.com/ | Regular menu/order source only; no special/deal signal found. | `confidence_status=unverified`; `workflow_status=lead` | Check official happenings or direct confirmation for recurring food specials. |
| Copper Penny | https://www.copperpennync.com/ | Standard menu and identity only; no special/day/time/price signal found. | `confidence_status=unverified`; `workflow_status=lead` | Keep as source lead until official special or direct confirmation exists. |
| P.T.'s Olde Fashioned Grille - Monkey Junction | https://ptsgrille.com/location/monkey-junction/ | Menu identity only; no special/day/price discount signal found. | `confidence_status=unverified`; `workflow_status=lead` | Keep ops-only until official special or direct confirmation exists. |
| Flaming Amy's Burrito Barn | https://flamingamysburritobarn.com/ | Location/menu identity only; no current food-special terms found. | `confidence_status=unverified`; `workflow_status=lead` | Direct-confirm or wait for official menu/specials update. |

## Carolina Beach Reconciliation

The current public fixture state has no Carolina Beach "On our radar" restaurants. Carolina Beach source-backed rows already promoted to public fixtures are Fentoni's weekday lunch special, K38 Monday food specials, K38 Wednesday quesadilla special, and HopLite Sunday brunch specials.

Remaining Carolina Beach blocked candidates from `ops/research/intake/carolina-beach-2026-06-03/` include Lazy Pirate, Shuckin' Shack, Michael's Seafood, Seaworthy, Stoked, Bella Vita, and Nollie's. The Carolina Beach intake notes contain stale "out of scope" language predating the June 3 broad-scope decision and should be cleaned up separately.
