
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const id = 'b55dd403-9614-4ae6-8a82-cb97bba93ad4';
    console.log(`Checking consultation files for ID: ${id}...`);

    const { data, error } = await supabase
        .from('pre_consultation_data')
        .select('created_at, uploaded_files')
        .eq('appointment_id', id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        if (data.length === 0) {
            console.log("No pre-consultation record found for this appointment.");
        } else {
            console.log(`Found ${data.length} records.`);
            data.forEach((record, idx) => {
                console.log(`Record ${idx + 1} (Created: ${record.created_at}):`);
                const files = record.uploaded_files;
                console.log(JSON.stringify(files, null, 2));
            });
        }
    }
}

check();
