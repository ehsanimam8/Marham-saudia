
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables. Check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function activateDoctor(email: string) {
    console.log(`Finding user with email: ${email}`);

    // 1. Get User ID from Auth (Admin API not strictly needed if we query by email but safer)
    // Actually, we can just query the profiles table if email is there, but email is in auth.users.
    // Administrative `listUsers` is best.

    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('Error listing users:', userError);
        return;
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
        console.error(`User with email ${email} not found.`);
        return;
    }

    console.log(`Found user ID: ${user.id}`);

    // 2. Update 'doctors' table
    const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .update({ verification_status: 'approved' })
        .eq('user_id', user.id)
        .select()
        .single();

    if (doctorError) {
        console.error('Error updating doctor status:', doctorError);
        return;
    }

    console.log('Success! Doctor account activated.');
    console.log(doctor);
}

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email address as an argument.');
} else {
    activateDoctor(email);
}
