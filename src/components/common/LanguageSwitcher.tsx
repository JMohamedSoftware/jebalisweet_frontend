'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center p-1.5 bg-secondary/30 backdrop-blur-md rounded-full border border-primary/10 shadow-inner group">
            <button
                onClick={() => setLanguage('fr')}
                className={`flex-1 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest transition-all duration-300 ${language === 'fr'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                    : 'text-muted-foreground/60 hover:text-primary hover:bg-primary/5'
                    }`}
            >
                FR
            </button>
            <button
                onClick={() => setLanguage('ar_tn')}
                className={`flex-1 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest transition-all duration-300 ${language === 'ar_tn'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                    : 'text-muted-foreground/60 hover:text-primary hover:bg-primary/5'
                    }`}
            >
                AR
            </button>
        </div>
    );
};

export default LanguageSwitcher;
