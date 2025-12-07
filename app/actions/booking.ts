"use server";

import { createClient } from '@/lib/supabase/server';
import { getAvailableSlots } from '@/lib/api/booking';
import { addMinutes, format, parse } from 'date-fns';
import { revalidatePath } from 'next/cache';

export async function getSlotsAction(doctorId: string, dateStr: string) {
    const supabase = await createClient();
    const date = new Date(dateStr);
    return await getAvailableSlots(supabase, doctorId, date);
}

export async function bookAppointmentAction(data: any) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    // Get patient profile
    const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (!patient) {
        // Create patient profile if missing (auto-onboarding)
        const { data: newPatient, error: createError } = await supabase
            .from('patients')
            .insert({ profile_id: user.id })
            .select()
            .single();

        if (createError) throw new Error("Could not create patient profile");

        // Use new patient ID
        data.patient_id = newPatient.id;
    } else {
        data.patient_id = patient.id;
    }

    // Insert Appointment
    // Calculate end time
    const startTimeDate = parse(data.start_time, 'HH:mm', new Date());
    const endTimeDate = addMinutes(startTimeDate, 30);
    const endTime = format(endTimeDate, 'HH:mm:ss');

    const appointmentPayload = {
        doctor_id: data.doctor_id,
        patient_id: data.patient_id,
        appointment_date: data.appointment_date,
        start_time: data.start_time,
        end_time: endTime,
        consultation_type: 'video', // default for now
        price: data.price,
        status: 'scheduled',
        reason_ar: data.reason_ar,
        payment_status: 'paid', // MOCKED: Simulate successful payment
        payment_id: `mock_${Date.now()}` // MOCKED: Generate mock payment ID
    };

    const { error } = await supabase.from('appointments').insert(appointmentPayload);

    if (error) throw error;

    revalidatePath('/dashboard/appointments');
    return { success: true };
}
