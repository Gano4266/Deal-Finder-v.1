# Carolina Beach Official Deepening - 2026-06-04

Scope: Carolina Beach, NC official restaurant websites/pages only. I used the existing Carolina Beach intake inventory plus the latest Wilmington Carolina Beach scan. I did not use social-only, partner-only, secondary, user-note, or AI output as evidence. No canonical CSVs or public fixtures were edited.

Path note: this report is saved under `ops/research/intake/wilmington-2026-06-03/` because the operator requested that path for the current pass. Local normalized evidence files are under `evidence/carolina-beach-official-scan/`.

## Outcome

Intake-ready proposed candidates: 3

Review-flagged official lead: 1

Blocked or lead-only official checks: 8

Integration readiness: ready for reviewer/import consideration as proposed rows only. Keep all candidates gated with `workflow_status=needs_review`, `mvp_publish_eligible=false`, and `public_copy_approved=false`.

## Intake-Ready Proposed Candidates

### Fentoni's Pizza - weekday 2-slice lunch special

- Official source: https://fentonispizza.com/daily-specials
- Location support: https://fentonispizza.com/
- Evidence file: `evidence/carolina-beach-official-scan/fentonis-daily-specials-normalized-2026-06-04.txt`
- Source tier: `tier_1_official`
- Evidence captured at: `2026-06-04T10:25:43-04:00`
- Supported terms: Monday through Friday, 11:00am-2:00pm; any 2 slices and a fountain drink; `$8.41 plus tax`; dine-in only; Publix location only.
- Review blockers: includes fountain drink but no alcohol; confirm public wording and whether "Publix location only" should be part of the title or restriction copy.

Proposed `deal-intake.csv` row:

```csv
deal_id,candidate_id,restaurant_id,restaurant_name,deal_title,deal_description,public_title,public_description,deal_type,alcohol_classification,days_available,start_time,end_time,start_date,end_date,recurrence,price,discount,minimum_purchase,dine_in,takeout,delivery,happy_hour,source_id,source_capture_id,source_check_id,direct_confirmation_id,source_tier,source_url,source_name,evidence_type,evidence_captured_at,evidence_url_or_path,archive_url_or_path,screenshot_path,source_quote,evidence_summary,content_hash,last_seen_active,last_verified_at,expires_on,next_check_due,confidence_status,workflow_status,mvp_publish_eligible,publish_block_reason,location_scope_status,location_evidence,review_task_id,review_reason,assigned_reviewer,review_decision,decision_reason,reviewed_by,reviewed_at,public_copy_approved,restriction_notes,uncertainty_flags,conflict_detected,conflicting_source_url,validation_notes,added_by,created_at,updated_at,published_at,hidden_at,supersedes_deal_id
,cand-fentonis-weekday-2-slice-lunch-2026-06-04,fentonis-pizza,Fentoni's Pizza,Weekday 2-slice lunch special,"Official daily-specials page lists any 2 slices and a fountain drink for $8.41 plus tax, Monday through Friday 11am-2pm, dine-in only at the Publix location.",,,lunch_special,food_only,"monday;tuesday;wednesday;thursday;friday",11:00,14:00,,,weekly,$8.41,,,true,false,false,false,src-cb-fentonis-daily-specials,cap-fentonis-weekday-2-slice-lunch-2026-06-04,,,tier_1_official,https://fentonispizza.com/daily-specials,Fentoni's Pizza daily specials page,manual_web_review,2026-06-04T10:25:43-04:00,evidence/carolina-beach-official-scan/fentonis-daily-specials-normalized-2026-06-04.txt,,,Official page lists a lunch special: any 2 slices and a fountain drink for $8.41 plus tax, Monday through Friday 11am-2pm, dine-in only, Publix location only.,Official website supports item price weekday range time window dine-in restriction and Carolina Beach Publix location.,sha256:9ce01b99d6b3b15ec281fb147c4751bf1960328c269e92103802b8c76bce2dc1,2026-06-04,2026-06-04,,2026-07-04,verified,needs_review,false,no human review; public copy not approved,carolina_beach_confirmed,"Official home page lists 1018 North Lake Park Boulevard, Carolina Beach, NC 28428.",rt-fentonis-weekday-2-slice-lunch-2026-06-04,Review public copy and restriction handling.,codex_research_review,,,,,false,Available at Publix location only; dine-in only; plus tax.,public_copy_needed,false,,Report-only proposed row; do not publish without human review.,codex_agent_handoff,2026-06-04,2026-06-04,,,
```

