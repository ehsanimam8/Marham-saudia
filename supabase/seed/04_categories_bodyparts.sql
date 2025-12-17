-- File: supabase/seed/04_categories_bodyparts.sql

-- Insert Categories
INSERT INTO onboarding_categories (id, name_ar, name_en, description_ar, description_en, icon, color_scheme, display_order) VALUES
('medical', 'طبي وصحي', 'Medical & Wellness', 'مشاكل صحية عامة وألم وفحوصات', 'General health concerns, pain, and checkups', 'Activity', 'teal', 1),
('beauty', 'جمال وتجميل', 'Beauty & Aesthetics', 'العناية بالبشرة والشعر والتجميل', 'Skin care, hair, and cosmetic treatments', 'Sparkles', 'pink', 2),
('mental', 'صحة نفسية', 'Mental Health', 'علاج نفسي وإدارة التوتر', 'Therapy, stress management, and support', 'Brain', 'purple', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert Body Parts
INSERT INTO body_parts (id, category_id, name_ar, name_en, description_ar, description_en, requires_age_check, display_order) VALUES
('medical_chest', 'medical', 'الصدر', 'Chest', 'ألم الثدي، كتل، مشاكل تنفسية', 'Breast pain, lumps, breathing issues', TRUE, 1),
('medical_abdomen', 'medical', 'البطن', 'Abdomen', 'مشاكل هضمية، تكيس مبايض، ألم', 'Digestive issues, PCOS, pain', TRUE, 2),
('beauty_face', 'beauty', 'الوجه', 'Face', 'تجاعيد، حب الشباب، نضارة', 'Wrinkles, acne, glow', FALSE, 1),
('beauty_abdomen', 'beauty', 'البطن', 'Abdomen', 'شد البطن، شفط الدهون', 'Tummy tuck, liposuction', TRUE, 2),
('mental_brain', 'mental', 'العقل', 'Brain/Mind', 'قلق، اكتئاب، أرق', 'Anxiety, depression, insomnia', FALSE, 1)
ON CONFLICT (id) DO NOTHING;
