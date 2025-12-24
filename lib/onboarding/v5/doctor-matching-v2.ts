import { createClient } from '@/lib/supabase/server';
import { MatchedDoctor, Specialty } from './analysis-types';

export async function getMatchedDoctorsV2(
    category: 'mental_health' | 'beauty' | 'medical',
    condition: string,
    limit: number = 3
): Promise<MatchedDoctor[]> {
    const supabase = await createClient();

    // Map category to specialties based on seed data
    const specialtyMap: Record<string, string[]> = {
        mental_health: ['Psychiatrist', 'Psychologist', 'Psychiatry', 'Psychology', 'Mental Health'],
        beauty: ['Dermatologist', 'Dermatology', 'Plastic Surgery', 'Aesthetic', 'Cosmetic'],
        medical: ['Internist', 'Internal Medicine', 'Endocrinologist', 'Endocrinology', 'OB/GYN', 'Obstetrics and Gynecology', 'Fertility', 'Maternal-Fetal Medicine', 'Pediatrics', 'Nutrition', 'General Practice', 'Dentistry']
    };

    const specialties = specialtyMap[category] || [];

    console.log('Fetching doctors with params:', { category, condition, limit, specialties });

    // Fetch doctors from database
    const { data: doctorsData, error } = await supabase
        .from('doctors')
        .select(`
            id,
            profile:profiles!inner(full_name_en, full_name_ar),
            specialty,
            hospital,
            rating,
            total_consultations,
            experience_years,
            consultation_price,
            sub_specialties,
            profile_photo_url
        `)
        .eq('status', 'approved') as { data: any[] | null, error: any };

    if (error) {
        console.error('Supabase error fetching doctors:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
        console.log('Query parameters:', { category, specialties, status: 'approved' });
        return [];
    }

    if (!doctorsData || doctorsData.length === 0) {
        console.warn('No approved doctors found in database.');
        return [];
    }

    // Filter by specialty manually
    let filteredDoctors = doctorsData.filter(d =>
        specialties.some(s => d.specialty?.toLowerCase().includes(s.toLowerCase()))
    );

    // Robustness: If no specific specialty matches found, use all doctors as a fallback
    // This ensures we always show dynamic data rather than an empty screen.
    if (filteredDoctors.length === 0) {
        console.warn(`No specific matches for ${category}, falling back to any available doctors.`);
        filteredDoctors = doctorsData;
    }

    // Score and rank doctors
    const scoredDoctors = filteredDoctors.map(doctor => {
        let score = 0;

        // 1. Specialty match (40 points)
        const isMatch = specialties.some(s => doctor.specialty?.toLowerCase().includes(s.toLowerCase()));
        const isPerfectMatch = isPerfectSpecialtyMatch(category, doctor.specialty);
        score += isPerfectMatch ? 40 : (isMatch ? 20 : 0);

        // 2. Has treated this condition (Match against sub_specialties) (30 points)
        const hasTreatedCondition = Array.isArray(doctor.sub_specialties) &&
            doctor.sub_specialties.some((c: string) => c.toLowerCase().includes(condition.toLowerCase()));
        score += hasTreatedCondition ? 30 : 0;

        // 3. Rating (20 points)
        score += ((doctor.rating || 0) / 5) * 20;

        // 4. Availability (10 points)
        // Since we don't have next_available_slot in DB yet, we'll give a default score
        score += 5;

        return {
            ...doctor,
            score,
            has_treated_condition: hasTreatedCondition
        };
    });

    // Sort by score and return top limit
    return scoredDoctors
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, limit)
        .map(formatDoctorData);
}

function isPerfectSpecialtyMatch(
    category: string,
    specialty: string
): boolean {
    const perfectMatches: Record<string, string[]> = {
        mental_health: ['Psychiatrist', 'Psychiatry'],
        beauty: ['Dermatologist', 'Dermatology'],
        medical: ['Endocrinologist', 'Endocrinology', 'OB/GYN', 'Obstetrics and Gynecology']
    };
    return (perfectMatches[category] || []).some(s => specialty?.toLowerCase().includes(s.toLowerCase()));
}

function formatDoctorData(doctor: any): MatchedDoctor {
    return {
        id: doctor.id,
        name_en: doctor.profile.full_name_en,
        name_ar: doctor.profile.full_name_ar,
        specialty: doctor.specialty,
        specialty_ar: doctor.specialty_ar || doctor.specialty, // Fallback if missing
        hospital: doctor.hospital,
        rating: doctor.rating || 0,
        reviews_count: doctor.total_consultations || 0,
        years_experience: doctor.experience_years || 0,
        consultation_price: doctor.consultation_price || 0,
        profile_image_url: doctor.profile_photo_url,
        next_available: new Date().toISOString(), // Mock availability for now
        has_treated_condition: doctor.has_treated_condition,
    };
}
