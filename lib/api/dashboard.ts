
// import { supabase } from '@/lib/supabase'; // Removed implicit client

export interface DashboardStats {
    appointmentsToday: number;
    totalPatients: number;
    rating: number;
    earningsMonth: number;
}

export async function getDoctorStats(supabase: any, doctorId: string): Promise<DashboardStats> {
    // 1. Appointments Today
    const today = new Date().toISOString().split('T')[0];
    const { count: appointmentsToday } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('appointment_date', today);

    // 2. Total Patients (Unique patients for this doctor)
    // This is tricky with simple count, but let's approximate or use a separate query
    // For MVP, lets just count total appointments as a proxy or use a simple distinct query if possible
    // Supabase JS doesn't do distinct count easily without RPC. 
    // Let's count all appointments for now as "Total Consultations" or similar.
    const { count: totalPatients } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId);

    // 3. Rating
    const { data: doctor } = await supabase
        .from('doctors')
        .select('rating')
        .eq('id', doctorId)
        .single();

    // 4. Earnings this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const startString = startOfMonth.toISOString().split('T')[0];

    const { data: earningsData } = await supabase
        .from('earnings')
        .select('doctor_earnings')
        .eq('doctor_id', doctorId)
        .gte('created_at', startString);

    const earningsMonth = earningsData?.reduce((sum: number, item: any) => sum + Number(item.doctor_earnings), 0) || 0;

    return {
        appointmentsToday: appointmentsToday || 0,
        totalPatients: totalPatients || 0,
        rating: doctor?.rating || 0,
        earningsMonth: earningsMonth
    };
}

export async function getDoctorAppointments(supabase: any, doctorId: string) {
    const { data } = await supabase
        .from('appointments')
        .select(`
            *,
            patients (
                *,
                profiles (full_name_ar, full_name_en)
            )
        `)
        .eq('doctor_id', doctorId)
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .limit(5);

    return data || [];
}

export async function getDoctorReviews(supabase: any, doctorId: string) {
    const { data } = await supabase
        .from('reviews')
        .select(`
            *,
            patients (
                profiles (full_name_ar)
            )
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false })
        .limit(5);

    return data || [];
}
