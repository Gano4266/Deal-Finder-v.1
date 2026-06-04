# Michaelangelo's Pizza Monkey Junction Slice/Drink Evidence

Scope: non-public review evidence for `cand-wilmington-michaelangelos-mj-slices-drink-2026-06-04`.

Official source checked:

- Page: https://www.michaelangelosmj.com/specials
- Image asset: https://static6.mysiteserver.net/Images/michaelangelos/site/images/specials/2-cheese-slices-and-fountain-drink.png

Saved artifacts:

- `michaelangelos-specials-page-2026-06-04.html`
  - sha256: `97d4c0cb442d2e0e70d5b1bff6d86377ebcff96a154a5ebbaa27bc3a04b0375f`
- `michaelangelos-specials-page-2026-06-04.png`
  - sha256: `c134791d9d005dbaebfc88e7d74f5f2734cd47922a1648edf7f293822d395d23`
- `2-cheese-slices-and-fountain-drink-2026-06-04.png`
  - sha256: `47e3e2409a2dd726d4fe29961cc87d73d1a6e9daed671db41905a9b03a703ebe`
- `normalized-ocr-slices-drink-2026-06-04.txt`
  - sha256: `03ba69c26280cc4575e8fba5127df1942b4e8e371fd3f1f7427b477f5eb9e671`

Normalized OCR/manual extraction:

- Deal: 2 cheese slices plus fountain drink.
- Price: $6.99.
- Service mode: dine in or pick up only.
- Page-level restrictions: cannot combine offers; limited time; premium toppings may cost extra; prices subject to change.
- Location shown on official page: Village at Myrtle Grove, 5617 Carolina Beach Rd #110, Wilmington, NC 28412.

Review disposition:

- Keep `confidence_status=verified` because the source is official.
- Keep `workflow_status=needs_review`.
- Keep `mvp_publish_eligible=false` and `public_copy_approved=false`.
- Keep Monkey Junction boundary review and limited-time/no-end-date blockers.
- OCR/screenshot blockers are partly resolved by this packet, but reviewer verification is still required because the price is image-based.
