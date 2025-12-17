
-- Enable Realtime for appointments table
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- Add policy for patients to view their own appointments (if not exists)
-- This ensures they can subscribe to changes
DROP POLICY IF EXISTS "Patients can view their own appointments" ON appointments;
CREATE POLICY "Patients can view their own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() IN (
        SELECT profile_id FROM patients WHERE id = appointments.patient_id
    ));

-- Ensure pre_consultation_completed has a default
ALTER TABLE appointments ALTER COLUMN pre_consultation_completed SET DEFAULT FALSE;
