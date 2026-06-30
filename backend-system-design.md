## Backend System Design - Netflix Codex

### Backend Responsibilities

- Ingest Netflix category-code data from approved public sources, preserve source provenance, and normalize duplicates, aliases, and stale entries.
- Store curated category metadata, recommendation traits, region signals, and editorial collections for fast retrieval by the app.
- Serve public APIs for search, filters, recommendations, code lookup, deep-link generation, and lightweight region-aware discovery.
- Track anonymous visits and key events such as searches, copy actions, open-in-Netflix actions, and recommendation engagement.
- Support optional user accounts later for saved items, preferences, and simple feedback without making auth a dependency for the MVP.
- Run scheduled refresh and validation jobs so external code/catalog data stays current without slowing user-facing requests.

### Complexity And Budget Tier

- Chosen complexity tier: `moderate`.
- Chosen budget posture: `balanced build and run cost`, with a strong lean bias.
- Why this fits:
  - The product is not just a content site; it needs ingestion, normalization, analytics, optional auth, and scheduled refreshes.
  - It still does not justify microservices, event-heavy infrastructure, or a large ops footprint.
  - No paid APIs and an MVP mindset both point toward a single deployable backend with a small number of managed services.

### Recommended Architecture

- Architecture style:
  - Modular monolith.
  - Keep frontend and backend in one monorepo, with clear modules for `catalog`, `taxonomy`, `recommendations`, `analytics`, `auth`, and `ingestion`.
  - Do not split into separate services until ingest volume, team size, or reliability needs clearly demand it.
- API style:
  - REST-style JSON APIs for public app traffic.
  - Keep endpoints explicit and cache-friendly: search, category detail, recommendation feed, region filters, analytics events, and auth endpoints.
  - Reserve internal-only endpoints for admin refreshes and ingestion diagnostics.
- Auth and authorization direction:
  - Anonymous-first product usage.
  - Optional login only for saved preferences, feedback, or later personalization.
  - Role model for MVP: `public` and `admin` only. Avoid complex role systems early.
- Data storage direction:
  - Primary MongoDB Atlas database for categories, code aliases, sources, region mappings, curated collections, users, saved items, and event aggregates.
  - Store raw ingested source records separately from normalized canonical records so cleanup is auditable.
  - Keep a small object-free footprint at first; no file storage is required unless poster/media caching is added later.
- Async or background processing needs:
  - Scheduled ingestion and revalidation jobs are required.
  - Use background tasks for source imports, normalization, stale-code checks, and daily analytics aggregation.
  - Do not put scraping or heavy normalization on live user requests.
- Deployment direction:
  - One frontend deployment and one backend deployment, both on Vercel.
  - Frontend should be a React app deployed as a Vercel web project.
  - Backend should be deployed as Vercel Functions behind API routes, with scheduled ingestion triggered by Vercel Cron or GitHub Actions.
  - Separate admin secrets and ingestion controls from public runtime configuration.
  - Do not rely on live request handlers for long-running scraping or normalization work.

### Recommended Stack

- Backend runtime/framework:
  - TypeScript with a lightweight Node API layer running as Vercel Functions.
  - Use `zod` for request and environment validation.
  - Use a service-layer structure so business logic is not buried inside route handlers.
- Database:
  - MongoDB Atlas.
  - Model the data around canonical category documents, source-ingest records, region signals, editorial collections, and event summaries.
  - Keep raw ingested source records separate from user-facing curated records even in MongoDB.
- Queue or cache if needed:
  - No dedicated queue for day one.
  - Start with cron-triggered jobs and database-backed job tracking.
  - Add Redis later only if search/result caching or job coordination becomes necessary.
- Hosting or deployment style:
  - Vercel for both frontend and backend deployments.
  - MongoDB Atlas as the managed database.
  - Use Vercel Cron or GitHub Actions on a schedule for low-frequency ingestion jobs.
  - Keep the first deployment cheap, observable, and easy to replace.

### Security And Reliability Rules

- Validation expectations:
  - Validate all inbound requests, query params, event payloads, and env vars.
  - Sanitize and normalize all ingested external data before it reaches canonical tables.
  - Tag every ingested record with provenance metadata such as source id, source version, fetch time, normalization status, and confidence notes.
  - Merge duplicate category codes across sources before publishing canonical rows, with explicit source-priority rules when fields conflict.
- Access control expectations:
  - Public read APIs should expose only curated data needed by clients.
  - Admin refresh tools, source inspection, and manual overrides must require admin auth and never be public.
  - Rate-limit analytics and public query endpoints to reduce abuse and bot noise.
- Logging and observability expectations:
  - Structured logs with request IDs and module names.
  - Track API latency, ingestion job success/failure, source freshness, normalization error counts, and event throughput.
  - Keep analytics privacy-conscious by default: anonymous session identifiers first, no unnecessary personal data.
- Backup, rollback, and release expectations:
  - Daily database backups and tested restore instructions.
  - Schema evolution discipline from day one with versioned document-shape changes and rollout notes for risky data migrations.
  - Feature-flag or soft-launch ingestion-dependent features if source quality is uncertain.

### Scaling Plan

- What to build now:
  - Public search and recommendation APIs.
  - Canonical category/code schema with source provenance.
  - Scheduled ingestion and normalization jobs, starting with a curated starter dataset import and a small set of approved remote public-source adapters with explicit source-priority ordering.
  - Anonymous analytics pipeline and optional auth scaffolding.
  - Simple admin-safe manual override path for bad or stale code entries.
- What to postpone:
  - Real-time collaboration or multi-user group sessions.
  - Advanced personalization models.
  - Dedicated search engine, queue system, or microservice split.
  - Large-scale regional availability verification unless the data proves reliable enough.
- What future signals would justify more complexity:
  - Ingestion jobs timing out or overlapping regularly.
  - Search latency staying high after normal query tuning.
  - Event volume making direct database writes too costly.
  - Multiple maintainers needing stricter service boundaries.
  - Region-availability data becoming rich enough to justify its own sync pipeline.
  - Vercel function limits interfering with refresh, normalization, or analytics aggregation jobs.

### Open Questions

- What level of completeness is expected for code coverage: curated best-effort, source-vetted completeness, or near-exhaustive catalog capture?
- Which public sources are acceptable for ingestion under the project's legal and operational standards after the current `Netflix-Codes`, `Teen Vogue`, and `GitHub Netflix-Codes README` integrations?
- How much user-specific persistence is needed in the MVP beyond anonymous analytics?
- Whether recommendation quality will begin as editorial curation, rule-based scoring, or a hybrid approach.
- How reliable region-availability data can be without a paid provider.
- Whether scheduled ingestion should run on Vercel Cron only or shift early to GitHub Actions for longer-running jobs.

### Suggested Next Steps

- Use `bootstrap` to create shared project context files such as `context.md`, `architecture.md`, `security-baseline.md`, and `api-guidelines.md`.
- Use `verify` and `review` around the multi-source Mongo-backed ingestion slice to keep dedupe, source-priority, catalog availability, and cron behavior honest as more remote sources are added.
- Keep `frontend-design-system.md` aligned with the API shape so search, filters, copy feedback, and deep-link states map cleanly onto backend responses.
