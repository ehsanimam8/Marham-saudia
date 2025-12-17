-- File: supabase/migrations/20241215_backfill_missing_questions.sql
-- Purpose: Backfill missing followup questions for concerns that were left out in initial seeding to prevent "No questions" error.

-- MEDICAL CHEST
INSERT INTO followup_questions (id, concern_id, question_ar, question_en, question_type, options, display_order, affects_urgency, affects_doctor_matching) VALUES
('fq_nipple_discharge_1', 'medical_chest_nipple_discharge', 'ما هو لون الإفرازات؟', 'What is the color of the discharge?', 'multiple_choice', '{"options": [{"value": "clear", "label_ar": "شفاف", "label_en": "Clear"}, {"value": "white", "label_ar": "أبيض (حليبي)", "label_en": "White (Milky)"}, {"value": "bloody", "label_ar": "دموي", "label_en": "Bloody"}, {"value": "green_yellow", "label_ar": "أخضر أو أصفر", "label_en": "Green or Yellow"}]}', 1, TRUE, TRUE),

('fq_cardiac_1', 'medical_chest_cardiac', 'هل ينتشر الألم إلى ذراعك أو فكك؟', 'Does the pain radiate to your arm or jaw?', 'yes_no', NULL, 1, TRUE, TRUE),
('fq_cardiac_2', 'medical_chest_cardiac', 'هل تشعرين بضيق في التنفس مع الألم؟', 'Do you feel shortness of breath with the pain?', 'yes_no', NULL, 2, TRUE, TRUE),

('fq_breathing_1', 'medical_chest_breathing', 'متى تحدث صعوبة التنفس؟', 'When does the difficulty occur?', 'multiple_choice', '{"options": [{"value": "always", "label_ar": "دائماً", "label_en": "Always"}, {"value": "exertion", "label_ar": "مع الجهد", "label_en": "With exertion"}, {"value": "lying_down", "label_ar": "عند الاستلقاء", "label_en": "When lying down"}, {"value": "night", "label_ar": "في الليل", "label_en": "At night"}]}', 1, TRUE, TRUE),

