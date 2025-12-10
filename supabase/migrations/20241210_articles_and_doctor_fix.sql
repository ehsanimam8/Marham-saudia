-- Fix Doctor Profile Photo and Add More Articles
-- Run this in Supabase SQL Editor

BEGIN;

-- 1. Fix specific doctor profile photo
-- Attempting to update by ID. If ID refers to user/profile ID, we update profile_photo_url in doctors table via join or direct if it's doctor ID.
-- Assuming the UUID provided is the doctor's ID from the URL structure /doctors/[id]
UPDATE public.doctors
SET profile_photo_url = '/images/doctors/ai_doctor_senior.png' -- Using a generic safe image
WHERE id = '0a647347-cacd-433e-afec-ddc0a7ca9d51';

-- Also try updating by profile_id just in case the ID provided was a profile ID (common confusion)
UPDATE public.doctors
SET profile_photo_url = '/images/doctors/ai_doctor_senior.png'
WHERE profile_id = '0a647347-cacd-433e-afec-ddc0a7ca9d51';


-- 2. Add 10 New Articles
INSERT INTO public.articles (
    slug,
    title_ar,
    title_en,
    content_ar,
    content_en,
    excerpt_ar,
    excerpt_en,
    category,
    featured_image_url,
    keywords,
    read_time_minutes,
    status,
    published_at,
    reviewed_by_doctor_id
) VALUES
-- Article 1: Skincare
(
    'hormonal-acne-treatment',
    'حب الشباب الهرموني: الأسباب والعلاج',
    'Hormonal Acne: Causes and Treatment',
    'حب الشباب الهرموني هو مشكلة شائعة تواجه الكثير من النساء، خاصة في فترات التغيرات الهرمونية مثل البلوغ، الدورة الشهرية، الحمل، وسن اليأس.

الأسباب:
يرتبط حب الشباب الهرموني بتقلبات الهرمونات، خاصة ارتفاع مستوى الأندروجينات (الهرمونات الذكرية) التي تحفز الغدد الدهنية على إفراز المزيد من الزيوت، مما يؤدي إلى انسداد المسام.

العلاج:
1. العناية بالبشرة: استخدام غسولات تحتوي على حمض الساليسيليك أو البنزويل بيروكسايد.
2. الأدوية الموضعية: الريتينويدات والمضادات الحيوية.
3. العلاج الهرموني: حبوب منع الحمل قد تساعد في تنظيم الهرمونات.
4. النظام الغذائي: تقليل السكريات ومنتجات الألبان قد يساعد بعض الحالات.

نصائح هامة:
- لا تعبثي بالحبوب.
- حافظي على نظافة وجهك.
- استخدمي مستحضرات تجميل غير زيتية (Non-comedogenic).',
    'Hormonal acne is a common issue linked to hormonal fluctuations. Learn about its causes, including androgen spikes, and effective treatments ranging from skincare routines to medical interventions.',
    'كيف تتعاملين مع حب الشباب الهرموني بفعالية',
    'How to deal with hormonal acne effectively',
    'الجلدية والتجميل',
    '/images/articles/skincare-acne.png',
    ARRAY['حب الشباب', 'العناية بالبشرة', 'الهرمونات', 'الجلدية'],
    5,
    'published',
    NOW() - INTERVAL '2 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1) -- Assign random doctor
),

