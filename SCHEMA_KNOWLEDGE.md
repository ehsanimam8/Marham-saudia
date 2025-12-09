
# Schema Knowledge Base

This document outlines the database schema for the Marham Saudi telemedicine platform, based on the migration files.

## Core Schema Structure

### Enums
- `user_role`: 'patient', 'doctor', 'admin'
- `doctor_status`: 'pending', 'approved', 'rejected', 'suspended'
- `appointment_status`: 'scheduled', 'completed', 'cancelled', 'no_show'
- `consultation_type`: 'new', 'followup'
- `payment_status`: 'pending', 'paid', 'refunded'
- `article_status`: 'draft', 'published'
- `payout_status`: 'pending', 'paid'

### Tables

#### 1. Profiles (`profiles`)
Base table for all users, linked to `auth.users`.
- `id` (UUID, PK, FK -> auth.users.id)
- `role` (user_role)
- `full_name_ar` (TEXT)
- `full_name_en` (TEXT)
- `phone` (TEXT)
- `city` (TEXT)
- `created_at`, `updated_at`

#### 2. Doctors (`doctors`)
Extension table for doctor-specific data.
- `id` (UUID, PK)
- `profile_id` (UUID, FK -> profiles.id)
- `scfhs_license` (TEXT, Unique)
- `specialty` (TEXT)
- `sub_specialties` (TEXT[])
- `hospital` (TEXT)
- `qualifications` (JSONB)
- `experience_years` (INTEGER)
- `bio_ar`, `bio_en` (TEXT)
- `profile_photo_url` (TEXT)
- `consultation_price` (DECIMAL)
- `rating` (DECIMAL)
- `total_consultations` (INTEGER)
- `status` (doctor_status)
- `bank_iban` (TEXT)

#### 3. Patients (`patients`)
Extension table for patient-specific data.
- `id` (UUID, PK)
- `profile_id` (UUID, FK -> profiles.id)
- `date_of_birth` (DATE)
- `insurance_company` (TEXT)
- `insurance_number` (TEXT)
- `emergency_contact` (TEXT)

#### 4. Appointments (`appointments`)
- `id` (UUID, PK)
- `patient_id` (UUID, FK -> patients.id)
- `doctor_id` (UUID, FK -> doctors.id)
- `appointment_date` (DATE)
- `start_time` (TIME)
- `end_time` (TIME)
- `status` (appointment_status)
- `consultation_type` (consultation_type)
- `reason_ar`, `reason_en` (TEXT)
- `price` (DECIMAL)
- `payment_status` (payment_status)
- `video_room_url` (TEXT)

#### 5. Consultations (`consultations`)
Medical records for a specific appointment.
- `id` (UUID, PK)
- `appointment_id` (UUID, FK -> appointments.id)
- `diagnosis` (TEXT)
- `prescription` (JSONB)
- `notes` (TEXT)
- `recommendations` (TEXT[])
- `next_followup_date` (DATE)
- `duration_minutes` (INTEGER)
- `recording_url` (TEXT)

#### 6. Doctor Schedules (`doctor_schedules`)
Availability slots.
- `id` (UUID, PK)
- `doctor_id` (UUID, FK -> doctors.id)
- `day_of_week` (INTEGER, 0-6)
- `start_time` (TIME)
- `end_time` (TIME)
- `is_available` (BOOLEAN)

#### 7. Reviews (`reviews`)
- `id` (UUID, PK)
- `appointment_id` (UUID, FK -> appointments.id)
- `doctor_id` (UUID, FK -> doctors.id)
- `patient_id` (UUID, FK -> patients.id)
- `rating` (INTEGER, 1-5)
- `review_text_ar`, `review_text_en` (TEXT)

