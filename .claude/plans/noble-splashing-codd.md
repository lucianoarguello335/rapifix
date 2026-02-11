# Phase 1: Foundation — Implementation Plan

## Context

Rapifix is a brand new project (no code exists yet). The full spec is in `rapifix.md`. Phase 1 establishes the entire project foundation: scaffolding, database, auth, professional profiles, and responsive layout. Everything built here is the base for Phases 2-4.

---

## Step 1: Project Scaffolding & Configuration

**Goal:** Initialize Next.js project with all dependencies and tooling.

**Actions:**
1. `pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"` (in the rapifix directory)
2. Configure `tsconfig.json` with strict mode
3. Install dependencies:
   - Runtime: `@supabase/supabase-js`, `@supabase/ssr`, `next-intl`, `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`, `lucide-react`
   - Dev: `@types/node`
4. Initialize shadcn/ui (`pnpm dlx shadcn-ui@latest init`) — use "New York" style, slate base color
5. Install core shadcn/ui components: `button`, `input`, `label`, `textarea`, `select`, `form`, `card`, `badge`, `avatar`, `dropdown-menu`, `dialog`, `toast`, `tabs`, `separator`, `skeleton`, `sheet`
6. Configure Tailwind with the Rapifix color palette in `tailwind.config.ts`:
   - Primary: `#2563EB` (blue-600)
   - Secondary: `#F59E0B` (amber-500)
   - Accent: `#10B981` (emerald-500)
7. Set up ESLint + Prettier config
8. Create `.env.local.example` with all env vars from spec
9. Create `.gitignore` (node_modules, .next, .env.local, etc.)
10. Initialize git repo, first commit

**Files created:** `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.json`, `.prettierrc`, `.gitignore`, `.env.local.example`, `components.json`

---

## Step 2: Folder Structure & Route Stubs

**Goal:** Create the complete folder structure from the spec with placeholder pages for ALL routes.

**Actions:**
1. Create all route group folders with stub `page.tsx` files:
   - `(public)/` — homepage, buscar, profesional/[slug], categorias/[category], barrios/[barrio], blog, como-funciona, sobre-nosotros, preguntas-frecuentes, terminos, privacidad, cookies, terminos-profesional
   - `(auth)/` — login, registro, registro-profesional, recuperar-clave
   - `(dashboard)/` — mi-perfil, mis-resenas, mis-contactos, mis-cotizaciones, mi-plan, configuracion
   - `(user)/` — favoritos, mis-resenas
   - `admin/` — dashboard, usuarios, perfiles, resenas, reportes, categorias, barrios, blog, paginas, configuracion
   - `api/` — contact, quote-request, webhooks/mercadopago, og, auth/callback
2. Create `layout.tsx` for each route group (root, public, auth, dashboard, user, admin)
3. Create `not-found.tsx` and `error.tsx` at root
4. Create `globals.css` with Tailwind directives + CSS custom properties for brand colors
5. Create component directories: `ui/`, `layout/`, `search/`, `profile/`, `review/`, `admin/`, `dashboard/`, `forms/`, `common/`
6. Create lib directories: `supabase/`, `utils/`, `i18n/`, `seo/`, `email/`
7. Create type stubs: `types/database.ts`, `types/profile.ts`, `types/index.ts`
8. Create `public/` subdirs: `images/`, `icons/`, `fonts/`
9. Create `supabase/`, `content/blog/`, `content/pages/`, `tests/e2e/` directories

**Key files:** `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/utils.ts` (cn helper)

---

## Step 3: i18n Setup (next-intl)

**Goal:** Configure next-intl for Spanish-first with English stub.

**Actions:**
1. Create `src/i18n/request.ts` with `getRequestConfig`
2. Create `src/i18n/config.ts` with locale list (`es`, `en`) and default (`es`)
3. Create `src/lib/i18n/dictionaries/es.json` — initial Spanish dictionary covering:
   - Common: app name, loading, search, login, signup, save, cancel, etc.
   - Nav: home, search, for professionals, categories, how it works
   - Home: hero title/subtitle, search placeholder, section headings
   - Auth: form labels, validation messages, social login text
   - Profile: all field labels, availability statuses, price ranges
   - Dashboard: sidebar links, section headings
   - Footer: column headings, copyright
