'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitIntakeForm(data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        // 1. Save/Update Intake Form
        const { data: intake, error: intakeError } = await supabase
            .from('consultation_intake_forms')
            .upsert({
                appointment_id: data.appointmentId,
                patient_id: user.id,
                chief_complaint: data.chiefComplaint,
                symptoms_duration: data.symptomsDuration,
                severity_level: parseInt(data.severityLevel),
                current_symptoms: data.currentSymptoms,
                symptom_details: data.symptomDetails,
                tried_medications: data.triedMedications ? data.triedMedications.split('\n') : [],
                previous_consultations_for_issue: parseInt(data.previousConsultations || 0),
                is_pregnant: data.isPregnant === 'yes',
                is_breastfeeding: data.isBreastfeeding === 'yes',
                menstrual_concerns: data.menstrualConcerns === 'yes',
                menstrual_details: data.menstrualDetails,
                consent_share_medical_records: data.consentShare,
                consent_timestamp: data.consentShare ? new Date().toISOString() : null,
                uploaded_document_ids: data.uploadedDocumentIds, // Array of UUIDs
                is_complete: true,
                completed_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (intakeError) throw intakeError;

        // 2. Update Patient Medical Record (EMR) if needed
        // We only update generic info if provided (like chronic conditions from checkboxes)
        // For now, we assume EMR is updated separately or we just specific fields.
        // The spec says "also update/create patient_medical_records".

        if (data.chronicConditions || data.allergies || data.currentMedicationsList) {
            const updates: any = {};
            if (data.chronicConditions) updates.chronic_conditions = data.chronicConditions; // Array
            if (data.allergies) updates.allergies = data.allergies.split('\n');
            if (data.currentMedicationsList) updates.current_medications = data.currentMedicationsList.split('\n');

            if (Object.keys(updates).length > 0) {
                await supabase
                    .from('patient_medical_records')
                    .upsert({
                        patient_id: user.id,
                        ...updates,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'patient_id' });
            }
        }

        revalidatePath(`/patient/appointments/${data.appointmentId}`);
        return { success: true, intakeId: intake.id };
    } catch (error: any) {
        console.error('Intake submission error:', error);
        return { error: error.message };
    }
}
