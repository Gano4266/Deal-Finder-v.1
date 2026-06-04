# Carolina Beach Official Website Scan - 2026-06-04

Scope: Carolina Beach, NC restaurants only. Sources checked were official restaurant websites or restaurant-owned menu/order surfaces linked from those websites. Third-party/social-only leads were treated as discovery noise and were not used as support.

Path note: `DECISIONS.md` says Carolina Beach intake normally belongs under `ops/research/intake/carolina-beach-YYYY-MM-DD/`. This report is intentionally saved in `ops/research/intake/wilmington-2026-06-03/` because the current operator instruction requested this path.

## Outcome

Top intake-ready candidate count: 1

Partial reviewable lead count: 1

No canonical CSVs were edited. No public fixtures were edited. Every proposed row below keeps gates closed with `workflow_status=needs_review`, `mvp_publish_eligible=false`, and `public_copy_approved=false`.

## Strong Candidate

### Hurricane Alley's - CB Centennial peel and eat shrimp

- Official source: https://hurricanealleyscb.com/hurricane-alleys-restaurant-menu/
- Source tier: `tier_1_official`
- Evidence captured at: `2026-06-04T09:59:04-04:00`
- Evidence file: `evidence/carolina-beach-official-scan/hurricane-alleys-cb-centennial-shrimp-normalized-2026-06-04.txt`
- Source support: official menu page for Hurricane Alley's in Carolina Beach lists chilled peel and eat shrimp with a "CB Centenial special with over a pound $19.95."
- Freshness suggestion: official website/menu source, recheck in 30 days; suggested `next_check_due=2026-07-04`.
- Expiry suggestion: no explicit end date; leave `expires_on` blank until review, or set a conservative operational review date if promoted internally.
- Review blockers: confirm the special is active and not merely a standard menu label; no day/time recurrence; source spelling is "Centenial"; public copy not reviewed.

#### Proposed `deal-intake.csv` row

```csv
deal_id,candidate_id,restaurant_id,restaurant_name,deal_title,deal_description,public_title,public_description,deal_type,alcohol_classification,days_available,start_time,end_time,start_date,end_date,recurrence,price,discount,minimum_purchase,dine_in,takeout,delivery,happy_hour,source_id,source_capture_id,source_check_id,direct_confirmation_id,source_tier,source_url,source_name,evidence_type,evidence_captured_at,evidence_url_or_path,archive_url_or_path,screenshot_path,source_quote,evidence_summary,content_hash,last_seen_active,last_verified_at,expires_on,next_check_due,confidence_status,workflow_status,mvp_publish_eligible,publish_block_reason,location_scope_status,location_evidence,review_task_id,review_reason,assigned_reviewer,review_decision,decision_reason,reviewed_by,reviewed_at,public_copy_approved,restriction_notes,uncertainty_flags,conflict_detected,conflicting_source_url,validation_notes,added_by,created_at,updated_at,published_at,hidden_at,supersedes_deal_id
,cand-hurricane-alleys-cb-centennial-shrimp-2026-06-04,hurricane-alleys,Hurricane Alley's,CB Centennial peel and eat shrimp,"Official restaurant menu lists chilled peel and eat shrimp with a CB Centennial special over a pound for $19.95.",,,seafood_special,food_only,,,,,,ongoing_menu_special,$19.95,,,true,true,unknown,false,src-hurricane-alleys-primary,cap-hurricane-alleys-cb-centennial-shrimp-2026-06-04,,,tier_1_official,https://hurricanealleyscb.com/hurricane-alleys-restaurant-menu/,Hurricane Alley's official restaurant menu,manual_web_review,2026-06-04T09:59:04-04:00,evidence/carolina-beach-official-scan/hurricane-alleys-cb-centennial-shrimp-normalized-2026-06-04.txt,,,Official menu text lists a CB Centenial special with over a pound for $19.95.,Official website supports item price and Carolina Beach location; recurrence and active-special interpretation require review.,sha256:1186b211ae5542ba1250db833e36b5b53feb1ce3a42f5699db5f40fddfb1c25a,2026-06-04,2026-06-04,,2026-07-04,verified,needs_review,false,no human review; public copy not approved; recurrence unclear; confirm current special versus standard menu label,carolina_beach_confirmed,"Official page lists 5 Boardwalk Carolina Beach NC.",rt-hurricane-alleys-cb-centennial-shrimp-2026-06-04,Confirm current active status recurrence restrictions and copy spelling.,codex_research_review,,,,,false,No listed day or time window; source spelling says Centenial.,recurrence_unclear;special_label_needs_review;copy_spelling_needs_review,false,,Report-only proposed row; do not publish without human review.,codex_agent_handoff,2026-06-04,2026-06-04,,,
```

#### Proposed `source-captures.csv` row

```csv
source_capture_id,source_id,restaurant_id,captured_at,captured_by,capture_method,source_url,source_final_url,source_title,source_published_at,source_observed_at,evidence_type,extracted_text_or_confirmation_note,content_hash,screenshot_path,archive_url_or_path,metadata_json,capture_status,notes
cap-hurricane-alleys-cb-centennial-shrimp-2026-06-04,src-hurricane-alleys-primary,hurricane-alleys,2026-06-04T09:59:04-04:00,codex_agent_handoff,manual_web_review,https://hurricanealleyscb.com/hurricane-alleys-restaurant-menu/,https://hurricanealleyscb.com/hurricane-alleys-restaurant-menu/,Hurricane Alleys | Restaurant Menu,,2026-06-04,official_website_menu_text,"Official menu lists Chilled Peel & Eat Shrimp and a CB Centenial special with over a pound for $19.95.",sha256:1186b211ae5542ba1250db833e36b5b53feb1ce3a42f5699db5f40fddfb1c25a,,evidence/carolina-beach-official-scan/hurricane-alleys-cb-centennial-shrimp-normalized-2026-06-04.txt,"{""evidence_file"":""evidence/carolina-beach-official-scan/hurricane-alleys-cb-centennial-shrimp-normalized-2026-06-04.txt"",""evidence_file_sha256"":""1186b211ae5542ba1250db833e36b5b53feb1ce3a42f5699db5f40fddfb1c25a"",""review_blockers"":[""confirm active special"",""recurrence unclear"",""copy spelling uses source text Centenial""]}",captured,Official website evidence; report-only candidate.
```

