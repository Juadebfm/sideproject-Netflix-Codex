# AGENTS.md

## Project

- Name: `Netflix Codex`
- Type: mobile-first React web app with Vercel-hosted API functions and MongoDB Atlas
- Goal: help users discover better Netflix titles faster through curated and rule-based recommendations, organized Netflix category codes, copy actions, and direct-open Netflix links

## Current Truths

- The repository is in planning/bootstrap stage.
- `frontend-design-system.md` and `backend-system-design.md` are the current source-of-truth design docs.
- Core product usage is anonymous-first; login is optional later.
- No paid APIs are planned for MVP.
- Ingestion must be cautious, source-aware, and kept out of live user request paths.

## Working Expectations

- Prefer simple, maintainable architecture over speculative scale work.
- Keep frontend mobile-first and accessibility-conscious from day one.
- Keep backend modular, with clear boundaries for `catalog`, `taxonomy`, `recommendations`, `analytics`, `auth`, and `ingestion`.
- Never store secrets in repo docs or context files.
- Mark unknowns with `TODO` instead of inventing policy.

## PR Conventions

- Deliver roadmap items as separate PRs from `dev` into `main`.
- Keep PR descriptions and PR review comments short, instructive, and written as bullet points.
- Do not require file references in PR comments unless explicitly requested later.

## Recommended Workflow

1. Update context docs when major product or architecture decisions change.
2. Plan substantial work before coding.
3. Implement in thin vertical slices.
4. Add tests alongside behavior, not after the fact.
5. Review security, accessibility, and docs impact before release.

## Key Docs

- [context.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/context.md)
- [architecture.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/architecture.md)
- [frontend-design-system.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/frontend-design-system.md)
- [backend-system-design.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/backend-system-design.md)
- [testing-strategy.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/testing-strategy.md)
- [security-baseline.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/security-baseline.md)
- [accessibility-baseline.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/accessibility-baseline.md)
- [api-guidelines.md](/Users/macbookpro/Documents/GitHub/sideproject-Netflix-Codex/api-guidelines.md)
