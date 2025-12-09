"use server";

import { createClient } from '@/lib/supabase/server';

// Advanced function to get the "Growth & Quality" dashboard data
export async function getDetailedConsultationStats() {
    const supabase = await createClient();

    // 1. Basic Counts
    const { count: totalAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
    const { count: completedAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed');

    // 2. Quality Metrics (from Reviews)
    const { data: reviews } = await supabase
        .from('reviews')
        .select('rating, empathy_rating, privacy_rating') as any;

    let avgRating = 0;
    let avgEmpathy = 0;
    let fiveStarCount = 0;

    if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
        const totalEmpathy = reviews.reduce((acc: number, r: any) => acc + (r.empathy_rating || 0), 0);
        fiveStarCount = reviews.filter((r: any) => r.rating === 5).length;

        avgRating = totalRating / reviews.length;
        avgEmpathy = totalEmpathy / reviews.length;
    }

    // 3. Efficiency Metrics (from Outcomes)
    // How many cases were "Resolved" vs "Follow up"?
    const { data: outcomes } = await supabase
        .from('consultation_outcomes')
        .select('outcome_status') as any;

    let resolvedCount = 0;
    if (outcomes) {
        resolvedCount = outcomes.filter((o: any) => o.outcome_status === 'resolved').length;
    }

    // 4. Doctor Performance Leaderboard
    // Who is doing the most consultations and getting best ratings?
    // This requires a more complex query. For MVP admin dashboard, we can fetch all doctors and aggregate manually or use RPC.
    // Fetch top 5 doctors by appointment count
    const { data: topDoctors } = await supabase
        .from('doctors')
        .select(`
            id,
            profiles(full_name_ar),
            specialty,
            appointments:appointments(count),
            reviews:reviews(rating)
        `)
        .eq('status', 'approved')
        .limit(5);

    // Process top doctors data
    const leaderboard = topDoctors?.map((d: any) => {
        const appointmentCount = d.appointments?.[0]?.count || 0;
        const ratings = d.reviews || [];
        const avg = ratings.length > 0
            ? ratings.reduce((a: number, b: any) => a + b.rating, 0) / ratings.length
            : 0;

        return {
            id: d.id,
            name: d.profiles?.full_name_ar,
            specialty: d.specialty,
            consultations: appointmentCount,
            rating: avg.toFixed(1)
        };
    }).sort((a, b) => b.consultations - a.consultations) || [];


    return {
        overview: {
            total: totalAppointments || 0,
            completed: completedAppointments || 0,
            positiveRate: reviews?.length ? Math.round((fiveStarCount / reviews.length) * 100) : 0,
            resolutionRate: outcomes?.length ? Math.round((resolvedCount / outcomes.length) * 100) : 0,
            avgEmpathy: avgEmpathy.toFixed(1) // "Did they feel heard?" metric
        },
        leaderboard
    };
}
