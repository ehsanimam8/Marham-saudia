import {
    Calendar, Baby, Scale, Pill, Sparkles, AlertCircle,
    Droplet, Clock, Sun, Smile, User, TrendingUp, Wind, Heart, Activity
} from 'lucide-react';
import { BodyPart, Concern, Symptom } from './types';

// Symptoms
const pcosSymptoms: Symptom[] = [
    {
        id: 'excess_hair',
        icon: <User className="w-6 h-6" />,
        labelAr: 'نمو شعر زائد',
        labelEn: 'Excess Hair Growth'
    },
    {
        id: 'weight_gain',
        icon: <TrendingUp className="w-6 h-6" />,
        labelAr: 'زيادة الوزن',
        labelEn: 'Weight Gain'
    },
    {
        id: 'acne',
        icon: <Droplet className="w-6 h-6" />,
        labelAr: 'حب الشباب',
        labelEn: 'Acne or Oily Skin'
    },
    {
        id: 'hair_thinning',
        icon: <Wind className="w-6 h-6" />,
        labelAr: 'تساقط الشعر',
        labelEn: 'Hair Thinning'
    },
    {
        id: 'difficulty_conceiving',
        icon: <Heart className="w-6 h-6" />,
        labelAr: 'صعوبة الحمل',
        labelEn: 'Difficulty Getting Pregnant'
    },
    {
        id: 'heavy_periods',
        icon: <Activity className="w-6 h-6" />,
        labelAr: 'دورة شهرية ثقيلة',
        labelEn: 'Heavy Periods'
    }
];

// Placeholder for other symptom lists
const generalSymptoms: Symptom[] = [
    { id: 'pain', icon: <AlertCircle className="w-6 h-6" />, labelAr: 'ألم', labelEn: 'Pain' },
    { id: 'discomfort', icon: <AlertCircle className="w-6 h-6" />, labelAr: 'عدم ارتياح', labelEn: 'Discomfort' }
];


// Concerns
const abdomenConcerns: Concern[] = [
    {
        id: 'irregular_periods',
        icon: <Calendar className="w-8 h-8" />,
        titleAr: 'عدم انتظام الدورة الشهرية',
        titleEn: 'Irregular Periods',
        category: 'health',
        symptoms: pcosSymptoms
    },
    {
        id: 'pregnancy_related',
        icon: <Baby className="w-8 h-8" />,
        titleAr: 'متعلق بالحمل',
        titleEn: 'Pregnancy Related',
        category: 'health',
        symptoms: generalSymptoms
    },
    {
        id: 'weight_management',
        icon: <Scale className="w-8 h-8" />,
        titleAr: 'إدارة الوزن',
        titleEn: 'Weight Management',
        category: 'health',
        symptoms: pcosSymptoms // Reusing for example
    },
    {
        id: 'digestive_issues',
        icon: <Pill className="w-8 h-8" />,
        titleAr: 'مشاكل هضمية',
        titleEn: 'Digestive Issues',
        category: 'health',
        symptoms: generalSymptoms
    },
    {
        id: 'aesthetic_enhancement',
        icon: <Sparkles className="w-8 h-8" />,
        titleAr: 'تحسين جمالي',
        titleEn: 'Aesthetic Enhancement',
        category: 'aesthetic',
        symptoms: []
    },
    {
        id: 'pain',
        icon: <AlertCircle className="w-8 h-8" />,
        titleAr: 'ألم أو إزعاج',
        titleEn: 'Pain or Discomfort',
        category: 'health',
        symptoms: generalSymptoms
    }
];

const faceConcerns: Concern[] = [
    {
        id: 'acne',
        icon: <Droplet className="w-8 h-8" />,
        titleAr: 'حب الشباب',
        titleEn: 'Acne',
        category: 'health',
        symptoms: []
    },
    {
        id: 'aging',
        icon: <Clock className="w-8 h-8" />,
        titleAr: 'شيخوخة الجلد',
        titleEn: 'Skin Aging',
        category: 'aesthetic',
        symptoms: []
    },
    {
        id: 'pigmentation',
        icon: <Sun className="w-8 h-8" />,
        titleAr: 'التصبغات',
        titleEn: 'Pigmentation',
        category: 'health',
        symptoms: []
    },
    {
        id: 'facial_features',
        icon: <Smile className="w-8 h-8" />,
        titleAr: 'ملامح الوجه',
        titleEn: 'Facial Features',
        category: 'aesthetic',
        symptoms: []
    }
];

const mentalConcerns: Concern[] = [
    {
        id: 'anxiety',
        icon: <User className="w-8 h-8" />,
        titleAr: 'قلق وتوتر',
        titleEn: 'Anxiety & Stress',
        category: 'health',
        symptoms: []
    },
    {
        id: 'depression',
        icon: <Heart className="w-8 h-8" />,
        titleAr: 'اكتئاب',
        titleEn: 'Depression',
        category: 'health',
        symptoms: []
    },
    {
        id: 'family_therapy',
        icon: <User className="w-8 h-8" />,
        titleAr: 'استشارات أسرية',
        titleEn: 'Family Therapy',
        category: 'health',
        symptoms: []
    }
];

