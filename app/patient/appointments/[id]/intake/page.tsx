import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import IntakeForm from '@/components/patient/intake/IntakeForm';
import { ShieldCheck } from 'lucide-react';

export default async function IntakePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Await params
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=/patient/appointments/${id}/intake`);
    }

    // Verify appointment ownership
    const { data: appointment, error } = await supabase
        .from('appointments')
        .select('*, doctor:doctors(profile:profiles(full_name_ar))')
        .eq('id', id)
        .eq('patient_id', (await supabase.from('patients').select('id').eq('profile_id', user.id).single()).data?.id)
        .single();

    // Note: The above query logic for patient_id depends on schema.
    // Existing schema: appointments.patient_id is FK to patients table.
    // So we need to find patient record for current auth user.
    // Alternative: join patients table.

    // Let's optimize query:
    const { data: patientRecord } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (!patientRecord) {
        // Should not happen for logged in patient, but safety check
        redirect('/dashboard');
    }

    const { data: validAppointment } = await supabase
        .from('appointments')
        .select(`
            id, 
            appointment_date, 
            start_time,
            doctor:doctors (
                profile:profiles (
                    full_name_ar
                )
            )
        `)
        .eq('id', id)
        .eq('patient_id', patientRecord.id)
        .single();

    if (!validAppointment) {
        // Appointment not found or doesn't belong to patient
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                    <h1 className="text-xl font-bold text-red-600 mb-2">عذراً، لا يمكن الوصول لهذا الموعد</h1>
                    <p className="text-gray-500">تأكدي من صحة الرابط أو أن الموعد يخصك.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4 text-teal-600">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">نموذج المعلومات الطبية</h1>
                <p className="text-gray-600">
                    استشارتك مع <span className="font-semibold text-teal-600">د. {validAppointment.doctor?.profile?.full_name_ar}</span>
                </p>
                <div className="mt-2 inline-block bg-white px-4 py-1 rounded-full text-sm text-gray-500 border border-gray-200">
                    📅 {validAppointment.appointment_date} • ⏰ {validAppointment.start_time}
                </div>
            </div>

            <IntakeForm
                appointmentId={id}
                patientId={user.id}
            />
        </div>
    );
}
