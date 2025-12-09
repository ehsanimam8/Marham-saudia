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

    const { data, error } = await (supabase
        .from('patient_records') as any)
        .select('*')
        .eq('patient_id', patient.id)
        .order('record_date', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    // Generate signed URLs for display
    const recordsWithUrls = await Promise.all(data.map(async (record: any) => {
        const { data: signed } = await supabase.storage
            .from('patient_records')
            .createSignedUrl(record.file_path, 3600); // 1 hour link

        return {
            ...record,
            signedUrl: signed?.signedUrl
        };
    }));

    return recordsWithUrls;
}
