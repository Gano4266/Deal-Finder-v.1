# Wilmington On Our Radar Partial Candidates - 2026-06-04

Scope: official and official-linked source check for the partial/currentness candidates from the Wilmington On Our Radar handoff. This is intake/review support only. No public fixture rows were promoted.

Guardrails applied:

- AI output is not evidence.
- Official restaurant websites were treated as `tier_1_official`.
- Official-linked ordering/menu platforms were treated as partner evidence, not public approval.
- Alcohol-only items were suppressed.
- Image/PDF evidence needs durable capture before any public use.
- Currentness-sensitive daily specials need quick expiry or direct confirmation.

| restaurant_id | source URL checked | reachable? | official Wilmington identity confirmed? | exact visible fields | blockers | recommendation | next manual action |
|---|---|---:|---:|---|---|---|---|
| `roko-italian-cuisine` | https://www.rokoitalian.com/weekly-specials | yes | yes, 6801-105 Parker Farm Drive, Wilmington, NC 28405 | Fri/Sat: House Special. Mon-Thu visible specials are alcohol-only. | No food detail, price, time, restrictions, or current date beyond page availability. | `confidence_status=probable`; `workflow_status=needs_review` | Directly confirm whether the House Special is food and capture price/time/restrictions. Do not create a public candidate yet. |
| `castle-street-kitchen` | https://www.castlestkitchen.com/ | yes | yes, 509 Castle Street, Wilmington, NC | Weekly Feature: rotating tacos; brunch Sat/Sun 10:00-3:00; weekly drink specials present. | Taco feature lacks day, time, price, current item, and recurrence terms; brunch appears to be normal service, not a deal. | `confidence_status=probable`; `workflow_status=needs_review` | Call or manually confirm current taco feature, price, day/time, and whether it recurs. |
| `fortunate-glass` | https://www.fortunateglass.com/ and official PDF linked as Weekly Specials | yes | yes, 29 South Front Street, Wilmington, NC 28401 | Official PDF has Weekly Food Specials: Chicken Mole Black Bean Soup $18; Spicy Garden Flatbread $18; chef's choice meat/cheese details. | PDF is visual/image-style evidence; no explicit weekday/time; mixed wine/beer specials are present and must be suppressed. | `confidence_status=verified`; `workflow_status=needs_review` | Create food-only internal candidates with PDF screenshot/hash capture and 30-day recheck from the 2026-05-15 PDF URL date. |
| `tidewater-oyster-bar` | https://tidewateroysterbar.com/ and official-linked Toast: https://order.toasttab.com/online/tidewater-oyster-bar | yes | yes, 8211 Market St Unit DD, Wilmington, NC 28411 | Official site mentions daily/weekly specials. Toast has Daily Specials: Shark Bites $16; Tuna Tataki $15; Catch $34; Land $24; Lobster Mac Entree $35; Clam Strips $15. | Toast category gives current menu items/prices but no explicit date, weekday, time window, or recurrence rule. | `confidence_status=verified`; `workflow_status=needs_review` | Create short-lived internal candidates from Toast only with same-day/next-day expiry or direct confirmation. |
| `yosake` | https://yosake.com/ and currently linked 2026 menu PDF | yes | yes, 33 S Front, Wilmington, NC 28401 | Current page/menu shows regular menu items and broad specials-throughout-menu language. Older official static PDF has happy-hour food terms, but it is not the current linked menu. | Current linked source does not show exact happy-hour deal terms; older PDF is stale/conflicting with the current menu. | `confidence_status=unverified`; `workflow_status=needs_recheck` | Directly confirm current happy-hour food terms or find a current official page/PDF before creating a candidate. |
| `c-street-mexican-grill` | https://www.cstreetmex.com/, https://www.cstreetmex.com/menu, and current official-linked ChowNow order URL | yes | yes, but address conflict remains | Official site footer: 4110 Shipyard Blvd.N, Wilmington, NC 28412. Current ChowNow page: 4410 Shipyard Blvd. Regular menu items/prices only. | Fixture has 4110 Shipyard Blvd N, Wilmington, NC 28403; official site, current ChowNow, and fixture disagree. No food-special signal found. | `confidence_status=unverified`; `workflow_status=needs_recheck` | Resolve address/ZIP through direct confirmation or official correction before deal research. Keep as lead only. |

## Candidate Decisions

- Enough to create internal candidates after capture/review: `fortunate-glass`, `tidewater-oyster-bar`.
- Keep as partial/direct-confirmation leads: `roko-italian-cuisine`, `castle-street-kitchen`.
- Keep as needs recheck, no internal candidate yet: `yosake`, `c-street-mexican-grill`.

No public fixture CSVs were edited.
