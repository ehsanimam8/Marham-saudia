import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    // Verify user is an admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as any;

    if (!profile || profile.role !== 'admin') {
        // Not an admin - sign them out and redirect
        await supabase.auth.signOut();
        redirect('/admin/login?error=not_an_admin');
    }

    // Approved admin - show the portal
    // Re-using the existing Admin Layout structure since it likely has the Sidebar etc.
    // But we need to make sure existing Admin code uses this layout? 
    // Actually, wait, the user request says:
    // "Move from (admin)/..." to "app/(admin-portal)/..."
    // So we should just move the files and ensure this layout is used.

    return (
        <div className="min-h-screen bg-gray-50 flex" dir="rtl">
            <AdminSidebar />
            <main className="flex-1 mr-64 p-8">
                {children}
            </main>
        </div>
    );
}
