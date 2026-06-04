# Wilmington On Our Radar Public Copy Drafts - Unapproved - 2026-06-04

Scope: food-only public-copy preparation for selected Wilmington On Our Radar intake candidates.

This is an operator review artifact only. These drafts do not approve, promote, or publish any deal. AI output is not evidence. Public fixture CSVs must remain unchanged unless a human reviewer later completes the normal source, review, copy, freshness, and publication gates.

Shared gates that remain closed for all candidates below:

- `workflow_status=needs_review`
- `mvp_publish_eligible=false`
- `public_copy_approved=false`
- `review_decision` blank
- No `published_at`

## Copy Rules For This Packet

- Food-only copy only.
- Do not mention alcohol, beer, wine, happy-hour drinks, or mixed drink/source terms.
- Do not claim "best," "guaranteed," "always," "available now," "verified today," or "current" unless the final reviewer has checked freshness for the publication date.
- Do not infer savings, discount size, regular menu price, portions beyond source fields, service modes beyond source fields, or recurrence beyond source fields.
- If approved later, public copy must carry the source-backed restrictions and an appropriate `expires_on` or `next_check_due`.

## Cornelia's - Thursday Wings

Candidate: `cand-wilmington-cornelias-thu-wings-2026-06-04`

Source fields available:

- Source: Cornelia's official menus page.
- Food term: 6 wings for $10.
- Day/time: Thursday, 4-9 PM.
- Price: $10.
- Service: dine-in is marked true; takeout is marked false.
- Evidence: screenshot, normalized text, evidence note, and hashes captured under `evidence/cornelias/`.

Title options:

- `Thursday 6 Wings For $10 At Cornelia's`
- `Cornelia's Thursday Wing Special`
- `$10 Wings At Cornelia's On Thursdays`

Description options:

- `Cornelia's lists 6 wings for $10 on Thursdays from 4-9 PM. Dine-in only based on the current intake row.`
- `Thursday food-only draft: 6 wings for $10 at Cornelia's, listed for 4-9 PM.`
- `Cornelia's official menus page supports a Thursday 4-9 PM wing special: 6 wings for $10.`

Required caveats if later approved:

- Include Thursday and 4-9 PM.
- Include dine-in only unless reviewer confirms otherwise.
- Keep the copy food-only.
- Use a `next_check_due` no later than the intake value of `2026-07-04`.

Forbidden claims:

- Do not mention the source heading's alcohol-adjacent language.
- Do not claim public access is open to everyone.
- Do not claim takeout availability.
- Do not describe sauce choices, wing count beyond "6," regular price, or savings.

Exact blockers:

- Human review still required.
- Public copy not approved.
- Public access at The Davis Community remains unconfirmed.
- Restrictions are incomplete.
- Alcohol-adjacent source terms must be suppressed.

## Cornelia's - Thursday Smashburgers

Candidate: `cand-wilmington-cornelias-thu-smashburger-2026-06-04`

Source fields available:

- Source: Cornelia's official menus page.
- Food term: $10 smashburgers.
- Day/time: Thursday, 4-9 PM.
- Price: $10.
- Service: dine-in is marked true; takeout is marked false.
- Evidence: same Cornelia's screenshot, normalized text, evidence note, and hashes as the wings candidate.

Title options:

- `$10 Smashburgers At Cornelia's On Thursdays`
- `Cornelia's Thursday Smashburger Special`
- `Thursday $10 Smashburgers At Cornelia's`

Description options:

- `Cornelia's lists $10 smashburgers on Thursdays from 4-9 PM. Dine-in only based on the current intake row.`
- `Thursday food-only draft: $10 smashburgers at Cornelia's, listed for 4-9 PM.`
- `Cornelia's official menus page supports a Thursday 4-9 PM smashburger special priced at $10.`

Required caveats if later approved:

- Include Thursday and 4-9 PM.
- Include dine-in only unless reviewer confirms otherwise.
- Keep the copy food-only.
- Use a `next_check_due` no later than the intake value of `2026-07-04`.

Forbidden claims:

- Do not mention alcohol-adjacent source language.
- Do not claim public access is open to everyone.
- Do not claim takeout availability.
- Do not infer toppings, sides, burger size, regular price, or savings.

Exact blockers:

- Human review still required.
- Public copy not approved.
- Public access at The Davis Community remains unconfirmed.
- Restrictions are incomplete.
- Alcohol-adjacent source terms must be suppressed.

## Fortunate Glass - Chicken Mole Black Bean Soup

Candidate: `cand-wilmington-fortunate-glass-chicken-mole-soup-2026-06-04`

Source fields available:

- Source: Fortunate Glass official Weekly Specials PDF linked from the homepage.
- Food item: Chicken Mole Black Bean Soup.
- Description ingredients are present in normalized evidence text.
- Price field in intake: $18.
- No day or time window found in captured PDF text.
- Evidence: homepage HTML, official PDF, normalized text, evidence note, hashes captured under `evidence/fortunate-glass/`.

