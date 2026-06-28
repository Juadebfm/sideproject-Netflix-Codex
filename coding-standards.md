# Coding Standards

## General

- Use TypeScript across frontend and backend.
- Favor readable, explicit code over clever abstractions.
- Keep modules small and named by business responsibility.
- Use ASCII by default unless a file already justifies Unicode.

## Frontend

- Build with React and reusable component primitives.
- Use shared design tokens for color, spacing, radius, border, motion, and focus treatment.
- Prefer semantic HTML first, styling second.
- Do not hardcode values that belong in the design system.
- Encapsulate copy-code and direct-open Netflix behavior in reusable helpers/components.

## Backend

- Keep route handlers thin.
- Put validation, business logic, and persistence in separate modules.
- Validate request payloads, query params, and env vars with schemas.
- Separate raw ingestion models from canonical user-facing records.

## Data And Naming

- Prefer descriptive names over abbreviations.
- Tag ingested records with source URL, fetch time, and normalization status.
- Keep document shapes versionable and intentionally evolved.

## Documentation

- Update context docs when architecture or product behavior changes.
- Add `TODO` markers for real unknowns rather than filling gaps with assumptions.
