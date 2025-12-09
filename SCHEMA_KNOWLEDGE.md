# Verified Database Schema Knowledge

This document tracks the verified structure of the Supabase database based on migration errors and successful queries. Use this as the source of truth over any theoretical design documents.

## Tables

### `profiles`
The central identity table linked to `auth.users`.
- `id` (UUID, Primary Key) - Matches `auth.users.id`.
- `full_name_ar` (Text) - Arabic Full Name.
- `full_name_en` (Text) - English Full Name.
- `role` (Text) - Enum like 'doctor', 'patient'.
- **MISSING/REMOVED:** `email`, `gender`, `phone_number`, `city`, `blood_type`, `date_of_birth`, `phone`.

### `doctors`
Professional details for users with role 'doctor'.
- `id` (UUID, Primary Key) - Unique Doctor ID.
- `profile_id` (UUID, Foreign Key) - Links to `profiles.id`. **(NOT `user_id`)**
- `status` (Text) - Verification status ('pending', 'approved', 'rejected'). **(NOT `verification_status`)**
- `scfhs_license` (Text)
- `specialty` (Text)
- `sub_specialties` (Array of Text)
- `hospital` (Text)
- `consultation_price` (Decimal/Numeric)
- `bio_ar` (Text)
- `bio_en` (Text)
- `rating` (Numeric)
- `total_consultations` (Integer)
- **MISSING:** `full_name` (Must fetch from `profiles`).

### `patients`
Medical details for users with role 'patient'.
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key) - Links to `profiles.id`.
- `date_of_birth` (Date) - Exists in `patients` table.
- **NOTE:** Extended medical data (blood type, height, etc.) is in `patient_medical_records` table (from Enhanced Telemed migration), NOT in `patients`.

## Clarifications & Known Issues
1. **Doctor Status:** The column is `status`, NOT `verification_status`. Some migration scripts might incorrectly use `verification_status`.
2. **Doctor-User Link:** The link is `doctors.profile_id` -> `profiles.id` -> `auth.users.id`. There is no `user_id` column in `doctors`.
3. **Patient Medical Data:** Split between `patients` (core demographics) and `patient_medical_records` (clinical data).

### `articles`
Content articles written by doctors.
- `id` (UUID, Primary Key)
- `doctor_id` (UUID, Foreign Key) - Links to `doctors.id`.
- `title_ar` / `title_en`
- `content_ar` / `content_en`
- `slug`
- `category`
- `status`
- `featured_image_url`

## Common Pitfalls & Fixes
1. **Fetching Doctor Name:** Do NOT select `full_name` from `doctors`. Select `full_name_ar` from `profiles` via `doctor.profiles.full_name_ar`.
2. **Checking Auth:** Link Auth ID -> `profiles.id`. Then `profiles.id` -> `doctors.profile_id`.
3. **Status Check:** Use `doctors.status`, not `doctors.verification_status`.
