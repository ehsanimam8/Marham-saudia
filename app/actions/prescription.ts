'use server';

import { createClient } from '@/lib/supabase/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { revalidatePath } from 'next/cache';

export async function submitConsultation(data: any) {
    const supabase = await createClient();
    const { appointmentId, doctorId, patientId, diagnosis, notes, prescription } = data;

    try {
        // 1. Save Consultation Notes
        const { data: noteData, error: noteError } = await (supabase
            .from('consultation_notes') as any)
            .upsert({
                appointment_id: appointmentId,
                doctor_id: doctorId,
                patient_id: patientId,
                subjective_notes: notes.subjective,
                objective_findings: notes.objective,
                diagnosis: diagnosis.primary,
                differential_diagnosis: diagnosis.differential, // array
                treatment_plan: notes.plan,
                follow_up_required: notes.followUp,
                follow_up_timeframe: notes.followUpTimeframe,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'appointment_id' })
            .select()
            .single();

        if (noteError) throw new Error(`Notes Error: ${noteError.message}`);

        // 2. Save Prescription (if meds exist)
        let prescriptionUrl = null;
        if (prescription && prescription.medications && prescription.medications.length > 0) {
            // Generate PDF
            const pdfBytes = await generatePrescriptionPDF({
                doctorName: data.doctorName,
                patientName: data.patientName,
                date: new Date().toLocaleDateString(),
                diagnosis: diagnosis.primary,
                medications: prescription.medications,
                instructions: prescription.instructions
            });

            // Upload PDF
            const fileName = `prescription-${appointmentId}-${Date.now()}.pdf`;
            const filePath = `prescriptions/${appointmentId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('medical-files') // Reusing bucket
                .upload(filePath, pdfBytes, { contentType: 'application/pdf' });

            if (uploadError) console.error("PDF Upload Error:", uploadError);

            const { data: { publicUrl } } = supabase.storage
                .from('medical-files')
                .getPublicUrl(filePath);

            prescriptionUrl = publicUrl;

            // Insert into DB
            const { error: rxError } = await (supabase
                .from('prescriptions') as any)
                .insert({
                    appointment_id: appointmentId,
                    doctor_id: doctorId,
                    patient_id: patientId,
                    consultation_note_id: noteData.id,
                    medications: prescription.medications, // JSONB
                    general_instructions: prescription.instructions,
                    prescription_pdf_url: publicUrl,
                    issued_date: new Date().toISOString()
                });

            if (rxError) throw new Error(`Prescription DB Error: ${rxError.message}`);
        }

        // 3. Mark Appointment Completed
        const { error: apptError } = await (supabase
            .from('appointments') as any)
            .update({ status: 'completed' })
            .eq('id', appointmentId);

        if (apptError) throw new Error(`Update Status Error: ${apptError.message}`);

        // 4. Update Patient Medical Record (add diagnosis to chronic if needed?)
        // For MVP we skip auto-updating chronic conditions unless specified.

        revalidatePath(`/doctor-portal/appointments`);

        return { success: true, prescriptionUrl };

    } catch (error: any) {
        console.error("Submit Consultation Error:", error);
        return { success: false, error: error.message };
    }
}

import fontkit from '@pdf-lib/fontkit';

// ... (existing imports)

async function generatePrescriptionPDF(data: any) {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Fetch Arabic Font (Amiri)
    const fontUrl = 'https://fonts.gstatic.com/s/amiri/v26/J7aRnpd8CGxBHpUrtLMA7w.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());

    // Embed Fonts
    const arabicFont = await pdfDoc.embedFont(fontBytes);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontSize = 12;
    const padding = 50;
    let y = height - padding;

    // Helper to draw text right-aligned for Arabic (optional, but good for RTL)
    // For now we stick to LTR for layout simplicity but use the Arabic font.

    // Header (English)
    page.drawText('MARHAM SAUDI - PRESCRIPTION', { x: padding, y, size: 18, font: helveticaBold, color: rgb(0.05, 0.58, 0.53) });
    y -= 30;

    // Doctor/Patient Info
    // Note: Names might be Arabic
    page.drawText(`Doctor: ${data.doctorName}`, { x: padding, y, size: fontSize, font: arabicFont });
    y -= 20;
    page.drawText(`Patient: ${data.patientName}`, { x: padding, y, size: fontSize, font: arabicFont });
    y -= 20;
    page.drawText(`Date: ${data.date}`, { x: padding, y, size: fontSize, font: arabicFont });
    y -= 40;

    // Diagnosis
    page.drawText('Diagnosis:', { x: padding, y, size: 14, font: helveticaBold });
    y -= 20;
    page.drawText(data.diagnosis || 'N/A', { x: padding, y, size: fontSize, font: arabicFont });
    y -= 40;

    // Rx
    page.drawText('Rx (Medications):', { x: padding, y, size: 14, font: helveticaBold });
    y -= 20;

    data.medications.forEach((med: any, index: number) => {
        const text = `${index + 1}. ${med.name} - ${med.dosage}`;
        // Medications are usually English, but instructions might be Arabic
        page.drawText(text, { x: padding, y, size: fontSize, font: arabicFont });
        y -= 15;
        page.drawText(`   Freq: ${med.frequency} | Duration: ${med.duration}`, { x: padding, y, size: fontSize - 2, font: arabicFont });
        y -= 15;
        if (med.instructions) {
            page.drawText(`   Note: ${med.instructions}`, { x: padding, y, size: fontSize - 2, font: arabicFont, color: rgb(0.4, 0.4, 0.4) });
            y -= 15;
        }
        y -= 10;
    });

    if (data.instructions) {
        y -= 20;
        page.drawText('Instructions:', { x: padding, y, size: 14, font: helveticaBold });
        y -= 20;
        page.drawText(data.instructions, { x: padding, y, size: fontSize, font: arabicFont });
    }

    // Footer
    page.drawText('This is a digital prescription issued via Marham.sa', {
        x: padding,
        y: 30,
        size: 10,
        font: helveticaBold, // Use standard for footer
        color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
