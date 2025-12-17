const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConcerns() {
    console.log('Checking medical_chest concerns...');
    const { data, error } = await supabase
        .from('primary_concerns')
        .select('id, name_en')
        .like('id', '%chest%')
        .limit(5);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Concerns found:', data);
    }
}

checkConcerns();
