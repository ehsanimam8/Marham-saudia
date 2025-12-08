import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDoctorProfile } from '@/lib/api/doctors';
import { getDoctorStats, getDoctorAppointments, getDoctorReviews } from '@/lib/api/dashboard';
import DoctorStats from '@/components/doctor-portal/dashboard/DoctorStats';
import UpcomingAppointments from '@/components/doctor-portal/dashboard/UpcomingAppointments';
import RecentReviews from '@/components/doctor-portal/dashboard/RecentReviews';

export default async function DoctorDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const doctor = await getDoctorProfile(supabase, user.id);

    if (!doctor) {
        // User is logged in but not a doctor or profile not created
        redirect('/doctor-portal/register');
    }

    const [stats, appointments, reviews] = await Promise.all([
        getDoctorStats(supabase, doctor.id),
        getDoctorAppointments(supabase, doctor.id),
        getDoctorReviews(supabase, doctor.id),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    مرحباً، د. {doctor.profiles.full_name_ar} 👋
                </h1>
                <p className="text-gray-500 mt-1">إليك ملخص نشاطك اليوم</p>
            </div>

            <DoctorStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingAppointments appointments={appointments} />
                <RecentReviews reviews={reviews} />
            </div>
        </div>
    );
}
