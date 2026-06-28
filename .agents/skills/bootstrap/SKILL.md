---
name: bootstrap
description: Set up or refresh the project's editable AI context pack so later skills can work from accurate architecture, standards, testing, security, accessibility, documentation, and release guidance.
---

Use this skill when a project is adopting the workflow for the first time or when its context files are stale.

## Goal

Create or refresh a clean, editable context pack that reflects the real project instead of generic assumptions.

## Read First

Inspect the repository before writing anything:

- existing agent instruction files
- main README and docs
- current architecture and folder layout
- test setup
- linting, formatting, and build configuration
- security or accessibility guidance if present

Do not overwrite working project documentation blindly.

## Files This Skill Manages

Use the editable templates from `templates/context-pack/`:

- `AGENTS.md`
- `context.md`
- `architecture.md`
- `coding-standards.md`
- `testing-strategy.md`
- `security-baseline.md`
- `accessibility-baseline.md`
- `api-guidelines.md`
- `docs-plan.md`
- `release-checklist.md`
- `frontend-design-system.md`
- `backend-system-design.md`
- `glossary.md`
- `memory.md`
- `ui-registry.md`

Use support templates from `templates/support/` when needed.

## Workflow

### Step 1

Audit what already exists and identify:

- files that can be reused
- missing context files
- outdated files that should be refreshed

### Step 2

For each managed file:

- preserve project-specific truths
- replace placeholders with concrete local context when available
- keep unknown sections clearly marked with `TODO`

Never invent architecture, dependencies, or team policies.

### Step 3

Call out important gaps before finishing:

- no test strategy
- no release checklist
- no security baseline
- no accessibility baseline
- no UI registry for frontend work

### Step 4

Produce a short handoff:

- files created
- files refreshed
- files intentionally skipped
- highest-priority TODOs

## Rules

- Never store secrets in any context file.
- Prefer concise, durable guidance over long prose.
- If an existing file conflicts with repository reality, flag the conflict.
- If a file already exists and would be substantially replaced, summarize the planned overwrite before changing it.
