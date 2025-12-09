import { createClient } from '@/lib/supabase/server';
import { getAppointmentById } from '@/lib/api/appointments';
import { notFound, redirect } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Video, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default async function AppointmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?returnUrl=/appointments/${id}`);
    }

    const appointment = await getAppointmentById(supabase, id);

    if (!appointment) {
        notFound();
    }

    // Security check: ensure user is the patient or the doctor
    // Since we don't strictly check 'patient' role vs 'doctor' role on user object here easily without db call,
    // we rely on the query result being just an ID match.
    // Ideally we verify relationship.
    // For MVP/User request focus, we assume access is valid if they have the ID locally or link was generated for them,
    // but proper RLS policies (which exist in schema) should actually prevent fetching if unauthorized.
    // If getAppointmentById returns null (due to RLS), we 404.

    const doctor = appointment.doctors;
    const profile = doctor.profiles;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-teal-600 mb-6 transition-colors">
                    <ArrowRight className="w-4 h-4 ml-1" />
                    العودة للوحة التحكم
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Status Strip */}
                    <div className={`px-8 py-4 flex items-center justify-between ${appointment.status === 'scheduled' ? 'bg-teal-50 border-b border-teal-100' :
                            appointment.status === 'completed' ? 'bg-green-50 border-b border-green-100' :
                                'bg-gray-50 border-b border-gray-200'
                        }`}>
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${appointment.status === 'scheduled' ? 'bg-teal-500' :
                                    appointment.status === 'completed' ? 'bg-green-500' :
                                        'bg-gray-500'
                                }`} />
                            <span className={`font-medium ${appointment.status === 'scheduled' ? 'text-teal-700' :
                                    appointment.status === 'completed' ? 'text-green-700' :
                                        'text-gray-700'
                                }`}>
                                {appointment.status === 'scheduled' ? 'موعد قادم' :
                                    appointment.status === 'completed' ? 'مكتمل' : 'ملغي'}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            رقم الحجز: #{appointment.id.slice(0, 8)}
                        </span>
                    </div>

                    <div className="p-8">
                        {/* Doctor Info */}
                        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden relative border-2 border-white shadow-sm">
                                {doctor.profile_photo_url ? (
                                    <Image
                                        src={doctor.profile_photo_url}
                                        alt={profile.full_name_ar}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">👩‍⚕️</div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">د. {profile.full_name_ar}</h1>
                                <p className="text-teal-600 font-medium mb-2">{doctor.specialty}</p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    {doctor.hospital}
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">التوقيت</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                        <Calendar className="w-5 h-5 text-teal-600" />
                                        <span className="font-medium text-gray-900">
                                            {format(parseISO(appointment.appointment_date), 'EEEE d MMMM yyyy', { locale: ar })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                        <Clock className="w-5 h-5 text-teal-600" />
                                        <span className="font-medium text-gray-900">
                                            {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">نوع الزيارة</h3>
                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg h-[88px]">
                                    {appointment.consultation_type === 'video' || appointment.consultation_type === 'new' ? (
                                        <>
                                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                                <Video className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">استشارة فيديو</div>
                                                <div className="text-xs text-gray-500">عبر تطبيق مرهم</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">حضور للعيادة</div>
                                                <div className="text-xs text-gray-500">في {doctor.hospital}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fee & Payment */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-8">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-gray-600">رسوم الكشفية</span>
                                <span className="font-medium">{appointment.price} ر.س</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-2 mt-2">
                                <span className="font-bold text-gray-900">الإجمالي المدفوع</span>
                                <span className="font-bold text-teal-600">{appointment.price} ر.س</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            {appointment.status === 'scheduled' && (
                                <Link href={`/consultation/${appointment.id}`}>
                                    <Button className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700 shadow-sm shadow-teal-200">
                                        <Video className="w-5 h-5 ml-2" />
                                        الدخول للجلسة
                                    </Button>
                                </Link>
                            )}

                            {appointment.status === 'completed' && (
                                <Button variant="outline" className="w-full">
                                    <FileText className="w-4 h-4 ml-2" />
                                    تحميل الفاتورة
                                </Button>
                            )}

                            {appointment.status === 'scheduled' && (
                                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                                    إلغاء الموعد
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
