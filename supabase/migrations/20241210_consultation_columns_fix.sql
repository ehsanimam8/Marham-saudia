-- FIX: Ensure Consultation Columns Exist
-- Run this script to patch any missing columns in the tables.

BEGIN;

-- 1. Patch consultation_intake_forms
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS uploaded_document_ids UUID[];
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS consent_share_medical_records BOOLEAN DEFAULT FALSE;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS menstrual_concerns BOOLEAN DEFAULT FALSE;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS menstrual_details TEXT;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS previous_consultations_for_issue INT DEFAULT 0;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS tried_medications TEXT[];
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS symptom_details TEXT;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS severity_level INT;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS symptoms_duration TEXT;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS current_symptoms TEXT;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS chief_complaint TEXT;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS is_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE public.consultation_intake_forms ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 2. Patch patient_medical_records
ALTER TABLE public.patient_medical_records ADD COLUMN IF NOT EXISTS allergies TEXT[] DEFAULT '{}';
ALTER TABLE public.patient_medical_records ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[] DEFAULT '{}';
ALTER TABLE public.patient_medical_records ADD COLUMN IF NOT EXISTS current_medications TEXT[] DEFAULT '{}';

COMMIT;
