import { addDays, format, parse, isSameDay, addMinutes, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface DaySlots {
    date: string; // YYYY-MM-DD
    dayName: string;
    slots: TimeSlot[];
}

export async function getDoctorSlots(supabase: any, doctorId: string, startDate: Date = new Date(), days: number = 7): Promise<DaySlots[]> {
    // 1. Get Doctor Schedule
    const { data: schedules } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('is_available', true);

    if (!schedules || schedules.length === 0) {
        return [];
    }

    // 2. Get Existing Appointments for the range
    const endDate = addDays(startDate, days);

    const { data: existingAppointments } = await supabase
        .from('appointments')
        .select('appointment_date, start_time')
        .eq('doctor_id', doctorId)
        .gte('appointment_date', format(startDate, 'yyyy-MM-dd'))
        .lte('appointment_date', format(endDate, 'yyyy-MM-dd'))
        .neq('status', 'cancelled'); // Don't block cancelled slots

    const bookedSlots = new Set<string>();
    existingAppointments?.forEach((apt: any) => {
        // Format: YYYY-MM-DD_HH:mm:ss
        bookedSlots.add(`${apt.appointment_date}_${apt.start_time}`);
    });

    // 3. Generate Slots
    const availability: DaySlots[] = [];

    for (let i = 0; i < days; i++) {
        const currentDate = addDays(startDate, i);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday...
        const dateString = format(currentDate, 'yyyy-MM-dd');

        // Find schedule for this day
        // Note: JS getDay(): 0(Sun)-6(Sat). Supabase check constraint 0-6. 
        // Need to ensure mapping is correct. Assuming 0=Sunday matches.
        const daySchedule = schedules.find((s: any) => s.day_of_week === dayOfWeek);

        if (daySchedule) {
            const slots: TimeSlot[] = [];
            // Parse start and end times (e.g., "09:00:00")
            // using arbitrary date for time parsing
            const startTime = parse(daySchedule.start_time, 'HH:mm:ss', currentDate);
            const endTime = parse(daySchedule.end_time, 'HH:mm:ss', currentDate);

            let currentSlot = startTime;
            const now = new Date();

            while (isBefore(currentSlot, endTime)) {
                const timeString = format(currentSlot, 'HH:mm:ss');
                const slotKey = `${dateString}_${timeString}`;
                const slotTimeFull = parse(`${dateString} ${timeString}`, 'yyyy-MM-dd HH:mm:ss', new Date());

                // Check if slot is in the past
                let isAvailable = true;
                if (isBefore(slotTimeFull, now)) {
                    isAvailable = false;
                }

                // Check if booked
                if (bookedSlots.has(slotKey)) {
                    isAvailable = false;
                }

                slots.push({
                    time: format(currentSlot, 'HH:mm'), // Display format HH:mm
                    available: isAvailable
                });

                // Increment by 30 mins (default consultation time)
                // Should potentially be configurable from doctor profile
                currentSlot = addMinutes(currentSlot, 30);
            }

            if (slots.length > 0) {
                availability.push({
                    date: dateString,
                    dayName: format(currentDate, 'EEEE'), // e.g. Monday
                    slots
                });
            }
        }
    }

    return availability;
}

export async function getPatientAppointments(supabase: any, patientId: string) {
    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            doctors (
                id,
                profile_photo_url,
                specialty,
                hospital,
                profiles (full_name_ar, full_name_en)
            )
        `)
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) {
        console.error('Error fetching appointments:', error);
    }

    return data || [];
}