-- Article 2: Hair Loss
(
    'postpartum-hair-loss',
    'تساقط الشعر بعد الولادة: لماذا يحدث؟',
    'Postpartum Hair Loss: Why It Happens?',
    'تلاحظ العديد من الأمهات تساقطاً كثيفاً للشعر بعد الولادة ببضعة أشهر. لا تقلقي، هذا أمر طبيعي ومؤقت.

السبب:
أثناء الحمل، تمنع الهرمونات المرتفعة تساقط الشعر الطبيعي، مما يجعله يبدو أكثر كثافة. بعد الولادة، تنخفض الهرمونات فجأة، فيدخل الشعر المتراكم في مرحلة التساقط دفعة واحدة.

متى يعود لطبيعته؟
عادة ما يتوقف التساقط ويعود الشعر لكثافته الطبيعية عند بلوغ طفلك عامه الأول.

نصائح للتعامل معه:
- تناولي فيتامينات ما بعد الولادة.
- كوني رفيقة بشعرك وتجنبي الشد القوي.
- جربي قصات شعر تعطي كثافة.',
    'Postpartum hair loss is a normal temporary condition caused by hormonal drops after birth. Understand why it happens and how to manage it until your hair returns to normal.',
    'فهم تساقط الشعر بعد الولادة وكيفية التعامل معه',
    'Understanding postpartum hair loss and how to manage it',
    'الجلدية والتجميل',
    '/images/articles/hair-loss.png',
    ARRAY['الشعر', 'ما بعد الولادة', 'الجلدية', 'الأمومة'],
    4,
    'published',
    NOW() - INTERVAL '5 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 3: Anxiety
(
    'managing-anxiety-new-moms',
    'إدارة القلق للأمهات الجدد',
    'Managing Anxiety for New Moms',
    'الأمومة تجربة رائعة ولكنها قد تثير الكثير من القلق والمخاوف.

أعراض القلق الشائعة:
- التفكير الزائد في سلامة الطفل.
- صعوبة النوم حتى عندما ينام الطفل.
- التهيج والعصبية.

استراتيجيات المواجهة:
1. تقبلي مشاعرك: من الطبيعي أن تشعري بالقلق.
2. خصصي وقتاً لنفسك: ولو 15 دقيقة يومياً.
3. اطلبي المساعدة: من الشريك أو العائلة.
4. تواصلي مع أمهات أخريات.

متى تستشيرين مختصاً؟
إذا كان القلق يعيق حياتك اليومية أو يمنعك من النوم أو الأكل بشكل طبيعي.',
    'Motherhood brings joy but also anxiety. Learn to recognize common anxiety symptoms in new moms and practical strategies to cope and find balance.',
    'نصائح عملية للتغلب على قلق الأمومة الجديدة',
    'Practical tips to overcome new mom anxiety',
    'الصحة النفسية',
    '/images/articles/anxiety-moms.png',
    ARRAY['القلق', 'الصحة النفسية', 'الأمومة', 'الرعاية الذاتية'],
    6,
    'published',
    NOW() - INTERVAL '3 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 4: Sleep Hygiene
(
    'better-sleep-tips',
    'نصائح لنوم أفضل وصحة أقوى',
    'Tips for Better Sleep and Stronger Health',
    'النوم الجيد هو ركيزة أساسية للصحة الجسدية والنفسية.

لماذا النوم مهم؟
يقوي المناعة، يحسن التركيز، ويساعد في تنظيم الوزن والمزاج.

كيف تحسنين جودة نومك؟
1. روتين ثابت: اذهبي للفراش واستيقظي في نفس الوقت يومياً.
2. بيئة هادئة: غرفة مظلمة وباردة قليلاً.
3. تجنبي الشاشات: الضوء الأزرق من الهواتف يعيق إفراز الميلاتونين.
4. تجنبي الكافيين: في المساء.

إذا كنت تعانين من الأرق المستمر، فقد تحتاجين لاستشارة طبيب.',
    'Quality sleep is vital for health. Discover simple, effective tips to improve your sleep hygiene, from establishing a routine to optimizing your bedroom environment.',
    'كيف تحسنين جودة نومك بخطوات بسيطة',
    'How to improve sleep quality with simple steps',
    'صحة عامة',
    '/images/articles/sleep-health.png',
    ARRAY['النوم', 'الأرق', 'صحة عامة', 'نمط الحياة'],
    5,
    'published',
    NOW() - INTERVAL '7 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 5: Nutrition
(
    'nutrition-breastfeeding',
    'التغذية السليمة أثناء الرضاعة الطبيعية',
    'Nutrition During Breastfeeding',
    'تحتاج الجمرضعة إلى طاقة وعناصر غذائية إضافية لإنتاج الحليب والحفاظ على صحتها.

ماذا تأكلين؟
- البروتينات: اللحوم، البقوليات، البيض.
- الكالسيوم: ومشتقات الحليب أو البدائل المدعمة.
- الحديد: الخضروات الورقية، اللحوم الحمراء.
- السوائل: اشربي الكثير من الماء.

أطعمة يجب الحذر منها:
- الكافيين بكميات كبيرة.
- بعض الأسماك عالية الزئبق.

تذكري: لا تحتاجين "أكلاً لشخصين"، بل "تغذية لشخصين".',
    'Breastfeeding moms need extra nutrients. Learn what to eat to support milk production and your own health, and what foods to consume in moderation.',
    'أفضل الأطعمة للمرضع لزيادة الحليب وصحة الأم',
    'Best foods for breastfeeding moms to boost milk and health',
    'التغذية',
    '/images/articles/breastfeeding-nutrition.png',
    ARRAY['الرضاعة', 'التغذية', 'صحة الأم', 'الفيتامينات'],
    7,
    'published',
    NOW() - INTERVAL '1 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 6: PAP Smear
(
    'pap-smear-importance',
    'مسحة عنق الرحم: لماذا هي ضرورية؟',
    'Pap Smear: Why Is It Essential?',
    'مسحة عنق الرحم (Pap Smear) هي فحص بسيط للكشف المبكر عن تغيرات خلايا عنق الرحم التي قد تتحول لسرطان.

متى يبدأ الفحص؟
عادة من عمر 21 سنة.

كم مرة؟
كل 3 سنوات للنساء من 21-65 سنة، أو حسب توصية الطبيبة.

هل هو مؤلم؟
قد تشعرين ببعض الانزعاج البسيط، لكنه سريع جداً وغير مؤلم غالباً.

النتيجة:
معظم النتائج سليمة. إذا ظهرت تغيرات، فهذا لا يعني بالضرورة وجود سرطان، بل يعني الحاجة لمتابعة أدق.',
    'A Pap smear is a crucial screening for cervical cancer prevention. Understand when to get it, what to expect during the exam, and what results mean.',
    'كل ما تحتاجين معرفته عن فحص مسحة عنق الرحم',
    'Everything you need to know about Pap smear screening',
    'صحة المرأة',
    '/images/articles/pap-smear.png',
    ARRAY['عنق الرحم', 'فحص دوري', 'سرطان', 'وقاية'],
    4,
    'published',
    NOW() - INTERVAL '12 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 7: Vitamin D
(
    'vitamin-d-benefits',
    'فيتامين د: سر الطاقة والمناعة',
    'Vitamin D: Secret to Energy and Immunity',
    'يعاني الكثيرون من نقص فيتامين د دون أن يدركوا.

أهميته:
- صحة العظام (امتصاص الكالسيوم).
- تعزيز المناعة.
- تحسين المزاج والوقاية من الاكتئاب.

مصادر فيتامين د:
1. الشمس: التعرض المباشر لمدة 15 دقيقة.
2. الأغذية: الأسماك الدهنية، صفار البيض، الأغذية المدعمة.
3. المكملات: بعد استشارة الطبيب وإجراء الفحص.

أعراض النقص:
تعب مستمر، آلام العظام، ضعف العضلات، وتقلب المزاج.',
    'Vitamin D is essential for bones, immunity, and mood. Learn about sources, signs of deficiency, and how to maintain adequate levels safe.',
    'أهمية فيتامين د لصحة المرأة وكيفية الحصول عليه',
    'Importance of Vitamin D for women and how to get it',
    'التغذية',
    '/images/articles/vitamin-d.png',
    ARRAY['فيتامينات', 'مناعة', 'تغذية', 'صحة عامة'],
    5,
    'published',
    NOW() - INTERVAL '20 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 8: Kegel Exercises
(
    'kegel-exercises-guide',
    'تمارين كيجل: لتقوية عضلات الحوض',
    'Kegel Exercises: Strengthening Pelvic Floor',
    'تمارين كيجل مفيدة لكل النساء، خاصة بعد الولادة أو مع التقدم في العمر.

الفائدة:
تقوية عضلات قاع الحوض التي تدعم الرحم والمثانة والأمعاء، مما يساعد في منع السلس البولي وتحسين العلاقة الزوجية.

كيفية القيام بها:
1. حددي العضلات الصحيحة (كأنك تحاولين حبس البول).
2. انقبضي لمدة 5 ثوانٍ، ثم استرخي 5 ثوانٍ.
3. كرري 10 مرات، 3 جلسات يومياً.

يمكنك القيام بها في أي وقت ومكان دون أن يلاحظ أحد!',
    'Kegel exercises strengthen pelvic floor muscles. Essential for postpartum recovery and bladder control. Learn how to do them correctly anytime, anywhere.',
    'كيف تمارسين تمارين كيجل بشكل صحيح وفوائدها',
    'How to do Kegel exercises correctly and their benefits',
    'صحة المرأة',
    '/images/articles/kegel.png',
    ARRAY['تمارين', 'حوض', 'ولادة', 'صحة المرأة'],
    3,
    'published',
    NOW() - INTERVAL '25 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 9: Hydration
(
    'hydration-health-beauty',
    'شرب الماء: سر الجمال والصحة',
    'Hydration: Secret to Beauty and Health',
    'الماء ليس مجرد مشروب لروي العطش، بل هو وقود جسدك.

فوائد شرب الماء كافٍ:
- بشرة نضرة ومشرقة.
- طاقة وتركيز أعلى.
- هضم أفضل.
- تنظيم درجة حرارة الجسم.

كم تحتاجين؟
حوالي 8 أكواب يومياً، وتزيد مع الحرارة والرياضة والحمل/الرضاعة.

نصيحة:
اجعلي قنينة الماء رفيقتك الدائمة، وأضيفي شرائح الليمون أو الخيار لنكهة منعشة.',
    'Water is essential for glowing skin, energy, and digestion. Discover the benefits of staying hydrated and tips to drink more water daily.',
    'لماذا يعتبر شرب الماء أهم عادة صحية يومية',
    'Why drinking water is the most important daily health habit',
    'صحة عامة',
    '/images/articles/water-hydration.png',
    ARRAY['الماء', 'بشرة', 'صحة عامة', 'جمال'],
    3,
    'published',
    NOW() - INTERVAL '15 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
),

-- Article 10: Newborn Care
(
    'newborn-care-basics',
    'أساسيات العناية بالمولود الجديد',
    'Newborn Care Basics',
    'الأيام الأولى مع المولود قد تكون مربكة. إليك الأساسيات:

1. النوم: ينام المولود كثيراً لكن لفترات قصيرة. نوموه على ظهره دائماً.
2. الرضاعة: كل 2-3 ساعات. راقبي علامات الجوع.
3. الاستحمام: 2-3 مرات أسبوعياً كافية. استخدمي ماء دافئ ومنتجات لطيفة.
4. السرة: حافظي عليها نظيفة وجافة حتى تسقط.

تذكري: ثقي بحدسك كأم، ولا تترددي في استشارة طبيب الأطفال عند القلق.',
    'The first days with a newborn can be overwhelming. Master the basics of sleep, feeding, bathing, and cord care to start your motherhood journey with confidence.',
    'دليل سريع للأمهات الجدد للعناية بالطفل',
    'Quick guide for new moms on baby care',
    'رعاية الطفل',
    '/images/articles/newborn-care.png',
    ARRAY['طفل', 'أمومة', 'رعاية', 'مواليد'],
    8,
    'published',
    NOW() - INTERVAL '4 days',
    (SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1)
);

COMMIT;
