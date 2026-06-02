# Prototype Fixtures

These files are for Phase 1 static prototype work. They are not live data, not production data, and not a claim that any deal is currently available.

## Rules

- Keep `ops/templates/` blank and reusable.
- Use these fixture files for prototype rows.
- Every visible prototype deal must pass the public filter in `docs/prototype-data-contract.md`.
- Source-backed seed candidates from `ops/seeds/` are not public prototype deals until copied into `fixtures/prototype/deals.csv` with review, evidence, and freshness fields.
- Real restaurant names may only be paired with real deal claims when a dated source is recorded.
- Use `fixture_data_class=verified_static` only when evidence was manually reviewed.
- Use `fixture_data_class=demo_only` for invented/anonymized UI examples.
- Use `fixture_data_class=ops_example` for rows that exist only to demonstrate workflow states.

## Traceability

Visible prototype deals should trace:

```text
deal_id
-> review_task_id
-> source_capture_id or direct_confirmation_id
-> source_check_id when available
-> source_id
-> restaurant_id
```

For public prototype deals, source captures also preserve durable evidence-file metadata. `content_hash` hashes the normalized captured text; `metadata_json.evidence_file_sha256` hashes the local evidence artifact bytes and is checked by `npm run validate:data`.

## Non-Live Notice

The Phase 1 app must display a clear static-data notice until live verification exists. Do not use copy such as "available tonight," "open now," "current deal," or "verified today" unless it is actually true for the verification date.
