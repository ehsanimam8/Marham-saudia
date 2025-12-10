
# Consultation Flow Analysis

## Overview
This document analyzes the end-to-end flow of the Video Consultation feature in the Marham Saudi application.

## 1. Booking Flow (`app/actions/booking.ts`)
1.  User selects a time slot.
2.  `bookAppointmentAction` is called.
3.  **Authentication Check**: Ensures user is logged in.
4.  **Patient Profile**: Checks if `patients` record exists for the user; creates one if not (auto-onboarding).
5.  **Insert Appointment**: Creates a record in `appointments` table with `status: 'scheduled'`.
6.  **Mock Payment**: Sets `payment_status: 'paid'` immediately (MVP).

## 2. Pre-Consultation / Intake (`app/actions/intake.ts`)
1.  Patient navigates to Intake Form URL.
2.  `submitIntakeForm` is called.
3.  **Upsert Intake**: Creates/Updates `consultation_intake_forms` record linked to `appointment_id`.
4.  **Consent**: Boolean flag `consent_share_medical_records` controls doctor access to EMR.
5.  **EMR Update**: Optionally updates `patient_medical_records` (allergies, chronic conditions) if provided.

## 3. Joining Consultation (`app/consultation/[id]/page.tsx`)
1.  Both Doctor and Patient access `/consultation/[appointment_id]`.
2.  **Server-Side Check** (`getConsultationData` in `app/actions/consultation.ts`):
    *   Verifies User ID matches either `appointment.doctor_id` or `appointment.patient_id`.
    *   Fetches Appointment details.
    *   **Doctor View**: Use `consent_share_medical_records` to decide if `patient_medical_records` and `medical_documents` should be fetched.
3.  **Client Component** (`ConsultationClient.tsx`):
    *   Renders `JitsiMeeting` (Jitsi React SDK).
    *   **Room Name**: Derived from `appointmentId` (`marham-consultation-[ID]`).
    *   **Sidebar** (Doctor Only): Displays Patient Info, Intake Data, and EMR (if consented).

## 4. Video Room (`components/consultation/JitsiMeeting.tsx`)
*   **Domain**: `meet.jit.si` (Public Jitsi server).
*   **Config**: Camera/Mic enabled, Screen Sharing enabled.
*   **Pre-join Page**: Disabled (`prejoinPageEnabled: false`) for seamless entry, assuming device check happens before (though currently not implemented separately).

## 5. Post-Consultation (`app/actions/prescription.ts`)
1.  **Trigger**: Doctor clicks "End Call" -> Redirects to `/doctor-portal/appointments/[id]/post-consultation`.
2.  **Form**: Doctor enters SOAP Notes (Subjective, Objective, Assessment, Plan) and Medications.
3.  `submitConsultation` is called:
    *   **Save Notes**: Upserts `consultation_notes` table.
    *   **Generate PDF**: Creates a PDF prescription using `pdf-lib`.
    *   **Upload PDF**: Stores in Supabase Storage (`medical-files` bucket).
    *   **Save Prescription**: Inserts into `prescriptions` table with PDF URL.
    *   **Complete Appointment**: Updates `appointments.status` to `'completed'`.

## Data Model Dependencies
*   `appointments`: Central hub.
*   `consultation_intake_forms`: 1:1 with Appointment.
*   `consultation_notes`: 1:1 with Appointment.
*   `prescriptions`: 1:1 with Appointment (optional).
*   `patient_medical_records`: Linked to Patient (Auth ID).

## Security & Privacy
*   **RLS Policies**: Ensure patients can only see their own records/appointments.
*   **Consent Logic**: Explicit check for `consent_share_medical_records` in `getConsultationData` prevents unauthorized EMR access.
*   **Video Privacy**: Room names are obscure, but public Jitsi is used (MVP limitation, not fully private/HIPAA compliant).

## Potential Gaps/Risks for Testing
1.  **Jitsi Domain**: Public Jitsi sometimes has rate limits or ads.
2.  **PDF Generation**: Requires valid fonts; `pdf-lib` usage seems standard but character encoding for Arabic (`title_ar`) might need verification with `StandardFonts`. `Helvetica` does NOT support Arabic. **Critical Finding**: The PDF generation currently uses `StandardFonts.Helvetica` which will display gibberish for Arabic text.
3.  **Mobile Responsiveness**: Sidebar behavior on mobile needs checking.