('fq_cough_1', 'medical_chest_cough', 'ما نوع السعال؟', 'What type of cough is it?', 'multiple_choice', '{"options": [{"value": "dry", "label_ar": "جاف", "label_en": "Dry"}, {"value": "wet", "label_ar": "رطب (مع بلغم)", "label_en": "Wet (with phlegm)"}]}', 1, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- MEDICAL ABDOMEN
INSERT INTO followup_questions (id, concern_id, question_ar, question_en, question_type, options, display_order, affects_urgency, affects_doctor_matching) VALUES
('fq_irregular_periods_1', 'medical_abdomen_irregular_periods', 'كم تتراوح مدة دورتك عادة؟', 'How long is your cycle usually?', 'multiple_choice', '{"options": [{"value": "less_21", "label_ar": "أقل من 21 يوم", "label_en": "Less than 21 days"}, {"value": "21_35", "label_ar": "21-35 يوم", "label_en": "21-35 days"}, {"value": "more_35", "label_ar": "أكثر من 35 يوم", "label_en": "More than 35 days"}, {"value": "variable", "label_ar": "متغيرة جداً", "label_en": "Very variable"}]}', 1, FALSE, TRUE),

('fq_period_pain_1', 'medical_abdomen_period_pain', 'هل تحتاجين لأخذ مسكنات للألم؟', 'Do you require medication for the pain?', 'yes_no', NULL, 1, FALSE, FALSE),
('fq_period_pain_2', 'medical_abdomen_period_pain', 'هل يؤثر الألم على دوامك أو دراستك؟', 'Does the pain affect your work or studies?', 'yes_no', NULL, 2, TRUE, TRUE),

('fq_endometriosis_1', 'medical_abdomen_endometriosis', 'هل تم تشخيصك بالانتباذ البطاني الرحمي من قبل؟', 'Have you been diagnosed with endometriosis before?', 'yes_no', NULL, 1, FALSE, TRUE),

('fq_fertility_1', 'medical_abdomen_fertility', 'منذ متى تحاولين الحمل؟', 'How long have you been trying to conceive?', 'multiple_choice', '{"options": [{"value": "less_6_months", "label_ar": "أقل من 6 أشهر", "label_en": "Less than 6 months"}, {"value": "6_12_months", "label_ar": "6-12 شهر", "label_en": "6-12 months"}, {"value": "more_1_year", "label_ar": "أكثر من سنة", "label_en": "More than 1 year"}]}', 1, FALSE, TRUE),

('fq_pregnancy_1', 'medical_abdomen_pregnancy', 'هل قمت بإجراء اختبار حمل؟', 'Have you taken a pregnancy test?', 'yes_no', NULL, 1, TRUE, FALSE),

('fq_ibs_1', 'medical_abdomen_ibs', 'ما هي الأعراض الرئيسية؟', 'What are your main symptoms?', 'multiple_choice', '{"options": [{"value": "pain", "label_ar": "ألم بطن", "label_en": "Abdominal pain"}, {"value": "bloating", "label_ar": "انتفاخ", "label_en": "Bloating"}, {"value": "diarrhea", "label_ar": "إسهال", "label_en": "Diarrhea"}, {"value": "constipation", "label_ar": "إمساك", "label_en": "Constipation"}, {"value": "mixed", "label_ar": "مختلط", "label_en": "Mixed"}]}', 1, FALSE, TRUE),

('fq_bloating_1', 'medical_abdomen_bloating', 'هل الانتفاخ مستمر أم يأتي ويذهب؟', 'Is the bloating constant or does it come and go?', 'multiple_choice', '{"options": [{"value": "constant", "label_ar": "مستمر", "label_en": "Constant"}, {"value": "intermittent", "label_ar": "متقطع", "label_en": "Intermittent"}, {"value": "after_meals", "label_ar": "بعد الوجبات", "label_en": "After meals"}]}', 1, FALSE, TRUE),

('fq_weight_gain_1', 'medical_abdomen_weight_gain', 'كم كيلو زاد وزنك؟', 'How much weight have you gained?', 'multiple_choice', '{"options": [{"value": "less_5", "label_ar": "أقل من 5 كجم", "label_en": "Less than 5 kg"}, {"value": "5_10", "label_ar": "5-10 كجم", "label_en": "5-10 kg"}, {"value": "more_10", "label_ar": "أكثر من 10 كجم", "label_en": "More than 10 kg"}]}', 1, FALSE, TRUE),

('fq_pelvic_pain_1', 'medical_abdomen_pelvic_pain', 'كيف تصفين الألم؟', 'How would you describe the pain?', 'multiple_choice', '{"options": [{"value": "sharp", "label_ar": "حاد", "label_en": "Sharp"}, {"value": "dull", "label_ar": "خفيف/مستمر", "label_en": "Dull/Ache"}, {"value": "cramping", "label_ar": "تقلصات", "label_en": "Cramping"}]}', 1, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- BEAUTY FACE
INSERT INTO followup_questions (id, concern_id, question_ar, question_en, question_type, options, display_order, affects_urgency, affects_doctor_matching) VALUES
('fq_acne_1', 'beauty_face_acne', 'ما نوع حب الشباب الذي تعانين منه؟', 'What type of acne do you have?', 'multiple_choice', '{"options": [{"value": "whiteheads", "label_ar": "رؤوس بيضاء", "label_en": "Whiteheads"}, {"value": "blackheads", "label_ar": "رؤوس سوداء", "label_en": "Blackheads"}, {"value": "cystic", "label_ar": "حبوب عميقة (أكياس)", "label_en": "Cystic"}, {"value": "scars", "label_ar": "آثار فقط", "label_en": "Scars only"}]}', 1, FALSE, TRUE),

('fq_pigmentation_1', 'beauty_face_pigmentation', 'أين تقع التصبغات؟', 'Where is the pigmentation located?', 'multiple_choice', '{"options": [{"value": "cheeks", "label_ar": "الخدين", "label_en": "Cheeks"}, {"value": "forehead", "label_ar": "الجبين", "label_en": "Forehead"}, {"value": "upper_lip", "label_ar": "فوق الشفة", "label_en": "Upper lip"}, {"value": "all_over", "label_ar": "كامل الوجه", "label_en": "All over"}]}', 1, FALSE, FALSE),

('fq_contouring_1', 'beauty_face_contouring', 'ما هي المنطقة التي تودين تحديدها؟', 'Which area do you want to contour?', 'multiple_choice', '{"options": [{"value": "cheeks", "label_ar": "الخدين", "label_en": "Cheeks"}, {"value": "jawline", "label_ar": "الفك", "label_en": "Jawline"}, {"value": "chin", "label_ar": "الذقن", "label_en": "Chin"}]}', 1, FALSE, TRUE),

('fq_lips_1', 'beauty_face_lips', 'ما هو هدفك الرئيسي؟', 'What is your main goal?', 'multiple_choice', '{"options": [{"value": "volume", "label_ar": "زيادة الحجم", "label_en": "Volume"}, {"value": "shape", "label_ar": "تحديد الشكل", "label_en": "Definition/Shape"}, {"value": "hydration", "label_ar": "ترطيب/نضارة", "label_en": "Hydration"}]}', 1, FALSE, TRUE),

('fq_nose_1', 'beauty_face_nose', 'ما الذي يزعجك في أنفك؟', 'What aspect of your nose bothers you?', 'multiple_choice', '{"options": [{"value": "hump", "label_ar": "بروز العظم (الحدبة)", "label_en": "Hump"}, {"value": "tip", "label_ar": "مقدمة الأنف", "label_en": "Tip"}, {"value": "width", "label_ar": "عرض الأنف", "label_en": "Width"}, {"value": "breathing", "label_ar": "مشاكل تنفس", "label_en": "Breathing issues"}]}', 1, FALSE, TRUE),

('fq_texture_1', 'beauty_face_texture', 'ما هو نوع بشرتك؟', 'What is your skin type?', 'multiple_choice', '{"options": [{"value": "dry", "label_ar": "جافة", "label_en": "Dry"}, {"value": "oily", "label_ar": "دهنية", "label_en": "Oily"}, {"value": "combination", "label_ar": "مختلطة", "label_en": "Combination"}, {"value": "sensitive", "label_ar": "حساسة", "label_en": "Sensitive"}]}', 1, FALSE, TRUE),

('fq_under_eye_1', 'beauty_face_under_eye', 'هل تعانين من انتفاخ أم هالات سوداء؟', 'Do you have puffiness or dark circles?', 'multiple_choice', '{"options": [{"value": "circles", "label_ar": "هالات سوداء", "label_en": "Dark circles"}, {"value": "puffiness", "label_ar": "انتفاخ", "label_en": "Puffiness"}, {"value": "hollows", "label_ar": "تجويف", "label_en": "Hollows"}, {"value": "wrinkles", "label_ar": "تجاعيد", "label_en": "Wrinkles"}]}', 1, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- BEAUTY ABDOMEN
INSERT INTO followup_questions (id, concern_id, question_ar, question_en, question_type, options, display_order, affects_urgency, affects_doctor_matching) VALUES
('fq_coolsculpting_1', 'beauty_abdomen_coolsculpting', 'ما هي المنطقة المستهدفة؟', 'Which area are you targeting?', 'multiple_choice', '{"options": [{"value": "abdomen", "label_ar": "البطن", "label_en": "Abdomen"}, {"value": "flanks", "label_ar": "الخصر", "label_en": "Flanks"}, {"value": "thighs", "label_ar": "الفخذين", "label_en": "Thighs"}]}', 1, FALSE, TRUE),

('fq_csection_scar_1', 'beauty_abdomen_csection_scar', 'كم هو عمر الندبة؟', 'How old is the scar?', 'multiple_choice', '{"options": [{"value": "less_1_year", "label_ar": "أقل من سنة", "label_en": "Less than 1 year"}, {"value": "1_5_years", "label_ar": "1-5 سنوات", "label_en": "1-5 years"}, {"value": "more_5_years", "label_ar": "أكثر من 5 سنوات", "label_en": "More than 5 years"}]}', 1, FALSE, FALSE),

('fq_waist_sculpting_1', 'beauty_abdomen_waist_sculpting', 'هل جربت التمارين الرياضية لهذه المنطقة؟', 'Have you tried targeting this area with exercise?', 'yes_no', NULL, 1, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- MENTAL BRAIN
INSERT INTO followup_questions (id, concern_id, question_ar, question_en, question_type, options, display_order, affects_urgency, affects_doctor_matching) VALUES
('fq_insomnia_1', 'mental_brain_insomnia', 'هل المشكلة في بداية النوم أم تقطعه؟', 'Is the trouble falling asleep or staying asleep?', 'multiple_choice', '{"options": [{"value": "falling", "label_ar": "صعوبة البدء بالنوم", "label_en": "Falling asleep"}, {"value": "staying", "label_ar": "الاستيقاظ المتكرر", "label_en": "Staying asleep"}, {"value": "early", "label_ar": "الاستيقاظ مبكراً جداً", "label_en": "Waking too early"}]}', 1, FALSE, TRUE),

('fq_postpartum_1', 'mental_brain_postpartum', 'ما هو عمر طفلك الآن؟', 'How old is your baby?', 'multiple_choice', '{"options": [{"value": "0_3_months", "label_ar": "0-3 أشهر", "label_en": "0-3 months"}, {"value": "3_6_months", "label_ar": "3-6 أشهر", "label_en": "3-6 months"}, {"value": "6_12_months", "label_ar": "6-12 شهر", "label_en": "6-12 months"}, {"value": "over_1_year", "label_ar": "أكثر من سنة", "label_en": "Over 1 year"}]}', 1, TRUE, TRUE),

('fq_trauma_1', 'mental_brain_trauma', 'هل الحدث الصادم حدث حديثاً؟', 'Did the traumatic event happen recently?', 'yes_no', NULL, 1, TRUE, TRUE),

('fq_ocd_1', 'mental_brain_ocd', 'هل تؤثر الأفكار على مهامك اليومية؟', 'Do thoughts interfere with daily tasks?', 'multiple_choice', '{"options": [{"value": "mildly", "label_ar": "بشكل بسيط", "label_en": "Mildly"}, {"value": "moderately", "label_ar": "بشكل متوسط", "label_en": "Moderately"}, {"value": "severely", "label_ar": "بشكل شديد", "label_en": "Severely"}]}', 1, TRUE, TRUE),

('fq_panic_1', 'mental_brain_panic', 'كم مرة تحدث نوبات الهلع؟', 'How often do panic attacks occur?', 'multiple_choice', '{"options": [{"value": "daily", "label_ar": "يومياً", "label_en": "Daily"}, {"value": "weekly", "label_ar": "أسبوعياً", "label_en": "Weekly"}, {"value": "monthly", "label_ar": "شهرياً", "label_en": "Monthly"}, {"value": "rarely", "label_ar": "نادراً", "label_en": "Rarely"}]}', 1, TRUE, TRUE),

('fq_adhd_1', 'mental_brain_adhd', 'هل تم تشخيصك بفرط الحركة في الطفولة؟', 'Were you diagnosed with ADHD in childhood?', 'yes_no', NULL, 1, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;
