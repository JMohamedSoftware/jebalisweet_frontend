'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import fr from '../locales/fr.json';
import ar_tn from '../locales/ar_tn.json';

type Language = 'fr' | 'ar_tn';

interface LanguageContextType {
    language: Language;
    direction: 'ltr' | 'rtl';
    setLanguage: (lang: Language) => void;
    t: (key: string, data?: Record<string, any>) => string;
}

const translations = {
    fr,
    ar_tn,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('fr');
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'ar_tn')) {
            setLanguageState(savedLanguage);
            setDirection(savedLanguage === 'ar_tn' ? 'rtl' : 'ltr');
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setDirection(lang === 'ar_tn' ? 'rtl' : 'ltr');
        localStorage.setItem('language', lang);
    };

    const t = (key: string, data?: Record<string, any>): string => {
        const keys = key.split('.');
        let result: any = translations[language];

        for (const k of keys) {
            if (result && result[k]) {
                result = result[k];
            } else {
                return key;
            }
        }

        let translated = result as string;
        if (data) {
            Object.keys(data).forEach((placeholder) => {
                translated = translated.replace(new RegExp(`{${placeholder}}`, 'g'), data[placeholder]);
            });
        }

        return translated;
    };

    return (
        <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
            <div dir={direction}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
