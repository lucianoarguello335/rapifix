-- ============================================================
-- Rapifix Initial Schema
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE availability_status AS ENUM ('available', 'busy', 'unavailable');
CREATE TYPE price_range AS ENUM ('low', 'medium', 'high', 'premium');
CREATE TYPE tier_type AS ENUM ('free', 'paid');
CREATE TYPE contact_method AS ENUM ('form', 'whatsapp', 'phone');
CREATE TYPE quote_status AS ENUM ('open', 'matched', 'closed');
CREATE TYPE quote_response AS ENUM ('interested', 'declined');
CREATE TYPE report_target_type AS ENUM ('profile', 'review', 'photo');
CREATE TYPE report_reason AS ENUM ('spam', 'fake', 'inappropriate', 'offensive', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');
CREATE TYPE blog_status AS ENUM ('draft', 'published');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
CREATE TYPE user_role AS ENUM ('searcher', 'professional', 'admin');

-- ============================================================
-- TABLES
-- ============================================================

-- User roles table
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'searcher',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Neighborhoods
CREATE TABLE neighborhoods (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  zone text NOT NULL,
  lat double precision,
  lng double precision,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Professional profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  email text NOT NULL,
  description text,
  category_id int REFERENCES categories(id),
  profile_photo_url text,
  years_experience int,
  availability availability_status DEFAULT 'available',
  price_range price_range,
  price_description text,
  certifications text[] DEFAULT '{}',
  certification_docs text[] DEFAULT '{}',
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  is_suspended boolean NOT NULL DEFAULT false,
  tier tier_type NOT NULL DEFAULT 'free',
  tier_expires_at timestamptz,
  profile_completeness int NOT NULL DEFAULT 0,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Profile neighborhoods (many-to-many)
CREATE TABLE profile_neighborhoods (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  neighborhood_id int NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, neighborhood_id)
);

-- Profile secondary categories
CREATE TABLE profile_secondary_categories (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id int NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, category_id)
);

-- Work photos gallery
CREATE TABLE work_photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id uuid,
  rating_overall int NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_punctuality int CHECK (rating_punctuality BETWEEN 1 AND 5),
  rating_quality int CHECK (rating_quality BETWEEN 1 AND 5),
  rating_price int CHECK (rating_price BETWEEN 1 AND 5),
  rating_communication int CHECK (rating_communication BETWEEN 1 AND 5),
  comment text,
  professional_reply text,
  professional_reply_at timestamptz,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Contacts
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  searcher_name text NOT NULL,
  searcher_email text NOT NULL,
  searcher_phone text,
  message text,
  contact_method contact_method NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Quote requests
CREATE TABLE quote_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id int NOT NULL REFERENCES categories(id),
  neighborhood_id int NOT NULL REFERENCES neighborhoods(id),
  description text NOT NULL,
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  requester_phone text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status quote_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Quote request matches
CREATE TABLE quote_request_matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_request_id uuid NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notified_at timestamptz,
  responded_at timestamptz,
  response quote_response
);

-- Favorites
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, profile_id)
);

-- Reports
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type report_target_type NOT NULL,
  target_id uuid NOT NULL,
  reason report_reason NOT NULL,
  description text,
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Blog posts
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status blog_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  meta_title text,
  meta_description text,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Static pages
CREATE TABLE static_pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  meta_title text,
  meta_description text,
  is_published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mercadopago_subscription_id text,
  mercadopago_payer_id text,
  status subscription_status NOT NULL DEFAULT 'pending',
  plan_amount decimal(10, 2),
  currency text NOT NULL DEFAULT 'ARS',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Notification preferences
CREATE TABLE notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_contacts boolean NOT NULL DEFAULT true,
  email_reviews boolean NOT NULL DEFAULT true,
  email_quotes boolean NOT NULL DEFAULT true,
  push_contacts boolean NOT NULL DEFAULT true,
  push_reviews boolean NOT NULL DEFAULT true,
  push_quotes boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

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

