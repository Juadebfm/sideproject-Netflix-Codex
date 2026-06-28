---
name: audit
description: Review an entire repository like a new engineer joining the project by assessing architecture, code quality, testing, documentation, security, accessibility, developer experience, and onboarding risk across the whole codebase.
---

Use this skill when the goal is to understand and evaluate the whole project, not just one change.

This is the right skill for:

- onboarding into an unfamiliar codebase
- repo-wide engineering review
- technical due diligence
- identifying systemic risks and quality gaps
- understanding what future contributors will struggle with

If a term feels unfamiliar, read `glossary.md`.

## Goal

Review the repository the way a strong engineer would if they had just joined the team.

The purpose is to answer questions like:

- How is this project organized?
- What looks healthy?
- What looks risky?
- What would confuse or slow down a new contributor?
- Where are the biggest quality gaps across the codebase?

## Read Order

Start broad, then go deeper where the evidence points:

- `README.md`
- `AGENTS.md` if present
- `context.md`
- `architecture.md`
- `coding-standards.md`
- `testing-strategy.md`
- `security-baseline.md`
- `accessibility-baseline.md`
- `api-guidelines.md`
- `docs-plan.md`
- `release-checklist.md`
- top-level project structure
- representative code in major folders
- test layout
- docs and onboarding files

Do not try to read every file line by line. Sample intelligently and follow the most important signals.

## Audit Order

### 1. Orientation

Understand:

- what the product appears to do
- how the repository is organized
- which technologies are in use
- whether the main workflows are easy to locate

### 2. Architecture And Boundaries

Check:

- whether responsibilities are separated clearly
- whether major folders have obvious ownership
- whether boundaries are respected consistently
- whether shared patterns are stable or fragmented

### 3. Code Quality And Maintainability

Check:

- naming consistency
- repeated patterns or duplicated logic
- complexity hotspots
- stale code, dead branches, or unclear conventions
- how easy it would be for a new contributor to make a safe change

### 4. Testing And Reliability

Check:

- whether tests exist in the right places
- whether critical flows appear covered
- whether bug-prone areas lack verification
- whether the project looks easy or hard to validate locally

### 5. Documentation And Onboarding

Check:

- whether setup instructions are clear
- whether the project explains its architecture and workflows
- whether docs appear current or stale
- whether a new developer could get productive without tribal knowledge

### 6. Security, Accessibility, And Operational Risk

Check:

- obvious security gaps or trust-boundary confusion
- accessibility blind spots in user-facing code
- release or deployment fragility
- missing guardrails around sensitive areas

## Output

Produce a repo-wide report in this format:

## Repo Audit - [Project Name]

### Overall Assessment

- Short summary of the repo's health and maturity

### What Looks Strong

- Areas that appear well structured or well maintained

### Findings

List findings by severity. For each one include:

- severity
- area or files involved
- why it matters
- how it could affect future contributors or production quality

### Onboarding Risks

- Anything likely to confuse a new engineer
- Missing context, unclear setup, or hidden conventions

### Highest-Value Improvements

- The few changes that would most improve repo health

### Open Questions

- Unknowns that need confirmation from the team

## Rules

- Do not pretend to know more than the evidence supports.
- Be specific, but do not drown the report in trivia.
- Prefer systemic issues over one-off style complaints.
- If the repo is strong, say so clearly.
- If you only sampled part of the codebase, say where your confidence is highest and lowest.
