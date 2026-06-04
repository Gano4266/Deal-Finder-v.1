# Direct Confirmation Scripts - Wilmington On Our Radar - 2026-06-04

Purpose: prepare manual direct-confirmation calls or emails for unresolved Wilmington On Our Radar items. This file is prep only. Do not treat these scripts, AI summaries, or unplaced calls as evidence.

Publication gates stay closed until a reviewer records direct confirmation, creates or updates the appropriate intake evidence rows, and makes a separate human review decision.

## Operator Ground Rules

- Do not ask leading questions that imply a deal exists.
- Confirm the restaurant location before asking about specials.
- Capture exact wording when possible, especially price, day, time, restrictions, and whether the special is recurring or date-limited.
- Suppress alcohol-only terms from food-deal candidates and public copy.
- If the staff member is unsure, record the answer as inconclusive and route to `needs_recheck`.
- If the answer conflicts with the website, preserve both facts and route to review.
- Direct confirmation can support `confidence_status=verified`, but it does not approve or publish a deal by itself.

## Base Phone Script

Hello, I am checking current restaurant information for a local food-specials review. I am not placing an order. Could I confirm a few details about your Wilmington location and any current food specials?

If they ask who this is for: I am preparing an internal review note for Forkcast / Deal Finder, a local Wilmington restaurant deal guide. We only want to list accurate food specials with the restaurant's confirmed terms.

Before ending: Could I have your first name or role for the confirmation note? I will record only the confirmation details needed for review.

## Fields To Capture Every Time

- `confirmed_at`: date/time of call or email, with timezone.
- `confirmed_by`: operator name or initials.
- `confirmation_method`: phone, email, in-person, website contact form, or other.
- `restaurant_contact_name_or_role`: first name, manager/server/host, or "declined".
- `restaurant_id` and exact location confirmed.
- `direct_confirmation_id`: suggested format `dc-wilmington-<restaurant-id>-<topic>-YYYY-MM-DD`.
- `source_tier`: use `tier_1_direct_confirmation` only after actual restaurant confirmation is recorded.
- Exact confirmation note, written as factual notes, not AI interpretation.
- Food item or special title.
- Price or discount, if confirmed.
- Days/dates available.
- Start and end time.
- Recurrence: one-day, weekly, daily, limited-time, seasonal, or unknown.
- Dine-in, takeout, delivery applicability.
- Restrictions, exclusions, and "cannot combine" terms.
- Whether alcohol terms were mentioned and excluded.
- Expiration date or next recheck date.
- Conflicts with existing website, partner page, fixture address, or older source.

## How To Record Direct Confirmation Later

When a real confirmation happens, create or update evidence records before any review decision:

- In `source-captures.csv`, add a capture with `capture_method=manual_direct_confirmation`, `evidence_type=direct_confirmation_note`, and `source_url=direct-confirmation:<method>`.
- Put the exact human confirmation note in `extracted_text_or_confirmation_note`.
- Set `content_hash` from normalized confirmation text.
- If a durable note file is created, set `archive_url_or_path` to that file and include `metadata_json.evidence_file_sha256`.
- In `deal-intake.csv`, set `direct_confirmation_id` for any candidate supported by the call, keep `workflow_status=needs_review`, and do not set `mvp_publish_eligible=true`.
- In `review-tasks.csv`, reference the `direct_confirmation_id`, keep `status=open`, and leave `decision` blank until a human reviewer decides.
- If the call disproves a candidate, route the candidate/task to review for possible `rejected`, `expired`, or `needs_recheck`; do not silently remove the trail.

## C-Street Mexican Grill

Open blocker: address/ZIP conflict across fixture, official site, and partner ordering source; no usable food-special signal.

Suggested `direct_confirmation_id`: `dc-wilmington-c-street-mexican-grill-address-specials-2026-06-04`

Phone script:

Hello, I am verifying current location and food-special information for C-Street Mexican Grill in Wilmington. Could you confirm the exact street address and ZIP code for your current restaurant location?

Exact questions:

- What is the current official address, including ZIP code?
- Is `4110 Shipyard Blvd N` correct?
- Is the ZIP `28403`, `28412`, or another ZIP?
- Is the ChowNow/ordering page currently maintained by your restaurant?
- Do you currently offer any food specials, lunch specials, daily specials, or recurring food discounts?
- If yes, what is the exact item or special name?
- What is the price or discount?
- What days and times does it run?
- Is it recurring, limited-time, or only available today?
- Does it apply to dine-in, takeout, delivery, or online ordering?
- Are there exclusions, add-on charges, or restrictions?

Fields to capture:

