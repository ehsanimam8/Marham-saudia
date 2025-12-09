
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Client with Service Key (Admin)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Regular Client for Login check
const supabasePublic = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function seedPatient() {
    console.log('🌱 Starting Patient Seed (Robust Mode)...');

    const email = 'telemed_patient@test.com';
    const password = 'password123';
    let userId: string | null = null;

    // 1. Try Login first
    const { data: loginData, error: loginError } = await supabasePublic.auth.signInWithPassword({
        email,
        password
    });

    if (loginData.user) {
        console.log('✅ User already exists and login works. ID:', loginData.user.id);
        userId = loginData.user.id;
    } else {
        console.log('Login failed (likely user missing), attempting creation...');

        // 2. Create User via Admin
        const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'Test Patient', role: 'patient' }
        });

        if (createError) {
            console.error('Error creating user:', createError.message);
            // If error is "User already registered", we need the ID.
            // But we can't get it easily if Login failed and Create failed.
            // Maybe password was wrong? Update password.
            if (createError.message.includes('already registered')) {
                console.log('User exists but login failed. Updating password...');
                // We need the ID to update password. 
                // We can try to get ID by listing users again? Or assuming we can't?
                // Let's try listing JUST this user via filter if possible? 
                // listUsers doesn't support email filter directly in all versions.

                // Fallback: If we can't get ID, we can't fix it easily without raw SQL.
            }
            return;
        }

        if (createData.user) {
            console.log('✅ Created user:', createData.user.id);
            userId = createData.user.id;
        }
    }

    if (!userId) {
        console.error('❌ Could not obtain User ID.');
        return;
    }

    // 2. Profile
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
        id: userId,
        role: 'patient',
        full_name_ar: 'مريض تجربة',
        full_name_en: 'Test Patient',
        city: 'Riyadh'
    });

    if (profileError) console.error('Error upserting profile:', profileError);
    else console.log('✅ Profile upserted');

    // 3. Patient Record
    const { data: existingPatient } = await supabaseAdmin.from('patients').select('id').eq('profile_id', userId).single();

    if (!existingPatient) {
        const { error: patientError } = await supabaseAdmin.from('patients').insert({
            profile_id: userId,
            date_of_birth: '1990-01-01',
            blood_type: 'O+'
        });

        if (patientError) console.error('Error creating patient record:', patientError);
        else console.log('✅ Patient record created');
    } else {
        console.log('ℹ️ Patient record exists');
    }

    console.log('✨ Patient seed complete.');
}

seedPatient();
