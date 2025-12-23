"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadMedicalRecord(formData: FormData) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Get Patient ID
    const { data: patient } = await (supabase
        .from('patients') as any)
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (!patient) throw new Error("Patient profile not found");

    const file = formData.get('file') as File;
    const recordType = formData.get('recordType') as string;
    const description = formData.get('description') as string;
    const recordDate = formData.get('recordDate') as string;

    if (!file) throw new Error("No file uploaded");

    // 1. Upload File to Supabase Storage
    // Structure: {user_id}/{timestamp}_{filename}
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('patient_records')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error("Failed to upload file");
    }

    // 2. Insert Record into DB
    const { error: dbError } = await (supabase
        .from('patient_records') as any)
        .insert({
            patient_id: patient.id,
            record_type: recordType, // prescription, lab_result, etc.
            file_path: filePath,
            file_name: file.name,
            description: description,
            record_date: recordDate || new Date().toISOString(),
            ai_status: 'pending' // Default for future AI feature
        });

    if (dbError) {
        console.error('DB error:', dbError);
        throw new Error("Failed to save record details");
    }

    revalidatePath('/dashboard/records');
    return { success: true };
}

// ... existing imports

export async function getPatientRecords() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: patient } = await (supabase
        .from('patients') as any)
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (!patient) return [];

    // 1. Fetch from 'patient_records' (Dashboard uploads - uses table ID)
    const { data: manualRecords, error: rError } = await (supabase
        .from('patient_records') as any)
        .select('*')
        .eq('patient_id', patient.id);

    // 2. Fetch from 'medical_documents' (Chat/Pre-consult - uses auth ID)
    const { data: chatDocs, error: dError } = await (supabase
        .from('medical_documents') as any)
        .select('*')
        // Try linking via both IDs to be safe, or just user.id as per recent convention.
        // Recent convention is user.id.
        .eq('patient_id', user.id);

    // Log errors but don't fail completeflow
    if (rError) console.error("Error fetching patient_records", rError);
    if (dError) console.error("Error fetching medical_documents", dError);

    const records1 = manualRecords || [];
    const docs2 = chatDocs || [];

    // Normalize and Combine
    // We want a uniform shape for the frontend
    const combined = [
        ...records1.map((r: any) => ({
            id: r.id,
            name: r.file_name || 'Medical Record',
            type: r.record_type || 'report',
            date: r.record_date || r.created_at,
            url: null, // to be signed
            filePath: r.file_path,
            bucket: 'patient_records',
            source: 'dashboard'
        })),
        ...docs2.map((d: any) => {
            const rawUrl = d.document_url || d.file_url;
            const isUrl = rawUrl && (rawUrl.startsWith('http') || rawUrl.startsWith('https'));
            return {
                id: d.id,
                name: d.document_name || d.file_name || 'Consultation Document',
                type: d.document_type || 'report',
                date: d.uploaded_at || d.created_at,
                url: isUrl ? rawUrl : null,
                filePath: isUrl ? null : rawUrl,
                bucket: 'medical-records',
                source: 'chat'
            };
        })
    ];

    // Sort by date desc
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Generate signed URLs for private bucket items
    const finalRecords = await Promise.all(combined.map(async (record) => {
        let finalUrl = record.url;
        if (record.filePath && record.bucket) {
            const { data: signed } = await supabase.storage
                .from(record.bucket)
                .createSignedUrl(record.filePath, 3600);
            if (signed?.signedUrl) {
                finalUrl = signed.signedUrl;
            }
        }
        return { ...record, signedUrl: finalUrl, url: finalUrl };
    }));

    return finalRecords;
}
