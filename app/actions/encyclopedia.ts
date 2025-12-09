"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createMedicalCondition(formData: FormData) {
    const supabase = await createClient();

    const name_ar = formData.get('name_ar') as string;
    const name_en = formData.get('name_en') as string;
    const specialty = formData.get('specialty') as string;
    const slug = name_en.toLowerCase().replace(/\s+/g, '-');

    if (!name_ar || !name_en || !specialty) {
        throw new Error("Missing required fields");
    }

    const { error } = await (supabase
        .from('medical_conditions') as any)
        .insert({
            name_ar,
            name_en,
            slug,
            specialty,
            description: formData.get('description'),
            symptoms_text: formData.get('symptoms_text'),
            treatment_text: formData.get('treatment_text'),
        });

    if (error) {
        console.error('Error creating condition:', error);
        throw new Error("Failed to create medical condition");
    }

    revalidatePath('/admin/dashboard/encyclopedia');
    return { success: true };
}

export async function deleteMedicalCondition(id: string) {
    const supabase = await createClient();

    const { error } = await (supabase
        .from('medical_conditions') as any)
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/dashboard/encyclopedia');
}
