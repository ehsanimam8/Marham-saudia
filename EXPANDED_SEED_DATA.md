# Expanded Seed Data Guide

## Overview
This migration adds 25 doctors across all 5 specialties with profile photos.

## Specialties Coverage
- **OB/GYN**: 5 doctors
- **Fertility**: 5 doctors  
- **Maternal-Fetal Medicine**: 5 doctors
- **Mental Health**: 5 doctors
- **Endocrinology**: 5 doctors

## Profile Photos
All doctors use the existing 5 doctor images, rotated across specialties:
- `/images/doctors/doctor_noura_alrashid_1764849899936.png`
- `/images/doctors/doctor_sara_alahmed_1764849915248.png`
- `/images/doctors/doctor_laila_alomari_1764849928738.png`
- `/images/doctors/doctor_amal_alharbi_1764849951730.png`
- `/images/doctors/doctor_haifa_alsulaiman_1764849970279.png`

## How to Apply

### Option 1: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the sidebar
4. Click **New Query**
5. Copy the content from: `supabase/migrations/20241204000002_expanded_seed_data.sql`
6. Paste and click **Run**

### Option 2: Clear Old Data First (If Needed)
If you want to start fresh, run this first:
```sql
DELETE FROM doctor_schedules;
DELETE FROM doctors;
DELETE FROM profiles WHERE role = 'doctor';
DELETE FROM auth.users WHERE email LIKE '%@test.com';
```

Then run the expanded seed data migration.

## What You'll Get
- 25 approved doctors ready to book
- Diverse specialties and sub-specialties
- Varied pricing (95-215 SAR)
- Different cities (Riyadh, Jeddah, Dammam, Mecca)
- Realistic ratings and consultation counts
- All with profile photos

## Test Credentials
All doctors have the same password for testing: `password123`

Example emails:
- noura.alrashid@test.com
- sara.alahmed@test.com
- laila.alomari@test.com
- etc.
