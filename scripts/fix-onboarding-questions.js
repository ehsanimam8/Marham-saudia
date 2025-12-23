const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://znmnqvmcwjjtocbosgnr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubW5xdm1jd2pqdG9jYm9zZ25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg0NTc2MywiZXhwIjoyMDgwNDIxNzYzfQ.SSJNR6LF4DfEySQSE9AqKenYKW4TkYSwgCzZSLFnduM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixQuestions() {
    console.log('Starting question fix...');

    // 1. Get all body parts for beauty and mental health
    const { data: beautyParts } = await supabase.from('body_parts').select('id').eq('category_id', 'beauty');
    const { data: mentalParts } = await supabase.from('body_parts').select('id').eq('category_id', 'mental');

    const beautyPartIds = beautyParts.map(p => p.id);
    const mentalPartIds = mentalParts.map(p => p.id);

    // 2. Get all concerns for these parts
    const { data: beautyConcerns } = await supabase.from('primary_concerns').select('id, name_en').in('body_part_id', beautyPartIds);
    const { data: mentalConcerns } = await supabase.from('primary_concerns').select('id, name_en').in('body_part_id', mentalPartIds);

    console.log(`Found ${beautyConcerns.length} beauty concerns and ${mentalConcerns.length} mental health concerns.`);

    // 3. Update Beauty Questions
    for (const concern of beautyConcerns) {
        // Delete existing generic questions for this concern to avoid duplicates if we re-run
        await supabase.from('followup_questions').delete().eq('concern_id', concern.id);

        const questions = [
            {
                id: `fq_${concern.id}_1`,
                concern_id: concern.id,
                question_ar: `منذ متى وأنتِ تفكرين في ${getArName(concern.name_en)}؟`,
                question_en: `How long have you been considering ${concern.name_en}?`,
                question_type: 'multiple_choice',
                options: { options: ['أقل من شهر', '1-6 أشهر', 'أكثر من سنة'] },
                display_order: 1
            },
            {
                id: `fq_${concern.id}_2`,
                concern_id: concern.id,
                question_ar: 'هل سبق لكِ استشارة طبيب بخصوص هذا الأمر؟',
                question_en: 'Have you consulted a doctor about this before?',
                question_type: 'boolean',
                display_order: 2
            },
            {
                id: `fq_${concern.id}_3`,
                concern_id: concern.id,
                question_ar: 'هل خضعتِ لأي عمليات تجميلية سابقة في هذه المنطقة؟',
                question_en: 'Have you had any previous cosmetic procedures in this area?',
                question_type: 'boolean',
                display_order: 3
            }
        ];

        const { error } = await supabase.from('followup_questions').insert(questions);
        if (error) console.error(`Error for ${concern.id}:`, error);
    }

    // 4. Update Mental Health Questions
    for (const concern of mentalConcerns) {
        await supabase.from('followup_questions').delete().eq('concern_id', concern.id);

        const questions = [
            {
                id: `fq_${concern.id}_1`,
                concern_id: concern.id,
                question_ar: 'منذ متى تشعرين بهذه الأعراض؟',
                question_en: 'How long have you been feeling these symptoms?',
                question_type: 'multiple_choice',
                options: { options: ['أيام قليلة', 'عدة أسابيع', 'أشهر أو أكثر'] },
                display_order: 1
            },
            {
                id: `fq_${concern.id}_2`,
                concern_id: concern.id,
                question_ar: 'هل تمنعك هذه المشاعر من ممارسة حياتك اليومية بشكل طبيعي؟',
                question_en: 'Do these feelings prevent you from carrying out your daily life normally?',
                question_type: 'boolean',
                display_order: 2
            },
            {
                id: `fq_${concern.id}_3`,
                concern_id: concern.id,
                question_ar: 'هل سبق لكِ زيارة متخصص (طبيب نفسي أو معالج)؟',
                question_en: 'Have you visited a specialist (psychiatrist or therapist) before?',
                question_type: 'boolean',
                display_order: 3
            }
        ];

        const { error } = await supabase.from('followup_questions').insert(questions);
        if (error) console.error(`Error for ${concern.id}:`, error);
    }

    console.log('Fix completed.');
}

function getArName(enName) {
    const map = {
        'Breast Augmentation': 'تكبير الثدي',
        'Breast Lift': 'شد الثدي',
        'Breast Reduction': 'تصغير الثدي',
        'Breast Asymmetry': 'عدم تماثل الثدي',
        'Liposuction': 'شفط الدهون',
        'Tummy Tuck': 'شد البطن',
        'Rhinoplasty': 'تجميل الأنف',
        'Botox': 'البوتوكس',
        'Fillers': 'الفيلر',
        'Laser Hair Removal': 'إزالة الشعر بالليزر'
    };
    return map[enName] || enName;
}

fixQuestions();
