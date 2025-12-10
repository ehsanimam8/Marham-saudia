
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log("Setting up consultation test (Robust Mode)...");

    // 1. Get Patient (telemed_patient_final@test.com)
    let patientUserId;
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: 'telemed_patient_final@test.com',
        password: 'password123'
    });

    if (signInData.user) {
        console.log("Patient logged in successfully.");
        patientUserId = signInData.user.id;
    } else {
        console.log("Patient login failed, attempting creation...");
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: 'telemed_patient_final@test.com',
            password: 'password123',
            email_confirm: true,
            user_metadata: { role: 'patient', full_name_ar: 'المريضة سارة', full_name_en: 'Sara Patient' }
        });
        if (createError) throw new Error(`Create Patient Error: ${createError.message}`);
        patientUserId = newUser.user.id;
    }
    console.log("Patient User ID:", patientUserId);

    // Get Patient Record
    let { data: patientRecord } = await supabaseAdmin.from('patients').select('id').eq('profile_id', patientUserId).single();
    if (!patientRecord) {
        console.log("Creating patient record...");
        const { data: newRecord, error: pError } = await supabaseAdmin.from('patients').insert({ profile_id: patientUserId }).select().single();
        if (pError) throw pError;
        patientRecord = newRecord;
    }
    if (!patientRecord) throw new Error("Could not initialize patient record");
    console.log("Patient Record ID:", patientRecord.id);


    // 2. Get Doctor (noura@test.com)
    let doctorUserId;
    // Try login or query profiles? Profiles query is better as we don't need to sign in as doctor
    // But we need User ID.
    // We can query `profiles` table first?
    // profiles table has `role='doctor'`.
    // And usually we can guess the profile ID? No.
    // Let's try sign in for doctor too.
    const { data: docSignInData, error: docSignInError } = await supabaseClient.auth.signInWithPassword({
        email: 'noura@test.com',
        password: 'password123'
    });

    if (docSignInData.user) {
        doctorUserId = docSignInData.user.id;
    } else {
        // Fallback: Pick ANY doctor from database using admin
        console.log("Doctor login failed (maybe password mismatch). Picking random doctor from DB...");
        // We can select from 'doctors' table, which has 'profile_id'.
        // But we need to update the appointment with a valid doctor.
        const { data: anyDoctor } = await supabaseAdmin.from('doctors').select('id, profile_id').limit(1).single();
        if (!anyDoctor) throw new Error("No doctors found in DB!");
        doctorUserId = anyDoctor.profile_id;
        // Note: We might not know the password for this doctor to log in later, but for appointment creation it's fine.
        // However, we want to know the email?
        // We'll proceed with this doctor.
    }
    console.log("Doctor User ID:", doctorUserId);


    const { data: doctorRecord, error: dError } = await supabaseAdmin.from('doctors').select('id, consultation_price').eq('profile_id', doctorUserId).single();
    if (dError) throw dError;
    console.log("Doctor Record ID:", doctorRecord.id);


    // 3. Create Appointment (Scheduled Now)
    const now = new Date();

    // Check for existing active appointment
    const { data: existingAppt } = await supabaseAdmin.from('appointments')
        .select('id')
        .eq('doctor_id', doctorRecord.id)
        .eq('patient_id', patientRecord.id)
        .eq('status', 'scheduled')
        .gte('appointment_date', now.toISOString().split('T')[0])
        .limit(1)
        .single();

    let appointmentId;
    if (existingAppt) {
        console.log("Found existing scheduled appointment, using it.");
        appointmentId = existingAppt.id;
    } else {
        const { data: appointment, error: apptError } = await supabaseAdmin.from('appointments').insert({
            doctor_id: doctorRecord.id,
            patient_id: patientRecord.id,
            appointment_date: now.toISOString().split('T')[0],
            start_time: '12:00', // Mock time
            end_time: '12:30',
            consultation_type: 'new',
            status: 'scheduled',
            payment_status: 'paid', // Critical for access
            price: doctorRecord.consultation_price,
            reason_ar: 'Test Video Call'
        }).select().single();

        if (apptError) throw apptError;
        appointmentId = appointment.id;
    }

    console.log("\nSetup Successful!");
    console.log("---------------------------------------------------");
    console.log(`Appointment ID: ${appointmentId}`);
    console.log(`Join Link: http://localhost:3000/consultation/${appointmentId}`);
    console.log(`Patient Email: telemed_patient_final@test.com`);
    console.log(`Patient Password: password123`);
    console.log("---------------------------------------------------");
}

main().catch(console.error);
