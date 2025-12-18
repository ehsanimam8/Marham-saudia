// @ts-nocheck
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Body Part Interface matching DB
interface BodyPartInput {
    id?: string;
    category_id: string;
    name_ar: string;
    name_en: string;
    description_ar?: string;
    description_en?: string;
    icon?: string;
    display_order?: number;
    requires_age_check?: boolean;
}

// Concern Interface
interface ConcernInput {
    id?: string;
    body_part_id: string;
    name_ar: string;
    name_en: string;
    description_ar?: string;
    description_en?: string;
    icon?: string;
    urgency_default?: string;
    display_order?: number;
}

// Question Interface
interface QuestionInput {
    id?: string;
    concern_id: string;
    question_ar: string;
    question_en: string;
    question_type: string;
    options?: any;
    display_order?: number;
}

export async function upsertBodyPart(data: BodyPartInput) {
    const supabase = await createClient();

    // Check if updating or inserting
    if (data.id) {
        const { error } = await supabase
            .from('body_parts')
            .update({
                category_id: data.category_id,
                name_ar: data.name_ar,
                name_en: data.name_en,
                description_ar: data.description_ar,
                description_en: data.description_en,
                icon: data.icon,
                display_order: data.display_order,
                requires_age_check: data.requires_age_check
            } as any)
            .eq('id', data.id);

        if (error) throw new Error(`Failed to update body part: ${error.message}`);
    } else {
        // Insert new
        const { error } = await supabase
            .from('body_parts')
            .insert({
                id: crypto.randomUUID(),
                category_id: data.category_id,
                name_ar: data.name_ar,
                name_en: data.name_en,
                description_ar: data.description_ar,
                description_en: data.description_en,
                icon: data.icon,
                display_order: data.display_order || 0,
                requires_age_check: data.requires_age_check || false
            });

        if (error) throw new Error(`Failed to create body part: ${error.message}`);
    }

    revalidatePath('/onboarding/v5');
    revalidatePath('/admin/onboarding');
}

export async function deleteBodyPart(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('body_parts').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete body part: ${error.message}`);
    revalidatePath('/onboarding/v5');
    revalidatePath('/admin/onboarding');
}

// --- CONCERNS ---

export async function getConcerns(bodyPartId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('primary_concerns')
        .select('*')
        .eq('body_part_id', bodyPartId)
        .order('display_order');

    if (error) throw new Error(error.message);
    return data;
}

export async function upsertConcern(data: ConcernInput) {
    const supabase = await createClient();
    const payload = {
        body_part_id: data.body_part_id,
        name_ar: data.name_ar,
        name_en: data.name_en,
        description_ar: data.description_ar,
        description_en: data.description_en,
        icon: data.icon,
        urgency_default: data.urgency_default || 'routine',
        display_order: data.display_order || 0
    };

    if (data.id) {
        const { error } = await supabase.from('primary_concerns').update(payload).eq('id', data.id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('primary_concerns').insert({ ...payload, id: crypto.randomUUID() });
        if (error) throw new Error(error.message);
    }
    revalidatePath('/admin/onboarding');
}

export async function deleteConcern(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('primary_concerns').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/onboarding');
}

// --- QUESTIONS ---

export async function getQuestions(concernId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('followup_questions')
        .select('*')
        .eq('concern_id', concernId)
        .order('display_order');

    if (error) throw new Error(error.message);
    return data;
}

export async function upsertQuestion(data: QuestionInput) {
    const supabase = await createClient();
    const payload = {
        concern_id: data.concern_id,
        question_ar: data.question_ar,
        question_en: data.question_en,
        question_type: data.question_type,
        options: data.options,
        display_order: data.display_order || 0
    };

    if (data.id) {
        const { error } = await supabase.from('followup_questions').update(payload).eq('id', data.id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('followup_questions').insert({ ...payload, id: crypto.randomUUID() });
        if (error) throw new Error(error.message);
    }
    revalidatePath('/admin/onboarding');
}

export async function deleteQuestion(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('followup_questions').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/onboarding');
}

// --- EDUCATIONAL CONTENT ---

export async function getEducationalContent(concernId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('concern_id', concernId);

    if (error) throw new Error(error.message);
    return data;
}

export async function upsertEducationalContent(data: any) {
    const supabase = await createClient();
    if (data.id) {
        const { error } = await supabase.from('educational_content').update(data).eq('id', data.id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('educational_content').insert({ ...data, id: crypto.randomUUID() });
        if (error) throw new Error(error.message);
    }
    revalidatePath('/admin/onboarding');
}

export async function deleteEducationalContent(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('educational_content').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/onboarding');
}

export async function fetchAllCategoriesWithParts() {
    const supabase = await createClient();

    // Fetch categories
    const { data: categories, error: catError } = await supabase
        .from('onboarding_categories')
        .select('*')
        .order('display_order');

    if (catError) throw new Error(catError.message);

    // Fetch parts
    const { data: parts, error: partError } = await supabase
        .from('body_parts')
        .select('*')
        .order('display_order');

    if (partError) throw new Error(partError.message);

    // Merge
    return categories.map(cat => ({
        ...cat,
        parts: parts.filter(p => p.category_id === cat.id)
    }));
}
