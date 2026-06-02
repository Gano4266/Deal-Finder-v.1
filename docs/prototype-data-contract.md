# Prototype Data Contract

This contract defines what the Phase 1 static `/tonight` prototype may display before live data, automation, auth, or database work exists.

## Public `/tonight` Source

The public `/tonight` route must read public deal rows from `fixtures/prototype/deals.csv` only.

Do not hydrate public `/tonight` from:

- `ops/seeds/wilmington-deal-candidates.csv`
- `ops/seeds/wilmington-review-tasks.csv`
- restaurant source rows
- research notes
- user notes

Seed rows are an operating backlog. They can drive `/admin/review`, but they are not public feed data.

## Ops-Only Carryout Seeds

The public MVP no longer exposes a `/carryout` route.

Carryout place rows in `ops/seeds/wilmington-carryout-places.csv` are ops-only backlog. They may describe source-backed pickup, takeout, delivery, ordering, or location signals, but they must not imply that any restaurant special is published. A carryout place can become a deal only through the normal public deal filter in `fixtures/prototype/deals.csv`.

## Public `/restaurants` Source

The `/restaurants` and `/restaurants/[restaurantId]` routes may read restaurant rows from `fixtures/prototype/restaurants.csv` plus reviewed public deal rows from `fixtures/prototype/deals.csv`.

Public restaurant pages are a static source directory, not a claim that a restaurant currently has an available deal. They should show only rows that are:

- `city=Wilmington`
- `state=NC`
- `status=active`
- `fixture_data_class=verified_static`
- `is_live_data=false`
- labeled with the static prototype notice

Do not hydrate public restaurant pages from seed candidates, review tasks, source-gap notes, research notes, or raw operator notes. Restaurant profiles may show reviewed public deals for that restaurant, but only after those deals pass the public deal filter.

## Public `/report` Source

The `/report` route is a lightweight correction intake surface. In the static prototype, it may read reviewed public deal context and public restaurant context only. It must not write data, publish user content, or imply that a report was stored unless a real backend exists.

Reports and restaurant corrections are review inputs. A credible report should create or update a review task in ops, and affected public deals should be routed to `needs_review` or `needs_recheck` until resolved.

If no reporting inbox is configured, `/report` should clearly say that submissions are not stored in the app yet.

## Public Deal Filter

A prototype deal can appear in `/tonight` only when all of these are true:

- `mvp_publish_eligible=true`
- `public_copy_approved=true`
- `workflow_status` is `approved` or `approved_with_uncertainty`
- `confidence_status=verified`
- `review_decision=approved`
- `published_at` is present
- `hidden_at` is empty
- `conflict_detected=false`
- `is_live_data=false`
- `restaurant_id` is present
- `source_id` is present
- `review_task_id` is present
- `source_capture_id` or `direct_confirmation_id` is present
- `next_check_due` or `expires_on` is present

If any required field is missing, route the row to `/admin/review` instead of `/tonight`.

## Freshness Gate

Prototype deals require either:

- a non-expired `expires_on`, or
- a `next_check_due` that is not overdue for the current operating date.

Stale, expired, or overdue rows must not appear in `/tonight`. They should appear in admin review queues as `needs_recheck`, `expired`, or equivalent operator state.

## Source Gate

The public row must point to acceptable evidence:

- official restaurant website, menu, or specials page
- official restaurant social post
- direct confirmation from the restaurant

Aggregators, Reddit, reviews, comments, screenshots from users, and user notes remain discovery-only unless independently confirmed by an acceptable source.

Public prototype rows must also preserve durable evidence traceability:

- `content_hash` records the normalized claim or capture text hash.
- `source_capture.metadata_json.evidence_file_sha256` records the local evidence artifact hash.
- `source_check.evidence_url_or_path` points to the same durable artifact as the source capture when that check supports a public deal.
- Public deals should include `screenshot_path` for app-visible proof. For public prototype rows, the deal, linked source capture, and linked source check should point to the same visual proof artifact when one exists. Most artifacts are source-page screenshots; blocked pages may use clearly labeled visual evidence cards generated from reviewed source captures.

Local evidence files and screenshots are traceability artifacts. They are not the same as independent off-repo archives or direct restaurant confirmations.

## Food Gate

The MVP is food-first. Suppress:

- alcohol-only deals
- drink-only happy hours
- mixed food/alcohol claims where food-safe public copy has not been approved

Mixed specials may publish only when `public_description` omits alcohol claims and accurately describes the verified food component.

## Empty State

If no rows pass the public filter, `/tonight` must show a static-data empty state. It should not show seed candidates, research notes, or source-backed-but-unreviewed rows.

Suggested safe copy:

```text
No reviewed food deals are ready for tonight yet.
```

Do not use copy that implies live availability, such as "available tonight," "verified today," or "current deal," unless that is true for the verification date.

## Admin Pending State

Source-backed but unreviewed candidates may appear only in `/admin/review`.

Label them as:

- `needs_review`
- `source-backed candidate`
- `review required before publication`

The admin row should show source URL, last verified date, review task, risk flags, and the next action due date.

## Admin Ops State

`/admin` and `/admin/ops` may read fixture inventory, source checks, audit events, seed candidates, seed review tasks, source-gap rows, carryout place seeds, and report handoff configuration. These pages are read-only operating views. They can summarize backlog, freshness, source coverage, manifest health, and evidence hardening work, but they must not imply live deal availability.

Seed, carryout, user-note, and source-gap rows remain operational backlog. They cannot hydrate `/tonight`, `/deals`, or public restaurant deal sections unless a reviewed public row exists in `fixtures/prototype/deals.csv` and passes the public deal filter.
