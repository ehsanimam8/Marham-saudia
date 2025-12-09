"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveDoctor(doctorId: string) {
    const supabase = await createClient();
    const { error } = await (supabase
        .from('doctors') as any)
        .update({ status: 'approved' })
        .eq('id', doctorId);

    if (error) throw error;
    revalidatePath('/admin/dashboard/doctors');
}

export async function rejectDoctor(doctorId: string) {
    const supabase = await createClient();
    const { error } = await (supabase
        .from('doctors') as any)
        .update({ status: 'rejected' })
        .eq('id', doctorId);

    if (error) throw error;
    revalidatePath('/admin/dashboard/doctors');
}

export async function publishArticle(articleId: string) {
    const supabase = await createClient();
    const { error } = await (supabase
        .from('articles') as any)
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', articleId);

    if (error) throw error;
    revalidatePath('/admin/dashboard/articles');
}

export async function deleteDoctor(doctorId: string) {
    const supabase = await createClient();

    // 1. Delete Schedules First (Constraint)
    const { error: scheduleError } = await (supabase
        .from('doctor_schedules') as any)
        .delete()
        .eq('doctor_id', doctorId);

    if (scheduleError) console.error('Error deleting schedules:', scheduleError);

    // 2. Delete Doctor
    const { error } = await (supabase
        .from('doctors') as any)
        .delete()
        .eq('id', doctorId);

    if (error) throw error;
    revalidatePath('/admin/dashboard/doctors');
}

export async function updateDoctor(doctorId: string, data: any) {
    const supabase = await createClient();

    const { error } = await (supabase
        .from('doctors') as any)
        .update(data)
        .eq('id', doctorId);

    if (error) throw error;
    revalidatePath('/admin/dashboard/doctors');
}

export async function createDoctor(data: any) {
    const supabase = await createClient();

    const { error } = await (supabase.rpc as any)('create_doctor_account', {
        p_email: data.email,
        p_password: data.password,
        p_full_name_ar: data.full_name_ar,
        p_full_name_en: data.full_name_en,
        p_city: data.city,
        p_specialty: data.specialty,
        p_hospital: data.hospital,
        p_scfhs_license: data.scfhs_license,
        p_consultation_price: parseFloat(data.consultation_price),
        p_experience_years: parseInt(data.experience_years),
        p_bio_ar: data.bio_ar,
        p_bio_en: data.bio_en
    });

    if (error) {
        console.error('Error creating doctor:', error);
        throw new Error(error.message);
    }

    revalidatePath('/admin/dashboard/doctors');
}
