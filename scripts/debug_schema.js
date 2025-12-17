const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
    console.log('Checking table schema...');

    // Check symptoms table columns
    const { data: symptomsCols, error: symptomsError } = await supabase.rpc('exec_sql', {
        sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'symptoms';"
    });

    // Since exec_sql returns void (or we can't easily capture output unless we modify it), 
    // let's just try to select * from symptoms limit 1 to see if it errors.

    try {
        const { data, error } = await supabase.from('symptoms').select('concern_id').limit(1);
        if (error) {
            console.error('Error selecting concern_id from symptoms:', error);
        } else {
            console.log('Successfully selected concern_id from symptoms. Column exists.');
        }
    } catch (e) {
        console.error('Exception checking symptoms:', e);
    }

    try {
        const { data, error } = await supabase.from('treatments').select('concern_id').limit(1);
        if (error) {
            console.error('Error selecting concern_id from treatments:', error);
        } else {
            console.log('Successfully selected concern_id from treatments. Column exists.');
        }
    } catch (e) {
        console.error('Exception checking treatments:', e);
    }
}

checkSchema();
