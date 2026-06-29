# API Guidelines

## Style

- Use JSON over HTTPS.
- Keep public endpoints explicit and cache-friendly.
- Prefer stable, descriptive resource names.

## Planned Public Areas

- search
- category detail
- recommendation feeds
- region-aware filters or signals
- analytics event intake
- optional auth endpoints later

## Response Rules

- Return curated, user-safe data only.
- Include clear error messages for invalid requests, empty results, and temporary failures.
- Avoid leaking raw ingestion internals through public contracts.
- Do not expose invented catalog descriptions as canonical truth. Public catalog rows should prefer source-backed title and safe provenance metadata.
- If a public field is editorial rather than source-backed, model it separately instead of mixing it into canonical catalog fields.

## Validation Rules

- Validate query params and request bodies.
- Normalize enums and known filter values centrally.
- Reject malformed analytics event payloads.

## Operational Rules

- Keep ingestion/admin endpoints separate from public endpoints.
- Version APIs only when contract change risk becomes real.
- Prefer additive changes for MVP evolution.

## Current Gaps

- TODO: define exact endpoint list and payload shapes during scaffolding
- TODO: define error envelope format
