import { supabase } from '@/lib/supabase';

export interface Doctor {
    id: string;
    profile_id: string;
    scfhs_license: string;
    specialty: string;
    sub_specialties: string[];
    hospital: string;
    experience_years: number;
    consultation_price: number;
    rating: number;
    total_consultations: number;
    status: string;
    bio_ar: string;
    bio_en: string;
    profile_photo_url?: string;
    profiles: {
        full_name_ar: string;
        full_name_en: string;
        city: string;
    };
}

export interface DoctorFilters {
    specialty?: string;
    city?: string;
    hospital?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    search?: string;
}

export async function getDoctors(filters: DoctorFilters = {}) {
    let query = supabase
        .from('doctors')
        .select(`
      *,
      profiles!inner(full_name_ar, full_name_en, city)
    `)
        .eq('status', 'approved');

    // Apply filters
    if (filters.specialty) {
        // Map URL slugs to database values
        const specialtyMap: Record<string, string> = {
            'fertility': 'Fertility',
            'obgyn': 'OB/GYN',
            'mental-health': 'Mental Health',
            'maternal-fetal': 'Maternal-Fetal Medicine',
            'endocrinology': 'Endocrinology',
            // Map other common terms to closest match
            'pregnancy': 'Maternal-Fetal Medicine',
            'pcos': 'Endocrinology',
            'womens-health': 'OB/GYN'
        };

        const dbSpecialty = specialtyMap[filters.specialty.toLowerCase()] || filters.specialty;
        query = query.eq('specialty', dbSpecialty);
    }

    if (filters.city) {
        query = query.eq('profiles.city', filters.city);
    }

    if (filters.hospital) {
        query = query.ilike('hospital', `%${filters.hospital}%`);
    }

    if (filters.minPrice) {
        query = query.gte('consultation_price', filters.minPrice);
    }

    if (filters.maxPrice) {
        query = query.lte('consultation_price', filters.maxPrice);
    }

    if (filters.rating) {
        query = query.gte('rating', filters.rating);
    }

    if (filters.search) {
        query = query.or(`profiles.full_name_ar.ilike.%${filters.search}%,profiles.full_name_en.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }

    return data as Doctor[];
}

export async function getDoctorProfile(userId: string) {
    const { data, error } = await supabase
        .from('doctors')
        .select(`
            *,
            profiles!inner(full_name_ar, full_name_en, city)
        `)
        .eq('profile_id', userId)
        .single();

    if (error) {
        console.error('Error fetching doctor profile:', error);
        return null;
    }

    return data as Doctor;
}
