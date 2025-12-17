
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- REPRO UPDATE ERROR ---');

    // 1. Create a session
    console.log('Creating session...');
    const { data: session, error: createError } = await supabase
        .from('onboarding_sessions')
        .insert({
            body_part: 'repro_test',
            primary_concern: 'other',
            session_token: `repro_${Date.now()}`
        })
        .select()
        .single();

    if (createError) {
        console.error('❌ Create Failed:', createError);
        return;
    }
    console.log('✅ Created Session ID:', session.id);

    // 2. Try Update (mimicking updateOnboardingSession)
    const sessionId = session.id;
    const updates = {
        primaryConcern: 'pcos', // Test valid enum
        urgency: 'moderate',    // Test valid enum
        priorities: {
            experience: 1,
            price: 5,
            speed: 3,
            hospital: 2,
            location: 4
        }
    };

    const dbUpdates = {
        updated_at: new Date().toISOString()
    };

    // mimic mapping logic
    dbUpdates.primary_concern = updates.primaryConcern;
    dbUpdates.urgency = updates.urgency;
    dbUpdates.priority_experience = updates.priorities.experience;
    dbUpdates.priority_price = updates.priorities.price;
    dbUpdates.priority_speed = updates.priorities.speed;
    dbUpdates.priority_hospital = updates.priorities.hospital;
    dbUpdates.priority_location = updates.priorities.location;

    console.log('Attempting Update with:', dbUpdates);

    const { error: updateError } = await supabase
        .from('onboarding_sessions')
        .update(dbUpdates)
        .eq('id', sessionId);

    if (updateError) {
        console.error('❌ Update Failed:', JSON.stringify(updateError, null, 2));
    } else {
        console.log('✅ Update Success!');
    }

    // 3. Cleanup
    await supabase.from('onboarding_sessions').delete().eq('id', session.id);
}

main();
