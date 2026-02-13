import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface PromotionalBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  backgroundAlt: string;
  discount?: string;
}

const PromotionalBanner = ({ title, description, ctaText, ctaLink, backgroundImage, backgroundAlt, discount }: PromotionalBannerProps) => {
  return (
    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-warm-lg">
      <div className="absolute inset-0">
        <AppImage
          src={backgroundImage}
          alt={backgroundAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 to-secondary/70" />
      </div>
      
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-xl">
            {discount && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full font-bold mb-4">
                <Icon name="TagIcon" size={20} />
                <span>{discount}</span>
              </div>
            )}
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-3">
              {title}
            </h2>
            
            <p className="text-lg text-primary-foreground/90 mb-6">
              {description}
            </p>
            
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-lg font-semibold transition-smooth hover:opacity-90 hover:scale-105"
            >
              {ctaText}
              <Icon name="ArrowRightIcon" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;