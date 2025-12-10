"use server";

import { createClient } from '@/lib/supabase/server';

export async function saveMedicalDocument(fileData: {
    fileName: string;
    filePath: string;
    fileSize?: number;
    fileType?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Try New Schema (20241210)
    const { data, error } = await (supabase
        .from('medical_documents') as any)
        .insert({
            patient_id: user.id,
            document_name: fileData.fileName,
            document_url: fileData.filePath,
            document_type: 'lab_report',
            // upload_date: new Date().toISOString() // Let DB handle default
        })
        .select()
        .single();

    if (!error) {
        return data;
    }

    console.warn("Primary insert failed, attempting fallback to legacy schema...", error.message);

    // Fallback to Old Schema (20241208)
    // Schema: title (NOT NULL), file_url (NOT NULL), file_name, uploaded_by, etc.
    if (error.code === 'PGRST204' || error.message.includes('document_name')) {
        const { data: legacyData, error: legacyError } = await (supabase
            .from('medical_documents') as any)
            .insert({
                patient_id: user.id,
                title: fileData.fileName, // Map document_name to title
                file_url: fileData.filePath, // Use file_path as url
                file_name: fileData.fileName,
                document_type: 'lab_report',
                uploaded_by: user.id
            })
            .select()
            .single();

        if (legacyError) {
            console.error("Legacy insert also failed:", legacyError);
            throw new Error(`Failed to save document: ${legacyError.message}`);
        }

        return legacyData;
    }

    throw new Error(`Failed to save document: ${error.message}`);
}
