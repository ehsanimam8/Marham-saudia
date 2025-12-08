import { createClient } from '@/lib/supabase/server';
import { getDoctorProfile } from '@/lib/api/doctors';
import { redirect } from 'next/navigation';
import { User, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

export default async function PatientsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const doctor = await getDoctorProfile(supabase, user.id);
    if (!doctor) redirect('/doctor-portal/register');

    // Fetch Unique Patients via Appointments
    // This is a bit complex in standard SQL without DISTINCT ON helpers, 
    // so we fetch appointments and deduplicate in JS for MVP simplicity/robustness.
    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
            patient_id,
            patients (
                *,
                profiles (full_name_ar, phone, city)
            ),
            appointment_date
        `)
        .eq('doctor_id', doctor.id)
        .order('appointment_date', { ascending: false });

    // Deduplicate
    const patientsMap = new Map();
    appointments?.forEach((apt: any) => {
        if (!patientsMap.has(apt.patient_id)) {
            patientsMap.set(apt.patient_id, {
                ...apt.patients,
                lastVisit: apt.appointment_date,
                visitCount: 1 // We could count properly but logic is harder here
            });
        }
    });

    const patients = Array.from(patientsMap.values());

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">ملفات المرضى</h1>
                <p className="text-gray-500 mt-1">قائمة المرضى الذين قاموا بزيارتك</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!patients || patients.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                        لا يوجد مرضى حتى الآن
                    </div>
                ) : (
                    patients.map((patient: any) => (
                        <div key={patient.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-lg">
                                    {patient.profiles?.full_name_ar?.[0] || 'م'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{patient.profiles?.full_name_ar}</h3>
                                    <p className="text-sm text-gray-500">{patient.profiles?.city || 'غير محدد'}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{patient.profiles?.phone || 'لا يوجد هاتف'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>آخر زيارة: {format(new Date(patient.lastVisit), 'd MMMM yyyy', { locale: arSA })}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
