# Research Intake Support

This folder supports GPT, manual, and Deep Research intake workflows. The user runs external research; Codex does not automatically research restaurants or deals, scrape websites, call external APIs, or promote candidates unless explicitly asked.

GPT output is not evidence. Intake rows are leads or candidates until they are mapped to the existing `ops/templates` files, supported by acceptable source evidence or direct confirmation, and reviewed by a human.

Screenshots, raw captures, and sensitive evidence artifacts should not be committed unless they are intentionally public-safe. Durable evidence should be referenced through existing source capture fields such as `source_capture_id`, `evidence_url_or_path`, `archive_url_or_path`, `screenshot_path`, and `content_hash`.

Final public rows still go through `fixtures/prototype/deals.csv` and the existing publish gates in `docs/prototype-data-contract.md`.

## Intake Folder Naming Convention

All intake folders must use the canonical path and naming format:

```
ops/research/intake/<area>-YYYY-MM-DD/
```

Examples: `ops/research/intake/wilmington-2026-06-10/`, `ops/research/intake/downtown-wilmington-2026-07-01/`.

Do not create intake or sweep directories outside `ops/research/intake/`. Do not use a flat area name without a date suffix. The date suffix is the research run date, not the publication date.

Create a blank packet from the repo templates with:

```bash
npm run ops -- intake:new <area-slug> --area-name "Area Name"
```

Use `--date YYYY-MM-DD` for a specific research-run date. The scaffold command writes only empty template files, `area_brief.json`, `raw/.gitkeep`, and `screenshots/.gitkeep`; it does not research, scrape, approve, or publish anything.

## Validate Intake Compatibility

Place copied external research in a dated intake folder, then run:

```bash
node scripts/validate-research-intake.mjs ops/research/intake/<area>-YYYY-MM-DD
```

Or:

```bash
npm run research:validate -- ops/research/intake/<area>-YYYY-MM-DD
```

Expected intake filenames are `area_brief.json`, `restaurant-source-list.csv`, `source-inventory.csv`, `source-captures.csv`, `deal-intake.csv`, and `review-tasks.csv`. Missing files are reported clearly so a partial intake can still be checked. The validator checks compatibility with existing templates and safety gates only; it does not research, scrape, call APIs, modify fixtures, or promote deals.

## Summarize Intake For Review

Use the read-only summary command to inspect an intake folder before promotion work:

```bash
npm run research:summary -- ops/research/intake/<area>-YYYY-MM-DD
```

For machine-readable output:

```bash
npm run research:summary -- ops/research/intake/<area>-YYYY-MM-DD --json
```

The summary reports counts by source tier and status, missing evidence fields, missing dine-in/takeout/delivery applicability, discovery-only tiers, structurally reviewable rows, and approval blockers. It does not mark rows approved or move anything into `fixtures/prototype/deals.csv`.

## Dry-Run Promotion Guard

Use the dry-run guard to see whether reviewed `deal-intake.csv` rows appear to satisfy the existing public prototype contract:

```bash
node scripts/dry-run-promote-research-intake.mjs ops/research/intake/<area>-YYYY-MM-DD
```

This command is read-only and has no `--write` mode. It uses the same readiness planner as `ops readiness`, so rows that are already public and fixture-clean are reported as already public instead of blocked on fixture-only metadata. It reports rows already public, rows ready for exact-ID promotion, blocked rows, blocker reasons, fields still needed, and destination fixture files. Rows remain blocked if dine-in, takeout/carryout, or delivery applicability is unknown. It does not approve rows, promote candidates, modify fixtures, or make intake data public.

## One-Prompt / One-Command Workflow

For the phase-based ops front door, use:

```bash
npm run ops -- intake:new <area-slug> --area-name "Area Name"
npm run ops -- scrape ops/research/intake/<area>-YYYY-MM-DD --dry-run
npm run ops -- scrape ops/research/intake/<area>-YYYY-MM-DD --source <source_id> --confirm-terms-reviewed
npm run ops -- readiness ops/research/intake/<area>-YYYY-MM-DD
npm run ops -- intake ops/research/intake/<area>-YYYY-MM-DD
npm run ops -- promote:plan ops/research/intake/<area>-YYYY-MM-DD
npm run ops -- promote:apply ops/research/intake/<area>-YYYY-MM-DD --deal <deal_id> --dry-run
npm run ops -- deploy:check
```

