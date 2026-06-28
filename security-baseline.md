# Security Baseline

## Core Boundaries

- Public users can read curated discovery data and send allowed analytics events.
- Admin-only capabilities include ingestion refresh, source inspection, and manual override actions.
- Optional user auth must never become a blocker for anonymous browsing in MVP.

## Requirements

- Validate all requests and environment variables.
- Rate-limit public analytics and query endpoints.
- Protect admin routes and secrets from public access.
- Keep raw ingestion data isolated from curated public responses.
- Do not store unnecessary personal data in analytics.

## Ingestion Safety

- Use only approved public sources.
- Record provenance for all ingested records.
- Treat external content as untrusted until normalized.
- Avoid aggressive scheduling or behavior that creates avoidable operational or policy risk.

## Release Expectations

- Review trust boundaries whenever new admin actions, auth flows, or external integrations are added.
- Document any new secrets or third-party dependencies outside the repo.

## Current Gaps

- TODO: define exact admin authentication method
- TODO: define rate-limit policy
- TODO: define approved source review checklist
