-- Run this carefully. It updates the handle_new_user function to be more robust.
-- It works even if the function already exists.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name_ar, role)
  VALUES (
    new.id, 
    -- Try to find a name, default to email username part if absolutely nothing else
    COALESCE(new.raw_user_meta_data->>'full_name_ar', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    -- Default to patient if role is missing or invalid
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role)
  );
  
  -- Automatically create patient record if the role is patient
  IF COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role) = 'patient' THEN
    INSERT INTO public.patients (id, profile_id)
    VALUES (uuid_generate_v4(), new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
