import { createClient } from '@/lib/supabase/server';
import { matchDoctorsToSession } from '@/lib/onboarding/v5/doctorMatching';
import ResultsClient from '@/components/onboarding/v5/Results/ResultsClient';
import { OnboardingSession } from '@/lib/onboarding/v5/types';


type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ResultsPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const sessionId = searchParams.sessionId;


    if (!sessionId) {
        return <div className="p-8 text-center text-red-500">Session ID missing</div>;
    }

    const supabase = await createClient();
    const { data: session, error } = await supabase
        .from('onboarding_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

    if (error || !session) {
        return <div className="p-8 text-center text-red-500">Session not found or error loading</div>;
    }

    // Run matching logic
    // Cast session to OnboardingSession type if Supabase types aren't perfectly aligned
    const matchedDoctors = await matchDoctorsToSession(session as unknown as OnboardingSession);

    return (
        <main className="min-h-screen bg-slate-50">
            <ResultsClient
                session={session as unknown as OnboardingSession}
                matchedDoctors={matchedDoctors}
                articles={[]}
            />
        </main>
    );
}
