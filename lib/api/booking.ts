import { SupabaseClient } from '@supabase/supabase-js';
import { addMinutes, format, parse, isBefore, isEqual, addDays, getDay } from 'date-fns';

export async function getAvailableSlots(
    supabase: SupabaseClient,
    doctorId: string,
    date: Date,
    duration: number = 30
) {
    const dayOfWeek = getDay(date); // 0=Sun, 1=Mon...

    // Fetch schedule for this day
    const { data: schedule, error: schError } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true)
        .single();

    if (schError || !schedule) return [];

    // Fetch confirmed bookings
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data: bookings } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('doctor_id', doctorId)
        .eq('appointment_date', dateStr)
        .neq('status', 'cancelled');

    const bookedTimes = bookings?.map(b => b.start_time.substring(0, 5)) || []; // "HH:MM"

    // Generate slots
    const slots: string[] = [];

    // Parse start and end times
    // We attach them to the given date to compare logic easily, though we only output "HH:mm"
    const START_BASE = parse(schedule.start_time, 'HH:mm:ss', date);
    const END_BASE = parse(schedule.end_time, 'HH:mm:ss', date);

    let current = START_BASE;

    while (isBefore(current, END_BASE)) {
        const timeStr = format(current, 'HH:mm');

        // Check collision
        // Simple check: if start time matches existing booking start time
        // Real logic should check overlap, but for fixed 30min slots, exact match is enough usually
        if (!bookedTimes.includes(timeStr)) {
            slots.push(timeStr);
        }

        current = addMinutes(current, duration);
    }

    return slots;
}

export async function createAppointment(supabase: SupabaseClient, appointmentData: any) {
    const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

    return { data, error };
}
