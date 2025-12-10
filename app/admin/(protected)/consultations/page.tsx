import { getAdminConsultations } from '@/lib/api/admin-consultations';
import { getDetailedConsultationStats } from '@/lib/api/admin-analytics';
import ConsultationsDashboard from '@/components/admin/ConsultationsDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminConsultationsPage() {
    const consultations = await getAdminConsultations();
    const stats = await getDetailedConsultationStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">إدارة الاستشارات</h1>
                <p className="text-gray-500 mt-1">متابعة الأداء، المواعيد، وتقييم الجودة</p>
            </div>

            <ConsultationsDashboard consultations={consultations} stats={stats} />
        </div>
    );
}
