-- Create ENUMs
DO $$ BEGIN
    CREATE TYPE concern_category AS ENUM (
      'irregular_periods',
      'pcos',
      'fertility',
      'pregnancy',
      'weight_management',
      'digestive_issues',
      'pain',
      'aesthetic_enhancement',
      'mental_health',
      'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM (
      'not_urgent',      -- Can wait weeks
      'moderate',        -- Need help within 1-2 weeks
      'urgent',          -- Need help within days
      'very_urgent'      -- Need help immediately
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table: onboarding_sessions
CREATE TABLE IF NOT EXISTS onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User identification
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE,  -- For anonymous users
  
  -- Onboarding data
  body_part VARCHAR(50) NOT NULL,
  primary_concern concern_category NOT NULL,
  symptoms_selected TEXT[],
  
  -- Contextual data
  age_range VARCHAR(20),
  previous_diagnosis BOOLEAN,
  urgency urgency_level,
  
  -- Priority ranking (1=highest, 5=lowest)
  priority_experience INTEGER CHECK (priority_experience BETWEEN 1 AND 5),
  priority_price INTEGER CHECK (priority_price BETWEEN 1 AND 5),
  priority_speed INTEGER CHECK (priority_speed BETWEEN 1 AND 5),
  priority_hospital INTEGER CHECK (priority_hospital BETWEEN 1 AND 5),
  priority_location INTEGER CHECK (priority_location BETWEEN 1 AND 5),
  
  -- Free offerings engagement
  scheduled_nurse_call BOOLEAN DEFAULT FALSE,
  nurse_call_datetime TIMESTAMPTZ,
  downloaded_health_profile BOOLEAN DEFAULT FALSE,
  
  -- Document upload status
  documents_uploaded INTEGER DEFAULT 0,
  discount_unlocked BOOLEAN DEFAULT FALSE,
  
  -- Matching results
  matched_doctor_ids UUID[],  -- Array of doctor IDs
  
  -- Metadata
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for onboarding_sessions
CREATE INDEX IF NOT EXISTS idx_onboarding_patient ON onboarding_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_session_token ON onboarding_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_onboarding_body_part ON onboarding_sessions(body_part);
CREATE INDEX IF NOT EXISTS idx_onboarding_completed ON onboarding_sessions(completed);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for onboarding_sessions
DROP TRIGGER IF EXISTS update_onboarding_timestamp ON onboarding_sessions;
CREATE TRIGGER update_onboarding_timestamp
BEFORE UPDATE ON onboarding_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Table: medical_documents
DO $$ BEGIN
    CREATE TYPE document_type AS ENUM (
      'lab_result',
      'prescription',
      'imaging',
      'diagnosis',
      'surgical_record',
      'allergy_record',
      'vaccination',
      'insurance',
      'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_session_id UUID REFERENCES onboarding_sessions(id) ON DELETE SET NULL,
  
  -- File information
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  
  -- Document metadata
  document_type document_type NOT NULL,
  document_date DATE,
  notes TEXT,
  
  -- OCR/AI processing
  extracted_text TEXT,
  ai_summary TEXT,
  processed BOOLEAN DEFAULT FALSE,
  
  -- Sharing & visibility
  visible_to_doctors BOOLEAN DEFAULT TRUE,
  shared_with_doctor_ids UUID[],
  
  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for medical_documents
CREATE INDEX IF NOT EXISTS idx_medical_docs_patient ON medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_docs_session ON medical_documents(onboarding_session_id);
CREATE INDEX IF NOT EXISTS idx_medical_docs_type ON medical_documents(document_type);

-- RLS for medical_documents
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own documents" ON medical_documents;
CREATE POLICY "Users can view own documents"
ON medical_documents FOR SELECT
USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Users can upload own documents" ON medical_documents;
CREATE POLICY "Users can upload own documents"
ON medical_documents FOR INSERT
WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON medical_documents;
CREATE POLICY "Users can delete own documents"
ON medical_documents FOR DELETE
USING (auth.uid() = patient_id);

-- Trigger to update onboarding session document count
CREATE OR REPLACE FUNCTION update_onboarding_document_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update document count in onboarding session
  UPDATE onboarding_sessions
  SET 
    documents_uploaded = (
      SELECT COUNT(*) 
      FROM medical_documents 
      WHERE onboarding_session_id = NEW.onboarding_session_id
    ),
    discount_unlocked = (
      SELECT COUNT(*) >= 3
      FROM medical_documents 
      WHERE onboarding_session_id = NEW.onboarding_session_id
    ),
    updated_at = NOW()
  WHERE id = NEW.onboarding_session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_doc_count_on_upload ON medical_documents;
CREATE TRIGGER update_doc_count_on_upload
AFTER INSERT ON medical_documents
FOR EACH ROW
WHEN (NEW.onboarding_session_id IS NOT NULL)
EXECUTE FUNCTION update_onboarding_document_count();


-- Table: nurse_consultations
DO $$ BEGIN
    CREATE TYPE nurse_consultation_status AS ENUM (
      'requested',
      'scheduled',
      'completed',
      'cancelled',
      'no_show'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS nurse_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_session_id UUID REFERENCES onboarding_sessions(id),
  
  -- Scheduling
  requested_datetime TIMESTAMPTZ NOT NULL,
  scheduled_datetime TIMESTAMPTZ,
  completed_datetime TIMESTAMPTZ,
  
  -- Nurse assignment
  nurse_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nurse_name VARCHAR(255),
  
  -- Contact info
  patient_phone VARCHAR(20) NOT NULL,
  patient_email VARCHAR(255),
  preferred_language VARCHAR(10) DEFAULT 'ar',
  
  -- Notes
  patient_concerns TEXT,
  nurse_notes TEXT,
  recommended_next_steps TEXT,
  
  -- Status
  status nurse_consultation_status DEFAULT 'requested',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for nurse_consultations
CREATE INDEX IF NOT EXISTS idx_nurse_consults_patient ON nurse_consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_nurse_consults_status ON nurse_consultations(status);
CREATE INDEX IF NOT EXISTS idx_nurse_consults_scheduled ON nurse_consultations(scheduled_datetime);


-- Updates to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness BETWEEN 0 AND 100);

CREATE INDEX IF NOT EXISTS idx_patients_onboarding ON patients(onboarding_completed);

-- Updates to doctors table
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS accepts_new_patients BOOLEAN DEFAULT TRUE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS min_age_patients INTEGER;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS max_age_patients INTEGER;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS priority_matching_tags TEXT[];


-- Storage bucket setup (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
-- Using DROP POLICY IF EXISTS to avoid errors if they already exist
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'medical-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'medical-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'medical-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
