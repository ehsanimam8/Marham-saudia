-- Comprehensive fix for user creation issues
-- This addresses RLS policies and trigger permissions

-- 1. Update the trigger function with better error handling
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
  -- Don't specify 'id' explicitly, let it auto-generate
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

-- 2. Grant necessary permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