4. Create `src/lib/i18n/dictionaries/en.json` — empty stub with same structure
5. Update root `layout.tsx` with `NextIntlClientProvider`
6. Create `src/middleware.ts` with next-intl middleware (locale prefix: `as-needed`, default: `es`)

**Key convention:** Default locale `es` has NO URL prefix. `/buscar` not `/es/buscar`.

---

## Step 4: Supabase Setup & Database Schema

**Goal:** Create Supabase project, full database schema, and client utilities.

**Actions:**
1. Install Supabase CLI: `pnpm add -D supabase`
2. Init local Supabase: `npx supabase init`
3. Create cloud Supabase project via dashboard
4. Create migration `supabase/migrations/00001_initial_schema.sql` with ALL tables:
   - Custom enum types: `availability_status`, `price_range`, `tier_type`, `contact_method`, `quote_status`, `quote_response`, `report_target_type`, `report_reason`, `report_status`, `blog_status`, `subscription_status`
   - Tables: `user_roles`, `categories`, `neighborhoods`, `profiles`, `profile_neighborhoods`, `profile_secondary_categories`, `work_photos`, `reviews`, `contacts`, `quote_requests`, `quote_request_matches`, `favorites`, `reports`, `blog_posts`, `static_pages`, `subscriptions`, `notification_preferences`
   - All indexes from spec section 4
   - Full-text search index (Spanish config)
   - All RLS policies from spec
   - Database functions: `generate_profile_slug()`, `calculate_profile_completeness()`
   - Trigger: auto-create `user_roles` row on auth signup (default role: `searcher`)
   - Trigger: auto-create `notification_preferences` row on auth signup
   - Trigger: update `updated_at` timestamp on profile changes
5. Create `supabase/seed.sql`:
   - 25 categories with names, slugs, emoji icons, descriptions, sort_order
   - ~45 neighborhoods with names, slugs, zones, approximate lat/lng coordinates
6. Create Supabase client files:
   - `src/lib/supabase/client.ts` — browser client via `createBrowserClient`
   - `src/lib/supabase/server.ts` — server client via `createServerClient` (cookies-based)
   - `src/lib/supabase/admin.ts` — service role client for admin operations
7. Run migration and seed: `npx supabase db reset`
8. Generate TypeScript types: `npx supabase gen types typescript --local > src/types/database.ts`
9. Create Supabase Storage buckets: `profile-photos` (public), `work-photos` (public), `certifications` (private)

**User roles approach:** Hybrid — role stored in `auth.users.raw_user_meta_data.role` (for fast JWT-based checks in middleware) AND in `user_roles` table (for admin queries and audit). A trigger syncs them on signup.

---

## Step 5: Authentication System

**Goal:** Full auth with email/password + Google + Facebook, role-based middleware.

**Actions:**
1. Configure Supabase Auth in dashboard:
   - Enable email/password with email confirmation
   - Enable Google OAuth (create Google Cloud credentials)
   - Enable Facebook OAuth (create Facebook App credentials)
   - Set redirect URLs for local dev and production
2. Create auth middleware `src/lib/supabase/middleware.ts`:
   - Refresh session on every request
   - Protect `(dashboard)/*` routes — require `professional` role
   - Protect `(user)/*` routes — require authenticated user
   - Protect `admin/*` routes — require `admin` role
   - Redirect unauthenticated users to `/login`
3. Update `src/middleware.ts` to chain auth + i18n middleware
4. Create auth API routes:
   - `src/app/api/auth/callback/route.ts` — OAuth callback handler
   - `src/app/api/auth/confirm/route.ts` — email confirmation handler
5. Create auth components:
   - `src/components/auth/login-form.tsx` — email/password form (zod validation)
   - `src/components/auth/signup-form.tsx` — registration form
   - `src/components/auth/social-auth-buttons.tsx` — Google + Facebook buttons
6. Build auth pages:
   - `/login` — login form + social buttons + links to signup
   - `/registro` — searcher signup (sets role `searcher`)
   - `/registro-profesional` — professional signup step 1 (account creation, sets role `professional`, then redirects to profile creation)
   - `/recuperar-clave` — password reset flow
7. Create `src/hooks/use-auth.ts` — client-side auth state hook (current user, role, loading)

