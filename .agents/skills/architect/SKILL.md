---
name: architect
description: Plan a feature or technical change before coding by aligning on terms, surfacing meaningful decisions, and producing an implementation plan that includes testing, security, accessibility, and documentation expectations.
---

Use this skill before substantial implementation.

## Read Order

Read only the context that matters:

- `AGENTS.md`
- `context.md`
- `architecture.md`
- `frontend-design-system.md` if the change affects UI system choices
- `backend-system-design.md` if the change depends on backend architecture decisions
- `glossary.md` if team terminology may confuse the discussion
- `coding-standards.md`
- `testing-strategy.md`
- `security-baseline.md` if the change touches auth, data, or trust boundaries
- `accessibility-baseline.md` if the change affects UI
- `api-guidelines.md` if the change affects contracts

## Workflow

### Step 1

Understand what already exists in code and docs before asking the developer questions.

### Step 2

Align on ambiguous terms. Focus on language that changes implementation choices.

### Step 3

Surface the decisions that matter most:

- boundaries and ownership
- data flow
- failure handling
- test strategy
- contract changes
- security impact
- accessibility impact
- documentation impact

Ask one meaningful question at a time. Offer a recommendation, not a blank prompt.

### Step 4

When the decisions are settled, say:

`Blueprint ready.`

Then produce:

## Implementation Plan - [Feature]

- What we are building
- Terms aligned
- Decisions made
- Assumptions
- Risks
- Test plan
- Security and accessibility checks
- Documentation updates
- Ordered implementation steps

Wait for confirmation before implementation begins.
