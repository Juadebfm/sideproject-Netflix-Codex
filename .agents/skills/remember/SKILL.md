---
name: remember
description: Save the project state at the end of a session or restore it at the start of a new one without persisting secrets, so work can continue cleanly across sessions.
---

Use `remember save` at the end of a session and `remember restore` at the start of a new one.

## Rules

- Never persist secrets, tokens, passwords, cookies, private keys, or connection strings.
- Redact anything sensitive if it must be referenced.
- Save only what the next session truly needs.

## Save

When saving:

- read the current conversation and relevant context files
- update `memory.md`
- capture what was built, decisions made, problems solved, current state, next action, and open questions

If `memory.md` already exists, summarize its current focus before overwriting.

## Restore

When restoring:

- read `memory.md` first
- then read only standard context files if present
- summarize the restored state
- wait for confirmation before continuing implementation
