"use client";

import { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, CreditCard, Stethoscope } from 'lucide-react';
import { getSlotsAction, bookAppointmentAction } from '@/app/actions/booking';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Textarea } from '@/components/ui/textarea';

export default function BookingWizard({ doctor }: { doctor: any }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [success, setSuccess] = useState(false);

    // Generate next 7 days
    const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    useEffect(() => {
        async function fetchSlots() {
            setLoading(true);
            setSlots([]);
            setSelectedSlot(null);
            try {
                const fetched = await getSlotsAction(doctor.id, selectedDate.toISOString());
                setSlots(fetched);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchSlots();
    }, [selectedDate, doctor.id]);

    const handleNext = async () => {
        if (step === 1 && selectedSlot) {
            // Validate auth before moving to step 2 (details)
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('يجب تسجيل الدخول لحجز موعد');
                router.push(`/login?returnUrl=/book/${doctor.id}`);
                return;
            }
            setStep(2);
        } else if (step === 2) {
            handleBook();
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleBook = async () => {
        setBooking(true);
        try {
            await bookAppointmentAction({
                doctor_id: doctor.id,
                appointment_date: format(selectedDate, 'yyyy-MM-dd'),
                start_time: selectedSlot,
                price: doctor.consultation_price,
                reason_ar: reason // Pass reason
            });
            setSuccess(true);
            toast.success('تم حجز الموعد والدفع بنجاح!');
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error: any) {
            toast.error(error.message || 'فشل الحجز');
        } finally {
            setBooking(false);
        }
    };

    // Move success view inside main return to avoid potential hook count mismatch issues
    // although technically correct, some React versions/setups dislike early returns in non-trivial components.

    return (
        <div className="flex flex-col gap-8 min-h-[400px]">
            {success ? (
                <div className="text-center py-16 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">تم تأكيد الموعد!</h2>
                    <p className="text-gray-500 mb-8">تم حجز موعدك مع د. {doctor.profiles.full_name_ar} بنجاح.</p>
                    <Button onClick={() => router.push('/dashboard')} className="w-full md:w-auto">
                        الذهاب إلى لوحة التحكم
                    </Button>
                </div>
            ) : (
                <>
                    {/* Steps Indicator */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                        <div className={`w-12 h-1 ${step >= 2 ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    </div>

                    {step === 1 && (
                        <>
                            {/* Calendar Strip */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-teal-600" />
                                    اختر اليوم
                                </h3>
                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                    {days.map((day) => {
                                        const isSelected = isSameDay(day, selectedDate);
                                        return (
                                            <button
                                                key={day.toISOString()}
                                                onClick={() => setSelectedDate(day)}
                                                className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-xl border transition-all ${isSelected
                                                    ? 'bg-teal-600 text-white border-teal-600 shadow-md transform scale-105'
                                                    : 'bg-white border-gray-100 hover:border-teal-200 text-gray-600'
                                                    }`}
                                            >
                                                <span className="text-sm font-medium">
                                                    {format(day, 'EEEE', { locale: arSA })}
                                                </span>
                                                <span className="text-xl font-bold mt-1">
                                                    {format(day, 'd')}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-teal-600" />
                                    المواعيد المتاحة
                                </h3>

                                {loading ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {slots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${selectedSlot === slot
                                                    ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-200'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500">لا توجد مواعيد متاحة في هذا اليوم</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-teal-600" />
                                    تفاصيل الحالة
                                </h3>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سبب الزيارة (اختياري)
                                </label>
                                <Textarea
                                    placeholder="اشرحي باختصار الأعراض أو سبب حجز الموعد..."
                                    className="min-h-[100px]"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-teal-600" />
                                    الدفع
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-gray-600">رسوم الاستشارة</span>
                                        <span className="font-bold">{doctor.consultation_price} ر.س</span>
                                    </div>
                                    <div className="flex justify-between mb-4 text-sm">
                                        <span className="text-gray-600">ضريبة القيمة المضافة</span>
                                        <span className="font-bold">0.00 ر.س</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold text-lg text-teal-700">
                                        <span>الإجمالي</span>
                                        <span>{doctor.consultation_price} ر.س</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <div className="flex-1 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-sm cursor-not-allowed">
                                        Apple Pay
                                    </div>
                                    <div className="flex-1 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-sm cursor-not-allowed">
                                        بطاقة مدى / ائتمانية
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    * سيتم خصم المبلغ وتأكيد الحجز (الدفع التجريبي مفعّل)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="border-t pt-6 mt-auto">
                        {step === 1 ? (
                            <Button
                                className="w-full h-12 text-lg"
                                disabled={!selectedSlot}
                                onClick={handleNext}
                            >
                                المتابعة للدفع
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button variant="outline" className="h-12 px-6" onClick={handleBack} disabled={booking}>
                                    عودة
                                </Button>
                                <Button
                                    className="flex-1 h-12 text-lg"
                                    disabled={booking}
                                    onClick={handleBook}
                                >
                                    {booking ? 'جاري التأكيد...' : 'تأكيد ودفع'}
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
