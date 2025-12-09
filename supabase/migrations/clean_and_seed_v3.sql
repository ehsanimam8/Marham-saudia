-- ==============================================================================
-- CLEAN AND SEED SCRIPT (v3 - FIXED)
-- This script truncates existing data and re-seeds it with correct structure.
-- Run this in the Supabase SQL Editor.
-- ==============================================================================

DO $$
DECLARE
    doctor_auth_id UUID;
    patient_auth_id UUID;
    doctor_table_id UUID;
    patient_table_id UUID;
BEGIN
    -- 1. TRUNCATE DATA
    RAISE NOTICE 'Truncating tables...';
    
    -- Attempt to truncate tables if they exist. 
    -- If a table doesn't exist, it will throw an error, so we comment out uncertain ones.
    -- Ensure these tables exist before uncommenting.
    
    TRUNCATE TABLE appointments CASCADE;
    -- TRUNCATE TABLE medical_records CASCADE;  -- Table does not exist yet
    -- TRUNCATE TABLE form_responses CASCADE;   -- Check if this exists
    TRUNCATE TABLE consultation_intake_forms CASCADE;
    TRUNCATE TABLE reviews CASCADE;
    TRUNCATE TABLE articles CASCADE;
    TRUNCATE TABLE doctors CASCADE;
    TRUNCATE TABLE patients CASCADE;
    TRUNCATE TABLE profiles CASCADE;

    RAISE NOTICE 'Tables truncated successfully.';

    -- 2. FETCH AUTH USER IDs
    SELECT id INTO doctor_auth_id FROM auth.users WHERE email = 'mah@hotmail.com';
    SELECT id INTO patient_auth_id FROM auth.users WHERE email = 'telemed_patient@test.com';

    -- If users don't exist, we can't fully seed.
    IF doctor_auth_id IS NULL THEN
        RAISE WARNING 'User mah@hotmail.com not found. Create this user first in Auth panel.';
    END IF;

    IF patient_auth_id IS NULL THEN
        RAISE WARNING 'User telemed_patient@test.com not found. Create this user first.';
    END IF;

    -- 3. SEED PROFILES
    IF doctor_auth_id IS NOT NULL THEN
        INSERT INTO profiles (id, full_name_ar, full_name_en, role, city, gender, phone_number)
        VALUES (
            doctor_auth_id,
            'د. مها',
            'Dr. Maha',
            'doctor',
            'Riyadh',
            'female',
            '0500000000'
        );
        RAISE NOTICE 'Doctor profile created.';
    END IF;

    IF patient_auth_id IS NOT NULL THEN
        INSERT INTO profiles (id, full_name_ar, full_name_en, role, city, gender)
        VALUES (
            patient_auth_id,
            'مريض تجربة',
            'Test Patient',
            'patient',
            'Jeddah',
            'female'
        );
        RAISE NOTICE 'Patient profile created.';
    END IF;

    -- 4. SEED DOCTOR RECORD
    IF doctor_auth_id IS NOT NULL THEN
        INSERT INTO doctors (
            profile_id,
            scfhs_license,
            specialty,
            sub_specialties,
            hospital,
            consultation_price,
            bio_ar,
            bio_en,
            status,
            rating,
            total_consultations
        )
        VALUES (
            doctor_auth_id,
            'L-12345678',
            'OB/GYN',
            ARRAY['Infertility', 'PCOS'],
            'Kingdom Hospital',
            150.00,
            'استشارية أمراض النساء والولادة وعلاج العقم. خبرة 10 سنوات.',
            'Consultant OB/GYN specializing in Infertility and PCOS. 10 years experience.',
            'approved',
            4.8,
            120
        )
        RETURNING id INTO doctor_table_id;
        
        RAISE NOTICE 'Doctor record created with ID: %', doctor_table_id;
    END IF;

    -- 5. SEED PATIENT RECORD
    IF patient_auth_id IS NOT NULL THEN
        INSERT INTO patients (
            profile_id,
            date_of_birth,
            blood_type
        )
        VALUES (
            patient_auth_id,
            '1990-01-01',
            'O+'
        )
        RETURNING id INTO patient_table_id;
        
        RAISE NOTICE 'Patient record created with ID: %', patient_table_id;
    END IF;

    -- 6. SEED ARTICLES
    IF doctor_table_id IS NOT NULL THEN
        INSERT INTO articles (
            doctor_id,
            title_ar,
            title_en,
            slug,
            excerpt_ar,
            excerpt_en,
            content_ar,
            content_en,
            category,
            status,
            published_at,
            featured_image_url
        )
        VALUES 
        (
            doctor_table_id,
            'أهمية حمض الفوليك للحامل',
            'Importance of Folic Acid',
            'folic-acid-pregnancy',
            'لماذا يعتبر حمض الفوليك ضرورياً في الأشهر الأولى؟',
            'Why is folic acid essential in the first trimester?',
            'يعتبر حمض الفوليك أحد أهم الفيتامينات التي تحتاجها المرأة الحامل...',
            'Folic acid is one of the most important vitamins...',
            'Pregnancy',
            'published',
            NOW(),
            'https://images.unsplash.com/photo-1544367563-12123d8965cd'
        ),
        (
            doctor_table_id,
            'علاج تكيس المبايض',
            'PCOS Treatment',
            'pcos-treatment',
            'طرق حديثة لعلاج متلازمة تكيس المبايض.',
            'Modern ways to treat PCOS.',
            'متلازمة تكيس المبايض هي مشكلة هرمونية شائعة...',
            'PCOS is a common hormonal issue...',
            'Gynecology',
            'published',
            NOW() - INTERVAL '2 days',
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118'
        );
        RAISE NOTICE 'Sample articles created.';
    END IF;

END $$;
