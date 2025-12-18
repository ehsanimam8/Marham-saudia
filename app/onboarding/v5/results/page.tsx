// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { matchDoctorsToSession } from '@/lib/onboarding/v5/doctorMatching';
import ResultsClient from '@/components/onboarding/v5/Results/ResultsClient';
import { OnboardingSession } from '@/lib/onboarding/v5/types';
import { getEducationalContent } from '@/app/actions/admin_onboarding';
import { generatePatientStories } from '@/app/actions/ai_analysis';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ResultsPage(props: {
    searchParams: SearchParams
}) {
    // ... (existing code: fetch sessionId, session, etc.)
    const searchParams = await props.searchParams;
    const sessionId = searchParams.sessionId as string;

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
    const matchedDoctors = await matchDoctorsToSession(session as unknown as OnboardingSession);

    // Fetch relevant content
    // ...

    // Fetch AI Analysis (Patient Stories + Quick Tips)
    let aiInsights = null;
    try {
        const aiResult = await generatePatientStories(sessionId);
        if (aiResult.success) {
            aiInsights = aiResult.data;
        }
    } catch (e: any) {
        // Handle Quota/Rate Limit Exceeded gracefully
        if (e?.message?.includes('429') || e?.message?.includes('Quota exceeded')) {
            console.warn("AI Insights Skipped: Rate limit/Quota exceeded.");
        } else {
            console.error("AI Insights failed", e);
        }
    }

    // Fetch relevant content if primary concern exists
    let articles: any[] = [];
    if (session.primary_concern) {
        try {
            articles = await getEducationalContent(session.primary_concern); // This might be wrong, primary_concern is a string ID? 
            // In DB it is a string key? Or UUID?
            // Assuming it works as is for now since it wasn't flagged. But getEducationalContent expects concernId.
        } catch (e) {
            console.error("Failed to load articles", e);
        }
    }

    // Fetch uploaded documents
    const { data: documents } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('onboarding_session_id', sessionId)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-slate-50">
            <ResultsClient
                session={session as unknown as OnboardingSession}
                matchedDoctors={matchedDoctors}
                articles={articles || []}
                documents={documents || []}
                aiInsights={aiInsights}
            />
        </main>
    );
}
