import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DoctorSidebar from '@/components/doctor-portal/dashboard/DoctorSidebar';
import DoctorPortalContentWrapper from '@/components/doctor-portal/DoctorPortalContentWrapper';

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
    // Verify user is a doctor
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name_ar')
        .eq('id', user.id)
        .single() as any;

    if (!profile || profile.role !== 'doctor') {
        // Not a doctor - sign them out and redirect
        await supabase.auth.signOut();
        redirect('/doctor-portal/login?error=not_a_doctor');
    }

    // Check verification status
    const { data: doctorData } = await supabase
        .from('doctors')
        .select('status')
        .eq('profile_id', user.id)
        .single() as any;

    if (!doctorData) {
        // redirect('/doctor-portal/login?error=no_doctor_record');
        // Allow access - maybe they need to complete profile?
        // But for now, let's redirect as per instructions
        await supabase.auth.signOut();
        redirect('/doctor-portal/login?error=no_doctor_record');
    }

    if (doctorData.status === 'pending') {
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
                        شكراً لتسجيلك يا دكتورة {profile.full_name_ar}. حسابك قيد المراجعة من قبل فريقنا وسنتواصل معك خلال 24-48 ساعة.
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

    if (doctorData.status === 'rejected') {
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
    // Check if we are in the consultation room
    // Note: In Server Components, we can't easily check pathname without headers
    // But we can check if the children content suggests it (no).
    // We can use the headers() function to get URL?

    // Better way: Move consultation room to a route group that opts out of this layout?
    // Or just check here. Route Group (group) is cleaner but requires file move.
    // Let's try headers() approach first as it keeps file structure intact.

    /* 
       Actually, `headers` is dynamic.
    */
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const pathname = headersList.get('x-url') || ''; // 'x-url' needs middleware injection usually

    // Alternative: Client Component wrapper for the layout logic?
    // Simplest: Check if the child component is the Room page? No.

    // Let's use CSS/Client Logic or just create a specific Layout for the Room.
    // BUT since we are editing this existing layout file:
    // We will assume that if we are in a room, we probably want full width.
    // Wait, the easiest way without complex rewrites is to make the Sidebar responsive or collapsible controlled by a client component, 
    // OR create a `(consultation-room)` group.

    // Let's modify the return to be a Client Component or use a client wrapper that checks usePathname?
    // Changing this file to 'use client' breaks the async data fetching.

    // STRATEGY: Create a Client Component wrapper for the content area that checks the pathname and applies classes.
    // However, `DoctorSidebar` is imported here.

    // Let's rely on a helper component.

    return (
        <DoctorPortalContentWrapper>
            {children}
        </DoctorPortalContentWrapper>
    );
}