`ops readiness` is the Phase 1 automation command. It is read-only and separates rows into `already_public_clean`, `ready_to_promote`, and blocked categories so operators do not chase fixture rows that are already safely public.

## Phase 2 Official-Source Capture

`ops scrape` is the Phase 2 capture command. It only reads source rows already present in `source-inventory.csv` and only attempts rows that are:

- `source_tier=tier_1_official`
- `automation_allowed=true`
- `permission_required=false`
- `login_required=false`
- `source_status=active`
- inside a canonical `ops/research/intake/<area>-YYYY-MM-DD/` packet

Rows with `robots_or_terms_notes` are skipped unless the operator passes `--confirm-terms-reviewed` after reviewing the source terms. Social, partner, third-party, review, user-note, blocked, inactive, login-required, and permission-required rows remain manual or discovery-only.

On capture, the command writes review inputs only:

- `source-captures.csv`
- `source-checks.csv`
- source-level freshness fields in `source-inventory.csv`
- local `raw/` text/HTML artifacts
- local `screenshots/` artifacts unless `--no-screenshot` is used
- local `raw/scrape-results.json`

It does not create deal candidates, approve review tasks, edit `fixtures/prototype/*`, publish public rows, scrape social media, use AI output as evidence, or make public routes depend on live scraping. Successful source checks use existing status vocabulary and leave review state at `workflow_status_after=needs_review` with `confidence_status_after=probable`; failed attempts remain `unverified` and require manual source review.

## Phase 3 Exact-ID Fixture Apply

`ops promote:apply` is the Phase 3 fixture writer. It is not a reviewer and it is not a broad auto-promotion command. Operators must name exact reviewed deal IDs:

```bash
npm run ops -- promote:apply ops/research/intake/<area>-YYYY-MM-DD --deal <deal_id> --dry-run
npm run ops -- promote:apply ops/research/intake/<area>-YYYY-MM-DD --deal <deal_id> --write-reviewed-fixtures
```

The command refuses to write unless all selected deal rows pass the existing promotion blockers after static fixture metadata is applied. It also requires the restaurant, source, source capture, source check, review task, and audit event support rows to exist in the intake packet or match existing public fixture rows exactly. Existing public deal IDs are never rewritten.

When write mode is requested, the command appends only missing exact-ID fixture rows, updates `fixture-manifest.json` counts, runs `npm run validate:data` from `app/`, restores file snapshots on validation failure, and prints the generated git diff after a successful write. It does not scrape, call external APIs, approve review tasks, create deal candidates, or let research rows hydrate public routes.

For a complete operator pass, create the dated intake packet from official-source research, then run:

```bash
npm run research:flow -- ops/research/intake/<area>-YYYY-MM-DD
```

The flow runs:

- intake contract validation
- canonical promotion dry-run/readiness plan
- fixture promotion packet output
- current public fixture data validation
- app typecheck
- app build
- optional smoke with `--smoke` or `FORKCAST_RESEARCH_FLOW_SMOKE=1`

It also writes `promotion-checklist.md` inside the intake folder. The checklist groups blockers by evidence, source tier, freshness, service mode, location scope, copy approval, review mapping, AI/discovery-only evidence, fixture metadata, and other causes. It lists fields still needed, destination fixture files for any future reviewed manual promotion, and the exact next command or operator action.

The flow remains no-public-fixture-write by design. It may write `promotion-checklist.md` inside the canonical intake folder, but it does not edit `fixtures/prototype/*`, approve rows, scrape websites, call external APIs, or make research rows public. Rows can publish only after acceptable official evidence or direct confirmation, verified confidence, approved review, approved public copy, food-only alcohol classification, no conflicts, valid evidence paths/screenshots/hashes, valid relationships, freshness metadata, and a passing fixture validation gate.

AI output is never source evidence. Third-party aggregators, social chatter, reviews, comments, and user notes can create leads, but they cannot publish a deal without acceptable official evidence or direct confirmation.
