-- Seed Data for Marham Saudi MVP
-- This creates test users in auth.users first, then creates profiles and doctors

-- Step 1: Create auth users (required for profiles foreign key)
-- Note: In production, users would sign up normally. This is just for testing.
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
) VALUES 
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
        '00000000-0000-0000-0000-000000000000',
        'noura.alrashid@test.com',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Dr. Noura Al-Rashid","role":"doctor"}',
        'authenticated',
        'authenticated'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid,
        '00000000-0000-0000-0000-000000000000',
        'sara.alahmed@test.com',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Dr. Sara Al-Ahmed","role":"doctor"}',
        'authenticated',
        'authenticated'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid,
        '00000000-0000-0000-0000-000000000000',
        'laila.alomari@test.com',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Dr. Laila Al-Omari","role":"doctor"}',
        'authenticated',
        'authenticated'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid,
        '00000000-0000-0000-0000-000000000000',
        'amal.alharbi@test.com',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Dr. Amal Al-Harbi","role":"doctor"}',
        'authenticated',
        'authenticated'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid,
        '00000000-0000-0000-0000-000000000000',
        'haifa.alsulaiman@test.com',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Dr. Haifa Al-Sulaiman","role":"doctor"}',
        'authenticated',
        'authenticated'
    );

-- Step 2: Create Profiles (will be auto-created by trigger, but we'll insert manually for control)
INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'doctor', 'د. نورا الراشد', 'Dr. Noura Al-Rashid', 'Riyadh'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, 'doctor', 'د. سارة الأحمد', 'Dr. Sara Al-Ahmed', 'Jeddah'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, 'doctor', 'د. ليلى العمري', 'Dr. Laila Al-Omari', 'Dammam'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, 'doctor', 'د. أمل الحربي', 'Dr. Amal Al-Harbi', 'Riyadh'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, 'doctor', 'د. هيفاء السليمان', 'Dr. Haifa Al-Sulaiman', 'Mecca')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create Doctors
INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES
    (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '10101010', 'OB/GYN', ARRAY['PCOS', 'Fertility'], 'King Faisal Specialist Hospital', 15, 100.00, 4.9, 124, 'approved', '/images/doctors/doctor_noura_alrashid_1764849899936.png', 'استشارية أمراض النساء والولادة متخصصة في علاج تكيس المبايض ومشاكل الخصوبة.', 'Consultant OB/GYN specializing in PCOS and fertility issues.'),
    (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, '20202020', 'Fertility', ARRAY['IVF', 'Hormonal Disorders'], 'Dallah Hospital', 10, 150.00, 4.8, 89, 'approved', '/images/doctors/doctor_sara_alahmed_1764849915248.png', 'أخصائية علاج العقم والمساعدة على الإنجاب.', 'Specialist in infertility treatment and assisted reproduction.'),
    (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, '30303030', 'Maternal-Fetal Medicine', ARRAY['High-risk Pregnancy'], 'King Fahad Medical City', 12, 120.00, 5.0, 56, 'approved', '/images/doctors/doctor_laila_alomari_1764849928738.png', 'استشارية طب الأمومة والجنين، متخصصة في حالات الحمل عالي الخطورة.', 'Consultant in Maternal-Fetal Medicine, specializing in high-risk pregnancies.'),
    (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, '40404040', 'Mental Health', ARRAY['Postpartum Depression', 'Anxiety'], 'Private Clinics', 8, 200.00, 4.7, 42, 'approved', '/images/doctors/doctor_amal_alharbi_1764849951730.png', 'طبيبة نفسية متخصصة في الصحة النفسية للمرأة واكتئاب ما بعد الولادة.', 'Psychiatrist specializing in women''s mental health and postpartum depression.'),
    (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, '50505050', 'Endocrinology', ARRAY['Thyroid', 'Diabetes'], 'Saudi German Hospital', 20, 180.00, 4.6, 210, 'approved', '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png', 'استشارية الغدد الصماء والسكري.', 'Consultant Endocrinologist.');

-- Step 4: Create Doctor Schedules (Sample for Dr. Noura)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, is_available)
SELECT id, 0, '18:00:00'::time, '22:00:00'::time, true FROM doctors WHERE scfhs_license = '10101010'
UNION ALL
SELECT id, 1, '18:00:00'::time, '22:00:00'::time, true FROM doctors WHERE scfhs_license = '10101010'
UNION ALL
SELECT id, 3, '18:00:00'::time, '22:00:00'::time, true FROM doctors WHERE scfhs_license = '10101010';
