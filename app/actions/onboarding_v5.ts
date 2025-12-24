// @ts-nocheck
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { OnboardingSession, BodyPart, Symptom, FollowupQuestion, PriorityOption, Concern } from '@/lib/onboarding/v5/types';

// DB constants/interfaces
interface BodyPartRow {
    id: string;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    icon: string;
    category_id: string;
    requires_age_check: boolean;
    display_order: number;
}

interface ConcernRow {
    id: string;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    urgency_default: string;
    icon: string;
}

// Fetch concern details and associated symptoms
export async function getConcernDetails(concernId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('primary_concerns')
        .select('*')
        .eq('id', concernId)
        .single();

    return data;
}

export async function getSymptoms(concernId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('symptoms')
        .select('*')
        .eq('concern_id', concernId)
        .order('display_order');

    return (data as unknown as Symptom[]) || [];
}

export async function getFollowupQuestions(concernId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('followup_questions')
        .select('*')
        .eq('concern_id', concernId)
        .order('display_order');

    return data?.map((q: any) => {
        let optionsEn: any[] = [];
        let optionsAr: any[] = [];

        // Handle new structured options format (from JSONB "options" key in seed data)
        if (q.options && q.options.options && Array.isArray(q.options.options)) {
            const structuredOptions = q.options.options;
            optionsEn = structuredOptions;
            optionsAr = structuredOptions;
        }
        // Handle legacy/alternate format where options are separated
        else if (q.options?.en || q.options?.ar) {
            optionsEn = q.options.en || [];
            optionsAr = q.options.ar || [];
        }

        return {
            id: q.id,
            question_ar: q.question_ar,
            question_en: q.question_en,
            type: q.question_type as 'boolean' | 'multiple_choice' | 'text',
            options_ar: optionsAr,
            options_en: optionsEn
        };
    }) as FollowupQuestion[] || [];
}

export async function getPriorityOptions() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('priority_options')
        .select('*')
        .order('display_order');
    return (data as unknown as PriorityOption[]) || [];
}

// ============================================
// 0. FETCH TAXONOMY DATA
// ============================================

export async function getOnboardingCategories() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('onboarding_categories')
        .select('*')
        .order('display_order');
    return data || [];
}

export async function getBodyParts(categoryId?: string) {
    const supabase = await createClient();
    let query = supabase
        .from('body_parts')
        .select('*')
        .order('display_order');

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data } = await query;
    return (data as unknown as BodyPartRow[])?.map((bp) => ({
        id: bp.id,
        nameAr: bp.name_ar,
        nameEn: bp.name_en,
        descriptionAr: bp.description_ar,
        descriptionEn: bp.description_en,
        icon: bp.icon,
        svgPath: '', // We removed the SVG map, so this can be empty or used for something else
        concerns: [], // We fetch concerns later dynamically
        requiresAgeCheck: bp.requires_age_check,
        estimatedQuestions: 5,
        categories: [bp.category_id] as string[]
    })) as BodyPart[] || [];
}

// Fetch single body part details
export async function getBodyPartDetails(id: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('body_parts')
        .select('*')
        .eq('id', id)
        .single();

    if (!data) return null;

    const details = data as any;
    return {
        id: details.id,
        nameAr: details.name_ar,
        nameEn: details.name_en,
        descriptionAr: details.description_ar,
        descriptionEn: details.description_en,
        category: details.category_id as any
    };
}

export async function getPrimaryConcerns(bodyPartId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('primary_concerns')
        .select('*')
        .eq('body_part_id', bodyPartId)
        .order('display_order');

    return (data as unknown as ConcernRow[])?.map((c) => ({
        id: c.id,
        icon: c.icon as any, // This is just a string from DB (emoji), frontend expects ReactNode.
        titleAr: c.name_ar,
        titleEn: c.name_en,
        descriptionAr: c.description_ar,
        descriptionEn: c.description_en,
        category: 'health',
        symptoms: [],
        urgency: c.urgency_default as any
    })) as Concern[] || [];
}

// ============================================
// ============================================
// 1. CREATE / FETCH SESSION
// ============================================

