import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    // Initialize Resend inside the handler to avoid build-time errors
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error('RESEND_API_KEY is not configured');
        return Response.json({ success: false, error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const { appointmentId, consultation } = await request.json();
    const supabase = await createClient();

    try {
        const { data: appointmentData } = await supabase
            .from('appointments')
            .select(`
        *,
        patient:patients(profile:profiles(full_name_en, email)),
        doctor:doctors(profile:profiles(full_name_en))
      `)
            .eq('id', appointmentId)
            .single();

        const appointment = appointmentData as any;

        if (!appointment) throw new Error('Appointment not found');
        if (!appointment.patient || !appointment.patient.profile) throw new Error('Patient profile not found');
        if (!appointment.doctor || !appointment.doctor.profile) throw new Error('Doctor profile not found');

        const patientName = appointment.patient.profile.full_name_en || 'Patient';
        const doctorName = appointment.doctor.profile.full_name_en || 'Doctor';
        const patientEmail = appointment.patient.profile.email;

        if (!patientEmail) throw new Error('Patient email not found');

        const diagnosis = consultation.diagnosis || 'No diagnosis provided.';
        const treatmentPlan = consultation.treatment_plan || 'No treatment plan provided.';

        let prescriptionHtml = '<li>No prescription provided.</li>';
        if (consultation.prescription && Array.isArray(consultation.prescription) && consultation.prescription.length > 0) {
            prescriptionHtml = consultation.prescription.map((med: any) =>
                `<li>${med.name || 'Unknown Drug'} - ${med.dosage || ''} (${med.frequency || ''}) - ${med.duration || ''}</li>`
            ).join('');
        }

        const emailHtml = `
      <h1>Consultation Summary</h1>
      <p>Dear ${patientName},</p>
      <p>Here is the summary of your consultation with Dr. ${doctorName}.</p>
      
      <h3>Diagnosis</h3>
      <p>${diagnosis}</p>
      
      <h3>Treatment Plan</h3>
      <p>${treatmentPlan}</p>
      
      <h3>Prescription</h3>
      <ul>
        ${prescriptionHtml}
      </ul>
      
      <p>Thank you for choosing Marham.</p>
    `;

        await resend.emails.send({
            from: 'Marham <onboarding@resend.dev>', // Replace with verified domain in production
            to: [patientEmail],
            subject: 'Your Consultation Summary - Marham Saudi',
            html: emailHtml,
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return Response.json({ success: false }, { status: 500 });
    }
}