### K38 Baja Grill - Cinco de Monday food specials

- Official source: https://k38bajagrill.com/locations/carolina-beach/
- Evidence file: `evidence/carolina-beach-official-scan/k38-carolina-beach-weekday-specials-normalized-2026-06-04.txt`
- Source tier: `tier_1_official`
- Evidence captured at: `2026-06-04T10:25:43-04:00`
- Supported terms: Carolina Beach location; Monday; food specials start at 5:00pm; dine-in only; official page says "Cinco de Monday (Everything $5)" and lists Baja Fish Tacos, Large Queso, Large Guac, Large Elote, Poor Surfer, and Chicken Elote Rolls among the items.
- Review blockers: the same official line also lists a margarita; public copy must be food-only and avoid alcohol copy.

Proposed `deal-intake.csv` row:

```csv
,cand-k38-cb-cinco-monday-food-2026-06-04,k38-baja-grill,K38 Baja Grill,Cinco de Monday food specials,"Official Carolina Beach location page lists Cinco de Monday with food items at $5; food specials start at 5:00pm and are dine-in only.",,,weekday_special,food_only,monday,17:00,,,,weekly,$5,,,true,false,false,false,src-cb-k38-location,cap-k38-cb-weekday-specials-2026-06-04,,,tier_1_official,https://k38bajagrill.com/locations/carolina-beach/,K38 Carolina Beach location page,manual_web_review,2026-06-04T10:25:43-04:00,evidence/carolina-beach-official-scan/k38-carolina-beach-weekday-specials-normalized-2026-06-04.txt,,,Official page lists Cinco de Monday (Everything $5) and food-special restrictions: food specials start at 5:00pm and are dine-in only.,Official website supports price day start time restriction and Carolina Beach location; public copy must mention only food items.,sha256:eb42ae9071a013021fa235e1d14cb3b8ec484772aa85b802d16ce525ef9bf6df,2026-06-04,2026-06-04,,2026-07-04,verified,needs_review,false,no human review; public copy not approved; food-only copy needed,carolina_beach_confirmed,"Official location page lists 1000 N. Lake Park Blvd Suite 101, Carolina Beach, NC 28428.",rt-k38-cb-cinco-monday-food-2026-06-04,Review food-only copy and exact item list.,codex_research_review,,,,,false,Dine-in only; starts at 5:00pm; food-only copy should exclude margarita wording.,alcohol_adjacent_copy;public_copy_needed,false,,Report-only proposed row; do not publish without human review.,codex_agent_handoff,2026-06-04,2026-06-04,,,
```

### K38 Baja Grill - Quesadilla Wednesday

- Official source: https://k38bajagrill.com/locations/carolina-beach/
- Evidence file: `evidence/carolina-beach-official-scan/k38-carolina-beach-weekday-specials-normalized-2026-06-04.txt`
- Source tier: `tier_1_official`
- Evidence captured at: `2026-06-04T10:25:43-04:00`
- Supported terms: Wednesday; 1/2 off De La Casa Quesadilla, including chicken, cheese, or veggie; food specials start at 5:00pm; dine-in only.
- Review blockers: no explicit food-special end time.

Proposed `deal-intake.csv` row:

