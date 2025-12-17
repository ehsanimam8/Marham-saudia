const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('body_parts')
        .select('*')
        .limit(1);

    if (error) {
        console.error(error);
    } else {
        if (data.length > 0) console.log(Object.keys(data[0]));
        else console.log('No data in body_parts to infer columns');
    }
}

check();
