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

    // 4. Extract Context Answers from user_feedback
    let detailedAnswers = 'None';
    if (session.user_feedback && session.user_feedback.includes('[CONTEXT_ANSWERS]')) {
        try {
            const answersPart = session.user_feedback.split('[CONTEXT_ANSWERS]')[1];
            const answersJson = JSON.parse(answersPart);

            // Fetch question text to make it readable for AI
            const { data: questions } = await supabase
                .from('followup_questions')
                .select('id, question_en')
                .in('id', Object.keys(answersJson));

            if (questions) {
                detailedAnswers = questions.map(q => `${q.question_en}: ${answersJson[q.id]}`).join('\n');
            }
        } catch (e) {
            console.error("AI Analysis: Failed to parse context answers", e);
        }
    }

    // Determine category and doctor specialty recommendation
    let category = 'medical'; // default
    if (session.body_part) {
        const { data: bp } = await supabase.from('body_parts').select('category_id').eq('id', session.body_part).single();
        if (bp) category = bp.category_id;
    }

    let specialtyRecommendation = 'General Practitioner';
    if (category === 'beauty') specialtyRecommendation = 'Dermatologist or Plastic Surgeon';
    else if (category === 'mental') specialtyRecommendation = 'Psychologist or Psychiatrist';
    else if (category === 'medical') specialtyRecommendation = 'Gynecologist or Internal Medicine Specialist';

    const prompt = `
    You are a helpful medical assistant for Marham Saudi, a women's health platform.
    
    Patient Context:
    - Primary Concern: ${concernName} (${concernNameAr})
    - Body Part: ${bodyPartName}
    - Symptoms: ${symptomsList}
    - Age Range: ${session.age_range || 'Not specified'}
    - Detailed Answers:
    ${detailedAnswers}
    
    AI Nurse Context (if any):
    ${chatTranscript}
    
    REQUIRED: Generate a comprehensive analysis in valid JSON format. Do not use markdown backticks.
    
    The response MUST include:
    1. "clinical_summary": A concise paragraph for the doctor.
    2. "patient_story": An empathetic narrative for the patient, including relatable details about their symptoms (English).
    3. "patient_story_ar": The narrative in warm, reassuring Arabic.
    4. "expectations": What the patient should expect in terms of recovery or next steps (English).
    5. "expectations_ar": Expectations in Arabic.
    6. "process_details": Description of the diagnostic or treatment processes they might undergo (English).
    7. "process_details_ar": Process details in Arabic.
    8. "doctor_profile": Recommendation for the type of doctor they should see. They should see a ${specialtyRecommendation}. Explain why (English).
    9. "doctor_profile_ar": Doctor profile recommendation in Arabic.
    10. "quick_tip": A short, actionable health tip.
    11. "quick_tip_ar": Quick tip in Arabic.
    
    Example output format:
    {
      "clinical_summary": "...",
      "patient_story": "...",
        "patient_story_ar": "...",
        "expectations": "...",
        "expectations_ar": "...",
        "process_details": "...",
        "process_details_ar": "...",
        "doctor_profile": "...",
        "doctor_profile_ar": "...",
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

    } catch (error: any) {
        if (error?.message?.includes('429')) {
            console.warn("AI Analysis: Rate limit hit, skipping insights.");
        } else {
            console.error('AI Generation/Parsing failed:', error);
        }
        return { success: false, error: 'Failed to generate insights' };
    }
}
