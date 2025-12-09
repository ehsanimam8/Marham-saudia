
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

async function testUserCreation() {
    const email = `test_patient_${Date.now()}@test.com`;
    console.log(`Attempting to create user: ${email}`);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true,
        user_metadata: {
            full_name: 'Test Patient Random',
            role: 'patient'
        }
    });

    if (error) {
        console.error('❌ Creation Failed:', error);
    } else {
        console.log('✅ User Created:', data.user.id);
    }
}

testUserCreation();
