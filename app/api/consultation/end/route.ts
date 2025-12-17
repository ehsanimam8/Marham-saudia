import { deleteDailyRoom, getDailyRecordings } from '@/lib/daily/api';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { appointmentId } = await request.json();

    try {
        const { data: appointmentData } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', appointmentId)
            .single();

        const appointment = appointmentData as any;

        if (appointment?.daily_room_name) {
            // Delete room to kick everyone out (End Meeting)
            await deleteDailyRoom(appointment.daily_room_name);

            // Fetch recording (async or await? Might take time to process)
            // Usually Daily webhook is better for recording ready, but we try fetch latest.
            const recording = await getDailyRecordings(appointment.daily_room_name);

            const updates: any = {
                status: 'completed',
                consultation_ended_at: new Date().toISOString(),
                consultation_duration_minutes: appointment.consultation_started_at ?
                    Math.round((Date.now() - new Date(appointment.consultation_started_at).getTime()) / 60000) : 0
            };

            if (recording) {
                updates.recording_url = recording.downloadUrl;
            }

            await (supabase.from('appointments') as any).update(updates).eq('id', appointmentId);
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error ending consultation", error);
        return Response.json({ success: false }, { status: 500 });
    }
}
