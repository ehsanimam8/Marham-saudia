-- ==========================================
-- MANUAL FIX PART 2: NURSE CONSULTATIONS
-- ==========================================
-- Copy and paste this into the Supabase SQL Editor and run it.

-- 1. Create Nurse Consultations Status Enum
DO $$ BEGIN
    CREATE TYPE nurse_consultation_status AS ENUM (
      'requested', 'scheduled', 'completed', 'cancelled', 'no_show'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Create Nurse Consultations Table
CREATE TABLE IF NOT EXISTS nurse_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_session_id UUID REFERENCES onboarding_sessions(id),
  requested_datetime TIMESTAMPTZ NOT NULL,
  scheduled_datetime TIMESTAMPTZ,
  completed_datetime TIMESTAMPTZ,
  nurse_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nurse_name VARCHAR(255),
  patient_phone VARCHAR(20) NOT NULL,
  patient_email VARCHAR(255),
  preferred_language VARCHAR(10) DEFAULT 'ar',
  patient_concerns TEXT,
  nurse_notes TEXT,
  recommended_next_steps TEXT,
  status nurse_consultation_status DEFAULT 'requested',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nurse_consults_patient ON nurse_consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_nurse_consults_status ON nurse_consultations(status);

-- 3. Reload Schema Cache for everything
NOTIFY pgrst, 'reload config';

SELECT 'Nurse Consultations fixed' as status;
