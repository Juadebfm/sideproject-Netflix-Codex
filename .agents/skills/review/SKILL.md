---
name: review
description: Review a completed change with a findings-first mindset by checking correctness, plan alignment, architecture, testing, security, accessibility, documentation, and release risk.
---

Use this skill after a meaningful change.

## Review Order

### Layer 1 - Correctness

Check whether the code does what the task and plan required.

### Layer 2 - System Integrity

Check:

- architecture boundaries
- coding standards
- existing patterns
- API or schema consistency
- state management discipline

### Layer 3 - Quality Gates

Check:

- tests
- error handling
- security implications
- accessibility impact
- documentation drift
- release risk

## Output

Report findings first, ordered by severity.

For each finding include:

- severity
- file and line reference when possible
- why it matters
- what could break

After findings, include:

- open questions
- assumptions
- short change summary

If there are no findings, say that explicitly and mention any residual testing gaps.
