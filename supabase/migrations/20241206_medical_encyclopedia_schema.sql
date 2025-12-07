-- Medical Encyclopedia Schema and Seed Data

-- 1. Create Tables

-- Medical Conditions (Diseases)
CREATE TABLE IF NOT EXISTS medical_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    overview_ar TEXT,       -- General description
    symptoms_ar TEXT,       -- Detailed symptoms text
    diagnosis_ar TEXT,      -- How it's diagnosed
    treatment_ar TEXT,      -- Treatment options
    specialty TEXT,         -- Matches doctors.specialty for linking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Symptoms
CREATE TABLE IF NOT EXISTS symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Junction Table: Conditions <-> Symptoms
CREATE TABLE IF NOT EXISTS condition_symptoms (
    condition_id UUID REFERENCES medical_conditions(id) ON DELETE CASCADE,
    symptom_id UUID REFERENCES symptoms(id) ON DELETE CASCADE,
    PRIMARY KEY (condition_id, symptom_id)
);

-- 2. Enable RLS
ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_symptoms ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Everyone can read
CREATE POLICY "Public can view medical conditions" ON medical_conditions FOR SELECT USING (true);
CREATE POLICY "Public can view symptoms" ON symptoms FOR SELECT USING (true);
CREATE POLICY "Public can view condition symptoms" ON condition_symptoms FOR SELECT USING (true);

-- Only admins/doctors can edit (simplified for now, usually just admin)
CREATE POLICY "Admins can manage medical conditions" ON medical_conditions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor'))
);

-- 4. Seed Data

-- Insert Symptoms
INSERT INTO symptoms (id, slug, name_ar, name_en, description_ar) VALUES
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'headache', 'صداع', 'Headache', 'ألم في الرأس قد يكون نابضاً أو مستمراً.'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'fatigue', 'تعب وإرهاق', 'Fatigue', 'شعور دائم بالخمول وعدم القدرة على القيام بالأنشطة اليومية.'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'irregular-periods', 'عدم انتظام الدورة الشهرية', 'Irregular Periods', 'تغير في مواعيد الدورة الشهرية أو غيابها لفترات.'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'weight-gain', 'زيادة الوزن', 'Weight Gain', 'زيادة غير مبررة في الوزن رغم عدم تغير نظام الأكل.'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'acne', 'حب الشباب', 'Acne', 'ظهور بثور وحبوب على الوجه أو الجسم.'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'excessive-thirst', 'العطش الشديد', 'Excessive Thirst', 'رغبة ملحة ومستمرة في شرب الماء.'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'hair-loss', 'تساقط الشعر', 'Hair Loss', 'فقدان الشعر بشكل ملحوظ أكثر من المعدل الطبيعي.');

-- Insert Conditions
INSERT INTO medical_conditions (id, slug, name_ar, name_en, specialty, overview_ar, symptoms_ar, diagnosis_ar, treatment_ar) VALUES
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
        'pcos',
        'متلازمة تكيس المبايض',
        'PCOS',
        'OB/GYN',
        'اضطراب هرموني شائع بين النساء في سن الإنجاب، يسبب مشاكل في الدورة الشهرية والخصوبة.',
        'عدم انتظام الدورة، نمو شعر زائد في الوجه والجسم، حب الشباب، زيادة الوزن.',
        'فحص الحوض، الموجات فوق الصوتية، تحاليل الدم للهرمونات.',
        'تغيير نمط الحياة، حبوب منع الحمل لتنظيم الدورة، أدوية الميتفورمين.'
    ),
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
        'diabetes-type-2',
        'السكري من النوع الثاني',
        'Type 2 Diabetes',
        'Endocrinology',
        'حالة مزمنة تؤثر على طريقة استقلال الجسم للسكر (الجلوكوز).',
        'العطش الشديد، التبول المتكرر، الجوع الشديد، فقدان الوزن غير المبرر، التعب.',
        'تحليل السكر التراكمي (A1C)، تحليل السكر الصائم.',
        'النظام الغذائي الصحي، وممارسة الرياضة، وربما أدوية السكري أو الأنسولين.'
    ),
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c03',
        'acne-vulgaris',
        'حب الشباب الشائع',
        'Acne Vulgaris',
        'Dermatology',
        'حالة جلدية تحدث عندما تنسد بصيلات الشعر بالزيوت وخلايا الجلد الميتة.',
        'رؤوس بيضاء، رؤوس سوداء، بثور حمراء صغيرة، عقيدات مؤلمة تحت الجلد.',
        'الفحص السريري من قبل طبيب الجلدية.',
        'الكريمات الموضعية (ريتينويد)، المضادات الحيوية، أدوية تنظيم الهرمونات.'
    ),
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c04',
        'hypothyroidism',
        'قصور الغدة الدرقية',
        'Hypothyroidism',
        'Endocrinology',
        'حالة لا تنتج فيها الغدة الدرقية ما يكفي من الهرمونات المهمة.',
        'تعب، زيادة حساسية للبرودة، إمساك، جلد جاف، زيادة وزن، انتفاخ الوجه.',
        'تحليل الدم لقياس مستوى TSH و Thyroxine.',
        'تناول هرمون الغدة الدرقية الصناعي (ليفوثيروكسين) يومياً.'
    ),
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c05',
        'migraine',
        'الصداع النصفي (الشقيقة)',
        'Migraine',
        'General Practice',
        'صداع شديد غالباً ما يكون في جانب واحد من الرأس ويأتي مع نبض.',
        'ألم شديد، حساسية للضوء والصوت، غثيان، وأحياناً اضطرابات بصرية.',
        'التاريخ الطبي والفحص العصبي.',
        'مسكنات الألم، أدوية التريبتان، أدوية وقائية، والراحة في مكان مظلم.'
    );

-- Link Conditions to Symptoms
INSERT INTO condition_symptoms (condition_id, symptom_id) VALUES
    -- PCOS
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03'), -- Irregular Periods
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04'), -- Weight Gain
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a05'), -- Acne
    
    -- Diabetes
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a06'), -- Excessive Thirst
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02'), -- Fatigue
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04'), -- Weight Gain (sometimes loss, but gain is risk factor)

    -- Acne Vulgaris
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a05'), -- Acne

    -- Hypothyroidism
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02'), -- Fatigue
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04'), -- Weight Gain
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a07'), -- Hair Loss

    -- Migraine
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c05', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01'); -- Headache
