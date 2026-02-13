'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${language === 'fr'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/50'
                    }`}
            >
                FR
            </button>
            <button
                onClick={() => setLanguage('ar_tn')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${language === 'ar_tn'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/50'
                    }`}
            >
                TN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
