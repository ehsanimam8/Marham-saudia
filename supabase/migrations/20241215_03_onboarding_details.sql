-- Part 3: Detailed taxonomy, Followups, and Functions
-- File: supabase/migrations/20241215_03_onboarding_details.sql

-- Follow-up questions based on concern
DROP TABLE IF EXISTS followup_questions CASCADE;
CREATE TABLE followup_questions (
  id VARCHAR(100) PRIMARY KEY,
  concern_id VARCHAR(100) REFERENCES primary_concerns(id),
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  question_type VARCHAR(50), -- 'yes_no', 'multiple_choice', 'slider', 'text'
  options JSONB, -- For multiple choice questions
  display_order INTEGER,
  affects_urgency BOOLEAN DEFAULT FALSE,
  affects_doctor_matching BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Educational content mapping
DROP TABLE IF EXISTS educational_content CASCADE;
CREATE TABLE educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concern_id VARCHAR(100) REFERENCES primary_concerns(id),
  content_type VARCHAR(50), -- 'article', 'video', 'infographic'
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Priority Ranking Options
DROP TABLE IF EXISTS priority_options CASCADE;
CREATE TABLE priority_options (
  id VARCHAR(50) PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon VARCHAR(50),
  applies_to_categories TEXT[], -- Which categories this priority is relevant for
  display_order INTEGER
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_primary_concerns_body_part ON primary_concerns(body_part_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_concern ON symptoms(concern_id);
CREATE INDEX IF NOT EXISTS idx_treatments_concern ON treatments(concern_id);
CREATE INDEX IF NOT EXISTS idx_followup_questions_concern ON followup_questions(concern_id);

-- Helper Function
CREATE OR REPLACE FUNCTION get_concern_data(p_concern_id VARCHAR)
RETURNS TABLE (
  concern JSONB,
  symptoms JSONB,
  questions JSONB,
  treatments JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_jsonb(pc.*) as concern,
    COALESCE(json_agg(DISTINCT s.*) FILTER (WHERE s.id IS NOT NULL), '[]'::json)::jsonb as symptoms,
    COALESCE(json_agg(DISTINCT fq.*) FILTER (WHERE fq.id IS NOT NULL), '[]'::json)::jsonb as questions,
    COALESCE(json_agg(DISTINCT t.*) FILTER (WHERE t.id IS NOT NULL), '[]'::json)::jsonb as treatments
  FROM primary_concerns pc
  LEFT JOIN symptoms s ON s.concern_id = pc.id
  LEFT JOIN followup_questions fq ON fq.concern_id = pc.id
  LEFT JOIN treatments t ON t.concern_id = pc.id
  WHERE pc.id = p_concern_id
  GROUP BY pc.id;
END;
$$ LANGUAGE plpgsql;
