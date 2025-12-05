'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export async function bookAppointment(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in to book an appointment.' };
    }

    // 1. Get Patient ID
    const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (patientError || !patient) {
        if (patientError) {
            console.log('Error fetching patient:', patientError);
        }

        // Auto-register as patient if not exists
        const { data: newPatient, error: newPatientError } = await supabase
            .from('patients')
            .insert({ profile_id: user.id })
            .select()
            .single();

        if (newPatientError) {
            console.error('Error creating patient:', newPatientError);
            return { error: `Failed to find or create patient record. Details: ${newPatientError.message}` };
        }

        return processBooking(supabase, newPatient.id, formData);
    }

    return processBooking(supabase, patient.id, formData);
}

async function processBooking(supabase: any, patientId: string, formData: any) {
    const { doctorId, date, time, reason, price, type } = formData;

    // Generate Jitsi Meeting URL
    // Format: https://meet.jit.si/marham-{uuid}
    const meetingId = randomUUID();
    const videoUrl = `https://meet.jit.si/marham-${meetingId}`;

    const { error } = await supabase
        .from('appointments')
        .insert({
            patient_id: patientId,
            doctor_id: doctorId,
            appointment_date: date,
            start_time: time,
            end_time: calculateEndTime(time), // Helper to add 30 mins
            reason_ar: reason, // Assuming Arabic reason
            price: price || 0, // Fallback
            video_room_url: videoUrl,
            status: 'scheduled',
            consultation_type: type || 'new'
        });

    if (error) {
        console.error('Booking error:', error);
        return { error: 'Failed to book appointment. Please try again.' };
    }

    revalidatePath('/patient/appointments');
    revalidatePath(`/doctor/${doctorId}`); // Revalidate doctor profile to update slots

    return { success: true };
}

function calculateEndTime(startTime: string) {
    // Basic helper: add 30 mins to "HH:mm" or "HH:mm:ss"
    // For robustness, use date-fns or similar in real logic if needed, 
    // but string manipulation is often enough for simple HH:mm
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    date.setMinutes(date.getMinutes() + 30);
    return date.toTimeString().split(' ')[0]; // Returns HH:mm:ss
}
