import { createClient } from '@/lib/supabase/server';
import { OnboardingSession, Doctor, DoctorMatch, ConcernCategory } from './types';

// Placeholder for translation
const t = (key: string, _params?: any) => key;

/**
 * Match doctors to patient based on onboarding data
 * Returns top 3 doctors sorted by match score
 */
export async function matchDoctorsToSession(
    session: OnboardingSession
): Promise<DoctorMatch[]> {
    const supabase = await createClient();

    // 1. Get all approved doctors
    // Note: Using 'any' for the data return to bypass intricate Supabase generic typing for now,
    // focusing on the logic flow.
    const { data: doctorsData } = await supabase
        .from('doctors')
        .select(`
      *,
      profiles:profiles!inner (full_name_ar, full_name_en)
    `)
        .eq('status', 'approved')
        .eq('accepts_new_patients', true);

    const doctors = (doctorsData || []) as unknown as Doctor[];

    if (!doctors || doctors.length === 0) {
        return [];
    }

    // 2. Calculate match score for each doctor
    const matches = doctors.map(doctor => ({
        doctor,
        matchScore: calculateMatchScore(doctor, session),
        matchReasons: getMatchReasons(doctor, session),
        hasReviewedDocuments: false,
        discountedPrice: session.discount_unlocked
            ? doctor.consultation_price - 25
            : doctor.consultation_price
    }));

    // 3. Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // 4. Return top 3
    const topMatches = matches.slice(0, 3);

    // 5. Save matched doctor IDs to session
    await supabase
        .from('onboarding_sessions')

        // @ts-expect-error - Table types update might not include matched_doctor_ids yet
        .update({
            matched_doctor_ids: topMatches.map(m => m.doctor.id)
        })
        .eq('id', session.id);

    return topMatches;
}

/**
 * Calculate match score (0-100) for a doctor
 */
function calculateMatchScore(
    doctor: Doctor,
    session: OnboardingSession
): number {
    let score = 0;

    // 1. Specialty match (40 points max)
    score += calculateSpecialtyScore(doctor, session) * 40;

    // 2. Priority alignment (30 points max)
    score += calculatePriorityScore(doctor, session) * 30;

    // 3. Age appropriateness (15 points max)
    score += calculateAgeScore(doctor, session) * 15;

    // 4. Availability (10 points max)
    score += calculateAvailabilityScore(doctor, session) * 10;

    // 5. Rating (5 points max)
    score += (doctor.rating / 5) * 5;

    return Math.round(score);
}

/**
 * Specialty matching logic
 */
function calculateSpecialtyScore(
    doctor: Doctor,
    session: OnboardingSession
): number {
    const concernToSpecialtyMap: Record<ConcernCategory, string[]> = {
        irregular_periods: ['OB/GYN', 'Endocrinology'],
        pcos: ['Endocrinology', 'OB/GYN'],
        fertility: ['Fertility', 'OB/GYN'],
        pregnancy: ['Maternal-Fetal Medicine', 'OB/GYN'],
        weight_management: ['Endocrinology', 'Bariatric Surgery'],
        digestive_issues: ['Gastroenterology'],
        pain: ['OB/GYN', 'Pain Management'],
        aesthetic_enhancement: ['Plastic Surgery', 'Dermatology'],
        mental_health: ['Psychiatry', 'Psychology'],
        other: []
    };

    const concern = session.primary_concern || 'other';
    const preferredSpecialties = concernToSpecialtyMap[concern] || [];

    // Perfect match
    if (preferredSpecialties.includes(doctor.specialty)) {
        return 1.0;
    }

    // Check sub-specialties
    if (doctor.sub_specialties?.some(sub =>
        preferredSpecialties.some(pref => sub.toLowerCase().includes(pref.toLowerCase()))
    )) {
        return 0.8;
    }

    // Related specialty
    if (isRelatedSpecialty(doctor.specialty, concern)) {
        return 0.5;
    }

    return 0;
}

/**
 * Priority-based scoring
 */
