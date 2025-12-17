-- ==========================================
-- MANUAL FIX: RE-RUN ONBOARDING SCHEMA
-- ==========================================
-- Copy and paste this ENTIRE file into the Supabase SQL Editor and run it.

-- 1. Ensure Types exist
DO $$ BEGIN
    CREATE TYPE concern_category AS ENUM (
      'irregular_periods', 'pcos', 'fertility', 'pregnancy', 'weight_management', 
      'digestive_issues', 'pain', 'aesthetic_enhancement', 'mental_health', 'other'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('not_urgent', 'moderate', 'urgent', 'very_urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Create Onboarding Sessions Table
CREATE TABLE IF NOT EXISTS onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE,
  body_part VARCHAR(50) NOT NULL,
  primary_concern concern_category, -- Nullable
  symptoms_selected TEXT[],
  age_range VARCHAR(20),
  previous_diagnosis BOOLEAN,
  urgency urgency_level,
  priority_experience INTEGER CHECK (priority_experience BETWEEN 1 AND 5),
  priority_price INTEGER CHECK (priority_price BETWEEN 1 AND 5),
  priority_speed INTEGER CHECK (priority_speed BETWEEN 1 AND 5),
  priority_hospital INTEGER CHECK (priority_hospital BETWEEN 1 AND 5),
  priority_location INTEGER CHECK (priority_location BETWEEN 1 AND 5),
  scheduled_nurse_call BOOLEAN DEFAULT FALSE,
  nurse_call_datetime TIMESTAMPTZ,
  downloaded_health_profile BOOLEAN DEFAULT FALSE,
  documents_uploaded INTEGER DEFAULT 0,
  discount_unlocked BOOLEAN DEFAULT FALSE,
  matched_doctor_ids UUID[],
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_patient ON onboarding_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_session_token ON onboarding_sessions(session_token);

-- 3. Force Schema Cache Reload
NOTIFY pgrst, 'reload config';

-- 4. Verify (Optional output)
SELECT 'Table onboarding_sessions created/verified' as status;
