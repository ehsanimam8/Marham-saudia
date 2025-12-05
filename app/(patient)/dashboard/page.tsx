import { Calendar, Clock, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getPatientAppointments } from '@/lib/api/appointments';
import { format, isAfter, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Check Role
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (profile?.role === 'doctor') {
        redirect('/doctor/dashboard');
    }

    // Get Patient Record
    const { data: patient } = await supabase.from('patients').select('id').eq('profile_id', user.id).single();

    if (!patient) {
        // Should ideally Create patient record or show error
        return <div>لم يتم العثور على ملف المريض. يرجى التواصل مع الدعم.</div>;
    }

    // Fetch Data
    const appointments = await getPatientAppointments(supabase, patient.id);

    // Calculate Stats
    const now = new Date();
    const upcomingApps = appointments.filter((a: any) => {
        const appDate = parseISO(`${a.appointment_date}T${a.start_time}`);
        return isAfter(appDate, now) && a.status !== 'cancelled';
    });

    const completedApps = appointments.filter((a: any) => a.status === 'completed');

    const nextApp = upcomingApps[0]; // Appointments are already sorted by date ASC in API

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">مرحباً، {profile.full_name_ar || 'زائر'} 👋</h1>
                <p className="text-gray-500 mt-1">هنا نظرة عامة على حالتك الصحية ومواعيدك القادمة</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">المواعيد القادمة</p>
                            <p className="text-2xl font-bold text-gray-900">{upcomingApps.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">التقارير الطبية</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">الزيارات المكتملة</p>
                            <p className="text-2xl font-bold text-gray-900">{completedApps.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Appointment Card */}
            {nextApp ? (
                <div className="bg-gradient-to-br from-teal-600 to-pink-600 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                                <Clock className="w-4 h-4" />
                                الموعد القادم: {format(parseISO(nextApp.appointment_date), 'EEEE d MMMM', { locale: ar })} - {nextApp.start_time.slice(0, 5)}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">استشارة مع د. {nextApp.doctors?.profiles?.full_name_ar}</h2>
                            <p className="text-teal-100">{nextApp.consultation_type === 'video' ? 'استشارة فيديو' : 'زيارة عيادة'} • {nextApp.doctors?.specialty}</p>
                        </div>
                        <Link href={`/appointments/${nextApp.id}`}>
                            <Button className="bg-white text-teal-600 hover:bg-gray-50 border-0" size="lg">
                                تفاصيل الموعد
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد مواعيد قادمة</h3>
                    <p className="text-gray-500 mb-6">يمكنك حجز موعد جديد مع نخبة من أفضل الأطباء</p>
                    <Link href="/doctors">
                        <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                            احجزي موعد الآن
                        </Button>
                    </Link>
                </div>
            )}

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
                    <div className="space-y-3">
                        <Link href="/doctors" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-700">حجز موعد جديد</span>
                            <span className="text-gray-400">←</span>
                        </Link>
                        <Link href="/patient/appointments" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-700">سجل المواعيد</span>
                            <span className="text-gray-400">←</span>
                        </Link>
                        <Link href="/patient/settings" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-700">تحديث الملف الشخصي</span>
                            <span className="text-gray-400">←</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">نصائح صحية لك</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">🤰</div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">أهمية الفيتامينات أثناء الحمل</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">تعرفي على أهم الفيتامينات والمعادن التي تحتاجينها لضمان صحتك وصحة جنينك.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">🧘‍♀️</div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">تمارين رياضية آمنة</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">دليل شامل للتمارين الرياضية المناسبة لكل مرحلة من مراحل حياتك.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
