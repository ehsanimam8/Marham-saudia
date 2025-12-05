'use client';

import { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DaySlots } from '@/lib/api/appointments';
import { bookAppointment } from '@/app/actions/booking';
import { useRouter } from 'next/navigation';

interface BookingWizardProps {
    doctorId: string;
    doctorName: string;
    price: number;
    initialSlots: DaySlots[];
}

export default function BookingWizard({ doctorId, doctorName, price, initialSlots }: BookingWizardProps) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter slots for selected date
    const currentDaySlots = initialSlots.find(day => day.date === selectedDate);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null); // Reset slot
    };

    const handleConfirmBooking = async () => {
        if (!selectedDate || !selectedSlot) return;

        setIsBooking(true);
        setError(null);

        try {
            const result = await bookAppointment({
                doctorId,
                date: selectedDate,
                time: selectedSlot,
                price,
                reason: 'Online Consultation', // Simple default for now
                type: 'new'
            });

            // Type guard to handle the response
            const response = result as { success?: boolean; error?: string };

            if (response?.error) {
                if (response.error.includes('must be logged in')) {
                    setError('LOGIN_REQUIRED');
                } else {
                    setError(response.error);
                }
                return;
            }

            if (response?.success) {
                setStep(3); // Success step
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    if (step === 3) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">تم حجز موعدك بنجاح!</h3>
                <p className="text-gray-500">
                    تم تأكيد موعدك مع د. {doctorName} يوم {format(new Date(selectedDate!), 'EEEE d MMMM', { locale: arSA })} الساعة {selectedSlot}
                </p>
                <div className="pt-4">
                    <Button
                        className="bg-teal-600 hover:bg-teal-700 w-full"
                        onClick={() => router.push('/patient/appointments')}
                    >
                        الذهاب لمواعيدي
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">حجز موعد جديد</h3>
                <p className="text-sm text-gray-500">اختر التاريخ والوقت المناسب لك</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Step 1: Date Selection */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        اختر التاريخ
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {initialSlots.map((day) => (
                            <button
                                key={day.date}
                                onClick={() => handleDateSelect(day.date)}
                                className={`flex-shrink-0 w-20 p-3 rounded-xl border text-center transition-all ${selectedDate === day.date
                                    ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-200'
                                    : 'border-gray-200 text-gray-600 hover:border-purple-300'
                                    }`}
                            >
                                <div className="text-xs font-medium mb-1">{day.dayName}</div>
                                <div className="text-lg font-bold">
                                    {format(new Date(day.date), 'd')}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Time Slots */}
                {selectedDate && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            اختر الوقت
                        </label>
                        {!currentDaySlots || currentDaySlots.slots.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                                لا توجد مواعيد متاحة في هذا اليوم
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {currentDaySlots.slots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        disabled={!slot.available}
                                        onClick={() => setSelectedSlot(slot.time)}
                                        className={`p-2 rounded-lg text-sm font-medium transition-all ${!slot.available
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed decoration-slice'
                                            : selectedSlot === slot.time
                                                ? 'bg-teal-600 text-white shadow-md transform scale-105'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-400 hover:text-teal-600'
                                            }`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Summary & Action */}
                {selectedDate && selectedSlot && (
                    <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-4 bg-teal-50 p-4 rounded-xl">
                            <div>
                                <span className="text-xs text-teal-600 font-bold block mb-1">الموعد المحدد</span>
                                <span className="text-sm font-bold text-gray-900">
                                    {format(new Date(selectedDate), 'EEEE d MMMM', { locale: arSA })} - {selectedSlot}
                                </span>
                            </div>
                            <div className="text-left">
                                <span className="text-xs text-teal-600 font-bold block mb-1">الكشفية</span>
                                <span className="text-lg font-bold text-gray-900">{price} ر.س</span>
                            </div>
                        </div>

                        {error && (
                            <div className={`mb-4 p-3 ${error === 'LOGIN_REQUIRED' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'} text-sm rounded-lg flex items-center gap-2`}>
                                <AlertCircle className="w-4 h-4" />
                                {error === 'LOGIN_REQUIRED' ? (
                                    <div className="flex items-center justify-between w-full">
                                        <span>يجب عليك تسجيل الدخول لإتمام الحجز</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/auth/login?next=/doctors/${doctorId}`)}
                                            className="bg-white hover:bg-amber-100 border-amber-200 text-amber-800"
                                        >
                                            تسجيل دخول
                                        </Button>
                                    </div>
                                ) : (
                                    error
                                )}
                            </div>
                        )}

                        <Button
                            className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg shadow-lg shadow-teal-200"
                            onClick={handleConfirmBooking}
                            disabled={isBooking}
                        >
                            {isBooking ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                    جاري الحجز...
                                </>
                            ) : (
                                'تأكيد الحجز والدفع'
                            )}
                        </Button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            بالضغط على تأكيد الحجز، أنت توافق على شروط وأحكام الخدمة
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
