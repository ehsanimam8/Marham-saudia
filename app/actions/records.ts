"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Unified type for returned records
export interface MedicalRecord {
    id: string;
    name: string;
    type: string;
    date: string;
    url: string | null;
    filePath: string | null;
    bucket: string;
    source: 'dashboard' | 'chat' | 'medical_documents';
}

/**
 * Unified function to upload a file and save it as a medical document.
 * This should be used by Dashboard, Pre-Consultation, and Chat flows.
 */
export async function saveMedicalDocument(formData: FormData) {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    // Optional metadata
    const recordType = (formData.get('recordType') as string) || 'report';
    const bucketName = 'medical-records'; // Standardize on this bucket

    if (!file) throw new Error("No file uploaded");

    // 2. Upload File to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Use Admin Client if needed for RLS bypass or robust upload, strictly speaking service role shouldn't be needed for own files 
    // if Policies are correct. But let's use standard client first.
    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

    if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error("Failed to upload file");
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    // 3. Insert Record into Unified 'medical_documents' DB
    // We use user.id directly as patient_id now (Unified approach)
    const { data: newDoc, error: dbError } = await (supabase
        .from('medical_documents') as any)
        .insert({
            patient_id: user.id,
            document_name: description || file.name,
            document_url: publicUrl,
            document_type: file.type.includes('image') ? 'image' : 'report',
            uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

    if (dbError) {
        console.error('DB error:', dbError);
        throw new Error("Failed to save record details");
    }

    revalidatePath('/dashboard/records');

    // Return normalized record
    return {
        success: true,
        record: {
            id: newDoc.id,
            name: newDoc.document_name,
            type: newDoc.document_type,
            date: newDoc.uploaded_at,
            url: newDoc.document_url,
            filePath: null, // It's public usually in this bucket
            bucket: bucketName,
            source: 'medical_documents'
        }
    };
}

/**
 * Deprecated wrapper for legacy dashboard calls if any.
 * Redirects to new logic but adapts arguments if needed.
 */
export async function uploadMedicalRecord(formData: FormData) {
    return saveMedicalDocument(formData);
}

/**
 * Centralized fetcher for all medical records.
 * Merges legacy 'patient_records' with new 'medical_documents'.
 */
export async function getPatientRecords(): Promise<MedicalRecord[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // 1. Fetch Legacy 'patient_records' (requires patient ID lookup)
    let legacyRecords: any[] = [];
    try {
        const { data: patient } = await (supabase.from('patients') as any).select('id').eq('profile_id', user.id).single();
        if (patient) {
            const { data: recs } = await (supabase.from('patient_records') as any).select('*').eq('patient_id', patient.id);
            if (recs) legacyRecords = recs;
        }
    } catch (e) {
        console.error("Legacy fetch error", e);
    }

    // 2. Fetch Unified 'medical_documents' (direct user.id)
    let newDocs: any[] = [];
    try {
        const { data: docs } = await (supabase.from('medical_documents') as any).select('*').eq('patient_id', user.id);
        if (docs) newDocs = docs;
    } catch (e) {
        console.error("Medical docs fetch error", e);
    }

    // 3. Normalize and Combine
    const cleanName = (name: string, desc?: string) => {
        if (desc && desc.trim().length > 0) return desc;
        // Strip extension and replace underscores/dashes with spaces
        return name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    };

    const normalizedLegacy = legacyRecords.map((r: any) => ({
        id: r.id,
        name: cleanName(r.file_name, r.description),
        type: r.record_type || 'report',
        date: r.record_date || r.created_at,
        url: null, // Needs signing
        filePath: r.file_path,
        bucket: 'patient_records',
        source: 'dashboard' as const
    }));

    const normalizedNew = newDocs.map((d: any) => ({
        id: d.id,
        name: cleanName(d.document_name || 'Medical Document'),
        type: d.document_type || 'report',
        date: d.uploaded_at || d.created_at,
        url: d.document_url, // Usually public
        filePath: null,
        bucket: 'medical-records',
        source: 'medical_documents' as const
    }));

    // 4. Sign URLs for legacy private items
    const legacyWithUrls = await Promise.all(normalizedLegacy.map(async (rec) => {
        if (rec.bucket && rec.filePath) {
            try {
                const { data } = await supabase.storage.from(rec.bucket).createSignedUrl(rec.filePath, 3600);
                if (data?.signedUrl) return { ...rec, url: data.signedUrl };
            } catch (e) { return rec; }
        }
        return rec;
    }));

    const allRecords = [...legacyWithUrls, ...normalizedNew].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return allRecords;
}
