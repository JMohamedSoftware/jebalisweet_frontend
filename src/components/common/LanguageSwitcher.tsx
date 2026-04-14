'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  inverse?: boolean;
}

const LanguageSwitcher = ({ inverse }: LanguageSwitcherProps) => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 px-2 py-1">
            <button
                onClick={() => setLanguage('fr')}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:text-primary ${language === 'fr'
                    ? 'text-primary'
                    : inverse ? 'text-white/50' : 'text-foreground/30'
                    }`}
            >
                FR
            </button>
            <span className={`h-3 w-[1px] ${inverse ? 'bg-white/20' : 'bg-border/20'}`} />
            <button
                onClick={() => setLanguage('ar_tn')}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:text-primary ${language === 'ar_tn'
                    ? 'text-primary font-black'
                    : inverse ? 'text-white/50' : 'text-foreground/30'
                    }`}
            >
                AR
            </button>
        </div>
    );
};

export default LanguageSwitcher;
