'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function registerDoctor(formData: any) {
    const supabase = await createClient();

    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        specialty,
        licenseNumber,
        hospital,
        bio,
        documentUrls
    } = formData;

    // 1. Sign up the user
    // Note: In a real production app, you might want to use a service role to create users
    // without automatically signing them in, or handle email verification flow.
    // For this MVP, we'll use standard signUp.
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: `${firstName} ${lastName}`,
                role: 'doctor',
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: 'Failed to create user' };
    }

    const userId = authData.user.id;

    // 2. Create Profile (Trigger might handle this, but let's ensure extra data if needed)
    // The handle_new_user trigger creates the basic profile. We might need to update it
    // with phone if it wasn't in metadata.
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name_ar: `${firstName} ${lastName}`, // Assuming Arabic input for now
            phone: phone,
        })
        .eq('id', userId);

    if (profileError) {
        console.error('Profile update error:', profileError);
        // Continue anyway as profile exists
    }

    // 3. Create Doctor Record
    const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
            profile_id: userId,
            scfhs_license: licenseNumber,
            specialty: specialty,
            hospital: hospital,
            bio_ar: bio, // Assuming Arabic
            status: 'pending', // Pending approval
            // Store document URLs in a specific way or separate table?
            // For MVP schema, we might need a modifications to store docs, 
            // or just rely on them being in storage bucket with user metadata.
            // Let's check schema: qualifications is JSONB. We can store doc URLs there.
            qualifications: {
                documents: documentUrls
            }
        });

    if (doctorError) {
        console.error('Doctor creation error:', doctorError);
        return { error: 'Failed to create doctor profile: ' + doctorError.message };
    }

    return { success: true };
}
