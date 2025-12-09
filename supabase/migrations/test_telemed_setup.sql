-- Create a Test Patient and Appointment for Telemedicine Flow Test
-- We will assume the doctor 'noura.alrashid@test.com' exists (ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11)

DO $$
DECLARE
    v_patient_id UUID := 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22'; -- Specific ID for test patient
    v_doctor_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    v_doctor_table_id UUID;
    v_appointment_id UUID := gen_random_uuid();
    v_patient_table_id UUID := gen_random_uuid();
BEGIN
    -- 1. Create Patient Auth User (if not exists)
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

    -- 2. Create Patient Profile
    INSERT INTO profiles (id, role, full_name_ar, full_name_en)
    VALUES (v_patient_id, 'patient', 'مريض تجربة', 'Telemed Test Patient')
    ON CONFLICT (id) DO NOTHING;

    -- 3. Create Patient Record
    INSERT INTO patients (id, profile_id)
    VALUES (v_patient_table_id, v_patient_id)
    ON CONFLICT DO NOTHING; -- If conflict, likely need to select existing ID if we re-run.
    
    -- Get valid patient table id just in case we didn't insert
    SELECT id INTO v_patient_table_id FROM patients WHERE profile_id = v_patient_id LIMIT 1;

    -- Get Doctor Table ID
    SELECT id INTO v_doctor_table_id FROM doctors WHERE profile_id = v_doctor_id LIMIT 1;

    -- 4. Create Appointment (Scheduled for Today)
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

    -- 5. Create Intake Form (Simulate patient submission)
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
        v_patient_id,
        'Simulated Headache for Testing',
        '1_week',
        7,
        '{"migraine": true, "nausea": false}',
        true,
        true
    );

    RAISE NOTICE 'Created Appointment ID: %', v_appointment_id;
END $$;
