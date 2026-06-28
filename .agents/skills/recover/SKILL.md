---
name: recover
description: Decide whether a troubled build needs a targeted fix, a clean session reset, or a full rethink of the approach before more code is written.
---

Use this skill when work has stalled or repeated fixes are making things worse.

## Goal

Do not keep patching blindly.

First decide what kind of problem this is. Then choose the right response.

## Diagnose the Failure Mode

Choose one:

- `Targeted fix` - one issue, clear scope, early in debugging
- `Hard reset` - the session is polluted and patching is compounding errors
- `Rethink` - the implementation direction is fundamentally wrong

## Simple Decision Guide

Choose `Targeted fix` when:

- one feature or file is broken
- the problem is still easy to describe
- there have only been one or two failed attempts

Choose `Hard reset` when:

- each fix creates new problems
- the conversation or code is getting messy
- nobody is sure which parts are still trustworthy

Choose `Rethink` when:

- the code works but solves the wrong problem
- the design choice itself is wrong
- patching details will not fix the outcome

## Output

State:

- chosen failure mode
- why it fits
- what to preserve
- what to stop doing
- the next best action

Be honest and calm. The point is to save time, not assign blame.

## Hard Reset Note

If the correct answer is reset, write a concise note with:

- original goal
- what went wrong
- approaches to avoid
- clean starting point for the next session
