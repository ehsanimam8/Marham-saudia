const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const basicData = require('./data/basic_data.js');
const concernsData = require('./data/concerns_data.js');
const detailsData = require('./data/details_data.js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to generate symptoms for concerns that don't have explicit ones
function generateSymptomsForConcern(concern) {
    const symptoms = [];
    const count = 3 + Math.floor(Math.random() * 3); // 3 to 5 symptoms

    // Generic symptom templates
    const templates = [
        { name_en: 'Mild pain', name_ar: 'ألم خفيف', icon: '🤕', severity: 'mild' },
        { name_en: 'Moderate discomfort', name_ar: 'انزعاج متوسط', icon: '😣', severity: 'moderate' },
        { name_en: 'Visible swelling', name_ar: 'تورم ملحوظ', icon: '🎈', severity: 'moderate' },
        { name_en: 'Severe pain', name_ar: 'ألم شديد', icon: '⚡', severity: 'severe' },
        { name_en: 'Redness', name_ar: 'احمرار', icon: '🔴', severity: 'mild' },
        { name_en: 'Itching', name_ar: 'حكة', icon: '🐜', severity: 'mild' },
        { name_en: 'Numbness', name_ar: 'تنميل', icon: '🧊', severity: 'moderate' },
        { name_en: 'Stiffness', name_ar: 'تصلب', icon: '🪵', severity: 'mild' }
    ];

    for (let i = 0; i < count; i++) {
        const template = templates[i % templates.length];
        symptoms.push({
            id: `symptom_${concern.id}_gen_${i + 1}`,
            concern_id: concern.id,
            name_en: `${template.name_en} related to ${concern.name_en}`,
            name_ar: `${template.name_ar} بسبب ${concern.name_ar}`,
            description_en: `Experiencing ${template.name_en.toLowerCase()} in the affected area`,
            description_ar: `الشعور ب${template.name_ar} في المنطقة المصابة`,
            icon: template.icon,
            severity_indicator: template.severity,
            is_red_flag: template.severity === 'severe',
            display_order: i + 1
        });
    }
    return symptoms;
}

// Helper to generate questions
function generateQuestionsForConcern(concern) {
    return [
        {
            id: `fq_${concern.id}_gen_1`,
            concern_id: concern.id,
            question_en: `How long have you had ${concern.name_en}?`,
            question_ar: `منذ متى تعانين من ${concern.name_ar}؟`,
            question_type: 'multiple_choice',
            options_json: JSON.stringify({
                options: [
                    { value: 'days', label_en: 'A few days', label_ar: 'بضعة أيام' },
                    { value: 'weeks', label_en: 'A few weeks', label_ar: 'بضعة أسابيع' },
                    { value: 'months', label_en: 'Months', label_ar: 'أشهر' }
                ]
            }),
            display_order: 1,
            affects_urgency: true,
            affects_doctor_matching: false
        },
        {
            id: `fq_${concern.id}_gen_2`,
            concern_id: concern.id,
            question_en: `Have you seen a doctor regarding ${concern.name_en} before?`,
            question_ar: `هل مراجعة طبيبة بخصوص ${concern.name_ar} من قبل؟`,
            question_type: 'yes_no',
            options_json: null,
            display_order: 2,
            affects_urgency: false,
            affects_doctor_matching: true
        }
    ];
}

async function seed() {
    console.log('🌱 Starting seed...');

    // 1. Categories
    console.log(`Inserting ${basicData.categories.length} categories...`);
    const { error: catError } = await supabase.from('onboarding_categories').upsert(basicData.categories);
    if (catError) console.error('Error inserting categories:', catError);

    // 2. Body Parts
    console.log(`Inserting ${basicData.bodyParts.length} body parts...`);
    const { error: bpError } = await supabase.from('body_parts').upsert(basicData.bodyParts);
    if (bpError) console.error('Error inserting body parts:', bpError);

    // 3. Priorities
    console.log(`Inserting ${basicData.priorities.length} priorities...`);
    const { error: prioError } = await supabase.from('priorities').upsert(basicData.priorities);
    if (prioError) console.error('Error inserting priorities:', prioError);

    // 4. Primary Concerns
    console.log(`Inserting ${concernsData.length} concerns...`);
    // Upsert in batches of 50 just in case
    for (let i = 0; i < concernsData.length; i += 50) {
        const batch = concernsData.slice(i, i + 50);
        const { error: concError } = await supabase.from('primary_concerns').upsert(batch);
        if (concError) console.error('Error inserting concerns batch:', concError);
    }

    // 5. Symptoms
    // Combine explicit symptoms + generated ones
    let allSymptoms = [...detailsData.symptoms];

    // Identify which concerns HAVE explicit symptoms
    const concernsWithSymptoms = new Set(detailsData.symptoms.map(s => s.concern_id));

    // Generate for others
    let generatedCount = 0;
    concernsData.forEach(concern => {
        if (!concernsWithSymptoms.has(concern.id)) {
            const gen = generateSymptomsForConcern(concern);
            allSymptoms = allSymptoms.concat(gen);
            generatedCount += gen.length;
        }
    });

    console.log(`Inserting ${allSymptoms.length} symptoms (${generatedCount} generated)...`);
    for (let i = 0; i < allSymptoms.length; i += 100) {
        const batch = allSymptoms.slice(i, i + 100);
        const { error: symError } = await supabase.from('symptoms').upsert(batch);
        if (symError) console.error('Error inserting symptoms batch:', symError);
    }

    // 6. Follow-up Questions
    let allQuestions = [...detailsData.questions];
    const concernsWithQuestions = new Set(detailsData.questions.map(q => q.concern_id));

    let genQCount = 0;
    concernsData.forEach(concern => {
        if (!concernsWithQuestions.has(concern.id)) {
            const gen = generateQuestionsForConcern(concern);
            allQuestions = allQuestions.concat(gen);
            genQCount += gen.length;
        }
    });

    console.log(`Inserting ${allQuestions.length} questions (${genQCount} generated)...`);
    for (let i = 0; i < allQuestions.length; i += 100) {
        const batch = allQuestions.slice(i, i + 100);
        const { error: qError } = await supabase.from('followup_questions').upsert(batch);
        if (qError) console.error('Error inserting questions batch:', qError);
    }

    // 7. Treatments
    console.log(`Inserting ${detailsData.treatments.length} treatments...`);
    const { error: tError } = await supabase.from('treatments').upsert(detailsData.treatments);
    if (tError) console.error('Error inserting treatments:', tError);

    console.log('✅ Seed completed!');
}

seed();
