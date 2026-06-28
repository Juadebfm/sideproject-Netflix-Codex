# Architecture

## System Shape

- Monorepo
- React frontend
- Vercel Functions backend
- MongoDB Atlas primary data store
- Scheduled ingestion via Vercel Cron when sufficient, otherwise a free external scheduler such as `cron-job.org`

## Main Modules

- `catalog`: canonical Netflix category code records and category details
- `taxonomy`: moods, genres, group tags, region labels, and editorial organization
- `recommendations`: editorial collections and rule-based ranking
- `analytics`: visits, searches, copy actions, open actions, and engagement events
- `auth`: optional user accounts and saved preferences later
- `ingestion`: source adapters, normalization, provenance, stale checks, and refresh orchestration

## Data Flow

1. Scheduler triggers ingestion job.
2. Ingestion fetches approved source data.
3. Raw source records are stored with provenance metadata.
4. Normalization produces canonical category and taxonomy records.
5. Public APIs expose curated search and recommendation results.
6. Frontend records anonymous engagement events to analytics endpoints.

## Operational Rules

- No heavy scraping in live user request handlers.
- Public APIs expose curated data only.
- Admin-only refresh and override behavior must be protected.
- Prefer scheduled refresh plus manual review over aggressive automated ingestion.

## Deployment Notes

- Frontend and backend both deploy to Vercel.
- MongoDB Atlas is external and managed.
- Scheduler choice depends on free-plan limits and job duration.

## Current Gaps

- TODO: define repo folder structure once scaffolding exists
- TODO: define exact collection names and indexes
- TODO: define admin access path for ingestion overrides
