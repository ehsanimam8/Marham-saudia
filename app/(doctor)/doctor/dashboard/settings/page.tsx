import { createClient } from '@/lib/supabase/server';
import { getDoctorProfile } from '@/lib/api/doctors';
import { redirect } from 'next/navigation';
import DoctorSettingsForm from '@/components/doctor/settings/DoctorSettingsForm';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const doctor = await getDoctorProfile(supabase, user.id);
    if (!doctor) redirect('/doctor/register');

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
                <p className="text-gray-500 mt-1">تحديث معلومات الملف الشخصي</p>
            </div>

            <DoctorSettingsForm
                initialData={{
                    fullName: doctor.profiles.full_name_ar || '',
                    specialty: doctor.specialty || '',
                    price: doctor.consultation_price || 0,
                    bio: doctor.bio_ar || ''
                }}
            />
        </div>
    );
}
