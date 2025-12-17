-- Part 2: Concerns and Symptoms
-- File: supabase/migrations/20241215_02_onboarding_concerns.sql

-- Primary concerns for each body part
DROP TABLE IF EXISTS primary_concerns CASCADE;
CREATE TABLE primary_concerns (
  id VARCHAR(100) PRIMARY KEY,
  body_part_id VARCHAR(50) REFERENCES body_parts(id),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon VARCHAR(50),
  prevalence VARCHAR(50), -- 'very_common', 'common', 'uncommon'
  urgency_default VARCHAR(20), -- 'routine', 'moderate', 'urgent'
  estimated_questions INTEGER DEFAULT 5,
  requires_age_context BOOLEAN DEFAULT FALSE,
  common_age_ranges TEXT[], -- ['18-24', '25-34', '35-44', '45+']
  specialty_primary VARCHAR(100),
  specialty_secondary VARCHAR(100),
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Symptoms associated with each concern
DROP TABLE IF EXISTS symptoms CASCADE;
CREATE TABLE symptoms (
  id VARCHAR(100) PRIMARY KEY,
  concern_id VARCHAR(100) REFERENCES primary_concerns(id),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon VARCHAR(50),
  severity_indicator VARCHAR(20), -- 'mild', 'moderate', 'severe'
  is_red_flag BOOLEAN DEFAULT FALSE, -- Requires immediate attention
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatments table
DROP TABLE IF EXISTS treatments CASCADE;
CREATE TABLE treatments (
  id VARCHAR(100) PRIMARY KEY,
  concern_id VARCHAR(100) REFERENCES primary_concerns(id),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  type VARCHAR(50), -- 'medical', 'surgical', 'cosmetic', 'therapy'
  average_cost_sar DECIMAL(10,2),
  duration_weeks INTEGER,
  success_rate_percent INTEGER,
  requires_consultation BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