export async function getOnboardingSession(sessionId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('onboarding_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

    return data;
}

export async function createOnboardingSession(bodyPart: string) {
    const supabase = await createClient();

    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();

    const sessionData: Partial<OnboardingSession> = {
        body_part: bodyPart,
        patient_id: user?.id || null,
        session_token: user ? null : generateSessionToken(),
        primary_concern: null
    };

    const { data, error } = await supabase
        .from('onboarding_sessions')
        .insert(sessionData as any) // Supabase types might not match exact Partial<OnboardingSession>
        .select()
        .single();

    if (error) {
        console.error('SERVER ERROR creating session:', JSON.stringify(error, null, 2));
        console.error('Session Data:', sessionData);
        throw new Error(`Failed to create onboarding session: ${error.message}`);
    }

    return data;
}

// ============================================
// 2. UPDATE ONBOARDING SESSION
// ============================================

interface UpdateSessionData {
    sessionId: string;
    primaryConcern?: string;
    symptoms?: string[];
    ageRange?: string;
    previousDiagnosis?: boolean;
    urgency?: string;
    priorities?: {
        experience?: number;
        price?: number;
        speed?: number;
        hospital?: number;
        location?: number;
        approach?: number;
    };
    userFeedback?: string;
    contextAnswers?: Record<string, any>;
}

export async function updateOnboardingSession(data: UpdateSessionData) {
    const supabase = await createClient();

    const { sessionId, ...updates } = data;

    // Convert priorities object to individual columns
    const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString()
    };

    if (updates.primaryConcern) {
        dbUpdates.primary_concern = updates.primaryConcern;
    }

    if (updates.symptoms) {
        dbUpdates.symptoms_selected = updates.symptoms;
    }

    if (updates.ageRange) {
        dbUpdates.age_range = updates.ageRange;
    }

    if (updates.previousDiagnosis !== undefined) {
        dbUpdates.previous_diagnosis = updates.previousDiagnosis;
    }

    if (updates.urgency) {
        dbUpdates.urgency = updates.urgency;
    }

    if (updates.priorities) {
        dbUpdates.priority_experience = updates.priorities.experience;
        dbUpdates.priority_price = updates.priorities.price;
        dbUpdates.priority_speed = updates.priorities.speed;
        dbUpdates.priority_hospital = updates.priorities.hospital;
        dbUpdates.priority_location = updates.priorities.location;
        dbUpdates.priority_approach = updates.priorities.approach;
    }

    if (updates.userFeedback) {
        // Fetch existing feedback to append
        const { data: existing } = await supabase
            .from('onboarding_sessions')
            .select('user_feedback')
            .eq('id', sessionId)
            .single();

        const oldFeedback = (existing as any)?.user_feedback || '';
        const separator = oldFeedback ? '\n---\n' : '';
        dbUpdates.user_feedback = `${oldFeedback}${separator}${updates.userFeedback}`;
    }

    if (updates.contextAnswers) {
        // Store answers as a tagged JSON block in user_feedback
        const answersStr = `[CONTEXT_ANSWERS]${JSON.stringify(updates.contextAnswers)}`;

        // Fetch existing feedback to append
        const { data: existing } = await supabase
            .from('onboarding_sessions')
            .select('user_feedback')
            .eq('id', sessionId)
            .single();

        const oldFeedback = (existing as any)?.user_feedback || '';
        // If we already have answers, we might want to replace them or append. 
        // For simplicity, let's just append if it's not already there, or replace the block.
        if (oldFeedback.includes('[CONTEXT_ANSWERS]')) {
            dbUpdates.user_feedback = oldFeedback.replace(/\[CONTEXT_ANSWERS\].*$/, answersStr);
        } else {
            const separator = oldFeedback ? '\n' : '';
            dbUpdates.user_feedback = `${oldFeedback}${separator}${answersStr}`;
        }
    }

    const { error } = await supabase
        .from('onboarding_sessions')
        .update(dbUpdates as any)
        .eq('id', sessionId);

    if (error) {
        console.error('Error updating session (updateOnboardingSession):', JSON.stringify(error, null, 2));
        console.error('Payload:', JSON.stringify(dbUpdates, null, 2));
        throw new Error(`Failed to update onboarding session: ${error.message}`);
    }

    revalidatePath('/onboarding/v5');
}

// ============================================
// 3. COMPLETE ONBOARDING
// ============================================

export async function completeOnboarding(sessionId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('onboarding_sessions')
        .update({
            completed: true,
            completed_at: new Date().toISOString()
        } as any)
        .eq('id', sessionId);

    if (error) {
        console.error('Error completing onboarding:', error);
        throw new Error('Failed to complete onboarding');
    }

    // Update patient record
    const { data: session } = await supabase
        .from('onboarding_sessions')
        .select('patient_id')
        .eq('id', sessionId)
        .single();

    const safeSession = session as any;

    if (safeSession?.patient_id) {
        await supabase
            .from('patients')
            .update({
                onboarding_completed: true,
                onboarding_completed_at: new Date().toISOString(),
                profile_completeness: 45  // Base completeness
            } as any)
            .eq('id', safeSession.patient_id);
    }

    revalidatePath('/onboarding/v5');
}

