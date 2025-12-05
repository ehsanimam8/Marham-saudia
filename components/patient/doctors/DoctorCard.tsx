import { Star, MapPin, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import type { Doctor } from '@/lib/api/doctors';

interface DoctorCardProps {
    doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-teal-50 to-pink-50 relative overflow-hidden">
                {doctor.profile_photo_url ? (
                    <Image
                        src={doctor.profile_photo_url}
                        alt={doctor.profiles.full_name_ar || 'Doctor Photo'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <span className="text-6xl">👩‍⚕️</span>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-gray-900 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {doctor.rating.toFixed(1)}
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {doctor.profiles.full_name_ar}
                </h3>
                <p className="text-teal-600 text-sm font-medium mb-3">
                    {doctor.specialty}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <MapPin className="w-3 h-3" />
                        {doctor.hospital}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <GraduationCap className="w-3 h-3" />
                        {doctor.experience_years} سنة خبرة
                    </div>
                </div>

                {doctor.sub_specialties && doctor.sub_specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {doctor.sub_specialties.slice(0, 3).map((sub, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full"
                            >
                                {sub}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div>
                        <span className="text-xs text-gray-400 block">سعر الكشف</span>
                        <span className="font-bold text-gray-900">
                            {doctor.consultation_price} ريال
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            <Link href={`/doctors/${doctor.id}`}>
                                الملف الكامل
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs">
                            <Link href={`/doctors/${doctor.id}#booking`}>
                                احجزي الآن
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
