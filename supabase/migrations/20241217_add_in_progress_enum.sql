
-- Add 'in_progress' to appointment_status enum
-- We must do this carefully. 
-- Note: ALTER TYPE ... ADD VALUE cannot be run inside a transaction block.
-- Supabase migration runner might try to run in transaction. 
-- However, we will try to run this via the script.

ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'in_progress';
