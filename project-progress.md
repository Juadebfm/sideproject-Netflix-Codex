## Project Progress - Netflix Codex

### Overall Progress

```text
[███████░░░] 75%
```

- Overall completion: 75%
- Current phase: catalog truth hardening and verified-source cleanup
- Last updated: June 29, 2026

### Milestones

| Milestone | Status | Progress | Notes |
| --- | --- | --- | --- |
| Product and architecture foundation | Done | 100% | Kickoff direction, context pack, frontend design system, backend system design, and rollout structure are all present in repo docs. |
| Frontend discovery experience | In progress | 78% | The live UI now focuses on searchable category-code rows with copy/open actions and can request a larger result window, but still lacks UI automation and the planned submission flow. |
| Backend public API and data contract | In progress | 86% | Search, recommendations, category detail, analytics intake, health, and cron kickoff now read from canonical Mongo-backed collections with explicit unavailable errors, CORS support, and a stricter source-backed category contract. |
| Ingestion and canonical catalog pipeline | In progress | 80% | Multi-source ingestion now relies on live `Netflix-Codes` and `Teen Vogue` adapters for public catalog titles, preserves provenance, and keeps the starter dataset out of the public category contract. |
| Quality, security, accessibility, and release readiness | In progress | 24% | Typecheck, web build, and new backend unit tests pass, but integration tests, rate limits, admin protection, and smoke checks are still missing. |

### Feature Breakdown

- Search and category discovery: In progress - public search and category endpoints now read from canonical Mongo-backed data after ingestion and now favor source-backed catalog truth over local descriptions.
- Recommendation filtering: In progress - mood and group-friendly filters are real, and region now returns exact matches or explicit fallback metadata.
- Canonical data source: In progress - the catalog now uses live `Netflix-Codes` and `Teen Vogue` sources for public category truth, while the curated starter dataset stays recommendation-only.
- Analytics capture: In progress - allowed events, validation, and persistence flow exist, but abuse controls and reporting are not built.
- Scheduled ingestion: In progress - cron and ingestion-run plumbing now execute a multi-source import path with dedupe and source-priority behavior.
- Optional auth and saved preferences: Not started - still intentionally deferred for post-MVP work.

### Done

- Product kickoff and planning docs were completed and aligned around an anonymous-first MVP.
- The initial six implementation slices were opened as separate PRs and merged into `origin/main`.
- The monorepo scaffold, React frontend, Vercel-function API shape, and MongoDB foundation are in place.
- Public API routes exist for search, recommendations, category detail, analytics events, health, and cron-triggered ingestion kickoff.
- The first discovery experience exists with search, recommendation cards, copy-code flow, and open-in-Netflix actions.
- Vulnerable API runtime dependency work was cleaned up earlier and the prior audit snapshot returned `0 vulnerabilities`.
- Current local hardening work removes silent fallback behavior, adds explicit seeded canonical data, and makes malformed analytics JSON return `400`.
- The first real ingestion slice now imports starter recommendations plus live `Netflix-Codes` and `Teen Vogue` category sources into MongoDB, stores raw provenance records, merges duplicate codes by source priority, and switches public discovery reads to canonical collections.
- A local `npm run db:seed` command now exists for initializing the catalog through the same ingestion path used by cron.
- Current local work passes `npm run build:web`, `npm run typecheck`, and backend unit tests.
- The live seeded catalog now includes hundreds of deduped category codes instead of only the four starter rows.
- Current local hardening work removes invented public category descriptions and replaces them with source-backed provenance labels.

### Not Done Yet

- Define the exact approved public sources and review criteria for ingestion.
- Implement the third approved remote source adapter after `Netflix-Codes` and `Teen Vogue`.
- Define Mongo collection indexes and longer-term persistence rules.
- Add backend integration tests plus UI coverage for the discovery flow.
- Add rate limiting, admin authentication for protected actions, and release smoke checks.
- Run the first seeded import against a configured environment and verify end-to-end API behavior manually.

### Blockers

- Data readiness is no longer blocked on the first two remote sources, but catalog completeness still depends on adding more approved sources beyond `Netflix-Codes` and `Teen Vogue`.
- Release confidence is limited by the absence of automated tests and smoke coverage.
- Operational confidence is still limited because multi-source ingestion has unit coverage but not yet backend integration coverage.

### Next Highest-Value Work

- Finalize the third approved ingestion source and the acceptance checklist for using it.
- Add integration tests around multi-source dedupe, source-priority conflicts, and seeded catalog counts.
- Add integration tests for search, recommendations, analytics validation, and scheduled ingestion behavior.
- Add UI coverage for search, filter, copy, open, empty, and error states.
- Add the pending user-submission flow and admin review/promotion path.

### Confidence Notes

- The percentages weight major user-visible capabilities and core platform foundations more heavily than deferred support work.
- Evidence comes from repo docs, merged PR history on `origin/main`, and the current local code state.
- Overall progress stays below three-quarters because the first remote source is live, but catalog completeness, moderation flows, integration coverage, and release controls are still unfinished.
- Some of the newest hardening work exists only in the local working tree today, so implementation progress is slightly ahead of shipped-main progress.
