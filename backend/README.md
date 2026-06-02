# Future Backend

This folder is a placeholder for future API, database, and job documentation or code.

## Responsibilities

- Store restaurants, sources, source captures, deal candidates, reviewed deals, review tasks, source checks, and audit events.
- Enforce that no public deal can exist without source evidence.
- Support admin review actions.
- Serve the public app with active, non-expired, reviewed deals.

## Default Direction

Use Postgres when persistence begins. Choose Prisma or Drizzle during database implementation, after the static prototype validates the product shape.
