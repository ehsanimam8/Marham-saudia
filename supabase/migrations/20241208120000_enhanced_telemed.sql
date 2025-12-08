-- ============================================
-- MARHAM SAUDI - ENHANCED TELEMEDICINE SCHEMA
-- ============================================

-- 0. Storage Bucket Setup
-- Create 'medical-files' bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-files', 'medical-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- (We'll use DO blocks to avoid errors if policies exist)
DO $$ BEGIN
    CREATE POLICY "Public Access to Medical Files" ON storage.objects FOR SELECT USING (bucket_id = 'medical-files');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated Users Upload" ON storage.objects FOR INSERT WITH CHECK (
        bucket_id = 'medical-files' AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Patient Medical Records (EMR)
CREATE TABLE IF NOT EXISTS patient_medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  blood_type VARCHAR(5),
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  allergies TEXT[],
  chronic_conditions TEXT[],
  current_medications TEXT[],
  
  -- Medical History
  past_surgeries JSONB,
  family_history JSONB,
  
  -- Women's Health Specific
  last_menstrual_period DATE,
  pregnancy_history JSONB,
  contraception_method VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(patient_id)
);

-- 2. Medical Documents
CREATE TABLE IF NOT EXISTS medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  document_type VARCHAR(50), 
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size_bytes INTEGER,
  file_type VARCHAR(50),
  
  test_date DATE,
  uploaded_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medical_docs_patient ON medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_docs_type ON medical_documents(document_type);

-- 3. Consultation Intake Forms
CREATE TABLE IF NOT EXISTS consultation_intake_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  chief_complaint TEXT NOT NULL,
  symptoms_duration VARCHAR(50),
  severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 10),
  
  current_symptoms JSONB,
  symptom_details TEXT,
  
  tried_medications TEXT[],
  previous_consultations_for_issue INTEGER,
  
  is_pregnant BOOLEAN,
  is_breastfeeding BOOLEAN,
  menstrual_concerns BOOLEAN,
  menstrual_details TEXT,
  
  consent_share_medical_records BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  
  uploaded_document_ids UUID[],
  
  is_complete BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(appointment_id)
);

-- 4. Consultation Notes
CREATE TABLE IF NOT EXISTS consultation_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  subjective_notes TEXT,
  objective_findings TEXT,
  
  diagnosis TEXT,
  differential_diagnosis TEXT[],
  
  treatment_plan TEXT,
  lifestyle_recommendations TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_timeframe VARCHAR(50),
  
  referral_needed BOOLEAN DEFAULT false,
  referral_to VARCHAR(200),
  referral_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(appointment_id)
);

-- 5. Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_note_id UUID REFERENCES consultation_notes(id) ON DELETE CASCADE,
  
  prescription_number VARCHAR(50) UNIQUE,
  
  medications JSONB NOT NULL,
  
  general_instructions TEXT,
  warnings TEXT,
  
  issued_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  
  doctor_signature_url TEXT,
  prescription_pdf_url TEXT,
  
  status VARCHAR(20) DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Consultation Session Logs
CREATE TABLE IF NOT EXISTS consultation_session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  
  session_started_at TIMESTAMPTZ,
  session_ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  
  patient_joined_at TIMESTAMPTZ,
  doctor_joined_at TIMESTAMPTZ,
  patient_left_at TIMESTAMPTZ,
  doctor_left_at TIMESTAMPTZ,
  
  video_room_id VARCHAR(200),
  connection_quality VARCHAR(20),
  technical_issues JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intake_forms_appointment ON consultation_intake_forms(appointment_id);
