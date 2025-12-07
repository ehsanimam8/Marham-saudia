import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 mr-64 flex flex-col min-h-screen w-full">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
