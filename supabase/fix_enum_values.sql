-- ==========================================
-- MANUAL FIX PART 3: EXPAND CONCERN ENUM
-- ==========================================
-- Run this in Supabase SQL Editor to fix the Enum violation errors.

ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'pregnancy_related';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'acne';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'aging';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'pigmentation';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'facial_features';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'anxiety';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'depression';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'family_therapy';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'chest_pain';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'breathing_issues';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'breast_lump';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'augmentation';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'hair_loss';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'dandruff';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'transplant';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'neck_pain';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'thyroid';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'infection';
ALTER TYPE concern_category ADD VALUE IF NOT EXISTS 'cycle_issues';

-- Reload schema cache to pick up new enum values
NOTIFY pgrst, 'reload config';

SELECT 'Enum values added successfully' as status;
