import DashboardSidebar from '@/components/patient/dashboard/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="md:mr-64 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
