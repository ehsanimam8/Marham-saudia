
-- 1. Get the most recently created user from profiles (matches auth.users)
DO $$
DECLARE
    new_doctor_id uuid;
    new_doctor_email text;
BEGIN
    SELECT id INTO new_doctor_id FROM profiles ORDER BY created_at DESC LIMIT 1;

    -- 2. Update their role to 'doctor'
    UPDATE profiles 
    SET role = 'doctor',
        full_name_en = 'Dr. Test User', -- Set a default English name
        full_name_ar = 'د. مستخدم تجريب' -- Set a default Arabic name
    WHERE id = new_doctor_id;

    -- 3. Create a doctor record for them
    -- Check if exists first to avoid dupes
    IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = new_doctor_id) THEN
        INSERT INTO doctors (
            id,
            specialty,
            department,
            hospital,
            consultation_price,
            bio_ar,
            bio_en,
            experience_years,
            rating,
            patients_count
        ) VALUES (
            new_doctor_id,
            'طب عام',
            'General Medicine',
            'مستشفى تجريبي',
            150,
            'طبيب عام ذو خبرة في علاج الأمراض الشائعة والمزمنة.',
            'General practitioner experienced in treating common and chronic diseases.',
            5,
            4.8,
            120
        );
    END IF;

    -- 4. Create an initial schedule for them so they can take bookings
    INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, is_available)
    SELECT new_doctor_id, day_num, '09:00:00', '17:00:00', true
    FROM generate_series(0, 6) as day_num
    ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

    RAISE NOTICE 'User % upgraded to doctor successfully', new_doctor_id;
END $$;
