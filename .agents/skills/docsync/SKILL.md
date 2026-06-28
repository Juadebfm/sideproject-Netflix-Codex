---
name: docsync
description: Keep project documentation aligned with code changes by updating architecture notes, API docs, ADRs, runbooks, examples, and release notes when behavior or operational knowledge has changed.
---

Use this skill whenever a change affects how the system works, how it is used, or how it is operated.

## Read Order

- task or PR summary
- `docs-plan.md`
- impacted code
- existing docs that describe the changed behavior

## Determine What Changed

Check whether the change affects:

- public behavior
- setup or configuration
- API contracts
- architecture decisions
- operational procedures
- rollout or rollback instructions

## Output

Produce a doc update plan:

- files that must change
- files that should be reviewed
- missing docs that should be created
- exact facts that need to be reflected

If editing docs directly, preserve truth over polish. Do not leave stale examples behind.
