-- Fix the handle_new_user trigger to properly create patient records
-- This addresses the "Database error saving new user" issue

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name_ar, role)
  VALUES (
    new.id, 
    -- Try to find a name, default to email username part if absolutely nothing else
    COALESCE(
      new.raw_user_meta_data->>'full_name_ar', 
      new.raw_user_meta_data->>'full_name', 
      split_part(new.email, '@', 1)
    ),
    -- Default to patient if role is missing or invalid
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role)
  );
  
  -- Automatically create patient record if the role is patient
  -- Fixed: Don't specify 'id' explicitly, let it auto-generate
  IF COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role) = 'patient' THEN
    INSERT INTO public.patients (profile_id)
    VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
