// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { getMatchedDoctorsV2 } from '@/lib/onboarding/v5/doctor-matching-v2';
import ConversionResultsClient from '@/components/onboarding/v5/Results/ConversionResultsClient';
import { getSocialProofData } from '@/lib/onboarding/v5/social-proof';
import { AnalysisResult } from '@/lib/onboarding/v5/analysis-types';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ResultsPage(props: {
    searchParams: SearchParams
}) {
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

    // --- DERIVE ANALYSIS RESULT ---
    // 1. Fetch Concern & Symptoms Details
    const { data: concern, error: concernError } = session.primary_concern ? await supabase
        .from('primary_concerns')
        .select('name_ar, name_en, body_part_id, specialty_primary')
        .eq('id', session.primary_concern)
        .single() : { data: null, error: null };

    if (concernError) {
        console.error('Error fetching concern:', concernError);
    }

    const { data: symptomsData } = (session.symptoms_selected && session.symptoms_selected.length > 0) ? await supabase
        .from('symptoms')
        .select('name_ar, name_en')
        .in('id', session.symptoms_selected) : { data: [] };

    // Determine category based on body_part or concern ID
    let category: 'medical' | 'beauty' | 'mental_health' = 'beauty'; // Default to beauty for cosmetic concerns

    // Check if it's a beauty/cosmetic concern based on the concern ID pattern
    if (session.primary_concern?.includes('beauty') || session.primary_concern?.includes('skin') ||
        session.primary_concern?.includes('hair') || session.primary_concern?.includes('face')) {
        category = 'beauty';
    } else if (session.primary_concern?.includes('mental') || session.primary_concern?.includes('anxiety') ||
        session.primary_concern?.includes('depression')) {
        category = 'mental_health';
    } else if (concern?.body_part_id) {
        // Fallback: check body part
        const { data: bodyPart } = await supabase.from('body_parts').select('id, name_en').eq('id', concern.body_part_id).single();
        if (bodyPart?.name_en?.toLowerCase().includes('mental')) category = 'mental_health';
        else if (bodyPart?.name_en?.toLowerCase().includes('skin') || bodyPart?.name_en?.toLowerCase().includes('face') || bodyPart?.name_en?.toLowerCase().includes('hair')) category = 'beauty';
        else category = 'medical';
    }

    const symptomsList = symptomsData?.map(s => `${s.name_ar} / ${s.name_en}`) || [];

    const analysisResult: AnalysisResult = {
        category,
        primaryCondition: concern?.name_en || 'Undetermined',
        primaryCondition_ar: concern?.name_ar || 'غير محدد',
        severity: (session.urgency === 'very_urgent' || session.urgency === 'urgent') ? 'severe' : (session.urgency === 'moderate' ? 'moderate' : 'mild'),
        symptoms: symptomsList,
        confidence: 85,
        recommendedSpecialty: (concern?.specialty_primary?.toLowerCase() as any) || 'medical'
    };

    // --- FETCH SOCIAL PROOF ---
    const socialProof = getSocialProofData(analysisResult.category, analysisResult.primaryCondition);

    // --- FETCH MATCHED DOCTORS ---
    const matchedDoctors = await getMatchedDoctorsV2(
        analysisResult.category,
        analysisResult.primaryCondition
    );

    return (
        <main className="min-h-screen bg-slate-50">
            <ConversionResultsClient
                sessionId={sessionId}
                analysisResult={analysisResult}
                socialProof={socialProof}
                matchedDoctors={matchedDoctors}
            />
        </main>
    );
}