```csv
,cand-k38-cb-quesadilla-wednesday-2026-06-04,k38-baja-grill,K38 Baja Grill,Quesadilla Wednesday,"Official Carolina Beach location page lists 1/2 off De La Casa Quesadilla on Wednesday; food specials start at 5:00pm and are dine-in only.",,,weekday_special,food_only,wednesday,17:00,,,,weekly,,1/2 off,,true,false,false,false,src-cb-k38-location,cap-k38-cb-weekday-specials-2026-06-04,,,tier_1_official,https://k38bajagrill.com/locations/carolina-beach/,K38 Carolina Beach location page,manual_web_review,2026-06-04T10:25:43-04:00,evidence/carolina-beach-official-scan/k38-carolina-beach-weekday-specials-normalized-2026-06-04.txt,,,Official page lists Quesadilla Wednesday with 1/2 off De La Casa Quesadilla and food-special restrictions: food specials start at 5:00pm and are dine-in only.,Official website supports item discount day start time restriction and Carolina Beach location.,sha256:eb42ae9071a013021fa235e1d14cb3b8ec484772aa85b802d16ce525ef9bf6df,2026-06-04,2026-06-04,,2026-07-04,verified,needs_review,false,no human review; public copy not approved,carolina_beach_confirmed,"Official location page lists 1000 N. Lake Park Blvd Suite 101, Carolina Beach, NC 28428.",rt-k38-cb-quesadilla-wednesday-2026-06-04,Review public copy and whether end time should remain blank.,codex_research_review,,,,,false,Dine-in only; starts at 5:00pm; no explicit food-special end time.,end_time_unknown;public_copy_needed,false,,Report-only proposed row; do not publish without human review.,codex_agent_handoff,2026-06-04,2026-06-04,,,
```

## Review-Flagged Official Lead

### Shuckin' Shack Oyster Bar - Thursday crab legs

- Official source: https://www.theshuckinshack.com/events/thursday-5db408fd
- Location page checked: https://www.theshuckinshack.com/location-carolina-beach
- Evidence file: `evidence/carolina-beach-official-scan/shuckin-shack-thursday-crab-legs-normalized-2026-06-04.txt`
- Source tier: `tier_1_official`
- Evidence captured at: `2026-06-04T10:25:43-04:00`
- Supported terms: weekly Thursday; crab legs at `$29.99 a lb.`
- Blocker: the event page text capture does not visibly restate the Carolina Beach location. Treat as a direct-confirmation target or reviewer-confirmed location lead before CSV import.

## Blocked Official-Site Findings

| Restaurant | Official source checked | Finding | Disposition |
| --- | --- | --- | --- |
| Fentoni's Pizza | https://fentonispizza.com/daily-specials and https://fentonispizza.com/ | Exact lunch special and Carolina Beach Publix location found. | Proposed candidate. |
| K38 Baja Grill | https://k38bajagrill.com/locations/carolina-beach/ | Exact Monday $5 food-special support and Wednesday 1/2-off quesadilla support found. Tuesday fajitas lack exact price/discount. | Two proposed candidates; Tuesday blocked. |
| HopLite Irish Pub & Restaurant | https://hopliterestaurant.com/brunch-menu/ and https://hopliterestaurant.com/ | Brunch page lists Sunday 10am-2pm and "Breakfast Specials" with prices, but this is a routine brunch menu rather than a deal/special offer. Home page points to Facebook for current specials. | Blocked as routine menu-only/social-needed. |
| Shuckin' Shack Oyster Bar | https://www.theshuckinshack.com/events/thursday-5db408fd and https://www.theshuckinshack.com/location-carolina-beach | Exact weekly Thursday crab-leg price found, but event page does not visibly restate Carolina Beach location. | Review-flagged lead; direct confirmation recommended before CSV import. |
| Seaworthy Kitchen + Bar | https://seaworthycb.com/ | Official site says daily drink and food specials and 3-5 happy hour menu daily, but no exact food item or food price. | Lead only. |
| Stoked Restaurant | https://stokedrestaurant.com/ and https://stokedrestaurant.com/carolina-beach-stoked-restaurant-food-menu | Official site confirms Carolina Beach location and routine menus; prior Toast lunch-special lead is not visible as an official-site special. | Blocked as routine menu-only/partner lead. |
| Michael's Seafood Restaurant | https://mikescfood.com/menu | Official menu has a Lunch Specials category with priced items, but no day/time window beyond menu category and no clear promotional special terms. | Blocked as routine menu/category-only. |
| Havana's Restaurant | https://havanasrestaurant.com/carolina-beach-central-business-district-havana-s-restaurant-food-menu and banquet menu | Official menus have priced routine items and banquet options, but no current public food special. | Blocked as routine menu-only. |
| The Spot CB | https://www.thespotcb.com/ and https://www.thespotcb.com/menu | Official site says visit Facebook for daily specials; official menu is routine menu-only. | Lead only; official social/direct confirmation needed. |
| Lazy Pirate Sports Grill | https://lazypiratesportsgrill.com/ | Prior pass found official all-you-can-eat crab-leg wording but no price/day clarity. | Still lead only. |
| Hurricane Alley's | https://hurricanealleyscb.com/hurricane-alleys-restaurant-menu/ | Prior pass already captured the CB Centennial shrimp candidate. | Already represented in previous report. |

