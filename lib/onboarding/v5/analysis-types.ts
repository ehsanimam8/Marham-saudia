export interface AnalysisResult {
    category: 'mental_health' | 'beauty' | 'medical';
    primaryCondition: string;
    primaryCondition_ar: string;
    severity: 'mild' | 'moderate' | 'severe';
    symptoms: string[];
    confidence: number; // 0-100
    recommendedSpecialty: Specialty;
}

export interface SocialProofData {
    caseCount: number;
    averageRating: number;
    successRate: number; // percentage
    testimonial: {
        text_en: string;
        text_ar: string;
        patientName: string;
        patientAge: number;
        patientCity: string;
    };
    videoTestimonialUrl?: string;
}

export interface MatchedDoctor {
    id: string;
    name_en: string;
    name_ar: string;
    specialty: string;
    specialty_ar: string;
    hospital: string;
    rating: number;
    reviews_count: number;
    years_experience: number;
    consultation_price: number;
    profile_image_url: string;
    next_available: string; // ISO datetime
    has_treated_condition: boolean;
    success_rate?: number;
}

export type Specialty =
    | 'psychiatrist'
    | 'psychologist'
    | 'dermatologist'
    | 'internist'
    | 'endocrinologist'
    | 'obgyn';
