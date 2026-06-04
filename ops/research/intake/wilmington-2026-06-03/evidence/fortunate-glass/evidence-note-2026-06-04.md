# Fortunate Glass Evidence Note - 2026-06-04

Scope: durable evidence hardening for the existing Fortunate Glass soup candidate only.

Official source checked:

- Homepage: https://www.fortunateglass.com/
- Weekly Specials PDF: https://cdn.prod.website-files.com/5dcc3f2fe62de194794ac6ab/6a078f1a114bab7f2aabc7d9_WINES%20-%202026-05-15T150957.674.pdf

Local artifacts:

- `homepage-2026-06-04.html`
  - SHA-256: `03ad9a9e2c02c2f78480bfedcc0fa7ba67a0ce55545702e1e7522345747eb0f8`
- `weekly-specials-2026-05-15.pdf`
  - SHA-256: `20b6615ae5e449e389f33db7531ca74b0b1a96b7c75e8b348f3cf506344012d0`
  - HTTP `Last-Modified`: `Fri, 15 May 2026 21:24:43 GMT`
  - HTTP `ETag`: `739682c71d63be09ccbc690cdf817072`
  - Content length: `66396`
- `weekly-food-specials-normalized-text-2026-06-04.txt`
  - SHA-256: `74f39a74ca4519ca05e7534e64d838ef4d715a6a30fee41febd38c1df658c2ce`

Evidence summary:

The official homepage links the Weekly Specials PDF. The PDF has an embedded `WEEKLY FOOD SPECIALS` section. The normalized evidence text captures the food-only items relevant to review, including the Chicken Mole Black Bean Soup candidate and a separate flatbread item. Alcohol, wine, beer, and THC specials are excluded from the candidate.

Review status:

- Keep `workflow_status=needs_review`.
- Keep `mvp_publish_eligible=false`.
- Keep `public_copy_approved=false`.
- Keep `review_decision` blank until human review.
- Remaining review issues: no day/time window found in the PDF text, alcohol suppression still required, and reviewer must decide whether the bare PDF price `18` should be represented as `$18`.
