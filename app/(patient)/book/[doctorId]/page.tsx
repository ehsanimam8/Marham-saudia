import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BookingProvider } from '@/components/patient/booking/BookingContext';
import BookingWizard from '@/components/patient/booking/BookingWizard';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import type { Doctor } from '@/lib/api/doctors';

async function getDoctor(id: string): Promise<Doctor | null> {
    const { data, error } = await supabase
        .from('doctors')
        .select(`
      *,
      profiles!inner(full_name_ar, full_name_en, city)
    `)
        .eq('id', id)
        .eq('status', 'approved')
        .single();

    if (error || !data) {
        return null;
    }

    return data as Doctor;
}

export default async function BookingPage({
    params,
}: {
    params: Promise<{ doctorId: string }>;
}) {
    const { doctorId } = await params;
    const doctor = await getDoctor(doctorId);

    if (!doctor) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    items={[
                        { label: 'الأطباء', href: '/doctors' },
                        { label: doctor.profiles.full_name_ar, href: `/doctors/${doctorId}` },
                        { label: 'حجز موعد' },
                    ]}
                />

                {/* Header */}
                <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-pink-100 flex items-center justify-center text-3xl">
                            👩‍⚕️
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{doctor.profiles.full_name_ar}</h1>
                            <p className="text-gray-600">{doctor.specialty}</p>
                        </div>
                    </div>
                </div>

                {/* Booking Wizard */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100">
                    <BookingProvider doctorId={doctorId}>
                        <BookingWizard doctor={doctor} />
                    </BookingProvider>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ doctorId: string }> }) {
    const { doctorId } = await params;
    const doctor = await getDoctor(doctorId);

    if (!doctor) {
        return {
            title: 'Doctor Not Found',
        };
    }

    return {
        title: `احجزي موعد مع ${doctor.profiles.full_name_ar} | Marham`,
        description: `احجزي استشارة مع ${doctor.profiles.full_name_ar} - ${doctor.specialty}`,
    };
}
