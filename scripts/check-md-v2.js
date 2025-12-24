const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://znmnqvmcwjjtocbosgnr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubW5xdm1jd2pqdG9jYm9zZ25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg0NTc2MywiZXhwIjoyMDgwNDIxNzYzfQ.SSJNR6LF4DfEySQSE9AqKenYKW4TkYSwgCzZSLFnduM');

async function check() {
    // Try to insert a record with an invalid UUID for patient_id to get a schema error or just see if it works
    // Actually, let's just try to select everything from one row but with JSON output
    const { data, error } = await supabase.from('medical_documents').select('*').limit(1);
    if (data && data.length > 0) {
        console.log('Columns found in first row:', Object.keys(data[0]));
    } else {
        // Try to insert with all columns I suspect and see if it fails due to MISSING columns
        const { error: insertError } = await supabase.from('medical_documents').insert({}).select();
        console.log('Insert error msg:', insertError.message);
    }
}

check();