- Confirmed official address and ZIP.
- Whether partner ordering URL is official/current.
- Whether there is any current food-special signal.
- If a special exists: exact title, item, price, day/time, recurrence, restrictions, service mode, expiration/recheck date.
- If no special exists: record "restaurant confirmed no current food specials" with date/time/contact.

Review routing:

- Resolve address before creating any deal candidate.
- If address remains inconsistent, keep source status blocked and route to review.

## Roko Italian Cuisine

Open blocker: Friday/Saturday "House Special" appears on official page but lacks food detail, price, time, and restrictions.

Suggested `direct_confirmation_id`: `dc-wilmington-roko-italian-cuisine-house-special-2026-06-04`

Phone script:

Hello, I am checking whether Roko's Friday and Saturday House Special is a current food special and what the exact terms are for review.

Exact questions:

- Is the Friday/Saturday House Special currently active?
- Is it a food special, drink special, or both?
- What is the current dish or item included?
- What is the price?
- What time does it start and end?
- Is it available every Friday and Saturday or only on certain dates?
- Is it dine-in only?
- Are reservations, minimum purchase, or limited quantities involved?
- Are there alcohol terms that should be excluded from a food-only listing?
- When should this be rechecked?

Fields to capture:

- Food-only status.
- Item name/details.
- Price.
- Friday/Saturday applicability.
- Time window.
- Recurrence and freshness.
- Restrictions and exclusions.
- Staff role/name and confidence.

Review routing:

- If food item or price is not confirmed, keep as source task only and do not create a deal row.

## Castle Street Kitchen

Open blocker: rotating taco feature exists as a signal, but current item, price, day, time, and recurrence are missing.

Suggested `direct_confirmation_id`: `dc-wilmington-castle-street-kitchen-rotating-tacos-2026-06-04`

Phone script:

Hello, I am verifying Castle Street Kitchen's rotating taco feature for a food-special review. Could you confirm the current taco special and when it is available?

Exact questions:

- Do you currently have a rotating taco feature or taco special?
- What is the current taco or feature item?
- What is the price?
- Which days is it available?
- What time window applies?
- Is it weekly, seasonal, or changed at staff discretion?
- Is it dine-in only, or also available for takeout?
- Are there substitutions, limited quantities, or add-on charges?
- When should we recheck because the rotation changes?

Fields to capture:

- Current taco item.
- Price.
- Days/times.
- Recurrence or rotation schedule.
- Service mode.
- Restrictions.
- Recommended next recheck date.

Review routing:

- If the rotation changes frequently and no date window is confirmed, require short expiry or keep `needs_recheck`.

## YoSake

Open blocker: current linked source does not show exact happy-hour food terms; older official PDF is not enough.

Suggested `direct_confirmation_id`: `dc-wilmington-yosake-current-happy-hour-food-2026-06-04`

Phone script:

Hello, I am checking current YoSake happy-hour food terms for a Wilmington food-special review. Could you confirm whether there are current food specials and the exact days/times?

Exact questions:

- Do you currently offer happy-hour food specials?
- Which food items are included?
- What are the exact prices or discounts?
- What days are they available?
- What time does happy hour start and end?
- Are these terms current as of today?
- Are the food specials dine-in only?
- Are sushi, rolls, appetizers, or entrees excluded or limited?
- Are alcohol-only specials separate from the food terms?
- Is there a current official menu/PDF/page that should be used for review?
- When should the terms be rechecked?

Fields to capture:

- Current active food-special confirmation.
- Exact item list.
- Prices/discounts.
- Days/times.
- Dine-in/takeout applicability.
- Exclusions and alcohol separation.
- Current official source pointer, if staff provides one.
- Expiration or next recheck.

Review routing:

- If only older terms are confirmed or staff cannot verify current terms, keep `needs_recheck`.

## Tidewater Oyster Bar

Open blocker: exact Daily Specials came from official-linked Toast, a `tier_3_partner` source; direct confirmation needed for active status, freshness, schedule, and restrictions.

Suggested `direct_confirmation_id`: `dc-wilmington-tidewater-oyster-bar-daily-specials-2026-06-04`

Phone script:

Hello, I am verifying Tidewater Oyster Bar's current Daily Specials for a food-special review. I saw a Daily Specials section in the ordering flow and want to confirm the exact restaurant-approved terms.

Exact questions:

- Do you currently have a Daily Specials food section?
- Are today's food specials the same as what appears in Toast/online ordering?
- Which items are available today?
- What are the exact prices?
- Is each item available all day or only during certain hours?
- Are these specials date-specific, daily rotating, weekly recurring, or limited-time?
- Are they dine-in only, takeout only, or available through online ordering?
- Are substitutions, market-price changes, or limited quantities involved?
- Should the item list expire tonight, tomorrow, or on another date?
- Is the official website expected to list these terms, or should direct confirmation/ordering page be the only evidence?

