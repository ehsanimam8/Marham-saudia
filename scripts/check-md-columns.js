const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://znmnqvmcwjjtocbosgnr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubW5xdm1jd2pqdG9jYm9zZ25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg0NTc2MywiZXhwIjoyMDgwNDIxNzYzfQ.SSJNR6LF4DfEySQSE9AqKenYKW4TkYSwgCzZSLFnduM');

async function check() {
    const { data, error } = await supabase.rpc('exec_sql', {
        sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'medical_documents'"
    });

    if (error) {
        console.error('Error:', error);
        // Fallback: try to just select one and check keys
        const { data: rows } = await supabase.from('medical_documents').select('*').limit(1);
        if (rows && rows.length > 0) {
            console.log('Columns from data:', Object.keys(rows[0]));
        } else {
            console.log('No data and RPC failed.');
        }
    } else {
        console.log('Columns:', JSON.stringify(data, null, 2));
    }
}

check();
