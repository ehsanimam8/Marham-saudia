import { ReactNode } from 'react';

// ============================================
// ONBOARDING SESSION
// ============================================

export interface OnboardingSession {
    id: string;
    patient_id: string | null;
    session_token: string | null;

    // Onboarding data
    body_part: string;
    primary_concern: ConcernCategory | null;
    symptoms_selected: string[];

    // Contextual data
    age_range: string | null;
    previous_diagnosis: boolean | null;
    urgency: UrgencyLevel | null;

    // Priority ranking
    priority_experience: number | null;
    priority_price: number | null;
    priority_speed: number | null;
    priority_hospital: number | null;
    priority_location: number | null;

    // Engagement
    scheduled_nurse_call: boolean;
    nurse_call_datetime: string | null;
    downloaded_health_profile: boolean;

    // Documents
    documents_uploaded: number;
    discount_unlocked: boolean;

    // Matching
    matched_doctor_ids: string[];

    // Status
    completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export type ConcernCategory =
    | 'irregular_periods'
    | 'pcos'
    | 'fertility'
    | 'pregnancy'
    | 'weight_management'
    | 'digestive_issues'
    | 'pain'
    | 'aesthetic_enhancement'
    | 'mental_health'
    | 'other';

export type UrgencyLevel =
    | 'not_urgent'
    | 'moderate'
    | 'urgent'
    | 'very_urgent';

// ============================================
// MEDICAL DOCUMENT
// ============================================

export interface MedicalDocument {
    id: string;
    patient_id: string;
    onboarding_session_id: string | null;

    // File info
    file_url: string;
    file_name: string;
    file_size_bytes: number;
    file_type: string;

    // Metadata
    document_type: DocumentType;
    document_date: string | null;
    notes: string | null;

    // Processing
    extracted_text: string | null;
    ai_summary: string | null;
    processed: boolean;

    // Sharing
    visible_to_doctors: boolean;
    shared_with_doctor_ids: string[];

    // Timestamps
    uploaded_at: string;
    updated_at: string;
}

export type DocumentType =
    | 'lab_result'
    | 'prescription'
    | 'imaging'
    | 'diagnosis'
    | 'surgical_record'
    | 'allergy_record'
    | 'vaccination'
    | 'insurance'
    | 'other';

// ============================================
// NURSE CONSULTATION
// ============================================

export interface NurseConsultation {
    id: string;
    patient_id: string;
    onboarding_session_id: string | null;

    // Scheduling
    requested_datetime: string;
    scheduled_datetime: string | null;
    completed_datetime: string | null;

    // Nurse
    nurse_id: string | null;
    nurse_name: string | null;

    // Contact
    patient_phone: string;
    patient_email: string | null;
    preferred_language: 'ar' | 'en';

    // Notes
    patient_concerns: string | null;
    nurse_notes: string | null;
    recommended_next_steps: string | null;

    // Status
    status: NurseConsultationStatus;

    // Timestamps
    created_at: string;
    updated_at: string;
}

export type NurseConsultationStatus =
    | 'requested'
    | 'scheduled'
    | 'completed'
    | 'cancelled'
    | 'no_show';

// ============================================
// BODY PART & CONCERNS
// ============================================

export type MainCategory = 'medical' | 'beauty' | 'mental';

export interface BodyPart {
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr?: string;
    descriptionEn?: string;
    icon?: string; // Lucide name or URL
    svgPath: string;  // SVG path data for clickable area
    concerns: Concern[];
    requiresAgeCheck: boolean;
    estimatedQuestions: number;
    categories: string[]; // Changed from MainCategory[] to support dynamic DB IDs
}

export interface Concern {
    id: string;
    icon: ReactNode;
    titleAr: string;
    titleEn: string;
    descriptionAr?: string;
    descriptionEn?: string;
    category: 'health' | 'aesthetic';
    symptoms: Symptom[];
}

export interface Symptom {
    id: string;
    icon: ReactNode;
    labelAr: string;
    labelEn: string;
    severity?: 'mild' | 'moderate' | 'severe';
    is_red_flag?: boolean;
}

export interface FollowupQuestion {
    id: string;
    question_ar: string;
    question_en: string;
    type: 'boolean' | 'multiple_choice' | 'text';
    options_ar?: any[];
    options_en?: any[];
}

export interface PriorityOption {
    id: string;
    name_ar: string;
    name_en: string;
    display_order: number;
}

// ============================================
// DOCTOR MATCHING
// ============================================

// We need a Doctor type, assuming it exists or defining minimal version here
export interface Doctor {
    id: string;
    specialty: string;
    sub_specialties?: string[];
    experience_years: number;
    rating: number;
    total_reviews: number;
    consultation_price: number;
    profile_photo_url: string;
    full_name_ar: string;
    full_name_en: string;
    hospital: string;
    total_consultations: number;
    next_available: string; // e.g. "Tomorrow 10:00 AM"
    min_age_patients?: number;
    max_age_patients?: number;
    status: string;
    accepts_new_patients: boolean;
}


export interface DoctorMatch {
    doctor: Doctor;
    matchScore: number;  // 0-100
    matchReasons: string[];
    hasReviewedDocuments: boolean;
    discountedPrice: number;
}

export interface MatchingCriteria {
    concern: ConcernCategory;
    symptoms: string[];
    ageRange: string | null;
    urgency: UrgencyLevel | null;
    priorities: {
        experience: number;
        price: number;
        speed: number;
        hospital: number;
        location: number;
    };
}

// ============================================
// FORM STATES
// ============================================

export interface OnboardingFormState {
    currentStep: number;
    sessionId: string | null;
    bodyPart: string | null;
    primaryConcern: string | null;
    selectedSymptoms: string[];
    ageRange: string | null;
    previousDiagnosis: boolean | null;
    urgencyLevel: string | null;
    priorities: Record<string, number>;
}

// ============================================
// API RESPONSES
// ============================================

export interface UploadDocumentResponse {
    document: MedicalDocument;
    totalDocuments: number;
    discountUnlocked: boolean;
}

export interface ScheduleNurseCallResponse {
    consultation: NurseConsultation;
    confirmationSent: boolean;
}
