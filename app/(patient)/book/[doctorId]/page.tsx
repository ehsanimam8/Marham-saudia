import { getDoctorById } from '@/lib/api/doctors';
import { createClient } from '@/lib/supabase/server';
import BookingWizard from '@/components/booking/BookingWizard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Stethoscope, Star } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function BookingPage({ params }: { params: Promise<{ doctorId: string }> }) {
    const { doctorId } = await params;
    const supabase = await createClient();
    const doctor = await getDoctorById(supabase, doctorId);

    if (!doctor) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-teal-900 p-8 text-white">
                        <div className="flex items-start gap-6">
                            <Avatar className="w-24 h-24 border-4 border-white/20">
                                <AvatarImage src={doctor.profile_photo_url} className="object-cover" />
                                <AvatarFallback className="text-teal-900 text-2xl font-bold">
                                    {doctor.profiles?.full_name_en?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{doctor.profiles?.full_name_ar}</h1>
                                <div className="flex flex-wrap gap-4 text-teal-100 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Stethoscope className="w-4 h-4" />
                                        {doctor.specialty}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {doctor.hospital}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        {doctor.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wizard */}
                    <div className="p-8">
                        <BookingWizard doctor={doctor} />
                    </div>
                </div>
            </div>
        </div>
    );
}
