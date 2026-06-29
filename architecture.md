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
2. Ingestion reads approved source data.
3. Raw source records are stored with provenance metadata.
4. Normalization merges duplicate codes across sources by `netflixCode`, applies source-priority rules, and produces canonical category and curated recommendation records in MongoDB.
5. Public APIs expose curated search and recommendation results from canonical Mongo-backed collections.
6. Frontend records anonymous engagement events to analytics endpoints.

Current sources:

- A curated starter dataset remains a recommendation-only manual source and no longer feeds public catalog titles or descriptions.
- `Netflix-Codes` is the first live remote source and supplies the broader public category-code catalog.
- `Teen Vogue` is the second live remote source and expands catalog coverage through a JSON-LD article-body code list, while remaining lower priority than `Netflix-Codes` for conflicting labels.
- Canonical records keep aggregated provenance such as `sourceRecordIds`, `sourceLabels`, and `titleSourceLabel` so one public row can be traced back to multiple raw source records.
- Public catalog rows are now strict verified records: code, source-backed title, verification state, source labels, and region signals only. Invented public descriptions are out of contract.
- The catalog can be refreshed through the protected cron path or the local `npm run db:seed` workflow.

## Operational Rules

- No heavy scraping in live user request handlers.
- Public APIs expose curated data only.
- Public discovery endpoints fail explicitly when canonical data is unavailable.
- Admin-only refresh and override behavior must be protected.
- Prefer scheduled refresh plus manual review over aggressive automated ingestion.

## Deployment Notes

- Frontend and backend both deploy to Vercel as separate projects.
- Backend project root: `apps/api`
- Frontend project root: `apps/web`
- MongoDB Atlas is external and managed.
- Scheduler choice depends on free-plan limits and job duration.

## Current Gaps

- TODO: define exact collection indexes
- TODO: define admin access path for ingestion overrides
- TODO: define the third approved remote source after `Netflix-Codes` and `Teen Vogue`
