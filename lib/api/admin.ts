import { SupabaseClient } from '@supabase/supabase-js';

export async function getAdminStats(supabase: SupabaseClient) {
    const { count: doctorsTotal } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

    const { count: doctorsPending } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    const { count: articlesTotal } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

    const { count: articlesPublished } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

    return {
        doctorsTotal: doctorsTotal || 0,
        doctorsPending: doctorsPending || 0,
        articlesTotal: articlesTotal || 0,
        articlesPublished: articlesPublished || 0
    };
}

export async function getAdminDoctors(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('doctors')
        .select(`
            *,
            profiles (
                full_name_ar,
                full_name_en,
                city
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin doctors:', error);
        return [];
    }

    return data;
}

export async function getAdminArticles(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('articles')
        .select(`
            *,
            doctors (
                profiles (
                   full_name_ar 
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin articles:', error);
        return [];
    }

    return data;
}
