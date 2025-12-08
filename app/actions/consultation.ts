'use server';

import { createClient } from '@/lib/supabase/server';

export async function getConsultationData(appointmentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Verify access (Doctor or Patient)
    const { data: appointment, error } = await supabase
        .from('appointments')
        .select(`
      *,
      patient:patients!inner(
        id,
        profile:profiles(*)
      ),
      doctor:doctors!inner(
        id,
        profile:profiles(*)
      ),
      intake_form:consultation_intake_forms(*)
    `)
        .eq('id', appointmentId)
        .single();

    if (error || !appointment) {
        console.error("Error fetching consultation:", error);
        throw new Error('Consultation not found');
    }

    // Check if user is doctor or patient
    const isDoctor = appointment.doctor.profile.id === user.id;
    const isPatient = appointment.patient.profile.id === user.id;

    if (!isDoctor && !isPatient) {
        // Maybe admin?
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') {
            throw new Error('Unauthorized access to this consultation');
        }
    }

    // If Doctor, fetch Medical Records (if consented)
    let medicalRecord = null;
    let documents = [];
    let pastConsultations = [];

    if (isDoctor && appointment.intake_form?.consent_share_medical_records) {
        // Fetch EMR
        const { data: record } = await supabase
            .from('patient_medical_records')
            .select('*')
            .eq('patient_id', appointment.patient.profile.id) // Auth ID
            .single();
        medicalRecord = record;

        // Fetch Documents
        const { data: docs } = await supabase
            .from('medical_documents')
            .select('*')
            .eq('patient_id', appointment.patient.profile.id)
            .order('created_at', { ascending: false });
        documents = docs || [];

        // Fetch Past Consultations (Notes)
        // (Optional for MVP)
    }

    // Fetch Documents uploaded specifically for this intake (even without full record consent? Spec says documents are part of records)
    // Spec: "Your medical records include... Uploaded documents from past consultations"
    // But documents for THIS consultation should be visible.
    if (isDoctor && appointment.intake_form?.uploaded_document_ids && appointment.intake_form.uploaded_document_ids.length > 0) {
        const { data: intakeDocs } = await supabase
            .from('medical_documents')
            .select('*')
            .in('id', appointment.intake_form.uploaded_document_ids);
        if (intakeDocs) {
            // Merge avoiding duplicates
            const existingIds = new Set(documents.map((d: any) => d.id));
            intakeDocs.forEach((d: any) => {
                if (!existingIds.has(d.id)) documents.push(d);
            });
        }
    }

    return {
        appointment,
        intakeForm: appointment.intake_form,
        medicalRecord,
        documents,
        userRole: isDoctor ? 'doctor' : (isPatient ? 'patient' : 'admin'),
        currentUser: user
    };
}
