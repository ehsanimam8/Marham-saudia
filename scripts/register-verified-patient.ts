
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function registerAndVerify() {
    const email = 'telemed_patient_final@test.com';
    const password = 'password123';

    console.log(`Attempting to create user: ${email}`);

    // Clean up if exists (best effort) - we can't easily delete from auth without ID.
    // We'll just try to create. 

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: 'Test Patient Final',
            role: 'patient',
            full_name_ar: 'مريض نهائي'
        }
    });

    if (error) {
        console.error('❌ Creation Failed:', error);
        return;
    }

    console.log('✅ User Created:', data.user.id);
    const userId = data.user.id;

    // Verify Profile
    const { data: profile, error: pError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (pError) console.error('Profile Check Error:', pError);
    else console.log('✅ Profile found:', profile);

    // Verify Patient Record
    const { data: patient, error: ptError } = await supabaseAdmin
        .from('patients')
        .select('*')
        .eq('profile_id', userId)
        .single();

    if (ptError) console.error('Patient Check Error:', ptError);
    else console.log('✅ Patient record found:', patient);
}

registerAndVerify();
