
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection(keyType, key) {
    if (!key) return;

    console.log(`\nTesting with ${keyType} key...`);
    const client = createClient(supabaseUrl, key);

    // 1. Check Onboarding Sessions
    try {
        const { error } = await client.from('onboarding_sessions').select('id').limit(1);
        if (error) console.error(`❌ onboarding_sessions Check Failed:`, error.message);
        else console.log(`✅ onboarding_sessions Exists`);
    } catch (e) {
        console.error(`Exception:`, e.message);
    }

    // 2. Check Medical Documents
    try {
        const { error } = await client.from('medical_documents').select('id').limit(1);
        if (error) console.error(`❌ medical_documents Check Failed:`, error.message);
        else console.log(`✅ medical_documents Exists`);
    } catch (e) {
        console.error(`Exception:`, e.message);
    }

    // 3. Nurse Consultations
    try {
        const { error } = await client.from('nurse_consultations').select('id').limit(1);
        if (error) console.error(`❌ nurse_consultations Check Failed:`, error.message);
        else console.log(`✅ nurse_consultations Exists`);
    } catch (e) {
        console.error(`Exception:`, e.message);
    }
}

async function main() {
    console.log('--- START DIAGNOSIS ---');
    await testConnection('ANON', supabaseKey);
    console.log('--- END DIAGNOSIS ---');
}

main();
