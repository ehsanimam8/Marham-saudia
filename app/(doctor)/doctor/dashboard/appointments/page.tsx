import { createClient } from '@/lib/supabase/server';
import { getDoctorProfile } from '@/lib/api/doctors';
import { redirect } from 'next/navigation';
import { Calendar, Clock, Video, User } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function AppointmentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const doctor = await getDoctorProfile(supabase, user.id);
    if (!doctor) redirect('/doctor/register');

    // Fetch All Appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
            *,
            patients (
                *,
                profiles (full_name_ar)
            )
        `)
        .eq('doctor_id', doctor.id)
        .order('appointment_date', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">سجل المواعيد</h1>
                <p className="text-gray-500 mt-1">جميع المواعيد القادمة والسابقة</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {!appointments || appointments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        لا توجد مواعيد مسجلة
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-xs text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-right">المريض</th>
                                    <th className="px-6 py-4 text-right">التاريخ والوقت</th>
                                    <th className="px-6 py-4 text-center">النوع</th>
                                    <th className="px-6 py-4 text-center">الحالة</th>
                                    <th className="px-6 py-4 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((apt: any) => (
                                    <tr key={apt.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xs">
                                                    {apt.patients?.profiles?.full_name_ar?.[0] || 'م'}
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    {apt.patients?.profiles?.full_name_ar || 'مريض غير معروف'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(apt.appointment_date), 'd MMMM yyyy', { locale: arSA })}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {apt.start_time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline">
                                                {apt.consultation_type === 'new' ? 'جديد' : 'متابعة'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge className={
                                                apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                                                    apt.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                        'bg-red-100 text-red-700 hover:bg-red-100'
                                            }>
                                                {apt.status === 'scheduled' ? 'مجدول' :
                                                    apt.status === 'completed' ? 'مكتمل' : 'ملغي'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {apt.status === 'scheduled' && (
                                                <Link
                                                    href={`/consultation/${apt.id}`}
                                                    className="inline-flex items-center gap-1 text-xs bg-teal-600 text-white px-3 py-1.5 rounded-full hover:bg-teal-700 transition-colors"
                                                >
                                                    <Video className="w-3 h-3" />
                                                    دخول
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
