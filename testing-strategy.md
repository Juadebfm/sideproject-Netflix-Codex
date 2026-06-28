# Testing Strategy

## Philosophy

- Test the highest-risk behavior first: ingestion, normalization, recommendations, search/filter behavior, analytics events, and deep-link/copy flows.

## Test Layers

- Unit tests:
  - normalization rules
  - recommendation scoring logic
  - search/filter utilities
  - deep-link helpers
  - analytics payload validation
- Integration tests:
  - API endpoints
  - MongoDB persistence
  - ingestion pipeline steps
  - admin-only refresh and override paths
- UI tests:
  - search and discovery flow
  - filter chips
  - recommendation cards
  - copy-code feedback
  - open-in-Netflix behavior
  - empty and error states
- Smoke tests:
  - deployment health
  - scheduled ingestion execution
  - fallback behavior when a source fails

## MVP Priorities

- Start with unit and integration coverage for backend logic.
- Add UI coverage for the critical discovery and copy/open flows.
- Do not delay shipping for full end-to-end coverage everywhere.

## Current Gaps

- TODO: choose exact test runner and UI test tooling once scaffolding exists
- TODO: define local seed strategy for catalog and taxonomy fixtures
