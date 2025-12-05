'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooking } from './BookingContext';
import type { Doctor } from '@/lib/api/doctors';

interface Step3Props {
    doctor: Doctor;
}

const paymentMethods = [
    { id: 'card', name: 'بطاقة ائتمان/خصم', icon: CreditCard },
    { id: 'apple-pay', name: 'Apple Pay', icon: Smartphone },
    { id: 'insurance', name: 'التأمين الصحي', icon: FileText },
];

export default function Step3Payment({ doctor }: Step3Props) {
    const { bookingState, updateBookingState, setCurrentStep } = useBooking();
    const [selectedMethod, setSelectedMethod] = useState(bookingState.paymentMethod);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleNext = () => {
        if (selectedMethod && agreedToTerms) {
            updateBookingState({ paymentMethod: selectedMethod });
            setCurrentStep(4);
        }
    };

    const handleBack = () => {
        setCurrentStep(2);
    };

    const consultationPrice = bookingState.consultationType === 'followup'
        ? Math.round(doctor.consultation_price * 0.75)
        : doctor.consultation_price;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">الدفع</h2>
                <p className="text-gray-600">اختاري طريقة الدفع المناسبة</p>
            </div>

            {/* Price Summary */}
            <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                        <span>نوع الاستشارة:</span>
                        <span className="font-medium">
                            {bookingState.consultationType === 'new' ? 'استشارة جديدة' : 'استشارة متابعة'}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>المدة:</span>
                        <span className="font-medium">30 دقيقة</span>
                    </div>
                    <div className="border-t border-teal-200 pt-3 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">المجموع:</span>
                        <span className="text-3xl font-bold text-teal-900">{consultationPrice} ريال</span>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">طريقة الدفع</label>
                <div className="space-y-3">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;
                        return (
                            <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${isSelected
                                        ? 'border-teal-600 bg-teal-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-100' : 'bg-gray-100'}`}>
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-gray-600'}`} />
                                </div>
                                <span className={`font-medium ${isSelected ? 'text-teal-900' : 'text-gray-700'}`}>
                                    {method.name}
                                </span>
                                {isSelected && <CheckCircle className="w-5 h-5 text-teal-600 mr-auto" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">
                        أوافق على{' '}
                        <a href="/terms" className="text-teal-600 hover:underline" target="_blank">
                            الشروط والأحكام
                        </a>{' '}
                        و{' '}
                        <a href="/privacy" className="text-teal-600 hover:underline" target="_blank">
                            سياسة الخصوصية
                        </a>
                    </span>
                </label>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
                <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                    السابق
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!selectedMethod || !agreedToTerms}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    size="lg"
                >
                    تأكيد الحجز
                </Button>
            </div>
        </div>
    );
}
