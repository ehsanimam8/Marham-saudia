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
            onboarding_sessions: {
                Row: {
                    id: string
                    created_at: string
                    primary_concern: string | null
                    symptoms: string[] | null
                    age_group: string | null
                    matched_doctor_ids: string[] | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    primary_concern?: string | null
                    symptoms?: string[] | null
                    age_group?: string | null
                    matched_doctor_ids?: string[] | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    primary_concern?: string | null
                    symptoms?: string[] | null
                    age_group?: string | null
                    matched_doctor_ids?: string[] | null
                }
            }
            ai_chat_sessions: {
                Row: {
                    id: string
                    created_at: string
                    onboarding_session_id: string
                    status: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    onboarding_session_id: string
                    status?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    onboarding_session_id?: string
                    status?: string
                }
            }
            ai_chat_messages: {
                Row: {
                    id: string
                    created_at: string
                    chat_session_id: string | null
                    role: string
                    content: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    chat_session_id?: string | null
                    role: string
                    content: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    chat_session_id?: string | null
                    role?: string
                    content?: string
                }
            }
            doctors: {
                Row: {
                    id: string
                    full_name: string
                    specialty: string
                    sub_specialty: string | null
                    image_url: string | null
                }
                Insert: {
                    id?: string
                    full_name: string
                    specialty: string
                    sub_specialty?: string | null
                    image_url?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string
                    specialty?: string
                    sub_specialty?: string | null
                    image_url?: string | null
                }
            }
            body_parts: {
                Row: {
                    id: string
                    category_id: string
                    name_ar: string
                    name_en: string
                    description_ar: string | null
                    description_en: string | null
                    icon: string | null
                    display_order: number | 0
                    requires_age_check: boolean | false
                }
                Insert: {
                    id?: string
                    category_id: string
                    name_ar: string
                    name_en: string
                    description_ar?: string | null
                    description_en?: string | null
                    icon?: string | null
                    display_order?: number
                    requires_age_check?: boolean
                }
                Update: {
                    id?: string
                    category_id?: string
                    name_ar?: string
                    name_en?: string
                    description_ar?: string | null
                    description_en?: string | null
                    icon?: string | null
                    display_order?: number
                    requires_age_check?: boolean
                }
            }
            primary_concerns: {
                Row: {
                    id: string
                    body_part_id: string
                    name_ar: string
                    name_en: string
                    description_ar: string | null
                    description_en: string | null
                    icon: string | null
                    urgency_default: string | 'routine'
                    display_order: number | 0
                }
                Insert: {
                    id?: string
                    body_part_id: string
                    name_ar: string
                    name_en: string
                    description_ar?: string | null
                    description_en?: string | null
                    icon?: string | null
                    urgency_default?: string
                    display_order?: number
                }
                Update: {
                    id?: string
                    body_part_id?: string
                    name_ar?: string
                    name_en?: string
                    description_ar?: string | null
                    description_en?: string | null
                    icon?: string | null
                    urgency_default?: string
                    display_order?: number
                }
            }
            followup_questions: {
                Row: {
                    id: string
                    concern_id: string
                    question_ar: string
                    question_en: string
                    question_type: string
                    options: Json | null
                    display_order: number | 0
                }
                Insert: {
                    id?: string
                    concern_id: string
                    question_ar: string
                    question_en: string
                    question_type: string
                    options?: Json | null
                    display_order?: number
                }
                Update: {
                    id?: string
                    concern_id?: string
                    question_ar?: string
                    question_en?: string
                    question_type?: string
                    options?: Json | null
                    display_order?: number
                }
            }
            educational_content: {
                Row: {
                    id: string
                    concern_id: string
                    title_ar: string
                    title_en: string
                    content_ar: string | null
                    content_en: string | null
                    video_url: string | null
                    image_url: string | null
                }
                Insert: {
                    id?: string
                    concern_id: string
                    title_ar: string
                    title_en: string
                    content_ar?: string | null
                    content_en?: string | null
                    video_url?: string | null
                    image_url?: string | null
                }
                Update: {
                    id?: string
                    concern_id?: string
                    title_ar?: string
                    title_en?: string
                    content_ar?: string | null
                    content_en?: string | null
                    video_url?: string | null
                    image_url?: string | null
                }
            }
            onboarding_categories: {
                Row: {
                    id: string
                    name_ar: string
                    name_en: string
                    icon: string | null
                    display_order: number | 0
                }
                Insert: {
                    id?: string
                    name_ar: string
                    name_en: string
                    icon?: string | null
                    display_order?: number
                }
                Update: {
                    id?: string
                    name_ar?: string
                    name_en?: string
                    icon?: string | null
                    display_order?: number
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
            [_ in never]: never
        }
    }
}