import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DoctorPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/doctor-portal/login');
    }

    // Verify user is a doctor
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'doctor') {
        // Not a doctor - sign them out and redirect
        await supabase.auth.signOut();
        redirect('/doctor-portal/login?error=not_a_doctor');
    }

    // Check verification status
    const { data: doctorData } = await supabase
        .from('doctors')
        .select('verification_status, full_name')
        .eq('user_id', user.id)
        .single();

    if (!doctorData) {
        // redirect('/doctor-portal/login?error=no_doctor_record');
        // Allow access - maybe they need to complete profile?
        // But for now, let's redirect as per instructions
        redirect('/doctor-portal/login?error=no_doctor_record');
    }

    if (doctorData.verification_status === 'pending') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">طلبك قيد المراجعة</h2>
                    <p className="text-gray-600 mb-6">
                        شكراً لتسجيلك يا دكتورة {doctorData.full_name}. حسابك قيد المراجعة من قبل فريقنا وسنتواصل معك خلال 24-48 ساعة.
                    </p>
                    <form action={async () => {
                        'use server';
                        const sb = createClient();
                        await (await sb).auth.signOut();
                        redirect('/doctor-portal/login');
                    }}>
                        <button
                            className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                        >
                            تسجيل خروج
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (doctorData.verification_status === 'rejected') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">طلبك غير مقبول</h2>
                    <p className="text-gray-600 mb-6">
                        للأسف، تم رفض طلب تسجيلك. للمزيد من المعلومات، يرجى التواصل معنا على support@marham.sa
                    </p>
                    <form action={async () => {
                        'use server';
                        const sb = createClient();
                        await (await sb).auth.signOut();
                        redirect('/doctor-portal/login');
                    }}>
                        <button
                            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                        >
                            تسجيل خروج
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Approved doctor - show the portal
    return (
        <div className="min-h-screen bg-gray-50">
            {/* We'll add DoctorHeader and DoctorSidebar later */}
            <div className="flex">
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:block">
                    {/* Sidebar content */}
                    <div className="p-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            بوابة الأطباء
                        </h3>
                        <nav className="space-y-2">
                            <a href="/doctor-portal/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">
                                لوحة التحكم
                            </a>
                            <a href="/doctor/appointments" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">
                                المواعيد
                            </a>
                            <a href="/doctor/patients" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">
                                المريضات
                            </a>
                            <a href="/doctor/schedule" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">
                                الجدول
                            </a>
                            <a href="/doctor/earnings" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">
                                الأرباح
                            </a>
                            <a href="/doctor/settings" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">
                                الإعدادات
                            </a>
                            <form action={async () => {
                                'use server';
                                const sb = createClient();
                                await (await sb).auth.signOut();
                                redirect('/doctor-portal/login');
                            }}>
                                <button type="submit" className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-4">
                                    تسجيل الخروج
                                </button>
                            </form>
                        </nav>
                    </div>
                </aside>
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
