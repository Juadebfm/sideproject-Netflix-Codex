---
name: secure
description: Review a change for security posture by checking trust boundaries, input validation, authz/authn, secret handling, dependency risk, logging safety, and abuse scenarios before release.
---

Use this skill when a change touches logins, payments, uploads, admin features, third-party integrations, public APIs, or any data a user should not be able to misuse.

If a term feels too technical, read `glossary.md` first.

## Goal

Look for the ways a real attacker, careless user, or buggy integration could cause harm.

This is not about fear. It is about asking simple questions early:

- Can the wrong person access this?
- Can bad input break this?
- Could sensitive data leak here?
- If this is abused, what happens?

## Read Order

- task or change description
- `security-baseline.md`
- `architecture.md`
- relevant API or schema files
- changed code

## Check In This Order

### 1. Who is allowed to do this?

Check:

- authentication
- authorization
- admin-only or owner-only actions

### 2. What input can reach the system?

Check:

- input validation
- file uploads
- URLs, headers, query params, and request bodies
- output encoding where data is rendered or returned

### 3. What sensitive data is involved?

Check:

- secret handling
- tokens and credentials
- personal or financial data
- logs and telemetry that may expose sensitive values

### 4. How could this be abused?

Check:

- repeated requests or brute force behavior
- missing rate limits
- unsafe defaults
- risky third-party dependencies or packages

## Output

Produce a findings-first report:

- critical issues
- important issues
- minor issues
- unknowns that need verification

For each issue, explain in plain language:

- what could go wrong
- how it could happen
- who or what could be affected

Do not downplay uncertain security concerns. Label them as unverified if evidence is incomplete.
