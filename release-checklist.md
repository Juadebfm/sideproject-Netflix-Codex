# Release Checklist

## Before Deploy

- Confirm frontend and backend builds pass.
- Confirm required environment variables are set.
- Confirm MongoDB connection works in target environment.
- Confirm analytics endpoints accept expected payloads only.
- Confirm admin-only endpoints are not public.

## Product Checks

- Search returns curated results.
- Recommendation cards render correctly on mobile.
- Copy-code action works and shows feedback.
- Open-in-Netflix links behave as expected or fail gracefully.
- Empty and error states are understandable.

## Operational Checks

- Scheduler is configured and documented.
- Ingestion job can run successfully with current source set.
- Logs and basic monitoring are available.
- Rollback path is understood for schema or ingestion changes.

## Current Deployment Shape

- Deploy backend from `apps/api`
- Deploy frontend from `apps/web`
- Configure cron on the backend project only
- Set `VITE_API_BASE_URL` in the frontend project to the backend production URL

## Current Gaps

- TODO: define exact build/test commands after scaffolding
- TODO: define deployment smoke test script
