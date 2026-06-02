# Roadmap

## Phase 0: Docs Scaffold

- Create project docs, validation policy, and operating templates.
- Define Wilmington-only scope.
- Lock the web/PWA-first platform direction.
- Capture the first 25-restaurant operating milestone.

## Phase 1: Static Data Prototype

- Maintain the mobile-first Next.js/PWA static app.
- Load reviewed static data from repo-managed fixtures.
- Keep `/tonight`, `/deals`, `/deals/[dealId]`, `/carryout`, `/admin/review`, and `/admin/source-gaps` guarded by validation.
- Clearly label static prototype data so it is never confused with live deals.
- Next Phase 1 work: durable screenshots/archive captures and resolution of open seed review tasks.

## Phase 2: Reviewable Data MVP

- Add Postgres-backed restaurants, sources, source checks, candidates, and deals.
- Import seed data from the CSV templates.
- Add admin review actions.
- Publish only reviewed deals.

## Phase 3: Scanner-Assisted Workflow

- Add fetch/capture workers for official websites and menu pages.
- Store source snapshots, extracted text, content hashes, and screenshots where useful.
- Use AI extraction to create candidate deals, not public deals.
- Route uncertain or stale candidates to review.

## Phase 4: PWA Polish

- Add installable manifest, icons, responsive tuning, and fast iPhone layouts.
- Evaluate web push only after the product has repeat usage.
- Keep native-app requirements documented separately.

## Phase 5: Native App Decision

- Consider Expo/React Native if iOS and Android retention features matter.
- Consider SwiftUI only if deep Apple-native capabilities become central.
- Do not ship a thin web wrapper to the App Store.
