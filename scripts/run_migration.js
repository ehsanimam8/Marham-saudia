const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('Running migration...');
    try {
        const sql = fs.readFileSync('supabase/migrations/20241215_create_priorities_table.sql', 'utf8');
        const { error } = await supabase.rpc('exec_sql', { sql: sql });

        if (error) {
            console.error('Migration failed:', error);
        } else {
            console.log('Migration successful.');
        }
    } catch (e) {
        console.error('Migration script error:', e);
    }
}

runMigration();
