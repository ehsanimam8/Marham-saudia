'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const steps = [
    { number: 1, title: 'التاريخ والوقت', titleEn: 'Date & Time' },
    { number: 2, title: 'معلومات المريضة', titleEn: 'Patient Info' },
    { number: 3, title: 'الدفع', titleEn: 'Payment' },
    { number: 4, title: 'التأكيد', titleEn: 'Confirmation' },
];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep > step.number
                                        ? 'bg-green-500 text-white'
                                        : currentStep === step.number
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                            </div>
                            <span
                                className={`text-xs mt-2 text-center ${currentStep >= step.number ? 'text-gray-900 font-medium' : 'text-gray-400'
                                    }`}
                            >
                                {step.title}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
