const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🚀 Running AI Chat Migration...');

    const file = '../supabase/migrations/20251218_ai_chat.sql';
    const filePath = path.join(__dirname, file);

    try {
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });

        if (error) {
            console.error(`❌ Error executing migration:`, error);
            process.exit(1);
        }
        console.log(`✅ Migration executed successfully.`);
    } catch (err) {
        console.error(`❌ Failed to read or execute file:`, err);
        process.exit(1);
    }
}

runMigration();
