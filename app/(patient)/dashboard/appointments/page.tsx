import AppointmentsList from '@/components/patient/dashboard/AppointmentsList';
import { createClient } from '@/lib/supabase/server';
import { getPatientAppointments } from '@/lib/api/appointments';
import { redirect } from 'next/navigation';

export default async function AppointmentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect('/login');

    const { data: patient } = await supabase.from('patients').select('id').eq('profile_id', user.id).single() as any;

    if (!patient) return <div>No patient profile found.</div>;

    const appointments = await getPatientAppointments(supabase, patient.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">مواعيدي</h1>
                <p className="text-gray-500 mt-1">إدارة مواعيدك الحالية والسابقة</p>
            </div>

            <AppointmentsList appointments={appointments} />
        </div>
    );
}
