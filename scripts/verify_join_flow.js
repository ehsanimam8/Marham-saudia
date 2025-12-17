
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 1. Setup Env and Config
const envPath = path.resolve(__dirname, '../.env.local');
let envVars = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) envVars[key.trim()] = value.trim();
    });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;
const DAILY_API_KEY = process.env.DAILY_API_KEY || envVars.DAILY_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !DAILY_API_KEY) {
    console.error("Missing Config:", { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_KEY: !!SUPABASE_KEY, DAILY_API_KEY: !!DAILY_API_KEY });
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const daily = axios.create({
    baseURL: 'https://api.daily.co/v1',
    headers: { 'Authorization': `Bearer ${DAILY_API_KEY}` }
});

const APPOINTMENT_ID = '17853c4b-be42-4ba4-925f-ece8270d4cbb';

async function runTest() {
    console.log(`Checking Appointment: ${APPOINTMENT_ID}`);

    // 1. Fetch from DB
    const { data: appointment, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', APPOINTMENT_ID)
        .single();

    if (error) {
        console.error("DB Fetch Error:", error);
        return;
    }

    console.log("Found Appointment:", {
        id: appointment.id,
        room_name: appointment.daily_room_name,
        room_url: appointment.daily_room_url
    });

    let roomName = appointment.daily_room_name;
    let roomUrl = appointment.daily_room_url;

    // 2. Create Room if missing
    if (!roomName || !roomUrl) {
        console.log("Room missing. Attempting creation...");
        const safeId = APPOINTMENT_ID.replace(/[^a-zA-Z0-9]/g, '');
        const targetName = `marham-${safeId.slice(0, 50)}`;

        try {
            // Check if exists first (simulating our safe logic)
            // But let's just try create and catch 400
            console.log(`Creating room: ${targetName}`);
            const res = await daily.post('/rooms', {
                name: targetName,
                privacy: 'private',
                properties: { exp: Math.floor(Date.now() / 1000) + 7200 }
            });
            console.log("Room Created:", res.data.url);
            roomName = res.data.name;
            roomUrl = res.data.url;
        } catch (e) {
            console.log("Creation failed (likely exists):", e.response?.data?.info || e.message);
            // Fetch it
            try {
                console.log(`Fetching existing room: ${targetName}`);
                const getRes = await daily.get(`/rooms/${targetName}`);
                console.log("Room Fetched:", getRes.data.url);
                roomName = getRes.data.name;
                roomUrl = getRes.data.url;
            } catch (fetchErr) {
                console.error("Failed to fetch existing room:", fetchErr.message);
                return;
            }
        }

        // Update DB
        if (roomName && roomUrl) {
            console.log("Updating DB...");
            const { error: updateErr } = await supabase
                .from('appointments')
                .update({ daily_room_url: roomUrl, daily_room_name: roomName })
                .eq('id', APPOINTMENT_ID);

            if (updateErr) console.error("DB Update Failed:", updateErr);
            else console.log("DB Updated Successfully.");
        }
    }

    // 3. Generate Token (Join simulation)
    if (roomName) {
        console.log(`Generating Token for room: ${roomName}`);
        try {
            const tokenRes = await daily.post('/meeting-tokens', {
                properties: {
                    room_name: roomName,
                    user_name: 'Test Doctor',
                    is_owner: true,
                    exp: Math.floor(Date.now() / 1000) + 3600
                }
            });
            console.log("Token Generated Successfully:", tokenRes.data.token.slice(0, 20) + "...");
        } catch (e) {
            console.error("Token Generation Failed:", e.response?.data || e.message);
        }
    }

    console.log("Test Complete.");
}

runTest();
