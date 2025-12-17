const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data, error } = await supabase
        .from('followup_questions')
        .select('*')
        .limit(1);

    if (data && data.length > 0) console.log('Questions columns:', Object.keys(data[0]));
    else console.log('Questions table empty or error', error);

    // Check priorities existence
    const { error: pError } = await supabase.from('priorities').select('*').limit(1);
    if (pError) console.log('Priorities table error:', pError.message);
}

check();
