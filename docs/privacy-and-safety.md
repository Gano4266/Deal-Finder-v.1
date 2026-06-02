# Privacy And Safety

## Initial Data Collection

The scaffold assumes no user accounts and no native app permissions. Future implementations should collect only what is needed for the product.

## Location

The MVP should support browsing without precise location. If location is added later, it should be optional and used only to sort or filter nearby deals.

## Analytics

Analytics should be privacy-conscious and limited to product health:

- feed views
- deal detail views
- report submissions
- filter usage
- source/report quality metrics

Do not collect precise location or personal identity unless a later feature requires it and the privacy policy is updated.

## User Reports

Reports should lower confidence or create review tasks when credible. Public user content should not publish automatically.

In the static prototype, `/report` is a manual handoff surface. It may prefill an email template when a reporting inbox is configured, but it does not store submissions, create accounts, or collect precise location. Report copy should ask for only the correction context, an official source or restaurant confirmation when available, and optional contact information for follow-up.

## Restaurant Corrections

Restaurant correction requests should be prioritized. A credible restaurant correction can temporarily hide or downgrade a deal until reviewed.

## Native Permissions

If a future native app requests notifications, location, camera, or photos, each permission must be tied to a clear user benefit and documented before implementation.
