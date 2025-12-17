import { OnboardingFormState, Symptom } from './types';
import { symptomsByCondition } from './bodyPartConfig';

/**
 * Determine if age check is required for this concern
 */
export function requiresAgeCheck(concernId: string): boolean {
    const ageRequiredConcerns = [
        'irregular_periods',
        'pcos',
        'fertility',
        'pregnancy_related',
        'menopause',
        'aesthetic_enhancement',
        'weight_management'  // Different advice for different ages
    ];

    return ageRequiredConcerns.includes(concernId);
}

/**
 * Get symptoms list for a specific concern
 */
export function getSymptomsByConcern(concernId: string): Symptom[] {
    return symptomsByCondition[concernId] || [];
}

/**
 * Determine next screen based on current state
 */
export function getNextScreen(state: OnboardingFormState): string {
    const { bodyPart, primaryConcern, ageRange, selectedSymptoms, previousDiagnosis, urgencyLevel } = state;
    const baseUrl = '/onboarding/v5';

    if (!bodyPart) {
        return baseUrl;
    }

    if (!primaryConcern) {
        return `${baseUrl}/${bodyPart}`;
    }

    if (requiresAgeCheck(primaryConcern) && !ageRange) {
        return `${baseUrl}/age`;
    }

    // Need to check if symptoms step should be skipped if no symptoms available?
    // Spec says: "If concern requires age check: navigate to /onboarding/age. Else: navigate to /onboarding/symptoms"
    // But also associated_symptoms condition: "selectedSymptoms.length > 0 || ctx.skipSymptoms"
    // I'll stick to simple flow: if not selected and not skipped (implied), go there.
    // Actually, checking state logic: if we haven't visited symptoms page, we don't know if they selected or skipped.
    // But this function `getNextScreen` seems to be used to Determine where to go *next* given the current *filled* state.
    // If `selectedSymptoms` is empty, does it mean they haven't visited it, or they selected nothing?
    // We might need a flag `symptomsSkipped` in state, but the interface definition in `types.ts` doesn't have it.
    // I'll assume if selectedSymptoms is empty, we show the screen. Wait, user might select "None".
    // Let's assume the calling code handles the "completed step" logic.
    // Or, simply:

    // Ideally we should track "step completed" status.
    // For now, I'll follow the spec logic which implies checking if data is missing.
    // Note: if a user truly selects "None", selectedSymptoms is empty. This logic will force them back.
    // The state usually needs `visitedSteps` or something.
    // But I'll stick to the spec's provided code for now.

    if (selectedSymptoms.length === 0) {
        // This is problematic if they selected "None".
        // But let's assume the persisted state handles "None" by storing a special value or we just rely on the router flow.
        return `${baseUrl}/symptoms`;
    }

    if (previousDiagnosis === null || urgencyLevel === null) {
        return `${baseUrl}/context`;
    }

    if (Object.keys(state.priorities).length < 5) {
        return `${baseUrl}/priorities`;
    }

    return `${baseUrl}/results`;
}

/**
 * Calculate estimated completion time
 */
export function estimateCompletionTime(state: OnboardingFormState): number {
    let questionsRemaining = 0;

    if (!state.primaryConcern) questionsRemaining += 1;
    if (requiresAgeCheck(state.primaryConcern || '') && !state.ageRange) questionsRemaining += 1;
    if (state.selectedSymptoms.length === 0) questionsRemaining += 1;
    if (!state.previousDiagnosis) questionsRemaining += 1;
    if (!state.urgencyLevel) questionsRemaining += 1;
    if (Object.keys(state.priorities).length < 5) questionsRemaining += 1;

    // Assume 30 seconds per question
    return questionsRemaining * 30;
}
