'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateOnboardingSession } from '@/app/actions/onboarding_v5';
import { getNextScreen } from '@/lib/onboarding/v5/questionFlows';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '../shared/ProgressBar';
import { OnboardingFormState } from '@/lib/onboarding/v5/types';

import { ChevronRight, Loader2 } from 'lucide-react';

// Simple age ranges as per spec
const ageRanges = [
    { id: '18-24', labelAr: '18-24 سنة', labelEn: '18-24 years', icon: '👧' },
    { id: '25-34', labelAr: '25-34 سنة', labelEn: '25-34 years', icon: '👩' },
    { id: '35-44', labelAr: '35-44 سنة', labelEn: '35-44 years', icon: '👩‍🦰' },
    { id: '45+', labelAr: '45+ سنة', labelEn: '45+ years', icon: '👩‍🦳' }
];

export default function AgeCheckClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRange, setSelectedRange] = useState<string | null>(null);

    const handleSelect = async (rangeId: string) => {
        if (!sessionId) return;
        setIsSubmitting(true);
        setSelectedRange(rangeId);
        try {
            await updateOnboardingSession({
                sessionId,
                ageRange: rangeId
            });

            router.push(`/onboarding/v5/symptoms?sessionId=${sessionId}`);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setSelectedRange(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 pt-8" dir="rtl">
            <div className="max-w-xl mx-auto">
                <ProgressBar currentStep={3} totalSteps={5} className="mb-8" />
                <h2 className="text-2xl font-bold text-center mb-2 font-arabic text-teal-900"><span>كم عمرك؟</span></h2>
                <p className="text-center text-gray-500 mb-8 font-arabic"><span>يساعدنا هذا في التوصية بالأخصائية المناسبة لكِ</span></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ageRanges.map(range => (
                        <button
                            key={range.id}
                            onClick={() => handleSelect(range.id)}
                            disabled={isSubmitting}
                            className={`p-6 bg-white border rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center justify-between group ${selectedRange === range.id ? 'border-teal-500 bg-teal-50' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{range.icon}</span>
                                <div className="text-right">
                                    <span className="font-bold text-lg block font-arabic">{range.labelAr}</span>
                                </div>
                            </div>
                            {isSubmitting && selectedRange === range.id ? (
                                <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
