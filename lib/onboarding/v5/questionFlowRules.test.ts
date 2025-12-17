import { describe, it, expect } from 'vitest';
import { calculateUrgency } from './questionFlowRules';
import { Symptom } from './types';

describe('calculateUrgency', () => {
    it('should return not_urgent for routine concern with no red flags', () => {
        const concern = { urgency_default: 'routine' };
        const symptoms: Symptom[] = [];
        const result = calculateUrgency(concern, symptoms);
        expect(result).toBe('not_urgent');
    });

    it('should return very_urgent if suicide symptom is present', () => {
        const concern = { urgency_default: 'routine' };
        const symptoms: Symptom[] = [{ id: 'symptom_depression_suicidal', icon: null, labelAr: '', labelEn: '' }];
        const result = calculateUrgency(concern, symptoms);
        expect(result).toBe('very_urgent');
    });

    it('should escalate urgency with red flags', () => {
        const concern = { urgency_default: 'moderate' }; // base score 1
        const symptoms: Symptom[] = [
            { id: 's1', icon: null, labelAr: '', labelEn: '', is_red_flag: true },
            { id: 's2', icon: null, labelAr: '', labelEn: '', is_red_flag: true }
        ];
        // 1 + 2*2 = 5 -> very_urgent
        const result = calculateUrgency(concern, symptoms);
        expect(result).toBe('very_urgent');
    });

    it('should escalate urgency with duration', () => {
        const concern = { urgency_default: 'moderate' }; // base score 1
        const symptoms: Symptom[] = [];
        // 1 + 1 (duration) = 2 -> moderate
        const result = calculateUrgency(concern, symptoms, 'years');
        expect(result).toBe('moderate');
    });
});
