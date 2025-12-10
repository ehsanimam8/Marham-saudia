DO $$ 
BEGIN
    -- 1. Ensure document_name column exists (New Schema)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_documents' AND column_name = 'document_name') THEN
        ALTER TABLE medical_documents ADD COLUMN document_name TEXT;
    END IF;

    -- 2. Ensure document_url column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_documents' AND column_name = 'document_url') THEN
        ALTER TABLE medical_documents ADD COLUMN document_url TEXT;
    END IF;

    -- 3. Ensure notes column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_documents' AND column_name = 'notes') THEN
        ALTER TABLE medical_documents ADD COLUMN notes TEXT;
    END IF;

    -- 4. Migrate data if 'title' exists but 'document_name' is empty
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_documents' AND column_name = 'title') THEN
        UPDATE medical_documents SET document_name = title WHERE document_name IS NULL;
    END IF;

    -- 5. Migrate data if 'file_url' exists but 'document_url' is empty
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_documents' AND column_name = 'file_url') THEN
        UPDATE medical_documents SET document_url = file_url WHERE document_url IS NULL;
    END IF;
    
    -- 6. Enforce NOT NULL on new columns if intended (after population)
    -- ALTER TABLE medical_documents ALTER COLUMN document_name SET NOT NULL;
    -- ALTER TABLE medical_documents ALTER COLUMN document_url SET NOT NULL;

END $$;
