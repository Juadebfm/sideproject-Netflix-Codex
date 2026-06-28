---
name: ship
description: Review whether a change is truly ready for release by checking migrations, configuration, observability, rollback readiness, smoke tests, and operational risk before deployment.
---

Use this skill before merging important work or deploying anything that could affect real users.

If a term feels unfamiliar, read `glossary.md`.

## Goal

Answer one simple question:

`If we deploy this today, are we ready for what happens next?`

## Read Order

- `release-checklist.md`
- task or release summary
- relevant deployment or infra files
- changed code and tests

## Check In This Order

### 1. What must be true before deploy?

Check:

- tests that matter for this change
- migrations or backfills
- feature flags
- environment variables and config changes

### 2. How will we know if something goes wrong?

Check:

- monitoring
- logs
- alerts
- visible signals that the release is healthy or unhealthy

### 3. Can we recover safely?

Check:

- rollback path
- safe disable path
- user communication or support impact

### 4. What should we verify after deploy?

Check:

- smoke tests
- core user flows
- dashboards or logs to watch

## Output

Produce:

## Release Readiness - [Change]

- Ready / Not ready
- Blocking risks
- Required pre-deploy steps
- Required post-deploy checks
- Rollback notes

If evidence is missing, do not assume readiness.
