'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Map day string to integer (0-6)
const DAY_MAP: Record<string, number> = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
};

// Inverse map
const INT_TO_DAY_MAP: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
};

export async function getDoctorSchedule() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get doctor ID
    const { data: doctor } = await (supabase
        .from('doctors') as any)
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (!doctor) return null;

    const { data: schedules, error } = await (supabase
        .from('doctor_schedules') as any)
        .select('*')
        .eq('doctor_id', doctor.id);

    if (error) {
        console.error('Error fetching schedule:', error);
        return null;
    }

    // Transform to UI format
    const uiSchedule: Record<string, any> = {};

    // Initialize empty defaults
    Object.keys(DAY_MAP).forEach(day => {
        uiSchedule[day] = { enabled: false, slots: [] };
    });

    schedules.forEach((row: any) => {
        const dayStr = INT_TO_DAY_MAP[row.day_of_week];
        if (!uiSchedule[dayStr]) return;

        uiSchedule[dayStr].enabled = true; // If rows exist, it's enabled
        uiSchedule[dayStr].slots.push({
            start: formatTimeFromDB(row.start_time),
            end: formatTimeFromDB(row.end_time)
        });
    });

    return uiSchedule;
}

export async function saveDoctorSchedule(schedule: Record<string, any>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data: doctor } = await (supabase
        .from('doctors') as any)
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (!doctor) return { error: 'Doctor profile not found' };

    // Prepare rows to insert
    const rowsToInsert: any[] = [];

    Object.entries(schedule).forEach(([dayStr, data]: [string, any]) => {
        if (data.enabled && data.slots.length > 0) {
            data.slots.forEach((slot: any) => {
                rowsToInsert.push({
                    doctor_id: doctor.id,
                    day_of_week: DAY_MAP[dayStr],
                    start_time: formatTimeToDB(slot.start),
                    end_time: formatTimeToDB(slot.end),
                    is_available: true
                });
            });
        }
    });

    // Transaction-like approach: Delete all for this doctor, then insert new
    // Note: Supabase doesn't support transactions in JS client directly same way, 
    // but we can sequentialize.

    // 1. Delete existing
    const { error: deleteError } = await (supabase
        .from('doctor_schedules') as any)
        .delete()
        .eq('doctor_id', doctor.id);

    if (deleteError) {
        return { error: 'Failed to clear old schedule' };
    }

    // 2. Insert new
    if (rowsToInsert.length > 0) {
        console.log('Inserting schedules:', rowsToInsert);
        const { error: insertError } = await (supabase
            .from('doctor_schedules') as any)
            .insert(rowsToInsert);

        if (insertError) {
            console.error('Insert error', insertError);
            return { error: 'Failed to save new schedule: ' + insertError.message };
        }
    }

    revalidatePath('/doctor-portal/schedule');
    return { success: true };
}

// Helper: "14:00:00" -> "02:00 PM"
function formatTimeFromDB(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Helper: "02:00 PM" -> "14:00"
function formatTimeToDB(timeStr: string): string {
    // Simple parser for "HH:MM AM/PM"
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    let h = parseInt(hours);
    if (h === 12) h = 0;
    if (modifier === 'PM') h += 12;

    return `${h.toString().padStart(2, '0')}:${minutes}:00`;
}
