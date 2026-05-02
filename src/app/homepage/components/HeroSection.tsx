'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  targetCategory: string;
}

interface HeroSectionProps {
  heroes: HeroSlide[];
}

const SLIDE_DURATION = 5000;

const HeroSection = ({ heroes }: HeroSectionProps) => {
  const { direction } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const slides = heroes && heroes.length > 0 ? heroes : [{
    title: 'Excellence Orientale',
    subtitle: "L'art de la pâtisserie tunisienne, sublimée par la Maison Jebali.",
    image: '/images/17189029461596829888opals_3200x1200.jpg',
    ctaText: 'Déguster',
    targetCategory: ''
  }];

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 500);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  const slide = slides[current];

  return (
    <section className="relative h-[80dvh] md:h-[100dvh] w-full overflow-hidden bg-black">

      {/* ── FULL BLEED IMAGE ── */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        <AppImage
          src={slide.image || '/images/17189029461596829888opals_3200x1200.jpg'}
          alt={slide.title}
          fill
          priority
          className="object-cover animate-ken-burns"
          style={{ filter: 'brightness(0.75)' }}
        />
      </div>

      {/* ── GRADIENT TOP: for header visibility ── */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 25%, transparent 45%, transparent 50%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.82) 100%)'
        }}
      />

      {/* ── CONTENT: centered at the bottom ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center text-center pb-16 sm:pb-24 px-6"
        dir={direction}
      >

        {/* Brand tag */}
        <div className={`flex items-center gap-4 mb-6 transition-all duration-500 ${fading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="w-8 h-[1px] bg-primary/70" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.55em] text-primary">
            Maison Jebali · Tunis
          </span>
          <div className="w-8 h-[1px] bg-primary/70" />
        </div>

        {/* Main Title */}
        <div className={`transition-all duration-500 ${fading ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
          <h1 className="font-heading font-light uppercase tracking-[0.05em] sm:tracking-[0.08em] text-white leading-[1.05] drop-shadow-2xl
                         text-3xl sm:text-6xl md:text-7xl lg:text-8xl break-words px-2">
            {slide.title}
          </h1>
        </div>

        {/* Gold rule */}
        <div className="my-6 w-14 h-[1px] bg-primary/80" />

        {/* Subtitle */}
        <p className={`font-serif italic text-white/75 max-w-lg leading-relaxed transition-all duration-700 delay-100
                       text-sm sm:text-base lg:text-lg
                       ${fading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {slide.subtitle}
        </p>

        {/* CTA */}
        <div className={`mt-10 transition-all duration-700 delay-150 ${fading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <Link
            href={`/product-catalog?category=${encodeURIComponent(slide.targetCategory || '')}`}
            className="group inline-flex items-center gap-5 px-8 py-3 sm:px-10 sm:py-4 border border-primary/60
                       text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em]
                       hover:bg-primary hover:border-primary hover:text-black
                       transition-all duration-500"
          >
            {slide.ctaText || 'Déguster'}
            <span className="w-4 h-[1px] bg-current group-hover:w-8 transition-all duration-500 inline-block" />
          </Link>
        </div>

        {/* Slide dots — only if multiple */}
        {slides.length > 1 && (
          <div className="flex items-center gap-3 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-500 rounded-full ${
                  i === current
                    ? 'w-7 h-[3px] bg-primary'
                    : 'w-[5px] h-[5px] bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── PROGRESS BAR ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
          <div
            key={`p-${current}`}
            className="h-full bg-primary"
            style={{
              animation: `slideProgressAnim ${SLIDE_DURATION}ms linear forwards`,
              transformOrigin: 'left',
            }}
          />
        </div>
      )}

    </section>
  );
};

export default HeroSection;