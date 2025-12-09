
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    console.log('Checking profiles table...');
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
    if (pError) console.error('Profiles Error:', pError);
    else console.log('Profiles Data:', profiles);

    console.log('Checking patients table...');
    const { data: patients, error: ptError } = await supabase.from('patients').select('*').limit(1);
    if (ptError) console.error('Patients Error:', ptError);
    else console.log('Patients Data:', patients);

    // Attempt to call the trigger function directly? No, it's a trigger function.
}

check();
