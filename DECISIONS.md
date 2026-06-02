# Decisions

This file records defaults chosen for the MVP scaffold. Revisit decisions when product evidence changes.

## 2026-06-01: Web/PWA First

Decision: Start with a mobile-first web/PWA path instead of Xcode/SwiftUI.

Reason: The riskiest part of the MVP is accurate deal inventory and operations, not native UI. Web gives faster iteration, shareable pages, and simpler admin tooling.

## 2026-06-01: Wilmington, NC Only

Decision: The first market is Wilmington, North Carolina only.

Reason: A narrow local market makes source quality, restaurant coverage, and weekly operations testable.

## 2026-06-01: Source Evidence Required

Decision: No public deal can be published without evidence.

Reason: Trust is the product. Each public deal must have a source URL or direct-confirmation note, capture date, source tier, reviewer/status, and recheck or expiration date.

## 2026-06-01: Human Review Before Publication

Decision: Human review is required before a deal appears publicly in the first MVP.

Reason: Source formats are messy, social posts are stale quickly, and AI extraction can overstate certainty.

## 2026-06-01: CSV Templates As First Ops Workflow

Decision: Use repo-managed CSV and Markdown templates for the first operating workflow.

Reason: They are easy to audit, version, and later import into a database.
