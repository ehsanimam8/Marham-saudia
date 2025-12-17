"use server";

import { createClient } from '@/lib/supabase/server';

export async function getAdminConsultations() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            doctor:doctors (
                id,
                profile:profiles(full_name_ar, full_name_en, avatar_url),
                specialty
            ),
            patient:patients (
                id,
                profile:profiles(full_name_ar, full_name_en, avatar_url)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin consultations:', error);
        return [];
    }

    return data || [];
}

/**
 * Get stats specifically for the consultations page
 * (This is a simplified version of what might be in admin-analytics)
 */
export async function getConsultationStats() {
    const supabase = await createClient();

    // Just some basic counts for now
    const { count: total } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
    const { count: completed } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed');
    const { count: cancelled } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'cancelled');

    return {
        total: total || 0,
        completed: completed || 0,
        cancelled: cancelled || 0
    };
}