## Proposed Source Capture Rows

```csv
source_capture_id,source_id,restaurant_id,captured_at,captured_by,capture_method,source_url,source_final_url,source_title,source_published_at,source_observed_at,evidence_type,extracted_text_or_confirmation_note,content_hash,screenshot_path,archive_url_or_path,metadata_json,capture_status,notes
cap-fentonis-weekday-2-slice-lunch-2026-06-04,src-cb-fentonis-daily-specials,fentonis-pizza,2026-06-04T10:25:43-04:00,codex_agent_handoff,manual_web_review,https://fentonispizza.com/daily-specials,https://fentonispizza.com/daily-specials,Daily Specials,,2026-06-04,official_website_text,"Official daily-specials page lists a weekday 11am-2pm lunch special: any 2 slices and a fountain drink for $8.41 plus tax, dine-in only, Publix location only.",sha256:9ce01b99d6b3b15ec281fb147c4751bf1960328c269e92103802b8c76bce2dc1,,evidence/carolina-beach-official-scan/fentonis-daily-specials-normalized-2026-06-04.txt,"{""evidence_file"":""evidence/carolina-beach-official-scan/fentonis-daily-specials-normalized-2026-06-04.txt"",""review_blockers"":[""public copy approval"",""restriction copy for Publix location only""]}",captured,Report-only source capture proposal.
cap-k38-cb-weekday-specials-2026-06-04,src-cb-k38-location,k38-baja-grill,2026-06-04T10:25:43-04:00,codex_agent_handoff,manual_web_review,https://k38bajagrill.com/locations/carolina-beach/,https://k38bajagrill.com/locations/carolina-beach/,K38 Carolina Beach,,2026-06-04,official_website_text,"Official Carolina Beach location page lists Monday $5 specials and Wednesday 1/2 off De La Casa Quesadilla; food specials start 5:00pm and are dine-in only.",sha256:eb42ae9071a013021fa235e1d14cb3b8ec484772aa85b802d16ce525ef9bf6df,,evidence/carolina-beach-official-scan/k38-carolina-beach-weekday-specials-normalized-2026-06-04.txt,"{""evidence_file"":""evidence/carolina-beach-official-scan/k38-carolina-beach-weekday-specials-normalized-2026-06-04.txt"",""review_blockers"":[""food-only public copy"",""no explicit food-special end time""]}",captured,Report-only source capture proposal.
cap-shuckin-shack-thursday-crab-legs-2026-06-04,src-cb-shuckin-event,shuckin-shack-oyster-bar,2026-06-04T10:25:43-04:00,codex_agent_handoff,manual_web_review,https://www.theshuckinshack.com/events/thursday-5db408fd,https://www.theshuckinshack.com/events/thursday-5db408fd,Thursday - Shuckin' Shack Oyster Bar,,2026-06-04,official_website_event_text,"Official event page lists weekly Thursday crab legs at $29.99 a lb.; Carolina Beach location must be reviewer-confirmed because the event page text does not visibly restate the location.",sha256:f3799cda2f57a9b61b1f0a09256cb0596ffb19e77fef6081419d57a786752d68,,evidence/carolina-beach-official-scan/shuckin-shack-thursday-crab-legs-normalized-2026-06-04.txt,"{""evidence_file"":""evidence/carolina-beach-official-scan/shuckin-shack-thursday-crab-legs-normalized-2026-06-04.txt"",""review_blockers"":[""confirm Carolina Beach applicability"",""no event time visible"",""food-only public copy""]}",captured,Report-only source capture proposal; do not import without location confirmation.
```

## Proposed Review Tasks

