'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBodyPart } from '@/lib/onboarding/v5/bodyPartConfig';
import { updateOnboardingSession } from '@/app/actions/onboarding_v5';
import { getNextScreen } from '@/lib/onboarding/v5/questionFlows';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '../shared/ProgressBar';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Concern, OnboardingFormState, BodyPart } from '@/lib/onboarding/v5/types';
import FeedbackSheet from '@/components/onboarding/v5/shared/FeedbackSheet';

interface ConcernSelectionProps {
    bodyPartId: string;
    initialConcerns?: Concern[];
    bodyPartDetails?: Partial<BodyPart>;
}

export default function ConcernSelectionClient({ bodyPartId, initialConcerns, bodyPartDetails }: ConcernSelectionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Legacy fallback
    const legacyBodyPart = getBodyPart(bodyPartId);

    // Polyfill bodyPart object using dynamic or legacy data
    const bodyPart = {
        nameEn: bodyPartDetails?.nameEn || legacyBodyPart?.nameEn || bodyPartId,
        nameAr: bodyPartDetails?.nameAr || legacyBodyPart?.nameAr || '',
        concerns: initialConcerns || legacyBodyPart?.concerns || []
    };

    const concerns = bodyPart.concerns;

    const handleBack = () => {
        router.back();
    };

    const handleContinue = async () => {
        if (!selectedConcern) return;

        setIsSubmitting(true);
        try {
            let activeSessionId = sessionId;

            // Create session if it doesn't exist (e.g. user landed here directly)
            if (!activeSessionId) {
                // In a real app we might want to check for existing cookies too
                // For now, we'll try to create a new session if needed or just redirect to start if that fails
                // But creating a session from here needs 'createOnboardingSession' which isn't imported.
                // It's cleaner to redirect to body map if no session.
                console.warn("No session ID found, redirecting to restart");
                router.push('/onboarding/v5');
                return;
            }

            await updateOnboardingSession({
                sessionId: activeSessionId,
                primaryConcern: selectedConcern
            });

            // Determine next screen
            const partialState: OnboardingFormState = {
                currentStep: 2,
                sessionId: activeSessionId,
                bodyPart: bodyPartId,
                primaryConcern: selectedConcern,
                selectedSymptoms: [], // Empty means we go to symptoms next
                ageRange: null,
                previousDiagnosis: null,
                urgencyLevel: null,
                priorities: {}
            };

            const nextPath = getNextScreen(partialState);
            console.log('Navigating to:', nextPath); // Debug
            router.push(`${nextPath}?sessionId=${activeSessionId}`);
        } catch (error) {
            console.error("Error updating session", error);
            // Show error to user, don't redirect to symptoms as it requires the concern to be set
            alert("Failed to save selection. Please try again. If the issue persists, try refreshing the page.");
            setIsSubmitting(false);
        } finally {
            // setIsSubmitting(false); // Don't reset if navigating
        }
    };

    // Auto-advance
    useEffect(() => {
        if (selectedConcern) {
            const timeout = setTimeout(() => {
                handleContinue();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [selectedConcern]);

    if (!bodyPart) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-xl font-bold text-red-500 mb-2">Unavailable</h2>
                <p className="text-gray-500">This body part is not configured yet.</p>
                <Button onClick={handleBack} variant="outline" className="mt-4">Go Back</Button>
            </div>
        );
    }

    if (concerns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="bg-orange-50 p-6 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h2>
                <p className="text-gray-500 max-w-md">
                    We are currently expanding our network of specialists for {bodyPart.nameEn}.
                    Please check back later or try another category.
                </p>
                <Button onClick={handleBack} className="mt-8 bg-teal-600 hover:bg-teal-700">
                    Choose another area
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="max-w-2xl mx-auto pt-8">
                <ProgressBar currentStep={2} totalSteps={5} label="Steps 2 of 5" className="mb-8" />

                <div className="mb-6">
                    <Button variant="ghost" onClick={handleBack} className="pl-0 hover:bg-transparent text-gray-500">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back
                    </Button>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        What brings you here regarding your {bodyPart.nameEn}?
                    </h2>
                    <p className="text-gray-500">
                        ما الذي يقلقك؟
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {concerns.map((concern: Concern) => (
                        <div
                            key={concern.id}
                            onClick={() => setSelectedConcern(concern.id)}
                            className={`
                       cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300
                       ${selectedConcern === concern.id
                                    ? 'border-teal-500 bg-teal-50 shadow-md transform -translate-y-1'
                                    : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
                                }
                   `}
                        >
                            <div className={`${selectedConcern === concern.id ? 'text-teal-600' : 'text-slate-400'} mb-4 transition-colors`}>
                                {concern.icon}
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                                {concern.titleEn}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-arabic">
                                {concern.titleAr}
                            </p>
                        </div>
                    ))}
                </div>

                {selectedConcern && (
                    <div className="mt-8 text-center animate-in fade-in">
                        <div className="text-sm text-gray-400 mb-2">One moment...</div>
                        {isSubmitting && <div className="loader mx-auto w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                )}

                <FeedbackSheet sessionId={sessionId || ''} stepName={`Concern: ${bodyPartId}`} />
            </div>
        </div>
    );
}
