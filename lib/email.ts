import { Resend } from 'resend';

// Initialize Resend with key from env
// If key is missing, we use a placeholder that logs to console
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendConsultationConfirmation(
    patientEmail: string,
    details: any
) {
    if (!resend) {
        console.log('[Email Mock] Sending Confirmation to', patientEmail, details);
        return;
    }

    await resend.emails.send({
        from: 'Marham <noreply@marham.sa>',
        to: patientEmail,
        subject: 'تم تأكيد موعدك - يرجى تعبئة النموذج الطبي',
        html: `
    <div dir="rtl" style="font-family: sans-serif; color: #333;">
      <h1>موعدك مؤكد!</h1>
      <p>عزيزتي ${details.patientName},</p>
      <p>تم تأكيد موعد استشارتك مع <strong>${details.doctorName}</strong>.</p>
      <p>
        📅 التاريخ: ${details.date}<br>
        ⏰ الوقت: ${details.time}
      </p>
      <p>لضمان أفضل استشارة، يرجى تعبئة النموذج الطبي قبل الموعد:</p>
      <a href="${details.intakeFormUrl}" style="display: inline-block; background: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        تعبئة النموذج الطبي
      </a>
    </div>
    `,
    });
}

export async function sendIntakeFormReminder(
    patientEmail: string,
    details: any
) {
    if (!resend) {
        console.log('[Email Mock] Sending Intake Reminder to', patientEmail);
        return;
    }
    // Implemetation similar to above
    await resend.emails.send({
        from: 'Marham <noreply@marham.sa>',
        to: patientEmail,
        subject: 'تذكير: نموذج المعلومات الطبية',
        html: `<div dir="rtl">...الرجاء تعبئة النموذج... <a href="${details.intakeFormUrl}">الرابط</a></div>`
    });
}

export async function sendJoinLink(
    email: string,
    role: 'patient' | 'doctor',
    details: any
) {
    if (!resend) {
        console.log(`[Email Mock] Sending Join Link to ${role}: ${email}`, details.joinUrl);
        return;
    }
    await resend.emails.send({
        from: 'Marham <noreply@marham.sa>',
        to: email,
        subject: 'استشارتك تبدأ قريباً',
        html: `
        <div dir="rtl">
           <h2>استشارتك تبدأ خلال 15 دقيقة</h2>
           <a href="${details.joinUrl}" style="background: #0d9488; color: white; padding: 10px 20px; text-decoration: none;">انضم الآن</a>
        </div>
        `
    });
}

export async function sendPrescriptionEmail(
    patientEmail: string,
    details: any,
    pdfBuffer: Buffer | Uint8Array // Buffer might be cleaner if node env, Uint8Array for browser/edge
) {
    if (!resend) {
        console.log('[Email Mock] Sending Prescription to', patientEmail);
        return;
    }

    // Convert Uint8Array to Buffer if needed for Resend (which expects Buffer for attachments usually)
    const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

    await resend.emails.send({
        from: 'Marham <noreply@marham.sa>',
        to: patientEmail,
        subject: 'ملخص الاستشارة والوصفة الطبية',
        html: `<div dir="rtl">شكراً لاستشارتك. مرفق الوصفة الطبية.</div>`,
        attachments: [
            {
                filename: 'prescription.pdf',
                content: buffer
            }
        ]
    });
}
