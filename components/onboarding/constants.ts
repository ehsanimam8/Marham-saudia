export const BODY_ZONES = {
    face: {
        id: 'face',
        nameAr: 'الوجه',
        nameEn: 'Face',
        icon: '👤',
        categories: {
            health: [
                'Acne / حب الشباب',
                'Skin Issues / مشاكل البشرة',
                'Rashes / الطفح الجلدي',
                'Facial Pain / ألم الوجه',
                'Sinus Issues / مشاكل الجيوب الأنفية',
            ],
            aesthetics: [
                'Botox / البوتوكس',
                'Fillers / الفيلر',
                'Facial Contouring / نحت الوجه',
                'Chemical Peel / التقشير الكيميائي',
                'Skin Tightening / شد البشرة',
                'Laser Treatment / العلاج بالليزر',
            ],
        },
        specialists: ['dermatologist', 'plastic_surgeon'],
    },
    nose: {
        id: 'nose',
        nameAr: 'الأنف',
        nameEn: 'Nose',
        icon: '👃',
        categories: {
            health: [
                'Breathing Issues / مشاكل التنفس',
                'Allergies / الحساسية',
                'Sinusitis / التهاب الجيوب',
            ],
            aesthetics: [
                'Rhinoplasty / تجميل الأنف',
                'Non-Surgical Nose Job / تجميل الأنف بدون جراحة',
            ],
        },
        specialists: ['ent', 'plastic_surgeon'],
    },
    hair: {
        id: 'hair',
        nameAr: 'الشعر',
        nameEn: 'Hair',
        icon: '💇‍♀️',
        categories: {
            health: [
                'Hair Loss / تساقط الشعر',
                'Dandruff / القشرة',
                'Scalp Issues / مشاكل فروة الرأس',
                'PCOS Hair Issues / مشاكل الشعر بسبب تكيس المبايض',
            ],
            aesthetics: [
                'Hair Transplant / زراعة الشعر',
                'PRP Treatment / علاج البلازما',
                'Hair Restoration / استعادة الشعر',
            ],
        },
        specialists: ['dermatologist', 'trichologist'],
    },
    neck: {
        id: 'neck',
        nameAr: 'الرقبة',
        nameEn: 'Neck',
        icon: '',
        categories: {
            health: [
                'Neck Pain / ألم الرقبة',
                'Thyroid Issues / مشاكل الغدة الدرقية',
                'Swollen Lymph Nodes / تضخم الغدد اللمفاوية',
            ],
            aesthetics: [
                'Neck Lift / شد الرقبة',
                'Double Chin Treatment / علاج الذقن المزدوج',
                'Neck Contouring / نحت الرقبة',
            ],
        },
        specialists: ['endocrinologist', 'plastic_surgeon'],
    },
    shoulders: {
        id: 'shoulders',
        nameAr: 'الأكتاف',
        nameEn: 'Shoulders',
        icon: '',
        categories: {
            health: [
                'Shoulder Pain / ألم الكتف',
                'Frozen Shoulder / الكتف المتجمد',
                'Joint Issues / مشاكل المفاصل',
            ],
            aesthetics: [
                'Shoulder Contouring / نحت الأكتاف',
            ],
        },
        specialists: ['orthopedic', 'physiotherapist'],
    },
    chest: {
        id: 'chest',
        nameAr: 'الصدر',
        nameEn: 'Chest/Breast',
        icon: '',
        categories: {
            health: [
                'Breast Pain / ألم الثدي',
                'Lumps / كتل',
                'Breast Cancer Screening / فحص سرطان الثدي',
                'Breastfeeding Issues / مشاكل الرضاعة',
                'Chest Pain / ألم الصدر',
            ],
            aesthetics: [
                'Breast Augmentation / تكبير الثدي',
                'Breast Reduction / تصغير الثدي',
                'Breast Lift / رفع الثدي',
                'Breast Reconstruction / إعادة بناء الثدي',
            ],
        },
        specialists: ['gynecologist', 'oncologist', 'plastic_surgeon'],
    },
    abdomen: {
        id: 'abdomen',
        nameAr: 'البطن',
        nameEn: 'Abdomen',
        icon: '',
        categories: {
            health: [
                'PCOS / تكيس المبايض',
                'Period Pain / آلام الدورة',
                'Bloating / الانتفاخ',
                'IBS / القولون العصبي',
                'Digestive Issues / مشاكل الهضم',
                'Endometriosis / الانتباذ البطاني الرحمي',
                'Pregnancy Concerns / مشاكل الحمل',
            ],
            aesthetics: [
                'Tummy Tuck / شد البطن',
                'Liposuction / شفط الدهون',
                'Body Contouring / نحت الجسم',
                'C-Section Scar Revision / تجميل ندبة القيصرية',
                'Mommy Makeover / تجميل ما بعد الحمل',
            ],
        },
        specialists: ['gynecologist', 'gastroenterologist', 'plastic_surgeon'],
    },
    reproductive: {
        id: 'reproductive',
        nameAr: 'الجهاز التناسلي',
        nameEn: 'Reproductive Health',
        icon: '',
        categories: {
            health: [
                'Fertility Issues / مشاكل الخصوبة',
                'PCOS / تكيس المبايض',
                'Irregular Periods / دورة غير منتظمة',
                'Painful Periods / دورة مؤلمة',
                'Vaginal Issues / مشاكل مهبلية',
                'Menopause / سن اليأس',
                'Pregnancy Planning / التخطيط للحمل',
            ],
            aesthetics: [
                'Vaginal Rejuvenation / تجديد المهبل',
                'Labiaplasty / تجميل الشفرين',
            ],
        },
        specialists: ['gynecologist', 'fertility_specialist'],
    },
    hips: {
        id: 'hips',
        nameAr: 'الوركين',
        nameEn: 'Hips',
        icon: '',
        categories: {
            health: [
                'Hip Pain / ألم الورك',
                'Joint Issues / مشاكل المفاصل',
            ],
            aesthetics: [
                'Hip Augmentation / تكبير الوركين',
                'Hip Liposuction / شفط دهون الوركين',
                'Brazilian Butt Lift / رفع المؤخرة البرازيلي',
            ],
        },
        specialists: ['orthopedic', 'plastic_surgeon'],
    },
    thighs: {
        id: 'thighs',
        nameAr: 'الفخذين',
        nameEn: 'Thighs',
        icon: '',
        categories: {
            health: [
                'Varicose Veins / الدوالي',
                'Cellulite / السيلوليت',
                'Skin Issues / مشاكل الجلد',
            ],
            aesthetics: [
                'Thigh Lift / شد الفخذين',
                'Thigh Liposuction / شفط دهون الفخذين',
                'Cellulite Treatment / علاج السيلوليت',
            ],
        },
        specialists: ['vascular_surgeon', 'plastic_surgeon'],
    },
    legs: {
        id: 'legs',
        nameAr: 'الساقين',
        nameEn: 'Legs',
        icon: '',
        categories: {
            health: [
                'Leg Pain / ألم الساق',
                'Swelling / التورم',
                'Varicose Veins / الدوالي',
                'Circulation Issues / مشاكل الدورة الدموية',
            ],
            aesthetics: [
                'Calf Implants / زرعات الساق',
                'Leg Contouring / نحت الساقين',
                'Varicose Vein Treatment / علاج الدوالي',
            ],
        },
        specialists: ['vascular_surgeon', 'plastic_surgeon'],
    },
    feet: {
        id: 'feet',
        nameAr: 'القدمين',
        nameEn: 'Feet',
        icon: '',
        categories: {
            health: [
                'Foot Pain / ألم القدم',
                'Bunions / الورم الملتهب',
                'Diabetic Foot / القدم السكري',
            ],
            aesthetics: [],
        },
        specialists: ['podiatrist', 'orthopedic'],
    },
    skin_general: {
        id: 'skin_general',
        nameAr: 'البشرة العامة',
        nameEn: 'Skin (General)',
        icon: '✨',
        categories: {
            health: [
                'Eczema / الأكزيما',
                'Psoriasis / الصدفية',
                'Dry Skin / جفاف البشرة',
                'Pigmentation / التصبغ',
                'Rashes / الطفح الجلدي',
            ],
            aesthetics: [
                'Laser Hair Removal / إزالة الشعر بالليزر',
                'Skin Whitening / تفتيح البشرة',
                'Anti-Aging Treatments / علاجات مكافحة الشيخوخة',
                'Stretch Marks / علامات التمدد',
            ],
        },
        specialists: ['dermatologist'],
    },
    weight: {
        id: 'weight',
        nameAr: 'الوزن',
        nameEn: 'Weight Management',
        icon: '⚖️',
        categories: {
            health: [
                'Weight Loss / فقدان الوزن',
                'Weight Gain / زيادة الوزن',
                'Obesity / السمنة',
                'Metabolic Issues / مشاكل الأيض',
                'Nutrition / التغذية',
            ],
            aesthetics: [
                'Bariatric Surgery / جراحة السمنة',
                'Gastric Sleeve / تكميم المعدة',
                'Gastric Bypass / تحويل مسار المعدة',
                'Body Contouring / نحت الجسم',
            ],
        },
        specialists: ['nutritionist', 'bariatric_surgeon', 'endocrinologist'],
    },
    mental_wellness: {
        id: 'mental_wellness',
        nameAr: 'الصحة النفسية',
        nameEn: 'Mental Wellness',
        icon: '🧘‍♀️',
        categories: {
            health: [
                'Anxiety / القلق',
                'Depression / الاكتئاب',
                'Stress / التوتر',
                'Sleep Issues / مشاكل النوم',
                'PTSD / اضطراب ما بعد الصدمة',
                'Postpartum Depression / اكتئاب ما بعد الولادة',
            ],
            aesthetics: [],
        },
        specialists: ['psychologist', 'psychiatrist'],
    },
};
