# GPT Research Intake Workflow

This workflow extends the canonical research, evidence, and publishing docs. It does not replace `docs/data-model.md`, `docs/data-sources.md`, `docs/review-workflow.md`, `docs/deal-validation-policy.md`, `docs/prototype-data-contract.md`, or `docs/anti-staleness-policy.md`.

## Purpose

Use this workflow when the user runs GPT, Deep Research, or manual research outside the repo and wants to safely intake the results. Codex does not automatically research restaurants or deals, scrape websites, call external APIs, or promote candidates. GPT output is intake only; it is not proof, evidence, confirmation, or a publishable source.

Research output should help operators decide what to check next. Every row still needs durable evidence, canonical status values, human review, and the existing publish gates before it can become public.

## Source Authority

Use only the existing `source_tier` values:

- `tier_1_official`: restaurant site, official menu, official ordering page, newsletter, or direct confirmation.
- `tier_2_official_social`: restaurant-owned Instagram, Facebook, TikTok, or Google Business posts.
- `tier_3_partner`: Toast, Square, DoorDash, Uber Eats, Resy, OpenTable, or event/menu vendors clearly tied to the restaurant.
- `tier_4_secondary`: local media, blogs, tourism pages, or neighborhood guides.
- `tier_5_user_reported`: tips, comments, user screenshots, or user notes.

AI output is never a source. Blogs, Yelp, Google reviews, Tripadvisor, Reddit, comments, search snippets, and user notes are discovery only unless independently confirmed by an official source or direct confirmation. Official social can support evidence, but volatile posts need shorter freshness windows and durable capture.

## Confidence And Workflow Status

Use only the existing `confidence_status` values:

- `verified`
- `probable`
- `unverified`

Use only the existing `workflow_status` values:

- `lead`
- `needs_review`
- `approved`
- `approved_with_uncertainty`
- `rejected`
- `needs_recheck`
- `expired`
- `superseded`

GPT/manual research rows normally start as `workflow_status=lead` or `workflow_status=needs_review`. They should not become `approved` or `approved_with_uncertainty` without official evidence or direct confirmation, durable traceability, and human approval.

## Mapping Research Output To Existing Templates

Map external research into the current templates instead of creating a parallel schema:

- `ops/templates/restaurant-source-list.csv`: restaurant identity, Wilmington location context, and convenience links such as official website, official social, Google Business, and ordering URL.
- `ops/templates/source-inventory-template.csv`: source governance fields such as `source_id`, `restaurant_id`, `source_type`, `source_tier`, `source_owner`, `source_url`, collection method, automation/permission notes, source status, check cadence, `next_check_due`, and evidence storage path.
- `ops/templates/source-captures-template.csv`: point-in-time evidence with `source_capture_id`, `source_id`, `restaurant_id`, `captured_at`, `captured_by`, `capture_method`, source URLs, `evidence_type`, extracted text or confirmation note, `content_hash`, `screenshot_path`, `archive_url_or_path`, metadata, and capture status.
- `ops/templates/deal-intake-template.csv`: candidate claim and publishability fields including `candidate_id`, `restaurant_id`, deal copy, days/times, restrictions, evidence pointers, source metadata, freshness fields, `confidence_status`, `workflow_status`, review fields, public-copy gates, conflict flags, and publish fields.
- `ops/templates/source-checks-template.csv`: manual recheck history with source/check IDs, before/after captures, check result, confidence/workflow changes, affected deals, evidence paths, and `next_check_due`.
- `ops/templates/review-tasks-template.csv`: human review work with related entity IDs, source/direct-confirmation pointers, report source, assignment, `review_reason`, risk flags, priority, status, decision, reviewer fields, and required freshness fields.
- `ops/templates/audit-events-template.csv`: durable event log for approvals, rejections, expirations, source failures, supersessions, and other changes.

If a research result does not map cleanly, keep it in notes until the missing source, evidence, or review relationship is resolved.

## Compatibility Check

Before using a copied GPT, Deep Research, or manual intake folder, run:

```bash
node scripts/validate-research-intake.mjs ops/research/intake/example-area
```

Or through the root package script:

```bash
npm run research:validate -- ops/research/intake/example-area
```

The checker compares present intake CSV headers to the existing `ops/templates` files, allows extra columns, reports missing optional intake files, blocks non-canonical status/source-tier values, flags AI-as-source misuse, warns about discovery-only material used as proof, and blocks unsafe approved deal rows. Passing this check does not publish anything and does not make GPT output evidence.

## Intake Summary

