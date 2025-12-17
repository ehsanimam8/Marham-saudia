import { createDailyRoom } from '@/lib/daily/api';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log("🚀 [API] Starting create-room request");

    // 1. Validate Env Vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("❌ [API] Missing Supabase Env Vars");
        return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    try {
        // 2. Initialize Supabase Admin
        console.log("🔍 [API] Initializing Supabase Admin Client");
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // 3. Parse Request Body
        const body = await request.json();
        const { appointmentId } = body;
        console.log(`📦 [API] Request Body parsed. AppointmentId: ${appointmentId}`);

        if (!appointmentId) {
            console.error("❌ [API] Missing appointmentId in request body");
            return NextResponse.json({ success: false, error: 'Missing appointmentId' }, { status: 400 });
        }

        // 4. Check Existing Appointment
        console.log(`🔍 [API] Fetching appointment ${appointmentId} from DB`);
        const { data: appointmentData, error: fetchError } = await supabase
            .from('appointments')
            .select('daily_room_url, daily_room_name')
            .eq('id', appointmentId)
            .single();

        const appointment = appointmentData as any;

        if (fetchError) {
            console.error("❌ [API] DB Fetch Error:", fetchError);
            // Don't return here, maybe it doesn't exist? But it should.
            // Actually if it errors, we probably can't proceed.
            return NextResponse.json({ success: false, error: `DB Fetch Error: ${fetchError.message}` }, { status: 500 });
        }

        if (appointment?.daily_room_url) {
            console.log("✅ [API] Room already exists in DB. Returning existing URL.");
            return NextResponse.json({ success: true, url: appointment.daily_room_url, name: appointment.daily_room_name });
        }

        // 5. Create Daily Room
        console.log("🎥 [API] Calling Daily.co API to create room...");
        const roomResult = await createDailyRoom(appointmentId);
        console.log("✅ [API] Daily Room Created:", roomResult);

        // 6. Update DB
        console.log("💾 [API] Updating DB with new room details...");
        const { error: updateError } = await supabase
            .from('appointments')
            .update({
                daily_room_url: roomResult.url,
                daily_room_name: roomResult.name,
                updated_at: new Date().toISOString()
            })
            .eq('id', appointmentId);

        if (updateError) {
            console.error("❌ [API] DB Update Error:", updateError);
            return NextResponse.json({ success: false, error: `DB Update Error: ${updateError.message}` }, { status: 500 });
        }

        console.log("✅ [API] Transaction Complete. Success.");
        return NextResponse.json({ success: true, url: roomResult.url, name: roomResult.name });

    } catch (error: any) {
        console.error('❌ [API] Unhandled Error:', error);
        if (error.response) {
            console.error('❌ [API] External API Error Data:', error.response.data);
        }

        const msg = (error as any)?.response?.data?.error || (error as any).message || 'Unknown error';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
