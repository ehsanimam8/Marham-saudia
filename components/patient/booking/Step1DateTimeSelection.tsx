'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooking } from './BookingContext';
import type { Doctor } from '@/lib/api/doctors';

interface Step1Props {
    doctor: Doctor;
}

// Mock available time slots - in production, fetch from doctor_schedules
const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
];

export default function Step1DateTimeSelection({ doctor }: Step1Props) {
    const { bookingState, updateBookingState, setCurrentStep } = useBooking();
    const [selectedDate, setSelectedDate] = useState<Date | null>(bookingState.selectedDate);
    const [selectedTime, setSelectedTime] = useState<string | null>(bookingState.selectedTime);

    // Generate next 14 days
    const availableDates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return date;
    });

    const handleNext = () => {
        if (selectedDate && selectedTime) {
            updateBookingState({ selectedDate, selectedTime });
            setCurrentStep(2);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">اختاري التاريخ والوقت</h2>
                <p className="text-gray-600">اختاري الموعد المناسب لك</p>
            </div>

            {/* Date Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 inline ml-2" />
                    اختاري التاريخ
                </label>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                    {availableDates.map((date) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`p-3 rounded-lg border-2 text-center transition-all ${isSelected
                                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                <div className="text-xs text-gray-500">
                                    {date.toLocaleDateString('ar-SA', { weekday: 'short' })}
                                </div>
                                <div className="font-bold">{date.getDate()}</div>
                                <div className="text-xs text-gray-500">
                                    {date.toLocaleDateString('ar-SA', { month: 'short' })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        اختاري الوقت
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${isSelected
                                            ? 'border-teal-600 bg-teal-50 text-teal-900'
                                            : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Price Summary */}
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">سعر الاستشارة:</span>
                    <span className="text-2xl font-bold text-teal-900">{doctor.consultation_price} ريال</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    size="lg"
                >
                    التالي
                </Button>
            </div>
        </div>
    );
}
