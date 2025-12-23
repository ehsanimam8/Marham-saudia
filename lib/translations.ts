export const SPECIALTY_MAP: Record<string, string> = {
    'Fertility': 'الخصوبة وعلاج العقم',
    'OB/GYN': 'أمراض النساء والولادة',
    'Mental Health': 'الصحة النفسية',
    'Maternal-Fetal Medicine': 'طب الأمومة والجنين',
    'Endocrinology': 'الغدد الصماء',
    'Dermatology': 'الجلدية',
    'Pediatrics': 'طب الأطفال',
    'Nutrition': 'التغذية العلاجية',
    'General Practice': 'طب عام'
};

export const HOSPITAL_MAP: Record<string, string> = {
    'King Faisal Specialist Hospital': 'مستشفى الملك فيصل التخصصي',
    'Dr. Sulaiman Al Habib': 'د. سليمان الحبيب',
    'Dallah Hospital': 'مستشفى دلة',
    'Mouwasat Hospital': 'مستشفى المواساة',
    'Saudi German Hospital': 'المستشفى السعودي الألماني',
    'Kingdom Hospital': 'مستشفى المملكة'
};

export function translateSpecialty(specialty: string): string {
    return SPECIALTY_MAP[specialty] || specialty;
}

export function translateHospital(hospital: string): string {
    // If it contains a known name, translate it
    for (const [en, ar] of Object.entries(HOSPITAL_MAP)) {
        if (hospital.toLowerCase().includes(en.toLowerCase())) {
            return ar;
        }
    }
    return hospital;
}
