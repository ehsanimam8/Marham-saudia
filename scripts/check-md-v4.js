const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://znmnqvmcwjjtocbosgnr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubW5xdm1jd2pqdG9jYm9zZ25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg0NTc2MywiZXhwIjoyMDgwNDIxNzYzfQ.SSJNR6LF4DfEySQSE9AqKenYKW4TkYSwgCzZSLFnduM');

async function check() {
    const { error: insertError } = await supabase.from('medical_documents').insert({
        title: 'test',
        file_url: 'test',
        file_name: 'test',
        file_size_bytes: 0,
        file_type: 'test',
        document_type: 'lab_result',
        patient_id: 'edb3ab32-1fb3-4ab5-af2e-9b92fa2a9cc0' // A valid UUID from previous seed
    }).select();
    console.log('Insert error msg:', insertError ? insertError.message : 'Success');
}

check();
