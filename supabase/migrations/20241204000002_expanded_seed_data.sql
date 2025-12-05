-- Expanded Seed Data for Marham Saudi MVP
-- This creates 25+ doctors across all specialties with profile photos

-- Step 1: Create auth users (required for profiles foreign key)
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
    -- OB/GYN Doctors (5)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01'::uuid, '00000000-0000-0000-0000-000000000000', 'noura.alrashid@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Noura Al-Rashid","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02'::uuid, '00000000-0000-0000-0000-000000000000', 'fatima.alzahrani@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Fatima Al-Zahrani","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03'::uuid, '00000000-0000-0000-0000-000000000000', 'maha.alqahtani@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Maha Al-Qahtani","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04'::uuid, '00000000-0000-0000-0000-000000000000', 'reem.almutairi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Reem Al-Mutairi","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05'::uuid, '00000000-0000-0000-0000-000000000000', 'huda.aldossary@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Huda Al-Dossary","role":"doctor"}', 'authenticated', 'authenticated'),
    
    -- Fertility Specialists (5)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06'::uuid, '00000000-0000-0000-0000-000000000000', 'sara.alahmed@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Sara Al-Ahmed","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07'::uuid, '00000000-0000-0000-0000-000000000000', 'nada.alshammari@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Nada Al-Shammari","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08'::uuid, '00000000-0000-0000-0000-000000000000', 'abeer.alghamdi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Abeer Al-Ghamdi","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09'::uuid, '00000000-0000-0000-0000-000000000000', 'lama.alenezi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Lama Al-Enezi","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10'::uuid, '00000000-0000-0000-0000-000000000000', 'bushra.alotaibi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Bushra Al-Otaibi","role":"doctor"}', 'authenticated', 'authenticated'),
    
    -- Maternal-Fetal Medicine (5)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '00000000-0000-0000-0000-000000000000', 'laila.alomari@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Laila Al-Omari","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, '00000000-0000-0000-0000-000000000000', 'wafa.alharbi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Wafa Al-Harbi","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, '00000000-0000-0000-0000-000000000000', 'dalal.alsaeed@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Dalal Al-Saeed","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, '00000000-0000-0000-0000-000000000000', 'ghada.albalawi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Ghada Al-Balawi","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, '00000000-0000-0000-0000-000000000000', 'najla.alsubai@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Najla Al-Subai","role":"doctor"}', 'authenticated', 'authenticated'),
    
    -- Mental Health (5)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid, '00000000-0000-0000-0000-000000000000', 'amal.alharbi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Amal Al-Harbi","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::uuid, '00000000-0000-0000-0000-000000000000', 'manal.alshehri@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Manal Al-Shehri","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::uuid, '00000000-0000-0000-0000-000000000000', 'hanan.aljohani@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Hanan Al-Johani","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::uuid, '00000000-0000-0000-0000-000000000000', 'samira.alyami@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Samira Al-Yami","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'::uuid, '00000000-0000-0000-0000-000000000000', 'afnan.almalki@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Afnan Al-Malki","role":"doctor"}', 'authenticated', 'authenticated'),
    
    -- Endocrinology (5)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21'::uuid, '00000000-0000-0000-0000-000000000000', 'haifa.alsulaiman@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Haifa Al-Sulaiman","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, '00000000-0000-0000-0000-000000000000', 'amira.alrasheed@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Amira Al-Rasheed","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23'::uuid, '00000000-0000-0000-0000-000000000000', 'dina.alkhalifa@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Dina Al-Khalifa","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24'::uuid, '00000000-0000-0000-0000-000000000000', 'lubna.alsaleh@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Lubna Al-Saleh","role":"doctor"}', 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25'::uuid, '00000000-0000-0000-0000-000000000000', 'rana.alfarsi@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Rana Al-Farsi","role":"doctor"}', 'authenticated', 'authenticated');

