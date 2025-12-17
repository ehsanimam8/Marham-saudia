import { createClient } from '@/lib/supabase/server';
import { jsPDF } from 'jspdf'; // Ensure jspdf is installed

export async function POST(request: Request) {
    const { appointmentId, consultation } = await request.json();
    const supabase = await createClient();

    try {
        const { data: appointmentData } = await supabase
            .from('appointments')
            .select(`
        *,
        patient:patients(profile:profiles(*)),
        doctor:doctors(scfhs_license, profile:profiles(*))
      `)
            .eq('id', appointmentId)
            .single();

        const appointment = appointmentData as any;

        if (!appointment) throw new Error('Appointment not found');
        if (!appointment.doctor || !appointment.doctor.profile) throw new Error('Doctor profile not found');
        if (!appointment.patient || !appointment.patient.profile) throw new Error('Patient profile not found');

        const doc = new jsPDF();

        // Simple PDF Generation Logic
        doc.text('MARHAM PRESCRIPTION', 20, 20);
        doc.text(`Doctor: ${appointment.doctor.profile.full_name_en || 'Unknown'}`, 20, 30);
        doc.text(`Patient: ${appointment.patient.profile.full_name_en || 'Unknown'}`, 20, 40);

        let y = 60;
        if (consultation.prescription && Array.isArray(consultation.prescription)) {
            consultation.prescription.forEach((med: any) => {
                doc.text(`${med.name || ''} - ${med.dosage || ''} (${med.frequency || ''})`, 20, y);
                y += 10;
                doc.text(`Duration: ${med.duration || ''}`, 25, y);
                y += 15;
            });
        }

        const pdfBuffer = doc.output('arraybuffer');
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const fileName = `prescriptions/${appointmentId}_${Date.now()}.pdf`;

        const { error: uploadError } = await supabase.storage
            .from('consultation-files')
            .upload(fileName, pdfBlob);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('consultation-files').getPublicUrl(fileName);

        return Response.json({ success: true, pdfUrl: urlData.publicUrl, fileSize: pdfBuffer.byteLength });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return Response.json({ success: false }, { status: 500 });
    }
}
