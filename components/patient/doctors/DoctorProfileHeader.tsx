import { Star, MapPin, GraduationCap, CheckCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import type { Doctor } from '@/lib/api/doctors';

interface DoctorProfileHeaderProps {
    doctor: Doctor;
}

export default function DoctorProfileHeader({ doctor }: DoctorProfileHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                        <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-teal-100 to-pink-100 overflow-hidden relative">
                            {doctor.profile_photo_url ? (
                                <Image
                                    src={doctor.profile_photo_url}
                                    alt={doctor.profiles.full_name_ar || 'Doctor Photo'}
                                    fill
                                    className="object-cover"
                                    sizes="192px"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-8xl">
                                    👩‍⚕️
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {doctor.profiles.full_name_ar}
                                </h1>
                                <p className="text-lg text-teal-600 font-medium mb-2">
                                    {doctor.specialty}
                                </p>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{doctor.hospital}</span>
                                </div>
                            </div>

                            <button className="p-2 hover:bg-gray-50 rounded-lg">
                                <Share2 className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold text-gray-900">{doctor.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-sm text-gray-500">({doctor.total_consultations} تقييم)</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                                <GraduationCap className="w-5 h-5" />
                                <span className="text-sm">{doctor.experience_years} سنة خبرة</span>
                            </div>

                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">تم التحقق من الترخيص</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-wrap gap-3">
                            <Link href={`/book/${doctor.id}`}>
                                <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                                    احجزي استشارة - {doctor.consultation_price} ريال
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline">
                                تواصلي مع الطبيبة
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
