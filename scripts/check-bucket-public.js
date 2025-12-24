const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://znmnqvmcwjjtocbosgnr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubW5xdm1jd2pqdG9jYm9zZ25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg0NTc2MywiZXhwIjoyMDgwNDIxNzYzfQ.SSJNR6LF4DfEySQSE9AqKenYKW4TkYSwgCzZSLFnduM');

async function check() {
    const { data, error } = await supabase.storage.getBucket('medical-records');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Bucket:', data.name, 'Public:', data.public);
    }
}
check();
