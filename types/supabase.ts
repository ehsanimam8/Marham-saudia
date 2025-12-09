export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'patient' | 'doctor' | 'admin'
                    full_name_ar: string | null
                    full_name_en: string | null
                    phone: string | null
                    city: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    role?: 'patient' | 'doctor' | 'admin'
                    full_name_ar?: string | null
                    full_name_en?: string | null
                    phone?: string | null
                    city?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: 'patient' | 'doctor' | 'admin'
                    full_name_ar?: string | null
                    full_name_en?: string | null
                    phone?: string | null
                    city?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            doctors: {
                Row: {
                    id: string
                    profile_id: string
                    scfhs_license: string | null
                    specialty: string | null
                    sub_specialties: string[] | null
                    hospital: string | null
                    qualifications: Json | null
                    experience_years: number | null
                    bio_ar: string | null
                    bio_en: string | null
                    profile_photo_url: string | null
                    consultation_price: number | null
                    rating: number | null
                    total_consultations: number | null
                    status: 'pending' | 'approved' | 'rejected' | 'suspended'
                    bank_iban: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    profile_id: string
                    scfhs_license?: string | null
                    specialty?: string | null
                    sub_specialties?: string[] | null
                    hospital?: string | null
                    qualifications?: Json | null
                    experience_years?: number | null
                    bio_ar?: string | null
                    bio_en?: string | null
                    profile_photo_url?: string | null
                    consultation_price?: number | null
                    rating?: number | null
                    total_consultations?: number | null
                    status?: 'pending' | 'approved' | 'rejected' | 'suspended'
                    bank_iban?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    profile_id?: string
                    scfhs_license?: string | null
                    specialty?: string | null
                    sub_specialties?: string[] | null
                    hospital?: string | null
                    qualifications?: Json | null
                    experience_years?: number | null
                    bio_ar?: string | null
                    bio_en?: string | null
                    profile_photo_url?: string | null
                    consultation_price?: number | null
                    rating?: number | null
                    total_consultations?: number | null
                    status?: 'pending' | 'approved' | 'rejected' | 'suspended'
                    bank_iban?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            doctor_schedules: {
                Row: {
                    id: string
                    doctor_id: string
                    day_of_week: number
                    start_time: string
                    end_time: string
                    is_available: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    doctor_id: string
                    day_of_week: number
                    start_time: string
                    end_time: string
                    is_available?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    doctor_id?: string
                    day_of_week?: number
                    start_time?: string
                    end_time?: string
                    is_available?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            patients: {
                Row: {
                    id: string
                    profile_id: string
                    date_of_birth: string | null
                    insurance_company: string | null
                    insurance_number: string | null
                    emergency_contact: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    profile_id: string
                    date_of_birth?: string | null
                    insurance_company?: string | null
                    insurance_number?: string | null
                    emergency_contact?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    profile_id?: string
                    date_of_birth?: string | null
                    insurance_company?: string | null
                    insurance_number?: string | null
                    emergency_contact?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    patient_id: string
                    doctor_id: string
                    appointment_date: string
                    start_time: string
                    end_time: string
                    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | null
                    consultation_type: 'new' | 'followup' | null
                    reason_ar: string | null
                    reason_en: string | null
                    price: number
                    payment_status: 'pending' | 'paid' | 'refunded' | null
                    payment_id: string | null
                    video_room_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    patient_id: string
                    doctor_id: string
                    appointment_date: string
                    start_time: string
                    end_time: string
                    status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | null
                    consultation_type?: 'new' | 'followup' | null
                    reason_ar?: string | null
                    reason_en?: string | null
                    price: number
                    payment_status?: 'pending' | 'paid' | 'refunded' | null
                    payment_id?: string | null
                    video_room_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    patient_id?: string
                    doctor_id?: string
                    appointment_date?: string
                    start_time?: string
                    end_time?: string
                    status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | null
                    consultation_type?: 'new' | 'followup' | null
                    reason_ar?: string | null
                    reason_en?: string | null
                    price?: number
                    payment_status?: 'pending' | 'paid' | 'refunded' | null
                    payment_id?: string | null
                    video_room_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            consultations: {
                Row: {
                    id: string
                    appointment_id: string
                    diagnosis: string | null
                    prescription: Json | null
                    notes: string | null
                    recommendations: string[] | null
                    next_followup_date: string | null
                    duration_minutes: number | null
                    recording_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    appointment_id: string
                    diagnosis?: string | null
                    prescription?: Json | null
                    notes?: string | null
                    recommendations?: string[] | null
                    next_followup_date?: string | null
                    duration_minutes?: number | null
                    recording_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    appointment_id?: string
                    diagnosis?: string | null
                    prescription?: Json | null
                    notes?: string | null
                    recommendations?: string[] | null
                    next_followup_date?: string | null
                    duration_minutes?: number | null
                    recording_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    appointment_id: string
                    doctor_id: string
                    patient_id: string
                    rating: number | null
                    review_text_ar: string | null
                    review_text_en: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    appointment_id: string
                    doctor_id: string
                    patient_id: string
                    rating?: number | null
                    review_text_ar?: string | null
                    review_text_en?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    appointment_id?: string
                    doctor_id?: string
                    patient_id?: string
                    rating?: number | null
                    review_text_ar?: string | null
                    review_text_en?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            articles: {
                Row: {
                    id: string
                    slug: string
                    title_ar: string
                    title_en: string
                    content_ar: string | null
                    content_en: string | null
                    excerpt_ar: string | null
                    excerpt_en: string | null
                    featured_image_url: string | null
                    category: string | null
                    keywords: string[] | null
                    reviewed_by_doctor_id: string | null
                    read_time_minutes: number | null
                    views: number | null
                    status: 'draft' | 'published' | null
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title_ar: string
                    title_en: string
                    content_ar?: string | null
                    content_en?: string | null
                    excerpt_ar?: string | null
                    excerpt_en?: string | null
                    featured_image_url?: string | null
                    category?: string | null
                    keywords?: string[] | null
                    reviewed_by_doctor_id?: string | null
                    read_time_minutes?: number | null
                    views?: number | null
                    status?: 'draft' | 'published' | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title_ar?: string
                    title_en?: string
                    content_ar?: string | null
                    content_en?: string | null
                    excerpt_ar?: string | null
                    excerpt_en?: string | null
                    featured_image_url?: string | null
                    category?: string | null
                    keywords?: string[] | null
                    reviewed_by_doctor_id?: string | null
                    read_time_minutes?: number | null
                    views?: number | null
                    status?: 'draft' | 'published' | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            earnings: {
                Row: {
                    id: string
                    doctor_id: string
                    appointment_id: string
                    amount: number
                    platform_fee: number
                    doctor_earnings: number
                    payout_status: 'pending' | 'paid' | null
                    payout_date: string | null
                    payout_reference: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    doctor_id: string
                    appointment_id: string
                    amount: number
                    platform_fee: number
                    doctor_earnings: number
                    payout_status?: 'pending' | 'paid' | null
                    payout_date?: string | null
                    payout_reference?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    doctor_id?: string
                    appointment_id?: string
                    amount?: number
                    platform_fee?: number
                    doctor_earnings?: number
                    payout_status?: 'pending' | 'paid' | null
                    payout_date?: string | null
                    payout_reference?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'patient' | 'doctor' | 'admin'
            doctor_status: 'pending' | 'approved' | 'rejected' | 'suspended'
            appointment_status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
            consultation_type: 'new' | 'followup'
            payment_status: 'pending' | 'paid' | 'refunded'
            article_status: 'draft' | 'published'
            payout_status: 'pending' | 'paid'
        }
    }
}
