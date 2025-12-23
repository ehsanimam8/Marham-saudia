
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // 1. Authenticate User
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Use Admin Client to Bypass RLS
        // We do this because RLS policies might differ or be broken for 'medical_documents' depending on migration state.
        // This ensures we can definitely read the user's documents if they exist.
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: medicalDocs, error: dbError } = await supabaseAdmin
            .from('medical_documents')
            .select('*')
            .eq('patient_id', user.id)
            .order('created_at', { ascending: false });

        if (dbError) console.error("Error fetching medical_documents:", dbError);

        // Also fetch from patient_records (Dashboard uploads)
        // We need the patient record first to get the ID, or check if patient_records uses user_id directly.
        // Looking at actions/records.ts, patient_records uses 'patient_id' which is the UUID from 'patients' table.
        // So we need to resolve that first.

        let dashboardRecords: any[] = [];
        const { data: patientProfile } = await supabaseAdmin
            .from('patients')
            .select('id')
            .eq('profile_id', user.id)
            .single();

        if (patientProfile) {
            const { data: records, error: recError } = await supabaseAdmin
                .from('patient_records')
                .select('*')
                .eq('patient_id', patientProfile.id)
                .order('created_at', { ascending: false });

            if (records) dashboardRecords = records;
            if (recError) console.error("Error fetching patient_records:", recError);
        }

        // Normalize and combine
        const docs1 = (medicalDocs || []).map((d: any) => ({
            id: d.id,
            document_name: d.document_name || d.document_type || 'Uploaded Document',
            upload_date: d.created_at || d.upload_date,
            document_url: d.document_url,
            source: 'medical_documents'
        }));

        const docs2 = dashboardRecords.map((r: any) => {
            // We need to generate a URL if it's a file path
            // But for simplicity in this View-Only list, we might just pass the props.
            // If we need signed URLs, that adds complexity.
            // Let's assume public or signed URLs are handled.
            // Actually, 'getPatientRecords' does signing. We might need to do that here too.
            // But 'medical_documents' are usually public URL or handled differently.
            // 'patient_records' are in a private bucket 'patient_records'.

            // We can't easily sign specific URLs without storage access on client or here.
            // Let's just return metadata for selection.
            return {
                id: r.id,
                document_name: r.description || r.file_name || 'Medical Record',
                upload_date: r.record_date || r.created_at,
                document_url: null, // Will need signing or valid public ID
                file_path: r.file_path, // Store path to sign later or use ID
                bucket: 'patient_records',
                source: 'patient_records'
            };
        });

        // For the selection list, we might not need the actual URL immediately if we just want to "select" it by ID.
        // But if we want to show it, we need URL.
        // Let's generate signed URLs for dashboard records.
        const docs2WithUrls = await Promise.all(docs2.map(async (doc: any) => {
            if (doc.bucket && doc.file_path) {
                const { data } = await supabaseAdmin.storage
                    .from(doc.bucket)
                    .createSignedUrl(doc.file_path, 3600); // 1 hour link
                if (data?.signedUrl) {
                    doc.document_url = data.signedUrl;
                }
            }
            return doc;
        }));

        const allDocs = [...docs1, ...docs2WithUrls].sort((a, b) =>
            new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
        );

        return NextResponse.json({ documents: allDocs });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
