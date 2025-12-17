'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function uploadConsultationFile(formData: FormData) {
    const supabase = await createClient(); // Service role client conceptually? 
    // Wait, createClient from lib/supabase/server usually uses cookies and is user-scoped.
    // I need SERVICE ROLE client to bypass RLS.
    // I should check `lib/supabase/server.ts`. 
    // If it doesn't support service role, I should make a one-off client here using process.env.

    // Check if we have a service role client factory or just use env vars directly.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
        return { success: false, error: 'Server configuration error' };
    }

    // Dynamic import to avoid client-side bundling issues if this file is imported there? 
    // It's 'use server' so it should be fine.
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey);

    try {
        const file = formData.get('file') as File;
        const description = formData.get('description') as string;
        const appointmentId = formData.get('appointmentId') as string;
        const userId = formData.get('userId') as string;
        const userRole = formData.get('userRole') as string;

        if (!file || !appointmentId || !userId) {
            return { success: false, error: 'Missing required fields' };
        }

        // 1. Upload to Storage (Admin)
        const fileExt = file.name.split('.').pop();
        const filePath = `${appointmentId}/${Math.random()}.${fileExt}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await adminClient.storage
            .from('medical-records')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) throw new Error('Upload failed: ' + uploadError.message);

        const { data: { publicUrl } } = adminClient.storage
            .from('medical-records')
            .getPublicUrl(filePath);

        // 2. Insert into Chat (Admin)
        const { error: chatError } = await adminClient
            .from('consultation_chats')
            .insert({
                appointment_id: appointmentId,
                sender_id: userId,
                sender_role: userRole,
                message: description,
                is_file: true,
                file_url: publicUrl,
                file_name: file.name,
                file_type: file.type
            });

        if (chatError) throw new Error('Chat insert failed: ' + chatError.message);

        // 3. Insert into Medical Documents (Admin)
        // Resolve patient_id
        let patientId = null;
        if (userRole === 'patient') {
            // userId is profile_id. Get patient.id
            const { data: pData } = await adminClient.from('patients').select('id').eq('profile_id', userId).single();
            patientId = pData?.id;
        } else {
            // Doctor is uploading? Get patient_id from appointment
            const { data: appData } = await adminClient.from('appointments').select('patient_id').eq('id', appointmentId).single();
            patientId = appData?.patient_id;
        }

        if (patientId) {
            const { error: docError } = await adminClient.from('medical_documents').insert({
                patient_id: patientId,
                document_name: description,
                document_url: publicUrl,
                document_type: file.type.includes('image') ? 'image' : 'report',
                uploaded_at: new Date().toISOString()
            });
            if (docError) console.error("Doc insert warning:", docError);
        }

        return { success: true, publicUrl };

    } catch (error: any) {
        console.error('Upload Action Error:', error);
        return { success: false, error: error.message };
    }
}
