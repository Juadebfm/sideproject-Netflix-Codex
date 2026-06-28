---
name: backend-system-design
description: Design the backend system for a new project by using kickoff context to recommend the right architecture, stack, data flow, and operational approach based on budget, complexity, scale, and engineering standards.
---

Use this skill after `kickoff` when a project needs APIs, data storage, auth, background jobs, integrations, or other backend responsibilities.

This skill is for deciding what kind of backend should exist and how complex it really needs to be.

Use `architect` later for feature-level implementation planning inside that backend direction.

## Goal

Choose the simplest backend architecture that responsibly fits the project.

The purpose is to define:

- what backend capabilities the project truly needs
- what complexity tier the project belongs to
- what budget tier the team is operating within
- what stack and architecture make sense now
- what can wait until later

## Read Order

Start with the project context:

- output from `kickoff` if available
- `context.md`
- `architecture.md` if any technical foundation already exists
- `security-baseline.md`
- `api-guidelines.md`
- any constraints around budget, scale, compliance, or integrations

## How To Work

- Start from the product and constraints, not from favorite technologies.
- Prefer the simplest architecture that meets real needs.
- Ask follow-up questions only where the answer changes the backend shape.
- Call out overengineering risk when it appears.

## Decision Order

### 1. Understand the backend job

Clarify:

- what data the system must store
- what users or systems will interact with it
- whether the project needs auth, roles, files, jobs, notifications, payments, or real-time features
- whether there are external integrations

### 2. Determine complexity tier

Place the project in a practical tier:

- simple
- moderate
- growth-stage
- high-complexity

Base this on:

- feature count
- data relationships
- integration count
- scale expectations
- compliance needs
- team size and experience

### 3. Determine budget tier

Estimate whether the project should optimize for:

- lowest build cost
- balanced build and run cost
- long-term scalability and operational resilience

Budget affects the architecture choice. Do not recommend a heavy platform when a lean one would do.

### 4. Recommend the architecture

Define:

- monolith versus modular monolith versus service split
- API style
- auth approach
- data store choice
- caching or queue needs
- background job needs
- deployment shape

### 5. Define backend quality rules

Set standards for:

- security boundaries
- validation
- observability
- testing layers
- release safety
- scaling triggers for future change

## Output

Create or update `backend-system-design.md`.

Use this format:

## Backend System Design - [Project Name]

### Backend Responsibilities

- What the backend must do

### Complexity And Budget Tier

- Chosen complexity tier
- Chosen budget posture
- Why these fit the project

### Recommended Architecture

- Architecture style
- API style
- Auth and authorization direction
- Data storage direction
- Async or background processing needs
- Deployment direction

### Recommended Stack

- Backend runtime/framework
- Database
- Queue or cache if needed
- Hosting or deployment style

### Security And Reliability Rules

- Validation expectations
- Access control expectations
- Logging and observability expectations
- Backup, rollback, and release expectations

### Scaling Plan

- What to build now
- What to postpone
- What future signals would justify more complexity

### Open Questions

- Unknowns that still affect the backend design

### Suggested Next Steps

- Usually `bootstrap` if project files need to be refreshed
- `frontend-design-system` if the project has a meaningful UI
- `architect` once the system direction is clear enough for implementation planning

## Rules

- Simplicity wins unless the product truly needs more.
- Prefer modular clarity over early microservices.
- Tie technical choices to user needs, budget, and risk.
- Make security and operability part of the initial recommendation.
