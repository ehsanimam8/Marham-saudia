import { Suspense } from 'react';
import { getOnboardingSession, getFollowupQuestions } from '@/app/actions/onboarding_v5';
import ContextClient from '@/components/onboarding/v5/QuestionFlow/ContextClient';
import { redirect } from 'next/navigation';

interface PageProps {
    searchParams: {
        sessionId?: string;
    }
}

export default async function ContextPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const sessionId = resolvedSearchParams?.sessionId;

    if (!sessionId) {
        redirect('/onboarding/v5');
    }

    const session = await getOnboardingSession(sessionId) as any;

    if (!session || !session.primary_concern) {
        redirect('/onboarding/v5');
    }

    // Fetch follow-up questions for the selected concern
    const questions = await getFollowupQuestions(session.primary_concern);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                <ContextClient
                    sessionId={sessionId}
                    questions={questions}
                    sessionData={session}
                    concernId={session.primary_concern}
                />
            </Suspense>
        </div>
    );
}
