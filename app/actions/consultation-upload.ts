'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

import { saveMedicalDocument } from './records';

export async function uploadConsultationFile(formData: FormData) {
    // Check if we have a service role client factory or just use env vars directly.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
        return { success: false, error: 'Server configuration error' };
    }

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

        let publicUrl = '';
        let fileName = file.name;
        let fileType = file.type;

        // If PATIENT, use unified 'saveMedicalDocument' flow
        if (userRole === 'patient') {
            const result = await saveMedicalDocument(formData);
            if (!result.success || !result.record) throw new Error("Unified upload failed");

            publicUrl = result.record.url || '';
            fileName = result.record.name;
            // fileType is preserved from input or record
        }
        else {
            // DOCTOR (Simulate patient upload or just attach to chat?)
            // Doctors might need to upload "on behalf of patient" or just "consultation attachments".
            // For now, keep existing Admin Logic for doctors to ensure permission.

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

            const { data: urlData } = adminClient.storage
                .from('medical-records')
                .getPublicUrl(filePath);

            publicUrl = urlData.publicUrl;

            // 3. Insert into Medical Documents (Admin) - Link to patient
            const { data: appData } = await adminClient.from('appointments').select('patient_id').eq('id', appointmentId).single();
            const targetPatientId = appData?.patient_id;

            if (targetPatientId) {
                await adminClient.from('medical_documents').insert({
                    patient_id: targetPatientId,
                    document_name: description || file.name,
                    document_url: publicUrl,
                    document_type: file.type.includes('image') ? 'image' : 'report',
                    uploaded_at: new Date().toISOString()
                });
            }
        }

        // 2. Insert into Chat (Always Admin to ensure reliability)
        // Chat messages are separate from medical records but link to them via URL
        const { error: chatError } = await adminClient
            .from('consultation_chats')
            .insert({
                appointment_id: appointmentId,
                sender_id: userId,
                sender_role: userRole,
                message: description || file.name,
                is_file: true,
                file_url: publicUrl,
                file_name: fileName,
                file_type: fileType
            });

        if (chatError) throw new Error('Chat insert failed: ' + chatError.message);

        return { success: true, publicUrl };

    } catch (error: any) {
        console.error('Upload Action Error:', error);
        return { success: false, error: error.message };
    }
}
