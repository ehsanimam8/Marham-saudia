"use server";

import { createClient } from '@/lib/supabase/server';

export async function getAdminConsultations() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('appointments')
        .select(`
            id,
            appointment_date,
            start_time,
            end_time,
            status,
            type,
            notes,
            created_at,
            doctor:doctor_id (
                id,
                specialty,
                hospital,
                profiles (
                   full_name_ar,
                   full_name_en
                )
            ),
            patient:patient_id (
                id,
                profiles (
                   full_name_ar,
                   full_name_en,
                   email
                )
            )
        `)
        .order('appointment_date', { ascending: false });

    if (error) {
        console.error('Error fetching admin consultations:', error);
        return [];
    }

    return data;
}

export async function getConsultationStats() {
    const supabase = await createClient();

    // In a real app we'd use robust aggregation queries or RPCs.
    // For MVP, we fetch lightweight count or raw data for small datasets.

    // Total Consultations
    const { count: total } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

    // Positive (Completed)
    const { count: completed } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

    // 5 Stars Reviews (Assuming reviews table linked to appointments or doctors)
    // We haven't built a review table linked to specific appointments yet, 
    // but we can query doctor reviews if we implement that.

    return {
        total: total || 0,
        completed: completed || 0,
        positivePercentage: total ? Math.round(((completed || 0) / total) * 100) : 0,
        averageRating: 4.8 // Mock for now until Reviews table is strictly linked
    };
}
