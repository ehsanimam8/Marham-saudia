'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const next = formData.get('next') as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Provide more helpful error message for email confirmation
        if (error.message.includes('Email not confirmed')) {
            return {
                error: 'يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد الخاص بك.\nPlease confirm your email first. Check your inbox.'
            };
        }
        return { error: error.message };
    }

    // Self-healing: Ensure profile exists
    // The trigger might have failed for previous signups.
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();

        if (!profile) {
            console.log('⚠️ Profile missing for user:', user.id, '- creating now...');
            // Profile missing, create it
            // Try to get name from metadata
            const metaName = user.user_metadata.full_name || user.user_metadata.full_name_ar || email.split('@')[0];

            const { error: profileError } = await supabase.from('profiles').insert({
                id: user.id,
                full_name_ar: metaName, // defaulting to AR column for better support in this app
                role: 'patient'
            });

            if (profileError) {
                console.error('❌ Failed to create profile during login:', profileError);
            }

            // Also ensure patient record exists if role is patient
            const { error: patientError } = await supabase.from('patients').insert({
                profile_id: user.id
            });

            if (patientError) {
                console.error('❌ Failed to create patient record during login:', patientError);
            }
        }
    }

    revalidatePath('/', 'layout');

    // Return success with redirect URL instead of calling redirect()
    return {
        success: true,
        redirectTo: next && next.startsWith('/') ? next : '/'
    };
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;
    const next = formData.get('next') as string;

    console.log('🔵 Starting signup for:', email);

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
            data: {
                full_name: fullName, // For the trigger (maps to full_name_en)
                full_name_ar: fullName, // For our direct use
                role: 'patient', // REQUIRED for the trigger NOT NULL constraint
            },
        },
    });

    if (error) {
        console.error('❌ Auth signup error:', error);
        return { error: error.message };
    }

    console.log('✅ Auth user created:', authData.user?.id);

    // Force login after signup for better UX if auto-confirm is enabled
    // If email confirm is required, this won't work, but it doesn't hurt.
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (loginError) {
        console.error('⚠️ Auto-login failed (might need email confirmation):', loginError);
    }

    // Check/Create profile explicitly in case trigger failed
    // (Copy of the self-healing logic above, simplified)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        console.log('🔍 Checking if profile exists for user:', user.id);
        const { data: profile, error: profileCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (profileCheckError && profileCheckError.code !== 'PGRST116') {
            console.error('❌ Error checking profile:', profileCheckError);
        }

        if (!profile) {
            console.log('⚠️ Profile not found, creating manually...');

            const { error: profileError } = await supabase.from('profiles').insert({
                id: user.id,
                full_name_ar: fullName,
                role: 'patient'
            });

            if (profileError) {
                console.error('❌ Profile creation error:', profileError);
                return { error: 'Database error saving new user: ' + profileError.message };
            }

            console.log('✅ Profile created');

            const { error: patientError } = await supabase.from('patients').insert({
                profile_id: user.id
            });

            if (patientError) {
                console.error('❌ Patient record creation error:', patientError);
                return { error: 'Database error saving patient record: ' + patientError.message };
            }

            console.log('✅ Patient record created');
        } else {
            console.log('✅ Profile already exists (trigger worked)');
        }
    }

    console.log('🎉 Signup complete, redirecting...');
    revalidatePath('/', 'layout');

    // Return success with redirect URL instead of calling redirect()
    return {
        success: true,
        redirectTo: next && next.startsWith('/') ? next : '/'
    };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/auth/login');
}
