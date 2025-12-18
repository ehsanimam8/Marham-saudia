-- Add icon column to body_parts table
ALTER TABLE body_parts ADD COLUMN IF NOT EXISTS icon TEXT;

-- Update existing body parts with default icons (using Lucide names as placeholders for now, standardizing)
-- Face -> Smile (or user can change to URL later)
UPDATE body_parts SET icon = 'Smile' WHERE name_en ILIKE '%face%';
UPDATE body_parts SET icon = 'Brain' WHERE name_en ILIKE '%brain%' OR name_en ILIKE '%mind%';
UPDATE body_parts SET icon = 'Heart' WHERE name_en ILIKE '%chest%' OR name_en ILIKE '%heart%';
UPDATE body_parts SET icon = 'Stethoscope' WHERE name_en ILIKE '%abdomen%' OR name_en ILIKE '%stomach%';
UPDATE body_parts SET icon = 'Baby' WHERE name_en ILIKE '%reproductive%' OR name_en ILIKE '%fertility%';
UPDATE body_parts SET icon = 'Sparkles' WHERE icon IS NULL; -- Fallback

-- Also ensure onboarding_categories has icon column (it does based on schema, but double check updates)
-- Update categories if needed
UPDATE onboarding_categories SET icon = 'Sparkles' WHERE icon IS NULL;