function calculatePriorityScore(
    doctor: Doctor,
    session: OnboardingSession
): number {
    if (!session.priority_experience) {
        return 0.5;  // Default if no priorities set
    }

    let score = 0;
    let totalWeight = 0;

    // Higher priority = lower number (1 is highest priority)
    // Convert to weight: priority 1 = weight 5, priority 5 = weight 1
    const getWeight = (priority: number) => 6 - priority;

    // Experience
    if (session.priority_experience) {
        const weight = getWeight(session.priority_experience);
        const experienceScore = doctor.experience_years >= 10 ? 1 : doctor.experience_years / 10;
        score += experienceScore * weight;
        totalWeight += weight;
    }

    // Price
    if (session.priority_price) {
        const weight = getWeight(session.priority_price);
        // Lower price = higher score
        const priceScore = 1 - (Math.min(doctor.consultation_price, 200) / 200);
        score += priceScore * weight;
        totalWeight += weight;
    }

    // Speed (availability)
    if (session.priority_speed) {
        const weight = getWeight(session.priority_speed);
        // TODO: Calculate based on next_available_slot
        const speedScore = 0.7;  // Placeholder
        score += speedScore * weight;
        totalWeight += weight;
    }

    // Hospital prestige
    if (session.priority_hospital) {
        const weight = getWeight(session.priority_hospital);
        const prestigeScore = calculateHospitalPrestige(doctor.hospital);
        score += prestigeScore * weight;
        totalWeight += weight;
    }

    // Location
    if (session.priority_location) {
        const weight = getWeight(session.priority_location);
        // TODO: Calculate based on patient location
        const locationScore = 0.5;  // Placeholder
        score += locationScore * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? score / totalWeight : 0.5;
}

/**
 * Age appropriateness check
 */
function calculateAgeScore(
    doctor: Doctor,
    session: OnboardingSession
): number {
    if (!session.age_range || !doctor.min_age_patients) {
        return 1.0;  // No restrictions
    }

    const ageRanges: Record<string, number> = {
        '18-24': 21,
        '25-34': 29,
        '35-44': 39,
        '45+': 50
    };

    const patientAge = ageRanges[session.age_range] || 30;

    if (patientAge < (doctor.min_age_patients || 0)) {
        return 0;  // Patient too young
    }

    if (doctor.max_age_patients && patientAge > doctor.max_age_patients) {
        return 0;  // Patient too old
    }

    return 1.0;
}

/**
 * Availability score based on urgency
 */
function calculateAvailabilityScore(
    doctor: Doctor,
    session: OnboardingSession
): number {
    // TODO: Implement based on actual availability data
    // For now, return placeholder
    if (session.urgency === 'very_urgent') {
        return 0.8;  // Needs same-day availability
    }
    return 1.0;
}

/**
 * Hospital prestige scoring
 */
function calculateHospitalPrestige(hospital: string): number {
    const prestigiousHospitals = [
        'King Faisal Specialist Hospital',
        'King Fahad Medical City',
        'Dr. Sulaiman Al Habib',
        'Saudi German Hospital'
    ];

    return prestigiousHospitals.some(h =>
        hospital?.toLowerCase().includes(h.toLowerCase())
    ) ? 1.0 : 0.6;
}

/**
 * Check if specialty is related to concern
 */
function isRelatedSpecialty(specialty: string, concern: ConcernCategory): boolean {
    const relatedMap: Record<string, ConcernCategory[]> = {
        'OB/GYN': ['irregular_periods', 'pcos', 'fertility', 'pregnancy', 'pain'],
        'Endocrinology': ['irregular_periods', 'pcos', 'weight_management'],
        'Dermatology': ['aesthetic_enhancement'],
        'Plastic Surgery': ['aesthetic_enhancement']
    };

    return relatedMap[specialty]?.includes(concern) || false;
}

/**
 * Generate human-readable match reasons
 */
function getMatchReasons(
    doctor: Doctor,
    session: OnboardingSession
): string[] {
    const reasons: string[] = [];

    // Specialty match
    const specialtyScore = calculateSpecialtyScore(doctor, session);
    if (specialtyScore >= 0.8) {
        reasons.push(t('matching.specialtyMatch'));
    }

    // Experience
    if (doctor.experience_years >= 15) {
        reasons.push(t('matching.highlyExperienced', { years: doctor.experience_years }));
    }

    // Rating
    if (doctor.rating >= 4.8) {
        reasons.push(t('matching.topRated'));
    }

    // Hospital
    if (calculateHospitalPrestige(doctor.hospital) === 1.0) {
        reasons.push(t('matching.prestigiousHospital'));
    }

    // Total consultations
    if (doctor.total_consultations >= 100) {
        reasons.push(t('matching.experienced', { count: doctor.total_consultations }));
    }

    return reasons;
}
