# Tests

This folder is reserved for future acceptance checks, fixtures, and validation tests.

The current data integrity check lives in `../scripts/validate-data.mjs` and can be run from `app/`:

```sh
npm run validate:data
```

## Future Checks

- All public deals have source evidence.
- Expired deals do not appear in the public feed.
- Wilmington-only scope is enforced.
- Demo data is clearly labeled.
- Source, freshness, confidence, and restrictions appear on mobile deal cards.
- Admin review can approve, reject, edit, and expire candidate deals.
