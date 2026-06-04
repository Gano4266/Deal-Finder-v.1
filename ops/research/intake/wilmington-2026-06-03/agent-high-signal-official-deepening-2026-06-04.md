# High-Signal Official Lead Deepening

Date checked: 2026-06-04

Scope: Wilmington, NC official restaurant websites/pages only. No social sources, third-party aggregators, partner ordering pages, or AI output were used as evidence. No canonical CSVs or public fixtures were edited.

## Summary

This pass deepened four high-signal official leads: Roko Italian Cuisine, Castle Street Kitchen, Tidewater Oyster Bar, and YoSake.

Result: no new CSV rows should be created from this pass without human/direct confirmation. YoSake is the only source with exact food-special terms, but its exact terms are in an older official static PDF that appears stale or at least not clearly linked from the current live menu. The safer next move is direct confirmation, not intake-row promotion.

## Candidate Readiness

| Restaurant | Official URLs checked | Exact food deal terms? | Candidate readiness | Blocker |
|---|---|---:|---|---|
| Roko Italian Cuisine | https://www.rokoitalian.com/weekly-specials, https://www.rokoitalian.com/menu | No | Not ready | Official weekly page shows alcohol specials Mon-Thu and generic "House Special" Fri/Sat, but no food item, price, restriction, or recurring food terms. |
| Castle Street Kitchen | https://www.castlestkitchen.com/, https://www.castlestkitchen.com/menu | No | Not ready | Official homepage says weekly rotating tacos and asks users to call for the selection. It does not show price, day/time, current item, or restrictions. |
| Tidewater Oyster Bar | https://tidewateroysterbar.com/, https://tidewateroysterbar.com/our-food, https://tidewateroysterbar.com/full-menu, https://tidewateroysterbar.com/steam-pot-menu, https://tidewateroysterbar.com/family-menu, https://tidewateroysterbar.com/about-us | No | Not ready | Official site confirms daily/weekly specials exist, but tells users to check the board, call, follow, or sign up. No exact food-special item, price, date/day, or time window is visible. |
| YoSake | https://yosake.com/, https://yosake.com/wp-content/uploads/sites/2/2025/09/yosake_menu_sept_2025-1.pdf, https://yosake.com/wp-content/static/documents/24-2-16-daily.pdf | Yes, but stale-risk | Needs direct confirmation before row | Official daily-specials PDF has exact food terms, but HTTP metadata shows a 2024 last-modified date, and the current live menu checked on 2026-06-04 has newer standard prices without clearly surfacing the daily-specials PDF. |

## YoSake Exact-Term Lead

Evidence files added:

- `evidence/yosake/daily-specials-pdf-checked-2026-06-04.pdf`
- `evidence/yosake/daily-specials-normalized-2026-06-04.txt`

PDF SHA-256:

```text
f7492dea3a86621cf02ec730f85275ade3d03716455b25102c995b9508f1afe9
```

Exact food terms visible in the official daily-specials PDF:

| Draft lead | Official terms visible | Proposed status | Why not CSV yet |
|---|---|---|---|
| Two For Tuesday specialty rolls | Tuesday; two specialty rolls for $25 | `lead` / direct-confirmation candidate | Older official static PDF; current live menu has newer pricing and does not clearly expose this daily-specials PDF. |
| Thursday noodle night | Thursday; noodle dishes for $12 | `lead` / direct-confirmation candidate | Same stale/linkage risk. |
| Sunday BOGO food special | Sunday; buy one get one up to $10 per person; entrees, curries, and specialty rolls | `lead` / direct-confirmation candidate | Same stale/linkage risk; BOGO restrictions need human review. |
| Daily happy-hour food list | 5 PM-7 PM; Friday/Saturday 10 PM-midnight; not available for takeout or select holidays; itemized food prices visible | `lead` / direct-confirmation candidate | Same stale/linkage risk; many item prices conflict with or predate current live menu pricing. |

Recommended direct-confirmation question:

```text
Hi, I am verifying YoSake's current food specials for a Wilmington dining guide. Are the Two For Tuesday specialty rolls, Thursday $12 noodle dishes, Sunday BOGO up to $10, and 5-7 PM food happy-hour menu still active? If yes, are there any date, holiday, dine-in, or takeout restrictions beyond the PDF wording?
```

## Blocked Lead Notes

### Roko Italian Cuisine

Official page confirms the Wilmington address and hours and has a Weekly Specials page. Food-deal blocker: Friday and Saturday only say "House Special." The exact food item, price, and restrictions are absent. Mon-Thu are alcohol-only specials and should not feed a food-first MVP row.

Recommended next action: direct call/email asking whether Fri/Sat house specials are recurring food specials, what item/price applies, and whether they are dinner-only.

### Castle Street Kitchen

Official homepage confirms the Wilmington address and says the weekly feature is rotating tacos. Food-deal blocker: the page explicitly tells users to call for the current taco selection. It does not provide price, date/day/time, or active selection.

Recommended next action: direct call/email for the current rotating taco feature, price, availability window, and whether it is recurring weekly.

### Tidewater Oyster Bar

Official site confirms Wilmington address and says there are daily/weekly specials, oyster deals, Creole platters, gumbo nights, fresh-catch deals, and family-style feasts. Food-deal blocker: the site does not expose the specific board/special details needed for item, price, date/day/time, and restrictions.

Recommended next action: direct call/email for current board specials and any recurring food-specific specials. Treat Toast/Tock only as partner leads unless an official staff confirmation supports the terms.

## Review Decision

Do not edit `deal-intake.csv`, `source-captures.csv`, `review-tasks.csv`, or `fixtures/prototype/deals.csv` from this pass. The only exact official terms found need freshness/linkage resolution before they become internal `needs_review` rows.
