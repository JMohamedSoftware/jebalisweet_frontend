'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const NotFound = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router?.push('/');
    };

    const handleGoBack = () => {
        if (typeof window !== 'undefined') {
            window.history?.back();
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F9F8F6] flex flex-col items-center justify-center p-6">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter404">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter404)" />
              </svg>
            </div>

            {/* Premium Botanical Watermark */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-[0.04] pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rotate-45">
                    <img src="/images/botanical_branch.png" alt="" className="w-full h-full object-contain" />
                </div>
            </div>

            <div className="relative z-10 text-center max-w-xl w-full space-y-12">
                <div className="space-y-6">
                    <div className="relative inline-block">
                        <span className="text-[15vw] lg:text-[10rem] font-heading font-black text-primary/10 select-none">404</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 translate-y-8">Page Introuvable</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-5xl font-heading font-black text-foreground">Évasion Gourmande</h1>
                    <div className="h-1 w-20 bg-primary/20 rounded-full mx-auto" />
                </div>

                <p className="text-lg text-muted-foreground font-light leading-relaxed italic max-w-md mx-auto">
                    Il semble que vous vous soyez égaré dans notre boutique. Laissez-nous vous guider vers nos douceurs artisanales.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <button
                        onClick={handleGoBack}
                        className="px-10 py-4 border border-border bg-white/50 backdrop-blur-sm text-foreground rounded-sm font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:shadow-xl active:scale-95"
                    >
                        Retourner
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="px-10 py-4 bg-[#2C1810] text-[#FFFBF9] rounded-sm font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                    >
                        Accueil
                    </button>
                </div>
            </div>

            {/* Subtle brand touch at bottom */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 select-none">
                <span className="text-[9px] font-bold uppercase tracking-[1em]">Maison Jebali</span>
            </div>
        </div>
    );
};

export default NotFound;