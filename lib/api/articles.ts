// import { supabase } from '@/lib/supabase'; // Removed implicit client

export interface Article {
    id: string;
    slug: string;
    title_ar: string;
    title_en: string;
    content_ar: string;
    content_en: string;
    excerpt_ar: string;
    excerpt_en: string;
    featured_image_url: string;
    category: string;
    keywords: string[];
    read_time_minutes: number;
    views: number;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    reviewed_by_doctor_id: string | null;
    doctors?: {
        id: string;
        specialty: string;
        profile_photo_url?: string;
        profiles: {
            full_name_ar: string;
            full_name_en: string;
        }
    }
}

export interface ArticleFilters {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}

// Public: Get all published articles
export async function getArticles(supabase: any, filters: ArticleFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 9;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
        .from('articles')
        .select(`
    *,
    doctors(
        profiles(full_name_ar, full_name_en)
    )
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(start, end);

    if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
    }

    if (filters.search) {
        query = query.or(`title_ar.ilike.% ${filters.search}%, title_en.ilike.% ${filters.search}% `);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error('Error fetching articles:', JSON.stringify(error, null, 2));
        return { data: [], count: 0 };
    }

    return { data: data as Article[], count: count || 0 };
}

// Public: Get single article by slug
export async function getArticleBySlug(supabase: any, slug: string) {
    const { data, error } = await supabase
        .from('articles')
        .select(`
    *,
    doctors(
        id,
        profile_photo_url,
        specialty,
        profiles(full_name_ar, full_name_en)
    )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) {
        console.error('Error fetching article:', error);
        return null;
    }

    // Increment views (fire and forget)
    // In a real app, use an RPC or avoid client-side increment to prevent abuse
    // supabase.rpc('increment_article_views', { article_id: data.id }); 

    return data as Article;
}

// Doctor: Get own articles
export async function getDoctorArticles(supabase: any, doctorId: string) {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('reviewed_by_doctor_id', doctorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching doctor articles:', error);
        return [];
    }

    return data as Article[];
}

// but we can have helpers here if needed.
