
import { createClient } from '@/lib/supabase/server';
import DoctorsTable from '@/components/admin/DoctorsTable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import AddDoctorDialog from '@/components/admin/AddDoctorDialog'; // Assuming this exists or we add later

export const dynamic = 'force-dynamic';

export default async function AdminDoctorsPage() {
    const supabase = await createClient();

    const { data: doctors } = await supabase
        .from('doctors')
        .select(`
            *,
            profiles:profile_id (*)
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة الطبيبات</h1>
                    <p className="text-gray-500 mt-1">عرض وإدارة حسابات الطبيبات المسجلات في المنصة</p>
                </div>
                {/* <AddDoctorDialog /> */}
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    إضافة طبيبة
                </Button>
            </div>

            <DoctorsTable doctors={doctors || []} />
        </div>
    );
}
