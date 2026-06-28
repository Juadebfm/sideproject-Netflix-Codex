---
name: frontend-design-system
description: Design the frontend system for a new product by turning kickoff insights into a practical UI foundation with design tokens, component patterns, responsive behavior, accessibility rules, and modern app-grade frontend standards.
---

Use this skill after `kickoff` when a project needs a frontend or user-facing product experience.

This skill is not just for picking colors. Its job is to define the UI system that engineers and designers can build against consistently.

Use `architect` later for feature-level implementation planning.

## Goal

Turn product discovery into a usable frontend design system direction.

The purpose is to define:

- the UI style direction that fits the product and users
- the foundations the interface should use consistently
- the core components and states the project will need
- the accessibility and responsive rules that should shape the frontend from the start

## Read Order

Start with the project context:

- output from `kickoff` if available
- `context.md`
- `architecture.md` if frontend boundaries already exist
- `accessibility-baseline.md`
- `ui-registry.md` if the project already has UI work
- any product notes, brand guidance, or competitor references

## How To Work

- Ask only the design questions that materially change the UI system.
- If the user has no strong visual direction, offer 2-3 clear directions and recommend one.
- Do not over-design. Choose a system the team can actually maintain.
- Prefer semantic tokens, reusable components, and accessible defaults.

## Design Order

### 1. Understand the product surface

Clarify:

- what kind of product this is
- who will use it
- whether it is dashboard-heavy, content-heavy, workflow-heavy, or marketing-heavy
- whether mobile, desktop, or both matter most

### 2. Choose the visual direction

Define:

- the overall UI character
- the visual tone that fits the product and audience
- whether the design should feel calm, dense, playful, premium, utilitarian, or operational

If the user has no branding yet, choose a practical direction instead of waiting for perfect brand input.

### 3. Define the foundations

Set the shared rules for:

- color tokens
- typography roles
- spacing scale
- radius scale
- elevation or shadow usage
- border treatments
- icon and illustration style
- motion principles

### 4. Define component expectations

Identify the first important component groups:

- buttons
- inputs
- forms
- cards or panels
- navigation
- tables or lists
- dialogs or drawers
- status indicators
- empty, loading, and error states

### 5. Define frontend quality rules

Set standards for:

- responsiveness
- accessibility
- semantic HTML
- state clarity
- consistency of tokens and component variants
- content readability and interaction feedback

## Output

Create or update `frontend-design-system.md`.

Use this format:

## Frontend Design System - [Project Name]

### Product Surface

- What kind of interface this is
- Who it serves
- Which device contexts matter most

### Recommended UI Direction

- Chosen visual direction
- Why it fits the product and users

### Foundations

- Color tokens
- Typography roles
- Spacing scale
- Radius scale
- Elevation and border rules
- Motion and icon guidance

### Core Components

- First-priority components
- Required variants or states

### Responsive And Accessibility Standards

- Breakpoint thinking
- Keyboard and focus expectations
- Contrast and status feedback expectations
- Reduced-motion and semantic requirements

### Engineering Rules

- How frontend code should apply the design system
- What must be tokenized
- What should never be hardcoded

### Open Questions

- Missing brand, UX, or product inputs that still matter

### Suggested Next Steps

- Usually `bootstrap` if files need to be created or refreshed
- `backend-system-design` if the product also needs service planning
- `architect` once the system direction is clear enough for implementation planning

## Rules

- Prefer a maintainable system over a flashy one.
- Avoid copying a big vendor design language blindly.
- Make accessibility and responsiveness part of the system, not a late add-on.
- If the project is simple, keep the component system simple too.
