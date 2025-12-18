// @ts-nocheck
'use server';

import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function startAiChat(sessionId: string) {
    const supabase = await createClient();

    // Check if chat already exists
    const { data: existingChat } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('onboarding_session_id', sessionId)
        .eq('status', 'active')
        .single();

    if (existingChat) {
        return { chatId: existingChat.id, isNew: false };
    }

    // Fetch session details for personalized greeting
    const { data: session } = await supabase.from('onboarding_sessions').select('*').eq('id', sessionId).single();
    const concern = session?.primary_concern || 'your condition';

    // Create new chat
    const { data: newChat, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
            onboarding_session_id: sessionId,
            status: 'active'
        })
        .select()
        .single();

    if (error) throw new Error('Failed to create chat session');

    // Generate personalized greeting
    let concernText = session?.primary_concern ? session.primary_concern.replace(/_/g, ' ') : 'your condition';
    let symptomText = '';
    if (session?.symptoms && Array.isArray(session.symptoms) && session.symptoms.length > 0) {
        // Try to join first 3 symptoms
        symptomText = ` such as ${session.symptoms.slice(0, 3).join(', ')}`;
    }

    const initialMessage = `Hello, I'm the AI Nurse. I can see you're experiencing ${concernText}${symptomText}. I've reviewed your details. To help the doctor, could you tell me more about how this started?`;



    await supabase.from('ai_chat_messages').insert({
        chat_session_id: newChat.id,
        role: 'assistant',
        content: initialMessage
    });

    return { chatId: newChat.id, isNew: true };
}

export async function getChatHistory(chatId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('chat_session_id', chatId)
        .order('created_at', { ascending: true });

    return data || [];
}

export async function sendAiMessage(chatId: string, userMessage: string) {
    const supabase = await createClient();

    // 1. Save user message
    await supabase.from('ai_chat_messages').insert({
        chat_session_id: chatId,
        role: 'user',
        content: userMessage
    });

    // 2. Fetch context (Chat history + Onboarding Session Data)
    const { data: chatSession } = await supabase
        .from('ai_chat_sessions')
        .select('*, onboarding_sessions(*)')
        .eq('id', chatId)
        .single();

    if (!chatSession) throw new Error('Chat session not found');

    const history = await getChatHistory(chatId);

    // Check message count (limit to ~10 assistant questions)
    const assistantMsgCount = history.filter(m => m.role === 'assistant').length;
    const isComplete = assistantMsgCount >= 10;

    // 3. Generate content with Gemini
    // 3. Generate content with Gemini - Using single-turn generation to avoid role ordering issues
    // Gemini's startChat strict role ordering (User first) conflicts with our Assistant-first greeting.
    // We will construct a complete transcript prompt instead.

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const obData = chatSession.onboarding_sessions;

    // Explicitly parse known data for the prompt
    const concern = obData.primary_concern || 'Unknown';
    const symptoms = JSON.stringify(obData.symptoms || []);
    const historySummary = `
    User has reported:
    - Primary Concern: ${concern}
    - Reported Symptoms: ${symptoms}
    `;

    const instructions = `
        You are an empathetic and professional AI Nurse for Marham Saudi.
        You are conducting a follow-up assessment for a patient who has already completed an initial intake form.
        
        CONTEXT:
        ${historySummary}

        INSTRUCTIONS:
        1. Acknowledge what the user has already told us (see context above) so they don't feel like they are repeating themselves.
        2. Ask 1-2 targeted follow-up questions to dig deeper into their condition (e.g., severity, duration, triggers).
        3. Keep your tone warm, professional, and clear.
        4. Do NOT verify the information they already gave unless it's critical/ambiguous. Assume the context provided is correct and build UPON it.
        5. Do not diagnose.
        6. LANGUAGE: You are bilingual (English/Arabic). Default to English unless the user speaks Arabic. Adopt the user's language.
        
        
        Current State: You have asked ${assistantMsgCount} questions so far. The limit is 10.
        ${isComplete ? "This is the final interaction. Thank the user, summarize the key points briefly, and ask them to proceed to book a consultation." : ""}
    `;

    // Construct the conversation transcript
    let transcript = `${instructions}\n\nExisting Conversation:\n`;

    // Add history (excluding the user message we just saved, we'll append it at the end)
    // NOTE: history includes the message we just saved at step 1? 
    // Wait, getChatHistory fetches *all* messages linked to session.
    // Yes, we just inserted the user message at line 62. So 'history' variable at line 77 contains it.

    history.forEach(m => {
        const speaker = m.role === 'user' ? 'Patient' : 'Nurse';
        transcript += `${speaker}: ${m.content}\n`;
    });

    transcript += `\nNurse:`; // Prompt for completion

    try {
        const result = await model.generateContent(transcript);
        const responseText = result.response.text();

        // 4. Save assistant response
        await supabase.from('ai_chat_messages').insert({
            chat_session_id: chatId,
            role: 'assistant',
            content: responseText
        });

        // 5. Update status if complete
        if (isComplete) {
            await supabase.from('ai_chat_sessions').update({ status: 'completed' }).eq('id', chatId);
        }

        return {
            message: responseText,
            completed: isComplete
        };

    } catch (err: any) {
        console.error('Gemini API Error:', err);
        return {
            message: "I apologize, I am having trouble connecting at the moment. Please try again.",
            completed: false
        };
    }
}