To review an intake folder before any promotion work, run:

```bash
npm run research:summary -- ops/research/intake/example-area
```

For JSON output:

```bash
npm run research:summary -- ops/research/intake/example-area --json
```

The summary is read-only. It reports row counts, status/source-tier counts, missing evidence and freshness fields, discovery-only tiers, rows that look structurally ready for human review, and approval blockers. It does not decide final approval, edit fixtures, or promote candidates.

## Promotion Dry Run

To check which reviewed intake rows could theoretically satisfy the public prototype contract, run:

```bash
node scripts/dry-run-promote-research-intake.mjs ops/research/intake/example-area
```

This is a guard, not an approval system. It reports rows that appear to satisfy the existing public gates and rows blocked by missing evidence, review, freshness, source, copy, conflict, or AI-as-evidence problems. It does not write to `fixtures/prototype/deals.csv`, does not hydrate `/tonight`, and does not create a `--write` mode.

For approved rows that are close to fixture-ready, prepare a read-only fixture comparison packet:

```bash
npm run research:promotion-packet -- ops/research/intake/example-area
```

The promotion packet compares approved intake rows against existing `fixtures/prototype/` rows, separates intake-side static metadata gaps from non-metadata review/evidence/copy gaps, reports whether matching public fixture rows already contain `fixture_data_class=verified_static`, `is_live_data=false`, and the canonical prototype notice, and flags missing public support relationships such as restaurants, sources, captures, checks, review tasks, and audit events. It also reports support-row metadata drift across linked fixture rows, structural relationship drift, informational audit-event ID aliases where an intake review task and public review task use different audit-event IDs while both still resolve to valid public audit history, intake/public deal-field drift, and a fixture-manifest count snapshot so reviewers can decide whether the intake record, fixture row, support rows, manifest, or review history needs reconciliation. It does not write fixtures, approve rows, promote deals, scrape, call external APIs, or create a `--write` mode.

The manifest snapshot is a fixture count ledger, not live inventory. Source coverage should be read as aggregate fixture coverage; an average near one source per restaurant does not mean every restaurant has a source row. Run `npm run validate:data` for full public fixture gate validation.

Final promotion must be a separate reviewed task. Before any real promotion tooling exists, a human still needs to decide fixture mappings for restaurants, sources, source captures, review tasks, audit events, public copy, publication timestamps, and freshness behavior.

## Visual Proof Rules

Publishable evidence must point to durable traceability. Use existing fields:

- `source_capture_id`
- `direct_confirmation_id`
- `evidence_type`
- `evidence_captured_at`
- `evidence_url_or_path`
- `archive_url_or_path`
- `screenshot_path`
- `source_quote`
- `content_hash`

For volatile or visual sources, capture a screenshot or archive path when available. Do not treat a screenshot from a user, GPT summary, or uncited snippet as independent proof. The source quote should quote only what is visible in the captured source, and the `content_hash` should hash the normalized claim or captured text according to `ops/templates/README.md`.

## Service Mode Rules

Every deal intake row should explicitly track whether the special applies to `dine_in`, `takeout`, and `delivery`. Leave unknown values blank during intake rather than guessing, but treat blanks as review blockers before public copy. Dine-in-only restrictions, carryout exclusions, pickup eligibility, delivery eligibility, and location-specific restrictions belong in `restriction_notes` and should be visible to reviewers.

## Human Review

No research row becomes public without human approval. Every approval or rejection should preserve `review_task_id`, `review_decision`, `decision_reason`, `reviewed_by`, `reviewed_at`, and supporting `source_capture_id` or `direct_confirmation_id`.

High-risk records need careful review, especially user-submitted deals, social-only deals, screenshot/PDF/image-only evidence, price-specific claims, free/BOGO claims, ambiguous schedules, and conflicting sources.

## Anti-Staleness

Research intake must preserve freshness fields:

- `next_check_due`
- `expires_on`
- `last_seen_active`

Use `docs/anti-staleness-policy.md` to set review cadence. Same-day wording, stories, screenshots, social posts, older recurring deals, and volatile sources need conservative rechecks or expiration dates.

## Public Promotion

Research intake must not hydrate `/tonight`. Public rows still must satisfy `docs/prototype-data-contract.md`, including the public deal filter, source gate, freshness gate, food gate, review decision, and `fixtures/prototype/deals.csv` boundary.

No official source or direct confirmation means no publish. No durable evidence capture, screenshot/archive path when needed, or direct confirmation means no publish. No human approval means no public deal.
