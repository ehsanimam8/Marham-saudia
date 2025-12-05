
import { createClient } from '@/lib/supabase/client';

export interface EarningTransaction {
    id: string;
    amount: number;
    platform_fee: number;
    doctor_earnings: number;
    payout_status: 'pending' | 'paid';
    created_at: string;
    appointments: {
        appointment_date: string;
        patients: {
            profiles: {
                full_name_ar: string;
            }
        }
    }
}

export async function getDoctorEarningsHistory(doctorId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('earnings')
        .select(`
            *,
            appointments (
                appointment_date,
                patients (
                    profiles (full_name_ar)
                )
            )
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching earnings:', error);
        return [];
    }

    return data as any[];
}
