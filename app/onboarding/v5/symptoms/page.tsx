import { Suspense } from 'react';
import { getOnboardingSession, getConcernDetails, getSymptoms } from '@/app/actions/onboarding_v5';
import SymptomsClient from '@/components/onboarding/v5/QuestionFlow/SymptomsClient';
import { redirect } from 'next/navigation';

interface PageProps {
    searchParams: {
        sessionId?: string;
    }
}

export default async function SymptomsPage({ searchParams }: PageProps) {
    // Determine sessionId (Next.js 15+ searchParams are promises, but here checking type)
    // Assume searchParams is object for now or await if needed, but in 14 it's object.
    // If user is on 15, we might need await.
    // Safely handling:
    const resolvedSearchParams = await searchParams;
    const sessionId = resolvedSearchParams?.sessionId;

    if (!sessionId) {
        redirect('/onboarding/v5');
    }

    // Fetch Session to know the concern
    const session = await getOnboardingSession(sessionId) as any;

    if (!session || !session.primary_concern) {
        // If session invalid or no concern selected, go back
        // But maybe concern is 'other'?
        // If 'other', we might skip symptoms or show generic.
        // For now, if no concern, redirect to body selection?
        // Let's safe guard.
        if (session && !session.primary_concern) {
            // If we have a body part, go back to concern selection
            if (session.body_part) {
                redirect(`/onboarding/v5/${session.body_part}?sessionId=${sessionId}`);
            }
            // Otherwise start over
            redirect('/onboarding/v5');
        }
        redirect('/onboarding/v5');
    }

    const concernId = session.primary_concern;

    // Parallel fetch details
    const [concernDetails, symptoms] = await Promise.all([
        getConcernDetails(concernId),
        getSymptoms(concernId)
    ]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <Suspense fallback={<div className="text-center p-8">Loading symptoms...</div>}>
                <SymptomsClient
                    sessionId={sessionId}
                    concernDetails={concernDetails}
                    symptoms={symptoms}
                    sessionData={session}
                />
            </Suspense>
        </div>
    );
}
