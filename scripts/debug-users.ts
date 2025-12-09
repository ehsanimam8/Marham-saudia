
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Admin client to bypass RLS and Create Users
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

// We define minimal metadata since `listUsers` usually paginates 50 items which should cover us.
// But if paginated, we need loops.

async function debugUsers() {
    console.log('Listing users...');
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error("List users error:", error);
        return;
    }

    console.log(`Found ${users.length} users.`);
    users.forEach(u => console.log(`- ${u.email} (${u.id})`));
}

debugUsers();
