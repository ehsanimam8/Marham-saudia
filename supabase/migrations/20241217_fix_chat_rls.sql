
-- Fix RLS policy for consultation_chats
-- The issue is likely that the doctor's profile_id check is failing or not matching correctly in the EXISTS subquery.
-- Or potentially the doctor record isn't linked to auth.uid() as expected in the `doctors` table for this specific user.

-- Let's relax the policy slightly to debug, or try a more direct approach.
-- We will update the policy to be simpler if possible, or just re-apply it ensuring it's correct.

-- One common issue: `auth.uid()` is the UUID of the user in `auth.users`.
-- `doctors.profile_id` should match this.
-- However, sometimes `doctors.id` is used instead of `profile_id` depending on how `sender_id` is stored.
-- In `consultation_chats`, `sender_id` reflects `auth.uid()`?
-- Let's check the schema: `sender_id UUID REFERENCES auth.users(id)`. YES.

-- Refined Policy:
-- Allow SELECT if:
-- 1. User is the sender (sender_id = auth.uid()) - GOOD for seeing own messages.
-- 2. OR User is a participant in the appointment.

DROP POLICY IF EXISTS "Participants can view chat" ON consultation_chats;

CREATE POLICY "Participants can view chat" ON consultation_chats 
FOR SELECT 
USING (
    sender_id = auth.uid() -- Can always see own messages
    OR
    EXISTS (
        SELECT 1 FROM appointments 
        LEFT JOIN patients ON appointments.patient_id = patients.id 
        LEFT JOIN doctors ON appointments.doctor_id = doctors.id 
        WHERE appointments.id = consultation_chats.appointment_id 
        AND (patients.profile_id = auth.uid() OR doctors.profile_id = auth.uid())
    )
);

-- Ensure Realtime is enabled properly.
-- Sometimes `ALTER PUBLICATION` needs to be run again or checked.
-- ALTER PUBLICATION supabase_realtime ADD TABLE consultation_chats;
-- (It won't error if already added usually, but good to be sure)
