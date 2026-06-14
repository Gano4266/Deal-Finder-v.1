# Deployment

This is a public soft-pilot deployment guide for the Wilmington Forkcast PWA.

## Recommended Path

Use Vercel first. The app is a Next.js project in `app/`, while prototype data and evidence live at the repo root.

Vercel project settings for Git import:

- Framework preset: Next.js.
- Root Directory: `app`.
- Include source files outside of the Root Directory: enabled.
- Build Command: default, or `npm run build`.
- Install Command: default, or `npm ci`.
- Output Directory: default.

The outside-source setting and `app/next.config.mjs` file tracing matter because the app reads:

- `../fixtures/prototype/*.csv`
- `../ops/seeds/*.csv`
- `../fixtures/prototype/evidence/**`

Vercel’s monorepo docs say the Root Directory can be set to the app folder, and its Monorepos FAQ says to enable source files outside the Root Directory when a project needs shared files outside that folder.

The Next config sets `outputFileTracingRoot` to the repo root and includes `../fixtures/**`, `../ops/seeds/**`, and admin ops/research files. Vercel’s file guidance recommends Next file tracing for serverless functions that read files at runtime.

If the GitHub integration is not installed, use the checked-in root `vercel.json` and deploy from the full repo directory with the Vercel CLI. That uploads the repo-root fixture files while running the build inside `app/`.

## Environment

Production environment variables:

```sh
DEAL_FINDER_ADMIN_ENABLED=false
HUBSPOT_PORTAL_ID=your_hubspot_portal_id
HUBSPOT_INTAKE_FORM_GUID=your_deal_finder_intake_form_guid
REPORT_WEBHOOK_URL=
NEXT_PUBLIC_REPORT_EMAIL=
```

`REPORT_WEBHOOK_URL` is only a generic fallback. `NEXT_PUBLIC_REPORT_EMAIL` is only an emergency fallback if the in-app intake is unavailable. Leave `DEAL_FINDER_REPO_ROOT` unset unless deployment logs say the app cannot locate `fixtures/prototype/deals.csv`.

## Pre-Deploy Gate

Run locally from the repo root:

```sh
npm run verify
```

This checks promotion-blocker regression tests, admin guard regression tests, typecheck/lint, public fixture data validation, and production build. Vercel also runs `npm run verify` through the checked-in `vercel.json`, so deploys fail before build output if fixture validation fails.

For the heavier local acceptance pass from `app/`, run:

```sh
npm run accept
```

This additionally checks public route smoke, production admin-disabled behavior, PWA manifest/icons, proof assets, and iPhone-size mobile screenshots.

## Post-Deploy Gate

After Vercel gives you a URL, run:

```sh
cd app
DEAL_FINDER_SMOKE_BASE_URL=https://YOUR-VERCEL-URL.vercel.app \
DEAL_FINDER_SMOKE_ADMIN_MODE=disabled \
DEAL_FINDER_SMOKE_SKIP_REPORT_POST=1 \
npm run smoke

DEAL_FINDER_SMOKE_BASE_URL=https://YOUR-VERCEL-URL.vercel.app \
npm run mobile:smoke
```

Then test on iPhone Safari:

1. Open the live URL.
2. Confirm `/tonight`, `/deals`, one deal detail page, `/restaurants`, and `/report`.
3. Tap Send note and confirm the in-app form submits to HubSpot with the success copy: "Thanks. This will be reviewed before anything changes on the site."
4. Tap Share, then Add to Home Screen.
5. Open the home-screen icon and confirm it starts at `/tonight`.

## Production Rules

- Do not enable `/admin` for the friend pilot. Production `/admin/*` returns 404 unless `DEAL_FINDER_ADMIN_ENABLED=true`.
- Keep `robots.txt` no-indexed during the private soft pilot.
- Do not present prototype rows as live availability.
- Keep HubSpot intake variables configured before sharing the report form.
- Re-run data validation before every public data update.
- Recheck public deals before broad sharing if any `next_check_due` date is overdue.
