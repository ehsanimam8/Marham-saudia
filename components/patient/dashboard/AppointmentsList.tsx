'use client';

import { Calendar, Clock, MapPin, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AppointmentsListProps {
    appointments: any[];
}

export default function AppointmentsList({ appointments }: AppointmentsListProps) {
    if (!appointments || appointments.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    📅
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد مواعيد</h3>
                <p className="text-gray-500">ليس لديك أي مواعيد حالياً.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabs (Visual only for MVP) */}
            <div className="flex gap-4 border-b border-gray-200 pb-4">
                <button className="text-teal-600 font-bold border-b-2 border-teal-600 pb-4 -mb-4.5 px-2">
                    جميع المواعيد
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {appointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden relative">
                                {appointment.doctors?.profile_photo_url ? (
                                    <Image
                                        src={appointment.doctors.profile_photo_url}
                                        alt={appointment.doctors.profiles.full_name_ar}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">👩‍⚕️</div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg text-gray-900">{appointment.doctors?.profiles?.full_name_ar}</h3>
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full font-medium",
                                        appointment.status === 'scheduled' || appointment.status === 'upcoming' ? "bg-teal-100 text-teal-700" :
                                            appointment.status === 'completed' ? "bg-green-100 text-green-700" :
                                                "bg-gray-100 text-gray-700"
                                    )}>
                                        {appointment.status === 'scheduled' ? 'قادم' :
                                            appointment.status === 'completed' ? 'مكتمل' : 'ملغي'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-3">{appointment.doctors?.specialty}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {appointment.appointment_date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {appointment.start_time.slice(0, 5)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {appointment.consultation_type === 'video' ? (
                                            <>
                                                <Video className="w-4 h-4 text-gray-400" />
                                                استشارة فيديو
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                عيادة
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            {appointment.status === 'scheduled' ? (
                                <>
                                    <Button className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto" asChild>
                                        <a href={`/consultation/${appointment.id}`}>
                                            دخول غرفة الانتظار
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="w-full md:w-auto text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100" asChild>
                                        <a href={`/appointments/${appointment.id}`}>
                                            إلغاء الموعد
                                        </a>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" className="w-full md:w-auto">
                                        حجز مجدداً
                                    </Button>
                                    <Button variant="ghost" className="w-full md:w-auto text-teal-600 hover:bg-teal-50">
                                        <FileText className="w-4 h-4 ml-2" />
                                        عرض التقرير
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
