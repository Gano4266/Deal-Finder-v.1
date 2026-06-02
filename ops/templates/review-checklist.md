# Review Checklist

Use this checklist before approving or rejecting a candidate deal.

## Source

- Source URL or direct-confirmation note is present.
- Source tier is assigned.
- `source_id` is present when the evidence came from a tracked source.
- `source_capture_id` or `direct_confirmation_id` is present.
- Evidence capture date is present.
- Source quote or evidence summary is captured.
- Screenshot or archive is attached for volatile evidence.
- AI output is not treated as a source.

## Direct Confirmation

- Contact method, contact name or role, and confirmation time are recorded.
- Confirmed fields are listed.
- Direct confirmation has an expiration or next recheck date.

## Location

- Restaurant is in Wilmington, NC.
- Wilmington-specific proof is recorded.
- Multi-location source clearly applies to the Wilmington location.
- Nearby markets are not included unless explicitly approved.

## Deal Details

- Deal title and description are clear.
- Price or discount is included only if visible in the source.
- Days, dates, and times are captured when known.
- Restrictions are captured.
- Restrictions are copied exactly when the source wording matters.
- The deal is a special, not just a standard menu item.
- Public copy is checked against evidence and does not infer savings.
- Alcohol classification is recorded.
- Alcohol-only deals are blocked from MVP publication.
- Mixed food/alcohol specials use food-safe public copy only.
- MVP publish eligibility and any block reason are recorded.

## Freshness

- `last_seen_active` is set.
- `expires_on` or next recheck date is set.
- Source-level and deal-level `next_check_due` are set when applicable.
- Expiration rule matches the source type and offer language.
- Freshness window matches the source type.
- Same-day or limited-time language is handled conservatively.

## Conflict Check

- Newer official sources do not contradict the deal.
- Conflicting source URLs or notes are recorded.
- Any affected existing deal or superseded deal is linked.

## Decision

- Approve only if evidence supports the public copy.
- Use `approved_with_uncertainty` for publishable but cautious records.
- Use `needs_review` if source, location, date, price, or restrictions are unclear.
- Reject if the deal cannot be verified.
- Record reviewer identity, review timestamp, final `workflow_status`, and decision reason.
- Record next action owner/date for any unresolved issue.
- Confirm the visible deal can be traced back to evidence before publishing.
