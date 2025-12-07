-- Create a bucket for patient records if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('patient_records', 'patient_records', false)
ON CONFLICT (id) DO NOTHING;

-- Create patient_records table
CREATE TABLE IF NOT EXISTS patient_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    record_type TEXT NOT NULL CHECK (record_type IN ('prescription', 'lab_result', 'imaging', 'report', 'other')),
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    description TEXT,
    record_date DATE DEFAULT CURRENT_DATE,
    ai_status TEXT DEFAULT 'pending' CHECK (ai_status IN ('pending', 'analyzed', 'failed')),
    ai_summary TEXT, -- Stores the AI analysis result later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;

-- Policies for patient_records
CREATE POLICY "Patients can view own records" ON patient_records
    FOR SELECT USING (
        auth.uid() IN (SELECT profile_id FROM patients WHERE id = patient_records.patient_id)
    );

CREATE POLICY "Patients can insert own records" ON patient_records
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT profile_id FROM patients WHERE id = patient_records.patient_id)
    );

CREATE POLICY "Patients can delete own records" ON patient_records
    FOR DELETE USING (
        auth.uid() IN (SELECT profile_id FROM patients WHERE id = patient_records.patient_id)
    );

-- Storage Policies
CREATE POLICY "Patients can view own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'patient_records' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Patients can upload own files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'patient_records' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
