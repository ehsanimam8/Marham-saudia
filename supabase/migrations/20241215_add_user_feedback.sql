-- File: supabase/migrations/20241215_add_user_feedback.sql
ALTER TABLE onboarding_sessions ADD COLUMN IF NOT EXISTS user_feedback TEXT;
