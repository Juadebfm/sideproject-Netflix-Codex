---
name: access
description: Review a UI change for accessibility by checking semantics, keyboard flow, focus management, naming, status messaging, contrast, and motion so the experience works for more users.
---

Use this skill for UI, forms, navigation, modals, tables, charts, and any user-facing interactive flow.

If a term feels unfamiliar, read `glossary.md`.

## Goal

Make sure the feature works for more people, not just for mouse users with perfect vision.

Ask simple questions:

- Can someone use this with a keyboard?
- Can someone understand this with a screen reader?
- Can someone still use it if color or motion is hard for them?

## Read Order

- task or feature description
- `accessibility-baseline.md`
- `ui-registry.md` if present
- changed UI files

## Check In This Order

### 1. Structure and meaning

Check:

- semantic structure
- headings
- landmarks
- button versus link usage

### 2. Names and instructions

Check:

- labels
- accessible names
- helper text
- clear error messaging

### 3. Keyboard and focus

Check:

- keyboard reachability
- focus order
- focus visibility
- modal or menu focus handling

### 4. Feedback and perception

Check:

- status feedback where needed
- contrast
- non-color cues
- reduced-motion impact

## Output

Produce:

## Accessibility Review - [Change]

- Blocking issues
- Important issues
- Minor issues
- Manual assistive-tech checks still needed

If the change appears compliant but has not been tested with real assistive technology, say so.
