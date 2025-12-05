'use client';

import { Calendar, Clock, MapPin, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock data for MVP
const appointments = [
    {
        id: 1,
        doctor: {
            name: 'د. نورا الراشد',
            specialty: 'استشارية أمراض النساء والولادة',
            image: '/images/doctor-placeholder-1.jpg',
        },
        date: '2024-12-05',
        time: '10:30 AM',
        type: 'video',
        status: 'upcoming',
        price: 150,
    },
    {
        id: 2,
        doctor: {
            name: 'د. سارة الأحمد',
            specialty: 'أخصائية الخصوبة',
            image: '/images/doctor-placeholder-2.jpg',
        },
        date: '2024-11-28',
        time: '02:00 PM',
        type: 'video',
        status: 'completed',
        price: 150,
    },
    {
        id: 3,
        doctor: {
            name: 'د. ليلى العمري',
            specialty: 'طب الأمومة والجنين',
            image: '/images/doctor-placeholder-3.jpg',
        },
        date: '2024-11-15',
        time: '11:00 AM',
        type: 'in-person',
        status: 'completed',
        price: 200,
    },
];

export default function AppointmentsList() {
    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 pb-4">
                <button className="text-teal-600 font-bold border-b-2 border-teal-600 pb-4 -mb-4.5 px-2">
                    المواعيد القادمة
                </button>
                <button className="text-gray-500 hover:text-gray-700 font-medium px-2">
                    المواعيد السابقة
                </button>
                <button className="text-gray-500 hover:text-gray-700 font-medium px-2">
                    الملغاة
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
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden">
                                {/* Image placeholder */}
                                <div className="w-full h-full flex items-center justify-center text-2xl">👩‍⚕️</div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg text-gray-900">{appointment.doctor.name}</h3>
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full font-medium",
                                        appointment.status === 'upcoming' ? "bg-teal-100 text-teal-700" :
                                            appointment.status === 'completed' ? "bg-green-100 text-green-700" :
                                                "bg-gray-100 text-gray-700"
                                    )}>
                                        {appointment.status === 'upcoming' ? 'قادم' : 'مكتمل'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-3">{appointment.doctor.specialty}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {appointment.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {appointment.time}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {appointment.type === 'video' ? (
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
                            {appointment.status === 'upcoming' ? (
                                <>
                                    <Button className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto">
                                        دخول غرفة الانتظار
                                    </Button>
                                    <Button variant="outline" className="w-full md:w-auto text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100">
                                        إلغاء الموعد
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
