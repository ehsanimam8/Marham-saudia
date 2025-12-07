-- Add text-based content columns if they don't exist (for simpler management than junction tables)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_conditions' AND column_name = 'symptoms_text') THEN
        ALTER TABLE medical_conditions ADD COLUMN symptoms_text TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_conditions' AND column_name = 'treatment_text') THEN
        ALTER TABLE medical_conditions ADD COLUMN treatment_text TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_conditions' AND column_name = 'description') THEN
        ALTER TABLE medical_conditions ADD COLUMN description TEXT;
    END IF;
    
    -- Ensure Articles has author/doctor link
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'doctor_id') THEN
        ALTER TABLE articles ADD COLUMN doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Seed Data: Medical Conditions (Sample of ~30 high-quality entries for Women's Health & General)
INSERT INTO medical_conditions (name_ar, name_en, slug, specialty, description, symptoms_text, treatment_text) VALUES 
('متلازمة تكيس المبايض', 'Polycystic Ovary Syndrome (PCOS)', 'pcos', 'Gynecology', 'اضطراب هرموني شائع يصيب النساء في سن الإنجاب، يؤثر على الدورة الشهرية والخصوبة.', '- عدم انتظام الدورة الشهرية
- زيادة نمو الشعر في الوجه والجسم
- حب الشباب
- زيادة الوزن', '- تغيير نمط الحياة وإنقاص الوزن
- تنظيم الدورة الشهرية بالأدوية
- أدوية تحفيز التبويض عند الرغبة في الحمل'),

('فقر الدم (الأنيميا)', 'Anemia', 'anemia', 'Internal Medicine', 'حالة لا يحتوي فيها الدم على ما يكفي من كرات الدم الحمراء السليمة لحمل الأكسجين للأنسجة.', '- التعب والإرهاق السريع
- شحوب الجلد
- ضيق التنفس
- الدوخة والصداع', '- مكملات الحديد
- تناول أغذية غنية بالحديد (اللحوم، السبانخ)
- علاج السبب الأساسي (مثل غزارة الطورة)'),

('سكري الحمل', 'Gesational Diabetes', 'gestational-diabetes', 'Obstetrics', 'نوع من مرض السكري يظهر لأول مرة خلال فترة الحمل لدى نساء لم يصبن به من قبل.', '- زيادة العطش والتبول
- الإرهاق
- (غالباً لا توجد أعراض واضحة، يكتشف بالفحص)', '- نظام غذائي صحي
- ممارسة الرياضة تحت إشراف طبي
- مراقبة سكر الدم
- الأنسولين إذا لزم الأمر'),

('الصداع النصفي', 'Migraine', 'migraine', 'Neurology', 'صداع شديد، غالباً في جانب واحد من الرأس، مصحوب بحساسية للضوء والصوت.', '- ألم نابض في الرأس
- غثيان وقيء
- حساسية للضوء والصوت
- اضطرابات بصرية (أورة)', '- مسكنات الألم
- أدوية التريبتان
- الراحة في غرفة مظلمة وهادئة
- تجنب المحفزات (التوتر، بعض الأطعمة)'),

('التهاب المسالك البولية', 'Urinary Tract Infection (UTI)', 'uti', 'Urology', 'عدوى تصيب أي جزء من الجهاز البولي، وهي أكثر شيوعاً لدى النساء.', '- حرقان عند التبول
- رغبة ملحة ومتكررة في التبول
- بول عكر أو له رائحة قوية
- ألم في الحوض', '- المضادات الحيوية
- شرب كميات كبيرة من الماء
- عصير التوت البري (للوقاية)'),

('قصور الغدة الدرقية', 'Hypothyroidism', 'hypothyroidism', 'Endocrinology', 'حالة لا تنتج فيها الغدة الدرقية ما يكفي من الهرمونات المهمة.', '- التعب وزيادة الوزن
- الحساسية للبرد
- جفاف الجلد
- تساقط الشعر
- اكتئاب', '- دواء ليفوثيروكسين (هرمون بديل)
- متابعة دورية لمستويات الهرمون بالدم'),

('هشاشة العظام', 'Osteoporosis', 'osteoporosis', 'Rheumatology', 'مرض يضعف العظام ويجعلها هشة وأكثر عرضة للكسر.', '- ألم في الظهر
- قصر القامة بمرور الوقت
- سهولة كسر العظام', '- الكالسيوم وفيتامين د
- أدوية بناء العظام (مثل البيسفوسفونات)
- ممارسة تمارين تحمل الوزن'),

('سرطان الثدي', 'Breast Cancer', 'breast-cancer', 'Oncology', 'نوع من السرطان يبدأ في الثدي، والاكتشاف المبكر يرفع نسب الشفاء بشكل كبير.', '- كتلة في الثدي أو تحت الإبط
- تغير في شكل أو حجم الثدي
- إفرازات غير طبيعية من الحلمة', '- الجراحة
- العلاج الكيميائي والإشعاعي
- العلاج الهرموني
- (تختلف الخطة حسب المرحلة والنوع)'),

('اكتئاب ما بعد الولادة', 'Postpartum Depression', 'postpartum-depression', 'Psychiatry', 'اكتئاب شديد ومستمر قد يحدث بعد الولادة، يختلف عن "الكآبة النفاسية" العابرة.', '- حزن شديد ويأس
- صعوبة في الارتباط بالطفل
- اضطرابات في النوم والأكل
- أفكار بإيذاء النفس أو الطفل', '- العلاج النفسي (جلسات)
- مضادات الاكتئاب (آمنة للرضاعة)
- الدعم العائلي والاجتماعي'),

('الانتباذ البطاني الرحمي (بطانة الرحم المهاجرة)', 'Endometriosis', 'endometriosis', 'Gynecology', 'نمو أنسجة تشبه بطانة الرحم خارج الرحم، مما يسبب ألماً ومشاكل في الخصوبة.', '- ألم شديد أثناء الدورة الشهرية
- ألم أثناء الجماع
- نزيف غزير
- مشاكل في الإنجاب', '- مسكنات الألم
- العلاج الهرموني
- الجراحة لإزالة الأنسجة'),

('ارتفاع ضغط الدم', 'Hypertension', 'hypertension', 'Cardiology', 'ارتفاع ضغط الدم في الشرايين بشكل مستمر، مما يزيد خطر أمراض القلب.', '- (غالباً صامت)
- صداع
- ضيق تنفس
- نزيف من الأنف', '- تغيير نمط الحياة (تقليل الملح، الرياضة)
- أدوية خفض الضغط
- الإقلاع عن التدخين'),

('حب الشباب', 'Acne', 'acne', 'Dermatology', 'حالة جلدية تحدث عندما تنسد بصيلات الشعر بالزيوت وخلايا الجلد الميتة.', '- رؤوس بيضاء وسوداء
- بثور حمراء مؤلمة
- ندبات (آثار)', '- غسولات طبية
- مقشرات موضعية (رتينويد)
- مضادات حيوية
- علاجات هرمونية'),

('الارتجاع المريئي', 'GERD', 'gerd', 'Gastroenterology', 'ارتجاع حمض المعدة إلى المريء، مما يسبب حرقة وألم.', '- حرقة في المعدة (حرقان الصدر)
- صعوبة في البلع
- سعفة جافة', '- مضادات الحموضة
- مثبطات مضخة البروتون
- تجنب الأكل قبل النوم'),

('الربو', 'Asthma', 'asthma', 'Pulmonology', 'مرض مزمن يصيب الممرات الهوائية ويجعل التنفس صعباً.', '- ضيق التنفس
- أزيز (صفير) في الصدر
- سعال', '- بخاخات سريعة المفعول (موسعات الشعب)
- بخاخات وقائية (كورتيزون)'),

('القولون العصبي', 'IBS', 'ibs', 'Gastroenterology', 'اضطراب شائع يؤثر على الأمعاء الغليظة.', '- ألم وتقلصات في البطن
- غازات وانتفاخ
- إسهال أو إمساك (أو كلاهما)', '- تجنب الأطعمة المهيجة
- إدارة التوتر
- أدوية لتنظيم حركة الأمعاء'),

('الصدفية', 'Psoriasis', 'psoriasis', 'Dermatology', 'مرض مناعي يسبب تراكم خلايا الجلد وتكون قشور فضية.', '- بقع حمراء مغطاة بقشور
- جفاف وتشقق الجلد
- حكة وحرقان', '- كريمات كورتيزون
- مرطبات قوية
- التعرض للشمس باعتدال
- علاجات بيولوجية للحالات الشديدة'),

('حصوات الكلى', 'Kidney Stones', 'kidney-stones', 'Urology', 'ترسبات صلبة تتكون داخل الكلى وتسبب ألماً شديداً عند مرورها.', '- ألم حاد في الجنب والظهر
- دم في البول
- غثيان وقيء', '- شرب الماء بكثرة
- مسكنات الألم
- تفتيت الحصوات بالموجات
- الجراحة'),

('التهاب المفاصل الروماتويدي', 'Rheumatoid Arthritis', 'ra', 'Rheumatology', 'مرض مناعي يهاجم المفاصل ويسبب التهاباً مزمناً.', '- تورم وألم في المفاصل
- تيبس صباحي
- تعب وحمى خفيفة', '- مضادات الالتهاب
- أدوية تعديل المناعة
- العلاج الطبيعي'),

('أليف الرحم', 'Uterine Fibroids', 'fibroids', 'Gynecology', 'أورام غير سرطانية تنمو في الرحم، شائعة جداً.', '- نزيف حيض غزير
- ألم في الحوض
- كثرة التبول
- إمساك', '- المراقبة (اذا كانت صغيرة)
- أدوية لتقليص حجمها
- الجراحة (استئصال الورم أو الرحم)'),

('نقص فيتامين د', 'Vitamin D Deficiency', 'vitamin-d', 'General Health', 'نقص شائع يؤثر على صحة العظام والمناعة.', '- تعب وإرهاق
- ألم في العظام والظهر
- ضعف المناعة
- تساقط الشعر', '- مكملات فيتامين د
- التعرض الآمن للشمس
- أطعمة مدعمة'),

('حساسية الطعام', 'Food Allergy', 'food-allergy', 'Immunology', 'رد فعل مناعي تجاه أنواع معينة من الطعام.', '- حكة وتورم في الفم
- طفح جلدي
- ضيق تنفس
- غثيان', '- تجنب الطعام المسبب
- حمل حقنة إبينفرين للحالات الطارئة'),

('الاكزيما', 'Eczema', 'eczema', 'Dermatology', 'التهاب جلدي يسبب حكة واحمراراً وجفافاً.', '- حكة شديدة (خاصة ليلاً)
- بقع حمراء أو بنية
- جلد جاف ومتقشر', '- ترطيب مستمر
- كريمات كورتيزون
- تجنب المهيجات (صابون قوي، عطور)'),

('دوالي الساقين', 'Varicose Veins', 'varicose-veins', 'Surgery', 'أوردة متضخمة وملتوية، غالباً في الساقين.', '- ظهور عروق زرقاء بارزة
- ثقل وألم في الساقين
- تورم الكاحلين', '- جوارب ضاغطة
- ممارسة الرياضة
- رفع الساقين
- العلاج بالليزر أو الحقن'),

('التصلب اللويحي', 'Multiple Sclerosis', 'ms', 'Neurology', 'مرض يهاجم فيه الجهاز المناعي غشاء الأعصاب.', '- تنميل وضعف في الأطراف
- مشاكل في الرؤية
- صعوبات في المشي والتوازن', '- علاجات تعديل مسار المرض
- كورتيزون للنوبات
- علاج طبيعي'),

('الذئبة الحمراء', 'Lupus', 'lupus', 'Rheumatology', 'مرض مناعي يهاجم أنسجة الجسم المختلفة.', '- طفح جلدي على الوجه (فراشة)
- ألم المفاصل
- تعب وحمى
- حساسية للشمس', '- مضادات الالتهاب
- كورتيزون
- مثبطات المناعة')
ON CONFLICT (slug) DO NOTHING;

-- Seed Data: Articles
-- Using a temporary doctor ID (assuming at least one doctor exists from previous seeds)
DO $$
DECLARE
    doc_id UUID;
BEGIN
    -- Try to find a valid doctor
    SELECT id INTO doc_id FROM doctors LIMIT 1;

    -- If no doctor exists, we cannot insert articles linked to a doctor
    IF doc_id IS NOT NULL THEN
        INSERT INTO articles (title_ar, title_en, slug, content_ar, content_en, excerpt_ar, excerpt_en, category, status, doctor_id, featured_image_url) VALUES
        (
            'تغذية الحامل في الأشهر الأولى', 
            'Pregnancy Nutrition in the First Trimester',
            'pregnancy-nutrition-first-trimester', 
            'التغذية السليمة هي حجر الأساس لحمل صحي. في الأشهر الثلاثة الأولى، يحتاج جسمك إلى الفولات والحديد والكالسيوم بشكل مكثف. ننصح بتناول الخضروات الورقية، المكسرات، والبروتينات الخالية من الدهون. تجنبي الأسماك ذات الزئبق العالي واللحوم غير المطهية جيداً...', 
            'Proper nutrition is the cornerstone of a healthy pregnancy. In the first trimester, your body needs folate, iron, and calcium intensively. We recommend leafy vegetables, nuts, and lean proteins. Avoid high-mercury fish and undercooked meats...',
            'دليلك الشامل لأهم العناصر الغذائية التي تحتاجينها أنتِ وجنينك في بداية رحلة الحمل.',
            'Your comprehensive guide to the most important nutrients you and your baby need at the start of your pregnancy journey.',
            'Women Health', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1518779578993-ec3579fee397'
        ),
        
        (
            'كيف تتعاملين مع سكري الحمل؟', 
            'How to Manage Gestational Diabetes?',
            'managing-gestational-diabetes', 
            'سكري الحمل هو حالة مؤقتة ولكنها تتطلب عناية فائقة. المفتاح هو التوازن: وجبات صغيرة ومتكررة، تقليل الكربوهيدرات البسيطة، وممارسة المشي يومياً لمدة 30 دقيقة. يجب فحص السكر 4 مرات يومياً لضمان سلامة الجنين...', 
            'Gestational diabetes is a temporary condition but requires careful attention. The key is balance: small, frequent meals, reducing simple carbohydrates, and walking daily for 30 minutes. Sugar must be checked 4 times a day to ensure the safety of the fetus...',
            'خطوات عملية وبسيطة للسيطرة على سكر الدم خلال فترة الحمل وضمان سلامة الجنين.',
            'Practical and simple steps to control blood sugar during pregnancy and ensure the safety of the fetus.',
            'Women Health', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef'
        ),

        (
            '5 نصائح لبشرة نضرة في فصل الصيف', 
            '5 Tips for Glowing Skin in Summer',
            'summer-skin-care-tips', 
            'شمس الخليج الحارقة تتطلب عناية خاصة. 1. واقي الشمس لا غنى عنه، جدديه كل ساعتين. 2. الترطيب الداخلي أهم من الخارجي: اشربي 3 لتر ماء. 3. استخدمي سيروم فيتامين سي صباحاً لحماية البشرة من الأكسدة...', 
            'The scorching Gulf sun requires special care. 1. Sunscreen is indispensable, renew it every two hours. 2. Internal hydration is more important than external: drink 3 liters of water. 3. Use Vitamin C serum in the morning to protect skin from oxidation...',
            'روتين يومي بسيط للحفاظ على إشراقة بشرتك وحمايتها من الجفاف والتصبغات.',
            'A simple daily routine to maintain your skin''s radiance and protect it from dryness and pigmentation.',
            'Dermatology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1596472247752-1d53cb8d7aa0'
        ),

        (
            'الاكتئاب الصامت لدى النساء', 
            'Silent Depression in Women',
            'silent-depression-in-women', 
            'كثير من النساء يعانين بصمت تحت ضغط المسؤوليات. الأعراض ليست دائماً حزناً ظاهراً؛ قد تكون إرهاقاً مستمراً، آلاماً جسدية غير مفسرة، أو فقدان شغف مفاجئ. التحدث هو أول خطوات العلاج...', 
            'Many women suffer in silence under the pressure of responsibilities. Symptoms are not always obvious sadness; they can be constant fatigue, unexplained physical pain, or sudden loss of passion. Talking is the first step to treatment...',
            'كيف تميزين بين التعب العادي والاكتئاب؟ ومتى يجب عليك طلب المساعدة المتخصصة.',
            'How to distinguish between normal fatigue and depression? And when should you seek professional help.',
            'Mental Health', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1590086782792-42dd2350140d'
        ),

        (
            'دليل الرضاعة الطبيعية للأمهات الجدد', 
            'Breastfeeding Guide for New Moms',
            'breastfeeding-guide', 
            'الرضاعة الطبيعية رحلة تعلم وليست غريزة فقط. الوضعية الصحيحة هي مفتاح النجاح وتجنب الألم. تأكدي من أن فم الطفل يغطي الهالة بالكامل. لا تترددي في استشارة أخصائية رضاعة إذا واجهت صعوبات...', 
            'Breastfeeding is a learning journey, not just an instinct. Correct positioning is key to success and avoiding pain. Ensure the baby''s mouth covers the areola completely. Don''t hesitate to consult a lactation specialist if you face difficulties...',
            'إجابات على أكثر الأسئلة شيوعاً حول الرضاعة الطبيعية، المشاكل والحلول.',
            'Answers to the most common questions about breastfeeding, problems and solutions.',
            'Pediatrics', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1555252333-9f8e92e65df9'
        ),

        (
            'تساقط الشعر: الأسباب والعلاج', 
            'Hair Loss: Causes and Treatment',
            'hair-loss-causes', 
            'هل تجدين شعراً كثيراً على الوسادة؟ الأسباب تتراوح من نقص الحديد وفيتامين د، إلى التوتر واضطراب الهرمونات. العلاج يبدأ بالتحاليل. المينوكسيديل قد يساعد، وجلسات البلازما أثبتت فعالية جيدة...', 
            'Do you find a lot of hair on the pillow? Causes range from iron and Vitamin D deficiency to stress and hormonal disorders. Treatment begins with tests. Minoxidil may help, and plasma sessions have proven effective...',
            'متى يكون تساقط الشعر مقلقاً؟ تعرفي على الفحوصات اللازمة وأحدث طرق العلاج.',
            'When is hair loss concerning? Learn about necessary tests and the latest treatment methods.',
            'Dermatology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1635338161100-348b6443c52a'
        ),

        (
            'أهمية الفحص المبكر لسرطان الثدي', 
            'Importance of Early Breast Cancer Screening',
            'breast-cancer-early-detection', 
            '98% هي نسبة الشفاء عند الاكتشاف المبكر. الفحص الذاتي الشهري والماموجرام السنوي بعد سن الأربعين هي أدواتك للحماية. لا تتجاهلي أي كتلة أو تغير في الجلد. نحن هنا لدعمك...', 
            '98% is the cure rate with early detection. Monthly self-exams and annual mammograms after forty are your tools for protection. Do not ignore any lump or skin change. We are here to support you...',
            'لا تؤجلي فحصك. تعرفي على طريقة الفحص الذاتي ومتى يجب عليك زيارة الطبيبة.',
            'Don''t delay your checkup. Learn how to perform self-exams and when to see a doctor.',
            'Oncology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1579165466741-7f35a4755657'
        ),

        (
            'نقص الحديد وتأثيره على حياتك', 
            'Iron Deficiency and Its Impact on Your Life',
            'iron-deficiency-impact', 
            'الشعور الدائم بالإرهاق ليس "طبيعياً". نقص الحديد هو السبب الأكثر شيوعاً. يؤثر على تركيزك، نفسك، وحتى جمال أظافرك وشعرك. اللحوم الحمراء، العدس، والسبانخ مصادر رائعة، لكن قد تحتاجين لمكملات...', 
            'Feeling constantly exhausted is not "normal". Iron deficiency is the most common cause. It affects your focus, breath, and even the beauty of your nails and hair. Red meat, lentils, and spinach are great sources, but you may need supplements...',
            'أعراض خفية لنقص الحديد قد تتجاهلينها، وكيفية استعادة نشاطك وحيويتك.',
            'Hidden symptoms of iron deficiency you might ignore, and how to regain your energy and vitality.',
            'Nutrition', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8'
        ),

        (
            'تمارين كيجل: لماذا تحتاجها كل امرأة؟', 
            'Kegel Exercises: Why Every Woman Needs Them?',
            'kegel-exercises-benefits', 
            'عضلات قاع الحوض هي الحامل لأعضائك الداخلية. ضعفها يسبب السلس الهبوط. تمارين كيجل بسيطة ويمكن ممارستها في أي مكان. شدي وكأنك تحبسين البول لمدة 5 ثوان، ثم ارخي. كرريها 10 مرات...', 
            'Pelvic floor muscles hold your internal organs. Weakness causes incontinence and prolapse. Kegel exercises are simple and can be done anywhere. Tighten as if holding urine for 5 seconds, then relax. Repeat 10 times...',
            'طريقة بسيطة لتقوية عضلات الحوض والوقاية من مشاكل المستقبل.',
            'A simple way to strengthen pelvic muscles and prevent future problems.',
            'Gynecology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1518310383802-640c2de311b2'
        ),

        (
            'الصوم المتقطع: هل هو مناسب للنساء؟', 
            'Intermittent Fasting: Is it Suitable for Women?',
            'intermittent-fasting-women', 
            'الصوم المتقطع فعال، لكن هرمونات النساء حساسة. الصوم الطويل جداً قد يربك دورتك الشهرية. ننصح النساء بنظام 14/10 بدلاً من 16/8 القاسي. استمعي لجسمك وتوقفي إذا شعرتِ بدوخة أو اضطراب...', 
            'Intermittent fasting is effective, but women''s hormones are sensitive. Very long fasting can disrupt your menstrual cycle. We recommend 14/10 for women instead of the harsh 16/8. Listen to your body and stop if you feel dizzy or disturbed...',
            'كيف تطبقين الصوم المتقطع بذكاء دون التأثير على توازن هرموناتك.',
            'How to apply intermittent fasting smartly without affecting your hormonal balance.',
            'Nutrition', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061'
        ),

        (
            'أعراض انقطاع الطمث وكيفية التخفيف منها', 
            'Menopause Symptoms and How to Alleviate Them',
            'menopause-symptoms', 
            'الهبات الساخنة وتقلب المزاج جزء من المرحلة، لكنها لا يجب أن توقف حياتك. الملابس القطنية، الصويا، والرياضة تساعد كثيراً. العلاج الهرموني التعويضي خيار آمن لكثيرات تحت إشراف طبي...', 
            'Hot flashes and mood swings are part of the phase, but they shouldn''t stop your life. Cotton clothes, soy, and exercise help a lot. Hormone replacement therapy is a safe option for many under medical supervision...',
            'دليلك للعبور بسلام من مرحلة انقطاع الطمث والحفاظ على جودة حياتك.',
            'Your guide to safely navigating menopause and maintaining your quality of life.',
            'Gynecology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1544367563-12123d8c4fa6'
        ),

        (
            'متلازمة القولون العصبي: الغذاء هو الدواء', 
            'IBS: Food is Medicine',
            'ibs-diet-management', 
            'لا يوجد دواء سحري للقولون، لكن حمية "فودماب" أثبتت نجاحاً باهراً. تجنبي البقوليات، الثوم، والبصل لفترة، ثم أعيديهم تدريجياً لتعرفي عدوك. النعناع والبابونج أصدقاء جهازك الهضمي...', 
            'There is no magic pill for IBS, but the "FODMAP" diet has shown great success. Avoid legumes, garlic, and onion for a while, then reintroduce them gradually to know your enemy. Mint and chamomile are friends of your digestive system...',
            'كيف تسيطرين على آلام القولون والانتفاخ من خلال اختياراتك الغذائية.',
            'How to control IBS pain and bloating through your food choices.',
            'Nutrition', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'
        ),

        (
            'اليوغا وتأثيرها على الصحة النفسية', 
            'Yoga and Its Impact on Mental Health',
            'yoga-mental-health', 
            'اليوغا ليست مجرد حركات مرونة، هي تمارين للتنفس والاسترخاء. 15 دقيقة يومياً تخفض الكورتيزول (هرمون التوتر) وتحسن نومك بشكل ملحوظ. ابدئي بوضعية "الطفل" و"الشجرة"...', 
            'Yoga is not just flexibility movements; it''s breathing and relaxation exercises. 15 minutes daily lowers cortisol (stress hormone) and significantly improves your sleep. Start with "Child''s Pose" and "Tree Pose"...',
            'كيف يمكن لربع ساعة من اليوغا أن تغير مزاجك وتخفف من ضغوط اليوم.',
            'How a quarter of an hour of yoga can change your mood and relieve the day''s stress.',
            'Mental Health', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1544367563-12123d8c4fa6'
        ),

        (
            'حبوب منع الحمل: خرافات وحقائق', 
            'Birth Control Pills: Myths and Facts',
            'birth-control-myths', 
            'هل تسبب العقم؟ لا. هل تزيد الوزن؟ قليلاً بسبب احتباس الماء، وغالباً بشكل مؤقت. هل تسبب السرطان؟ بالعكس، هي تحمي من سرطان المبيض والرحم. استشيري طبيبتك لاختيار النوع الأنسب...', 
            'Do they cause infertility? No. Do they increase weight? Slightly due to water retention, and usually temporarily. Do they cause cancer? On the contrary, they protect against ovarian and uterine cancer. Consult your doctor to choose the most suitable type...',
            'نصحح لكِ أشهر المعلومات المغلوطة حول وسائل منع الحمل الهرمونية.',
            'We correct the most famous misinformation about hormonal birth control methods.',
            'Gynecology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae'
        ),

        (
            'العناية بأسنان طفلك من الظهور الأول', 
            'Caring for Your Child''s Teeth from the First Appearance',
            'baby-teeth-care', 
            'لا تنتظري تسوس الأسنان. نظفي لثة طفلك بقطعة شاش مبللة حتى قبل ظهور الأسنان. مع أول سن، استخدمي فرشاة سيليكون وكمية معجون بحجم حبة الأرز. الزيارة الأولى لطبيب الأسنان يجب أن تكون مع عيد ميلاده الأول...', 
            'Do not wait for tooth decay. Clean your child''s gums with a wet piece of gauze even before teeth appear. With the first tooth, use a silicone brush and a rice-sized amount of toothpaste. The first dentist visit should be on their first birthday...',
            'نصائح ذهبية لحماية ابتسامة طفلك وتأسيس عادات صحية مدى الحياة.',
            'Golden tips to protect your child''s smile and establish lifelong healthy habits.',
            'Pediatrics', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1606811971618-4486d14f3f72'
        ),

        (
            'السمنة وتأثيرها على الخصوبة', 
            'Obesity and Its Effect on Fertility',
            'obesity-and-fertility', 
            'الوزن الزائد يفرز هرمونات قد تمنع التبويض. الخبر الجيد؟ فقدان 5-10% فقط من وزنك قد يعيد التبويض لطبيعته ويضاعف فرص الحمل. ابدئي ببطء، فالاستمرارية أهم من السرعة...', 
            'Excess weight secretes hormones that may prevent ovulation. The good news? Losing just 5-10% of your weight can restore ovulation to normal and double pregnancy chances. Start slowly, consistency is more important than speed...',
            'العلاقة بين الوزن والحمل، ولماذا يعتبر إنقاص الوزن أول خطوات علاج تأخر الإنجاب.',
            'The relationship between weight and pregnancy, and why weight loss is considered the first step in treating delayed conception.',
            'Gynecology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
        ),

        (
            'فيتامين سي: سر النضارة والمناعة', 
            'Vitamin C: The Secret to Radiance and Immunity',
            'vitamin-c-benefits', 
            'من الفلفل البارد إلى البرتقال، فيتامين سي هو الجندي المجهول. يحفز الكولاجين، يفتح التصبغات، ويقوي مناعتك ضد الزكام. سيروم فيتامين سي صباحاً هو أفضل استثمار لجمالك...', 
            'From bell peppers to oranges, Vitamin C is the unsung hero. It stimulates collagen, lightens pigmentation, and strengthens your immunity against colds. Vitamin C serum in the morning is the best investment for your beauty...',
            'لماذا يجب أن يكون فيتامين سي جزءاً أساسياً من غذائك وروتين عنايتك بالبشرة.',
            'Why Vitamin C should be an essential part of your diet and skincare routine.',
            'General Health', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1596472247752-1d53cb8d7aa0'
        ),

        (
            'كيف تختارين الفيتامينات المناسبة لك؟', 
            'How to Choose the Right Vitamins for You?',
            'choosing-supplements', 
            'ليس كل ما يلمع ذهباً، وليس كل مكمل غذائي ضروري. القاعدة الذهبية: الفحص قبل المكمل. الحديد، فيتامين د، وB12 هي الأكثر شيوعاً للنقص. الكالسيوم ضروري بعد سن الخمسين...', 
            'Not all that glitters is gold, and not every supplement is necessary. The golden rule: Test before supplementing. Iron, Vitamin D, and B12 are the most common deficiencies. Calcium is essential after fifty...',
            'دليل مبسط لفهم المكملات الغذائية: متى تحتاجينها وكيف تختارين الأنواع الجيدة.',
            'A simplified guide to understanding supplements: when you need them and how to choose good types.',
            'General Health', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae'
        ),

        (
            'التعامل مع آلام الدورة الشهرية', 
            'Managing Period Pain',
            'managing-period-pain', 
            'الألم المعيق للحياة ليس طبيعياً. الكمادات الدافئة، شاي الزنجبيل، والمغنيسيوم، كلها حلول طبيعية فعالة. مضادات الالتهاب (إيبوبروفين) تعمل بشكل أفضل اذا أخذت قبل بدء الألم بيوم...', 
            'Life-disrupting pain is not normal. Warm compresses, ginger tea, and magnesium are all effective natural solutions. Anti-inflammatories (Ibuprofen) work best if taken a day before pain starts...',
            'حلول طبيعية ودوائية للتخفيف من تقلصات الدورة الشهرية وممارسة حياتك بشكل طبيعي.',
            'Natural and medicinal solutions to relieve menstrual cramps and live your life normally.',
            'Gynecology', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1518310383802-640c2de311b2'
        ),

        (
            'أهمية شرب الماء لصحة الكلى والبشرة', 
            'Importance of Drinking Water for Kidney and Skin Health',
            'water-health-benefits', 
            'كليتك وبشرتك هما أكبر المستفيدين من الماء. الماء يطرد السموم، يمنع الحصوات، ويعطي بشرتك مظهراً ممتلئاً وحيوياً. هل تنسين الشرب؟ اربطيه بالصلاة أو استخدمي تطبيقات التذكير وتأكدي من لون البول...', 
            'Your kidneys and skin are the biggest beneficiaries of water. Water flushes out toxins, prevents stones, and gives your skin a plump and vital look. Do you forget to drink? Link it to prayer or use reminder apps and check urine color...',
            'كيف تحسبين احتياجك اليومي من الماء، وعلامات تدل على أنك لا تشربين كفايتك.',
            'How to calculate your daily water needs, and signs that you are not drinking enough.',
            'General Health', 
            'published', 
            doc_id, 
            'https://images.unsplash.com/photo-1548839140-29a749e1cf4d'
        )
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $$;
