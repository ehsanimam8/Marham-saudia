-- Part 1: Enums and Core Hierarchy
-- File: supabase/migrations/20241215_01_onboarding_enums_cats.sql

-- 1. Create Drop existing types if they exist to avoid conflicts (optional)
-- DROP TYPE IF EXISTS concern_category CASCADE;
-- DROP TYPE IF EXISTS urgency_level CASCADE;
-- DROP TYPE IF EXISTS document_type CASCADE;

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE concern_category AS ENUM (
      'irregular_periods',
      'pcos',
      'fertility',
      'pregnancy',
      'weight_management',
      'digestive_issues',
      'pain',
      'aesthetic_enhancement',
      'mental_health',
      'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM (
      'routine',
      'moderate',
      'urgent',
      'very_urgent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM (
      'lab_result',
      'prescription',
      'imaging',
      'diagnosis',
      'surgical_record',
      'allergy_record',
      'vaccination',
      'insurance',
      'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Core Tables

-- Categories (top level)
DROP TABLE IF EXISTS onboarding_categories CASCADE;
CREATE TABLE onboarding_categories (
  id VARCHAR(50) PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon VARCHAR(50),
  color_scheme VARCHAR(50), -- 'purple', 'pink', 'teal'
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Body parts within each category
DROP TABLE IF EXISTS body_parts CASCADE;
CREATE TABLE body_parts (
  id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) REFERENCES onboarding_categories(id),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  svg_zone_id VARCHAR(50),
  requires_age_check BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
