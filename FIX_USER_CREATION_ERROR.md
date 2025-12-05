# Fix: "Database error saving new user"

## Problem
When trying to create a new user account, you're getting the error: **"Error: Database error saving new user"**

## Root Cause
The `handle_new_user()` database trigger function has a bug. It tries to insert a patient record with an explicitly set `id` field:

```sql
-- BUGGY CODE (in initial_schema.sql line 359)
INSERT INTO public.patients (id, profile_id)
VALUES (uuid_generate_v4(), new.id);
```

However, the `patients` table schema already has `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`, which means the database should auto-generate the ID. Explicitly setting it can cause conflicts or errors.

## Solution
Update the trigger to let the database auto-generate the patient ID:

```sql
-- FIXED CODE
INSERT INTO public.patients (profile_id)
VALUES (new.id);
```

## How to Apply the Fix

### Option 1: Supabase Dashboard (Recommended - Takes 1 minute)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Marham Saudi project

2. **Open SQL Editor**
   - Click on the SQL Editor icon in the left sidebar (looks like `>_`)
   - Click **New Query**

3. **Run the Fix**
   - Copy the entire SQL code from `supabase/migrations/fix_user_creation_trigger.sql`
   - Or copy this:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name_ar, role)
  VALUES (
    new.id, 
    COALESCE(
      new.raw_user_meta_data->>'full_name_ar', 
      new.raw_user_meta_data->>'full_name', 
      split_part(new.email, '@', 1)
    ),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role)
  );
  
  -- Fixed: Don't specify 'id' explicitly, let it auto-generate
  IF COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role) = 'patient' THEN
    INSERT INTO public.patients (profile_id)
    VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

4. **Execute**
   - Click **Run** (bottom right corner)
   - You should see: "Success. No rows returned"

5. **Test**
   - Try creating a new user account again
   - It should work without errors now!

### Option 2: Supabase CLI (If you have it configured)

```bash
# Make sure you're linked to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
npx supabase db push
```

## Verification

After applying the fix:

1. Go to your app at http://localhost:3000/auth/login
2. Click on "حساب جديد" (New Account) tab
3. Fill in:
   - Full Name: اختبار المستخدم
   - Email: test@example.com
   - Password: test123
4. Click "إنشاء حساب جديد"
5. You should be redirected to the dashboard without errors

## Additional Notes

- The fix is backward compatible - it won't affect existing users
- The self-healing logic in `app/auth/actions.ts` already handles this correctly
- This fix also applies to the `patch_fix_trigger.sql` migration
- No code changes needed in the application - only the database trigger

## Files Modified

- ✅ Created: `supabase/migrations/fix_user_creation_trigger.sql`
- ℹ️ Reference: `supabase/migrations/20241204000000_initial_schema.sql` (line 359)
- ℹ️ Reference: `supabase/migrations/patch_fix_trigger.sql` (line 18)

## Status

- [x] Issue identified
- [x] Fix created
- [ ] **Fix applied to database** ← YOU NEED TO DO THIS
- [ ] Tested with new user creation
