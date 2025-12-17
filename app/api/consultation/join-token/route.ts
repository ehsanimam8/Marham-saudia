import { generateDailyToken } from '@/lib/daily/api';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // 1. Service Role Client for DB operations (bypass RLS for reading appointment details reliably)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Auth Client for identifying the user
    // We cannot use 'createClient' from '@/lib/supabase/server' easily without proper cookie handling context sometimes, 
    // but typically it's fine. However, let's verify user differently or trust standard flow.
    // Ideally we use standard auth check.
    const { createClient: createServerClient } = require('@/lib/supabase/server');
    const supabaseAuth = await createServerClient();

    try {
        const { appointmentId } = await request.json();

        console.log(`🚀 [API Join] Request for Appointment: ${appointmentId}`);

        const { data: { user } } = await supabaseAuth.auth.getUser();
        if (!user) {
            console.error("❌ [API Join] No authenticated user found");
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        console.log(`👤 [API Join] User ID: ${user.id}`);

        // Fetch Appointment with Admin Client to ensure we get data regardless of complex RLS
        const { data: appointmentData, error: fetchError } = await supabaseAdmin
            .from('appointments')
            .select(`
                *,
                patient:patients(id, profile:profiles(full_name_en, id)),
                doctor:doctors(id, profile:profiles(full_name_en, id))
            `)
            .eq('id', appointmentId)
            .single();

        const appointment = appointmentData as any;

        if (fetchError || !appointment) {
            console.error("❌ [API Join] Appointment not found or error:", fetchError);
            return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
        }

        if (!appointment.daily_room_name) {
            console.error("❌ [API Join] Room not ready (no daily_room_name)");
            return NextResponse.json({ success: false, error: 'Room not initialized' }, { status: 400 });
        }

        // Determine Role
        let isDoctor = false;
        let userName = 'Participant';

        // Robust check: profile.id or just match the IDs we have
        const doctorProfileId = appointment.doctor?.profile?.id;
        const patientProfileId = appointment.patient?.profile?.id;

        if (doctorProfileId === user.id) {
            isDoctor = true;
            userName = appointment.doctor?.profile?.full_name_en || 'Doctor';
        } else if (patientProfileId === user.id) {
            isDoctor = false;
            userName = appointment.patient?.profile?.full_name_en || 'Patient';
        } else {
            // Allow admins maybe? Or strictly participants.
            console.error(`❌ [API Join] User ${user.id} is not part of appointment ${appointmentId}`);
            console.error(`Expected: Doctor ${doctorProfileId} or Patient ${patientProfileId}`);
            return NextResponse.json({ success: false, error: 'User is not a participant in this appointment' }, { status: 403 });
        }

        console.log(`✅ [API Join] User identified as ${isDoctor ? 'Doctor' : 'Patient'} (${userName})`);

        // Generate Token
        console.log(`🎥 [API Join] Generating Daily Token for room: ${appointment.daily_room_name}`);
        const { token } = await generateDailyToken(
            appointment.daily_room_name,
            userName,
            isDoctor // Doctor is owner
        );

        // If doctor, start consultation clock
        if (isDoctor && appointment.status !== 'in_progress') {
            console.log("⏱️ [API Join] Updating status to in_progress");
            await supabaseAdmin.from('appointments').update({
                status: 'in_progress',
                consultation_started_at: new Date().toISOString()
            }).eq('id', appointmentId);
        }

        return NextResponse.json({ success: true, token, url: appointment.daily_room_url, name: appointment.daily_room_name });

    } catch (error: any) {
        console.error('❌ [API Join] Unhandled Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to join' }, { status: 500 });
    }
}