const chestConcerns: Concern[] = [
    {
        id: 'chest_pain',
        icon: <AlertCircle className="w-8 h-8" />,
        titleAr: 'ألم في الصدر',
        titleEn: 'Chest Pain',
        category: 'health',
        symptoms: generalSymptoms
    },
    {
        id: 'breathing_issues',
        icon: <Wind className="w-8 h-8" />,
        titleAr: 'صعوبة في التنفس',
        titleEn: 'Breathing Difficulty',
        category: 'health',
        symptoms: generalSymptoms
    },
    {
        id: 'breast_lump',
        icon: <User className="w-8 h-8" />,
        titleAr: 'كتلة في الثدي',
        titleEn: 'Breast Lump/Pain',
        category: 'health',
        symptoms: generalSymptoms
    },
    {
        id: 'augmentation',
        icon: <Sparkles className="w-8 h-8" />,
        titleAr: 'تجميل',
        titleEn: 'Aesthetic / Augmentation',
        category: 'aesthetic',
        symptoms: []
    }
];

const hairConcerns: Concern[] = [
    {
        id: 'hair_loss',
        icon: <Wind className="w-8 h-8" />,
        titleAr: 'تساقط الشعر',
        titleEn: 'Hair Loss',
        category: 'health',
        symptoms: []
    },
    {
        id: 'dandruff',
        icon: <AlertCircle className="w-8 h-8" />,
        titleAr: 'قشرة الرأس',
        titleEn: 'Dandruff / Scalp Issues',
        category: 'health',
        symptoms: []
    },
    {
        id: 'transplant',
        icon: <Sparkles className="w-8 h-8" />,
        titleAr: 'زراعة الشعر',
        titleEn: 'Hair Transplant',
        category: 'aesthetic',
        symptoms: []
    }
];

const neckConcerns: Concern[] = [
    {
        id: 'neck_pain',
        icon: <AlertCircle className="w-8 h-8" />,
        titleAr: 'ألم الرقبة',
        titleEn: 'Neck Pain',
        category: 'health',
        symptoms: generalSymptoms
    },
    {
        id: 'thyroid',
        icon: <Activity className="w-8 h-8" />,
        titleAr: 'الغدة الدرقية',
        titleEn: 'Thyroid Issues',
        category: 'health',
        symptoms: generalSymptoms
    }
];

const reproductiveConcerns: Concern[] = [
    {
        id: 'fertility',
        icon: <Baby className="w-8 h-8" />,
        titleAr: 'الخصوبة',
        titleEn: 'Fertility',
        category: 'health',
        symptoms: []
    },
    {
        id: 'infection',
        icon: <AlertCircle className="w-8 h-8" />,
        titleAr: 'عدوى',
        titleEn: 'Infection / STD',
        category: 'health',
        symptoms: []
    },
    {
        id: 'cycle_issues',
        icon: <Calendar className="w-8 h-8" />,
        titleAr: 'اضطرابات الدورة',
        titleEn: 'Menstrual Cycle Issues',
        category: 'health',
        symptoms: pcosSymptoms
    }
];

// Body Parts
export const bodyParts: BodyPart[] = [
    {
        id: 'face',
        nameAr: 'الوجه',
        nameEn: 'Face',
        svgPath: 'M...',
        concerns: faceConcerns,
        requiresAgeCheck: false,
        estimatedQuestions: 5,
        categories: ['beauty', 'medical']
    },
    {
        id: 'hair',
        nameAr: 'الشعر',
        nameEn: 'Hair',
        svgPath: 'M...',
        concerns: hairConcerns,
        requiresAgeCheck: false,
        estimatedQuestions: 5,
        categories: ['beauty', 'medical']
    },
    {
        id: 'neck',
        nameAr: 'الرقبة',
        nameEn: 'Neck',
        svgPath: 'M...',
        concerns: neckConcerns,
        requiresAgeCheck: false,
        estimatedQuestions: 5,
        categories: ['medical']
    },
    {
        id: 'chest',
        nameAr: 'الصدر',
        nameEn: 'Chest/Breast',
        svgPath: 'M...',
        concerns: chestConcerns,
        requiresAgeCheck: true,
        estimatedQuestions: 6,
        categories: ['medical', 'beauty']
    },
    {
        id: 'abdomen',
        nameAr: 'البطن',
        nameEn: 'Abdomen',
        svgPath: 'M...',
        concerns: abdomenConcerns,
        requiresAgeCheck: true,
        estimatedQuestions: 7,
        categories: ['medical']
    },
    {
        id: 'reproductive',
        nameAr: 'الجهاز التناسلي',
        nameEn: 'Reproductive',
        svgPath: 'M...',
        concerns: reproductiveConcerns,
        requiresAgeCheck: true,
        estimatedQuestions: 8,
        categories: ['medical']
    },
    {
        id: 'mind',
        nameAr: 'الصحة النفسية',
        nameEn: 'Mental Health',
        svgPath: 'M...',
        concerns: mentalConcerns,
        requiresAgeCheck: false,
        estimatedQuestions: 5,
        categories: ['mental']
    }
    // ... other body parts
];

export const getBodyPart = (id: string) => bodyParts.find(p => p.id === id);

export const symptomsByCondition: Record<string, Symptom[]> = {};
// Map concerns to symptoms helper
abdomenConcerns.forEach(c => {
    symptomsByCondition[c.id] = c.symptoms;
});
// Add others...
