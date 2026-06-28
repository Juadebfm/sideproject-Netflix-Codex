---
name: kickoff
description: Start a brand-new project the right way by uncovering the user's real pain points, goals, users, scope, constraints, and delivery needs so the work begins with a strong SDLC foundation.
---

Use this skill at the very beginning of a new project, product idea, or major initiative.

This skill is for the stage before implementation planning. Its job is to help the developer understand what should be built, why it matters, and what must be true for the project to start well.

Use `architect` later, after the project direction is clear and the team is ready to plan implementation.

If a term feels unfamiliar, read `glossary.md`.

## Goal

Turn a vague idea into a clear project starting point.

The purpose is to uncover:

- the real problem
- who has the problem
- what outcome matters most
- what success looks like
- what constraints or risks could shape the project
- what a responsible SDLC should include from day one

## How To Work

This is a guided discovery conversation, not an interrogation.

- Ask one meaningful question at a time.
- Group questions by topic so the discussion stays easy to follow.
- Prefer practical language over product jargon.
- If the user gives a vague answer, help them sharpen it with examples.
- Do not jump into implementation too early.

## Discovery Order

### 1. Understand the pain point

Find out:

- what problem the user wants solved
- who experiences it
- how they solve it today
- why the current situation is painful

If the pain point is fuzzy, keep working here before moving on.

### 2. Understand the user and context

Find out:

- who the primary users are
- who the secondary users are
- what environment or workflow this fits into
- what assumptions the team may already be making

### 3. Understand the desired outcome

Find out:

- what success looks like
- what the first useful version must do
- what is out of scope for now
- what tradeoffs the user is willing or unwilling to make

### 4. Understand constraints and risks

Find out:

- timeline expectations
- technical constraints
- compliance or security constraints
- accessibility expectations
- data sensitivity
- major failure risks

### 5. Understand SDLC needs

Decide what good project discipline should look like from the start:

- architecture thinking needed early
- testing expectations
- documentation expectations
- release and rollback concerns
- observability or operational needs
- security and accessibility review points

## When You Have Enough

Stop asking questions when the project direction is clear enough to start responsibly.

Do not keep asking for the sake of sounding thorough.

## Output

When discovery is complete, produce:

## Project Kickoff - [Project Name]

### Problem Summary

- What problem is being solved
- Why it matters

### Users

- Primary users
- Secondary users
- Key context about how they work

### Desired Outcome

- What success looks like
- What the first version must do
- What is explicitly out of scope

### Constraints And Risks

- Time, technical, compliance, security, accessibility, or operational constraints
- Key project risks

### Recommended SDLC Foundation

- What should exist before implementation starts
- What standards or guardrails matter most
- What reviews should happen during development

### Suggested Next Steps

List the next best actions in order. These should usually include:

- `bootstrap` if project context files should be created
- `frontend-design-system` if the project has a meaningful user-facing interface
- `backend-system-design` if the project needs APIs, data, auth, integrations, or jobs
- `architect` once the direction is clear
- `verify`, `secure`, `access`, or `docsync` later when implementation begins

### Open Questions

- Anything still unclear that could meaningfully change the project

## Rules

- Do not invent business facts.
- Do not turn weak assumptions into project truth.
- Keep the conversation collaborative and calm.
- If the user is not technical, translate SDLC language into simple terms.
- If a major gap remains, say so clearly before recommending implementation.
