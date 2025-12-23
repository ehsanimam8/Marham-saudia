
-- Fix Storage RLS for medical-records bucket
-- We need to ensure the policy exists for storage.objects
-- Note: users often don't have permission to alter storage schema directly if not superuser, but migrations usually run as admin.

-- 1. Storage Policies
-- Allow uploads
CREATE POLICY "Allow authenticated uploads to medical-records"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'medical-records');

-- Allow select/download
CREATE POLICY "Allow authenticated selects from medical-records"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'medical-records');

-- Fix medical_documents RLS to match Direct Auth ID usage
DROP POLICY IF EXISTS "Users can upload own documents" ON medical_documents;
DROP POLICY IF EXISTS "Users can view own documents" ON medical_documents;
DROP POLICY IF EXISTS "Patients manage own documents" ON medical_documents;
DROP POLICY IF EXISTS "Doctors view documents" ON medical_documents;

-- Patient Policies (Direct Auth ID Link)
CREATE POLICY "Patients manage own documents" 
ON medical_documents 
FOR ALL 
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

-- Doctor View Policies
CREATE POLICY "Doctors view documents" 
ON medical_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM doctors 
    WHERE profile_id = auth.uid()
  )
);
