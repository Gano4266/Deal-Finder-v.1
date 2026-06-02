# Weekly Ops Runbook

This runbook started with the first 25 Wilmington restaurants and now supports the Phase 1 static prototype set of roughly 35 restaurants. Do not expand the tracked restaurant set again until overdue checks, credible reports, and evidence-hardening work are under control.

## Time Budget And Stop Conditions

Target 4-6 hours per week for the current 35-restaurant prototype set. If only 3-5 hours are available, prioritize public-deal safety over adding new restaurants or new deal rows.

- Daily triage: 10-15 minutes.
- Monday recurring-specials pass: 60-90 minutes.
- Thursday weekend/social pass: 60-90 minutes.
- Weekly audit summary: 30-45 minutes.
- Evidence-hardening pass: 30-60 minutes until all public deals have screenshots, archives, or direct confirmations.

Stop after the time budget only if all public deals past `expires_on` are hidden, all credible restaurant corrections are handled, and all high-risk `needs_review` items have an owner and next action date.

## Daily

- Review credible user or restaurant reports.
- Check deals expiring today or tomorrow.
- Check overdue `next_check_due` for deals and sources.
- Review `needs_review` and `needs_recheck`.
- Review failed source checks.
- Review high-risk social/user-submitted deals.
- Complete the weekly random audit sample when scheduled.
- Lower confidence or hide deals with credible unresolved issues.

Minimum daily quota: clear all corrections and reports, then handle the five highest-risk overdue review items.

Report handoff SLA: credible restaurant corrections and user reports should become review tasks the same day they are seen. Assign an owner, affected deal/source, priority, next action, and next action due date before considering the report triaged.

## Monday

- Review recurring weekday specials.
- Check source health for official websites and menus.
- Update `last_seen_active`, `expires_on`, and `next_check_due`.
- Hide public deals past `expires_on` unless newer evidence extends them.

Minimum Monday quota: check at least 10 restaurant sources or every overdue source, whichever is smaller.

## Thursday

- Review weekend specials, brunch deals, event-tied food specials, and social posts.
- Confirm limited-time deals do not stay public past the weekend.
- Open or update review tasks for source failures affecting public deals.

Minimum Thursday quota: check all weekend/event deals and at least five volatile social or screenshot-backed sources.

## Evidence Hardening

- Prioritize public deals without screenshot, archived-page, or direct-confirmation durability.
- Add or refresh durable evidence before promoting additional restaurants.
- Record the hardening action in source capture, source check, review task, or audit event rows as appropriate.
- Keep food-only copy and alcohol suppression notes attached to the evidence trail.

## Weekly Audit

- Sample active deals and verify source evidence.
- Check that every active deal has a source URL or direct-confirmation note.
- Confirm stale or ambiguous records are not public.
- Record source failures and review backlog.

## Weekly Audit Summary

Use `ops/templates/weekly-audit-summary-template.md`.

Record:

- active, expired, `needs_review`, and `needs_recheck` deal counts
- overdue source checks
- overdue deal rechecks
- failed source checks
- changed sources
- deals downgraded or hidden
- review tasks opened and closed
- restaurants with no successful check in 30 days
- deals missing evidence paths
- audit events created

## Monthly

- Review restaurant status.
- Update source URLs.
- Revisit Wilmington boundary decisions if users request nearby markets.
- Review stale-rate and correction-rate trends.
