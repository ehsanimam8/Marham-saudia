'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Step1BasicInfo from './Step1BasicInfo';
import Step2ProfessionalInfo from './Step2ProfessionalInfo';
import Step3Documents from './Step3Documents';
import Step4Review from './Step4Review';

const steps = [
    { id: 1, name: 'المعلومات الأساسية' },
    { id: 2, name: 'المعلومات المهنية' },
    { id: 3, name: 'المستندات' },
    { id: 4, name: 'المراجعة' },
];

export default function RegistrationWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        licenseNumber: '',
        hospital: '',
        bio: '',
        documents: [] as File[],
    });

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10" />
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center bg-gray-50 px-2">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors mb-2",
                                        isCompleted ? "bg-green-500 text-white" :
                                            isCurrent ? "bg-teal-600 text-white" :
                                                "bg-gray-200 text-gray-500"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                                </div>
                                <span className={cn(
                                    "text-xs font-medium",
                                    isCurrent ? "text-teal-600" : "text-gray-500"
                                )}>
                                    {step.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-8">
                {currentStep === 1 && (
                    <Step1BasicInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNext}
                    />
                )}
                {currentStep === 2 && (
                    <Step2ProfessionalInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}
                {currentStep === 3 && (
                    <Step3Documents
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}
                {currentStep === 4 && (
                    <Step4Review
                        formData={formData}
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );
}
