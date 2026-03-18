import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  backgroundAlt: string;
}

const HeroSection = ({ title, subtitle, ctaText, ctaLink, backgroundImage, backgroundAlt }: HeroSectionProps) => {
  const { t } = useLanguage();

  return (
    <section className="relative h-[450px] md:h-[500px] overflow-hidden rounded-2xl shadow-warm-xl group">
      {/* Background Image - Restored to original with premium handling */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[10s] ease-out scale-105 group-hover:scale-100"
        />
        {/* Suppression de l'ombre noire temporelle pour laisser l'image très lumineuse et appétissante */}
        <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-background/40 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-3xl space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left duration-1000">

            {/* Minimalist Branding: Logo + Chef Name (More Chic & Refined) */}
            <div className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 shadow-lg hover:bg-black/30 transition-all duration-500">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-accent/40 bg-white/5 flex-shrink-0 flex items-center justify-center shadow-inner">
                <AppImage
                  src="/favicon-32x32.png"
                  alt="Jebali Sweet Logo"
                  width={22}
                  height={22}
                  className="object-contain opacity-90"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/60 font-medium tracking-[0.3em] uppercase leading-none mb-1">
                  {t('home.hero.badge')}
                </span>
                <span className="text-white text-md font-heading italic tracking-wide leading-none drop-shadow-md">
                  Chef Aida Jebali
                </span>
              </div>
            </div>

            {/* Premium Typography - Playfair Display used via font-heading */}
            <h1 className="text-fluid-h1 font-heading font-bold text-white leading-tight drop-shadow-lg mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {title}
            </h1>

            {/* Sophisticated Description */}
            <p className="text-fluid-body font-sans text-white/85 max-w-2xl leading-relaxed font-light drop-shadow-sm tracking-wide mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              {subtitle}
            </p>

            {/* High-Level CTA */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <Link
                href={ctaLink}
                className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 bg-primary text-primary-foreground rounded-full font-semibold text-base sm:text-lg tracking-wide overflow-hidden transition-all duration-300 hover:bg-primary/95 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 min-h-[50px] sm:min-h-[56px]"
              >
                {/* Shine effect on button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />

                <span className="relative z-10">{ctaText}</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;