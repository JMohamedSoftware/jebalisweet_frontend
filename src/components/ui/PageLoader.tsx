'use client';

import React from 'react';

const PageLoader = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-1000 ease-out">
                <div className="relative group">
                    {/* Decorative Ring */}
                    <div className="absolute -inset-10 rounded-full border border-primary/10 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute -inset-6 rounded-full border border-primary/20 animate-[spin_15s_linear_reverse_infinite]" />
                    
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-primary/60 mb-4 animate-pulse">Pâtisserie Fine Tunisie</span>
                        <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tighter text-foreground text-center relative">
                            Jebali <br />
                            <span className="text-primary font-serif italic font-light lowercase tracking-normal -mt-4 block translate-x-4">Sweet</span>
                        </h1>
                        <div className="h-1 w-24 bg-primary/30 rounded-full mt-6 animate-width" />
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </div>
            </div>

            <style jsx>{`
                @keyframes width {
                    from { width: 0; opacity: 0; }
                    to { width: 6rem; opacity: 1; }
                }
                .animate-width {
                    animation: width 1.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PageLoader;
