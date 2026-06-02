# Weekly Ops Runbook

This runbook is for the first 25 Wilmington restaurants.

## Time Budget And Stop Conditions

Target 3-5 hours per week for the first 25 restaurants.

- Daily triage: 10-15 minutes.
- Monday recurring-specials pass: 60-90 minutes.
- Thursday weekend/social pass: 60-90 minutes.
- Weekly audit summary: 30-45 minutes.

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
