# Vercel Deployment Guide

## Deployment Model

This repo deploys best as two Vercel projects:

- `netflix-codex-api`
  - Root directory: `apps/api`
  - Hosts the public API and cron job
- `netflix-codex-web`
  - Root directory: `apps/web`
  - Hosts the React frontend

`VITE_API_BASE_URL` is not required for a same-origin deploy, but it **is required** for this split-project setup and should point to the backend production URL.

## Required Environment Variables

### Backend project

- `NODE_ENV=production`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `CRON_SECRET`

### Frontend project

- `VITE_API_BASE_URL=https://<your-backend-project>.vercel.app`

## Backend First

Create and link the backend project:

```bash
npx vercel project add netflix-codex-api --cwd apps/api
npx vercel link --yes --project netflix-codex-api --cwd apps/api
```

Add backend env vars in Vercel:

```bash
npx vercel env add NODE_ENV production --cwd apps/api
npx vercel env add MONGODB_URI production --cwd apps/api
npx vercel env add MONGODB_DB_NAME production --cwd apps/api
npx vercel env add CRON_SECRET production --cwd apps/api
```

Deploy the backend:

```bash
npx vercel --prod --cwd apps/api
```

After the backend env is set and your local `.env` points at the same MongoDB cluster, seed the catalog:

```bash
npm run db:seed
```

## Frontend Second

Create and link the frontend project:

```bash
npx vercel project add netflix-codex-web --cwd apps/web
npx vercel link --yes --project netflix-codex-web --cwd apps/web
```

Add the backend URL to the frontend project:

```bash
npx vercel env add VITE_API_BASE_URL production --cwd apps/web
```

Deploy the frontend:

```bash
npx vercel --prod --cwd apps/web
```

## Recommended Post-Deploy Checks

### Backend

- `GET /api/health` returns `200`
- `GET /api/search` returns curated results
- `GET /api/recommendations` returns curated results with meta
- `GET /api/categories/:code` returns category data
- Cron configuration exists on the backend project

### Frontend

- Search loads real results
- Recommendation cards render
- Copy-code flow still works
- Open-in-Netflix links still open correctly
- Error states remain understandable when the backend is unavailable

## Rollback Notes

- Frontend rollback: redeploy the previous stable frontend build
- Backend rollback: redeploy the previous stable backend build
- Data rollback: reseed the previous approved catalog source if a bad ingest was written
