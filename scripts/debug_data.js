
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
    console.log("Inspecting all patient_records...");
    const { data: recs, error } = await supabase.from('patient_records').select('*').limit(5);
    if (error) console.error(error);
    else console.log("Patient Records Sample:", JSON.stringify(recs, null, 2));

    console.log("Inspecting all medical_documents...");
    const { data: docs, error: dErr } = await supabase.from('medical_documents').select('*').limit(5);
    if (dErr) console.error(dErr);
    else console.log("Medical Documents Sample:", JSON.stringify(docs, null, 2));

    console.log("Inspecting users/patients...");
    const { data: pats } = await supabase.from('patients').select('id, profile_id').limit(5);
    console.log("Patients Sample:", JSON.stringify(pats, null, 2));
}

inspect();