**Key files:** `src/middleware.ts`, `src/lib/supabase/middleware.ts`, `src/app/(auth)/login/page.tsx`

---

## Step 6: Professional Registration & Profile Creation

**Goal:** Multi-step profile creation wizard after professional signup.

**Actions:**
1. Create profile validation schemas in `src/lib/validations/profile-schema.ts` (zod):
   - Basic info schema (name, phone, WhatsApp, email)
   - Category schema (primary required)
   - Neighborhoods schema (min 1, max 5 for free tier)
   - Description schema (max 500 chars for free)
2. Create registration wizard components:
   - `src/components/professional/registration-wizard.tsx` — stepper container
   - Step 1: Basic info (first name, last name, phone, WhatsApp)
   - Step 2: Primary category selection (fetch from DB, show with icons)
   - Step 3: Neighborhoods (grouped by zone, multi-select checkboxes)
   - Step 4: Description + optional fields (years experience, availability, price range)
3. Create Server Actions in `src/lib/actions/profile-actions.ts`:
   - `createProfile()` — inserts profile, neighborhoods, generates slug, calculates completeness
4. Create slug generation DB function: `{firstName}-{lastName}-{categorySlug}-{neighborhoodSlug}` with numeric suffix for duplicates
5. Wire `/registro-profesional` page: after account creation → redirect to wizard → on completion → redirect to `/mi-perfil`

**Key files:** `src/lib/actions/profile-actions.ts`, `src/lib/validations/profile-schema.ts`

---

## Step 7: Professional Dashboard

**Goal:** Dashboard with sidebar nav and profile editing.

**Actions:**
1. Create dashboard layout `src/app/(dashboard)/layout.tsx`:
   - Sidebar navigation with links (Mi Perfil, Mis Reseñas, Mis Contactos, Mi Plan, Configuración)
   - Mobile: bottom nav or hamburger-triggered drawer
   - Show profile completeness bar and tier badge
2. Build `/mi-perfil` page with editable sections:
   - Basic info form (name, phone, WhatsApp, email, years experience)
   - Description textarea (with char counter, tier-aware limit)
   - Category management (primary + secondary categories)
   - Neighborhood selection (tier-aware limit)
   - Availability + price range selectors
   - Certifications list (text entries)
3. Create `src/components/dashboard/profile-photo-upload.tsx`:
   - File input with preview
   - Upload to Supabase Storage `profile-photos` bucket
   - Update `profile_photo_url` in profiles table
4. Create `src/components/dashboard/work-photos-manager.tsx`:
   - Upload multiple photos (enforce tier limit: 5 free / 20 paid)
   - Display grid with drag-to-reorder
   - Delete + add captions
   - Store in `work_photos` table + `work-photos` Storage bucket
5. Create Server Actions in `src/lib/actions/profile-actions.ts`:
   - `updateProfile()` — update profile fields
   - `uploadProfilePhoto()` — handle photo upload
   - `addWorkPhoto()`, `deleteWorkPhoto()`, `reorderWorkPhotos()`
6. Show profile completeness score (0-100) with progress bar at top
7. Add "Preview profile" button → opens `/profesional/[slug]` in new tab
8. Build placeholder pages for Mis Reseñas, Mis Contactos (just empty states with "Coming soon" messages, these are Phase 2-3)

**Key files:** `src/app/(dashboard)/layout.tsx`, `src/app/(dashboard)/mi-perfil/page.tsx`

---

## Step 8: Public Professional Profile Page

**Goal:** SEO-optimized public profile page with contact tracking.

**Actions:**
1. Build `src/app/(public)/profesional/[slug]/page.tsx` as Server Component:
   - Fetch profile by slug (join categories, neighborhoods, work_photos)
   - 404 if not found or `is_active = false` or `is_suspended = true`
   - Generate dynamic metadata (title, description, OG tags)
2. Create profile components:
   - `ProfileHeader` — photo, name, category, rating summary, badges (verified, PRO)
   - `ProfileAbout` — description, experience, availability, price range
   - `ProfileGallery` — work photos grid (clickable lightbox)
   - `ProfileNeighborhoods` — list of served neighborhoods
   - `ProfileCertifications` — certifications list
   - `ProfileContactCard` — sticky sidebar (desktop) / sticky bottom bar (mobile) with phone, WhatsApp, contact form buttons
   - `ContactModal` — form dialog (name, email, phone optional, message) with zod validation
   - `ShareButtons` — WhatsApp, Facebook, X, copy link
