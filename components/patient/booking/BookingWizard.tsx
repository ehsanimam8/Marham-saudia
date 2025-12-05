'use client';

import { useBooking } from './BookingContext';
import StepIndicator from './StepIndicator';
import Step1DateTimeSelection from './Step1DateTimeSelection';
import Step2PatientInfo from './Step2PatientInfo';
import Step3Payment from './Step3Payment';
import Step4Confirmation from './Step4Confirmation';
import type { Doctor } from '@/lib/api/doctors';

interface BookingWizardProps {
    doctor: Doctor;
}

export default function BookingWizard({ doctor }: BookingWizardProps) {
    const { currentStep } = useBooking();

    return (
        <div>
            <StepIndicator currentStep={currentStep} totalSteps={4} />

            <div className="mt-8">
                {currentStep === 1 && <Step1DateTimeSelection doctor={doctor} />}
                {currentStep === 2 && <Step2PatientInfo />}
                {currentStep === 3 && <Step3Payment doctor={doctor} />}
                {currentStep === 4 && <Step4Confirmation doctor={doctor} />}
            </div>
        </div>
    );
}