```csv
review_task_id,related_type,related_id,deal_id,source_id,restaurant_id,source_capture_id,direct_confirmation_id,report_source,opened_at,opened_by,assigned_reviewer,review_reason,risk_flags,priority,status,decision,decision_reason,decided_at,decided_by,next_action,next_action_due,public_copy_approval_status,food_alcohol_copy_check,next_check_due_required,expires_on_required,audit_event_id,resolution_notes
rt-fentonis-weekday-2-slice-lunch-2026-06-04,candidate,cand-fentonis-weekday-2-slice-lunch-2026-06-04,,src-cb-fentonis-daily-specials,fentonis-pizza,cap-fentonis-weekday-2-slice-lunch-2026-06-04,,codex_agent_handoff,2026-06-04T10:25:43-04:00,codex_agent_handoff,codex_research_review,Review public copy and restriction handling.,price_specific_claim;public_copy_needed,medium,open,,,,,Confirm wording for plus tax and Publix location only.,2026-06-11,pending,food_only,yes,yes,,Report-only proposed task.
rt-k38-cb-cinco-monday-food-2026-06-04,candidate,cand-k38-cb-cinco-monday-food-2026-06-04,,src-cb-k38-location,k38-baja-grill,cap-k38-cb-weekday-specials-2026-06-04,,codex_agent_handoff,2026-06-04T10:25:43-04:00,codex_agent_handoff,codex_research_review,Review food-only copy and exact item list.,price_specific_claim;alcohol_adjacent_copy;public_copy_needed,medium,open,,,,,Confirm public copy excludes margarita and says dine-in only starts at 5pm.,2026-06-11,pending,food_only,yes,yes,,Report-only proposed task.
rt-k38-cb-quesadilla-wednesday-2026-06-04,candidate,cand-k38-cb-quesadilla-wednesday-2026-06-04,,src-cb-k38-location,k38-baja-grill,cap-k38-cb-weekday-specials-2026-06-04,,codex_agent_handoff,2026-06-04T10:25:43-04:00,codex_agent_handoff,codex_research_review,Review public copy and whether end time should remain blank.,discount_specific_claim;public_copy_needed,medium,open,,,,,Confirm no end-time inference; keep dine-in only and starts at 5pm.,2026-06-11,pending,food_only,yes,yes,,Report-only proposed task.
rt-shuckin-shack-thursday-crab-legs-2026-06-04,candidate,cand-shuckin-shack-thursday-crab-legs-2026-06-04,,src-cb-shuckin-event,shuckin-shack-oyster-bar,cap-shuckin-shack-thursday-crab-legs-2026-06-04,,codex_agent_handoff,2026-06-04T10:25:43-04:00,codex_agent_handoff,Confirm Carolina Beach applicability and time window before CSV import.,location_applicability_unclear;price_specific_claim;time_window_missing;public_copy_needed,high,open,,,,,Call or verify official location-specific event rendering before importing.,2026-06-11,pending,food_only,yes,yes,,Report-only proposed task.
```

## Evidence Hashes

Run after file creation:

```text
sha256:9ce01b99d6b3b15ec281fb147c4751bf1960328c269e92103802b8c76bce2dc1  evidence/carolina-beach-official-scan/fentonis-daily-specials-normalized-2026-06-04.txt
sha256:eb42ae9071a013021fa235e1d14cb3b8ec484772aa85b802d16ce525ef9bf6df  evidence/carolina-beach-official-scan/k38-carolina-beach-weekday-specials-normalized-2026-06-04.txt
sha256:f3799cda2f57a9b61b1f0a09256cb0596ffb19e77fef6081419d57a786752d68  evidence/carolina-beach-official-scan/shuckin-shack-thursday-crab-legs-normalized-2026-06-04.txt
```

## Reviewer Notes

- Do not import HopLite brunch, Michael's lunch-special category, Stoked menu items, Havana's menus, or The Spot menu as deal rows from this pass; they are routine menu-only or missing exact special terms.
- Do not use Toast, Facebook snippets, tourism pages, search snippets, or prior AI/user notes as support.
- K38 Tuesday fajitas remain a direct-confirmation target because the official page gives no exact food price or discount.
- Shuckin' Shack is promising but needs Carolina Beach applicability confirmation before becoming a CSV-ready candidate.
