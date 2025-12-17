import axios from 'axios';

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_BASE = 'https://api.daily.co/v1';

const dailyClient = axios.create({
    baseURL: DAILY_API_BASE,
    headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json',
    }
});

// Helper to get API key and ensure it's present
function getDailyApiKey(): string | undefined {
    return DAILY_API_KEY;
}

// Define the response type for Daily room creation/retrieval
interface DailyRoomResponse {
    url: string;
    name: string;
    privacy: string;
}

// Placeholder for getDailyRoom, as it's called but not defined in the diff
// This function would typically fetch details of an existing room
async function getDailyRoom(roomName: string): Promise<DailyRoomResponse> {
    const apiKey = getDailyApiKey();
    if (!apiKey) {
        throw new Error('Configuration Error: Missing Daily API Key');
    }

    const dailyClient = axios.create({
        baseURL: DAILY_API_BASE,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });

    try {
        const response = await dailyClient.get(`/rooms/${roomName}`);
        return {
            url: response.data.url,
            name: response.data.name,
            privacy: response.data.privacy
        };
    } catch (error: any) {
        console.error("❌ [Daily API] Failed to fetch existing room:", error.response?.data || error.message);
        throw new Error(error.response?.data?.info || error.message);
    }
}

/**
 * Create a new Daily.co room
 */
export async function createDailyRoom(appointmentId: string): Promise<DailyRoomResponse> {
    const apiKey = getDailyApiKey();
    if (!apiKey) {
        console.error("❌ [Daily API] Missing DAILY_API_KEY");
        throw new Error('Configuration Error: Missing Daily API Key');
    }

    console.log(`[Daily API] Creating room for appointment: ${appointmentId}`);

    const dailyClient = axios.create({
        baseURL: DAILY_API_BASE,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });

    // Sanitize room name to be safe for URL
    const safeId = appointmentId.replace(/[^a-zA-Z0-9]/g, '');
    const roomName = `marham-${safeId.slice(0, 50)}`;

    try {
        const exp = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
        const response = await dailyClient.post('/rooms', {
            name: roomName,
            privacy: 'private',
            properties: {
                exp: exp,
                enable_chat: true,
                start_video_off: false,
                start_audio_off: false,
                enable_recording: 'cloud',
                lang: 'ar',
            }
        });

        console.log("✅ [Daily API] Room created successfully");
        return {
            url: response.data.url,
            name: response.data.name,
            privacy: response.data.privacy
        };
    } catch (error: any) {
        console.error("❌ [Daily API] Create Room Error:", error.response?.data || error.message);
        // If room already exists, try to fetch it
        if (error.response?.data?.error === 'invalid_request_error' && error.response?.data?.info?.includes('already exists')) {
            console.log("⚠️ [Daily API] Room already exists, fetching details...");
            return await getDailyRoom(roomName);
        }
        throw new Error(error.response?.data?.info || error.message);
    }
}

/**
 * Generate a meeting token for a participant
 */
export async function generateDailyToken(roomName: string, userName: string, isOwner: boolean = false): Promise<{ token: string }> {
    const apiKey = getDailyApiKey();
    if (!apiKey) throw new Error('Configuration Error: Missing Daily API Key');

    const dailyClient = axios.create({
        baseURL: DAILY_API_BASE,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });

    try {
        const response = await dailyClient.post('/meeting-tokens', {
            properties: {
                room_name: roomName,
                user_name: userName,
                is_owner: isOwner,
                exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours
            }
        });

        return { token: response.data.token };
    } catch (error: any) {
        console.error("❌ [Daily API] Generate Token Error:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get recording for a room (session)
 */
export async function getDailyRecordings(roomName: string) {
    // Daily API logic to fetch recordings is usually by Room Name.
    // GET /rooms/:name/recordings is NOT standard endpoint.
    // Standard is GET /recordings?room_name=...
    try {
        const response = await dailyClient.get(`/recordings`, {
            params: {
                room_name: roomName,
                limit: 1, // Get latest
                order: 'created_at:desc' // hypothetical sort
            }
        });

        // Response data is { total_count: N, data: [...] }
        const recordings = response.data.data;
        if (recordings && recordings.length > 0) {
            // Usually need "download_link" or "access_link" depending on privacy.
            // If recording is private, link expires.
            return {
                downloadUrl: recordings[0].download_link,
                duration: recordings[0].duration,
                id: recordings[0].id
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching recordings", error);
        return null;
    }
}

/**
 * Delete a room (End consultation)
 */
export async function deleteDailyRoom(roomName: string) {
    try {
        await dailyClient.delete(`/rooms/${roomName}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting room", error);
        return { success: false };
    }
}
