-- Seed Data for Marham Saudi MVP - 10 Female Doctors
-- This resets and creates 10 female doctor profiles

-- 1. Clean up existing data
DELETE FROM doctor_schedules;
DELETE FROM doctors;
-- We use ON CONFLICT for users/profiles, but let's try to clean up doctors to avoid FK issues.

-- 2. Create Auth Users and Profiles with Idempotency

-- Doctor 1: Dr. Noura Al-Rashid (OB/GYN)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '00000000-0000-0000-0000-000000000000', 'noura@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Noura Al-Rashid","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'doctor', 'د. نورا الراشد', 'Dr. Noura Al-Rashid', 'Riyadh')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '10101010', 'OB/GYN', ARRAY['PCOS', 'Fertility'], 'King Faisal Specialist Hospital', 15, 200.00, 4.9, 120, 'approved', '/images/doctors/doctor_noura_alrashid_1764849899936.png', 'استشارية أمراض النساء والولادة، متخصصة في علاج تكيس المبايض.', 'Consultant OB/GYN specializing in PCOS and fertility.');


-- Doctor 2: Dr. Sara Al-Ahmed (Fertility)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '00000000-0000-0000-0000-000000000000', 'sara@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Sara Al-Ahmed","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'doctor', 'د. سارة الأحمد', 'Dr. Sara Al-Ahmed', 'Jeddah')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '20202020', 'Fertility', ARRAY['IVF'], 'Dallah Hospital', 12, 250.00, 4.8, 95, 'approved', '/images/doctors/doctor_sara_alahmed_1764849915248.png', 'استشارية خصوبة وأطفال أنابيب.', 'Fertility and IVF Consultant.');


-- Doctor 3: Dr. Laila Al-Omari (Maternal-Fetal)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', '00000000-0000-0000-0000-000000000000', 'laila@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Laila Al-Omari","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'doctor', 'د. ليلى العمري', 'Dr. Laila Al-Omari', 'Dammam')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', '30303030', 'Maternal-Fetal Medicine', ARRAY['High-risk Pregnancy'], 'King Fahad Specialist Hospital', 18, 300.00, 5.0, 210, 'approved', '/images/doctors/doctor_laila_alomari_1764849928738.png', 'خبرة طويلة في طب الأمومة والأجنة وحالات الحمل الحرجة.', 'Extensive experience in maternal-fetal medicine.');


-- Doctor 4: Dr. Amal Al-Harbi (Psychiatry)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', '00000000-0000-0000-0000-000000000000', 'amal@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Amal Al-Harbi","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'doctor', 'د. أمل الحربي', 'Dr. Amal Al-Harbi', 'Riyadh')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', '40404040', 'Mental Health', ARRAY['Anxiety', 'Postpartum Depression'], 'IMC', 9, 180.00, 4.7, 88, 'approved', '/images/doctors/doctor_amal_alharbi_1764849951730.png', 'طبيبة نفسية متخصصة في صحة المرأة.', 'Psychiatrist specializing in women''s mental health.');


-- Doctor 5: Dr. Haifa Al-Sulaiman (Endocrinology)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', '00000000-0000-0000-0000-000000000000', 'haifa@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Haifa Al-Sulaiman","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'doctor', 'د. هيفاء السليمان', 'Dr. Haifa Al-Sulaiman', 'Mecca')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', '50505050', 'Endocrinology', ARRAY['Diabetes', 'Thyroid'], 'Al Noor Hospital', 22, 220.00, 4.9, 300, 'approved', '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png', 'استشارية غدد صماء وسكري.', 'Consultant Endocrinologist.');


-- Doctor 6: Dr. Fatima Al-Zahrani (Dermatology)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', '00000000-0000-0000-0000-000000000000', 'fatima@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Fatima Al-Zahrani","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'doctor', 'د. فاطمة الزهراني', 'Dr. Fatima Al-Zahrani', 'Abha')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', '60606060', 'Dermatology', ARRAY['Cosmetic', 'Acne'], 'Private Clinic', 7, 150.00, 4.6, 65, 'approved', '/images/doctors/doctor_1_fatima_1765000589927.png', 'أخصائية جلدية وتجميل.', 'Dermatology and Cosmetic Specialist.');


-- Doctor 7: Dr. Huda Al-Qahtani (Pediatrics)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', '00000000-0000-0000-0000-000000000000', 'huda@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Huda Al-Qahtani","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'doctor', 'د. هدى القحطاني', 'Dr. Huda Al-Qahtani', 'Tabuk')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', '70707070', 'Pediatrics', ARRAY['Child Development', 'Vaccination'], 'Children Specialized Hospital', 14, 180.00, 4.8, 150, 'approved', '/images/doctors/doctor_7_huda_1765000799435.png', 'استشارية طب أطفال ونمو.', 'Consultant Pediatrician specializing in development.');


-- Doctor 8: Dr. Mona Al-Shehri (Nutrition)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', '00000000-0000-0000-0000-000000000000', 'mona@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Mona Al-Shehri","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'doctor', 'د. منى الشهري', 'Dr. Mona Al-Shehri', 'Riyadh')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', '80808080', 'Nutrition', ARRAY['Weight Management', 'Diabetes Diet'], 'Diet Center', 5, 120.00, 4.5, 90, 'approved', '/images/doctors/doctor_8_mona_1765000817845.png', 'أخصائية تغذية علاجية.', 'Clinical Nutritionist.');


-- Doctor 9: Dr. Reem Al-Dossari (Dentistry)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', '00000000-0000-0000-0000-000000000000', 'reem@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Reem Al-Dossari","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'doctor', 'د. ريم الدوسري', 'Dr. Reem Al-Dossari', 'Al Khobar')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', '90909090', 'Dentistry', ARRAY['Cosmetic Dentistry', 'Orthodontics'], 'Smile Clinic', 9, 200.00, 4.9, 210, 'approved', '/images/doctors/doctor_9_reem_1765000852328.png', 'طبيبة أسنان تجميلية وتقويم.', 'Cosmetic Dentist and Orthodontist.');


-- Doctor 10: Dr. Salma King (General Practice)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', '00000000-0000-0000-0000-000000000000', 'salma@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name":"Dr. Salma King","role":"doctor"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'doctor', 'د. سلمى كينج', 'Dr. Salma King', 'Jeddah')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name_ar = EXCLUDED.full_name_ar, full_name_en = EXCLUDED.full_name_en, city = EXCLUDED.city;

INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', '11111111', 'General Practice', ARRAY['Family Medicine', 'Geriatrics'], 'Community Health Center', 30, 250.00, 5.0, 500, 'approved', '/images/doctors/doctor_10_salma_1765000872582.png', 'طبيبة أسرة بخبرة تتجاوز 30 عاماً.', 'Family Medicine Practitioner with over 30 years of experience.');


-- Step 4: Create Schedules
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, is_available)
SELECT id, 0, '17:00:00'::time, '21:00:00'::time, true FROM doctors
UNION ALL
SELECT id, 1, '17:00:00'::time, '21:00:00'::time, true FROM doctors
UNION ALL
SELECT id, 2, '17:00:00'::time, '21:00:00'::time, true FROM doctors
UNION ALL
SELECT id, 3, '17:00:00'::time, '21:00:00'::time, true FROM doctors
UNION ALL
SELECT id, 4, '14:00:00'::time, '18:00:00'::time, true FROM doctors;
