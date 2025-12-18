// @ts-nocheck
'use server';

import { createClient } from "@/lib/supabase/server";
import { generateContent } from "@/lib/gemini";

export async function generatePatientStories(sessionId: string) {
    const supabase = await createClient();

    // 1. Fetch Session Data with all related info
    // We need query param to fetch text values of FKs if easy, or just IDs and lookup.
    // Actually, let's fetch session with joins if possible, or just raw IDs and we map them manually or let AI infer?
    // AI needs names.

    const { data: session, error: sessionError } = await supabase
        .from('onboarding_sessions')
        .select(`
        *,
        primary_concerns ( name_en, name_ar ),
        body_parts ( name_en, name_ar )
    `)
        .eq('id', sessionId)
        .single();

    if (sessionError || !session) {
        throw new Error('Session not found');
    }

    // Fetch Answers with Question text
    // We need to fetch 'onboarding_answers' and join 'followup_questions'
    const { data: answers, error: answerError } = await supabase
        .from('onboarding_answers')
        .select(`
        answer_text,
        question_id,
        followup_questions ( question_en, question_ar )
    `)
        .eq('session_id', sessionId);

    // Fetch Symptoms
    const { data: selectedSymptoms, error: symError } = await supabase
        .from('session_symptoms')
        .select(`
        symptom_id,
        symptoms ( name_en, name_ar )
    `)
        .eq('session_id', sessionId);


    // Construct Prompt
    const concernName = session.primary_concerns?.name_en || 'Unknown Concern';
    const concernNameAr = session.primary_concerns?.name_ar || 'غير محدد';
    const bodyPart = session.body_parts?.name_en || 'Unknown Part';

    const symptomsList = selectedSymptoms?.map((s: any) => s.symptoms?.name_en).join(', ') || 'None';

    const answersList = answers?.map((a: any) => {
        return `Q: ${a.followup_questions?.question_en} A: ${a.answer_text}`;
    }).join('\n');

    // Fetch AI Chat Transcript if available
    const { data: chatMessages } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('chat_session_id', (await supabase.from('ai_chat_sessions').select('id').eq('onboarding_session_id', sessionId).single()).data?.id || '')
        .order('created_at', { ascending: true });

    const chatTranscript = chatMessages?.map((m: any) => `${m.role === 'user' ? 'Patient' : 'Nurse'}: ${m.content}`).join('\n') || 'No additional chat context.';

    const prompt = `
    You are a helpful medical assistant for Marham Saudi, a women's health platform.
    
    Patient Context:
    - Primary Concern: ${concernName} (${concernNameAr})
    - Body Part: ${bodyPart}
    - Symptoms: ${symptomsList}
    - Detailed Answers:
    ${answersList}
    
    - AI Nurse Assessment Transcript:
    ${chatTranscript}

    - Age Range: ${session.age_range}
    
    Please generate the following 4 sections in valid JSON format. Do not use markdown backticks around the JSON. Just the raw JSON object.
    
    1. "clinical_summary": A concise paragraph for the doctor summarizing the patient's condition, incorporating details from the AI chat.
    2. "patient_story": A simplified, empathetic narrative explaining to the patient what might be happening, in a reassuring tone (English).
    3. "patient_story_ar": The same patient story translated into warm, reassuring Arabic.
    4. "quick_tip": A very short, actionable health tip strictly based on their reported symptoms (e.g. "Stay hydrated", "Avoid bright lights").
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
        // Sanitize JSON if markeddown
        const cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanedText);

        // In a real app, we might save this to the DB.
        // For now, return it.
        return { success: true, data: result };

    } catch (error) {
        console.error('AI Generation failed:', error);
        return { success: false, error: 'Failed to generate insights' };
    }
}
