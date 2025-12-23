
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function patch() {
    const appointmentId = 'b55dd403-9614-4ae6-8a82-cb97bba93ad4';
    console.log(`Patching consultation ${appointmentId}...`);

    // 1. Get Patient ID (Profile ID from appointments table)
    const { data: appData, error: appError } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('id', appointmentId)
        .single();

    if (appError || !appData) {
        console.error('Appointment not found:', appError);
        return;
    }
    const profileId = appData.patient_id;
    console.log(`Profile ID: ${profileId}`);

    // 2. Fetch Medical Documents (connected to profile_id/user_id directly now)
    const { data: docs1 } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('patient_id', profileId);

    // FORCE FETCH ALL records for debugging/fixing this specific instance
    console.log("Force fetching all records from patient_records...");
    const { data: allPatientRecords } = await supabase.from('patient_records').select('*');

    // Also fetch all medical_documents just in case
    const { data: allMedicalDocs } = await supabase.from('medical_documents').select('*');

    const allDocs = [
        ...(allMedicalDocs || []).map(d => ({
            name: d.document_name,
            url: d.document_url,
            type: 'document',
            originId: d.id
        })),
        ...(allPatientRecords || []).map(d => ({
            name: d.file_name || d.description,
            url: null,
            path: d.file_path,
            bucket: 'patient_records'
        }))
    ];

    // Sign URLs for patient records
    for (let doc of allDocs) {
        if (!doc.url && doc.path && doc.bucket) {
            const { data } = await supabase.storage.from(doc.bucket).createSignedUrl(doc.path, 60 * 60 * 24 * 7); // 7 days
            doc.url = data?.signedUrl;
        }
    }

    if (allDocs.length === 0) {
        console.log('No documents found in either table.');
        return;
    }

    console.log(`Found ${allDocs.length} total documents. Updating...`);

    // 4. Update
    const { error: updateError } = await supabase
        .from('pre_consultation_data')
        .update({ uploaded_files: allDocs })
        .eq('appointment_id', appointmentId);

    if (updateError) {
        console.error('Update failed:', updateError);
    } else {
        console.log('Success! Consultation data updated.');
    }
}

patch();
