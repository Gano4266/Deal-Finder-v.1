# Anti-Staleness Policy

Freshness is rule-driven, not memory-driven. Every public deal needs `last_seen_active`, `expires_on`, and/or `next_check_due`.

## Freshness Defaults

- Website/menu/order page: recheck every 30 days.
- Official social post: recheck every 14 days.
- Story/email/screenshot-only deal: expires after 7 days unless dated.
- Third-party ordering/platform source: recheck every 14 days.
- Secondary article/blog: expires after 30 days unless confirmed elsewhere.
- Explicit end date: expire on `end_date + 1 day`.
- Recurring deal without recent evidence: mark `needs_review` after 45 days.

## Recheck Ownership

- Source-level `next_check_due` belongs in the source inventory and drives routine source checks.
- Deal-level `next_check_due` belongs on deal intake/public deal records and drives whether a visible deal needs review.
- `expires_on` is the public-hide boundary. `next_check_due` is the operational review boundary.
- If a deal has both, the earlier date gets reviewed first. The deal must be hidden after `expires_on` unless newer evidence extends it.

## Expiration Rules

- Expired deals should not appear in the public feed.
- Overdue rechecks should downgrade to `needs_recheck`.
- If a source disappears, route the related deal to review.
- If a restaurant appears closed or ownership changes, route all active deals to review.
- Same-day wording such as "today," "tonight," and "while supplies last" should expire quickly unless confirmed again.

## Audit Cadence

- Daily: inspect urgent reports and expiring deals.
- Weekly: recheck active recurring deals and source health.
- Monthly: review restaurant status, source coverage, and stale-rate trends.
