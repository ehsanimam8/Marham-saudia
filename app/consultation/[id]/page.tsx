
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Shield } from 'lucide-react';
import ConsultationClient from './ConsultationClient';

export default async function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/auth/login?next=/consultation/${id}`);
    }

    // 2. Fetch Appointment Details with security check
    // We need to know if the current user is the PATIENT or the DOCTOR for this appointment.

    // First, check if user is a doctor
    const { data: doctorProfile } = await supabase
        .from('doctors')
        .select('id, profiles(full_name_ar)')
        .eq('profile_id', user.id)
        .single();

    // Check if user is a patient
    const { data: patientProfile } = await supabase
        .from('patients')
        .select('id, profiles(full_name_ar)')
        .eq('profile_id', user.id)
        .single();

    if (!doctorProfile && !patientProfile) {
        // User has no role?
        return <div>Access Denied</div>;
    }

    // Fetch appointment
    // We need to check if the appointment exists AND corresponds to this user
    const { data: appointment, error } = await supabase
        .from('appointments')
        .select(`
            *,
            doctors (
                id,
                profiles (full_name_ar)
            ),
            patients (
                id,
                profiles (full_name_ar)
            )
        `)
        .eq('id', id)
        .single();

    if (error || !appointment) {
        notFound();
    }

    // 3. Authorization Check
    let isAuthorized = false;
    let displayName = 'User';

    if (doctorProfile && appointment.doctor_id === doctorProfile.id) {
        isAuthorized = true;
        displayName = `د. ${appointment.doctors.profiles.full_name_ar}`;
    } else if (patientProfile && appointment.patient_id === patientProfile.id) {
        isAuthorized = true;
        displayName = appointment.patients.profiles.full_name_ar;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">غير مصرح لك بالدخول</h1>
                    <p className="text-gray-500">
                        عذراً، لا تملك الصلاحية للدخول إلى هذه الغرفة العلاجية.
                    </p>
                </div>
            </div>
        );
    }

    // 4. Extract Room Name
    // video_room_url format: https://meet.jit.si/marham-{uuid}
    // We strip the domain to get the room name.
    const roomName = appointment.video_room_url?.split('/').pop() || `marham-${appointment.id}`;

    // Determine the "Other Party" name for display
    const otherPartyName = doctorProfile
        ? appointment.patients.profiles.full_name_ar
        : `د. ${appointment.doctors.profiles.full_name_ar}`;

    return (
        <ConsultationClient
            roomName={roomName}
            displayName={displayName}
            email={user.email || undefined}
            otherPartyName={otherPartyName}
        />
    );
}
