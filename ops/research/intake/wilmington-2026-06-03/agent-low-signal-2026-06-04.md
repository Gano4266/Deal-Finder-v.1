# Low-Signal On Our Radar Recheck - 2026-06-04

Scope: manual official-source recheck for six Wilmington On Our Radar restaurants that stayed low-signal in the first pass. Research was authorized by the user. This note is intake/review support only.

Guardrails followed:

- Official or official-linked pages only.
- No public fixture CSV edits.
- No deal promotion.
- No automated social scraping.
- AI output is not evidence.
- Regular menu prices are not treated as deals.
- Monkey Junction remains boundary-sensitive before any publication path.

## Summary

All six restaurants remain leads. I did not find a missed official food-special signal with enough exact fields to create a publishable or near-publishable food-deal candidate. The closest weak signal remains The Half's generic seasonal-specials language, but the linked menu and Toast ordering page expose only regular menu items during this pass.

## Results

| restaurant_id | source URLs checked | official location confirmed? | deal signal? | exact fields if yes | blockers | recommendation | next manual action |
|---|---|---:|---|---|---|---|---|
| `winnies-tavern` | https://www.wilmingtonsbestburger.com/ ; https://www.clover.com/online-ordering/winnies-tavern-wilmington | Yes. Official site lists 1895 Burnett Blvd, Wilmington, NC 28401. | No. Official site shows menu, hours, curbside/order link, and "specialty burgers," but that is a regular menu category. Clover page was official-linked but not text-readable in this pass. | None. | No day/time/price/restriction tied to a food special. Partner ordering page needs manual/permission-aware review if inspected further. | `confidence_status=unverified`; `workflow_status=lead` | Keep as source lead. Manual browser or phone check for recurring specials before creating any candidate. |
| `the-half-downtown` | https://www.thehalfbev.com/ ; https://www.thehalfbev.com/menu ; https://order.toasttab.com/online/the-half-wilmington-510-1-2-red-cross-street | Yes. Official site and Toast page identify 510 1/2 Red Cross St, Wilmington, NC 28401. | Weak generic signal only. Homepage mentions seasonal specials, but menu and Toast list regular sandwiches/sides only. | None usable. No specific special item, day, time, discount, or restrictions. | Multi-location risk; generic homepage language does not support a deal row. Toast has regular menu prices only. | `confidence_status=unverified`; `workflow_status=lead` | Direct-confirm whether a current Downtown-only food special exists; capture day/time/price/restrictions if yes. |
| `front-street-brewery` | https://www.frontstreetbrewery.com/ ; https://www.frontstreetbrewery.com/events/ ; https://www.frontstreetbrewery.com/menu/ ; https://order.toasttab.com/online/front-street-brewery-wilmington-9-n-front-st | Yes. Official site lists 9 North Front Street, Wilmington, NC 28401. | No. Happenings page was reachable but contained no food-special text in this pass; menu and Toast expose regular menu/order items. | None. | No official food-special page content visible; regular menu prices only. Alcohol/drinks links are not food-deal evidence. | `confidence_status=unverified`; `workflow_status=lead` | Keep on radar. Recheck official Happenings or call for recurring food specials. |
| `copper-penny` | https://www.copperpennync.com/ ; https://www.copperpennync.com/menu ; https://order.toasttab.com/online/copperpenny | Yes, but the official site has inconsistent ZIP text: 28401 near the hero and 28402 in footer/menu. Street/location are Wilmington. | No food-special signal. Menu and Toast show regular menu items. Alcohol-side text mentions daily draft list/monthly cocktail, which should be suppressed. | None. | No food deal fields. ZIP inconsistency should be cleaned up or noted before relying on location text. | `confidence_status=unverified`; `workflow_status=lead` | Keep as source lead. Direct-confirm any food specials and verify preferred official ZIP/address before candidate work. |
| `pts-grille-monkey-junction` | https://ptsgrille.com/location/monkey-junction/ ; https://ptsgrille.com/menu/ ; https://ptsgrille.com/locations/ | Yes. Official page lists 5916 Carolina Beach Rd, Wilmington, NC 28412. | No. Menu says sandwiches include drink and fries, but this appears to be the standard offering, not a special. | None. | Standard menu bundle only; no discount/day/time. Monkey Junction is boundary-sensitive for publication. | `confidence_status=unverified`; `workflow_status=lead` | Keep ops-only. Direct-confirm any location-specific recurring specials; apply Monkey Junction review gates before publication. |
| `flaming-amys-burrito-barn` | https://flamingamysburritobarn.com/ | Yes. Official site lists 4002 Oleander Drive, Wilmington, NC 28403. | No current food-special signal from the linked official page. The site's "What's our Deal?" section is brand copy, not a deal claim; the linked menu section says the menu is under construction. | None. | No current linked menu/specials fields. Official page links social, but social was not opened or scraped in this pass. | `confidence_status=unverified`; `workflow_status=lead` | Keep as source lead. Direct-confirm or wait for official menu/specials update; do not use unlinked/outdated menu PDFs without reviewer approval. |

## Notes For Next Agents

- Do not infer deals from categories named "specialty," "seasonal," "monthly," or "daily" unless the source ties them to a food special with enough structured fields.
- If a partner ordering page is checked more deeply, preserve permission/terms review notes and do not automate collection.
- If social is needed, keep it manual/browser-assisted and capture volatile evidence with a short freshness window.
