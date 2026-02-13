import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  backgroundAlt: string;
}

const HeroSection = ({ title, subtitle, ctaText, ctaLink, backgroundImage, backgroundAlt }: HeroSectionProps) => {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl shadow-warm-lg">
      <div className="absolute inset-0">
        <AppImage
          src={backgroundImage}
          alt={backgroundAlt}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl reveal">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-6">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              {subtitle}
            </p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold text-lg transition-spring hover:opacity-90 hover:scale-110 shadow-warm-md"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;