-- Full-text search (Spanish config)
CREATE INDEX idx_profiles_search ON profiles USING gin(
  to_tsvector('spanish', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(description, ''))
);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Generate profile slug
CREATE OR REPLACE FUNCTION generate_profile_slug(
  p_first_name text,
  p_last_name text,
  p_category_slug text,
  p_neighborhood_slug text
) RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter int := 0;
BEGIN
  base_slug := lower(
    unaccent(p_first_name) || '-' ||
    unaccent(p_last_name) || '-' ||
    p_category_slug || '-' ||
    p_neighborhood_slug
  );
  -- Replace spaces and special chars with hyphens
  base_slug := regexp_replace(base_slug, '[^a-z0-9-]', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  final_slug := base_slug;

  -- Deduplicate
  WHILE EXISTS (SELECT 1 FROM profiles WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Calculate profile completeness score
CREATE OR REPLACE FUNCTION calculate_profile_completeness(p_profile_id uuid)
RETURNS int AS $$
DECLARE
  score int := 0;
  photo_count int;
  neighborhood_count int;
  p profiles%ROWTYPE;
BEGIN
  SELECT * INTO p FROM profiles WHERE id = p_profile_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Profile photo: 15 points
  IF p.profile_photo_url IS NOT NULL AND p.profile_photo_url != '' THEN
    score := score + 15;
  END IF;

  -- Description (min 100 chars): 15 points
  IF p.description IS NOT NULL AND length(p.description) >= 100 THEN
    score := score + 15;
  END IF;

  -- Phone + WhatsApp: 10 points
  IF p.phone IS NOT NULL AND p.phone != '' THEN
    score := score + 5;
  END IF;
  IF p.whatsapp IS NOT NULL AND p.whatsapp != '' THEN
    score := score + 5;
  END IF;

  -- At least 3 neighborhoods: 10 points
  SELECT count(*) INTO neighborhood_count
  FROM profile_neighborhoods WHERE profile_id = p_profile_id;
  IF neighborhood_count >= 3 THEN
    score := score + 10;
  ELSIF neighborhood_count >= 1 THEN
    score := score + 5;
  END IF;

  -- At least 3 work photos: 15 points
  SELECT count(*) INTO photo_count
  FROM work_photos WHERE profile_id = p_profile_id;
  IF photo_count >= 3 THEN
    score := score + 15;
  ELSIF photo_count >= 1 THEN
    score := score + 7;
  END IF;

  -- At least 1 certification: 10 points
  IF array_length(p.certifications, 1) > 0 THEN
    score := score + 10;
  END IF;

  -- Years of experience: 5 points
  IF p.years_experience IS NOT NULL THEN
    score := score + 5;
  END IF;

  -- Availability set: 5 points
  IF p.availability IS NOT NULL THEN
    score := score + 5;
  END IF;

  -- Price range set: 5 points
  IF p.price_range IS NOT NULL THEN
    score := score + 5;
  END IF;

  -- Price description: 5 points
  IF p.price_description IS NOT NULL AND p.price_description != '' THEN
    score := score + 5;
  END IF;

  -- Secondary category: 5 points
  IF EXISTS (SELECT 1 FROM profile_secondary_categories WHERE profile_id = p_profile_id) THEN
    score := score + 5;
  END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user_roles on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'searcher'
    )
  );

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_secondary_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_request_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Neighborhoods: public read
CREATE POLICY "neighborhoods_public_read" ON neighborhoods
  FOR SELECT USING (is_active = true);

CREATE POLICY "neighborhoods_admin_all" ON neighborhoods
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Profiles: public read active profiles, owner can update
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (is_active = true AND is_suspended = false);

CREATE POLICY "profiles_owner_read" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_owner_insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_owner_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- User roles: user can read own, admin can manage
CREATE POLICY "user_roles_own_read" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_roles_admin_all" ON user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Profile neighborhoods
CREATE POLICY "profile_neighborhoods_public_read" ON profile_neighborhoods
  FOR SELECT USING (true);

CREATE POLICY "profile_neighborhoods_owner_manage" ON profile_neighborhoods
  FOR ALL USING (profile_id = auth.uid());

-- Profile secondary categories
CREATE POLICY "profile_secondary_categories_public_read" ON profile_secondary_categories
  FOR SELECT USING (true);

CREATE POLICY "profile_secondary_categories_owner_manage" ON profile_secondary_categories
  FOR ALL USING (profile_id = auth.uid());

-- Work photos: public read, owner manage
CREATE POLICY "work_photos_public_read" ON work_photos
  FOR SELECT USING (true);

CREATE POLICY "work_photos_owner_manage" ON work_photos
  FOR ALL USING (profile_id = auth.uid());

-- Reviews: public read visible, authenticated insert, owner reply
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (is_visible = true);

CREATE POLICY "reviews_authenticated_insert" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "reviews_owner_reply" ON reviews
  FOR UPDATE USING (
    profile_id = auth.uid()
  );

CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Contacts: profile owner reads, anyone can insert
CREATE POLICY "contacts_anyone_insert" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contacts_owner_read" ON contacts
  FOR SELECT USING (
    profile_id = auth.uid()
    OR user_id = auth.uid()
  );

CREATE POLICY "contacts_owner_update" ON contacts
  FOR UPDATE USING (profile_id = auth.uid());

-- Favorites: user manages own
CREATE POLICY "favorites_own_select" ON favorites
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "favorites_own_insert" ON favorites
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_own_delete" ON favorites
  FOR DELETE USING (user_id = auth.uid());

-- Quote requests
CREATE POLICY "quote_requests_anyone_insert" ON quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quote_requests_own_read" ON quote_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "quote_requests_admin_all" ON quote_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Quote request matches
CREATE POLICY "quote_request_matches_pro_read" ON quote_request_matches
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "quote_request_matches_pro_update" ON quote_request_matches
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "quote_request_matches_admin_all" ON quote_request_matches
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Reports
CREATE POLICY "reports_authenticated_insert" ON reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "reports_admin_all" ON reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Blog posts: public read published, admin manage
CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "blog_posts_admin_all" ON blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Static pages: public read published
CREATE POLICY "static_pages_public_read" ON static_pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "static_pages_admin_all" ON static_pages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Subscriptions: owner read, admin manage
CREATE POLICY "subscriptions_owner_read" ON subscriptions
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "subscriptions_admin_all" ON subscriptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Notification preferences: user manages own
CREATE POLICY "notification_prefs_own" ON notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- STORAGE BUCKETS (must be created via Supabase dashboard or API)
-- These are documented here for reference:
-- - profile-photos (public)
-- - work-photos (public)
-- - certifications (private)
-- ============================================================
