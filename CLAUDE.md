# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rapifix** is a service professional directory platform for Córdoba, Argentina. Professionals (electricians, plumbers, etc.) create profiles and are discovered by local residents through filtered, ranked search. Full specification is in `rapifix.md`.

**Current Status**: Phase 1 (Foundation) ✅ COMPLETED (2026-02-11)
All core infrastructure, authentication, professional profiles, and dashboard features are implemented and production-ready.

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth (email/password, Google OAuth, Facebook OAuth)
- **Storage**: Supabase Storage (photos, documents)
- **Maps**: react-leaflet + OpenStreetMap (no API key needed)
- **Payments**: MercadoPago SDK
- **Hosting**: Vercel
- **i18n**: next-intl (Spanish-first, Argentine "vos" conjugation)
- **Testing**: Playwright (E2E)
- **Package manager**: pnpm

## Build & Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint + Prettier
pnpm test:e2e         # Run Playwright E2E tests
npx supabase start    # Start local Supabase instance
npx supabase db reset # Reset DB and re-run migrations + seed
```

## Architecture

### Route Groups (App Router)

- `(public)/` — No auth required: homepage, search (`/buscar`), profiles (`/profesional/[slug]`), categories, neighborhoods, blog, legal pages
- `(auth)/` — Login, registration, password recovery
- `(dashboard)/` — Professional dashboard (auth + `professional` role): profile editing, reviews received (`/mis-resenas`), contacts, quotes, plan management
- `(user)/` — Searcher dashboard (auth + `searcher` role): favorites, reviews given (`/valoraciones`)
- `admin/` — Admin panel (auth + `admin` role): full platform management

**Note**: Professional reviews are at `/mis-resenas` (reviews they received), searcher reviews are at `/valoraciones` (reviews they gave) to avoid route conflicts.

### User Roles

Three roles: `searcher` (default), `professional` (has profile listing), `admin` (full access). Middleware protects dashboard/admin routes.

### Database

Supabase PostgreSQL with RLS. Migrations in `supabase/migrations/`, seed data in `supabase/seed.sql`. Key tables: `profiles`, `categories`, `neighborhoods`, `profile_neighborhoods`, `reviews`, `contacts`, `quote_requests`, `favorites`, `reports`, `subscriptions`. Full schema in `rapifix.md` section 4.

### Supabase Clients

- `src/lib/supabase/client.ts` — Browser client
- `src/lib/supabase/server.ts` — Server client (SSR)
- `src/lib/supabase/admin.ts` — Service role client (admin operations only)

### Ranking Algorithm

Profiles are ranked by composite score: rating (35%), review count (20%), profile completeness (15%), recency (15%), paid tier boost (15%). Implemented as a Supabase database function.

### Freemium Model

Free tier has limits on photos (5), neighborhoods (5), description length (500 chars). Paid "Rapifix Pro" tier gets expanded limits, priority search ranking (+15%), and a PRO badge.

## Key Conventions

- **Language**: All UI text, routes, and slugs are in Spanish (Argentine). Routes use Spanish: `/buscar`, `/profesional/`, `/categorias/`, `/barrios/`
- **Profile URLs**: `/profesional/[slug]` where slug = `{first_name}-{last_name}-{category}-{neighborhood}`
- **Mobile-first**: Design for 375px width first
- **SEO-critical**: All public pages must have SSR/SSG, structured data (JSON-LD), Open Graph tags, and proper meta tags
- **Contact tracking**: Every phone click, WhatsApp click, and form submission creates a `contacts` record (enables review eligibility)

## Implementation Status

### ✅ Implemented (Phase 1 - Complete)

- Full Next.js 14+ project with TypeScript, Tailwind CSS, shadcn/ui
- Complete Supabase schema (15+ tables, RLS policies, indexes)
- Seed data: 25 categories, ~45 Córdoba neighborhoods
- Authentication system (email/password + OAuth placeholders for Google/Facebook)
- Professional registration wizard (4-step profile creation)
- Professional dashboard with profile editing
- Profile photo upload
- Work photos management (with tier limits)
- Public professional profile pages with SEO optimization
- Contact tracking (form, WhatsApp, phone)
- Responsive header, footer, homepage
- i18n setup with next-intl (Spanish dictionary complete)
- Error handling and loading states for all route groups
- Toast notifications (Sonner)
- Production build verified

### 🚧 Not Implemented Yet (Phase 2+)

- Search functionality with filters and ranking
- Category and neighborhood landing pages (functional)
- Map integration (react-leaflet)
- Reviews and ratings system
- Favorites system
- Quote request system
- Reporting/flagging
- Verification badge system
- MercadoPago payment integration
- Admin panel functionality
- Blog CMS
- Email notifications
- Push notifications
- Analytics integration (GA4, Hotjar)
- Legal pages content
- E2E tests (Playwright)

When working on new features, check the implementation status above and reference the full specification in `rapifix.md` for detailed requirements.
