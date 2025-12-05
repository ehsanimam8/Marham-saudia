'use client';

import { Calendar, Clock, Video, MapPin, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UpcomingAppointmentsProps {
    appointments: any[]; // Define proper type from Supabase return type if possible
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
    if (!appointments || appointments.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>لا توجد مواعيد قادمة</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">المواعيد القادمة</h3>
                <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                    عرض الكل
                </Button>
            </div>

            <div className="space-y-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={apt.patients?.profiles?.profile_photo_url} alt={apt.patients?.profiles?.full_name_ar} />
                                <AvatarFallback>{apt.patients?.profiles?.full_name_ar?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{apt.patients?.profiles?.full_name_ar || 'مريض غير معروف'}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {/* Format time nicely */}
                                        {apt.start_time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {apt.video_room_url ? (
                                            <>
                                                <Video className="w-3 h-3" />
                                                فيديو
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="w-3 h-3" />
                                                عيادة
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {apt.video_room_url && (
                                <a href={`/consultation/${apt.id}`} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs">
                                        دخول
                                    </Button>
                                </a>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
