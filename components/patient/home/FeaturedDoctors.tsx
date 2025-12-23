import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Doctor } from '@/lib/api/doctors';
import { translateSpecialty, translateHospital } from '@/lib/translations';

async function getFeaturedDoctors(): Promise<Doctor[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('doctors')
        .select(`
      *,
      profiles!inner(full_name_ar, full_name_en, city)
    `)
        .eq('status', 'approved')
        .order('rating', { ascending: false })
        .limit(4);

    if (error || !data) {
        return [];
    }

    return data as Doctor[];
}

export default async function FeaturedDoctors() {
    const doctors = await getFeaturedDoctors();

    if (doctors.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">طبيبات متميزات</h2>
                        <p className="text-gray-500">نخبة من الطبيبات السعوديات في خدمتك</p>
                    </div>
                    <Link href="/doctors" className="text-teal-600 hover:text-teal-700 font-semibold hidden md:block" suppressHydrationWarning>
                        عرض جميع الطبيبات ←
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <Link
                            key={doctor.id}
                            href={`/doctors/${doctor.id}`}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                            suppressHydrationWarning
                        >
                            <div className="h-48 bg-gradient-to-br from-teal-50 to-pink-50 relative overflow-hidden">
                                {doctor.profile_photo_url ? (
                                    <Image
                                        src={doctor.profile_photo_url}
                                        alt={doctor.profiles.full_name_ar || 'Doctor Photo'}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                        <span className="text-4xl">👩‍⚕️</span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-gray-900 shadow-sm">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    {doctor.rating.toFixed(1)}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{doctor.profiles.full_name_ar}</h3>
                                <p className="text-teal-600 text-sm font-medium mb-2">{translateSpecialty(doctor.specialty)}</p>

                                <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
                                    <MapPin className="w-3 h-3" />
                                    {translateHospital(doctor.hospital)}
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                    <div>
                                        <span className="text-xs text-gray-400 block">سعر الكشف</span>
                                        <span className="font-bold text-gray-900">{doctor.consultation_price} ريال</span>
                                    </div>
                                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                        احجزي الآن
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/doctors" suppressHydrationWarning>
                        <Button variant="outline" className="w-full">
                            عرض جميع الطبيبات
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
