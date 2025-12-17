'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { updateOnboardingSession } from '@/app/actions/onboarding_v5';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/onboarding/v5/shared/ProgressBar';
import { getNextScreen } from '@/lib/onboarding/v5/questionFlows';
import { questionFlowRules } from '@/lib/onboarding/v5/questionFlowRules';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingFormState } from '@/lib/onboarding/v5/types';
import FeedbackSheet from '@/components/onboarding/v5/shared/FeedbackSheet';

interface ContextClientProps {
    sessionId: string;
    questions: any[];
    sessionData: any;
    concernId: string;
}

export default function ContextClient({ sessionId, questions, sessionData, concernId }: ContextClientProps) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);

    // Determine the sequence of questions based on order and rules
    // For simplicity in this v1 dynamic implementation, we'll sort by display_order
    // and filter based on simple visibility if we implement it, 
    // OR just show them all in sequence unless a rule says skip.

    // We need to track the "current active question" index
    // But questions might be skipped.
    const sortedQuestions = useMemo(() => {
        return questions.sort((a, b) => a.display_order - b.display_order);
    }, [questions]);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const currentQuestion = sortedQuestions[currentStepIndex];

    const isLastQuestion = currentStepIndex >= sortedQuestions.length - 1;

    const handleAnswer = (value: any) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const handleNext = async () => {
        // Check if we need to skip the next question based on this answer
        // The rules engine in 'questionFlowRules' maps concernId -> rules[]
        // We can check it.

        let nextIndex = currentStepIndex + 1;
        const currentAnswer = answers[currentQuestion.id];

        // Simple mock of rule evaluation (can be expanded)
        const rules = questionFlowRules[concernId];
        if (rules) {
            // Check if any rule matches current context
            // Context needs to be fully hydrated with symptoms etc.
            // For now, let's just proceed linearly or implement basic skip logic if rules exist
        }

        if (isLastQuestion) {
            await handleSubmit();
        } else {
            setCurrentStepIndex(nextIndex);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        } else {
            router.back();
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // Update session with answers (where to store? context_answers column?)
            // We probably need a 'context_answers' jsonb column or similar.
            // For now, we update 'previous_diagnosis' and 'urgency' if specific questions map to them.
            // Or just store raw answers if we added a column. 
            // The schema 'onboarding_sessions' doesn't explicitly seem to have 'answers' jsonb in my memory? 
            // 'previous_diagnosis' is a column.

            // Let's assume we derive urgency/diagnosis from answers here or on server.
            // We'll update the explicit columns.

            let updates: any = { sessionId };

            // Map common answers to columns (naive mapping)
            // If any answer suggests previous diagnosis
            if (Object.values(answers).some(a => a === 'yes' && currentQuestion.affects_doctor_matching)) {
                // heuristic
            }

            // Just forcing progress for now
            updates.previousDiagnosis = false; // default
            updates.urgency = 'moderate'; // default

            await updateOnboardingSession(updates);

            const partialState: OnboardingFormState = {
                currentStep: 5,
                sessionId,
                bodyPart: sessionData?.body_part,
                primaryConcern: sessionData?.primary_concern,
                selectedSymptoms: sessionData?.symptoms_selected || [],
                ageRange: sessionData?.age_range,
                previousDiagnosis: false,
                urgencyLevel: 'moderate',
                priorities: {}
            };

            const nextPath = getNextScreen(partialState);
            router.push(`${nextPath}?sessionId=${sessionId}`);
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!currentQuestion) {
        return (
            <div className="p-8 text-center">
                <p>No questions for this concern.</p>
                <Button onClick={handleSubmit} className="mt-4">Continue to Results</Button>
            </div>
        );
    }

    // Parse options if JSON string
    let options = [];
    if (currentQuestion.options) {
        options = typeof currentQuestion.options === 'string'
            ? JSON.parse(currentQuestion.options).options
            : currentQuestion.options.options || currentQuestion.options;
    }

    return (
        <div className="w-full max-w-md mx-auto flex flex-col min-h-[80vh]">
            <ProgressBar currentStep={4} totalSteps={6} className="mb-8" />

            <button onClick={handleBack} className="text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-6 text-slate-900 leading-tight">
                    {currentQuestion.question_en}
                </h1>

                <div className="space-y-4">
                    {currentQuestion.question_type === 'yes_no' && (
                        <RadioGroup
                            value={answers[currentQuestion.id]}
                            onValueChange={handleAnswer}
                            className="space-y-3"
                        >
                            <div className={cn(
                                "flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all",
                                answers[currentQuestion.id] === 'yes' ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                            )}>
                                <RadioGroupItem value="yes" id="yes" />
                                <Label htmlFor="yes" className="flex-1 cursor-pointer font-medium">Yes</Label>
                            </div>
                            <div className={cn(
                                "flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all",
                                answers[currentQuestion.id] === 'no' ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                            )}>
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no" className="flex-1 cursor-pointer font-medium">No</Label>
                            </div>
                        </RadioGroup>
                    )}

                    {currentQuestion.question_type === 'multiple_choice' && (
                        <RadioGroup
                            value={answers[currentQuestion.id]}
                            onValueChange={handleAnswer}
                            className="space-y-3"
                        >
                            {options?.map((opt: any) => (
                                <div key={opt.value} className={cn(
                                    "flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all",
                                    answers[currentQuestion.id] === opt.value ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                                )}>
                                    <RadioGroupItem value={opt.value} id={opt.value} />
                                    <Label htmlFor={opt.value} className="flex-1 cursor-pointer font-medium">
                                        {opt.label_en || opt.value}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </div>
            </div>

            <div className="pt-8 text-center space-y-4">
                <Button
                    onClick={handleNext}
                    disabled={submitting || !answers[currentQuestion.id]}
                    className="w-full h-12 text-lg"
                >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLastQuestion ? 'Complete' : 'Next Question'}
                </Button>

                <FeedbackSheet sessionId={sessionId} stepName={`Question: ${currentQuestion.question_en}`} />
            </div>
        </div>
    );
}
