-- Add missing column to consultation_notes
ALTER TABLE consultation_notes ADD COLUMN IF NOT EXISTS follow_up_date DATE;