3. Create contact tracking Server Action `src/lib/actions/contact-actions.ts`:
   - `createContact()` — inserts record in `contacts` table for all methods (form, whatsapp, phone)
   - WhatsApp/phone clicks: tracked client-side before redirect
4. Add JSON-LD structured data: `LocalBusiness` schema with `AggregateRating` (when reviews exist)
5. Create `loading.tsx` with skeleton loader

**Key files:** `src/app/(public)/profesional/[slug]/page.tsx`, `src/lib/actions/contact-actions.ts`

---

## Step 9: Header, Footer & Homepage

**Goal:** Production-ready responsive layout and full homepage.

**Actions:**
1. Build `src/components/layout/header.tsx`:
   - Desktop: `[Logo] [Buscar] [Categorías▼] [Cómo funciona] [Soy profesional] [Login/UserMenu]`
   - Mobile: `[Logo] [Hamburger]` → sheet/drawer with full nav
   - Auth-aware: show different items per role
   - `UserMenu` dropdown: role-specific links + logout
   - Sticky on scroll
2. Build `src/components/layout/footer.tsx`:
   - 3 columns: Categorías (top 6), Acerca de (links), Legal (links)
   - Social icons row
   - Copyright
   - Responsive: stacked on mobile
3. Build homepage `src/app/(public)/page.tsx`:
   - **Hero section**: Tagline + search bar (functional autocomplete wired in Phase 2, for now just links to `/buscar`)
   - **Category icons grid**: Fetch all 25 categories, display as icon + name cards linking to `/categorias/[slug]`
   - **Featured professionals**: "Profesionales destacados" — fetch top-rated profiles (or placeholder empty state)
   - **How it works**: 3-step visual (Buscá → Compará → Contactá)
   - **Latest blog posts**: Placeholder section (no posts yet, hide if empty)
   - **CTA section**: "Sos profesional? Registrate gratis" → link to `/registro-profesional`
4. Create `src/components/layout/logo.tsx` — text-based logo placeholder (Rapifix in brand colors)

**Key files:** `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/app/(public)/page.tsx`

---

## Step 10: Polish & Verification

**Goal:** Error handling, loading states, and end-to-end verification.

**Actions:**
1. Add proper `error.tsx` and `loading.tsx` to all route groups
2. Add toast notifications for all user actions (profile saved, photo uploaded, contact sent, etc.)
3. Responsive QA: test all pages at 375px, 768px, 1024px, 1440px
4. Run `pnpm build` — fix any build errors
5. Run `pnpm lint` — fix all lint issues
6. Run `pnpm tsc --noEmit` — fix all type errors
7. Set up Husky + lint-staged for pre-commit hooks
8. Create initial Playwright config (`playwright.config.ts`)
9. Manual E2E test walkthrough:
   - Sign up as searcher → verify redirect
   - Sign up as professional → complete wizard → verify profile created
   - Edit profile → upload photo → verify changes saved
   - View public profile → verify all sections render
   - Click WhatsApp/phone → verify contact record created
   - Submit contact form → verify contact record created
   - Test auth middleware: access dashboard without login → verify redirect
   - Test responsive on mobile viewport

---

## Implementation Order & Dependencies

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7 → Step 8 → Step 9 → Step 10
```

Steps 1-4 are infrastructure (no UI beyond stubs). Steps 5-9 build features. Step 10 is polish.

Steps 1+2 and 3+4 can be combined into single sessions since they're closely related.

---

## Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| User roles | Hybrid: JWT metadata + `user_roles` table | Fast middleware checks via JWT, flexible admin queries via table |
| Route stubs | All routes created upfront | Clear project structure from day one |
| Profile slug | DB function with auto-dedup | `{first}-{last}-{category}-{neighborhood}(-N)` |
| File uploads | Supabase Storage with public buckets | Simple, integrated, no extra service |
| Form validation | zod + react-hook-form | Type-safe schemas, good DX |
| Server mutations | Next.js Server Actions | Co-located with components, type-safe |
