# Context

## Product Summary

- `Netflix Codex` is a discovery layer for Netflix users.
- It helps people overcome choice fatigue by surfacing better recommendations and better-organized Netflix category codes.
- Users should be able to quickly copy a code or open the relevant Netflix destination directly where supported.

## Primary Users

- Casual Netflix viewers
- Film lovers
- Couples or groups trying to decide together

## Core MVP Outcomes

- Find a strong recommendation quickly
- Discover useful Netflix category codes without endless scrolling
- Copy a code easily or open Netflix directly
- See best-effort region-aware or availability-related signals where possible

## Constraints

- React frontend
- Vercel for frontend and backend deployment
- MongoDB Atlas for storage
- No paid APIs in MVP
- Optional login only
- Anonymous-first analytics
- Mobile-first UX with desktop support

## Product Boundaries

- MVP recommendations are editorial + rule-based, not true personalized ML recommendations.
- Region awareness is best-effort, not guaranteed entitlement truth.
- Ingestion depends on approved public sources and may require manual review or override.

## Important Unknowns

- TODO: define exact approved ingestion sources
- TODO: define completeness target for Netflix code coverage
- TODO: define initial launch regions
- TODO: define how recommendation quality is measured after launch
