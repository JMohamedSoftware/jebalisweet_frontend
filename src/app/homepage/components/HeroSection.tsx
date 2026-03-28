import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Icon from '@/components/ui/AppIcon';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  categories: Category[];
}

const HeroSection = ({ title, subtitle, categories }: HeroSectionProps) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % (categories.length || 1));
      setIsTransitioning(false);
    }, 600);
  }, [categories.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + (categories.length || 1)) % (categories.length || 1));
      setIsTransitioning(false);
    }, 600);
  }, [categories.length, isTransitioning]);

  useEffect(() => {
    if (categories.length <= 1 || isPaused) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [categories.length, isPaused, nextSlide]);

  const currentCategory = categories[currentIndex] || {
    name: 'Pâtisserie Fine',
    description: subtitle,
    image: '/images/17189029461596829888opals_3200x1200.jpg',
    alt: 'Default Hero'
  };

  const theme = useMemo(() => {
    const name = currentCategory.name.toLowerCase();
    
    if (name.includes('chocolat')) return { bg: '#111111', text: '#D4AF37', isDark: true };
    if (name.includes('tradition')) return { bg: '#D9C3A3', text: '#2C1810', isDark: false };
    return { bg: '#F8F3EB', text: '#2C1810', isDark: false };
  }, [currentCategory.name]);

  return (
    <section 
      className="relative h-[100dvh] w-full overflow-hidden flex flex-col transition-colors duration-1000"
      style={{ backgroundColor: theme.bg }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decor Layer: "3oref" - Responsive Positioning */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className={`absolute -top-20 -right-20 w-[80%] md:w-[60%] lg:w-[45%] aspect-square opacity-[0.05] transition-all duration-1000 ${theme.isDark ? 'invert brightness-200' : ''}`}>
           <img src="/images/botanical_branch.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>
        <div className={`absolute -bottom-20 -left-20 w-[60%] md:w-[40%] lg:w-[30%] aspect-square opacity-[0.03] transition-all duration-1000 ${theme.isDark ? 'invert brightness-200' : ''}`}>
           <img src="/images/botanical_branch.png" alt="" className="w-full h-full object-contain -rotate-45" />
        </div>

        {/* Unified Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
      </div>

      {/* Main Content Area - Refined Luxury Alignment */}
      <div className="container mx-auto px-6 sm:px-12 relative z-10 flex-grow flex items-center pt-16 md:pt-20 pb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 w-full">
          
          {/* Left Side: Product Tray Image - Optimized Position */}
          <div className={`w-full lg:w-1/2 transition-all duration-1000 ease-in-out ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
            <div className="relative aspect-square w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[680px] mx-auto group">
              {/* Dynamic Accent Lighting */}
              <div className={`absolute -inset-10 rounded-full blur-[100px] transition-all duration-1000 opacity-20 ${theme.isDark ? 'bg-white/10' : 'bg-primary/20'}`} />
              
              <div className={`relative h-full w-full rounded-[40px] md:rounded-[60px] lg:rounded-[100px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border ${theme.isDark ? 'border-white/10' : 'border-white/40'}`}>
                <AppImage
                  key={currentCategory.image}
                  src={currentCategory.image}
                  alt={currentCategory.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover animate-ken-burns scale-105"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>

              {/* Floating Signature Badge */}
              <div className={`absolute bottom-6 right-6 sm:bottom-10 sm:right-10 shadow-2xl px-5 sm:px-6 py-3 sm:py-4 rounded-2xl md:rounded-3xl border flex items-center gap-3 sm:gap-4 animate-float z-20 ${theme.isDark ? 'bg-black/90 backdrop-blur-xl border-white/10 text-white' : 'bg-white/95 border-black/5 text-foreground'}`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="StarIcon" size={18} className="text-primary fill-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] leading-tight text-primary">Label d'Origine</span>
                  <span className="text-[10px] sm:text-[12px] font-semibold opacity-90">Maison Jebali</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Typography & Navigation - 'Classe' Overhaul */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-8 lg:space-y-12">
            
            <div className="space-y-4 md:space-y-6 w-full">
              <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border ${theme.isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-black/5'}`}>
                 <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] ${theme.isDark ? 'text-white/60' : 'text-foreground/70'}`}>Héritage Artisanal</span>
              </div>

              <div className={`space-y-4 transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <h1 className={`text-4xl sm:text-6xl xl:text-[84px] font-heading leading-[0.9] tracking-tighter ${theme.isDark ? 'text-white' : 'text-foreground'}`}>
                   <span className="block font-light italic font-serif text-primary/90 mb-2">Excellence</span>
                   <span className="block font-black uppercase tracking-tight">{currentCategory.name}</span>
                </h1>
                <div className="h-1 w-20 rounded-full transition-all duration-1000 mt-2 mx-auto lg:mx-0 bg-primary/40" />
              </div>

              <div className={`transition-all duration-700 delay-100 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <p className={`text-sm sm:text-lg font-medium leading-relaxed max-w-lg lg:max-w-md mx-auto lg:mx-0 tracking-wide font-serif italic ${theme.isDark ? 'text-white/80' : 'text-muted-foreground/90'}`}>
                    {currentCategory.description || subtitle}
                </p>

                <div className="pt-10 sm:pt-14 flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center">
                  <Link
                    href={`/product-catalog?category=${encodeURIComponent(currentCategory.name)}`}
                    className={`group relative overflow-hidden px-14 sm:px-16 py-4 sm:py-5 rounded-sm font-bold text-xs uppercase tracking-[0.4em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl ${theme.isDark ? 'bg-primary text-black' : 'bg-[#2C1810] text-[#FFFBF9]'}`}
                  >
                    <span className="relative z-10">Déguster</span>
                    {!theme.isDark && <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />}
                  </Link>

                  <div className="flex items-center gap-8 sm:gap-10 pt-2 lg:pt-0">
                    <button onClick={prevSlide} className={`group p-2 transition-all hover:scale-125 ${theme.isDark ? 'text-white/40 hover:text-primary' : 'text-foreground/40 hover:text-primary'}`}>
                      <Icon name="ChevronLeftIcon" size={28} />
                    </button>
                    <div className="text-[10px] font-black tracking-[0.4em] opacity-30 uppercase">
                      {currentIndex + 1} <span className="mx-1">/</span> {Math.max(1, categories.length)}
                    </div>
                    <button onClick={nextSlide} className={`group p-2 transition-all hover:scale-125 ${theme.isDark ? 'text-white/40 hover:text-primary' : 'text-foreground/40 hover:text-primary'}`}>
                      <Icon name="ChevronRightIcon" size={28} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Dots Indicators */}
            <div className="flex gap-4 pt-4 lg:pt-8 w-full justify-center lg:justify-start">
              {categories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => !isTransitioning && setCurrentIndex(idx)}
                  className={`transition-all duration-700 ${idx === currentIndex ? 'w-12 h-1.5 bg-primary' : `w-3 h-1.5 rounded-full ${theme.isDark ? 'bg-white/10 hover:bg-white/30' : 'bg-black/10 hover:bg-black/20'}`}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;