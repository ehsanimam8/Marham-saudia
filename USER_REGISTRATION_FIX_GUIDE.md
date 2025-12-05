# User Registration Fix - Complete Guide

## Current Status
❌ User registration still failing with "Database error saving new user"

## Root Causes Identified

### 1. **Trigger Permission Issue** (Most Likely)
The `handle_new_user()` trigger function needs:
- `SECURITY DEFINER` to bypass RLS policies
- Proper `search_path` set to `public`
- Explicit permission grants

### 2. **RLS Policy Constraints**
The database has Row Level Security (RLS) policies that require:
- `profiles` INSERT: User must be authenticated and `auth.uid() = id`
- `patients` INSERT: User must be authenticated and `auth.uid() = profile_id`

The trigger runs as `SECURITY DEFINER` which should bypass these, but permissions might not be set correctly.

### 3. **Patient ID Generation Bug** (Already Fixed)
The trigger was trying to manually set the patient `id` instead of letting it auto-generate.

## Complete Fix

### Step 1: Apply the Comprehensive Database Fix

Go to your **Supabase Dashboard** → **SQL Editor** and run this:

```sql
-- Comprehensive fix for user creation issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
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
  
  -- Create patient record if role is patient
  IF COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role) = 'patient' THEN
    INSERT INTO public.patients (profile_id)
    VALUES (new.id);
  END IF;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
```

### Step 2: Test User Registration

1. Open http://localhost:3000/auth/login
2. Click "حساب جديد" (New Account)
3. Fill in the form:
   - Name: اختبار المستخدم
   - Email: test123@example.com
   - Password: test123456
4. Click "إنشاء حساب جديد"

### Step 3: Check Console Logs

Open your terminal where `npm run dev` is running. You should see logs like:

```
🔵 Starting signup for: test123@example.com
✅ Auth user created: <user-id>
🔍 Checking if profile exists for user: <user-id>
✅ Profile already exists (trigger worked)
🎉 Signup complete, redirecting...
```

**If the trigger fails**, you'll see:
```
⚠️ Profile not found, creating manually...
✅ Profile created
✅ Patient record created
```

**If there's an error**, you'll see:
```
❌ Profile creation error: <detailed error message>
```

## What Changed in the Code

### 1. Enhanced `app/auth/actions.ts`
- ✅ Added comprehensive error logging
- ✅ Better error handling with specific error messages
- ✅ Self-healing logic now catches and reports errors
- ✅ Console logs to track the signup flow

### 2. Database Trigger Improvements
- ✅ Added `SECURITY DEFINER` explicitly
- ✅ Set `search_path = public` to avoid schema issues
- ✅ Added exception handling to prevent trigger failures from blocking signup
- ✅ Fixed patient ID auto-generation
- ✅ Added permission grants

## Debugging Steps

If it still doesn't work after applying the fix:

### 1. Check Supabase Logs
- Go to Supabase Dashboard → Logs → Database
- Look for any error messages when creating a user

### 2. Check Terminal Console
- Look for the emoji-prefixed logs (🔵, ✅, ❌, ⚠️)
- The error message will tell you exactly what failed

### 3. Verify RLS Policies
Run this in SQL Editor to temporarily disable RLS for testing:
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
```

Try creating a user. If it works, the issue is with RLS policies.

**Remember to re-enable RLS after testing:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
```

### 4. Check if Trigger is Active
Run this in SQL Editor:
```sql
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

Should return: `tgenabled = 'O'` (enabled)

## Files Modified

1. ✅ `app/auth/actions.ts` - Enhanced error handling and logging
2. ✅ `supabase/migrations/fix_user_creation_trigger.sql` - Basic fix
3. ✅ `supabase/migrations/fix_user_creation_comprehensive.sql` - Complete fix with permissions

## Next Steps

1. **Apply the comprehensive SQL fix** (Step 1 above)
2. **Try creating a new user** with a fresh email
3. **Check the terminal logs** to see what's happening
4. **Report back** with the console output if it still fails

The enhanced logging will tell us exactly where the failure is occurring!
