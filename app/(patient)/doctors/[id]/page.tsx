import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, MapPin, GraduationCap, Globe, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BookingWizard from '@/components/booking/BookingWizard';
import { getDoctorProfile } from '@/lib/api/doctors';
import { getDoctorSlots } from '@/lib/api/appointments';

import { createClient } from '@/lib/supabase/server';

export default async function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch doctor profile by ID
    const doctor = await getDoctorById(supabase, id);

    if (!doctor) {
        notFound();
    }

    const slots = await getDoctorSlots(supabase, doctor.id);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Image */}
                        <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0">
                            <Image
                                src={doctor.profile_photo_url || '/images/doctor-placeholder.jpg'}
                                alt={doctor.profiles.full_name_ar || 'Doctor Photo'}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 160px"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">د. {doctor.profiles.full_name_ar}</h1>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                                        استشاري
                                    </Badge>
                                    <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full text-xs font-bold">
                                        <Star className="w-3 h-3 fill-current" />
                                        {doctor.rating}
                                    </div>
                                </div>
                                <p className="text-lg text-gray-600 font-medium">{doctor.specialty}</p>
                            </div>

                            <p className="text-gray-500 leading-relaxed max-w-2xl">
                                {doctor.bio_ar || doctor.bio_en || 'لا يوجد نبذة شخصية متاحة حالياً.'}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {doctor.hospital || 'عيادة خاصة'} - {doctor.profiles.city}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    {doctor.sub_specialties?.join('، ') || 'عام'}
                                </div>
                            </div>
                        </div>

                        {/* Price Card (Desktop) */}
                        <div className="hidden md:block bg-gray-50 p-6 rounded-2xl border border-gray-100 min-w-[250px]">
                            <p className="text-sm text-gray-500 mb-1">سعر الكشفية</p>
                            <div className="text-3xl font-bold text-gray-900 mb-4">
                                {doctor.consultation_price} <span className="text-sm font-normal text-gray-500">ر.س</span>
                            </div>
                            <div className="space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    مدة الجلسة 30 دقيقة
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    ضمان استرداد الأموال
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Booking Wizard - Mobile/Desktop */}
                        <section id="booking" className="scroll-mt-24">
                            <BookingWizard
                                doctorId={doctor.id}
                                doctorName={doctor.profiles.full_name_ar}
                                price={doctor.consultation_price}
                                initialSlots={slots}
                            />
                        </section>

                        <section className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">الشهادات والمؤهلات</h2>
                            <ul className="space-y-3">
                                {/* Mock data if qualifications is JSON/null */}
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mt-1">
                                        <GraduationCap className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">البورد السعودي في {doctor.specialty}</p>
                                        <p className="text-sm text-gray-500">2018 - الهيئة السعودية للتخصصات الصحية</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Right Column: Sticky Sidebar (for reviews or similar) */}
                    <div className="space-y-6">
                        {/* Reviews placeholder */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">آراء المرضى</h3>
                            <div className="text-center py-8 text-gray-500">
                                لا توجد تقييمات بعد
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Temporary helper until moved to separate file
// Temporary helper until moved to separate file
// import { supabase } from '@/lib/supabase'; // Removed
async function getDoctorById(supabase: any, id: string) {
    const { data } = await supabase
        .from('doctors')
        .select(`
            *,
            profiles (full_name_ar, full_name_en, city)
        `)
        .eq('id', id)
        .single();
    return data;
}
