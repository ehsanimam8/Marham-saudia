
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

async function ensureAdmin() {
    const email = 'admin@marham.sa';
    const password = 'password123';

    console.log(`Checking admin: ${email}`);

    // Try to sign in first to check existence
    const supabasePublic = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: loginData } = await supabasePublic.auth.signInWithPassword({
        email,
        password
    });

    let userId = loginData.user?.id;

    if (!userId) {
        console.log('Admin not found, creating...');
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: 'System Admin',
                role: 'admin',
                full_name_ar: 'مدير النظام'
            }
        });

        if (error) {
            console.error('❌ Admin Creation Failed:', error);
            return;
        }
        userId = data.user.id;
        console.log('✅ Admin Created:', userId);
    } else {
        console.log('ℹ️ Admin exists:', userId);
    }

    // Verify Profile Role
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profile) {
        if (profile.role !== 'admin') {
            console.log('Updating admin role...');
            await supabaseAdmin.from('profiles').update({ role: 'admin' }).eq('id', userId);
        } else {
            console.log('✅ Admin profile role is correct.');
        }
    } else {
        console.log('Creating admin profile...');
        await supabaseAdmin.from('profiles').insert({
            id: userId,
            role: 'admin',
            full_name_ar: 'مدير النظام'
        });
    }
}

ensureAdmin();
