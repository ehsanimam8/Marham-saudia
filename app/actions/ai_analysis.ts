// @ts-nocheck
'use server';

import { createClient } from "@/lib/supabase/server";
import { generateContent } from "@/lib/gemini";

export async function generatePatientStories(sessionId: string) {
    const supabase = await createClient();

    // 1. Fetch Session Data (Simple query first)
    const { data: session, error: sessionError } = await supabase
        .from('onboarding_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

    if (sessionError || !session) {
        console.error("AI Analysis: Session not found or error", sessionError);
        throw new Error('Session not found');
    }

    // 2. Fetch Related Data (Concern & Body Part)
    let concernName = 'Unknown Concern';
    let concernNameAr = 'غير محدد';
    let bodyPartName = 'Unknown Part';

    if (session.primary_concern) {
        const { data: concern } = await supabase
            .from('primary_concerns')
            .select('name_en, name_ar')
            .eq('id', session.primary_concern)
            .single();
        if (concern) {
            concernName = concern.name_en;
            concernNameAr = concern.name_ar;
        }
    }

    if (session.body_part) {
        const { data: bp } = await supabase
            .from('body_parts')
            .select('name_en, name_ar')
            .eq('id', session.body_part)
            .single();
        if (bp) {
            bodyPartName = bp.name_en;
        }
    }

    // 3. Fetch Symptoms (using 'symptoms_selected' array from session if available, or just generic list)
    // Note: The previous code tried to join 'session_symptoms' table, but our v5 onboarding uses 'symptoms_selected' column (array of IDs) or distinct table? 
    // Checking onboarding_v5.ts: we update 'symptoms_selected' column which is text[] or jsonb.
    // The previous join query assumed a 'session_symptoms' join table. This might be why it failed if that table doesn't exist or isn't used!
    // Let's rely on the session.symptoms_selected array.

    let symptomsList = 'None';
    if (session.symptoms_selected && Array.isArray(session.symptoms_selected) && session.symptoms_selected.length > 0) {
        const { data: symptomsData } = await supabase
            .from('symptoms')
            .select('name_en')
            .in('id', session.symptoms_selected);

        if (symptomsData) {
            symptomsList = symptomsData.map((s: any) => s.name_en).join(', ');
        }
    }

    // 4. Fetch Answers (Context)
    // The previous code queried 'onboarding_answers'. Let's verify if that table is populated. 
    // ContextClient.tsx doesn't seem to insert into 'onboarding_answers'. It updates 'onboarding_sessions' columns (urgency etc).
    // Be careful. If ContextClient DOES NOT write to 'onboarding_answers', then that table is empty.
    // Checking ContextClient.tsx again... It calls `updateOnboardingSession`. It DOES NOT seem to insert into 'onboarding_answers'. 
    // So distinct answers might not be stored in DB separately!
    // We will skip detailed Q&A for now if not available, relying on what's in the session.
    // If we want detailed Q&A, we need to ensure they are saved.

    const answersList = "Patient answered questionnaire."; // Placeholder if we don't have distinct answer rows.

    // 5. Fetch AI Chat Transcript
    // Only if AI Nurse was used.
    let chatTranscript = 'No additional chat context.';
    try {
        const { data: chatSession } = await supabase
            .from('ai_chat_sessions')
            .select('id')
            .eq('onboarding_session_id', sessionId)
            .single();

        if (chatSession) {
            const { data: chatMessages } = await supabase
                .from('ai_chat_messages')
                .select('*')
                .eq('chat_session_id', chatSession.id)
                .order('created_at', { ascending: true });

            if (chatMessages && chatMessages.length > 0) {
                chatTranscript = chatMessages.map((m: any) => `${m.role === 'user' ? 'Patient' : 'Nurse'}: ${m.content}`).join('\n');
            }
        }
    } catch (e) {
        // Ignore chat fetch errors
    }


    const prompt = `
    You are a helpful medical assistant for Marham Saudi, a women's health platform.
    
    Patient Context:
    - Primary Concern: ${concernName} (${concernNameAr})
    - Body Part: ${bodyPartName}
    - Symptoms: ${symptomsList}
    - Age Range: ${session.age_range || 'Not specified'}
    
    AI Nurse Context (if any):
    ${chatTranscript}
    
    Please generate the following 5 sections in valid JSON format. Do not use markdown backticks.
    
    1. "clinical_summary": A concise paragraph for the doctor summarizing the patient's condition.
    2. "patient_story": A simplified, empathetic narrative explaining to the patient what might be happening, in a reassuring tone (English).
    3. "patient_story_ar": The same patient story translated into warm, reassuring Arabic.
    4. "quick_tip": A very short, actionable health tip strictly based on their reported symptoms (e.g. "Stay hydrated").
    5. "quick_tip_ar": The same quick tip in Arabic.
    
    Example output format:
    {
      "clinical_summary": "...",
        "patient_story": "...",
        "patient_story_ar": "...",
        "quick_tip": "...",
        "quick_tip_ar": "..."
    }
  `;

    try {
        const aiText = await generateContent(prompt);
        // Sanitize JSON
        const cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanedText);

        return { success: true, data: result };

    } catch (error) {
        console.error('AI Generation/Parsing failed:', error);
        return { success: false, error: 'Failed to generate insights' };
    }
}
