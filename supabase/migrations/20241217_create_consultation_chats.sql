
-- Create consultation_chats table
CREATE TABLE IF NOT EXISTS consultation_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable if system message?
    sender_role TEXT CHECK (sender_role IN ('doctor', 'patient', 'system')),
    message TEXT,
    is_file BOOLEAN DEFAULT false,
    file_url TEXT,
    file_type TEXT,
    file_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE consultation_chats ENABLE ROW LEVEL SECURITY;

-- Policies
-- We need to check if user is participant.
-- Simplify for now to: Users can access chats for appointments they are part of.

CREATE POLICY "Participants can view chat" ON consultation_chats 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM appointments 
        LEFT JOIN patients ON appointments.patient_id = patients.id 
        LEFT JOIN doctors ON appointments.doctor_id = doctors.id 
        WHERE appointments.id = consultation_chats.appointment_id 
        AND (patients.profile_id = auth.uid() OR doctors.profile_id = auth.uid())
    )
);

CREATE POLICY "Participants can insert chat" ON consultation_chats 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM appointments 
        LEFT JOIN patients ON appointments.patient_id = patients.id 
        LEFT JOIN doctors ON appointments.doctor_id = doctors.id 
        WHERE appointments.id = consultation_chats.appointment_id 
        AND (patients.profile_id = auth.uid() OR doctors.profile_id = auth.uid())
    )
);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE consultation_chats;