#### Proposed `review-tasks.csv` row

```csv
review_task_id,related_type,related_id,deal_id,source_id,restaurant_id,source_capture_id,direct_confirmation_id,report_source,opened_at,opened_by,assigned_reviewer,review_reason,risk_flags,priority,status,decision,decision_reason,decided_at,decided_by,next_action,next_action_due,public_copy_approval_status,food_alcohol_copy_check,next_check_due_required,expires_on_required,audit_event_id,resolution_notes
rt-hurricane-alleys-cb-centennial-shrimp-2026-06-04,candidate,cand-hurricane-alleys-cb-centennial-shrimp-2026-06-04,,src-hurricane-alleys-primary,hurricane-alleys,cap-hurricane-alleys-cb-centennial-shrimp-2026-06-04,,codex_agent_handoff,2026-06-04T09:59:04-04:00,codex_agent_handoff,codex_research_review,Confirm active status recurrence restrictions and public-safe spelling.,price_specific_claim;recurrence_unclear;public_copy_needed,medium,open,,,,,Confirm whether this is active and how often it is offered; draft cautious public copy only after approval.,2026-06-11,pending,food_only,yes,yes,,Report-only proposed task.
```

## Partial Reviewable Lead

### Lazy Pirate Sports Grill - all you can eat crab legs

- Official source: https://lazypiratesportsgrill.com/
- Source tier: `tier_1_official`
- Evidence captured at: `2026-06-04T09:59:04-04:00`
- Evidence file: `evidence/carolina-beach-official-scan/lazy-pirate-ayce-crab-legs-normalized-2026-06-04.txt`
- Source support: official homepage lists "All You Can Eat Crab Legs | 4:00-8:00 PM" and describes unlimited seasoned crab legs.
- Freshness suggestion: official website source, recheck in 30 days; suggested `next_check_due=2026-07-04`.
- Review blockers: no price visible; applicable day/recurrence is not unambiguous; requires direct check before any CSV import.

Not intake-ready yet because the official page does not show a price. Keep as a lead unless direct confirmation or another official restaurant-owned page provides price and day.

## Blocked Official-Site Finds

| Restaurant | Official source checked | Finding | Disposition |
| --- | --- | --- | --- |
| Seaworthy Kitchen and Bar | https://seaworthycb.com/ | Official homepage says "Daily Drink & Food Specials" and "3-5 Happy Hour Menu Daily," but no food items or food prices are visible. | Lead only; needs official menu details or direct confirmation. |
| SeaWitch Tiki Bar | https://seawitchtikibar.com/menus/ | Official menu page has recurring drink specials; food special wording is vague or event-specific/past. | Blocked: alcohol-only or vague food detail. |
| Stoked Restaurant | https://stokedrestaurant.com/ and official food menu page | Official site confirms location and menu. Search results expose partner/order specials, but the restaurant-owned page did not show exact recurring specials. | Blocked for this task; partner leads need separate tier-3 review if allowed later. |
| Sunny Daze Smokehouse | https://sunnydazecb.com/ | Official homepage says rotating house-made daily specials but no exact current item, day, or price. | Lead only. |
| HopLite Pub and Restaurant | https://hopliterestaurant.com/ | Official homepage points users to Facebook for happenings and specials; no exact food special details visible on site. | Lead only; social/direct confirmation needed. |
| Michael's Seafood | https://mikescfood.com/ and https://mikescfood.com/menu | Official menu mentions daily specials generally but does not list current exact food deal details. | Lead only. |
| Havana's Restaurant | https://havanasrestaurant.com/ | Official site mentions daily specials from scratch, but no exact current item/price/schedule surfaced. | Lead only. |
| Hurricane Alley's Alley Bites | https://hurricanealleyscb.com/hurricane-alleys-alley-bites/ | Official page says closed until next season. | Blocked. |
| The Spot CB | https://www.thespotcb.com/ | Official site says to visit Facebook for daily specials. | Lead only; official website not enough. |
| Ocean Grill & Tiki Bar | https://www.oceangrilltiki.com/ | Official menu says fresh catch specials are created daily and to ask server. | Lead only; no exact web-backed deal. |

## Evidence Hashes

Hashes are SHA-256 of the local normalized evidence files.

```text
1186b211ae5542ba1250db833e36b5b53feb1ce3a42f5699db5f40fddfb1c25a  evidence/carolina-beach-official-scan/hurricane-alleys-cb-centennial-shrimp-normalized-2026-06-04.txt
9c5b4649ecc49ef188c2a8629401c6d19c1bd7e4474d3f55ba7b65c100d7380a  evidence/carolina-beach-official-scan/lazy-pirate-ayce-crab-legs-normalized-2026-06-04.txt
```

## Reviewer Notes

- Do not import the Lazy Pirate lead until price and recurrence are confirmed from an official/direct source.
- Hurricane Alley's is the only candidate from this pass with official website support for a food item and price, but it still needs human interpretation before any intake CSV edit.
- Do not use Carolina Beach Locals, Shoaljumper, ILMWeekly, Restaurantji, Toast, DoorDash, Reddit, or tourism pages as support for this task. They may be separate leads only under the source policy.
