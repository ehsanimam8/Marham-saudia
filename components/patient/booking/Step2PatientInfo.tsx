'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBooking } from './BookingContext';

export default function Step2PatientInfo() {
    const { bookingState, updateBookingState, setCurrentStep } = useBooking();
    const [consultationType, setConsultationType] = useState<'new' | 'followup'>(bookingState.consultationType);
    const [reasonAr, setReasonAr] = useState(bookingState.reasonAr);
    const [insuranceCompany, setInsuranceCompany] = useState(bookingState.patientInfo.insuranceCompany || '');
    const [insuranceNumber, setInsuranceNumber] = useState(bookingState.patientInfo.insuranceNumber || '');

    const handleNext = () => {
        updateBookingState({
            consultationType,
            reasonAr,
            patientInfo: { insuranceCompany, insuranceNumber },
        });
        setCurrentStep(3);
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات المريضة</h2>
                <p className="text-gray-600">أخبرينا عن سبب الاستشارة</p>
            </div>

            {/* Consultation Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">نوع الاستشارة</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setConsultationType('new')}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${consultationType === 'new'
                                ? 'border-teal-600 bg-teal-50 text-teal-900'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                    >
                        <div className="font-bold mb-1">استشارة جديدة</div>
                        <div className="text-xs text-gray-500">أول مرة مع هذه الطبيبة</div>
                    </button>
                    <button
                        onClick={() => setConsultationType('followup')}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${consultationType === 'followup'
                                ? 'border-teal-600 bg-teal-50 text-teal-900'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                    >
                        <div className="font-bold mb-1">استشارة متابعة</div>
                        <div className="text-xs text-gray-500">متابعة لحالة سابقة</div>
                    </button>
                </div>
            </div>

            {/* Reason for Consultation */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    سبب الاستشارة <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={reasonAr}
                    onChange={(e) => setReasonAr(e.target.value)}
                    placeholder="اشرحي سبب الاستشارة بالتفصيل..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                />
                <p className="text-xs text-gray-500 mt-1">سيتم مشاركة هذه المعلومات مع الطبيبة فقط</p>
            </div>

            {/* Insurance Information */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-gray-900">معلومات التأمين (اختياري)</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">شركة التأمين</label>
                    <input
                        type="text"
                        value={insuranceCompany}
                        onChange={(e) => setInsuranceCompany(e.target.value)}
                        placeholder="مثال: بوبا، تعاونية..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم البوليصة</label>
                    <input
                        type="text"
                        value={insuranceNumber}
                        onChange={(e) => setInsuranceNumber(e.target.value)}
                        placeholder="رقم البوليصة"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
                <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                    السابق
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!reasonAr.trim()}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    size="lg"
                >
                    التالي
                </Button>
            </div>
        </div>
    );
}
