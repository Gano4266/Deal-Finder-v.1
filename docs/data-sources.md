# Data Sources

## Source Tiers

- `tier_1_official`: restaurant site, official menu, official ordering page, newsletter, direct confirmation.
- `tier_2_official_social`: restaurant-owned Instagram, Facebook, TikTok, Google Business posts.
- `tier_3_partner`: Toast, Square, DoorDash, Uber Eats, Resy, OpenTable, event/menu vendors clearly tied to the restaurant.
- `tier_4_secondary`: local media, blogs, tourism pages, neighborhood guides.
- `tier_5_user_reported`: tips, comments, user screenshots.

AI output is never a source. AI can extract, classify, normalize, and flag uncertainty, but it cannot justify publication.

## Source Authority Order

Use this priority order when reviewing seed leads and deal candidates:

1. Official restaurant website, menu, or specials page.
2. Official restaurant Instagram/Facebook post.
3. Direct confirmation from restaurant.
4. Local deal aggregators used as discovery only.
5. Reddit, reviews, comments, screenshots, and user notes used as leads only.

Third-party aggregators, Reddit, reviews, comments, and user notes cannot make a deal publishable by themselves.

Direct confirmation is treated as `tier_1_official` evidence when captured with reviewer identity, date, and confirmation details. In the authority order it sits below public restaurant-owned sources because public links are easier for users and reviewers to recheck.

## Source Rules

- Official restaurant sources outrank secondary sources.
- Third-party and user-reported sources are leads unless reviewed.
- Social posts are valid but volatile and require shorter freshness windows.
- Screenshot or archived evidence is required for sources that may disappear, including stories, emails, PDFs, and image posts.
- If a source is ambiguous about location, do not publish until Wilmington, NC relevance is confirmed.

## Manual vs Automated Capture

Start with manual and browser-assisted capture. Automated scanner work should begin with official websites and menu pages. Do not make fully automated Instagram/Facebook scraping part of the first implementation.

## Attribution

Public deal details should include a source link when possible and a last verified date. Internal records should preserve source tier, source name, captured timestamp, and reviewer notes.

## Source Failure

If a source disappears or contradicts an active deal, route the deal to review. Do not silently keep a deal public because it used to be valid.
