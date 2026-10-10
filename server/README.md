# Server — Viralippurath Family Web App v1 (Archived)

> ⚠️ **Deprecated.** Do not deploy. Successor: .NET Core API at <https://api.viralippurath.com> (site: <https://viralippurath.com>, repo: <https://github.com/AdnanABF/Viralippurath-Web>).

NestJS 11 + Mongoose API backing the React client: JWT auth over HttpOnly cookies, content modules (events, gallery, magazine, notifications), contact form via Resend, Cloudinary signed uploads, admin/activity/system-log and dashboard modules.

## Stack

NestJS 11, `@nestjs/mongoose` + Mongoose 9, `@nestjs/jwt` + Passport JWT, `@nestjs/throttler` (100 req/min), `class-validator`, `cookie-parser`, Cloudinary, Resend. Vercel serverless entry (`src/main.ts`: `bootstrapVercel`, `trust proxy`, CORS with `credentials: true`).

## Modules (`src/`)

`auth`, `admin`, `events`, `gallery`, `magazine`, `notifications`, `contact`, `cloudinary`, `activity-log`, `dashboard`, `system-log`, `common/` (global exception filter, transform interceptor/envelope, correlation-ID middleware).

## Endpoints (summary)

| Module | Endpoints |
|--------|-----------|
| Root | `GET /` |
| Auth | `GET auth/me`, `POST auth/login`, `POST auth/refresh {userUuid}`, `POST auth/logout` |
| Events / Gallery / Magazine / Notifications | `GET */published`, `GET */admin`, `POST /`, `PATCH /:uuid`, `DELETE /:uuid` (+ `GET notifications/latest`) |
| Contact | `POST /contact` |
| Cloudinary | `GET /cloudinary/sign` |
| Admin | `GET /admin`, `POST /admin`, `PATCH /admin/:uuid`, `DELETE /admin/:uuid` |
| Dashboard | `GET /dashboard/stats` |
| Activity log | `GET /activity-log`, `GET /activity-log/recent` |
| System log | `GET /system-log`, `GET /system-log/cleanup-status`, `DELETE /system-log/cleanup` |

Roles: `ADMIN`, `SUPER_ADMIN` (admin management restricted). Validation pipe is global (`whitelist`, `forbidNonWhitelisted`, `transform`).

## Scripts

```bash
npm install
npm run start:dev   # watch mode
npm run start       # dev run
npm run build && npm run start:prod  # production (node dist/main)
npm run test | npm run test:e2e | npm run test:cov
npm run lint
```

## Env

Copy `.env.example` to `.env`. Names only — never commit values:

| Var | Purpose |
|-----|---------|
| `NODE_ENV`, `PORT` | Runtime |
| `MONGODB_URI` | MongoDB connection |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` | Auth |
| `RESEND_API_KEY`, `CONTACT_RECEIVER_EMAIL` | Contact mail |
| `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER_PREFIX` | Media |
| `SYSTEM_CREATOR_UUID` | System actor ID |

## Deploy (historical)

Vercel Node (`vercel.json`: `src/main.ts` → `@vercel/node`). No longer deployed from this code.
