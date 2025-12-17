
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS daily_room_url TEXT,
ADD COLUMN IF NOT EXISTS daily_room_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS daily_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS consultation_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS consultation_ended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS consultation_duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS recording_url TEXT,
ADD COLUMN IF NOT EXISTS transcription_text TEXT,
ADD COLUMN IF NOT EXISTS pre_consultation_completed BOOLEAN DEFAULT FALSE;

