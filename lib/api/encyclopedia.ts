import { SupabaseClient } from '@supabase/supabase-js';

export async function getMedicalConditions(supabase: SupabaseClient, limit: number = 4) {
    const { data, error } = await supabase
        .from('medical_conditions')
        .select('id, name_ar, name_en, slug, specialty, overview_ar')
        .limit(limit)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching conditions:', error);
        return [];
    }

    return data;
}

export async function getConditionBySlug(supabase: SupabaseClient, slug: string) {
    const { data, error } = await supabase
        .from('medical_conditions')
        .select(`
            *,
            condition_symptoms (
                symptoms (*)
            )
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching condition:', error);
        return null;
    }

    // Flatten structure
    const formatted = {
        ...data,
        symptoms: data.condition_symptoms?.map((item: any) => item.symptoms) || []
    };

    return formatted;
}

export async function getSymptoms(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .order('name_ar');

    if (error) {
        console.error('Error fetching symptoms:', error);
        return [];
    }

    return data;
}

export async function getSymptomBySlug(supabase: SupabaseClient, slug: string) {
    const { data, error } = await supabase
        .from('symptoms')
        .select(`
            *,
            condition_symptoms (
                medical_conditions (*)
            )
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching symptom:', error);
        return null;
    }

    // Flatten structure
    const formatted = {
        ...data,
        associated_conditions: data.condition_symptoms?.map((item: any) => item.medical_conditions) || []
    };

    return formatted;
}
