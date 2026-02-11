-- ============================================================
-- Security Hardening Migration
-- Fixes identified in security audit (2026-02-11)
-- ============================================================

-- 1. CRITICAL: Harden handle_new_user trigger to prevent role escalation
-- Only allow 'searcher' or 'professional' roles from user_metadata.
-- Never allow 'admin' to be self-assigned during signup.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  requested_role text;
  safe_role user_role;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';

  -- Whitelist: only 'searcher' and 'professional' are allowed from signup
  IF requested_role IN ('searcher', 'professional') THEN
    safe_role := requested_role::user_role;
  ELSE
    safe_role := 'searcher';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, safe_role);

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. HIGH: Restrict reviews_owner_reply to only allow updating reply fields
-- Drop the old permissive policy
DROP POLICY IF EXISTS "reviews_owner_reply" ON reviews;

-- Create a function that only allows updating the reply columns
CREATE OR REPLACE FUNCTION update_review_reply(
  p_review_id uuid,
  p_reply text
)
RETURNS void AS $$
BEGIN
  UPDATE reviews
  SET
    professional_reply = p_reply,
    professional_reply_at = NOW()
  WHERE id = p_review_id
    AND profile_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. MEDIUM: Fix reports policy to actually require authentication
DROP POLICY IF EXISTS "reports_authenticated_insert" ON reports;
CREATE POLICY "reports_authenticated_insert" ON reports
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND reporter_id = auth.uid()
  );

-- 4. MEDIUM: Tighten quote_requests to require at minimum an email
-- (keeping anonymous access but requiring non-null contact info is enforced by NOT NULL columns)
-- We add a check that user_id is set if authenticated
DROP POLICY IF EXISTS "quote_requests_anyone_insert" ON quote_requests;
CREATE POLICY "quote_requests_insert" ON quote_requests
  FOR INSERT WITH CHECK (
    CASE
      WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
      ELSE user_id IS NULL
    END
  );
