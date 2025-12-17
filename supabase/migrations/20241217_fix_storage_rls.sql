
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

-- 2. Fix medical_documents RLS (Fixing the ID mismatch issue)
DROP POLICY IF EXISTS "Users can upload own documents" ON medical_documents;
DROP POLICY IF EXISTS "Users can view own documents" ON medical_documents;

CREATE POLICY "Users can upload own documents" 
ON medical_documents FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT profile_id FROM patients WHERE id = medical_documents.patient_id
  )
);

CREATE POLICY "Users can view own documents" 
ON medical_documents FOR SELECT 
USING (
  auth.uid() IN (
    SELECT profile_id FROM patients WHERE id = medical_documents.patient_id
  )
);
