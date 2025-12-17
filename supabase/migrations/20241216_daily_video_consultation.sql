-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add new columns to appointments table for Daily.co
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS daily_room_url TEXT,
ADD COLUMN IF NOT EXISTS daily_room_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS daily_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS consultation_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS consultation_ended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS consultation_duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS recording_url TEXT,
ADD COLUMN IF NOT EXISTS transcription_text TEXT,
ADD COLUMN IF NOT EXISTS pre_consultation_completed BOOLEAN DEFAULT FALSE;

-- Create pre_consultation_data table (same as before)
CREATE TABLE IF NOT EXISTS pre_consultation_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  
  -- Patient Information
  current_symptoms TEXT,
  symptom_duration TEXT,
  severity_level VARCHAR(20),
  previous_similar_episodes BOOLEAN,
  
  -- Medical History Questions
  current_medications TEXT[], 
  allergies TEXT[],
  chronic_conditions TEXT[],
  recent_surgeries TEXT,
  family_medical_history TEXT,
  
  -- Lifestyle Factors
  sleep_hours INTEGER,
  stress_level VARCHAR(20),
  exercise_frequency VARCHAR(50),
  diet_notes TEXT,
  
  -- Uploads (Metadata)
  uploaded_files JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create consultation_notes table
CREATE TABLE IF NOT EXISTS consultation_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  
  -- Real-time notes
  notes TEXT,
  observations TEXT,
  
  -- Post-consultation
  diagnosis TEXT,
  treatment_plan TEXT,
  prescription JSONB,
  follow_up_needed BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  referral_needed BOOLEAN DEFAULT FALSE,
  referral_to VARCHAR(255),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create consultation_files table
CREATE TABLE IF NOT EXISTS consultation_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id),
  
  file_name VARCHAR(255),
  file_type VARCHAR(50),
  file_url TEXT,
  file_size INTEGER, 
  upload_source VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_daily_room ON appointments(daily_room_name);
CREATE INDEX IF NOT EXISTS idx_pre_consultation_appointment ON pre_consultation_data(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consultation_notes_appointment ON consultation_notes(appointment_id);

-- Enable RLS
ALTER TABLE pre_consultation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_files ENABLE ROW LEVEL SECURITY;

-- Simple Policies
CREATE POLICY "Authenticated users can read pre_consultation_data" ON pre_consultation_data
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read consultation_notes" ON consultation_notes
    FOR ALL USING (auth.role() = 'authenticated');
    
CREATE POLICY "Authenticated users can read consultation_files" ON consultation_files
    FOR ALL USING (auth.role() = 'authenticated');
