import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ConsultationEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Check if pre-consultation is completed
    const { data: appointment } = await (supabase as any)
        .from('appointments')
        .select('pre_consultation_completed, status')
        .eq('id', id)
        .single();

    console.log(`[ConsultationEntry] ID: ${id}`);
    console.log(`[ConsultationEntry] Appointment:`, appointment);
    console.log(`[ConsultationEntry] PreConsult Completed?`, appointment?.pre_consultation_completed);


    if (appointment?.status === 'completed') {
        // redirect('/dashboard?consultation=completed');
        // For now, let's just 404 or show completed since we don't have a post-view for patient yet
        return <div>Consultation Completed</div>;
    }

    if (!appointment?.pre_consultation_completed) {
        redirect(`/consultation/${id}/pre-consultation`);
    } else {
        redirect(`/consultation/${id}/waiting-room`);
    }
}
