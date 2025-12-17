
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

const appointmentId = process.argv[2];

if (!appointmentId) {
    console.error('Please provide appointment ID');
    process.exit(1);
}

async function forceStart() {
    console.log(`Forcing appointment ${appointmentId} to in_progress...`);

    const { error } = await supabase
        .from('appointments')
        .update({ status: 'in_progress' })
        .eq('id', appointmentId);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success! Status updated.');
    }
}

forceStart();
