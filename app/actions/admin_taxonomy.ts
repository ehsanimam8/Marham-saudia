'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ==========================================
// PRIMARY CONCERNS
// ==========================================

export async function getAdminConcerns() {
    const supabase = await createClient();
    // @ts-ignore
    const { data, error } = await supabase
        .from('primary_concerns')
        .select(`
            *,
            body_parts (
                name_en
            )
        `)
        .order('body_part_id', { ascending: true })
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching concerns:', error);
        return [];
    }
    return data;
}

export async function deleteConcern(id: string) {
    const supabase = await createClient();
    // @ts-ignore
    const { error } = await supabase
        .from('primary_concerns')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete concern: ${error.message}`);
    }
    revalidatePath('/admin/medical-data');
}

export async function createConcern(formData: FormData) {
    const supabase = await createClient();

    // Extract basic fields
    const id = formData.get('id') as string;
    const bodyPartId = formData.get('body_part_id') as string;
    const nameEn = formData.get('name_en') as string;
    const nameAr = formData.get('name_ar') as string;
    const urgency = formData.get('urgency_default') as string;

    // @ts-ignore
    const { error } = await supabase
        .from('primary_concerns')
        .insert({
            id,
            body_part_id: bodyPartId,
            name_en: nameEn,
            name_ar: nameAr,
            urgency_default: urgency,
            description_en: formData.get('description_en') || null,
            description_ar: formData.get('description_ar') || null,
            icon: formData.get('icon') || '⚕️',
            requires_age_context: formData.get('requires_age_context') === 'true',
            display_order: 99
        } as any);

    if (error) {
        console.error(error);
        throw new Error('Failed to create concern');
    }
    revalidatePath('/admin/medical-data');
}

// ==========================================
// SYMPTOMS
// ==========================================

export async function getAdminSymptoms() {
    const supabase = await createClient();
    // @ts-ignore
    const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .order('concern_id')
        .limit(500); // Limit for performance

    return data || [];
}

export async function deleteSymptom(id: string) {
    const supabase = await createClient();
    // @ts-ignore
    const { error } = await supabase
        .from('symptoms')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/medical-data');
}

// ==========================================
// QUESTIONS
// ==========================================

export async function getAdminQuestions() {
    const supabase = await createClient();
    // @ts-ignore
    const { data, error } = await supabase
        .from('followup_questions')
        .select('*')
        .order('concern_id');

    return data || [];
}