Title options:

- `Fortunate Glass Chicken Mole Black Bean Soup`
- `$18 Chicken Mole Black Bean Soup At Fortunate Glass`
- `Fortunate Glass Weekly Soup Special`

Description options:

- `Fortunate Glass' Weekly Specials PDF lists Chicken Mole Black Bean Soup at $18. Day and time limits still need review before publication.`
- `Food-only draft: Chicken Mole Black Bean Soup at Fortunate Glass, with the intake price recorded as $18.`
- `Fortunate Glass lists Chicken Mole Black Bean Soup in its weekly food specials PDF. Reviewer must confirm price formatting and any timing limits.`

Required caveats if later approved:

- Do not publish without deciding whether the PDF's bare `18` should be rendered as `$18`.
- If no day/time is confirmed, use copy that does not imply a daily or nightly availability window.
- Keep wine, beer, THC, and other non-food specials out of public copy.
- Use the intake `next_check_due` of `2026-06-14` or a stricter reviewer-selected date.

Forbidden claims:

- Do not claim a discount, savings, happy hour, or limited-time deal unless reviewer confirms that framing.
- Do not mention alcohol, wine, beer, THC, or pairing language.
- Do not claim dine-in/takeout details beyond the current row.
- Do not say it is available today or tonight without same-day review.

Exact blockers:

- Human food-only review still required.
- Public copy not approved.
- PDF visual evidence requires review.
- Day/time window is missing.
- Restrictions are missing.
- Price formatting needs reviewer confirmation.
- Alcohol suppression required.

## Michaelangelo's Pizza - Monkey Junction - 2 Cheese Slices And Fountain Drink

Candidate: `cand-wilmington-michaelangelos-mj-slices-drink-2026-06-04`

Source fields available:

- Source: Michaelangelo's official specials page and image asset.
- Food/combo term: 2 cheese slices plus fountain drink.
- Price: $6.99.
- Service restriction: dine in or pick up only.
- Page restrictions: cannot combine offers; limited time; premium toppings may cost extra; prices subject to change.
- Location: Village at Myrtle Grove, 5617 Carolina Beach Rd #110, Wilmington, NC 28412.
- Evidence: page screenshot, HTML archive, exact image asset, normalized OCR text, evidence note, and hashes under `evidence/michaelangelos-pizza-monkey-junction/`.

Title options:

- `2 Cheese Slices And A Fountain Drink For $6.99`
- `Michaelangelo's Slice And Drink Special`
- `$6.99 Cheese Slice Combo At Michaelangelo's`

Description options:

- `Michaelangelo's Monkey Junction specials page lists 2 cheese slices plus a fountain drink for $6.99, dine-in or pickup only.`
- `Food-only draft: 2 cheese slices and a fountain drink for $6.99 at Michaelangelo's Pizza - Monkey Junction.`
- `Michaelangelo's official image special supports a $6.99 combo with 2 cheese slices and a fountain drink.`

Required caveats if later approved:

- Include "dine in or pick up only."
- Include "cannot combine offers," "limited time," "premium toppings may cost extra," and "prices subject to change" where the public UI supports restrictions.
- Use the intake `expires_on=2026-06-18` and `next_check_due=2026-06-11`, or stricter reviewer dates.
- Confirm Monkey Junction/Wilmington boundary approval before any public publication.

Forbidden claims:

- Do not claim delivery availability.
- Do not omit the limited-time and cannot-combine restrictions.
- Do not infer topping eligibility beyond cheese slices.
- Do not publish without reviewer OCR verification against saved image evidence.

Exact blockers:

- Human review still required.
- Public copy not approved.
- Image-based price requires reviewer OCR/screenshot verification.
- Limited-time offer has no official end date.
- Monkey Junction boundary review required before publication.

## Might As Well Bar & Grill - June 4 Cheeseburgers

Candidate: `cand-wilmington-might-as-well-cheeseburgers-2026-06-04`

Source fields available:

- Source: Might As Well Wilmington official specials page.
- Food term: $5.99 cheeseburgers.
- Date: Thursday, June 4, 2026.
- Time window: 12:00 PM-02:00 AM in source capture.
- Price: $5.99.
- Evidence: normalized text and hash under `evidence/might-as-well/`.
- Alcohol-adjacent source copy is present and excluded from this candidate.

Title options:

- `$5.99 Cheeseburgers At Might As Well`
- `Might As Well June 4 Cheeseburger Special`
- `Thursday Cheeseburgers At Might As Well`

Description options:

- `Might As Well's official specials page listed $5.99 cheeseburgers for Thursday, June 4, with a 12 PM-2 AM source window.`
- `Food-only draft for June 4: $5.99 cheeseburgers at Might As Well. Alcohol source text must stay excluded.`
- `Might As Well listed a June 4 cheeseburger special at $5.99; publish only with same-day review.`

Required caveats if later approved:

