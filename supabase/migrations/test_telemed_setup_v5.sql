-- Create a Test Patient and Appointment for Telemedicine Flow Test v5

DO $$
DECLARE
    v_patient_id UUID := 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22'; 
    v_doctor_auth_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; 
    v_doctor_table_id UUID;
    v_appointment_id UUID := gen_random_uuid();
    v_patient_table_id UUID;
BEGIN
    ----------------------------------------------------------------
    -- 1. Ensure Doctor Exists 
    ----------------------------------------------------------------
    -- Check Auth User
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_doctor_auth_id) THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
        VALUES (
            v_doctor_auth_id,
            '00000000-0000-0000-0000-000000000000',
            'noura.alrashid@test.com',
            crypt('password123', gen_salt('bf')),
            now(),
            '{"full_name":"Dr. Noura Al-Rashid","role":"doctor"}',
            'authenticated',
            'authenticated'
        );
    END IF;

    -- Check Profile
    INSERT INTO profiles (id, role, full_name_ar, full_name_en, city)
    VALUES (v_doctor_auth_id, 'doctor', 'د. نورا الراشد', 'Dr. Noura Al-Rashid', 'Riyadh')
    ON CONFLICT (id) DO NOTHING;

    -- Look up doctor by license first (Unique constraint)
    SELECT id INTO v_doctor_table_id FROM doctors WHERE scfhs_license = '10101010';
    
    -- If not found by license, check by profile_id
    IF v_doctor_table_id IS NULL THEN
        SELECT id INTO v_doctor_table_id FROM doctors WHERE profile_id = v_doctor_auth_id;
    END IF;

    -- If still null, insert
    IF v_doctor_table_id IS NULL THEN
        v_doctor_table_id := gen_random_uuid();
        INSERT INTO doctors (
            id, profile_id, scfhs_license, specialty, sub_specialties, hospital, experience_years, consultation_price, rating, total_consultations, status, profile_photo_url, bio_ar, bio_en
        ) VALUES (
            v_doctor_table_id,
            v_doctor_auth_id, 
            '10101010', 
            'OB/GYN', 
            ARRAY['PCOS', 'Fertility'], 
            'King Faisal Specialist Hospital', 
            15, 
            100.00, 
            4.9, 
            124, 
            'approved', 
            '/images/doctors/doctor_noura_alrashid_1764849899936.png', 
            'استشارية أمراض النساء والولادة متخصصة في علاج تكيس المبايض ومشاكل الخصوبة.', 
            'Consultant OB/GYN specializing in PCOS and fertility issues.'
        );
    END IF;

    ----------------------------------------------------------------
    -- 2. Ensure Patient Exists
    ----------------------------------------------------------------
    -- Auth
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
    VALUES (
        v_patient_id,
        'telemed_patient@test.com',
        crypt('password123', gen_salt('bf')),
        now(),
        '{"full_name":"Telemed Test Patient","role":"patient"}',
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;

    -- Profile
    INSERT INTO profiles (id, role, full_name_ar, full_name_en)
    VALUES (v_patient_id, 'patient', 'مريض تجربة', 'Telemed Test Patient')
    ON CONFLICT (id) DO NOTHING;

    -- Patient Record
    SELECT id INTO v_patient_table_id FROM patients WHERE profile_id = v_patient_id;
    IF v_patient_table_id IS NULL THEN
        v_patient_table_id := gen_random_uuid();
        INSERT INTO patients (id, profile_id) VALUES (v_patient_table_id, v_patient_id);
    END IF;

    ----------------------------------------------------------------
    -- 3. Create Appointment (If Doctor ID is valid)
    ----------------------------------------------------------------
    IF v_doctor_table_id IS NULL THEN
       RAISE EXCEPTION 'Something went wrong: Doctor ID is still null';
    END IF;

    INSERT INTO appointments (
        id, patient_id, doctor_id, appointment_date, start_time, end_time, status, consultation_type, price
    )
    VALUES (
        v_appointment_id,
        v_patient_table_id,
        v_doctor_table_id,
        CURRENT_DATE,
        '10:00:00',
        '10:30:00',
        'scheduled',
        'new',
        100.00
    );

    ----------------------------------------------------------------
    -- 4. Create Intake Form
    ----------------------------------------------------------------
    INSERT INTO consultation_intake_forms (
        appointment_id,
        patient_id,
        chief_complaint,
        symptoms_duration,
        severity_level,
        current_symptoms,
        consent_share_medical_records,
        is_complete
    )
    VALUES (
        v_appointment_id,
        v_patient_id, -- Maps to Auth ID
        'Simulated Headache for Testing',
        '1_week',
        7,
        '{"migraine": true}',
        true,
        true
    );

    RAISE NOTICE 'Success! Created Appointment ID: % (Doctor ID: %)', v_appointment_id, v_doctor_table_id;
END $$;