// ============================================
// 4. SCHEDULE NURSE CONSULTATION
// ============================================

interface ScheduleNurseCallData {
    sessionId: string;
    requestedDateTime: string;
    phone: string;
    email?: string;
    preferredLanguage: 'ar' | 'en';
    concerns?: string;
}

export async function scheduleNurseCall(data: ScheduleNurseCallData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in to schedule a call');
    }

    // Create nurse consultation record
    const { data: consultation, error } = await supabase
        .from('nurse_consultations')

        .insert({
            patient_id: user.id,
            onboarding_session_id: data.sessionId,
            requested_datetime: data.requestedDateTime,
            patient_phone: data.phone,
            patient_email: data.email,
            preferred_language: data.preferredLanguage,
            patient_concerns: data.concerns,
            status: 'requested'
        } as any)
        .select()
        .single();

    if (error) {
        console.error('Error scheduling nurse call:', error);
        throw new Error('Failed to schedule nurse consultation');
    }

    // Update onboarding session
    await supabase
        .from('onboarding_sessions')
        .update({
            scheduled_nurse_call: true,
            nurse_call_datetime: data.requestedDateTime
        } as any)
        .eq('id', data.sessionId);

    // TODO: Send confirmation email/SMS
    // await sendNurseCallConfirmation(user.email, consultation);

    revalidatePath('/onboarding/v5/results');

    return consultation;
}

// ============================================
// 5. UPLOAD MEDICAL DOCUMENT
// ============================================

export async function uploadMedicalDocument(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in to upload documents');
    }

    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const documentDate = formData.get('documentDate') as string;
    const sessionId = formData.get('sessionId') as string;
    const notes = formData.get('notes') as string;

    // Validate file
    if (!file || file.size === 0) {
        throw new Error('No file provided');
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, HEIC, and PDF are allowed');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false
        });

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('Failed to upload file');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('medical-documents')
        .getPublicUrl(fileName);

    // Save document metadata to database
    const { data: document, error: dbError } = await supabase
        .from('medical_documents')

        .insert({
            patient_id: user.id,
            onboarding_session_id: sessionId,
            file_url: publicUrl,
            file_name: file.name,
            file_size_bytes: file.size,
            file_type: file.type,
            document_type: documentType,
            document_date: documentDate || null,
            notes: notes || null
        } as any)
        .select()
        .single();

    if (dbError) {
        console.error('Error saving document metadata:', dbError);
        // Try to clean up uploaded file
        await supabase.storage.from('medical-documents').remove([fileName]);
        throw new Error('Failed to save document metadata');
    }

    // Check if discount unlocked (3+ documents)
    const { count } = await supabase
        .from('medical_documents')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user.id)
        .eq('onboarding_session_id', sessionId);

    const discountUnlocked = (count || 0) >= 3;

    // Update profile completeness
    const newCompleteness = calculateProfileCompleteness(count || 0);
    await supabase
        .from('patients')
        .update({ profile_completeness: newCompleteness } as any)
        .eq('id', user.id);

    revalidatePath('/onboarding/v5/results');

    return {
        document,
        totalDocuments: count || 0,
        discountUnlocked
    };
}

// ============================================
// 6. DELETE MEDICAL DOCUMENT
// ============================================

export async function deleteMedicalDocument(documentId: string) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in');
    }

    // Get document details
    const { data: document } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('id', documentId)
        .eq('patient_id', user.id)  // Security: ensure user owns document
        .single();

    if (!document) {
        throw new Error('Document not found');
    }

    // Extract filename from URL
    const fileName = (document as any).file_url.split('/').pop();

    // Delete from storage
    if (fileName) { // Ensure fileName exists
        await supabase.storage
            .from('medical-documents')
            .remove([`${user.id}/${fileName}`]);
    }

    // Delete from database
    const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);

    if (error) {
        console.error('Error deleting document:', error);
        throw new Error('Failed to delete document');
    }

    revalidatePath('/onboarding/v5/results');
}


// ============================================
// HELPER FUNCTIONS
// ============================================

function generateSessionToken(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

function calculateProfileCompleteness(documentCount: number): number {
    // Base: 45% (onboarding completed)
    // +15% per document (max 3 documents = +45%)
    const baseCompleteness = 45;
    const documentBonus = Math.min(documentCount * 15, 45);
    return baseCompleteness + documentBonus;
}
