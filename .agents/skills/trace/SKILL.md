---
name: trace
description: Debug a problem by reproducing it, narrowing scope, identifying the root cause, proposing the smallest correct fix, and validating that the failure cannot silently return.
---

Use this skill when something is broken and the next move should be diagnosis, not guesswork.

## Workflow

### Step 1

Establish the failure:

- expected behavior
- actual behavior
- reproduction steps
- frequency
- recent changes

### Step 2

Limit the search area. Read only the files, logs, or tests directly related to the failure.

### Step 3

Separate symptom from root cause.

State both:

- Symptom
- Root cause

### Step 4

Propose the smallest correct fix and explain why it addresses the root cause.

### Step 5

Define validation:

- direct repro check
- regression test
- nearby risk checks

## Rules

- Do not shotgun multiple fixes.
- If the first diagnosis fails, revisit the root cause.
- If repeated attempts have polluted the session, switch to `recover`.