CREATE INDEX IF NOT EXISTS idx_intake_forms_patient ON consultation_intake_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultation_notes_appointment ON consultation_notes(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consultation_notes_doctor ON consultation_notes(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment ON prescriptions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_number ON prescriptions(prescription_number);

-- RLS Policies
ALTER TABLE patient_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_session_logs ENABLE ROW LEVEL SECURITY;

-- Note: We assume auth.uid() matches id in auth.users and policies use that.
-- We will use 'DO $$ BEGIN ... EXCEPTION ... END $$' blocks to avoid errors if policies exist.

-- Patient Medical Records Policies
DO $$ BEGIN
  CREATE POLICY "Patients can view own medical records" ON patient_medical_records FOR SELECT USING (auth.uid() = patient_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Patients can update own medical records" ON patient_medical_records FOR UPDATE USING (auth.uid() = patient_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Doctors can view patient records with consent" ON patient_medical_records FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM consultation_intake_forms cif
      JOIN appointments a ON a.id = cif.appointment_id
      WHERE cif.patient_id = patient_medical_records.patient_id
        AND a.doctor_id = auth.uid()
        AND cif.consent_share_medical_records = true
    )
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Medical Documents Policies
DO $$ BEGIN
  CREATE POLICY "Patients can manage own documents" ON medical_documents FOR ALL USING (auth.uid() = patient_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Doctors can view patient documents with consent" ON medical_documents FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM consultation_intake_forms cif
      JOIN appointments a ON a.id = cif.appointment_id
      WHERE cif.patient_id = medical_documents.patient_id
        AND a.doctor_id = auth.uid()
        AND cif.consent_share_medical_records = true
    )
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Intake Forms Policies
DO $$ BEGIN
  CREATE POLICY "Patients can manage own intake forms" ON consultation_intake_forms FOR ALL USING (auth.uid() = patient_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Doctors can view intake forms for their appointments" ON consultation_intake_forms FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = consultation_intake_forms.appointment_id
        AND appointments.doctor_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Consultation Notes Policies
DO $$ BEGIN
  CREATE POLICY "Doctors can manage consultation notes" ON consultation_notes FOR ALL USING (auth.uid() = doctor_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Patients can view their consultation notes" ON consultation_notes FOR SELECT USING (auth.uid() = patient_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Prescriptions Policies
DO $$ BEGIN
  CREATE POLICY "Doctors can manage prescriptions" ON prescriptions FOR ALL USING (auth.uid() = doctor_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Patients can view their prescriptions" ON prescriptions FOR SELECT USING (auth.uid() = patient_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Session Logs Policies
DO $$ BEGIN
  CREATE POLICY "Doctors and patients can view session logs" ON consultation_session_logs FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = consultation_session_logs.appointment_id
        AND (appointments.doctor_id = auth.uid() OR appointments.patient_id = (SELECT id FROM patients WHERE profile_id = auth.uid())) 
        -- Note: appointments.patient_id refers to patients table ID, not auth ID.
        -- Wait, existing schema says appointments.patient_id -> patients(id).
        -- But spec used `auth.uid()`.
        -- We need to check if appointments.patient_id matches `auth.uid()` via patients table.
        -- Correct logic:
        -- appointments.patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    )
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Triggers for timestamps
-- (Assuming update_updated_at_column exists from initial schema)

DROP TRIGGER IF EXISTS update_patient_medical_records_updated_at ON patient_medical_records;
CREATE TRIGGER update_patient_medical_records_updated_at BEFORE UPDATE ON patient_medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultation_intake_forms_updated_at ON consultation_intake_forms;
CREATE TRIGGER update_consultation_intake_forms_updated_at BEFORE UPDATE ON consultation_intake_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultation_notes_updated_at ON consultation_notes;
CREATE TRIGGER update_consultation_notes_updated_at BEFORE UPDATE ON consultation_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prescriptions_updated_at ON prescriptions;
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sequence for prescription number if not exists
CREATE SEQUENCE IF NOT EXISTS prescription_number_seq START 1;

-- Function for prescription number
CREATE OR REPLACE FUNCTION generate_prescription_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.prescription_number IS NULL THEN
    NEW.prescription_number := 'PRX-' || 
      TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
      LPAD(NEXTVAL('prescription_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_prescription_number_trigger ON prescriptions;
CREATE TRIGGER generate_prescription_number_trigger BEFORE INSERT ON prescriptions FOR EACH ROW EXECUTE FUNCTION generate_prescription_number();