#### 8. Articles (`articles`)
- `id` (UUID, PK)
- `slug` (TEXT, Unique)
- `title_ar`, `title_en` (TEXT)
- `content_ar`, `content_en` (TEXT)
- `excerpt_ar`, `excerpt_en` (TEXT)
- `featured_image_url` (TEXT)
- `category` (TEXT)
- `keywords` (TEXT[])
- `reviewed_by_doctor_id` (UUID, FK -> doctors.id)
- `read_time_minutes` (INTEGER)
- `views` (INTEGER)
- `status` (article_status)
- `published_at` (TIMESTAMPTZ)

#### 9. Earnings (`earnings`)
- `id` (UUID, PK)
- `doctor_id` (UUID, FK -> doctors.id)
- `appointment_id` (UUID, FK -> appointments.id)
- `amount` (DECIMAL)
- `platform_fee` (DECIMAL)
- `doctor_earnings` (DECIMAL)
- `payout_status` (payout_status)

### Enhanced Telemedicine Tables (New)

#### 10. Patient Medical Records (`patient_medical_records`)
EMR data.
- `id` (UUID, PK)
- `patient_id` (UUID, FK -> auth.users.id) **Note: This references Auth User ID directly, unlike `patients` table.**
- `blood_type` (VARCHAR)
- `height_cm`, `weight_kg`
- `allergies`, `chronic_conditions`, `current_medications` (Arrays)
- `past_surgeries`, `family_history` (JSONB)
- `last_menstrual_period` (DATE)
- `pregnancy_history` (JSONB)

#### 11. Medical Documents (`medical_documents`)
- `id` (UUID, PK)
- `patient_id` (UUID, FK -> auth.users.id)
- `document_type`, `title`, `description`
- `file_url`, `file_name`, `file_size_bytes`, `file_type`
- `uploaded_by` (UUID, FK -> auth.users.id)

#### 12. Consultation Intake Forms (`consultation_intake_forms`)
- `id` (UUID, PK)
- `appointment_id` (UUID, FK -> appointments.id)
- `patient_id` (UUID, FK -> auth.users.id)
- `chief_complaint` (TEXT)
- `symptoms_duration`, `severity_level`
- `current_symptoms` (JSONB)
- `consent_share_medical_records` (BOOLEAN)
- `uploaded_document_ids` (UUID[])
- `is_complete` (BOOLEAN)

#### 13. Consultation Notes (`consultation_notes`)
- `id` (UUID, PK)
- `appointment_id` (UUID, FK -> appointments.id)
- `doctor_id` (UUID, FK -> auth.users.id)
- `patient_id` (UUID, FK -> auth.users.id)
- `subjective_notes`, `objective_findings` (TEXT)
- `diagnosis`, `differential_diagnosis`
- `treatment_plan`, `lifestyle_recommendations`

#### 14. Prescriptions (`prescriptions`)
- `id` (UUID, PK)
- `appointment_id` (UUID, FK -> appointments.id)
- `doctor_id` (UUID, FK -> auth.users.id)
- `patient_id` (UUID, FK -> auth.users.id)
- `consultation_note_id` (UUID, FK -> consultation_notes.id)
- `prescription_number` (VARCHAR, Unique)
- `medications` (JSONB)
- `doctor_signature_url`, `prescription_pdf_url` (TEXT)
- `status` (VARCHAR)

#### 15. Consultation Session Logs (`consultation_session_logs`)
- `id` (UUID, PK)
- `appointment_id` (UUID, FK -> appointments.id)
- `session_started_at`, `session_ended_at`
- `video_room_id`

## Triggers
- `handle_new_user`: Fires on `auth.users` insert. Creates `profiles` and `patients` records.
- `update_updated_at_column`: Automatically updates `updated_at` on modification.
- `generate_prescription_number`: Auto-generates prescription ID (e.g., `PRX-20241209-0001`).

## Known Issues (as of 2024-12-09)
- **Trigger Failure**: The `handle_new_user` trigger sometimes fails with "Database error checking email" or similar when attempting to create `patients` records, likely due to schema mismatch or race conditions.
- **Fix**: Run `supabase/migrations/fix_user_creation_comprehensive.sql` to patch the trigger with better error handling (`EXCEPTION WHEN OTHERS THEN RAISE WARNING`).
