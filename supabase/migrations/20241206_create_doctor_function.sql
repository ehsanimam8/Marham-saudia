-- Function to create a doctor account fully (Auth User + Profile + Doctor Record)
-- This allows admins to create doctors without them needing to sign up manually.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION create_doctor_account(
    p_email TEXT,
    p_password TEXT,
    p_full_name_ar TEXT,
    p_full_name_en TEXT,
    p_city TEXT,
    p_specialty TEXT,
    p_hospital TEXT,
    p_scfhs_license TEXT,
    p_consultation_price NUMERIC,
    p_experience_years INTEGER,
    p_bio_ar TEXT,
    p_bio_en TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (superuser)
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- 1. Create User in auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        p_email,
        crypt(p_password, gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', p_full_name_en, 'full_name_ar', p_full_name_ar, 'role', 'doctor'),
        false,
        now(),
        now()
    )
    RETURNING id INTO v_user_id;

    -- 2. Profile is created automatically by trigger 'on_auth_user_created'
    -- But we need to update it with specific details just in case, or wait for trigger.
    -- Trigger inserts logic: 
    -- INSERT INTO public.profiles (id, full_name_ar, role) VALUES (...)
    
    -- We wait for trigger? No, triggers run in the same transaction.
    -- We can update the profile immediately to ensure all fields are set.
    
    UPDATE public.profiles
    SET 
        full_name_en = p_full_name_en,
        city = p_city,
        role = 'doctor' -- Ensure role is doctor
    WHERE id = v_user_id;

    -- 3. Create Doctor Record
    INSERT INTO public.doctors (
        id,
        profile_id,
        scfhs_license,
        specialty,
        hospital,
        experience_years,
        consultation_price,
        bio_ar,
        bio_en,
        status,
        profile_photo_url
    ) VALUES (
        gen_random_uuid(),
        v_user_id,
        p_scfhs_license,
        p_specialty,
        p_hospital,
        p_experience_years,
        p_consultation_price,
        p_bio_ar,
        p_bio_en,
        'approved', -- Auto-approve
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300' -- Default doctor image
    );

    RETURN v_user_id;
END;
$$;
