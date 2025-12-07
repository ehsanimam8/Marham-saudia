-- Create Admin User
DO $$
DECLARE
    admin_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
        admin_id, '00000000-0000-0000-0000-000000000000', 'admin@marham.sa', 
        crypt('password123', gen_salt('bf')), now(), now(), now(), 
        '{"provider":"email","providers":["email"], "role": "admin"}', 
        '{"full_name":"System Administrator","role":"admin"}', 
        'authenticated', 'authenticated'
    );

    INSERT INTO profiles (id, role, full_name_ar, full_name_en, created_at, updated_at)
    VALUES (
        admin_id, 'admin', 'مدير النظام', 'System Admin', now(), now()
    );
EXCEPTION WHEN unique_violation THEN NULL;
END $$;
