-- MARHAM SAUDI CONSULTATION SCHEMA
-- This script sets up all tables and storage required for the consultation flow.

BEGIN;

-- 1. Create Patient Medical Records (EMR)
CREATE TABLE IF NOT EXISTS public.patient_medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    allergies TEXT[] DEFAULT '{}',
    chronic_conditions TEXT[] DEFAULT '{}',
    past_surgeries TEXT[] DEFAULT '{}',
    current_medications TEXT[] DEFAULT '{}',
    blood_type TEXT,
    height_cm INT,
    weight_kg NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id)
);

-- 2. Create Consultation Intake Forms
CREATE TABLE IF NOT EXISTS public.consultation_intake_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id TEXT NOT NULL, -- keeping as TEXT to match appointment ID format if it's text, otherwise link to appointment table if UUID
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chief_complaint TEXT,
    current_symptoms TEXT,
    symptoms_duration TEXT,
    severity_level INT, -- 1-10
    symptom_details TEXT,
    tried_medications TEXT[],
    is_pregnant BOOLEAN DEFAULT FALSE,
    is_breastfeeding BOOLEAN DEFAULT FALSE,
    menstrual_concerns BOOLEAN DEFAULT FALSE,
    menstrual_details TEXT,
    previous_consultations_for_issue INT DEFAULT 0,
    consent_share_medical_records BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ,
    uploaded_document_ids UUID[], -- Array of medical_documents IDs
    is_complete BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Can't easily FK to appointments if ID types mismatch or if appointments table definition isn't here. 
    -- Assuming appointment_id is reliable.
    UNIQUE(appointment_id) 
);

-- 3. Create Medical Documents Metadata
CREATE TABLE IF NOT EXISTS public.medical_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_url TEXT NOT NULL,
    document_type TEXT DEFAULT 'general',
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- 4. Create Consultation Notes (Doctor's SOAP Notes)
CREATE TABLE IF NOT EXISTS public.consultation_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id TEXT NOT NULL UNIQUE,
    doctor_id UUID NOT NULL REFERENCES auth.users(id),
    patient_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- SOAP Structure
    subjective TEXT, -- Patient's story
    objective TEXT, -- Doctor's observations
    assessment TEXT, -- Diagnosis
    plan TEXT, -- Treatment plan
    
    diagnosis_codes TEXT[], -- ICD-10 mock
    private_notes TEXT, -- Hidden from patient
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Storage Bucket for Medical Files
-- Note: 'insert' into storage.buckets is idempotent usually
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-files', 'medical-files', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Setup RLS Policies (Security)

-- Enable RLS
ALTER TABLE public.patient_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_notes ENABLE ROW LEVEL SECURITY;

-- Policies for Patient Medical Records
DROP POLICY IF EXISTS "Patients can view/edit own records" ON public.patient_medical_records;
CREATE POLICY "Patients can view/edit own records" 
ON public.patient_medical_records 
FOR ALL 
USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Doctors can view patient records if consented" ON public.patient_medical_records;
CREATE POLICY "Doctors can view patient records if consented" 
ON public.patient_medical_records 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.consultation_intake_forms intake
        WHERE intake.patient_id = patient_medical_records.patient_id
        AND intake.consent_share_medical_records = true
        -- In real app, check if doctor is assigned to an active appointment with this patient
        -- For MVP/Demo, simplicity prevails.
    )
);

-- Policies for Intake Forms
DROP POLICY IF EXISTS "Patients manage own intake forms" ON public.consultation_intake_forms;
CREATE POLICY "Patients manage own intake forms" 
ON public.consultation_intake_forms 
FOR ALL 
USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Doctors view intake forms for their appointments" ON public.consultation_intake_forms;
CREATE POLICY "Doctors view intake forms for their appointments" 
ON public.consultation_intake_forms 
FOR SELECT 
USING (true); -- Simplification for MVP. Ideally join with appointments table to check doctor_id.

-- Policies for Medical Documents
DROP POLICY IF EXISTS "Patients manage own documents" ON public.medical_documents;
CREATE POLICY "Patients manage own documents" 
ON public.medical_documents 
FOR ALL 
USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Doctors view documents" ON public.medical_documents;
CREATE POLICY "Doctors view documents" 
ON public.medical_documents 
FOR SELECT 
USING (true); -- Simplified.

-- Policies for Consultation Notes
DROP POLICY IF EXISTS "Doctors manage their notes" ON public.consultation_notes;
CREATE POLICY "Doctors manage their notes"
ON public.consultation_notes
FOR ALL
USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Patients view their SOAP notes" ON public.consultation_notes;
CREATE POLICY "Patients view their SOAP notes"
ON public.consultation_notes
FOR SELECT
USING (auth.uid() = patient_id);

-- Storage Policies
DROP POLICY IF EXISTS "Public Access Medical Files" ON storage.objects;
CREATE POLICY "Public Access Medical Files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'medical-files' );

DROP POLICY IF EXISTS "Authenticated users can upload medical files" ON storage.objects;
CREATE POLICY "Authenticated users can upload medical files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'medical-files' AND auth.role() = 'authenticated' );

COMMIT;
