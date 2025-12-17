-- File: supabase/seed/08_priorities.sql

INSERT INTO priority_options (id, name_ar, name_en, description_ar, description_en, icon, applies_to_categories) VALUES
('priority_experience', 'خبرة الطبيبة', 'Doctor Experience', 'طبيبة ذات خبرة طويلة وسمعة ممتازة', 'Highly experienced doctor with excellent reputation', '⭐', ARRAY['medical', 'beauty', 'mental']),
('priority_price', 'السعر المناسب', 'Affordable Price', 'السعر الأقل والأنسب لميزانيتي', 'Lower price that fits my budget', '💰', ARRAY['medical', 'beauty', 'mental']),
('priority_speed', 'الحصول على موعد سريع', 'Quick Appointment', 'أريد موعد في أقرب وقت ممكن', 'Want appointment as soon as possible', '⚡', ARRAY['medical', 'beauty', 'mental']),
('priority_hospital', 'المستشفى المعروف', 'Reputable Hospital', 'طبيبة في مستشفى معروف وموثوق', 'Doctor in well-known and trusted hospital', '🏥', ARRAY['medical', 'beauty']),
('priority_approach', 'أسلوب العلاج', 'Treatment Approach', 'أسلوب علاج معين (محافظ/حديث/طبيعي)', 'Specific treatment approach (conservative/modern/natural)', '🎯', ARRAY['medical', 'beauty', 'mental'])
ON CONFLICT (id) DO NOTHING;
