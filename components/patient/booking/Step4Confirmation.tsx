'use client';

import { CheckCircle, Calendar, Clock, Video, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBooking } from './BookingContext';
import type { Doctor } from '@/lib/api/doctors';

interface Step4Props {
    doctor: Doctor;
}

export default function Step4Confirmation({ doctor }: Step4Props) {
    const { bookingState } = useBooking();

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Success Icon */}
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">تم تأكيد الحجز!</h2>
                <p className="text-gray-600">سيتم إرسال تفاصيل الموعد إلى بريدك الإلكتروني</p>
            </div>

            {/* Appointment Details */}
            <div className="bg-white rounded-2xl border-2 border-teal-100 p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg mb-4">تفاصيل الموعد</h3>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">التاريخ</div>
                        <div className="font-medium text-gray-900">{formatDate(bookingState.selectedDate)}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                        <Clock className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">الوقت</div>
                        <div className="font-medium text-gray-900">{bookingState.selectedTime}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                        <Video className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">الطبيبة</div>
                        <div className="font-medium text-gray-900">{doctor.profiles.full_name_ar}</div>
                        <div className="text-sm text-gray-500">{doctor.specialty}</div>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                <h3 className="font-bold text-gray-900 mb-4">الخطوات التالية</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">ستصلك رسالة تأكيد عبر البريد الإلكتروني والرسائل النصية</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">قبل الموعد بـ 15 دقيقة، ستصلك رابط الاستشارة المرئية</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">تأكدي من وجود اتصال إنترنت جيد وكاميرا تعمل</span>
                    </li>
                </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <Button className="w-full bg-teal-600 hover:bg-teal-700" size="lg">
                    <Download className="w-5 h-5 ml-2" />
                    إضافة إلى التقويم
                </Button>

                <Link href="/dashboard" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                        عرض مواعيدي
                    </Button>
                </Link>

                <Link href="/" className="block">
                    <Button variant="ghost" className="w-full" size="lg">
                        العودة إلى الصفحة الرئيسية
                    </Button>
                </Link>
            </div>
        </div>
    );
}
