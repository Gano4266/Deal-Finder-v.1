# On Our Radar Continuation Summary - 2026-06-04

Scope: consolidated handoff from the June 4 agent research pass against Wilmington "On our radar" restaurants. This is intake/review support only. No public fixture CSVs were edited, no deals were promoted, and no human approval is implied.

## Ready For Internal Candidate Drafting

These have official or official-linked food-special evidence with enough structure to draft internal candidates after durable capture/review. They still require evidence artifacts, reviewer decisions, public-copy review, freshness metadata, and the normal publish gates before any public fixture work.

| Priority | Restaurant | Candidate direction | Required blocker before promotion |
|---|---|---|---|
| 1 | Cornelia's | Thursday food specials: 6 wings for $10 and smashburgers for $10, 4-9 PM. | Food-only copy; suppress beer/wine references; reviewer decision. |
| 2 | Might As Well Bar & Grill | June 3-9 date-windowed food specials including cheeseburgers, wings, Sunday buffet, appetizer menu, and cheese quesadilla. | Food-only extraction, daily expiry, and review of odd Friday time field. |
| 3 | Sawmill Restaurant | June 3-9 date-windowed food specials including breakfast and daily entree items. | Monkey Junction boundary review; daily expiry; suppress alcohol item. |
| 4 | Fortunate Glass | Weekly food PDF shows soup and flatbread specials with prices. | PDF screenshot/hash capture; suppress wine/beer specials; recheck from PDF date. |
| 5 | Tidewater Oyster Bar | Official-linked Toast has current Daily Specials section with food items/prices. | Same-day/next-day expiry or direct confirmation because date/recurrence is not explicit. |
| 6 | Michaelangelo's Pizza - Monkey Junction | Official specials page shows pizza/slice bundle specials with prices and restrictions. | Screenshot/OCR capture; limited-time freshness handling; Monkey Junction boundary review. |
| 7 | El Cerro Grande - Monkey Junction | Official menu lists Lunch Specials, Mon-Sat 11 AM-2:30 PM, with prices. | Reviewer decision on whether regular lunch-menu specials qualify as deals; Monkey Junction boundary review. |
| 8 | Tomiko-San | Sushi Hour, Tue-Thu, 5-7 PM, with food signal. | Missing prices/exact food list; mixed drink copy needs suppression. |

## Needs Direct Confirmation Or Cleanup First

| Restaurant | Current state | Next action |
|---|---|---|
| Roko Italian Cuisine | Friday/Saturday "House Special" is visible, but no food detail, price, or time. | Call/direct-confirm whether it is food and capture fields. |
| Castle Street Kitchen | Rotating tacos signal exists, but no price/day/time/current item. | Call/direct-confirm current taco feature and recurrence. |
| YoSake | Current official page/menu does not expose exact happy-hour food terms; older PDF is not enough. | Recheck current official PDF/page or direct-confirm. |
| C-Street Mexican Grill | No food-special signal; address/ZIP conflict across fixture, official site, and ChowNow. | Resolve address first, then continue deal research. |

## Keep As Leads

These were rechecked against official or official-linked pages and no usable official food-special signal was found in this pass.

- Winnie's Tavern
- The Half - Downtown
- Front Street Brewery
- Copper Penny
- P.T.'s Olde Fashioned Grille - Monkey Junction
- Flaming Amy's Burrito Barn

## Suggested Next Agent Packet

1. Draft internal `deal-intake.csv`, `source-captures.csv`, and `review-tasks.csv` rows only for Cornelia's, Might As Well, Sawmill, Fortunate Glass, Tidewater, Michaelangelo's, El Cerro, and Tomiko-San.
2. Keep all drafted rows out of public fixtures.
3. Use short freshness for volatile/date-windowed sources:
   - Sawmill and Might As Well: individual date-special `expires_on` equal to special date plus one day.
   - Tidewater Toast daily specials: same-day or next-day expiry unless direct confirmation supports recurrence.
   - Michaelangelo's limited-time image specials: conservative recheck within 7-14 days unless reviewer sets stricter expiry.
4. Open separate direct-confirmation tasks for Roko, Castle Street Kitchen, YoSake, and C-Street.
5. Do not spend more agent time on the six keep-as-lead restaurants until a new official source, direct confirmation, or user tip appears.

## Source Notes Created This Pass

- `agent-high-signal-2026-06-04.md`
- `agent-partial-2026-06-04.md`
- `agent-low-signal-2026-06-04.md`
