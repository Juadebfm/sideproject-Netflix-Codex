---
name: imprint
description: Capture reusable UI patterns from recent work and store them in ui-registry.md so future components stay visually and behaviorally consistent.
---

Use this skill after building a UI component or when auditing an existing interface.

## Modes

- `imprint` - capture from recently changed UI files
- `imprint [filepath]` - capture from a specific file
- `imprint audit` - inspect the codebase for conflicting UI patterns

## Capture

Focus on reusable patterns:

- backgrounds
- borders
- radius
- text roles
- spacing
- interactive states
- shadows
- tokens and semantic color usage

Do not treat one-off layout dimensions as reusable patterns.

## Output

Update `ui-registry.md` with:

- component name
- file path
- key visual classes or tokens
- notes on allowed variation

If audit mode finds conflicts, call them out and recommend a baseline.
