# YatraLink — Vercel + Supabase edition

This package is a Vercel-ready migration of the YatraLink showcase prototype. The frontend keeps the mobile traveler experience, role-aware onboarding, Destination Manager, Local Operator Studio, Route Mapping Engineer, crowd-aware discovery, booking flow, AI itinerary planner, Settings, and the 371-screen product registry. The platform-specific layer has been replaced with standard web infrastructure:

- **Vercel** — Vite frontend + `/api/*` serverless function
- **Supabase Postgres** — application state and transactional booking logic
- **Supabase Realtime** — cross-role crowd/inventory/booking refresh events
- **OpenAI Responses API** — optional grounded AI trip planner
- **Leaflet + OpenStreetMap** — maps

## 1. Create a Supabase project

In Supabase → **SQL Editor**, run these files in order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

The schema keeps business records server-only with RLS enabled. The browser anon key can only read the small `realtime_events` feed used to trigger refreshes. Serverless APIs use the Supabase service-role key.

## 2. Environment variables

Copy `.env.example` to `.env.local` for local development. In Vercel → Project → Settings → Environment Variables, add:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
OPENAI_MODEL
```

`OPENAI_API_KEY` is optional if you want to demo the app without AI generation; the planner will show a clear configuration error. `OPENAI_MODEL` defaults to `gpt-5.6-luna` in the serverless function and can be changed without modifying code.

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` as a `VITE_` variable.

## 3. Install and run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## 4. Deploy to Vercel

### GitHub method

1. Create a new GitHub repository.
2. Push this folder to the repository.
3. Open Vercel → **Add New → Project**.
4. Import the repository.
5. Vercel should detect **Vite** automatically.
6. Add the environment variables above.
7. Deploy.

### Vercel CLI method

```bash
npm i -g vercel
vercel
vercel --prod
```

Add your secrets in the Vercel dashboard before the production deployment.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Traveler | `hary123@gmail.com` | `123456` |
| Traveler | `pratima@gmail.com` | `123456` |
| Local Operator | `asim@operator.com` | `123456` |
| Superadmin | `sushil@admin.com` | `sushil@123456` |
| Route Mapping Engineer | `hemanta@engineer.com` | `1234567` |

New signups become Travelers and are stored with scrypt password hashes plus per-user salts.

## Showcase fixes included in this migration

- One authoritative booking model across Traveler, Operator and Manager.
- Server-side booking price calculation and capacity checks.
- Cancel/refund restores seats exactly once.
- Operator data is tenant-scoped by the signed-in operator.
- Paused experiences use **Request re-approval** instead of an invalid direct republish.
- New experiences get initial time slots; operators can add more slots.
- Operator "Today" uses the Nepal local date rather than a hardcoded date.
- Traveler booking status refreshes through the shared realtime inventory event.
- Settings display-name changes survive a full reload.
- Traveler Privacy uses the same persistent setting as Account Settings.
- Reward redemption is persisted.
- Engineer route publication emits a realtime inventory event and published route lines appear on the Traveler map.
- Traveler maps render current place records dynamically instead of only hardcoded pins.
- Crowd Alert uses the currently selected place rather than always referring to Patan Durbar Square.
- Home uses the truthful label **Top Picks in Patan**; actual geolocation is used only on **Quiet Nearby** after permission.
- Prototype notifications and unsupported analytics are explicitly labeled as demo/illustrative.
- AI planning is authenticated and grounded with current places, crowd provenance, published experiences, available time slots and published engineer routes.
- Traveler product architecture exposes only the 149 Traveler screens; role workspaces stay behind role login.

## Architecture note

The 371-route registry remains a **product-architecture prototype**. The core showcase workflows—authentication, crowd updates, discovery, operator availability, bookings, rewards, engineer map publication and AI planning—use the shared backend. Long-tail product-map screens are intentionally interactive prototype surfaces rather than 371 separate production databases.

## Important prototype boundaries

This package intentionally does **not** pretend to provide real payment settlement, government identity verification, real crowd sensors, verified opening hours/entry fees, or production municipal infrastructure. Those integrations should be added only with authorized providers and verified data.
