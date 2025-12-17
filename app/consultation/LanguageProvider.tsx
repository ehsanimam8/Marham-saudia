'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { translations, Language } from './locales';

const LanguageContext = createContext<{
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['ar'];
    dir: 'rtl' | 'ltr';
} | null>(null);

export function ConsultationLanguageProvider({ children }: { children: React.ReactNode }) {
    // Default to Arabic
    const [language, setLanguage] = useState<Language>('ar');

    const value = {
        language,
        setLanguage,
        t: translations[language],
        dir: language === 'ar' ? 'rtl' : 'ltr' as 'rtl' | 'ltr'
    };

    return (
        <LanguageContext.Provider value={value}>
            <div dir={value.dir} className={language === 'ar' ? 'font-sans' : ''}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useConsultationLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useConsultationLanguage must be used within a ConsultationLanguageProvider');
    }
    return context;
}
