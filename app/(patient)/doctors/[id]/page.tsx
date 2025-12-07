import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, MapPin, GraduationCap, Globe, Clock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BookingWizard from '@/components/booking/BookingWizard';
import { getDoctorById } from '@/lib/api/doctors';
import { createClient } from '@/lib/supabase/server';

export default async function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch doctor profile by ID
    const doctor = await getDoctorById(supabase, id);

    if (!doctor) {
        notFound();
    }

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
                            <BookingWizard doctor={doctor} />
                        </section>


                        <section className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">البيانات المهنية</h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 text-sm">التخصصات الدقيقة</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.sub_specialties?.map((sub: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">
                                                {sub}
                                            </span>
                                        )) || <span className="text-gray-400 text-sm">عام</span>}
                                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">استشارات عن بعد</span>
                                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">متابعة الحمل</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 text-sm">اللغات</h3>
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            العربية (اللغة الأم)
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            English (Fluent)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">الشهادات والمؤهلات</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">البورد السعودي في {doctor.specialty}</p>
                                        <p className="text-sm text-gray-500">2018 - الهيئة السعودية للتخصصات الصحية</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">بكالوريوس الطب والجراحة</p>
                                        <p className="text-sm text-gray-500">2012 - جامعة الملك سعود</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        {/* Videos / Intro */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">فيديو تعريفي</h2>
                            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all"></div>
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border-2 border-white z-10 transition-transform group-hover:scale-110">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                                <Image
                                    src={doctor.profile_photo_url || '/placeholder.jpg'}
                                    alt="Video Thumbnail"
                                    fill
                                    className="object-cover -z-10 opacity-60"
                                />
                            </div>
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
