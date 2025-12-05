-- Fix for infinite recursion in RLS policies
-- The recursion happens because patients RLS checks appointments, and appointments RLS checks patients.
-- Solution: Use a SECURITY DEFINER function for the complex check to bypass RLS recursion.

-- 1. Create a helper function to check if a doctor has an appointment with a patient
-- This runs with security definer privileges, bypassing RLS on the tables it queries
CREATE OR REPLACE FUNCTION public.doctor_has_appointment_with_patient(target_patient_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the current user is a doctor who has an appointment with this patient
  RETURN EXISTS (
    SELECT 1 
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    WHERE a.patient_id = target_patient_id
    AND d.profile_id = auth.uid()
  );
END;
$$;

-- 2. Drop the problematic policy
DROP POLICY IF EXISTS "Doctors view patients they have appointments with" ON patients;

-- 3. Re-create the policy using the efficient, loop-breaking function
CREATE POLICY "Doctors view patients they have appointments with" 
ON patients 
FOR SELECT 
USING (
  doctor_has_appointment_with_patient(id)
);
