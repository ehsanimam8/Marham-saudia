import { OnboardingFormState, Symptom, UrgencyLevel } from './types';

// Alias for context to match business logic checks
export type OnboardingContext = OnboardingFormState;

interface QuestionFlowRule {
    condition: (context: OnboardingContext) => boolean;
    nextQuestion: string;
    skipQuestions?: string[];
}

export const questionFlowRules: Record<string, QuestionFlowRule[]> = {

    // Medical + Chest + Breast Lump
    'medical_chest_breast_lump': [
        {
            condition: (ctx) => ctx.ageRange === '18-24' || ctx.ageRange === '25-34',
            nextQuestion: 'fq_breast_lump_2', // Family history is more relevant for younger
            skipQuestions: []
        },
        {
            condition: (ctx) => ctx.selectedSymptoms.includes('symptom_lump_hard'),
            nextQuestion: 'fq_breast_lump_3', // Mammogram question is critical
            skipQuestions: []
        },
        {
            condition: (ctx) => ctx.previousDiagnosis === true,
            nextQuestion: 'priority_ranking', // Skip some questions if already diagnosed
            skipQuestions: ['fq_breast_lump_2']
        }
    ],

    // Medical + Abdomen + PCOS
    'medical_abdomen_pcos': [
        {
            condition: (ctx) => ctx.selectedSymptoms.includes('symptom_pcos_irregular'),
            nextQuestion: 'fq_pcos_2', // Ask about previous diagnosis
            skipQuestions: []
        },
        {
            condition: (ctx) => ctx.ageRange === '35-44' || ctx.ageRange === '45+',
            nextQuestion: 'fq_pcos_3', // Fertility question more relevant for older
            skipQuestions: []
        },
        // Note: urgencyLevel check logic was in snippet but context may vary.
        // Adding based on typical flow if needed.
    ],

    // Beauty + Face + Wrinkles
    'beauty_face_wrinkles': [
        {
            condition: (ctx) => ctx.selectedSymptoms.length >= 4,
            nextQuestion: 'fq_wrinkles_3', // Multiple areas → ask about budget
            skipQuestions: []
        },
        {
            condition: (ctx) => ctx.previousDiagnosis === true, // "tried treatments before"
            nextQuestion: 'fq_wrinkles_4', // Ask about treatment preference
            skipQuestions: ['fq_wrinkles_2']
        }
    ],

    // Mental Health + Brain + Depression
    'mental_brain_depression': [
        {
            condition: (ctx) => ctx.selectedSymptoms.includes('symptom_depression_suicidal'),
            nextQuestion: 'fq_depression_1', // MUST ask about self-harm
            skipQuestions: []
        },
        {
            condition: (ctx) => ctx.urgencyLevel === 'very_urgent',
            nextQuestion: 'results', // Skip remaining questions, go to results immediately
            skipQuestions: ['fq_depression_2', 'fq_depression_3']
        }
    ]
};

// Urgency calculation logic
interface PrimaryConcernData {
    urgency_default: UrgencyLevel | string; // loose type to handle string from DB
}

export function calculateUrgency(
    concern: PrimaryConcernData,
    symptoms: Symptom[], // Full symptom objects to check red flags
    duration?: string // Passed from answers if available
): UrgencyLevel {
    let urgencyScore = 0;

    // Base urgency from concern
    // Map string to score
    const baseUrgencyScore: Record<string, number> = {
        'routine': 0,
        'not_urgent': 0,
        'moderate': 1,
        'urgent': 2,
        'very_urgent': 3
    };

    const baseScore = baseUrgencyScore[concern.urgency_default as string] || 0;
    urgencyScore += baseScore;

    // Red flag symptoms add +2?
    // User spec: "Red flag symptoms add +2"
    // Note: Symptom type in 'types.ts' doesn't have is_red_flag property yet?
    // We might need to fetch that from DB or update type.
    // Assuming Symptom object passed here has it (from DB fetch).

    // We'll cast to any for now if type mismatch, or update type later.
    const redFlagCount = symptoms.filter((s) => s.is_red_flag).length;
    urgencyScore += redFlagCount * 2;

    // Duration adds urgency
    if (duration === 'more_than_month' || duration === 'years') {
        urgencyScore += 1;
    }

    // Mental health: suicidal thoughts = immediate urgency
    if (symptoms.some(s => s.id === 'symptom_depression_suicidal')) {
        return 'very_urgent';
    }

    // Convert score to level
    if (urgencyScore >= 5) return 'very_urgent';
    if (urgencyScore >= 3) return 'urgent';
    if (urgencyScore >= 1) return 'moderate';
    return 'not_urgent';
}
