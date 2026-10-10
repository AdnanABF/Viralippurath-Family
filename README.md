# Viralippurath Family Web App (v1 — Archived / Deprecated)

> ⚠️ **Archived. Do not run or deploy.** This is the initial, now-discontinued version of the Viralippurath Family web app. It is kept for reference only before this repository is archived.

> ⚠️ **Note on branches:** `master` holds the last stable code. `develop` and feature branches may contain unfinished, unstable, or non-running code — they are preserved as-is for history. Do not merge them into `master`.

## Successor

Active development moved to a new **.NET Core Web API** app:

- Live site: <https://viralippurath.com>
- Live API: <https://api.viralippurath.com>
- Successor repo: <https://github.com/AdnanABF/Viralippurath-Web>

## What this repo was

Digital home of the Viralippurath Family (Kudumbasamithi): public site for history, events, gallery, magazines, notifications, contact — plus an admin panel for content management.

| Part | Stack | Details |
|------|-------|---------|
| `client/` | React 19, Vite 7, TypeScript, Tailwind CSS 4, React Router 7, TanStack Query 5, i18next (en/ml) | See [`client/README.md`](client/README.md) |
| `server/` | NestJS 11, Mongoose/MongoDB, JWT + Passport (HttpOnly cookies), Throttler, Cloudinary, Resend | See [`server/README.md`](server/README.md) |

Both apps were deployed on Vercel (SPA rewrite for client, serverless Express adapter for server).

## Repo layout

```
.
├── client/   # React SPA (public site + admin UI)
├── server/   # NestJS API
└── .github/  # PR template
```

No root package.json — `client/` and `server/` are independent Node projects.

## Browsing this archive

No setup needed. Start with `client/README.md` and `server/README.md`. Copy `.env.example` to `.env` only if you must inspect code locally; nothing here should be deployed.

## History

See `git log` (`master`, `develop`, feature branches e.g. `75-major-enhancements`, `65-implement-multiple-languages`, `48-implement-admin-dashboard`). Author: Adnan Bin Farook.
