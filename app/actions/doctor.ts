'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateDoctorProfile(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const price = formData.get('price');
    const bio = formData.get('bio');
    const fullName = formData.get('fullName');
    // Specialty is disabled in UI but let's grab it just in case, though we won't update it if we stick to the rules

    try {
        // 1. Update Profile (Name)
        if (fullName) {
            const { error: profileError } = await (supabase
                .from('profiles') as any)
                .update({ full_name_ar: fullName })
                .eq('id', user.id);

            if (profileError) throw profileError;
        }

        // 2. Update Doctor Details
        const { error: doctorError } = await (supabase
            .from('doctors') as any)
            .update({
                consultation_price: price,
                bio_ar: bio,
            })
            .eq('profile_id', user.id);

        if (doctorError) throw doctorError;

        revalidatePath('/doctor-portal/dashboard/settings');
        return { success: true, message: 'تم تحديث الملف الشخصي بنجاح' };
    } catch (error: any) {
        console.error('Update error:', error);
        return { error: 'فشل تحديث الملف الشخصي' };
    }
}
