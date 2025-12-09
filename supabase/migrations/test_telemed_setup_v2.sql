-- Create a Test Patient and Appointment for Telemedicine Flow Test

DO $$
DECLARE
    v_patient_id UUID := 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22'; -- Specific ID for test patient
    -- v_doctor_id is the AUTH ID of the doctor (from seed data)
    v_doctor_auth_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; 
    v_doctor_table_id UUID;
    v_appointment_id UUID := gen_random_uuid();
    v_patient_table_id UUID := gen_random_uuid();
BEGIN
    -- 1. Create Patient Auth User
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
    -- First check if exists to avoid UUID conflict if re-running with new UUID
    SELECT id INTO v_patient_table_id FROM patients WHERE profile_id = v_patient_id;
    
    IF v_patient_table_id IS NULL THEN
        v_patient_table_id := gen_random_uuid();
        INSERT INTO patients (id, profile_id) VALUES (v_patient_table_id, v_patient_id);
    END IF;

    -- 4. Get Doctor Table ID
    -- We select by profile_id which links to auth_id
    SELECT id INTO v_doctor_table_id FROM doctors WHERE profile_id = v_doctor_auth_id LIMIT 1;
    
    -- Safety check if doctor doesn't exist yet (though seed should have run)
    IF v_doctor_table_id IS NULL THEN
        RAISE EXCEPTION 'Doctor with profile_id % not found. Please run seed_data.sql first.', v_doctor_auth_id;
    END IF;

    -- 5. Create Appointment (Scheduled for Today)
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

    -- 6. Create Intake Form
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
        v_patient_id, -- Note: This might need to be AUTH ID (v_patient_id) based on schema
        'Simulated Headache for Testing',
        '1_week',
        7,
        '{"migraine": true}',
        true,
        true
    );

    RAISE NOTICE 'Success! Created Appointment ID: % (Doctor ID: %)', v_appointment_id, v_doctor_table_id;
END $$;
