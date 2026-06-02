# Product Spec

## Core Experience

The first user-facing product should answer: "What are the best restaurant deals in Wilmington tonight?"

The public MVP should provide:

- A mobile-first tonight feed.
- Deal cards with restaurant name, deal title, price if known, valid day/time, confidence, last verified date, and source link.
- Deal detail pages with restrictions, source evidence, and a report issue action.
- Restaurant detail pages with address, neighborhood, links, and current verified deals.
- Filters for deal type, neighborhood, cuisine, day, and confidence.

## User Flows

### Local Diner

1. Opens the mobile web app.
2. Lands on tonight's deal feed.
3. Filters by neighborhood or deal type.
4. Opens a deal to check restrictions and source.
5. Reports a stale or incorrect deal if needed.

### Reviewer

1. Reviews candidate deals from source captures or manual intake.
2. Checks the source evidence.
3. Approves, approves with uncertainty, rejects, or marks for recheck.
4. Sets `last_seen_active`, `expires_on`, and review notes.

### Restaurant Correction

1. Restaurant or user reports that a deal is wrong.
2. The deal is routed to review and confidence is lowered.
3. Reviewer confirms, edits, expires, or rejects the deal.

## Deal Lifecycle

Allowed workflow transitions:

- `lead -> needs_review`
- `needs_review -> approved | approved_with_uncertainty | rejected`
- `approved | approved_with_uncertainty -> needs_recheck | expired | superseded`
- `needs_recheck -> approved | approved_with_uncertainty | expired | rejected`

`rejected`, `expired`, and `superseded` are terminal unless a reviewer opens a new candidate from newer evidence.

No deal reaches the public feed without a source URL or direct-confirmation note, source tier, evidence capture date, workflow status, reviewer decision, and recheck or expiration date.

A credible public report, restaurant correction, source conflict, source failure, expired evidence, or inaccessible source can route a public deal back to `needs_review` or `needs_recheck`. Public deals require evidence, reviewer decision, and `next_check_due` or `expires_on`.

Alcohol-only deals are not public in the MVP. Mixed food/alcohol specials may publish only food-safe copy.

## V0 Route Map

The first app should be designed around these routes:

- `/`: redirect or summarize the tonight experience.
- `/tonight`: primary feed.
- `/deals`: all reviewed prototype deals with day, area, quick-filter, and sort controls.
- `/deals/[dealId]`: deal details and evidence.
- `/restaurants`: browse restaurants.
- `/restaurants/[restaurantId]`: restaurant profile and active deals.
- `/report`: report stale or incorrect deal data.
- `/admin`: reviewer dashboard.
- `/admin/ops`: ops dashboard deep link.
- `/admin/review`: candidate review queue.
- `/admin/source-gaps`: source-gap and seed follow-up report.

These routes are now implemented in the Phase 1 static Next.js/PWA prototype. They remain a static-data product contract, not live availability infrastructure.

## Public Copy Rules

- Do not say a deal is guaranteed.
- Do not claim "best" unless the app ranking clearly defines it.
- Preserve restrictions such as dine-in only, bar only, one per table, or while supplies last.
- Show uncertainty plainly when a deal is probable but not fully verified.
- Prefer "Verified from restaurant website on DATE" over vague confidence claims.
