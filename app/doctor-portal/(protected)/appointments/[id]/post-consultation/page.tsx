import { redirect } from 'next/navigation';
import { getConsultationData } from '@/app/actions/consultation';
import PostConsultationForm from '@/components/doctor-portal/appointments/PostConsultationForm';
import { FileCheck } from 'lucide-react';

export default async function PostConsultationPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    let data;
    try {
        data = await getConsultationData(id);
    } catch (error) {
        redirect('/doctor-portal/dashboard');
    }

    // Verify role is doctor
    if (data.userRole !== 'doctor') {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">إنهاء الاستشارة وإصدار الوصفة</h1>
                        <p className="text-sm text-gray-500">
                            المريض: {data.appointment.patient.profile.full_name_ar} • التاريخ: {new Date().toLocaleDateString('ar-SA')}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6">
                <PostConsultationForm
                    appointmentId={id}
                    doctorId={data.currentUser.id}
                    patientId={data.appointment.patient.profile.id}
                    patientName={data.appointment.patient.profile.full_name_ar}
                    doctorName={data.appointment.doctor.profile.full_name_ar}
                />
            </main>
        </div>
    );
}
