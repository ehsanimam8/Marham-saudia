import { getAdminDoctors } from '@/lib/api/admin';
import { createClient } from '@/lib/supabase/server';
import DoctorsTable from '@/components/admin/DoctorsTable';
import AddDoctorDialog from '@/components/admin/AddDoctorDialog';

export default async function AdminDoctorsPage() {
    const supabase = await createClient();
    const doctors = await getAdminDoctors(supabase);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">إدارة الطبيبات</h1>
                    <p className="text-gray-500 mt-1">مراجعة واعتماد طلبات الانضمام</p>
                </div>
                <AddDoctorDialog />
            </div>

            <DoctorsTable doctors={doctors} />
        </div>
    );
}
