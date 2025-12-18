const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sessionId = 'f9880a59-ae56-4025-a7e3-e8468c0a0ca0';

async function check() {
    // 1. Get Session Concern
    const { data: session, error: sErr } = await supabase
        .from('onboarding_sessions')
        .select('primary_concern')
        .eq('id', sessionId)
        .single();

    if (sErr) {
        console.error('Session error:', sErr);
        return;
    }

    if (!session) {
        console.error('Session not found');
        return;
    }

    console.log('Session Primary Concern ID:', session.primary_concern);

    if (!session.primary_concern) {
        console.error('No primary concern set for this session!');
        return;
    }

    // 2. Check Questions for that concern
    const { data: questions, error: qErr } = await supabase
        .from('followup_questions')
        .select('*')
        .eq('concern_id', session.primary_concern);

    if (qErr) console.error('Questions error:', qErr);
    else {
        console.log(`Found ${questions.length} questions for concern ${session.primary_concern}`);
        console.log(questions);
    }
}

check();
