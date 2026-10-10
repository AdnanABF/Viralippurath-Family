# Client — Viralippurath Family Web App v1 (Archived)

> ⚠️ **Deprecated.** Do not deploy. Successor: <https://viralippurath.com> (API: <https://api.viralippurath.com>, repo: <https://github.com/AdnanABF/Viralippurath-Web>).

React 19 + Vite 7 + TypeScript SPA: public family site plus admin panel. Talks to the NestJS API in `../server` via axios (`withCredentials`, HttpOnly-cookie auth, auto refresh, toast + correlation-ID error handling).

## Stack

React 19, React Router 7, TanStack Query 5, Tailwind CSS 4, axios, i18next (English/Malayalam, `./public/locales`), Framer Motion, Embla Carousel, react-pdf, react-hot-toast, lucide-react.

## Routes

Public (`PublicLayout`, `src/app/router.tsx`): `/`, `/vision`, `/gallery`, `/events`, `/magazine`, `/notifications`, `/about`, `/login` (guest-only), `/unauthorized`.

Admin (`/admin/*`, `AdminGuard`; `manage-admins` requires `SUPER_ADMIN`): `dashboard`, `events`, `gallery`, `magazine`, `notifications`, `activity-log`, `system-log`, `manage-admins`.

## Structure

```
src/
├── app/        # router.tsx, admin-router.tsx
├── pages/      # public/, admin/, common/ (NotFound, Unauthorized)
├── components/ # layout/, admin/ (guards, layout), ui/
├── services/   # api.ts + auth, public, dashboard, events/gallery/magazine/
│               #   notifications/admin, activity-log, system-log, cloudinary
├── context/    # AuthContext.tsx
├── hooks/ types/ utils/  # auth helpers, logout, etc.
├── i18n.ts main.tsx App.tsx index.css
```

## Scripts

```bash
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run preview  # preview production build
npm run lint     # eslint .
```

## Env

Copy `.env.example` to `.env`:

| Var | Purpose |
|-----|---------|
| `VITE_API_URL` | API base URL (dev: `http://localhost:3000`) |
| `VITE_ENV` | `development` / `production` |
| `VITE_PORTFOLIO_URL` | Author portfolio link |
| `VITE_DIRECTORY_URL` | Family directory link |

## Deploy (historical)

Vercel static site with SPA fallback (`vercel.json` rewrites `/(.*)` → `/index.html`). No longer deployed from this code.