-- Step 2: Create Profiles
INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
VALUES 
    -- OB/GYN
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01'::uuid, 'doctor', 'د. نورا الراشد', 'Dr. Noura Al-Rashid', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02'::uuid, 'doctor', 'د. فاطمة الزهراني', 'Dr. Fatima Al-Zahrani', 'Jeddah'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03'::uuid, 'doctor', 'د. مها القحطاني', 'Dr. Maha Al-Qahtani', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04'::uuid, 'doctor', 'د. ريم المطيري', 'Dr. Reem Al-Mutairi', 'Dammam'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05'::uuid, 'doctor', 'د. هدى الدوسري', 'Dr. Huda Al-Dossary', 'Riyadh'),
    
    -- Fertility
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06'::uuid, 'doctor', 'د. سارة الأحمد', 'Dr. Sara Al-Ahmed', 'Jeddah'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07'::uuid, 'doctor', 'د. ندى الشمري', 'Dr. Nada Al-Shammari', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08'::uuid, 'doctor', 'د. عبير الغامدي', 'Dr. Abeer Al-Ghamdi', 'Jeddah'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09'::uuid, 'doctor', 'د. لمى العنزي', 'Dr. Lama Al-Enezi', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10'::uuid, 'doctor', 'د. بشرى العتيبي', 'Dr. Bushra Al-Otaibi', 'Dammam'),
    
    -- Maternal-Fetal Medicine
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'doctor', 'د. ليلى العمري', 'Dr. Laila Al-Omari', 'Dammam'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, 'doctor', 'د. وفاء الحربي', 'Dr. Wafa Al-Harbi', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, 'doctor', 'د. دلال السعيد', 'Dr. Dalal Al-Saeed', 'Jeddah'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, 'doctor', 'د. غادة البلوي', 'Dr. Ghada Al-Balawi', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, 'doctor', 'د. نجلاء الصبيعي', 'Dr. Najla Al-Subai', 'Dammam'),
    
    -- Mental Health
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid, 'doctor', 'د. أمل الحربي', 'Dr. Amal Al-Harbi', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::uuid, 'doctor', 'د. منال الشهري', 'Dr. Manal Al-Shehri', 'Jeddah'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::uuid, 'doctor', 'د. حنان الجهني', 'Dr. Hanan Al-Johani', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::uuid, 'doctor', 'د. سميرة اليامي', 'Dr. Samira Al-Yami', 'Dammam'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'::uuid, 'doctor', 'د. أفنان المالكي', 'Dr. Afnan Al-Malki', 'Jeddah'),
    
    -- Endocrinology
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21'::uuid, 'doctor', 'د. هيفاء السليمان', 'Dr. Haifa Al-Sulaiman', 'Mecca'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'doctor', 'د. أميرة الرشيد', 'Dr. Amira Al-Rasheed', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23'::uuid, 'doctor', 'د. دينا الخليفة', 'Dr. Dina Al-Khalifa', 'Jeddah'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24'::uuid, 'doctor', 'د. لبنى الصالح', 'Dr. Lubna Al-Saleh', 'Riyadh'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25'::uuid, 'doctor', 'د. رنا الفارسي', 'Dr. Rana Al-Farsi', 'Dammam')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create Doctors (rotating through 5 images)
INSERT INTO doctors (id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en)
VALUES
    -- OB/GYN (5 doctors)
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01'::uuid, '10101010', 'OB/GYN', ARRAY['PCOS', 'Fertility'], 'King Faisal Specialist Hospital', 15, 100.00, 4.9, 124, 'approved', '/images/doctors/doctor_noura_alrashid_1764849899936.png', 'استشارية أمراض النساء والولادة متخصصة في علاج تكيس المبايض ومشاكل الخصوبة.', 'Consultant OB/GYN specializing in PCOS and fertility issues.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02'::uuid, '10101011', 'OB/GYN', ARRAY['High-risk Pregnancy', 'Prenatal Care'], 'King Abdulaziz Medical City', 12, 110.00, 4.8, 98, 'approved', '/images/doctors/doctor_sara_alahmed_1764849915248.png', 'استشارية أمراض النساء والولادة مع خبرة في حالات الحمل عالي الخطورة.', 'OB/GYN consultant with expertise in high-risk pregnancies.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03'::uuid, '10101012', 'OB/GYN', ARRAY['Gynecologic Surgery', 'Minimally Invasive Surgery'], 'Dr. Sulaiman Al-Habib Hospital', 10, 120.00, 4.7, 87, 'approved', '/images/doctors/doctor_laila_alomari_1764849928738.png', 'استشارية أمراض النساء متخصصة في الجراحة النسائية والجراحة طفيفة التوغل.', 'Gynecology consultant specializing in minimally invasive surgery.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04'::uuid, '10101013', 'OB/GYN', ARRAY['Menstrual Disorders', 'Adolescent Gynecology'], 'Saudi German Hospital', 8, 95.00, 4.6, 76, 'approved', '/images/doctors/doctor_amal_alharbi_1764849951730.png', 'أخصائية أمراض النساء مع اهتمام خاص باضطرابات الدورة الشهرية.', 'Gynecologist with special interest in menstrual disorders.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05'::uuid, '10101014', 'OB/GYN', ARRAY['Obstetrics', 'Natural Birth'], 'Dallah Hospital', 14, 105.00, 4.9, 112, 'approved', '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png', 'استشارية التوليد مع خبرة واسعة في الولادة الطبيعية.', 'Obstetrics consultant with extensive natural birth experience.'),
    
    -- Fertility (5 doctors)
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06'::uuid, '20202020', 'Fertility', ARRAY['IVF', 'Hormonal Disorders'], 'Dallah Hospital', 10, 150.00, 4.8, 89, 'approved', '/images/doctors/doctor_sara_alahmed_1764849915248.png', 'أخصائية علاج العقم والمساعدة على الإنجاب.', 'Specialist in infertility treatment and assisted reproduction.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07'::uuid, '20202021', 'Fertility', ARRAY['IUI', 'Ovulation Induction'], 'King Faisal Specialist Hospital', 9, 145.00, 4.7, 72, 'approved', '/images/doctors/doctor_noura_alrashid_1764849899936.png', 'استشارية الخصوبة متخصصة في تحفيز التبويض والتلقيح الصناعي.', 'Fertility consultant specializing in ovulation induction and IUI.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08'::uuid, '20202022', 'Fertility', ARRAY['PCOS Treatment', 'Reproductive Endocrinology'], 'Dr. Sulaiman Al-Habib Hospital', 11, 155.00, 4.9, 95, 'approved', '/images/doctors/doctor_laila_alomari_1764849928738.png', 'استشارية الغدد الصماء الإنجابية وعلاج تكيس المبايض.', 'Reproductive endocrinologist and PCOS treatment specialist.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09'::uuid, '20202023', 'Fertility', ARRAY['Male Infertility', 'Fertility Preservation'], 'King Fahad Medical City', 7, 140.00, 4.6, 64, 'approved', '/images/doctors/doctor_amal_alharbi_1764849951730.png', 'أخصائية الخصوبة مع خبرة في علاج العقم عند الرجال.', 'Fertility specialist with expertise in male infertility.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10'::uuid, '20202024', 'Fertility', ARRAY['Recurrent Miscarriage', 'Preimplantation Genetic Testing'], 'Saudi German Hospital', 13, 160.00, 4.8, 88, 'approved', '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png', 'استشارية الخصوبة متخصصة في حالات الإجهاض المتكرر.', 'Fertility consultant specializing in recurrent miscarriage.'),
    
    -- Maternal-Fetal Medicine (5 doctors)
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '30303030', 'Maternal-Fetal Medicine', ARRAY['High-risk Pregnancy'], 'King Fahad Medical City', 12, 120.00, 5.0, 56, 'approved', '/images/doctors/doctor_laila_alomari_1764849928738.png', 'استشارية طب الأمومة والجنين، متخصصة في حالات الحمل عالي الخطورة.', 'Consultant in Maternal-Fetal Medicine, specializing in high-risk pregnancies.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, '30303031', 'Maternal-Fetal Medicine', ARRAY['Fetal Anomalies', 'Prenatal Diagnosis'], 'King Faisal Specialist Hospital', 14, 125.00, 4.9, 68, 'approved', '/images/doctors/doctor_noura_alrashid_1764849899936.png', 'استشارية طب الجنين متخصصة في التشخيص قبل الولادة.', 'Fetal medicine consultant specializing in prenatal diagnosis.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, '30303032', 'Maternal-Fetal Medicine', ARRAY['Multiple Pregnancy', 'Preterm Birth'], 'Dr. Sulaiman Al-Habib Hospital', 10, 115.00, 4.8, 52, 'approved', '/images/doctors/doctor_sara_alahmed_1764849915248.png', 'استشارية طب الأمومة والجنين مع خبرة في الحمل المتعدد.', 'Maternal-fetal medicine specialist with expertise in multiple pregnancies.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, '30303033', 'Maternal-Fetal Medicine', ARRAY['Diabetes in Pregnancy', 'Hypertension'], 'King Abdulaziz Medical City', 11, 118.00, 4.7, 61, 'approved', '/images/doctors/doctor_amal_alharbi_1764849951730.png', 'استشارية طب الأمومة متخصصة في سكري الحمل وارتفاع ضغط الدم.', 'Maternal medicine consultant specializing in gestational diabetes.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, '30303034', 'Maternal-Fetal Medicine', ARRAY['Fetal Therapy', 'Ultrasound'], 'Dallah Hospital', 15, 130.00, 5.0, 74, 'approved', '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png', 'استشارية طب الجنين مع خبرة في العلاج الجنيني والموجات فوق الصوتية.', 'Fetal medicine consultant with expertise in fetal therapy and ultrasound.'),
    
    -- Mental Health (5 doctors)
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid, '40404040', 'Mental Health', ARRAY['Postpartum Depression', 'Anxiety'], 'Private Clinics', 8, 200.00, 4.7, 42, 'approved', '/images/doctors/doctor_amal_alharbi_1764849951730.png', 'طبيبة نفسية متخصصة في الصحة النفسية للمرأة واكتئاب ما بعد الولادة.', 'Psychiatrist specializing in women''s mental health and postpartum depression.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::uuid, '40404041', 'Mental Health', ARRAY['Perinatal Mental Health', 'Trauma'], 'Mind Clinic', 10, 210.00, 4.8, 58, 'approved', '/images/doctors/doctor_sara_alahmed_1764849915248.png', 'طبيبة نفسية متخصصة في الصحة النفسية في فترة الحمل والنفاس.', 'Psychiatrist specializing in perinatal mental health.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::uuid, '40404042', 'Mental Health', ARRAY['Depression', 'Stress Management'], 'Wellness Center', 7, 195.00, 4.6, 39, 'approved', '/images/doctors/doctor_noura_alrashid_1764849899936.png', 'طبيبة نفسية متخصصة في علاج الاكتئاب وإدارة الضغوط.', 'Psychiatrist specializing in depression and stress management.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::uuid, '40404043', 'Mental Health', ARRAY['Eating Disorders', 'Body Image'], 'Private Practice', 9, 205.00, 4.7, 47, 'approved', '/images/doctors/doctor_laila_alomari_1764849928738.png', 'طبيبة نفسية متخصصة في اضطرابات الأكل وصورة الجسم.', 'Psychiatrist specializing in eating disorders and body image.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'::uuid, '40404044', 'Mental Health', ARRAY['Relationship Counseling', 'Family Therapy'], 'Family Wellness Center', 11, 215.00, 4.9, 63, 'approved', '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png', 'طبيبة نفسية متخصصة في الاستشارات الزوجية والعلاج الأسري.', 'Psychiatrist specializing in relationship counseling and family therapy.'),
    
    -- Endocrinology (5 doctors)
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21'::uuid, '50505050', 'Endocrinology', ARRAY['Thyroid', 'Diabetes'], 'Saudi German Hospital', 20, 180.00, 4.6, 210, 'approved', '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png', 'استشارية الغدد الصماء والسكري.', 'Consultant Endocrinologist.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, '50505051', 'Endocrinology', ARRAY['PCOS', 'Hormonal Imbalance'], 'King Faisal Specialist Hospital', 16, 175.00, 4.7, 186, 'approved', '/images/doctors/doctor_noura_alrashid_1764849899936.png', 'استشارية الغدد الصماء متخصصة في تكيس المبايض واضطرابات الهرمونات.', 'Endocrinologist specializing in PCOS and hormonal imbalances.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23'::uuid, '50505052', 'Endocrinology', ARRAY['Osteoporosis', 'Menopause'], 'Dr. Sulaiman Al-Habib Hospital', 18, 185.00, 4.8, 198, 'approved', '/images/doctors/doctor_sara_alahmed_1764849915248.png', 'استشارية الغدد الصماء متخصصة في هشاشة العظام وسن اليأس.', 'Endocrinologist specializing in osteoporosis and menopause.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24'::uuid, '50505053', 'Endocrinology', ARRAY['Adrenal Disorders', 'Pituitary Disorders'], 'King Abdulaziz Medical City', 14, 170.00, 4.5, 154, 'approved', '/images/doctors/doctor_laila_alomari_1764849928738.png', 'استشارية الغدد الصماء متخصصة في اضطرابات الغدة الكظرية والنخامية.', 'Endocrinologist specializing in adrenal and pituitary disorders.'),
    (uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25'::uuid, '50505054', 'Endocrinology', ARRAY['Metabolic Syndrome', 'Weight Management'], 'Dallah Hospital', 12, 165.00, 4.6, 142, 'approved', '/images/doctors/doctor_amal_alharbi_1764849951730.png', 'استشارية الغدد الصماء متخصصة في متلازمة التمثيل الغذائي وإدارة الوزن.', 'Endocrinologist specializing in metabolic syndrome and weight management.');
