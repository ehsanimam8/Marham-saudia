-- Fix onboarding_sessions primary_concern type
-- It was incorrectly set to concern_category enum, but should be text (referencing primary_concerns.id)

-- 1. Drop the default if exists to avoid issues changing type
ALTER TABLE onboarding_sessions ALTER COLUMN primary_concern DROP DEFAULT;

-- 2. Alter column type to text
-- We accept that existing data might be incompatible if it was strictly enum, but here we are casting.
-- If 'concern_category' values (e.g. 'medical') were stored, they are valid text.
ALTER TABLE onboarding_sessions 
    ALTER COLUMN primary_concern TYPE text USING primary_concern::text;

-- 3. Add Foreign Key constraint if not exists
-- Only invalid data will block this. Since we are seeding/testing, we can clean up bad data if needed.
-- But let's try strict first.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'onboarding_sessions_primary_concern_fkey_v2') THEN
        -- Drop old constraint if it exists (might have bad name or target)
        BEGIN
            ALTER TABLE onboarding_sessions DROP CONSTRAINT IF EXISTS onboarding_sessions_primary_concern_fkey;
        EXCEPTION WHEN OTHERS THEN NULL; END;

        -- Clean up invalid references first
        UPDATE onboarding_sessions 
        SET primary_concern = NULL 
        WHERE primary_concern NOT IN (SELECT id FROM primary_concerns);

        ALTER TABLE onboarding_sessions 
            ADD CONSTRAINT onboarding_sessions_primary_concern_fkey_v2 
            FOREIGN KEY (primary_concern) 
            REFERENCES primary_concerns(id)
            ON DELETE SET NULL;
    END IF;
END $$;
