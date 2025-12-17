// scripts/seed_onboarding.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Must use Service Role for admin tasks

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
    console.log('🚀 Starting Onboarding Data Seed...');

    const files = [
        '../supabase/migrations/20241215_00_exec_sql.sql', // Ensure helper exists (if running via SQL editor first, this is redundant but safe)
        '../supabase/migrations/20241215_01_onboarding_enums_cats.sql',
        '../supabase/migrations/20241215_02_onboarding_concerns.sql',
        '../supabase/migrations/20241215_03_onboarding_details.sql',
        '../supabase/migrations/20241215_fix_sessions_column.sql', // Fix session column type
        '../supabase/seed/04_categories_bodyparts.sql',
        '../supabase/seed/05_medical_concerns.sql',
        '../supabase/seed/06_beauty_concerns.sql',
        '../supabase/seed/07_mental_concerns.sql',
        '../supabase/migrations/20241215_backfill_missing_questions.sql',
        '../supabase/seed/08_priorities.sql'
    ];

    for (const file of files) {
        const filePath = path.join(__dirname, file);
        const fileName = path.basename(file);
        console.log(`📄 Processing ${fileName}...`);

        try {
            const sqlContent = fs.readFileSync(filePath, 'utf8');

            const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });

            if (error) {
                // Fallback: If exec_sql doesn't exist, we can't run the first file via RPC properly if the RPC itself defines it.
                // We catch the error. If it's "function not found", we must warn user.
                if (error.message.includes('function "exec_sql" does not exist') || error.code === 'PGRST202') {
                    if (fileName === '20241215_00_exec_sql.sql') {
                        console.warn(`⚠️  Could not run exec_sql creation via RPC. You likely need to run the content of supabase/migrations/20241215_00_exec_sql.sql manually in the Supabase Dashboard SQL Editor first to enable this script.`);
                        // Continue to try other files? No, they will fail.
                        process.exit(1);
                    }
                }
                console.error(`❌ Error executing ${fileName}:`, error);
                process.exit(1);
            }
            console.log(`✅ ${fileName} executed successfully.`);
        } catch (err) {
            console.error(`❌ Failed to read or execute ${fileName}:`, err);
            process.exit(1);
        }
    }

    console.log('🎉 All onboarding data seeded successfully!');
}

runSeed();
