
-- Activate doctor account for mah@hotmail.com
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get user ID from auth.users (requires permissions, might need to rely on profiles if joined)
    -- But since we are running as postgres/service role in migration, we can access auth schema usually,
    -- or if not, we assume profiles table link.
    -- Let's try to find them in profiles first as it is public.
    
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = 'mah@hotmail.com';

    IF target_user_id IS NOT NULL THEN
        -- Update the doctor record
        UPDATE doctors
        SET verification_status = 'approved'
        WHERE user_id = target_user_id;
        
        RAISE NOTICE 'Doctor with email mah@hotmail.com has been activated.';
    ELSE
        RAISE NOTICE 'User with email mah@hotmail.com not found.';
    END IF;
END $$;