Fields to capture:

- Item list and prices.
- Confirmation that partner ordering page is current and restaurant-controlled.
- Active date and end date.
- Time window.
- Recurrence.
- Service mode.
- Restrictions.
- Next recheck due.

Review routing:

- If confirmed only as same-day specials, set short expiry in later CSV work.
- If the restaurant cannot confirm Toast terms, keep `probable` or route to `needs_recheck`.

## Sawmill Restaurant

Open blocker: June 4 Pasta Night title/time are visible, but price and exact item details are missing; Monkey Junction boundary review remains.

Suggested `direct_confirmation_id`: `dc-wilmington-sawmill-restaurant-pasta-night-2026-06-04`

Phone script:

Hello, I am checking today's Sawmill Pasta Night details for a Wilmington food-special review. Could you confirm the exact pasta special, price, and availability?

Exact questions:

- Is Pasta Night active today?
- What pasta dish or dishes are included?
- What is the price?
- What time is it available?
- Is it dine-in only, or also takeout?
- Is it a one-day special, weekly Thursday special, or part of the June 3-9 specials window?
- Are there side items, drink terms, or alcohol terms that should be excluded from food-only copy?
- Are substitutions, limited quantities, or add-ons restricted?
- Does this apply specifically to the `5611 Carolina Beach Rd, Wilmington, NC 28412` location?
- When does this special expire or need recheck?

Fields to capture:

- Exact item details.
- Price.
- Date and time window.
- Recurrence/freshness.
- Location applicability.
- Service mode.
- Restrictions.
- Expiry or next recheck.

Review routing:

- If price/details are unavailable before `2026-06-05`, let the candidate expire or route to `needs_recheck`.

## Cornelia's

Open blocker: official page supports Thursday food specials, but public access at The Davis Community and restrictions need confirmation.

Suggested `direct_confirmation_id`: `dc-wilmington-cornelias-public-access-thursday-specials-2026-06-04`

Phone script:

Hello, I am verifying Cornelia's Thursday food specials and whether the restaurant is open to the general public. Could you confirm a few access and special details?

Exact questions:

- Is Cornelia's open to the general public, or only Davis Community residents/guests?
- If public access is allowed, are reservations, check-in, parking, gate access, or guest policies required?
- Are the Thursday 6 wings for $10 currently active?
- Are the Thursday $10 smashburgers currently active?
- Are both available 4 PM to 9 PM?
- Are they dine-in only?
- Are there wing flavor, side, topping, or add-on restrictions?
- Are the specials weekly Thursday specials or limited-time?
- Are there alcohol terms adjacent to these specials that should be excluded from food-only copy?
- When should these terms be rechecked?

Fields to capture:

- Public access status.
- Any access restrictions that public copy must include.
- Confirmation of each Thursday food special.
- Price and item count.
- Time window.
- Dine-in/takeout applicability.
- Recurrence.
- Restrictions.
- Next recheck date.

Review routing:

- If public access is restricted, route to review before any publication path even if the food deal terms are verified.

## Michaelangelo's Pizza - Monkey Junction

Open blocker: official image evidence supports the slice/drink deal, but limited-time freshness, exact restrictions, and Monkey Junction boundary handling need human/direct confirmation.

Suggested `direct_confirmation_id`: `dc-wilmington-michaelangelos-pizza-monkey-junction-slices-drink-2026-06-04`

Phone script:

Hello, I am verifying Michaelangelo's Monkey Junction specials for a Wilmington food-special review. Could you confirm the current 2 cheese slices and fountain drink special and its restrictions?

Exact questions:

- Is the 2 cheese slices plus fountain drink special currently active?
- Is the price $6.99?
- Does it apply specifically to the Monkey Junction location at `5617 Carolina Beach Rd #110, Wilmington, NC 28412`?
- Is it available every day or only certain days/times?
- Is it dine-in or pickup only?
- Is delivery excluded?
- Are premium toppings extra?
- Can it be combined with other offers?
- Is there an end date, limited-time window, or expected change date?
- Are prices subject to change without notice?
- Are any other image-based specials current, and should they be separately reviewed?

Fields to capture:

- Current active status.
- Confirmed location.
- Price.
- Days/times or "all open hours" if explicitly confirmed.
- Service mode.
- Restrictions.
- Limited-time end date or next recheck date.
- Boundary/location notes for Monkey Junction.

Review routing:

- Keep Monkey Junction boundary review separate from deal-term confirmation.
- If no end date is known, use conservative next recheck in later CSV work.
