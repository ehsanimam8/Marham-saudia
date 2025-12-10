
import { createClient } from '@/lib/supabase/server';
import ConsultationsDashboard from '@/components/admin/ConsultationsDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminConsultationsPage() {
    const supabase = await createClient();

    // Fetch consultations (appointments)
    const { data: consultations } = await supabase
        .from('appointments')
        .select(`
            *,
            doctor:doctor_id (
                *,
                profiles:profile_id (*)
            ),
            patient:patient_id (
                *,
                profiles:profile_id (*)
            )
        `)
        .order('appointment_date', { ascending: false });

    // Calculate dummy stats for now or real ones
    const total = consultations?.length || 0;
    const completed = consultations?.filter((c: any) => c.status === 'completed').length || 0;

    // Mock advanced stats
    const stats = {
        overview: {
            total: total,
            completed: completed,
            resolutionRate: 85,
            positiveRate: 92,
            avgEmpathy: 4.8
        },
        leaderboard: [] // Populate if needed
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">سجل الاستشارات</h1>
                <p className="text-gray-500 mt-1">متابعة جميع الاستشارات الطبية والحالات</p>
            </div>

            <ConsultationsDashboard consultations={consultations || []} stats={stats} />
        </div>
    );
}
