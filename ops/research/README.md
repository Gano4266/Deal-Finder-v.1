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

This command is read-only and has no `--write` mode. It reports theoretically promotable rows, blocked rows, blocker reasons, fields still needed, and destination fixture files that would eventually need separate reviewed manual updates. Rows remain blocked if dine-in, takeout/carryout, or delivery applicability is unknown. It does not approve rows, promote candidates, modify fixtures, or make intake data public.

## One-Prompt / One-Command Workflow

For a complete operator pass, create the dated intake packet from official-source research, then run:

```bash
npm run research:flow -- ops/research/intake/<area>-YYYY-MM-DD
```

The flow runs:

- intake contract validation
- promotion dry-run
- fixture promotion packet output
- current public fixture data validation
- app typecheck
- app build
- optional smoke with `--smoke` or `FORKCAST_RESEARCH_FLOW_SMOKE=1`

It also writes `promotion-checklist.md` inside the intake folder. The checklist groups blockers by evidence, source tier, freshness, service mode, location scope, copy approval, review mapping, AI/discovery-only evidence, fixture metadata, and other causes. It lists fields still needed, destination fixture files for any future reviewed manual promotion, and the exact next command or operator action.

The flow remains no-public-fixture-write by design. It may write `promotion-checklist.md` inside the canonical intake folder, but it does not edit `fixtures/prototype/*`, approve rows, scrape websites, call external APIs, or make research rows public. Rows can publish only after acceptable official evidence or direct confirmation, verified confidence, approved review, approved public copy, food-only alcohol classification, no conflicts, valid evidence paths/screenshots/hashes, valid relationships, freshness metadata, and a passing fixture validation gate.

AI output is never source evidence. Third-party aggregators, social chatter, reviews, comments, and user notes can create leads, but they cannot publish a deal without acceptable official evidence or direct confirmation.
