-- File: supabase/migrations/20241215_add_priority_approach.sql
ALTER TABLE onboarding_sessions ADD COLUMN IF NOT EXISTS priority_approach INTEGER CHECK (priority_approach BETWEEN 1 AND 5);