- Treat as a date-specific June 4, 2026 item.
- Include the source time window only after reviewer checks that it applies to the food item.
- Must expire by `2026-06-05` unless newer evidence extends it.
- Keep alcohol-adjacent source text out of public copy.

Forbidden claims:

- Do not mention beer or drink specials.
- Do not call it recurring or weekly.
- Do not publish after `2026-06-05` from this evidence packet.
- Do not say "tonight" unless publishing on June 4 after human review.

Exact blockers:

- Human review still required.
- Public copy not approved.
- Volatile date-windowed source.
- Screenshot missing; normalized text artifact only.
- Alcohol-adjacent source terms must be suppressed.
- Expires next day if not approved on time.

## Sawmill Restaurant - June 4 Pasta Night

Candidate: `cand-wilmington-sawmill-pasta-night-2026-06-04`

Source fields available:

- Source: Sawmill Restaurant official daily specials page.
- Food term: Pasta Night.
- Date: Thursday, June 4, 2026.
- Time window: 07:00 AM-08:00 PM.
- Price: not shown in source.
- Exact dish details: not shown in source.
- Evidence: normalized text and hash under `evidence/sawmill-restaurant/`.
- Location: Monkey Junction / 5611 Carolina Beach Rd, Wilmington, NC 28412.

Title options:

- `Sawmill Pasta Night`
- `Sawmill June 4 Pasta Night`
- `Thursday Pasta Night At Sawmill`

Description options:

- `Sawmill's official daily specials page listed Pasta Night for Thursday, June 4, with a 7 AM-8 PM source window. Price and dish details need confirmation.`
- `Food-only draft: Sawmill listed Pasta Night on June 4. Do not publish without price and item details.`
- `Sawmill's daily specials page supports a June 4 Pasta Night listing, but the current evidence does not show price or exact pasta dishes.`

Required caveats if later approved:

- Treat as a date-specific June 4, 2026 item.
- Do not publish without direct confirmation or reviewer acceptance of missing price/details.
- Must expire by `2026-06-05` unless newer evidence extends it.
- Complete Monkey Junction boundary review before publication.

Forbidden claims:

- Do not include a price.
- Do not name a specific pasta dish.
- Do not call it recurring or weekly.
- Do not publish after `2026-06-05` from this evidence packet.
- Do not say "tonight" unless publishing on June 4 after human review.

Exact blockers:

- Human review still required.
- Public copy not approved.
- Price missing.
- Exact item details missing.
- Screenshot missing; normalized text artifact only.
- Date-windowed source expires next day.
- Monkey Junction boundary review required.

## Do Not Draft Public Copy Yet

### Tomiko-San - Sushi Hour

Candidate: `cand-wilmington-tomiko-san-sushi-hour-2026-06-04`

Do not draft public copy yet.

Reason:

- Exact food items are missing.
- Prices are missing.
- Source is mixed food/drink and requires copy suppression.
- Durable capture is missing.
- Current row is `verified` / `needs_review`, but not publication-ready.

Next blocker-clearing action:

- Capture screenshot/archive/hash and direct-confirm or source-confirm food items and prices.

### El Cerro Grande - Monkey Junction - Lunch Specials

Candidate: `cand-wilmington-el-cerro-mj-lunch-specials-2026-06-04`

Do not draft public copy yet.

Reason:

- Reviewer must decide whether a regular lunch-menu category qualifies as a deal under the Deal Value Gate.
- Durable capture is missing.
- Monkey Junction boundary review is required.
- Prices vary by item.
- Current row is `verified` / `needs_review`, but not publication-ready.

Next blocker-clearing action:

- Capture screenshot/archive/hash, complete Monkey Junction boundary review, and make a deal-value decision before any public wording.

### Tidewater Oyster Bar - Daily Specials

Candidate: `cand-wilmington-tidewater-daily-specials-food-2026-06-04`

Do not draft public copy yet.

Reason:

- Exact item list came from a `tier_3_partner` Toast page.
- Confidence is `probable`, not `verified`.
- Durable capture is partial.
- Date, weekday, time window, recurrence, and restrictions are unclear.
- Direct confirmation is recommended before publication.

Next blocker-clearing action:

- Capture partner evidence and/or direct-confirm active food specials with Tidewater, then set same-day or next-day expiry if the item remains date-specific.

## Reviewer Handoff

Strongest copy-readiness, still unapproved:

- Cornelia's wings and smashburgers: source-backed but blocked by public-access review and restrictions.
- Michaelangelo's slice/drink: source-backed with durable image evidence, blocked by OCR verification, limited-time freshness, and Monkey Junction boundary review.
- Fortunate Glass soup: source-backed with durable PDF evidence, blocked by missing day/time/restrictions and price-format review.

Most volatile:

- Might As Well cheeseburgers: expires `2026-06-05`.
- Sawmill Pasta Night: expires `2026-06-05`; price and item details are missing.

No approval fields should be changed based on this document alone.
