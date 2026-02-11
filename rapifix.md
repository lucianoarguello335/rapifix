# Rapifix — Platform Plan & Specification

> **Directorio de profesionales de servicios para Córdoba, Argentina**
> Última actualización: 2026-02-11
> **Status**: Phase 1 (Foundation) ✅ COMPLETED

---

## Table of Contents

1. [Vision & Overview](#1-vision--overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture & Repo Structure](#3-architecture--repo-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication & User Roles](#5-authentication--user-roles)
6. [Professional Profiles](#6-professional-profiles)
7. [Categories & Trades](#7-categories--trades)
8. [Neighborhoods / Zones](#8-neighborhoods--zones)
9. [Search & Discovery](#9-search--discovery)
10. [Ranking Algorithm](#10-ranking-algorithm)
11. [Map Integration](#11-map-integration)
12. [Contact & Communication](#12-contact--communication)
13. [Quote Request System](#13-quote-request-system)
14. [Review System](#14-review-system)
15. [Reporting & Flagging](#15-reporting--flagging)
16. [Verification System](#16-verification-system)
17. [Favorites System](#17-favorites-system)
18. [Freemium Model & Paid Tier](#18-freemium-model--paid-tier)
19. [Payments — MercadoPago](#19-payments--mercadopago)
20. [Notifications](#20-notifications)
21. [Admin Panel](#21-admin-panel)
22. [CMS — Blog & Static Pages](#22-cms--blog--static-pages)
23. [SEO Strategy](#23-seo-strategy)
24. [Analytics & Tracking](#24-analytics--tracking)
25. [Legal & Compliance](#25-legal--compliance)
26. [Design & Branding](#26-design--branding)
27. [Internationalization (i18n)](#27-internationalization-i18n)
28. [Social Media Integration](#28-social-media-integration)
29. [Testing Strategy](#29-testing-strategy)
30. [MVP Phases & Roadmap](#30-mvp-phases--roadmap)
31. [Future Expansion](#31-future-expansion)

---

## 1. Vision & Overview

**Rapifix** is a web platform where service professionals (electricians, plumbers, painters, etc.) in Córdoba, Argentina can create comprehensive profiles and be discovered by local residents through a filtered, ranked search system.

### Core Value Propositions

- **For professionals**: An online presence with portfolio, reviews, and verified badges that generates leads and builds reputation.
- **For searchers**: A fast, reliable way to find vetted service professionals in their neighborhood, compare options, and make contact.

### Key Principles

- **Mobile-first**: Most users in Argentina browse on mobile devices.
- **Local-first**: Optimized for Córdoba, architectured for multi-city expansion.
- **Trust-driven**: Reviews, verification badges, and moderation build platform credibility.
- **SEO-driven growth**: Organic search is the primary acquisition channel.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14+ (App Router) | SSR/SSG for SEO, React ecosystem, Vercel-native |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first, accessible components, highly customizable |
| **Backend / DB** | Supabase (PostgreSQL) | Auth, storage, realtime, Row Level Security, generous free tier |
| **Auth** | Supabase Auth | Email/password + Google OAuth + Facebook OAuth |
| **File Storage** | Supabase Storage | Profile photos, work gallery, certifications |
| **Maps** | Leaflet + OpenStreetMap (react-leaflet) | Free, no API key costs, good enough for neighborhood-level |
| **Payments** | MercadoPago SDK | Dominant in Argentina, supports cards, bank transfer, cash |
| **Hosting** | Vercel | Automatic deployments, edge functions, preview deploys |
| **Analytics** | Google Analytics 4 + Hotjar | Traffic analytics + heatmaps/behavior |
| **Email** | Resend or Supabase Edge Functions + SMTP | Transactional emails (notifications, contact forms) |
| **Push Notifications** | Web Push API (via service worker) | Browser push notifications for professionals |
| **E2E Testing** | Playwright | Critical flow testing |
| **i18n** | next-intl | Spanish-first with English support ready |
| **CMS** | MDX files or Supabase-based custom CMS | Blog posts and static content pages |

### Package Manager & Tooling

- **Package manager**: pnpm (fast, disk-efficient)
- **Linting**: ESLint + Prettier
- **Git hooks**: Husky + lint-staged
- **Type checking**: TypeScript (strict mode)

---

## 3. Architecture & Repo Structure

**Monorepo** — single repository containing the full application.

```
rapifix/
├── public/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── manifest.json
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public pages (no auth required)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── buscar/               # Search / browse page
│   │   │   │   └── page.tsx
│   │   │   ├── profesional/          # Professional profile pages
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── categorias/           # Category listing/landing pages
│   │   │   │   └── [category]/
│   │   │   │       └── page.tsx
│   │   │   ├── barrios/              # Neighborhood landing pages
│   │   │   │   └── [barrio]/
│   │   │   │       └── page.tsx
│   │   │   ├── blog/                 # Blog listing + posts
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── como-funciona/        # How it works
│   │   │   ├── sobre-nosotros/       # About us
│   │   │   ├── preguntas-frecuentes/ # FAQ
│   │   │   ├── terminos/             # Terms of Service
│   │   │   ├── privacidad/           # Privacy Policy
│   │   │   ├── cookies/              # Cookie Policy
│   │   │   └── terminos-profesional/ # Professional Terms
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── login/
│   │   │   ├── registro/
│   │   │   ├── registro-profesional/
│   │   │   └── recuperar-clave/
│   │   ├── (dashboard)/              # Professional dashboard (auth required)
│   │   │   ├── mi-perfil/
│   │   │   ├── mis-resenas/
│   │   │   ├── mis-contactos/
│   │   │   ├── mis-cotizaciones/
│   │   │   ├── mi-plan/
│   │   │   └── configuracion/
│   │   ├── (user)/                   # Searcher dashboard (auth required)
│   │   │   ├── favoritos/
│   │   │   └── valoraciones/         # Reviews given by searcher (renamed from mis-resenas to avoid route conflict)
│   │   ├── admin/                    # Admin panel (admin role required)
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── usuarios/
│   │   │   ├── perfiles/
│   │   │   ├── resenas/
│   │   │   ├── reportes/
│   │   │   ├── categorias/
│   │   │   ├── barrios/
│   │   │   ├── blog/
│   │   │   ├── paginas/
│   │   │   └── configuracion/
│   │   ├── api/                      # API routes
│   │   │   ├── contact/
│   │   │   ├── quote-request/
│   │   │   ├── webhooks/
│   │   │   │   └── mercadopago/
│   │   │   └── og/                   # Open Graph image generation
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── layout/                   # Header, Footer, Sidebar, Navigation
│   │   ├── search/                   # SearchBar, Filters, ResultCard, MapView
│   │   ├── profile/                  # ProfileCard, Gallery, ReviewList, ContactForm
│   │   ├── review/                   # ReviewForm, StarRating, AspectRatings
│   │   ├── admin/                    # Admin-specific components
│   │   ├── dashboard/                # Professional dashboard components
│   │   ├── forms/                    # Shared form components
│   │   └── common/                   # Badges, Chips, Loaders, EmptyStates
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   ├── admin.ts              # Service role client (admin operations)
│   │   │   └── middleware.ts         # Auth middleware
│   │   ├── mercadopago/
│   │   │   ├── client.ts
│   │   │   └── webhooks.ts
│   │   ├── analytics/
│   │   │   ├── gtag.ts
│   │   │   └── hotjar.ts
│   │   ├── email/
│   │   │   └── templates/
│   │   ├── seo/
│   │   │   ├── metadata.ts
│   │   │   └── structured-data.ts
│   │   ├── utils/
│   │   │   ├── formatting.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   └── i18n/
│   │       ├── config.ts
│   │       └── dictionaries/
│   │           ├── es.json
│   │           └── en.json
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-search.ts
│   │   ├── use-favorites.ts
│   │   ├── use-auth.ts
│   │   └── use-notifications.ts
│   ├── types/                        # TypeScript type definitions
│   │   ├── database.ts               # Supabase generated types
│   │   ├── profile.ts
│   │   ├── review.ts
│   │   ├── search.ts
│   │   └── admin.ts
│   └── styles/
│       └── globals.css
├── supabase/
│   ├── migrations/                   # Database migrations
│   ├── seed.sql                      # Seed data (categories, neighborhoods)
│   └── config.toml
├── content/                          # MDX content for blog & pages
│   ├── blog/
│   └── pages/
├── tests/
│   └── e2e/                          # Playwright E2E tests
│       ├── search.spec.ts
│       ├── signup.spec.ts
│       ├── contact.spec.ts
│       ├── review.spec.ts
│       └── admin.spec.ts
├── .env.local.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 4. Database Schema

### Tables

#### `profiles` — Professional profiles

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | References auth.users.id |
| `slug` | text (unique) | URL-friendly slug, auto-generated from name |
| `first_name` | text | Required |
| `last_name` | text | Required |
| `phone` | text | Required |
| `whatsapp` | text | Optional, defaults to phone |
| `email` | text | Contact email (can differ from auth email) |
| `description` | text | Free-text bio / service description |
| `category_id` | int (FK) | Primary service category |
| `profile_photo_url` | text | Supabase Storage URL |
| `years_experience` | int | Optional |
| `availability` | enum | 'available', 'busy', 'unavailable' |
| `price_range` | enum | 'low', 'medium', 'high', 'premium' |
| `price_description` | text | Optional free-text pricing info |
| `certifications` | text[] | Array of certification names |
| `certification_docs` | text[] | Array of uploaded document URLs |
| `is_verified` | boolean | Admin-granted verified badge |
| `is_active` | boolean | Profile visible in search |
| `is_suspended` | boolean | Admin suspended |
| `tier` | enum | 'free', 'paid' |
| `tier_expires_at` | timestamptz | When paid tier expires |
| `profile_completeness` | int | 0-100 calculated score |
| `last_active_at` | timestamptz | Last login or profile update |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

#### `categories` — Service categories

| Column | Type | Notes |
|---|---|---|
| `id` | serial (PK) | |
| `name` | text | Display name ("Electricista") |
| `slug` | text (unique) | URL slug ("electricista") |
| `icon` | text | Icon identifier or emoji |
| `description` | text | Category description for SEO |
| `is_active` | boolean | Admin can hide categories |
| `sort_order` | int | Display order |
| `created_at` | timestamptz | |

#### `neighborhoods` — Córdoba neighborhoods/barrios

| Column | Type | Notes |
|---|---|---|
| `id` | serial (PK) | |
| `name` | text | Display name ("Nueva Córdoba") |
| `slug` | text (unique) | URL slug ("nueva-cordoba") |
| `zone` | text | Broader zone grouping (Centro, Norte, Sur, etc.) |
| `lat` | float | Center latitude (for map) |
| `lng` | float | Center longitude (for map) |
| `is_active` | boolean | |
| `created_at` | timestamptz | |

#### `profile_neighborhoods` — Many-to-many: profiles ↔ neighborhoods

| Column | Type | Notes |
|---|---|---|
| `profile_id` | uuid (FK) | |
| `neighborhood_id` | int (FK) | |
| PK: (profile_id, neighborhood_id) | | |

#### `profile_secondary_categories` — Pros can have secondary categories

| Column | Type | Notes |
|---|---|---|
| `profile_id` | uuid (FK) | |
| `category_id` | int (FK) | |
| PK: (profile_id, category_id) | | |

#### `work_photos` — Gallery photos

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `profile_id` | uuid (FK) | |
| `url` | text | Supabase Storage URL |
| `caption` | text | Optional description |
| `sort_order` | int | Display order |
| `created_at` | timestamptz | |

#### `reviews` — User reviews

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `profile_id` | uuid (FK) | Professional being reviewed |
| `reviewer_id` | uuid (FK) | auth.users.id of reviewer |
| `contact_id` | uuid (FK) | References the contact record (verification) |
| `rating_overall` | int | 1-5 stars |
| `rating_punctuality` | int | 1-5 stars |
| `rating_quality` | int | 1-5 stars |
| `rating_price` | int | 1-5 stars |
| `rating_communication` | int | 1-5 stars |
| `comment` | text | Written review |
| `professional_reply` | text | Professional's response |
| `professional_reply_at` | timestamptz | When reply was posted |
| `is_visible` | boolean | Admin can hide |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

#### `contacts` — Contact records (tracks who contacted whom)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `profile_id` | uuid (FK) | Professional contacted |
| `searcher_name` | text | Name of person contacting |
| `searcher_email` | text | Email |
| `searcher_phone` | text | Optional |
| `message` | text | Contact message |
| `contact_method` | enum | 'form', 'whatsapp', 'phone' |
| `user_id` | uuid (FK, nullable) | If searcher is logged in |
| `is_read` | boolean | Professional marked as read |
| `created_at` | timestamptz | |

#### `quote_requests` — Job quote requests

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `category_id` | int (FK) | What type of service |
| `neighborhood_id` | int (FK) | Where |
| `description` | text | Description of the job |
| `requester_name` | text | |
| `requester_email` | text | |
| `requester_phone` | text | |
| `user_id` | uuid (FK, nullable) | If logged in |
| `status` | enum | 'open', 'matched', 'closed' |
| `created_at` | timestamptz | |

#### `quote_request_matches` — Professionals matched to quote requests

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `quote_request_id` | uuid (FK) | |
| `profile_id` | uuid (FK) | |
| `notified_at` | timestamptz | When pro was notified |
| `responded_at` | timestamptz | When pro responded |
| `response` | enum | 'interested', 'declined', null |

#### `favorites` — Saved/favorited professionals

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK) | auth.users.id |
| `profile_id` | uuid (FK) | Professional |
| `created_at` | timestamptz | |
| UNIQUE: (user_id, profile_id) | | |

#### `reports` — Flagged content

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `reporter_id` | uuid (FK, nullable) | Who reported (null if anonymous) |
| `target_type` | enum | 'profile', 'review', 'photo' |
| `target_id` | uuid | ID of the reported item |
| `reason` | enum | 'spam', 'fake', 'inappropriate', 'offensive', 'other' |
| `description` | text | Optional details |
| `status` | enum | 'pending', 'reviewed', 'action_taken', 'dismissed' |
| `admin_notes` | text | Admin response |
| `reviewed_by` | uuid (FK, nullable) | Admin who reviewed |
| `reviewed_at` | timestamptz | |
| `created_at` | timestamptz | |

#### `blog_posts` — CMS blog posts

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `title` | text | |
| `slug` | text (unique) | |
| `content` | text | Markdown/MDX content |
| `excerpt` | text | Short summary for listings |
| `cover_image_url` | text | |
| `author_id` | uuid (FK) | Admin who wrote it |
| `status` | enum | 'draft', 'published' |
| `published_at` | timestamptz | |
| `meta_title` | text | SEO title override |
| `meta_description` | text | SEO description |
| `tags` | text[] | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

#### `static_pages` — CMS static pages

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `title` | text | |
| `slug` | text (unique) | |
| `content` | text | Markdown content |
| `meta_title` | text | |
| `meta_description` | text | |
| `is_published` | boolean | |
| `updated_at` | timestamptz | |

#### `subscriptions` — Paid tier subscriptions

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `profile_id` | uuid (FK) | |
| `mercadopago_subscription_id` | text | MercadoPago reference |
| `mercadopago_payer_id` | text | |
| `status` | enum | 'active', 'cancelled', 'expired', 'pending' |
| `plan_amount` | decimal | Monthly price |
| `currency` | text | 'ARS' |
| `current_period_start` | timestamptz | |
| `current_period_end` | timestamptz | |
| `cancelled_at` | timestamptz | |
| `created_at` | timestamptz | |

#### `notification_preferences` — Per-user notification settings

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid (PK, FK) | |
| `email_contacts` | boolean | Notify on new contacts |
| `email_reviews` | boolean | Notify on new reviews |
| `email_quotes` | boolean | Notify on quote requests |
| `push_contacts` | boolean | |
| `push_reviews` | boolean | |
| `push_quotes` | boolean | |
| `updated_at` | timestamptz | |

### Database Indexes

```sql
-- Search performance
CREATE INDEX idx_profiles_category ON profiles(category_id) WHERE is_active = true;
CREATE INDEX idx_profiles_tier ON profiles(tier) WHERE is_active = true;
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profile_neighborhoods_neighborhood ON profile_neighborhoods(neighborhood_id);
CREATE INDEX idx_profile_neighborhoods_profile ON profile_neighborhoods(profile_id);

-- Reviews
CREATE INDEX idx_reviews_profile ON reviews(profile_id) WHERE is_visible = true;
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);

-- Contacts
CREATE INDEX idx_contacts_profile ON contacts(profile_id);
CREATE INDEX idx_contacts_user ON contacts(user_id);

-- Favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- Blog
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status, published_at);

-- Full-text search
CREATE INDEX idx_profiles_search ON profiles USING gin(
  to_tsvector('spanish', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(description, ''))
);
```

### Row Level Security (RLS) Policies

- **profiles**: Public read (where `is_active = true AND is_suspended = false`), owner can update own profile
- **reviews**: Public read (where `is_visible = true`), authenticated users can insert (with contact verification), profile owner can update `professional_reply` only
- **contacts**: Profile owner can read their contacts, anyone can insert
- **favorites**: User can CRUD their own favorites only
- **work_photos**: Public read, profile owner can CRUD
- **reports**: Authenticated users can insert, admin can read/update
- **blog_posts**: Public read (where `status = 'published'`), admin can CRUD
- **subscriptions**: Profile owner can read, system/webhook can update

---

## 5. Authentication & User Roles

### Auth Providers (Supabase Auth)

1. **Email/Password** — Standard registration with email verification
2. **Google OAuth** — One-click sign-in with Google
3. **Facebook OAuth** — One-click sign-in with Facebook

### User Roles

Stored in a `user_roles` table or as metadata in `auth.users.raw_user_meta_data`:

| Role | Description |
|---|---|
| `searcher` | Default role for anyone who signs up. Can save favorites, leave reviews. |
| `professional` | Has a profile listing. Can manage profile, view contacts, respond to reviews. |
| `admin` | Full platform access. Content moderation, user management, CMS. |

### Auth Flows

1. **Searcher sign-up**: Email/Google/Facebook → account created with `searcher` role → can save favorites and leave reviews
2. **Professional sign-up**: Dedicated registration page → fills profile form → account created with `professional` role → profile goes live immediately
3. **Login**: Email/password or OAuth → redirect to appropriate dashboard
4. **Password recovery**: Standard email-based password reset flow

### Session Management

- Supabase handles JWT tokens automatically
- Server-side session validation via `@supabase/ssr`
- Middleware protects dashboard and admin routes

---

## 6. Professional Profiles

### Profile Fields (Full Set)

| Field | Required | Free | Paid |
|---|---|---|---|
| First name | Yes | Yes | Yes |
| Last name | Yes | Yes | Yes |
| Profile photo | Yes | 1 | 1 |
| Primary category | Yes | Yes | Yes |
| Secondary categories | No | Up to 2 | Up to 5 |
| Description / bio | Yes | Max 500 chars | Max 2000 chars |
| Phone number | Yes | Yes | Yes |
| WhatsApp number | No | Yes | Yes |
| Email (contact) | Yes | Yes | Yes |
| Neighborhoods served | Yes (min 1) | Up to 5 | Up to 15 |
| Work photos gallery | No | Up to 5 | Up to 20 |
| Certifications (text) | No | Up to 3 | Up to 10 |
| Certification documents | No | Up to 3 | Up to 10 |
| Years of experience | No | Yes | Yes |
| Availability status | No | Yes | Yes |
| Price range | No | Yes | Yes |
| Price description | No | Max 200 chars | Max 500 chars |

### Profile URL Structure

`/profesional/[slug]` — e.g., `/profesional/juan-perez-electricista-nueva-cordoba`

Slug auto-generated from: `{first_name}-{last_name}-{category}-{neighborhood}` (deduplicated with suffix if needed).

### Profile Completeness Score

Calculated field (0-100) based on filled fields:

| Field | Points |
|---|---|
| Profile photo | 15 |
| Description (min 100 chars) | 15 |
| Phone + WhatsApp | 10 |
| At least 3 neighborhoods | 10 |
| At least 3 work photos | 15 |
| At least 1 certification | 10 |
| Years of experience | 5 |
| Availability set | 5 |
| Price range set | 5 |
| Price description | 5 |
| Secondary category | 5 |

Profiles with higher completeness score rank higher in search results.

### Professional Dashboard Pages

1. **Mi Perfil**: Edit all profile fields, upload/manage photos, preview how profile looks publicly
2. **Mis Reseñas**: View all reviews, reply to reviews, see rating breakdown
3. **Mis Contactos**: List of people who contacted them, mark as read, view details
4. **Mis Cotizaciones**: Quote requests matched to them, respond interested/declined
5. **Mi Plan**: Current tier info, upgrade to paid, manage subscription
6. **Configuración**: Notification preferences, change password, deactivate account

---

## 7. Categories & Trades

### Launch Categories (Comprehensive List)

| # | Spanish Name | Slug | Icon |
|---|---|---|---|
| 1 | Electricista | electricista | ⚡ |
| 2 | Plomero / Gasista | plomero | 🔧 |
| 3 | Pintor | pintor | 🎨 |
| 4 | Albañil | albanil | 🧱 |
| 5 | Carpintero | carpintero | 🪚 |
| 6 | Cerrajero | cerrajero | 🔑 |
| 7 | Aire Acondicionado / Calefacción | climatizacion | ❄️ |
| 8 | Jardinero / Paisajista | jardinero | 🌿 |
| 9 | Limpieza | limpieza | 🧹 |
| 10 | Mudanzas / Fletes | mudanzas | 📦 |
| 11 | Técnico en Electrodomésticos | electrodomesticos | 🔌 |
| 12 | Vidriería | vidrieria | 🪟 |
| 13 | Pisos y Revestimientos | pisos | 🏗️ |
| 14 | Techista / Impermeabilización | techista | 🏠 |
| 15 | Control de Plagas | plagas | 🐛 |
| 16 | Herrería / Soldadura | herreria | ⚙️ |
| 17 | Durlock / Construcción en Seco | durlock | 🪵 |
| 18 | Marmolería | marmoleria | 🪨 |
| 19 | Cortinas y Persianas | cortinas | 🪟 |
| 20 | Seguridad / Cámaras / Alarmas | seguridad | 📹 |
| 21 | Técnico en PC / Redes | informatica | 💻 |
| 22 | Instalación de Gas | gasista | 🔥 |
| 23 | Piletas / Piscinas | piletas | 🏊 |
| 24 | Tapicería | tapiceria | 🛋️ |
| 25 | Fumigación | fumigacion | 🧪 |

Categories are admin-manageable (add, edit, reorder, hide).

### Category Landing Pages

Each category gets a dedicated SEO-optimized page at `/categorias/[slug]`:
- Title: "Mejores [Category] en Córdoba — Rapifix"
- Description of the service
- Top-rated professionals in that category
- Related blog posts
- Structured data (ItemList schema)

---

## 8. Neighborhoods / Zones

### Córdoba Neighborhoods (Seed Data)

Organized by broader zones for grouping:

**Centro:**
Centro, Nueva Córdoba, Güemes, Alberdi, San Vicente, General Paz, Alta Córdoba, Cofico, Observatorio, Juniors, Bella Vista

**Norte:**
Cerro de las Rosas, Villa Belgrano, Argüello, Villa Allende (periférico), Urca, Tablada Park, Colinas de Vélez Sársfield, Country clubs zona norte

**Sur:**
Barrio Jardín, San Fernando, Villa Carlos Paz (periférico), Inaudi, Cabildo, Ampliación Residencial América

**Este:**
Barrio Pueyrredón, San Martín, Empalme, Ferreyra, Ituzaingó

**Oeste:**
Marqués de Sobremonte, Yofre, Villa Cabrera, Jardín Espinosa, Parque Vélez Sársfield

**Sierras Chicas:**
Unquillo, Río Ceballos, Mendiolaza, Salsipuedes, La Calera

*(Full list to be expanded with complete barrio data — approximately 450 neighborhoods in Córdoba city proper)*

### Neighborhood Landing Pages

Each neighborhood gets a page at `/barrios/[slug]`:
- Title: "Profesionales en [Neighborhood] — Rapifix"
- Map centered on the neighborhood
- List of professionals serving that area
- Filter by category

---

## 9. Search & Discovery

### Search Page (`/buscar`)

#### URL Structure (SEO-friendly)

```
/buscar?categoria=electricista&barrio=nueva-cordoba&rating=4&precio=medio&experiencia=5
```

#### Search Bar with Autocomplete

- Combined input field at the top
- As user types, show suggestions for:
  - Categories matching the text
  - Neighborhoods matching the text
  - Professional names matching the text
- Powered by Supabase full-text search + client-side category/neighborhood matching

#### Available Filters

| Filter | Type | Values |
|---|---|---|
| Category | Dropdown / multi-select | All active categories |
| Neighborhood | Dropdown / multi-select | All active neighborhoods, grouped by zone |
| Minimum rating | Slider or button group | 1-5 stars |
| Price range | Checkbox group | Económico, Medio, Alto, Premium |
| Availability | Toggle | Available now |
| Years of experience | Slider | 0-30+ |
| Has work photos | Toggle | Yes/No |
| Has certifications | Toggle | Yes/No |
| Is verified | Toggle | Yes/No |
| Sort by | Dropdown | Relevance (default), Rating, Reviews count, Newest |

#### Results Display

- **Default view**: Card grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- **List view**: Compact list option
- **Map view**: Toggle to see results on a Leaflet map
- **Pagination**: Infinite scroll or "Load more" button (20 results per page)

#### Result Card Content

```
┌─────────────────────────────────────┐
│ [Photo]  Juan Pérez            ⭐4.8│
│          Electricista          (23) │
│          📍 Nueva Córdoba, Centro   │
│          💰 Precio medio            │
│          🔧 12 años de experiencia  │
│          ✅ Verificado   ⭐ PRO     │
│                                     │
│  [Ver perfil]  [WhatsApp]  [Llamar] │
└─────────────────────────────────────┘
```

---

## 10. Ranking Algorithm

### Composite Score Formula

```
score = (w1 × rating_score) +
        (w2 × review_count_score) +
        (w3 × completeness_score) +
        (w4 × recency_score) +
        (w5 × tier_boost)
```

### Weight Configuration

| Factor | Weight | Calculation |
|---|---|---|
| `rating_score` | 0.35 | `avg_rating / 5.0` (normalized 0-1). Minimum 3 reviews to count, otherwise neutral 0.5. |
| `review_count_score` | 0.20 | `min(review_count, 50) / 50` (normalized, capped at 50). More reviews = higher trust. |
| `completeness_score` | 0.15 | `profile_completeness / 100` (the 0-100 score normalized). |
| `recency_score` | 0.15 | Decay function based on `last_active_at`. Active in last 7 days = 1.0, 30 days = 0.7, 90 days = 0.3, 180+ days = 0.1. |
| `tier_boost` | 0.15 | Free = 0.0, Paid = 1.0. Gives paid professionals a ranking advantage. |

### Implementation

- Computed as a **Supabase database function** that runs on query
- Alternatively, pre-computed and stored in a `ranking_score` column, updated via a Supabase cron job (pg_cron) every hour
- When filters are applied, ranking operates within the filtered subset

### Search Relevance

When text search is used, an additional `text_relevance` factor is multiplied into the score using PostgreSQL `ts_rank`.

---

## 11. Map Integration

### Technology

- **Library**: `react-leaflet` (React wrapper for Leaflet.js)
- **Tiles**: OpenStreetMap (free, no API key)
- **Geocoding**: Nominatim (free, for address lookups if needed)

### Map Features

1. **Search results map view**: Toggle between list and map on the search page
2. **Markers**: Each professional shown as a pin at their neighborhood center point
3. **Clustering**: Cluster markers when zoomed out (using `react-leaflet-cluster`)
4. **Popup**: Click marker to see mini profile card with name, rating, category, and "Ver perfil" link
5. **Bounds**: Default view centered on Córdoba city (-31.4201, -64.1888), zoom level 12
6. **Neighborhood highlighting**: Optional polygon overlay showing neighborhood boundaries

### Profile Page Map

- Small map on each professional's profile page showing the neighborhoods they serve
- Highlighted polygons for each served neighborhood

---

## 12. Contact & Communication

### Contact Methods (displayed on profile)

1. **Phone number**: Displayed with click-to-call on mobile (`tel:` link)
2. **WhatsApp**: Direct WhatsApp link (`https://wa.me/54XXXXXXXXXX?text=Hola, te encontré en Rapifix...`)
3. **Contact form**: In-page form that sends an email to the professional

### Contact Form Fields

| Field | Required | Notes |
|---|---|---|
| Name | Yes | |
| Email | Yes | For professional to reply |
| Phone | No | Optional |
| Message | Yes | What they need help with |

### Contact Flow

1. Searcher fills out contact form on professional's profile page
2. A `contacts` record is created in the database
3. Professional receives email notification with the contact details
4. Professional receives browser push notification (if enabled)
5. Contact appears in professional's "Mis Contactos" dashboard
6. After contact is made, searcher becomes eligible to leave a review

### WhatsApp Tracking

When user clicks the WhatsApp button:
- A `contacts` record is created with `contact_method = 'whatsapp'`
- The user is redirected to WhatsApp with a pre-filled message
- This contact record enables review eligibility

### Phone Tracking

When user clicks the phone button:
- A `contacts` record is created with `contact_method = 'phone'`
- The user is redirected via `tel:` link

---

## 13. Quote Request System

### Flow

1. Searcher navigates to "Pedir Presupuesto" page or widget
2. Fills out the form:
   - **Category**: What service they need (dropdown)
   - **Neighborhood**: Where they are (dropdown)
   - **Description**: What they need done (text area, min 50 chars)
   - **Name**: Their name
   - **Email**: Their email
   - **Phone**: Their phone (optional)
3. System creates a `quote_requests` record
4. System finds all matching professionals (same category + serves that neighborhood)
5. System creates `quote_request_matches` records and notifies matched professionals
6. Professionals see the quote request in their dashboard and can respond "Interested" or "Decline"
7. Interested professionals' contact info is shared with the requester via email

### Limits

- Free professionals receive up to 5 quote request notifications per week
- Paid professionals receive unlimited quote request notifications
- Searchers can submit up to 3 quote requests per day (rate limiting)

---

## 14. Review System

### Review Format

- **Overall rating**: 1-5 stars (required)
- **Sub-ratings** (all required):
  - Puntualidad (Punctuality): 1-5 stars
  - Calidad (Quality): 1-5 stars
  - Precio (Price fairness): 1-5 stars
  - Comunicación (Communication): 1-5 stars
- **Written comment**: Text (required, min 20 chars, max 1000 chars)

### Review Eligibility

- Only users who have a `contacts` record with the professional can leave a review
- One review per contact record (prevent duplicate reviews)
- Must have an account (searcher or professional role)
- Cannot review yourself
- Contact must be at least 24 hours old (gives time for actual service)

### Review Display on Profile

```
★★★★★ 4.8 (23 reseñas)

Puntualidad: ★★★★★ 4.9
Calidad:     ★★★★★ 4.7
Precio:      ★★★★☆ 4.2
Comunicación:★★★★★ 4.8

─────────────────────────

María García — ★★★★★ — hace 3 días
"Excelente trabajo, muy profesional y puntual.
 Resolvió el problema eléctrico rápidamente."

  └─ Respuesta de Juan: "Gracias María, fue un
     gusto trabajar contigo!"

Pedro López — ★★★★☆ — hace 2 semanas
"Buen trabajo en general, aunque llegó un poco
 tarde. El precio fue justo."
```

### Professional Reply

- Professionals can reply once per review
- Reply is displayed below the review publicly
- Professional can edit their reply within 48 hours of posting

### Review Moderation

- Reviews are published immediately (no pre-approval)
- Reviews can be reported via the flagging system
- Admin can hide reviews from the admin panel
- Professionals cannot delete reviews (only admin)

---

## 15. Reporting & Flagging

### Reportable Items

1. **Profiles**: Fake identity, spam, inappropriate content, wrong category
2. **Reviews**: Fake review, offensive language, irrelevant content, competitor sabotage
3. **Photos**: Inappropriate images, copyright violation, unrelated to service

### Report Reasons

| Reason | Spanish Label |
|---|---|
| spam | Spam o publicidad |
| fake | Información falsa |
| inappropriate | Contenido inapropiado |
| offensive | Lenguaje ofensivo |
| other | Otro motivo |

### Report Flow

1. User clicks "Reportar" button on profile, review, or photo
2. Selects a reason from the dropdown
3. Optionally adds a description
4. Report is created and appears in admin dashboard
5. Admin reviews and takes action: dismiss, hide content, or suspend user

### Admin Actions on Reports

- **Dismiss**: Report is unfounded, no action taken
- **Hide content**: Review/photo hidden from public view
- **Warn user**: Send warning email to the reported user
- **Suspend profile**: Profile hidden from search, professional notified
- **Ban user**: Account permanently deactivated

---

## 16. Verification System

### Verification Badge

A "✅ Verificado" badge displayed on profile cards and profile pages.

### Verification Process

1. Professional uploads identity document (DNI) via their dashboard
2. Professional optionally uploads certification documents (matrícula, habilitación)
3. Documents stored in Supabase Storage (private bucket, admin-only access)
4. Admin reviews documents in the admin panel
5. Admin grants or denies verification
6. If granted, `is_verified = true` on the profile → badge appears

### Document Types Accepted

- DNI (Documento Nacional de Identidad) — front and back
- Matrícula profesional (professional license)
- Habilitación municipal (municipal permit)
- Certificados de capacitación (training certificates)

### Badge Display

- Shown on search result cards
- Shown on profile page header
- Tooltip explaining what "Verificado" means

---

## 17. Favorites System

### Requirements

- **Account required** to save favorites
- No localStorage fallback (must be logged in)

### Features

1. Heart/bookmark icon on search result cards and profile pages
2. Click to add/remove from favorites
3. Dedicated `/favoritos` page listing all saved professionals
4. Filter favorites by category
5. Remove individual favorites

### Implementation

- Optimistic UI updates (instant visual feedback)
- Supabase realtime not needed (simple CRUD)
- RLS ensures users only see their own favorites

---

## 18. Freemium Model & Paid Tier

### Free Tier

| Feature | Limit |
|---|---|
| Profile listing | Yes |
| Profile photo | 1 |
| Work photos | Up to 5 |
| Description | Max 500 chars |
| Neighborhoods | Up to 5 |
| Secondary categories | Up to 2 |
| Certifications | Up to 3 |
| Contact form | Yes |
| WhatsApp link | Yes |
| Reviews | Yes |
| Quote request notifications | 5 per week |
| Search ranking | Standard |

### Paid Tier ("Rapifix Pro")

| Feature | Limit |
|---|---|
| Everything in Free | — |
| Work photos | Up to 20 |
| Description | Max 2000 chars |
| Neighborhoods | Up to 15 |
| Secondary categories | Up to 5 |
| Certifications | Up to 10 |
| Quote request notifications | Unlimited |
| Search ranking | Priority boost (+15% score) |
| "PRO" badge | Yes, displayed on profile |
| Featured in category pages | Top placement |
| Highlighted profile card | Subtle visual distinction in results |

### Pricing (TBD)

- Monthly subscription in ARS (Argentine Pesos)
- Suggested starting price: research competitor pricing in Argentina
- Consider introductory pricing for early adopters

---

## 19. Payments — MercadoPago

### Integration Type

- **MercadoPago Checkout Pro** for one-time payments
- **MercadoPago Subscriptions** for recurring monthly billing

### Supported Payment Methods (via MercadoPago)

- Credit cards (Visa, Mastercard, AMEX)
- Debit cards
- Bank transfer
- Cash payments (Rapipago, Pago Fácil)
- MercadoPago wallet

### Implementation

1. **Upgrade flow**: Professional clicks "Upgrade to Pro" → redirected to MercadoPago checkout → payment processed → webhook confirms → tier updated in database
2. **Webhook endpoint**: `/api/webhooks/mercadopago` — receives payment confirmations, subscription updates, cancellations
3. **Subscription management**: Cancel, pause, or update payment method from professional dashboard
4. **Expiration handling**: Cron job checks `tier_expires_at` daily and downgrades expired profiles to free tier

### Environment Variables

```
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=
```

---

## 20. Notifications

### Email Notifications

Sent via Resend (or Supabase Edge Functions + SMTP provider):

| Event | Recipient | Template |
|---|---|---|
| New contact received | Professional | Name, message, contact details |
| New review received | Professional | Rating, excerpt, link to review |
| Review reply received | Reviewer | Professional's reply, link |
| New quote request match | Professional | Job description, category, neighborhood |
| Account created | User | Welcome email, next steps |
| Profile approved/suspended | Professional | Status change notification |
| Subscription confirmed | Professional | Payment confirmed, tier active |
| Subscription expiring | Professional | Renewal reminder (3 days before) |
| Subscription cancelled | Professional | Confirmation, downgrade info |
| Password reset | User | Reset link |

### Browser Push Notifications

Using the Web Push API with service worker:

| Event | Content |
|---|---|
| New contact | "Nuevo contacto: [Name] necesita un [Category]" |
| New review | "Nueva reseña: ★★★★★ de [Name]" |
| New quote request | "Nueva cotización: [Category] en [Neighborhood]" |

### Notification Preferences

Professionals can toggle each notification type (email and push separately) from their settings page.

---

## 21. Admin Panel

### Access

- Route: `/admin/*`
- Protected by middleware checking `admin` role
- Separate from the public site layout

### Dashboard (`/admin`)

Overview cards:
- Total professionals (active/inactive/suspended)
- Total searchers registered
- Total contacts this month
- Total reviews this month
- Total revenue this month
- Pending reports count
- Recent activity feed

### Admin Pages

#### Users (`/admin/usuarios`)
- List all users (professionals + searchers)
- Search by name, email
- Filter by role, status
- Actions: view profile, suspend, ban, change role, impersonate

#### Profiles (`/admin/perfiles`)
- List all professional profiles
- Search by name, category, neighborhood
- Filter by status (active, inactive, suspended), tier, verification
- Actions: view, edit, suspend, verify, delete
- Bulk actions: suspend selected, verify selected

#### Reviews (`/admin/resenas`)
- List all reviews
- Filter by rating, reported, date range
- Actions: view, hide, delete
- View associated reports

#### Reports (`/admin/reportes`)
- List all reports with status filters
- Details panel with reported content preview
- Actions: dismiss, hide content, warn user, suspend user, ban user
- Add admin notes

#### Categories (`/admin/categorias`)
- CRUD categories
- Reorder (drag and drop)
- View number of professionals per category

#### Neighborhoods (`/admin/barrios`)
- CRUD neighborhoods
- Group by zone
- View number of professionals per neighborhood

#### Blog (`/admin/blog`)
- CRUD blog posts
- Rich text / Markdown editor
- Draft/publish toggle
- SEO fields (meta title, meta description)
- Cover image upload

#### Pages (`/admin/paginas`)
- Edit static pages (About, FAQ, Terms, Privacy, etc.)
- Markdown editor
- SEO fields

#### Settings (`/admin/configuracion`)
- Platform name and description
- Default SEO meta tags
- MercadoPago configuration
- Email sender configuration
- Notification templates
- Ranking algorithm weight adjustments

---

## 22. CMS — Blog & Static Pages

### Blog

**Purpose**: SEO content marketing to drive organic traffic.

**Content Types**:
- Tips articles: "10 cosas a tener en cuenta al contratar un electricista"
- Guides: "Guía completa de plomería para el hogar"
- Seasonal content: "Prepará tu aire acondicionado para el verano"
- Neighborhood spotlights: "Los mejores profesionales en Nueva Córdoba"
- Professional tips: "Cómo conseguir más clientes como profesional independiente"

**Blog Page Features**:
- List of published posts with cover image, title, excerpt, date
- Tag-based filtering
- Pagination
- Related posts at the bottom of each article
- Social sharing buttons
- Structured data (Article schema)

### Static Pages

| Page | Route | Content |
|---|---|---|
| Home | `/` | Hero, search bar, featured categories, top professionals, how it works, CTA |
| How it Works | `/como-funciona` | Step-by-step for both searchers and professionals |
| About Us | `/sobre-nosotros` | Platform mission, team (if applicable) |
| FAQ | `/preguntas-frecuentes` | Accordion-style FAQ for searchers and professionals |
| Terms of Service | `/terminos` | Legal terms for platform usage |
| Privacy Policy | `/privacidad` | Data handling, Ley 25.326 compliance |
| Cookie Policy | `/cookies` | Cookie usage and consent |
| Professional Terms | `/terminos-profesional` | Terms specific to listed professionals |

---

## 23. SEO Strategy

### Technical SEO

1. **Server-side rendering (SSR)** for all public pages via Next.js
2. **Static generation (SSG)** for category and neighborhood landing pages
3. **Dynamic sitemap** at `/sitemap.xml` including:
   - All category pages
   - All neighborhood pages
   - All professional profile pages
   - All blog posts
   - All static pages
4. **robots.txt** allowing all crawlers, blocking admin routes
5. **Canonical URLs** on all pages
6. **Structured data** (JSON-LD):
   - `LocalBusiness` schema on professional profiles
   - `AggregateRating` on profiles with reviews
   - `ItemList` on category and search pages
   - `Article` on blog posts
   - `FAQPage` on FAQ page
   - `BreadcrumbList` on all pages
7. **Open Graph & Twitter Card meta tags** on all pages
8. **Dynamic OG images** generated via `/api/og` (Next.js ImageResponse)

### On-Page SEO

- **Title tags**: Optimized per page type
  - Home: "Rapifix — Encontrá profesionales de confianza en Córdoba"
  - Category: "Mejores Electricistas en Córdoba | Rapifix"
  - Neighborhood: "Profesionales en Nueva Córdoba | Rapifix"
  - Profile: "Juan Pérez — Electricista en Nueva Córdoba | Rapifix"
  - Blog: "[Post Title] | Blog Rapifix"
- **H1 tags**: One per page, keyword-optimized
- **Internal linking**: Category pages link to profiles, blog posts link to categories
- **Alt text**: On all images
- **URL structure**: Clean, descriptive, Spanish-language slugs

### Local SEO

- Target long-tail keywords: "electricista en [barrio] córdoba", "plomero urgente córdoba"
- Category + neighborhood combination pages for high-value intersections
- Google Business Profile for the platform itself (optional)
- NAP consistency (Name, Address, Phone) in structured data

### Content Strategy

- Publish 2-4 blog posts per month
- Target service-related keywords with informational intent
- Include CTAs to search for professionals within articles

---

## 24. Analytics & Tracking

### Google Analytics 4 (GA4)

**Implementation**: Via `@next/third-parties` or manual gtag.js script.

**Key Events to Track**:

| Event | Trigger |
|---|---|
| `search` | User performs a search |
| `search_filter` | User applies a filter |
| `view_profile` | User views a professional profile |
| `click_phone` | User clicks phone number |
| `click_whatsapp` | User clicks WhatsApp button |
| `submit_contact_form` | User submits contact form |
| `submit_quote_request` | User submits quote request |
| `signup_searcher` | Searcher creates account |
| `signup_professional` | Professional creates account |
| `add_favorite` | User saves a favorite |
| `submit_review` | User submits a review |
| `upgrade_click` | Professional clicks upgrade button |
| `upgrade_complete` | Professional completes payment |
| `map_toggle` | User switches to map view |

**Conversions**:
- Contact form submission
- WhatsApp click
- Phone click
- Professional signup
- Paid tier upgrade

### Hotjar

**Implementation**: Hotjar tracking script in `<head>`.

**Features Used**:
- Heatmaps on key pages (home, search, profile)
- Session recordings (sample rate: 10%)
- Feedback widgets (optional)
- Funnel analysis: Search → Profile View → Contact

### Cookie Consent

- Cookie consent banner required (see Legal section)
- Analytics scripts only load after consent is given
- Use a cookie consent library (e.g., `react-cookie-consent`)

---

## 25. Legal & Compliance

### Required Pages

#### Terms of Service (`/terminos`)
- Platform usage rules
- User responsibilities
- Content ownership
- Limitation of liability
- Dispute resolution
- Termination conditions
- Governing law: Argentina

#### Privacy Policy (`/privacidad`)
- Data collected and purpose
- **Ley 25.326 (Protección de Datos Personales)** compliance:
  - Right to access personal data
  - Right to rectification and deletion
  - Consent for data processing
  - Data controller identification
  - Registration with AAIP (Agencia de Acceso a la Información Pública) if required
- Third-party data sharing (MercadoPago, Google Analytics, Hotjar)
- Data retention periods
- Cookie usage

#### Cookie Policy (`/cookies`)
- Types of cookies used:
  - Essential (authentication, session)
  - Analytics (GA4, Hotjar)
  - Functional (language preference)
- How to manage/disable cookies
- Cookie consent mechanism

#### Professional Terms (`/terminos-profesional`)
- Listing requirements
- Content guidelines
- Prohibited conduct
- Platform fees and billing
- Verification process
- Suspension and termination
- Disclaimer: Rapifix does not guarantee professional quality, licensing, or insurance

### Platform Disclaimers

- Rapifix is a directory/marketplace, not an employer
- Rapifix does not verify professional licensing unless explicitly stated
- Rapifix is not responsible for the quality of work performed
- Users hire professionals at their own risk

---

## 26. Design & Branding

### Brand Identity (To Be Created)

| Element | Notes |
|---|---|
| **Name** | Rapifix |
| **Tagline** | "Encontrá al profesional que necesitás" (or similar) |
| **Logo** | Needs design — should work at small sizes (favicon), evoke speed + reliability |
| **Color palette** | TBD — Suggest: primary blue or green (trust/reliability), accent orange or yellow (energy/speed), neutral grays |
| **Typography** | TBD — Suggest: Inter or DM Sans (clean, modern, great for Spanish characters) |
| **Tone of voice** | Friendly, approachable, local. Use "vos" (Argentine Spanish). |

### Suggested Color Palette (Starting Point)

```
Primary:    #2563EB (blue-600) — trust, professionalism
Secondary:  #F59E0B (amber-500) — energy, speed, "rapi" in rapifix
Accent:     #10B981 (emerald-500) — success, verification, availability
Neutral:    #1F2937 (gray-800) — text
Background: #F9FAFB (gray-50) — light background
Error:      #EF4444 (red-500)
```

### UI/UX Principles

1. **Mobile-first**: Design for 375px width first, then scale up
2. **Fast**: Minimal JavaScript, optimized images, skeleton loaders
3. **Accessible**: WCAG 2.1 AA compliance, proper contrast, keyboard navigation
4. **Trust signals**: Verification badges, review counts, and star ratings prominent
5. **Clear CTAs**: "Contactar", "Ver perfil", "Pedir presupuesto" always visible
6. **Minimal friction**: Search works without signup, contact methods one click away

### Key Page Layouts

#### Homepage
```
┌──────────────────────────────────┐
│ [Logo]  Buscar  Soy profesional  │ ← Header
├──────────────────────────────────┤
│                                  │
│   Encontrá al profesional       │ ← Hero
│   que necesitás en Córdoba      │
│                                  │
│   [🔍 Search bar with autocomplete]│
│                                  │
├──────────────────────────────────┤
│ ⚡  🔧  🎨  🧱  🔑  ❄️  ...    │ ← Category icons
├──────────────────────────────────┤
│ ⭐ Profesionales destacados      │ ← Featured pros (paid)
│ [Card] [Card] [Card]            │
├──────────────────────────────────┤
│ 📋 Cómo funciona                │ ← How it works
│ 1. Buscá  2. Compará  3. Contac│
├──────────────────────────────────┤
│ 📝 Últimos artículos            │ ← Blog posts
│ [Post] [Post] [Post]            │
├──────────────────────────────────┤
│ Footer: Links, legal, social    │
└──────────────────────────────────┘
```

#### Search Results (Mobile)
```
┌──────────────────────────────────┐
│ [🔍 Search bar]                  │
│ [Filters]  [Map toggle]         │
├──────────────────────────────────┤
│ 23 resultados para "Electricista"│
│ en "Nueva Córdoba"              │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ [Photo] Juan Pérez  ⭐ 4.8 │  │
│ │ Electricista  •  23 reseñas│  │
│ │ 📍 Nueva Córdoba, Centro   │  │
│ │ 💰 Medio  🔧 12 años      │  │
│ │ ✅ Verificado  ⭐ PRO      │  │
│ │ [WhatsApp] [Llamar] [Ver]  │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ [Next card...]             │  │
│ └────────────────────────────┘  │
└──────────────────────────────────┘
```

---

## 27. Internationalization (i18n)

### Strategy

- **Launch**: Spanish only (Argentine Spanish with "vos" conjugation)
- **Architecture**: Built with `next-intl` from day one so English can be added later
- **URL structure**: `/es/buscar`, `/en/search` (locale prefix)
- **Default locale**: `es` (no prefix for Spanish: `/buscar` instead of `/es/buscar`)

### Translation Files

```
src/lib/i18n/dictionaries/
├── es.json    # Spanish (complete)
└── en.json    # English (placeholder, to be filled later)
```

### What Gets Translated

- All UI labels, buttons, placeholders
- Error messages and validation messages
- Email notification templates
- Static page content (via CMS)
- Blog posts (manual translation)
- Categories and neighborhood names (keep in Spanish even for English UI? TBD)

---

## 28. Social Media Integration

### Profile Sharing

- Share buttons on each professional's profile page:
  - WhatsApp share (huge in Argentina)
  - Facebook share
  - X/Twitter share
  - Copy link
- Pre-filled share text: "Mirá este profesional en Rapifix: [Name] — [Category] en [Neighborhood]"
- Dynamic OG images for rich previews when shared

### Social Login

- Google and Facebook already covered via Supabase Auth (used for sign-up)

### Future Social Features (Post-MVP)

- Instagram feed embed on professional profiles (optional)
- TikTok video embeds for professionals with video content
- Social proof: "Shared X times" counter on profiles
- Professional social media links on their profiles (Instagram, Facebook page, etc.)

---

## 29. Testing Strategy

### E2E Tests (Playwright)

Critical user flows to test:

| Test Suite | Flows Covered |
|---|---|
| `search.spec.ts` | Homepage search, filter application, result display, pagination, map toggle, autocomplete |
| `signup.spec.ts` | Professional registration (email), profile creation, email verification |
| `contact.spec.ts` | Contact form submission, WhatsApp click tracking, phone click tracking |
| `review.spec.ts` | Submit review (with contact prerequisite), star ratings, text validation, professional reply |
| `admin.spec.ts` | Admin login, view reports, moderate profile, manage categories |
| `auth.spec.ts` | Login, logout, password reset, OAuth flows (mocked) |
| `profile.spec.ts` | Profile editing, photo upload, neighborhood selection |
| `payment.spec.ts` | Upgrade flow initiation (MercadoPago redirect), webhook processing |

### Test Environment

- Supabase local development instance (`supabase start`)
- Seed data for testing (test professionals, categories, neighborhoods)
- MercadoPago sandbox for payment testing

### CI/CD

- GitHub Actions workflow:
  1. Lint & type check
  2. Run Playwright tests against preview deploy
  3. Deploy to Vercel (auto on push to `main`)

---

## 30. MVP Phases & Roadmap

### Phase 1: Foundation ✅ COMPLETED

**Goal**: Project setup, database, auth, and basic professional profiles.

**Status**: Completed on 2026-02-11

- [x] Initialize Next.js project with TypeScript, Tailwind, shadcn/ui
- [x] Set up Supabase project (database, auth, storage)
- [x] Create database schema (all tables, RLS policies, indexes)
- [x] Seed data: categories and neighborhoods
- [x] Implement auth (email + Google + Facebook registration/login)
- [x] Professional registration flow + profile creation form
- [x] Professional dashboard: edit profile, upload photos
- [x] Public professional profile page (`/profesional/[slug]`)
- [x] Basic responsive layout (header, footer, navigation)
- [x] i18n setup with `next-intl` (Spanish dictionary)

**Additional Completions**:
- [x] Error handling (error.tsx and loading.tsx for all route groups)
- [x] Toast notifications system (Sonner)
- [x] Type-safe Supabase integration
- [x] Profile completeness calculation
- [x] Contact tracking for all methods (form, WhatsApp, phone)
- [x] Work photos management with tier limits
- [x] SEO metadata and structured data foundation
- [x] All routes stubbed and production build verified

### Phase 2: Search & Discovery (Week 2)

**Goal**: Search, filtering, results display, and contact functionality.

- [ ] Search page (`/buscar`) with card grid layout
- [ ] Autocomplete search bar (categories + neighborhoods)
- [ ] All filters (category, neighborhood, rating, price, availability, experience, photos, certifications)
- [ ] Ranking algorithm implementation (composite score)
- [ ] Map view toggle with Leaflet + OpenStreetMap
- [ ] Category landing pages (`/categorias/[slug]`)
- [ ] Neighborhood landing pages (`/barrios/[slug]`)
- [ ] Contact form on professional profiles
- [ ] WhatsApp + phone click tracking
- [ ] Contact record creation for all contact methods
- [ ] Email notifications for new contacts (via Resend or Edge Functions)
- [ ] Homepage: hero, search bar, category icons, featured professionals

### Phase 3: Reviews, Favorites & Polish (Week 3)

**Goal**: Review system, favorites, quote requests, SEO, and launch prep.

- [ ] Review submission form (stars + aspects + text)
- [ ] Review eligibility verification (contact record check)
- [ ] Review display on profiles (list, averages, aspect breakdown)
- [ ] Professional reply to reviews
- [ ] Reporting/flagging system (profiles, reviews, photos)
- [ ] Favorites system (add/remove, favorites page)
- [ ] Quote request form and matching system
- [ ] Basic admin panel (users, profiles, reviews, reports, categories)
- [ ] SEO: meta tags, structured data, sitemap, robots.txt
- [ ] Legal pages (Terms, Privacy, Cookies, Professional Terms)
- [ ] Static pages (How it Works, About, FAQ)
- [ ] Google Analytics 4 + Hotjar integration
- [ ] Cookie consent banner
- [ ] Browser push notification setup
- [ ] Playwright E2E tests for critical flows
- [ ] Performance optimization (image optimization, lazy loading)
- [ ] Responsive design QA across devices

### Phase 4: Post-MVP (Weeks 4+)

- [ ] MercadoPago integration (paid tier, subscriptions)
- [ ] CMS blog system in admin panel
- [ ] Blog posts (initial SEO content)
- [ ] Dynamic OG image generation
- [ ] Advanced admin panel features (analytics dashboard, bulk actions)
- [ ] Social sharing buttons on profiles
- [ ] Notification preferences page
- [ ] Professional onboarding improvements
- [ ] Verification badge system (document upload + admin review)
- [ ] Performance monitoring and optimization
- [ ] Accessibility audit and fixes
- [ ] English translation (i18n)
- [ ] Multi-city expansion architecture

---

## 31. Future Expansion

### Multi-City Architecture

The platform is designed for expansion beyond Córdoba:

1. **Database**: Add a `city_id` foreign key to `profiles` and `neighborhoods` tables
2. **Cities table**: `id`, `name`, `slug`, `province`, `lat`, `lng`, `is_active`
3. **URL structure**: `/cordoba/buscar`, `/rosario/buscar`, `/mendoza/buscar`
4. **Subdomain option**: `cordoba.rapifix.com`, `rosario.rapifix.com`
5. **City selector**: Homepage or header dropdown to switch cities
6. **SEO**: City-specific landing pages and meta tags

### Potential Future Features

- **Mobile app**: React Native or Flutter app for professionals (manage profile, respond to contacts)
- **In-app messaging**: Real-time chat between searchers and professionals
- **Job booking**: Full booking system with calendar, scheduling, and payment
- **Professional portfolio**: Before/after photo galleries, video testimonials
- **AI-powered matching**: Natural language job description → automatic professional matching
- **Professional analytics**: Dashboard with views, contacts, conversion rates
- **Referral program**: Professionals refer other professionals for rewards
- **Emergency/urgent services**: Priority listing for urgent needs (24/7 plumber, locksmith)
- **Price estimation**: AI-based price estimates for common services
- **Insurance verification**: Integration with insurance providers
- **Background checks**: Partner with background check services

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@rapifix.com

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_HOTJAR_ID=

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# App
NEXT_PUBLIC_APP_URL=https://rapifix.com
NEXT_PUBLIC_APP_NAME=Rapifix
```

---

*This document serves as the complete specification for Rapifix. All decisions captured here were made collaboratively and should be referenced during implementation.*
