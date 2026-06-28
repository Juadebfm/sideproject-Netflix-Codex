---
name: verify
description: Design or evaluate the verification strategy for a change by checking expected behavior, test coverage, edge cases, and production-facing confidence before the work is considered done.
---

Use this skill before implementation to plan testing or after implementation to evaluate coverage.

## Read Order

- task or feature description
- implementation plan if available
- `testing-strategy.md`
- changed files and relevant tests
- `api-guidelines.md` for contract changes
- `security-baseline.md` or `accessibility-baseline.md` if relevant

## Workflow

### Step 1

State the behaviors that must be true for the change to be considered correct.

### Step 2

Map those behaviors to test layers:

- unit
- integration
- end-to-end
- contract
- accessibility
- manual verification

### Step 3

Identify gaps:

- missing assertions
- missing edge cases
- flaky or non-deterministic coverage
- behavior that is only manually checked

### Step 4

Produce:

## Verification Plan - [Change]

- Required behaviors
- Test matrix
- Edge cases
- Tooling or fixture needs
- Gaps found
- Recommended next checks

If reviewing completed work, be direct about what is still unverified.
